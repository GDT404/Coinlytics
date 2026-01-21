'use client'

import { motion } from 'framer-motion'

export default function SalaryProgress({
  percent,
}: {
  percent: number
}) {
  const safePercent = Math.min(percent, 100)

  return (
    <div className="bg-gradient-to-br from-pink-600/20 to-pink-700/10 border border-pink-600/30 rounded-xl p-6">
      <h3 className="text-sm text-zinc-400 mb-2">% do salário utilizado</h3>

      <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safePercent}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-pink-500 to-pink-400"
        />
      </div>

      <p className="mt-3 text-lg font-bold text-pink-400">
        {percent.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
      </p>
    </div>
  )
}
