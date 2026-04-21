'use client'

import Link from 'next/link'
import { CalendarCheck, BookMarked, ClipboardList, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const shortcuts = [
  { href: '/teacher/attendance',        icon: CalendarCheck, title: 'Attendance',       subtitle: 'Daily records',      cta: 'TAKE ATTENDANCE' },
  { href: '/teacher/grades',            icon: BookMarked,    title: 'Grades',           subtitle: 'Marks & averages',   cta: 'MANAGE GRADES'   },
  { href: '/teacher/lesson-instances',  icon: ClipboardList, title: 'Lesson Log',       subtitle: 'Topics & comments',  cta: 'VIEW LOG'        },
]

export default function TeacherDashboard() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="pb-10">
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-edu-on-surface mb-3">
          Welcome, {user?.firstName ?? 'Teacher'}
        </h1>
        <p className="text-edu-outline text-lg max-w-2xl leading-relaxed">
          Manage your classes, record attendance, and track student progress.
        </p>
      </div>

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

      <div className="bg-edu-surface-low rounded-xl p-8 border border-edu-outline-variant/20">
        <span className="font-mono text-[10px] uppercase tracking-widest text-edu-primary font-bold bg-edu-primary/10 px-3 py-1 rounded-full">
          Teaching Tools
        </span>
        <h2 className="text-2xl font-black tracking-tighter mt-4 mb-2 text-edu-on-surface">
          Your Classroom Management Hub
        </h2>
        <p className="text-edu-on-surface-variant leading-relaxed mb-6 max-w-xl">
          Record attendance, manage grades with weighted averages, and log lesson topics for each session.
        </p>
        <div className="flex flex-wrap gap-3">
          {shortcuts.map(({ href, title }) => (
            <Link key={href} href={href} className="edu-btn-secondary text-xs font-mono font-bold uppercase tracking-wider bg-edu-surface px-4 py-2 rounded-md hover:shadow-sm transition-all">
              {title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
