'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  LayoutDashboard,
  Wallet,
  Lightbulb,
  LogOut,
  DollarSign,
} from 'lucide-react'
import clsx from 'clsx'

const items = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Despesas',
    href: '/expenses',
    icon: Wallet,
  },
  {
    label: 'Dicas & Alertas',
    href: '/tips',
    icon: Lightbulb,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="
        fixed left-0 top-0 z-40
        h-screen
        w-16 hover:w-64
        bg-zinc-900 border-r border-zinc-800
        transition-all duration-300
        overflow-hidden
        group
      "
    >
      <div className="flex flex-col h-full">
        {/* LOGO */}
        <div className="h-16 flex items-center gap-3 px-4 text-white">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="hidden group-hover:block min-w-0">
            <div className="font-bold text-sm">Coinlytics</div>
            <div className="text-xs text-zinc-400">Controle de Gastos</div>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-2 space-y-1 mt-4">
          {items.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || 
              (item.href === '/dashboard' && pathname?.startsWith('/dashboard'))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden group-hover:block whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-2 border-t border-zinc-800">
          <button
            className="
              flex items-center gap-3
              w-full px-3 py-2.5
              text-zinc-400 hover:text-white
              hover:bg-zinc-800 rounded-lg
              transition-colors
            "
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden group-hover:block whitespace-nowrap">
              Sair
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
