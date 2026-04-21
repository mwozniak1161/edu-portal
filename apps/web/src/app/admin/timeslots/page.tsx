'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { DataTable, type Column } from '@/components/data/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { TimeslotForm } from '@/components/admin/timeslot-form'
import { useTimeslots, useCreateTimeslot, useUpdateTimeslot, useDeleteTimeslot } from '@/lib/api/timeslots'
import { useTeacherClasses } from '@/lib/api/teacher-classes'
import type { Timeslot } from '@/lib/api/types'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function TimeslotsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editSlot, setEditSlot] = useState<Timeslot | undefined>()
  const [deleteId, setDeleteId] = useState<string | undefined>()

  const { data: slots = [], isLoading } = useTimeslots()
  const { data: teacherClasses = [] } = useTeacherClasses()

  const createSlot = useCreateTimeslot()
  const updateSlot = useUpdateTimeslot()
  const deleteSlot = useDeleteTimeslot()

  const columns: Column<Timeslot>[] = [
    {
      header: 'Teacher',
      cell: (s) => s.teacherClass
        ? `${s.teacherClass.teacher.firstName} ${s.teacherClass.teacher.lastName}`
        : '—',
    },
    {
      header: 'Subject',
      cell: (s) => s.teacherClass?.subject.name ?? '—',
    },
    {
      header: 'Class',
      cell: (s) => s.teacherClass?.class.name ?? '—',
    },
    { header: 'Day', cell: (s) => DAYS[s.weekDay] ?? s.weekDay },
    {
      header: 'Time',
      cell: (s) => new Date(s.startingHour).toTimeString().slice(0, 5),
    },
    {
      header: '',
      className: 'w-10',
      cell: (s) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setEditSlot(s); setDialogOpen(true) }}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(s.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  async function handleSubmit(values: { teacherClassId: string; weekDay: number; startingHour: string }) {
    try {
      if (editSlot) {
        await updateSlot.mutateAsync({ id: editSlot.id, ...values })
        toast.success('Timeslot updated')
      } else {
        await createSlot.mutateAsync(values)
        toast.success('Timeslot created')
      }
      setDialogOpen(false)
      setEditSlot(undefined)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Operation failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Timeslots"
        description="Manage lesson timeslots per teacher-class assignment."
        action={
          <Button onClick={() => { setEditSlot(undefined); setDialogOpen(true) }}>Add Timeslot</Button>
        }
      />

      <DataTable<Timeslot>
        columns={columns}
        data={slots}
        isLoading={isLoading}
        keyExtractor={(s) => s.id}
        emptyTitle="No timeslots found"
        emptyDescription="Create your first timeslot to get started."
      />

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditSlot(undefined) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editSlot ? 'Edit Timeslot' : 'Create Timeslot'}</DialogTitle>
          </DialogHeader>
          <TimeslotForm
            timeslot={editSlot}
            teacherClasses={teacherClasses}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            isLoading={createSlot.isPending || updateSlot.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(undefined)}
        title="Delete timeslot?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={async () => {
          if (!deleteId) return
          try {
            await deleteSlot.mutateAsync(deleteId)
            toast.success('Timeslot deleted')
          } catch {
            toast.error('Failed to delete timeslot')
          }
          setDeleteId(undefined)
        }}
      />
    </div>
  )
}
