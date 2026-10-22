import { Clock, Flame, Package, Refrigerator, Snowflake, Thermometer, Utensils, Wheat } from 'lucide-react'
import { capitalise } from '../lib/i18n.js'

// Leftover safety, after USDA FSIS "Leftovers and Food Safety" and the NHS
// advice on reheating rice.
const RULES = {
  sq: [
    [Clock, 'Ftoheni ushqimin e gatuar dhe futeni në frigorifer brenda 2 orësh.'],
    [Thermometer, 'Frigoriferi në 4°C ose më pak, ngrirja në −18°C.'],
    [Package, 'Ndajeni në enë të mbyllura, një porcion për enë, dhe shkruani datën.'],
    [Wheat, 'Gjellët me oriz hajini brenda 24 orësh.'],
    [Snowflake, 'Shkrijeni në frigorifer natën para, jo në tavolinë.'],
    [Flame, 'Ngroheni vetëm një herë, derisa të avullojë kudo.'],
  ],
  en: [
    [Clock, 'Cool cooked food and get it into the fridge within 2 hours.'],
    [Thermometer, 'Keep the fridge at 4°C or below and the freezer at −18°C.'],
    [Package, 'Use closed containers, one portion each, and write the date on them.'],
    [Wheat, 'Eat dishes with rice within 24 hours.'],
    [Snowflake, 'Thaw in the fridge overnight, not on the counter.'],
    [Flame, 'Reheat only once, until steaming hot all the way through.'],
  ],
}

const isMain = (meal) => meal.slot === 'lunch' || meal.slot === 'dinner'

// What to cook each day, how many portions, and where the extra ones go.
export default function CookPlan({ weeks, cooking, i18n }) {
  const { t, date, pick, lang } = i18n
  const mains = weeks.flat().flatMap((day) => day.meals.filter(isMain))
  const leftovers = mains.filter((m) => m.leftover).length
  const when = (slot, d) => `${t(`slot_${slot}`)}, ${date(d, { weekday: 'long', day: 'numeric', month: 'short' })}`

  return (
    <div className="cook-layout">
      <div>
        <p className="cook-intro">
          {cooking === 'fresh'
            ? t('cookNone')
            : t('cookIntro', { c: mains.length - leftovers, m: mains.length, l: leftovers })}
        </p>
        {cooking !== 'fresh' &&
          weeks.map((week, w) => {
            const sessions = week.flatMap((day) => day.meals.filter((m) => isMain(m) && !m.leftover).map((meal) => ({ day, meal })))
            if (!sessions.length) return null
            return (
              <section key={w} className="cook-week">
                <header className="week-head">
                  <h3>{t('weekN', { n: w + 1 })}</h3>
                  <span>
                    {date(week[0].date)} – {date(week[week.length - 1].date)}
                  </span>
                </header>
                <ol className="cook-list">
                  {sessions.map(({ day, meal }) => {
                    const portions = 1 + meal.ahead.length
                    return (
                      <li key={`${+day.date}-${meal.slot}`} className={`cook-item${portions > 1 ? ' is-batch' : ''}`}>
                        <div className="cook-date">
                          <strong>{capitalise(date(day.date, { weekday: 'long' }))}</strong>
                          <span>{date(day.date, { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div>
                          <div className="cook-dish">{pick(meal.recipe.name)}</div>
                          <ul className="cook-uses">
                            <li>
                              <Utensils aria-hidden="true" />
                              {t(`slot_${meal.slot}`)}, {t('today').toLowerCase()}
                            </li>
                            {meal.ahead.map((a) => (
                              <li key={+a.date} className="cold">
                                {a.frozen ? <Snowflake aria-label={t('tagFreezer')} /> : <Refrigerator aria-label={t('tagFridge')} />}
                                {when(a.slot, a.date)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="cook-portions">
                          <strong>{portions}</strong>
                          <span>{portions === 1 ? t('portion') : t('portions')}</span>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </section>
            )
          })}
      </div>
      <aside className="rules">
        <h3>{t('storageTitle')}</h3>
        <ol>
          {(RULES[lang] ?? RULES.sq).map(([Icon, text]) => (
            <li key={text}>
              <Icon aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ol>
        <p className="small muted">{t('storageSource')}</p>
      </aside>
    </div>
  )
}
