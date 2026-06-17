'use client'

import { useState } from 'react'
import { useLeaderboardUserEntries } from '@/lib/queries'
import type { LeaderboardEntry } from '@/lib/types'

const guessBadge = (score: number) => {
  if (score === 10) return { label: 'Exato', style: 'bg-green text-white' }
  if (score === 5) return { label: 'Gols', style: 'bg-blue-100 text-blue-700' }
  if (score === 3) return { label: 'Perdedor', style: 'bg-amber-100 text-amber-700' }
  if (score === 2) return { label: 'Diferença', style: 'bg-yellow-100 text-yellow-700' }
  if (score === 1) return { label: 'Vencedor', style: 'bg-sky-100 text-sky-700' }
  return { label: 'Erro', style: 'bg-gray-100 text-gray-400' }
}

function TrophyIcon({ position }: { position: number }) {
  if (position === 1) return <span className="text-lg" role="img" aria-label="gold">🥇</span>
  if (position === 2) return <span className="text-lg" role="img" aria-label="silver">🥈</span>
  if (position === 3) return <span className="text-lg" role="img" aria-label="bronze">🥉</span>
  return null
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  poolSlug: string
  leagueSlug: string
}

export default function LeaderboardTable({ entries, poolSlug, leagueSlug }: LeaderboardTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const expandedEntry = entries.find((e) => e.id === expandedId) ?? null

  const { data: detailData, isLoading: loading } = useLeaderboardUserEntries(
    poolSlug,
    leagueSlug,
    expandedEntry?.encrypted ?? null,
  )

  const details = detailData?.items ?? []

  function toggleExpand(entry: LeaderboardEntry) {
    if (expandedId === entry.id) {
      setExpandedId(null)
    } else {
      setExpandedId(entry.id)
    }
  }

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-300">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-3 text-gray-100">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 17.5L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <p className="text-sm font-medium">Nenhum participante no ranking</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-line bg-white">
      <table className="w-full">
        <thead>
          <tr className="bg-table-bg-gray border-b border-line">
            <th className="text-left text-xs font-semibold text-table-gray uppercase tracking-wide px-4 py-3 w-12">#</th>
            <th className="text-left text-xs font-semibold text-table-gray uppercase tracking-wide px-4 py-3">Participante</th>
            <th className="text-center text-xs font-semibold text-table-gray uppercase tracking-wide px-3 sm:px-4 py-3 w-16 sm:w-20">Pts</th>
            <th className="text-center text-xs font-semibold text-table-gray uppercase tracking-wide px-3 sm:px-4 py-3 w-20 hidden sm:table-cell">Palpites</th>
            <th className="text-center text-xs font-semibold text-table-gray uppercase tracking-wide px-3 sm:px-4 py-3 w-24 hidden md:table-cell">Exatos</th>
            <th className="w-10 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isOpen = expandedId === entry.id

            return (
              <tr key={entry.id} className="group">
                <td colSpan={6} className="p-0">
                  <button
                    onClick={() => toggleExpand(entry)}
                    className="w-full flex items-center border-b border-line last:border-b-0 hover:bg-table-bg-gray/50 transition-colors text-left cursor-pointer border-none"
                  >
                    <div className="flex-1 flex items-center py-3">
                      <div className="w-12 flex items-center gap-1 px-4">
                        <TrophyIcon position={entry.position ?? 0} />
                        {(!entry.position || entry.position > 3) && (
                          <span className="text-sm font-bold text-table-gray">{entry.position ?? 0}</span>
                        )}
                      </div>
                      <div className="flex-1 flex items-center gap-2 min-w-0 px-4">
                        {entry.avatarUrl ? (
                          <img src={entry.avatarUrl} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-green-cover-bg flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-green">{(entry.name ?? '?')[0]?.toUpperCase()}</span>
                          </div>
                        )}
                        <span className="text-sm font-semibold text-table-text truncate">{entry.name ?? 'Anônimo'}</span>
                      </div>
                      <div className="w-16 sm:w-20 text-center px-3 sm:px-4">
                        <span className="text-sm font-bold text-green">{entry.score}</span>
                      </div>
                      <div className="w-20 text-center px-3 sm:px-4 hidden sm:table-cell">
                        <span className="text-sm text-table-gray">{entry.totalGuesses}</span>
                      </div>
                      <div className="w-24 text-center px-3 sm:px-4 hidden md:table-cell">
                        <span className="text-sm text-table-gray">{entry.exactGuesses}</span>
                      </div>
                      <div className="w-10 flex items-center justify-center px-4">
                        <svg
                          width="12" height="12" viewBox="0 0 12 12" fill="none"
                          className={`text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail rows */}
                  {isOpen && (
                    <div className="border-b border-line bg-gray-50/50">
                      {loading ? (
                        <div className="px-4 py-6 text-center">
                          <div className="w-6 h-6 rounded-full border-2 border-green/30 border-t-green animate-spin mx-auto" />
                        </div>
                      ) : details && details.length > 0 ? (
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-line bg-gray-100/50">
                              <th className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2 pl-[3.25rem] hidden sm:table-cell">Data</th>
                              <th className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2">Partida</th>
                              <th className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2 w-16">Palpite</th>
                              <th className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2 w-16 hidden sm:table-cell">Placar</th>
                              <th className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2 w-20">Tipo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {details.map((d) => (
                              <tr key={d.matchId} className="border-b border-line/50 last:border-b-0 hover:bg-white/50 transition-colors">
                                <td className="px-3 sm:px-4 py-2 sm:py-2.5 pl-[2.5rem] sm:pl-[3.25rem] hidden sm:table-cell">
                                  <span className="text-[11px] sm:text-xs text-gray-400">{d.match ? formatDate(d.match.date) : '—'}</span>
                                </td>
                                <td className="px-3 sm:px-4 py-2 sm:py-2.5">
                                  <div className="flex items-center gap-1 sm:gap-1.5">
                                    <span className="text-[11px] sm:text-xs font-medium text-table-text truncate max-w-[60px] sm:max-w-none">{d.match?.homeTeam.initials ?? d.match?.homeTeam.name ?? '—'}</span>
                                    {d.match?.homeTeam.logo ? (
                                      <img src={d.match.homeTeam.logo} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[7px] font-bold text-gray-400">{(d.match?.homeTeam.initials ?? d.match?.homeTeam.name ?? '?')[0]}</span>
                                      </div>
                                    )}
                                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-300 flex-shrink-0 mx-0.5">vs</span>
                                    {d.match?.awayTeam.logo ? (
                                      <img src={d.match.awayTeam.logo} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[7px] font-bold text-gray-400">{(d.match?.awayTeam.initials ?? d.match?.awayTeam.name ?? '?')[0]}</span>
                                      </div>
                                    )}
                                    <span className="text-[11px] sm:text-xs font-medium text-table-text truncate max-w-[60px] sm:max-w-none">{d.match?.awayTeam.initials ?? d.match?.awayTeam.name ?? '—'}</span>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-center">
                                  {d.guess ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gray-500">
                                      <span>{d.guess.homeGoals}</span>
                                      <span className="text-gray-300">×</span>
                                      <span>{d.guess.awayGoals}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[11px] sm:text-xs text-gray-300">—</span>
                                  )}
                                </td>
                                <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-center hidden sm:table-cell">
                                  {d.match?.result ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gray-500">
                                      <span>{d.match.result.homeGoals}</span>
                                      <span className="text-gray-300">×</span>
                                      <span>{d.match.result.awayGoals}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[11px] sm:text-xs text-gray-300">—</span>
                                  )}
                                </td>
                                <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-center">
                                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold leading-none ${guessBadge(d.score).style}`}>
                                    <span>{guessBadge(d.score).label}</span>
                                    {d.score > 0 && <span>+{d.score}</span>}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-xs text-gray-300">Nenhum palpite encontrado.</p>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
