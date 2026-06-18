'use client'

import { useState } from 'react'
import { config } from '@/lib/config'
import AdBanner from '@/components/AdBanner'

export default function StickyAdFooter() {
  if (!config.ads.enabled) return null

  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="sticky bottom-0 z-40">
      <div className="bg-white border-t border-line">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-7 flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer border-none bg-transparent"
        >
          <span className="text-[10px] font-medium text-gray-300 uppercase tracking-wide">
            Publicidade
          </span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            className={`text-gray-300 transition-transform duration-300 ease-out ${collapsed ? '' : 'rotate-180'}`}
          >
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            collapsed ? 'max-h-0 opacity-0' : 'max-h-32 opacity-100'
          }`}
        >
          <div className="max-w-[1340px] mx-auto px-4 pb-3">
            <AdBanner variant="horizontal" />
          </div>
        </div>
      </div>
    </div>
  )
}
