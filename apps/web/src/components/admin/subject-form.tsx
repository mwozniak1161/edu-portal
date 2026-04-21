'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormError } from '@/components/feedback/form-error'
import type { Subject } from '@/lib/api/types'

interface Values {
  name: string
}

interface SubjectFormProps {
  subject?: Subject
  onSubmit: (data: Values) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function SubjectForm({ subject, onSubmit, onCancel, isLoading }: SubjectFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    defaultValues: subject ? { name: subject.name } : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Subject name (e.g. Mathematics)" {...register('name', { required: 'Name is required', maxLength: { value: 100, message: 'Max 100 characters' } })} />
        <FormError message={errors.name?.message} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{subject ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
