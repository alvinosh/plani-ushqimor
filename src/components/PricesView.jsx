import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { FOODS } from '../data/foods.js'
import { bestOffer, localDeals, promotions } from '../lib/pricing.js'
import Filters from './Filters.jsx'
import Sparkline from './Sparkline.jsx'

const LOCAL_PREVIEW = 8

function Promotions({ data, filters, i18n, today }) {
  const { t, num, money, date, unit } = i18n
  const rows = useMemo(() => promotions(data, filters, today), [data, filters, today])
  return (
    <section>
      <h2>{t('promosTitle')}</h2>
      <p>{t('promosIntro')}</p>
      {!rows.length && (
        <p className="notice">
          <Info aria-hidden="true" /> {t('noPromos')}
        </p>
      )}
      <div className="promo-grid">
        {rows.map(({ item, offer, state, saving }) => (
          <article key={`${item.id}-${offer.merchant}`} className="promo">
            <div className="promo-top">
              <span className={`badge ${state === 'active' ? 'badge-good' : 'badge-accent'}`}>
                {state === 'active' ? t('running') : t('startsOn', { d: date(offer.promo.from) })}
              </span>
              <span className="saving">−{num(saving * 100)}%</span>
            </div>
            <h3>{item.name}</h3>
            <p className="promo-price">
              <strong>{money(offer.promo.price * offer.size)}</strong>{' '}
              <s className="muted">{money(offer.price * offer.size)}</s>
            </p>
            <p className="small">
              {offer.merchant} · {num(offer.promo.price, 2)} {t('perUnit', { u: unit(item.unit) })} ·{' '}
              {t('until', { d: date(offer.promo.to) })}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Categories({ data, history, filters, i18n, today }) {
  const { t, num, unit } = i18n
  const rows = useMemo(() => {
    const byCode = new Map()
    for (const item of data.items) {
      const best = bestOffer(item, filters, today)
      if (!best) continue
      const row = byCode.get(item.cat) ?? { prices: [], best: null }
      row.prices.push(best.price)
      if (!row.best || best.price < row.best.price) row.best = { ...best, item }
      byCode.set(item.cat, row)
    }
    return data.categories
      .filter((c) => byCode.has(c.code))
      .map((c) => {
        const row = byCode.get(c.code)
        const sorted = [...row.prices].sort((a, b) => a - b)
        return { cat: c, ...row, median: sorted[(sorted.length - 1) >> 1] }
      })
  }, [data, filters, today])

  return (
    <section>
      <h2>{t('categoriesTitle')}</h2>
      <div className="table-wrap">
        <table className="table stack">
          <thead>
            <tr>
              <th>{t('colCategory')}</th>
              <th>{t('colCheapest')}</th>
              <th className="num">{t('colMedian')}</th>
              <th className="num">{t('colProducts')}</th>
              <th>{t('colTrend')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ cat, best, median, prices }) => {
              const u = unit(cat.unit)
              const points = history.days.filter((d) => d.min[cat.code] != null).map((d) => ({ date: d.date, value: d.min[cat.code] }))
              return (
                <tr key={cat.code}>
                  <td className="col-main food-name nowrap">{cat.name}</td>
                  <td className="col-wide">
                    <strong className="nowrap">
                      {num(best.price, 2)} {t('perUnit', { u })}
                    </strong>
                    {best.promo && <span className="badge badge-good">{t('promo')}</span>}
                    <span className="product-meta">
                      {best.item.name} · {best.offer.merchant}
                    </span>
                  </td>
                  <td className="col-hide num nowrap">
                    {num(median, 2)} {t('perUnit', { u })}
                  </td>
                  <td className="col-hide num">{prices.length}</td>
                  <td className="col-side">
                    <Sparkline points={points} unit={t('perUnit', { u })} i18n={i18n} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {history.days.length < 2 && <p className="table-note">{t('trendEmpty')}</p>}
    </section>
  )
}

function LocalDeals({ data, filters, i18n }) {
  const { t, num } = i18n
  const [all, setAll] = useState(false)
  const rows = useMemo(() => localDeals(data, filters), [data, filters])
  if (!rows.length) return null
  const shown = all ? rows : rows.slice(0, LOCAL_PREVIEW)
  return (
    <section>
      <h2>{t('localTitle')}</h2>
      <p>{t('localIntro')}</p>
      <div className="table-wrap">
        <table className="table">
          <tbody>
            {shown.map(({ item, local, at, refPrice, refIsChain, saving }, i) => (
              <tr key={`${item.id}-${local.merchant}-${i}`}>
                <td>
                  <span className="product-name">{item.name}</span>
                  <span className="product-meta">
                    {local.merchant} · {t('localAt', { n: local.stores, m: local.totalStores })}:{' '}
                    {at.map((a) => `${a.store} (${a.city})`).join(', ')}
                  </span>
                </td>
                <td className="num nowrap">
                  <strong>
                    {num(local.price, 2)} {t('perUnit', { u: i18n.unit(item.unit) })}
                  </strong>
                  <span className="product-meta">
                    {t(refIsChain ? 'chainPrice' : 'elsewherePrice', { p: num(refPrice, 2) })} ·{' '}
                    <span className="promo-saving">−{num(saving * 100)}%</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > LOCAL_PREVIEW && (
        <button type="button" className="btn btn-outline show-more" onClick={() => setAll((v) => !v)}>
          {all ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
          {all ? t('showLess') : t('showAll', { n: rows.length })}
        </button>
      )}
    </section>
  )
}

function Estimated({ prices, i18n }) {
  const { t, num, pick } = i18n
  const rows = Object.values(prices).filter((p) => p.source === 'estimate')
  if (!rows.length) return null
  return (
    <section>
      <h2>{t('estTitle')}</h2>
      <p>{t('estIntro')}</p>
      <ul className="est-list">
        {rows.map((p) => (
          <li key={p.code}>
            {pick(FOODS[p.code].name)}
            <span className="muted">
              {num(p.unitPrice)} {t('perKgEst')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function PricesView({ data, history, prices, settings, update, i18n, today }) {
  const filters = useMemo(() => ({ city: settings.city, merchants: settings.merchants }), [settings.city, settings.merchants])
  return (
    <div className="prices-page">
      <header className="page-head">
        <h1 className="display">{i18n.t('pricesTitle')}</h1>
        <p className="lede">{i18n.t('pricesIntro')}</p>
      </header>
      <Filters data={data} settings={settings} update={update} i18n={i18n} showStrategy={false} />
      <Promotions data={data} filters={filters} i18n={i18n} today={today} />
      <Categories data={data} history={history} filters={filters} i18n={i18n} today={today} />
      <LocalDeals data={data} filters={filters} i18n={i18n} />
      <Estimated prices={prices} i18n={i18n} />
    </div>
  )
}
