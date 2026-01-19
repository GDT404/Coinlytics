'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb, 
  DollarSign,
  Info,
  Sparkles,
  Target,
  BarChart3,
  Zap
} from 'lucide-react'

type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

type Tip = {
  type: 'alert' | 'tip' | 'info' | 'success'
  title: string
  message: string
  icon: React.ReactNode
  color: string
  bgGradient: string
  borderColor: string
  iconBg: string
}

export default function TipsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [tips, setTips] = useState<Tip[]>([])

  useEffect(() => {
    async function loadExpenses() {
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })

      setExpenses(data || [])
      setLoading(false)
    }

    loadExpenses()
  }, [])

  useEffect(() => {
    if (expenses.length === 0) return

    const newTips: Tip[] = []
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Gastos do mês atual
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear
    })

    const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0)

    // Gastos do mês anterior
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === lastMonth && 
             expenseDate.getFullYear() === lastMonthYear
    })

    const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0)

    // Alertas e dicas baseados nos dados
    if (monthTotal > lastMonthTotal * 1.2 && lastMonthTotal > 0) {
      const increase = ((monthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(0)
      newTips.push({
        type: 'alert',
        title: 'Atenção: Aumento de Gastos',
        message: `Seus gastos aumentaram ${increase}% em relação ao mês anterior. Considere revisar suas despesas para identificar oportunidades de economia.`,
        icon: <AlertTriangle className="w-6 h-6" />,
        color: 'text-orange-400',
        bgGradient: 'from-orange-600/20 via-orange-600/10 to-transparent',
        borderColor: 'border-orange-500/40',
        iconBg: 'bg-orange-500/20'
      })
    }

    // Categoria com maior gasto
    const categoryMap: Record<string, number> = {}
    monthExpenses.forEach(expense => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount
    })

    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]
    if (topCategory && topCategory[1] > monthTotal * 0.4) {
      const percentage = ((topCategory[1] / monthTotal) * 100).toFixed(0)
      newTips.push({
        type: 'tip',
        title: 'Oportunidade de Economia',
        message: `A categoria "${topCategory[0]}" representa ${percentage}% dos seus gastos mensais (R$ ${topCategory[1].toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}). Analise essas despesas para identificar possíveis reduções.`,
        icon: <Target className="w-6 h-6" />,
        color: 'text-yellow-400',
        bgGradient: 'from-yellow-600/20 via-yellow-600/10 to-transparent',
        borderColor: 'border-yellow-500/40',
        iconBg: 'bg-yellow-500/20'
      })
    }

    // Média diária
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const dailyAverage = monthTotal / daysInMonth
    const daysPassed = Math.min(now.getDate(), daysInMonth)
    const projectedMonthTotal = dailyAverage * daysInMonth
    
    newTips.push({
      type: 'info',
      title: 'Análise Mensal',
      message: `Sua média de gastos diários este mês é de R$ ${dailyAverage.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Projeção mensal: R$ ${projectedMonthTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-blue-400',
      bgGradient: 'from-blue-600/20 via-blue-600/10 to-transparent',
      borderColor: 'border-blue-500/40',
      iconBg: 'bg-blue-500/20'
    })

    // Dica geral se não houver muitos gastos
    if (monthExpenses.length < 5 && monthTotal < 500) {
      newTips.push({
        type: 'success',
        title: 'Excelente Controle Financeiro!',
        message: 'Você está mantendo um bom controle dos seus gastos. Continue registrando todas as despesas para ter uma visão completa e tomar decisões mais informadas.',
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'text-emerald-400',
        bgGradient: 'from-emerald-600/20 via-emerald-600/10 to-transparent',
        borderColor: 'border-emerald-500/40',
        iconBg: 'bg-emerald-500/20'
      })
    }

    // Dica sobre categorias
    const uniqueCategories = new Set(expenses.map(e => e.category)).size
    if (uniqueCategories < 3 && expenses.length > 5) {
      newTips.push({
        type: 'info',
        title: 'Diversificação de Categorias',
        message: 'Considere categorizar melhor seus gastos para ter uma visão mais detalhada de onde seu dinheiro está indo. Isso ajuda a identificar padrões e oportunidades de economia.',
        icon: <DollarSign className="w-6 h-6" />,
        color: 'text-purple-400',
        bgGradient: 'from-purple-600/20 via-purple-600/10 to-transparent',
        borderColor: 'border-purple-500/40',
        iconBg: 'bg-purple-500/20'
      })
    }

    // Dica sobre economia se gastos estão controlados
    if (monthTotal < lastMonthTotal * 0.9 && lastMonthTotal > 0) {
      const reduction = ((lastMonthTotal - monthTotal) / lastMonthTotal * 100).toFixed(0)
      newTips.push({
        type: 'success',
        title: 'Parabéns! Você Economizou',
        message: `Você reduziu seus gastos em ${reduction}% comparado ao mês anterior. Continue mantendo esse controle para alcançar seus objetivos financeiros.`,
        icon: <Zap className="w-6 h-6" />,
        color: 'text-emerald-400',
        bgGradient: 'from-emerald-600/20 via-emerald-600/10 to-transparent',
        borderColor: 'border-emerald-500/40',
        iconBg: 'bg-emerald-500/20'
      })
    }

    setTips(newTips)
  }, [expenses])

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-emerald-600/20 to-emerald-700/10 border border-emerald-600/30 rounded-xl">
          <Sparkles className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Insights Inteligentes</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Análises personalizadas baseadas nos seus gastos
          </p>
        </div>
      </header>

      {/* LOADING STATE */}
      {loading && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
            <p className="text-zinc-400">Analisando seus dados...</p>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && tips.length === 0 && (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-zinc-800 rounded-full">
              <Lightbulb className="w-12 h-12 text-zinc-500" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-zinc-300">Nenhum insight disponível</h3>
          <p className="text-zinc-400 max-w-md mx-auto">
            Registre algumas despesas para receber análises personalizadas e dicas inteligentes sobre seus gastos.
          </p>
        </div>
      )}

      {/* TIPS GRID */}
      {!loading && tips.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${tip.bgGradient} border ${tip.borderColor} rounded-xl p-6 hover:shadow-lg hover:shadow-${tip.color.split('-')[1]}-500/20 transition-all duration-300 group`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-3 ${tip.iconBg} rounded-xl ${tip.color} group-hover:scale-110 transition-transform duration-300`}>
                  {tip.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-lg mb-2 ${tip.color}`}>
                    {tip.title}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {tip.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STATISTICS SUMMARY */}
      {!loading && expenses.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Resumo dos Dados Analisados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-zinc-400">Total de Despesas</p>
              <p className="text-2xl font-bold text-emerald-400">{expenses.length}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Categorias</p>
              <p className="text-2xl font-bold text-blue-400">
                {new Set(expenses.map(e => e.category)).size}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Geral</p>
              <p className="text-2xl font-bold text-purple-400">
                R$ {expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Insights</p>
              <p className="text-2xl font-bold text-yellow-400">{tips.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
