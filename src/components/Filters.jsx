import { SlidersHorizontal } from 'lucide-react'

// The settings panel shared by the plan and prices pages: city, supermarkets and
// pricing, plus any page-specific fields passed as children (shown as a second row).
export default function Filters({ data, settings, update, i18n, showStrategy = true, title, children }) {
  const { t } = i18n
  const toggleMerchant = (name) => {
    const set = new Set(settings.merchants)
    if (set.has(name)) set.delete(name)
    else set.add(name)
    // Selecting every chain is the same as no filter.
    update({ merchants: set.size === data.merchants.length ? [] : [...set] })
  }

  return (
    <section className="panel" aria-label={title ?? t('shopping')}>
      {title && (
        <h2 className="panel-title">
          <SlidersHorizontal aria-hidden="true" />
          {title}
        </h2>
      )}
      <div className="fields">
        <label className="field">
          <span className="field-label">{t('city')}</span>
          <select value={settings.city} onChange={(e) => update({ city: e.target.value })}>
            <option value="">{t('allCities')}</option>
            {data.cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="field">
          <legend className="field-label">{t('stores')}</legend>
          <div className="chips">
            <button type="button" className="chip" aria-pressed={settings.merchants.length === 0} onClick={() => update({ merchants: [] })}>
              {t('allStores')}
            </button>
            {data.merchants.map((m) => (
              <button
                key={m.name}
                type="button"
                className="chip"
                aria-pressed={settings.merchants.includes(m.name)}
                onClick={() => toggleMerchant(m.name)}
              >
                {m.name}
              </button>
            ))}
          </div>
        </fieldset>

        {showStrategy && (
          <fieldset className="field">
            <legend className="field-label">{t('pricing')}</legend>
            <div className="segmented">
              {['cheapest', 'typical'].map((s) => (
                <button key={s} type="button" aria-pressed={settings.strategy === s} onClick={() => update({ strategy: s })}>
                  {t(s)}
                </button>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {children && <div className="fields">{children}</div>}
    </section>
  )
}
