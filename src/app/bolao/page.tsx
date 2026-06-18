import PoolCard from "@/components/PoolCard"
import AdBanner from "@/components/AdBanner"
import EmptyState from "@/components/EmptyState"
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

      <div className="mb-6">
        <AdBanner variant="horizontal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {pools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pools.map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="pool"
              title="Nenhum bolão encontrado"
              message="Não há bolões disponíveis no momento. Volte mais tarde para conferir as novidades!"
              action={{ label: "Voltar para Início", href: "/" }}
            />
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
