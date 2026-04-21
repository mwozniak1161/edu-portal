'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { PageHeader } from '@/components/layout/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/store/auth.store'
import { useTeacherClasses } from '@/lib/api/teacher-classes'
import { useGrades } from '@/lib/api/grades'
import type { Grade } from '@/lib/api/types'
import { cn } from '@/lib/utils'

function gradeChipClass(value: number): string {
  if (value >= 5) return 'bg-edu-primary text-edu-on-primary'
  if (value >= 4) return 'bg-blue-500 text-white'
  if (value >= 3) return 'bg-amber-500 text-white'
  return 'bg-red-500 text-white'
}

function computeWeightedAvg(grades: Grade[]): number | null {
  const active = grades.filter((g) => !g.isExcluded)
  if (active.length === 0) return null
  const totalWeight = active.reduce((sum, g) => sum + g.weight, 0)
  if (totalWeight === 0) return null
  return active.reduce((sum, g) => sum + g.value * g.weight, 0) / totalWeight
}

export default function GradebookPage() {
  const user = useAuthStore((s) => s.user)
  const classId = user?.classId ?? undefined
  const studentId = user?.id ?? ''

  const [teacherClassId, setTeacherClassId] = useState<string>('')

  const { data: teacherClasses = [], isLoading: tcLoading } = useTeacherClasses(classId)
  const selectedTc = teacherClasses.find((tc) => tc.id === teacherClassId)
  const { data: grades = [], isLoading: gradesLoading } = useGrades(teacherClassId || undefined, studentId)

  const avg = useMemo(() => computeWeightedAvg(grades), [grades])

  if (!classId) {
    return (
      <div>
        <PageHeader title="Gradebook" description="Your grades and weighted averages." />
        <p className="text-muted-foreground text-sm">You are not assigned to a class yet.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <PageHeader title="Gradebook" description="Your grades and weighted averages per subject." />
        {teacherClassId && !gradesLoading && avg !== null && (
          <div className="text-right shrink-0 ml-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-edu-on-surface-variant">Weighted Average</p>
            <p className="text-3xl font-bold font-data text-edu-primary mt-0.5">{avg.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div className="mb-6 w-72">
        {tcLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={teacherClassId} onValueChange={(v) => setTeacherClassId(v ?? '')}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject">
                {selectedTc ? selectedTc.subject.name : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {teacherClasses.map((tc) => (
                <SelectItem key={tc.id} value={tc.id}>
                  {tc.subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!teacherClassId && (
        <p className="text-muted-foreground text-sm">Select a subject to view your grades.</p>
      )}

      {teacherClassId && (
        <>
          <p className="text-base font-semibold mb-1">Assessment Log</p>
          <p className="text-sm text-muted-foreground mb-4">Detailed breakdown of your graded assignments.</p>

          {gradesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-md" />)}
            </div>
          ) : grades.length === 0 ? (
            <p className="text-muted-foreground text-sm">No grades yet for this subject.</p>
          ) : (
            <div className="rounded-md border divide-y">
              <div className="grid grid-cols-[140px_80px_1fr] gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-edu-on-surface-variant bg-edu-surface-container/50">
                <span>Date</span>
                <span>Grade (weight)</span>
                <span>Comment</span>
              </div>

              {grades.map((g) => (
                <div key={g.id} className={cn('grid grid-cols-[140px_80px_1fr] gap-4 px-4 py-3 items-center', g.isExcluded && 'opacity-50')}>
                  <span className="text-sm font-data text-muted-foreground">
                    {format(new Date(g.createdAt), 'dd MMM yyyy')}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded text-lg font-bold font-data', gradeChipClass(g.value))}>
                      {g.value}
                    </span>
                    <span className="text-xs text-muted-foreground font-data">×{g.weight}</span>
                  </div>

                  <div className="min-w-0">
                    {g.correctionForId && (
                      <Badge variant="secondary" className="text-xs mb-1">Correction</Badge>
                    )}
                    {g.isExcluded && (
                      <Badge variant="outline" className="text-xs mb-1">Replaced</Badge>
                    )}
                    {g.comment ? (
                      <p className="text-sm text-edu-on-surface">{g.comment}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
