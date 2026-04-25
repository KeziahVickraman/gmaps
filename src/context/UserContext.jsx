/**
 * UserContext — mock user profile, saved places, recent searches.
 * Cluster 3: SavedView, HomeView consume this.
 */
import { createContext, useContext, useReducer } from 'react'
import savedListsData from '../data/savedLists.json'

const initialState = {
  name: 'Keziah',
  savedLists: savedListsData,
  savedPlaceIds: ['place_003', 'place_017', 'place_022', 'place_001'],
  recentSearches: [
    { id: 'rs1', query: 'Vegetarian near me', type: 'search' },
    { id: 'rs2', query: 'Orchard Road', type: 'place' },
    { id: 'rs3', query: 'Japanese restaurants', type: 'search' },
    { id: 'rs4', query: 'Dempsey Hill', type: 'place' },
  ],
  pinnedRoutes: [
    { id: 'pr1', label: 'Work', address: 'Raffles Place, Singapore', icon: 'briefcase' },
    { id: 'pr2', label: 'Home', address: 'Bedok, Singapore', icon: 'home' },
  ],
}

function userReducer(state, action) {
  switch (action.type) {
    case 'SAVE_PLACE_TO_LIST': {
      const { placeId, listId } = action.payload
      return {
        ...state,
        savedLists: state.savedLists.map((list) =>
          list.id === listId && !list.placeIds.includes(placeId)
            ? { ...list, placeIds: [...list.placeIds, placeId] }
            : list
        ),
        savedPlaceIds: state.savedPlaceIds.includes(placeId)
          ? state.savedPlaceIds
          : [...state.savedPlaceIds, placeId],
      }
    }
    case 'REMOVE_PLACE_FROM_LIST': {
      const { placeId, listId } = action.payload
      return {
        ...state,
        savedLists: state.savedLists.map((list) =>
          list.id === listId
            ? { ...list, placeIds: list.placeIds.filter((id) => id !== placeId) }
            : list
        ),
      }
    }
    case 'CREATE_LIST': {
      const newList = {
        id: `list_${Date.now()}`,
        name: action.payload.name,
        placeIds: action.payload.placeId ? [action.payload.placeId] : [],
        coverPhoto: `https://picsum.photos/seed/list${Date.now()}/600/400`,
      }
      return { ...state, savedLists: [...state.savedLists, newList] }
    }
    case 'ADD_RECENT_SEARCH': {
      const existing = state.recentSearches.filter((r) => r.query !== action.payload.query)
      return {
        ...state,
        recentSearches: [action.payload, ...existing].slice(0, 5),
      }
    }
    default:
      return state
  }
}

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState)

  const savePlaceToList = (placeId, listId) =>
    dispatch({ type: 'SAVE_PLACE_TO_LIST', payload: { placeId, listId } })

  const removePlaceFromList = (placeId, listId) =>
    dispatch({ type: 'REMOVE_PLACE_FROM_LIST', payload: { placeId, listId } })

  const createList = (name, placeId) =>
    dispatch({ type: 'CREATE_LIST', payload: { name, placeId } })

  const addRecentSearch = (query, type = 'search') =>
    dispatch({ type: 'ADD_RECENT_SEARCH', payload: { id: `rs_${Date.now()}`, query, type } })

  const isPlaceSaved = (placeId) => state.savedPlaceIds.includes(placeId)

  return (
    <UserContext.Provider value={{
      ...state,
      savePlaceToList, removePlaceFromList, createList, addRecentSearch, isPlaceSaved,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
