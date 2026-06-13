interface LeagueBadgeProps {
  accessRules?: { rule: 'PUBLIC' | 'INVITE_CODE' }[]
}

export default function LeagueBadge({ accessRules }: LeagueBadgeProps) {
  const rules = accessRules?.map((r) => r.rule) ?? []
  const isPublic = rules.includes('PUBLIC')
  const isPrivate = rules.includes('INVITE_CODE')

  if (isPublic && !isPrivate) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-cover-bg text-[10px] font-semibold text-green leading-none">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <circle cx="4" cy="4" r="3" fill="currentColor" />
        </svg>
        Pública
      </span>
    )
  }

  if (isPrivate) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-semibold text-amber-600 leading-none">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <rect x="1.5" y="3.5" width="5" height="3.5" rx="0.8" stroke="currentColor" strokeWidth="0.8" />
          <path d="M2.5 3.5V2.5C2.5 1.67 3.17 1 4 1C4.83 1 5.5 1.67 5.5 2.5V3.5" stroke="currentColor" strokeWidth="0.8" />
        </svg>
        Privada
      </span>
    )
  }

  return null
}
