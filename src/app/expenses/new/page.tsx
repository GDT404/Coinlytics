'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NewExpensePage() {
  const router = useRouter()

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Usuário não autenticado')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('expenses').insert({
      user_id: user.id,
      description,
      amount: Number(amount),
      category,
      date,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/expenses')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">➕ Nova despesa</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DESCRIÇÃO */}
          <div>
            <label className="text-sm text-zinc-400">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none"
            />
          </div>

          {/* VALOR */}
          <div>
            <label className="text-sm text-zinc-400">Valor</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none"
            />
          </div>

          {/* CATEGORIA */}
          <div>
            <label className="text-sm text-zinc-400">Categoria</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none"
            >
              <option value="">Selecione</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Lazer">Lazer</option>
              <option value="Moradia">Moradia</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          {/* DATA */}
          <div>
            <label className="text-sm text-zinc-400">Data</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-between">
            <Link
              href="/expenses"
              className="text-zinc-400 hover:text-white flex items-center gap-2"
            >
              ← Voltar para Despesas
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
