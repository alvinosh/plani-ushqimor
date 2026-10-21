import { useEffect, useMemo, useState } from 'react'
import { makeI18n } from './lib/i18n.js'
import { localDate, priceFoods } from './lib/pricing.js'
import { PROFILES, profileById } from './data/profiles.js'
import Home from './components/Home.jsx'
import PlanView from './components/PlanView.jsx'
import PricesView from './components/PricesView.jsx'
import About from './components/About.jsx'

const DEFAULTS = { lang: 'sq', people: 1, city: '', merchants: [], strategy: 'cheapest' }

function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('plani-settings') || '{}') }
    } catch {
      return DEFAULTS
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem('plani-settings', JSON.stringify(settings))
    } catch {
      // Private mode or blocked storage: settings just won't persist.
    }
    document.documentElement.lang = settings.lang
  }, [settings])
  const update = (patch) => setSettings((s) => ({ ...s, ...patch }))
  return [settings, update]
}

function useData() {
  const [state, setState] = useState({ data: null, history: null, error: null })
  useEffect(() => {
    const base = import.meta.env.BASE_URL
    const get = (file) => fetch(`${base}data/${file}`, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    Promise.all([get('prices.json'), get('history.json').catch(() => ({ days: [] }))])
      .then(([data, history]) => setState({ data, history, error: null }))
      .catch((error) => setState({ data: null, history: null, error }))
  }, [])
  return state
}

function useRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

function DataBanner({ data, i18n }) {
  const { t, date } = i18n
  const pub = data.publication
  return (
    <p className="data-banner">
      {t('pricesFrom')}{' '}
      <a href={data.source} target="_blank" rel="noreferrer">
        Pasqyra e Çmimeve
      </a>
      {pub && (
        <>
          {' · '}
          {t('updated')} {date(new Date(pub.publishedAt), { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          {' · '}
          {t('reporting', { n: pub.reportingMerchants, m: pub.expectedMerchants })}
        </>
      )}
    </p>
  )
}

export default function App() {
  const [settings, update] = useSettings()
  const { data, history, error } = useData()
  const route = useRoute()
  const i18n = useMemo(() => makeI18n(settings.lang), [settings.lang])
  const { t } = i18n
  const today = localDate()

  const filters = useMemo(() => ({ city: settings.city, merchants: settings.merchants }), [settings.city, settings.merchants])
  const prices = useMemo(
    () => (data ? priceFoods(data, filters, today, settings.strategy) : null),
    [data, filters, today, settings.strategy],
  )

  const [page, arg] = route
  const profile = page === 'plan' ? profileById[arg] : null
  const nav = [
    ['#/', t('navPlans'), !page || page === 'plan'],
    ['#/cmimet', t('navPrices'), page === 'cmimet'],
    ['#/rreth', t('navAbout'), page === 'rreth'],
  ]

  let body
  if (error) body = <p className="notice">{t('loadError')}</p>
  else if (!data) body = <p className="notice">{t('loading')}</p>
  else if (profile) body = <PlanView key={profile.id} profile={profile} data={data} prices={prices} settings={settings} update={update} i18n={i18n} today={today} />
  else if (page === 'cmimet') body = <PricesView data={data} history={history} prices={prices} settings={settings} update={update} i18n={i18n} today={today} />
  else if (page === 'rreth') body = <About i18n={i18n} />
  else body = <Home profiles={PROFILES} prices={prices} i18n={i18n} today={today} />

  return (
    <>
      <header className="site-header">
        <div className="wrap header-row">
          <a className="brand" href="#/">
            <span className="brand-mark" aria-hidden="true" />
            <span>
              <strong>Plani Ushqimor</strong>
              <small>{t('tagline')}</small>
            </span>
          </a>
          <nav className="nav">
            {nav.map(([href, label, active]) => (
              <a key={href} href={href} className={active ? 'active' : undefined} aria-current={active ? 'page' : undefined}>
                {label}
              </a>
            ))}
            <button
              type="button"
              className="lang-toggle"
              onClick={() => update({ lang: settings.lang === 'sq' ? 'en' : 'sq' })}
              aria-label={settings.lang === 'sq' ? 'Switch to English' : 'Kalo në shqip'}
            >
              {settings.lang === 'sq' ? 'EN' : 'SQ'}
            </button>
          </nav>
        </div>
      </header>
      <main className="wrap">
        {data && <DataBanner data={data} i18n={i18n} />}
        {body}
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <p>
            {t('source')}:{' '}
            <a href="https://pasqyraecmimeve.al" target="_blank" rel="noreferrer">
              Pasqyra e Çmimeve
            </a>{' '}
            · Ministria e Ekonomisë dhe Inovacionit. {t('notAffiliated')}
          </p>
          <p>{t('disclaimer')}</p>
          <p className="credit">
            {t('createdBy')} <strong>Alvi Hysa</strong> ·{' '}
            <a href="https://github.com/alvinosh" target="_blank" rel="noreferrer">
              GitHub
            </a>{' '}
            ·{' '}
            <a href="https://www.linkedin.com/in/alvi-hysa" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
