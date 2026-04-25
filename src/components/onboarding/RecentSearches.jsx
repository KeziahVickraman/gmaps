/**
 * RecentSearches — last 4 searches as chips, max 5 visible (Miller's Law).
 * Cluster 3: HomeView re-entry orientation.
 */
import { Clock, Search, MapPin, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

export default function RecentSearches() {
  const { recentSearches } = useUser()
  const navigate = useNavigate()

  if (!recentSearches.length) return null

  const handleClick = (item) => {
    if (item.type === 'place') {
      navigate(`/search?q=${encodeURIComponent(item.query)}`)
    } else {
      navigate(`/search?q=${encodeURIComponent(item.query)}`)
    }
  }

  return (
    <div className="px-4 py-3">
      <p className="label-text text-text-muted mb-2">Recent</p>
      <div className="flex flex-wrap gap-2">
        {recentSearches.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className="chip chip-inactive flex items-center gap-1.5"
            aria-label={`Search for ${item.query}`}
          >
            {item.type === 'place' ? (
              <MapPin size={13} aria-hidden="true" className="text-text-muted" />
            ) : (
              <Clock size={13} aria-hidden="true" className="text-text-muted" />
            )}
            <span className="text-sm">{item.query}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
