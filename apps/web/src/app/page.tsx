'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/auth.store'
import { Role } from '@/types'

const DEMO_ENABLED = process.env.NEXT_PUBLIC_DEMO_ENABLED === 'true'

const ROLE_HOME: Record<Role, string> = {
  [Role.ADMIN]: '/admin',
  [Role.TEACHER]: '/teacher',
  [Role.STUDENT]: '/student',
}

export default function Home() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onDemoLogin() {
    setLoading(true)
    setError(null)
    try {
      const { accessToken, user } = await authApi.demoLogin()
      setAuth(user, accessToken)
      router.replace(ROLE_HOME[user.role] ?? '/')
    } catch {
      setError('Demo login unavailable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-edu-background flex flex-col items-center justify-center px-6 py-16">
      <div className="fixed -top-24 -right-24 w-96 h-96 rounded-full blur-3xl -z-10 bg-edu-primary/5 pointer-events-none" />
      <div className="fixed -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl -z-10 bg-edu-primary/5 pointer-events-none" />

      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-black tracking-tighter text-edu-primary mb-3">
          EduPortal
        </h1>
        <p className="text-edu-on-surface-variant text-base mb-10">
          A portfolio-grade Educational ERP — manage classes, grades, attendance, and schedules in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {DEMO_ENABLED && (
            <>
              <button
                onClick={onDemoLogin}
                disabled={loading}
                className="edu-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold disabled:opacity-60"
              >
                {loading ? 'Loading…' : 'Enter as admin (demo)'}
                <ShieldCheck className="w-4 h-4" />
              </button>
              <button
                onClick={onDemoLogin}
                disabled={loading}
                className="edu-btn-secondary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold disabled:opacity-60"
              >
                {loading ? 'Loading…' : 'Enter as teacher (demo)'}
                <ShieldCheck className="w-4 h-4" />
              </button>
              <button
                onClick={onDemoLogin}
                disabled={loading}
                className="edu-btn-secondary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold disabled:opacity-60"
              >
                {loading ? 'Loading…' : 'Enter as student (demo)'}
                <ShieldCheck className="w-4 h-4" />
              </button>
            </>
          )}
          <Link
            href="/login"
            className="edu-btn-secondary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold"
          >
            Log In
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="mailto:nyhar98@gmail.com"
            className="inline-flex items-center justify-center rounded-xl border border-edu-outline text-edu-on-surface px-6 py-3 text-sm font-semibold hover:bg-edu-surface transition-colors"
          >
            Contact
          </a>
        </div>

        {error && (
          <p className="mt-4 text-sm text-edu-error">{error}</p>
        )}
      </div>
    </main>
  )
}
