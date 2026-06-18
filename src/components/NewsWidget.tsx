'use client'

import type { NewsItem } from '@/lib/types'
import FadeIn from './FadeIn'

const GRADIENTS = [
  'from-blue-600 to-blue-800',
  'from-red-600 to-red-800',
  'from-green-600 to-green-800',
  'from-yellow-500 to-yellow-700',
  'from-purple-600 to-purple-800',
]

const ICONS = ['⚽', '🏆', '🔥', '📢', '🔄']

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `há ${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  return `há ${days}d`
}

interface Props {
  news?: NewsItem[]
  category?: string
}

export default function NewsWidget({ news, category }: Props) {
  const items = news ?? []

  if (items.length === 0) return null

  return (
    <FadeIn show>
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-semibold text-table-gray uppercase tracking-wide">
          {category ? `Últimas de ${category.replace(/-/g, ' ')}` : 'Últimas do Lance!'}
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
        {items.map((item, i) => (
          <a
            key={item.id}
            href={item.url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-[260px] md:w-auto bg-white rounded-lg border border-line overflow-hidden hover:shadow-md transition-all duration-300 ease-out cursor-pointer no-underline group"
          >
            <div className="h-36 bg-gray-100 flex items-center justify-center relative overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                <>
                  <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} opacity-80 transition-transform duration-500 ease-out group-hover:scale-105`} />
                  <span className="text-4xl opacity-40 relative z-10 transition-transform duration-500 ease-out group-hover:scale-110">{ICONS[i % ICONS.length]}</span>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              <span className="absolute bottom-2 left-3 text-[10px] font-medium text-white/80 uppercase tracking-wide pointer-events-none">
                {item.source}
              </span>
            </div>
            <div className="p-3">
              <p className="text-[13px] font-semibold text-gray-700 leading-snug line-clamp-2 group-hover:text-green transition-colors duration-200">
                {item.title}
              </p>
              <span className="text-[10px] text-gray-300 mt-1.5 block">
                {timeAgo(item.publishedAt)}
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <a
          href={`https://www.lance.com.br/${category ?? 'copa-do-mundo'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-green hover:text-green-hover transition-colors no-underline"
        >
          Ver mais notícias {category ? `de ${category.replace(/-/g, ' ')}` : ''}
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
    </FadeIn>
  )
}
