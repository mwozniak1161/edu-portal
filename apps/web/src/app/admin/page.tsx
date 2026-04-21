'use client'

import Link from 'next/link'
import { Users, GraduationCap, BookOpen, UserCheck, Clock } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const shortcuts = [
  { href: '/admin/users',          icon: Users,         title: 'Users',               description: 'Manage accounts, permissions, and roles.', cta: 'View Portal',      primary: true  },
  { href: '/admin/classes',        icon: GraduationCap, title: 'Classes',             description: 'Manage class groups and academic cohorts.',  cta: 'Manage Groups',    primary: false },
  { href: '/admin/subjects',       icon: BookOpen,      title: 'Subjects',            description: 'Define the academic curriculum and syllabi.', cta: 'Curriculum',       primary: false },
  { href: '/admin/teacher-classes',icon: UserCheck,     title: 'Teacher Assignments', description: 'Assign educators to class groups and subjects.', cta: 'Configure',     primary: false },
  { href: '/admin/timeslots',      icon: Clock,         title: 'Timeslots',           description: 'Define weekly recurring lesson timeslots.',   cta: 'Manage Schedule',  primary: false },
]

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user)
  const name = user ? `${user.firstName} ${user.lastName}` : 'Administrator'

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-edu-on-surface">
          Institutional Overview
        </h1>
        <p className="text-edu-outline max-w-xl leading-relaxed mt-2">
          Welcome, {name}. Orchestrate users, curriculum, and academic logistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shortcuts.map(({ href, icon: Icon, title, description, cta, primary }) => (
          <div key={href} className="edu-card group flex flex-col p-8 hover:border-edu-primary/30 transition-all duration-300">
            <div className="mb-8 w-14 h-14 rounded-xl flex items-center justify-center">
              {primary
                ? <div className="w-14 h-14 rounded-xl ink-bleed flex items-center justify-center shadow-lg"><Icon className="w-7 h-7 text-edu-on-primary" /></div>
                : <div className="w-14 h-14 rounded-xl bg-edu-surface-low flex items-center justify-center"><Icon className="w-7 h-7 text-edu-primary" /></div>
              }
            </div>
            <h4 className="text-xl font-bold tracking-tight text-edu-on-surface mb-2">{title}</h4>
            <p className="text-edu-outline text-sm leading-relaxed mb-6">{description}</p>
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-edu-outline-variant/15">
              <span className="font-data text-lg font-black text-edu-primary">—</span>
              <Link href={href} className="text-edu-primary font-bold text-xs uppercase tracking-widest hover:underline">
                {cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
