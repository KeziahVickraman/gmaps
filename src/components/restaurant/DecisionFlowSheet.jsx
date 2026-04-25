/**
 * DecisionFlowSheet — 3-step bottom sheet, one question per step, max 4 answers (Miller's Law).
 * Re-ranks list in real time as answers are given.
 * Cluster 4: S1_I003 — "stares at it and scrolls excessively… indecision is the symptom."
 * "Help me decide" mode resolves indecision without overwhelming with options (Hick's Law).
 */
import { useState } from 'react'
import { CheckCircle, RotateCcw } from 'lucide-react'
import BottomSheet from '../shared/BottomSheet'

const STEPS = [
  {
    id: 'mood',
    question: 'What are you in the mood for?',
    options: [
      { value: 'light', label: 'Something light', emoji: '🥗', tags: ['light', 'healthy'] },
      { value: 'comfort', label: 'Comfort food', emoji: '🍜', tags: ['comfort'] },
      { value: 'healthy', label: 'Healthy', emoji: '🥦', tags: ['healthy', 'light'] },
      { value: 'surprise', label: 'Surprise me', emoji: '🎲', tags: [] },
    ],
  },
  {
    id: 'time',
    question: 'How long do you have?',
    options: [
      { value: 'quick', label: 'Under 30 min', emoji: '⚡', maxDuration: 30 },
      { value: 'relaxed', label: 'Relaxed meal', emoji: '☕', minDuration: 45 },
      { value: 'any', label: "Doesn't matter", emoji: '🕐', maxDuration: null },
    ],
  },
  {
    id: 'group',
    question: "Who's joining you?",
    options: [
      { value: 'solo', label: 'Just me', emoji: '🙋', tags: ['solo-friendly'] },
      { value: 'partner', label: 'Partner', emoji: '💑', ambience: ['romantic', 'quiet'] },
      { value: 'friends', label: 'Friends', emoji: '👥', tags: ['group-friendly'] },
      { value: 'family', label: 'Family', emoji: '👨‍👩‍👧', ambience: ['family'] },
    ],
  },
]

export default function DecisionFlowSheet({ open, onClose, onApply }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const currentStep = STEPS[step]

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentStep.id]: value }
    setAnswers(newAnswers)

    // Apply reranking after each answer (progressive disclosure of outcome)
    onApply?.(newAnswers)

    if (step < STEPS.length - 1) {
      setStep(step + 1)
    }
    // On final step, sheet stays open so user can reset or close
  }

  const handleReset = () => {
    setAnswers({})
    setStep(0)
    onApply?.({})
  }

  const isComplete = step === STEPS.length - 1 && answers[currentStep.id]

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Help me decide"
      initialSnap={0.6}
      aria-label="Help me decide dialog"
    >
      <div className="px-5 py-4 flex flex-col gap-6">
        {/* Progress dots */}
        <div className="flex gap-2 justify-center" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-state ${
                i < step
                  ? 'bg-primary w-4'
                  : i === step
                  ? 'bg-primary w-6'
                  : 'bg-border w-4'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Question */}
        {!isComplete ? (
          <>
            <h3 className="font-syne font-semibold text-lg text-text-primary text-center">
              {currentStep.question}
            </h3>

            {/* Options — max 4 (Miller's Law strictly applied) */}
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
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle size={40} className="text-primary" aria-hidden="true" />
            <p className="font-syne font-semibold text-text-primary text-center">
              Results updated for you
            </p>
            <p className="text-sm text-text-secondary font-dm text-center">
              The list has been reranked based on your answers.
            </p>
            <button
              onClick={onClose}
              className="btn-primary w-full mt-2"
            >
              See results
            </button>
          </div>
        )}

        {/* Reset — no confirmation needed per §7 */}
        {Object.keys(answers).length > 0 && !isComplete && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-state mx-auto font-dm"
            style={{ minHeight: '44px' }}
          >
            <RotateCcw size={13} aria-hidden="true" />
            Reset answers
          </button>
        )}
      </div>
    </BottomSheet>
  )
}
