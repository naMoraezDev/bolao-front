import Link from "next/link"
import { api } from "@/lib/api"
import Tabs from "@/components/Tabs"
import ParticipantsList from "@/components/ParticipantsList"
import LeagueInviteButton from "@/components/LeagueInviteButton"
import LeagueBadge from "@/components/LeagueBadge"
import LeagueCreatorBadge from "@/components/LeagueCreatorBadge"
import AdBanner from "@/components/AdBanner"
import type { League } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function DetalhesPage({
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

  if (!league) {
    return (
      <div className="max-w-[1340px] mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-500 mb-2">Liga não encontrada</h1>
        <p className="text-gray-300 text-sm mb-6">Esta liga não existe ou você não tem acesso.</p>
        <Link
          href={`/bolao/${poolSlug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-semibold rounded-normal hover:bg-green-hover transition-colors no-underline"
        >
          Voltar para o bolão
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1340px] mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-300 mb-6">
        <Link href="/" className="hover:text-green transition-colors no-underline">Início</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link href="/bolao" className="hover:text-green transition-colors no-underline">Bolões</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link href={`/bolao/${poolSlug}`} className="hover:text-green transition-colors no-underline">{league.pool?.name ?? poolSlug}</Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-gray-500 font-medium">{league.name}</span>
      </nav>

      {/* League Header */}
      <div className="bg-white rounded-lg border border-line p-6 md:p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-green-cover-bg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {league.pool?.icon ? (
              <img src={league.pool.icon} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg width="32" height="32" viewBox="0 0 20 20" fill="none" className="text-green">
                <path d="M10 2L12.5 7L18 7.6L14 11.4L15 17L10 14.5L5 17L6 11.4L2 7.6L7.5 7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-300 mb-0.5">
              {league.pool?.name ?? poolSlug}
            </p>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-black-lance truncate">{league.name}</h1>
                <LeagueCreatorBadge creatorId={league.creatorId} />
                <LeagueBadge accessRules={league.accessRules} />
              </div>
              <LeagueInviteButton leagueSlug={leagueSlug} accessRules={league.accessRules} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} />
      </div>

      {/* Ad Banner */}
      <div className="mb-6">
        <AdBanner variant="horizontal" />
      </div>

      {/* Participants Preview */}
      <ParticipantsList
        poolSlug={poolSlug}
        leagueSlug={leagueSlug}
        creatorId={league.creatorId}
        accessRules={league.accessRules}
      />
    </div>
  )
}
