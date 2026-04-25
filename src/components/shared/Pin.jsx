/**
 * Pin — map pin component rendered on SVG canvas.
 * Colors: green (full dietary match), amber (partial), grey (none), primary (default).
 * Selected: larger with drop shadow.
 */
export default function Pin({
  x,
  y,
  selected = false,
  matchType = 'none', // 'full' | 'partial' | 'none' | 'default'
  label,
  onClick,
}) {
  const colors = {
    full: '#1A6B4A',
    partial: '#D97706',
    none: '#ABABAB',
    default: '#1A6B4A',
  }

  const fill = colors[matchType] || colors.default
  const size = selected ? 14 : 10
  const labelOffset = size + 6

  return (
    <g
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role={onClick ? 'button' : undefined}
      aria-label={label ? `${label} pin` : 'Map pin'}
    >
      {selected && (
        <circle
          cx={x}
          cy={y}
          r={size + 4}
          fill={fill}
          fillOpacity={0.15}
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={fill}
        stroke="white"
        strokeWidth={selected ? 2.5 : 2}
        style={selected ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' } : undefined}
      />
      <circle
        cx={x}
        cy={y}
        r={size * 0.35}
        fill="white"
      />
      {selected && label && (
        <g>
          <rect
            x={x - label.length * 3.5 - 6}
            y={y + labelOffset}
            width={label.length * 7 + 12}
            height={20}
            rx={4}
            fill="white"
            stroke="#E2E1DE"
            strokeWidth={1}
            style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))' }}
          />
          <text
            x={x}
            y={y + labelOffset + 14}
            textAnchor="middle"
            fontSize={11}
            fontFamily="DM Sans, sans-serif"
            fill="#141414"
            fontWeight="500"
          >
            {label.length > 14 ? label.slice(0, 12) + '…' : label}
          </text>
        </g>
      )}
    </g>
  )
}
