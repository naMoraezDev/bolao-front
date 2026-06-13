'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth'
import InviteModal from './InviteModal'

interface LeagueInviteButtonProps {
  leagueSlug: string
}

export default function LeagueInviteButton({ leagueSlug }: LeagueInviteButtonProps) {
  const { user } = useAuth()
  const [showInvite, setShowInvite] = useState(false)

  if (!user) return null

  return (
    <>
      <button
        onClick={() => setShowInvite(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-line text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Convidar
      </button>
      <InviteModal leagueSlug={leagueSlug} open={showInvite} onClose={() => setShowInvite(false)} />
    </>
  )
}
