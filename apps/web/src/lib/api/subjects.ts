import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { Subject } from './types'

const SUBJECTS_KEY = ['subjects'] as const

export function useSubjects() {
  return useQuery<Subject[]>({
    queryKey: SUBJECTS_KEY,
    queryFn: () => api.get<Subject[]>('/subjects'),
  })
}

export function useCreateSubject() {
  const qc = useQueryClient()
  return useMutation<Subject, Error, { name: string }>({
    mutationFn: (data) => api.post<Subject>('/subjects', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUBJECTS_KEY }),
  })
}

export function useUpdateSubject() {
  const qc = useQueryClient()
  return useMutation<Subject, Error, { id: string; name?: string }>({
    mutationFn: ({ id, ...data }) => api.patch<Subject>(`/subjects/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUBJECTS_KEY }),
  })
}

export function useDeleteSubject() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/subjects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUBJECTS_KEY }),
  })
}
