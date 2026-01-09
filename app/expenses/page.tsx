'use client'

import { useState } from 'react'
import { calculateSummary } from '@/services/finance'
import { Expense } from '@/domain/finance/expense'

export default function ExpensesPage() {
  const [income, setIncome] = useState<number>(0)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [summary, setSummary] = useState<{
    totalExpenses: number
    balance: number
    expenseRatio: number
  } | null>(null)

  function addExpense() {
    if (!description || amount <= 0) return

    setExpenses(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description,
        amount,
        category: 'outros',
        date: new Date().toISOString()
      }
    ])

    setDescription('')
    setAmount(0)
  }

  function handleAnalyze() {
    const result = calculateSummary(income, expenses)
    setSummary(result)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-sm p-8 space-y-8">
        <header className="text-center space-y-1">
          <h1 className="text-3xl font-bold">Coinlytics</h1>
          <p className="text-gray-500 text-sm">
            Analise seus gastos de forma simples
          </p>
        </header>
  
        {/* Renda */}
        <section className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Renda mensal
          </label>
          <input
            type="number"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={income}
            onChange={e => setIncome(Number(e.target.value))}
          />
        </section>
  
        {/* Gasto */}
        <section className="space-y-3 border rounded-lg p-4">
          <h2 className="font-semibold text-gray-700">
            Novo gasto
          </h2>
  
          <input
            type="text"
            placeholder="Descrição"
            className="w-full border rounded-lg px-3 py-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
  
          <input
            type="number"
            placeholder="Valor"
            className="w-full border rounded-lg px-3 py-2"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
          />
  
          <button
            onClick={addExpense}
            className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition"
          >
            Adicionar gasto
          </button>
        </section>
  
        {/* Lista */}
        {expenses.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-600">
              Gastos adicionados
            </h3>
  
            <ul className="space-y-1 text-sm">
              {expenses.map(expense => (
                <li
                  key={expense.id}
                  className="flex justify-between border-b py-1"
                >
                  <span>{expense.description}</span>
                  <span className="font-medium">
                    R$ {expense.amount}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
  
        {/* Análise */}
        <button
          onClick={handleAnalyze}
          className="w-full bg-black text-white py-3 rounded-lg text-lg hover:opacity-90 transition"
        >
          Analisar
        </button>
  
        {/* Resultado */}
        {summary && (
          <section className="bg-gray-100 rounded-lg p-4 space-y-2 text-sm">
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
