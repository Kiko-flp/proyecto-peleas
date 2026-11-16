/**
 * Resolutor Avanzado de Retratos Oficiales de Personajes (Real Character Portraits)
 * Extrae las imágenes reales de los iconos de personajes desde las Wikis Oficiales:
 * - Street Fighter 6: SuperCombo Wiki (https://wiki.supercombo.gg/w/Street_Fighter_6)
 * - Guilty Gear -Strive-: Dustloop Wiki (https://www.dustloop.com/w/GGST)
 * - Dragon Ball FighterZ: Dustloop Wiki (https://www.dustloop.com/w/DBFZ)
 * - Tekken 8: Wavu Wiki (https://wavu.wiki/t/Main_Page) & Tekken Fandom
 * - Mortal Kombat 1: Mortal Kombat Fandom Wiki (mortalkombat.fandom.com)
 * - Super Smash Bros. Ultimate: CDN Oficial de Nintendo (smashbros.com)
 */

const portraitUrlCache = new Map();
const gameHubImagesCache = new Map();

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Mapeo exacto del CDN oficial de Nintendo para los 86 personajes de Smash Ultimate
const SSBU_SLUGS = {
  "Mario": "mario",
  "Donkey Kong": "donkey_kong",
  "Link": "link",
  "Samus": "samus",
  "Dark Samus": "dark_samus",
  "Yoshi": "yoshi",
  "Kirby": "kirby",
  "Fox": "fox",
  "Pikachu": "pikachu",
  "Luigi": "luigi",
  "Ness": "ness",
  "Captain Falcon": "captain_falcon",
  "Jigglypuff": "jigglypuff",
  "Peach": "peach",
  "Daisy": "daisy",
  "Bowser": "bowser",
  "Ice Climbers": "ice_climbers",
  "Sheik": "sheik",
  "Zelda": "zelda",
  "Dr. Mario": "dr_mario",
  "Pichu": "pichu",
  "Falco": "falco",
  "Marth": "marth",
  "Lucina": "lucina",
  "Young Link": "young_link",
  "Ganondorf": "ganondorf",
  "Mewtwo": "mewtwo",
  "Roy": "roy",
  "Chrom": "chrom",
  "Mr. Game & Watch": "mr_game_and_watch",
  "Meta Knight": "meta_knight",
  "Pit": "pit",
  "Dark Pit": "dark_pit",
  "Zero Suit Samus": "zero_suit_samus",
  "Wario": "wario",
  "Snake": "snake",
  "Ike": "ike",
  "Pokémon Trainer": "pokemon_trainer",
  "Diddy Kong": "diddy_kong",
  "Lucas": "lucas",
  "Sonic": "sonic",
  "King Dedede": "king_dedede",
  "Olimar": "olimar",
  "Lucario": "lucario",
  "R.O.B.": "rob",
  "Toon Link": "toon_link",
  "Wolf": "wolf",
  "Villager": "villager",
  "Mega Man": "mega_man",
  "Wii Fit Trainer": "wii_fit_trainer",
  "Rosalina & Luma": "rosalina_and_luma",
  "Little Mac": "little_mac",
  "Greninja": "greninja",
  "Palutena": "palutena",
  "Pac-Man": "pac_man",
  "Robin": "robin",
  "Shulk": "shulk",
  "Bowser Jr.": "bowser_jr",
  "Duck Hunt": "duck_hunt",
  "Ryu (Smash)": "ryu",
  "Ken (Smash)": "ken",
  "Cloud Strife": "cloud",
  "Corrin": "corrin",
  "Bayonetta": "bayonetta",
  "Inkling": "inkling",
  "Ridley": "ridley",
  "Simon": "simon",
  "Richter": "richter",
  "King K. Rool": "king_k_rool",
  "Isabelle": "isabelle",
  "Incineroar": "incineroar",
  "Mii Brawler": "mii_fighter",
  "Mii Swordfighter": "mii_fighter",
  "Mii Gunner": "mii_fighter",
  "Piranha Plant": "piranha_plant",
  "Joker": "joker",
  "Hero": "dq_hero",
  "Banjo & Kazooie": "banjo_and_kazooie",
  "Terry": "terry",
  "Byleth": "byleth",
  "Min Min": "minmin",
  "Steve": "steve",
  "Sephiroth": "sephiroth",
  "Pyra / Mythra": "homura",
  "Kazuya": "kazuya",
  "Sora": "sora"
};

// Alias de nombres para que coincidan con los nombres de archivo en las wikis
const WIKI_ALIASES = {
  "Ken Masters": ["ken", "ken_masters"],
  "Juri Han": ["juri", "juri_han"],
  "E. Honda": ["ehonda", "e.honda", "e_honda", "honda"],
  "A.K.I.": ["aki", "a.k.i.", "a_k_i"],
  "M. Bison": ["mbison", "m.bison", "m_bison", "bison", "dictator"],
  "Dee Jay": ["deejay", "dee_jay"],
  "Terry Bogard": ["terry", "terry_bogard"],
  "Mai Shiranui": ["mai", "mai_shiranui"],
  "Goku (Super Saiyan)": ["ssj_goku", "goku_ssj", "super_saiyan_goku"],
  "Vegeta (Super Saiyan)": ["ssj_vegeta", "vegeta_ssj"],
  "Goku (SSGSS / Blue)": ["ssgss_goku", "goku_blue", "blue_goku"],
  "Vegeta (SSGSS / Blue)": ["ssgss_vegeta", "vegeta_blue", "blue_vegeta"],
  "Gohan (Teen)": ["teen_gohan", "gohan_teen"],
  "Gohan (Adult)": ["adult_gohan", "gohan_adult"],
  "Android 21 (Majin)": ["android_21", "majin_21"],
  "Android 21 (Lab Coat)": ["lab_coat_android_21", "labcoat"],
  "Broly (Z)": ["broly", "z_broly"],
  "Broly (DBS)": ["dbs_broly", "broly_dbs"],
  "Zamasu (Fused)": ["fused_zamasu", "zamasu"],
  "Vegito (SSGSS)": ["vegito", "ssgss_vegito"],
  "Goku (Base)": ["base_goku", "goku_base"],
  "Vegeta (Base)": ["base_vegeta", "vegeta_base"],
  "Goku (GT)": ["gt_goku", "goku_gt"],
  "Gogeta (SSGSS)": ["gogeta", "ssgss_gogeta", "gogeta_blue"],
  "Goku (Ultra Instinct)": ["ui_goku", "ultra_instinct_goku"],
  "Gogeta (SS4)": ["ss4_gogeta", "gogeta_ss4"],
  "Conan the Barbarian": ["conan"]
};

function getSearchKeys(charName) {
  const base = charName.toLowerCase().replace(/\(.*?\)/g, "").trim();
  const slug1 = base.replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const slug2 = base.replace(/[^a-z0-9]+/g, "");
  const firstWord = base.split(/\s+/)[0].replace(/[^a-z0-9]/g, "");
  const custom = WIKI_ALIASES[charName] || [];
  return [...new Set([...custom, slug1, slug2, firstWord])].filter(Boolean);
}

/**
 * Descarga todas las URLs de imágenes incrustadas en la página principal de un juego en MediaWiki
 */
async function loadHubPageImages(apiEndpoint, pageTitle) {
  const cacheKey = `${apiEndpoint}:${pageTitle}`;
  if (gameHubImagesCache.has(cacheKey)) {
    return gameHubImagesCache.get(cacheKey);
  }

  const imageMap = [];
  try {
    const url = `${apiEndpoint}?action=query&titles=${encodeURIComponent(
      pageTitle
    )}&generator=images&gimlimit=500&prop=imageinfo&iiprop=url&format=json&origin=*`;

    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (res.ok) {
      const data = await res.json();
      const pages = data?.query?.pages || {};
      for (const pid of Object.keys(pages)) {
        const title = (pages[pid]?.title || "").toLowerCase();
        const imgUrl = pages[pid]?.imageinfo?.[0]?.url;
        if (imgUrl && !title.endsWith(".svg") && !title.includes("logo")) {
          imageMap.push({ title, url: imgUrl });
        }
      }
    }
  } catch (_) {
    // Ignorar error de red
  }

  gameHubImagesCache.set(cacheKey, imageMap);
  return imageMap;
}

/**
 * Busca la imagen principal (pageimages) en una wiki Fandom o MediaWiki
 */
async function queryPageImage(apiEndpoint, titlesArray) {
  try {
    const url = `${apiEndpoint}?action=query&titles=${encodeURIComponent(
      titlesArray.join("|")
    )}&prop=pageimages&piprop=thumbnail|original&pithumbsize=250&format=json&origin=*`;

    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages || {};
    for (const pid of Object.keys(pages)) {
      const p = pages[pid];
      if (p?.thumbnail?.source) return p.thumbnail.source;
      if (p?.original?.source) return p.original.source;
    }
  } catch (_) {
    // Fallback silencioso
  }
  return null;
}

async function resolveCharacterPortraitUrl(gameId, charName) {
  const cacheKey = `${gameId}:${charName}`;
  if (portraitUrlCache.has(cacheKey)) {
    return portraitUrlCache.get(cacheKey);
  }

  let resolvedUrl = null;
  const keys = getSearchKeys(charName);

  // 1. SUPER SMASH BROS. ULTIMATE (CDN Oficial de Nintendo)
  if (gameId === "ssbu") {
    const slug =
      SSBU_SLUGS[charName] ||
      charName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    resolvedUrl = `https://www.smashbros.com/assets_v2/img/fighter/thumb_a/${slug}.png`;
  }

  // 2. STREET FIGHTER 6 (SuperCombo Wiki /w/api.php + Street Fighter Fandom)
  else if (gameId === "sf6") {
    const hubImages = await loadHubPageImages(
      "https://wiki.supercombo.gg/w/api.php",
      "Street_Fighter_6"
    );
    const match = hubImages.find((img) =>
      keys.some(
        (k) =>
          img.title.includes(`sf6_${k}`) ||
          img.title.includes(`${k}_icon`) ||
          img.title.includes(`${k}_portrait`) ||
          img.title.includes(`${k}.png`)
      )
    );
    if (match) {
      resolvedUrl = match.url;
    } else {
      resolvedUrl = await queryPageImage("https://streetfighter.fandom.com/api.php", [
        charName,
        charName.split(" ")[0]
      ]);
    }
  }

  // 3. GUILTY GEAR -STRIVE- (Dustloop Wiki + Guilty Gear Fandom)
  else if (gameId === "gg-strive") {
    const hubImages = await loadHubPageImages(
      "https://www.dustloop.com/wiki/api.php",
      "GGST"
    );
    const match = hubImages.find((img) =>
      keys.some(
        (k) =>
          img.title.includes(`ggst_${k}`) ||
          img.title.includes(`${k}_icon`) ||
          img.title.includes(`${k}_portrait`)
      )
    );
    if (match) {
      resolvedUrl = match.url;
    } else {
      resolvedUrl = await queryPageImage("https://guiltygear.fandom.com/api.php", [
        charName,
        charName.replace(/\s+\(.*?\)/, "")
      ]);
    }
  }

  // 4. DRAGON BALL FIGHTERZ (Dustloop Wiki + Dragon Ball Fandom)
  else if (gameId === "dbfz") {
    const hubImages = await loadHubPageImages(
      "https://www.dustloop.com/wiki/api.php",
      "DBFZ"
    );
    const match = hubImages.find((img) =>
      keys.some(
        (k) =>
          img.title.includes(`dbfz_${k}`) ||
          img.title.includes(`${k}_icon`) ||
          img.title.includes(`${k}_portrait`)
      )
    );
    if (match) {
      resolvedUrl = match.url;
    } else {
      resolvedUrl = await queryPageImage("https://dragonballfighterz.fandom.com/api.php", [
        charName,
        charName.replace(/\s+\(.*?\)/, "")
      ]);
    }
  }

  // 5. TEKKEN 8 (Wavu Wiki + Tekken Fandom)
  else if (gameId === "tekken8") {
    const hubImages = await loadHubPageImages(
      "https://wavu.wiki/w/api.php",
      "Main_Page"
    );
    const match = hubImages.find((img) =>
      keys.some((k) => img.title.includes(k))
    );
    if (match) {
      resolvedUrl = match.url;
    } else {
      resolvedUrl = await queryPageImage("https://tekken.fandom.com/api.php", [
        charName,
        charName.split(" ")[0]
      ]);
    }
  }

  // 6. MORTAL KOMBAT 1 (Mortal Kombat Fandom Wiki)
  else if (gameId === "mk1") {
    resolvedUrl = await queryPageImage("https://mortalkombat.fandom.com/api.php", [
      charName,
      `${charName}/Mortal Kombat 1`
    ]);
  }

  if (resolvedUrl) {
    portraitUrlCache.set(cacheKey, resolvedUrl);
  }
  return resolvedUrl;
}

module.exports = {
  resolveCharacterPortraitUrl
};
