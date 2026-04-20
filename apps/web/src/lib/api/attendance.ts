import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { Attendance } from './types'
import type { AttendanceStatus } from '@/types'

const ATT_KEY = ['attendance'] as const

export interface AttendanceEntry {
  studentId: string
  status: AttendanceStatus
}

interface BatchAttendancePayload {
  teacherClassId: string
  date: string
  entries: AttendanceEntry[]
}

export function useAttendances(teacherClassId?: string, date?: string) {
  const params = new URLSearchParams()
  if (teacherClassId) params.set('teacherClassId', teacherClassId)
  if (date) params.set('date', date)
  const qs = params.toString()

  return useQuery<Attendance[]>({
    queryKey: [...ATT_KEY, teacherClassId, date],
    queryFn: () => api.get<Attendance[]>(`/attendance${qs ? `?${qs}` : ''}`),
    enabled: !!teacherClassId,
  })
}

export function useBatchAttendanceUpsert() {
  const qc = useQueryClient()
  return useMutation<Attendance[], Error, BatchAttendancePayload>({
    mutationFn: (data) => api.post<Attendance[]>('/attendance', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ATT_KEY }),
  })
}

export function useDeleteAttendance() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/attendance/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ATT_KEY }),
  })
}
