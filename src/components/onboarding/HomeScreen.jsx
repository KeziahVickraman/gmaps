/**
 * HomeScreen — composed view content: contextual prompt + recent searches + pinned routes + saved list preview.
 * Cluster 3: HomeView.
 */
import { useNavigate } from 'react-router-dom'
import { Briefcase, Home, ChevronRight, BookmarkIcon } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import ContextualPrompts from './ContextualPrompts'
import RecentSearches from './RecentSearches'

const PINNED_ICONS = { briefcase: Briefcase, home: Home }

function PinnedRouteCard({ route }) {
  const navigate = useNavigate()
  const Icon = PINNED_ICONS[route.icon] || Home

  return (
    <button
      onClick={() => navigate('/navigation')}
      className="flex-1 card flex items-center gap-3 p-3 hover:shadow-card transition-state text-left"
      style={{ minHeight: '44px' }}
      aria-label={`Navigate to ${route.label}: ${route.address}`}
    >
      <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-primary" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary font-dm">{route.label}</p>
        <p className="text-xs text-text-muted font-dm truncate">{route.address}</p>
      </div>
    </button>
  )
}

function SavedListCard({ list }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/saved')}
      className="card overflow-hidden flex-shrink-0 w-40 text-left hover:shadow-card transition-state"
      style={{ minHeight: '44px' }}
      aria-label={`Open saved list: ${list.name}`}
    >
      <img
        src={list.coverPhoto}
        alt=""
        className="w-full h-24 object-cover"
        loading="lazy"
      />
      <div className="p-2">
        <p className="text-xs font-medium text-text-primary font-dm truncate">{list.name}</p>
        <p className="text-xs text-text-muted font-dm">{list.placeIds.length} places</p>
      </div>
    </button>
  )
}

export default function HomeScreen() {
  const { pinnedRoutes, savedLists } = useUser()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Contextual prompt */}
      <ContextualPrompts />

      {/* Recent searches */}
      <RecentSearches />

      {/* Divider */}
      <div className="border-b border-border" />

      {/* Pinned routes */}
      <div className="px-4 py-4">
        <p className="label-text text-text-muted mb-3">Quick routes</p>
        <div className="flex gap-3">
          {pinnedRoutes.map((route) => (
            <PinnedRouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>

      <div className="border-b border-border" />

      {/* Saved lists preview */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="label-text text-text-muted">Saved lists</p>
          <button
            onClick={() => navigate('/saved')}
            className="flex items-center gap-1 text-primary text-sm font-dm font-medium hover:underline"
            style={{ minHeight: '44px' }}
          >
            See all
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>

        {savedLists.length === 0 ? (
          <div className="text-center py-6">
            <BookmarkIcon size={24} className="text-text-muted mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-text-secondary font-dm">
              Nothing saved yet. Tap the bookmark icon on any place to save it here.
            </p>
            <button
              onClick={() => navigate('/search')}
              className="btn-secondary text-sm px-4 py-2 mt-3 mx-auto"
              style={{ minHeight: '44px' }}
            >
              Explore places
            </button>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {savedLists.slice(0, 2).map((list) => (
              <SavedListCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
