'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavSidebar } from './nav-sidebar';
import type { NavItem } from '@/types';

interface PanelLayoutProps {
  navItems: NavItem[];
  sidebarFooter?: React.ReactNode;
  children: React.ReactNode;
}

export function PanelLayout({ navItems, sidebarFooter, children }: PanelLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-edu-bg">
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar — fixed drawer on mobile, static in flex flow on desktop */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300',
          'md:relative md:z-auto md:translate-x-0 md:shrink-0',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <NavSidebar
          navItems={navItems}
          footer={sidebarFooter}
          onNavigate={() => setDrawerOpen(false)}
        />
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-edu-outline-variant/20 bg-edu-surface px-4 md:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg p-2 -ml-2 text-edu-on-surface-variant hover:bg-edu-surface-container transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-lg font-black tracking-tighter text-edu-primary">Eduportal</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl px-4 py-6 md:px-8 md:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
