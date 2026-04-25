/**
 * BusynessIndicator — live busyness bar on restaurant cards.
 * Cluster 1 + 4: visible on RestaurantCard.
 */
export default function BusynessIndicator({ busyness }) {
  const level = busyness < 40 ? 'Quiet' : busyness < 70 ? 'Moderate' : 'Busy'
  const color = busyness < 40 ? 'bg-success' : busyness < 70 ? 'bg-warning' : 'bg-accent'

  return (
    <div className="flex items-center gap-1.5" aria-label={`Busyness: ${level}, ${busyness}%`}>
      <div className="flex gap-0.5" aria-hidden="true">
        {[20, 40, 60, 80, 100].map((threshold) => (
          <div
            key={threshold}
            className={`w-1 h-3 rounded-sm ${busyness >= threshold ? color : 'bg-surface-raised'}`}
          />
        ))}
      </div>
      <span className="text-xs text-text-muted font-dm">{level}</span>
    </div>
  )
}
