// Meals the planner can choose from. Quantities are grams of edible food for
// one adult portion; the planner scales whole days up or down to hit each
// profile's energy target.
//
// type: breakfast | main (lunch or dinner) | dinner (light, evening only) | snack
// tags: meat, fish, kid (children usually like it), light, soft (easy to chew),
//       sweet, fried

export const RECIPES = [
  // Breakfast
  {
    id: 'qull-tershere', type: 'breakfast', tags: ['kid', 'soft'],
    ing: { TERSHERE: 50, QUMESHT: 250, BANANE: 100, MJALTE: 10 },
    name: { sq: 'Qull tërshëre me qumësht dhe banane', en: 'Oat porridge with milk and banana' },
    steps: { sq: 'Zieni tërshërën në qumësht 5 minuta duke e përzier. Shtoni bananen e prerë dhe pak mjaltë.', en: 'Simmer the oats in milk for 5 minutes, stirring. Top with sliced banana and a little honey.' },
  },
  {
    id: 'veze-ziera-buke', type: 'breakfast', tags: ['kid'],
    ing: { VEZE: 100, BUKE: 70, DOMATE: 120, KASTRAVEC: 60 },
    name: { sq: 'Vezë të ziera me bukë, domate dhe kastravec', en: 'Boiled eggs with bread, tomato and cucumber' },
    steps: { sq: 'Zieni vezët 8–10 minuta. Shërbejini me bukë dhe perime të freskëta.', en: 'Boil the eggs for 8–10 minutes. Serve with bread and fresh vegetables.' },
  },
  {
    id: 'omelete-spinaq', type: 'breakfast', tags: [],
    ing: { VEZE: 100, SPINAQ: 60, DJATHE: 30, VAJ: 5, BUKE: 50 },
    name: { sq: 'Omëletë me spinaq dhe djathë', en: 'Spinach and cheese omelette' },
    steps: { sq: 'Kaurdisni spinaqin 2 minuta, hidhni vezët e rrahura dhe djathin e thërrmuar. Gatuajeni në zjarr të ulët.', en: 'Wilt the spinach for 2 minutes, add the beaten eggs and crumbled cheese. Cook on low heat.' },
  },
  {
    id: 'kos-molle-arra', type: 'breakfast', tags: ['light'],
    ing: { KOS: 200, MOLLE: 120, ARRA: 15, MJALTE: 10 },
    name: { sq: 'Kos me mollë, arra dhe mjaltë', en: 'Yogurt with apple, walnuts and honey' },
    steps: { sq: 'Grini mollën, shtojeni në kos me arrat e thyera dhe pak mjaltë.', en: 'Grate the apple into the yogurt, add crushed walnuts and a little honey.' },
  },
  {
    id: 'petulla', type: 'breakfast', tags: ['kid', 'fried'],
    ing: { MIELL: 70, VAJ: 15, DJATHE: 30, KOS: 100 },
    name: { sq: 'Petulla me djathë dhe kos', en: 'Petulla (fried dough) with cheese and yogurt' },
    steps: { sq: 'Përzieni miellin me ujë të vakët, kripë dhe maja; lëreni të vijë 1 orë. Skuqni me lugë në vaj të nxehtë.', en: 'Mix flour with warm water, salt and yeast; let it rise for an hour. Fry spoonfuls in hot oil.' },
  },
  {
    id: 'buke-djathe-qumesht', type: 'breakfast', tags: ['kid'],
    ing: { BUKE: 70, DJATHE: 40, DOMATE: 100, QUMESHT: 200 },
    name: { sq: 'Bukë me djathë të bardhë, domate dhe qumësht', en: 'Bread with white cheese, tomato and milk' },
    steps: { sq: 'Shërbejeni bukën me djathë dhe domate të prera, me një gotë qumësht.', en: 'Serve bread with cheese and sliced tomato, plus a glass of milk.' },
  },
  {
    id: 'veze-trazuara-kos', type: 'breakfast', tags: [],
    ing: { VEZE: 150, VAJ: 5, KOS: 150, BUKE_INTEGRALE: 60, DOMATE: 100 },
    name: { sq: 'Vezë të trazuara, kos dhe bukë integrale', en: 'Scrambled eggs, yogurt and wholegrain bread' },
    steps: { sq: 'Trazoni vezët në tigan me pak vaj. Shërbejini me kos, bukë integrale dhe domate.', en: 'Scramble the eggs in a little oil. Serve with yogurt, wholegrain bread and tomato.' },
  },
  {
    id: 'buke-gjalpe-mjalte', type: 'breakfast', tags: ['kid', 'sweet'],
    ing: { BUKE: 70, GJALPE: 10, MJALTE: 15, QUMESHT: 250 },
    name: { sq: 'Bukë me gjalpë e mjaltë dhe qumësht', en: 'Bread with butter and honey, glass of milk' },
    steps: { sq: 'Lyeni bukën me gjalpë dhe mjaltë. Shërbejeni me qumësht të ngrohtë.', en: 'Spread butter and honey on bread. Serve with warm milk.' },
  },
  {
    id: 'tershere-kos', type: 'breakfast', tags: ['light'],
    ing: { TERSHERE: 50, KOS: 200, MOLLE: 100, ARRA: 10 },
    name: { sq: 'Tërshërë me kos dhe mollë', en: 'Overnight oats with yogurt and apple' },
    steps: { sq: 'Përzieni tërshërën me kosin dhe lëreni në frigorifer natën. Në mëngjes shtoni mollën dhe arrat.', en: 'Mix oats with yogurt and leave in the fridge overnight. Add apple and walnuts in the morning.' },
  },

  // Lunch or dinner
  {
    id: 'fasule', type: 'main', tags: ['soft'],
    ing: { FASULE: 90, QEPE: 50, KAROTA: 40, SALCE: 15, VAJ: 12, BUKE: 60 },
    name: { sq: 'Fasule me qepë dhe karota', en: 'Albanian bean stew (fasule)' },
    steps: { sq: 'Lërini fasulet në ujë një natë. Zieni me qepë, karotë dhe salcë derisa të zbuten (rreth 1.5 orë).', en: 'Soak the beans overnight. Simmer with onion, carrot and tomato paste until tender (about 1.5 hours).' },
  },
  {
    id: 'supe-thjerreza', type: 'main', tags: ['soft'],
    ing: { THJERREZA: 80, QEPE: 40, KAROTA: 50, DOMATE: 80, VAJ: 10, BUKE: 60 },
    name: { sq: 'Supë e trashë me thjerrëza', en: 'Thick lentil soup' },
    steps: { sq: 'Kaurdisni qepën dhe karotën, shtoni thjerrëzat, domaten dhe ujë. Zieni 30 minuta.', en: 'Sauté onion and carrot, add lentils, tomato and water. Simmer for 30 minutes.' },
  },
  {
    id: 'pule-pilaf', type: 'main', tags: ['meat', 'kid'],
    ing: { PULE: 200, ORIZ: 80, GJALPE: 5, VAJ: 5, DOMATE: 100, KASTRAVEC: 80 },
    name: { sq: 'Pulë e pjekur me pilaf dhe sallatë', en: 'Roast chicken with rice pilaf and salad' },
    steps: { sq: 'Piqni pulën në 200°C rreth 1 orë. Gatuani orizin në lëngun e pulës me pak gjalpë.', en: 'Roast the chicken at 200°C for about an hour. Cook the rice in the chicken stock with a little butter.' },
  },
  {
    id: 'pule-patate', type: 'main', tags: ['meat', 'kid'],
    ing: { PULE: 200, PATATE: 250, QEPE: 30, VAJ: 15 },
    name: { sq: 'Pulë me patate në furrë', en: 'Oven-baked chicken with potatoes' },
    steps: { sq: 'Vendosni pulën dhe patatet e prera në tavë me qepë, vaj, kripë e rigon. Piqni 1 orë në 200°C.', en: 'Put chicken and sliced potatoes in a tray with onion, oil, salt and oregano. Bake 1 hour at 200°C.' },
  },
  {
    id: 'tave-kosi', type: 'main', tags: ['meat', 'kid', 'soft'],
    ing: { PULE: 170, KOS: 150, VEZE: 50, MIELL: 15, GJALPE: 10, ORIZ: 30 },
    name: { sq: 'Tavë kosi me pulë', en: 'Baked chicken with yogurt (tavë kosi)' },
    steps: { sq: 'Piqni pulën me orizin. Skuqni miellin në gjalpë, përzieni me kosin dhe vezën, hidheni sipër dhe piqni 30 minuta.', en: 'Bake the chicken with the rice. Cook the flour in butter, mix with yogurt and egg, pour over and bake 30 minutes.' },
  },
  {
    id: 'makarona-domate', type: 'main', tags: ['kid'],
    ing: { MAKARONA: 100, DOMATE: 150, QEPE: 30, VAJ: 10, DJATHE: 25 },
    name: { sq: 'Makarona me salcë domateje dhe djathë', en: 'Spaghetti with tomato sauce and cheese' },
    steps: { sq: 'Gatuani salcën me domate të grira dhe qepë 15 minuta. Përzieni me makaronat dhe djathin.', en: 'Cook grated tomatoes and onion for 15 minutes. Toss with the spaghetti and cheese.' },
  },
  {
    id: 'makarona-mish', type: 'main', tags: ['meat', 'kid'],
    ing: { MAKARONA: 100, MISH_GRIRE: 100, SALCE: 20, QEPE: 40, KAROTA: 30, VAJ: 8 },
    name: { sq: 'Makarona me mish të grirë', en: 'Spaghetti with meat sauce' },
    steps: { sq: 'Kaurdisni qepën, karotën dhe mishin. Shtoni salcën dhe pak ujë, zieni 20 minuta.', en: 'Brown onion, carrot and mince. Add tomato paste and a little water, simmer for 20 minutes.' },
  },
  {
    id: 'qofte-patate', type: 'main', tags: ['meat', 'kid'],
    ing: { MISH_GRIRE: 130, BUKE: 20, VEZE: 15, QEPE: 25, PATATE: 200, VAJ: 15, DOMATE: 100 },
    name: { sq: 'Qofte në furrë me patate dhe sallatë', en: 'Baked meatballs with potatoes and salad' },
    steps: { sq: 'Përzieni mishin me bukë të njomur, vezë, qepë dhe erëza. Formoni qofte dhe piqini me patatet 35 minuta.', en: 'Mix mince with soaked bread, egg, onion and herbs. Shape and bake with the potatoes for 35 minutes.' },
  },
  {
    id: 'speca-mbushur', type: 'main', tags: ['meat'],
    ing: { SPEC: 200, ORIZ: 50, MISH_GRIRE: 80, DOMATE: 80, QEPE: 30, VAJ: 10 },
    name: { sq: 'Speca të mbushur me oriz dhe mish', en: 'Peppers stuffed with rice and meat' },
    steps: { sq: 'Mbushni specat me mish, oriz, qepë e domate. Piqini të mbuluar 45 minuta në 190°C.', en: 'Fill the peppers with mince, rice, onion and tomato. Bake covered for 45 minutes at 190°C.' },
  },
  {
    id: 'byrek-spinaq', type: 'main', tags: ['kid'],
    ing: { MIELL: 100, SPINAQ: 150, DJATHE: 50, VEZE: 25, VAJ: 20, KOS: 150 },
    name: { sq: 'Byrek me spinaq e djathë, me kos', en: 'Spinach and cheese byrek with yogurt' },
    steps: { sq: 'Hapni petët, shtroni spinaqin e zier me djathë e vezë, mbulojeni dhe piqeni 40 minuta në 200°C. Shërbejeni me kos.', en: 'Roll out the pastry, fill with blanched spinach, cheese and egg, cover and bake 40 minutes at 200°C. Serve with yogurt.' },
  },
  {
    id: 'jahni-patate', type: 'main', tags: ['soft'],
    ing: { PATATE: 300, QEPE: 50, KAROTA: 50, SALCE: 15, VAJ: 15, BUKE: 60, DJATHE: 30 },
    name: { sq: 'Jahni me patate', en: 'Potato stew' },
    steps: { sq: 'Kaurdisni qepën, shtoni patatet, karotat, salcën dhe ujë sa t\'i mbulojë. Zieni 30 minuta.', en: 'Sauté the onion, add potatoes, carrots, tomato paste and water to cover. Simmer 30 minutes.' },
  },
  {
    id: 'laker-oriz', type: 'main', tags: [],
    ing: { LAKER: 300, ORIZ: 50, SALCE: 15, QEPE: 30, VAJ: 15, KOS: 150, BUKE: 40 },
    name: { sq: 'Lakër me oriz në tavë, me kos', en: 'Braised cabbage with rice and yogurt' },
    steps: { sq: 'Kaurdisni lakrën e grirë me qepë, shtoni orizin, salcën dhe ujë. Piqeni 30 minuta. Shërbejeni me kos.', en: 'Sauté shredded cabbage with onion, add rice, tomato paste and water. Bake 30 minutes. Serve with yogurt.' },
  },
  {
    id: 'peshk-patate', type: 'main', tags: ['fish'],
    ing: { PESHK: 180, PATATE: 250, VAJ: 15, DOMATE: 100, KASTRAVEC: 100 },
    name: { sq: 'Peshk në furrë me patate dhe sallatë', en: 'Baked fish with potatoes and salad' },
    steps: { sq: 'Piqni patatet 20 minuta, shtoni peshkun me limon e majdanoz dhe piqni edhe 15 minuta.', en: 'Bake the potatoes for 20 minutes, add the fish with lemon and parsley and bake 15 more minutes.' },
  },
  {
    id: 'sallate-ton', type: 'main', tags: ['fish', 'light'],
    ing: { TON: 100, FASULE: 40, VEZE: 50, DOMATE: 150, KASTRAVEC: 100, QEPE: 20, VAJ: 10, BUKE: 50 },
    name: { sq: 'Sallatë me ton, fasule dhe vezë', en: 'Tuna, bean and egg salad' },
    steps: { sq: 'Përzieni tonin, fasulet e ziera, vezën e zier dhe perimet e prera me vaj e uthull.', en: 'Toss tuna, cooked beans, boiled egg and chopped vegetables with oil and vinegar.' },
  },
  {
    id: 'supe-pule', type: 'main', tags: ['meat', 'kid', 'soft', 'light'],
    ing: { PULE: 120, ORIZ: 40, KAROTA: 50, QEPE: 30, PATATE: 80, VEZE: 25 },
    name: { sq: 'Supë pule me oriz dhe perime', en: 'Chicken soup with rice and vegetables' },
    steps: { sq: 'Zieni pulën me qepë e karotë 40 minuta. Shtoni patatet dhe orizin. Në fund trazoni vezën me limon.', en: 'Simmer the chicken with onion and carrot for 40 minutes. Add potatoes and rice. Finish with egg and lemon.' },
  },
  {
    id: 'omelete-patate', type: 'main', tags: ['kid'],
    ing: { VEZE: 150, PATATE: 200, QEPE: 30, VAJ: 12, DOMATE: 100, BUKE: 40 },
    name: { sq: 'Omëletë me patate', en: 'Potato omelette' },
    steps: { sq: 'Gatuani patatet e prera hollë me qepën derisa të zbuten. Hidhni vezët e rrahura dhe gatuajeni nga të dyja anët.', en: 'Cook thinly sliced potatoes with onion until soft. Add beaten eggs and cook on both sides.' },
  },
  {
    id: 'pilaf-perime', type: 'main', tags: ['kid'],
    ing: { ORIZ: 90, KAROTA: 50, SPEC: 50, KUNGULL: 80, VAJ: 12, KOS: 200 },
    name: { sq: 'Pilaf me perime dhe kos', en: 'Vegetable rice pilaf with yogurt' },
    steps: { sq: 'Kaurdisni perimet e prera kubikë, shtoni orizin dhe ujë dyfish. Gatuajeni 18 minuta. Shërbejeni me kos.', en: 'Sauté diced vegetables, add rice and twice as much water. Cook 18 minutes. Serve with yogurt.' },
  },
  {
    id: 'kunguj-tave', type: 'main', tags: [],
    ing: { KUNGULL: 300, VEZE: 100, DJATHE: 40, MIELL: 20, VAJ: 12, BUKE: 50 },
    name: { sq: 'Kunguj në tavë me vezë dhe djathë', en: 'Baked zucchini with eggs and cheese' },
    steps: { sq: 'Grini kungujt, përzieni me vezët, djathin dhe miellin. Piqeni në tavë 35 minuta në 190°C.', en: 'Grate the zucchini, mix with eggs, cheese and flour. Bake in a dish for 35 minutes at 190°C.' },
  },
  {
    id: 'pule-skare-sallate', type: 'main', tags: ['meat', 'light'],
    ing: { PULE: 220, DOMATE: 150, KASTRAVEC: 150, VAJ: 10, BUKE_INTEGRALE: 50 },
    name: { sq: 'Pulë në skarë me sallatë', en: 'Grilled chicken with salad' },
    steps: { sq: 'Piqni copat e pulës në skarë ose tigan. Shërbejini me sallatë domate e kastravec.', en: 'Grill or pan-fry the chicken pieces. Serve with tomato and cucumber salad.' },
  },
  {
    id: 'spinaq-oriz', type: 'main', tags: ['soft'],
    ing: { SPINAQ: 250, ORIZ: 60, QEPE: 30, VAJ: 10, VEZE: 50, KOS: 150 },
    name: { sq: 'Spinaq me oriz, vezë dhe kos', en: 'Spinach rice with egg and yogurt' },
    steps: { sq: 'Kaurdisni qepën, shtoni spinaqin dhe orizin me pak ujë. Gatuajeni 20 minuta. Shërbejeni me vezë të zier dhe kos.', en: 'Sauté onion, add spinach and rice with a little water. Cook 20 minutes. Serve with a boiled egg and yogurt.' },
  },
  {
    id: 'makarona-ton', type: 'main', tags: ['fish'],
    ing: { MAKARONA: 100, TON: 80, DOMATE: 150, VAJ: 8, QEPE: 20 },
    name: { sq: 'Makarona me ton dhe domate', en: 'Spaghetti with tuna and tomatoes' },
    steps: { sq: 'Gatuani domatet me qepë 10 minuta, shtoni tonin. Përzieni me makaronat.', en: 'Cook the tomatoes with onion for 10 minutes, add the tuna. Toss with the spaghetti.' },
  },
  {
    id: 'laker-mish', type: 'main', tags: ['meat'],
    ing: { LAKER: 250, MISH_GRIRE: 80, ORIZ: 40, SALCE: 15, VAJ: 10, BUKE: 40 },
    name: { sq: 'Lakër me mish', en: 'Cabbage with minced meat' },
    steps: { sq: 'Kaurdisni mishin, shtoni lakrën e grirë, orizin, salcën dhe ujë. Zieni 35 minuta.', en: 'Brown the mince, add shredded cabbage, rice, tomato paste and water. Simmer 35 minutes.' },
  },

  {
    id: 'pule-zier-perime', type: 'main', tags: ['meat', 'kid', 'soft', 'light'],
    ing: { PULE: 180, PATATE: 150, KAROTA: 80, KUNGULL: 100, QEPE: 30, VAJ: 5 },
    name: { sq: 'Pulë e zier me perime', en: 'Poached chicken with vegetables' },
    steps: { sq: 'Zieni pulën me qepë 30 minuta, shtoni patatet, karotat dhe kungujt dhe zieni edhe 20 minuta.', en: 'Simmer the chicken with onion for 30 minutes, add potatoes, carrots and zucchini and cook 20 minutes more.' },
  },
  {
    id: 'thjerreza-oriz', type: 'main', tags: ['soft'],
    ing: { THJERREZA: 70, ORIZ: 50, QEPE: 60, VAJ: 10, KOS: 150 },
    name: { sq: 'Thjerrëza me oriz dhe qepë të kaurdisur, me kos', en: 'Lentils and rice with caramelised onion and yogurt' },
    steps: { sq: 'Zieni thjerrëzat 15 minuta, shtoni orizin dhe gatuajeni edhe 18 minuta. Sipër hidhni qepën e kaurdisur. Shërbejeni me kos.', en: 'Boil the lentils 15 minutes, add the rice and cook 18 minutes more. Top with fried onion. Serve with yogurt.' },
  },
  {
    id: 'peshk-perime', type: 'main', tags: ['fish', 'light'],
    ing: { PESHK: 200, KUNGULL: 150, SPEC: 100, DOMATE: 100, VAJ: 8, BUKE_INTEGRALE: 40 },
    name: { sq: 'Peshk me perime në furrë', en: 'Fish baked with vegetables' },
    steps: { sq: 'Shtroni perimet e prera në tavë, vendosni peshkun sipër me limon e hudhër. Piqeni 25 minuta në 200°C.', en: 'Lay the sliced vegetables in a tray, put the fish on top with lemon and garlic. Bake 25 minutes at 200°C.' },
  },
  {
    id: 'sallate-fasule', type: 'main', tags: ['light'],
    ing: { FASULE: 70, DOMATE: 150, KASTRAVEC: 80, QEPE: 30, DJATHE: 30, VAJ: 8, BUKE_INTEGRALE: 40 },
    name: { sq: 'Sallatë me fasule, domate dhe djathë', en: 'Bean salad with tomato and cheese' },
    steps: { sq: 'Përzieni fasulet e ziera me perimet e prera, djathin, vajin dhe uthullën.', en: 'Toss cooked beans with chopped vegetables, cheese, oil and vinegar.' },
  },

  // Light evening meals
  {
    id: 'supe-perime', type: 'dinner', tags: ['light', 'soft', 'kid'],
    ing: { PATATE: 100, KAROTA: 80, KUNGULL: 100, QEPE: 40, VAJ: 10, BUKE: 50, DJATHE: 30 },
    name: { sq: 'Supë perimesh me bukë dhe djathë', en: 'Vegetable soup with bread and cheese' },
    steps: { sq: 'Zieni perimet e prera 25 minuta. Shtypini pjesërisht. Shërbejeni me bukë dhe djathë.', en: 'Simmer the chopped vegetables for 25 minutes. Partly mash. Serve with bread and cheese.' },
  },
  {
    id: 'darke-kos-djathe', type: 'dinner', tags: ['light', 'kid'],
    ing: { KOS: 200, BUKE: 60, DJATHE: 40, DOMATE: 100, KASTRAVEC: 100 },
    name: { sq: 'Kos, bukë, djathë dhe sallatë', en: 'Yogurt, bread, cheese and salad' },
    steps: { sq: 'Darkë e lehtë pa gatim: shërbejeni kosin me bukë, djathë dhe sallatë të freskët.', en: 'A light no-cook supper: yogurt with bread, cheese and a fresh salad.' },
  },
  {
    id: 'veze-sallate-fshati', type: 'dinner', tags: ['light'],
    ing: { VEZE: 100, DOMATE: 150, KASTRAVEC: 150, DJATHE: 30, VAJ: 8, BUKE_INTEGRALE: 40 },
    name: { sq: 'Vezë të ziera me sallatë fshati', en: 'Boiled eggs with village salad' },
    steps: { sq: 'Zieni vezët. Pritni domatet e kastravecin, shtoni djathin dhe vajin.', en: 'Boil the eggs. Chop tomatoes and cucumber, add cheese and oil.' },
  },

  // Snacks
  { id: 'molle', type: 'snack', tags: ['kid', 'light'], ing: { MOLLE: 150 }, name: { sq: 'Një mollë', en: 'An apple' } },
  { id: 'banane', type: 'snack', tags: ['kid', 'soft'], ing: { BANANE: 120 }, name: { sq: 'Një banane', en: 'A banana' } },
  { id: 'portokall', type: 'snack', tags: ['kid', 'light'], ing: { PORTOKALL: 180 }, name: { sq: 'Një portokall', en: 'An orange' } },
  { id: 'kos-mjalte', type: 'snack', tags: ['kid', 'soft'], ing: { KOS: 150, MJALTE: 8 }, name: { sq: 'Kos me pak mjaltë', en: 'Yogurt with a little honey' } },
  { id: 'arra-molle', type: 'snack', tags: [], ing: { ARRA: 20, MOLLE: 120 }, name: { sq: 'Arra dhe një mollë', en: 'Walnuts and an apple' } },
  {
    id: 'sutlijash', type: 'snack', tags: ['kid', 'sweet', 'soft'], ing: { ORIZ: 30, QUMESHT: 200, SHEQER: 15 },
    name: { sq: 'Sutlijash', en: 'Rice pudding (sutlijash)' },
    steps: { sq: 'Zieni orizin në qumësht me sheqer 30 minuta duke e përzier. Shërbejeni me kanellë.', en: 'Simmer the rice in milk with sugar for 30 minutes, stirring. Serve with cinnamon.' },
  },
  { id: 'veze-ziera', type: 'snack', tags: [], ing: { VEZE: 100 }, name: { sq: 'Dy vezë të ziera', en: 'Two boiled eggs' } },
  { id: 'gote-qumesht', type: 'snack', tags: ['kid'], ing: { QUMESHT: 250 }, name: { sq: 'Një gotë qumësht', en: 'A glass of milk' } },
  {
    id: 'kek-shtepie', type: 'snack', tags: ['kid', 'sweet'], ing: { MIELL: 30, SHEQER: 15, VEZE: 15, VAJ: 8, QUMESHT: 30 },
    name: { sq: 'Një fetë kek shtëpie', en: 'A slice of homemade cake' },
    steps: { sq: 'Rrihni vezët me sheqerin, shtoni vajin, qumështin dhe miellin me pluhur pjekjeje. Piqeni 35 minuta në 180°C.', en: 'Beat eggs with sugar, add oil, milk and flour with baking powder. Bake 35 minutes at 180°C.' },
  },
  { id: 'sanduic-djathe', type: 'snack', tags: ['kid'], ing: { BUKE: 40, DJATHE: 30, DOMATE: 60 }, name: { sq: 'Sanduiç me djathë dhe domate', en: 'Cheese and tomato sandwich' } },
  {
    id: 'tarator', type: 'snack', tags: ['light'], ing: { KOS: 150, KASTRAVEC: 100, KAROTA: 60 },
    name: { sq: 'Taratorë me karota të freskëta', en: 'Taratorë (yogurt with cucumber) and carrot sticks' },
    steps: { sq: 'Grini kastravecin në kos me pak hudhër, kripë dhe ujë të ftohtë. Shërbejeni me karota të prera.', en: 'Grate the cucumber into yogurt with a little garlic, salt and cold water. Serve with carrot sticks.' },
  },
  { id: 'kos-banane', type: 'snack', tags: ['kid', 'soft'], ing: { KOS: 150, BANANE: 80 }, name: { sq: 'Kos me banane', en: 'Yogurt with banana' } },
]
