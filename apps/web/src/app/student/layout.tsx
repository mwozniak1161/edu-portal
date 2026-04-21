'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { ShowFor } from '@/components/auth/show-for'
import { PanelLayout } from '@/components/layout/panel-layout'
import { Role } from '@/types'
import { Calendar, BookOpen, ClipboardList, LayoutDashboard } from 'lucide-react'

const studentNav = [
  { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { label: 'Schedule', href: '/student/schedule', icon: Calendar },
  { label: 'Gradebook', href: '/student/gradebook', icon: BookOpen },
  { label: 'Lesson Log', href: '/student/lesson-instances', icon: ClipboardList },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <ShowFor roles={[Role.STUDENT]} fallback={<div className="p-8 text-center text-muted-foreground">Access denied.</div>}>
        <PanelLayout navItems={studentNav}>{children}</PanelLayout>
      </ShowFor>
    </ProtectedRoute>
  )
}
