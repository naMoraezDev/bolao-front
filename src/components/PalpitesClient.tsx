'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useGuessesList, useCreateGuess } from '@/lib/queries'
import MatchCard from '@/components/MatchCard'
import AdBanner from '@/components/AdBanner'
import NewsWidget from '@/components/NewsWidget'
import { useAuth } from '@/contexts/auth'
import type { Match, Guess, NewsItem } from '@/lib/types'
import { translatePhase } from '@/lib/phases'

interface PalpitesClientProps {
  matches: Match[]
  poolSlug: string
  leagueSlug: string
  currentRound?: string
  phases?: string[]
  currentPhase?: string
  news?: NewsItem[]
  newsCategory?: string | null
}

export default function PalpitesClient({ matches, poolSlug, leagueSlug, currentRound, phases: rawPhases, currentPhase, news, newsCategory }: PalpitesClientProps) {
  const { user, loading: authLoading } = useAuth()
  const { data: guessesData } = useGuessesList(poolSlug, leagueSlug, !!user && !authLoading)
  const createGuessMutation = useCreateGuess()

  const [guesses, setGuesses] = useState<Record<string, Guess>>({})
  const [savingMatches, setSavingMatches] = useState<Record<string, boolean>>({})
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    if (guessesData && !showDebug) {
      const map: Record<string, Guess> = {}
      guessesData.forEach((g: Guess) => {
        map[g.matchId] = g
      })
      setGuesses(map)
    }
  }, [guessesData])

  const handleGuessChange = useCallback(
    (matchId: string, homeGoals: number, awayGoals: number) => {
      setGuesses((prev) => ({ ...prev, [matchId]: { matchId, homeGoals, awayGoals } }))

      if (timers.current[matchId]) {
        clearTimeout(timers.current[matchId])
      }

      timers.current[matchId] = setTimeout(async () => {
        setSavingMatches((prev) => ({ ...prev, [matchId]: true }))
        try {
          await createGuessMutation.mutateAsync({
            poolSlug,
            leagueSlug,
            guess: { matchId, homeGoals, awayGoals },
          })
        } catch {
          // silently fail — user can retry by typing again
        } finally {
          setSavingMatches((prev) => ({ ...prev, [matchId]: false }))
        }
      }, 600)
    },
    [poolSlug, leagueSlug, createGuessMutation],
  )

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout)
    }
  }, [])

  const phases = (rawPhases ?? []).filter(Boolean)
  const hasPhases = phases.length > 0

  const defaultPhase = hasPhases
    ? (currentPhase && phases.includes(currentPhase)
        ? currentPhase
        : phases.find((p) => matches.some((m) => !m.finished && m.phase === p))
          ?? phases[0]
          ?? null)
    : null

  const [selectedPhase, setSelectedPhase] = useState<string | null>(defaultPhase)
  const [finishedExpanded, setFinishedExpanded] = useState(false)

  const phaseMatches = hasPhases && selectedPhase
    ? matches.filter((m) => m.phase === selectedPhase)
    : matches

  const roundsInPhase = Array.from(
    new Set(phaseMatches.map((m) => m.round).filter(Boolean) as string[]),
  ).sort((a, b) => Number(a) - Number(b))

  const meaningfulRounds = roundsInPhase.filter((r) => r !== '0')
  const showRoundSelector = hasPhases ? meaningfulRounds.length > 0 : roundsInPhase.length > 0
  const displayRounds = hasPhases ? meaningfulRounds : roundsInPhase

  const currentRoundStr = currentRound != null ? String(currentRound) : undefined

  const [selectedRound, setSelectedRound] = useState<string | null>(null)

  useEffect(() => {
    if (!showRoundSelector) {
      setSelectedRound(null)
    } else {
      const defaultRd = displayRounds.find(
        (r) => phaseMatches.some((m) => !m.finished && m.round === r),
      ) ?? (currentRoundStr && displayRounds.includes(currentRoundStr) ? currentRoundStr : null)
        ?? (displayRounds.length > 0 ? displayRounds[0] : null)
      setSelectedRound((prev) => (prev && displayRounds.includes(prev) ? prev : defaultRd))
    }
  }, [selectedPhase, showRoundSelector])

  const effectiveRound = showRoundSelector ? selectedRound : null

  useEffect(() => {
    setFinishedExpanded(false)
  }, [selectedPhase, effectiveRound])

  const pendingMatches = effectiveRound
    ? phaseMatches.filter((m) => !m.finished && m.round === effectiveRound)
    : phaseMatches.filter((m) => !m.finished)

  const finishedMatches = effectiveRound
    ? phaseMatches.filter((m) => m.finished && m.round === effectiveRound)
    : phaseMatches.filter((m) => m.finished)

  // --- debug: ?debug=mixed|all-finished|all-pending ---
  const [debugState, setDebugState] = useState<string | null>(null)
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get('debug')
    setDebugState(d)
  }, [])
  const showDebug = debugState === 'mixed' || debugState === 'all-finished' || debugState === 'all-pending'
  const forceMixed = debugState === 'mixed'
  const forceAllFinished = debugState === 'all-finished'
  const forceAllPending = debugState === 'all-pending'

  const finalPending: Match[] = forceAllFinished ? [] : forceAllPending ? [...pendingMatches, ...finishedMatches] : pendingMatches
  const finalFinished: Match[] = forceAllFinished ? [...finishedMatches, ...pendingMatches] : forceAllPending ? [] : finishedMatches
  const displayPending = finalPending
  const displayFinished = forceMixed
    ? finishedMatches.length > 3
      ? finishedMatches.slice(0, 3)
      : finishedMatches
    : finalFinished

  useEffect(() => {
    if (!showDebug) return
    const matchesInPhase = effectiveRound
      ? phaseMatches.filter((m) => m.round === effectiveRound)
      : phaseMatches
    const fakeGuesses: Record<string, Guess> = {}
    matchesInPhase.forEach((m, i) => {
      fakeGuesses[m.id] = {
        matchId: m.id,
        homeGoals: 1 + (i % 3),
        awayGoals: 1,
        score: i % 3 === 0 ? 10 : i % 3 === 1 ? 3 : 0,
      }
    })
    setGuesses(fakeGuesses)
  }, [showDebug, effectiveRound, phaseMatches])

  function renderMatchList(list: Match[], interactive: boolean) {
    return (
      <div className="space-y-3">
        {list.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            guess={guesses[match.id]}

            blocked={interactive && !user}
            {...(interactive && user ? { onGuessChange: handleGuessChange, saving: savingMatches[match.id] } : {})}
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
      {hasPhases && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setSelectedPhase(phase)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                selectedPhase === phase
                  ? 'bg-green text-white border-green'
                  : 'bg-white text-gray-400 border-line hover:border-green/30 hover:text-green'
              }`}
            >
              {translatePhase(phase)}
            </button>
          ))}
        </div>
      )}
      {showRoundSelector && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              const idx = displayRounds.indexOf(selectedRound!)
              if (idx > 0) setSelectedRound(displayRounds[idx - 1])
            }}
            disabled={displayRounds.indexOf(selectedRound!) === 0}
            className="w-9 h-9 rounded-xl border border-green/30 bg-green-cover-bg flex items-center justify-center text-green hover:bg-green hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="bg-green-cover-bg rounded-xl px-4 sm:px-6 py-2.5 min-w-[120px] sm:min-w-[160px] text-center">
            <span className="text-base font-bold text-green select-none">
              Rodada {selectedRound}
            </span>
          </div>

          <button
            onClick={() => {
              const idx = displayRounds.indexOf(selectedRound!)
              if (idx < displayRounds.length - 1) setSelectedRound(displayRounds[idx + 1])
            }}
            disabled={displayRounds.indexOf(selectedRound!) === displayRounds.length - 1}
            className="w-9 h-9 rounded-xl border border-green/30 bg-green-cover-bg flex items-center justify-center text-green hover:bg-green hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
      {showDebug && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider mr-1">Debug:</span>
          {(['mixed', 'all-finished', 'all-pending'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setDebugState(s)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                debugState === s
                  ? 'bg-green text-white border-green'
                  : 'bg-white text-gray-400 border-line hover:border-green/30 hover:text-green'
              }`}
            >
              {s === 'mixed' ? 'Mistos' : s === 'all-finished' ? 'Tudo finalizado' : 'Tudo pendente'}
            </button>
          ))}
        </div>
      )}

      {(() => {
        const hasPending = displayPending.length > 0
        const hasFinished = displayFinished.length > 0
        const showTwoColumns = hasPending && hasFinished
        const showAllFinished = !hasPending && hasFinished
        const showOnlyPending = hasPending && !hasFinished

        function FinishedCard({ match }: { match: Match }) {
          const g = guesses[match.id]
          return (
            <div className="bg-white rounded-lg border border-green/30 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
                  <span className="text-xs font-semibold text-gray-500 truncate">{match.homeTeam.initials || match.homeTeam.name}</span>
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
                  <span className="text-xs font-semibold text-gray-500 truncate">{match.awayTeam.initials || match.awayTeam.name}</span>
                </div>
              </div>
              {g?.score !== undefined && (
                <div className={`mt-2 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg ${
                  g.score === 10 ? 'bg-green-cover-bg'
                  : g.score > 0 ? 'bg-amber-50'
                  : 'bg-red-50'
                }`}>
                  <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wide">Seu palpite</span>
                  <span className={`text-sm font-bold ${
                    g.score === 10 ? 'text-green'
                    : g.score > 0 ? 'text-amber-700'
                    : 'text-red-widget'
                  }`}>
                    {g.homeGoals} x {g.awayGoals}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                    g.score === 10 ? 'bg-green text-white'
                    : g.score > 0 ? 'bg-amber-200 text-amber-800'
                    : 'bg-red-200 text-red-800'
                  }`}>
                    {g.score === 10 ? 'Exato +10'
                    : g.score > 0 ? `+${g.score}`
                    : '0 pts'}
                  </span>
                </div>
              )}
            </div>
          )
        }

        return (
          <div className={`grid grid-cols-1 gap-6 ${showTwoColumns ? 'md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]' : ''}`}>
            {/* Left finished column — only when there are still pending matches */}
            {showTwoColumns && (
              <div>
                <h2 className="text-sm font-semibold text-table-gray uppercase tracking-wide mb-3 px-1">
                  Finalizados
                </h2>
                <div className="space-y-2">
                  {(finishedExpanded ? displayFinished : displayFinished.slice(0, 5)).map((match) => (
                    <FinishedCard key={match.id} match={match} />
                  ))}
                </div>
                {displayFinished.length > 5 && !finishedExpanded && (
                  <button
                    onClick={() => setFinishedExpanded(true)}
                    className="mt-2 w-full text-[11px] font-medium text-table-gray hover:text-green transition-colors py-1.5 rounded-lg hover:bg-green-cover-btn cursor-pointer border-none bg-transparent"
                  >
                    Ver todos os {displayFinished.length} resultados
                  </button>
                )}
                {finishedExpanded && displayFinished.length > 5 && (
                  <button
                    onClick={() => setFinishedExpanded(false)}
                    className="mt-2 w-full text-[11px] font-medium text-table-gray hover:text-green transition-colors py-1.5 rounded-lg hover:bg-green-cover-btn cursor-pointer border-none bg-transparent"
                  >
                    Mostrar menos
                  </button>
                )}
                <div className="lg:sticky lg:top-20 mt-4">
                  <AdBanner variant="square" />
                </div>
              </div>
            )}

            {/* Main column */}
            <div className="min-w-0">
              {showAllFinished && (
                <>
                  <h2 className="text-sm font-semibold text-table-gray uppercase tracking-wide mb-3 px-1">
                    Resultados
                  </h2>
                  {renderMatchList(displayFinished, false)}
                  <div className="mt-4">
                    <AdBanner variant="horizontal" />
                  </div>
                  <NewsWidget news={news} category={newsCategory ?? undefined} />
                </>
              )}

              {showOnlyPending && (
                <>
                  <h2 className="text-sm font-semibold text-table-gray uppercase tracking-wide mb-3 px-1">
                    Próximos Jogos
                  </h2>
                  <div className="space-y-3">
                    {!user && !authLoading && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-600 flex-shrink-0">
                            <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <p className="text-sm text-amber-800">Faça login para fazer seus palpites.</p>
                        </div>
                        <a href="/auth" className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-green text-white text-xs font-semibold hover:bg-green-hover transition-colors no-underline">
                          Entrar
                        </a>
                      </div>
                    )}
                    {renderMatchList(displayPending, true)}
                  </div>
                  <div className="mt-4">
                    <AdBanner variant="horizontal" />
                  </div>
                  <NewsWidget news={news} category={newsCategory ?? undefined} />
                </>
              )}

              {showTwoColumns && (
                <>
                  <h2 className="text-sm font-semibold text-table-gray uppercase tracking-wide mb-3 px-1">
                    Próximos Jogos
                  </h2>
                  <div className="space-y-3">
                    {!user && !authLoading && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-600 flex-shrink-0">
                            <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <p className="text-sm text-amber-800">Faça login para fazer seus palpites.</p>
                        </div>
                        <a href="/auth" className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-green text-white text-xs font-semibold hover:bg-green-hover transition-colors no-underline">
                          Entrar
                        </a>
                      </div>
                    )}
                    {renderMatchList(displayPending, true)}
                  </div>
                  <div className="mt-4">
                    <AdBanner variant="horizontal" />
                  </div>
                  <NewsWidget news={news} category={newsCategory ?? undefined} />
                </>
              )}

              {!showAllFinished && !showOnlyPending && !showTwoColumns && (
                <div className="bg-white rounded-lg border border-dashed border-gray-200 p-6 text-center">
                  <p className="text-sm text-gray-300">Nenhum jogo encontrado para {hasPhases ? 'esta fase' : 'esta rodada'}.</p>
                </div>
              )}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
