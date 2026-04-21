'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { DataTable, type Column } from '@/components/data/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { RoleBadge } from '@/components/user/role-badge'
import { StatusBadge } from '@/components/user/status-badge'
import { UserForm } from '@/components/admin/user-form'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useToggleUserStatus } from '@/lib/api/users'
import type { User } from '@/lib/api/types'
import { Role } from '@/types'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function UsersPage() {
  const [search] = useState('')
  const [page] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | undefined>()
  const [deleteId, setDeleteId] = useState<string | undefined>()

  const { data, isLoading } = useUsers(search || undefined, page)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const toggleStatus = useToggleUserStatus()

  const columns: Column<User>[] = [
    {
      header: 'Name',
      cell: (u) => `${u.firstName} ${u.lastName}`,
    },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Role',
      cell: (u) => <RoleBadge role={u.role as Role} />,
    },
    {
      header: 'Status',
      cell: (u) => <StatusBadge status={u.isActive ? 'active' : 'inactive'} />,
    },
    {
      header: '',
      className: 'w-10',
      cell: (u) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setEditUser(u); setDialogOpen(true) }}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
              try {
                await toggleStatus.mutateAsync(u.id)
                toast.success('User status updated')
              } catch {
                toast.error('Failed to update status')
              }
            }}>
              {u.isActive ? 'Disable' : 'Enable'}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(u.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  async function handleSubmit(values: { email?: string; password?: string; firstName?: string; lastName?: string; role?: Role; classId?: string }) {
    const classId = values.classId === '' ? null : (values.classId ?? null)
    const payload = { ...values, classId }
    try {
      if (editUser) {
        await updateUser.mutateAsync({ id: editUser.id, ...payload })
        toast.success('User updated')
      } else {
        await createUser.mutateAsync(payload as { email: string; password: string; firstName: string; lastName: string; role: Role; classId: string | null })
        toast.success('User created')
      }
      setDialogOpen(false)
      setEditUser(undefined)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Operation failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage system users and their roles."
        action={
          <Button onClick={() => { setEditUser(undefined); setDialogOpen(true) }}>Add User</Button>
        }
      />

      <DataTable<User>
        columns={columns}
        data={data?.users ?? []}
        isLoading={isLoading}
        searchKey="email"
        searchPlaceholder="Search by email..."
        keyExtractor={(u) => u.id}
        emptyTitle="No users found"
        emptyDescription="Create your first user to get started."
      />

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditUser(undefined) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editUser ? 'Edit User' : 'Create User'}</DialogTitle>
          </DialogHeader>
          <UserForm
            user={editUser}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            isLoading={createUser.isPending || updateUser.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(undefined)}
        title="Delete user?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={async () => {
          if (!deleteId) return
          try {
            await deleteUser.mutateAsync(deleteId)
            toast.success('User deleted')
          } catch {
            toast.error('Failed to delete user')
          }
          setDeleteId(undefined)
        }}
      />
    </div>
  )
}
