/**
 * DecisionFlowSheet — 3-step bottom sheet, one question per step, max 4 answers (Miller's Law).
 * Re-ranks list in real time as answers are given (onApply fires after each answer).
 * Cluster 4 / Variant B: S1_I003 — "stares at it and scrolls excessively — indecision is the symptom."
 *
 * Behaviour per spec:
 *   - "Step X of 3" progress label, always visible
 *   - Skip link on every step (excludes signal, advances without applying)
 *   - Reset link on step 3 only (resets to step 1, no confirmation)
 *   - Auto-closes after step 3 answer is selected
 */
import { useState } from 'react'
import BottomSheet from '../shared/BottomSheet'

const STEPS = [
  {
    id: 'mood',
    question: 'What are you in the mood for?',
    options: [
      { value: 'light',   label: 'Something light', emoji: '🥗', tags: ['light', 'healthy'] },
      { value: 'comfort', label: 'Comfort food',    emoji: '🍜', tags: ['comfort'] },
      { value: 'healthy', label: 'Healthy',         emoji: '💪', tags: ['healthy', 'light'] },
      { value: 'surprise',label: 'Surprise me',     emoji: '🎲', tags: [] },
    ],
  },
  {
    id: 'time',
    question: 'How long do you have?',
    options: [
      { value: 'quick',   label: 'Under 30 min',  emoji: '⚡', maxDuration: 30 },
      { value: 'relaxed', label: 'Relaxed meal',   emoji: '😌', minDuration: 45 },
      { value: 'any',     label: "Doesn't matter", emoji: '🤷', maxDuration: null },
    ],
  },
  {
    id: 'group',
    question: "Who's joining you?",
    options: [
      { value: 'solo',    label: 'Just me',  emoji: '🙋', tags: ['solo-friendly'] },
      { value: 'partner', label: 'Partner',  emoji: '💑', ambience: ['romantic', 'quiet'] },
      { value: 'friends', label: 'Friends',  emoji: '👯', tags: ['group-friendly'] },
      { value: 'family',  label: 'Family',   emoji: '👨‍👩‍👧', ambience: ['family'] },
    ],
  },
]

export default function DecisionFlowSheet({ open, onClose, onApply }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const currentStep = STEPS[step]
  const isLastStep = step === STEPS.length - 1

  const advance = (newAnswers) => {
    onApply?.(newAnswers)
    if (!isLastStep) {
      setStep(prev => prev + 1)
    } else {
      // Auto-close after final step
      onClose?.()
      setTimeout(() => { setAnswers({}); setStep(0) }, 300)
    }
  }

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentStep.id]: value }
    setAnswers(newAnswers)
    advance(newAnswers)
  }

  const handleSkip = () => {
    // Advance without recording an answer for this step
    advance(answers)
  }

  const handleReset = () => {
    setAnswers({})
    setStep(0)
    onApply?.({})
  }

  return (
    <BottomSheet
      open={open}
      onClose={() => {
        onClose?.()
        setTimeout(() => { setAnswers({}); setStep(0) }, 300)
      }}
      title="Help me decide"
      initialSnap={0.65}
      aria-label="Help me decide dialog"
    >
      <div className="px-5 py-4 flex flex-col gap-5">
        {/* Step label */}
        <p
          className="text-xs font-dm font-medium text-text-muted text-center uppercase tracking-widest"
          aria-label={`Step ${step + 1} of ${STEPS.length}`}
        >
          Step {step + 1} of {STEPS.length}
        </p>

        {/* Question */}
        <h3 className="font-syne font-semibold text-lg text-text-primary text-center">
          {currentStep.question}
        </h3>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {currentStep.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className="flex items-center gap-4 p-4 card hover:border-primary hover:shadow-card transition-state text-left"
              style={{ minHeight: '64px' }}
            >
              <span className="text-2xl" aria-hidden="true">{opt.emoji}</span>
              <span className="font-dm font-medium text-text-primary">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Footer row: Skip + (Reset at step 3) */}
        <div className="flex items-center justify-between pt-1">
          {isLastStep ? (
            <button
              onClick={handleReset}
              className="text-sm text-text-muted font-dm hover:text-text-secondary transition-state"
              style={{ minHeight: '44px' }}
            >
              Reset
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={handleSkip}
            className="text-sm text-text-muted font-dm hover:text-text-secondary transition-state"
            style={{ minHeight: '44px' }}
          >
            Skip
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
