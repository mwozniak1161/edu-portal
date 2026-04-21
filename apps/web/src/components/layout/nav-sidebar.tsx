'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

interface NavSidebarProps {
  navItems: NavItem[]
  footer?: React.ReactNode
}

export function NavSidebar({ navItems, footer }: NavSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col bg-edu-surface-low shrink-0">
      <div className="px-6 py-8 mb-4">
        <span className="text-xl font-black tracking-tighter text-edu-primary">Eduportal</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors border-l-4',
                active
                  ? 'bg-edu-surface text-edu-primary border-edu-primary font-bold shadow-sm font-data'
                  : 'text-edu-on-surface-variant hover:bg-edu-surface/60 hover:text-edu-primary border-transparent font-data',
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {item.label}
            </Link>
          )
        })}
      </nav>
      {footer && (
        <div className="border-t border-edu-outline-variant/20 p-4 mt-auto">
          {footer}
        </div>
      )}
    </aside>
  )
}
