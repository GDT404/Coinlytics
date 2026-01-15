    'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function NewExpensePage() {
  const router = useRouter()

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
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
      console.error(error)
      alert('Erro ao salvar despesa')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 text-white"
      >
        <h1 className="text-xl font-bold">➕ Nova Despesa</h1>

        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className="w-full bg-zinc-800 rounded px-3 py-2 outline-none"
        />

        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          className="w-full bg-zinc-800 rounded px-3 py-2 outline-none"
        />

        <input
          type="text"
          placeholder="Categoria"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          className="w-full bg-zinc-800 rounded px-3 py-2 outline-none"
        />

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className="w-full bg-zinc-800 rounded px-3 py-2 outline-none"
        />

        <button
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 transition py-2 rounded"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  )
}
