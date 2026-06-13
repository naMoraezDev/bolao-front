import type { MatchOdds } from '@/lib/odds'

interface OddsDisplayProps {
  odds: MatchOdds | null
}

export default function OddsDisplay({ odds }: OddsDisplayProps) {
  if (!odds) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Odds</span>
      <div className="flex items-center gap-1">
        {odds.homeWin && (
          <span className="px-1.5 py-0.5 rounded-sm bg-gray-50 border border-line text-[11px] font-bold text-green">
            {odds.homeWin.toFixed(2)}
          </span>
        )}
        {odds.draw && (
          <span className="px-1.5 py-0.5 rounded-sm bg-gray-50 border border-line text-[11px] font-bold text-amber-600">
            {odds.draw.toFixed(2)}
          </span>
        )}
        {odds.awayWin && (
          <span className="px-1.5 py-0.5 rounded-sm bg-gray-50 border border-line text-[11px] font-bold text-red-600">
            {odds.awayWin.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  )
}
