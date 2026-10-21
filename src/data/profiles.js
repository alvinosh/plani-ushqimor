// Diet profiles. Targets are per person per day.
//
// kcal        energy the day's portions are scaled to
// min         nutrient floors the planner tries to reach (protein g, fibre g, calcium mg)
// slots       the meals of the day, each filled from the listed recipe types
// weights     how much a shortfall costs the planner, in "lekë-equivalents":
//             cost per lekë spent, protein per gram short, fibre per gram short,
//             calcium per mg short
// exclude     recipes with any of these tags are never used
// avoid       extra penalty per meal carrying the tag
// prefer      penalty for each meal that has none of these tags
//
// Every profile also keeps fat under 35% of energy (EFSA range 20–35%).
//
// Sources for the targets: EFSA dietary reference values, US IOM DRIs for
// calcium, ISSN position stand for high-protein diets (1.6–2.2 g/kg), and
// PROT-AGE for older adults (1.0–1.2 g/kg).

const BREAKFAST = { slot: 'breakfast', from: ['breakfast'] }
const LUNCH = { slot: 'lunch', from: ['main'] }
const DINNER = { slot: 'dinner', from: ['main', 'dinner'] }
const SNACK = { slot: 'snack', from: ['snack'] }

export const PROFILES = [
  {
    id: 'balanced',
    icon: '⚖️',
    name: { sq: 'E balancuar', en: 'Balanced' },
    who: { sq: 'Të rritur me aktivitet mesatar', en: 'Adults with moderate activity' },
    kcal: 2200,
    min: { p: 75, fib: 25, ca: 1000 },
    slots: [BREAKFAST, LUNCH, SNACK, DINNER],
    weights: { cost: 1, p: 6, fib: 8, ca: 0.15 },
    avoid: { fried: 70, sweet: 70 },
    guide: {
      sq: [
        'Tre vakte kryesore dhe një mes-vakt me fruta ose kos.',
        'Bishtajore (fasule, thjerrëza) të paktën 2 herë në javë.',
        'Peshk 1–2 herë në javë, pulë ose vezë në ditët e tjera.',
        'Pini 1.5–2 litra ujë në ditë; kufizoni pijet me sheqer.',
      ],
      en: [
        'Three main meals and one snack of fruit or yogurt.',
        'Legumes (beans, lentils) at least twice a week.',
        'Fish once or twice a week, chicken or eggs on other days.',
        'Drink 1.5–2 litres of water a day; limit sugary drinks.',
      ],
    },
  },
  {
    id: 'children',
    icon: '🧒',
    name: { sq: 'Për fëmijë (4–10 vjeç)', en: 'Children (4–10 years)' },
    who: { sq: 'Porcione për një fëmijë në moshë shkollore', en: 'Portions for one school-age child' },
    kcal: 1500,
    min: { p: 35, fib: 18, ca: 1000 },
    slots: [BREAKFAST, SNACK, LUNCH, SNACK, DINNER],
    weights: { cost: 1, p: 8, fib: 6, ca: 0.4 },
    avoid: { fried: 60, sweet: 40 },
    prefer: ['kid'],
    guide: {
      sq: [
        'Qumësht ose kos çdo ditë (2–3 racione) për kalciumin.',
        'Fruta në vend të ëmbëlsirave; ëmbëlsirat vetëm herë pas here.',
        'Arrat jepini të grira tek fëmijët më të vegjël, për të shmangur mbytjen.',
        'Ujë në vend të lëngjeve dhe pijeve të gazuara.',
        'Nevojat ndryshojnë sipas moshës dhe aktivitetit; konsultohuni me pediatrin.',
      ],
      en: [
        'Milk or yogurt every day (2–3 servings) for calcium.',
        'Fruit instead of sweets; treats only now and then.',
        'Give walnuts ground for younger children to avoid choking.',
        'Water instead of juice and fizzy drinks.',
        'Needs vary with age and activity; check with your paediatrician.',
      ],
    },
  },
  {
    id: 'highprotein',
    icon: '💪',
    name: { sq: 'Me shumë proteina', en: 'High protein' },
    who: { sq: 'Për stërvitje forcë / ndërtim muskujsh (~75 kg)', en: 'For strength training / muscle gain (~75 kg)' },
    kcal: 2600,
    min: { p: 140, fib: 25, ca: 1000 },
    slots: [BREAKFAST, SNACK, LUNCH, SNACK, DINNER],
    weights: { cost: 0.6, p: 15, fib: 4, ca: 0.1 },
    avoid: { sweet: 120, fried: 40 },
    guide: {
      sq: [
        'Rreth 1.6–2 g proteinë për kg peshë trupore në ditë.',
        'Ndajeni proteinën në 4–5 vakte (vezë, pulë, kos, ton).',
        'Pulë e plotë është shpesh më e lirë për kg proteinë se fileto; hiqni lëkurën.',
        'Mos harroni perimet dhe ujin; proteina e lartë kërkon më shumë lëngje.',
      ],
      en: [
        'Around 1.6–2 g of protein per kg of body weight per day.',
        'Spread protein over 4–5 meals (eggs, chicken, yogurt, tuna).',
        'A whole chicken is often cheaper per gram of protein than fillets; remove the skin.',
        'Keep up vegetables and water; high protein needs more fluids.',
      ],
    },
  },
  {
    id: 'budget',
    icon: '💰',
    name: { sq: 'Ekonomike', en: 'Budget' },
    who: { sq: 'Kosto sa më e ulët, ushqyerje e plotë', en: 'Lowest cost that still covers the basics' },
    kcal: 2200,
    min: { p: 65, fib: 25, ca: 800 },
    slots: [BREAKFAST, LUNCH, SNACK, DINNER],
    weights: { cost: 3, p: 5, fib: 6, ca: 0.1 },
    avoid: { fried: 150, sweet: 150 },
    guide: {
      sq: [
        'Bazohet te bishtajoret, orizi, makaronat, patatet dhe vezët.',
        'Blini pulë të plotë dhe përdoreni për dy vakte (mish + supë).',
        'Kontrolloni promocionet e javës: plani përditësohet sipas tyre.',
        'Gatuani më shumë dhe ruani porcione për ditën tjetër.',
      ],
      en: [
        'Built on legumes, rice, pasta, potatoes and eggs.',
        'Buy whole chickens and stretch them over two meals (meat + soup).',
        'Watch the weekly promotions: the plan updates around them.',
        'Cook in batches and keep portions for the next day.',
      ],
    },
  },
  {
    id: 'weightloss',
    icon: '🥗',
    name: { sq: 'Për humbje peshe', en: 'Weight loss' },
    who: { sq: 'Deficit kalorik i moderuar, shumë fibra e proteina', en: 'Moderate calorie deficit, high fibre and protein' },
    kcal: 1600,
    min: { p: 100, fib: 25, ca: 1000 },
    slots: [BREAKFAST, LUNCH, SNACK, DINNER],
    weights: { cost: 0.8, p: 14, fib: 10, ca: 0.3 },
    exclude: ['sweet', 'fried'],
    guide: {
      sq: [
        'Rreth 1600 kcal në ditë; mos zbrisni nën 1200 pa mbikëqyrje mjekësore.',
        'Gjysma e pjatës perime, një çerek proteinë, një çerek drithëra.',
        'Pa ëmbëlsira e ushqime të skuqura; vaj me masë (1 lugë gjelle për vakt).',
        'Synoni 0.5 kg humbje në javë, jo më shumë.',
      ],
      en: [
        'About 1600 kcal a day; do not go below 1200 without medical supervision.',
        'Half the plate vegetables, a quarter protein, a quarter grains.',
        'No sweets or fried food; measure oil (one tablespoon per meal).',
        'Aim for about 0.5 kg loss per week, not more.',
      ],
    },
  },
  {
    id: 'vegetarian',
    icon: '🥕',
    name: { sq: 'Vegjetariane', en: 'Vegetarian' },
    who: { sq: 'Pa mish e peshk; me vezë dhe bulmet', en: 'No meat or fish; includes eggs and dairy' },
    kcal: 2100,
    min: { p: 70, fib: 28, ca: 1000 },
    slots: [BREAKFAST, LUNCH, SNACK, DINNER],
    weights: { cost: 1, p: 8, fib: 6, ca: 0.15 },
    exclude: ['meat', 'fish'],
    avoid: { fried: 70, sweet: 70 },
    guide: {
      sq: [
        'Proteina vjen nga vezët, kosi, djathi dhe bishtajoret.',
        'Kombinoni bishtajoret me drithëra (fasule + bukë, thjerrëza + oriz).',
        'Hekuri nga bishtajoret thithet më mirë me vitaminë C (domate, portokall).',
        'Vitamina B12 vjen vetëm nga vezët dhe bulmeti: hani çdo ditë.',
      ],
      en: [
        'Protein comes from eggs, yogurt, cheese and legumes.',
        'Pair legumes with grains (beans + bread, lentils + rice).',
        'Iron from legumes absorbs better with vitamin C (tomato, orange).',
        'Vitamin B12 only comes from eggs and dairy here: have them daily.',
      ],
    },
  },
  {
    id: 'seniors',
    icon: '👵',
    name: { sq: 'Për të moshuar (65+)', en: 'Older adults (65+)' },
    who: { sq: 'Ushqime të buta, më shumë kalcium e proteinë', en: 'Softer foods, more calcium and protein' },
    kcal: 1900,
    min: { p: 80, fib: 25, ca: 1200 },
    slots: [BREAKFAST, LUNCH, SNACK, DINNER],
    weights: { cost: 1, p: 8, fib: 6, ca: 0.4 },
    avoid: { fried: 80, sweet: 30 },
    prefer: ['soft'],
    guide: {
      sq: [
        '1.0–1.2 g proteinë për kg në ditë ndihmon ruajtjen e muskujve.',
        'Bulmet çdo ditë për kockat (kalcium 1200 mg).',
        'Supa dhe gjellë të buta, të lehta për t\'u përtypur.',
        'Pini ujë rregullisht edhe kur nuk keni etje.',
        'Nëse keni diabet, tension ose sëmundje veshkash, konsultohuni me mjekun.',
      ],
      en: [
        '1.0–1.2 g of protein per kg a day helps preserve muscle.',
        'Dairy every day for bone health (calcium 1200 mg).',
        'Soups and soft stews that are easy to chew.',
        'Drink water regularly, even when not thirsty.',
        'With diabetes, high blood pressure or kidney disease, check with your doctor.',
      ],
    },
  },
]

export const profileById = Object.fromEntries(PROFILES.map((p) => [p.id, p]))
