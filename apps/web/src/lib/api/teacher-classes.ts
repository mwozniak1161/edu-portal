import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { TeacherClass } from './types'

const TC_KEY = ['teacher-classes'] as const

interface TeacherClassPayload {
  teacherId: string
  subjectId: string
  classId: string
}

export function useTeacherClasses(classId?: string) {
  const qs = classId ? `?classId=${classId}` : ''
  return useQuery<TeacherClass[]>({
    queryKey: [...TC_KEY, classId],
    queryFn: () => api.get<TeacherClass[]>(`/teacher-classes${qs}`),
  })
}

export function useCreateTeacherClass() {
  const qc = useQueryClient()
  return useMutation<TeacherClass, Error, TeacherClassPayload>({
    mutationFn: (data) => api.post<TeacherClass>('/teacher-classes', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TC_KEY }),
  })
}

export function useUpdateTeacherClass() {
  const qc = useQueryClient()
  return useMutation<TeacherClass, Error, { id: string } & Partial<TeacherClassPayload>>({
    mutationFn: ({ id, ...data }) => api.patch<TeacherClass>(`/teacher-classes/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TC_KEY }),
  })
}

export function useDeleteTeacherClass() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/teacher-classes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: TC_KEY }),
  })
}
