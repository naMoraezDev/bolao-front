'use client'

import { useState } from 'react'
import JoinLeagueModal from './JoinLeagueModal'

export default function JoinLeagueButton() {
  const [showJoin, setShowJoin] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowJoin(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green text-white text-sm font-semibold hover:bg-green-hover transition-colors cursor-pointer border-none"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Entrar com código
      </button>
      <JoinLeagueModal open={showJoin} onClose={() => setShowJoin(false)} />
    </>
  )
}
