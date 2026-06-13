'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import MatchCard from '@/components/MatchCard'
import { useAuth } from '@/contexts/auth'
import type { Match, Guess } from '@/lib/types'
import type { MatchOdds } from '@/lib/odds'

interface PalpitesClientProps {
  matches: Match[]
  poolSlug: string
  leagueSlug: string
  oddsMap?: Record<string, MatchOdds | null>
}

export default function PalpitesClient({ matches, poolSlug, leagueSlug, oddsMap }: PalpitesClientProps) {
  const { user, loading: authLoading } = useAuth()
  const [guesses, setGuesses] = useState<Record<string, Guess>>({})
  const [savingMatches, setSavingMatches] = useState<Record<string, boolean>>({})
  const [participants, setParticipants] = useState<{ id: string; name?: string }[]>([])
  const [participantsLoading, setParticipantsLoading] = useState(true)
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    if (authLoading || !user) return

    api.guesses
      .listByUser(poolSlug, leagueSlug)
      .then((data) => {
        const map: Record<string, Guess> = {}
        data.forEach((g) => {
          map[g.matchId] = g
        })
        setGuesses(map)
      })
      .catch(() => {})

    api.leagues
      .getParticipants(poolSlug, leagueSlug)
      .then((data) => setParticipants(data.items ?? []))
      .catch(() => {})
      .finally(() => setParticipantsLoading(false))
  }, [poolSlug, leagueSlug, user, authLoading])

  const handleGuessChange = useCallback(
    (matchId: string, homeGoals: number, awayGoals: number) => {
      setGuesses((prev) => ({ ...prev, [matchId]: { matchId, homeGoals, awayGoals } }))

      if (timers.current[matchId]) {
        clearTimeout(timers.current[matchId])
      }

      timers.current[matchId] = setTimeout(async () => {
        setSavingMatches((prev) => ({ ...prev, [matchId]: true }))
        try {
          await api.guesses.create(poolSlug, leagueSlug, {
            matchId,
            homeGoals,
            awayGoals,
          })
        } catch {
          // silently fail — user can retry by typing again
        } finally {
          setSavingMatches((prev) => ({ ...prev, [matchId]: false }))
        }
      }, 600)
    },
    [poolSlug, leagueSlug],
  )

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout)
    }
  }, [])

  const rounds = Array.from(
    new Set(matches.map((m) => m.round).filter(Boolean) as string[]),
  ).sort((a, b) => Number(a) - Number(b))
  const [selectedRound, setSelectedRound] = useState<string | null>(null)

  const pendingMatches = selectedRound
    ? matches.filter((m) => !m.finished && m.round === selectedRound)
    : matches.filter((m) => !m.finished)
  const finishedMatches = matches.filter((m) => m.finished)

  function renderMatchList(list: Match[], interactive: boolean) {
    return (
      <div className="space-y-3">
        {list.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            guess={guesses[match.id]}
            odds={oddsMap?.[match.id] ?? null}
            {...(interactive ? { onGuessChange: handleGuessChange, saving: savingMatches[match.id] } : {})}
          />
        ))}
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-line p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="text-gray-300"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="text-gray-300 text-sm">Nenhum jogo disponível para este bolão.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {rounds.length > 0 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              if (!selectedRound) return
              const idx = rounds.indexOf(selectedRound)
              if (idx > 0) setSelectedRound(rounds[idx - 1])
            }}
            disabled={!selectedRound || rounds.indexOf(selectedRound) === 0}
            className="w-9 h-9 rounded-xl border border-green/30 bg-green-cover-bg flex items-center justify-center text-green hover:bg-green hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="bg-green-cover-bg rounded-xl px-6 py-2.5 min-w-[160px] text-center">
            <button
              onClick={() => setSelectedRound(null)}
              className="text-base font-bold text-green hover:text-green/70 transition-colors select-none"
            >
              {selectedRound ? `Rodada ${selectedRound}` : 'Todas as rodadas'}
            </button>
          </div>

          <button
            onClick={() => {
              if (selectedRound) {
                const idx = rounds.indexOf(selectedRound)
                if (idx < rounds.length - 1) setSelectedRound(rounds[idx + 1])
              } else {
                setSelectedRound(rounds[0])
              }
            }}
            disabled={selectedRound !== null && rounds.indexOf(selectedRound) === rounds.length - 1}
            className="w-9 h-9 rounded-xl border border-green/30 bg-green-cover-bg flex items-center justify-center text-green hover:bg-green hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div>
          {finishedMatches.length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-table-gray uppercase tracking-wide mb-3 px-1">
                Finalizados
              </h2>
              <div className="space-y-2">
                {finishedMatches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-lg border border-green/30 p-3 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
                      <span className="text-xs font-semibold text-gray-500 truncate">
                        {match.homeTeam.name}
                      </span>
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {match.homeTeam.logo ? (
                          <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-4 h-4 object-contain" />
                        ) : (
                          <span className="text-[8px] font-bold text-gray-300">H</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="w-8 h-8 rounded-md bg-green-cover-bg flex items-center justify-center text-sm font-bold text-green">
                        {match.gameScore?.homeGoals ?? 0}
                      </span>
                      <span className="text-gray-300 font-bold text-xs">×</span>
                      <span className="w-8 h-8 rounded-md bg-green-cover-bg flex items-center justify-center text-sm font-bold text-green">
                        {match.gameScore?.awayGoals ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {match.awayTeam.logo ? (
                          <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-4 h-4 object-contain" />
                        ) : (
                          <span className="text-[8px] font-bold text-gray-300">A</span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-gray-500 truncate">
                        {match.awayTeam.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {(participantsLoading || participants.length > 0) && (
            <div className={`bg-white rounded-lg border border-line overflow-hidden ${finishedMatches.length > 0 ? 'mt-4' : ''}`}>
              <div className="px-4 py-3 border-b border-line">
                {participantsLoading ? (
                  <div className="w-28 h-3 rounded bg-gray-200 animate-pulse" />
                ) : (
                  <h2 className="font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Participantes ({participants.length})
                  </h2>
                )}
              </div>
              <div className="divide-y divide-line">
                {participantsLoading
                  ? [1, 2, 3].map((i) => (
                      <div key={i} className="px-4 py-2.5 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
                        <div className="w-28 h-3 rounded bg-gray-200 animate-pulse" />
                      </div>
                    ))
                  : participants.slice(0, 5).map((p) => (
                      <div key={p.id} className="px-4 py-2.5 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-green-cover-bg flex items-center justify-center flex-shrink-0">
                          <span className="text-[11px] font-bold text-green">
                            {(p.name ?? '?')[0]?.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-table-text truncate">
                          {p.name ?? 'Anônimo'}
                        </span>
                      </div>
                    ))}
                {!participantsLoading && participants.length > 5 && (
                  <div className="px-4 py-2.5 text-center">
                    <span className="text-xs text-gray-300">
                      e mais {participants.length - 5}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="lg:sticky lg:top-20 mt-4">
            <a
              href="#"
              className="block rounded-lg overflow-hidden hover:opacity-90 transition-opacity aspect-square"
            >
              <div className="bg-[#1B4D3E] w-full h-full flex flex-col items-center justify-center gap-3 px-4">
                <span className="text-[#A3D977] text-xs font-bold uppercase tracking-widest text-center">APOSTE COM</span>
                <span className="text-white text-3xl font-black italic leading-none">bet365</span>
                <div className="w-10 h-px bg-white/20" />
                <span className="text-white text-xs font-semibold uppercase tracking-wide text-center">Odds incríveis</span>
                <span className="bg-[#A3D977] text-[#1B4D3E] text-xs font-bold px-3 py-1 rounded">Cadastre-se já!</span>
              </div>
            </a>
          </div>
        </div>

        {pendingMatches.length > 0 && (
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-table-gray uppercase tracking-wide mb-3 px-1">
              Próximos Jogos
            </h2>
            {renderMatchList(pendingMatches.slice(0, Math.ceil(pendingMatches.length / 2)), true)}

            {pendingMatches.length > 4 && (
              <div className="my-6">
                <a
                  href="#"
                  className="block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <div className="bg-[#1B4D3E] h-20 flex items-center justify-center gap-4 px-6">
                    <div className="flex flex-col items-end">
                      <span className="text-[#A3D977] text-[10px] font-bold uppercase tracking-widest">APOSTE COM</span>
                      <span className="text-white text-xl font-black italic -mt-0.5">bet365</span>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="flex flex-col items-start">
                      <span className="text-white text-xs font-semibold uppercase tracking-wide">Odds incríveis</span>
                      <span className="text-[#A3D977] text-xs font-bold">Cadastre-se já!</span>
                    </div>
                  </div>
                </a>
              </div>
            )}

            {renderMatchList(pendingMatches.slice(Math.ceil(pendingMatches.length / 2)), true)}
          </div>
        )}
      </div>
    </div>
  )
}
