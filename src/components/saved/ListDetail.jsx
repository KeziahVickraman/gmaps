/**
 * ListDetail — places within a saved list.
 * Each card: name, address, your note (mock), remove option.
 * Cluster 3: SavedView.
 */
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import EmptyState from '../shared/EmptyState'
import { BookmarkCheck } from 'lucide-react'
import placesData from '../../data/places.json'

export default function ListDetail({ list, onBack }) {
  const { removePlaceFromList } = useUser()
  const places = placesData.filter((p) => list.placeIds.includes(p.id))

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0">
        <button
          onClick={onBack}
          aria-label="Back to saved lists"
          className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-raised transition-state"
        >
          <ArrowLeft size={18} className="text-text-secondary" aria-hidden="true" />
        </button>
        <div className="flex-1">
          <h2 className="font-syne font-semibold text-base text-text-primary">{list.name}</h2>
          <p className="text-xs text-text-muted font-dm">{places.length} places</p>
        </div>
      </div>

      {/* Places */}
      <div className="flex-1 overflow-y-auto">
        {places.length === 0 ? (
          <EmptyState
            icon={BookmarkCheck}
            title="Nothing saved yet"
            description="Tap the bookmark icon on any place to add it to this list."
          />
        ) : (
          <div className="flex flex-col gap-3 px-4 py-4">
            {places.map((place) => (
              <div key={place.id} className="card flex items-center gap-3 p-3">
                <img
                  src={place.photo}
                  alt={place.name}
                  className="w-16 h-16 rounded-card object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-dm font-medium text-sm text-text-primary truncate">{place.name}</p>
                  <p className="text-xs text-text-muted font-dm mt-0.5 truncate">{place.address}</p>
                  {/* Mock note */}
                  <p className="text-xs text-text-secondary font-dm mt-0.5 italic truncate">
                    "Great for a quiet dinner"
                  </p>
                </div>
                <button
                  onClick={() => removePlaceFromList(place.id, list.id)}
                  aria-label={`Remove ${place.name} from ${list.name}`}
                  className="w-11 h-11 flex items-center justify-center text-text-muted hover:text-error transition-state flex-shrink-0"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
