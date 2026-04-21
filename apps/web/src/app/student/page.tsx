'use client'

import Link from 'next/link'
import { Calendar, BarChart2, BookOpen, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const shortcuts = [
  { href: '/student/schedule',          icon: Calendar,  title: 'Schedule',   subtitle: 'Weekly classes',  cta: 'VIEW TIMETABLE' },
  { href: '/student/gradebook',         icon: BarChart2, title: 'Gradebook',  subtitle: 'Grades & avgs',   cta: 'CHECK STATS'    },
  { href: '/student/lesson-instances',  icon: BookOpen,  title: 'Lesson Log', subtitle: 'Topics covered',  cta: 'READ ARCHIVE'   },
]

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="pb-10">
      {/* Welcome header */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-edu-on-surface mb-3">
          Welcome, {user?.firstName ?? 'Student'}
        </h1>
        <p className="text-edu-outline text-lg max-w-2xl leading-relaxed">
          Your Eduportal is ready. Check your schedule, grades, and lesson history below.
        </p>
      </div>

      {/* Shortcut cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {shortcuts.map(({ href, icon: Icon, title, subtitle, cta }) => (
          <Link key={href} href={href} className="edu-shortcut-card group p-8 block">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-edu-surface-low flex items-center justify-center mb-6 group-hover:bg-edu-primary/10 transition-colors">
                  <Icon className="w-6 h-6 text-edu-primary" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-2 text-edu-on-surface">{title}</h3>
                <p className="text-edu-outline">{subtitle}</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-edu-primary font-bold text-xs font-mono tracking-wider group-hover:translate-x-1 transition-transform">
                {cta} <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Focus card */}
        <div className="lg:col-span-8 bg-edu-surface-low rounded-xl p-10 flex flex-col md:flex-row gap-8 items-center border border-edu-outline-variant/20">
          <div className="flex-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-edu-primary font-bold bg-edu-primary/10 px-3 py-1 rounded-full">
              Next Lesson
            </span>
            <h2 className="text-3xl font-black tracking-tighter mt-4 mb-3 text-edu-on-surface">
              Check Your Schedule
            </h2>
            <p className="text-edu-on-surface-variant leading-relaxed mb-6">
              View today&apos;s classes and upcoming events. Stay on top of your academic timetable.
            </p>
            <Link href="/student/schedule" className="edu-btn-primary inline-flex items-center gap-3 px-8 py-3 rounded-md font-bold">
              View Schedule <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="w-full md:w-48 h-48 rounded-xl bg-edu-surface-high flex items-center justify-center rotate-2 shadow-2xl">
            <Calendar className="w-20 h-20 text-edu-primary/30" />
          </div>
        </div>

        {/* Stats rail */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="edu-card p-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-edu-outline mb-6">Gradebook</h4>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black tracking-tighter text-edu-primary leading-none">—</span>
            </div>
            <div className="mt-6 h-1 bg-edu-surface-high rounded-full overflow-hidden">
              <div className="h-full bg-edu-primary w-0" />
            </div>
            <Link href="/student/gradebook" className="mt-4 inline-flex items-center gap-1 text-xs font-mono font-bold text-edu-primary uppercase tracking-wider hover:opacity-80">
              Open gradebook <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-edu-surface-highest p-6 rounded-xl border border-edu-outline-variant/20 flex flex-col justify-between min-h-[180px]">
            <h4 className="font-mono text-xs uppercase tracking-widest text-edu-on-surface mb-4">Quick Access</h4>
            <div className="space-y-3">
              {shortcuts.map(({ href, title, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-3 text-sm font-medium text-edu-on-surface hover:text-edu-primary transition-colors">
                  <Icon className="w-4 h-4 text-edu-primary" />
                  {title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
