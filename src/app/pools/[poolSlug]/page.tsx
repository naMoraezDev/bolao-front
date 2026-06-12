import Link from "next/link"
import LeagueCard from "@/components/LeagueCard"
import { api } from "@/lib/api"
import type { PoolDetails, League } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function PoolDetailPage({
  params,
}: {
  params: Promise<{ poolSlug: string }>
}) {
  const { poolSlug } = await params

  let pool: PoolDetails | null = null
  try {
    pool = await api.pools.getBySlug(poolSlug)
  } catch {
    return (
      <div className="max-w-[1340px] mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-500 mb-2">Bolão não encontrado</h1>
        <p className="text-gray-300 text-sm mb-6">
          O bolão &quot;{poolSlug}&quot; não existe ou está indisponível.
        </p>
        <Link
          href="/pools"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-semibold rounded-normal hover:bg-green-hover transition-colors no-underline"
        >
          Ver todos os bolões
        </Link>
      </div>
    )
  }

  const allLeagues = pool?.defaultLeague ? [pool.defaultLeague] : []

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
        <span className="text-gray-500 font-medium">{pool.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg border border-line p-6 md:p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-cover-bg flex items-center justify-center flex-shrink-0">
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none" className="text-green">
              <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-black-lance mb-1">
              {pool.name}
            </h1>
            <p className="text-sm text-gray-300">
              slug: /{pool.slug}
            </p>
          </div>
        </div>
      </div>

      {/* Leagues Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-black-lance">
            Ligas
          </h2>
        </div>

        {allLeagues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allLeagues.map((league) => (
              <LeagueCard
                key={league.id}
                league={{ ...league, isDefaultLeague: true }}
                poolSlug={poolSlug}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-line p-8 text-center">
            <p className="text-gray-300 text-sm">
              Nenhuma liga disponível neste bolão.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
