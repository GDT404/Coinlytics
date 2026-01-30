'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import LoginUI from '@/components/ui/LoginUI'
import { LoadingScreen } from '@/components/ui/loading-screen' // Importe o componente

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false) // Novo estado
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      // Se deu certo, ativamos a tela de carregamento total
      setIsRedirecting(true)
      // O router.replace inicia a transição de página
      router.replace('/dashboard')
    }
  }

  return (
    <>
      {/* Se estiver redirecionando, mostra a tela cheia */}
      {isRedirecting && <LoadingScreen />}
      
      <LoginUI 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </>
  )
}