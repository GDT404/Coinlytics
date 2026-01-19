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
  { month: 'Ene', 'Alcance 1': 8000, 'Alcance 2': 22000, 'Alcance 3': 15000 },
  { month: 'Feb', 'Alcance 1': 8200, 'Alcance 2': 22500, 'Alcance 3': 15200 },
  { month: 'Mar', 'Alcance 1': 8500, 'Alcance 2': 23000, 'Alcance 3': 15500 },
  { month: 'Abr', 'Alcance 1': 8300, 'Alcance 2': 22800, 'Alcance 3': 15300 },
  { month: 'May', 'Alcance 1': 8100, 'Alcance 2': 22200, 'Alcance 3': 15100 },
  { month: 'Jun', 'Alcance 1': 7900, 'Alcance 2': 21800, 'Alcance 3': 14800 },
]

export default function ScopeEmissionsChart() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Emisiones por Alcance (t CO₂eq)</h3>
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
            domain={[0, 38000]}
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
          <Bar dataKey="Alcance 1" fill="#ef4444" name="Alcance 1" />
          <Bar dataKey="Alcance 2" fill="#f97316" name="Alcance 2" />
          <Bar dataKey="Alcance 3" fill="#eab308" name="Alcance 3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
