import { api } from './client'
import type { AuthUser } from '@/types'

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),

  logout: () => api.post<void>('/auth/logout', {}),

  demoLogin: () => api.post<LoginResponse>('/auth/demo', {}),
}
