/**
 * LoadingSkeleton — shimmer placeholder cards
 * role="status" for screen reader announcement per WCAG 2.2 AA
 */

function SkeletonBox({ className }) {
  return (
    <div
      className={`bg-surface-raised rounded animate-pulse ${className}`}
      aria-hidden="true"
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="card p-4 flex gap-4">
      <SkeletonBox className="w-20 h-20 rounded-card flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2 justify-center">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
        <SkeletonBox className="h-3 w-1/3" />
        <div className="flex gap-2 mt-1">
          <SkeletonBox className="h-5 w-16 rounded-chip" />
          <SkeletonBox className="h-5 w-12 rounded-chip" />
        </div>
      </div>
    </div>
  )
}

export function RouteCardSkeleton() {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <SkeletonBox className="w-10 h-10 rounded-full" />
        <div className="flex-1 flex flex-col gap-2">
          <SkeletonBox className="h-4 w-1/4" />
          <SkeletonBox className="h-3 w-1/3" />
        </div>
        <SkeletonBox className="h-8 w-16 rounded-chip" />
      </div>
    </div>
  )
}

export function ListCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <SkeletonBox className="w-full h-32" />
      <div className="p-3 flex flex-col gap-2">
        <SkeletonBox className="h-4 w-2/3" />
        <SkeletonBox className="h-3 w-1/3" />
      </div>
    </div>
  )
}

export default function LoadingSkeleton({ type = 'card', count = 3, message }) {
  const components = {
    card: CardSkeleton,
    route: RouteCardSkeleton,
    list: ListCardSkeleton,
  }
  const Skeleton = components[type] || CardSkeleton

  return (
    <div role="status" aria-label={message || 'Loading…'} className="flex flex-col gap-3 p-4">
      <span className="sr-only">{message || 'Loading content, please wait.'}</span>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  )
}
