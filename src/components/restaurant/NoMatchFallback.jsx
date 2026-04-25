/**
 * NoMatchFallback — shown when 0 results match all preferences.
 * Never a dead end — always shows 1 best-effort card + 2 forward paths.
 * Cluster 4: "Nothing ticks every box right now" — S1_I003.
 */
import { useFilter } from '../../context/FilterContext'
import RestaurantCard from './RestaurantCard'

export default function NoMatchFallback({ bestMatch, onAdjustFilter, onShowAll }) {
  const filters = useFilter()

  if (!bestMatch) return null

  // Explain what doesn't fit
  const mismatches = []
  if (filters.dietary.length > 0) {
    const dietaryMiss = filters.dietary.filter((d) => !bestMatch.dietary.includes(d))
    if (dietaryMiss.length > 0) mismatches.push(`not ${dietaryMiss.join('/')}`)
  }
  if (filters.price.length > 0 && !filters.price.includes(bestMatch.price)) {
    mismatches.push(`price outside range`)
  }
  if (filters.ambience.length > 0 && !bestMatch.ambience.some((a) => filters.ambience.includes(a))) {
    mismatches.push(`different ambience`)
  }
  if (!bestMatch.openNow && filters.openNow) {
    mismatches.push(`currently closed`)
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      {/* Headline */}
      <div className="card p-4 bg-amber-50 border-amber-200">
        <h3 className="font-syne font-semibold text-sm text-text-primary mb-1">
          Nothing ticks every box right now
        </h3>
        <p className="text-xs text-text-secondary font-dm">
          Here's the closest match — and what doesn't quite fit.
        </p>
      </div>

      {/* Best-effort card */}
      <RestaurantCard
        place={bestMatch}
        matchData={{ matchType: 'partial', reasons: [] }}
      />

      {/* Mismatch explanation */}
      {mismatches.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-1">
          {mismatches.map((m, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-chip bg-red-50 text-error border border-red-200">
              {m}
            </span>
          ))}
        </div>
      )}

      {/* Two forward paths — never a dead end */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onAdjustFilter}
          className="btn-primary text-sm"
          aria-label="Adjust the most restrictive filter"
        >
          Adjust one filter
        </button>
        <button
          onClick={onShowAll}
          className="btn-secondary text-sm"
          aria-label="Show all nearby restaurants without preference ranking"
        >
          Show all nearby
        </button>
      </div>
    </div>
  )
}
