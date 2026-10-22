const CONTENT = {
  sq: (
    <>
      <h1>Si funksionon</h1>
      <h2>Të dhënat</h2>
      <p>
        Çmimet vijnë nga <a href="https://pasqyraecmimeve.al">Pasqyra e Çmimeve</a>, platforma e Ministrisë së
        Ekonomisë dhe Inovacionit ku supermarketet raportojnë çmimet e produkteve bazë. Për çdo produkt ruajmë çmimin
        në çdo rrjet, qytetet ku vlen, ofertat me datat e tyre dhe çmimet që vlejnë vetëm në disa dyqane.
      </p>
      <p>
        Çmimet përditësohen një herë në ditë. Ofertat aktivizohen automatikisht në ditën kur fillojnë, edhe nëse të
        dhënat nuk janë përditësuar ende.
      </p>
      <h2>Planet</h2>
      <p>
        Çdo plan ka një objektiv kalorish dhe minimume për proteinat, fibrat dhe kalciumin. Për çdo ditë të muajit
        zgjidhen vaktet nga një listë gatimesh shqiptare të përditshme, duke kërkuar kombinimin më të lirë që plotëson
        objektivat, pa përsëritur të njëjtin gatim shumë shpesh. Porcionet e ditës rregullohen që të arrihet objektivi i
        kalorive. Yndyrnat mbahen nën 35% të energjisë.
      </p>
      <p>
        Kur një produkt del në ofertë ose ndryshon çmimi, plani mund të ndryshojë: p.sh. më shumë pulë kur pula është në
        ofertë.
      </p>
      <h2>Gatimi përpara</h2>
      <p>
        Shumë gjellë shtëpie ruhen mirë: fasulet, supat, jahnitë, qoftet, byrekët. Te “Sa shpesh gatuani?” zgjidhni sa
        herë doni të gatuani. Me “Një herë në ditë”, gjellët që ruhen gatuhen dyfish dhe porcioni i dytë hahet të
        nesërmen. Me “Çdo 2–3 ditë”, gatimet bëhen për 2–3 ditë, dhe gjellët që ngrihen mirë lënë edhe një porcion në
        ngrirje për javën tjetër. Plani ju kujton një ditë përpara ta nxirrni nga ngrirja.
      </p>
      <p>
        Për çdo gjellë dihet sa ditë ruhet në frigorifer dhe nëse mund të ngrihet. Gjellët me oriz hahen brenda 24
        orësh; sallatat dhe peshku hahen të freskëta. Lista e blerjeve e numëron sasinë në ditën kur gatuhet.
      </p>
      <h2>Çmimet e vlerësuara</h2>
      <p>
        Pasqyra e Çmimeve është ende në fazë pilot dhe ndjek vetëm disa kategori (miell, oriz, makarona, vaj, sheqer,
        qumësht, kos, gjalpë, vezë, pulë, mollë, banane, domate). Për ushqimet e tjera (bukë, bishtajore, djathë,
        perime) përdoret një çmim i vlerësuar, i shënuar qartë si “vlerësim”. Sapo platforma shton një kategori, plani
        kalon automatikisht te çmimi zyrtar.
      </p>
      <h2>Vlerat ushqyese</h2>
      <p>
        Vlerat ushqyese janë mesatare nga tabelat standarde të përbërjes së ushqimeve (USDA FoodData Central). Janë të
        përafërta: produkti konkret mund të ndryshojë.
      </p>
    </>
  ),
  en: (
    <>
      <h1>How it works</h1>
      <h2>The data</h2>
      <p>
        Prices come from <a href="https://pasqyraecmimeve.al">Pasqyra e Çmimeve</a>, the Ministry of Economy and
        Innovation platform where supermarkets report prices for basic products. For each product we keep the price at
        each chain, the cities where it applies, promotions with their dates, and prices valid only in some stores.
      </p>
      <p>
        Prices are refreshed once a day. Promotions switch on automatically on the day they start, even if the data has
        not been refreshed yet.
      </p>
      <h2>The plans</h2>
      <p>
        Each plan has a calorie target and minimums for protein, fibre and calcium. For every day of the month, meals are
        picked from a list of everyday Albanian dishes, looking for the cheapest combination that meets the targets
        without repeating the same dish too often. Portions are scaled so the day hits the calorie target. Fat is kept
        under 35% of energy.
      </p>
      <p>
        When a product goes on promotion or its price changes, the plan can change too: for example more chicken when
        chicken is on offer.
      </p>
      <h2>Cooking ahead</h2>
      <p>
        Many home dishes keep well: bean stew, soups, potato stew, meatballs, byrek. Under “How often do you cook?”
        choose how often you want to cook. With “Once a day”, dishes that keep are cooked in a double batch and the
        second portion is eaten the next day. With “Every 2–3 days”, batches cover 2–3 days, and dishes that freeze well
        also leave a portion in the freezer for the following week. The plan reminds you the day before to take it out.
      </p>
      <p>
        Each dish records how many days it keeps in the fridge and whether it freezes. Dishes with rice are eaten within
        24 hours; salads and fish are eaten fresh. The shopping list counts a batch on the day it is cooked.
      </p>
      <h2>Estimated prices</h2>
      <p>
        Pasqyra e Çmimeve is still a pilot and only tracks a few categories (flour, rice, pasta, oil, sugar, milk, yogurt,
        butter, eggs, chicken, apples, bananas, tomatoes). Other foods (bread, legumes, cheese, vegetables) use an
        estimated price, clearly marked as an “estimate”. As soon as the platform adds a category, the plans switch to the
        official price automatically.
      </p>
      <h2>Nutrition values</h2>
      <p>
        Nutrition values are averages from standard food composition tables (USDA FoodData Central). They are
        approximate: a specific product may differ.
      </p>
    </>
  ),
}

export default function About({ i18n }) {
  return <article className="prose">{CONTENT[i18n.lang] ?? CONTENT.sq}</article>
}
