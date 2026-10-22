import { useEffect, useMemo, useState } from 'react'
import { Languages, LoaderCircle, Menu, TriangleAlert, X } from 'lucide-react'
import { makeI18n } from './lib/i18n.js'
import { localDate, priceFoods } from './lib/pricing.js'
import { PROFILES, profileById } from './data/profiles.js'
import Home from './components/Home.jsx'
import PlanView from './components/PlanView.jsx'
import PricesView from './components/PricesView.jsx'
import About from './components/About.jsx'

const DEFAULTS = { lang: 'sq', people: 1, city: '', merchants: [], strategy: 'cheapest', cooking: 'daily' }

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

// Thin strip above the header: what this site is, and how fresh the data is.
function Strip({ data, i18n }) {
  const { t, date } = i18n
  const pub = data?.publication
  return (
    <div className="strip">
      <div className="wrap strip-row">
        <span>{t('independent')}</span>
        {pub && (
          <span className="strip-live">
            <span className="dot-live" aria-hidden="true" />
            {t('pricesFrom')}
            <a href={data.source} target="_blank" rel="noreferrer">
              Pasqyra e Çmimeve
            </a>
            <span>
              · {t('updated')} {date(new Date(pub.publishedAt), { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="strip-extra">· {t('reporting', { n: pub.reportingMerchants, m: pub.expectedMerchants })}</span>
          </span>
        )}
      </div>
    </div>
  )
}

function Brand() {
  return (
    <a className="brand" href="#/">
      <span className="brand-mark" aria-hidden="true" />
      <span className="brand-name">Plani Ushqimor</span>
    </a>
  )
}

function Header({ nav, settings, update, t }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="wrap">
        <div className="header-bar">
          <Brand />
          <nav className="nav">
            {nav.map(([href, label, active]) => (
              <a key={href} className="nav-link" href={href} aria-current={active ? 'page' : undefined}>
                {label}
              </a>
            ))}
            <button
              type="button"
              className="lang"
              onClick={() => update({ lang: settings.lang === 'sq' ? 'en' : 'sq' })}
              aria-label={settings.lang === 'sq' ? 'Switch to English' : 'Kalo në shqip'}
            >
              <Languages aria-hidden="true" />
              {settings.lang === 'sq' ? 'EN' : 'SQ'}
            </button>
            <button
              type="button"
              className="btn btn-primary menu-btn"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
              <span className="menu-label">{open ? t('navClose') : t('navMenu')}</span>
            </button>
          </nav>
        </div>
        {open && (
          <nav id="mobile-menu" className="mobile-menu">
            {nav.map(([href, label, active]) => (
              <a key={href} href={href} aria-current={active ? 'page' : undefined} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

function Footer({ nav, t }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <Brand />
        <p className="footer-tagline">{t('tagline')}</p>
        <nav className="footer-nav">
          {nav.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="footer-fine">
          <p>
            {t('source')}:{' '}
            <a href="https://pasqyraecmimeve.al" target="_blank" rel="noreferrer">
              Pasqyra e Çmimeve
            </a>{' '}
            · Ministria e Ekonomisë dhe Inovacionit. {t('notAffiliated')}
          </p>
          <p>{t('disclaimer')}</p>
        </div>
        <p className="footer-credit">
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
  if (error)
    body = (
      <p className="notice">
        <TriangleAlert aria-hidden="true" /> {t('loadError')}
      </p>
    )
  else if (!data)
    body = (
      <p className="notice">
        <LoaderCircle className="spin" aria-hidden="true" /> {t('loading')}
      </p>
    )
  else if (profile) body = <PlanView key={profile.id} profile={profile} data={data} prices={prices} settings={settings} update={update} i18n={i18n} today={today} />
  else if (page === 'cmimet') body = <PricesView data={data} history={history} prices={prices} settings={settings} update={update} i18n={i18n} today={today} />
  else if (page === 'rreth') body = <About i18n={i18n} />
  else body = <Home profiles={PROFILES} data={data} prices={prices} filters={filters} settings={settings} i18n={i18n} today={today} />

  return (
    <>
      {/* Focus instead of following the link: the hash holds the route. */}
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        {t('skip')}
      </a>
      <Strip data={data} i18n={i18n} />
      <Header nav={nav} settings={settings} update={update} t={t} />
      <main id="main" className="wrap" tabIndex={-1} key={page ?? 'home'}>
        {body}
      </main>
      <Footer nav={nav} t={t} />
    </>
  )
}
