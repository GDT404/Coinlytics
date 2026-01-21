'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useBaseSalary() {
  const [baseSalary, setBaseSalary] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('base_salary')
        .eq('id', user.id)
        .single()

      setBaseSalary(Number(data?.base_salary) || 0)
      setLoading(false)
    }

    load()
  }, [])

  async function updateSalary(value: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({ base_salary: value })
      .eq('id', user.id)

    setBaseSalary(value)
  }

  return {
    baseSalary,
    setBaseSalary: updateSalary,
    loading
  }
}
