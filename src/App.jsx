import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AppShell from './components/layout/AppShell'
import HomeView from './views/HomeView'
import SearchView from './views/SearchView'
import RestaurantView from './views/RestaurantView'
import NavigationView from './views/NavigationView'
import SavedView from './views/SavedView'

const pageVariants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
}

const pageTransition = { duration: 0.18, ease: 'easeOut' }

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route
            path="home"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="flex flex-col h-full overflow-hidden"
              >
                <HomeView />
              </motion.div>
            }
          />
          <Route
            path="search"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="flex flex-col h-full overflow-hidden"
              >
                <SearchView />
              </motion.div>
            }
          />
          <Route
            path="restaurants"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="flex flex-col h-full overflow-hidden"
              >
                <RestaurantView />
              </motion.div>
            }
          />
          <Route
            path="navigation"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="flex flex-col h-full overflow-hidden"
              >
                <NavigationView />
              </motion.div>
            }
          />
          <Route
            path="saved"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="flex flex-col h-full overflow-hidden"
              >
                <SavedView />
              </motion.div>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AnimatedRoutes />
    </HashRouter>
  )
}
