'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { PageHeader } from '@/components/layout/page-header'
import { DataTable, type Column } from '@/components/data/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LessonInstanceForm } from '@/components/teacher/lesson-instance-form'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Wand2 } from 'lucide-react'
import { useTeacherClasses } from '@/lib/api/teacher-classes'
import {
  useLessonInstances,
  useCreateLessonInstance,
  useUpdateLessonInstance,
  useDeleteLessonInstance,
  useGenerateLessonInstancesForDate,
} from '@/lib/api/lesson-instances'
import { useAuthStore } from '@/store/auth.store'
import type { LessonInstance } from '@/lib/api/types'

export default function LessonInstancesPage() {
  const user = useAuthStore((s) => s.user)
  const [teacherClassId, setTeacherClassId] = useState<string>('')
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editInstance, setEditInstance] = useState<LessonInstance | undefined>()
  const [deleteId, setDeleteId] = useState<string | undefined>()

  const { data: teacherClasses = [] } = useTeacherClasses()
  const myClasses = teacherClasses.filter((tc) => tc.teacherId === user?.id)

  const { data: instances = [], isLoading } = useLessonInstances(teacherClassId || undefined, date)
  const createInstance = useCreateLessonInstance()
  const updateInstance = useUpdateLessonInstance()
  const deleteInstance = useDeleteLessonInstance()
  const generateForDate = useGenerateLessonInstancesForDate()

  async function handleGenerate() {
    if (!teacherClassId || !date) return
    try {
      const result = await generateForDate.mutateAsync({ teacherClassId, date })
      if (result.created.length > 0) {
        toast.success(`Generated ${result.created.length} lesson instance(s)`)
      } else {
        toast.info(`All timeslots already have instances for this date (${result.skipped} skipped)`)
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Generation failed')
    }
  }

  async function handleSubmit(values: { topic: string; comment: string }) {
    try {
      if (editInstance) {
        await updateInstance.mutateAsync({ id: editInstance.id, ...values })
        toast.success('Lesson instance updated')
      } else {
        await createInstance.mutateAsync({ teacherClassId, date, ...values })
        toast.success('Lesson instance created')
      }
      setDialogOpen(false)
      setEditInstance(undefined)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Operation failed')
    }
  }

  const columns: Column<LessonInstance>[] = [
    {
      header: 'Date',
      cell: (li) => format(new Date(li.date), 'dd MMM yyyy'),
    },
    {
      header: 'Topic',
      cell: (li) => li.topic ?? <span className="text-muted-foreground text-sm">—</span>,
    },
    {
      header: 'Comment',
      cell: (li) =>
        li.comment ? (
          <span className="text-sm text-muted-foreground line-clamp-1">{li.comment}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
    {
      header: '',
      className: 'w-10',
      cell: (li) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setEditInstance(li); setDialogOpen(true) }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(li.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Lesson Instances"
        description="Log topics and comments for each lesson by date."
        action={
          teacherClassId ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={generateForDate.isPending}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate from Timeslots
              </Button>
              <Button onClick={() => { setEditInstance(undefined); setDialogOpen(true) }}>
                Add Instance
              </Button>
            </div>
          ) : undefined
        }
      />

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="w-72">
          <Select value={teacherClassId} onValueChange={(v) => setTeacherClassId(v ?? '')}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject / class" />
            </SelectTrigger>
            <SelectContent>
              {myClasses.map((tc) => (
                <SelectItem key={tc.id} value={tc.id}>
                  {tc.subject.name} — {tc.class.name}
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
        />
      </div>

      {!teacherClassId ? (
        <p className="text-muted-foreground text-sm">Select a class and date to view lesson instances.</p>
      ) : (
        <DataTable<LessonInstance>
          columns={columns}
          data={instances}
          isLoading={isLoading}
          keyExtractor={(li) => li.id}
          emptyTitle="No lesson instances"
          emptyDescription="Generate from timeslots or create manually."
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditInstance(undefined) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editInstance ? 'Edit Lesson Instance' : 'New Lesson Instance'}</DialogTitle>
          </DialogHeader>
          <LessonInstanceForm
            instance={editInstance}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            isLoading={createInstance.isPending || updateInstance.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(undefined)}
        title="Delete lesson instance?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={async () => {
          if (!deleteId) return
          try {
            await deleteInstance.mutateAsync(deleteId)
            toast.success('Lesson instance deleted')
          } catch {
            toast.error('Failed to delete')
          }
          setDeleteId(undefined)
        }}
      />
    </div>
  )
}
