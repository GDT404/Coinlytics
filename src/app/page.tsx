'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log('SESSION DATA:', data)
      console.log('SESSION ERROR:', error)
    })
  }, [])

  return <h1 className="p-8">Supabase conectado</h1>
}
