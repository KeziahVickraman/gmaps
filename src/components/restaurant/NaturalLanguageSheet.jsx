/**
 * NaturalLanguageSheet — Variant C only.
 * Bottom sheet with a single text input. Parses free-text into filter signals
 * and calls onApply({ keywords, filterFn }) so the parent can rerank results.
 *
 * Keyword parser rules (per spec):
 *   vegetarian / vegan / halal → dietary match
 *   cheap / affordable / budget → price ≤ 2
 *   quick / fast / 30 min → avgMealDuration ≤ 30
 *   date / romantic → ambience includes romantic
 *   healthy / light → tags includes healthy or light
 *   nearby / close → distance ≤ 1km
 *   friends / group → tags includes group-friendly
 *   unrecognised terms → ignored silently
 */
import { useState, useEffect, useRef } from 'react'
import BottomSheet from '../shared/BottomSheet'

const EXAMPLE_PROMPTS = [
  'healthy and cheap',
  'something quick for lunch',
  'nice place for a date',
]

function parseQuery(input) {
  const lower = input.toLowerCase()
  const keywords = []
  const conditions = []

  if (lower.includes('vegetarian')) {
    keywords.push('vegetarian')
    conditions.push(p => p.dietary.includes('vegetarian'))
  }
  if (lower.includes('vegan')) {
    keywords.push('vegan')
    conditions.push(p => p.dietary.includes('vegan'))
  }
  if (lower.includes('halal')) {
    keywords.push('halal')
    conditions.push(p => p.dietary.includes('halal'))
  }
  if (lower.includes('cheap') || lower.includes('affordable') || lower.includes('budget')) {
    keywords.push('budget-friendly')
    conditions.push(p => p.price <= 2)
  }
  if (lower.includes('quick') || lower.includes('fast') || lower.includes('30 min')) {
    keywords.push('quick')
    conditions.push(p => p.avgMealDuration <= 30)
  }
  if (lower.includes('date') || lower.includes('romantic')) {
    keywords.push('romantic')
    conditions.push(p => p.ambience.includes('romantic'))
  }
  if (lower.includes('healthy')) {
    keywords.push('healthy')
    conditions.push(p => p.tags.includes('healthy'))
  }
  if (lower.includes('light')) {
    keywords.push('light')
    conditions.push(p => p.tags.includes('light'))
  }
  if (lower.includes('nearby') || lower.includes('close')) {
    keywords.push('nearby')
    conditions.push(p => p.distance <= 1)
  }
  if (lower.includes('friends') || lower.includes('group')) {
    keywords.push('group-friendly')
    conditions.push(p => p.tags.includes('group-friendly'))
  }

  return {
    keywords,
    filterFn: conditions.length > 0
      ? (place) => conditions.every(fn => fn(place))
      : () => true,
  }
}

export default function NaturalLanguageSheet({ open, onClose, onApply }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  // Autofocus textarea on open
  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 150)
    }
  }, [open])

  const canSubmit = text.trim().length >= 3

  const handleSubmit = () => {
    if (!canSubmit) return
    const result = parseQuery(text.trim())
    onApply?.(result)
    onClose?.()
    setText('')
  }

  const handleExampleClick = (prompt) => {
    setText(prompt)
    textareaRef.current?.focus()
  }

  const handleClose = () => {
    onClose?.()
    setText('')
  }

  return (
    <BottomSheet
      open={open}
      onClose={handleClose}
      title="Describe what you want"
      initialSnap={0.65}
      aria-label="Natural language restaurant search"
    >
      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="e.g. something light and vegetarian, not too far"
          rows={3}
          className="w-full bg-surface-raised border border-border rounded-card px-4 py-3 text-sm font-dm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary resize-none transition-state"
          aria-label="Describe what kind of restaurant you're looking for"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
          }}
        />

        {/* Example chips */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-text-muted font-dm">Try:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleExampleClick(prompt)}
                className="chip chip-inactive text-xs"
                style={{ minHeight: '36px' }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`btn-primary w-full mt-2 transition-state ${
            !canSubmit ? 'opacity-40 cursor-not-allowed' : ''
          }`}
          aria-disabled={!canSubmit}
          style={{ minHeight: '48px' }}
        >
          Find restaurants
        </button>

        <p className="text-xs text-text-muted font-dm text-center">
          Type at least 3 characters to search
        </p>
      </div>
    </BottomSheet>
  )
}
