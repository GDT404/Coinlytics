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

const data = [
  { month: 'Ene', Terrestre: 1200, Marítimo: 800, Aéreo: 200 },
  { month: 'Feb', Terrestre: 1350, Marítimo: 750, Aéreo: 180 },
  { month: 'Mar', Terrestre: 1400, Marítimo: 820, Aéreo: 190 },
  { month: 'Abr', Terrestre: 1280, Marítimo: 780, Aéreo: 175 },
  { month: 'May', Terrestre: 1150, Marítimo: 720, Aéreo: 165 },
  { month: 'Jun', Terrestre: 1100, Marítimo: 700, Aéreo: 160 },
]

export default function TransportEmissionsChart() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Emisiones Transporte (t CO₂)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis 
            dataKey="month" 
            stroke="#a1a1aa"
            tick={{ fill: '#a1a1aa' }}
          />
          <YAxis 
            stroke="#a1a1aa"
            tick={{ fill: '#a1a1aa' }}
            domain={[0, 1400]}
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
          <Line 
            type="monotone" 
            dataKey="Terrestre" 
            stroke="#1e40af" 
            strokeWidth={2}
            dot={{ fill: '#1e40af', r: 4 }}
            name="Terrestre"
          />
          <Line 
            type="monotone" 
            dataKey="Marítimo" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            name="Marítimo"
          />
          <Line 
            type="monotone" 
            dataKey="Aéreo" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', r: 4 }}
            name="Aéreo"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
