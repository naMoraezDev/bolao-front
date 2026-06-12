'use client'

interface AdBannerProps {
  variant?: 'horizontal' | 'square'
}

export default function AdBanner({ variant = 'horizontal' }: AdBannerProps) {
  if (variant === 'square') return null

  return (
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
  )
}
