import { useState } from 'react'

const W = 112
const H = 32
const PAD = 5

// Price trend: a muted line with the latest point in the accent colour.
// Hovering or focusing shows the nearest day's value.
export default function Sparkline({ points, i18n, unit }) {
  const [hover, setHover] = useState(null)
  if (points.length < 2) return <span className="muted">–</span>

  const values = points.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const x = (i) => PAD + (i * (W - 2 * PAD)) / (points.length - 1)
  const y = (v) => (max === min ? H / 2 : H - PAD - ((v - min) * (H - 2 * PAD)) / (max - min))
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join('')
  const last = points.length - 1
  const shown = hover ?? last

  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    const rel = ((e.clientX - box.left) / box.width) * W
    setHover(Math.max(0, Math.min(last, Math.round(((rel - PAD) / (W - 2 * PAD)) * last))))
  }
  const first = points[0]
  const summary = `${i18n.date(first.date)}: ${i18n.num(first.value)} → ${i18n.date(points[last].date)}: ${i18n.num(points[last].value)} ${unit}`

  return (
    <span className="spark">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        tabIndex={0}
        role="img"
        aria-label={summary}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onFocus={() => setHover(last)}
        onBlur={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setHover((h) => Math.max(0, (h ?? last) - 1))
          if (e.key === 'ArrowRight') setHover((h) => Math.min(last, (h ?? last) + 1))
        }}
      >
        {hover != null && <line className="spark-cross" x1={x(hover)} x2={x(hover)} y1={0} y2={H} />}
        <path className="spark-line" d={path} />
        <circle className="spark-dot" cx={x(shown)} cy={y(points[shown].value)} r={4} />
      </svg>
      {hover != null && (
        <span className="spark-tip" role="status">
          <strong>
            {i18n.num(points[hover].value)} {unit}
          </strong>{' '}
          <span>{i18n.date(points[hover].date)}</span>
        </span>
      )}
    </span>
  )
}
