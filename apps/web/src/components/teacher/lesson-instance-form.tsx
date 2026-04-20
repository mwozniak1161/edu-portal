'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormError } from '@/components/feedback/form-error'
import type { LessonInstance } from '@/lib/api/types'

interface Values {
  topic: string
  comment: string
}

interface LessonInstanceFormProps {
  instance?: LessonInstance
  onSubmit: (data: Values) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function LessonInstanceForm({ instance, onSubmit, onCancel, isLoading }: LessonInstanceFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    defaultValues: {
      topic: instance?.topic ?? '',
      comment: instance?.comment ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Topic"
          {...register('topic', { required: 'Topic is required' })}
        />
        <FormError message={errors.topic?.message} />
      </div>
      <div>
        <Textarea placeholder="Comment (optional)" {...register('comment')} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{instance ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
