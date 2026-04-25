/**
 * SearchView — Cluster 1: Restaurant Discovery & Dietary Filter Failure.
 * UXR signals:
 *   S1_I004: "searches vegetarian restaurants… suggestions are wrong (non-veg options presented)"
 *   S1_I003: "stares at it and scrolls excessively… thinking about what he wants to eat"
 *   S2_I006: "toggled at various locations… looked at ratings, reviews and photos to decide"
 *
 * Design response:
 *   - Dietary filter first-class (first section in FilterPanel)
 *   - Filter state visually persistent — always visible on results
 *   - Real-time re-rank on filter change
 *   - Cards show dietary badges prominently
 */
import { useState } from 'react'
import SearchBar from '../components/search/SearchBar'
import RestaurantFilters from '../components/restaurant/RestaurantFilters'
import SearchResults from '../components/search/SearchResults'
import { SlidersHorizontal } from 'lucide-react'
import { useFilter } from '../context/FilterContext'

export default function SearchView() {
  const [showFilters, setShowFilters] = useState(false)
  const { activeCount } = useFilter()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search bar + suggestion chips */}
      <SearchBar />

      {/* Mobile: filter toggle button */}
      <div className="lg:hidden px-4 py-2 border-b border-border">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-dm font-medium text-text-secondary hover:text-text-primary transition-state"
          aria-expanded={showFilters}
          aria-label={`${showFilters ? 'Hide' : 'Show'} filters${activeCount > 0 ? `, ${activeCount} active` : ''}`}
          style={{ minHeight: '44px' }}
        >
          <SlidersHorizontal size={15} aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="bg-primary text-white text-xs rounded-chip px-1.5 py-0.5">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Content: filters + results */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filter panel — always visible on desktop, toggled on mobile */}
        <div
          className={`${
            showFilters ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 border-r border-border overflow-y-auto flex-shrink-0 bg-surface`}
        >
          <RestaurantFilters />
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto">
          <SearchResults
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>
      </div>
    </div>
  )
}
