/**
 * SearchBar + SuggestionChips — Cluster 1 SearchView.
 * Max 5 chips (Miller's Law): Vegetarian · Nearby · Open Now · Trending · Budget
 * UXR: S1_I004 — dietary search must surface immediately, not buried.
 */
import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useFilter } from '../../context/FilterContext'
import { useUser } from '../../context/UserContext'

const SUGGESTION_CHIPS = [
  { label: 'Vegetarian', action: (f) => f.setDietary(['vegetarian']) },
  { label: 'Open Now', action: (f) => f.setOpenNow(true) },
  { label: 'Nearby', action: (f) => f.setDistance(1) },
  { label: 'Budget', action: (f) => f.setPrice([1]) },
  { label: 'Trending', action: null }, // mock — just clears to show all
]

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') || '')
  const navigate = useNavigate()
  const filters = useFilter()
  const { addRecentSearch } = useUser()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim()) return
    addRecentSearch(value.trim(), 'search')
    setSearchParams({ q: value.trim() })
  }

  const handleClear = () => {
    setValue('')
    setSearchParams({})
  }

  const handleChip = (chip) => {
    if (chip.action) chip.action(filters)
    if (chip.label === 'Vegetarian') {
      setValue('vegetarian')
      setSearchParams({ q: 'vegetarian' })
    }
  }

  return (
    <div className="px-4 pt-4 pb-2 border-b border-border">
      <form onSubmit={handleSubmit} role="search" aria-label="Search restaurants">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search for food, cuisine, place…"
            aria-label="Search restaurants"
            className="w-full pl-9 pr-10 py-3 bg-surface-raised border border-border rounded-chip text-sm font-dm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-state"
            style={{ minHeight: '44px' }}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-primary"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestion chips — max 5 (Miller's Law) */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1" role="group" aria-label="Quick search suggestions">
        {SUGGESTION_CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleChip(chip)}
            className="chip chip-inactive flex-shrink-0 text-sm"
            aria-label={`Quick search: ${chip.label}`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  )
}
