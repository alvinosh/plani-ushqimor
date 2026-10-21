// Turns a pasqyraecmimeve.al page into the app's prices.json shape.
// Kept separate from the CLI in scripts/fetch-prices.mjs so the parsing can be
// reused or tested on its own.
//
// The site is a Next.js app. Every /grupi/* page embeds the full catalogue
// (all products, merchants, cities, promos) in its React Server Components
// payload, so we read that instead of scraping the rendered HTML.

export const BASE = 'https://pasqyraecmimeve.al'
export const START_PATH = '/grupi/ushqime-baze'
export const USER_AGENT = 'plani-ushqimor/1.0 (meal plans from public price data)'
const MIN_ITEMS = 50

// Joins the strings pushed via self.__next_f.push([1, "..."]) into the RSC payload.
function rscPayload(html) {
  const re = /self\.__next_f\.push\((\[[\s\S]*?\])\)<\/script>/g
  let out = ''
  for (const m of html.matchAll(re)) {
    try {
      const arr = JSON.parse(m[1])
      if (typeof arr[1] === 'string') out += arr[1]
    } catch {
      // Non-JSON pushes (e.g. bootstrap chunks) carry no data.
    }
  }
  return out
}

// Returns the innermost JSON object in `text` that has `key` as a direct property.
function objectWithKey(text, key) {
  const needle = `"${key}":`
  let searchFrom = 0
  while (true) {
    const at = text.indexOf(needle, searchFrom)
    if (at < 0) return null
    searchFrom = at + needle.length

    // Scan forward from the start, tracking open braces outside of strings,
    // to find which object encloses `at`, then where that object ends.
    const stack = []
    let inStr = false
    let start = -1
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      if (inStr) {
        if (ch === '\\') i++
        else if (ch === '"') inStr = false
        continue
      }
      if (i === at) {
        start = stack.length ? stack[stack.length - 1] : -1
        if (start < 0) break
      }
      if (ch === '"') inStr = true
      else if (ch === '{') stack.push(i)
      else if (ch === '}') {
        const open = stack.pop()
        if (open === start && i > at) {
          try {
            const obj = JSON.parse(text.slice(start, i + 1))
            if (obj && key in obj) return obj
          } catch {
            // Not plain JSON (RSC references); try the next occurrence.
          }
          break
        }
      }
    }
  }
}

export function catalogueFrom(html, label) {
  const obj = objectWithKey(rscPayload(html), 'artikujt')
  if (!obj || !Array.isArray(obj.artikujt)) throw new Error(`No product list found in ${label}`)
  return obj
}

export function groupPaths(html) {
  const paths = new Set([START_PATH])
  for (const m of html.matchAll(/href="(\/grupi\/[a-z0-9-]+)"/g)) paths.add(m[1])
  return [...paths]
}

// Fetches the start page plus any other group pages and merges their products.
export async function fetchCatalogue(fetchImpl = fetch) {
  const get = async (path) => {
    const res = await fetchImpl(BASE + path, {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'sq,en;q=0.8' },
    })
    if (!res.ok) throw new Error(`GET ${path} -> HTTP ${res.status}`)
    return res.text()
  }
  const firstHtml = await get(START_PATH)
  const catalogue = catalogueFrom(firstHtml, START_PATH)
  // Each group page currently embeds the whole catalogue, but merge them in
  // case that ever changes to one group per page.
  const seen = new Set(catalogue.artikujt.map((a) => a.id))
  const others = groupPaths(firstHtml).filter((p) => p !== START_PATH)
  const pages = await Promise.allSettled(others.map(async (p) => catalogueFrom(await get(p), p)))
  for (const page of pages) {
    if (page.status !== 'fulfilled') continue
    for (const a of page.value.artikujt) {
      if (seen.has(a.id)) continue
      seen.add(a.id)
      catalogue.artikujt.push(a)
    }
  }
  return catalogue
}

const round = (n, d = 2) => (n == null ? null : Math.round(n * 10 ** d) / 10 ** d)

export function normalise(cat, fetchedAt) {
  const merchants = cat.op
  const items = cat.artikujt.map((a) => ({
    id: a.id,
    cat: a.kat,
    name: (a.emriPublik || a.emri || '').replace(/\s+/g, ' ').trim(),
    brand: a.prod || null,
    unit: a.njesi,
    pack: a.pak,
    origin: a.org || null,
    offers: a.of
      .map((o, i) => {
        // cakt[i] === false means the merchant does not carry this product.
        if (!o || a.cakt?.[i] === false) return null
        return {
          merchant: merchants[i],
          price: round(o.u), // lekë per unit (kg, l, 10 eggs)
          size: round(o.s, 3), // pack size in that unit
          stores: o.n,
          totalStores: o.N,
          cities: o.q || [],
          asOf: o.j || null, // set when the price is carried over from an earlier week
          promo: o.pu != null ? { price: round(o.pu), from: o.pn, to: o.pd } : null,
        }
      })
      .filter(Boolean),
    // Prices valid in only some of a chain's stores (under 80%). The site leaves
    // them out of its comparison table, but they are often local deals.
    localOffers: (a.vp || []).map((v) => ({
      merchant: v.op,
      price: round(v.u),
      size: round(v.s, 3),
      stores: v.n,
      totalStores: v.N,
      at: (v.d || []).map((d) => ({ store: d.e, city: d.q })),
    })),
  }))

  return {
    source: BASE,
    fetchedAt,
    publication: cat.publikimi
      ? {
          id: cat.publikimi.id,
          referenceDate: cat.publikimi.dataReference,
          version: cat.publikimi.versioni,
          publishedAt: cat.publikimi.publikuarMe,
          reportingMerchants: cat.publikimi.operatoreRaportues,
          expectedMerchants: cat.publikimi.operatoreTePritur,
        }
      : null,
    merchants: (cat.tregtaret || []).map((t) => ({ name: t.emri, stores: t.dyqanet || {} })),
    cities: cat.qytetet || [],
    groups: cat.grupet || [],
    categories: (cat.kategorite || []).map((k) => ({
      code: k.kod,
      name: k.emri,
      icon: k.ico || '',
      group: k.grupi,
      subgroup: k.nenkat || null,
      unit: k.njesi,
      ref: k.ref ?? null,
      spec: k.spec || null,
      packaging: k.paketimiPilot || null,
    })),
    items: items.filter((it) => it.offers.length > 0 || it.localOffers.length > 0),
  }
}

export function validate(data) {
  const problems = []
  if (data.items.length < MIN_ITEMS) problems.push(`only ${data.items.length} products (expected >= ${MIN_ITEMS})`)
  if (!data.merchants.length) problems.push('no merchants')
  const bad = data.items.filter((it) => it.offers.some((o) => !(o.price > 0)))
  if (bad.length) problems.push(`${bad.length} products with a non-positive price, e.g. #${bad[0].id}`)
  if (problems.length) throw new Error('Refusing to use suspicious data: ' + problems.join('; '))
}
