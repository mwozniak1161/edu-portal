'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { DataTable, type Column } from '@/components/data/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { WeightedGradeCell } from '@/components/grades/weighted-grade-cell'
import { GradeAverage } from '@/components/grades/grade-average'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/store/auth.store'
import { useTeacherClasses } from '@/lib/api/teacher-classes'
import { useGrades } from '@/lib/api/grades'
import type { Grade } from '@/lib/api/types'

export default function GradebookPage() {
  const user = useAuthStore((s) => s.user)
  const classId = user?.classId ?? undefined
  const studentId = user?.id ?? ''

  const [teacherClassId, setTeacherClassId] = useState<string>('')

  const { data: teacherClasses = [], isLoading: tcLoading } = useTeacherClasses(classId)

  const { data: grades = [], isLoading: gradesLoading } = useGrades(
    teacherClassId || undefined,
    studentId,
  )

  const columns: Column<Grade>[] = [
    {
      header: 'Grade',
      cell: (g) => (
        <span className={g.isExcluded ? 'opacity-40 line-through' : ''}>
          <WeightedGradeCell value={g.value} weight={g.weight} comment={g.comment ?? undefined} />
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (g) =>
        g.isExcluded ? (
          <Badge variant="outline" className="text-xs text-muted-foreground">Replaced</Badge>
        ) : g.correctionForId ? (
          <Badge variant="secondary" className="text-xs">Correction</Badge>
        ) : null,
    },
    {
      header: 'Comment',
      cell: (g) =>
        g.comment ? (
          <span className="text-sm text-muted-foreground">{g.comment}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
  ]

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
      <PageHeader title="Gradebook" description="Your grades and weighted averages per subject." />

      <div className="mb-6 w-72">
        {tcLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={teacherClassId} onValueChange={(v) => setTeacherClassId(v ?? '')}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
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
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Weighted average:</span>
            <GradeAverage teacherClassId={teacherClassId} studentId={studentId} />
          </div>
          <DataTable<Grade>
            columns={columns}
            data={grades}
            isLoading={gradesLoading}
            keyExtractor={(g) => g.id}
            emptyTitle="No grades yet"
            emptyDescription="Your teacher hasn't added any grades for this subject."
          />
        </>
      )}
    </div>
  )
}
