/**
 * FilterContext — all active filter state (cuisine, diet, price, ambience, distance, openNow).
 * Separate from PreferenceContext — filters are what the user is searching for RIGHT NOW.
 * Cluster 1: SearchView uses this. Cluster 4: RestaurantView also reads this.
 */
import { createContext, useContext, useReducer } from 'react'

const initialState = {
  dietary: [],          // ['vegetarian', 'vegan', 'halal', 'gluten-free']
  cuisine: [],          // ['Japanese', 'Indian', ...]
  price: [],            // [1, 2, 3, 4]
  ambience: [],         // ['casual', 'quiet', 'romantic', 'family']
  distance: 5,          // km, slider 0.5–5
  openNow: false,
}

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_DIETARY':
      return { ...state, dietary: action.payload }
    case 'SET_CUISINE':
      return { ...state, cuisine: action.payload }
    case 'SET_PRICE':
      return { ...state, price: action.payload }
    case 'SET_AMBIENCE':
      return { ...state, ambience: action.payload }
    case 'SET_DISTANCE':
      return { ...state, distance: action.payload }
    case 'SET_OPEN_NOW':
      return { ...state, openNow: action.payload }
    case 'CLEAR_ALL':
      return { ...initialState }
    case 'CLEAR_DIETARY':
      return { ...state, dietary: [] }
    case 'SET_DISTANCE_MAX':
      return { ...state, distance: 5 }
    default:
      return state
  }
}

const FilterContext = createContext(null)

export function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(filterReducer, initialState)

  const setDietary = (v) => dispatch({ type: 'SET_DIETARY', payload: v })
  const setCuisine = (v) => dispatch({ type: 'SET_CUISINE', payload: v })
  const setPrice = (v) => dispatch({ type: 'SET_PRICE', payload: v })
  const setAmbience = (v) => dispatch({ type: 'SET_AMBIENCE', payload: v })
  const setDistance = (v) => dispatch({ type: 'SET_DISTANCE', payload: v })
  const setOpenNow = (v) => dispatch({ type: 'SET_OPEN_NOW', payload: v })
  const clearAll = () => dispatch({ type: 'CLEAR_ALL' })
  const clearDietary = () => dispatch({ type: 'CLEAR_DIETARY' })
  const setDistanceMax = () => dispatch({ type: 'SET_DISTANCE_MAX' })

  const activeCount = [
    state.dietary.length > 0,
    state.cuisine.length > 0,
    state.price.length > 0,
    state.ambience.length > 0,
    state.distance < 5,
    state.openNow,
  ].filter(Boolean).length

  return (
    <FilterContext.Provider value={{
      ...state,
      setDietary, setCuisine, setPrice, setAmbience, setDistance, setOpenNow,
      clearAll, clearDietary, setDistanceMax,
      activeCount,
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilter must be used within FilterProvider')
  return ctx
}
