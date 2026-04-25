/**
 * SavedView — Cluster 3: Saved Places & Re-entry Orientation.
 * Tabs: Lists · Places · Visited
 * UXR: infrequent users need saved context to re-orient.
 * All states: happy path · empty (each tab) · loading · error.
 */
import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { useMap } from '../context/MapContext'
import SavedLists from '../components/saved/SavedLists'
import ListDetail from '../components/saved/ListDetail'
import EmptyState from '../components/shared/EmptyState'
import ErrorBanner from '../components/shared/ErrorBanner'
import LoadingSkeleton from '../components/shared/LoadingSkeleton'
import { BookmarkCheck, MapPin, History, Star } from 'lucide-react'
import placesData from '../data/places.json'

const TABS = [
  { id: 'lists', label: 'Lists' },
  { id: 'places', label: 'Places' },
  { id: 'visited', label: 'Visited' },
]

export default function SavedView() {
  const { savedPlaceIds } = useUser()
  const { setMapPins } = useMap()
  const [tab, setTab] = useState('lists')
  const [selectedList, setSelectedList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [tab])

  const savedPlaces = placesData.filter((p) => savedPlaceIds.includes(p.id))

  useEffect(() => {
    setMapPins(savedPlaces.map((p) => ({ ...p, _match: { matchType: 'default' } })))
  }, [savedPlaces.length])

  if (selectedList) {
    return <ListDetail list={selectedList} onBack={() => setSelectedList(null)} />
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-0 border-b border-border flex-shrink-0">
        <h2 className="font-syne font-bold text-base text-text-primary mb-3">Saved</h2>

        {/* Tab bar */}
        <div className="flex" role="tablist" aria-label="Saved content tabs">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex-1 py-2.5 text-sm font-dm font-medium border-b-2 transition-state ${
                tab === id
                  ? 'text-primary border-primary'
                  : 'text-text-muted border-transparent hover:text-text-secondary'
              }`}
              style={{ minHeight: '44px' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <ErrorBanner
          message="Couldn't load your saved places."
          onRetry={() => setError(false)}
          visible={true}
        />
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto" role="tabpanel">
        {loading ? (
          <LoadingSkeleton
            type={tab === 'lists' ? 'list' : 'card'}
            count={3}
            message={`Loading ${tab}…`}
          />
        ) : tab === 'lists' ? (
          <SavedLists onSelectList={setSelectedList} />
        ) : tab === 'places' ? (
          savedPlaces.length === 0 ? (
            <EmptyState
              icon={BookmarkCheck}
              title="Nothing saved yet"
              description="Tap the bookmark icon on any place to save it here."
              actions={[{ label: 'Search places', onClick: () => (window.location.href = '/search') }]}
            />
          ) : (
            <div className="flex flex-col gap-3 px-4 py-4">
              {savedPlaces.map((place) => (
                <div key={place.id} className="card flex items-center gap-3 p-3">
                  <img
                    src={place.photo}
                    alt={place.name}
                    className="w-16 h-16 rounded-card object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-dm font-medium text-sm text-text-primary truncate">{place.name}</p>
                    <p className="text-xs text-text-muted font-dm mt-0.5 truncate">{place.cuisine} · {place.distance}km</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={11} className="text-warning fill-warning" aria-hidden="true" />
                      <span className="text-xs text-text-secondary font-dm">{place.rating}</span>
                    </div>
                  </div>
                  <MapPin size={14} className="text-text-muted flex-shrink-0" aria-hidden="true" />
                </div>
              ))}
            </div>
          )
        ) : (
          // Visited tab — empty state (mock)
          <EmptyState
            icon={History}
            title="Places you visit will appear here"
            description="After navigating to a place, it will show up in your visited history."
          />
        )}
      </div>
    </div>
  )
}
