'use client'

import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormError } from '@/components/feedback/form-error'
import type { Timeslot, TeacherClass } from '@/lib/api/types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface Values {
  teacherClassId: string
  weekDay: number
  startingHour: string
}

interface TimeslotFormProps {
  timeslot?: Timeslot
  teacherClasses: TeacherClass[]
  onSubmit: (data: Values) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function TimeslotForm({ timeslot, teacherClasses, onSubmit, onCancel, isLoading }: TimeslotFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<Values, unknown, Values>({
    defaultValues: timeslot
      ? {
          teacherClassId: timeslot.teacherClassId ?? undefined,
          weekDay: timeslot.weekDay,
          startingHour: new Date(timeslot.startingHour).toTimeString().slice(0, 5),
        }
      : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Controller
          name="teacherClassId"
          control={control}
          rules={{ required: 'Teacher-class is required' }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger><SelectValue placeholder="Select teacher-class" /></SelectTrigger>
              <SelectContent>
                {teacherClasses.map((tc) => (
                  <SelectItem key={tc.id} value={tc.id}>
                    {tc.teacher.firstName} {tc.teacher.lastName} — {tc.subject.name} ({tc.class.name})
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
          name="weekDay"
          control={control}
          rules={{ required: 'Day is required' }}
          render={({ field }) => (
            <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={field.value ? String(field.value) : undefined}>
              <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
              <SelectContent>
                {DAYS.map((day, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormError message={errors.weekDay?.message} />
      </div>
      <div>
        <Input placeholder="Start time (HH:MM)" {...register('startingHour', { required: 'Time is required', pattern: { value: /^\d{2}:\d{2}(:\d{2})?$/, message: 'Format: HH:MM' } })} />
        <FormError message={errors.startingHour?.message} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{timeslot ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
