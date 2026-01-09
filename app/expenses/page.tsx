'use client'

import { useState } from 'react'
import { calculateSummary } from '@/services/finance'
import { Expense } from '@/domain/finance/expense'

export default function ExpensesPage() {
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [summary, setSummary] = useState<any>(null)

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0)

  function addExpense() {
    if (!description || amount <= 0) return

    setExpenses(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description,
        amount,
        category: 'outros',
        date: new Date().toISOString(),
      },
    ])

    setDescription('')
    setAmount(0)
  }

  function handleAnalyze() {
    const result = calculateSummary(income, expenses)
    setSummary(result)
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <header className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">
            Coinlytics
          </h1>
          <p className="text-gray-500 text-sm">
            Controle e análise de gastos pessoais
          </p>
        </header>

        <section className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Renda mensal
          </label>
          <input
            type="number"
            value={income}
            onChange={e => setIncome(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-800">
            Adicionar gasto
          </h2>

          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="number"
            placeholder="Valor"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            onClick={addExpense}
            className="w-full bg-gray-200 py-2 rounded-lg font-medium hover:bg-gray-300"
          >
            Adicionar gasto
          </button>

          {expenses.length === 0 && (
            <p className="text-sm text-gray-400">
              Nenhum gasto adicionado
            </p>
          )}

          <ul className="space-y-2">
            {expenses.map(expense => (
              <li
                key={expense.id}
                className="flex justify-between text-sm border rounded-lg px-3 py-2"
              >
                <span>{expense.description}</span>
                <span className="font-medium">
                  R$ {expense.amount}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <button
          onClick={handleAnalyze}
          className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90"
        >
          Analisar gastos
        </button>

        {summary && (
          <section className="border-t pt-4 space-y-2 text-sm">
            <p>
              <strong>Total de gastos:</strong> R$ {summary.totalExpenses}
            </p>
            <p>
              <strong>Saldo:</strong> R$ {summary.balance}
            </p>
            <p>
              <strong>Renda comprometida:</strong>{' '}
              {summary.expenseRatio.toFixed(2)}%
            </p>
          </section>
        )}
      </div>
    </main>
  )
}
