import Link from "next/link"
import { api } from "@/lib/api"
import Tabs from "@/components/Tabs"
import PalpitesClient from "@/components/PalpitesClient"
import type { Match, League } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function PalpitesPage({
  params,
}: {
  params: Promise<{ poolSlug: string; leagueSlug: string }>
}) {
  const { poolSlug, leagueSlug } = await params

  let league: League | null = null
  let matches: Match[] = []
  try {
    league = await api.leagues.getByPoolAndSlug(poolSlug, leagueSlug)
    const matchesData = await api.pools.getMatches(poolSlug)
    matches = matchesData.matches ?? []
  } catch {
    // API unavailable
  }

  const tabs = [
    {
      label: "Palpites",
      value: "palpites",
      href: `/pools/${poolSlug}/leagues/${leagueSlug}/palpites`,
    },
    {
      label: "Classificação",
      value: "classificacao",
      href: `/pools/${poolSlug}/leagues/${leagueSlug}/classificacao`,
    },
  ]

  const finishedMatches = matches.filter((m) => m.finished)
  const pendingMatches = matches.filter((m) => !m.finished)

  return (
    <div className="max-w-[1340px] mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-300 mb-6">
        <Link href="/" className="hover:text-green transition-colors no-underline">
          Home
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link href="/pools" className="hover:text-green transition-colors no-underline">
          Bolões
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link href={`/pools/${poolSlug}`} className="hover:text-green transition-colors no-underline">
          {poolSlug}
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-gray-500 font-medium">{league?.name ?? leagueSlug}</span>
      </nav>

      {/* League Header */}
      <div className="bg-white rounded-lg border border-line p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-cover-bg flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-green">
              <path d="M10 2L12.5 7L18 7.6L14 11.4L15 17L10 14.5L5 17L6 11.4L2 7.6L7.5 7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-black-lance mb-1">
              Palpites - {league?.name ?? leagueSlug}
            </h1>
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
        <a
          href="#"
          className="block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
        >
          <div className="bg-[#1B4D3E] h-20 flex items-center justify-center gap-4 px-6">
            <div className="flex flex-col items-end">
              <span className="text-[#A3D977] text-[10px] font-bold uppercase tracking-widest">APOSTE COM</span>
              <span className="text-white text-xl font-black italic -mt-0.5">bet365</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col items-start">
              <span className="text-white text-xs font-semibold uppercase tracking-wide">Odds incríveis</span>
              <span className="text-[#A3D977] text-xs font-bold">Cadastre-se já!</span>
            </div>
          </div>
        </a>
      </div>

      {/* Matches */}
      <PalpitesClient matches={matches} poolSlug={poolSlug} leagueSlug={leagueSlug} />
    </div>
  )
}
