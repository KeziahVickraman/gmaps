/**
 * TopBar — search bar + cluster nav tabs.
 * Miller's Law: 5 tabs maximum.
 * Cluster navigation: Home / Search / Restaurants / Navigation / Saved
 */
import { NavLink, useNavigate } from 'react-router-dom'
import { Search, Home, UtensilsCrossed, Navigation, Bookmark, Map } from 'lucide-react'
import { useState } from 'react'
import { useUser } from '../../context/UserContext'

const NAV_TABS = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/restaurants', label: 'Restaurants', icon: UtensilsCrossed },
  { to: '/navigation', label: 'Navigate', icon: Navigation },
  { to: '/saved', label: 'Saved', icon: Bookmark },
]

export default function TopBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { addRecentSearch } = useUser()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    addRecentSearch(query.trim(), 'search')
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  return (
    <header className="bg-surface border-b border-border flex-shrink-0 z-30">
      {/* Search row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <Map size={22} className="text-primary" aria-hidden="true" />
          <span className="font-syne font-bold text-base text-text-primary hidden sm:block">
            Maps
          </span>
        </div>
        <form
          onSubmit={handleSearch}
          className="flex-1 relative"
          role="search"
          aria-label="Search places"
        >
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, places, addresses…"
            aria-label="Search places"
            className="w-full pl-9 pr-4 py-2.5 bg-surface-raised border border-border rounded-chip text-sm font-dm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:bg-surface transition-state"
            style={{ minHeight: '44px' }}
          />
        </form>
      </div>

      {/* Nav tabs */}
      <nav
        aria-label="Main navigation"
        className="flex border-t border-border overflow-x-auto scrollbar-none"
      >
        {NAV_TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2.5 px-2 text-xs font-dm font-medium transition-state min-w-[60px] border-b-2 ${
                isActive
                  ? 'text-primary border-primary'
                  : 'text-text-muted border-transparent hover:text-text-secondary'
              }`
            }
            style={{ minHeight: '44px' }}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
