import Link from "next/link"
import { api } from "@/lib/api"
import Tabs from "@/components/Tabs"
import PoolStatusBadge from "@/components/PoolStatusBadge"
import LeagueBadge from "@/components/LeagueBadge"
import RankingSection from "@/components/RankingSection"
import AdBanner from "@/components/AdBanner"
import type { League } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function ClassificacaoPage({
  params,
}: {
  params: Promise<{ poolSlug: string; leagueSlug: string }>
}) {
  const { poolSlug, leagueSlug } = await params

  let league: League | null = null
  try {
    league = await api.leagues.getByPoolAndSlug(poolSlug, leagueSlug)
  } catch {
    // API unavailable
  }

  const tabs = [
    {
      label: "Detalhes",
      value: "detalhes",
      href: `/bolao/${poolSlug}/ligas/${leagueSlug}/detalhes`,
    },
    {
      label: "Palpites",
      value: "palpites",
      href: `/bolao/${poolSlug}/ligas/${leagueSlug}/palpites`,
    },
    {
      label: "Classificação",
      value: "classificacao",
      href: `/bolao/${poolSlug}/ligas/${leagueSlug}/classificacao`,
    },
    {
      label: "Estatísticas",
      value: "estatisticas",
      href: `/bolao/${poolSlug}/ligas/${leagueSlug}/estatisticas`,
    },
  ]

  return (
    <div className="max-w-[1340px] mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] sm:text-sm text-gray-300 mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-green transition-colors no-underline">
          Início
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link href="/bolao" className="hover:text-green transition-colors no-underline">
          Bolões
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link href={`/bolao/${poolSlug}`} className="hover:text-green transition-colors no-underline">
          {league?.pool?.name ?? poolSlug}
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-gray-500 font-medium truncate max-w-[120px] sm:max-w-none">{league?.name ?? leagueSlug}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg border border-line p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-green-cover-bg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {league?.pool?.cover ? (
              <img src={league.pool.cover} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg width="32" height="32" viewBox="0 0 20 20" fill="none" className="text-green">
                <path d="M10 2L12.5 7L18 7.6L14 11.4L15 17L10 14.5L5 17L6 11.4L2 7.6L7.5 7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-300 mb-0.5">
              {league?.pool?.name ?? poolSlug}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-black-lance">
                {league?.name ?? leagueSlug}
              </h1>
              <div className="flex items-center gap-2">
                <LeagueBadge accessRules={league?.accessRules} />
                {league?.pool?.status && <PoolStatusBadge status={league.pool.status} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} />
      </div>

      {/* Leaderboard */}
      <RankingSection poolSlug={poolSlug} leagueSlug={leagueSlug} />

      <div className="mt-6">
        <AdBanner variant="horizontal" />
      </div>
    </div>
  )
}
