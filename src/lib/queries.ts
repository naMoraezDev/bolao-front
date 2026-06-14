import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type { Pool, PoolDetails, PoolMatchesData } from './types'
import type { League, Participant, CreatedLeague, LeagueInvite, JoinedLeague } from './types'
import type { Guess, LeaderboardEntry, LeaderboardEntryDetail, UserStats } from './types'

export const queryKeys = {
  pools: {
    all: ['pools'] as const,
    list: () => [...queryKeys.pools.all, 'list'] as const,
    detail: (slug: string) => [...queryKeys.pools.all, 'detail', slug] as const,
    matches: (slug: string) => [...queryKeys.pools.all, 'matches', slug] as const,
  },
  leagues: {
    all: ['leagues'] as const,
    public: () => [...queryKeys.leagues.all, 'public'] as const,
    detail: (poolSlug: string, leagueSlug: string) =>
      [...queryKeys.leagues.all, 'detail', poolSlug, leagueSlug] as const,
    participants: (poolSlug: string, leagueSlug: string) =>
      [...queryKeys.leagues.all, 'participants', poolSlug, leagueSlug] as const,
  },
  user: {
    all: ['user'] as const,
    leagues: () => [...queryKeys.user.all, 'leagues'] as const,
    stats: (poolSlug: string, leagueSlug: string) =>
      [...queryKeys.user.all, 'stats', poolSlug, leagueSlug] as const,
  },
  guesses: {
    all: ['guesses'] as const,
    list: (poolSlug: string, leagueSlug: string) =>
      [...queryKeys.guesses.all, 'list', poolSlug, leagueSlug] as const,
  },
  leaderboard: {
    all: ['leaderboard'] as const,
    ranking: (poolSlug: string, leagueSlug: string) =>
      [...queryKeys.leaderboard.all, 'ranking', poolSlug, leagueSlug] as const,
    userEntries: (poolSlug: string, leagueSlug: string, encrypted: string) =>
      [...queryKeys.leaderboard.all, 'entries', poolSlug, leagueSlug, encrypted] as const,
  },
}

export function usePoolsList() {
  return useQuery({
    queryKey: queryKeys.pools.list(),
    queryFn: () => api.pools.list(),
  })
}

export function usePoolDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.pools.detail(slug),
    queryFn: () => api.pools.getBySlug(slug),
    enabled: !!slug,
  })
}

export function usePoolMatches(slug: string) {
  return useQuery({
    queryKey: queryKeys.pools.matches(slug),
    queryFn: () => api.pools.getMatches(slug),
    enabled: !!slug,
  })
}

export function useLeaguesPublic() {
  return useQuery({
    queryKey: queryKeys.leagues.public(),
    queryFn: () => api.leagues.listPublic(),
  })
}

export function useLeagueDetail(poolSlug: string, leagueSlug: string) {
  return useQuery({
    queryKey: queryKeys.leagues.detail(poolSlug, leagueSlug),
    queryFn: () => api.leagues.getByPoolAndSlug(poolSlug, leagueSlug),
    enabled: !!poolSlug && !!leagueSlug,
  })
}

export function useLeagueParticipants(poolSlug: string, leagueSlug: string) {
  return useQuery({
    queryKey: queryKeys.leagues.participants(poolSlug, leagueSlug),
    queryFn: () => api.leagues.getParticipants(poolSlug, leagueSlug),
    enabled: !!poolSlug && !!leagueSlug,
  })
}

export function useUserLeagues() {
  return useQuery({
    queryKey: queryKeys.user.leagues(),
    queryFn: () => api.user.leagues(),
  })
}

export function useUserStats(poolSlug: string, leagueSlug: string) {
  return useQuery({
    queryKey: queryKeys.user.stats(poolSlug, leagueSlug),
    queryFn: () => api.user.getStats(poolSlug, leagueSlug),
    enabled: !!poolSlug && !!leagueSlug,
  })
}

export function useGuessesList(poolSlug: string, leagueSlug: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.guesses.list(poolSlug, leagueSlug),
    queryFn: () => api.guesses.listByUser(poolSlug, leagueSlug),
    enabled: !!poolSlug && !!leagueSlug && enabled,
  })
}

export function useLeaderboardRanking(poolSlug: string, leagueSlug: string) {
  return useQuery({
    queryKey: queryKeys.leaderboard.ranking(poolSlug, leagueSlug),
    queryFn: () => api.leaderboard.getRanking(poolSlug, leagueSlug),
    enabled: !!poolSlug && !!leagueSlug,
  })
}

export function useLeaderboardUserEntries(
  poolSlug: string,
  leagueSlug: string,
  encrypted: string | null
) {
  return useQuery({
    queryKey: queryKeys.leaderboard.userEntries(poolSlug, leagueSlug, encrypted ?? ''),
    queryFn: () => api.leaderboard.getUserEntries(poolSlug, leagueSlug, encrypted!),
    enabled: !!poolSlug && !!leagueSlug && !!encrypted,
  })
}

export function useCreateLeague() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ poolSlug, name }: { poolSlug: string; name: string }) =>
      api.leagues.create(poolSlug, name),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.leagues() })
      queryClient.invalidateQueries({ queryKey: queryKeys.leagues.public() })
    },
  })
}

export function useCreateInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (leagueSlug: string) => api.leagues.createInvite(leagueSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leagues.all })
    },
  })
}

export function useJoinLeague() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => api.leagues.joinByCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.leagues() })
    },
  })
}

export function useRemoveParticipant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      poolSlug,
      leagueSlug,
      userId,
    }: {
      poolSlug: string
      leagueSlug: string
      userId: string
    }) => api.leagues.removeParticipant(poolSlug, leagueSlug, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.leagues.participants(variables.poolSlug, variables.leagueSlug),
      })
    },
  })
}

export function useCreateGuess() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      poolSlug,
      leagueSlug,
      guess,
    }: {
      poolSlug: string
      leagueSlug: string
      guess: { matchId: string; homeGoals: number; awayGoals: number }
    }) => api.guesses.create(poolSlug, leagueSlug, guess),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.guesses.list(variables.poolSlug, variables.leagueSlug),
      })
    },
  })
}
