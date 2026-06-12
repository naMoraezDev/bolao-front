import Link from 'next/link'
import type { Pool } from '@/lib/types'

export default function PoolCard({ pool }: { pool: Pool }) {
  return (
    <Link
      href={`/pools/${pool.slug}`}
      className="group block bg-white rounded-lg border border-line p-5 hover:shadow-card hover:border-green/20 transition-all duration-200 no-underline"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-cover-bg flex items-center justify-center group-hover:bg-green-cover-btn transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green">
              <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 group-hover:text-green transition-colors">
              {pool.name}
            </h3>
            <span className="text-xs text-gray-300">
              /{pool.slug}
            </span>
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
