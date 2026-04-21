'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { ShowFor } from '@/components/auth/show-for'
import { PanelLayout } from '@/components/layout/panel-layout'
import { Role } from '@/types'
import { CalendarCheck, BookMarked, ClipboardList, LayoutDashboard } from 'lucide-react'

const teacherNav = [
  { label: 'Dashboard', href: '/teacher', icon: LayoutDashboard, exact: true },
  { label: 'Attendance', href: '/teacher/attendance', icon: CalendarCheck },
  { label: 'Grades', href: '/teacher/grades', icon: BookMarked },
  { label: 'Lesson Instances', href: '/teacher/lesson-instances', icon: ClipboardList },
]

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <ShowFor roles={[Role.TEACHER]} fallback={<div className="p-8 text-center text-muted-foreground">Access denied.</div>}>
        <PanelLayout navItems={teacherNav}>{children}</PanelLayout>
      </ShowFor>
    </ProtectedRoute>
  )
}
