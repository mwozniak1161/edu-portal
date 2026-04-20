'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/data/data-table'
import { RoleBadge } from '@/components/user/role-badge'
import { StatusBadge } from '@/components/user/status-badge'
import { UserAvatar } from '@/components/user/user-avatar'
import { AttendanceStatusBadge } from '@/components/attendance/attendance-status-badge'
import { AttendanceBatchForm, type StudentRow } from '@/components/attendance/attendance-batch-form'
import { WeightedGradeCell } from '@/components/grades/weighted-grade-cell'
import { PageHeader } from '@/components/layout/page-header'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Role, AttendanceStatus } from '@/types'
import { toast } from 'sonner'

interface UserRow {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  status: 'active' | 'inactive'
}

const MOCK_USERS: UserRow[] = [
  { id: '1', firstName: 'Anna', lastName: 'Kowalski', email: 'anna@school.pl', role: Role.ADMIN, status: 'active' },
  { id: '2', firstName: 'Marek', lastName: 'Nowak', email: 'marek@school.pl', role: Role.TEACHER, status: 'active' },
  { id: '3', firstName: 'Julia', lastName: 'Wiśniewska', email: 'julia@school.pl', role: Role.STUDENT, status: 'active' },
  { id: '4', firstName: 'Piotr', lastName: 'Zając', email: 'piotr@school.pl', role: Role.STUDENT, status: 'inactive' },
  { id: '5', firstName: 'Karolina', lastName: 'Dąbrowska', email: 'karolina@school.pl', role: Role.TEACHER, status: 'active' },
]

const MOCK_STUDENTS: StudentRow[] = [
  { id: '1', firstName: 'Julia', lastName: 'Wiśniewska' },
  { id: '2', firstName: 'Piotr', lastName: 'Zając' },
  { id: '3', firstName: 'Tomasz', lastName: 'Lewandowski' },
  { id: '4', firstName: 'Marta', lastName: 'Kamińska' },
]

const USER_COLUMNS: Column<UserRow>[] = [
  {
    header: 'User',
    cell: (row) => (
      <div className="flex items-center gap-2">
        <UserAvatar firstName={row.firstName} lastName={row.lastName} />
        <div>
          <p className="text-sm font-medium">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    header: 'Role',
    cell: (row) => <RoleBadge role={row.role} />,
  },
  {
    header: 'Status',
    cell: (row) => <StatusBadge status={row.status} />,
  },
]

const MOCK_GRADES = [
  { id: '1', subject: 'Math', value: 5, weight: 3, comment: 'Excellent work on algebra' },
  { id: '2', subject: 'Physics', value: 4, weight: 2, comment: undefined },
  { id: '3', subject: 'History', value: 3, weight: 1, comment: 'Needs improvement on dates' },
]

const GRADE_COLUMNS_FIXED: Column<typeof MOCK_GRADES[0]>[] = [
  { header: 'Subject', accessor: 'subject' },
  {
    header: 'Grade',
    cell: (row) => <WeightedGradeCell value={row.value} weight={row.weight} comment={row.comment} />,
  },
  {
    header: 'Status',
    cell: (row) => {
      const statusMap: Record<string, AttendanceStatus> = {
        '1': AttendanceStatus.PRESENT,
        '2': AttendanceStatus.LATE,
        '3': AttendanceStatus.ABSENT,
      }
      return <AttendanceStatusBadge status={statusMap[row.id] ?? AttendanceStatus.PRESENT} />
    },
  },
]

export default function DemoPage() {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="container max-w-4xl py-10 space-y-14">
      <PageHeader
        title="Component Demo"
        description="Visual preview of reusable UI components"
        action={
          <Button variant="outline" onClick={() => toast.success('Toast works!')}>
            Test Toast
          </Button>
        }
      />

      {/* 1 — DataTable with user rows */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. DataTable (with search, avatar, badges)</h2>
        <DataTable
          columns={USER_COLUMNS}
          data={MOCK_USERS}
          searchKey="email"
          searchPlaceholder="Search by email..."
          keyExtractor={(r) => r.id}
          emptyTitle="No users found"
        />
      </section>

      {/* 2 — AttendanceBatchForm */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. AttendanceBatchForm</h2>
        <AttendanceBatchForm
          students={MOCK_STUDENTS}
          onSave={(records) => {
            toast.success(`Saved attendance for ${Object.keys(records).length} students`)
          }}
        />
      </section>

      {/* 3 — Grades table with WeightedGradeCell + AttendanceStatusBadge */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. Grade table with weighted cells</h2>
        <DataTable
          columns={GRADE_COLUMNS_FIXED}
          data={MOCK_GRADES}
          keyExtractor={(r) => r.id}
          emptyTitle="No grades"
        />
      </section>

      {/* 4 — ConfirmDialog */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">4. ConfirmDialog</h2>
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
          Delete user
        </Button>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete user?"
          description="This action cannot be undone. The user will be permanently removed."
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={() => {
            setConfirmOpen(false)
            toast.error('User deleted (demo)')
          }}
        />
      </section>
    </div>
  )
}
