import Link from "next/link"
import PoolCard from "@/components/PoolCard"
import AdBanner from "@/components/AdBanner"
import { api } from "@/lib/api"
import type { Pool, League } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  let pools: Pool[] = []
  let publicLeagues: League[] = []
  try {
    pools = await api.pools.list()
    publicLeagues = await api.leagues.listPublic()
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
                href="/bolao"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-300 text-green-900 font-bold rounded-normal hover:bg-yellow-200 transition-colors no-underline shadow-lg"
              >
                Ver Bolões
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/ligas"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-normal hover:bg-white/20 transition-colors no-underline backdrop-blur-sm"
              >
                Ligas Públicas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-[1340px] mx-auto px-4 pt-8">
        <AdBanner variant="horizontal" />
      </div>

      {/* Canais em Destaque */}
      <section className="max-w-[1340px] mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-black-lance">
            Canais
          </h2>
          <Link
            href="/bolao"
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

      {/* Ligas em Destaque */}
      {publicLeagues.length > 0 && (
        <section className="bg-white border-t border-line">
          <div className="max-w-[1340px] mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-black-lance">
                Ligas em Destaque
              </h2>
              <Link
                href="/ligas"
                className="text-sm font-semibold text-green hover:text-green-hover transition-colors no-underline"
              >
                Ver todas
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicLeagues.slice(0, 6).map((league) => {
                const firstPool = league.pools?.[0]?.pool ?? league.pool ?? null
                return (
                  <Link
                    key={league.id}
                    href={firstPool ? `/bolao/${firstPool.slug}/ligas/${league.slug}` : '/ligas'}
                    className="group block bg-white rounded-lg border border-line p-5 hover:shadow-card hover:border-green/20 transition-all duration-200 no-underline"
                  >
                    <div className="flex items-start justify-between h-full gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-green-cover-bg flex items-center justify-center flex-shrink-0 group-hover:bg-green-cover-btn transition-colors">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green">
                            <path d="M10 2L12.5 7L18 7.6L14 11.4L15 17L10 14.5L5 17L6 11.4L2 7.6L7.5 7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-500 truncate group-hover:text-green transition-colors">
                            {league.name}
                          </h3>
                          {firstPool && (
                            <span className="text-xs text-gray-300">
                              {firstPool.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center flex-shrink-0 text-gray-300 group-hover:text-green transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Por que Participar */}
      <section className="bg-white border-t border-line">
        <div className="max-w-[1340px] mx-auto px-4 py-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-black-lance mb-8 text-center">
            Por que participar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: '100% Gratuito',
                desc: 'Crie e participe de ligas sem pagar nada. Seus palpites valem prestígio e diversão.',
                icon: 'wallet',
              },
              {
                title: 'Ranking em Tempo Real',
                desc: 'Acompanhe sua pontuação e veja sua posição na classificação a cada rodada.',
                icon: 'chart',
              },
              {
                title: 'Palpites ao Vivo',
                desc: 'Faça seus palpites antes de cada partida e torça pelos seus resultados.',
                icon: 'clock',
              },
              {
                title: 'Convide Amigos',
                desc: 'Crie ligas privadas, compartilhe o código e dispute com quem você conhece.',
                icon: 'share',
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-12 h-12 rounded-xl bg-green-cover-bg flex items-center justify-center mx-auto mb-4">
                  {item.icon === 'wallet' ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green">
                      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M16 10v2a2 2 0 010 4H2" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="15" cy="11" r="1.5" fill="#007a18" />
                    </svg>
                  ) : item.icon === 'chart' ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green">
                      <rect x="3" y="11" width="3" height="6" rx="1" fill="#007a18" />
                      <rect x="8.5" y="7" width="3" height="10" rx="1" fill="#007a18" />
                      <rect x="14" y="3" width="3" height="14" rx="1" fill="#007a18" />
                    </svg>
                  ) : item.icon === 'clock' ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green">
                      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green">
                      <circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="14" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2 17c0-3.3 2.2-6 5-6s5 2.7 5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M13 15.5a5.5 5.5 0 015-3.5c2.2 0 4 1.8 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
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
