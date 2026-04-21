'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { PageHeader } from '@/components/layout/page-header'
import { DataTable, type Column } from '@/components/data/data-table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/store/auth.store'
import { useTeacherClasses } from '@/lib/api/teacher-classes'
import { useLessonInstances } from '@/lib/api/lesson-instances'
import type { LessonInstance } from '@/lib/api/types'

export default function StudentLessonInstancesPage() {
  const user = useAuthStore((s) => s.user)
  const classId = user?.classId ?? undefined

  const [teacherClassId, setTeacherClassId] = useState<string>('')
  const [date, setDate] = useState<string>('')

  const { data: teacherClasses = [] } = useTeacherClasses(classId)
  const { data: instances = [], isLoading } = useLessonInstances(
    teacherClassId || undefined,
    date || undefined,
  )

  const columns: Column<LessonInstance>[] = [
    {
      header: 'Date',
      cell: (li) => format(new Date(li.date), 'dd MMM yyyy'),
    },
    {
      header: 'Subject',
      cell: (li) => li.teacherClass.subject.name,
    },
    {
      header: 'Topic',
      cell: (li) => li.topic ?? <span className="text-muted-foreground text-sm">—</span>,
    },
    {
      header: 'Comment',
      cell: (li) =>
        li.comment ? (
          <span className="text-sm text-muted-foreground">{li.comment}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
  ]

  if (!classId) {
    return (
      <div>
        <PageHeader title="Lesson Log" description="Browse lesson topics and comments." />
        <p className="text-muted-foreground text-sm">You are not assigned to a class yet.</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Lesson Log" description="Browse lesson topics and comments." />

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="w-64">
          <Select value={teacherClassId} onValueChange={(v) => setTeacherClassId(v ?? '')}>
            <SelectTrigger>
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              {teacherClasses.map((tc) => (
                <SelectItem key={tc.id} value={tc.id}>
                  {tc.subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-40"
          placeholder="Filter by date"
        />
      </div>

      {!teacherClassId && (
        <p className="text-muted-foreground text-sm">Select a subject to view lesson instances.</p>
      )}

      {teacherClassId && (
        <DataTable<LessonInstance>
          columns={columns}
          data={instances}
          isLoading={isLoading}
          keyExtractor={(li) => li.id}
          emptyTitle="No lesson instances"
          emptyDescription="No lessons logged for this subject yet."
        />
      )}
    </div>
  )
}
