'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth'

export default function AuthPage() {
  const { user, loading: authLoading, signIn, signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectTo)
    }
  }, [authLoading, user, redirectTo, router])

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      router.push(redirectTo)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      router.push(redirectTo)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login com Google')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return null

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-center mb-8">Entrar</h1>

        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-normal border border-line text-sm focus:outline-none focus:ring-2 focus:ring-green"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-normal border border-line text-sm focus:outline-none focus:ring-2 focus:ring-green"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green text-white font-semibold rounded-normal hover:bg-green-hover active:bg-green-active transition-colors disabled:opacity-50 cursor-pointer border-none"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-line" />
          <span className="text-sm text-gray-400">ou</span>
          <span className="flex-1 h-px bg-line" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 flex items-center justify-center gap-2 border border-line rounded-normal text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Entrar com Google
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
