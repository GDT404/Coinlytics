'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createExpense } from '@/services/expenses'

export default function ExpensesPage() {
  const router = useRouter()

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('outros')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createExpense({
        description,
        amount: Number(amount),
        category,
        date,
      })

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold">Adicionar gasto</h1>

        {/* DESCRIÇÃO */}
        <div>
          <label className="text-sm text-zinc-400">Descrição</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700 outline-none"
          />
        </div>

        {/* VALOR */}
        <div>
          <label className="text-sm text-zinc-400">Valor</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700 outline-none"
          />
        </div>

        {/* CATEGORIA */}
        <div>
          <label className="text-sm text-zinc-400">Categoria</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700"
          >
            <option value="alimentacao">Alimentação</option>
            <option value="moradia">Moradia</option>
            <option value="transporte">Transporte</option>
            <option value="lazer">Lazer</option>
            <option value="outros">Outros</option>
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
            className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 transition py-2 rounded font-medium"
        >
          {loading ? 'Salvando...' : 'Salvar gasto'}
        </button>
      </form>
    </div>
  )
}
