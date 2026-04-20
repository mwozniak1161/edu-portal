import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { Timeslot } from './types'

const TS_KEY = ['timeslots'] as const

interface TimeslotPayload {
  teacherClassId: string
  weekDay: number
  startingHour: string
}

export function useTimeslots(teacherClassId?: string) {
  const params = teacherClassId ? `?teacherClassId=${teacherClassId}` : ''
  return useQuery<Timeslot[]>({
    queryKey: [...TS_KEY, teacherClassId],
    queryFn: () => api.get<Timeslot[]>(`/timeslots${params}`),
  })
}

export function useCreateTimeslot() {
  const qc = useQueryClient()
  return useMutation<Timeslot, Error, TimeslotPayload>({
    mutationFn: (data) => api.post<Timeslot>('/timeslots', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TS_KEY }),
  })
}

export function useUpdateTimeslot() {
  const qc = useQueryClient()
  return useMutation<Timeslot, Error, { id: string } & Partial<TimeslotPayload>>({
    mutationFn: ({ id, ...data }) => api.patch<Timeslot>(`/timeslots/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TS_KEY }),
  })
}

export function useDeleteTimeslot() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/timeslots/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: TS_KEY }),
  })
}
