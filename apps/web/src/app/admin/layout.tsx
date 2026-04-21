'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { ShowFor } from '@/components/auth/show-for'
import { PanelLayout } from '@/components/layout/panel-layout'
import { Role } from '@/types'
import { Users, BookOpen, GraduationCap, Clock, LayoutDashboard } from 'lucide-react'

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Classes', href: '/admin/classes', icon: GraduationCap },
  { label: 'Subjects', href: '/admin/subjects', icon: BookOpen },
  { label: 'Teacher Classes', href: '/admin/teacher-classes', icon: Users },
  { label: 'Timeslots', href: '/admin/timeslots', icon: Clock },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <ShowFor roles={[Role.ADMIN]} fallback={<div className="p-8 text-center text-muted-foreground">Access denied.</div>}>
        <PanelLayout navItems={adminNav}>{children}</PanelLayout>
      </ShowFor>
    </ProtectedRoute>
  )
}
