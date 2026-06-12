'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { api } from '@/lib/api'
import type { LeaderboardEntry } from '@/lib/types'
import LeaderboardTable from './LeaderboardTable'
import Link from 'next/link'

export default function RankingSection({
  poolSlug,
  leagueSlug,
}: {
  poolSlug: string
  leagueSlug: string
}) {
  const { user } = useAuth()
  const [ranking, setRanking] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    api.leaderboard
      .getRanking(poolSlug, leagueSlug)
      .then((data) => setRanking(data?.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, poolSlug, leagueSlug])

  if (!user) {
    return (
      <div className="bg-white rounded-lg border border-line p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-300">
            <path d="M12 2L15 8L22 9L17 14L18 21L12 17.5L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-gray-300 text-sm mb-4">
          Faça login para ver a classificação.
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
      <div className="bg-white rounded-lg border border-line p-12 text-center">
        <p className="text-gray-300 text-sm">Carregando...</p>
      </div>
    )
  }

  return ranking.length > 0 ? (
    <LeaderboardTable entries={ranking} />
  ) : (
    <div className="bg-white rounded-lg border border-line p-12 text-center">
      <p className="text-gray-300 text-sm">Nenhum participante no ranking ainda.</p>
    </div>
  )
}
