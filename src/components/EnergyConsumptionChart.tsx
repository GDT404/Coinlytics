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

const data = [
  { month: 'Feb', Renovable: 45000, Tradicional: 120000 },
  { month: 'Mar', Renovable: 52000, Tradicional: 115000 },
  { month: 'Abr', Renovable: 58000, Tradicional: 110000 },
  { month: 'May', Renovable: 65000, Tradicional: 105000 },
  { month: 'Jun', Renovable: 72000, Tradicional: 100000 },
  { month: 'Jul', Renovable: 78000, Tradicional: 95000 },
  { month: 'Ago', Renovable: 85000, Tradicional: 90000 },
  { month: 'Sep', Renovable: 82000, Tradicional: 92000 },
  { month: 'Oct', Renovable: 75000, Tradicional: 98000 },
  { month: 'Nov', Renovable: 68000, Tradicional: 102000 },
  { month: 'Dic', Renovable: 62000, Tradicional: 108000 },
]

export default function EnergyConsumptionChart() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Consumo Energético (MWh)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis 
            dataKey="month" 
            stroke="#a1a1aa"
            tick={{ fill: '#a1a1aa' }}
          />
          <YAxis 
            stroke="#a1a1aa"
            tick={{ fill: '#a1a1aa' }}
            domain={[0, 200000]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend 
            wrapperStyle={{ color: '#a1a1aa' }}
          />
          <Bar dataKey="Renovable" fill="#10b981" name="Renovable" />
          <Bar dataKey="Tradicional" fill="#3b82f6" name="Tradicional" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
