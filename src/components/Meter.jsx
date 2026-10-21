// A value against a daily target. The fill switches to the warning colour, with
// an icon and a label, when the plan falls more than 5% short.
export default function Meter({ label, value, target, unit, i18n }) {
  const { t, num } = i18n
  const ratio = value / target
  const short = ratio < 0.95
  return (
    <div className="meter">
      <div className="meter-head">
        <span className="meter-label">{label}</span>
        <span className="meter-value">
          {num(value)} <small>{unit}</small>
        </span>
      </div>
      <div
        className={`meter-track${short ? ' is-short' : ''}`}
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={Math.round(value)}
      >
        <div className="meter-fill" style={{ width: `${Math.min(100, ratio * 100)}%` }} />
      </div>
      <div className="meter-foot">
        {t('target')} {num(target)} {unit}
        {short && (
          <span className="status-warning">
            <span aria-hidden="true">▲</span> {t('belowTarget')}
          </span>
        )}
      </div>
    </div>
  )
}
