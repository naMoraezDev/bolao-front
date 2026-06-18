'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { useLeagueParticipants, useRemoveParticipant } from '@/lib/queries'
import Modal from './Modal'
import Skeleton from './Skeleton'
import Spinner from './Spinner'
import FadeIn from './FadeIn'
import type { Participant } from '@/lib/types'
import Link from 'next/link'

export default function ParticipantsList({
  poolSlug,
  leagueSlug,
  creatorId,
  accessRules,
}: {
  poolSlug: string
  leagueSlug: string
  creatorId?: string
  accessRules?: { rule: 'PUBLIC' | 'INVITE_CODE' }[]
}) {
  const { user } = useAuth()
  const { data: participantsData, isLoading: loading } = useLeagueParticipants(poolSlug, leagueSlug)
  const removeMutation = useRemoveParticipant()
  const [removeTarget, setRemoveTarget] = useState<{ userId: string; name: string } | null>(null)

  const participants: Participant[] = participantsData?.items ?? []

  const isCreator = user !== null && user.uid === creatorId
  const isPrivate = accessRules?.some((r) => r.rule === 'INVITE_CODE') ?? false
  const canRemove = isCreator && isPrivate

  const handleRemove = async () => {
    if (!removeTarget) return
    try {
      await removeMutation.mutateAsync({
        poolSlug,
        leagueSlug,
        userId: removeTarget.userId,
      })
      setRemoveTarget(null)
    } catch {
      alert('Erro ao remover participante')
    }
  }

  if (!user) {
    return (
      <FadeIn show>
        <div className="bg-white rounded-lg border border-line p-8 text-center">
          <p className="text-gray-300 text-sm mb-4">
            Faça login para ver os participantes desta liga.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-semibold rounded-normal hover:bg-green-hover transition-colors no-underline"
          >
            Entrar
          </Link>
        </div>
      </FadeIn>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <div className="px-6 py-4 border-b border-line">
          <Skeleton className="w-28 h-4" />
        </div>
        <div className="divide-y divide-line">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-3 flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-32 h-4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <FadeIn show={!loading}>
      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <div className="px-6 py-4 border-b border-line">
          <h2 className="font-semibold text-gray-500 text-sm">
            Participantes ({participants.length})
          </h2>
        </div>
        <div className="divide-y divide-line">
          {participants.slice(0, 5).map((p) => (
            <div key={p.id} className="px-6 py-3 flex items-center gap-3 group">
              {p.avatarUrl ? (
                <img
                  src={p.avatarUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-cover-bg flex items-center justify-center">
                  <span className="text-xs font-bold text-green">
                    {(p.name ?? '?')[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-table-text flex-1">
                {p.name ?? 'Anônimo'}
              </span>
              {canRemove && p.userId !== user.uid && (
                <button
                  onClick={() => setRemoveTarget({ userId: p.userId, name: p.name ?? '' })}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full flex items-center justify-center bg-red/10 hover:bg-red/20 text-red"
                  title="Remover participante"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          {participants.length > 5 && (
            <div className="px-6 py-3 text-center">
              <span className="text-sm text-gray-300">
                e mais {participants.length - 5} participantes
              </span>
            </div>
          )}
        </div>
      </div>
      </FadeIn>

      {/* Confirm Remove Modal */}
      <Modal open={!!removeTarget} onClose={() => !removeMutation.isPending && setRemoveTarget(null)} className="w-full max-w-sm">
        <div className="px-6 pt-6 pb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-red">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-black-lance mb-2">Remover participante</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Tem certeza que deseja remover <strong className="text-gray-500">{removeTarget?.name || 'este participante'}</strong> da liga?
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={() => setRemoveTarget(null)}
            disabled={removeMutation.isPending}
            className="flex-1 py-2.5 rounded-lg border border-line text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleRemove}
            disabled={removeMutation.isPending}
            className="flex-1 py-2.5 rounded-lg bg-red text-white text-sm font-semibold hover:bg-red-hover transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer border-none"
          >
            {removeMutation.isPending && (
              <Spinner size="sm" />
            )}
            {removeMutation.isPending ? 'Removendo...' : 'Remover'}
          </button>
        </div>
      </Modal>
    </>
  )
}
