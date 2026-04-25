/**
 * AppShell — top bar + left sidebar + right map canvas.
 * All context providers live here — single tree, no prop drilling.
 * Layout: TopBar (full width) → below: Sidebar (left) + MapCanvas (right, flex-1).
 * On mobile: map is hidden, sidebar goes full-width.
 */
import { Outlet } from 'react-router-dom'
import { MapProvider } from '../../context/MapContext'
import { FilterProvider } from '../../context/FilterContext'
import { PreferenceProvider } from '../../context/PreferenceContext'
import { UserProvider } from '../../context/UserContext'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import MapCanvas from './MapCanvas'

export default function AppShell() {
  return (
    <MapProvider>
      <FilterProvider>
        <PreferenceProvider>
          <UserProvider>
            <div className="h-screen flex flex-col overflow-hidden bg-bg">
              <TopBar />
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar — contains view-specific content via Outlet */}
                <Sidebar>
                  <Outlet />
                </Sidebar>

                {/* Map canvas — right panel, hidden on small screens */}
                <div className="hidden lg:flex flex-1 relative">
                  <MapCanvas className="absolute inset-0 w-full h-full" />
                </div>
              </div>
            </div>
          </UserProvider>
        </PreferenceProvider>
      </FilterProvider>
    </MapProvider>
  )
}
