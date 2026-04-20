'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/types'

interface AuthState {
  _hasHydrated: boolean
  user: AuthUser | null
  accessToken: string | null
  setHasHydrated: (val: boolean) => void
  setAuth: (user: AuthUser, accessToken: string) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      user: null,
      accessToken: null,
      setHasHydrated: (val) => set({ _hasHydrated: val }),
      setAuth: (user, accessToken) => set({ user, accessToken }),
      clearAuth: () => set({ user: null, accessToken: null }),
      isAuthenticated: () => get().user !== null && get().accessToken !== null,
    }),
    {
      name: 'edu-portal-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
