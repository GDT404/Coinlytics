'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type Props = {
  data: Array<{
    date: string
    amount: number
  }>
}

export default function ExpensesTrendChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Tendência de Gastos</h3>
        <p className="text-zinc-500 text-sm">Sem dados para exibir</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Tendência de Gastos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis 
            dataKey="date" 
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
          <Legend 
            wrapperStyle={{ color: '#a1a1aa' }}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            name="Gasto"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
