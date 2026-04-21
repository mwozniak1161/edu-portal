'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { DataTable, type Column } from '@/components/data/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { ClassForm } from '@/components/admin/class-form'
import { useClasses, useCreateClass, useUpdateClass, useDeleteClass } from '@/lib/api/classes'
import type { Class } from '@/lib/api/types'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ClassesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editClass, setEditClass] = useState<Class | undefined>()
  const [deleteId, setDeleteId] = useState<string | undefined>()

  const { data = [], isLoading } = useClasses()
  const createClass = useCreateClass()
  const updateClass = useUpdateClass()
  const deleteClass = useDeleteClass()

  const columns: Column<Class>[] = [
    { header: 'Name', accessor: 'name' },
    {
      header: 'Created',
      cell: (c) => new Date(c.createdAt).toLocaleDateString(),
    },
    {
      header: '',
      className: 'w-10',
      cell: (c) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setEditClass(c); setDialogOpen(true) }}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(c.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  async function handleSubmit(values: { name: string }) {
    try {
      if (editClass) {
        await updateClass.mutateAsync({ id: editClass.id, ...values })
        toast.success('Class updated')
      } else {
        await createClass.mutateAsync(values)
        toast.success('Class created')
      }
      setDialogOpen(false)
      setEditClass(undefined)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Operation failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Classes"
        description="Manage school classes."
        action={
          <Button onClick={() => { setEditClass(undefined); setDialogOpen(true) }}>Add Class</Button>
        }
      />

      <DataTable<Class>
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search classes..."
        keyExtractor={(c) => c.id}
        emptyTitle="No classes found"
        emptyDescription="Create your first class to get started."
      />

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditClass(undefined) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editClass ? 'Edit Class' : 'Create Class'}</DialogTitle>
          </DialogHeader>
          <ClassForm
            cls={editClass}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            isLoading={createClass.isPending || updateClass.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(undefined)}
        title="Delete class?"
        description="All associated data will be removed."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={async () => {
          if (!deleteId) return
          try {
            await deleteClass.mutateAsync(deleteId)
            toast.success('Class deleted')
          } catch {
            toast.error('Failed to delete class')
          }
          setDeleteId(undefined)
        }}
      />
    </div>
  )
}
