/**
 * Resolutor de Hitboxes Reales desde Wikis Oficiales de Frame Data:
 * - Super Smash Bros. Ultimate: https://ultimateframedata.com/ (GIFs reales de hitboxes)
 * - Guilty Gear -Strive- & Dragon Ball FighterZ: https://www.dustloop.com/ (Hitbox PNGs y movimientos)
 * - Street Fighter 6: https://wiki.supercombo.gg/ (Imágenes de movimientos y hitboxes)
 * - Tekken 8: https://wavu.wiki/ (Clips MP4/WebP de movimientos reales)
 */

const hitboxCache = new Map();

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const UFD_SLUGS = {
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
  "Pokémon Trainer": "pt_squirtle",
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
  "Mii Brawler": "mii_brawler",
  "Mii Swordfighter": "mii_swordfighter",
  "Mii Gunner": "mii_gunner",
  "Piranha Plant": "piranha_plant",
  "Joker": "joker",
  "Hero": "hero",
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

const DUSTLOOP_CHAR_PREFIX = {
  "Queen Dizzy": "Dizzy",
  "Asuka R#": "Asuka_R",
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

function normalizeMoveToken(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function matchBestUfdGif(gifUrls, moveName) {
  const m = moveName.toLowerCase();
  const rules = [
    ["jab 1", ["jab1"]],
    ["jab 2", ["jab2"]],
    ["jab 3", ["jab3", "jabrapid"]],
    ["forward tilt", ["ftilt"]],
    ["up tilt", ["utilt"]],
    ["down tilt", ["dtilt"]],
    ["dash attack", ["dashattack"]],
    ["forward smash", ["fsmash"]],
    ["up smash", ["usmash"]],
    ["down smash", ["dsmash"]],
    ["neutral air", ["nair"]],
    ["forward air", ["fair"]],
    ["back air", ["bair"]],
    ["up air", ["uair"]],
    ["down air", ["dair"]],
    ["neutral special", ["neutralb", "nspecial"]],
    ["side special", ["sideb", "sspecial"]],
    ["up special", ["upb", "uspecial"]],
    ["down special", ["downb", "dspecial"]],
    ["standing grab", ["grab", "standinggrab"]],
    ["dash grab", ["dashgrab"]],
    ["pivot grab", ["pivotgrab"]],
    ["final smash", ["finalsmash"]]
  ];

  for (const [needle, tokens] of rules) {
    if (m.includes(needle)) {
      const found = gifUrls.find((u) => {
        const fname = normalizeMoveToken(u.split("/").pop().replace(/\.gif$/i, ""));
        return tokens.some((t) => fname.endsWith(t) || fname.includes(t));
      });
      if (found) return found;
    }
  }
  return null;
}

async function resolveSsbuHitboxes(charName) {
  const slug =
    UFD_SLUGS[charName] ||
    charName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const pageUrl = `https://ultimateframedata.com/${slug}`;

  try {
    const res = await fetch(pageUrl, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return {};
    const html = await res.text();
    const matches = html.match(/hitboxes\/[^"'\s<>]+\.gif/gi) || [];
    const uniqueGifs = [...new Set(matches.map((m) => `https://ultimateframedata.com/${m}`))];
    if (uniqueGifs.length === 0) return {};

    const moveNames = [
      "Jab 1", "Jab 2", "Jab 3 / Rapid Finisher",
      "Forward Tilt (F-Tilt)", "Up Tilt (U-Tilt)", "Down Tilt (D-Tilt)", "Dash Attack",
      "Forward Smash (F-Smash)", "Up Smash (U-Smash)", "Down Smash (D-Smash)",
      "Neutral Air (Nair)", "Forward Air (Fair)", "Back Air (Bair)", "Up Air (Uair)", "Down Air (Dair - Spike)",
      "Neutral Special (Neutral B)", "Side Special (Side B)", "Up Special (Up B - OOS)", "Down Special (Down B)",
      "Standing Grab", "Dash Grab", "Pivot Grab", "Final Smash"
    ];

    const result = {};
    moveNames.forEach((mn) => {
      const gifUrl = matchBestUfdGif(uniqueGifs, mn);
      if (gifUrl) {
        result[mn] = { url: gifUrl, type: "image", source: "Ultimate Frame Data" };
      }
    });
    return result;
  } catch (_) {
    return {};
  }
}

async function resolveDustloopHitboxes(gameId, charName) {
  const prefixGame = gameId === "gg-strive" ? "GGST" : "DBFZ";
  const charSlug = (DUSTLOOP_CHAR_PREFIX[charName] || charName).replace(/\s+/g, "_");
  const prefix = `${prefixGame}_${charSlug}_`;

  try {
    const url = `https://www.dustloop.com/wiki/api.php?action=query&list=allimages&aiprefix=${encodeURIComponent(
      prefix
    )}&ailimit=200&format=json`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return {};
    const data = await res.json();
    const imgs = data?.query?.allimages || [];
    if (imgs.length === 0) return {};

    const result = {};
    const findImg = (tokens) => {
      // Priorizar imágenes _Hitbox.png primero
      const hitboxMatch = imgs.find((im) => {
        const n = im.name.toLowerCase();
        return n.includes("hitbox") && tokens.some((t) => n.includes(`_${t.toLowerCase()}`));
      });
      if (hitboxMatch) return hitboxMatch.url;

      const normalMatch = imgs.find((im) => {
        const n = im.name.toLowerCase();
        return !n.includes("icon") && !n.includes("portrait") && tokens.some((t) => n.includes(`_${t.toLowerCase()}.`));
      });
      return normalMatch ? normalMatch.url : null;
    };

    const moveMap =
      gameId === "gg-strive"
        ? {
            "Standing Punch (5P)": ["5P"],
            "Standing Kick (5K)": ["5K"],
            "Close Slash (c.S)": ["cS", "c.S"],
            "Far Slash (f.S)": ["fS", "f.S"],
            "Standing Heavy Slash (5HS)": ["5H", "5HS"],
            "Crouching Punch (2P)": ["2P"],
            "Crouching Kick (2K - Low)": ["2K"],
            "Crouching Slash (2S)": ["2S"],
            "Crouching Heavy Slash (2HS)": ["2H", "2HS"],
            "Crouching Dust Sweep (2D)": ["2D"],
            "Forward Punch Anti-Air (6P)": ["6P"],
            "Jumping Slash (j.S)": ["jS", "j.S"],
            "Jumping Heavy (j.HS)": ["jH", "jHS", "j.H"],
            "Special 1 (QCF Attack)": ["236S", "236K", "236P"],
            "Special 2 (QCB Mix / Advance)": ["214K", "214S", "214P"],
            "Wild Assault (236D)": ["236D"],
            "Ground Throw (4D / 6D)": ["Throw", "6D"],
            "Overdrive Super (50% Tension)": ["632146H", "236236P", "236236S"]
          }
        : {
            "Standing Light (5L)": ["5L"],
            "Auto-Combo 2nd Hit (5LL)": ["5LL"],
            "Standing Medium (5M)": ["5M"],
            "Standing Heavy (5H)": ["5H"],
            "Standing Ki Blast (5S)": ["5S"],
            "Crouching Light (2L)": ["2L"],
            "Crouching Medium (2M - Low)": ["2M"],
            "Down Heavy Anti-Air (2H)": ["2H"],
            "Crouching Special (2S)": ["2S"],
            "Universal Overhead (6M)": ["6M"],
            "Jumping Medium (j.M)": ["jM"],
            "Jumping Heavy (j.H)": ["jH"],
            "Special 1 (QCF Attack)": ["236L", "236M", "236S"],
            "Special 2 (QCB Mix / Advance)": ["214L", "214M", "214S"],
            "Dragon Rush (Throw L+M)": ["DR", "DragonRush"],
            "Super Dash (H+S)": ["SD", "SuperDash"],
            "Level 3 Super (3 Barras)": ["214LM", "236HS"]
          };

    Object.entries(moveMap).forEach(([moveName, tokens]) => {
      const foundUrl = findImg(tokens);
      if (foundUrl) {
        result[moveName] = { url: foundUrl, type: "image", source: "Dustloop Wiki" };
      }
    });
    return result;
  } catch (_) {
    return {};
  }
}

async function resolveSuperComboHitboxes(charName) {
  const clean = charName.replace(/\s+\(.*?\)/g, "").split(" ")[0];
  try {
    const searchUrl = `https://wiki.supercombo.gg/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(
      `SF6 ${clean}`
    )}&srlimit=50&format=json`;
    const res = await fetch(searchUrl, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return {};
    const data = await res.json();
    const titles = (data?.query?.search || []).map((s) => s.title).filter(Boolean);
    if (titles.length === 0) return {};

    const infoUrl = `https://wiki.supercombo.gg/w/api.php?action=query&titles=${encodeURIComponent(
      titles.slice(0, 40).join("|")
    )}&prop=imageinfo&iiprop=url&format=json`;
    const iRes = await fetch(infoUrl, { headers: { "User-Agent": USER_AGENT } });
    if (!iRes.ok) return {};
    const iData = await iRes.json();
    const pages = Object.values(iData?.query?.pages || {});
    const imgs = pages
      .map((p) => ({ title: (p.title || "").toLowerCase(), url: p.imageinfo?.[0]?.url }))
      .filter((x) => x.url && !x.title.includes("icon") && !x.title.includes("portrait"));

    const result = {};
    const sf6Map = {
      "Standing Light Punch": ["5lp"],
      "Standing Light Kick": ["5lk"],
      "Standing Medium Punch": ["5mp"],
      "Standing Medium Kick": ["5mk"],
      "Standing Heavy Punch": ["5hp"],
      "Standing Heavy Kick": ["5hk"],
      "Crouching Light Punch": ["2lp"],
      "Crouching Light Kick": ["2lk"],
      "Crouching Medium Punch": ["2mp"],
      "Crouching Medium Kick": ["2mk"],
      "Crouching Heavy Punch": ["2hp"],
      "Crouching Heavy Kick (Sweep)": ["2hk"],
      "Jumping Light / Cross-up": ["jlk", "jmk"],
      "Jumping Heavy Attack": ["jhp", "jhk"],
      "Command Overhead": ["6mp", "6mk"],
      "Special 1 (Projectile / Neutral)": ["236p"],
      "Special 2 (Anti-Air / DP)": ["623p"],
      "Special 3 (Advance / Tatsu)": ["214k"],
      "Drive Impact": ["di", "driveimpact"],
      "Normal Throw / Back Throw": ["throw"],
      "Super Art Level 3 (SA3)": ["sa3", "236236"]
    };

    Object.entries(sf6Map).forEach(([moveName, tokens]) => {
      const hitImg = imgs.find((im) => im.title.includes("hitbox") && tokens.some((t) => im.title.includes(t)));
      const anyImg = hitImg || imgs.find((im) => tokens.some((t) => im.title.includes(t)));
      if (anyImg) {
        result[moveName] = { url: anyImg.url, type: "image", source: "SuperCombo Wiki" };
      }
    });
    return result;
  } catch (_) {
    return {};
  }
}

async function resolveWavuHitboxes(charName) {
  const first = charName.toLowerCase().replace(/[^a-z0-9]+/g, "_").split("_")[0];
  try {
    const url = `https://wavu.wiki/w/api.php?action=query&list=allimages&aiprefix=${encodeURIComponent(
      `T8-p2-${first}-`
    )}&ailimit=50&format=json`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return {};
    const data = await res.json();
    const files = data?.query?.allimages || [];
    if (files.length === 0) return {};

    const result = {};
    const t8Map = {
      "Left Jab String (10f Punish)": ["1,2", "1"],
      "Flash / i10 Knockdown String": ["1,1,2", "2,1"],
      "Quick Mid Check": ["df+1"],
      "Standing i15 Uppercut Launcher": ["df+2"],
      "Hopkick Low Crush Launcher": ["uf+4"],
      "While Standing 11f Punish": ["ws+4"],
      "While Standing i13/i15 Launcher": ["ws+2", "ws+1,2"],
      "Generic Fast Low Poke": ["d+4", "db+3"],
      "Heat Burst (Universal Armor)": ["2+3"],
      "Rage Art (Super Invencible)": ["df+1+2"]
    };

    Object.entries(t8Map).forEach(([moveName, tokens]) => {
      const found = files.find((f) => tokens.some((t) => f.name.toLowerCase().includes(t)));
      if (found && (found.url.endsWith(".mp4") || found.url.endsWith(".webp") || found.url.endsWith(".gif"))) {
        result[moveName] = {
          url: found.url,
          type: found.url.endsWith(".mp4") ? "video" : "image",
          source: "Wavu Wiki"
        };
      }
    });
    return result;
  } catch (_) {
    return {};
  }
}

async function resolveCharacterHitboxes(gameId, charName) {
  const key = `${gameId}:${charName}`;
  if (hitboxCache.has(key)) {
    return hitboxCache.get(key);
  }

  let data = {};
  if (gameId === "ssbu") {
    data = await resolveSsbuHitboxes(charName);
  } else if (gameId === "gg-strive" || gameId === "dbfz") {
    data = await resolveDustloopHitboxes(gameId, charName);
  } else if (gameId === "sf6") {
    data = await resolveSuperComboHitboxes(charName);
  } else if (gameId === "tekken8") {
    data = await resolveWavuHitboxes(charName);
  }

  hitboxCache.set(key, data);
  return data;
}

module.exports = {
  resolveCharacterHitboxes
};
