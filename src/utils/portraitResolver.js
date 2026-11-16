/**
 * Resolutor de Retratos Oficiales de Personajes (Real Character Portraits)
 * Obtiene y sirve los iconos/retratos oficiales reales de cada personaje desde:
 * - Super Smash Bros. Ultimate: CDN oficial de Nintendo (smashbros.com/assets_v2/img/fighter/thumb_a/)
 * - Street Fighter 6: SuperCombo Wiki MediaWiki API (File:SF6_<Name>_Icon.png)
 * - Guilty Gear -Strive-: Dustloop Wiki MediaWiki API (File:GGST_<Name>_Icon.png)
 * - Dragon Ball FighterZ: Dustloop Wiki MediaWiki API (File:DBFZ_<Name>_Icon.png)
 * - Tekken 8: Wavu Wiki MediaWiki API
 * - Mortal Kombat 1: Mortal Kombat Warehouse / Wikimedia / Kombat Akademy
 */

const portraitUrlCache = new Map();

// Mapeo exacto de slugs del CDN oficial de Nintendo para los 86 personajes de Smash Ultimate
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

// Mapeo de nombres para la API de Dustloop (DBFZ)
const DBFZ_FILE_NAMES = {
  "Goku (Super Saiyan)": "SSJ_Goku",
  "Vegeta (Super Saiyan)": "SSJ_Vegeta",
  "Goku (SSGSS / Blue)": "SSGSS_Goku",
  "Vegeta (SSGSS / Blue)": "SSGSS_Vegeta",
  "Gohan (Teen)": "Teen_Gohan",
  "Gohan (Adult)": "Adult_Gohan",
  "Android 21 (Majin)": "Android_21",
  "Broly (Z)": "Broly",
  "Zamasu (Fused)": "Fused_Zamasu",
  "Vegito (SSGSS)": "Vegito",
  "Goku (Base)": "Base_Goku",
  "Vegeta (Base)": "Base_Vegeta",
  "Goku (GT)": "GT_Goku",
  "Gogeta (SSGSS)": "Gogeta",
  "Broly (DBS)": "DBS_Broly",
  "Goku (Ultra Instinct)": "UI_Goku",
  "Gogeta (SS4)": "SS4_Gogeta",
  "Android 21 (Lab Coat)": "Lab_Coat_Android_21"
};

// Mapeo de nombres para SuperCombo Wiki (SF6)
const SF6_FILE_NAMES = {
  "Ken Masters": "Ken",
  "Juri Han": "Juri",
  "Terry Bogard": "Terry",
  "Mai Shiranui": "Mai"
};

/**
 * Consulta la URL real de un archivo o imagen principal en una wiki MediaWiki
 */
async function queryMediaWikiFileUrl(apiEndpoint, fileTitles) {
  try {
    const titlesParam = fileTitles.map((t) => `File:${t}`).join("|");
    const url = `${apiEndpoint}?action=query&titles=${encodeURIComponent(
      titlesParam
    )}&prop=imageinfo&iiprop=url&format=json&origin=*`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "FGCVaultEncyclopedia/1.0 (https://fgc-vault.onrender.com)"
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages || {};
    for (const pageId of Object.keys(pages)) {
      const info = pages[pageId]?.imageinfo?.[0];
      if (info && info.url) {
        return info.url;
      }
    }
  } catch (_) {
    // Fallback silencioso
  }
  return null;
}

/**
 * Consulta la imagen principal asociada a una página de MediaWiki (pageimages)
 */
async function queryMediaWikiPageImage(apiEndpoint, pageTitle) {
  try {
    const url = `${apiEndpoint}?action=query&titles=${encodeURIComponent(
      pageTitle
    )}&prop=pageimages&piprop=original|thumbnail&pithumbsize=240&format=json&origin=*`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "FGCVaultEncyclopedia/1.0 (https://fgc-vault.onrender.com)"
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages || {};
    for (const pageId of Object.keys(pages)) {
      const p = pages[pageId];
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

  // 1. SUPER SMASH BROS. ULTIMATE (CDN Oficial de Nintendo)
  if (gameId === "ssbu") {
    const slug =
      SSBU_SLUGS[charName] ||
      charName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    resolvedUrl = `https://www.smashbros.com/assets_v2/img/fighter/thumb_a/${slug}.png`;
  }

  // 2. STREET FIGHTER 6 (SuperCombo Wiki — exactos iconos de la captura del usuario)
  else if (gameId === "sf6") {
    const cleanName = (SF6_FILE_NAMES[charName] || charName).replace(/\s+/g, "_");
    resolvedUrl = await queryMediaWikiFileUrl("https://wiki.supercombo.gg/api.php", [
      `SF6_${cleanName}_Icon.png`,
      `SF6_${cleanName}_Portrait.png`
    ]);
    if (!resolvedUrl) {
      resolvedUrl = await queryMediaWikiPageImage(
        "https://wiki.supercombo.gg/api.php",
        `Street_Fighter_6/${cleanName}`
      );
    }
  }

  // 3. GUILTY GEAR -STRIVE- (Dustloop Wiki)
  else if (gameId === "gg-strive") {
    const cleanName = charName.replace(/\s+/g, "_");
    resolvedUrl = await queryMediaWikiFileUrl("https://www.dustloop.com/wiki/api.php", [
      `GGST_${cleanName}_Icon.png`,
      `GGST_${cleanName}_Portrait.png`
    ]);
    if (!resolvedUrl) {
      resolvedUrl = await queryMediaWikiPageImage(
        "https://www.dustloop.com/wiki/api.php",
        `GGST/${cleanName}`
      );
    }
  }

  // 4. DRAGON BALL FIGHTERZ (Dustloop Wiki)
  else if (gameId === "dbfz") {
    const cleanName = (DBFZ_FILE_NAMES[charName] || charName).replace(/\s+/g, "_");
    resolvedUrl = await queryMediaWikiFileUrl("https://www.dustloop.com/wiki/api.php", [
      `DBFZ_${cleanName}_Icon.png`,
      `DBFZ_${cleanName}_Portrait.png`
    ]);
    if (!resolvedUrl) {
      resolvedUrl = await queryMediaWikiPageImage(
        "https://www.dustloop.com/wiki/api.php",
        `DBFZ/${cleanName}`
      );
    }
  }

  // 5. TEKKEN 8 (Wavu Wiki)
  else if (gameId === "tekken8") {
    const firstWord = charName.split(" ")[0];
    const fullUnder = charName.replace(/\s+/g, "_");
    resolvedUrl = await queryMediaWikiFileUrl("https://wavu.wiki/w/api.php", [
      `T8_${fullUnder}_Icon.png`,
      `T8_${firstWord}_Icon.png`,
      `T8-${firstWord.toLowerCase()}-icon.png`,
      `T8-${fullUnder.toLowerCase().replace(/_/g, "-")}-icon.png`
    ]);
    if (!resolvedUrl) {
      resolvedUrl = await queryMediaWikiPageImage("https://wavu.wiki/w/api.php", fullUnder);
    }
    if (!resolvedUrl) {
      resolvedUrl = await queryMediaWikiPageImage("https://wavu.wiki/w/api.php", firstWord);
    }
  }

  // 6. MORTAL KOMBAT 1 (Mortal Kombat Fandom / Wikipedia pageimages)
  else if (gameId === "mk1") {
    const cleanName = charName.replace(/\s+/g, "_");
    resolvedUrl = await queryMediaWikiPageImage(
      "https://mortalkombat.fandom.com/api.php",
      cleanName
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
