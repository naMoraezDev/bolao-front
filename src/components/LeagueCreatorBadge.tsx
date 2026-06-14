'use client'

import { useAuth } from '@/contexts/auth'

export default function LeagueCreatorBadge({ creatorId }: { creatorId?: string | null }) {
  const { user } = useAuth()

  if (!user || !creatorId || user.uid !== creatorId) return null

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 border border-yellow-200/50 text-[10px] font-semibold text-yellow-600 uppercase tracking-wide">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M6 1L7.5 4L11 4.5L8.5 7L9 10.5L6 9L3 10.5L3.5 7L1 4.5L4.5 4L6 1Z" fill="currentColor" />
      </svg>
      Criador
    </span>
  )
}
