import { FOODS, NUTRIENTS } from '../data/foods.js'
import { RECIPES } from '../data/recipes.js'

const MIN_SCALE = 0.45
const MAX_SCALE = 1.9
const MAX_FAT_SHARE = 0.35
const FAT_PENALTY = 4 // per gram of fat above the cap

// Penalties for repeating a recipe, by type: [days it is blocked, penalty if
// repeated inside that window, extra penalty per earlier use this month].
const REPEAT = {
  main: [4, 160, 14],
  dinner: [3, 120, 10],
  breakfast: [2, 70, 6],
  snack: [1, 40, 9],
}

function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(str) {
  let h = 2166136261
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return h >>> 0
}

// Nutrition and cost of one adult portion of a recipe at today's prices.
function recipeStats(recipe, prices) {
  const s = Object.fromEntries(NUTRIENTS.map((n) => [n, 0]))
  s.cost = 0
  for (const [code, grams] of Object.entries(recipe.ing)) {
    const food = FOODS[code]
    for (const n of NUTRIENTS) s[n] += (food[n] * grams) / 100
    s.cost += (prices[code].perKg * grams) / 1000
  }
  return s
}

export function nutritionOf(recipe, scale = 1) {
  const out = {}
  for (const n of NUTRIENTS) {
    out[n] = 0
    for (const [code, grams] of Object.entries(recipe.ing)) out[n] += (FOODS[code][n] * grams * scale) / 100
  }
  return out
}

// Cooking ahead. Dishes that keep (recipe.keeps / recipe.freezes) can be cooked
// in a bigger batch and eaten again on later days. Per cooking setting:
//   fridge   extra portions that go in the fridge
//   within   days ahead those portions are eaten (capped by the dish's `keeps`)
//   freezer  extra portions that go in the freezer, eaten FREEZER_DAYS later
//   perDay   most cooked-ahead meals on any one day
export const COOKING = {
  fresh: { fridge: 0, within: 0, freezer: 0, perDay: 0 },
  daily: { fridge: 1, within: 1, freezer: 0, perDay: 1 },
  batch: { fridge: 2, within: 3, freezer: 1, perDay: 2 },
}
const FREEZER_DAYS = [6, 10]
// Score bonus per portion cooked ahead, so dishes that keep win close calls.
const AHEAD_BONUS = 35

// Builds a plan for every day of the given month for one person.
// Returns { days: [{ date, scale, meals, totals, cost, thaw }], avg } where each
// meal is { slot, recipe, servings, leftover, ahead }:
//   servings  portions to cook that day, in day-scaled units (0 for leftovers)
//   leftover  { date, frozen } when the meal was cooked on an earlier day
//   ahead     [{ date, slot, frozen }] later meals cooked in the same batch
// and `thaw` lists the frozen meals to take out of the freezer for the next day.
export function buildPlan({ profile, prices, year, month, variant = 0, cooking = 'daily' }) {
  const rng = mulberry32(hash(`${profile.id}|${year}-${month}|${variant}`))
  const mode = COOKING[cooking] ?? COOKING.daily
  const exclude = new Set(profile.exclude ?? [])
  const pool = RECIPES.filter((r) => !r.tags.some((t) => exclude.has(t)))
  const stats = new Map(pool.map((r) => [r.id, recipeStats(r, prices)]))

  // Fixed per-recipe penalty from the profile's likes and dislikes.
  const tagPenalty = new Map(
    pool.map((r) => {
      let pen = 0
      for (const [tag, cost] of Object.entries(profile.avoid ?? {})) if (r.tags.includes(tag)) pen += cost
      if (profile.prefer && !r.tags.some((t) => profile.prefer.includes(t))) pen += r.type === 'snack' ? 15 : 45
      return [r.id, pen]
    }),
  )
  const slotPools = profile.slots.map((s) => pool.filter((r) => s.from.includes(r.type)))
  // Later slots first, so dinner leftovers become the next day's lunch.
  const aheadOrder = profile.slots.map((_, i) => i).reverse()

  const lastUsed = new Map()
  const timesUsed = new Map()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const w = profile.weights
  const days = []
  // reserved[t] maps slot index -> { recipe, from, frozen } for meals cooked
  // before day t; reservedDays maps recipe id -> the days it is reserved for.
  const reserved = Array.from({ length: daysInMonth }, () => new Map())
  const reservedDays = new Map()

  // Where the extra portions of recipe r, cooked in slot `from` on day d, would
  // be eaten. `claimed` holds other placements made for the same day.
  const placeAhead = (d, from, r, claimed) => {
    const placed = []
    if (!(r.keeps || r.freezes)) return placed
    const others = () => claimed.concat(placed)
    const place = (t, frozen) => {
      if (t >= daysInMonth) return false
      const mine = others().filter((p) => p.day === t)
      if (reserved[t].size + mine.length >= mode.perDay) return false
      if ([...reserved[t].values(), ...mine].some((m) => m.recipe === r)) return false
      const slot = profile.slots.findIndex(
        (s, i) => s.from.includes(r.type) && !reserved[t].has(i) && !mine.some((p) => p.slot === i),
      )
      if (slot < 0) return false
      placed.push({ day: t, slot, from, recipe: r, frozen })
      return true
    }
    const within = Math.min(r.keeps ?? 0, mode.within)
    for (let t = d + 1; t <= d + within && placed.length < mode.fridge; t++) place(t, false)
    if (r.freezes && mode.freezer) {
      for (let t = d + FREEZER_DAYS[0]; t <= d + FREEZER_DAYS[1]; t++) if (place(t, true)) break
    }
    return placed
  }

  const planAhead = (d, choice, fixed) => {
    const placed = []
    if (!mode.perDay) return placed
    for (const i of aheadOrder) if (!fixed.has(i)) placed.push(...placeAhead(d, i, choice[i], placed))
    return placed
  }

  for (let d = 0; d < daysInMonth; d++) {
    const jitter = new Map(pool.map((r) => [r.id, rng() * 30]))
    const fixed = reserved[d]

    const repeatPenalty = (r) => {
      const [window, inWindow, perUse] = REPEAT[r.type]
      const last = lastUsed.get(r.id)
      // A portion already waiting in the fridge or freezer counts as eaten.
      const near = (last != null && d - last <= window) || reservedDays.get(r.id)?.some((t) => t > d && t - d <= window)
      return (near ? inWindow : 0) + perUse * (timesUsed.get(r.id) ?? 0)
    }

    const evaluate = (choice) => {
      const ids = choice.map((r) => r.id)
      if (new Set(ids).size !== ids.length) return { score: Infinity }
      const t = { kcal: 0, p: 0, f: 0, fib: 0, ca: 0, cost: 0 }
      let extra = 0
      for (const r of choice) {
        const s = stats.get(r.id)
        t.kcal += s.kcal
        t.p += s.p
        t.f += s.f
        t.fib += s.fib
        t.ca += s.ca
        t.cost += s.cost
        extra += tagPenalty.get(r.id) + repeatPenalty(r) + jitter.get(r.id)
      }
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, profile.kcal / t.kcal))
      const short = (n) => Math.max(0, profile.min[n] - scale * t[n])
      const score =
        w.cost * scale * t.cost +
        w.p * short('p') +
        w.fib * short('fib') +
        w.ca * short('ca') +
        FAT_PENALTY * Math.max(0, scale * (t.f - (MAX_FAT_SHARE * t.kcal) / 9)) +
        // Days that can only reach the energy target by scaling past the limits.
        Math.abs(scale * t.kcal - profile.kcal) * 0.5 +
        extra -
        AHEAD_BONUS * planAhead(d, choice, fixed).length
      return { score, scale }
    }

    // Start from the cheapest-looking option per slot, then improve one slot at a
    // time until nothing changes (coordinate descent). Slots filled by a meal
    // cooked on an earlier day stay as they are.
    let choice = slotPools.map(
      (options, i) =>
        fixed.get(i)?.recipe ??
        [...options].sort(
          (a, b) =>
            stats.get(a.id).cost / stats.get(a.id).kcal - stats.get(b.id).cost / stats.get(b.id).kcal ||
            a.id.localeCompare(b.id),
        )[i % options.length],
    )
    let best = evaluate(choice)
    for (let pass = 0; pass < 4; pass++) {
      let improved = false
      for (let i = 0; i < choice.length; i++) {
        if (fixed.has(i)) continue
        for (const r of slotPools[i]) {
          if (r === choice[i]) continue
          const trial = choice.slice()
          trial[i] = r
          const res = evaluate(trial)
          if (res.score < best.score) {
            best = res
            choice = trial
            improved = true
          }
        }
      }
      if (!improved) break
    }

    for (const r of choice) {
      lastUsed.set(r.id, d)
      timesUsed.set(r.id, (timesUsed.get(r.id) ?? 0) + 1)
    }
    const ahead = planAhead(d, choice, fixed)
    for (const p of ahead) {
      reserved[p.day].set(p.slot, { recipe: p.recipe, from: d, frozen: p.frozen })
      reservedDays.set(p.recipe.id, [...(reservedDays.get(p.recipe.id) ?? []), p.day])
    }

    const totals = Object.fromEntries(NUTRIENTS.map((n) => [n, 0]))
    let cost = 0
    for (const r of choice) {
      const s = stats.get(r.id)
      for (const n of NUTRIENTS) totals[n] += s[n] * best.scale
      cost += s.cost * best.scale
    }
    days.push({
      date: new Date(year, month, d + 1),
      scale: best.scale,
      meals: choice.map((recipe, i) => {
        const kept = fixed.get(i)
        return {
          slot: profile.slots[i].slot,
          recipe,
          leftover: kept ? { date: days[kept.from].date, frozen: kept.frozen } : null,
          ahead: ahead
            .filter((p) => p.from === i)
            .map((p) => ({ day: p.day, date: new Date(year, month, p.day + 1), slot: profile.slots[p.slot].slot, frozen: p.frozen })),
        }
      }),
      totals,
      cost,
      thaw: [],
    })
  }

  // Portions are cooked on the first day at each later day's scale.
  for (const [d, day] of days.entries()) {
    for (const meal of day.meals) {
      meal.servings = meal.leftover ? 0 : day.scale + meal.ahead.reduce((a, p) => a + days[p.day].scale, 0)
      if (meal.leftover?.frozen) days[d - 1].thaw.push(meal)
    }
  }

  const avg = Object.fromEntries(NUTRIENTS.map((n) => [n, days.reduce((a, day) => a + day.totals[n], 0) / days.length]))
  avg.cost = days.reduce((a, day) => a + day.cost, 0) / days.length
  return { days, avg }
}

// Total edible grams per food bought for the given days, for `people` people.
// Batches count on the day they are cooked.
export function ingredientTotals(days, people = 1) {
  const grams = {}
  for (const day of days) {
    for (const { recipe, servings } of day.meals) {
      for (const [code, g] of Object.entries(recipe.ing)) grams[code] = (grams[code] ?? 0) + g * servings * people
    }
  }
  return grams
}

// Turns edible grams into what to put in the basket: packs for packaged
// products, kilos for loose produce, and the cost of each line.
export function shoppingList(grams, prices) {
  const rows = []
  for (const [code, g] of Object.entries(grams)) {
    const food = FOODS[code]
    const price = prices[code]
    const buyKg = g / 1000 / (food.yield ?? 1)
    let row
    if (price.source === 'official') {
      const units = buyKg / (food.unitKg ?? 1) // in the site's unit: kg, l or 10 eggs
      const packSize = price.offer.size || price.item.pack || 1
      if (food.byWeight) {
        const qty = Math.ceil(units * 10) / 10
        row = { qty, unit: price.item.unit, cost: qty * price.unitPrice }
      } else {
        // Small tolerance so 1.02 packs' worth does not mean buying two.
        const packs = Math.max(1, Math.ceil(units / packSize - 0.05))
        row = { packs, packSize, unit: price.item.unit, cost: packs * packSize * price.unitPrice }
      }
    } else {
      const qty = Math.ceil(buyKg * 10) / 10
      row = { qty, unit: 'kg', cost: qty * price.unitPrice }
    }
    rows.push({ code, food, price, grams: g, ...row })
  }
  rows.sort((a, b) => b.cost - a.cost)
  const total = rows.reduce((a, r) => a + r.cost, 0)
  const estimated = rows.filter((r) => r.price.source === 'estimate').reduce((a, r) => a + r.cost, 0)
  return { rows, total, estimated, official: total - estimated }
}
