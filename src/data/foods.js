// Ingredients used by the recipes.
//
// Nutrition is per 100 g of edible food (raw), from standard food composition
// tables (USDA FoodData Central, rounded).
//   kcal, p = protein g, c = carbs g, f = fat g, fib = fibre g, ca = calcium mg
//
// Pricing:
//   kat      category code on pasqyraecmimeve.al. When the site has products in
//            that category, the official price is used automatically.
//   match    optional regex on the product name, for categories that hold several
//            foods (e.g. beans and lentils both live in BISHTAJORE).
//   unitKg   kg of food per price unit on the site (1 l of oil = 0.92 kg,
//            "10 vezë" = 10 eggs ≈ 0.5 kg edible). Defaults to 1.
//   yield    edible share of what you buy (peel, bones, shells). Defaults to 1.
//   byWeight sold loose by weight rather than in fixed packs.
//   est      ESTIMATED lekë per kg, used only while the site does not track the
//            food. These are rough Tirana supermarket prices for autumn 2026;
//            edit them here if they drift.

export const FOODS = {
  // Tracked on pasqyraecmimeve.al
  MIELL: { kat: 'MIELL', name: { sq: 'Miell gruri', en: 'Wheat flour' }, kcal: 364, p: 10.3, c: 76.3, f: 1, fib: 2.7, ca: 15 },
  ORIZ: { kat: 'ORIZ', name: { sq: 'Oriz', en: 'Rice' }, kcal: 365, p: 7.1, c: 80, f: 0.7, fib: 1.3, ca: 28 },
  MAKARONA: { kat: 'MAKARONA', name: { sq: 'Makarona spageti', en: 'Spaghetti' }, kcal: 371, p: 13, c: 74.7, f: 1.5, fib: 3.2, ca: 21 },
  VAJ: { kat: 'VAJ', name: { sq: 'Vaj luledielli', en: 'Sunflower oil' }, unitKg: 0.92, kcal: 884, p: 0, c: 0, f: 100, fib: 0, ca: 0 },
  SHEQER: { kat: 'SHEQER', name: { sq: 'Sheqer', en: 'Sugar' }, kcal: 387, p: 0, c: 100, f: 0, fib: 0, ca: 1 },
  QUMESHT: { kat: 'QUMESHT', name: { sq: 'Qumësht', en: 'Milk' }, unitKg: 1.03, kcal: 56, p: 3.3, c: 4.8, f: 2.5, fib: 0, ca: 120 },
  KOS: { kat: 'KOS', name: { sq: 'Kos', en: 'Yogurt' }, kcal: 58, p: 3.6, c: 4.7, f: 2.8, fib: 0, ca: 125 },
  GJALPE: { kat: 'GJALPE', name: { sq: 'Gjalpë', en: 'Butter' }, kcal: 717, p: 0.9, c: 0.1, f: 81, fib: 0, ca: 24 },
  VEZE: { kat: 'VEZE', name: { sq: 'Vezë', en: 'Eggs' }, unitKg: 0.5, kcal: 143, p: 12.6, c: 0.7, f: 9.5, fib: 0, ca: 56 },
  // Whole chicken bought; meat without skin eaten (about 55% of the bird).
  PULE: { kat: 'PULE', name: { sq: 'Pulë', en: 'Chicken' }, yield: 0.55, byWeight: true, kcal: 119, p: 21.4, c: 0, f: 3.1, fib: 0, ca: 12 },
  BANANE: { kat: 'BANANE', name: { sq: 'Banane', en: 'Bananas' }, yield: 0.65, byWeight: true, kcal: 89, p: 1.1, c: 22.8, f: 0.3, fib: 2.6, ca: 5 },
  MOLLE: { kat: 'MOLLE', name: { sq: 'Mollë', en: 'Apples' }, yield: 0.9, byWeight: true, kcal: 52, p: 0.3, c: 13.8, f: 0.2, fib: 2.4, ca: 6 },
  DOMATE: { kat: 'DOMATE', name: { sq: 'Domate', en: 'Tomatoes' }, yield: 0.95, byWeight: true, kcal: 18, p: 0.9, c: 3.9, f: 0.2, fib: 1.2, ca: 10 },

  // Category defined on the site but not populated yet: estimated until it is
  FASULE: { kat: 'BISHTAJORE', match: /FASUL/i, est: 380, name: { sq: 'Fasule të thata', en: 'Dried beans' }, kcal: 333, p: 23.4, c: 60.3, f: 0.9, fib: 15.2, ca: 240 },
  THJERREZA: { kat: 'BISHTAJORE', match: /THJERR/i, est: 300, name: { sq: 'Thjerrëza', en: 'Lentils' }, kcal: 352, p: 24.6, c: 63.4, f: 1.1, fib: 10.7, ca: 35 },
  DJATHE: { kat: 'DJATHE', match: /BARDH|FETA/i, est: 750, name: { sq: 'Djathë i bardhë', en: 'White cheese' }, kcal: 264, p: 14.2, c: 4.1, f: 21.3, fib: 0, ca: 493 },
  MISH_GRIRE: { kat: 'MISH-VICI', match: /GRIR/i, est: 1100, name: { sq: 'Mish viçi i grirë', en: 'Minced beef' }, kcal: 215, p: 18.6, c: 0, f: 15, fib: 0, ca: 18 },
  BUKE: { kat: 'BUKE-BARDHE', est: 140, name: { sq: 'Bukë e bardhë', en: 'White bread' }, kcal: 266, p: 8.9, c: 49.4, f: 3.3, fib: 2.7, ca: 50 },
  BUKE_INTEGRALE: { kat: 'BUKE-INTEGRALE', est: 260, name: { sq: 'Bukë integrale', en: 'Wholegrain bread' }, kcal: 252, p: 12.5, c: 42.7, f: 3.5, fib: 6, ca: 100 },
  PORTOKALL: { kat: 'PORTOKALL', est: 120, name: { sq: 'Portokall', en: 'Oranges' }, yield: 0.73, byWeight: true, kcal: 47, p: 0.9, c: 11.8, f: 0.1, fib: 2.4, ca: 40 },
  KASTRAVEC: { kat: 'KASTRAVEC', est: 120, name: { sq: 'Kastravec', en: 'Cucumber' }, yield: 0.97, byWeight: true, kcal: 15, p: 0.7, c: 3.6, f: 0.1, fib: 0.5, ca: 16 },
  PATATE: { kat: 'PATATE', match: /PATATE/i, est: 80, name: { sq: 'Patate', en: 'Potatoes' }, yield: 0.85, byWeight: true, kcal: 77, p: 2, c: 17.5, f: 0.1, fib: 2.2, ca: 12 },
  TON: { kat: 'KONSERVA', match: /\bTON\b|TUNA/i, est: 1500, name: { sq: 'Ton konservë', en: 'Canned tuna' }, yield: 0.75, kcal: 198, p: 29.1, c: 0, f: 8.2, fib: 0, ca: 13 },
  SALCE: { kat: 'KONSERVA', match: /SALC|PASTE|PELAT/i, est: 380, name: { sq: 'Salcë domateje', en: 'Tomato paste' }, kcal: 82, p: 4.3, c: 18.9, f: 0.5, fib: 4.1, ca: 36 },

  // Not covered by the site at all: always estimated
  PESHK: { est: 800, name: { sq: 'Fileto peshku (merluc)', en: 'Fish fillet (hake)' }, yield: 0.95, kcal: 86, p: 18, c: 0, f: 1.3, fib: 0, ca: 20 },
  QEPE: { est: 90, name: { sq: 'Qepë', en: 'Onions' }, yield: 0.9, byWeight: true, kcal: 40, p: 1.1, c: 9.3, f: 0.1, fib: 1.7, ca: 23 },
  KAROTA: { est: 90, name: { sq: 'Karota', en: 'Carrots' }, yield: 0.88, byWeight: true, kcal: 41, p: 0.9, c: 9.6, f: 0.2, fib: 2.8, ca: 33 },
  LAKER: { est: 70, name: { sq: 'Lakër', en: 'Cabbage' }, yield: 0.85, byWeight: true, kcal: 25, p: 1.3, c: 5.8, f: 0.1, fib: 2.5, ca: 40 },
  SPINAQ: { est: 200, name: { sq: 'Spinaq', en: 'Spinach' }, yield: 0.85, byWeight: true, kcal: 23, p: 2.9, c: 3.6, f: 0.4, fib: 2.2, ca: 99 },
  SPEC: { est: 170, name: { sq: 'Speca', en: 'Peppers' }, yield: 0.85, byWeight: true, kcal: 20, p: 0.9, c: 4.6, f: 0.2, fib: 1.7, ca: 10 },
  KUNGULL: { est: 130, name: { sq: 'Kungulleshkë', en: 'Zucchini' }, yield: 0.95, byWeight: true, kcal: 17, p: 1.2, c: 3.1, f: 0.3, fib: 1, ca: 16 },
  TERSHERE: { est: 400, name: { sq: 'Tërshërë', en: 'Oats' }, kcal: 379, p: 13.2, c: 67.7, f: 6.5, fib: 10.1, ca: 52 },
  ARRA: { est: 1500, name: { sq: 'Arra', en: 'Walnuts' }, kcal: 654, p: 15.2, c: 13.7, f: 65.2, fib: 6.7, ca: 98 },
  MJALTE: { est: 1300, name: { sq: 'Mjaltë', en: 'Honey' }, kcal: 304, p: 0.3, c: 82.4, f: 0, fib: 0.2, ca: 6 },
}

export const NUTRIENTS = ['kcal', 'p', 'c', 'f', 'fib', 'ca']
