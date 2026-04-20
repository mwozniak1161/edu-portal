import { PageHeader } from '@/components/layout/page-header'
import { CalendarCheck, BookMarked, ClipboardList } from 'lucide-react'
import Link from 'next/link'

const cards = [
  {
    href: '/teacher/attendance',
    icon: CalendarCheck,
    title: 'Attendance',
    description: 'Record and review daily attendance for your classes.',
  },
  {
    href: '/teacher/grades',
    icon: BookMarked,
    title: 'Grades',
    description: 'Manage grades, view weighted averages, and add corrections.',
  },
  {
    href: '/teacher/lesson-instances',
    icon: ClipboardList,
    title: 'Lesson Instances',
    description: 'Log topics and comments for each lesson.',
  },
]

export default function TeacherDashboard() {
  return (
    <div>
      <PageHeader title="Teacher Panel" description="Manage your classes, grades, and attendance." />
      <div className="grid gap-4 sm:grid-cols-3 mt-2">
        {cards.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="rounded-lg border bg-card p-6 hover:border-primary transition-colors"
          >
            <Icon className="h-8 w-8 text-muted-foreground mb-3" />
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
