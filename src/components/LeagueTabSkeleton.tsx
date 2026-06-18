import Skeleton from '@/components/Skeleton'

export default function LeagueTabSkeleton() {
  return (
    <div className="max-w-[1340px] mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="w-12 h-4" />
        <Skeleton className="w-12 h-4" />
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-32 h-4" />
      </div>

      {/* League Header */}
      <div className="bg-white rounded-lg border border-line p-6 mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="w-24 h-3" />
            <Skeleton className="w-64 h-7" />
            <Skeleton className="w-48 h-4" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-24 h-9 rounded-lg" />
        ))}
      </div>

      {/* Content area placeholder */}
      <Skeleton className="w-full h-64 rounded-lg" />
    </div>
  )
}
