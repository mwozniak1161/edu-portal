'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserAvatar } from '@/components/user/user-avatar'
import { AttendanceStatus } from '@/types'

export interface StudentRow {
  id: string
  firstName: string
  lastName: string
}

export type AttendanceRecord = Record<string, AttendanceStatus>

interface AttendanceBatchFormProps {
  students: StudentRow[]
  initialRecords?: AttendanceRecord
  isSaving?: boolean
  onSave: (records: AttendanceRecord) => void
}

export function AttendanceBatchForm({
  students,
  initialRecords = {},
  isSaving = false,
  onSave,
}: AttendanceBatchFormProps) {
  const [records, setRecords] = useState<AttendanceRecord>(() => {
    const defaults: AttendanceRecord = {}
    students.forEach((s) => {
      defaults[s.id] = initialRecords[s.id] ?? AttendanceStatus.PRESENT
    })
    return defaults
  })

  function setStatus(studentId: string, status: AttendanceStatus) {
    setRecords((prev) => ({ ...prev, [studentId]: status }))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border divide-y">
        {students.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <UserAvatar firstName={student.firstName} lastName={student.lastName} />
              <span className="text-sm font-medium">
                {student.firstName} {student.lastName}
              </span>
            </div>
            <Select
              value={records[student.id]}
              onValueChange={(v) => setStatus(student.id, v as AttendanceStatus)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AttendanceStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={() => onSave(records)} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Attendance'}
        </Button>
      </div>
    </div>
  )
}
