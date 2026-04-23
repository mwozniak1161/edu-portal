'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { authApi } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface FormValues {
  password: string;
  confirm: string;
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    if (!token) router.replace('/forgot-password');
  }, [token, router]);

  async function onSubmit(values: FormValues) {
    if (!token) return;
    setServerError(null);
    try {
      await authApi.resetPassword(token, values.password);
      setDone(true);
      setTimeout(() => router.replace('/login'), 3000);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong');
    }
  }

  if (!token) return null;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-edu-bg selection:bg-edu-primary/10">
      <div className="fixed -top-24 -right-24 w-96 h-96 rounded-full blur-3xl -z-10 bg-edu-primary/5 pointer-events-none" />
      <div className="fixed -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl -z-10 bg-edu-primary/5 pointer-events-none" />

      <div className="w-full max-w-sm">
        <div className="edu-card p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-edu-surface-low flex items-center justify-center mb-6">
              <GraduationCap className="w-8 h-8 text-edu-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-edu-primary mb-2">
              Eduportal
            </h1>
            <p className="text-sm tracking-tight text-edu-on-surface-variant">
              Choose a new password
            </p>
          </div>

          {done ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm text-edu-on-surface-variant leading-relaxed">
                Password updated. Redirecting you to sign in…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <EduField id="password" label="New password" error={errors.password?.message}>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="edu-input"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                />
              </EduField>

              <EduField id="confirm" label="Confirm password" error={errors.confirm?.message}>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="edu-input"
                  {...register('confirm', {
                    required: 'Please confirm your password',
                    validate: (v) => v === watch('password') || 'Passwords do not match',
                  })}
                />
              </EduField>

              {serverError && (
                <div className="px-4 py-3 rounded text-sm bg-edu-error/10 text-edu-error">
                  {serverError}
                </div>
              )}

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="edu-btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving…' : 'Set new password'}
                </button>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-edu-on-surface-variant hover:text-edu-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function EduField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-widest mb-2 px-1 text-edu-on-surface-variant"
      >
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-edu-primary origin-center scale-y-0 group-focus-within:scale-y-100 transition-transform duration-200" />
        {children}
      </div>
      {error && <p className="mt-1.5 px-1 text-xs text-edu-error">{error}</p>}
    </div>
  );
}
