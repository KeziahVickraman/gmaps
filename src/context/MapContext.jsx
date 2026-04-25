/**
 * MapContext — active place, active route, map viewport state, heading-up toggle.
 * Used by MapCanvas, NavigationView, SearchView.
 */
import { createContext, useContext, useReducer } from 'react'

const initialState = {
  activePlace: null,       // place object currently selected
  activeRoute: null,       // route object currently active
  headingUp: false,        // Cluster 2: map orientation toggle
  viewport: {
    lat: 1.2966,           // Singapore city center
    lng: 103.8520,
    zoom: 14,
  },
  mapPins: [],             // array of place objects to render on map
}

function mapReducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_PLACE':
      return { ...state, activePlace: action.payload }
    case 'CLEAR_ACTIVE_PLACE':
      return { ...state, activePlace: null }
    case 'SET_ACTIVE_ROUTE':
      return { ...state, activeRoute: action.payload }
    case 'CLEAR_ACTIVE_ROUTE':
      return { ...state, activeRoute: null }
    case 'TOGGLE_HEADING_UP':
      return { ...state, headingUp: !state.headingUp }
    case 'SET_VIEWPORT':
      return { ...state, viewport: { ...state.viewport, ...action.payload } }
    case 'SET_MAP_PINS':
      return { ...state, mapPins: action.payload }
    default:
      return state
  }
}

const MapContext = createContext(null)

export function MapProvider({ children }) {
  const [state, dispatch] = useReducer(mapReducer, initialState)

  const setActivePlace = (place) => dispatch({ type: 'SET_ACTIVE_PLACE', payload: place })
  const clearActivePlace = () => dispatch({ type: 'CLEAR_ACTIVE_PLACE' })
  const setActiveRoute = (route) => dispatch({ type: 'SET_ACTIVE_ROUTE', payload: route })
  const clearActiveRoute = () => dispatch({ type: 'CLEAR_ACTIVE_ROUTE' })
  const toggleHeadingUp = () => dispatch({ type: 'TOGGLE_HEADING_UP' })
  const setViewport = (viewport) => dispatch({ type: 'SET_VIEWPORT', payload: viewport })
  const setMapPins = (pins) => dispatch({ type: 'SET_MAP_PINS', payload: pins })

  return (
    <MapContext.Provider value={{ ...state, setActivePlace, clearActivePlace, setActiveRoute, clearActiveRoute, toggleHeadingUp, setViewport, setMapPins }}>
      {children}
    </MapContext.Provider>
  )
}

export function useMap() {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useMap must be used within MapProvider')
  return ctx
}
