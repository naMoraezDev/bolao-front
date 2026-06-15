import Link from "next/link"
import { api } from "@/lib/api"
import PoolLeagueManager from "@/components/PoolLeagueManager"
import PoolStatusBadge from "@/components/PoolStatusBadge"
import AdBanner from "@/components/AdBanner"
import type { PoolDetails } from "@/lib/types"

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
          href="/bolao"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-semibold rounded-normal hover:bg-green-hover transition-colors no-underline"
        >
          Ver todos os bolões
        </Link>
      </div>
    )
  }

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
        <span className="text-gray-500 font-medium truncate max-w-[120px] sm:max-w-none">{pool.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg border border-line p-6 md:p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-green-cover-bg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {pool.cover ? (
              <img src={pool.cover} alt={pool.name} className="w-full h-full object-cover" />
            ) : (
              <svg width="32" height="32" viewBox="0 0 20 20" fill="none" className="text-green">
                <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-black-lance">
                {pool.name}
              </h1>
            </div>
            <p className="text-sm text-gray-300 flex items-center gap-1.5">
              Participe e faça seus palpites
              <PoolStatusBadge status={pool.status} />
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdBanner variant="horizontal" />
      </div>

      {/* Leagues Section */}
      <PoolLeagueManager poolSlug={poolSlug} poolName={pool.name} poolStatus={pool.status} defaultLeague={pool.defaultLeague} />
    </div>
  )
}
