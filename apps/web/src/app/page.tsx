import Link from 'next/link'

export const metadata = {
  title: 'EduPortal — Educational ERP',
  description: 'Portfolio-grade educational management system',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-edu-background flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-black tracking-tighter text-edu-primary mb-3">
          EduPortal
        </h1>
        <p className="text-edu-on-surface-variant text-base mb-10">
          A portfolio-grade Educational ERP — manage classes, grades, attendance, and schedules in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-lg bg-edu-primary text-white px-6 py-3 text-sm font-semibold hover:bg-edu-primary/90 transition-colors"
          >
            View Demo
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-edu-outline text-edu-on-surface px-6 py-3 text-sm font-semibold hover:bg-edu-surface transition-colors"
          >
            Log In
          </Link>
          <a
            href="mailto:nyhar98@gmail.com"
            className="inline-flex items-center justify-center rounded-lg border border-edu-outline text-edu-on-surface px-6 py-3 text-sm font-semibold hover:bg-edu-surface transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </main>
  )
}
