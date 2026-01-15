'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [total, setTotal] = useState(0)

  async function loadExpenses() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const startOfMonth = new Date()
    startOfMonth.setDate(1)

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startOfMonth.toISOString())

    if (error) {
      console.error(error)
      return
    }

    setExpenses(data)

    const sum = data.reduce((acc, item) => acc + item.amount, 0)
    setTotal(sum)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.href = '/login'
      }
    })
  
    loadExpenses()
  }, [])
  

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
  <h1 className="text-2xl font-bold">📊 Dashboard</h1>

  <div className="flex gap-3">
    <button
      onClick={async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
      }}
      className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded"
    >
      Sair
    </button>

    <Link
      href="/expenses/new"
      className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded"
    >
      + Nova despesa
    </Link>
  </div>
</header>


        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-sm">Total gasto no mês</p>
            <p className="text-2xl font-bold text-emerald-400">
              R$ {total.toFixed(2)}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-sm">Despesas registradas</p>
            <p className="text-2xl font-bold">{expenses.length}</p>
          </div>
        </div>

        {/* LISTA */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-800 text-zinc-400">
              <tr>
                <th className="p-3 text-left">Descrição</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Data</th>
                <th className="p-3">Valor</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr
                  key={expense.id}
                  className="border-t border-zinc-800"
                >
                  <td className="p-3">{expense.description}</td>
                  <td className="p-3 text-center">{expense.category}</td>
                  <td className="p-3 text-center">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center text-emerald-400">
                    R$ {expense.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {expenses.length === 0 && (
            <p className="text-center text-zinc-500 py-6">
              Nenhuma despesa registrada neste mês
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
