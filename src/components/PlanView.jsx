import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  CookingPot,
  Copy,
  Flame,
  Info,
  Minus,
  Plus,
  Printer,
  Refrigerator,
  ShoppingBasket,
  Shuffle,
  Snowflake,
  Tag,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import { FOODS } from '../data/foods.js'
import { capitalise } from '../lib/i18n.js'
import { buildPlan, COOKING, ingredientTotals, shoppingList } from '../lib/planner.js'
import { localDate } from '../lib/pricing.js'
import CookPlan from './CookPlan.jsx'
import Filters from './Filters.jsx'
import Meter from './Meter.jsx'
import { PROFILE_ICONS } from './profileIcons.js'

// Groups the month's days into Monday-to-Sunday weeks.
function weeksOf(days) {
  const weeks = []
  for (const day of days) {
    if (!weeks.length || day.date.getDay() === 1) weeks.push([])
    weeks[weeks.length - 1].push(day)
  }
  return weeks
}

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

const longDate = (i18n, d) => i18n.date(d, { weekday: 'long', day: 'numeric', month: 'short' })

function Meal({ meal, i18n }) {
  const { t, num, pick } = i18n
  const { slot, recipe, leftover, ahead, servings } = meal
  const portions = 1 + ahead.length
  return (
    <li>
      <details>
        <summary>
          <span className="slot">{t(`slot_${slot}`)}</span>
          <span className="meal-name">{pick(recipe.name)}</span>
          {(leftover || portions > 1) && (
            <span className="meal-tags">
              {portions > 1 && (
                <span className="tag tag-cook">
                  <CookingPot aria-hidden="true" />
                  {t('tagCook', { n: portions })}
                </span>
              )}
              {leftover && (
                <span className="tag tag-cold">
                  {leftover.frozen ? <Snowflake aria-hidden="true" /> : <Refrigerator aria-hidden="true" />}
                  {t(leftover.frozen ? 'tagFreezer' : 'tagFridge')}
                </span>
              )}
            </span>
          )}
          <ChevronDown className="chev" aria-hidden="true" />
        </summary>
        <div className="meal-body">
          {leftover ? (
            <p className="steps">
              {t('cookedOn', { d: longDate(i18n, leftover.date) })} {leftover.frozen && t('thawNote')} {t('reheat')}
            </p>
          ) : (
            <>
              {portions > 1 && <p className="portions-note">{t('portionsFor', { n: portions })}</p>}
              <ul className="ingredients">
                {Object.entries(recipe.ing).map(([code, g]) => (
                  <li key={code}>
                    {pick(FOODS[code].name)}
                    <span className="grams">{num(Math.round((g * servings) / 5) * 5)} g</span>
                  </li>
                ))}
              </ul>
              {recipe.steps && <p className="steps">{pick(recipe.steps)}</p>}
              {ahead.length > 0 ? (
                <ul className="storage">
                  {ahead.map((a) => (
                    <li key={+a.date}>
                      {a.frozen ? <Snowflake aria-hidden="true" /> : <Refrigerator aria-hidden="true" />}
                      {t(a.frozen ? 'freezeFor' : 'keepFor', { when: `${t(`slot_${a.slot}`)}, ${longDate(i18n, a.date)}` })}
                    </li>
                  ))}
                </ul>
              ) : (
                recipe.keeps > 0 && (
                  <ul className="storage">
                    <li>
                      <Refrigerator aria-hidden="true" />
                      {recipe.keeps === 1 ? t('keeps1') : t('keepsN', { n: recipe.keeps })}
                      {recipe.freezes && `, ${t('freezes')}`}
                    </li>
                  </ul>
                )
              )}
            </>
          )}
        </div>
      </details>
    </li>
  )
}

function DayCard({ day, isToday, i18n }) {
  const { t, num, money, date, pick } = i18n
  return (
    <article className={`day${isToday ? ' is-today' : ''}`} id={isToday ? 'today' : undefined}>
      <header className="day-head">
        <span className="day-num">{day.date.getDate()}</span>
        <span>
          <span className="day-name">{capitalise(date(day.date, { weekday: 'long' }))}</span>
          <span className="day-month">{date(day.date, { month: 'long' })}</span>
        </span>
        {isToday && <span className="badge badge-today">{t('today')}</span>}
      </header>
      {day.thaw.map((meal) => (
        <p key={meal.recipe.id} className="thaw">
          <Snowflake aria-hidden="true" />
          <span>{t('thawReminder', { r: pick(meal.recipe.name) })}</span>
        </p>
      ))}
      <ul className="meals">
        {day.meals.map((meal, i) => (
          <Meal key={i} meal={meal} i18n={i18n} />
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
  const hasToday = weeks.some((week) => week.some((day) => localDate(day.date) === today))
  return (
    <div className="menu">
      <div className="menu-bar">
        <p>{t('perPersonNote', { n: people })}</p>
        {hasToday && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => document.getElementById('today')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          >
            <CalendarDays aria-hidden="true" />
            {t('jumpToday')}
          </button>
        )}
      </div>
      {weeks.map((week, w) => (
        <section key={w} className="week">
          <header className="week-head">
            <h3>{t('weekN', { n: w + 1 })}</h3>
            <span>
              {date(week[0].date)} – {date(week[week.length - 1].date)}
            </span>
          </header>
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
        <button type="button" className="btn btn-outline" onClick={copy}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? t('copied') : t('copyList')}
        </button>
      </div>

      <div className="table-wrap">
        <table className="table stack">
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
                  <td className="col-main food-name">{pick(r.food.name)}</td>
                  <td className="col-sub nowrap">{quantityLabel(r, i18n)}</td>
                  <td className="col-wide">
                    {p.source === 'official' ? (
                      <>
                        <span className="product-name">{p.item.name}</span>
                        <span className="product-meta">
                          {p.offer.merchant} · {num(p.unitPrice, 2)} {t('perUnit', { u: unit(p.item.unit) })}
                          {p.promo && <span className="badge badge-good">{t('promoUntil', { d: date(p.offer.promo.to) })}</span>}
                        </span>
                        {p.upcoming && (
                          <span className="product-hint">
                            <Tag aria-hidden="true" />
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
                        <span className="badge badge-muted">{t('estimate')}</span> ≈ {num(p.unitPrice)} lekë/kg
                      </span>
                    )}
                  </td>
                  <td className="col-side num nowrap">{money(r.cost)}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <th className="col-main" colSpan={3}>
                {t('total')}
                <span className="muted"> · {t('estimatedShare', { x: money(list.estimated) })}</span>
              </th>
              <th className="col-side num nowrap">{money(list.total)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="table-note">{t('shopNote')}</p>
    </div>
  )
}

function Guide({ profile, i18n }) {
  const { t, pick } = i18n
  return (
    <div className="guide">
      <div>
        <h3>{t('guideTitle')}</h3>
        <ul className="checklist">
          {pick(profile.guide).map((line) => (
            <li key={line}>
              <Check aria-hidden="true" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="callout">
        <TriangleAlert aria-hidden="true" />
        <span>{t('disclaimer')}</span>
      </p>
    </div>
  )
}

export default function PlanView({ profile, data, prices, settings, update, i18n, today }) {
  const { t, money, num, date, pick } = i18n
  const [monthOffset, setMonthOffset] = useState(0)
  const [variant, setVariant] = useState(0)
  const [tab, setTab] = useState('menu')
  const Icon = PROFILE_ICONS[profile.id]
  const cooking = COOKING[settings.cooking] ? settings.cooking : 'daily'

  const [ty, tm] = today.split('-').map(Number)
  const start = new Date(ty, tm - 1 + monthOffset, 1)
  const year = start.getFullYear()
  const month = start.getMonth()

  const plan = useMemo(
    () => buildPlan({ profile, prices, year, month, variant, cooking }),
    [profile, prices, year, month, variant, cooking],
  )
  const weeks = useMemo(() => weeksOf(plan.days), [plan])
  const monthList = useMemo(
    () => shoppingList(ingredientTotals(plan.days, settings.people), prices),
    [plan, settings.people, prices],
  )
  const mains = plan.days.flatMap((d) => d.meals.filter((m) => m.slot === 'lunch' || m.slot === 'dinner'))
  const leftovers = mains.filter((m) => m.leftover).length

  const tabs = [
    ['menu', t('tabMenu'), CalendarDays],
    ['cook', t('tabCook'), CookingPot],
    ['shop', t('tabShop'), ShoppingBasket],
    ['guide', t('tabGuide'), Info],
  ]

  return (
    <section className="plan">
      <a className="back" href="#/">
        <ArrowLeft aria-hidden="true" />
        {t('back')}
      </a>

      <header className="plan-hero">
        <div className="plan-hero-main gridded">
          <span className="icon-tile lg">
            <Icon aria-hidden="true" />
          </span>
          <p className="eyebrow">
            {t('monthlyPlan')} · {date(new Date(year, month, 1), { month: 'long', year: 'numeric' })}
          </p>
          <h1 className="display">{pick(profile.name)}</h1>
          <p className="lede">{pick(profile.who)}</p>
          <ul className="facts">
            <li>{t('kcalDay', { n: num(profile.kcal) })}</li>
            <li>{t('proteinMin', { n: profile.min.p })}</li>
            <li>{t('mealsDay', { n: profile.slots.length })}</li>
          </ul>
        </div>
        <div className="plan-hero-cost">
          <div>
            <span className="label">
              <ShoppingBasket aria-hidden="true" />
              {t('monthlyCost')}
            </span>
            <span className="amount">
              {num(Math.round(monthList.total))}
              <small>{t('lekë')}</small>
            </span>
            <p className="sub">{settings.people === 1 ? t('forOne') : t('forPeople', { n: settings.people })}</p>
          </div>
          <div className="cost-split">
            <div>
              <strong>{money(monthList.official)}</strong>
              <span>{t('atOfficial')}</span>
            </div>
            <div>
              <strong>{money(monthList.estimated)}</strong>
              <span>{t('atEstimated')}</span>
            </div>
          </div>
        </div>
      </header>

      <Filters data={data} settings={settings} update={update} i18n={i18n} title={t('adjust')}>
        <div className="field">
          <span className="field-label" id="people-label">
            {t('people')}
          </span>
          <span className="stepper" role="group" aria-labelledby="people-label">
            <button
              type="button"
              aria-label="−"
              disabled={settings.people <= 1}
              onClick={() => update({ people: Math.max(1, settings.people - 1) })}
            >
              <Minus aria-hidden="true" />
            </button>
            <output aria-live="polite">{settings.people}</output>
            <button
              type="button"
              aria-label="+"
              disabled={settings.people >= 12}
              onClick={() => update({ people: Math.min(12, settings.people + 1) })}
            >
              <Plus aria-hidden="true" />
            </button>
          </span>
        </div>
        <label className="field">
          <span className="field-label">{t('month')}</span>
          <select value={monthOffset} onChange={(e) => setMonthOffset(Number(e.target.value))}>
            {[0, 1].map((o) => (
              <option key={o} value={o}>
                {date(new Date(ty, tm - 1 + o, 1), { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="field">
          <legend className="field-label">{t('cooking')}</legend>
          <div className="segmented">
            {Object.keys(COOKING).map((c) => (
              <button key={c} type="button" aria-pressed={cooking === c} onClick={() => update({ cooking: c })}>
                {t(`cook_${c}`)}
              </button>
            ))}
          </div>
          <p className="field-hint">{t(`cookHint_${cooking}`)}</p>
        </fieldset>
        <div className="field field-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setVariant((v) => v + 1)}>
            <Shuffle aria-hidden="true" />
            {t('shuffle')}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => window.print()}>
            <Printer aria-hidden="true" />
            {t('print')}
          </button>
        </div>
      </Filters>

      <div className="stats">
        <div className="tile">
          <span className="tile-label">
            <Flame aria-hidden="true" />
            {t('energy')}
          </span>
          <span className="tile-value">
            {num(plan.avg.kcal)}
            <small>kcal</small>
          </span>
          <span className="tile-sub">
            {t('target')} {num(profile.kcal)} kcal · {t('avgDay')}
          </span>
        </div>
        <div className="tile">
          <span className="tile-label">
            <Wallet aria-hidden="true" />
            {t('perDay')}
          </span>
          <span className="tile-value">
            {num(Math.round(plan.avg.cost))}
            <small>{t('lekë')}</small>
          </span>
          <span className="tile-sub">{t('perDayNote')}</span>
        </div>
        <div className="tile">
          <span className="tile-label">
            {cooking === 'fresh' ? <CircleCheck aria-hidden="true" /> : <Refrigerator aria-hidden="true" />}
            {t('statCook')}
          </span>
          <span className="tile-value">
            {num(leftovers)}
            <small>{t('meals')}</small>
          </span>
          <span className="tile-sub">{t('statCookSub', { c: mains.length - leftovers, m: mains.length })}</span>
        </div>
        <div className="tile meters">
          <Meter label={t('protein')} value={plan.avg.p} target={profile.min.p} unit="g" i18n={i18n} />
          <Meter label={t('fibre')} value={plan.avg.fib} target={profile.min.fib} unit="g" i18n={i18n} />
          <Meter label={t('calcium')} value={plan.avg.ca} target={profile.min.ca} unit="mg" i18n={i18n} />
        </div>
      </div>

      <div className="tabs" role="tablist">
        {tabs.map(([id, label, TabIcon]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
            <TabIcon aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'menu' && <Menu weeks={weeks} people={settings.people} i18n={i18n} today={today} />}
      {tab === 'cook' && <CookPlan weeks={weeks} cooking={cooking} i18n={i18n} />}
      {tab === 'shop' && <ShoppingList weeks={weeks} people={settings.people} prices={prices} i18n={i18n} />}
      {tab === 'guide' && <Guide profile={profile} i18n={i18n} />}
    </section>
  )
}
