'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { useLeaderboardRanking } from '@/lib/queries'
import FadeIn from './FadeIn'
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
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  const { data, isLoading, isFetching } = useLeaderboardRanking(poolSlug, leagueSlug, {
    limit: 20,
    cursor,
  })

  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const loadingMore = isFetching && cursor !== undefined

  useEffect(() => {
    if (!data?.items?.length) return

    if (!cursor) {
      setEntries(data.items)
    } else {
      setEntries((prev) => {
        const ids = new Set(prev.map((e) => e.id))
        const newItems = data.items.filter((e) => !ids.has(e.id))
        return newItems.length ? [...prev, ...newItems] : prev
      })
    }
    if (data.nextCursor) setNextCursor(data.nextCursor)
  }, [data, cursor])

  function loadMore() {
    if (nextCursor) setCursor(nextCursor)
  }

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

  if (isLoading && entries.length === 0) {
    return (
      <div className="rounded-lg border border-line overflow-hidden">
        <div className="bg-table-bg-gray border-b border-line px-4 py-3 flex items-center gap-4">
          <div className="w-6 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-10 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-14 h-4 bg-gray-200 rounded animate-pulse hidden sm:block" />
          <div className="w-14 h-4 bg-gray-200 rounded animate-pulse hidden md:block" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-line/50">
            <div className="w-8 h-4 bg-gray-100 rounded animate-pulse" />
            <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
            <div className="flex-1 h-4 bg-gray-100 rounded animate-pulse" />
            <div className="w-10 h-4 bg-gray-100 rounded animate-pulse" />
            <div className="w-14 h-4 bg-gray-100 rounded animate-pulse hidden sm:block" />
            <div className="w-14 h-4 bg-gray-100 rounded animate-pulse hidden md:block" />
            <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <FadeIn show={!isLoading || entries.length > 0}>
      {entries.length > 0 ? (
        <>
          <LeaderboardTable entries={entries} poolSlug={poolSlug} leagueSlug={leagueSlug} />
          {nextCursor && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 rounded-lg border border-line text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Carregando...
                  </>
                ) : (
                  'Carregar mais'
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg border border-line p-12 text-center">
          <p className="text-gray-300 text-sm">Nenhum participante no ranking ainda.</p>
        </div>
      )}
    </FadeIn>
  )
}
