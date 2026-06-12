import type { ApiResponse, League, LeaderboardEntry, LeaderboardEntryDetail, Participant, Pool, PoolDetails, Guess, PoolMatchesData } from './types'
import { getAuthToken } from './auth-token'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3019'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '240048bff53b845b071fa97074fe78df80eaabfe2991734ad378a2ed2956bff0'

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}/v1${path}`
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers as Record<string, string>,
    },
  })

  const json: ApiResponse<T> = await res.json()

  if (!json.success || !json.data) {
    throw new Error(json.error?.message || 'API request failed')
  }

  return json.data
}

export const api = {
  pools: {
    list: () => fetchApi<Pool[]>('/pools'),
    getBySlug: (slug: string) => fetchApi<PoolDetails>(`/pools/${slug}`),
    getMatches: (slug: string) => fetchApi<PoolMatchesData>(`/pools/${slug}/matches`),
  },

  leagues: {
    getByPoolAndSlug: (poolSlug: string, leagueSlug: string) =>
      fetchApi<League>(`/pools/${poolSlug}/leagues/${leagueSlug}`),
    getParticipants: (poolSlug: string, leagueSlug: string) =>
      fetchApi<{ items: Participant[]; nextCursor?: string }>(
        `/pools/${poolSlug}/leagues/${leagueSlug}/participants`
      ),
    listPublic: () => fetchApi<League[]>('/leagues/public'),
  },

  guesses: {
    listByUser: (poolSlug: string, leagueSlug: string) =>
      fetchApi<Guess[]>(`/user/pools/${poolSlug}/leagues/${leagueSlug}/guesses`),
    create: (poolSlug: string, leagueSlug: string, guess: Guess) =>
      fetchApi<Guess>(`/pools/${poolSlug}/leagues/${leagueSlug}/guesses`, {
        method: 'POST',
        body: JSON.stringify(guess),
      }),
  },

  leaderboard: {
    getRanking: (poolSlug: string, leagueSlug: string, params?: { key?: string; type?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString()
      return fetchApi<{ items: LeaderboardEntry[]; nextCursor?: string }>(
        `/pools/${poolSlug}/leagues/${leagueSlug}/leaderboard${query ? `?${query}` : ''}`
      )
    },
    getUserEntries: (poolSlug: string, leagueSlug: string, encrypted: string) =>
      fetchApi<{ items: LeaderboardEntryDetail[]; nextCursor?: string }>(
        `/pools/${poolSlug}/leagues/${leagueSlug}/leaderboard/user/${encrypted}/entries`
      ),
  },
}
