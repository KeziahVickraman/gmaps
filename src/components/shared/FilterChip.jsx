/**
 * FilterChip — multiselect chip group using role="checkbox" + aria-checked per §9 WCAG requirements.
 * Hick's Law: max 5 visible, rest behind "+ more"
 */
import { useState } from 'react'
import { Check } from 'lucide-react'

export function FilterChip({ label, active, onChange, icon: Icon }) {
  return (
    <button
      role="checkbox"
      aria-checked={active}
      onClick={() => onChange(!active)}
      className={`chip transition-state ${active ? 'chip-active' : 'chip-inactive'}`}
    >
      {Icon && <Icon size={14} aria-hidden="true" />}
      <span>{label}</span>
      {active && <Check size={12} aria-hidden="true" className="ml-0.5" />}
    </button>
  )
}

export function FilterChipGroup({
  options,
  selected,
  onChange,
  maxVisible = 5,
  label,
}) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? options : options.slice(0, maxVisible)
  const hasMore = options.length > maxVisible

  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div role="group" aria-label={label}>
      <div className="flex flex-wrap gap-2">
        {visible.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={selected.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            icon={opt.icon}
          />
        ))}
        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="chip chip-inactive text-text-muted"
            aria-label={`Show ${options.length - maxVisible} more ${label} options`}
          >
            +{options.length - maxVisible} more
          </button>
        )}
        {hasMore && expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="chip chip-inactive text-text-muted"
            aria-label="Show fewer options"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  )
}
