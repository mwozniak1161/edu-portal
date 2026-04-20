import { PageHeader } from '@/components/layout/page-header'
import { Calendar, BookOpen, ClipboardList } from 'lucide-react'
import Link from 'next/link'

const cards = [
  {
    href: '/student/schedule',
    icon: Calendar,
    title: 'Schedule',
    description: 'View your weekly timetable.',
  },
  {
    href: '/student/gradebook',
    icon: BookOpen,
    title: 'Gradebook',
    description: 'Check your grades and weighted averages per subject.',
  },
  {
    href: '/student/lesson-instances',
    icon: ClipboardList,
    title: 'Lesson Log',
    description: 'Browse lesson topics and teacher comments.',
  },
]

export default function StudentDashboard() {
  return (
    <div>
      <PageHeader title="Student Panel" description="Your schedule, grades, and lesson history." />
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
