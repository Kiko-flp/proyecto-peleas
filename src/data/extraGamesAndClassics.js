/**
 * Expansión del Catálogo FGC Vault (v32):
 * - 5 Nuevas Sagas Competitivas Actuales: Fatal Fury: CotW, GBVSR, KOF XV, UNI2, 2XKO
 * - 6 Entregas Clásicas Históricas (isClassic: true): SF3 3rd Strike, USFIV, Tekken 7, MK11 Ultimate, GG Xrd REV 2, Smash Melee
 */

const crypto = require("crypto");
const { buildRosterEntry } = require("./fullRosters");

function getMediaWikiHashedUrl(baseImagesUrl, fileName) {
  const normalized = fileName.replace(/\s+/g, "_");
  const firstUpper = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  const hash = crypto.createHash("md5").update(firstUpper).digest("hex");
  return `${baseImagesUrl}/${hash.slice(0, 1)}/${hash.slice(0, 2)}/${encodeURIComponent(firstUpper)}`;
}

const EXTRA_SAGAS = [
  {
    id: "fatal-fury",
    name: "Fatal Fury / KOF (SNK)",
    developer: "SNK",
    notationType: "sf",
    notationLegend: "LP/HP/LK/HK = Puño/Patada Débil-Fuerte | REV = Rev Arts/Accel | 236 = ↓↘→ | 214 = ↓↙←",
    accentColor: "#eab308",
    description: "Las sagas históricas de SNK basadas en Short Hops, Hyper Hops, gestión de S.P.G. / MAX Mode y REV System."
  },
  {
    id: "granblue-uni",
    name: "Granblue / UNI2 / 2XKO",
    developer: "ArcSys / French-Bread / Riot",
    notationType: "gg",
    notationLegend: "L/M/H/U = Débil/Medio/Fuerte/Único | A/B/C/D = UNI2 | Tag/Fuse = 2XKO | BP = Brave Points",
    accentColor: "#06b6d4",
    description: "Lucha 2D moderna y Tag competitiva con mecánicas de Brave Points (GBVSR), ciclo Vorpal GRD (UNI2) y dúos Fuse (2XKO)."
  }
];

function hydrateExtraGameChars(gameId, sagaNotation, wikiBaseUrl, defaultVideo, colorHex, rawList, iconBuilder = null) {
  return rawList.map((raw) => {
    const cleanName = raw.name.replace(/\s+\(.*?\)/g, "").trim();
    const isRush = /rush|mix|veloz|rekka|hop/i.test(raw.archetype || "");
    const isZoner = /zoner|proyectil|espacio|tramp/i.test(raw.archetype || "");
    const iconUrl = iconBuilder ? iconBuilder(raw.name) : undefined;

    const cp = {
      title: `Cómo ganarle a ${raw.name}`,
      flawless: isZoner
        ? "Camina, haz Guard/Parry/Just Defense a sus proyectiles en neutro sin saltar sin plan."
        : "Respeta el inicio de su secuencia de presión o corta sus huecos con Poke rápido (4f–5f).",
      duck: raw.counterTip || `Controla la distancia clave del estilo ${raw.archetype} castigando recuperaciones largas.`,
      tip: raw.gameplanTip || `Bloquea sus ataques bajos por defecto y reacciona al Overhead / Agarre.`
    };

    return buildRosterEntry(
      gameId,
      sagaNotation,
      wikiBaseUrl,
      defaultVideo,
      colorHex,
      {
        ...raw,
        iconUrl,
        counterplay: cp,
        keyMoves: raw.keyMoves || [
          { input: raw.km1 || "5LP / 2LP", frames: "4-5f", notes: `Botón más rápido de ${cleanName} para interrumpir y castigar.` },
          { input: raw.km2 || "2MK / 5M", frames: "7-8f", notes: `Poke de neutro clave confirmable en movimiento especial.` },
          { input: raw.km3 || "623P / 2H", frames: "Antiaéreo", notes: "Frena saltos cortos (Short Hop) o aéreos enemigos." },
          { input: raw.km4 || "236P/K", frames: "Especial", notes: `Herramienta central (${raw.archetype}) de ${cleanName}.` }
        ],
        combos: raw.combos || [
          { type: "BnB Estándar (Sin Barra)", difficulty: "Fácil", resource: "Sin Barra", notation: raw.combo1 || "2LK > 2LP > 5LP ~ Special Ender", damage: "240–290 dmg" },
          { type: "Confirmación con Recursos / Super", difficulty: "Media", resource: "Con Recursos", notation: raw.combo2 || "Close H ~ EX Special > Extension ~ Super", damage: "410–480 dmg" }
        ]
      },
      rawList
    );
  });
}

const EXTRA_GAMES = [
  // =========================================================================
  // 5 NUEVOS JUEGOS ACTUALES COMPETITIVOS
  // =========================================================================
  {
    id: "cotw",
    sagaId: "fatal-fury",
    title: "Fatal Fury: City of the Wolves",
    isClassic: false,
    releaseYear: 2025,
    currentPatch: "Parche Season 1 (Ken / Chun-Li / Andy) • Act. 2026",
    subSystemName: "REV System, S.P.G. & Braking",
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2492040/header.jpg",
    coverGradient: "linear-gradient(135deg, #78350f 0%, #eab308 50%, #090d16 100%)",
    officialSources: [
      { name: "SuperCombo Wiki — CotW", url: "https://wiki.supercombo.gg/w/Fatal_Fury:_City_of_the_Wolves" },
      { name: "SNK Official CotW", url: "https://www.snk-corp.co.jp/us/games/fatalfury-cotw/" }
    ],
    basicGuide: {
      title: "Fundamentos de Fatal Fury: CotW — REV System, Braking y Just Defense",
      videoUrl: "https://www.youtube.com/embed/seXtzdiKi4Y?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Rooflemonger / SNK — Guía Base CotW",
      summary: "Fatal Fury: City of the Wolves introduce el medidor REV (sobrecalentamiento si abusas de REV Arts/Guard), la zona S.P.G. elegible en tu barra de vida y Feints / Braking para combos explosivos.",
      sections: [
        {
          heading: "1. REV System y Overheat (Sobrecalentamiento)",
          content: "• Empiezas en 0% REV. Cada REV Art, REV Accel o REV Guard sube el medidor hasta el 100% (Overheat).\n• Si llegas al Overheat no podrás bloquear ataques sin perder guardia rápidamente hasta enfriar el medidor golpeando o esperando."
        },
        {
          heading: "2. S.P.G. (Selective Potential Gear) y Brakes",
          content: "• Eliges al principio si tu zona S.P.G. está al principio, mitad o final de la vida: mientras estés en ella desbloqueas REV Blow (armadura) y más daño.\n• Pulsa A+B durante ciertos especiales para hacer 'Break' y continuar el combo."
        }
      ]
    },
    advancedGuide: {
      title: "Guía Avanzada CotW: Just Defense, Hyper Defense y Feint Cancels",
      videoUrl: "https://www.youtube.com/embed/seXtzdiKi4Y?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Guía Competitiva SNK",
      summary: "Domina el Just Defense (bloquear justo al impacto recupera vida y baja el medidor REV) y cancela especiales con Feints para lograr Frame Traps positivos.",
      sections: [
        {
          heading: "1. Just Defense & Hyper Defense",
          content: "Bloquear en los últimos frames antes del golpe enfría el REV y permite hacer Guard Cancel directo hacia REV Blow o especial invencible."
        }
      ]
    },
    characters: hydrateExtraGameChars(
      "cotw",
      "sf",
      "https://wiki.supercombo.gg/w/Fatal_Fury:_City_of_the_Wolves/",
      "https://www.youtube.com/embed/seXtzdiKi4Y",
      "eab308",
      [
        { name: "Rock Howard", archetype: "All-Rounder / Reppuken & Hard Edge", difficulty: "Fácil", km1: "2LP", km2: "2MK", km3: "623P", km4: "214P (Braking)", combo1: "c.HP > Feint > 2HP ~ 236LP+HP > Break", combo2: "c.HK / 2MK ~ REV Art > Ignition Gear" },
        { name: "Terry Bogard", archetype: "Rushdown / Burn Knuckle & Buster Wolf", difficulty: "Fácil", km1: "2LK", km2: "5HP", km3: "623P", km4: "214P (Burn Knuckle)", combo1: "c.HP > 214P (Feint) > c.MP ~ 236K > Break > Power Charge", combo2: "2MK ~ REV Accel > Buster Wolf (236236P)" },
        { name: "Mai Shiranui", archetype: "Movilidad Aérea / Kachousen", difficulty: "Fácil" },
        { name: "Hotaru Futaba", archetype: "Rushdown / Double Reppuken & Divekick", difficulty: "Media" },
        { name: "Tizoc", archetype: "Grappler Puro / Justice Hurricane", difficulty: "Media" },
        { name: "Marco Rodrigues", archetype: "Kyokugenryu Karatedo / Daño Bruto", difficulty: "Fácil" },
        { name: "Preecha", archetype: "Muay Thai Veloz / Tornados", difficulty: "Media" },
        { name: "Vox Reaper", archetype: "Presión Corta / Cadenas Oscuras", difficulty: "Media" },
        { name: "B. Jenet", archetype: "Mix-up & Harrier Bee", difficulty: "Media" },
        { name: "Kevin Rian", archetype: "Brawler Explosivo / Braking Loops", difficulty: "Media" },
        { name: "Billy Kane", archetype: "Zoner de Bastón / Alcance Extremo", difficulty: "Media" },
        { name: "Gato", archetype: "Rushdown / Presión Corta Letal", difficulty: "Difícil" },
        { name: "Hokutomaru", archetype: "Ninja / Teletransportes & Divekick", difficulty: "Media" },
        { name: "Kain R. Heinlein", archetype: "Zoner de Cargas / Control Pantalla", difficulty: "Difícil" },
        { name: "Andy Bogard", archetype: "Shoto Ágil / Zaneiken", difficulty: "Fácil", dlcPack: "Season Pass 1" },
        { name: "Joe Higashi", archetype: "Hurricane Upper / Zoning", difficulty: "Fácil", dlcPack: "Season Pass 1" },
        { name: "Ken Masters", archetype: "Invitado SF6 / Jinrai & Run Tatsu", difficulty: "Fácil", dlcPack: "Season Pass 1" },
        { name: "Chun-Li", archetype: "Invitado SF6 / Footsies & Lighting Legs", difficulty: "Media", dlcPack: "Season Pass 1" }
      ]
    )
  },
  {
    id: "gbvsr",
    sagaId: "granblue-uni",
    title: "Granblue Fantasy Versus: Rising",
    isClassic: false,
    releaseYear: 2023,
    currentPatch: "Parche Season 2 (Versusia / Sandalphon) • Act. 2026",
    subSystemName: "Brave Points, Raging Strike & 66L",
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2157560/header.jpg",
    coverGradient: "linear-gradient(135deg, #0c4a6e 0%, #38bdf8 50%, #090d16 100%)",
    officialSources: [
      { name: "Dustloop Wiki — GBVSR", url: "https://www.dustloop.com/w/GBVSR" }
    ],
    basicGuide: {
      title: "Fundamentos de GBVSR: 66L Universal, Autocombo High/Low y Raging Strike",
      videoUrl: "https://www.youtube.com/embed/uWfW1SgIfTQ?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Diaphone / Dustloop — Guía GBVSR",
      summary: "Juego 2D accesible de fundamentos puros: Dash Attack universal (66L) +2 en bloqueo, autocombo que finaliza en Overhead o Low y Brave Points para romper guardias.",
      sections: [
        {
          heading: "1. 66L (Dash Light) y Autocombo Mix",
          content: "• 66L avanza a gran velocidad y queda positivo (+2) en bloqueo en casi todo el plantel.\n• En el tercer golpe de tu autocombo (L-L-L) puedes mantener Adelante+M para Overhead o Abajo+M para Low."
        },
        {
          heading: "2. Brave Points (BP) y Raging Strike",
          content: "Empiezas con 3 rombos de BP. Gastar 1 BP en Raging Strike rompe la guardia del rival (Guard Crush), mientras que Brave Counter (Adelante+M+H en bloqueo) empuja al atacante."
        }
      ]
    },
    advancedGuide: {
      title: "Guía Avanzada GBVSR: Ultimate Skills (50% Barra) y Brave Point Management",
      videoUrl: "https://www.youtube.com/embed/uWfW1SgIfTQ?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Guía Competitiva GBVSR",
      summary: "Cuando pierdes los 3 Brave Points recibes +50% de daño adicional; aprende a no malgastar Raging Chain sin asegurar el kill.",
      sections: [
        {
          heading: "1. Ultimate Skills (236U / 623U / 214U)",
          content: "Consumen 50% de barra pero tienen ralentización temporal, propiedades invencibles o permiten extender combos desde cualquier parte de la pantalla sin cooldown."
        }
      ]
    },
    characters: hydrateExtraGameChars(
      "gbvsr",
      "gg",
      "https://www.dustloop.com/w/GBVSR/",
      "https://www.youtube.com/embed/uWfW1SgIfTQ",
      "38bdf8",
      [
        { name: "Gran", archetype: "Shoto / Boot & 66L Presión", difficulty: "Fácil" },
        { name: "Djeeta", archetype: "Shoto / Footsies y Súper Carga", difficulty: "Fácil" },
        { name: "Katalina", archetype: "Footsies Largo / Armadura", difficulty: "Fácil" },
        { name: "Charlotta", archetype: "Rushdown / Demon Flip & Bola", difficulty: "Fácil" },
        { name: "Lancelot", archetype: "Mix-up Veloz / Rekkas & Teleport", difficulty: "Media" },
        { name: "Percival", archetype: "Espaciado Pesado / Cargas Fuego", difficulty: "Media" },
        { name: "Narmaya", archetype: "Cambio de Posturas (8 Especiales)", difficulty: "Difícil" },
        { name: "Belial", archetype: "All-Rounder / Command Grab & Trampa", difficulty: "Fácil" },
        { name: "Siegfried", archetype: "Espada Colosal / Alcance y Buff", difficulty: "Fácil" },
        { name: "Nier", archetype: "Puppet (Death) / Setplay", difficulty: "Difícil" },
        { name: "Anila", archetype: "Zoner / Ovejas & Control Aéreo", difficulty: "Fácil" },
        { name: "Lucilius", archetype: "Boss / Enfriamiento Blade Level", difficulty: "Media", dlcPack: "Character Pass 1" },
        { name: "2B", archetype: "Invitada NieR / Gatlings Automáticos", difficulty: "Media", dlcPack: "Character Pass 1" },
        { name: "Beatrix", archetype: "Rushdown / Clock & Riding Free", difficulty: "Fácil", dlcPack: "Character Pass 1" },
        { name: "Vane", archetype: "Brawler Pesado / Escudo Invencible", difficulty: "Fácil", dlcPack: "Character Pass 1" },
        { name: "Versusia", archetype: "Boss Alcance / Pilares de Destrucción", difficulty: "Media", dlcPack: "Character Pass 1" }
      ],
      (nm) => getMediaWikiHashedUrl("https://www.dustloop.com/wiki/images", `GBVSR_${nm.replace(/\s+/g, "_")}_Icon.png`)
    )
  },
  {
    id: "kofxv",
    sagaId: "fatal-fury",
    title: "The King of Fighters XV",
    isClassic: false,
    releaseYear: 2022,
    currentPatch: "Parche Season 3 (Mature / Vice) • Act. 2025",
    subSystemName: "3v3 Teams, Short Hop & Shatter Strike",
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1498570/header.jpg",
    coverGradient: "linear-gradient(135deg, #1d4ed8 0%, #ef4444 55%, #090d16 100%)",
    officialSources: [
      { name: "Dream Cancel Wiki — KOF XV", url: "https://www.dreamcancel.com/wiki/The_King_of_Fighters_XV" }
    ],
    basicGuide: {
      title: "Fundamentos de KOF XV: Los 4 Tipos de Salto, Short Hop y Orden 3v3",
      videoUrl: "https://www.youtube.com/embed/seXtzdiKi4Y?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Rooflemonger — Guía de KOF XV",
      summary: "KOF XV se juega en equipos de 3 contra 3 sin asistencias: tu Point empieza con 3 barras máx., tu Mid con 4 y tu Anchor con 5 barras de Super.",
      sections: [
        {
          heading: "1. Los 4 Saltos de KOF (Hop, Super Hop, Jump, Super Jump)",
          content: "• Short Hop (toque rápido arriba): salta muy bajo para atacar por encima de pokes y presionar instantáneamente.\n• Run + Hop (Hyper Hop): avanza cubriendo media pantalla en el aire."
        },
        {
          heading: "2. Shatter Strike (236+CD, 1 Barra)",
          content: "Golpe con punto de guardia (Guard Point) que rompe ofensivas y devuelve media barra si impacta."
        }
      ]
    },
    advancedGuide: {
      title: "Guía Avanzada KOF XV: MAX Mode Cancel y Climax ToDs en Anchor",
      videoUrl: "https://www.youtube.com/embed/seXtzdiKi4Y?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Dream Cancel — Combos Avanzados KOF",
      summary: "Usa Quick MAX (B+C tras golpe) con tu último personaje para cancelar hacia EX gratuitos, Super Level 1 -> Level 2 -> Climax (Level 3).",
      sections: [
        {
          heading: "1. Escalera de Supers (Super Cancel)",
          content: "Con 5 barras en Anchor puedes encadenar Especial EX -> Super (1 barra) -> MAX Super (2 barras) -> Climax (3 barras) eliminando un personaje completo."
        }
      ]
    },
    characters: hydrateExtraGameChars(
      "kofxv",
      "sf",
      "https://www.dreamcancel.com/wiki/The_King_of_Fighters_XV/",
      "https://www.youtube.com/embed/seXtzdiKi4Y",
      "ef4444",
      [
        { name: "Shun'ei", archetype: "Point / Movilidad Aérea de Brazos", difficulty: "Media" },
        { name: "Isla", archetype: "Point / Spray & Saltos Dobles", difficulty: "Fácil" },
        { name: "Kyo Kusanagi", archetype: "All-Rounder / Rekkas & Presión", difficulty: "Media" },
        { name: "Iori Yagami", archetype: "Rushdown / Cross-up j.B & Rekka", difficulty: "Fácil" },
        { name: "Chizuru Kagura", archetype: "Setplay / Clones & Sellos", difficulty: "Difícil" },
        { name: "Terry Bogard", archetype: "Point/Mid / Power Dunk & Buster Wolf", difficulty: "Fácil" },
        { name: "Mai Shiranui", archetype: "Movilidad / Abanicos y Divekick", difficulty: "Fácil" },
        { name: "K'", archetype: "Anchor / Ein Trigger & Chains", difficulty: "Difícil" },
        { name: "Leona Heidern", archetype: "Mid/Anchor / Carga y V-Slasher", difficulty: "Media" },
        { name: "Benimaru Nikaido", archetype: "Battery / Alcance & Agarres", difficulty: "Fácil" },
        { name: "Athena Asamiya", archetype: "Zoner / Psycho Ball & Teleport", difficulty: "Media" },
        { name: "Yuri Sakazaki", archetype: "Rushdown / Divekick & Raiouken", difficulty: "Fácil" },
        { name: "Rock Howard", archetype: "Anchor / Counters y Raging Storm", difficulty: "Media", dlcPack: "Team Pass 1" },
        { name: "Geese Howard", archetype: "Anchor / Raging Storm & Parries", difficulty: "Difícil", dlcPack: "Team Pass 1" },
        { name: "Kim Kaphwan", archetype: "Point / Patadas Seguras y Presión", difficulty: "Fácil", dlcPack: "Season 2" },
        { name: "Duo Lon", archetype: "Mix-up / Teletransportes Fantasmales", difficulty: "Difícil", dlcPack: "Season 2" }
      ]
    )
  },
  {
    id: "uni2",
    sagaId: "granblue-uni",
    title: "Under Night In-Birth II [Sys:Celes]",
    isClassic: false,
    releaseYear: 2024,
    currentPatch: "Parche Season 1 (Uzuki / Ogre / Izumi) • Act. 2026",
    subSystemName: "GRD Vorpal Cycle & Chain Shift",
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2076010/header.jpg",
    coverGradient: "linear-gradient(135deg, #312e81 0%, #6366f1 50%, #090d16 100%)",
    officialSources: [
      { name: "Mizuumi Wiki — UNI2", url: "https://wiki.gbl.gg/w/Under_Night_In-Birth_II" }
    ],
    basicGuide: {
      title: "Fundamentos de UNI2: GRD Tug-of-War, Vorpal y Reverse Beat",
      videoUrl: "https://www.youtube.com/embed/uWfW1SgIfTQ?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Mizuumi / Replay Theater — UNI2",
      summary: "El medidor inferior GRD determina cada 17 segundos quién gana el estado Vorpal (+10% daño y Chain Shift para cancelar cualquier animación).",
      sections: [
        {
          heading: "1. Reverse Beat (Cancelar Fuerte en Débil)",
          content: "A diferencia de otros juegos, puedes cancelar 5C > 5B > 2A o 5A para mantenerte totalmente seguro en bloqueo y reiniciar presión (Staggers)."
        },
        {
          heading: "2. Assault (Dash Aéreo Raso — 6D) y Shield (4D)",
          content: "Usa Assault para entrar rápido en Overhead y Shield (Bloqueo verde) para ganar bloques de GRD al leer los ataques rivales."
        }
      ]
    },
    advancedGuide: {
      title: "Guía Avanzada UNI2: Celestial Vorpal y Creeping Edge",
      videoUrl: "https://www.youtube.com/embed/uWfW1SgIfTQ?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Guía Competitiva UNI2",
      summary: "Usa Chain Shift (D+D en estado Vorpal) como Roman Cancel gratuito que además rellena EXS para Infinite Worth.",
      sections: [
        {
          heading: "1. Riesgo de GRD Break",
          content: "Recibir un golpe mientras haces Shield o fallar un Throw Tech produce GRD Break, dejándote sin Shield durante el ciclo entero."
        }
      ]
    },
    characters: hydrateExtraGameChars(
      "uni2",
      "gg",
      "https://wiki.gbl.gg/w/Under_Night_In-Birth_II/",
      "https://www.youtube.com/embed/uWfW1SgIfTQ",
      "6366f1",
      [
        { name: "Hyde", archetype: "All-Rounder / Orbiter & Chip Espada", difficulty: "Fácil" },
        { name: "Linne", archetype: "Rushdown / Doble Salto & Kuuga", difficulty: "Media" },
        { name: "Waldstein", archetype: "Grappler Gigante / Brazos Colosales", difficulty: "Fácil" },
        { name: "Carmine", archetype: "Setplay / Charcos de Sangre", difficulty: "Difícil" },
        { name: "Orie", archetype: "Espaciado Preciso / Estoque & Thanatos", difficulty: "Fácil" },
        { name: "Gordeau", archetype: "Guadaña Alcance Masivo / Assimilation", difficulty: "Fácil" },
        { name: "Merkava", archetype: "Vuelo & Brazo Infinito", difficulty: "Media" },
        { name: "Vatista", archetype: "Zoner de Carga / Láseres y Gemas", difficulty: "Difícil" },
        { name: "Seth", archetype: "Ninja Setplay / Orbes y Teleport", difficulty: "Difícil" },
        { name: "Yuzuriha", archetype: "Posturas Iaido / Alcance Pantalla", difficulty: "Difícil" },
        { name: "Byakuya", archetype: "Trampas de Telaraña / Mix-up", difficulty: "Media" },
        { name: "Kaguya", archetype: "Gunslinger / Zoner con Cartuchos", difficulty: "Media" },
        { name: "Tsurugi", archetype: "Brawler / Escudo Blindado", difficulty: "Fácil" },
        { name: "Kuon", archetype: "Vuelo & Magia Celestial", difficulty: "Difícil" }
      ]
    )
  },
  {
    id: "2xko",
    sagaId: "granblue-uni",
    title: "2XKO",
    isClassic: false,
    releaseYear: 2025,
    currentPatch: "Temporada Lanzamiento • Act. 2026",
    subSystemName: "2v2 Tag Team, Handshake Tag & Fuses",
    coverImage: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/4e4406e1e6e15e1d7186a5e446f4e4bf8789d734-1920x1080.jpg",
    coverGradient: "linear-gradient(135deg, #065f46 0%, #10b981 50%, #090d16 100%)",
    officialSources: [
      { name: "Sitio Oficial 2XKO (Riot Games)", url: "https://2xko.riotgames.com/" }
    ],
    basicGuide: {
      title: "Fundamentos de 2XKO: Controles Simples (Sin Motion Inputs), Assist y Handshake Tag",
      videoUrl: "https://www.youtube.com/embed/rWReD2qG7D8?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Riot Games / Sajam — Guía 2XKO",
      summary: "2XKO es un Tag Fighter 2v2 de los creadores de League of Legends con botones especiales directos (S1 y S2), Handshake Tag en tiempo real y sistemas Fuse.",
      sections: [
        {
          heading: "1. Handshake Tag (Cambio de Dúo Activo)",
          content: "Cuando tu compañero Assist está en pantalla puedes pulsar el botón de Tag en cualquier instante para controlar inmediatamente al asistente creando Sandwich Mix-ups."
        },
        {
          heading: "2. Sistemas Fuse (Estilo de Equipo)",
          content: "• Double Down (Encadena Supers juntos)\n• 2X Assist (Permite usar la asistencia dos veces seguidas)\n• Freestyle (Tag múltiple en mitad de presión)\n• Juggernaut / Sidekick (Juega con 1 solo campeón potenciado)."
        }
      ]
    },
    advancedGuide: {
      title: "Guía Avanzada 2XKO: Pushblock, Retreating Guard y Active Tag Sandwich",
      videoUrl: "https://www.youtube.com/embed/rWReD2qG7D8?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Guía Competitiva Tag 2XKO",
      summary: "Domina el Retreating Guard (atrás+Dash bloqueando) para escapar de bloqueos largos, sin descuidar ataques bajos que cortan el retroceso.",
      sections: [
        {
          heading: "1. Contraataque con Dynamic Save & Parry",
          content: "El Parry de 2XKO consume barra pero restaura recursos si aciertas el tiempo contra bloqueos o proyectiles previsibles."
        }
      ]
    },
    characters: hydrateExtraGameChars(
      "2xko",
      "gg",
      "https://wiki.supercombo.gg/w/2XKO/",
      "https://www.youtube.com/embed/rWReD2qG7D8",
      "10b981",
      [
        { name: "Ahri", archetype: "Rushdown / Air Dash & Orbes", difficulty: "Media" },
        { name: "Darius", archetype: "Brawler Pesado / Hemorragia & Hacha", difficulty: "Fácil" },
        { name: "Ekko", archetype: "Setplay / Retroceso Temporal Chronobreak", difficulty: "Difícil" },
        { name: "Yasuo", archetype: "Postura del Viento / Alcance & Mix", difficulty: "Difícil" },
        { name: "Illaoi", archetype: "Control Tentáculos / Oki Esquina", difficulty: "Media" },
        { name: "Braum", archetype: "Tanque / Escudo Unbreakable & Poros", difficulty: "Fácil" },
        { name: "Jinx", archetype: "Zoner / Trampas Chompers y Cohetes", difficulty: "Fácil" },
        { name: "Vi", archetype: "Rushdown Boxeo / Dash Punch", difficulty: "Fácil" },
        { name: "Blitzcrank", archetype: "Grappler / Rocket Grab Pantalla", difficulty: "Fácil" },
        { name: "Warwick", archetype: "Caza Sangrienta / Movilidad Salvaje", difficulty: "Media" }
      ]
    )
  },

  // =========================================================================
  // 6 ENTREGAS CLÁSICAS HISTÓRICAS (isClassic: true)
  // =========================================================================
  {
    id: "sf3s",
    sagaId: "street-fighter",
    title: "Street Fighter III: 3rd Strike",
    isClassic: true,
    releaseYear: 1999,
    currentPatch: "Edición Arcade CPS-3 (Clásico Histórico)",
    subSystemName: "Parry (Adelante sin Bloqueo) & Super Arts",
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/586200/header.jpg",
    coverGradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #090d16 100%)",
    officialSources: [
      { name: "SuperCombo Wiki — 3rd Strike", url: "https://wiki.supercombo.gg/w/Street_Fighter_3:_3rd_Strike" }
    ],
    basicGuide: {
      title: "Fundamentos de 3rd Strike: El Sistema de Parry (Bloqueo Adelante) y Super Arts",
      videoUrl: "https://www.youtube.com/embed/seXtzdiKi4Y?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "SuperCombo / Bafael — 3rd Strike",
      summary: "El título 2D más venerado por su mecánica de Parry: pulsar Adelante (6) o Abajo (2) justo cuando el golpe va a impactarte te permite castigar incluso Supers sin recibir daño.",
      sections: [
        {
          heading: "1. Cómo funciona el Parry (10 frames) y Red Parry",
          content: "Pulsa → contra golpes altos/medios y ↓ contra golpes bajos justo antes del impacto. El Red Parry ocurre cuando haces Parry en mitad de una secuencia que estabas bloqueando."
        },
        {
          heading: "2. Selección de Super Art (SA I, II o III)",
          content: "Cada luchador escoge 1 de sus 3 Super Arts antes del combate, lo que además define cuántas barras EX tendrá (ej. Chun-Li SA2 = 2 barras cortas, Yun SA3 Genei Jin)."
        }
      ]
    },
    advancedGuide: {
      title: "Guía Avanzada 3rd Strike: Option Selects, Kara Throws y Genei Jin",
      videoUrl: "https://www.youtube.com/embed/seXtzdiKi4Y?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "SuperCombo — 3rd Strike Avanzado",
      summary: "Domina los Kara Throws (cancelar un normal que avanza en agarre para doblar su rango) y la presión de Yun / Chun-Li / Ken.",
      sections: [
        {
          heading: "1. Kara Cancels y Daño de Aturdimiento (Stun)",
          content: "En 3rd Strike los golpes EX no gastan toda la barra y muchos personajes aturden en 2 combos limpios si presionan tras Knockdown."
        }
      ]
    },
    characters: hydrateExtraGameChars(
      "sf3s",
      "sf",
      "https://wiki.supercombo.gg/w/Street_Fighter_3:_3rd_Strike/",
      "https://www.youtube.com/embed/seXtzdiKi4Y",
      "3b82f6",
      [
        { name: "Ken", archetype: "Rushdown Shoto / SA3 Shippu Jinraikyaku", difficulty: "Fácil" },
        { name: "Chun-Li", archetype: "Top 1 / b+MK & SA2 Hoyoku-sen", difficulty: "Fácil" },
        { name: "Yun", archetype: "Top 2 / Genei Jin (SA3) Presión", difficulty: "Media" },
        { name: "Makoto", archetype: "Explosiva / Karates & SA2 Abare Tosanami", difficulty: "Difícil" },
        { name: "Dudley", archetype: "Boxeador / Overhead & High-Low", difficulty: "Media" },
        { name: "Ryu", archetype: "Shoto / Denjin Hadoken SA3 (Unblockable)", difficulty: "Fácil" },
        { name: "Akuma", archetype: "Glass Cannon / Demon & Vortex", difficulty: "Media" },
        { name: "Urien", archetype: "Setplay / Aegis Reflector (Imbloqueables)", difficulty: "Difícil" },
        { name: "Yang", archetype: "Rushdown / Rekkas & Seiei Enbu", difficulty: "Media" },
        { name: "Alex", archetype: "Grappler-Brawler / Power Bomb", difficulty: "Fácil" },
        { name: "Elena", archetype: "Mix-up Patadas / Healing SA2", difficulty: "Fácil" },
        { name: "Hugo", archetype: "Grappler Puro / 360 Moonsault", difficulty: "Difícil" },
        { name: "Ibuki", archetype: "Ninja / Vortex de Kunais", difficulty: "Difícil" },
        { name: "Oro", archetype: "Unblockables / Tengu Stones SA2", difficulty: "Difícil" },
        { name: "Necro", archetype: "Elástico / Mix Electricidad", difficulty: "Media" },
        { name: "Q", archetype: "Tanque / Burlas Defensa (+Defensa)", difficulty: "Difícil" },
        { name: "Remy", archetype: "Zoner Carga / Blue Nocturne", difficulty: "Media" },
        { name: "Sean", archetype: "Clásico / Baloncesto & Shoto", difficulty: "Difícil" }
      ]
    )
  },
  {
    id: "usf4",
    sagaId: "street-fighter",
    title: "Ultra Street Fighter IV",
    isClassic: true,
    releaseYear: 2014,
    currentPatch: "Edición Final USFIV v1.05 (Clásico Histórico)",
    subSystemName: "Focus Attack Dash Cancel (FADC) & Ultra Combos",
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/45760/header.jpg",
    coverGradient: "linear-gradient(135deg, #991b1b 0%, #f59e0b 55%, #090d16 100%)",
    officialSources: [
      { name: "SuperCombo Wiki — USFIV", url: "https://wiki.supercombo.gg/w/Ultra_Street_Fighter_4" }
    ],
    basicGuide: {
      title: "Fundamentos de USFIV: Focus Attack, FADC y 1-Frame Links",
      videoUrl: "https://www.youtube.com/embed/seXtzdiKi4Y?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Bafael / SuperCombo — USFIV",
      summary: "El juego que definió la era moderna de los eSports: Focus Attack (MP+MK) absorbe un golpe y permite hacer FADC (gastando 2 barras) para volver seguro cualquier Shoryuken.",
      sections: [
        {
          heading: "1. Focus Attack Dash Cancel (FADC)",
          content: "Pulsa MP+MK + Adelante,Adelante durante un Shoryuken o proyectil EX para cancelarlo, extender hacia Ultra Combo o mantener la seguridad."
        },
        {
          heading: "2. Delayed Wakeup y Ultra Combo Double",
          content: "Elige entre Ultra 1, Ultra 2 o 'W-Ultra' (llevar ambos con menor daño) y retrasa el levantamiento pulsando 2 botones al caer."
        }
      ]
    },
    advancedGuide: {
      title: "Guía Avanzada USFIV: Crouch Tech, Plinking y Setplay Okizeme",
      videoUrl: "https://www.youtube.com/embed/seXtzdiKi4Y?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "USFIV Técnico",
      summary: "Aprende Plinking (Priority Linking) para convertir enlaces difíciles de 1 frame en ventanas cómodas de 2 frames.",
      sections: [
        {
          heading: "1. Crouch Tech (↓ + LP + LK)",
          content: "Técnica defensiva icónica de SF4 que saca un Jab si el atacante retrasa su presión o rompe automáticamente el agarre rival."
        }
      ]
    },
    characters: hydrateExtraGameChars(
      "usf4",
      "sf",
      "https://wiki.supercombo.gg/w/Ultra_Street_Fighter_4/",
      "https://www.youtube.com/embed/seXtzdiKi4Y",
      "f59e0b",
      [
        { name: "Evil Ryu", archetype: "Glass Cannon / Axe Kick Loops & FADC", difficulty: "Difícil" },
        { name: "Ryu", archetype: "Shoto / cr.MK > Hadoken & Ultra 1", difficulty: "Fácil" },
        { name: "Ken", archetype: "Rushdown / Kara Throw Largo & Step Kick", difficulty: "Fácil" },
        { name: "Elena", archetype: "Healing / Alcance y Hitbox Peculiar", difficulty: "Fácil" },
        { name: "C. Viper", archetype: "Ejecución Extrema / Fierce Feint Fierce", difficulty: "Difícil" },
        { name: "Akuma", archetype: "Vortex Demon Flip / Mix-up Mortal", difficulty: "Media" },
        { name: "Chun-Li", archetype: "Footsies / Walk Speed Máximo", difficulty: "Media" },
        { name: "Sagat", archetype: "Zoner / Tiger Shot & Kara Uppercut", difficulty: "Fácil" },
        { name: "M. Bison", archetype: "Presión Scissor Kick / Walk Forward", difficulty: "Fácil" },
        { name: "Cammy", archetype: "Rushdown / Instant Cannon Strike", difficulty: "Fácil" },
        { name: "Fei Long", archetype: "Rekka / Footsies Puro de Torneos", difficulty: "Fácil" },
        { name: "Ibuki", archetype: "Vortex Kunai Ineludible tras Grab", difficulty: "Difícil" },
        { name: "Guile", archetype: "Zoner / Sonic Boom Impenetrable", difficulty: "Media" },
        { name: "Zangief", archetype: "Grappler / Green Hand & SPD", difficulty: "Media" },
        { name: "Juri", archetype: "Fireball Store / Feng Shui Engine", difficulty: "Difícil" },
        { name: "Decapre", archetype: "Carga / Mix Teletransporte Scramble", difficulty: "Media" }
      ]
    )
  },
  {
    id: "tekken7",
    sagaId: "tekken",
    title: "Tekken 7",
    isClassic: true,
    releaseYear: 2017,
    currentPatch: "Edición Final v5.10 (Clásico Histórico)",
    subSystemName: "Rage Drive, Screw Combos & 2D Meter (Akuma/Geese)",
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/389730/header.jpg",
    coverGradient: "linear-gradient(135deg, #450a0a 0%, #dc2626 50%, #090d16 100%)",
    officialSources: [
      { name: "Wavu Wiki — Tekken 7", url: "https://wavu.wiki/t/Main_Page" }
    ],
    basicGuide: {
      title: "Fundamentos de Tekken 7: Movimiento 3D, Rage Drives y Screw",
      videoUrl: "https://www.youtube.com/embed/D58LncnVbXM?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Tekken 7 Fundamentos",
      summary: "El Tekken más duradero de la historia moderna: sin Heat System ni Chip Damage normal, centrado en Korean Backdash limpio, Counter Hits (Magic 4) y Rage Drives.",
      sections: [
        {
          heading: "1. Magic 4 y Screw (Tailspin)",
          content: "Muchos personajes tienen un golpe rápido de 11–12 frames (4) que en Counter Hit regala un combo completo usando la mecánica Screw para lanzar hacia adelante."
        },
        {
          heading: "2. Rage Drive vs Rage Art",
          content: "Con poca vida puedes gastar Rage en una versión súper potenciada de un movimiento (Rage Drive) que te deja positivo en bloqueo o extiende muro."
        }
      ]
    },
    advancedGuide: {
      title: "Guía Avanzada Tekken 7: Neutral Keepout, KBD Puro y Invitados 2D",
      videoUrl: "https://www.youtube.com/embed/_5bwBUn7fcM?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Tekken 7 Competitivo",
      summary: "Aprende a castigar las cancelaciones con barra Super/EX de Akuma, Geese y Eliza manteniendo movimiento constante en neutro.",
      sections: [
        {
          heading: "1. Low Parry (df)",
          content: "Hacer Low Parry (Mantener df justo ante un ataque bajo) lanza para combo completo escalado en Tekken 7."
        }
      ]
    },
    characters: hydrateExtraGameChars(
      "tekken7",
      "tekken",
      "https://wavu.wiki/t/",
      "https://www.youtube.com/embed/D58LncnVbXM",
      "dc2626",
      [
        { name: "Kazuya", archetype: "Mishima / 50-50 & PEWGF", difficulty: "Difícil" },
        { name: "Jin", archetype: "All-Rounder / Magic 4 & f+4", difficulty: "Media" },
        { name: "Akuma (T7)", archetype: "Invitado 2D / Barra Death Combo", difficulty: "Difícil" },
        { name: "Geese Howard", archetype: "Invitado SNK / Parries & Barra", difficulty: "Media" },
        { name: "Heihachi", archetype: "Mishima / Mids Brutales ff+2", difficulty: "Media" },
        { name: "Devil Jin", archetype: "Mishima / Hell Sweep Lanzador T7", difficulty: "Media" },
        { name: "Feng", archetype: "Evasivo / Kenpo Step & Pokes", difficulty: "Fácil" },
        { name: "King", archetype: "Grappler / Chain Throws", difficulty: "Media" },
        { name: "Paul", archetype: "Deathfist & Safe df+2", difficulty: "Fácil" },
        { name: "Bryan", archetype: "CH Monster / Taunt b+4 Muro", difficulty: "Difícil" },
        { name: "Dragunov", archetype: "Presión d+2 & iWR2", difficulty: "Fácil" },
        { name: "Julia Chang", archetype: "Rushdown / Party Crasher ff+1", difficulty: "Media", dlcPack: "Season Pass 2" },
        { name: "Leroy Smith", archetype: "Wing Chun / Parries & Cane", difficulty: "Fácil", dlcPack: "Season Pass 3" },
        { name: "Fahkumram", archetype: "Muay Thai / Mix Guard Break", difficulty: "Fácil", dlcPack: "Season Pass 3" },
        { name: "Zafina", archetype: "Backdash #1 / Posturas Evasivas", difficulty: "Media", dlcPack: "Season Pass 3" },
        { name: "Kunimitsu", archetype: "Ninjutsu / SET 2 Tela Completa", difficulty: "Fácil", dlcPack: "Season Pass 4" }
      ]
    )
  },
  {
    id: "mk11",
    sagaId: "mortal-kombat",
    title: "Mortal Kombat 11 Ultimate",
    isClassic: true,
    releaseYear: 2019,
    currentPatch: "Edición Ultimate Final (Clásico Histórico)",
    subSystemName: "Krushing Blows, Breakaway & 2 Barras Sep.",
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/976310/header.jpg",
    coverGradient: "linear-gradient(135deg, #451a03 0%, #f59e0b 50%, #111827 100%)",
    officialSources: [
      { name: "Kombat Akademy — MK11", url: "https://www.kombatakademy.com/mortal-kombat-11/" }
    ],
    basicGuide: {
      title: "Fundamentos de MK11: Krushing Blows, Medidores Separados y Wakeups",
      videoUrl: "https://www.youtube.com/embed/ZRgcup89e-Y?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "PNDK&M — MK11 Fundamentos",
      summary: "MK11 destaca por su enfoque pausado de footsies, barras separadas (2 Ofensivas / 2 Defensivas que recargan con el tiempo) y los devastadores Krushing Blows.",
      sections: [
        {
          heading: "1. Krushing Blows (Requisito Especial)",
          content: "Cada luchador posee golpes que activan una cámara lenta de +30% de daño si cumples su condición (ej. castigar un fallo, 2 agarres sin escapar o máximo rango)."
        },
        {
          heading: "2. Breakaway y Opciones de Wakeup (u+2 / u+3 / Roll)",
          content: "Pulsa Abajo+Bloqueo en el aire para soltarte de un combo con armadura (Breakaway) o elige entre ataque invencible (u+3) y rodar al levantarte."
        }
      ]
    },
    advancedGuide: {
      title: "Guía Avanzada MK11: Flawless Block Attack (u+2) y Anti-Breakaway",
      videoUrl: "https://www.youtube.com/embed/ZRgcup89e-Y?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Kombat Akademy MK11",
      summary: "En MK11 un Flawless Block permite pulsar u+2 instantáneamente para lanzar al aire al atacante aunque estuviera haciendo una cadena segura.",
      sections: [
        {
          heading: "1. Variaciones Personalizadas (Kustom Variations)",
          content: "Combina hasta 3 espacios de movimientos especiales en torneo para cubrir puntos débiles o ganar anti-zoning."
        }
      ]
    },
    characters: hydrateExtraGameChars(
      "mk11",
      "mk",
      "https://www.kombatakademy.com/mortal-kombat-11/",
      "https://www.youtube.com/embed/ZRgcup89e-Y",
      "d97706",
      [
        { name: "Scorpion", archetype: "Whiff Punisher / Teleport Cancel", difficulty: "Fácil" },
        { name: "Sub-Zero", archetype: "Mix-up 50-50 Rápido (f+2 / b+3)", difficulty: "Fácil" },
        { name: "Liu Kang", archetype: "Top 1 / f+4,3,4 Staggers", difficulty: "Fácil" },
        { name: "Jacqui Briggs", archetype: "Presión Upgraded / Dash Cancel", difficulty: "Difícil" },
        { name: "Cetrion", archetype: "Zoner Supremo / Terremoto & Teleport", difficulty: "Fácil" },
        { name: "Geras", archetype: "50-50 & Krushing Blows Masivos", difficulty: "Fácil" },
        { name: "Johnny Cage", archetype: "Footsies / Forceballs & Outtake", difficulty: "Media" },
        { name: "Kabal", archetype: "Casi Todo Seguro / Hook Grab", difficulty: "Fácil" },
        { name: "Erron Black", archetype: "Mix-up / Bota & Deslizamiento", difficulty: "Media" },
        { name: "Jade", archetype: "Keepout Bastón & Escudo Anti-Proyectil", difficulty: "Fácil" },
        { name: "Kitana", archetype: "Footsies / Half-Blood & Abanicos", difficulty: "Media" },
        { name: "Noob Saibot", archetype: "Combo Damage #1 / Clones", difficulty: "Media" },
        { name: "Kotal Kahn", archetype: "Mid Gigante f+2 & Totems Daño", difficulty: "Fácil" },
        { name: "Fujin", archetype: "Movilidad Aérea / Sky Wakka", difficulty: "Difícil", dlcPack: "Aftermath Expansion" },
        { name: "Joker (MK11)", archetype: "Alcance Extremo con Bastón / Kapow", difficulty: "Fácil", dlcPack: "Kombat Pack 1" },
        { name: "Spawn", archetype: "Alcance & 50% Combos con Carga", difficulty: "Fácil", dlcPack: "Kombat Pack 1" }
      ]
    )
  },
  {
    id: "ggxrd",
    sagaId: "guilty-gear",
    title: "Guilty Gear Xrd REV 2",
    isClassic: true,
    releaseYear: 2017,
    currentPatch: "Edición Rollback Netcode Final (Clásico Histórico)",
    subSystemName: "YRC (25% Tension), Blitz Shield & Danger Time",
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/520440/header.jpg",
    coverGradient: "linear-gradient(135deg, #881337 0%, #e11d48 50%, #090d16 100%)",
    officialSources: [
      { name: "Dustloop Wiki — GGXrd REV 2", url: "https://www.dustloop.com/w/GGXRD-R2" }
    ],
    basicGuide: {
      title: "Fundamentos de GGXrd REV 2: Gatling P>K>S>HS, Air Throw 1f y YRC",
      videoUrl: "https://www.youtube.com/embed/uWfW1SgIfTQ?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Dustloop — Guía GGXrd REV 2",
      summary: "El predecesor de Strive con rutas Gatling libres (P>K>S>HS), agarres aéreos en 1 frame y Yellow Roman Cancel de solo 25% de barra en neutro.",
      sections: [
        {
          heading: "1. Yellow Roman Cancel (25% Tension)",
          content: "Cuando estás en recuperación o neutro (sin golpear), pulsar RC cuesta solo un 25% y congela la pantalla brevemente para ganar el turno gratis con proyectiles."
        },
        {
          heading: "2. Blitz Shield y Dead Angle",
          content: "Pulsa H+S (o D según layout) para hacer Blitz Shield con 25% de barra y reflejar golpes o usa Dead Angle (Adelante+2 botones en bloqueo)."
        }
      ]
    },
    advancedGuide: {
      title: "Guía Avanzada GGXrd REV 2: Unblockable Setups, Air Tech y Dust",
      videoUrl: "https://www.youtube.com/embed/1_3VYvvzhNE?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Guías Xrd REV 2",
      summary: "Aprende a evitar caer en trampas imbloqueables con Faultless Defense en el aire y castigos rápidos tras Blitz Reject.",
      sections: [
        {
          heading: "1. Carga de Dust y Homing Jump",
          content: "Conectar Dust (5D) te permite perseguir al rival por los cielos para elegir entre combos máximos de daño o Okizeme."
        }
      ]
    },
    characters: hydrateExtraGameChars(
      "ggxrd",
      "gg",
      "https://www.dustloop.com/w/GGXRD-R2/",
      "https://www.youtube.com/embed/uWfW1SgIfTQ",
      "e11d48",
      [
        { name: "Sol Badguy", archetype: "Rushdown / Riot Stamp & Wild Throw", difficulty: "Fácil" },
        { name: "Ky Kiske", archetype: "All-Rounder / Grinder Setplay", difficulty: "Fácil" },
        { name: "Johnny", archetype: "Top 1 / Mist Finer Cancels & Monedas", difficulty: "Difícil" },
        { name: "Elphelt Valentine", archetype: "Shotgun Presión & Granada", difficulty: "Media" },
        { name: "Chipp Zanuff", archetype: "Velocidad Extrema / Teletransportes", difficulty: "Difícil" },
        { name: "Millia Rage", archetype: "Vortex Disc (H-Tandem) 50/50", difficulty: "Media" },
        { name: "Zato-1", archetype: "Puppet (Eddie) / Presión Imbloqueable", difficulty: "Difícil" },
        { name: "Venom", archetype: "Billar Setplay / Bolas por Toda Pantalla", difficulty: "Difícil" },
        { name: "Sin Kiske", archetype: "Alcance Bandera / Calorías (Comida)", difficulty: "Fácil" },
        { name: "Baiken", archetype: "Azami Parry / Guard Cancel Único", difficulty: "Difícil" },
        { name: "Dizzy", archetype: "Setplay Doble Invocación / Movilidad", difficulty: "Media" },
        { name: "Ramlethal Valentine", archetype: "Esquina Mortal con 2 Espadas", difficulty: "Difícil" },
        { name: "May", archetype: "Carga / Delfines y Setplay Playa", difficulty: "Fácil" },
        { name: "Potemkin", archetype: "Grappler / Potemkin Buster & FDB", difficulty: "Media" },
        { name: "I-No", archetype: "Hover Dash / Nota Okizeme", difficulty: "Difícil" },
        { name: "Answer", archetype: "Ninja / Tarjetas de Negocio & Clones", difficulty: "Difícil" }
      ],
      (nm) => getMediaWikiHashedUrl("https://www.dustloop.com/wiki/images", `GGXRD-R2_${nm.replace(/\s+/g, "_")}_Icon.png`)
    )
  },
  {
    id: "ssbm",
    sagaId: "super-smash-bros",
    title: "Super Smash Bros. Melee",
    isClassic: true,
    releaseYear: 2001,
    currentPatch: "NTSC v1.02 + Slippi Rollback (Clásico Histórico)",
    subSystemName: "Wavedash, L-Cancel & Edgeguarding Clásico",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co21e2.jpg",
    coverGradient: "linear-gradient(135deg, #1d4ed8 0%, #38bdf8 50%, #090d16 100%)",
    officialSources: [
      { name: "Melee Library / SmashWiki", url: "https://www.ssbwiki.com/Super_Smash_Bros._Melee" }
    ],
    basicGuide: {
      title: "Fundamentos de Smash Melee: L-Cancel, Wavedash y Dash Dance",
      videoUrl: "https://www.youtube.com/embed/ta3L35wsE6o?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "SSBM Tutorials — Guía Melee",
      summary: "El platform fighter técnico más rápido jamás creado: sin buffer moderno, con L-Canceling manual para reducir a la mitad el landing lag y Wavedashing.",
      sections: [
        {
          heading: "1. L-Cancel (Lag Cancel)",
          content: "Pulsa L, R o Z dentro de los 7 frames antes de tocar el suelo tras un ataque aéreo para cortar a la mitad su tiempo de recuperación."
        },
        {
          heading: "2. Wavedash y Dash Dance",
          content: "Salta y haz Air Dodge en diagonal hacia el suelo casi al instante (2–4 frames) para deslizarte por el escenario conservando todas tus opciones de ataque."
        }
      ]
    },
    advancedGuide: {
      title: "Guía Avanzada Melee: Crouch Cancel, Edgehogging y Shine Spikes",
      videoUrl: "https://www.youtube.com/embed/ta3L35wsE6o?cc_load_policy=1&cc_lang_pref=es&hl=es",
      videoAuthor: "Melee Competitivo (Slippi)",
      summary: "En Melee agarrar el borde impide que otro jugador se agarre a él (Edgehogging) y agacharse antes de un golpe reduce el empuje permitiendo contraataques instantáneos (Crouch Cancel).",
      sections: [
        {
          heading: "1. Multishine y Pillar Combos",
          content: "El Shine (Down-B) de Fox y Falco sale en el Frame 1 siendo invencible y cancelable por salto al instante."
        }
      ]
    },
    characters: hydrateExtraGameChars(
      "ssbm",
      "smash",
      "https://www.ssbwiki.com/",
      "https://www.youtube.com/embed/ta3L35wsE6o",
      "3b82f6",
      [
        { name: "Fox", archetype: "Top 1 / Shine Frame 1 & Up-Smash", difficulty: "Difícil" },
        { name: "Falco", archetype: "Spacie / Laser Control & Pillar Dair", difficulty: "Difícil" },
        { name: "Marth", archetype: "Espadachín / Tippers & Chain Grab FD", difficulty: "Media" },
        { name: "Sheik", archetype: "Tech Chase / Fair & Needles", difficulty: "Fácil" },
        { name: "Jigglypuff", archetype: "Aéreo / Back Air & Rest", difficulty: "Media" },
        { name: "Captain Falcon", archetype: "Velocidad / Knee & Stomp", difficulty: "Media" },
        { name: "Peach", archetype: "Float Cancel / Turnips & Down-Smash", difficulty: "Difícil" },
        { name: "Ice Climbers", archetype: "Dúo / Wobbling & Hand-offs", difficulty: "Difícil" },
        { name: "Pikachu", archetype: "Ágil / Up-Air Tails & Quick Attack", difficulty: "Difícil" },
        { name: "Samus", archetype: "Pesado / Crouch Cancel & Missiles", difficulty: "Media" },
        { name: "Yoshi", archetype: "Parry Único & Super Armor Doble Salto", difficulty: "Difícil" },
        { name: "Luigi", archetype: "El Wavedash más largo del juego", difficulty: "Fácil" }
      ],
      (nm) => {
        const slugMap = {
          "Fox": "fox", "Falco": "falco", "Marth": "marth", "Sheik": "sheik",
          "Jigglypuff": "jigglypuff", "Captain Falcon": "captain_falcon", "Peach": "peach",
          "Ice Climbers": "ice_climbers", "Pikachu": "pikachu", "Samus": "samus", "Yoshi": "yoshi", "Luigi": "luigi"
        };
        return `https://www.smashbros.com/assets_v2/img/fighter/thumb_a/${slugMap[nm] || nm.toLowerCase()}.png`;
      }
    )
  }
];

module.exports = {
  EXTRA_SAGAS,
  EXTRA_GAMES
};
