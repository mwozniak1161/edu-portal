import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { Class } from './types'

const CLASSES_KEY = ['classes'] as const

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
