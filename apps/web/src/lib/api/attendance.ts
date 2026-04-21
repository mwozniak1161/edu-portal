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
  lessonInstanceId: string
  entries: AttendanceEntry[]
}

export function useAttendances(lessonInstanceId?: string) {
  const qs = lessonInstanceId ? `?lessonInstanceId=${lessonInstanceId}` : ''

  return useQuery<Attendance[]>({
    queryKey: [...ATT_KEY, lessonInstanceId],
    queryFn: () => api.get<Attendance[]>(`/attendance${qs}`),
    enabled: !!lessonInstanceId,
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
