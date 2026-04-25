/**
 * RestaurantFilters (FilterPanel) — Cluster 1 SearchView left panel.
 * Sections: Dietary · Cuisine · Price · Ambience · Distance · Open Now
 * Hick's Law: max 5 cuisine options visible, "+ more" expands.
 * Filter state visually persistent — always visible.
 */
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useFilter } from '../../context/FilterContext'
import { FilterChipGroup, FilterChip } from '../shared/FilterChip'

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
  { value: 'gluten-free', label: 'Gluten-free' },
]

const CUISINE_OPTIONS = [
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Indian', label: 'Indian' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Mediterranean', label: 'Mediterranean' },
  { value: 'Western', label: 'Western' },
  { value: 'Malay', label: 'Malay' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Thai', label: 'Thai' },
  { value: 'Vietnamese', label: 'Vietnamese' },
  { value: 'Singaporean', label: 'Singaporean' },
]

const AMBIENCE_OPTIONS = [
  { value: 'casual', label: 'Casual' },
  { value: 'quiet', label: 'Quiet' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'family', label: 'Family' },
]

const PRICE_OPTIONS = [
  { value: 1, label: '$' },
  { value: 2, label: '$$' },
  { value: 3, label: '$$$' },
  { value: 4, label: '$$$$' },
]

function FilterSection({ title, children }) {
  return (
    <div className="py-3 border-b border-border last:border-0">
      <p className="label-text text-text-muted mb-2 px-4">{title}</p>
      <div className="px-4">{children}</div>
    </div>
  )
}

export default function RestaurantFilters() {
  const {
    dietary, setDietary,
    cuisine, setCuisine,
    price, setPrice,
    ambience, setAmbience,
    distance, setDistance,
    openNow, setOpenNow,
    clearAll, activeCount,
  } = useFilter()

  const togglePrice = (val) => {
    setPrice(price.includes(val) ? price.filter((v) => v !== val) : [...price, val])
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-text-secondary" aria-hidden="true" />
          <span className="font-dm font-medium text-text-primary text-sm">Filters</span>
          {activeCount > 0 && (
            <span
              className="bg-primary text-white text-xs rounded-chip px-1.5 py-0.5 font-medium"
              aria-label={`${activeCount} active filters`}
            >
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-error transition-state font-dm"
            aria-label="Clear all filters"
            style={{ minHeight: '44px' }}
          >
            <X size={14} aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>

      {/* Dietary — first-class per Cluster 1 spec */}
      <FilterSection title="Dietary">
        <FilterChipGroup
          options={DIETARY_OPTIONS}
          selected={dietary}
          onChange={setDietary}
          maxVisible={5}
          label="Dietary restrictions"
        />
      </FilterSection>

      {/* Cuisine — max 5 visible (Hick's Law) */}
      <FilterSection title="Cuisine">
        <FilterChipGroup
          options={CUISINE_OPTIONS}
          selected={cuisine}
          onChange={setCuisine}
          maxVisible={5}
          label="Cuisine type"
        />
      </FilterSection>

      {/* Price — segmented control */}
      <FilterSection title="Price">
        <div className="flex gap-2" role="group" aria-label="Price range">
          {PRICE_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={price.includes(opt.value)}
              onChange={() => togglePrice(opt.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Ambience */}
      <FilterSection title="Ambience">
        <FilterChipGroup
          options={AMBIENCE_OPTIONS}
          selected={ambience}
          onChange={setAmbience}
          maxVisible={5}
          label="Ambience"
        />
      </FilterSection>

      {/* Distance */}
      <FilterSection title="Distance">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            aria-label={`Maximum distance: ${distance}km`}
            className="flex-1 accent-primary"
            style={{ minHeight: '44px' }}
          />
          <span className="text-sm font-dm text-text-secondary w-12 text-right">
            {distance}km
          </span>
        </div>
      </FilterSection>

      {/* Open Now */}
      <FilterSection title="Availability">
        <label className="flex items-center gap-3 cursor-pointer" style={{ minHeight: '44px' }}>
          <div className="relative">
            <input
              type="checkbox"
              checked={openNow}
              onChange={(e) => setOpenNow(e.target.checked)}
              className="sr-only"
              aria-label="Open now only"
            />
            <div
              className={`w-10 h-5 rounded-full transition-state ${openNow ? 'bg-primary' : 'bg-border'}`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-state ${
                  openNow ? 'left-5' : 'left-0.5'
                }`}
              />
            </div>
          </div>
          <span className="text-sm font-dm text-text-primary">Open now</span>
        </label>
      </FilterSection>
    </div>
  )
}
