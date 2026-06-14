'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function LeaguePage() {
  const params = useParams()
  const poolSlug = params.poolSlug as string
  const leagueSlug = params.leagueSlug as string

  useEffect(() => {
    window.location.replace(`/bolao/${poolSlug}/ligas/${leagueSlug}/palpites`)
  }, [poolSlug, leagueSlug])

  return null
}
