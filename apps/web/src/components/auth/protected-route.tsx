'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const hasHydrated = useAuthStore((s) => s._hasHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) router.replace('/login')
  }, [hasHydrated, isAuthenticated, router])

  if (!hasHydrated) return null
  if (!isAuthenticated) return null
  return <>{children}</>
}
