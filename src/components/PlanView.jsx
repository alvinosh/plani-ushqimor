import { useMemo, useState } from 'react'
import { FOODS } from '../data/foods.js'
import { buildPlan, ingredientTotals, shoppingList } from '../lib/planner.js'
import { localDate } from '../lib/pricing.js'
import Filters from './Filters.jsx'
import Meter from './Meter.jsx'

// Groups the month's days into Monday-to-Sunday weeks.
function weeksOf(days) {
  const weeks = []
  for (const day of days) {
    if (!weeks.length || day.date.getDay() === 1) weeks.push([])
    weeks[weeks.length - 1].push(day)
  }
  return weeks
}

const capitalise = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function packLabel(size, unit, i18n) {
  if (unit === '10 vezë') return size === 1 ? i18n.unit(unit) : `${i18n.num(size * 10)} ${i18n.lang === 'en' ? 'eggs' : 'vezë'}`
  if (size < 1 && unit === 'kg') return `${i18n.num(size * 1000)} g`
  if (size < 1 && unit === 'l') return `${i18n.num(size * 1000)} ml`
  return `${i18n.num(size, 2)} ${unit}`
}

function quantityLabel(row, i18n) {
  if (row.packs != null) return `${row.packs} × ${packLabel(row.packSize, row.unit, i18n)}`
  return `${i18n.num(row.qty, 1)} ${i18n.unit(row.unit)}`
}

function DayCard({ day, isToday, i18n }) {
  const { t, num, money, date, pick } = i18n
  return (
    <article className={`day${isToday ? ' is-today' : ''}`}>
      <header className="day-head">
        <h4>{capitalise(date(day.date, { weekday: 'long', day: 'numeric', month: 'short' }))}</h4>
        {isToday && <span className="badge accent">{t('today')}</span>}
      </header>
      <ul className="meals">
        {day.meals.map(({ slot, recipe }, i) => (
          <li key={i}>
            <details>
              <summary>
                <span className="slot">{t(`slot_${slot}`)}</span>
                <span className="meal-name">{pick(recipe.name)}</span>
              </summary>
              <ul className="ingredients">
                {Object.entries(recipe.ing).map(([code, g]) => (
                  <li key={code}>
                    <span aria-hidden="true">{FOODS[code].icon}</span> {pick(FOODS[code].name)}
                    <span className="grams">{num(Math.round((g * day.scale) / 5) * 5)} g</span>
                  </li>
                ))}
              </ul>
              {recipe.steps && <p className="steps">{pick(recipe.steps)}</p>}
            </details>
          </li>
        ))}
      </ul>
      <footer className="day-foot">
        <span>{num(day.totals.kcal)} kcal</span>
        <span>{num(day.totals.p)} g P</span>
        <span>{money(day.cost)}</span>
      </footer>
    </article>
  )
}

function Menu({ weeks, people, i18n, today }) {
  const { t, date } = i18n
  return (
    <div className="menu">
      <p className="muted">{t('perPersonNote', { n: people })}</p>
      {weeks.map((week, w) => (
        <section key={w} className="week">
          <h3>
            {t('weekN', { n: w + 1 })}{' '}
            <span className="muted">
              {date(week[0].date)} – {date(week[week.length - 1].date)}
            </span>
          </h3>
          <div className="days">
            {week.map((day) => (
              <DayCard key={+day.date} day={day} isToday={localDate(day.date) === today} i18n={i18n} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function ShoppingList({ weeks, people, prices, i18n }) {
  const { t, money, num, date, pick, unit } = i18n
  const [week, setWeek] = useState(-1)
  const [copied, setCopied] = useState(false)
  const days = useMemo(() => weeks[week] ?? weeks.flat(), [weeks, week])
  const list = useMemo(() => shoppingList(ingredientTotals(days, people), prices), [days, people, prices])

  const copy = async () => {
    const lines = list.rows.map((r) => {
      const where = r.price.source === 'official' ? ` (${r.price.offer.merchant})` : ''
      return `• ${pick(r.food.name)}: ${quantityLabel(r, i18n)}${where} ≈ ${money(r.cost)}`
    })
    lines.push(`${t('total')}: ${money(list.total)}`)
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked; nothing else to do.
    }
  }

  return (
    <div className="shopping">
      <div className="toolbar">
        <div className="segmented" role="group">
          <button type="button" aria-pressed={week < 0} onClick={() => setWeek(-1)}>
            {t('wholeMonth')}
          </button>
          {weeks.map((_, i) => (
            <button key={i} type="button" aria-pressed={week === i} onClick={() => setWeek(i)}>
              {t('weekN', { n: i + 1 })}
            </button>
          ))}
        </div>
        <button type="button" className="button" onClick={copy}>
          {copied ? t('copied') : t('copyList')}
        </button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>{t('food')}</th>
              <th>{t('quantity')}</th>
              <th>{t('product')}</th>
              <th className="num">{t('cost')}</th>
            </tr>
          </thead>
          <tbody>
            {list.rows.map((r) => {
              const p = r.price
              return (
                <tr key={r.code}>
                  <td>
                    <span aria-hidden="true">{r.food.icon}</span> {pick(r.food.name)}
                  </td>
                  <td className="nowrap">{quantityLabel(r, i18n)}</td>
                  <td>
                    {p.source === 'official' ? (
                      <>
                        <span className="product-name">{p.item.name}</span>
                        <span className="product-meta">
                          {p.offer.merchant} · {num(p.unitPrice, 2)} {t('perUnit', { u: unit(p.item.unit) })}
                          {p.promo && <span className="badge good">{t('promoUntil', { d: date(p.offer.promo.to) })}</span>}
                        </span>
                        {p.upcoming && (
                          <span className="product-hint">
                            {t('upcoming', {
                              d: date(p.upcoming.offer.promo.from),
                              p: `${num(p.upcoming.offer.promo.price, 2)} ${t('perUnit', { u: unit(p.upcoming.item.unit) })}`,
                              m: p.upcoming.offer.merchant,
                            })}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="product-meta" title={t('estimateTip')}>
                        <span className="badge muted-badge">{t('estimate')}</span> ≈ {num(p.unitPrice)} lekë/kg
                      </span>
                    )}
                  </td>
                  <td className="num">{money(r.cost)}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={3}>
                {t('total')}
                <span className="muted"> · {t('estimatedShare', { x: money(list.estimated) })}</span>
              </th>
              <th className="num">{money(list.total)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="muted small">{t('shopNote')}</p>
    </div>
  )
}

function Guide({ profile, i18n }) {
  const { t, pick } = i18n
  return (
    <div className="guide">
      <h3>{t('guideTitle')}</h3>
      <ul>
        {pick(profile.guide).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="callout">{t('disclaimer')}</p>
    </div>
  )
}

export default function PlanView({ profile, data, prices, settings, update, i18n, today }) {
  const { t, money, num, date, pick } = i18n
  const [monthOffset, setMonthOffset] = useState(0)
  const [variant, setVariant] = useState(0)
  const [tab, setTab] = useState('menu')

  const [ty, tm] = today.split('-').map(Number)
  const start = new Date(ty, tm - 1 + monthOffset, 1)
  const year = start.getFullYear()
  const month = start.getMonth()

  const plan = useMemo(() => buildPlan({ profile, prices, year, month, variant }), [profile, prices, year, month, variant])
  const weeks = useMemo(() => weeksOf(plan.days), [plan])
  const monthList = useMemo(
    () => shoppingList(ingredientTotals(plan.days, settings.people), prices),
    [plan, settings.people, prices],
  )

  return (
    <section className="plan">
      <a className="back" href="#/">
        {t('back')}
      </a>
      <header className="plan-head">
        <span className="profile-icon large" aria-hidden="true">
          {profile.icon}
        </span>
        <div>
          <h1>{pick(profile.name)}</h1>
          <p className="muted">{pick(profile.who)}</p>
        </div>
      </header>

      <Filters data={data} settings={settings} update={update} i18n={i18n}>
        <label className="field">
          <span>{t('people')}</span>
          <span className="stepper">
            <button type="button" aria-label="−" onClick={() => update({ people: Math.max(1, settings.people - 1) })}>
              −
            </button>
            <output>{settings.people}</output>
            <button type="button" aria-label="+" onClick={() => update({ people: Math.min(12, settings.people + 1) })}>
              +
            </button>
          </span>
        </label>
        <label className="field">
          <span>{t('month')}</span>
          <select value={monthOffset} onChange={(e) => setMonthOffset(Number(e.target.value))}>
            {[0, 1].map((o) => (
              <option key={o} value={o}>
                {date(new Date(ty, tm - 1 + o, 1), { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
        </label>
        <div className="field actions">
          <button type="button" className="button" onClick={() => setVariant((v) => v + 1)}>
            ↻ {t('shuffle')}
          </button>
          <button type="button" className="button" onClick={() => window.print()}>
            {t('print')}
          </button>
        </div>
      </Filters>

      <div className="kpis">
        <div className="tile hero">
          <span className="tile-label">{t('monthlyCost')}</span>
          <span className="tile-value">{money(monthList.total)}</span>
          <span className="tile-sub">
            {settings.people === 1 ? t('forOne') : t('forPeople', { n: settings.people })} ·{' '}
            {t('estimatedShare', { x: money(monthList.estimated) })}
          </span>
        </div>
        <div className="tile">
          <span className="tile-label">{t('perDay')}</span>
          <span className="tile-value">{money(plan.avg.cost)}</span>
          <span className="tile-sub">{t('perDayNote')}</span>
        </div>
        <div className="tile">
          <span className="tile-label">{t('energy')}</span>
          <span className="tile-value">
            {num(plan.avg.kcal)} <small>kcal</small>
          </span>
          <span className="tile-sub">
            {t('target')} {num(profile.kcal)} kcal · {t('avgDay')}
          </span>
        </div>
        <div className="tile meters">
          <Meter label={t('protein')} value={plan.avg.p} target={profile.min.p} unit="g" i18n={i18n} />
          <Meter label={t('fibre')} value={plan.avg.fib} target={profile.min.fib} unit="g" i18n={i18n} />
          <Meter label={t('calcium')} value={plan.avg.ca} target={profile.min.ca} unit="mg" i18n={i18n} />
        </div>
      </div>

      <div className="tabs" role="tablist">
        {[
          ['menu', t('tabMenu')],
          ['shop', t('tabShop')],
          ['guide', t('tabGuide')],
        ].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'menu' && <Menu weeks={weeks} people={settings.people} i18n={i18n} today={today} />}
      {tab === 'shop' && <ShoppingList weeks={weeks} people={settings.people} prices={prices} i18n={i18n} />}
      {tab === 'guide' && <Guide profile={profile} i18n={i18n} />}
    </section>
  )
}
