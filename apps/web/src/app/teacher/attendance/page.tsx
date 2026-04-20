'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { PageHeader } from '@/components/layout/page-header'
import { AttendanceBatchForm, type AttendanceRecord } from '@/components/attendance/attendance-batch-form'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTeacherClasses } from '@/lib/api/teacher-classes'
import { useUsers } from '@/lib/api/users'
import { useAttendances, useBatchAttendanceUpsert } from '@/lib/api/attendance'
import { useAuthStore } from '@/store/auth.store'
import { Role, type AttendanceStatus } from '@/types'

export default function AttendancePage() {
  const user = useAuthStore((s) => s.user)
  const [teacherClassId, setTeacherClassId] = useState<string>('')
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))

  const { data: teacherClasses = [], isLoading: tcLoading } = useTeacherClasses()
  const myClasses = teacherClasses.filter((tc) => tc.teacherId === user?.id)

  const selectedTc = myClasses.find((tc) => tc.id === teacherClassId)
  const { data: usersResp } = useUsers(undefined, 1, 200)
  const classStudents = (usersResp?.users ?? []).filter(
    (u) => u.role === Role.STUDENT && u.classId === (selectedTc?.classId ?? undefined),
  )

  const { data: existingAttendances = [] } = useAttendances(teacherClassId || undefined, date)

  const initialRecords: AttendanceRecord = {}
  existingAttendances.forEach((a) => {
    initialRecords[a.studentId] = a.status as AttendanceStatus
  })

  const batchUpsert = useBatchAttendanceUpsert()

  async function handleSave(records: AttendanceRecord) {
    if (!teacherClassId || !date) return
    try {
      await batchUpsert.mutateAsync({
        teacherClassId,
        date,
        entries: Object.entries(records).map(([studentId, status]) => ({ studentId, status })),
      })
      toast.success('Attendance saved')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save attendance')
    }
  }

  return (
    <div>
      <PageHeader title="Attendance" description="Record attendance for your classes by date." />

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="w-72">
          {tcLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={teacherClassId} onValueChange={(v) => setTeacherClassId(v ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select class / subject" />
              </SelectTrigger>
              <SelectContent>
                {myClasses.map((tc) => (
                  <SelectItem key={tc.id} value={tc.id}>
                    {tc.subject.name} — {tc.class.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-40"
        />
      </div>

      {!teacherClassId && (
        <p className="text-muted-foreground text-sm">Select a class and date to manage attendance.</p>
      )}

      {teacherClassId && classStudents.length === 0 && (
        <p className="text-muted-foreground text-sm">No students found in this class.</p>
      )}

      {teacherClassId && classStudents.length > 0 && (
        <AttendanceBatchForm
          students={classStudents}
          initialRecords={initialRecords}
          isSaving={batchUpsert.isPending}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
