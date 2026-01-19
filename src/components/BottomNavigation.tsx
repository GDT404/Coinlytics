'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  PlusCircle,
  Lightbulb,
  Settings,
} from 'lucide-react'
import clsx from 'clsx'

const items = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Gastos',
    href: '/expenses',
    icon: PlusCircle,
  },
  {
    label: 'Insights',
    href: '/tips',
    icon: Lightbulb,
  },
  {
    label: 'Configurações',
    href: '/settings',
    icon: Settings,
  },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-2 py-2 shadow-2xl flex items-center gap-1">
        {items.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href === '/dashboard' && pathname === '/dashboard') ||
            (item.href === '/expenses' && (pathname === '/expenses' || pathname === '/expenses/new')) ||
            (item.href === '/tips' && pathname === '/tips') ||
            (item.href === '/settings' && pathname === '/settings')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 relative',
                isActive
                  ? 'text-emerald-500'
                  : 'text-zinc-400 hover:text-zinc-300'
              )}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500 shadow-lg shadow-emerald-500/50 bg-emerald-500/10" />
              )}
              <Icon 
                className={clsx(
                  'w-6 h-6 relative z-10',
                  isActive ? 'text-emerald-400' : 'text-zinc-400'
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
