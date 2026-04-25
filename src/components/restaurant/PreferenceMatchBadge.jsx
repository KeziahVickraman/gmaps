/**
 * PreferenceMatchBadge — teal (strong match ≥3 signals) / amber (partial 1–2) / none.
 * Tap badge → tooltip showing match reasons: "Matches: [vegetarian] [quiet] [$–$$]"
 * Cluster 4: S1_I004 — preference known to user but invisible to system.
 */
import { useState, useRef, useEffect } from 'react'
import { Info } from 'lucide-react'

export default function PreferenceMatchBadge({ matchData }) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!tooltipOpen) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setTooltipOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [tooltipOpen])

  if (!matchData || matchData.matchType === 'none') return null

  const isStrong = matchData.matchType === 'strong'
  const pillClass = isStrong
    ? 'bg-primary-light text-primary border-primary/20'
    : 'bg-amber-50 text-amber-700 border-amber-200'
  const label = isStrong ? 'Great for you' : 'Might suit you'

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={(e) => { e.stopPropagation(); setTooltipOpen(!tooltipOpen) }}
        className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-chip border ${pillClass}`}
        aria-label={`${label}. Tap to see why.`}
        style={{ minHeight: '28px' }}
      >
        {label}
        <Info size={11} aria-hidden="true" />
      </button>

      {/* Tooltip */}
      {tooltipOpen && matchData.reasons?.length > 0 && (
        <div
          role="tooltip"
          className="absolute bottom-full left-0 mb-2 bg-text-primary text-white text-xs rounded-card px-3 py-2 whitespace-nowrap z-10 shadow-card"
        >
          <p className="font-medium mb-1">Matches:</p>
          <div className="flex flex-wrap gap-1">
            {matchData.reasons.map((r, i) => (
              <span key={i} className="bg-white/20 rounded-chip px-1.5 py-0.5">
                {r}
              </span>
            ))}
          </div>
          {/* Arrow */}
          <div
            className="absolute top-full left-3 border-4 border-transparent border-t-text-primary"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}
