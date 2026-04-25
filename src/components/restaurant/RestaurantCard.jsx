/**
 * RestaurantCard — used in SearchView (Cluster 1) and RestaurantView (Cluster 4).
 * Fields: name · cuisine · dietary badges · distance · rating · price tier · busyness · Save icon.
 * PreferenceMatchBadge shown when matchData is provided (Cluster 4).
 * Cluster 1 UXR: S1_I004 "suggestions are wrong" — dietary badges must be first-class visible.
 */
import { Star, MapPin, Bookmark, BookmarkCheck } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import BusynessIndicator from './BusynessIndicator'

const DIETARY_LABELS = {
  vegetarian: { label: 'Veg', color: 'bg-green-100 text-green-700' },
  vegan: { label: 'Vegan', color: 'bg-emerald-100 text-emerald-700' },
  halal: { label: 'Halal', color: 'bg-blue-100 text-blue-700' },
  'gluten-free': { label: 'GF', color: 'bg-amber-100 text-amber-700' },
}

const PRICE_LABEL = ['', '$', '$$', '$$$', '$$$$']

export default function RestaurantCard({ place, matchData, onClick, compact = false }) {
  const { isPlaceSaved, savedLists, savePlaceToList } = useUser()
  const saved = isPlaceSaved(place.id)

  const handleSave = (e) => {
    e.stopPropagation()
    if (!saved && savedLists.length > 0) {
      savePlaceToList(place.id, savedLists[0].id)
    }
  }

  // Match badge (Cluster 4)
  const badgeClass = matchData?.matchType === 'strong'
    ? 'bg-primary-light text-primary border-primary/20'
    : matchData?.matchType === 'partial'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : null

  const badgeLabel = matchData?.matchType === 'strong'
    ? 'Great for you'
    : matchData?.matchType === 'partial'
    ? 'Might suit you'
    : null

  // Deprioritise no-match cards visually (Cluster 4)
  const opacityClass = matchData && matchData.matchType === 'none' ? 'opacity-60' : ''

  return (
    <article
      className={`card flex gap-3 p-3 cursor-pointer hover:shadow-card transition-state ${opacityClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`${place.name}, ${place.cuisine}, ${PRICE_LABEL[place.price]}, ${place.distance}km away, rated ${place.rating}`}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0">
        <img
          src={place.photo}
          alt={place.name}
          className="w-20 h-20 rounded-card object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Name + save */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-syne font-semibold text-sm text-text-primary leading-snug">
            {place.name}
          </h3>
          <button
            onClick={handleSave}
            aria-label={saved ? `${place.name} saved` : `Save ${place.name}`}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-raised transition-state -mt-0.5"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            {saved ? (
              <BookmarkCheck size={16} className="text-primary" aria-hidden="true" />
            ) : (
              <Bookmark size={16} className="text-text-muted" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Match badge (Cluster 4) */}
        {badgeLabel && (
          <span className={`self-start text-xs font-medium px-2 py-0.5 rounded-chip border ${badgeClass}`}>
            {badgeLabel}
          </span>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-text-secondary font-dm">{place.cuisine}</span>
          <span className="text-text-muted text-xs">·</span>
          <span className="text-xs text-text-secondary font-dm">{PRICE_LABEL[place.price]}</span>
          <span className="text-text-muted text-xs">·</span>
          <span className="flex items-center gap-0.5 text-xs text-text-secondary font-dm">
            <MapPin size={10} aria-hidden="true" />
            {place.distance}km
          </span>
        </div>

        {/* Rating + dietary badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-0.5 text-xs font-medium text-text-primary">
            <Star size={11} className="text-warning fill-warning" aria-hidden="true" />
            {place.rating}
            <span className="text-text-muted font-normal ml-0.5">({place.reviewCount})</span>
          </span>
          {place.dietary.map((d) => {
            const badge = DIETARY_LABELS[d]
            if (!badge) return null
            return (
              <span
                key={d}
                className={`text-xs px-1.5 py-0.5 rounded-chip font-medium ${badge.color}`}
              >
                {badge.label}
              </span>
            )
          })}
          {!place.openNow && (
            <span className="text-xs text-error font-medium">Closed</span>
          )}
        </div>

        {/* Busyness */}
        {!compact && <BusynessIndicator busyness={place.busyness} />}
      </div>
    </article>
  )
}
