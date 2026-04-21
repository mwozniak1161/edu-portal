'use client'

import Link from 'next/link'
import { Calendar, BarChart2, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const shortcuts = [
  { href: '/student/schedule',  icon: Calendar,  title: 'Schedule',  subtitle: 'Weekly classes', cta: 'VIEW TIMETABLE' },
  { href: '/student/gradebook', icon: BarChart2, title: 'Gradebook', subtitle: 'Grades & avgs',  cta: 'CHECK STATS'    },
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
          Your Eduportal is ready. Check your schedule and grades below.
        </p>
      </div>

      {/* Shortcut cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

    </div>
  )
}
