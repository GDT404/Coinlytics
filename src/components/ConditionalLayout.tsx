'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import BottomNavigation from '@/components/BottomNavigation'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isLoginPage, setIsLoginPage] = useState(true)

  useEffect(() => {
    setMounted(true)
    // Só atualiza após montagem para evitar mismatch
    setIsLoginPage(pathname === '/login' || pathname === '/')
  }, [pathname])

  // Durante SSR e primeira renderização, sempre renderiza sem BottomNavigation
  // para garantir que servidor e cliente renderizem o mesmo HTML inicial
  const showNavigation = mounted && !isLoginPage

  // Sempre renderiza o conteúdo, apenas ajusta o layout
  return (
    <>
      <main className="min-h-screen p-6 pb-24">
        {children}
      </main>
      {showNavigation && <BottomNavigation />}
    </>
  )
}
