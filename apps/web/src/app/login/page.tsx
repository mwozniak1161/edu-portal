'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormError } from '@/components/feedback/form-error'
import { Role } from '@/types'

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
    <main className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm bg-background rounded-xl border shadow-sm p-8 space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register('email', { required: 'Email is required' })}
            />
            <FormError message={errors.email?.message} />
          </div>

          <div className="space-y-1">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
            />
            <FormError message={errors.password?.message} />
          </div>

          {serverError && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-2">
              {serverError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  )
}
