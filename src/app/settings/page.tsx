'use client'

import { useState } from 'react'
import { Wallet, Save } from 'lucide-react'
import { useBaseSalary } from '@/hooks/useBaseSalary'

export default function SettingsPage() {
  const { baseSalary, setBaseSalary } = useBaseSalary()
  const [value, setValue] = useState(baseSalary.toString())

  function handleSave() {
    setBaseSalary(Number(value))
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Personalize seu controle financeiro
        </p>
      </header>

      <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/10 border border-emerald-600/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-600/20 rounded-lg">
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold">Salário base</h2>
        </div>

        <input
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 w-full mb-4"
          placeholder="Informe seu salário"
        />

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:scale-105 transition-all shadow-lg shadow-emerald-500/30"
        >
          <Save className="w-4 h-4" />
          Salvar alterações
        </button>
      </div>
    </div>
  )
}
