import type { LeaderboardEntry } from '@/lib/types'

function TrophyIcon({ position }: { position: number }) {
  if (position === 1) {
    return <span className="text-lg" role="img" aria-label="gold">🥇</span>
  }
  if (position === 2) {
    return <span className="text-lg" role="img" aria-label="silver">🥈</span>
  }
  if (position === 3) {
    return <span className="text-lg" role="img" aria-label="bronze">🥉</span>
  }
  return null
}

export default function LeaderboardTable({
  entries,
}: {
  entries: LeaderboardEntry[]
}) {
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
    <div className="overflow-hidden rounded-lg border border-line">
      <table className="w-full">
        <thead>
          <tr className="bg-table-bg-gray border-b border-line">
            <th className="text-left text-xs font-semibold text-table-gray uppercase tracking-wide px-4 py-3 w-12">
              #
            </th>
            <th className="text-left text-xs font-semibold text-table-gray uppercase tracking-wide px-4 py-3">
              Participante
            </th>
            <th className="text-center text-xs font-semibold text-table-gray uppercase tracking-wide px-4 py-3 w-20">
              Pontos
            </th>
            <th className="text-center text-xs font-semibold text-table-gray uppercase tracking-wide px-4 py-3 w-20 hidden sm:table-cell">
              Palpites
            </th>
            <th className="text-center text-xs font-semibold text-table-gray uppercase tracking-wide px-4 py-3 w-24 hidden md:table-cell">
              Exatos
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={entry.id}
              className="border-b border-line last:border-b-0 hover:bg-table-bg-gray/50 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <TrophyIcon position={entry.position ?? index + 1} />
                  {(!entry.position || entry.position > 3) && (
                    <span className="text-sm font-bold text-table-gray">
                      {entry.position ?? index + 1}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {entry.avatarUrl ? (
                    <img
                      src={entry.avatarUrl}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-green-cover-bg flex items-center justify-center">
                      <span className="text-[10px] font-bold text-green">
                        {(entry.name ?? '?')[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-semibold text-table-text">
                    {entry.name ?? 'Anônimo'}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm font-bold text-green">{entry.score}</span>
              </td>
              <td className="px-4 py-3 text-center hidden sm:table-cell">
                <span className="text-sm text-table-gray">{entry.exactGuesses}</span>
              </td>
              <td className="px-4 py-3 text-center hidden md:table-cell">
                <span className="text-sm text-table-gray">{entry.exactGuesses}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
