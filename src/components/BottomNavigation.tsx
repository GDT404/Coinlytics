'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Lightbulb, Settings } from 'lucide-react'
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock'
import { cn } from '@/lib/utils'

const items = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Gastos', href: '/expenses', icon: PlusCircle },
  { label: 'Insights', href: '/tips', icon: Lightbulb },
  { label: 'Configurações', href: '/settings', icon: Settings },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    // Centraliza o menu na parte inferior da tela
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <Dock className="bg-zinc-900/90 border-zinc-800 backdrop-blur-md">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <DockItem 
                className={cn(
                  "rounded-full transition-colors",
                  isActive ? "bg-emerald-500/20" : "bg-zinc-800"
                )}
              >
                {/* O texto que aparece quando você passa o mouse */}
                <DockLabel>{item.label}</DockLabel>
                
                {/* O ícone que cresce e diminui */}
                <DockIcon>
                  <Icon 
                    className={cn(
                      "w-full h-full p-1",
                      isActive ? "text-emerald-400" : "text-zinc-400"
                    )} 
                  />
                </DockIcon>
              </DockItem>
            </Link>
          )
        })}
      </Dock>
    </div>
  )
}