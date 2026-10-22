# Plani Ushqimor

Monthly meal plans for different diets (children, high protein, budget, weight loss, vegetarian, older adults, balanced), priced with the official supermarket prices from [Pasqyra e Çmimeve](https://pasqyraecmimeve.al), the Ministry of Economy and Innovation's price platform.

Static React (Vite) site, hosted on GitHub Pages.

Created by Alvi Hysa ([GitHub](https://github.com/alvinosh) · [LinkedIn](https://www.linkedin.com/in/alvi-hysa)).

## Updating prices

Once a day:

```sh
npm run update
```

This fetches the latest prices into `public/data/`, commits them, and pushes. The push triggers `.github/workflows/deploy.yml`, which rebuilds the site. Use `npm run update -- --no-push` to commit without pushing.

If the site's page structure changes and the scraper can't find the product list, the script exits with an error and leaves the existing data untouched.

Promotions are stored with their start and end dates and switched on in the browser, so a promo that starts between updates is still applied on the right day.

## How it works

- `scripts/lib/catalogue.mjs`: the site is a Next.js app, and every `/grupi/*` page embeds the full catalogue (products, prices per chain, cities, promos, store-only prices) in its server-components payload. This module extracts and normalises it.
- `scripts/fetch-prices.mjs` writes `public/data/prices.json` and appends a daily cheapest/median price per category to `public/data/history.json` (used for the trend lines).
- `src/data/foods.js`: nutrition per 100 g for each ingredient, and which site category it maps to. Foods the site doesn't track yet (bread, legumes, cheese, most vegetables) have an `est` price in lekë/kg. Edit those if they drift. When the site starts publishing a category (e.g. `BISHTAJORE`, `DJATHE`, `PATATE`), the official price is used automatically.
- `src/data/recipes.js`: the dishes, with grams per adult portion, how many days each keeps in the fridge (`keeps`) and whether it freezes (`freezes`).
- `src/data/profiles.js`: each diet's calorie target, protein/fibre/calcium minimums, meal slots, and how strongly it weighs cost against nutrition.
- `src/lib/planner.js`: builds each day of the month by picking the meal combination with the best score (cost plus nutrient shortfalls plus repetition penalties), then scales portions to the calorie target.
  Depending on the "How often do you cook?" setting, dishes that keep are cooked in bigger batches and the extra portions are scheduled as fridge leftovers on the next days or, for dishes that freeze, as a freezer meal a week later. The shopping list counts a batch on the day it is cooked.

## Development

```sh
npm install
npm run fetch-prices   # refresh public/data without committing
npm run dev
```

## GitHub Pages setup (once)

1. Push this repo to GitHub with `main` as the default branch.
2. Settings → Pages → Source: **GitHub Actions**.

The build uses relative paths, so it works under any repository name.
