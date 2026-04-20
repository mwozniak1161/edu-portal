import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { User, UserListResponse } from './types'

const USERS_KEY = ['users'] as const

interface CreateUserPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
  isActive?: boolean
  classId?: string | null
}

interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  role?: string
  isActive?: boolean
  password?: string
  classId?: string | null
}

export function useUsers(search?: string, page = 1, limit = 20) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  params.set('page', String(page))
  params.set('limit', String(limit))

  return useQuery<UserListResponse>({
    queryKey: [...USERS_KEY, search, page, limit],
    queryFn: () => api.get<UserListResponse>(`/users?${params}`),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation<User, Error, CreateUserPayload>({
    mutationFn: (data) => api.post<User>('/users', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation<User, Error, { id: string } & UpdateUserPayload>({
    mutationFn: ({ id, ...data }) => api.patch<User>(`/users/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

export function useToggleUserStatus() {
  const qc = useQueryClient()
  return useMutation<User, Error, string>({
    mutationFn: (id) => api.patch<User>(`/users/${id}/toggle-status`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  })
}
