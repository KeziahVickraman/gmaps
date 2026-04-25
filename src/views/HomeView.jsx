/**
 * HomeView — Cluster 3: re-entry + contextual prompts.
 * UXR signal: infrequent users can't re-orient — no clear starting point.
 * Design response: surface recent searches immediately, time-of-day prompt, pinned routes.
 */
import { useEffect } from 'react'
import { useMap } from '../context/MapContext'
import HomeScreen from '../components/onboarding/HomeScreen'
import placesData from '../data/places.json'

export default function HomeView() {
  const { setMapPins } = useMap()

  // Show nearby places on map as context
  useEffect(() => {
    setMapPins(placesData.slice(0, 12).map((p) => ({ ...p, _match: { matchType: 'default' } })))
  }, [])

  return <HomeScreen />
}
