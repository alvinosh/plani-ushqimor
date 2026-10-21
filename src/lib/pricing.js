import { FOODS } from '../data/foods.js'

// Today's date as YYYY-MM-DD in the viewer's time zone (promo dates are local).
export function localDate(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function promoState(offer, today) {
  const p = offer.promo
  if (!p) return null
  if (p.from <= today && today <= p.to) return 'active'
  if (today < p.from) return 'upcoming'
  return null
}

// Price per unit a shopper pays today, using the promo price only while it runs.
export function effectivePrice(offer, today) {
  return promoState(offer, today) === 'active' ? offer.promo.price : offer.price
}

function offerAllowed(offer, { city, merchants }) {
  if (merchants?.length && !merchants.includes(offer.merchant)) return false
  if (city && !offer.cities.includes(city)) return false
  return true
}

// Cheapest allowed offer for one product, or null if no allowed store sells it.
export function bestOffer(item, filters, today) {
  let best = null
  for (const offer of item.offers) {
    if (!offerAllowed(offer, filters)) continue
    const price = effectivePrice(offer, today)
    if (!best || price < best.price) best = { offer, price, promo: promoState(offer, today) === 'active' }
  }
  return best
}

function candidates(data, food) {
  if (!food.kat) return []
  return data.items.filter((it) => it.cat === food.kat && (!food.match || food.match.test(it.name)))
}

// Prices every food in FOODS.
//   strategy 'cheapest': the cheapest product in the category
//   strategy 'typical':  the median product, closer to what most people buy
// Returns { [code]: { source, perKg, unitPrice, item, offer, promo, upcoming, options } }
// where perKg is lekë per kg of edible food.
export function priceFoods(data, filters, today, strategy = 'cheapest') {
  const out = {}
  for (const [code, food] of Object.entries(FOODS)) {
    const unitKg = food.unitKg ?? 1
    const edible = food.yield ?? 1
    const priced = candidates(data, food)
      .map((item) => ({ item, ...bestOffer(item, filters, today) }))
      .filter((c) => c.offer)
      .sort((a, b) => a.price - b.price)

    if (!priced.length) {
      out[code] = { code, source: 'estimate', unitPrice: food.est, perKg: food.est / edible, options: 0 }
      continue
    }

    const pick = strategy === 'typical' ? priced[(priced.length - 1) >> 1] : priced[0]
    // A promo that has not started yet but would beat today's pick.
    let upcoming = null
    for (const { item } of priced) {
      for (const offer of item.offers) {
        if (!offerAllowed(offer, filters) || promoState(offer, today) !== 'upcoming') continue
        if (offer.promo.price < pick.price && (!upcoming || offer.promo.price < upcoming.offer.promo.price)) {
          upcoming = { item, offer }
        }
      }
    }

    out[code] = {
      code,
      source: 'official',
      unitPrice: pick.price,
      perKg: pick.price / unitKg / edible,
      item: pick.item,
      offer: pick.offer,
      promo: pick.promo,
      upcoming,
      options: priced.length,
    }
  }
  return out
}

// All promotions that are running or announced, cheapest discount first.
export function promotions(data, filters, today) {
  const rows = []
  for (const item of data.items) {
    for (const offer of item.offers) {
      const state = promoState(offer, today)
      if (!state || !offerAllowed(offer, filters)) continue
      rows.push({ item, offer, state, saving: 1 - offer.promo.price / offer.price })
    }
  }
  return rows.sort((a, b) => (a.state === b.state ? b.saving - a.saving : a.state === 'active' ? -1 : 1))
}

// Prices valid only in a few stores of a chain that beat that chain's normal price.
export function localDeals(data, filters) {
  const rows = []
  for (const item of data.items) {
    for (const local of item.localOffers ?? []) {
      if (filters.merchants?.length && !filters.merchants.includes(local.merchant)) continue
      const at = filters.city ? local.at.filter((a) => a.city === filters.city) : local.at
      if (!at.length) continue
      // Compare with the chain's own price, or with the cheapest chain if it has none.
      const chain = item.offers.find((o) => o.merchant === local.merchant)
      const ref = chain ? chain.price : item.offers.length ? Math.min(...item.offers.map((o) => o.price)) : null
      if (ref == null || local.price >= ref) continue
      rows.push({ item, local, at, refPrice: ref, refIsChain: Boolean(chain), saving: 1 - local.price / ref })
    }
  }
  return rows.sort((a, b) => b.saving - a.saving)
}
