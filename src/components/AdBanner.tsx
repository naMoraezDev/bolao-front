'use client'

import { useEffect, useState } from 'react'

interface AdBannerProps {
  variant?: 'horizontal' | 'square'
}

const bookmakers = [
  {
    bg: '#1B4D3E',
    accent: '#A3D977',
    name: 'bet365',
    slogan: 'A melhor do mundo',
  },
  {
    bg: '#1B1B2F',
    accent: '#FFB800',
    name: 'Betano',
    slogan: 'A emoção do jogo',
  },
  {
    bg: '#0A1628',
    accent: '#00FF87',
    name: 'Sportingbet',
    slogan: 'Seu esporte, sua aposta',
  },
  {
    bg: '#004225',
    accent: '#FFD700',
    name: 'Esportes da Sorte',
    slogan: 'Sorte é com a gente',
  },
  {
    bg: '#0D1117',
    accent: '#FFD700',
    name: 'KTO',
    slogan: 'Aposte com estilo',
  },
  {
    bg: '#0B1D3A',
    accent: '#FF6B00',
    name: 'Superbet',
    slogan: 'Supere seus limites',
  },
]

export default function AdBanner({ variant = 'horizontal' }: AdBannerProps) {
  const [mounted, setMounted] = useState(false)
  const [bookmakerIdx, setBookmakerIdx] = useState(0)

  useEffect(() => {
    setBookmakerIdx(Math.floor(Math.random() * bookmakers.length))
    setMounted(true)
  }, [])

  const { bg, accent, name, slogan } = bookmakers[bookmakerIdx]

  if (variant === 'square') {
    return (
      <a
        href="#"
        className="block rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
      >
        <div
          className="w-full aspect-square flex flex-col items-center justify-center gap-3 px-6"
          style={{ backgroundColor: bg }}
        >
          <span
            className="text-xs font-bold uppercase tracking-widest text-center"
            style={{ color: accent }}
          >
            APOSTE COM
          </span>
          <span className="text-white text-3xl font-black italic leading-none">{name}</span>
          <div className="w-10 h-px bg-white/20" />
          <span className="text-white text-xs font-semibold uppercase tracking-wide text-center">
            {slogan}
          </span>
          <span
            className="text-xs font-bold px-4 py-1.5 rounded"
            style={{ backgroundColor: accent, color: bg }}
          >
            Cadastre-se já!
          </span>
        </div>
      </a>
    )
  }

  return (
    <a
      href="#"
      className="block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
    >
      <div
        className="min-h-[72px] sm:h-20 flex items-center justify-center gap-2 sm:gap-4 px-4 sm:px-6"
        style={{ backgroundColor: bg }}
      >
        <div className="flex flex-col items-end">
          <span
            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest"
            style={{ color: accent }}
          >
            APOSTE COM
          </span>
          <span className="text-white text-base sm:text-xl font-black italic -mt-0.5">{name}</span>
        </div>
        <div className="w-px h-6 sm:h-8 bg-white/20" />
        <div className="flex flex-col items-start">
          <span className="text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wide">{slogan}</span>
          <span
            className="text-[10px] sm:text-xs font-bold"
            style={{ color: accent }}
          >
            Cadastre-se já!
          </span>
        </div>
      </div>
    </a>
  )
}
