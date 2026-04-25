/**
 * RestaurantViewA — /restaurants/a
 * Full filter bar: dietary · cuisine · price · sort.
 * Results rerank in real time. No decision flow — filters only.
 * Active filters shown as dismissable chips. "Clear all" when any filter active.
 */
import { useState, useMemo, useEffect } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { usePreference } from '../../context/PreferenceContext'
import RestaurantCard from '../../components/restaurant/RestaurantCard'
import PreferenceMatchBadge from '../../components/restaurant/PreferenceMatchBadge'  // imported per spec
import NoMatchFallback from '../../components/restaurant/NoMatchFallback'
import { CardSkeleton } from '../../components/shared/LoadingSkeleton'
import ErrorBanner from '../../components/shared/ErrorBanner'
import placesData from '../../data/places.json'

const DIETARY_OPTIONS = ['All', 'Vegetarian', 'Vegan', 'Halal', 'Gluten-free']
const DIETARY_MAP = { Vegetarian: 'vegetarian', Vegan: 'vegan', Halal: 'halal', 'Gluten-free': 'gluten-free' }
const CUISINE_OPTIONS = ['All', 'Chinese', 'Japanese', 'Indian', 'Western', 'Thai']
const PRICE_LABELS = ['$', '$$', '$$$', '$$$$']
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'distance',  label: 'Distance'  },
  { value: 'rating',    label: 'Rating'    },
  { value: 'openNow',   label: 'Open now'  },
]

// Closest place by distance — always available as NoMatchFallback best-effort card
const closestPlace = [...placesData].sort((a, b) => a.distance - b.distance)[0]

export default function RestaurantViewA() {
  const { scorePlace } = usePreference()

  // Filter state — local to this view
  const [dietary, setDietary] = useState([])
  const [cuisine, setCuisine] = useState([])
  const [price, setPrice] = useState(null)   // null | 1 | 2 | 3 | 4 (single-select)
  const [sort, setSort] = useState('relevance')
  const [showAll, setShowAll] = useState(false)

  // Loading: 300ms on mount (simulates data fetch)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script","wh2i504ocr");
    window.clarity?.("set", "page", "restaurants-a");
  }, []);

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  // Helpers
  const toggleDietary = (opt) => {
    if (opt === 'All') { setDietary([]); return }
    setDietary(prev => prev.includes(opt) ? prev.filter(d => d !== opt) : [...prev, opt])
    setShowAll(false)
  }
  const toggleCuisine = (opt) => {
    if (opt === 'All') { setCuisine([]); return }
    setCuisine(prev => prev.includes(opt) ? prev.filter(c => c !== opt) : [...prev, opt])
    setShowAll(false)
  }
  const togglePrice = (val) => { setPrice(prev => prev === val ? null : val); setShowAll(false) }

  const hasActiveFilters = dietary.length > 0 || cuisine.length > 0 || price !== null
  const clearAll = () => { setDietary([]); setCuisine([]); setPrice(null); setSort('relevance'); setShowAll(false) }

  // Filtered + sorted results
  const results = useMemo(() => {
    let list = [...placesData]

    if (!showAll) {
      if (dietary.length > 0) {
        const keys = dietary.map(d => DIETARY_MAP[d])
        list = list.filter(p => keys.every(k => p.dietary.includes(k)))
      }
      if (cuisine.length > 0) {
        list = list.filter(p => cuisine.includes(p.cuisine))
      }
      if (price !== null) {
        list = list.filter(p => p.price === price)
      }
    }

    if (sort === 'openNow') {
      list = list.filter(p => p.openNow).sort((a, b) => a.distance - b.distance)
    } else if (sort === 'distance') {
      list.sort((a, b) => a.distance - b.distance)
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating)
    }
    // 'relevance' keeps original data order

    return list.map(p => ({ ...p, _match: scorePlace(p) }))
  }, [dietary, cuisine, price, sort, showAll, scorePlace])

  // Active chip descriptors for dismissable filter row
  const activeChips = [
    ...dietary.map(d => ({ label: d, onRemove: () => setDietary(prev => prev.filter(x => x !== d)) })),
    ...cuisine.map(c => ({ label: c, onRemove: () => setCuisine(prev => prev.filter(x => x !== c)) })),
    ...(price !== null ? [{ label: PRICE_LABELS[price - 1], onRemove: () => setPrice(null) }] : []),
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <h2 className="font-syne font-bold text-base text-text-primary">Restaurants near you</h2>
        <span
          style={{ fontSize: '11px' }}
          className="text-text-muted bg-surface-raised border border-border px-2 py-0.5 rounded-chip font-dm flex-shrink-0"
          aria-label="Version A"
        >
          Version A
        </span>
      </div>

      {/* ── Error banner ─────────────────────────────────────────── */}
      <ErrorBanner
        message="Couldn't load restaurants. Check your connection."
        onRetry={() => setError(false)}
        visible={error}
      />

      {/* ── Filter bar — pinned, never collapsible ────────────────── */}
      <div className="flex-shrink-0 border-b border-border bg-surface">

        {/* Dietary row */}
        <div
          className="px-4 pt-3 pb-2 flex gap-2"
          role="group"
          aria-label="Filter by dietary preference"
        >
          {DIETARY_OPTIONS.map(opt => {
            const active = opt === 'All' ? dietary.length === 0 : dietary.includes(opt)
            return (
              <button
                key={opt}
                onClick={() => toggleDietary(opt)}
                role="checkbox"
                aria-checked={active}
                className={`chip flex-shrink-0 text-xs ${active ? 'chip-active' : 'chip-inactive'}`}
                style={{ minHeight: '36px' }}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {/* Cuisine row — horizontal scroll */}
        <div
          className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none"
          role="group"
          aria-label="Filter by cuisine"
        >
          {CUISINE_OPTIONS.map(opt => {
            const active = opt === 'All' ? cuisine.length === 0 : cuisine.includes(opt)
            return (
              <button
                key={opt}
                onClick={() => toggleCuisine(opt)}
                role="checkbox"
                aria-checked={active}
                className={`chip flex-shrink-0 text-xs ${active ? 'chip-active' : 'chip-inactive'}`}
                style={{ minHeight: '36px' }}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {/* Price segmented control + Sort dropdown */}
        <div className="px-4 pb-3 flex items-center gap-3">
          <div
            className="flex rounded-btn border border-border overflow-hidden"
            role="group"
            aria-label="Filter by price"
          >
            {PRICE_LABELS.map((label, i) => {
              const val = i + 1
              const active = price === val
              return (
                <button
                  key={val}
                  onClick={() => togglePrice(val)}
                  aria-pressed={active}
                  className={`px-3 text-xs font-dm font-medium border-r last:border-r-0 border-border transition-state ${
                    active ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:bg-surface-raised'
                  }`}
                  style={{ minHeight: '36px', minWidth: '36px' }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="relative ml-auto">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              aria-label="Sort restaurants by"
              className="appearance-none bg-surface border border-border rounded-btn pl-3 pr-7 text-xs font-dm text-text-primary cursor-pointer focus:outline-none focus:border-primary"
              style={{ minHeight: '36px' }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* ── Active filter chips ───────────────────────────────────── */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 px-4 py-2 flex-wrap border-b border-border flex-shrink-0">
          {activeChips.map((chip, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-primary-light text-primary text-xs px-2 py-1 rounded-chip border border-primary/20 font-dm"
            >
              {chip.label}
              <button
                onClick={chip.onRemove}
                aria-label={`Remove ${chip.label} filter`}
                className="hover:opacity-75 flex items-center"
                style={{ minHeight: '24px', minWidth: '24px' }}
              >
                <X size={11} aria-hidden="true" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-text-secondary font-dm hover:text-text-primary underline ml-auto"
            style={{ minHeight: '44px' }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div role="status" aria-label="Loading restaurants…" className="flex flex-col gap-3 p-4">
            <span className="sr-only">Loading restaurants…</span>
            {[0, 1, 2].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <NoMatchFallback
            bestMatch={closestPlace}
            onAdjustFilter={clearAll}
            onShowAll={() => setShowAll(true)}
          />
        ) : (
          <div
            className="flex flex-col gap-3 px-4 py-4"
            role="list"
            aria-label="Restaurant results"
          >
            {results.map(place => (
              <div key={place.id} role="listitem">
                <RestaurantCard
                  place={place}
                  matchData={place._match}
                  onClick={() => {}}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
