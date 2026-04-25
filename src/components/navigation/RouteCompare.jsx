/**
 * RouteCompare — side-by-side 2-route comparison.
 * Tappable to select — selected state highlighted.
 * Cluster 2: S2_I003 — "time + distance + traffic shown simultaneously — no tab switching."
 */
import { Car, Clock, MapPin, DollarSign } from 'lucide-react'

const TRAFFIC_COLORS = {
  light: 'text-green-700',
  moderate: 'text-amber-700',
  heavy: 'text-red-700',
}

export default function RouteCompare({ routes, selectedId, onSelect }) {
  const compareRoutes = routes.slice(0, 2)

  return (
    <div className="flex gap-3 px-4" role="radiogroup" aria-label="Compare route options">
      {compareRoutes.map((route) => {
        const isSelected = route.id === selectedId
        return (
          <button
            key={route.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(route.id)}
            className={`flex-1 card p-3 text-left transition-state ${
              isSelected
                ? 'border-primary ring-2 ring-primary/20 shadow-card'
                : 'hover:border-primary/30'
            }`}
            style={{ minHeight: '44px' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Car size={14} className={isSelected ? 'text-primary' : 'text-text-muted'} aria-hidden="true" />
              <span className="font-syne font-semibold text-sm text-text-primary">
                {route.label}
              </span>
            </div>
            <div className="flex flex-col gap-1 text-xs font-dm">
              <span className="flex items-center gap-1 text-text-secondary">
                <Clock size={11} aria-hidden="true" />
                <strong className="text-text-primary">{route.eta} min</strong>
              </span>
              <span className="flex items-center gap-1 text-text-secondary">
                <MapPin size={11} aria-hidden="true" />
                {route.distance}km
              </span>
              <span className={`capitalize font-medium ${TRAFFIC_COLORS[route.traffic] || ''}`}>
                {route.traffic} traffic
              </span>
              {route.hasToll && (
                <span className="flex items-center gap-0.5 text-text-muted">
                  <DollarSign size={10} aria-hidden="true" />
                  Has toll
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
