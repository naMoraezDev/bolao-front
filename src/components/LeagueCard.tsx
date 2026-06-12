import Link from 'next/link'
import type { League } from '@/lib/types'

export default function LeagueCard({
  league,
  poolSlug,
}: {
  league: League
  poolSlug: string
}) {
  return (
    <Link
      href={`/pools/${poolSlug}/leagues/${league.slug}`}
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
            {league.isDefaultLeague && (
              <span className="text-xs text-green font-medium">
                Liga Padrão
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-300 group-hover:text-green transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
