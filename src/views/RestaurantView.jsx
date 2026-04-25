/**
 * RestaurantView — Cluster 4: Preference-Aware Restaurant Finding.
 * UXR signals:
 *   S1_I003: "stares at it and scrolls excessively… indecision is the symptom — no preference signal"
 *   S2_I006: "toggled at various locations… manual triangulation — app should do this work"
 *   S1_I004: "suggestions wrong — preference known to user but invisible to system"
 *
 * Design response:
 *   - Results pre-sorted by preference match (not just distance/rating)
 *   - PreferenceMatchBadge on every card
 *   - "Help me decide" floating button
 *   - NoMatchFallback when 0 results match — never a dead end
 *   - Onboarding prompt when profile not set
 */
import { useState, useEffect, useMemo } from 'react'
import { Sparkles, User, X } from 'lucide-react'
import { usePreference } from '../context/PreferenceContext'
import { useFilter } from '../context/FilterContext'
import { useMap } from '../context/MapContext'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import RestaurantDetail from '../components/restaurant/RestaurantDetail'
import PreferenceMatchBadge from '../components/restaurant/PreferenceMatchBadge'
import TasteProfilePanel from '../components/restaurant/TasteProfilePanel'
import NoMatchFallback from '../components/restaurant/NoMatchFallback'
import DecisionFlowSheet from '../components/restaurant/DecisionFlowSheet'
import ErrorBanner from '../components/shared/ErrorBanner'
import LoadingSkeleton from '../components/shared/LoadingSkeleton'
import BottomSheet from '../components/shared/BottomSheet'
import { CardSkeleton } from '../components/shared/LoadingSkeleton'
import placesData from '../data/places.json'

function applyDecisionFilter(places, decisionAnswers) {
  if (!decisionAnswers || Object.keys(decisionAnswers).length === 0) return places

  return places.filter((place) => {
    const mood = decisionAnswers.mood
    const time = decisionAnswers.time
    const group = decisionAnswers.group

    // Mood filter
    if (mood && mood !== 'surprise') {
      const moodTags = { light: ['light', 'healthy'], comfort: ['comfort'], healthy: ['healthy', 'light'] }
      const required = moodTags[mood] || []
      if (required.length > 0 && !place.tags.some((t) => required.includes(t))) return false
    }

    // Time filter
    if (time === 'quick' && place.avgMealDuration > 30) return false
    if (time === 'relaxed' && place.avgMealDuration < 45) return false

    // Group filter
    if (group === 'solo' && !place.tags.includes('solo-friendly')) return false
    if (group === 'friends' && !place.tags.includes('group-friendly')) return false
    if (group === 'family' && !place.ambience.includes('family')) return false
    if (group === 'partner' && !place.ambience.some((a) => ['romantic', 'quiet'].includes(a))) return false

    return true
  })
}

export default function RestaurantView() {
  const { sortByPreference, scorePlace, profileComplete } = usePreference()
  const filters = useFilter()
  const { setMapPins, setActivePlace } = useMap()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showDecision, setShowDecision] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [decisionAnswers, setDecisionAnswers] = useState({})
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(!profileComplete)
  const [showAll, setShowAll] = useState(false)

  // Simulate loading
  useEffect(() => {
    setLoading(true)
    setError(false)
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [filters.dietary, filters.cuisine, filters.price, filters.ambience, filters.distance, filters.openNow])

  // Sort by preference match
  const sorted = useMemo(() => {
    let base = placesData

    // Apply active filters
    base = base.filter((place) => {
      if (filters.dietary.length > 0 && !filters.dietary.every((d) => place.dietary.includes(d))) return false
      if (filters.distance < 5 && place.distance > filters.distance) return false
      if (filters.openNow && !place.openNow) return false
      return true
    })

    // Apply decision flow filter
    base = applyDecisionFilter(base, decisionAnswers)

    if (showAll) {
      return base.sort((a, b) => a.distance - b.distance).map((p) => ({ ...p, _match: scorePlace(p) }))
    }

    return sortByPreference(base)
  }, [sortByPreference, scorePlace, filters.dietary, filters.distance, filters.openNow, decisionAnswers, showAll])

  // Update map pins
  useEffect(() => {
    if (!loading) {
      setMapPins(sorted)
    }
  }, [sorted, loading])

  const handleAdjustFilter = () => {
    filters.clearAll()
    setShowAll(false)
  }

  if (loading) {
    return (
      <div role="status" aria-label="Finding places that match your taste…" className="flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <p className="text-sm text-text-secondary font-dm italic">Finding places that match your taste…</p>
        </div>
        <LoadingSkeleton type="card" count={3} message="Finding places that match your taste…" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorBanner
        message="Couldn't load restaurants. Check your connection."
        onRetry={() => setError(false)}
        visible={true}
      />
    )
  }

  const strongMatches = sorted.filter((p) => p._match?.matchType === 'strong')
  const hasAnyResults = sorted.length > 0

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-syne font-bold text-base text-text-primary">Find me a restaurant</h2>
          {strongMatches.length > 0 && (
            <p className="text-xs text-text-muted font-dm mt-0.5">
              {strongMatches.length} great match{strongMatches.length !== 1 ? 'es' : ''} for your taste
            </p>
          )}
        </div>
        <button
          onClick={() => setShowProfile(true)}
          aria-label="Open taste profile"
          className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-raised transition-state text-text-secondary"
        >
          <User size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Onboarding prompt strip — when profile not set */}
      {showOnboardingPrompt && !profileComplete && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border-b border-amber-200">
          <Sparkles size={15} className="text-amber-600 flex-shrink-0" aria-hidden="true" />
          <p className="flex-1 text-xs text-amber-800 font-dm">
            Set your taste preferences for better recommendations
          </p>
          <button
            onClick={() => setShowProfile(true)}
            className="text-xs text-amber-700 font-medium hover:underline font-dm"
            style={{ minHeight: '44px' }}
          >
            Set up
          </button>
          <button
            onClick={() => setShowOnboardingPrompt(false)}
            aria-label="Dismiss recommendation prompt"
            className="text-amber-600 hover:opacity-75"
            style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <ErrorBanner
          message="Couldn't load restaurants. Check your connection."
          onRetry={() => setError(false)}
          visible={true}
        />
      )}

      {/* Decision answers active indicator */}
      {Object.keys(decisionAnswers).length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-light border-b border-primary/10">
          <Sparkles size={13} className="text-primary" aria-hidden="true" />
          <p className="flex-1 text-xs text-primary font-dm font-medium">
            Showing results based on your answers
          </p>
          <button
            onClick={() => setDecisionAnswers({})}
            className="text-xs text-primary font-dm hover:underline"
            style={{ minHeight: '44px' }}
          >
            Reset
          </button>
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {!hasAnyResults ? (
          <NoMatchFallback
            bestMatch={placesData.sort((a, b) => a.distance - b.distance)[0]}
            onAdjustFilter={handleAdjustFilter}
            onShowAll={() => setShowAll(true)}
          />
        ) : (
          <div className="flex flex-col gap-3 px-4 py-4 pb-24" role="list" aria-label="Restaurants ranked by preference match">
            {sorted.map((place) => (
              <div key={place.id} role="listitem">
                <RestaurantCard
                  place={place}
                  matchData={place._match}
                  onClick={() => {
                    setSelectedPlace(place)
                    setActivePlace(place)
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* "Help me decide" FAB — bottom right, thumb-reachable (Fitts's Law) */}
      <div className="absolute bottom-6 right-4">
        <button
          onClick={() => setShowDecision(true)}
          className="flex items-center gap-2 bg-primary text-white rounded-chip px-4 py-3 shadow-card hover:bg-opacity-90 active:scale-95 transition-state"
          aria-label="Open help me decide assistant"
          style={{ minHeight: '48px' }}
        >
          <Sparkles size={16} aria-hidden="true" />
          <span className="font-dm font-medium text-sm">Help me decide</span>
        </button>
      </div>

      {/* Taste profile sheet */}
      <BottomSheet
        open={showProfile}
        onClose={() => setShowProfile(false)}
        title="Your Taste Profile"
        initialSnap={0.85}
        aria-label="Taste profile panel"
      >
        <TasteProfilePanel />
      </BottomSheet>

      {/* Decision flow sheet */}
      <DecisionFlowSheet
        open={showDecision}
        onClose={() => setShowDecision(false)}
        onApply={(answers) => setDecisionAnswers(answers)}
      />

      {/* Place detail sheet */}
      <BottomSheet
        open={!!selectedPlace}
        onClose={() => {
          setSelectedPlace(null)
          setActivePlace(null)
        }}
        title={selectedPlace?.name}
        initialSnap={0.75}
      >
        {selectedPlace && <RestaurantDetail place={selectedPlace} />}
      </BottomSheet>
    </div>
  )
}
