import type { PoolStatus } from "@/lib/types"

const labels: Record<PoolStatus, string> = {
  upcoming: "Não iniciado",
  ongoing: "Em andamento",
  finished: "Finalizado",
}

const solidStyles: Record<PoolStatus, string> = {
  upcoming: "bg-gray-100 border border-gray-200/50 text-gray-500",
  ongoing: "bg-green-50 border border-green-200/50 text-green",
  finished: "bg-red-50 border border-red-200/50 text-red",
}

const glassStyles: Record<PoolStatus, string> = {
  upcoming: "bg-white/70 backdrop-blur-sm border border-gray-200/50 text-gray-400",
  ongoing: "bg-white/70 backdrop-blur-sm border border-green/20 text-green",
  finished: "bg-white/70 backdrop-blur-sm border border-red/20 text-red",
}

const dotColors: Record<PoolStatus, string> = {
  upcoming: "bg-gray-400",
  ongoing: "bg-green",
  finished: "bg-red",
}

const glassDotColors: Record<PoolStatus, string> = {
  upcoming: "bg-gray-300",
  ongoing: "bg-green",
  finished: "bg-red",
}

interface PoolStatusBadgeProps {
  status: PoolStatus
  glass?: boolean
}

export default function PoolStatusBadge({ status, glass }: PoolStatusBadgeProps) {
  const style = glass ? glassStyles[status] : solidStyles[status]
  const dot = glass ? glassDotColors[status] : dotColors[status]

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap flex-shrink-0 ${style}`}
    >
      <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${dot}`} />
      {labels[status]}
    </span>
  )
}
