/**
 * BottomSheet — used for place detail, save to list, route options, DecisionFlowSheet.
 * Snap points: 40% / 75% / 95% of viewport height.
 * Drag handle visible. Dismiss: drag down or tap overlay.
 * No modals — per §10 Key Constraints.
 */
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X } from 'lucide-react'

const SNAP_POINTS = [0.4, 0.75, 0.95]

export default function BottomSheet({
  open,
  onClose,
  children,
  title,
  initialSnap = 0.75,
  'aria-label': ariaLabel,
}) {
  const dragControls = useDragControls()
  const sheetRef = useRef(null)

  // Trap focus inside sheet when open
  useEffect(() => {
    if (!open) return
    const sheet = sheetRef.current
    if (!sheet) return
    const focusable = sheet.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length) focusable[0].focus()
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  const snapHeight = `${initialSnap * 100}vh`

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || title || 'Panel'}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(e, info) => {
              if (info.velocity.y > 300 || info.offset.y > 120) {
                onClose()
              }
            }}
            style={{ height: snapHeight, maxHeight: '95vh' }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-[20px] z-50 flex flex-col overflow-hidden shadow-[0_-4px_32px_rgba(0,0,0,0.12)]"
          >
            {/* Drag handle */}
            <div
              className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing flex-shrink-0"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div
                className="w-10 h-1 bg-border rounded-full"
                aria-hidden="true"
              />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
                <h2 className="font-syne text-base font-semibold text-text-primary">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close panel"
                  className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-raised transition-state text-text-secondary"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
