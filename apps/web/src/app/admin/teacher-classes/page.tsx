'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { DataTable, type Column } from '@/components/data/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { TeacherClassForm } from '@/components/admin/teacher-class-form'
import { useTeacherClasses, useCreateTeacherClass, useUpdateTeacherClass, useDeleteTeacherClass } from '@/lib/api/teacher-classes'
import { useUsers } from '@/lib/api/users'
import { useClasses } from '@/lib/api/classes'
import { useSubjects } from '@/lib/api/subjects'
import type { TeacherClass } from '@/lib/api/types'
import { Role } from '@/types'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function TeacherClassesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTc, setEditTc] = useState<TeacherClass | undefined>()
  const [deleteId, setDeleteId] = useState<string | undefined>()

  const { data: tcs = [], isLoading } = useTeacherClasses()
  const { data: usersData } = useUsers(undefined, 1, 200)
  const { data: classes = [] } = useClasses()
  const { data: subjects = [] } = useSubjects()

  const teachers = (usersData?.users ?? []).filter((u) => u.role === Role.TEACHER)

  const createTc = useCreateTeacherClass()
  const updateTc = useUpdateTeacherClass()
  const deleteTc = useDeleteTeacherClass()

  const columns: Column<TeacherClass>[] = [
    {
      header: 'Teacher',
      cell: (tc) => `${tc.teacher.firstName} ${tc.teacher.lastName}`,
    },
    { header: 'Subject', cell: (tc) => tc.subject.name },
    { header: 'Class', cell: (tc) => tc.class.name },
    {
      header: '',
      className: 'w-10',
      cell: (tc) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setEditTc(tc); setDialogOpen(true) }}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(tc.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  async function handleSubmit(values: { teacherId: string; subjectId: string; classId: string }) {
    try {
      if (editTc) {
        await updateTc.mutateAsync({ id: editTc.id, ...values })
        toast.success('Assignment updated')
      } else {
        await createTc.mutateAsync(values)
        toast.success('Assignment created')
      }
      setDialogOpen(false)
      setEditTc(undefined)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Operation failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Teacher Classes"
        description="Assign teachers to subjects and classes."
        action={
          <Button onClick={() => { setEditTc(undefined); setDialogOpen(true) }}>Add Assignment</Button>
        }
      />

      <DataTable<TeacherClass>
        columns={columns}
        data={tcs}
        isLoading={isLoading}
        keyExtractor={(tc) => tc.id}
        emptyTitle="No assignments found"
        emptyDescription="Create your first teacher-class assignment."
      />

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditTc(undefined) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTc ? 'Edit Assignment' : 'Create Assignment'}</DialogTitle>
          </DialogHeader>
          <TeacherClassForm
            teacherClass={editTc}
            teachers={teachers}
            classes={classes}
            subjects={subjects}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            isLoading={createTc.isPending || updateTc.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(undefined)}
        title="Delete assignment?"
        description="All associated timeslots will be removed."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={async () => {
          if (!deleteId) return
          try {
            await deleteTc.mutateAsync(deleteId)
            toast.success('Assignment deleted')
          } catch {
            toast.error('Failed to delete assignment')
          }
          setDeleteId(undefined)
        }}
      />
    </div>
  )
}
