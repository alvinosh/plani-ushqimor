// Fetches the current prices from pasqyraecmimeve.al and writes them to
// public/data/prices.json, plus one entry per day in public/data/history.json.
// Exits non-zero (and writes nothing) if the page looks broken.
//
// Usage: node scripts/fetch-prices.mjs [--from-file page.html]

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { catalogueFrom, fetchCatalogue, normalise, validate } from './lib/catalogue.mjs'

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data')
const HISTORY_DAYS = 400

const round = (n) => Math.round(n * 100) / 100

// Cheapest effective price (promo if running on `day`) and median shelf price per category.
function dailySnapshot(data, day) {
  const byCat = {}
  for (const it of data.items) {
    for (const o of it.offers) {
      const promo = o.promo && o.promo.from <= day && day <= o.promo.to
      ;(byCat[it.cat] ||= { eff: [], shelf: [] }).eff.push(promo ? o.promo.price : o.price)
      byCat[it.cat].shelf.push(o.price)
    }
  }
  const min = {}
  const median = {}
  for (const [code, { eff, shelf }] of Object.entries(byCat)) {
    min[code] = Math.min(...eff)
    shelf.sort((a, b) => a - b)
    const mid = shelf.length >> 1
    median[code] = round(shelf.length % 2 ? shelf[mid] : (shelf[mid - 1] + shelf[mid]) / 2)
  }
  return { date: day, min, median }
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return fallback
  }
}

async function main() {
  const fromFile = process.argv.indexOf('--from-file')
  const fetchedAt = new Date().toISOString()
  const catalogue =
    fromFile > 0
      ? catalogueFrom(await readFile(process.argv[fromFile + 1], 'utf8'), process.argv[fromFile + 1])
      : await fetchCatalogue()

  const data = normalise(catalogue, fetchedAt)
  validate(data)

  await mkdir(OUT_DIR, { recursive: true })
  const pricesPath = join(OUT_DIR, 'prices.json')
  const previous = await readJson(pricesPath, null)
  const changed =
    !previous || JSON.stringify({ ...previous, fetchedAt: null }) !== JSON.stringify({ ...data, fetchedAt: null })

  // Only rewrite when prices changed, so hourly runs without news make no commit.
  if (changed) await writeFile(pricesPath, JSON.stringify(data) + '\n')

  const historyPath = join(OUT_DIR, 'history.json')
  const history = await readJson(historyPath, { days: [] })
  const today = fetchedAt.slice(0, 10)
  history.days = history.days
    .filter((d) => d.date !== today)
    .concat(dailySnapshot(data, today))
    .slice(-HISTORY_DAYS)
  await writeFile(historyPath, JSON.stringify(history) + '\n')

  const cats = new Set(data.items.map((i) => i.cat))
  console.log(
    `${changed ? 'updated' : 'unchanged'}: ${data.items.length} products in ${cats.size} categories, ` +
      `${data.merchants.length} merchants, publication ${data.publication?.publishedAt ?? 'n/a'}`,
  )
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
