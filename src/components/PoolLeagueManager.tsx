'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useUserLeagues } from '@/lib/queries'
import { useAuth } from '@/contexts/auth'
import CreateLeagueModal from './CreateLeagueModal'
import JoinLeagueModal from './JoinLeagueModal'
import type { UserLeague, League } from '@/lib/types'
import LeagueBadge from './LeagueBadge'

interface PoolLeagueManagerProps {
  poolSlug: string
  poolName: string
  defaultLeague?: League | null
}

export default function PoolLeagueManager({ poolSlug, poolName, defaultLeague }: PoolLeagueManagerProps) {
  const { user } = useAuth()
  const { data: leaguesData, isLoading: loading, refetch } = useUserLeagues()
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)

  const leagues: UserLeague[] = user
    ? (Array.isArray(leaguesData) ? leaguesData : []).filter(
        (l) =>
          l.pools?.some((p) => p.pool.slug === poolSlug) ||
          l.defaultForPools?.some((p) => p.slug === poolSlug),
      )
    : []

  const visibleLeagues = defaultLeague
    ? [defaultLeague, ...leagues.filter((l) => l.id !== defaultLeague.id)]
    : leagues

  const showEmptyState = !loading && visibleLeagues.length === 0

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-black-lance">Ligas</h2>
        <div className="flex items-center gap-2">
          {user && (
            <>
              <button
                onClick={() => setShowJoin(true)}
                className="px-3 py-1.5 rounded-lg border border-line text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Entrar
              </button>
              <button
                onClick={() => setShowCreate(true)}
                className="px-3 py-1.5 rounded-lg bg-green text-white text-sm font-semibold hover:bg-green-hover transition-colors cursor-pointer border-none"
              >
                Criar Liga
              </button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-line p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-28 h-4 rounded bg-gray-200 animate-pulse" />
                    <div className="w-20 h-3 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
                <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : !showEmptyState ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {visibleLeagues.map((league) => (
            <Link
              key={league.id}
              href={`/bolao/${poolSlug}/ligas/${league.slug}`}
              className="group block bg-white rounded-lg border border-line p-5 hover:shadow-card hover:border-green/20 transition-all duration-200 no-underline"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-cover-bg flex items-center justify-center group-hover:bg-green-cover-btn transition-colors">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green">
                      <path d="M10 2L12.5 7L18 7.6L14 11.4L15 17L10 14.5L5 17L6 11.4L2 7.6L7.5 7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500 group-hover:text-green transition-colors">
                      {league.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-gray-300">{poolName}</span>
                      <LeagueBadge accessRules={'accessRules' in league ? league.accessRules : undefined} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-300 group-hover:text-green transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg border border-line p-8 text-center">
          <p className="text-gray-300 text-sm">
            {user ? 'Nenhuma liga encontrada. Crie ou entre em uma liga!' : 'Faça login para ver suas ligas.'}
          </p>
        </div>
      )}

      <CreateLeagueModal
        poolSlug={poolSlug}
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => refetch()}
      />
      <JoinLeagueModal
        open={showJoin}
        onClose={() => {
          setShowJoin(false)
          refetch()
        }}
      />
    </section>
  )
}
