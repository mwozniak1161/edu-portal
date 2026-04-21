import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { Class, User } from './types'

const CLASSES_KEY = ['classes'] as const

export function useClassStudents(classId?: string) {
  return useQuery<User[]>({
    queryKey: ['class-students', classId],
    queryFn: () => api.get<User[]>(`/classes/${classId}/students`),
    enabled: !!classId,
  })
}

export function useClasses() {
  return useQuery<Class[]>({
    queryKey: CLASSES_KEY,
    queryFn: () => api.get<Class[]>('/classes'),
  })
}

export function useCreateClass() {
  const qc = useQueryClient()
  return useMutation<Class, Error, { name: string }>({
    mutationFn: (data) => api.post<Class>('/classes', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLASSES_KEY }),
  })
}

export function useUpdateClass() {
  const qc = useQueryClient()
  return useMutation<Class, Error, { id: string; name?: string }>({
    mutationFn: ({ id, ...data }) => api.patch<Class>(`/classes/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLASSES_KEY }),
  })
}

export function useDeleteClass() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/classes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLASSES_KEY }),
  })
}
