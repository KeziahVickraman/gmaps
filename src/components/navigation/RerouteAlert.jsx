/**
 * RerouteAlert — non-modal banner sliding in from top. Auto-dismisses in 8s.
 * "Faster route found: saves X min. Take it?" → [Yes] [Stay on route]
 * Cluster 2: S2_I003 — rerouting must NOT be silent, must show ETA delta.
 */
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation, X } from 'lucide-react'

export default function RerouteAlert({ savings, onAccept, onDismiss, visible }) {
  const [show, setShow] = useState(visible)
  const [countdown, setCountdown] = useState(8)

  useEffect(() => {
    setShow(visible)
    setCountdown(8)
  }, [visible])

  useEffect(() => {
    if (!show) return
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          setShow(false)
          onDismiss?.()
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          role="alert"
          aria-live="polite"
          className="mx-4 mt-3 card border-primary/20 bg-primary-light overflow-hidden"
        >
          {/* Progress bar */}
          <motion.div
            className="h-0.5 bg-primary"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 8, ease: 'linear' }}
            aria-hidden="true"
          />

          <div className="flex items-center gap-3 p-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <Navigation size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary font-dm">
                Faster route found — saves {savings} min
              </p>
              <p className="text-xs text-text-muted font-dm">
                Auto-dismisses in {countdown}s
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShow(false); onAccept?.() }}
                className="btn-primary text-xs px-3 py-1.5"
                style={{ minHeight: '44px' }}
              >
                Take it
              </button>
              <button
                onClick={() => { setShow(false); onDismiss?.() }}
                className="btn-secondary text-xs px-3 py-1.5"
                style={{ minHeight: '44px' }}
              >
                Stay
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
