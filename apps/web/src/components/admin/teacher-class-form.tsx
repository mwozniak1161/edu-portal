'use client'

import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormError } from '@/components/feedback/form-error'
import type { TeacherClass, User, Class, Subject } from '@/lib/api/types'

interface Values {
  teacherId: string
  subjectId: string
  classId: string
}

interface TeacherClassFormProps {
  teacherClass?: TeacherClass
  teachers: User[]
  classes: Class[]
  subjects: Subject[]
  onSubmit: (data: Values) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function TeacherClassForm({ teacherClass, teachers, classes, subjects, onSubmit, onCancel, isLoading }: TeacherClassFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<Values>({
    defaultValues: teacherClass
      ? { teacherId: teacherClass.teacherId, subjectId: teacherClass.subjectId, classId: teacherClass.classId }
      : { teacherId: '', subjectId: '', classId: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Controller
          name="teacherId"
          control={control}
          rules={{ required: 'Teacher is required' }}
          render={({ field }) => {
            const selected = teachers.find((t) => t.id === field.value)
            return (
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher">
                    {selected && `${selected.firstName} ${selected.lastName}`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }}
        />
        <FormError message={errors.teacherId?.message} />
      </div>
      <div>
        <Controller
          name="subjectId"
          control={control}
          rules={{ required: 'Subject is required' }}
          render={({ field }) => {
            const selected = subjects.find((s) => s.id === field.value)
            return (
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject">
                    {selected && selected.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }}
        />
        <FormError message={errors.subjectId?.message} />
      </div>
      <div>
        <Controller
          name="classId"
          control={control}
          rules={{ required: 'Class is required' }}
          render={({ field }) => {
            const selected = classes.find((c) => c.id === field.value)
            return (
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class">
                    {selected && selected.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }}
        />
        <FormError message={errors.classId?.message} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{teacherClass ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
