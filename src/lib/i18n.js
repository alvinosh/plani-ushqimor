const STRINGS = {
  sq: {
    tagline: 'Plane ushqimore mujore me çmimet zyrtare të supermarketeve në Shqipëri',
    navPlans: 'Planet',
    navPrices: 'Çmimet & ofertat',
    navAbout: 'Si funksionon',
    pricesFrom: 'Çmimet nga',
    updated: 'përditësuar',
    weekOf: 'java',
    reporting: '{n} nga {m} tregtarë kanë raportuar',
    loading: 'Duke ngarkuar çmimet…',
    loadError: 'Çmimet nuk u ngarkuan. Provoni përsëri më vonë.',
    homeTitle: 'Zgjidhni një plan',
    homeIntro:
      'Çdo plan mbulon gjithë muajin: menunë ditore, listën e blerjeve dhe koston, të llogaritura me çmimet më të fundit nga Pasqyra e Çmimeve. Kur ndryshojnë çmimet ose dalin oferta, ndryshon edhe plani.',
    perPersonMonth: 'për person në muaj',
    perDayShort: '/ditë',
    proteinShort: 'g proteinë',
    back: '← Të gjitha planet',
    people: 'Persona',
    city: 'Qyteti',
    allCities: 'Të gjitha qytetet',
    stores: 'Marketet',
    allStores: 'Të gjitha',
    pricing: 'Çmimi',
    cheapest: 'Më i liri',
    typical: 'Mesatar',
    month: 'Muaji',
    shuffle: 'Menu tjetër',
    print: 'Printo',
    monthlyCost: 'Blerjet për muajin',
    forPeople: 'për {n} persona',
    forOne: 'për 1 person',
    estimatedShare: '{x} prej tyre me çmime të vlerësuara',
    perDay: 'Për person në ditë',
    perDayNote: 'kosto e ushqimit të konsumuar',
    energy: 'Energjia',
    protein: 'Proteina',
    fibre: 'Fibra',
    calcium: 'Kalciumi',
    target: 'objektivi',
    belowTarget: 'nën objektiv',
    avgDay: 'mesatarja ditore',
    tabMenu: 'Menuja',
    tabShop: 'Lista e blerjeve',
    tabGuide: 'Udhëzime',
    today: 'Sot',
    weekN: 'Java {n}',
    wholeMonth: 'Gjithë muaji',
    perPersonNote: 'Sasitë në menu janë për 1 person. Lista e blerjeve është për {n}.',
    ingredients: 'Përbërësit',
    food: 'Ushqimi',
    quantity: 'Sasia',
    product: 'Ku ta blini',
    cost: 'Kosto',
    official: 'zyrtar',
    estimate: 'vlerësim',
    estimateTip: 'Ky ushqim ende nuk ndiqet nga Pasqyra e Çmimeve; çmimi është vlerësim.',
    promo: 'ofertë',
    promoUntil: 'ofertë deri më {d}',
    upcoming: 'Nga {d} me ofertë: {p} te {m}',
    total: 'Gjithsej',
    copyList: 'Kopjo listën',
    copied: 'U kopjua ✓',
    shopNote:
      'Paketat rrumbullakosen lart, ndaj kostoja e blerjeve është pak më e lartë se kostoja ditore. Disa produkte (vaj, sheqer, mjaltë) zgjasin më shumë se një muaj.',
    guideTitle: 'Këshilla për këtë plan',
    disclaimer:
      'Planet janë udhëzues të përgjithshëm për njerëz të shëndetshëm, jo këshillë mjekësore. Për fëmijë të vegjël, shtatzëni, diabet, alergji ose sëmundje kronike konsultohuni me mjekun ose dietologun.',
    pricesTitle: 'Çmimet & ofertat',
    promosTitle: 'Ofertat',
    promosIntro: 'Oferta të njoftuara nga tregtarët. Plani i përdor automatikisht ditët kur janë aktive.',
    noPromos: 'Nuk ka oferta për filtrat e zgjedhur.',
    running: 'Aktive',
    startsOn: 'Nga {d}',
    until: 'deri më {d}',
    categoriesTitle: 'Çmimi më i ulët sipas kategorisë',
    colCategory: 'Kategoria',
    colCheapest: 'Më i liri tani',
    colMedian: 'Mesatarja',
    colProducts: 'Produkte',
    colTrend: 'Ecuria',
    trendEmpty: 'Ecuria shfaqet pas disa ditësh përditësimi.',
    localTitle: 'Çmime vetëm në disa dyqane',
    localIntro:
      'Çmime më të ulëta që vlejnë vetëm në disa dyqane të një rrjeti. Pasqyra e Çmimeve nuk i fut në krahasim, por ia vlen t\'i dini.',
    localAt: 'në {n} nga {m} dyqane',
    chainPrice: 'zakonisht {p} në këtë rrjet',
    elsewherePrice: 'më i liri gjetkë {p}',
    estTitle: 'Ushqime pa çmim zyrtar (ende)',
    estIntro:
      'Këto ushqime përdoren në plane, por Pasqyra e Çmimeve ende nuk i ndjek. Përdoret një çmim i vlerësuar derisa të shtohen; pastaj plani kalon automatikisht te çmimi zyrtar.',
    perKgEst: 'lekë/kg',
    showAll: 'Shfaq të gjitha ({n})',
    showLess: 'Shfaq më pak',
    slot_breakfast: 'Mëngjes',
    slot_lunch: 'Drekë',
    slot_dinner: 'Darkë',
    slot_snack: 'Mes-vakt',
    source: 'Burimi i të dhënave',
    notAffiliated: 'Ky projekt nuk është i lidhur me MEI.',
    createdBy: 'Krijuar nga',
    lekë: 'lekë',
    perUnit: 'lekë/{u}',
    packs: 'pako',
  },
  en: {
    tagline: 'Monthly meal plans priced with official Albanian supermarket data',
    navPlans: 'Plans',
    navPrices: 'Prices & deals',
    navAbout: 'How it works',
    pricesFrom: 'Prices from',
    updated: 'updated',
    weekOf: 'week',
    reporting: '{n} of {m} retailers have reported',
    loading: 'Loading prices…',
    loadError: 'Could not load prices. Please try again later.',
    homeTitle: 'Choose a plan',
    homeIntro:
      'Each plan covers the whole month: a daily menu, a shopping list and the cost, worked out from the latest prices on Pasqyra e Çmimeve. When prices change or promotions start, the plan changes with them.',
    perPersonMonth: 'per person per month',
    perDayShort: '/day',
    proteinShort: 'g protein',
    back: '← All plans',
    people: 'People',
    city: 'City',
    allCities: 'All cities',
    stores: 'Supermarkets',
    allStores: 'All',
    pricing: 'Pricing',
    cheapest: 'Cheapest',
    typical: 'Typical',
    month: 'Month',
    shuffle: 'Shuffle menu',
    print: 'Print',
    monthlyCost: 'Shopping for the month',
    forPeople: 'for {n} people',
    forOne: 'for 1 person',
    estimatedShare: '{x} of it at estimated prices',
    perDay: 'Per person per day',
    perDayNote: 'cost of the food eaten',
    energy: 'Energy',
    protein: 'Protein',
    fibre: 'Fibre',
    calcium: 'Calcium',
    target: 'target',
    belowTarget: 'below target',
    avgDay: 'daily average',
    tabMenu: 'Menu',
    tabShop: 'Shopping list',
    tabGuide: 'Guidance',
    today: 'Today',
    weekN: 'Week {n}',
    wholeMonth: 'Whole month',
    perPersonNote: 'Menu quantities are for 1 person. The shopping list is for {n}.',
    ingredients: 'Ingredients',
    food: 'Food',
    quantity: 'Quantity',
    product: 'Where to buy',
    cost: 'Cost',
    official: 'official',
    estimate: 'estimate',
    estimateTip: 'Pasqyra e Çmimeve does not track this food yet; the price is an estimate.',
    promo: 'promo',
    promoUntil: 'promo until {d}',
    upcoming: 'From {d} on promo: {p} at {m}',
    total: 'Total',
    copyList: 'Copy list',
    copied: 'Copied ✓',
    shopNote:
      'Packs are rounded up, so the shopping cost is a little higher than the daily cost. Some products (oil, sugar, honey) last longer than a month.',
    guideTitle: 'Tips for this plan',
    disclaimer:
      'These plans are general guidance for healthy people, not medical advice. For young children, pregnancy, diabetes, allergies or chronic illness, check with a doctor or dietitian.',
    pricesTitle: 'Prices & deals',
    promosTitle: 'Promotions',
    promosIntro: 'Promotions announced by the retailers. Plans use them automatically on the days they run.',
    noPromos: 'No promotions for the selected filters.',
    running: 'Running',
    startsOn: 'From {d}',
    until: 'until {d}',
    categoriesTitle: 'Lowest price by category',
    colCategory: 'Category',
    colCheapest: 'Cheapest now',
    colMedian: 'Median',
    colProducts: 'Products',
    colTrend: 'Trend',
    trendEmpty: 'The trend appears after a few days of updates.',
    localTitle: 'Prices at only some stores',
    localIntro:
      'Lower prices that apply in only a few stores of a chain. Pasqyra e Çmimeve leaves them out of its comparison, but they are worth knowing about.',
    localAt: 'in {n} of {m} stores',
    chainPrice: 'usually {p} at this chain',
    elsewherePrice: 'cheapest elsewhere {p}',
    estTitle: 'Foods without an official price (yet)',
    estIntro:
      'These foods are used in the plans but Pasqyra e Çmimeve does not track them yet. An estimated price is used until they are added; then the plans switch to the official price automatically.',
    perKgEst: 'lekë/kg',
    showAll: 'Show all ({n})',
    showLess: 'Show less',
    slot_breakfast: 'Breakfast',
    slot_lunch: 'Lunch',
    slot_dinner: 'Dinner',
    slot_snack: 'Snack',
    source: 'Data source',
    notAffiliated: 'This project is not affiliated with MEI.',
    createdBy: 'Created by',
    lekë: 'lekë',
    perUnit: 'lekë/{u}',
    packs: 'packs',
  },
}

// Albanian names are spelled out rather than taken from Intl, because not every
// browser ships Albanian locale data (headless Chromium falls back to English).
const SQ_MONTHS = ['janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor', 'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor']
const SQ_MONTHS_SHORT = ['jan', 'shk', 'mar', 'pri', 'maj', 'qer', 'korr', 'gush', 'sht', 'tet', 'nën', 'dhj']
const SQ_WEEKDAYS = ['e diel', 'e hënë', 'e martë', 'e mërkurë', 'e enjte', 'e premte', 'e shtunë']

function sqDate(d, opts) {
  const parts = []
  if (opts.weekday) parts.push(SQ_WEEKDAYS[d.getDay()] + ',')
  if (opts.day) parts.push(d.getDate())
  if (opts.month) parts.push((opts.month === 'short' ? SQ_MONTHS_SHORT : SQ_MONTHS)[d.getMonth()])
  if (opts.year) parts.push(d.getFullYear())
  let out = parts.join(' ')
  if (opts.hour) out += `, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return out
}

// Albanian number style: non-breaking space between thousands, comma for decimals.
function sqNum(n, digits) {
  const [int, frac] = Math.abs(n).toFixed(digits).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
  const tail = frac?.replace(/0+$/, '')
  return (n < 0 ? '−' : '') + grouped + (tail ? ',' + tail : '')
}

export function makeI18n(lang) {
  const locale = lang === 'en' ? 'en-GB' : 'sq-AL'
  const strings = STRINGS[lang] ?? STRINGS.sq
  const t = (key, vars) => {
    let s = strings[key] ?? STRINGS.sq[key] ?? key
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v)
    return s
  }
  const num = (n, digits = 0) =>
    lang === 'en'
      ? new Intl.NumberFormat(locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(n)
      : sqNum(n, digits)
  const money = (n) => `${num(Math.round(n))} ${strings.lekë}`
  const date = (d, opts = { day: 'numeric', month: 'long' }) => {
    const value = typeof d === 'string' ? new Date(d + 'T12:00:00') : d
    return lang === 'en' ? new Intl.DateTimeFormat(locale, opts).format(value) : sqDate(value, opts)
  }
  const pick = (obj) => obj?.[lang] ?? obj?.sq
  const unit = (u) => (lang === 'en' && u === '10 vezë' ? '10 eggs' : u)
  return { lang, locale, t, num, money, date, pick, unit }
}
