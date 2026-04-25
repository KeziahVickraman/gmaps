/**
 * RestaurantDetail — hero image + full info + CTAs.
 * Progressive disclosure: reviews collapsed by default.
 * Cluster 1 + 4.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, MapPin, Clock, Navigation, Bookmark, BookmarkCheck, ChevronDown, ChevronUp } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import BusynessIndicator from './BusynessIndicator'

const PRICE_LABEL = ['', '$', '$$', '$$$', '$$$$']

const DIETARY_LABELS = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  halal: 'Halal',
  'gluten-free': 'Gluten-free',
}

// Mock reviews for detail view
const MOCK_REVIEWS = [
  { id: 'r1', author: 'Sarah L.', rating: 5, text: 'Absolutely loved it! The food was fresh and perfectly spiced. Will definitely return.' },
  { id: 'r2', author: 'Marcus T.', rating: 4, text: 'Great ambience for a quiet dinner. Service was attentive and the menu had good variety.' },
  { id: 'r3', author: 'Priya N.', rating: 4, text: 'One of the best vegetarian spots in the area. The Mediterranean platter was outstanding.' },
]

export default function RestaurantDetail({ place }) {
  const navigate = useNavigate()
  const { isPlaceSaved, savedLists, savePlaceToList } = useUser()
  const [reviewsOpen, setReviewsOpen] = useState(false)
  const saved = isPlaceSaved(place.id)

  const handleSave = () => {
    if (!saved && savedLists.length > 0) {
      savePlaceToList(place.id, savedLists[0].id)
    }
  }

  return (
    <div className="pb-8">
      {/* Hero */}
      <img
        src={place.photo}
        alt={`${place.name} restaurant`}
        className="w-full h-48 object-cover"
      />

      <div className="px-5 pt-4 flex flex-col gap-4">
        {/* Name + dietary badges */}
        <div>
          <h2 className="font-syne font-bold text-xl text-text-primary mb-1">{place.name}</h2>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {place.dietary.map((d) => (
              <span
                key={d}
                className="text-xs px-2 py-0.5 rounded-chip bg-primary-light text-primary font-medium"
              >
                {DIETARY_LABELS[d] || d}
              </span>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-text-secondary font-dm">
          <span className="flex items-center gap-1">
            <Star size={14} className="text-warning fill-warning" aria-hidden="true" />
            <strong className="text-text-primary">{place.rating}</strong>
            <span className="text-text-muted">({place.reviewCount} reviews)</span>
          </span>
          <span>{PRICE_LABEL[place.price]} · {place.cuisine}</span>
          <span className="flex items-center gap-1">
            <MapPin size={13} aria-hidden="true" />
            {place.distance}km
          </span>
          <span className={place.openNow ? 'text-success font-medium' : 'text-error font-medium'}>
            {place.openNow ? 'Open now' : 'Closed'}
          </span>
        </div>

        {/* Busyness */}
        <BusynessIndicator busyness={place.busyness} />

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-text-secondary font-dm">
          <MapPin size={14} className="mt-0.5 flex-shrink-0 text-text-muted" aria-hidden="true" />
          <span>{place.address}</span>
        </div>

        {/* Hours (mock) */}
        <div className="flex items-start gap-2 text-sm text-text-secondary font-dm">
          <Clock size={14} className="mt-0.5 flex-shrink-0 text-text-muted" aria-hidden="true" />
          <div>
            <p>Mon–Fri: 11:00 AM – 10:00 PM</p>
            <p>Sat–Sun: 9:00 AM – 11:00 PM</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => navigate('/navigation')}
            className="btn-primary flex-1"
            aria-label={`Start navigation to ${place.name}`}
          >
            <Navigation size={16} aria-hidden="true" />
            Start Navigation
          </button>
          <button
            onClick={handleSave}
            className="btn-secondary px-4"
            aria-label={saved ? `${place.name} saved to list` : `Save ${place.name} to list`}
          >
            {saved ? (
              <BookmarkCheck size={16} className="text-primary" aria-hidden="true" />
            ) : (
              <Bookmark size={16} aria-hidden="true" />
            )}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Reviews — progressive disclosure (Hick's Law) */}
        <div className="border-t border-border pt-4">
          <button
            onClick={() => setReviewsOpen(!reviewsOpen)}
            className="flex items-center justify-between w-full text-sm font-medium text-text-primary font-dm"
            aria-expanded={reviewsOpen}
            style={{ minHeight: '44px' }}
          >
            Reviews ({place.reviewCount})
            {reviewsOpen ? (
              <ChevronUp size={16} aria-hidden="true" />
            ) : (
              <ChevronDown size={16} aria-hidden="true" />
            )}
          </button>

          {reviewsOpen && (
            <div className="mt-3 flex flex-col gap-4">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary font-dm">{review.author}</span>
                    <span className="flex items-center gap-0.5 text-xs text-text-secondary">
                      <Star size={11} className="text-warning fill-warning" aria-hidden="true" />
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary font-dm leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
