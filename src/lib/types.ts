export interface Pool {
  id: string
  name: string
  slug: string
}

export interface PoolDetails extends Pool {
  defaultLeague?: League
  template?: Record<string, unknown>
  info?: Record<string, unknown>
  faq?: Record<string, unknown>
}

export interface League {
  id: string
  name: string
  slug: string
  creatorId?: string
  isDefaultLeague?: boolean
  template?: Record<string, unknown>
  info?: Record<string, unknown>
  faq?: Record<string, unknown>
  pool?: { id: string; name: string; slug: string }
  pools?: { pool: { id: string; name: string; slug: string } }[]
}

export interface Match {
  id: string
  round?: string
  phase?: string
  date: string
  stadium?: string
  finished: boolean
  locked: boolean
  homeTeam: Team
  awayTeam: Team
  gameScore?: GameScore
}

export interface Team {
  id: string
  name: string
  shortName?: string
  logo?: string
}

export interface GameScore {
  homeGoals: number
  awayGoals: number
}

export interface Guess {
  matchId: string
  homeGoals: number
  awayGoals: number
  score?: number
}

export interface LeaderboardEntry {
  id: string
  name?: string
  score: number
  position?: number
  avatarUrl?: string
  exactGuesses: number
  encrypted?: string
}

export interface LeaderboardEntryDetail {
  score: number
  matchId: string
  guess?: { homeGoals: number; awayGoals: number }
  match?: {
    date: string
    homeTeam: Team
    awayTeam: Team
    result?: GameScore
  }
}

export interface Participant {
  id: string
  name?: string
  avatarUrl?: string
  joinedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: { code: string; message: string; details?: unknown }
  meta?: { timestamp: string; requestId?: string; cached?: boolean }
}

export interface PoolMatchesData {
  phases?: string[]
  rounds?: string[]
  currentRound?: string
  currentPhase?: string
  matches: Match[]
}
