'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useJoinLeague } from '@/lib/queries'
import Modal from './Modal'
import FadeIn from './FadeIn'
import { motion } from 'framer-motion'

interface JoinLeagueModalProps {
  open: boolean
  onClose: () => void
}

export default function JoinLeagueModal({ open, onClose }: JoinLeagueModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ name: string; poolSlug: string; leagueSlug: string } | null>(null)
  const router = useRouter()
  const joinMutation = useJoinLeague()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setError('')
    setSuccess(null)
    try {
      const data = await joinMutation.mutateAsync(code.trim().toUpperCase())
      const league = data.league
      const firstPool = league.pools?.[0]?.pool
      setSuccess({
        name: league.name,
        poolSlug: firstPool?.slug ?? '',
        leagueSlug: league.slug,
      })
      setCode('')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Código inválido ou expirado')
    }
  }

  function goToLeague() {
    if (success) {
      router.push(`/bolao/${success.poolSlug}/ligas/${success.leagueSlug}`)
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} className="w-full max-w-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-black-lance">Entrar em uma Liga</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer border-none">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <FadeIn show={!!success}>
        {success && (
          <div className="text-center py-4 space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-14 h-14 rounded-full bg-green-cover-bg flex items-center justify-center mx-auto"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <div>
              <p className="text-sm text-gray-500">Você entrou em</p>
              <p className="text-lg font-bold text-black-lance">{success.name}</p>
            </div>
            <button
              onClick={goToLeague}
              className="w-full px-4 py-2.5 rounded-lg bg-green text-white text-sm font-semibold hover:bg-green-hover transition-colors cursor-pointer border-none"
            >
              Ir para a liga
            </button>
          </div>
        )}
      </FadeIn>

      <FadeIn show={!success}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Código de convite</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex: SQP2R8CB"
              className="w-full px-3 py-2.5 rounded-lg border border-line text-sm font-bold text-gray-700 tracking-[0.3em] text-center uppercase placeholder:tracking-normal placeholder:font-normal focus:border-green focus:ring-1 focus:ring-green/20 outline-none"
              autoFocus
              maxLength={10}
            />
            <p className="text-xs text-gray-300 mt-1.5 text-center">
              Insira o código recebido do criador da liga
            </p>
          </div>

          <FadeIn show={!!error}>
            <p className="text-sm font-medium text-red-widget bg-red-50 px-3 py-2 rounded-lg text-center">{error}</p>
          </FadeIn>

          <button
            type="submit"
            disabled={code.trim().length < 4 || joinMutation.isPending}
            className="w-full px-4 py-2.5 rounded-lg bg-green text-white text-sm font-semibold hover:bg-green-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            {joinMutation.isPending ? 'Entrando...' : 'Entrar na Liga'}
          </button>
        </form>
      </FadeIn>
    </Modal>
  )
}
