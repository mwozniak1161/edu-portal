import { NavSidebar } from './nav-sidebar'
import type { NavItem } from '@/types'

interface PanelLayoutProps {
  navItems: NavItem[]
  sidebarFooter?: React.ReactNode
  children: React.ReactNode
}

export function PanelLayout({ navItems, sidebarFooter, children }: PanelLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-edu-bg">
      <NavSidebar navItems={navItems} footer={sidebarFooter} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl px-8 py-10">{children}</div>
      </main>
    </div>
  )
}
