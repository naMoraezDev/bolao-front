'use client'

import type { Match, Guess } from '@/lib/types'
import type { MatchOdds } from '@/lib/odds'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import OddsDisplay from './OddsDisplay'

interface MatchCardProps {
  match: Match
  guess?: Guess
  onGuessChange?: (matchId: string, homeGoals: number, awayGoals: number) => void
  saving?: boolean
  odds?: MatchOdds | null
}

export default function MatchCard({ match, guess, onGuessChange, saving, odds }: MatchCardProps) {
  const matchDate = new Date(match.date)

  const isFinished = match.finished
  const isLocked = match.locked

  return (
    <div
      className={`bg-white rounded-lg border ${isFinished ? 'border-green/30' : 'border-line'} p-4 transition-all hover:shadow-normal`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-300 font-medium uppercase tracking-wide">
          {match.phase && `${match.phase}${match.round ? ` - ${match.round}` : ''}`}
        </span>
        <div className="flex items-center gap-2">
          {isFinished && (
            <span className="text-[10px] font-semibold text-green bg-green-cover-bg px-2 py-0.5 rounded-sm uppercase">
              Finalizado
            </span>
          )}
          {isLocked && !isFinished && (
            <span className="text-[10px] font-semibold text-red-widget bg-red-50 px-2 py-0.5 rounded-sm uppercase">
              Trancado
            </span>
          )}
          <span className="text-xs text-gray-300">
            {format(matchDate, "dd/MM 'às' HH:mm", { locale: ptBR })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {match.homeTeam.logo ? (
              <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-[10px] font-bold text-gray-300">H</span>
            )}
          </div>
          <span className="text-sm font-semibold text-gray-500 truncate">
            {match.homeTeam.name}
          </span>
        </div>

        {isFinished ? (
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 rounded-lg bg-green-cover-bg flex items-center justify-center text-lg font-bold text-green">
              {match.gameScore?.homeGoals ?? 0}
            </span>
            <span className="text-gray-300 font-bold text-base">×</span>
            <span className="w-12 h-12 rounded-lg bg-green-cover-bg flex items-center justify-center text-lg font-bold text-green">
              {match.gameScore?.awayGoals ?? 0}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={99}
              value={guess?.homeGoals ?? ''}
              onChange={(e) =>
                onGuessChange?.(match.id, Number(e.target.value), guess?.awayGoals ?? 0)
              }
              disabled={isLocked}
              placeholder="?"
              className="w-12 h-12 rounded-lg border border-line text-center text-base font-bold text-gray-700 focus:border-green focus:ring-1 focus:ring-green/20 outline-none disabled:opacity-40 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-gray-300 font-bold text-base">×</span>
            <input
              type="number"
              min={0}
              max={99}
              value={guess?.awayGoals ?? ''}
              onChange={(e) =>
                onGuessChange?.(match.id, guess?.homeGoals ?? 0, Number(e.target.value))
              }
              disabled={isLocked}
              placeholder="?"
              className="w-12 h-12 rounded-lg border border-line text-center text-base font-bold text-gray-700 focus:border-green focus:ring-1 focus:ring-green/20 outline-none disabled:opacity-40 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {saving && (
              <span className="w-2 h-2 rounded-full bg-green animate-pulse flex-shrink-0 ml-1" />
            )}
          </div>
        )}

        <div className="flex items-center gap-2 min-w-0 justify-end">
          <span className="text-sm font-semibold text-gray-500 truncate">
            {match.awayTeam.name}
          </span>
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {match.awayTeam.logo ? (
              <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-[10px] font-bold text-gray-300">A</span>
            )}
          </div>
        </div>
      </div>

      {(match.stadium || (!isFinished && odds)) && (
        <div className="mt-3 flex items-center gap-2">
          {match.stadium && <span className="text-xs text-gray-300">{match.stadium}</span>}
          {!isFinished && odds && (
            <>
              {match.stadium && <span className="text-gray-200">·</span>}
              <OddsDisplay odds={odds} />
            </>
          )}
        </div>
      )}

      {guess?.score !== undefined && isFinished && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-xs font-semibold text-green">Palpite:</span>
          <span className="text-xs text-gray-500">
            {guess.homeGoals} x {guess.awayGoals}
          </span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs font-semibold text-green">
            +{guess.score} pts
          </span>
        </div>
      )}
    </div>
  )
}
