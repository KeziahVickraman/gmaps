/**
 * TurnByTurn — step-by-step navigation panel.
 * Current step prominent (large type + direction arrow).
 * Bottom strip: remaining distance · ETA · Exit — no clutter.
 * RerouteAlert slides in from top.
 * Cluster 2: S2_I004 — map orientation not according to driving direction → heading-up toggle.
 */
import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, MapPin, Clock, Navigation, Compass } from 'lucide-react'
import { useMap } from '../../context/MapContext'
import RerouteAlert from './RerouteAlert'

const ICON_MAP = {
  'arrow-right': ArrowRight,
  'turn-left': ArrowLeft,
  'turn-right': ArrowRight,
  'map-pin': MapPin,
}

export default function TurnByTurn({ route, onExit }) {
  const { headingUp, toggleHeadingUp } = useMap()
  const [currentStep, setCurrentStep] = useState(0)
  const [showReroute, setShowReroute] = useState(false)
  const [remainingEta, setRemainingEta] = useState(route.eta)

  // Mock reroute alert after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowReroute(true), 5000)
    return () => clearTimeout(t)
  }, [])

  const steps = route.steps || []
  const step = steps[currentStep]
  const nextStep = steps[currentStep + 1]
  const StepIcon = step ? (ICON_MAP[step.icon] || ArrowRight) : ArrowRight
  const progress = steps.length > 0 ? (currentStep / (steps.length - 1)) * 100 : 0

  const advance = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setRemainingEta(Math.max(0, remainingEta - Math.floor(route.eta / steps.length)))
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Reroute alert — non-modal, slides from top */}
      <RerouteAlert
        visible={showReroute}
        savings={4}
        onAccept={() => {
          setShowReroute(false)
          setRemainingEta(Math.max(0, remainingEta - 4))
        }}
        onDismiss={() => setShowReroute(false)}
      />

      {/* Heading-up toggle — Cluster 2 S2_I004 */}
      <div className="flex justify-end px-4 pt-3">
        <button
          onClick={toggleHeadingUp}
          className={`flex items-center gap-1.5 text-xs font-dm font-medium px-3 py-1.5 rounded-chip border transition-state ${
            headingUp ? 'bg-primary text-white border-primary' : 'bg-surface text-text-secondary border-border'
          }`}
          aria-pressed={headingUp}
          aria-label={headingUp ? 'Heading-up mode active' : 'Enable heading-up mode'}
          style={{ minHeight: '44px' }}
        >
          <Compass size={13} aria-hidden="true" />
          Heading-up
        </button>
      </div>

      {/* Progress bar */}
      <div className="mx-4 mt-3 h-1.5 bg-surface-raised rounded-full overflow-hidden" aria-hidden="true">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current step — prominent */}
      <div className="flex-1 px-4 pt-4 flex flex-col gap-4">
        {step ? (
          <>
            <div className="flex items-start gap-4 card p-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <StepIcon size={22} className="text-white" />
              </div>
              <div>
                <p className="font-syne font-bold text-base text-text-primary leading-snug">
                  {step.instruction}
                </p>
                <p className="text-sm text-text-muted font-dm mt-1">{step.distance}</p>
              </div>
            </div>

            {/* Next step — smaller */}
            {nextStep && (
              <div className="flex items-center gap-3 px-1 opacity-60">
                <div className="w-6 h-6 bg-surface-raised rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <ArrowRight size={12} className="text-text-secondary" />
                </div>
                <p className="text-sm text-text-secondary font-dm">
                  Then: {nextStep.instruction}
                </p>
              </div>
            )}

            {/* Step advancement mock */}
            <button
              onClick={advance}
              className="btn-secondary text-sm mt-auto"
              aria-label="Advance to next step"
            >
              Next step →
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 gap-2">
            <MapPin size={32} className="text-primary" aria-hidden="true" />
            <p className="font-syne font-semibold text-text-primary">You've arrived!</p>
          </div>
        )}
      </div>

      {/* Bottom strip — remaining ETA + exit (no clutter) */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-surface flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm font-medium text-text-primary font-dm">
            <Clock size={14} className="text-text-muted" aria-hidden="true" />
            {remainingEta} min
          </span>
          <span className="flex items-center gap-1.5 text-sm text-text-secondary font-dm">
            <Navigation size={14} className="text-text-muted" aria-hidden="true" />
            {route.distance}km
          </span>
        </div>
        <button
          onClick={onExit}
          className="text-sm font-dm font-medium text-error hover:opacity-75 transition-state"
          style={{ minHeight: '44px' }}
          aria-label="Exit navigation"
        >
          Exit navigation
        </button>
      </div>
    </div>
  )
}
