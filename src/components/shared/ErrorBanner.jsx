/**
 * ErrorBanner — non-modal inline error, slides in from top of content area.
 * Used across all views per §7 Interaction Patterns.
 * Auto-dismisses after 5s if onDismiss is provided.
 */
import { useEffect, useState } from 'react'
import { AlertCircle, RefreshCw, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ErrorBanner({ message, onRetry, onDismiss, visible = true }) {
  const [show, setShow] = useState(visible)

  useEffect(() => {
    setShow(visible)
  }, [visible])

  useEffect(() => {
    if (!show || !onDismiss) return
    const timer = setTimeout(() => {
      setShow(false)
      onDismiss?.()
    }, 5000)
    return () => clearTimeout(timer)
  }, [show, onDismiss])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          role="alert"
          aria-live="assertive"
          className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-btn text-sm text-error mx-4 mt-3"
        >
          <AlertCircle size={16} aria-hidden="true" className="flex-shrink-0" />
          <span className="flex-1 font-dm">{message}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              aria-label="Retry"
              className="flex items-center gap-1 text-error font-medium hover:underline"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <RefreshCw size={14} aria-hidden="true" />
              <span>Retry</span>
            </button>
          )}
          {onDismiss && (
            <button
              onClick={() => { setShow(false); onDismiss?.() }}
              aria-label="Dismiss error"
              className="text-error hover:opacity-75 transition-state"
              style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
