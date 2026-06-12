import Link from "next/link"
import PoolCard from "@/components/PoolCard"
import { api } from "@/lib/api"
import type { Pool } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  let pools: Pool[] = []
  try {
    pools = await api.pools.list()
  } catch {
    // API unavailable
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green to-green-header">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
        <div className="relative max-w-[1340px] mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Bolão do<br />
              <span className="text-yellow-300">Lance!</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-lg">
              Crie sua liga, convide os amigos e mostre quem entende mais de futebol.
              Palpite os jogos, acumule pontos e suba no ranking!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pools"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-300 text-green-900 font-bold rounded-normal hover:bg-yellow-200 transition-colors no-underline shadow-lg"
              >
                Ver Bolões
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/leagues"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-normal hover:bg-white/20 transition-colors no-underline backdrop-blur-sm"
              >
                Ligas Públicas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Canais em Destaque */}
      <section className="max-w-[1340px] mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-black-lance">
            Canais
          </h2>
          <Link
            href="/pools"
            className="text-sm font-semibold text-green hover:text-green-hover transition-colors no-underline"
          >
            Ver todos
          </Link>
        </div>

        {pools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pools.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-line p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-300">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="text-gray-300 text-sm">
              Nenhum bolão disponível no momento.
            </p>
          </div>
        )}
      </section>

      {/* Como Funciona */}
      <section className="bg-white border-t border-line">
        <div className="max-w-[1340px] mx-auto px-4 py-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-black-lance mb-8 text-center">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Escolha um Bolão",
                desc: "Selecione um campeonato e entre em uma liga pública ou crie sua própria liga privada.",
              },
              {
                step: "2",
                title: "Faça seus Palpites",
                desc: "Antes de cada rodada, palpite os placares dos jogos e acumule pontos.",
              },
              {
                step: "3",
                title: "Suba no Ranking",
                desc: "Acompanhe sua pontuação e veja se você está no topo da classificação da sua liga.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-green-cover-bg flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-green">{item.step}</span>
                </div>
                <h3 className="font-semibold text-gray-500 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
