'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { api } from '@/lib/api'
import Modal from './Modal'

interface DeleteLeagueButtonProps {
  poolSlug: string
  leagueSlug: string
  creatorId?: string | null
}

export default function DeleteLeagueButton({ poolSlug, leagueSlug, creatorId }: DeleteLeagueButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!user || user.uid !== creatorId) return null

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.leagues.delete(poolSlug, leagueSlug)
      router.push(`/bolao/${poolSlug}`)
      router.refresh()
    } catch {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red/30 text-sm font-semibold text-red hover:bg-red/5 transition-colors cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4H14M5 4V2.5C5 2.22386 5.22386 2 5.5 2H10.5C10.7761 2 11 2.22386 11 2.5V4M6 7V12M10 7V12M3.5 4L4.5 13.5C4.5 13.7761 4.72386 14 5 14H11C11.2761 14 11.5 13.7761 11.5 13.5L12.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Excluir liga
      </button>
      <Modal open={showConfirm} onClose={() => !deleting && setShowConfirm(false)}>
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red">
              <path d="M12 9V13M12 17H12.01M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-black-lance mb-2">Excluir liga</h3>
          <p className="text-sm text-gray-300 mb-6">
            Tem certeza? Esta ação não pode ser desfeita. Todos os palpites, pontuações e participantes serão removidos permanentemente.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={deleting}
              className="px-5 py-2.5 rounded-lg border border-line text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-5 py-2.5 rounded-lg bg-red text-sm font-semibold text-white hover:bg-red-hover transition-colors cursor-pointer disabled:opacity-50"
            >
              {deleting ? 'Excluindo...' : 'Sim, excluir'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
