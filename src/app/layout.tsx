import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import type { Metadata } from 'next' // Importe o tipo para garantir o TypeScript

// Esta é a parte que controla a aba do navegador
export const metadata: Metadata = {
  title: 'Coinlytics', // Nome que aparece na aba
  description: 'Sua plataforma de análise de cripto',
  icons: {
    icon: '/Favicon.ico', // O arquivo favicon.ico deve estar na pasta /public
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body
        className="bg-zinc-950 text-white"
        suppressHydrationWarning
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}