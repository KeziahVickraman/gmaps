/**
 * PreferenceContext — user taste profile and preference match scoring.
 * Separate from FilterContext: this is WHO the user is, not what they're searching for.
 * Cluster 4: RestaurantView, TasteProfilePanel, PreferenceMatchBadge all consume this.
 *
 * Match scoring logic (per §4 Cluster 4 spec):
 *   Strong match (≥3 signals): dietary + cuisine + ambience + price range
 *   Partial match (1–2 signals)
 *   No match (0 signals)
 */
import { createContext, useContext, useReducer } from 'react'
import defaultPrefs from '../data/userPreferences.json'

const initialState = {
  ...defaultPrefs,
}

function prefReducer(state, action) {
  switch (action.type) {
    case 'SET_DIETARY':
      return { ...state, dietary: action.payload }
    case 'SET_CUISINES':
      return { ...state, cuisines: action.payload }
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload }
    case 'SET_AMBIENCE':
      return { ...state, ambience: action.payload }
    case 'SET_PROFILE_COMPLETE':
      return { ...state, profileComplete: action.payload }
    default:
      return state
  }
}

const PreferenceContext = createContext(null)

export function PreferenceProvider({ children }) {
  const [state, dispatch] = useReducer(prefReducer, initialState)

  const setDietary = (v) => dispatch({ type: 'SET_DIETARY', payload: v })
  const setCuisines = (v) => dispatch({ type: 'SET_CUISINES', payload: v })
  const setPriceRange = (v) => dispatch({ type: 'SET_PRICE_RANGE', payload: v })
  const setAmbience = (v) => dispatch({ type: 'SET_AMBIENCE', payload: v })
  const setProfileComplete = (v) => dispatch({ type: 'SET_PROFILE_COMPLETE', payload: v })

  /**
   * Compute preference match for a single place.
   * Returns: { score: number, matchType: 'strong'|'partial'|'none', reasons: string[] }
   *
   * Scoring signals:
   *   1. Dietary: place dietary array contains ALL user dietary preferences → +1
   *   2. Cuisine: place cuisine matches any of user's preferred cuisines → +1
   *   3. Ambience: place ambience overlaps with user's preferred ambience → +1
   *   4. Price: place price is within user's priceRange → +1
   */
  const scorePlace = (place) => {
    let score = 0
    const reasons = []

    // 1. Dietary match
    if (state.dietary.length > 0) {
      const dietaryMatch = state.dietary.every((d) => place.dietary.includes(d))
      if (dietaryMatch) {
        score++
        reasons.push(...state.dietary)
      }
    } else {
      // No dietary preference set — neutral, give partial credit
      score += 0.5
    }

    // 2. Cuisine match
    if (state.cuisines.length > 0 && state.cuisines.includes(place.cuisine)) {
      score++
      reasons.push(place.cuisine)
    }

    // 3. Ambience match
    if (state.ambience.length > 0) {
      const ambienceOverlap = place.ambience.some((a) => state.ambience.includes(a))
      if (ambienceOverlap) {
        score++
        const matched = place.ambience.filter((a) => state.ambience.includes(a))
        reasons.push(...matched)
      }
    }

    // 4. Price match
    if (state.priceRange.length === 2) {
      const [min, max] = state.priceRange
      if (place.price >= min && place.price <= max) {
        score++
        reasons.push(`${'$'.repeat(place.price)}`)
      }
    }

    const matchType = score >= 3 ? 'strong' : score >= 1 ? 'partial' : 'none'

    return { score, matchType, reasons: [...new Set(reasons)] }
  }

  /**
   * Sort places by preference match score descending.
   * No-match places are de-prioritised to end of list.
   */
  const sortByPreference = (places) => {
    return [...places]
      .map((p) => ({ ...p, _match: scorePlace(p) }))
      .sort((a, b) => b._match.score - a._match.score)
  }

  return (
    <PreferenceContext.Provider value={{
      ...state,
      setDietary, setCuisines, setPriceRange, setAmbience, setProfileComplete,
      scorePlace, sortByPreference,
    }}>
      {children}
    </PreferenceContext.Provider>
  )
}

export function usePreference() {
  const ctx = useContext(PreferenceContext)
  if (!ctx) throw new Error('usePreference must be used within PreferenceProvider')
  return ctx
}
