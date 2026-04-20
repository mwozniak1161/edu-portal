'use client'

import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormError } from '@/components/feedback/form-error'
import type { Grade, TeacherClass } from '@/lib/api/types'

interface Values {
  value: number
  weight: number
  comment: string
  studentId: string
  teacherClassId: string
}

interface GradeFormProps {
  grade?: Grade
  teacherClasses: TeacherClass[]
  students: { id: string; firstName: string; lastName: string }[]
  onSubmit: (data: Values) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function GradeForm({ grade, teacherClasses, students, onSubmit, onCancel, isLoading }: GradeFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<Values>({
    defaultValues: grade
      ? {
          value: grade.value,
          weight: grade.weight,
          comment: grade.comment ?? '',
          studentId: grade.studentId,
          teacherClassId: grade.teacherClassId,
        }
      : { weight: 1, comment: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Controller
          name="teacherClassId"
          control={control}
          rules={{ required: 'Subject is required' }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!grade}>
              <SelectTrigger><SelectValue placeholder="Select subject / class" /></SelectTrigger>
              <SelectContent>
                {teacherClasses.map((tc) => (
                  <SelectItem key={tc.id} value={tc.id}>
                    {tc.subject.name} — {tc.class.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormError message={errors.teacherClassId?.message} />
      </div>

      <div>
        <Controller
          name="studentId"
          control={control}
          rules={{ required: 'Student is required' }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!grade}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.firstName} {s.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormError message={errors.studentId?.message} />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            type="number"
            step="0.5"
            min="1"
            max="6"
            placeholder="Value (1–6)"
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
        <Textarea placeholder="Comment (optional)" {...register('comment')} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{grade ? 'Update' : 'Add Grade'}</Button>
      </div>
    </form>
  )
}
