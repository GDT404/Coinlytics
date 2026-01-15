'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.replace('/dashboard')
    } else {
      setError('Sessão não criada')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
        <h1 className="text-2xl font-bold text-white mb-2">
          Entrar no Coinlytics
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Email</label>
            <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-lg mt-1">
              <Mail className="w-4 h-4 text-zinc-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400">Senha</label>
            <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-lg mt-1">
              <Lock className="w-4 h-4 text-zinc-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
