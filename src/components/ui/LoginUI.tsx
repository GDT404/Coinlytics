'use client'

import * as React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { Mail, Lock } from 'lucide-react'

// Import da sua imagem local
import FotoLogin from '@/assets/images/LoginFoto.jpg'

interface LoginProps {
  email?: string
  setEmail?: (val: string) => void
  password?: string
  setPassword?: (val: string) => void
  onSubmit?: (e: React.FormEvent) => void
  loading?: boolean
  error?: string | null
}

const AppInput = ({ label, placeholder, icon, type, value, onChange }: any) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div className="w-full min-w-[200px] relative text-left">
      {label && <label className="block mb-2 text-sm text-[var(--color-text-primary)]">{label}</label>}
      <div className="relative w-full">
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="peer relative z-10 border-2 border-[var(--color-border)] h-12 w-full rounded-md bg-[var(--color-surface)] px-4 text-white outline-none transition-all duration-200 focus:bg-[var(--color-bg)] placeholder:text-zinc-500"
          placeholder={placeholder}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        />
        {isHovering && (
          <div
            className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-md"
            style={{
              background: `radial-gradient(40px circle at ${mousePosition.x}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
            }}
          />
        )}
        {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-zinc-400">{icon}</div>}
      </div>
    </div>
  )
}

export default function LoginUI({ email, setEmail, password, setPassword, onSubmit, loading, error }: LoginProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  return (
    /* fixed inset-0 garante que o fundo cubra tudo e trave o scroll nesta rota */
    <div className="fixed inset-0 w-full h-full bg-[var(--color-bg)] flex items-center justify-center p-4 overflow-hidden">
      
      <div className="flex w-full max-w-5xl h-[600px] bg-[var(--color-surface)] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-2xl relative">
        
        {/* LADO ESQUERDO: FORMULÁRIO */}
        <div
          className="w-full lg:w-1/2 px-8 lg:px-16 flex flex-col justify-center relative overflow-hidden bg-[var(--color-surface)]"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* EFEITO GLOW SEGUINDO O MOUSE */}
          <div
            className={`absolute pointer-events-none w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] transition-opacity duration-500 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
            style={{
              transform: `translate(${mousePosition.x - 200}px, ${mousePosition.y - 200}px)`,
              willChange: 'transform',
            }}
          />

          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-extrabold text-[var(--color-heading)] mb-2 tracking-tight">
              Coinlytics
            </h1>
            <p className="text-[var(--color-text-secondary)] mb-8 text-sm">
              Acesse sua conta para continuar
            </p>

            <form onSubmit={onSubmit} className="grid gap-4">
              <AppInput 
                placeholder="Email" 
                type="email" 
                icon={<Mail size={18} />} 
                value={email}
                onChange={(e: any) => setEmail?.(e.target.value)}
              />
              <AppInput 
                placeholder="Senha" 
                type="password" 
                icon={<Lock size={18} />} 
                value={password}
                onChange={(e: any) => setPassword?.(e.target.value)}
              />
              
              {error && (
                <p className="text-red-400 text-xs text-left animate-in fade-in slide-in-from-top-1">
                  {error}
                </p>
              )}

              <div className="flex justify-start items-center mt-1">
                <a href="#" className="text-xs text-[var(--color-text-secondary)] hover:text-emerald-400 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 inline-flex justify-center items-center overflow-hidden rounded-md bg-emerald-600 py-3 text-white font-bold transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {loading ? 'Autenticando...' : 'Entrar'}
                </span>
                {/* EFEITO DE BRILHO AO PASSAR O MOUSE NO BOTÃO */}
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-13deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-white/20" />
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* LADO DIREITO: IMAGEM COM OVERLAY */}
        <div className="hidden lg:block w-1/2 relative bg-zinc-900">
          <Image
            src={FotoLogin}
            alt="Dashboard Preview"
            fill
            priority
            className="object-cover opacity-50 grayscale transition-all duration-1000 hover:grayscale-0 hover:opacity-70"
          />
          {/* Degradê para suavizar a transição entre a imagem e o formulário */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[var(--color-surface)]" />
        </div>
      </div>
    </div>
  )
}   