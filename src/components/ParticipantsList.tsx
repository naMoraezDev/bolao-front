'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { api } from '@/lib/api'
import type { Participant } from '@/lib/types'
import Link from 'next/link'

export default function ParticipantsList({
  poolSlug,
  leagueSlug,
}: {
  poolSlug: string
  leagueSlug: string
}) {
  const { user } = useAuth()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    api.leagues
      .getParticipants(poolSlug, leagueSlug)
      .then((data) => setParticipants(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, poolSlug, leagueSlug])

  if (!user) {
    return (
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
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <div className="px-6 py-4 border-b border-line">
          <h2 className="font-semibold text-gray-500 text-sm">Participantes</h2>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-300 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-line overflow-hidden">
      <div className="px-6 py-4 border-b border-line">
        <h2 className="font-semibold text-gray-500 text-sm">
          Participantes ({participants.length})
        </h2>
      </div>
      <div className="divide-y divide-line">
        {participants.slice(0, 5).map((p) => (
          <div key={p.id} className="px-6 py-3 flex items-center gap-3">
            {p.avatarUrl ? (
              <img
                src={p.avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-cover-bg flex items-center justify-center">
                <span className="text-xs font-bold text-green">
                  {(p.name ?? '?')[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm font-medium text-table-text">
              {p.name ?? 'Anônimo'}
            </span>
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
  )
}
