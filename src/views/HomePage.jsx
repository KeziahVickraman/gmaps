import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

const variants = [
  {
    to: '/restaurants/a',
    badge: 'V1',
    title: 'Enhanced Filters',
    description:
      'Improved filter-first discovery with dietary, cuisine, price and sort controls. Baseline condition.',
    footer: 'Variant A',
  },
  {
    to: '/restaurants/b',
    badge: 'V2',
    title: 'Help Me Decide — Categories',
    description:
      'Guided 3-step categorical flow that reranks results in real time based on mood, time, and group size.',
    footer: 'Variant B',
  },
  {
    to: '/restaurants/c',
    badge: 'V3',
    title: 'Help Me Decide — Natural Language',
    description:
      'Free-text input that parses natural language to surface matching restaurants instantly.',
    footer: 'Variant C',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F7F6F3' }}>
      {/* SECTION 1 — Header bar */}
      <header
        className="w-full flex items-center justify-between"
        style={{ backgroundColor: '#1A6B4A', padding: '1.5rem 2rem' }}
      >
        <div className="flex items-center gap-2">
          <MapPin size={20} color="white" />
          <span className="text-white font-semibold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
            Google Maps Redesign
          </span>
        </div>
        <span className="text-white text-sm" style={{ opacity: 0.7, fontFamily: "'DM Sans', sans-serif" }}>
          Food Search — UX Variant Prototypes
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6">
        {/* SECTION 2 — Research Question card */}
        <div
          className="bg-white rounded-xl p-6"
          style={{
            borderLeft: '4px solid #1A6B4A',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <p
            className="text-xs font-medium mb-2 tracking-widest uppercase"
            style={{ color: '#1A6B4A', fontFamily: "'DM Sans', sans-serif" }}
          >
            Research Question
          </p>
          <p className="text-base text-gray-800 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Can users identify a restaurant that aligns with their personal dietary and cuisine
            preferences within 30 seconds?
          </p>
        </div>

        {/* SECTION 3 — Persona card */}
        <div
          className="bg-white rounded-xl p-6"
          style={{
            borderLeft: '4px solid #7C3AED',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <p
            className="text-xs font-medium mb-2 tracking-widest uppercase"
            style={{ color: '#7C3AED', fontFamily: "'DM Sans', sans-serif" }}
          >
            Persona
          </p>
          <p className="text-base text-gray-800 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Busy working adult who needs to find a suitable restaurant quickly but struggles with
            irrelevant results, excessive scrolling, and lack of personalisation in the current
            Google Maps experience.
          </p>
        </div>

        {/* SECTION 4 — Variant cards */}
        <div>
          <p
            className="text-xs font-medium mb-4 tracking-widest uppercase"
            style={{ color: '#6B6B6B', fontFamily: "'DM Sans', sans-serif" }}
          >
            Choose a variant to preview
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {variants.map((v) => (
              <Link
                key={v.to}
                to={v.to}
                className="group bg-white rounded-xl p-5 flex flex-col gap-3 no-underline"
                style={{
                  border: '1.5px solid #E2E1DE',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
                  transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.borderColor = '#1A6B4A'
                  e.currentTarget.style.boxShadow =
                    '0 4px 8px rgba(0,0,0,0.10), 0 8px 20px rgba(0,0,0,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = '#E2E1DE'
                  e.currentTarget.style.boxShadow =
                    '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)'
                }}
              >
                <span
                  className="self-start text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: '#E8F5EE',
                    color: '#1A6B4A',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {v.badge}
                </span>
                <p
                  className="text-base font-semibold text-gray-900"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {v.title}
                </p>
                <p
                  className="text-sm text-gray-600 leading-relaxed flex-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {v.description}
                </p>
                <p
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ color: '#ABABAB', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {v.footer}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* SECTION 5 — Footer */}
      <footer className="w-full py-6 text-center">
        <p
          className="text-sm"
          style={{ color: '#ABABAB', fontFamily: "'DM Sans', sans-serif" }}
        >
          SMU UXR Study · Google Maps Redesign · 2025
        </p>
      </footer>
    </div>
  )
}
