'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Calendar,
} from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { useBaseSalary } from '@/hooks/useBaseSalary'
import SalaryProgress from '@/components/salaryProgress'


import ExpensesByPeriodChart from '@/components/ExpensesByPeriodChart'
import ExpensesByCategoryChart from '@/components/ExpensesByCategoryChart'
import ExpensesTrendChart from '@/components/ExpensesTrendChart'
import TotalExpensesChart from '@/components/TotalExpensesChart'

type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: string
  created_at: string
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<string[]>([])

  const { baseSalary: salary } = useBaseSalary()

  useEffect(() => {
    async function loadExpenses() {
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: true })

      setExpenses((data as Expense[]) || [])
      setLoading(false)
    }

    loadExpenses()
  }, [])

  const {
    periodExpenses,
    categoryExpenses,
    trendData,
    totalEvolution,
    periodTotal,
    totalGeral,
    average,
    previousPeriodTotal,
    periodChange,
    referenceSalary,
    percentOfSalary,
  } = useMemo(() => {
    const now = new Date()

    const filterByPeriod = (expense: Expense) => {
      const d = new Date(expense.date)
      if (period === 'week') {
        return d >= new Date(now.getTime() - 7 * 86400000)
      }
      if (period === 'month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }
      return d.getFullYear() === now.getFullYear()
    }

    const filtered = expenses.filter(filterByPeriod)

    const periodTotal = filtered.reduce((s, e) => s + e.amount, 0)
    const totalGeral = expenses.reduce((s, e) => s + e.amount, 0)
    const average = expenses.length ? totalGeral / expenses.length : 0

    const categoryMap: Record<string, number> = {}
    filtered.forEach(e => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount
    })

    const categoryExpenses = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }))

    const referenceSalary =
      period === 'week' ? salary / 4 :
      period === 'month' ? salary :
      salary * 12

    const percentOfSalary =
      referenceSalary > 0 ? (periodTotal / referenceSalary) * 100 : null

    return {
      periodExpenses: [],
      categoryExpenses,
      trendData: [],
      totalEvolution: [],
      periodTotal,
      totalGeral,
      average,
      previousPeriodTotal: 0,
      periodChange: '0',
      referenceSalary,
      percentOfSalary,
    }
  }, [expenses, period, salary])

  useEffect(() => {
    if (!salary || !percentOfSalary) {
      setInsights([])
      return
    }

    const list: string[] = []

    if (percentOfSalary > 100)
      list.push('Você gastou mais que seu salário neste período.')
    else if (percentOfSalary > 75)
      list.push('Atenção: seus gastos estão elevados.')
    else
      list.push('Boa! Seus gastos estão sob controle.')

    setInsights(list)
  }, [salary, percentOfSalary])

  if (loading) return null

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Visão geral dos seus gastos</p>
          <p className="text-xs text-emerald-400 mt-2">
            Salário base: <strong>R$ {salary.toLocaleString('pt-BR')}</strong>
          </p>
        </div>

        <select
          value={period}
          onChange={e => setPeriod(e.target.value as any)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
        >
          <option value="week">Semanal</option>
          <option value="month">Mensal</option>
          <option value="year">Anual</option>
        </select>
      </header>

      {insights.length > 0 && (
        <div className="bg-zinc-800 border border-emerald-700/30 rounded-xl p-4">
          <ul className="list-disc pl-4 text-sm">
            {insights.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  <Kpi title="Total do período" value={periodTotal} icon={<Wallet />} color="emerald" />
  <Kpi title="Total geral" value={totalGeral} icon={<Calendar />} color="blue" />
  <Kpi title="Despesas" value={expenses.length} icon={<TrendingUp />} color="purple" />
  <Kpi title="Média" value={average} icon={<TrendingDown />} color="orange" />
  <Kpi title="% do salário" value={percentOfSalary ?? 0} suffix="%" icon={<Wallet />} color="pink" />
</div>
{percentOfSalary !== null && (
  <SalaryProgress percent={percentOfSalary} />
)}



      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensesByPeriodChart data={periodExpenses} periodType={period} />
        <ExpensesByCategoryChart data={categoryExpenses} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensesTrendChart data={trendData} />
        <TotalExpensesChart data={totalEvolution} />
      </div>
    </div>
  )
}

function Kpi({
  title,
  value,
  suffix = '',
  icon,
  color = 'emerald',
}: {
  title: string
  value: number
  suffix?: string
  icon: React.ReactNode
  color?: 'emerald' | 'blue' | 'purple' | 'orange' | 'pink'
}) {
  const colors: Record<string, string> = {
    emerald: 'from-emerald-600/20 to-emerald-700/10 border-emerald-600/30 text-emerald-400',
    blue: 'from-blue-600/20 to-blue-700/10 border-blue-600/30 text-blue-400',
    purple: 'from-purple-600/20 to-purple-700/10 border-purple-600/30 text-purple-400',
    orange: 'from-orange-600/20 to-orange-700/10 border-orange-600/30 text-orange-400',
    pink: 'from-pink-600/20 to-pink-700/10 border-pink-600/30 text-pink-400',
  }

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-6 
      hover:shadow-lg hover:shadow-${color}-500/20 transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-${color}-600/20`}>
          {icon}
        </div>
        <span className="text-sm text-zinc-400">{title}</span>
      </div>

      <p className="text-3xl font-bold">
        {suffix === '%'
          ? `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
          : `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
      </p>
    </div>
  )
}

