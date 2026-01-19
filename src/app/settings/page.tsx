'use client'

import { AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Ajustes e preferências
        </p>
      </header>

      <div className="bg-orange-600/20 border border-orange-600/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2 text-orange-400">Em Produção</h3>
            <p className="text-zinc-300">
              Esta página está em desenvolvimento e estará disponível em breve. 
              Em breve você poderá personalizar suas configurações e preferências aqui.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
