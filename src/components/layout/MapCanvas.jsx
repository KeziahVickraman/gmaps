/**
 * MapCanvas — SVG mock map. Renders pins from MapContext.
 * No real tiles. Custom SVG roads/districts for visual fidelity.
 * Pin colour: green (full dietary match) / amber (partial) / grey (none) / primary (default).
 * Cluster: all views use the map canvas as the persistent right panel.
 */
import { useMap } from '../../context/MapContext'
import Pin from '../shared/Pin'

// Mock Singapore road network as SVG paths
const MOCK_ROADS = [
  // Main expressways (thick)
  { d: 'M 50 300 Q 200 280 350 260 Q 500 240 650 200', stroke: '#D6D4CF', width: 6 },
  { d: 'M 100 100 Q 200 150 300 200 Q 350 230 400 300', stroke: '#D6D4CF', width: 6 },
  { d: 'M 600 50 Q 580 150 560 250 Q 540 350 500 450', stroke: '#D6D4CF', width: 6 },
  // Secondary roads (medium)
  { d: 'M 150 200 Q 250 210 350 220 Q 420 230 480 260', stroke: '#E2E1DE', width: 3 },
  { d: 'M 200 350 Q 280 330 360 310 Q 440 290 520 300', stroke: '#E2E1DE', width: 3 },
  { d: 'M 300 100 Q 310 180 320 260 Q 330 320 340 400', stroke: '#E2E1DE', width: 3 },
  { d: 'M 450 150 Q 460 230 470 310 Q 480 370 490 430', stroke: '#E2E1DE', width: 3 },
  // Local streets (thin)
  { d: 'M 180 140 Q 220 160 260 180', stroke: '#EFEFED', width: 1.5 },
  { d: 'M 380 180 Q 400 220 420 260', stroke: '#EFEFED', width: 1.5 },
  { d: 'M 250 280 Q 300 290 350 300', stroke: '#EFEFED', width: 1.5 },
  { d: 'M 420 320 Q 460 340 500 360', stroke: '#EFEFED', width: 1.5 },
  { d: 'M 150 380 Q 200 370 250 360', stroke: '#EFEFED', width: 1.5 },
  { d: 'M 540 200 Q 560 240 580 280', stroke: '#EFEFED', width: 1.5 },
]

// Mock parks / water features
const MOCK_AREAS = [
  // Park
  { type: 'rect', x: 50, y: 50, w: 80, h: 60, fill: '#D4E8D4', rx: 6 },
  // Water
  { type: 'ellipse', cx: 560, cy: 380, rx: 60, ry: 35, fill: '#C8DFF0' },
  // Another park
  { type: 'rect', x: 380, y: 350, w: 60, h: 50, fill: '#D4E8D4', rx: 4 },
]

// Mock district labels
const MOCK_LABELS = [
  { x: 160, y: 95, text: 'Orchard' },
  { x: 290, y: 340, text: 'City' },
  { x: 480, y: 195, text: 'Kallang' },
  { x: 70, y: 310, text: 'Queenstown' },
  { x: 530, y: 365, text: 'Marina Bay' },
]

// Map lat/lng to SVG coordinates (mock projection for Singapore area)
function latLngToSVG(lat, lng, viewW = 700, viewH = 500) {
  const latMin = 1.25, latMax = 1.35
  const lngMin = 103.79, lngMax = 103.92
  const x = ((lng - lngMin) / (lngMax - lngMin)) * viewW
  const y = viewH - ((lat - latMin) / (latMax - latMin)) * viewH
  return { x: Math.max(20, Math.min(viewW - 20, x)), y: Math.max(20, Math.min(viewH - 20, y)) }
}

export default function MapCanvas({ className = '' }) {
  const { mapPins, activePlace, setActivePlace } = useMap()

  const viewW = 700
  const viewH = 500

  // User location pin (mock Singapore center)
  const userPos = latLngToSVG(1.2966, 103.8520, viewW, viewH)

  return (
    <div
      className={`relative bg-[#F0EFE9] overflow-hidden ${className}`}
      role="img"
      aria-label="Mock map of Singapore with restaurant pins"
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0"
      >
        {/* Background */}
        <rect width={viewW} height={viewH} fill="#F0EFE9" />

        {/* Parks & water */}
        {MOCK_AREAS.map((area, i) =>
          area.type === 'rect' ? (
            <rect key={i} x={area.x} y={area.y} width={area.w} height={area.h} fill={area.fill} rx={area.rx} />
          ) : (
            <ellipse key={i} cx={area.cx} cy={area.cy} rx={area.rx} ry={area.ry} fill={area.fill} />
          )
        )}

        {/* Roads */}
        {MOCK_ROADS.map((road, i) => (
          <path
            key={i}
            d={road.d}
            stroke={road.stroke}
            strokeWidth={road.width}
            fill="none"
            strokeLinecap="round"
          />
        ))}

        {/* District labels */}
        {MOCK_LABELS.map((lbl, i) => (
          <text
            key={i}
            x={lbl.x}
            y={lbl.y}
            fontSize={10}
            fontFamily="DM Sans, sans-serif"
            fill="#ABABAB"
            textAnchor="middle"
            fontWeight="500"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            {lbl.text.toUpperCase()}
          </text>
        ))}

        {/* Place pins */}
        {mapPins.map((place) => {
          const pos = latLngToSVG(place.lat, place.lng, viewW, viewH)
          const isSelected = activePlace?.id === place.id
          const matchType = place._match?.matchType || 'default'
          return (
            <Pin
              key={place.id}
              x={pos.x}
              y={pos.y}
              selected={isSelected}
              matchType={matchType}
              label={place.name}
              onClick={() => setActivePlace(isSelected ? null : place)}
            />
          )
        })}

        {/* User location */}
        <g aria-label="Your location">
          <circle cx={userPos.x} cy={userPos.y} r={14} fill="#1A6B4A" fillOpacity={0.12} />
          <circle cx={userPos.x} cy={userPos.y} r={7} fill="#1A6B4A" stroke="white" strokeWidth={2} />
          <circle cx={userPos.x} cy={userPos.y} r={3} fill="white" />
        </g>
      </svg>

      {/* Heading-up badge — Cluster 2 */}
      <div className="absolute top-3 right-3 pointer-events-none">
        <div className="bg-surface/90 backdrop-blur-sm rounded-card px-2.5 py-1 text-xs font-dm font-medium text-text-secondary shadow-card border border-border">
          Mock Map · Singapore
        </div>
      </div>
    </div>
  )
}
