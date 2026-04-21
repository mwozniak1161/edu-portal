'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { DataTable, type Column } from '@/components/data/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { SubjectForm } from '@/components/admin/subject-form'
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from '@/lib/api/subjects'
import type { Subject } from '@/lib/api/types'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function SubjectsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editSubject, setEditSubject] = useState<Subject | undefined>()
  const [deleteId, setDeleteId] = useState<string | undefined>()

  const { data = [], isLoading } = useSubjects()
  const createSubject = useCreateSubject()
  const updateSubject = useUpdateSubject()
  const deleteSubject = useDeleteSubject()

  const columns: Column<Subject>[] = [
    { header: 'Name', accessor: 'name' },
    {
      header: 'Created',
      cell: (s) => new Date(s.createdAt).toLocaleDateString(),
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
            <DropdownMenuItem onClick={() => { setEditSubject(s); setDialogOpen(true) }}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(s.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  async function handleSubmit(values: { name: string }) {
    try {
      if (editSubject) {
        await updateSubject.mutateAsync({ id: editSubject.id, ...values })
        toast.success('Subject updated')
      } else {
        await createSubject.mutateAsync(values)
        toast.success('Subject created')
      }
      setDialogOpen(false)
      setEditSubject(undefined)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Operation failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Subjects"
        description="Manage school subjects."
        action={
          <Button onClick={() => { setEditSubject(undefined); setDialogOpen(true) }}>Add Subject</Button>
        }
      />

      <DataTable<Subject>
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search subjects..."
        keyExtractor={(s) => s.id}
        emptyTitle="No subjects found"
        emptyDescription="Create your first subject to get started."
      />

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditSubject(undefined) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editSubject ? 'Edit Subject' : 'Create Subject'}</DialogTitle>
          </DialogHeader>
          <SubjectForm
            subject={editSubject}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            isLoading={createSubject.isPending || updateSubject.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(undefined)}
        title="Delete subject?"
        description="All associated data will be removed."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={async () => {
          if (!deleteId) return
          try {
            await deleteSubject.mutateAsync(deleteId)
            toast.success('Subject deleted')
          } catch {
            toast.error('Failed to delete subject')
          }
          setDeleteId(undefined)
        }}
      />
    </div>
  )
}
