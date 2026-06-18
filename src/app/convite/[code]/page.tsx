'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useJoinLeague } from '@/lib/queries'
import { useAuth } from '@/contexts/auth'
import Spinner from '@/components/Spinner'
import FadeIn from '@/components/FadeIn'

export default function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const joinMutation = useJoinLeague()
  const joinAttempted = useRef(false)

  useEffect(() => {
    params.then((p) => setCode(p.code))
  }, [params])

  useEffect(() => {
    if (authLoading || !code || joinAttempted.current) return

    if (!user) {
      router.replace(`/auth?redirect=/convite/${code}`)
      return
    }

    joinAttempted.current = true
    joinMutation
      .mutateAsync(code.toUpperCase())
      .then((data) => {
        const league = data.league
        const firstPool = league.pools?.[0]?.pool
        if (firstPool?.slug) {
          router.replace(`/bolao/${firstPool.slug}/ligas/${league.slug}`)
        } else {
          setError('Não foi possível encontrar a liga deste convite.')
        }
      })
      .catch(() => {
        setError('Código inválido, expirado ou você já faz parte desta liga.')
      })
  }, [user, authLoading, code, router, joinMutation.mutateAsync])

  if (authLoading) {
    return (
      <div className="max-w-[1340px] mx-auto px-4 py-16 text-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <FadeIn show>
      <div className="max-w-[1340px] mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-500 mb-2">Convite inválido</h1>
        <p className="text-gray-300 text-sm mb-6">{error}</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-semibold rounded-normal hover:bg-green-hover transition-colors no-underline"
        >
          Voltar para Início
        </a>
      </div>
      </FadeIn>
    )
  }

  return (
    <div className="max-w-[1340px] mx-auto px-4 py-16 text-center">
      <Spinner size="lg" />
      <p className="text-sm text-gray-400 mt-4">Entrando na liga...</p>
    </div>
  )
}
