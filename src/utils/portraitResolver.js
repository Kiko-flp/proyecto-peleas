/**
 * Resolutor Avanzado de Retratos Oficiales de Personajes (Real Character Portraits)
 * Cubre los 271 personajes de los 6 juegos combinando:
 * - Street Fighter 6: SuperCombo Wiki + Street Fighter Fandom
 * - Guilty Gear -Strive-: Dustloop Wiki (/wiki/api.php) + Guilty Gear Fandom + Cyberpunk Fandom (Lucy)
 * - Dragon Ball FighterZ: Dustloop Wiki (/wiki/api.php) + Dragon Ball FighterZ Fandom + Dragon Ball Fandom
 * - Tekken 8: Wavu Wiki + Tekken Fandom + Final Fantasy Fandom (Clive) + Baki Fandom (Yujiro)
 * - Mortal Kombat 1: Mortal Kombat Fandom + Invincible / The Boys / Scream / Terminator / Wikipedia
 * - Super Smash Bros. Ultimate: CDN Oficial de Nintendo + SmashWiki (ssbwiki.com)
 */

const portraitUrlCache = new Map();
const gameHubImagesCache = new Map();

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Mapeo exacto del CDN oficial de Nintendo para Super Smash Bros. Ultimate
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
  "Pyra / Mythra": "pyra",
  "Kazuya": "kazuya",
  "Sora": "sora"
};

// Mapeo de títulos exactos en Wikis para personajes con variantes, invitados o nombres compuestos
const EXACT_WIKI_TITLES = {
  // MK1
  "General Shao": ["General Shao", "Shao Kahn"],
  "Takeda Takahashi": ["Takeda Takahashi", "Takeda"],
  "Omni-Man": ["Omni-Man"],
  "Peacemaker": ["Peacemaker", "Christopher Smith"],
  "Homelander": ["Homelander"],
  "Ghostface": ["Ghostface", "Ghostface (identity)"],
  "Conan the Barbarian": ["Conan the Barbarian", "Conan"],
  "T-1000": ["T-1000"],
  // SF6
  "Ken Masters": ["Ken Masters", "Ken"],
  "Juri Han": ["Juri Han", "Juri"],
  "E. Honda": ["E. Honda", "Edmond Honda"],
  "A.K.I.": ["A.K.I."],
  "M. Bison": ["M. Bison", "Dictator"],
  "Dee Jay": ["Dee Jay"],
  "Terry Bogard": ["Terry Bogard", "Terry"],
  "Mai Shiranui": ["Mai Shiranui", "Mai"],
  "C. Viper": ["Crimson Viper", "C. Viper"],
  "Sagat": ["Sagat"],
  "Alex": ["Alex"],
  "Ingrid": ["Ingrid"],
  // Tekken 8
  "King": ["King II", "King"],
  "Kuma": ["Kuma II", "Kuma"],
  "Jack-8": ["Jack", "Jack-8"],
  "Armor King": ["Armor King II", "Armor King"],
  "Kunimitsu": ["Kunimitsu II", "Kunimitsu"],
  "Roger Jr.": ["Roger Jr.", "Roger"],
  "Clive Rosfield": ["Clive Rosfield"],
  "Yujiro Hanma": ["Yujiro Hanma"],
  "Miary Zo": ["Miary Zo", "Tekken 8"],
  // DBFZ
  "Goku (Super Saiyan)": ["Goku (Super Saiyan)", "Super Saiyan Goku"],
  "Vegeta (Super Saiyan)": ["Vegeta (Super Saiyan)", "Super Saiyan Vegeta"],
  "Goku (SSGSS / Blue)": ["Goku (SSGSS)", "SSGSS Goku"],
  "Vegeta (SSGSS / Blue)": ["Vegeta (SSGSS)", "SSGSS Vegeta"],
  "Gohan (Teen)": ["Gohan (Teen)", "Teen Gohan"],
  "Gohan (Adult)": ["Gohan (Adult)", "Adult Gohan"],
  "Android 21 (Majin)": ["Android 21", "Android 21 (Majin)"],
  "Android 21 (Lab Coat)": ["Android 21 (Lab Coat)", "Android 21"],
  "Broly (Z)": ["Broly", "Broly (DBZ)"],
  "Broly (DBS)": ["Broly (DBS)"],
  "Zamasu (Fused)": ["Fused Zamasu", "Zamasu (Fused)"],
  "Vegito (SSGSS)": ["Vegito (SSGSS)", "Vegito"],
  "Goku (Base)": ["Goku", "Goku (Base)"],
  "Vegeta (Base)": ["Vegeta", "Vegeta (Base)"],
  "Goku (GT)": ["Goku (GT)"],
  "Gogeta (SSGSS)": ["Gogeta (SSGSS)", "Gogeta"],
  "Goku (Ultra Instinct)": ["Goku (Ultra Instinct)"],
  "Gogeta (SS4)": ["Gogeta (SS4)"],
  // GGST
  "Jack-O'": ["Jack-O' Valentine", "Jack-O'"],
  "Bedman?": ["Bedman?", "Bedman", "Delilah"],
  "Asuka R#": ["Asuka R. Kreutz", "Asuka R♯", "That Man"],
  "A.B.A": ["A.B.A"],
  "Queen Dizzy": ["Dizzy", "Queen Dizzy"],
  "Unika": ["Unika"],
  "Lucy": ["Lucyna Kushinada", "Lucy"]
};

// Wikis secundarias específicas para personajes invitados (Guest Characters)
const GUEST_WIKI_ENDPOINTS = {
  "Clive Rosfield": "https://finalfantasy.fandom.com/api.php",
  "Yujiro Hanma": "https://baki.fandom.com/api.php",
  "Lucy": "https://cyberpunk.fandom.com/api.php",
  "Omni-Man": "https://amazon-invincible.fandom.com/api.php",
  "Homelander": "https://the-boys.fandom.com/api.php",
  "Ghostface": "https://scream.fandom.com/api.php",
  "T-1000": "https://terminator.fandom.com/api.php",
  "Peacemaker": "https://dc.fandom.com/api.php",
  "Terry Bogard": "https://snk.fandom.com/api.php",
  "Mai Shiranui": "https://snk.fandom.com/api.php"
};

const WIKI_ALIASES = {
  "Ken Masters": ["ken", "ken_masters"],
  "Juri Han": ["juri", "juri_han"],
  "E. Honda": ["ehonda", "e.honda", "e_honda", "honda"],
  "A.K.I.": ["aki", "a.k.i.", "a_k_i"],
  "M. Bison": ["mbison", "m.bison", "m_bison", "bison", "dictator"],
  "Dee Jay": ["deejay", "dee_jay"],
  "Terry Bogard": ["terry", "terry_bogard"],
  "Mai Shiranui": ["mai", "mai_shiranui"],
  "C. Viper": ["cviper", "c._viper", "crimson_viper"],
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
  "Queen Dizzy": ["dizzy", "queen_dizzy"],
  "Asuka R#": ["asuka", "asuka_r"],
  "Bedman?": ["bedman"],
  "Jack-O'": ["jack-o", "jack_o"],
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

async function queryPageImage(apiEndpoint, titlesArray, searchFallbackTerm = null) {
  try {
    const cleanTitles = [...new Set(titlesArray.filter(Boolean))];
    if (cleanTitles.length > 0) {
      const url = `${apiEndpoint}?action=query&titles=${encodeURIComponent(
        cleanTitles.join("|")
      )}&prop=pageimages&piprop=thumbnail|original&pithumbsize=320&pilimit=50&redirects=1&format=json&origin=*`;

      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (res.ok) {
        const data = await res.json();
        const pages = data?.query?.pages || {};
        for (const pid of Object.keys(pages)) {
          const p = pages[pid];
          if (p?.thumbnail?.source) return p.thumbnail.source;
          if (p?.original?.source) return p.original.source;
        }
      }
    }

    if (searchFallbackTerm) {
      const searchUrl = `${apiEndpoint}?action=query&generator=search&gsrsearch=${encodeURIComponent(
        searchFallbackTerm
      )}&gsrlimit=4&prop=pageimages&piprop=thumbnail|original&pithumbsize=320&pilimit=10&format=json&origin=*`;
      const sRes = await fetch(searchUrl, { headers: { "User-Agent": USER_AGENT } });
      if (sRes.ok) {
        const sData = await sRes.json();
        const sPages = sData?.query?.pages || {};
        for (const pid of Object.keys(sPages)) {
          const p = sPages[pid];
          if (p?.thumbnail?.source) return p.thumbnail.source;
          if (p?.original?.source) return p.original.source;
        }
      }
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
  const exactTitles = EXACT_WIKI_TITLES[charName] || [
    charName,
    charName.replace(/\s+\(.*?\)/g, "").trim()
  ];

  // 1. SUPER SMASH BROS. ULTIMATE (Renders oficiales originales de Smash Bros. Ultimate)
  if (gameId === "ssbu") {
    const ssbuOverrides = {
      "Isabelle": "https://www.smashbros.com/assets_v2/img/fighter/isabelle/main.png",
      "Incineroar": "https://www.smashbros.com/assets_v2/img/fighter/incineroar/main.png",
      "Piranha Plant": "https://www.smashbros.com/assets_v2/img/fighter/piranha_plant/main.png",
      "Pyra / Mythra": "https://www.smashbros.com/assets_v2/img/fighter/pyra/main.png",
      "Mii Brawler": "https://ssb.wiki.gallery/images/e/e4/Mii_Brawler_SSBU.png",
      "Mii Swordfighter": "https://ssb.wiki.gallery/images/f/fa/Mii_Swordfighter_SSBU.png",
      "Mii Gunner": "https://ssb.wiki.gallery/images/e/e5/Mii_Gunner_SSBU.png"
    };
    if (ssbuOverrides[charName]) {
      resolvedUrl = ssbuOverrides[charName];
    } else {
      const slug =
        SSBU_SLUGS[charName] ||
        charName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
      resolvedUrl = `https://www.smashbros.com/assets_v2/img/fighter/thumb_a/${slug}.png`;
    }
  }

  // 2. STREET FIGHTER 6 (Street Fighter Fandom — Imágenes oficiales In-Game de SF6)
  else if (gameId === "sf6") {
    try {
      const sfSlug = exactTitles[0].replace(/\s+/g, "_");
      const allUrl = `https://streetfighter.fandom.com/api.php?action=query&list=allimages&aiprefix=${encodeURIComponent(
        `SF6_${sfSlug}`
      )}&ailimit=8&format=json&origin=*`;
      const sfRes = await fetch(allUrl, { headers: { "User-Agent": USER_AGENT } });
      if (sfRes.ok) {
        const sfData = await sfRes.json();
        const sfImgs = sfData?.query?.allimages || [];
        const bestSf =
          sfImgs.find((x) => x.name.toLowerCase().includes("outfit_1")) ||
          sfImgs.find((x) => x.name.toLowerCase().includes("idle")) ||
          sfImgs[0];
        if (bestSf?.url) resolvedUrl = bestSf.url;
      }
    } catch (_) {}

    if (!resolvedUrl) {
      resolvedUrl = await queryPageImage(
        "https://streetfighter.fandom.com/api.php",
        [...exactTitles, charName.split(" ")[0]],
        charName
      );
    }
  }

  // 3. GUILTY GEAR -STRIVE-
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
      resolvedUrl = await queryPageImage(
        "https://guiltygear.fandom.com/api.php",
        exactTitles,
        exactTitles[0]
      );
    }
  }

  // 4. DRAGON BALL FIGHTERZ
  else if (gameId === "dbfz") {
    const hubImages = await loadHubPageImages(
      "https://www.dustloop.com/wiki/api.php",
      "DBFZ"
    );
    const match = hubImages.find((img) =>
      keys.some(
        (k) =>
          img.title.includes(`dbfzce_${k}`) ||
          img.title.includes(`dbfz_${k}`) ||
          img.title.includes(`${k}_icon`) ||
          img.title.includes(`${k}_portrait`)
      )
    );
    if (match) {
      resolvedUrl = match.url;
    } else {
      resolvedUrl =
        (await queryPageImage(
          "https://dragonballfighterz.fandom.com/api.php",
          exactTitles,
          exactTitles[0]
        )) ||
        (await queryPageImage(
          "https://dragonball.fandom.com/api.php",
          exactTitles,
          exactTitles[0]
        ));
    }
  }

  // 5. TEKKEN 8
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
      resolvedUrl = await queryPageImage(
        "https://tekken.fandom.com/api.php",
        [...exactTitles, charName.split(" ")[0]],
        exactTitles[0]
      );
    }
  }

  // 6. MORTAL KOMBAT 1
  else if (gameId === "mk1") {
    resolvedUrl = await queryPageImage(
      "https://mortalkombat.fandom.com/api.php",
      [...exactTitles, `${charName}/Mortal Kombat 1`],
      exactTitles[0]
    );
  }

  // 7. Respaldo en Wikis de franquicias invitadas (Final Fantasy, Baki, Cyberpunk, Invincible, The Boys, Scream, Terminator)
  if (!resolvedUrl && GUEST_WIKI_ENDPOINTS[charName]) {
    resolvedUrl = await queryPageImage(
      GUEST_WIKI_ENDPOINTS[charName],
      exactTitles,
      exactTitles[0]
    );
  }

  // 8. Respaldo universal en Wikipedia
  if (!resolvedUrl) {
    resolvedUrl = await queryPageImage(
      "https://en.wikipedia.org/w/api.php",
      exactTitles,
      `${exactTitles[0]} character`
    );
  }

  if (resolvedUrl) {
    portraitUrlCache.set(cacheKey, resolvedUrl);
  }
  return resolvedUrl;
}

module.exports = {
  resolveCharacterPortraitUrl
};
