'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { PageHeader } from '@/components/layout/page-header'
import { AttendanceBatchForm, type AttendanceRecord } from '@/components/attendance/attendance-batch-form'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLessonInstances } from '@/lib/api/lesson-instances'
import { useClassStudents } from '@/lib/api/classes'
import { useAttendances, useBatchAttendanceUpsert } from '@/lib/api/attendance'
import { useAuthStore } from '@/store/auth.store'
import { type AttendanceStatus } from '@/types'

export default function AttendancePage() {
  const user = useAuthStore((s) => s.user)
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [lessonInstanceId, setLessonInstanceId] = useState<string>('')

  const { data: allInstances = [], isLoading: instancesLoading } = useLessonInstances(undefined, date)
  const myInstances = allInstances.filter((li) => li.teacherClass.teacher.id === user?.id)

  const selectedInstance = myInstances.find((li) => li.id === lessonInstanceId)
  const { data: classStudents = [] } = useClassStudents(selectedInstance?.teacherClass.classId)

  const { data: existingAttendances = [], isSuccess: attendancesSuccess } = useAttendances(lessonInstanceId || undefined)

  const initialRecords: AttendanceRecord = {}
  existingAttendances.forEach((a) => {
    initialRecords[a.studentId] = a.status as AttendanceStatus
  })

  const batchUpsert = useBatchAttendanceUpsert()

  async function handleSave(records: AttendanceRecord) {
    if (!lessonInstanceId) return
    try {
      await batchUpsert.mutateAsync({
        lessonInstanceId,
        entries: Object.entries(records).map(([studentId, status]) => ({ studentId, status })),
      })
      toast.success('Attendance saved')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save attendance')
    }
  }

  return (
    <div>
      <PageHeader title="Attendance" description="Record attendance for a lesson." />

      <div className="flex gap-3 mb-6 flex-wrap">
        <Input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setLessonInstanceId('') }}
          className="w-40"
        />
        <div className="w-80">
          {instancesLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={lessonInstanceId}
              onValueChange={(v) => setLessonInstanceId(v ?? '')}
              disabled={myInstances.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={myInstances.length === 0 ? 'No lessons on this day' : 'Select lesson'}>
                  {selectedInstance
                    ? `${selectedInstance.teacherClass.subject.name} — ${selectedInstance.teacherClass.class.name}`
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {myInstances.map((li) => (
                  <SelectItem key={li.id} value={li.id}>
                    {li.teacherClass.subject.name} — {li.teacherClass.class.name}
                    {li.topic ? ` · ${li.topic}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {!lessonInstanceId && (
        <p className="text-muted-foreground text-sm">Select a date and lesson to manage attendance.</p>
      )}

      {lessonInstanceId && classStudents.length === 0 && (
        <p className="text-muted-foreground text-sm">No students found in this class.</p>
      )}

      {lessonInstanceId && classStudents.length > 0 && attendancesSuccess && (
        <AttendanceBatchForm
          key={lessonInstanceId}
          students={classStudents}
          initialRecords={initialRecords}
          isSaving={batchUpsert.isPending}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
