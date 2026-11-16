/**
 * Planteles completos actualizados a la última versión (2026):
 * - Mortal Kombat 1 (35 personajes: Base + Kombat Pack 1 + Khaos Reigns)
 * - Street Fighter 6 (30 personajes: Base + Year 1 + Year 2 + Year 3 Pass)
 * - Tekken 8 (44 personajes: Base + Season 1 Pass + Season 2 Pass + Season 3 Pass)
 * - Dragon Ball FighterZ (44 personajes: Base + Pass 1, 2, 3 + Lab Coat)
 * - Guilty Gear -Strive- (32 personajes: Base + Season Pass 1, 2, 3 y 4)
 * - Super Smash Bros. Ultimate (86 personajes: Base + Fighters Pass Vol. 1 y 2)
 */

const crypto = require("crypto");

function getMediaWikiHashedUrl(baseImagesUrl, fileName) {
  const normalized = fileName.replace(/\s+/g, "_");
  const firstUpper = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  const hash = crypto.createHash("md5").update(firstUpper).digest("hex");
  const c1 = hash.slice(0, 1);
  const c1c2 = hash.slice(0, 2);
  return `${baseImagesUrl}/${c1}/${c1c2}/${encodeURIComponent(firstUpper)}`;
}

const SSBU_SLUGS = {
  "Mario": "mario", "Donkey Kong": "donkey_kong", "Link": "link", "Samus": "samus",
  "Dark Samus": "dark_samus", "Yoshi": "yoshi", "Kirby": "kirby", "Fox": "fox",
  "Pikachu": "pikachu", "Luigi": "luigi", "Ness": "ness", "Captain Falcon": "captain_falcon",
  "Jigglypuff": "jigglypuff", "Peach": "peach", "Daisy": "daisy", "Bowser": "bowser",
  "Ice Climbers": "ice_climbers", "Sheik": "sheik", "Zelda": "zelda", "Dr. Mario": "dr_mario",
  "Pichu": "pichu", "Falco": "falco", "Marth": "marth", "Lucina": "lucina",
  "Young Link": "young_link", "Ganondorf": "ganondorf", "Mewtwo": "mewtwo", "Roy": "roy",
  "Chrom": "chrom", "Mr. Game & Watch": "mr_game_and_watch", "Meta Knight": "meta_knight",
  "Pit": "pit", "Dark Pit": "dark_pit", "Zero Suit Samus": "zero_suit_samus", "Wario": "wario",
  "Snake": "snake", "Ike": "ike", "Pokémon Trainer": "pokemon_trainer", "Diddy Kong": "diddy_kong",
  "Lucas": "lucas", "Sonic": "sonic", "King Dedede": "king_dedede", "Olimar": "olimar",
  "Lucario": "lucario", "R.O.B.": "rob", "Toon Link": "toon_link", "Wolf": "wolf",
  "Villager": "villager", "Mega Man": "mega_man", "Wii Fit Trainer": "wii_fit_trainer",
  "Rosalina & Luma": "rosalina_and_luma", "Little Mac": "little_mac", "Greninja": "greninja",
  "Palutena": "palutena", "Pac-Man": "pac_man", "Robin": "robin", "Shulk": "shulk",
  "Bowser Jr.": "bowser_jr", "Duck Hunt": "duck_hunt", "Ryu (Smash)": "ryu", "Ken (Smash)": "ken",
  "Cloud Strife": "cloud", "Corrin": "corrin", "Bayonetta": "bayonetta", "Inkling": "inkling",
  "Ridley": "ridley", "Simon": "simon", "Richter": "richter", "King K. Rool": "king_k_rool",
  "Isabelle": "isabelle", "Incineroar": "incineroar", "Mii Brawler": "mii_fighter",
  "Mii Swordfighter": "mii_fighter", "Mii Gunner": "mii_fighter", "Piranha Plant": "piranha_plant",
  "Joker": "joker", "Hero": "dq_hero", "Banjo & Kazooie": "banjo_and_kazooie", "Terry": "terry",
  "Byleth": "byleth", "Min Min": "minmin", "Steve": "steve", "Sephiroth": "sephiroth",
  "Pyra / Mythra": "homura", "Kazuya": "kazuya", "Sora": "sora"
};

const SF6_CDN_SLUGS = {
  "Ryu": "ryu", "Ken Masters": "ken", "Luke": "luke", "Jamie": "jamie",
  "Chun-Li": "chunli", "Guile": "guile", "Kimberly": "kimberly", "Juri Han": "juri",
  "Blanka": "blanka", "Dhalsim": "dhalsim", "E. Honda": "ehonda", "Dee Jay": "deejay",
  "Manon": "manon", "Marisa": "marisa", "JP": "jp", "Zangief": "zangief",
  "Lily": "lily", "Cammy": "cammy", "Rashid": "rashid", "A.K.I.": "aki",
  "Ed": "ed", "Akuma": "gouki", "M. Bison": "vega", "Terry Bogard": "terry",
  "Mai Shiranui": "mai", "Elena": "elena", "Sagat": "sagat", "C. Viper": "cviper",
  "Alex": "alex", "Ingrid": "ingrid"
};

const MK1_CDN_SLUGS = {
  "Scorpion": "scorpion", "Sub-Zero": "sub-zero", "Liu Kang": "liu-kang", "Raiden": "raiden",
  "Kung Lao": "kung-lao", "Kitana": "kitana", "Mileena": "mileena", "Johnny Cage": "johnny-cage",
  "Kenshi": "kenshi", "Smoke": "smoke", "Rain": "rain", "Li Mei": "li-mei",
  "Tanya": "tanya", "Baraka": "baraka", "Geras": "geras", "Reptile": "reptile",
  "Ashrah": "ashrah", "Havik": "havik", "General Shao": "general-shao", "Sindel": "sindel",
  "Nitara": "nitara", "Reiko": "reiko", "Shang Tsung": "shang-tsung", "Omni-Man": "omni-man",
  "Quan Chi": "quan-chi", "Peacemaker": "peacemaker", "Ermac": "ermac", "Homelander": "homelander",
  "Takeda Takahashi": "takeda", "Cyrax": "cyrax", "Sektor": "sektor", "Noob Saibot": "noob-saibot",
  "Ghostface": "ghostface", "Conan the Barbarian": "conan", "T-1000": "t-1000"
};

const SF6_SUPERCOMBO_NAMES = {
  "Ken Masters": "Ken",
  "Juri Han": "Juri",
  "Terry Bogard": "Terry",
  "Mai Shiranui": "Mai"
};

const DBFZ_DUSTLOOP_NAMES = {
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

function getDirectPortraitUrl(gameId, charName, colorHex = "f59e0b", isDLC = false) {
  // 1. Smash Ultimate: Mugshot cuadrado de cara oficial de Nintendo
  if (gameId === "ssbu" && SSBU_SLUGS[charName]) {
    return `https://www.smashbros.com/assets_v2/img/fighter/thumb_a/${SSBU_SLUGS[charName]}.png`;
  }
  // 2. Street Fighter 6: Icono cuadrado de cara de SuperCombo Wiki (MD5 Hash exacto)
  if (gameId === "sf6") {
    const scName = (SF6_SUPERCOMBO_NAMES[charName] || charName).replace(/\s+/g, "_");
    return getMediaWikiHashedUrl("https://wiki.supercombo.gg/images", `SF6_${scName}_Icon.png`);
  }
  // 3. Guilty Gear -Strive-: Icono cuadrado de cara de Dustloop Wiki (MD5 Hash exacto)
  if (gameId === "gg-strive") {
    const ggName = charName.replace(/\s+/g, "_");
    return getMediaWikiHashedUrl("https://www.dustloop.com/w/images", `GGST_${ggName}_Icon.png`);
  }
  // 4. Dragon Ball FighterZ: Icono cuadrado de cara de Dustloop Wiki (MD5 Hash exacto)
  if (gameId === "dbfz") {
    const dbName = (DBFZ_DUSTLOOP_NAMES[charName] || charName).replace(/\s+/g, "_");
    return getMediaWikiHashedUrl("https://www.dustloop.com/w/images", `DBFZ_${dbName}_Icon.png`);
  }
  // 5. Mortal Kombat 1: Retrato cuadrado oficial de rostro
  if (gameId === "mk1" && MK1_CDN_SLUGS[charName]) {
    return `https://cdn-mk1.mortalkombat.com/roster/${MK1_CDN_SLUGS[charName]}/thumb.webp`;
  }
  // 6. Tekken 8 y resto: Resolutor del servidor con caché de rostro
  const slug = encodeURIComponent(charName);
  const bg = isDLC ? "2e1065" : "0f172a";
  const border = isDLC ? "a855f7" : colorHex.replace("#", "");
  return `/api/char-icon?v=7&name=${slug}&game=${encodeURIComponent(gameId)}&bg=${bg}&border=${border}`;
}

function getFallbackIconUrl(gameId, charName, colorHex = "f59e0b", isDLC = false) {
  if (gameId === "sf6" && SF6_CDN_SLUGS[charName]) {
    const s = SF6_CDN_SLUGS[charName];
    return `https://www.streetfighter.com/6/assets/images/character/${s}/${s}.png`;
  }
  const slug = encodeURIComponent(charName);
  const bg = isDLC ? "2e1065" : "0f172a";
  const border = isDLC ? "a855f7" : colorHex.replace("#", "");
  return `/api/char-icon?v=7&name=${slug}&game=${encodeURIComponent(gameId)}&bg=${bg}&border=${border}`;
}

function buildRosterEntry(gameId, sagaNotation, wikiBaseUrl, defaultVideo, colorHex, raw) {
  const slug = raw.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const isDLC = Boolean(raw.dlcPack);

  const keyMoves = raw.keyMoves || getDefaultKeyMoves(gameId, raw.name);
  const combos = raw.combos || getDefaultCombos(gameId);
  const gameplan =
    raw.gameplan ||
    `Domina el neutro con las herramientas de ${raw.archetype.toLowerCase()} de ${raw.name}. Aprovecha sus botones seguros a media distancia para confirmar en tu ruta BnB principal y gestiona tus recursos del sistema para romper la guardia rival en la esquina.`;

  return {
    id: `${gameId}-${slug}`,
    name: raw.name,
    archetype: raw.archetype || "Equilibrado",
    difficulty: raw.difficulty || "Media",
    isDLC,
    dlcPack: raw.dlcPack || null,
    recommendedSubSystem: raw.sub || getDefaultSubSystem(gameId),
    iconUrl: raw.iconUrl || getDirectPortraitUrl(gameId, raw.name, colorHex, isDLC),
    fallbackIconUrl: getFallbackIconUrl(gameId, raw.name, colorHex, isDLC),
    videoUrl: raw.videoUrl || defaultVideo,
    sourceUrl: raw.sourceUrl || `${wikiBaseUrl}${encodeURIComponent(raw.name.replace(/\s+/g, "_"))}`,
    overview:
      raw.overview ||
      `${raw.name} destaca en el rol de ${raw.archetype} con herramientas sólidas de presión, conversión de daño y control del ritmo del combate.`,
    keyMoves,
    combos,
    gameplan
  };
}

function getDefaultSubSystem(gameId) {
  switch (gameId) {
    case "mk1": return "Kameo: Khameleon / Ferra / Sektor";
    case "sf6": return "Drive System (Clásico / Moderno)";
    case "tekken8": return "Heat System Season 3 + Tornado";
    case "dbfz": return "Assist A / B + Limit Break";
    case "gg-strive": return "Roman Cancel + Wild Assault";
    case "ssbu": return "Out of Shield (OOS) + Edgeguard";
    default: return "Sistema Principal";
  }
}

function getDefaultKeyMoves(gameId, name) {
  switch (gameId) {
    case "mk1":
      return [
        { input: "1, 2", frames: "7f High-Mid", notes: `Cadena rápida de ${name} para tomar el turno y castigar.` },
        { input: "f+3, 2", frames: "12f Mid", notes: "Confirmación a media distancia hacia lanzador o especial." },
        { input: "b+3", frames: "15f Low", notes: "Herramienta baja para abrir la guardia en neutro." },
        { input: "bf+1 / db+2", frames: "Especial Clave", notes: "Especial principal potenciado con 1 barra (EX) para extender combo." }
      ];
    case "sf6":
      return [
        { input: "2MK", frames: "7-8f Low", notes: "Golpe bajo cancelable en Drive Rush (DRC) para iniciar presión." },
        { input: "5HP", frames: "10f High/Mid", notes: "Botón fuerte de castigo (Whiff Punish) cancelable en especial." },
        { input: "2HP / 623P", frames: "Antiaéreo", notes: "Frena saltos rivales de forma consistente." },
        { input: "236P / 214K", frames: "Especial Principal", notes: "Control de espacio y remate seguro de combos." }
      ];
    case "tekken8":
      return [
        { input: "1, 2", frames: "i10 High-High", notes: "Castigo rápido de 10 frames e inicio de presión." },
        { input: "df+1", frames: "i13 Mid", notes: "Chequeo medio fundamental para controlar pasos laterales." },
        { input: "df+2 / uf+4", frames: "i15 Launcher", notes: "Lanzador de 15 frames para castigar ataques inseguros en bloqueo." },
        { input: "ff+2", frames: "Heat Engager", notes: "Avance de largo alcance que activa Heat (+17 en impacto)." }
      ];
    case "dbfz":
      return [
        { input: "5L > 5LL", frames: "6-7f", notes: "Inicio rápido de presión en bloque y confirmación en salto." },
        { input: "2M > 5M", frames: "10f Low-Mid", notes: "Arranque óptimo de máximo escalado para la ruta universal." },
        { input: "2H", frames: "Antiaéreo", notes: "Invulnerable a Super Dash y ataques aéreos." },
        { input: "236L/M/H", frames: "Especial de Presión", notes: "Cierra cadenas de bloqueo cubierto por una asistencia." }
      ];
    case "gg-strive":
      return [
        { input: "c.S", frames: "7f (+3 on block)", notes: "Pilar de la ofensiva y de las rutas de mayor daño." },
        { input: "f.S > 5HS", frames: "10f Mid", notes: "Control horizontal del suelo cancelable en especial o Wild Assault." },
        { input: "6P", frames: "Antiaéreo", notes: "Invulnerabilidad en la parte superior del cuerpo." },
        { input: "2K > 2D", frames: "Low Knockdown", notes: "Derribo bajo rápido para iniciar Okizeme." }
      ];
    case "ssbu":
      return [
        { input: "Nair / Fair", frames: "Aéreo Neutro", notes: "Espaciado seguro sobre el escudo rival con Fast Fall." },
        { input: "Bair (RAR)", frames: "Kill Move", notes: "Herramienta aérea principal para cerrar stocks cerca del borde." },
        { input: "Utilt / Dtilt", frames: "Combo Starter", notes: "Iniciador de combos a porcentajes bajos y medios (0%-45%)." },
        { input: "Up-B / Up-Smash", frames: "Out of Shield", notes: "Respuesta rápida directa desde el escudo sin soltarlo." }
      ];
    default:
      return [];
  }
}

function getDefaultCombos(gameId) {
  switch (gameId) {
    case "mk1":
      return [
        { type: "Midscreen (Sin Barra)", notation: "f+3,2 > j.1,2 ~ db+2 > dash > 2,1 ~ bf+1", damage: "335 dmg" },
        { type: "Confirmación 1 Barra + Kameo", notation: "1,2 ~ EX bf+1 > Kameo > f+3,2 > j.1,2,2 ~ bf+2", damage: "405 dmg" },
        { type: "Esquina (Corner BnB)", notation: "b+3,2 ~ db+2 > 4 ~ bf+1 > 1,2 ~ db+4", damage: "385 dmg" }
      ];
    case "sf6":
      return [
        { type: "Midscreen Básico", notation: "2LP > 2LP ~ 236LP / 623LP", damage: "1580 dmg" },
        { type: "Drive Rush Confirm (3 Barras)", notation: "2MK ~ DRC > 5MP > 2HP ~ 214MP > 623HP", damage: "2540 dmg" },
        { type: "Esquina Punish Counter + Nivel 3", notation: "5HP ~ 236PP > 2MP ~ 214HP ~ SA3 (236236P)", damage: "5350 dmg" }
      ];
    case "tekken8":
      return [
        { type: "Combo Estándar (i15 Launcher)", notation: "df+2 > df+1 > b+2,1 > df+4,3 (Tornado) > dash > ff+2,1", damage: "69 dmg" },
        { type: "Combo con Heat Burst", notation: "uf+4 > df+1 > b+1,2 (Tornado) > Heat Burst > dash > f+2,3,1", damage: "76 dmg" }
      ];
    case "dbfz":
      return [
        { type: "Midscreen Ruta Universal", notation: "2M > 5M > jc > j.MLL > j.2H > SD > j.MLL > j.2H > jc > j.LLL", damage: "4150 dmg" },
        { type: "Esquina Óptimo", notation: "2M > 5M > 236M > 2M > 5H > SD > j.MLL > j.2H > jc > j.LLL ~ Super Lv1", damage: "5280 dmg" }
      ];
    case "gg-strive":
      return [
        { type: "Midscreen Gatling BnB", notation: "c.S > 2S > 5HS ~ 236S / 214K", damage: "168 dmg" },
        { type: "Confirmación RRC Wall Break", notation: "2K > 2D ~ 236S > RRC > dash > c.S > 2HS ~ 214HS > 6HS (Wall Break)", damage: "242 dmg" }
      ];
    case "ssbu":
      return [
        { type: "0% - 35% Bread & Butter", notation: "Down Throw / Utilt > Short Hop Fair > Fast Fall > Dash Attack", damage: "33%" },
        { type: "Kill Confirm (95% - 120%)", notation: "Landing Nair / Dtilt > RAR Back Air / Up-Smash", damage: "26% (KO)" }
      ];
    default:
      return [];
  }
}

// ============================================================================
// 1. MORTAL KOMBAT 1 — ROSTER COMPLETO (35 PERSONAJES: 23 BASE + 12 DLC)
// ============================================================================
const MK1_RAW = [
  { name: "Scorpion", archetype: "Whiff Punisher / Mid-Range", difficulty: "Fácil" },
  { name: "Sub-Zero", archetype: "Mix-up / Control con Clones", difficulty: "Fácil" },
  { name: "Liu Kang", archetype: "Shoto / Zoning & Strike-Throw", difficulty: "Fácil" },
  { name: "Raiden", archetype: "Rushdown / Daño Eléctrico", difficulty: "Fácil" },
  { name: "Kung Lao", archetype: "Movilidad / Divekick & Mix-up", difficulty: "Media" },
  { name: "Kitana", archetype: "Zoner / Trampas de Abanico", difficulty: "Media" },
  { name: "Mileena", archetype: "Rushdown / Daño Explosivo", difficulty: "Media" },
  { name: "Johnny Cage", archetype: "Rushdown / Presión en Bloqueo", difficulty: "Media" },
  { name: "Kenshi", archetype: "Puppet (Sento) / Setplay", difficulty: "Difícil" },
  { name: "Smoke", archetype: "Mix-up Invisible / Teletransporte", difficulty: "Media" },
  { name: "Rain", archetype: "Zoner / Cancelaciones de Portal", difficulty: "Difícil" },
  { name: "Li Mei", archetype: "Frame Traps / Linternas Aéreas", difficulty: "Fácil" },
  { name: "Tanya", archetype: "Alcance Medio / Parries", difficulty: "Media" },
  { name: "Baraka", archetype: "Presión de Chip Damage / Rushdown", difficulty: "Fácil" },
  { name: "Geras", archetype: "Grappler / Manipulación del Tiempo", difficulty: "Difícil" },
  { name: "Reptile", archetype: "Invisibilidad / Mix-up Alto-Bajo", difficulty: "Fácil" },
  { name: "Ashrah", archetype: "Espaciado Largo / Postura Luz-Oscuridad", difficulty: "Media" },
  { name: "Havik", archetype: "Brawler / Armadura y Caos", difficulty: "Media" },
  { name: "General Shao", archetype: "Postura con Hacha / Powerhouse", difficulty: "Media" },
  { name: "Sindel", archetype: "Levitate / Control Aéreo y Zoning", difficulty: "Media" },
  { name: "Nitara", archetype: "Movilidad Aérea / Air Dash", difficulty: "Difícil" },
  { name: "Reiko", archetype: "Grappler / Proyectiles Shuriken", difficulty: "Fácil" },
  { name: "Shang Tsung", archetype: "Zoner / Transformación Joven-Viejo", difficulty: "Difícil" },
  // Kombat Pack 1
  { name: "Omni-Man", archetype: "Postura Viltrumita / Contra-Zoning", difficulty: "Fácil", dlcPack: "Kombat Pack 1" },
  { name: "Quan Chi", archetype: "Zoner / Portales y Tentáculos", difficulty: "Media", dlcPack: "Kombat Pack 1" },
  { name: "Peacemaker", archetype: "Híbrido Antiaéreo / Eagly & Escudo", difficulty: "Fácil", dlcPack: "Kombat Pack 1" },
  { name: "Ermac", archetype: "Cancelaciones de Vuelo / Presión", difficulty: "Difícil", dlcPack: "Kombat Pack 1" },
  { name: "Homelander", archetype: "Vuelo Ofensivo / Mix-ups en el Aire", difficulty: "Difícil", dlcPack: "Kombat Pack 1" },
  { name: "Takeda Takahashi", archetype: "Alcance Largo / Trampas Kunai", difficulty: "Difícil", dlcPack: "Kombat Pack 1" },
  // Khaos Reigns Expansion
  { name: "Cyrax", archetype: "Setplay con Bombas / Red de Captura", difficulty: "Media", dlcPack: "Khaos Reigns Expansion" },
  { name: "Sektor", archetype: "Presión con Misiles / Lanzallamas", difficulty: "Fácil", dlcPack: "Khaos Reigns Expansion" },
  { name: "Noob Saibot", archetype: "Zoner / Combos con Clon Sombrío", difficulty: "Media", dlcPack: "Khaos Reigns Expansion" },
  { name: "Ghostface", archetype: "Cambio de Asesinos / Sigilo", difficulty: "Media", dlcPack: "Khaos Reigns Expansion" },
  { name: "Conan the Barbarian", archetype: "Espadazo Pesado / Parry Atlante", difficulty: "Fácil", dlcPack: "Khaos Reigns Expansion" },
  { name: "T-1000", archetype: "Metal Líquido / Alcance Polimórfico", difficulty: "Media", dlcPack: "Khaos Reigns Expansion" }
];

// ============================================================================
// 2. STREET FIGHTER 6 — ROSTER COMPLETO ACTUALIZADO A SEASON 3 (30 PERSONAJES)
// ============================================================================
const SF6_RAW = [
  { name: "Ryu", archetype: "Shoto / Equilibrado (Denjin)", difficulty: "Fácil" },
  { name: "Ken Masters", archetype: "Rushdown Shoto / Corner Carry", difficulty: "Fácil" },
  { name: "Luke", archetype: "Shoto Moderno / Supresor de Neutro", difficulty: "Fácil" },
  { name: "Jamie", archetype: "Brawler / Niveles de Bebida (0-4)", difficulty: "Media" },
  { name: "Chun-Li", archetype: "Footsies / Postura Serenity Stream", difficulty: "Difícil" },
  { name: "Guile", archetype: "Zoner Defensivo / Sonic Boom & Flash Kick", difficulty: "Media" },
  { name: "Kimberly", archetype: "Ninja Rushdown / Setplay con Latas", difficulty: "Media" },
  { name: "Juri Han", archetype: "Rushdown / Cargas de Fuha", difficulty: "Media" },
  { name: "Blanka", archetype: "Tricky / Muñecos Blanka-chan", difficulty: "Media" },
  { name: "Dhalsim", archetype: "Zoner de Extremidades Largas / Teleport", difficulty: "Difícil" },
  { name: "E. Honda", archetype: "Carga Pesada / Sumo Headbutt & Buttslam", difficulty: "Fácil" },
  { name: "Dee Jay", archetype: "Fintas Jus Cool / Movilidad Explosiva", difficulty: "Media" },
  { name: "Manon", archetype: "Grappler / Medallas de Judo (Nivel 1-5)", difficulty: "Fácil" },
  { name: "Marisa", archetype: "Brawler de Armadura / Daño Masivo", difficulty: "Fácil" },
  { name: "JP", archetype: "Zoner de Portales / Trampas a Distancia", difficulty: "Difícil" },
  { name: "Zangief", archetype: "Grappler Puro / Spinning Piledriver", difficulty: "Media" },
  { name: "Lily", archetype: "Grappler con Stocks de Viento (Condor Spire)", difficulty: "Fácil" },
  { name: "Cammy", archetype: "Rushdown / Divekick & Whiff Punish", difficulty: "Fácil" },
  // Year 1 Character Pass
  { name: "Rashid", archetype: "Movilidad Aérea / Torbellino Ysaar", difficulty: "Media", dlcPack: "Year 1 Character Pass" },
  { name: "A.K.I.", archetype: "Veneno Tóxico / Control de Esquina", difficulty: "Difícil", dlcPack: "Year 1 Character Pass" },
  { name: "Ed", archetype: "Boxeador de Media Distancia / Psycho Flicker", difficulty: "Media", dlcPack: "Year 1 Character Pass" },
  { name: "Akuma", archetype: "Glass Cannon / Shoto Ofensivo", difficulty: "Media", dlcPack: "Year 1 Character Pass" },
  // Year 2 Character Pass
  { name: "M. Bison", archetype: "Presión Explosiva / Psycho Mine", difficulty: "Media", dlcPack: "Year 2 Character Pass" },
  { name: "Terry Bogard", archetype: "Shoto Versátil / Invitado Fatal Fury", difficulty: "Fácil", dlcPack: "Year 2 Character Pass" },
  { name: "Mai Shiranui", archetype: "Rushdown / Abanicos Kachousen & Musasabi", difficulty: "Fácil", dlcPack: "Year 2 Character Pass" },
  { name: "Elena", archetype: "Capoeira / Footsies de Largo Alcance", difficulty: "Media", dlcPack: "Year 2 Character Pass" },
  // Year 3 Character Pass (Season 3)
  { name: "Sagat", archetype: "Muay Thai Zoner / Tiger Shot & Tiger Uppercut", difficulty: "Fácil", dlcPack: "Year 3 Character Pass" },
  { name: "C. Viper", archetype: "Gadgets de Alta Ejecución / Feints & Burn Kick", difficulty: "Difícil", dlcPack: "Year 3 Character Pass" },
  { name: "Alex", archetype: "Power Grappler-Brawler / Power Bomb & Slash Elbow", difficulty: "Media", dlcPack: "Year 3 Character Pass" },
  { name: "Ingrid", archetype: "Psycho Power Ágil / Contraataques y Proyectil", difficulty: "Media", dlcPack: "Year 3 Character Pass" }
];

// ============================================================================
// 3. TEKKEN 8 — ROSTER COMPLETO ACTUALIZADO A SEASON 3 (44 PERSONAJES)
// ============================================================================
const TEKKEN8_RAW = [
  // Juego Base (32)
  { name: "Jin Kazama", archetype: "All-Rounder / Mishima Versátil", difficulty: "Media" },
  { name: "Kazuya Mishima", archetype: "Mishima Puro / Vortex 50-50", difficulty: "Difícil" },
  { name: "Jun Kazama", archetype: "Defensivo / Curación y Poder Kazama", difficulty: "Media" },
  { name: "Paul Phoenix", archetype: "Powerhouse / Deathfist & Demoman", difficulty: "Fácil" },
  { name: "Marshall Law", archetype: "Rushdown / Nunchaku & Dragon Charge", difficulty: "Media" },
  { name: "King", archetype: "Grappler / Cadenas de Agarres y Jaguar Sprint", difficulty: "Media" },
  { name: "Lars Alexandersson", archetype: "Posturas Dinámicas / Rushdown", difficulty: "Fácil" },
  { name: "Jack-8", archetype: "Keepout / Postura Gamma Howl", difficulty: "Fácil" },
  { name: "Ling Xiaoyu", archetype: "Evasión Extrema / Postura Fénix (AOP)", difficulty: "Difícil" },
  { name: "Nina Williams", archetype: "Presión Asfixiante / Pistolas en Heat", difficulty: "Difícil" },
  { name: "Asuka Kazama", archetype: "Contraataques / Sabakis y Parries", difficulty: "Fácil" },
  { name: "Leroy Smith", archetype: "Wing Chun / Parries y Postura Hermit", difficulty: "Fácil" },
  { name: "Lili", archetype: "El mejor Sidestep / Postura Feisty Rabbit", difficulty: "Fácil" },
  { name: "Hwoarang", archetype: "Presión Infinita de Patadas / Flamingo", difficulty: "Difícil" },
  { name: "Bryan Fury", archetype: "Counter Hit Monster / Taunt Jet Upper", difficulty: "Difícil" },
  { name: "Claudio Serafino", archetype: "Simple y Efectivo / Starburst", difficulty: "Fácil" },
  { name: "Azucena", archetype: "Evasión Auto-Parry / Postura Libertador", difficulty: "Fácil" },
  { name: "Raven", archetype: "Ninjutsu / Clones de Sombra y Soulzone", difficulty: "Media" },
  { name: "Leo Kliesen", archetype: "Equilibrado / Bajiquan & Muro", difficulty: "Media" },
  { name: "Steve Fox", archetype: "Boxeador Puro / Weave & Lionheart", difficulty: "Difícil" },
  { name: "Kuma", archetype: "Daño en Muro / Electric Wind Bear Fist", difficulty: "Fácil" },
  { name: "Yoshimitsu", archetype: "Espada Imbloqueable / Flash (6f)", difficulty: "Difícil" },
  { name: "Shaheen", archetype: "Fundamentos / Slide & Guard Break", difficulty: "Media" },
  { name: "Sergei Dragunov", archetype: "Sambo / Presión iWR2 y Agarres", difficulty: "Media" },
  { name: "Feng Wei", archetype: "Pokes Evasivos / Kenpo Step", difficulty: "Media" },
  { name: "Panda", archetype: "Bear Stance / Shooting Star", difficulty: "Fácil" },
  { name: "Zafina", archetype: "Posturas Arácnidas / Azazel Power", difficulty: "Difícil" },
  { name: "Lee Chaolan", archetype: "Counter Hit / Just Frames (Acid Rain)", difficulty: "Difícil" },
  { name: "Alisa Bosconovitch", archetype: "Movimiento / Motosierras Destructive Form", difficulty: "Fácil" },
  { name: "Devil Jin", archetype: "Mishima / Vuelo Mourning Crow", difficulty: "Difícil" },
  { name: "Victor Chevalier", archetype: "Espada y Pistola / Perfumer & Iai", difficulty: "Fácil" },
  { name: "Reina", archetype: "Rushdown Mishima / Sentai Stance", difficulty: "Media" },

  // DLC Season 1: Playable Character Year 1 Pass (4)
  { name: "Eddy Gordo", archetype: "Capoeira / Negativa y Handstand", difficulty: "Fácil", dlcPack: "Season 1 Character Pass" },
  { name: "Lidia Sobieska", archetype: "Karate / Posturas Heaven & Earth", difficulty: "Media", dlcPack: "Season 1 Character Pass" },
  { name: "Heihachi Mishima", archetype: "Mishima Pesado / Warrior Instinct", difficulty: "Difícil", dlcPack: "Season 1 Character Pass" },
  { name: "Clive Rosfield", archetype: "Espadachín Eikons / Invitado FFXVI", difficulty: "Fácil", dlcPack: "Season 1 Character Pass" },

  // DLC Season 2: Season 2 Character Pass (4)
  { name: "Anna Williams", archetype: "Mix-up Letal 50/50 / Chaos Judgment & Bazooka", difficulty: "Media", dlcPack: "Season 2 Character Pass" },
  { name: "Fahkumram", archetype: "Muay Thai de Largo Alcance / Garuda Force", difficulty: "Media", dlcPack: "Season 2 Character Pass" },
  { name: "Armor King", archetype: "Grappler-Mishima / Dark Upper & Bad Jaguar", difficulty: "Difícil", dlcPack: "Season 2 Character Pass" },
  { name: "Miary Zo", archetype: "Moraingy & Dambe / Presión de Corta Distancia", difficulty: "Media", dlcPack: "Season 2 Character Pass" },

  // DLC Season 3: Season 3 Character Pass (4)
  { name: "Kunimitsu", archetype: "Ninjutsu de Teletransporte / Kunai & Setsuna", difficulty: "Fácil", dlcPack: "Season 3 Character Pass" },
  { name: "Bob", archetype: "Speed & Weight / Mishima-Style Mix-up", difficulty: "Fácil", dlcPack: "Season 3 Character Pass" },
  { name: "Roger Jr.", archetype: "Boxeo Canguro / Agarres y Postura Animal", difficulty: "Media", dlcPack: "Season 3 Character Pass" },
  { name: "Yujiro Hanma", archetype: "Invitado Baki / Demon Back & Fuerza Bruta", difficulty: "Media", dlcPack: "Season 3 Character Pass" }
];

// ============================================================================
// 4. DRAGON BALL FIGHTERZ — ROSTER COMPLETO (44 PERSONAJES)
// ============================================================================
const DBFZ_RAW = [
  { name: "Goku (Super Saiyan)", archetype: "Anchor / Beam & Todoterreno", difficulty: "Fácil" },
  { name: "Vegeta (Super Saiyan)", archetype: "Anchor / DP & Asistencia Defensiva", difficulty: "Fácil" },
  { name: "Goku (SSGSS / Blue)", archetype: "Point / Mix-ups Instant Transmission", difficulty: "Media" },
  { name: "Vegeta (SSGSS / Blue)", archetype: "Point / Big Bang & Agarres", difficulty: "Media" },
  { name: "Gohan (Teen)", archetype: "Point / Autocombo Antiaéreo & Bomb Loops", difficulty: "Media" },
  { name: "Gohan (Adult)", archetype: "Subida de Niveles (0-7) / Presión Infinita", difficulty: "Difícil" },
  { name: "Trunks", archetype: "Mid / Flips Evasivos & Change the Future", difficulty: "Media" },
  { name: "Piccolo", archetype: "Mid / Orbes Hellzone & Brazo Largo", difficulty: "Media" },
  { name: "Krillin", archetype: "Soporte / Semilla Senzu & Rocas", difficulty: "Media" },
  { name: "Yamcha", archetype: "Anchor / Wolf Fang Fist Mix-up", difficulty: "Fácil" },
  { name: "Tien", archetype: "Anchor / Daño Masivo Kikoho", difficulty: "Fácil" },
  { name: "Nappa", archetype: "Setplay / Plantación de Saibamen", difficulty: "Difícil" },
  { name: "Captain Ginyu", archetype: "Invocación Fuerzas Especiales Ginyu", difficulty: "Difícil" },
  { name: "Frieza", archetype: "Zoner / Transformación Golden Frieza", difficulty: "Media" },
  { name: "Cell", archetype: "Point / Perfect Attack & Corner Loops", difficulty: "Media" },
  { name: "Majin Buu", archetype: "Reset de Grasa / Mix-ups de Esquina", difficulty: "Difícil" },
  { name: "Kid Buu", archetype: "Extremidades Largas / Asistencia de Bloqueo", difficulty: "Media" },
  { name: "Android 16", archetype: "Grappler / Dunk & Autodestrucción", difficulty: "Fácil" },
  { name: "Android 18", archetype: "Point / Barrera & Presión con Androide 17", difficulty: "Media" },
  { name: "Android 21 (Majin)", archetype: "Absorción de Habilidades / Cola Larga", difficulty: "Fácil" },
  { name: "Gotenks", archetype: "Setplay Fantasmas Kamikaze / Presión", difficulty: "Media" },
  { name: "Beerus", archetype: "Control de Espacio con Esferas de Destrucción", difficulty: "Media" },
  { name: "Hit", archetype: "Contraataques / Posturas a Nivel de Suelo", difficulty: "Difícil" },
  { name: "Goku Black", archetype: "Mid / Alcance con Espada de Ki & Teleport", difficulty: "Fácil" },
  // Pass 1
  { name: "Bardock", archetype: "Brawler / Rebellion Spear (Lariat)", difficulty: "Fácil", dlcPack: "FighterZ Pass 1" },
  { name: "Broly (Z)", archetype: "Grappler con Armadura / Zoner Pesado", difficulty: "Fácil", dlcPack: "FighterZ Pass 1" },
  { name: "Zamasu (Fused)", archetype: "Vuelo / Blades of Judgment (ToD)", difficulty: "Difícil", dlcPack: "FighterZ Pass 1" },
  { name: "Vegito (SSGSS)", archetype: "Patadas Enormes / Espada Espiritual", difficulty: "Fácil", dlcPack: "FighterZ Pass 1" },
  { name: "Goku (Base)", archetype: "Anchor / Kaioken & Genkidama", difficulty: "Fácil", dlcPack: "FighterZ Pass 1" },
  { name: "Vegeta (Base)", archetype: "Point / Loops en el Aire & Mix-up", difficulty: "Media", dlcPack: "FighterZ Pass 1" },
  { name: "Cooler", archetype: "Alcance Enorme / Divekick & Counter", difficulty: "Fácil", dlcPack: "FighterZ Pass 1" },
  { name: "Android 17", archetype: "Rekkas con Barrera / Generación de Barra", difficulty: "Media", dlcPack: "FighterZ Pass 1" },
  // Pass 2
  { name: "Jiren", archetype: "Contraataques / Daño Masivo en Neutro", difficulty: "Fácil", dlcPack: "FighterZ Pass 2" },
  { name: "Videl", archetype: "Dodge en lugar de Reflect / Great Saiyaman", difficulty: "Media", dlcPack: "FighterZ Pass 2" },
  { name: "Goku (GT)", archetype: "Báculo Mágico / Reverse Kamehameha", difficulty: "Media", dlcPack: "FighterZ Pass 2" },
  { name: "Janemba", archetype: "Teletransporte Dimensional / Espada", difficulty: "Media", dlcPack: "FighterZ Pass 2" },
  { name: "Gogeta (SSGSS)", archetype: "Largo Alcance / Combos Cinematográficos", difficulty: "Fácil", dlcPack: "FighterZ Pass 2" },
  { name: "Broly (DBS)", archetype: "Grappler Explosivo / Buff sin Armadura", difficulty: "Media", dlcPack: "FighterZ Pass 2" },
  // Pass 3
  { name: "Kefla", archetype: "Rushdown Rápido / Proyectiles Múltiples", difficulty: "Fácil", dlcPack: "FighterZ Pass 3" },
  { name: "Goku (Ultra Instinct)", archetype: "Defensivo / Reversals y Esquivas", difficulty: "Fácil", dlcPack: "FighterZ Pass 3" },
  { name: "Master Roshi", archetype: "Sin Super Dash Estándar / Mafuba", difficulty: "Difícil", dlcPack: "FighterZ Pass 3" },
  { name: "Super Baby 2", archetype: "Zoner de Ki Blasts que Regresan / Robo de Assist", difficulty: "Media", dlcPack: "FighterZ Pass 3" },
  { name: "Gogeta (SS4)", archetype: "Doble Air Dash / Instakill Nivel 7", difficulty: "Fácil", dlcPack: "FighterZ Pass 3" },
  { name: "Android 21 (Lab Coat)", archetype: "Debuff del 21% con Agarre / Lariats", difficulty: "Fácil", dlcPack: "Special DLC Pack" }
];

// ============================================================================
// 5. GUILTY GEAR -STRIVE- — ROSTER COMPLETO (32 PERSONAJES)
// ============================================================================
const GGST_RAW = [
  { name: "Sol Badguy", archetype: "Rushdown / Strike-Throw Explosivo", difficulty: "Fácil" },
  { name: "Ky Kiske", archetype: "All-Rounder / Shock State", difficulty: "Fácil" },
  { name: "May", archetype: "Carga / Presión con Totsugeki (Delfín)", difficulty: "Fácil" },
  { name: "Axl Low", archetype: "Zoner de Pantalla Completa / Parar el Tiempo", difficulty: "Media" },
  { name: "Chipp Zanuff", archetype: "Hiper-Velocidad / Glass Cannon Ninja", difficulty: "Media" },
  { name: "Potemkin", archetype: "Grappler Colosal / Potemkin Buster", difficulty: "Media" },
  { name: "Faust", archetype: "Lanzamiento de Objetos Aleatorios / Alcance", difficulty: "Media" },
  { name: "Millia Rage", archetype: "Mix-up Aéreo de 4 Direcciones / Disco (H Disk)", difficulty: "Media" },
  { name: "Zato-1", archetype: "Puppet Master / Control de Eddie", difficulty: "Difícil" },
  { name: "Ramlethal Valentine", archetype: "Dominio de Esquina / Espadas Gigantes", difficulty: "Fácil" },
  { name: "Leo Whitefang", archetype: "Postura Backturn / Flash Kick & Proyectil", difficulty: "Fácil" },
  { name: "Nagoriyuki", archetype: "Samurái Vampiro / Gestión de Blood Gauge", difficulty: "Media" },
  { name: "Giovanna", archetype: "Rushdown de Carrera / Ventaja en Bloqueo", difficulty: "Fácil" },
  { name: "Anji Mito", archetype: "Autoguard Spin (Fuujin) / Contraataque", difficulty: "Fácil" },
  { name: "I-No", archetype: "Hoverdash Instant Overhead / Mix-up Puro", difficulty: "Media" },
  // Season 1
  { name: "Goldlewis Dickinson", archetype: "8 Behemoth Typhoons / Chip Damage", difficulty: "Media", dlcPack: "GGST Season Pass 1" },
  { name: "Jack-O'", archetype: "Invocación de Siervos / Presión Infinita", difficulty: "Difícil", dlcPack: "GGST Season Pass 1" },
  { name: "Happy Chaos", archetype: "Zoner-Rushdown con Pistola y Concentración", difficulty: "Difícil", dlcPack: "GGST Season Pass 1" },
  { name: "Baiken", archetype: "Parry de 1 Frame / Cuerda Tether & Tatami", difficulty: "Fácil", dlcPack: "GGST Season Pass 1" },
  { name: "Testament", archetype: "Zoner de Media-Larga Distancia / Stain State", difficulty: "Fácil", dlcPack: "GGST Season Pass 1" },
  // Season 2
  { name: "Bridget", archetype: "Setplay de Largo Alcance / Yo-Yo Mix-up", difficulty: "Fácil", dlcPack: "GGST Season Pass 2" },
  { name: "Sin Kiske", archetype: "Rushdown de Alcance / Medidor de Stamina", difficulty: "Fácil", dlcPack: "GGST Season Pass 2" },
  { name: "Bedman?", archetype: "Ataques de Repetición Automática (Error 6E)", difficulty: "Media", dlcPack: "GGST Season Pass 2" },
  { name: "Asuka R#", archetype: "Mago de Cartas / Gestión de Maná y Hechizos", difficulty: "Difícil", dlcPack: "GGST Season Pass 2" },
  // Season 3
  { name: "Johnny", archetype: "Mist Finer + Cartas / Espaciado sin Proyectil", difficulty: "Media", dlcPack: "GGST Season Pass 3" },
  { name: "Elphelt Valentine", archetype: "Rekka Infinita (Chain Lollipop) / Rushdown", difficulty: "Fácil", dlcPack: "GGST Season Pass 3" },
  { name: "A.B.A", archetype: "Modo Celos (Jealous Rage) / Cambio de Ritmo", difficulty: "Media", dlcPack: "GGST Season Pass 3" },
  { name: "Slayer", archetype: "Brawler de Daño Extremo / Dandy Step", difficulty: "Fácil", dlcPack: "GGST Season Pass 3" },
  // Season 4
  { name: "Queen Dizzy", archetype: "Setplay de Hielo y Fuego / Wings of Light", difficulty: "Media", dlcPack: "GGST Season Pass 4" },
  { name: "Venom", archetype: "Control Geométrico con Bolas de Billar", difficulty: "Difícil", dlcPack: "GGST Season Pass 4" },
  { name: "Unika", archetype: "Brawler de Arma Pesada / Season 4", difficulty: "Media", dlcPack: "GGST Season Pass 4" },
  { name: "Lucy", archetype: "Netrunner / Invitada Cyberpunk Edgerunners", difficulty: "Media", dlcPack: "GGST Season Pass 4" }
];

// ============================================================================
// 6. SUPER SMASH BROS. ULTIMATE — ROSTER COMPLETO (86 PERSONAJES)
// ============================================================================
const SSBU_RAW = [
  { name: "Mario", archetype: "All-Rounder / Combos de Escalera Uair", difficulty: "Fácil" },
  { name: "Donkey Kong", archetype: "Heavy Grappler / Cargo Throw & Giant Punch", difficulty: "Fácil" },
  { name: "Link", archetype: "Zoner Táctico / Bomba Remota & Nair", difficulty: "Media" },
  { name: "Samus", archetype: "Zoner / Charge Shot & Ledgetrap con Bombas", difficulty: "Fácil" },
  { name: "Dark Samus", archetype: "Zoner / Charge Shot & Flotación Eléctrica", difficulty: "Fácil" },
  { name: "Yoshi", archetype: "Movilidad Aérea / Armadura en Doble Salto", difficulty: "Fácil" },
  { name: "Kirby", archetype: "Cuerpo Pequeño / Múltiples Saltos & Copy", difficulty: "Fácil" },
  { name: "Fox", archetype: "Rushdown / Fast Faller & Nair-UpSmash", difficulty: "Media" },
  { name: "Pikachu", archetype: "Top Mobility / Thunder Jolt & Bair Loops", difficulty: "Difícil" },
  { name: "Luigi", archetype: "Combo 0-to-Death desde Agarre / Up-B", difficulty: "Media" },
  { name: "Ness", archetype: "Presión Aérea con Magnet / PK Fire", difficulty: "Media" },
  { name: "Captain Falcon", archetype: "Brawler Rápido / Knee of Justice", difficulty: "Media" },
  { name: "Jigglypuff", archetype: "Combate Aéreo / Edgeguard & Rest", difficulty: "Media" },
  { name: "Peach", archetype: "Float Cancels / Daño de Combo Extremo", difficulty: "Difícil" },
  { name: "Daisy", archetype: "Float Cancels / Turnip Play", difficulty: "Difícil" },
  { name: "Bowser", archetype: "Super Heavyweight / Up-B Out of Shield", difficulty: "Fácil" },
  { name: "Ice Climbers", archetype: "Dúo Desincronizado / Desync Combos", difficulty: "Difícil" },
  { name: "Sheik", archetype: "Velocidad de Frame Data / Bouncing Fish", difficulty: "Difícil" },
  { name: "Zelda", archetype: "Trapper / Phantom Knight & Lightning Kick", difficulty: "Fácil" },
  { name: "Dr. Mario", archetype: "Brawler de Mayor Daño / Tornado & Pill", difficulty: "Media" },
  { name: "Pichu", archetype: "Glass Cannon / Combos Eléctricos Rápidos", difficulty: "Difícil" },
  { name: "Falco", archetype: "Rey del Combo Vertical / Utilt & Bair", difficulty: "Fácil" },
  { name: "Marth", archetype: "Swordie / Espaciado de Punta (Tipper)", difficulty: "Media" },
  { name: "Lucina", archetype: "Swordie / Espada Consistente y Edgeguard", difficulty: "Fácil" },
  { name: "Young Link", archetype: "Zoner Rápido / Flechas de Fuego en Combo", difficulty: "Media" },
  { name: "Ganondorf", archetype: "Super Heavy / Muerte en 3 Golpes (Doriyah)", difficulty: "Fácil" },
  { name: "Mewtwo", archetype: "Glass Cannon / Shadow Ball & Confusion", difficulty: "Media" },
  { name: "Roy", archetype: "Rushdown Swordie / Jab > Back Air", difficulty: "Fácil" },
  { name: "Chrom", archetype: "Swordie Equilibrado / Presión en Escudo", difficulty: "Fácil" },
  { name: "Mr. Game & Watch", archetype: "Mejor Up-B OOS (Frame 3) / Dair & Judge", difficulty: "Fácil" },
  { name: "Meta Knight", archetype: "Combos de Escalera / Edgeguard Profundo", difficulty: "Media" },
  { name: "Pit", archetype: "Honesto / Flechas Direccionables y Escudos", difficulty: "Fácil" },
  { name: "Dark Pit", archetype: "All-Rounder / Electroshock Arm", difficulty: "Fácil" },
  { name: "Zero Suit Samus", archetype: "Movilidad Evasiva / Flip Jump (Down-B)", difficulty: "Media" },
  { name: "Wario", archetype: "Movilidad Aérea / Comeback con Waft", difficulty: "Media" },
  { name: "Snake", archetype: "Trapper de Granadas (Frame 1) / Nikita", difficulty: "Difícil" },
  { name: "Ike", archetype: "Swordie Pesado / Confirmaciones con Nair", difficulty: "Fácil" },
  { name: "Pokémon Trainer", archetype: "3 en 1: Squirtle (Combo), Ivysaur, Charizard", difficulty: "Media" },
  { name: "Diddy Kong", archetype: "Control Neutro con Banana Peel", difficulty: "Media" },
  { name: "Lucas", archetype: "Zoner / DJCZ Zair & PK Freeze", difficulty: "Media" },
  { name: "Sonic", archetype: "El más Rápido del Juego / Spin Dash", difficulty: "Media" },
  { name: "King Dedede", archetype: "Heavy Ledgetrapper / Gordo Toss", difficulty: "Fácil" },
  { name: "Olimar", archetype: "Gestión de Pikmin (Rojo, Azul, Morado, Blanco)", difficulty: "Media" },
  { name: "Lucario", archetype: "Mecánica de Aura (Más Daño al Subir %)", difficulty: "Media" },
  { name: "R.O.B.", archetype: "Top All-Rounder / Gyro (Peonza) & Nair", difficulty: "Fácil" },
  { name: "Toon Link", archetype: "Zoner Flotante / Bombas y Boomerang", difficulty: "Fácil" },
  { name: "Wolf", archetype: "Fundamentos / Blaster, Nair y Ftilt", difficulty: "Fácil" },
  { name: "Villager", archetype: "Zoner / Lloid Rocket & Bowling Ball", difficulty: "Media" },
  { name: "Mega Man", archetype: "Zoner de Proyectiles Normales / Metal Blade", difficulty: "Difícil" },
  { name: "Wii Fit Trainer", archetype: "Deep Breathing Buff / Header Cancel", difficulty: "Media" },
  { name: "Rosalina & Luma", archetype: "Puppet / Control del Espacio con Luma", difficulty: "Difícil" },
  { name: "Little Mac", archetype: "Especialista de Suelo / Super Armor & KO Punch", difficulty: "Fácil" },
  { name: "Greninja", archetype: "Bait & Punish Rápido / Dash Attack & Dtilt", difficulty: "Media" },
  { name: "Palutena", archetype: "All-Rounder / Nair Loops & Bair Invencible", difficulty: "Fácil" },
  { name: "Pac-Man", archetype: "Trapper Creativo / Bonus Fruit & Hydrant", difficulty: "Difícil" },
  { name: "Robin", archetype: "Tomo Mágico / Espada Levin y Arcfire", difficulty: "Media" },
  { name: "Shulk", archetype: "Monado Arts (Speed, Buster, Shield, Smash)", difficulty: "Difícil" },
  { name: "Bowser Jr.", archetype: "Kart / Mecha-Koopa & Up-B Hammer", difficulty: "Media" },
  { name: "Duck Hunt", archetype: "Trapper / Lata Explosiva (Trick Shot)", difficulty: "Difícil" },
  { name: "Ryu (Smash)", archetype: "Auto-Turnaround / Shoryuken con Inputs", difficulty: "Difícil" },
  { name: "Ken (Smash)", archetype: "Combos de Proximidad / Crescent Kick", difficulty: "Difícil" },
  { name: "Cloud Strife", archetype: "Swordie / Back Air & Climhazzard (Frame 7)", difficulty: "Fácil" },
  { name: "Corrin", archetype: "Pin Kick (Side-B) / Malabares con Uair", difficulty: "Fácil" },
  { name: "Bayonetta", archetype: "Combos Aéreos al Techo / Witch Twist", difficulty: "Difícil" },
  { name: "Inkling", archetype: "Recarga de Tinta / Bair & Splat Roller", difficulty: "Fácil" },
  { name: "Ridley", archetype: "Heavy de Alcance / Nair & Space Pirate Rush", difficulty: "Fácil" },
  { name: "Simon", archetype: "Zoner con Látigo Largo / Agua Bendita", difficulty: "Media" },
  { name: "Richter", archetype: "Zoner con Látigo / Fuego Azul y Cruz", difficulty: "Media" },
  { name: "King K. Rool", archetype: "Super Heavy / Belly Super Armor & Crown", difficulty: "Fácil" },
  { name: "Isabelle", archetype: "Trapper / Caña de Pescar & Lloid Trap", difficulty: "Media" },
  { name: "Incineroar", archetype: "Grappler / Revenge Counter & Alolan Whip", difficulty: "Fácil" },
  { name: "Mii Brawler", archetype: "Rushdown Personalizable / Thrust Uppercut", difficulty: "Fácil" },
  { name: "Mii Swordfighter", archetype: "Zoner-Swordie / Tornado + Hero's Spin", difficulty: "Fácil" },
  { name: "Mii Gunner", archetype: "Zoner Personalizable / Grenade Launch", difficulty: "Fácil" },
  { name: "Piranha Plant", archetype: "Trapper / Ptooie (Bola de Pinchos)", difficulty: "Fácil", dlcPack: "Bonus Early Purchase DLC" },
  { name: "Joker", archetype: "Bait & Punish / Invocación de Arsene", difficulty: "Media", dlcPack: "Fighters Pass Vol. 1" },
  { name: "Hero", archetype: "Menú de Hechizos de MP / Críticos", difficulty: "Media", dlcPack: "Fighters Pass Vol. 1" },
  { name: "Banjo & Kazooie", archetype: "Zoner-Brawler / 5 Plumas Wonderwing", difficulty: "Fácil", dlcPack: "Fighters Pass Vol. 1" },
  { name: "Terry", archetype: "Inputs de Comando / Mecánica GO! (100%+)", difficulty: "Media", dlcPack: "Fighters Pass Vol. 1" },
  { name: "Byleth", archetype: "Maestro de Distancia / Nair & Up-B", difficulty: "Fácil", dlcPack: "Fighters Pass Vol. 1" },
  { name: "Min Min", archetype: "Zoner de Brazos Extensibles (Ramram/Megawatt)", difficulty: "Media", dlcPack: "Fighters Pass Vol. 2" },
  { name: "Steve", archetype: "Minería de Diamante / Creación de Bloques", difficulty: "Difícil", dlcPack: "Fighters Pass Vol. 2" },
  { name: "Sephiroth", archetype: "Espada Masamune / Forma One-Winged Angel", difficulty: "Media", dlcPack: "Fighters Pass Vol. 2" },
  { name: "Pyra / Mythra", archetype: "Velocidad (Mythra) + Poder de KO (Pyra)", difficulty: "Fácil", dlcPack: "Fighters Pass Vol. 2" },
  { name: "Kazuya", archetype: "Touch of Death / Electric Wind God Fist", difficulty: "Difícil", dlcPack: "Fighters Pass Vol. 2" },
  { name: "Sora", archetype: "Combos Aéreos Flotantes / Magia Firaga-Thundaga", difficulty: "Fácil", dlcPack: "Fighters Pass Vol. 2" }
];

module.exports = {
  buildRosterEntry,
  MK1_RAW,
  SF6_RAW,
  TEKKEN8_RAW,
  DBFZ_RAW,
  GGST_RAW,
  SSBU_RAW
};
