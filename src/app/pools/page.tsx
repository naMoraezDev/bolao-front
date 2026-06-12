import Link from "next/link"
import PoolCard from "@/components/PoolCard"
import { api } from "@/lib/api"
import type { Pool } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function PoolsPage() {
  let pools: Pool[] = []
  try {
    pools = await api.pools.list()
  } catch {
    // API unavailable
  }

  return (
    <div className="max-w-[1340px] mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-black-lance mb-2">
          Bolões
        </h1>
        <p className="text-gray-300 text-sm">
          Escolha um bolão para participar e fazer seus palpites.
        </p>
      </div>

      {pools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-line p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-300">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Nenhum bolão disponível no momento.
          </p>
          <Link
            href="/"
            className="text-sm font-semibold text-green hover:text-green-hover transition-colors"
          >
            Voltar para Home
          </Link>
        </div>
      )}
    </div>
  )
}
