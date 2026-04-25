/**
 * RestaurantViewB — /restaurants/b
 * Minimal filter bar: dietary + open now only.
 * Results pre-sorted by distance. "Help me decide" FAB opens DecisionFlowSheet.
 * DecisionFlowSheet re-ranks results in real time behind the sheet as each answer is given.
 */
import { useState, useMemo, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { usePreference } from '../../context/PreferenceContext'
import RestaurantCard from '../../components/restaurant/RestaurantCard'
import PreferenceMatchBadge from '../../components/restaurant/PreferenceMatchBadge'  // imported per spec
import NoMatchFallback from '../../components/restaurant/NoMatchFallback'
import DecisionFlowSheet from '../../components/restaurant/DecisionFlowSheet'
import { CardSkeleton } from '../../components/shared/LoadingSkeleton'
import ErrorBanner from '../../components/shared/ErrorBanner'
import placesData from '../../data/places.json'

const DIETARY_OPTIONS = ['All', 'Vegetarian', 'Vegan', 'Halal', 'Gluten-free']
const DIETARY_MAP = { Vegetarian: 'vegetarian', Vegan: 'vegan', Halal: 'halal', 'Gluten-free': 'gluten-free' }

const closestPlace = [...placesData].sort((a, b) => a.distance - b.distance)[0]

function applyDecisionFilter(list, answers) {
  if (!answers || Object.keys(answers).length === 0) return list
  return list.filter(place => {
    const { mood, time, group } = answers
    if (mood && mood !== 'surprise') {
      const moodTags = { light: ['light', 'healthy'], comfort: ['comfort'], healthy: ['healthy', 'light'] }
      const required = moodTags[mood] || []
      if (required.length > 0 && !place.tags.some(t => required.includes(t))) return false
    }
    if (time === 'quick'   && place.avgMealDuration > 30) return false
    if (time === 'relaxed' && place.avgMealDuration < 45) return false
    if (group === 'solo'    && !place.tags.includes('solo-friendly'))  return false
    if (group === 'friends' && !place.tags.includes('group-friendly')) return false
    if (group === 'family'  && !place.ambience.includes('family'))     return false
    if (group === 'partner' && !place.ambience.some(a => ['romantic', 'quiet'].includes(a))) return false
    return true
  })
}

export default function RestaurantViewB() {
  const { scorePlace } = usePreference()

  const [dietary, setDietary]             = useState([])
  const [openNow, setOpenNow]             = useState(false)
  const [decisionAnswers, setDecisionAnswers] = useState({})
  const [showDecision, setShowDecision]   = useState(false)
  const [showAll, setShowAll]             = useState(false)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(false)

  useEffect(() => {
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script","wh2j5yuucb");
    window.clarity?.("set", "page", "restaurants-b");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  const toggleDietary = (opt) => {
    if (opt === 'All') { setDietary([]); return }
    setDietary(prev => prev.includes(opt) ? prev.filter(d => d !== opt) : [...prev, opt])
    setShowAll(false)
  }

  const hasDecisionActive = Object.keys(decisionAnswers).length > 0

  const results = useMemo(() => {
    let list = [...placesData]

    if (!showAll) {
      if (dietary.length > 0) {
        const keys = dietary.map(d => DIETARY_MAP[d])
        list = list.filter(p => keys.every(k => p.dietary.includes(k)))
      }
      if (openNow) {
        list = list.filter(p => p.openNow)
      }
      list = applyDecisionFilter(list, decisionAnswers)
    }

    list.sort((a, b) => a.distance - b.distance)
    return list.map(p => ({ ...p, _match: scorePlace(p) }))
  }, [dietary, openNow, decisionAnswers, showAll, scorePlace])

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <h2 className="font-syne font-bold text-base text-text-primary">Restaurants near you</h2>
        <span
          style={{ fontSize: '11px' }}
          className="text-text-muted bg-surface-raised border border-border px-2 py-0.5 rounded-chip font-dm flex-shrink-0"
          aria-label="Version B"
        >
          Version B
        </span>
      </div>

      {/* ── Help me decide button ─────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <button
          onClick={() => setShowDecision(true)}
          aria-label="Help me decide"
          className="flex items-center gap-2 text-white rounded-chip px-4 py-3 shadow-card hover:opacity-90 active:scale-95 transition-state"
          style={{ minHeight: '48px', backgroundColor: 'var(--color-primary)' }}
        >
          <Sparkles size={16} aria-hidden="true" />
          <span className="font-dm font-medium text-sm">Help me decide</span>
        </button>
      </div>

      {/* ── Error banner ─────────────────────────────────────────── */}
      <ErrorBanner
        message="Couldn't load restaurants. Check your connection."
        onRetry={() => setError(false)}
        visible={error}
      />

      {/* ── Minimal filter bar ───────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-border bg-surface px-4 py-3 flex items-center gap-3 flex-wrap">
        {/* Dietary pills */}
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by dietary preference">
          {DIETARY_OPTIONS.map(opt => {
            const active = opt === 'All' ? dietary.length === 0 : dietary.includes(opt)
            return (
              <button
                key={opt}
                onClick={() => toggleDietary(opt)}
                role="checkbox"
                aria-checked={active}
                className={`chip text-xs flex-shrink-0 ${active ? 'chip-active' : 'chip-inactive'}`}
                style={{ minHeight: '36px' }}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {/* Open now toggle */}
        <label className="flex items-center gap-2 ml-auto cursor-pointer" style={{ minHeight: '44px' }}>
          <span className="text-xs font-dm text-text-secondary">Open now</span>
          <button
            role="switch"
            aria-checked={openNow}
            onClick={() => setOpenNow(p => !p)}
            className={`relative inline-flex h-5 w-9 rounded-full transition-state focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
              openNow ? 'bg-primary' : 'bg-border'
            }`}
            aria-label="Show only open restaurants"
          >
            <span
              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                openNow ? 'translate-x-4' : 'translate-x-0'
              }`}
              aria-hidden="true"
            />
          </button>
        </label>
      </div>

      {/* Decision answers active strip */}
      {hasDecisionActive && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-light border-b border-primary/10 flex-shrink-0">
          <Sparkles size={13} className="text-primary flex-shrink-0" aria-hidden="true" />
          <p className="flex-1 text-xs text-primary font-dm font-medium">Results ranked by your answers</p>
          <button
            onClick={() => { setDecisionAnswers({}); setShowAll(false) }}
            className="text-xs text-primary font-dm hover:underline"
            style={{ minHeight: '44px' }}
          >
            Reset
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
            onAdjustFilter={() => { setDietary([]); setOpenNow(false); setDecisionAnswers({}) }}
            onShowAll={() => setShowAll(true)}
          />
        ) : (
          <div className="flex flex-col gap-3 px-4 py-4" role="list" aria-label="Restaurant results">
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

      {/* ── Decision flow sheet ──────────────────────────────────── */}
      <DecisionFlowSheet
        open={showDecision}
        onClose={() => setShowDecision(false)}
        onApply={(answers) => setDecisionAnswers(answers)}
      />
    </div>
  )
}
