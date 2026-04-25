/**
 * TasteProfilePanel — editable user preference model.
 * Changes persist to PreferenceContext, immediately update badge states.
 * Cluster 4: S1_I004 — "preference is known to the user but invisible to the system."
 */
import { usePreference } from '../../context/PreferenceContext'
import { FilterChipGroup } from '../shared/FilterChip'
import { Info } from 'lucide-react'

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
  { value: 'gluten-free', label: 'Gluten-free' },
]

const CUISINE_OPTIONS = [
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Indian', label: 'Indian' },
  { value: 'Mediterranean', label: 'Mediterranean' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Western', label: 'Western' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Thai', label: 'Thai' },
  { value: 'Vietnamese', label: 'Vietnamese' },
]

const AMBIENCE_OPTIONS = [
  { value: 'casual', label: 'Casual' },
  { value: 'quiet', label: 'Quiet' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'family', label: 'Family' },
]

const PRICE_OPTIONS = [
  { value: [1, 1], label: '$' },
  { value: [1, 2], label: '$–$$' },
  { value: [2, 3], label: '$$–$$$' },
  { value: [3, 4], label: '$$$–$$$$' },
]

function ProfileSection({ title, children }) {
  return (
    <div className="py-4 border-b border-border last:border-0">
      <p className="label-text text-text-muted mb-2 px-5">{title}</p>
      <div className="px-5">{children}</div>
    </div>
  )
}

export default function TasteProfilePanel() {
  const {
    dietary, setDietary,
    cuisines, setCuisines,
    priceRange, setPriceRange,
    ambience, setAmbience,
  } = usePreference()

  const priceKey = PRICE_OPTIONS.find(
    (p) => p.value[0] === priceRange[0] && p.value[1] === priceRange[1]
  )?.label || '$–$$'

  return (
    <div className="flex flex-col">
      {/* Explainer — always visible per §4 spec */}
      <div className="flex items-start gap-2 px-5 py-3 bg-primary-light border-b border-primary/10">
        <Info size={14} className="text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
        <p className="text-xs text-primary font-dm leading-relaxed">
          Your profile influences restaurant rankings. Changes apply instantly.
        </p>
      </div>

      {/* Dietary */}
      <ProfileSection title="Dietary preferences">
        <FilterChipGroup
          options={DIETARY_OPTIONS}
          selected={dietary}
          onChange={setDietary}
          maxVisible={5}
          label="Dietary preferences"
        />
      </ProfileSection>

      {/* Favourite cuisines — up to 5 (Miller's Law) */}
      <ProfileSection title="Favourite cuisines (up to 5)">
        <FilterChipGroup
          options={CUISINE_OPTIONS}
          selected={cuisines}
          onChange={(v) => setCuisines(v.slice(0, 5))}
          maxVisible={5}
          label="Favourite cuisines"
        />
        {cuisines.length >= 5 && (
          <p className="text-xs text-text-muted mt-2 font-dm">Maximum 5 cuisines selected</p>
        )}
      </ProfileSection>

      {/* Price range */}
      <ProfileSection title="Usual price range">
        <div className="flex gap-2" role="group" aria-label="Price range preference">
          {PRICE_OPTIONS.map((opt) => {
            const active = priceRange[0] === opt.value[0] && priceRange[1] === opt.value[1]
            return (
              <button
                key={opt.label}
                onClick={() => setPriceRange(opt.value)}
                role="radio"
                aria-checked={active}
                className={`chip ${active ? 'chip-active' : 'chip-inactive'}`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </ProfileSection>

      {/* Ambience */}
      <ProfileSection title="Preferred ambience">
        <FilterChipGroup
          options={AMBIENCE_OPTIONS}
          selected={ambience}
          onChange={setAmbience}
          maxVisible={5}
          label="Preferred ambience"
        />
      </ProfileSection>
    </div>
  )
}
