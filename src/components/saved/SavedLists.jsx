/**
 * SavedLists — grid of list cards with cover image.
 * Cluster 3: SavedView "Lists" tab.
 */
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import EmptyState from '../shared/EmptyState'
import { Bookmark } from 'lucide-react'
import placesData from '../../data/places.json'

export default function SavedLists({ onSelectList }) {
  const { savedLists } = useUser()

  if (savedLists.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Nothing saved yet"
        description="Tap the bookmark icon on any place to save it here."
        actions={[{ label: 'Explore places', onClick: () => window.location.href = '/search' }]}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-4">
      {savedLists.map((list) => {
        // Find cover photo from first place in list
        const coverPlace = placesData.find((p) => list.placeIds.includes(p.id))
        const cover = list.coverPhoto || coverPlace?.photo || 'https://picsum.photos/seed/default/600/400'

        return (
          <button
            key={list.id}
            onClick={() => onSelectList(list)}
            className="card overflow-hidden text-left hover:shadow-card transition-state"
            style={{ minHeight: '44px' }}
            aria-label={`Open ${list.name} list with ${list.placeIds.length} places`}
          >
            <img
              src={cover}
              alt=""
              className="w-full h-28 object-cover"
              loading="lazy"
            />
            <div className="p-3">
              <p className="font-dm font-medium text-sm text-text-primary truncate">{list.name}</p>
              <p className="text-xs text-text-muted font-dm mt-0.5">
                {list.placeIds.length} {list.placeIds.length === 1 ? 'place' : 'places'}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
