import Link from "next/link"
import { api } from "@/lib/api"
import Tabs from "@/components/Tabs"
import PoolStatusBadge from "@/components/PoolStatusBadge"
import LeagueBadge from "@/components/LeagueBadge"
import AdBanner from "@/components/AdBanner"
import PalpitesClient from "@/components/PalpitesClient"
import type { Match, League, NewsItem, LanceNewsResponse } from "@/lib/types"

export const dynamic = "force-dynamic"

const LANCE_API = "https://api.lance.com.br/cms/post/category/recent"
const LANCE_TOKEN = "0084a918-1a67-4bf0-9062-3eec9ec521cd"

async function fetchLanceNews(category: string): Promise<NewsItem[]> {
  try {
    const url = `${LANCE_API}/${category}?limit=6`
    const res = await fetch(url, {
      headers: {
        "x-access-token": LANCE_TOKEN,
        Origin: "https://www.lance.com.br",
      },
      cache: "no-store",
    })
    if (!res.ok) throw new Error(`Lance API returned ${res.status}`)
    const json: LanceNewsResponse = await res.json()
    return json.data.itens.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.extraFields.subtitle ?? "",
      source: item.category.name,
      url: item.uri,
      publishedAt: item.date,
      imageUrl: item.extraFields.image?.sourceUrl,
    }))
  } catch {
    return []
  }
}

export default async function PalpitesPage({
  params,
}: {
  params: Promise<{ poolSlug: string; leagueSlug: string }>
}) {
  const { poolSlug, leagueSlug } = await params

  let league: League | null = null
  let matches: Match[] = []
  let currentRound: string | undefined
  let phases: string[] = []
  let currentPhase: string | undefined
  let news: NewsItem[] = []
  try {
    league = await api.leagues.getByPoolAndSlug(poolSlug, leagueSlug)
    const matchesData = await api.pools.getMatches(poolSlug)
    matches = matchesData.matches ?? []
    currentRound = matchesData.currentRound
    phases = matchesData.phases ?? []
    currentPhase = matchesData.currentPhase
  } catch {
    // API unavailable
  }

  const newsCategory = league?.pool?.newsCategory
  if (newsCategory) {
    try {
      news = await fetchLanceNews(newsCategory)
    } catch {
      // News unavailable
    }
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

  const finishedMatches = matches.filter((m) => m.finished)
  const pendingMatches = matches.filter((m) => !m.finished)

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

      {/* League Header */}
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
            <p className="text-sm text-gray-300">
              {matches.length} jogos · {pendingMatches.length} pendentes · {finishedMatches.length} finalizados
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} />
      </div>

      {/* Ad - primeira dobra */}
      <div className="mb-6">
        <AdBanner variant="horizontal" />
      </div>

      {/* Matches */}
      <PalpitesClient matches={matches} poolSlug={poolSlug} leagueSlug={leagueSlug} currentRound={currentRound} phases={phases} currentPhase={currentPhase} news={news} newsCategory={newsCategory} />
    </div>
  )
}
