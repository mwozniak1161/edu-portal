'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EduDataTextarea } from '@/components/ui/edu-data-textarea'
import { FormError } from '@/components/feedback/form-error'
import type { Grade } from '@/lib/api/types'

interface Values {
  value: number
  weight: number
  comment: string
}

interface CorrectionGradeFormProps {
  originalGrade: Grade
  onSubmit: (data: Values) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CorrectionGradeForm({ originalGrade, onSubmit, onCancel, isLoading }: CorrectionGradeFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    defaultValues: { weight: originalGrade.weight, comment: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-md bg-muted p-3 text-sm">
        <p className="text-muted-foreground">Correcting grade:</p>
        <p className="font-medium">
          {originalGrade.student.firstName} {originalGrade.student.lastName} —{' '}
          original value: <span className="font-mono">{originalGrade.value}</span> ×<span className="font-data">{originalGrade.weight}</span>
        </p>
        {originalGrade.comment && <p className="text-muted-foreground text-xs mt-1">{originalGrade.comment}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            type="number"
            step="0.5"
            min="1"
            max="6"
            placeholder="New value (1–6)"
            className="edu-input font-data"
            {...register('value', {
              required: 'Value is required',
              valueAsNumber: true,
              min: { value: 1, message: 'Min 1' },
              max: { value: 6, message: 'Max 6' },
            })}
          />
          <FormError message={errors.value?.message} />
        </div>
        <div className="w-24">
          <Input
            type="number"
            min="1"
            placeholder="Weight"
            className="edu-input font-data"
            {...register('weight', {
              required: 'Weight is required',
              valueAsNumber: true,
              min: { value: 1, message: 'Min 1' },
            })}
          />
          <FormError message={errors.weight?.message} />
        </div>
      </div>

      <div>
        <EduDataTextarea placeholder="Comment (optional)" {...register('comment')} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>Add Correction</Button>
      </div>
    </form>
  )
}
