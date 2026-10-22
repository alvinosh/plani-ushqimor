import { useMemo } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, CookingPot, HeartPulse, ReceiptText } from 'lucide-react'
import { buildPlan, ingredientTotals, shoppingList } from '../lib/planner.js'
import { promotions } from '../lib/pricing.js'
import { PROFILE_ICONS } from './profileIcons.js'

export default function Home({ profiles, data, prices, filters, settings, i18n, today }) {
  const { t, money, num, date, pick } = i18n
  const [year, month] = today.split('-').map(Number)

  const costs = useMemo(
    () =>
      Object.fromEntries(
        profiles.map((profile) => {
          const plan = buildPlan({ profile, prices, year, month: month - 1, cooking: settings.cooking })
          return [profile.id, { month: shoppingList(ingredientTotals(plan.days), prices).total, day: plan.avg.cost }]
        }),
      ),
    [profiles, prices, year, month, settings.cooking],
  )
  const activePromos = useMemo(
    () => promotions(data, filters, today).filter((p) => p.state === 'active').length,
    [data, filters, today],
  )
  const cheapest = Math.min(...Object.values(costs).map((c) => c.month))
  const updated = data.publication?.publishedAt ?? data.fetchedAt

  const features = [
    [ReceiptText, t('featPricesTitle'), t('featPricesText'), '#/cmimet', t('navPrices')],
    [CookingPot, t('prepTitle'), t('prepText'), '#/rreth', t('navAbout')],
    [HeartPulse, t('featNutritionTitle'), t('featNutritionText'), '#/rreth', t('navAbout')],
  ]

  return (
    <>
      <section className="hero gridded">
        <p className="eyebrow pill">
          <span className="dot-live" aria-hidden="true" />
          {t('heroEyebrow', { d: date(new Date(updated), { day: 'numeric', month: 'long' }) })}
        </p>
        <h1 className="display">{t('heroTitle')}</h1>
        <p className="lede">{t('homeIntro')}</p>
        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('homeTitle')}
            <ArrowDown aria-hidden="true" />
          </button>
          <a className="btn btn-outline btn-lg" href="#/cmimet">
            {t('navPrices')}
          </a>
        </div>
        <dl className="hero-stats">
          <div>
            <dt>{t('statProducts')}</dt>
            <dd>{num(data.items.length)}</dd>
          </div>
          {activePromos > 0 ? (
            <div>
              <dt>{t('statPromos')}</dt>
              <dd>{num(activePromos)}</dd>
            </div>
          ) : (
            <div>
              <dt>{t('statChains')}</dt>
              <dd>{num(data.merchants.length)}</dd>
            </div>
          )}
          <div>
            <dt>{t('statFrom')}</dt>
            <dd>
              {num(Math.round(cheapest))}
              <small>{t('lekë')}</small>
            </dd>
          </div>
        </dl>
      </section>

      <section className="section" id="plans" aria-labelledby="plans-title">
        <header className="section-head">
          <div>
            <h2 id="plans-title" className="display section-title">
              {t('homeTitle')}
            </h2>
            <p>{t('plansIntro')}</p>
          </div>
        </header>
        <div className="plan-grid">
          {profiles.map((p) => {
            const Icon = PROFILE_ICONS[p.id]
            return (
              <a key={p.id} className="plan-card" href={`#/plan/${p.id}`} aria-label={`${pick(p.name)}: ${t('viewPlan')}`}>
                <span className="icon-tile">
                  <Icon aria-hidden="true" />
                </span>
                <span className="go" aria-hidden="true">
                  <ArrowUpRight />
                </span>
                <h3>{pick(p.name)}</h3>
                <p className="who">{pick(p.who)}</p>
                <div className="cost">
                  <span className="amount">
                    {num(Math.round(costs[p.id].month))}
                    <small>{t('lekë')}</small>
                  </span>
                  <span className="cost-note">{t('perPersonMonth')}</span>
                </div>
                <ul className="facts">
                  <li>{num(p.kcal)} kcal</li>
                  <li>
                    {p.min.p} {t('proteinShort')}
                  </li>
                  <li>
                    ≈ {money(costs[p.id].day)}
                    {t('perDayShort')}
                  </li>
                </ul>
              </a>
            )
          })}
          <a className="plan-card is-feature" href="#/rreth">
            <span className="icon-tile">
              <CookingPot aria-hidden="true" />
            </span>
            <span className="go" aria-hidden="true">
              <ArrowUpRight />
            </span>
            <h3>{t('prepTitle')}</h3>
            <p className="who">{t('prepText')}</p>
          </a>
        </div>
      </section>

      <section className="section features">
        {features.map(([Icon, title, text, href, link]) => (
          <article key={title} className="feature">
            <span className="icon-tile">
              <Icon aria-hidden="true" />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
            <a className="link-arrow" href={href}>
              <span>{link}</span>
              <ArrowRight aria-hidden="true" />
            </a>
          </article>
        ))}
      </section>
    </>
  )
}
