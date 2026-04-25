/**
 * NavigationView — Cluster 2: Navigation Rerouting & Route Trust.
 * UXR signals:
 *   S2_I003: "doesn't recommend the shortest route… no customisation of route"
 *   S2_I004: "orientation not according to driving direction"
 *   Personas: business owner 3:30am–11pm — time is the scarcest resource
 *
 * Design response:
 *   - Route comparison: time + distance + traffic shown simultaneously
 *   - Fastest route auto-selected
 *   - Non-silent rerouting via RerouteAlert
 *   - Heading-up toggle
 *   - "Start" CTA at bottom (thumb-reachable, Fitts's Law)
 *   - Secondary actions (Add stop, Route options) behind chevron (Hick's Law)
 */
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, MapPin, Plus } from 'lucide-react'
import { useMap } from '../context/MapContext'
import RouteOptions from '../components/navigation/RouteOptions'
import RouteCompare from '../components/navigation/RouteCompare'
import TurnByTurn from '../components/navigation/TurnByTurn'
import ErrorBanner from '../components/shared/ErrorBanner'
import LoadingSkeleton from '../components/shared/LoadingSkeleton'
import EmptyState from '../components/shared/EmptyState'
import routesData from '../data/routes.json'
import { Navigation } from 'lucide-react'

export default function NavigationView() {
  const { setMapPins, setActiveRoute } = useMap()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedRouteId, setSelectedRouteId] = useState(routesData[0]?.id)
  const [navigating, setNavigating] = useState(false)
  const [secondaryOpen, setSecondaryOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setMapPins([])
  }, [])

  const selectedRoute = routesData.find((r) => r.id === selectedRouteId) || routesData[0]

  const handleStart = () => {
    setActiveRoute(selectedRoute)
    setNavigating(true)
  }

  const handleExit = () => {
    setActiveRoute(null)
    setNavigating(false)
  }

  if (navigating) {
    return <TurnByTurn route={selectedRoute} onExit={handleExit} />
  }

  if (error) {
    return (
      <ErrorBanner
        message="Couldn't calculate route. Check your connection or try a different destination."
        onRetry={() => setError(false)}
        visible={true}
      />
    )
  }

  if (loading) {
    return (
      <div role="status" aria-label="Calculating routes…" className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <p className="text-sm text-text-secondary font-dm">Calculating routes…</p>
        </div>
        <LoadingSkeleton type="route" count={3} message="Calculating routes…" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Origin → destination header */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex-shrink-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 bg-surface-raised rounded-btn px-3 py-2 text-sm font-dm text-text-primary border border-border">
              Home — Bedok
            </div>
          </div>
          <div className="flex items-center gap-2.5 ml-0.5 pl-0.5 border-l-2 border-dashed border-border" aria-hidden="true">
            <div className="w-0.5 h-3 bg-transparent" />
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin size={14} className="text-accent flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 bg-surface-raised rounded-btn px-3 py-2 text-sm font-dm text-text-primary border border-border font-medium">
              Orchard Road
            </div>
          </div>
        </div>
      </div>

      {/* Route comparison (compact view, 2 routes) */}
      <div className="py-3 border-b border-border flex-shrink-0">
        <RouteCompare
          routes={routesData}
          selectedId={selectedRouteId}
          onSelect={setSelectedRouteId}
        />
      </div>

      {/* Full route options list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <RouteOptions
          routes={routesData}
          selectedId={selectedRouteId}
          onSelect={setSelectedRouteId}
        />

        {/* Secondary actions — collapsed (Hick's Law) */}
        <div className="mt-4">
          <button
            onClick={() => setSecondaryOpen(!secondaryOpen)}
            className="flex items-center gap-2 text-sm text-text-secondary font-dm hover:text-text-primary transition-state w-full"
            aria-expanded={secondaryOpen}
            aria-label={secondaryOpen ? 'Hide route options' : 'Show route options'}
            style={{ minHeight: '44px' }}
          >
            {secondaryOpen ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
            Route options
          </button>

          {secondaryOpen && (
            <div className="mt-3 flex flex-col gap-2 pl-1">
              <button
                className="flex items-center gap-2 text-sm font-dm text-text-secondary hover:text-text-primary transition-state"
                style={{ minHeight: '44px' }}
                aria-label="Add a stop to the route"
              >
                <Plus size={15} aria-hidden="true" />
                Add stop
              </button>
              <p className="text-xs text-text-muted font-dm pl-6">
                Mock: drag waypoints or exclude route segments would appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Start CTA — large, thumb-reachable bottom (Fitts's Law) */}
      <div className="px-4 py-4 border-t border-border bg-surface flex-shrink-0">
        <button
          onClick={handleStart}
          className="btn-primary w-full text-base py-4"
          aria-label={`Start navigation via ${selectedRoute?.label} route, ${selectedRoute?.eta} minutes`}
        >
          <Navigation size={18} aria-hidden="true" />
          Start — {selectedRoute?.eta} min via {selectedRoute?.label}
        </button>
      </div>
    </div>
  )
}
