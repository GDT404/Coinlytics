'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Props = {
  data: Array<{
    period: string
    total: number
    cumulative: number
  }>
}

export default function TotalExpensesChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Evolução do Total de Gastos</h3>
        <p className="text-zinc-500 text-sm">Sem dados para exibir</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Evolução do Total de Gastos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
              if (value === undefined) return 'R$ 0,00'
              return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            }}
          />
          <Area 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#10b981" 
            fillOpacity={1}
            fill="url(#colorTotal)"
            name="Total Acumulado"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
