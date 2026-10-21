// The city / supermarket / pricing row shared by the plan and prices pages.
export default function Filters({ data, settings, update, i18n, showStrategy = true, children }) {
  const { t } = i18n
  const toggleMerchant = (name) => {
    const set = new Set(settings.merchants)
    if (set.has(name)) set.delete(name)
    else set.add(name)
    // Selecting every chain is the same as no filter.
    update({ merchants: set.size === data.merchants.length ? [] : [...set] })
  }

  return (
    <div className="filters" role="group">
      <label className="field">
        <span>{t('city')}</span>
        <select value={settings.city} onChange={(e) => update({ city: e.target.value })}>
          <option value="">{t('allCities')}</option>
          {data.cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="field chips">
        <legend>{t('stores')}</legend>
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
      </fieldset>

      {showStrategy && (
        <fieldset className="field">
          <legend>{t('pricing')}</legend>
          <div className="segmented">
            {['cheapest', 'typical'].map((s) => (
              <button key={s} type="button" aria-pressed={settings.strategy === s} onClick={() => update({ strategy: s })}>
                {t(s)}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {children}
    </div>
  )
}
