import Link from "next/link"
import { api } from "@/lib/api"
import type { League } from "@/lib/types"
import JoinLeagueButton from "@/components/JoinLeagueButton"
import PoolStatusBadge from "@/components/PoolStatusBadge"
import LeagueBadge from "@/components/LeagueBadge"
import AdBanner from "@/components/AdBanner"

export const dynamic = "force-dynamic"

export default async function PublicLeaguesPage() {
  let leagues: League[] = []
  try {
    leagues = await api.leagues.listPublic()
  } catch {
    // API unavailable
  }

  return (
    <div className="max-w-[1340px] mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-black-lance mb-2">
            Ligas Públicas
          </h1>
          <p className="text-gray-300 text-sm">
            Participe de ligas abertas e dispute com outros torcedores.
          </p>
        </div>
        <JoinLeagueButton />
      </div>

      <div className="mb-6">
        <AdBanner variant="horizontal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
      {leagues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {leagues.map((league) => {
            const firstPool = league.pools?.[0]?.pool
            return (
              <Link
                key={league.id}
                href={
                  firstPool
                    ? `/bolao/${firstPool.slug}/ligas/${league.slug}`
                    : "#"
                }
                className="group block bg-white rounded-lg border border-line p-5 hover:shadow-card hover:border-green/20 transition-all duration-200 no-underline"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-cover-bg flex items-center justify-center group-hover:bg-green-cover-btn transition-colors">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green">
                        <path d="M10 2L12.5 7L18 7.6L14 11.4L15 17L10 14.5L5 17L6 11.4L2 7.6L7.5 7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-gray-500 group-hover:text-green transition-colors">
                          {league.name}
                        </h3>
                        {firstPool?.status && <PoolStatusBadge status={firstPool.status} />}
                        <LeagueBadge accessRules={league.accessRules} />
                      </div>
                      {firstPool && (
                        <span className="text-xs text-gray-300">
                          {firstPool.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300 group-hover:text-green transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-line p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-300">
              <path d="M12 2L15 8L22 9L17 14L18 21L12 17.5L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Nenhuma liga pública disponível no momento.
          </p>
          <Link
            href="/"
            className="text-sm font-semibold text-green hover:text-green-hover transition-colors"
          >
            Voltar para Início
          </Link>
        </div>
      )}

        </div>

        <div className="hidden lg:block">
          <div className="lg:sticky lg:top-20">
            <AdBanner variant="square" />
          </div>
        </div>
      </div>
    </div>
  )
}
