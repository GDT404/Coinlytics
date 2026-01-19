'use client'

import { useState, useEffect } from 'react'
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
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

// Try to access localStorage (only on client)
function getBaseSalaryFromLocalStorage(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const valor = localStorage.getItem('base-salary')
    if (valor !== null && !isNaN(Number(valor))) {
      return Number(valor)
    }
  } catch {}
  return null
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [salary, setSalary] = useState<number | null>(null)

  // First try localStorage, then fallback to supabase
  useEffect(() => {
    async function fetchInitialData() {
      let salaryValue = getBaseSalaryFromLocalStorage()
      // If not found, try supabase
      if (salaryValue === null) {
        // try buscar o mais recente da tabela base_salary caso tenha no supabase
        const { data } = await supabase
          .from('base_salary')
          .select('*')
          .order('valid_from', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (data && data.amount) {
          salaryValue = Number(data.amount)
        }
      }
      setSalary(salaryValue)

      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: true })

      setExpenses(expensesData || [])
      setLoading(false)
    }

    fetchInitialData()
  }, [])

  // Calcular totais e médias
  const total = expenses.reduce((sum, item) => sum + item.amount, 0)
  const average = expenses.length > 0 ? total / expenses.length : 0

  // Calcular gastos por período
  const getExpensesByPeriod = () => {
    const now = new Date()
    if (period === 'week') {
      const weekData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
        const dayKey = date.toISOString().split('T')[0]
        const dayExpenses = expenses.filter(e => e.date === dayKey)
        const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0)
        return {
          period: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          amount: dayTotal,
        }
      })
      return weekData
    } else if (period === 'month') {
      const monthData = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
        const monthExpenses = expenses.filter(e => {
          const expenseDate = new Date(e.date)
          return expenseDate.getMonth() === date.getMonth() &&
            expenseDate.getFullYear() === date.getFullYear()
        })
        const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        return {
          period: months[date.getMonth()],
          amount: monthTotal,
        }
      })
      return monthData
    } else {
      const years = new Set(expenses.map(e => new Date(e.date).getFullYear()))
      const sortedYears = Array.from(years).sort()
      const last5Years = sortedYears.slice(-5)
      const yearData = last5Years.map(year => {
        const yearExpenses = expenses.filter(e => {
          const expenseDate = new Date(e.date)
          return expenseDate.getFullYear() === year
        })
        return {
          period: year.toString(),
          amount: yearExpenses.reduce((sum, e) => sum + e.amount, 0),
        }
      })
      return yearData
    }
  }

  // Calcular gastos por categoria (filtrado por período)
  const getExpensesByCategory = () => {
    const now = new Date()
    let filtered = expenses
    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = expenses.filter(e => new Date(e.date) >= weekAgo)
    } else if (period === 'month') {
      filtered = expenses.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
      })
    } else {
      filtered = expenses.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate.getFullYear() === now.getFullYear()
      })
    }
    const categoryMap: Record<string, number> = {}
    filtered.forEach(expense => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount
    })
    return Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    })).sort((a, b) => b.amount - a.amount)
  }

  // Calcular tendência (últimos 30 dias)
  const getExpensesTrend = () => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= thirtyDaysAgo
    })

    const trendData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
      const dateKey = date.toISOString().split('T')[0]
      const dayExpenses = filtered.filter(e => e.date === dateKey)
      return {
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        amount: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
      }
    })
    return trendData
  }

  // Calcular evolução do total acumulado
  const getTotalEvolution = () => {
    const sortedExpenses = [...expenses].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    const monthlyData: Record<string, { period: string; total: number }> = {}
    let cumulative = 0

    sortedExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date)
      const monthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`
      const monthLabel = expenseDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          period: monthLabel,
          total: 0,
        }
      }
      monthlyData[monthKey].total += expense.amount
    })

    const result = Object.values(monthlyData).map(item => {
      cumulative += item.total
      return {
        period: item.period,
        total: item.total,
        cumulative,
      }
    })

    return result
  }

  const periodExpenses = getExpensesByPeriod()
  const categoryExpenses = getExpensesByCategory()
  const trendData = getExpensesTrend()
  const totalEvolution = getTotalEvolution()

  const periodTotal = periodExpenses.reduce((sum, item) => sum + item.amount, 0)
  const totalGeral = expenses.reduce((sum, item) => sum + item.amount, 0)

  // Calcular período anterior para comparação
  const getPreviousPeriodTotal = () => {
    const now = new Date()
    if (period === 'week') {
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const previousWeekExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate >= twoWeeksAgo && expenseDate < weekAgo
      })
      return previousWeekExpenses.reduce((sum, e) => sum + e.amount, 0)
    } else if (period === 'month') {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
      const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
      const lastMonthExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate.getMonth() === lastMonth &&
          expenseDate.getFullYear() === lastMonthYear
      })
      return lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0)
    } else {
      const lastYear = now.getFullYear() - 1
      const lastYearExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate.getFullYear() === lastYear
      })
      return lastYearExpenses.reduce((sum, e) => sum + e.amount, 0)
    }
  }

  const previousPeriodTotal = getPreviousPeriodTotal()
  const periodChange = previousPeriodTotal > 0
    ? ((periodTotal - previousPeriodTotal) / previousPeriodTotal * 100).toFixed(1)
    : '0'

  // CÁLCULOS BASEADOS NO SALÁRIO BASE
  // -- Calcula a % do salário base gasta no período selecionado --
  // Salário é mensal no app de cadastro, então para dashboard:
  const getReferenceSalary = () => {
    if (!salary) return null
    if (period === 'week') return salary / 4
    if (period === 'month') return salary
    return salary * 12
  }
  const referenceSalary = getReferenceSalary()
  const percentOfSalary = referenceSalary && referenceSalary > 0
    ? ((periodTotal / referenceSalary) * 100)
    : null

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Visão geral dos seus gastos
          </p>
          {salary && (
            <p className="text-xs text-emerald-400 mt-2">
              Salário base atual: <span className="font-semibold">R$ {salary.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="ml-2 text-zinc-500">(origem: {getBaseSalaryFromLocalStorage() ? 'local' : 'banco de dados'})</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Período:</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="week">Semanal</option>
            <option value="month">Mensal</option>
            <option value="year">Anual</option>
          </select>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/10 border border-emerald-600/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-600/20 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-zinc-400">
              Total {period === 'week' ? 'Semanal' : period === 'month' ? 'Mensal' : 'Anual'}
            </span>
          </div>
          <p className="text-3xl font-bold">
            R$ {periodTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {previousPeriodTotal > 0 && (
            <p className={`text-sm mt-2 ${parseFloat(periodChange) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {parseFloat(periodChange) > 0 ? '↑' : '↓'} {Math.abs(parseFloat(periodChange))}% vs período anterior
            </p>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-600/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-zinc-400">Total Geral</span>
          </div>
          <p className="text-3xl font-bold">
            R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-zinc-500 mt-2">Todas as despesas</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/10 border border-purple-600/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-zinc-400">Total de Despesas</span>
          </div>
          <p className="text-3xl font-bold">{expenses.length}</p>
          <p className="text-xs text-zinc-500 mt-2">Registros cadastrados</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600/20 to-orange-700/10 border border-orange-600/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <TrendingDown className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-sm text-zinc-400">Média por Despesa</span>
          </div>
          <p className="text-3xl font-bold">
            R$ {average.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-zinc-500 mt-2">Valor médio</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-900/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-700/20 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-sm text-zinc-400">
              Gastos x Salário {period === 'week' ? 'Semanal' : period === 'month' ? 'Mensal' : 'Anual'}
            </span>
          </div>
          <p className="text-3xl font-bold">
            {referenceSalary
              ? `${percentOfSalary!.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
              : '--'}
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            {referenceSalary
              ? `R$ ${periodTotal.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} / R$ ${referenceSalary.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`
              : 'Defina um salário base'}
          </p>
        </div>
      </div>

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
