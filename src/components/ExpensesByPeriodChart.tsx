'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type Props = {
  data: Array<{
    period: string
    amount: number
  }>
  periodType: 'week' | 'month' | 'year'
}

export default function ExpensesByPeriodChart({ data, periodType }: Props) {
  const periodLabel = 
    periodType === 'week' ? 'Semanal' : 
    periodType === 'month' ? 'Mensal' : 'Anual'

  if (data.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Gastos {periodLabel}</h3>
        <p className="text-zinc-500 text-sm">Sem dados para exibir</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Gastos {periodLabel}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis 
            dataKey="period" 
            stroke="#a1a1aa"
            tick={{ fill: '#a1a1aa' }}
          />
          <YAxis 
            stroke="#a1a1aa"
            tick={{ fill: '#a1a1aa' }}
            tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number | undefined) => {
              if (value === undefined) return ['R$ 0,00', 'Gasto']
              return [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Gasto']
            }}
          />
          <Bar dataKey="amount" fill="#10b981" name="Gasto" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
