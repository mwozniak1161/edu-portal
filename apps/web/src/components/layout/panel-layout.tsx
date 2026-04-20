import { NavSidebar } from './nav-sidebar'
import type { NavItem } from '@/types'

interface PanelLayoutProps {
  navItems: NavItem[]
  sidebarFooter?: React.ReactNode
  children: React.ReactNode
}

export function PanelLayout({ navItems, sidebarFooter, children }: PanelLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <NavSidebar navItems={navItems} footer={sidebarFooter} />
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <div className="container max-w-7xl py-8 px-6">{children}</div>
      </main>
    </div>
  )
}
