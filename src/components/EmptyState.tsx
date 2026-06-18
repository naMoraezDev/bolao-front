'use client'

import Link from 'next/link'
import FadeIn from './FadeIn'

interface EmptyStateAction {
  label: string
  href?: string
  onClick?: () => void
}

interface EmptyStateProps {
  show?: boolean
  icon?: 'pool' | 'league' | 'lock' | 'error'
  title?: string
  message: string
  action?: EmptyStateAction
  compact?: boolean
}

function PoolIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-300">
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function LeagueIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-300">
      <path d="M12 2L15 8L22 9L17 14L18 21L12 17.5L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-300">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const icons = {
  pool: PoolIcon,
  league: LeagueIcon,
  lock: LockIcon,
  error: ErrorIcon,
}

export default function EmptyState({
  show = true,
  icon = 'pool',
  title,
  message,
  action,
  compact = false,
}: EmptyStateProps) {
  const Icon = icons[icon]
  const isError = icon === 'error'

  const containerClass = compact
    ? 'bg-white rounded-lg border border-line p-8 text-center'
    : 'bg-white rounded-lg border border-line p-12 text-center'

  return (
    <FadeIn show={show}>
      <div className={containerClass}>
        <div
          className={`rounded-full flex items-center justify-center mx-auto mb-4 ${
            isError
              ? 'w-16 h-16 bg-red-50'
              : compact
                ? 'w-12 h-12 bg-gray-200'
                : 'w-16 h-16 bg-gray-200'
          }`}
        >
          <Icon />
        </div>

        {title && (
          <h3 className="text-lg font-semibold text-gray-500 mb-2">{title}</h3>
        )}

        <p className={`text-gray-300 text-sm ${action ? 'mb-4' : ''}`}>
          {message}
        </p>

        {action && (
          action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-semibold rounded-normal hover:bg-green-hover transition-colors no-underline"
            >
              {action.label}
            </Link>
          ) : action.onClick ? (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-semibold rounded-normal hover:bg-green-hover transition-colors cursor-pointer border-none"
            >
              {action.label}
            </button>
          ) : null
        )}
      </div>
    </FadeIn>
  )
}
