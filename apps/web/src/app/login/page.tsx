'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import { Role } from '@/types'
import { GraduationCap, ArrowRight } from 'lucide-react'

const ROLE_HOME: Record<Role, string> = {
  [Role.ADMIN]: '/admin',
  [Role.TEACHER]: '/teacher',
  [Role.STUDENT]: '/student',
}

interface FormValues {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>()

  async function onSubmit(values: FormValues) {
    setServerError(null)
    try {
      const { accessToken, user } = await authApi.login(values.email, values.password)
      setAuth(user, accessToken)
      router.replace(ROLE_HOME[user.role] ?? '/')
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Login failed')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-edu-bg selection:bg-edu-primary/10">
      {/* Decorative blur orbs */}
      <div className="fixed -top-24 -right-24 w-96 h-96 rounded-full blur-3xl -z-10 bg-edu-primary/5 pointer-events-none" />
      <div className="fixed -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl -z-10 bg-edu-primary/5 pointer-events-none" />

      <div className="w-full max-w-sm">
        <div className="edu-card p-10">
          {/* Branding */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-edu-surface-low flex items-center justify-center mb-6">
              <GraduationCap className="w-8 h-8 text-edu-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-edu-primary mb-2">
              Eduportal
            </h1>
            <p className="text-sm tracking-tight text-edu-on-surface-variant">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <EduField
              id="email"
              label="Email"
              error={errors.email?.message}
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@school.edu"
                className="edu-input"
                {...register('email', { required: 'Email is required' })}
              />
            </EduField>

            <EduField
              id="password"
              label="Password"
              error={errors.password?.message}
            >
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="edu-input"
                {...register('password', { required: 'Password is required' })}
              />
            </EduField>

            {serverError && (
              <div className="px-4 py-3 rounded text-sm bg-edu-error/10 text-edu-error">
                {serverError}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="edu-btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold disabled:opacity-60"
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="font-mono text-xs text-edu-on-surface-variant/50">
              The Eduportal · v1.0
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

function EduField({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-widest mb-2 px-1 text-edu-on-surface-variant">
        {label}
      </label>
      <div className="relative group">
        {/* Ink bar — scales in on focus */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-edu-primary origin-center scale-y-0 group-focus-within:scale-y-100 transition-transform duration-200" />
        {children}
      </div>
      {error && (
        <p className="mt-1.5 px-1 text-xs text-edu-error">{error}</p>
      )}
    </div>
  )
}
