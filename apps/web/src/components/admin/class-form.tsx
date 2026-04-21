'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormError } from '@/components/feedback/form-error'
import type { Class } from '@/lib/api/types'

interface Values {
  name: string
}

interface ClassFormProps {
  cls?: Class
  onSubmit: (data: Values) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ClassForm({ cls, onSubmit, onCancel, isLoading }: ClassFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    defaultValues: cls ? { name: cls.name } : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Class name (e.g. 3A)" {...register('name', { required: 'Name is required', maxLength: { value: 50, message: 'Max 50 characters' } })} />
        <FormError message={errors.name?.message} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{cls ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
