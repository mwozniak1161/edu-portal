'use client'

import { useAuthStore } from '@/store/auth.store'
import type { Role } from '@/types'

interface ShowForProps {
  roles: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ShowFor({ roles, children, fallback = null }: ShowForProps) {
  const hasHydrated = useAuthStore((s) => s._hasHydrated)
  const user = useAuthStore((s) => s.user)

  if (!hasHydrated) return null
  if (!user || !roles.includes(user.role)) return <>{fallback}</>
  return <>{children}</>
}
