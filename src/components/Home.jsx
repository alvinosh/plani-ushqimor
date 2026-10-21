import { useMemo } from 'react'
import { buildPlan, ingredientTotals, shoppingList } from '../lib/planner.js'

export default function Home({ profiles, prices, i18n, today }) {
  const { t, money, num, pick } = i18n
  const [year, month] = today.split('-').map(Number)

  const costs = useMemo(
    () =>
      Object.fromEntries(
        profiles.map((profile) => {
          const plan = buildPlan({ profile, prices, year, month: month - 1 })
          return [profile.id, { month: shoppingList(ingredientTotals(plan.days), prices).total, day: plan.avg.cost }]
        }),
      ),
    [profiles, prices, year, month],
  )

  return (
    <section>
      <h1>{t('homeTitle')}</h1>
      <p className="lede">{t('homeIntro')}</p>
      <div className="profile-grid">
        {profiles.map((p) => (
          <a key={p.id} className="profile-card" href={`#/plan/${p.id}`}>
            <span className="profile-icon" aria-hidden="true">
              {p.icon}
            </span>
            <span className="profile-name">{pick(p.name)}</span>
            <span className="profile-who">{pick(p.who)}</span>
            <span className="profile-cost">
              <strong>{money(costs[p.id].month)}</strong>
              <small>{t('perPersonMonth')}</small>
            </span>
            <span className="profile-meta">
              {num(p.kcal)} kcal{t('perDayShort')} · {p.min.p} {t('proteinShort')} · ≈ {money(costs[p.id].day)}
              {t('perDayShort')}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
