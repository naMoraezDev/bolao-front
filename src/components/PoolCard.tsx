import Link from 'next/link'
import type { Pool } from '@/lib/types'
import PoolStatusBadge from './PoolStatusBadge'

export default function PoolCard({ pool }: { pool: Pool }) {
  const hasIcon = !!pool.cover

  return (
    <Link
      href={`/bolao/${pool.slug}`}
      className={`group block rounded-lg border p-5 hover:shadow-card transition-all duration-200 no-underline relative overflow-hidden ${
        hasIcon
          ? 'border-white/10 hover:border-white/20'
          : 'bg-white border-line hover:border-green/20'
      }`}
    >
      {hasIcon && (
        <>
          <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${pool.cover})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
        </>
      )}

      <div className="relative z-10 flex items-start justify-between min-h-[56px] gap-3">
        {hasIcon ? (
          <>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white truncate">
                {pool.name}
              </h3>
              <span className="text-xs text-white/60">
                Faça seus palpites
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 mt-1">
              <PoolStatusBadge status={pool.status} glass />
              <div className="text-white/50 group-hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-14 h-14 rounded-lg bg-green-cover-bg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:bg-green-cover-btn transition-colors">
                <svg width="28" height="28" viewBox="0 0 20 20" fill="none" className="text-green">
                  <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-500 truncate group-hover:text-green transition-colors">
                  {pool.name}
                </h3>
                <span className="text-xs text-gray-300">
                  Faça seus palpites
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <PoolStatusBadge status={pool.status} />
              <div className="text-gray-300 group-hover:text-green transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    </Link>
  )
}
