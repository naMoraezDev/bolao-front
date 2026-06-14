'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/auth'
import { useUserStats, useLeagueDetail } from '@/lib/queries'
import Tabs from '@/components/Tabs'
import AdBanner from '@/components/AdBanner'

export default function EstatisticasPage({
  params,
}: {
  params: Promise<{ poolSlug: string; leagueSlug: string }>
}) {
  const { user, loading: authLoading } = useAuth()
  const [poolSlug, setPoolSlug] = useState('')
  const [leagueSlug, setLeagueSlug] = useState('')

  useEffect(() => {
    params.then((p) => {
      setPoolSlug(p.poolSlug)
      setLeagueSlug(p.leagueSlug)
    })
  }, [params])

  const { data: league } = useLeagueDetail(poolSlug, leagueSlug)
  const { data: stats, isLoading, error } = useUserStats(poolSlug, leagueSlug)

  if (authLoading) {
    return (
      <div className="max-w-[1340px] mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-green/30 border-t-green animate-spin mx-auto" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-[1340px] mx-auto px-4 py-16">
        <nav className="flex items-center gap-2 text-sm text-gray-300 mb-6">
          <Link href="/" className="hover:text-green transition-colors no-underline">Início</Link>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Link href="/bolao" className="hover:text-green transition-colors no-underline">Bolões</Link>
          {poolSlug && (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-gray-500">{league?.pool?.name ?? poolSlug}</span>
            </>
          )}
          {leagueSlug && (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-gray-500">Estatísticas</span>
            </>
          )}
        </nav>

        <div className="bg-white rounded-lg border border-line p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-300">
              <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M18.5 14.5L22 21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Faça login para ver suas estatísticas.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-semibold rounded-normal hover:bg-green-hover transition-colors no-underline"
          >
            Entrar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1340px] mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-300 mb-6">
        <Link href="/" className="hover:text-green transition-colors no-underline">Início</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link href="/bolao" className="hover:text-green transition-colors no-underline">Bolões</Link>
        {poolSlug && (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-gray-500">{league?.pool?.name ?? poolSlug}</span>
          </>
        )}
        {leagueSlug && (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-gray-500">Estatísticas</span>
          </>
        )}
      </nav>

      <Tabs tabs={[
        { label: 'Detalhes', value: 'detalhes', href: `/bolao/${poolSlug}/ligas/${leagueSlug}/detalhes` },
        { label: 'Palpites', value: 'palpites', href: `/bolao/${poolSlug}/ligas/${leagueSlug}/palpites` },
        { label: 'Classificação', value: 'classificacao', href: `/bolao/${poolSlug}/ligas/${leagueSlug}/classificacao` },
        { label: 'Estatísticas', value: 'estatisticas', href: `/bolao/${poolSlug}/ligas/${leagueSlug}/estatisticas` },
      ]} />

      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-green/30 border-t-green animate-spin mx-auto" />
          </div>
        ) : error || !stats ? (
          <div className="bg-white rounded-lg border border-line p-12 text-center">
            <p className="text-gray-300 text-sm">Erro ao carregar estatísticas.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Hero */}
            <div className="bg-gradient-to-br from-green to-[#0f3329] rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-shrink-0">
                  {stats.avatarUrl ? (
                    <img src={stats.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/30" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white/80">
                        {(stats.name ?? '?')[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{stats.name ?? 'Anônimo'}</h3>
                    <p className="text-sm text-white/70">Suas estatísticas na liga</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {league?.pool?.icon ? (
                      <img src={league.pool.icon} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 20 20" fill="none" className="text-white/80">
                        <path d="M10 2L12.5 7L18 7.6L14 11.4L15 17L10 14.5L5 17L6 11.4L2 7.6L7.5 7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white/60 truncate">
                      {league?.pool?.name ?? poolSlug}
                    </p>
                    <h2 className="font-display text-xl font-bold truncate">
                      {league?.name ?? leagueSlug}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance ring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-line p-6">
                <h3 className="text-sm font-semibold text-table-gray uppercase tracking-wide mb-4">
                  Aproveitamento
                </h3>
                <div className="flex items-center justify-center">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
                      <circle
                        cx="18" cy="18" r="15.5"
                        fill="none"
                        stroke="#1B4D3E"
                        strokeWidth="2.5"
                        strokeDasharray={`${(stats.exact / stats.totalGuesses) * 100 || 0} 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-green">
                          {stats.totalGuesses > 0
                            ? Math.round((stats.exact / stats.totalGuesses) * 100)
                            : 0}%
                        </span>
                        <p className="text-[10px] text-gray-300 uppercase tracking-wider mt-0.5">Exatidão</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green">{stats.exact}</p>
                    <p className="text-[10px] text-gray-300 uppercase tracking-wider">Exatos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-amber-600">{stats.partial}</p>
                    <p className="text-[10px] text-gray-300 uppercase tracking-wider">Parciais</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-widget">{stats.miss}</p>
                    <p className="text-[10px] text-gray-300 uppercase tracking-wider">Errados</p>
                  </div>
                </div>
              </div>

              {/* Key stats */}
              <div className="bg-white rounded-xl border border-line p-6">
                <h3 className="text-sm font-semibold text-table-gray uppercase tracking-wide mb-4">
                  Desempenho
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-line/50">
                    <span className="text-sm text-gray-500">Pontuação total</span>
                    <span className="text-lg font-bold text-green">{stats.totalScore}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-line/50">
                    <span className="text-sm text-gray-500">Total de palpites</span>
                    <span className="text-lg font-bold text-gray-500">{stats.totalGuesses}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-line/50">
                    <span className="text-sm text-gray-500">Média por palpite</span>
                    <span className="text-lg font-bold text-gray-500">
                      {stats.totalGuesses > 0
                        ? (stats.totalScore / stats.totalGuesses).toFixed(1)
                        : '0.0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500">Posição no ranking</span>
                    <span className="text-lg font-bold text-gray-500">
                      {stats.position ? `${stats.position}°` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <AdBanner variant="horizontal" />
          </motion.div>
        )}
      </div>
    </div>
  )
}
