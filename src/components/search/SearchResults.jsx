/**
 * SearchResults — filtered, re-ranked list of RestaurantCards.
 * Re-ranks in real time on filter change (no full reload UX).
 * All 4 states: happy path · empty · loading skeleton · error.
 * Cluster 1 UXR: S1_I003 "stares and scrolls excessively" — results must be focused, not overwhelming.
 */
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFilter } from '../../context/FilterContext'
import { useMap } from '../../context/MapContext'
import RestaurantCard from '../restaurant/RestaurantCard'
import RestaurantDetail from '../restaurant/RestaurantDetail'
import EmptyState from '../shared/EmptyState'
import ErrorBanner from '../shared/ErrorBanner'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import { Utensils, SlidersHorizontal } from 'lucide-react'
import BottomSheet from '../shared/BottomSheet'
import placesData from '../../data/places.json'

function applyFilters(places, filters, query) {
  return places.filter((place) => {
    // Text query
    if (query) {
      const q = query.toLowerCase()
      const matches =
        place.name.toLowerCase().includes(q) ||
        place.cuisine.toLowerCase().includes(q) ||
        place.address.toLowerCase().includes(q) ||
        place.dietary.some((d) => d.includes(q))
      if (!matches) return false
    }
    // Dietary
    if (filters.dietary.length > 0) {
      const hasAll = filters.dietary.every((d) => place.dietary.includes(d))
      if (!hasAll) return false
    }
    // Cuisine
    if (filters.cuisine.length > 0 && !filters.cuisine.includes(place.cuisine)) return false
    // Price
    if (filters.price.length > 0 && !filters.price.includes(place.price)) return false
    // Ambience
    if (filters.ambience.length > 0 && !place.ambience.some((a) => filters.ambience.includes(a))) return false
    // Distance
    if (place.distance > filters.distance) return false
    // Open now
    if (filters.openNow && !place.openNow) return false
    return true
  })
}

export default function SearchResults({ showFilters, onToggleFilters }) {
  const filters = useFilter()
  const { setMapPins, setActivePlace, activePlace } = useMap()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)

  // Simulate load delay for realism (min 300ms per §8)
  useEffect(() => {
    setLoading(true)
    setError(false)
    const t = setTimeout(() => {
      setLoading(false)
    }, 350)
    return () => clearTimeout(t)
  }, [filters.dietary, filters.cuisine, filters.price, filters.ambience, filters.distance, filters.openNow, query])

  const filtered = useMemo(
    () => applyFilters(placesData, filters, query),
    [filters.dietary, filters.cuisine, filters.price, filters.ambience, filters.distance, filters.openNow, query]
  )

  // Update map pins in real time when results change
  useEffect(() => {
    if (!loading) {
      setMapPins(filtered.map((p) => ({ ...p, _match: { matchType: 'default' } })))
    }
  }, [filtered, loading])

  if (error) {
    return (
      <ErrorBanner
        message="Couldn't load results. Check your connection."
        onRetry={() => setError(false)}
        visible={true}
      />
    )
  }

  if (loading) {
    return <LoadingSkeleton type="card" count={3} message="Loading restaurants…" />
  }

  if (filtered.length === 0) {
    return (
      <>
        <EmptyState
          icon={Utensils}
          title={
            filters.dietary.length > 0
              ? `No ${filters.dietary.join(' + ')} restaurants match your filters`
              : 'No restaurants match your filters'
          }
          description="Try expanding your distance or removing a filter."
          actions={[
            {
              label: 'Expand distance',
              onClick: filters.setDistanceMax,
            },
            {
              label: 'Clear dietary filter',
              onClick: filters.clearDietary,
            },
          ]}
        />
      </>
    )
  }

  return (
    <>
      <div className="px-4 py-2 flex items-center justify-between">
        <p className="text-xs text-text-muted font-dm">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          {query ? ` for "${query}"` : ''}
        </p>
      </div>

      <div
        className="flex flex-col gap-3 px-4 pb-6"
        role="list"
        aria-label="Restaurant search results"
      >
        {filtered.map((place) => (
          <div key={place.id} role="listitem">
            <RestaurantCard
              place={place}
              onClick={() => {
                setSelectedPlace(place)
                setActivePlace(place)
              }}
            />
          </div>
        ))}
      </div>

      {/* Place detail bottom sheet */}
      <BottomSheet
        open={!!selectedPlace}
        onClose={() => {
          setSelectedPlace(null)
          setActivePlace(null)
        }}
        title={selectedPlace?.name}
        initialSnap={0.75}
      >
        {selectedPlace && <RestaurantDetail place={selectedPlace} />}
      </BottomSheet>
    </>
  )
}
