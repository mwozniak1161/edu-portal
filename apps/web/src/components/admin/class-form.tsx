'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormError } from '@/components/feedback/form-error'
import { UserAvatar } from '@/components/user/user-avatar'
import { Role } from '@/types'
import type { Class, User } from '@/lib/api/types'

interface Values {
  name: string
}

interface ClassFormProps {
  cls?: Class
  allUsers?: User[]
  onUpdateUser?: (userId: string, classId: string | null) => Promise<unknown>
  onSubmit: (data: Values) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ClassForm({ cls, allUsers = [], onUpdateUser, onSubmit, onCancel, isLoading }: ClassFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    defaultValues: cls ? { name: cls.name } : undefined,
  })
  const [search, setSearch] = useState('')

  const students = allUsers.filter((u) => u.role === Role.STUDENT)
  const inClass = students.filter((u) => u.classId === cls?.id)
  const unassigned = students.filter((u) => u.classId === null)

  const q = search.toLowerCase()
  const filteredInClass = inClass.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
  )
  const filteredUnassigned = unassigned.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
  )

  const showRoster = !!cls && !!onUpdateUser

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Input
          placeholder="Class name (e.g. 3A)"
          {...register('name', { required: 'Name is required', maxLength: { value: 50, message: 'Max 50 characters' } })}
        />
        <FormError message={errors.name?.message} />
      </div>

      {showRoster && (
        <div className="space-y-3 border-t pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-edu-on-surface-variant">Students</p>
          <Input
            placeholder="Search students…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredInClass.length > 0 && (
            <div className="rounded-md border divide-y max-h-40 overflow-y-auto">
              {filteredInClass.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <UserAvatar firstName={u.firstName} lastName={u.lastName} />
                    <span className="text-sm font-data">{u.firstName} {u.lastName}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => onUpdateUser(u.id, null)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {filteredInClass.length === 0 && !search && (
            <p className="text-sm text-edu-on-surface-variant">No students in this class yet.</p>
          )}

          {filteredUnassigned.length > 0 && (
            <>
              <p className="text-xs text-edu-on-surface-variant">Unassigned students</p>
              <div className="rounded-md border divide-y max-h-40 overflow-y-auto">
                {filteredUnassigned.map((u) => (
                  <div key={u.id} className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <UserAvatar firstName={u.firstName} lastName={u.lastName} />
                      <span className="text-sm font-data">{u.firstName} {u.lastName}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isLoading}
                      onClick={() => onUpdateUser(u.id, cls!.id)}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{cls ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
