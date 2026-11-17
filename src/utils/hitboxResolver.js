/**
 * Resolutor de Hitboxes y Animaciones Reales del Juego desde Wikis Oficiales:
 * - Super Smash Bros. Ultimate: https://ultimateframedata.com/ (GIFs animados reales de hitboxes)
 * - Street Fighter 6: https://wiki.supercombo.gg/images/ (Imágenes oficiales *_hitbox.png reales de SF6)
 * - Guilty Gear -Strive- & Dragon Ball FighterZ: https://www.dustloop.com/ (Hitbox PNGs y frames reales)
 * - Tekken 8: https://wavu.wiki/ (Clips MP4/WebP reales del modo entrenamiento)
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const hitboxCache = new Map();
const ANIM_DIR = path.join(__dirname, "..", "..", "animaciones-personajes");
const ANIM_CDN_BASE_URL = (process.env.ANIM_CDN_BASE_URL || "").trim().replace(/\/+$/, "");

function resolveAssetUrl(relPath) {
  if (ANIM_CDN_BASE_URL) {
    const cleanRel = String(relPath || "").replace(/^\/?animaciones-personajes\//, "").replace(/^\/+/, "");
    return `${ANIM_CDN_BASE_URL}/${cleanRel}`;
  }
  return relPath;
}

function loadLocalManifest() {
  try {
    const manifestPath = path.join(ANIM_DIR, "manifest.json");
    if (!fs.existsSync(manifestPath)) return {};
    const raw = fs.readFileSync(manifestPath, "utf8").replace(/^\uFEFF/, "");
    return JSON.parse(raw);
  } catch (_) {
    return {};
  }
}

let localManifestCache = null;
function getLocalCharHitboxes(gameId, charName) {
  if (!localManifestCache || Object.keys(localManifestCache).length === 0) {
    localManifestCache = loadLocalManifest();
  }
  const key = `${gameId}|${charName}`;
  const entries = localManifestCache[key];
  if (!entries || typeof entries !== "object") return {};

  const verified = {};
  for (const [moveName, info] of Object.entries(entries)) {
    if (!info || !info.url) continue;
    const rel = String(info.url).replace(/^\/+/, "");
    const absPath = path.join(__dirname, "..", "..", rel);
    if (ANIM_CDN_BASE_URL || fs.existsSync(absPath)) {
      verified[moveName] = {
        ...info,
        localUrl: resolveAssetUrl(info.url)
      };
    }
  }

  // Índice adicional por tokens de archivo descargados en la carpeta del personaje
  const charSlug = String(charName || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const charDir = path.join(ANIM_DIR, gameId, charSlug);
  if (fs.existsSync(charDir)) {
    try {
      const files = fs.readdirSync(charDir);
      files.forEach((f) => {
        const lower = f.toLowerCase();
        const url = resolveAssetUrl(`/animaciones-personajes/${gameId}/${charSlug}/${f}`);
        const type = /\.(mp4|webm)$/i.test(f) ? "video" : "image";
        verified[`__file:${lower}`] = {
          url,
          localUrl: url,
          type,
          hasNativeHitbox: lower.includes("hitbox") || gameId === "ssbu",
          source: gameId === "ssbu" ? "Ultimate Frame Data" : gameId === "sf6" ? "SuperCombo Wiki" : gameId === "tekken8" ? "Wavu Wiki" : "Dustloop Wiki"
        };
      });
    } catch (_) {}
  }
  return verified;
}

function getSuperComboHashedUrl(fileName) {
  const firstUpper = fileName.charAt(0).toUpperCase() + fileName.slice(1);
  const hash = crypto.createHash("md5").update(firstUpper).digest("hex");
  return `https://wiki.supercombo.gg/images/${hash.slice(0, 1)}/${hash.slice(0, 2)}/${encodeURIComponent(firstUpper)}`;
}

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

const GGST_DUSTLOOP_PREFIX = {
  "Queen Dizzy": "Dizzy",
  "Asuka R#": "Asuka_R",
  "Jam Kuradoberi": "Jam_Kuradoberi",
  "Robo-Ky": "Robo-Ky"
};

const DBFZ_DUSTLOOP_PREFIX = {
  "Goku (Super Saiyan)": "SSJGoku",
  "Vegeta (Super Saiyan)": "SSJVegeta",
  "Goku (SSGSS / Blue)": "SSGSSGoku",
  "Vegeta (SSGSS / Blue)": "SSGSSVegeta",
  "Gohan (Teen)": "TeenGohan",
  "Gohan (Adult)": "AdultGohan",
  "Captain Ginyu": "Ginyu",
  "Frieza": "Freeza",
  "Majin Buu": "MajinBuu",
  "Kid Buu": "KidBuu",
  "Android 16": "Android16",
  "Android 17": "Android17",
  "Android 18": "Android18",
  "Android 21 (Majin)": "Android21",
  "Goku Black": "GokuBlack",
  "Broly (Z)": "Broly",
  "Zamasu (Fused)": "FusedZamasu",
  "Vegito (SSGSS)": "Vegito",
  "Goku (Base)": "BaseGoku",
  "Vegeta (Base)": "BaseVegeta",
  "Goku (GT)": "GTGoku",
  "Gogeta (SSGSS)": "Gogeta",
  "Broly (DBS)": "DBSBroly",
  "Goku (Ultra Instinct)": "UIGoku",
  "Master Roshi": "MasterRoshi",
  "Super Baby 2": "SuperBaby2",
  "Gogeta (SS4)": "GogetaSS4",
  "Android 21 (Lab Coat)": "LabCoat21",
  "Goku (Super Saiyan 4 - DAIMA)": "SS4DaimaGoku"
};

function normalizeMoveToken(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function matchBestUfdGif(gifUrls, moveName) {
  const m = moveName.toLowerCase();
  const rules = [
    ["jab 1", ["jab1", "jab"]],
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
        result[mn] = { url: gifUrl, type: "image", hasNativeHitbox: true, source: "Ultimate Frame Data" };
      }
    });
    return result;
  } catch (_) {
    return {};
  }
}

async function resolveDustloopHitboxes(gameId, charName) {
  const prefixGame = gameId === "gg-strive" ? "GGST" : "DBFZ";
  const charSlug =
    gameId === "gg-strive"
      ? (GGST_DUSTLOOP_PREFIX[charName] || charName).replace(/\s+/g, "_")
      : (DBFZ_DUSTLOOP_PREFIX[charName] || charName.replace(/\s+/g, ""));
  const prefix = `${prefixGame}_${charSlug}_`;

  try {
    const url = `https://www.dustloop.com/wiki/api.php?action=query&list=allimages&aiprefix=${encodeURIComponent(
      prefix
    )}&ailimit=250&format=json`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return {};
    const data = await res.json();
    const imgs = data?.query?.allimages || [];
    if (imgs.length === 0) return {};

    const result = {};
    const findMoveMedia = (tokens) => {
      const hitboxMatch = imgs.find((im) => {
        const n = im.name.toLowerCase();
        return n.includes("hitbox") && tokens.some((t) => n.includes(`_${t.toLowerCase()}`));
      });
      const normalMatch = imgs.find((im) => {
        const n = im.name.toLowerCase();
        return (
          !n.includes("icon") &&
          !n.includes("portrait") &&
          !n.includes("hitbox") &&
          tokens.some((t) => n.includes(`_${t.toLowerCase()}.`) || n.includes(`_${t.toLowerCase()}_`))
        );
      });
      return {
        hitboxUrl: hitboxMatch ? hitboxMatch.url : null,
        spriteUrl: normalMatch ? normalMatch.url : null
      };
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
            "Jumping Medium (j.M)": ["jM", "j.M"],
            "Jumping Heavy (j.H)": ["jH", "j.H"],
            "Special 1 (QCF Attack)": ["236L", "236M", "236S", "Kamehameha"],
            "Special 2 (QCB Mix / Advance)": ["214L", "214M", "214S"],
            "Dragon Rush (Throw L+M)": ["DR", "DragonRush"],
            "Super Dash (H+S)": ["SD", "SuperDash"],
            "Level 3 Super (3 Barras)": ["214LM", "236HS"]
          };

    Object.entries(moveMap).forEach(([moveName, tokens]) => {
      const media = findMoveMedia(tokens);
      const chosen = media.hitboxUrl || media.spriteUrl;
      if (chosen) {
        result[moveName] = {
          url: chosen,
          animUrl: media.spriteUrl || chosen,
          type: "image",
          hasNativeHitbox: Boolean(media.hitboxUrl),
          source: "Dustloop Wiki"
        };
      }
    });
    return result;
  } catch (_) {
    return {};
  }
}

async function resolveWavuHitboxes(charName) {
  const slugMap = {
    "Jin Kazama": "jin",
    "Kazuya Mishima": "kazuya",
    "Jun Kazama": "jun",
    "Paul Phoenix": "paul",
    "Marshall Law": "law",
    "King": "king",
    "Lars Alexandersson": "lars",
    "Jack-8": "jack-8",
    "Ling Xiaoyu": "xiaoyu",
    "Nina Williams": "nina",
    "Asuka Kazama": "asuka",
    "Leroy Smith": "leroy",
    "Lili": "lili",
    "Hwoarang": "hwoarang",
    "Bryan Fury": "bryan",
    "Claudio Serafino": "claudio",
    "Azucena": "azucena",
    "Raven": "raven",
    "Leo Kliesen": "leo",
    "Steve Fox": "steve",
    "Kuma": "kuma",
    "Yoshimitsu": "yoshimitsu",
    "Shaheen": "shaheen",
    "Sergei Dragunov": "dragunov",
    "Feng Wei": "feng",
    "Panda": "panda",
    "Zafina": "zafina",
    "Lee Chaolan": "lee",
    "Alisa Bosconovitch": "alisa",
    "Devil Jin": "devil-jin",
    "Victor Chevalier": "victor",
    "Reina": "reina",
    "Eddy Gordo": "eddy",
    "Lidia Sobieska": "lidia",
    "Heihachi Mishima": "heihachi",
    "Clive Rosfield": "clive",
    "Anna Williams": "anna",
    "Fahkumram": "fahkumram",
    "Armor King": "armor-king",
    "Kunimitsu": "kunimitsu",
    "Bob": "bob",
    "Roger Jr.": "roger"
  };

  const wavuSlug = slugMap[charName] || charName.toLowerCase().split(" ")[0];
  try {
    const url = `https://wavu.wiki/w/api.php?action=query&list=allimages&aiprefix=${encodeURIComponent(
      `T8-p2-${wavuSlug}-`
    )}&ailimit=300&format=json`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return {};
    const data = await res.json();
    const files = data?.query?.allimages || [];
    if (files.length === 0) return {};

    const result = {};
    const t8Map = {
      "Left Jab String (10f Punish)": ["1,2", "1,1", "1."],
      "Flash / i10 Knockdown String": ["1,1,2", "2,1", "2,2"],
      "Quick Mid Check": ["df+1.", "df+1,"],
      "Mid Follow-up Extension": ["df+1,2", "df+1,4", "f+1,2"],
      "i12 Block Punisher": ["f+2,1", "b+1,2", "2,2", "b+1."],
      "Homing Mid Kick (Anti-Sidestep)": ["b+4", "df+3", "b+3"],
      "Keepout Long Range Mid": ["f+4", "ff+2", "f,f+2"],
      "Standing i15 Uppercut Launcher": ["df+2"],
      "Hopkick Low Crush Launcher": ["uf+4", "uf+3"],
      "Electric / Signature Launcher": ["f,n,d,df+2", "ff+3", "df+2"],
      "While Standing 11f Punish": ["ws+4", "ws4"],
      "While Standing i13/i15 Launcher": ["ws+2", "ws+1,2", "ws2"],
      "Generic Fast Low Poke": ["d+4", "db+3", "db+4"],
      "High-Crush Power Low / Hell Sweep": ["d+2", "f,n,d,df+4", "db+2"],
      "While Running Pressure": ["f,f,f+3", "wr+2", "fff+3"],
      "Power Crush (Armor Mid)": ["b+3", "ub+1+2", "f+1+2"],
      "Command Throw (1+2 Break)": ["uf+1+2", "2+4", "1+3"],
      "Heat Burst (Universal Armor)": ["2+3"],
      "Rage Art (Super Invencible)": ["df+1+2"]
    };

    Object.entries(t8Map).forEach(([moveName, tokens]) => {
      const found = files.find((f) =>
        tokens.some((t) => f.name.toLowerCase().includes(t))
      );
      if (
        found &&
        (found.url.endsWith(".mp4") ||
          found.url.endsWith(".webp") ||
          found.url.endsWith(".gif"))
      ) {
        result[moveName] = {
          url: found.url,
          type: found.url.endsWith(".mp4") ? "video" : "image",
          hasNativeHitbox: false,
          source: "Wavu Wiki"
        };
      }
    });
    return result;
  } catch (_) {
    return {};
  }
}

const SF6_CHAR_PREFIX = {
  "Ken Masters": "Ken",
  "Juri Han": "Juri",
  "E. Honda": "EHonda",
  "A.K.I.": "AKI",
  "M. Bison": "MBison",
  "Dee Jay": "DeeJay",
  "Terry Bogard": "Terry",
  "Mai Shiranui": "Mai",
  "C. Viper": "CViper"
};

async function checkImageExists(url) {
  try {
    const r = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": USER_AGENT }
    });
    return r.ok;
  } catch (_) {
    return false;
  }
}

async function resolveSf6Hitboxes(charName) {
  const sfSlug = (SF6_CHAR_PREFIX[charName] || charName).replace(/\s+/g, "");
  const moveTokensMap = {
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
    "Jumping Light / Cross-up": ["jlk", "jmk", "jlp"],
    "Jumping Heavy Attack": ["jhp", "jhk"],
    "Command Overhead": ["6mp", "6mk", "6hp"],
    "Target Combo": ["5mp5lk5hk", "5mp5hp"],
    "Special 1 (Projectile / Neutral)": ["236p", "236k", "214p"],
    "Special 2 (Anti-Air / DP)": ["623p", "623k", "22p"],
    "Special 3 (Advance / Tatsu)": ["214k", "214p", "236k"],
    "Drive Impact": ["di", "5hphk"],
    "Normal Throw / Back Throw": ["5lplk", "throw"],
    "Super Art Level 3 (SA3)": ["sa3", "236236p", "236236k"]
  };

  const result = {};
  await Promise.all(
    Object.entries(moveTokensMap).map(async ([moveName, tokens]) => {
      for (const tok of tokens) {
        const hbUrl = getSuperComboHashedUrl(`SF6_${sfSlug}_${tok}_hitbox.png`);
        if (await checkImageExists(hbUrl)) {
          result[moveName] = {
            url: hbUrl,
            type: "image",
            hasNativeHitbox: true,
            source: "SuperCombo Wiki"
          };
          return;
        }
        const mvUrl = getSuperComboHashedUrl(`SF6_${sfSlug}_${tok}.png`);
        if (await checkImageExists(mvUrl)) {
          result[moveName] = {
            url: mvUrl,
            type: "image",
            hasNativeHitbox: false,
            source: "SuperCombo Wiki"
          };
          return;
        }
      }
    })
  );
  return result;
}

async function resolveCharacterHitboxes(gameId, charName) {
  const key = `${gameId}:${charName}`;
  if (hitboxCache.has(key)) {
    return hitboxCache.get(key);
  }

  const localData = getLocalCharHitboxes(gameId, charName);
  let remoteData = {};

  if (gameId === "ssbu") {
    remoteData = await resolveSsbuHitboxes(charName);
  } else if (gameId === "sf6") {
    remoteData = await resolveSf6Hitboxes(charName);
  } else if (gameId === "gg-strive" || gameId === "dbfz") {
    remoteData = await resolveDustloopHitboxes(gameId, charName);
  } else if (gameId === "tekken8") {
    remoteData = await resolveWavuHitboxes(charName);
  }

  // Priorizar archivos ya descargados en animaciones-personajes/ sobre URLs remotas
  const merged = { ...remoteData, ...localData };
  hitboxCache.set(key, merged);
  return merged;
}

module.exports = {
  resolveCharacterHitboxes
};
