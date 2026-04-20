import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { LessonInstance } from './types'

const LI_KEY = ['lesson-instances'] as const

interface CreateLessonInstancePayload {
  teacherClassId: string
  date: string
  topic?: string
  comment?: string
}

interface UpdateLessonInstancePayload {
  topic?: string
  comment?: string
}

interface GenerateForDatePayload {
  teacherClassId: string
  date: string
}

export function useLessonInstances(teacherClassId?: string, date?: string) {
  const params = new URLSearchParams()
  if (teacherClassId) params.set('teacherClassId', teacherClassId)
  if (date) params.set('date', date)
  const qs = params.toString()

  return useQuery<LessonInstance[]>({
    queryKey: [...LI_KEY, teacherClassId, date],
    queryFn: () => api.get<LessonInstance[]>(`/lesson-instances${qs ? `?${qs}` : ''}`),
    enabled: !!teacherClassId,
  })
}

export function useCreateLessonInstance() {
  const qc = useQueryClient()
  return useMutation<LessonInstance, Error, CreateLessonInstancePayload>({
    mutationFn: (data) => api.post<LessonInstance>('/lesson-instances', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: LI_KEY }),
  })
}

export function useUpdateLessonInstance() {
  const qc = useQueryClient()
  return useMutation<LessonInstance, Error, { id: string } & UpdateLessonInstancePayload>({
    mutationFn: ({ id, ...data }) => api.patch<LessonInstance>(`/lesson-instances/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: LI_KEY }),
  })
}

export function useDeleteLessonInstance() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/lesson-instances/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: LI_KEY }),
  })
}

export function useGenerateLessonInstancesForDate() {
  const qc = useQueryClient()
  return useMutation<{ created: LessonInstance[]; skipped: number }, Error, GenerateForDatePayload>({
    mutationFn: (data) =>
      api.post<{ created: LessonInstance[]; skipped: number }>('/lesson-instances/generate-for-date', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: LI_KEY }),
  })
}
