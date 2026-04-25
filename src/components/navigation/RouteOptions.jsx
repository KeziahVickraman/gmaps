/**
 * RouteOptions — route comparison cards, max 3 (Miller's Law).
 * Each shows: travel mode icon · ETA · distance · traffic pill · toll indicator.
 * Fastest route auto-selected.
 * Cluster 2: S2_I003 — "doesn't recommend shortest route… no customisation."
 */
import { Car, Clock, MapPin, DollarSign, Zap } from 'lucide-react'

const TRAFFIC_COLORS = {
  light: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  heavy: 'bg-red-100 text-red-700',
}

export default function RouteOptions({ routes, selectedId, onSelect }) {
  return (
    <div className="flex flex-col gap-3" role="radiogroup" aria-label="Route options">
      {routes.map((route, i) => {
        const isSelected = route.id === selectedId
        const isFastest = i === 0

        return (
          <button
            key={route.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(route.id)}
            className={`card p-4 text-left transition-state ${
              isSelected
                ? 'border-primary shadow-card ring-2 ring-primary/20'
                : 'hover:border-primary/30 hover:shadow-card'
            }`}
            style={{ minHeight: '72px' }}
          >
            <div className="flex items-center gap-4">
              {/* Mode icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-primary text-white' : 'bg-surface-raised text-text-secondary'
                }`}
                aria-hidden="true"
              >
                <Car size={18} />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-syne font-semibold text-sm text-text-primary">
                    {route.label}
                  </span>
                  {isFastest && (
                    <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 bg-primary-light text-primary rounded-chip font-medium">
                      <Zap size={10} aria-hidden="true" />
                      Fastest
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary font-dm">
                  <span className="flex items-center gap-1">
                    <Clock size={11} aria-hidden="true" />
                    {route.eta} min
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={11} aria-hidden="true" />
                    {route.distance}km
                  </span>
                </div>
              </div>

              {/* Traffic + toll */}
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`text-xs px-2 py-0.5 rounded-chip font-medium capitalize ${
                    TRAFFIC_COLORS[route.traffic] || TRAFFIC_COLORS.moderate
                  }`}
                  aria-label={`Traffic: ${route.traffic}`}
                >
                  {route.traffic}
                </span>
                {route.hasToll && (
                  <span
                    className="flex items-center gap-0.5 text-xs text-text-muted font-dm"
                    aria-label="Toll road"
                  >
                    <DollarSign size={10} aria-hidden="true" />
                    Toll
                  </span>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
