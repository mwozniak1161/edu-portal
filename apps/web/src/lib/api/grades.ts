import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { Grade, GradeAverage } from './types'

const GRADE_KEY = ['grades'] as const

interface CreateGradePayload {
  value: number
  weight?: number
  comment?: string
  studentId: string
  teacherClassId: string
}

interface UpdateGradePayload {
  value?: number
  weight?: number
  comment?: string
}

interface CreateCorrectionPayload {
  correctionForId: string
  value: number
  weight?: number
  comment?: string
}

export function useGrades(teacherClassId?: string, studentId?: string) {
  const params = new URLSearchParams()
  if (teacherClassId) params.set('teacherClassId', teacherClassId)
  if (studentId) params.set('studentId', studentId)
  const qs = params.toString()

  return useQuery<Grade[]>({
    queryKey: [...GRADE_KEY, teacherClassId, studentId],
    queryFn: () => api.get<Grade[]>(`/grades${qs ? `?${qs}` : ''}`),
    enabled: !!teacherClassId,
  })
}

export function useGradeAverage(teacherClassId: string, studentId: string) {
  return useQuery<GradeAverage>({
    queryKey: ['grade-average', teacherClassId, studentId],
    queryFn: () => api.get<GradeAverage>(`/grades/average/${teacherClassId}/${studentId}`),
    enabled: !!teacherClassId && !!studentId,
  })
}

export function useCreateGrade() {
  const qc = useQueryClient()
  return useMutation<Grade, Error, CreateGradePayload>({
    mutationFn: (data) => api.post<Grade>('/grades', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: GRADE_KEY }),
  })
}

export function useUpdateGrade() {
  const qc = useQueryClient()
  return useMutation<Grade, Error, { id: string } & UpdateGradePayload>({
    mutationFn: ({ id, ...data }) => api.patch<Grade>(`/grades/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: GRADE_KEY }),
  })
}

export function useCreateCorrectionGrade() {
  const qc = useQueryClient()
  return useMutation<Grade, Error, CreateCorrectionPayload>({
    mutationFn: (data) => api.post<Grade>('/grades/correction', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: GRADE_KEY }),
  })
}

export function useDeleteGrade() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/grades/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: GRADE_KEY }),
  })
}
