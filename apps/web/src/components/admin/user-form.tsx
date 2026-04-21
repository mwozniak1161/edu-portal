'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormError } from '@/components/feedback/form-error'
import { Role } from '@/types'
import type { User } from '@/lib/api/types'
import { useClasses } from '@/lib/api/classes'

interface FormValues {
  email: string
  password: string
  firstName: string
  lastName: string
  role: Role
  classId: string
}

interface UserFormProps {
  user?: User
  onSubmit: (data: Partial<FormValues>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const isEdit = !!user
  const { data: classes = [] } = useClasses()

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: user
      ? { firstName: user.firstName, lastName: user.lastName, role: user.role, classId: user.classId ?? '' }
      : undefined,
  })

  useEffect(() => {
    reset(user
      ? { firstName: user.firstName, lastName: user.lastName, role: user.role, classId: user.classId ?? '' }
      : { email: '', password: '', firstName: '', lastName: '', role: undefined, classId: '' },
    )
  }, [user, reset])

  const selectedRole = watch('role')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!isEdit && (
        <div>
          <Input placeholder="Email" type="email" {...register('email', { required: 'Email is required' })} />
          <FormError message={errors.email?.message} />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input placeholder="First name" {...register('firstName', { required: 'First name is required' })} />
          <FormError message={errors.firstName?.message} />
        </div>
        <div>
          <Input placeholder="Last name" {...register('lastName', { required: 'Last name is required' })} />
          <FormError message={errors.lastName?.message} />
        </div>
      </div>
      <div>
        <Controller
          name="role"
          control={control}
          rules={{ required: 'Role is required' }}
          render={({ field }) => (
            <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v as Role)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Role).map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormError message={errors.role?.message} />
      </div>
      {selectedRole === Role.STUDENT && (
        <div>
          <Controller
            name="classId"
            control={control}
            render={({ field }) => {
              const selected = classes.find((c) => c.id === field.value)
              return (
                <Select value={field.value ?? ''} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to class (optional)">
                      {selected ? selected.name : field.value === '' ? 'Unassigned' : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }}
          />
        </div>
      )}
      {!isEdit && (
        <div>
          <Input placeholder="Password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })} />
          <FormError message={errors.password?.message} />
        </div>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isEdit ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
