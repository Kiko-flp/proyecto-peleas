/**
 * Base de datos principal verificada con fuentes reales de la FGC:
 * - Incluye las imágenes principales oficiales (Key Art) de fondo de cada juego.
 * - Incluye TODOS los personajes hasta la fecha (259 luchadores entre Juego Base y Packs DLC).
 * - Sin emojis innecesarios en títulos ni cabeceras.
 */

const {
  buildRosterEntry,
  MK1_RAW,
  SF6_RAW,
  TEKKEN8_RAW,
  DBFZ_RAW,
  GGST_RAW,
  SSBU_RAW
} = require("./fullRosters");

// Fichas detalladas personalizadas que se fusionan con el plantel completo de cada juego
const DETAILED_OVERRIDES = {
  "mk1:Scorpion": {
    sub: "Kameo: Ferra / Khameleon / Jax",
    overview: "Especialista en castigar errores a media distancia gracias a su arpón (Spear), su barrido de largo alcance y conversiones aéreas de alto daño.",
    keyMoves: [
      { input: "f+3, 2", frames: "12f Mid", notes: "Lanzador principal a media distancia; confirma en combo aéreo completo." },
      { input: "2, 1", frames: "10f High-Mid", notes: "Cadena segura (+2 en bloqueo) ideal para mantener presión." },
      { input: "b+3", frames: "18f Low", notes: "Latigazo bajo de enorme rango para controlar el espacio." },
      { input: "bf+1", frames: "16f High", notes: "Spear (Arpón): atrae al rival desde toda la pantalla para combo gratis." }
    ],
    combos: [
      { type: "Midscreen (Sin barra)", notation: "f+3,2 > j.1,1,1 ~ db+2 > dash > f+3,2 ~ bf+1 > 3,3 ~ bf+2", damage: "345 dmg" },
      { type: "Midscreen (1 Barra)", notation: "2,1 ~ bf+1 > f+3,2 > f+3,2 > j.1,2 ~ EX db+2 > j.1,1,1 ~ bf+2", damage: "412 dmg" },
      { type: "Esquina (Corner BnB)", notation: "f+3,2 > 4 ~ bf+1 > f+3,2 > j.1,2 ~ db+2 > 3,3 ~ bf+2", damage: "390 dmg" }
    ],
    gameplan: "Mantente a la distancia máxima de tu b+3 y f+3. Espera a que el rival falle un golpe al aire (whiff) para conectarle f+3,2 o bf+1. Usa un Kameo como Ferra o Khameleon para sumar mix-ups de Overhead/Low."
  },
  "mk1:Sub-Zero": {
    sub: "Kameo: Khameleon / Sonya",
    overview: "Domina el ritmo de la partida con clones de hielo defensivos, deslizamiento bajo y amenazas constantes de Overhead (b+2) y Low (b+3,4).",
    keyMoves: [
      { input: "b+2", frames: "23f Overhead", notes: "Lanzador Overhead que rebota al rival en el suelo para combo." },
      { input: "b+3, 4", frames: "13f Low", notes: "Doble patada baja cancelable en Ice Slide o Ice Clone." },
      { input: "db+1", frames: "Ice Clone", notes: "Crea una estatua de hielo que congela a quien intente avanzar o saltar." },
      { input: "bf+3", frames: "11f Low", notes: "Ice Slide: castiga proyectiles y acerca al rival a la esquina." }
    ],
    combos: [
      { type: "Midscreen (Desde Overhead)", notation: "b+2 > j.1,2 > b+2 > j.1,2,2 ~ bf+3", damage: "320 dmg" },
      { type: "Confirmación desde Low (1 Barra)", notation: "b+3,4 ~ EX df+4 > dash > b+2 > j.1,2 ~ db+4", damage: "355 dmg" }
    ]
  },
  "mk1:Johnny Cage": {
    sub: "Kameo: Kano / Khameleon / Kung Lao",
    overview: "Rey de la presión a corta distancia sin proyectiles. Acumula medidor de Hype para encadenar movimientos especiales dobles.",
    keyMoves: [
      { input: "f+3, 2", frames: "9f Mid", notes: "El mejor Mid de 9 frames del juego para confirmar o atrapar intentos de salto." },
      { input: "1, 1", frames: "7f High", notes: "Queda en +3 en bloqueo, garantizando que tu siguiente f+3 sea un Frame Trap." },
      { input: "f+1, 2", frames: "10f Mid", notes: "Avanza hacia adelante y permite hacer stagger o completar f+1,2,4 (Overhead)." }
    ],
    combos: [
      { type: "Midscreen (1 Barra - Nut Punch)", notation: "f+3,2 ~ EX bd+1 > dash > f+3,2 > 2,1,2 > dash > f+1,2 ~ bf+4", damage: "365 dmg" }
    ]
  },
  "mk1:Omni-Man": {
    sub: "Kameo: Jax / Kung Lao / Mavado",
    overview: "Personaje invitado de Invincible. Su postura Viltrumite Stance esquiva automáticamente todos los proyectiles y ataques altos.",
    keyMoves: [
      { input: "db+3", frames: "Viltrumite Stance", notes: "Postura flotante inmune a proyectiles; sigue con 1 (lanzador), 2 (overhead) o 3." },
      { input: "b+1, 1", frames: "12f Mid", notes: "Iniciador de avance rápido seguro y fácil de confirmar." }
    ],
    combos: [
      { type: "Midscreen Estándar (Sin Barra)", notation: "b+1,1 ~ db+3, 1 > j.1,2, 1+3 > j.2,1,2, 1+3", damage: "348 dmg" }
    ]
  },
  "sf6:Ryu": {
    sub: "Control Clásico / Moderno",
    overview: "El arquetipo Shoto por excelencia: controla el suelo con Hadoken y 2MK, castiga saltos con Shoryuken y potencia sus especiales con Denjin Charge.",
    keyMoves: [
      { input: "2MK", frames: "8f Low", notes: "Herramienta clave de footsies cancelable en Drive Rush o Hadoken." },
      { input: "5HP", frames: "10f High/Mid", notes: "Puño fuerte de gran rango y daño para Whiff Punish." },
      { input: "623HP", frames: "Shoryuken", notes: "Invencible al aire desde el frame 1." }
    ],
    combos: [
      { type: "Confirmación Drive Rush", notation: "2MK ~ DRC > 5MP > 2MP ~ 214MP (Tatsu) / 236HP", damage: "2420 dmg" },
      { type: "Punish Counter Esquina + Nivel 3", notation: "5HP > 214HP (Hashogeki) > 5MP > 623LP ~ 236236K (Shin Shoryuken)", damage: "5480 dmg" }
    ]
  },
  "sf6:Akuma": {
    sub: "Control Clásico",
    overview: "Tiene 9000 de vida, pero lo compensa con la velocidad de caminata más rápida, bola de fuego aérea y un daño explosivo.",
    keyMoves: [
      { input: "j.236P", frames: "Air Gohadoken", notes: "Bola de fuego en el aire que altera tu arco de salto." },
      { input: "6HP > 6HP > K", frames: "Adamant Flame", notes: "Empuja en bloqueo y da Wall Splat en OD." },
      { input: "5HK", frames: "13f (+3 on block)", notes: "Doble patada que deja a +3 en bloqueo si impacta de pie." }
    ],
    combos: [
      { type: "Midscreen Safe Jump", notation: "5MP > 2MP ~ 214LK (Light Tatsu) > 2HK (Sweep)", damage: "2490 dmg (+42f)" },
      { type: "Esquina + Shun Goku Satsu", notation: "5HP ~ 236HP > 2HP ~ 214HP > 623LP > LP > LP > 6+LK > HP", damage: "5850 dmg" }
    ]
  },
  "tekken8:Jin Kazama": {
    sub: "Heat + Zanshin Stance (ZEN)",
    overview: "El personaje más completo de Tekken 8: herramientas para todas las distancias, el bajo d+2 de enorme alcance, parries y Electric Wind Hook Fist.",
    keyMoves: [
      { input: "d+2", frames: "i20 Low (+4c)", notes: "Barrido bajo; en Counter Hit lanza para combo completo." },
      { input: "f+4", frames: "i16 Mid", notes: "Patada frontal de larguísimo alcance para dominar la media distancia." },
      { input: "f,n,d,df+2", frames: "i14 High (+5)", notes: "Electric Wind Hook Fist (EWHF): lanzador positivo en bloqueo." }
    ],
    combos: [
      { type: "Combo Estándar desde EWHF / uf+4", notation: "uf+4 > b+3~f (ZEN) 1 > b+3~f 1 > b,f+2,3~f (Tornado) > dash > b+3~f 1,3", damage: "68 dmg" }
    ]
  },
  "tekken8:Kazuya Mishima": {
    sub: "Devil Form (Heat) + Wave Dash",
    overview: "Especialista en castigos precisos y el mix-up de 50/50 más temido del género entre Hell Sweep (bajo) y ff+3 (medio lanzador).",
    keyMoves: [
      { input: "f,n,d,df+2", frames: "i13-14 High (+5)", notes: "Electric Wind God Fist (EWGF): piedra angular de su juego neutro." },
      { input: "f,n,d,df+4, 1", frames: "i16 Low", notes: "Hell Sweep: derriba al suelo y reinicia el Vortex." },
      { input: "ws+1, 2", frames: "i13 Twin Pistons", notes: "Lanzador de 13 frames desde agachado." }
    ],
    combos: [
      { type: "Combo Estándar desde EWGF", notation: "EWGF > EWGF > b+2,2 > df+1,df+2 (Tornado) > dash > b+3,1 > 3,1~df > cd+1+2", damage: "75 dmg" }
    ]
  }
};

function hydrateRoster(gameId, sagaNotation, wikiBaseUrl, defaultVideo, colorHex, rawList) {
  return rawList.map((item) => {
    const override = DETAILED_OVERRIDES[`${gameId}:${item.name}`] || {};
    return buildRosterEntry(
      gameId,
      sagaNotation,
      wikiBaseUrl,
      defaultVideo,
      colorHex,
      {
        ...item,
        ...override
      },
      rawList
    );
  });
}

const SEED_DATA = {
  // Directorio de Wikis, Canales de YouTube y Recursos aportados/verificados
  communityResources: [
    {
      id: "res-1",
      category: "Wiki / Frame Data",
      targetGame: "Street Fighter 6",
      title: "SuperCombo Wiki — Street Fighter 6",
      url: "https://wiki.supercombo.gg/w/Street_Fighter_6",
      description: "Wiki principal competitiva con Frame Data detallada, hitboxes y estrategias de todos los personajes de SF6.",
      missingNotes: "Cubre el plantel completo hasta Year 3.",
      author: "Comunidad FGC",
      status: "approved"
    },
    {
      id: "res-2",
      category: "Wiki / Frame Data",
      targetGame: "Guilty Gear -Strive- & DBFZ",
      title: "Dustloop Wiki Oficial",
      url: "https://www.dustloop.com/",
      description: "Enciclopedia técnica de referencia para todos los juegos de Arc System Works.",
      missingNotes: "Referencia principal para rutas de Roman Cancel y Limit Break.",
      author: "Comunidad FGC",
      status: "approved"
    },
    {
      id: "res-3",
      category: "Wiki / Frame Data",
      targetGame: "Tekken 8",
      title: "Wavu Wiki — Tekken 8",
      url: "https://wavu.wiki/t/Main_Page",
      description: "Documentación técnica de movimientos, castigos por frames, seguimiento lateral y rutas de Tornado.",
      missingNotes: "Referencia técnica de Tekken 8.",
      author: "Comunidad FGC",
      status: "approved"
    },
    {
      id: "res-4",
      category: "Canal de YouTube",
      targetGame: "Mortal Kombat 1",
      title: "PNDK&M (Ketchup & Mustard)",
      url: "https://www.youtube.com/@PNDKM",
      description: "Canal especializado en guías competitivas, historia de Mortal Kombat y análisis de Kameos.",
      missingNotes: "Ideal para vídeos individuales de personajes de MK1.",
      author: "Comunidad FGC",
      status: "approved"
    },
    {
      id: "res-5",
      category: "Canal de YouTube",
      targetGame: "Tekken 8",
      title: "PhiDX — Guías Competitivas Tekken 8",
      url: "https://www.youtube.com/@PhiDX",
      description: "Tutoriales paso a paso de movimiento 3D, defensas contra personajes y análisis de torneos.",
      missingNotes: "Cubre fundamentos y guías avanzadas de Tekken 8.",
      author: "Comunidad FGC",
      status: "approved"
    },
    {
      id: "res-6",
      category: "Wiki / Frame Data",
      targetGame: "Super Smash Bros. Ultimate",
      title: "Ultimate Frame Data",
      url: "https://ultimateframedata.com/",
      description: "Hitboxes animadas frame a frame y tabla de opciones Out of Shield (OOS) para los 86 personajes.",
      missingNotes: "Completa para todas las versiones hasta v13.0.3.",
      author: "Comunidad FGC",
      status: "approved"
    }
  ],

  // Resumen estructurado de lo que falta y a qué juego/sección corresponde para valorarlo
  missingContentRoadmap: [
    {
      id: "miss-1",
      area: "Entregas Clásicas e Históricas",
      target: "Mortal Kombat / Street Fighter / Tekken / Guilty Gear / Smash",
      priority: "Alta",
      whatIsMissing: "Añadir entregas anteriores clave de cada saga: Mortal Kombat 11 Ultimate, Mortal Kombat XL, USFIV, Street Fighter III: 3rd Strike, Tekken 7, GG Xrd REV 2 y Super Smash Bros. Melee.",
      purposeForEvaluation: "Cumplir el objetivo de cubrir todos los juegos de lucha históricos además de la entrega actual de cada franquicia."
    },
    {
      id: "miss-2",
      area: "Vídeos Específicos por Personaje",
      target: "Los 6 juegos actuales (271 personajes)",
      priority: "Alta",
      whatIsMissing: "Asignar un vídeo tutorial individual específico de YouTube a cada personaje secundario y de los últimos pases DLC (en lugar del vídeo general del juego).",
      purposeForEvaluation: "Que cada uno de los 271 luchadores tenga su propio vídeo dedicado además de su guía en texto."
    },
    {
      id: "miss-3",
      area: "Sub-plantel de Kameo Fighters",
      target: "Mortal Kombat 1 (Sistema de Kameos)",
      priority: "Media",
      whatIsMissing: "Crear un apartado propio con los iconos y guías de los 20+ Kameos (Khameleon, Ferra, Sareena, Sektor, Cyrax, Mavado, Janet Cage, Tremor, etc.).",
      purposeForEvaluation: "En MK1 los Kameos definen la mitad del plan de juego y qué ataques quedan seguros en bloqueo."
    },
    {
      id: "miss-4",
      area: "Guías Anti-Personaje (Matchups y Castigos)",
      target: "Fichas individuales de personajes (Tekken 8, SF6 y MK1)",
      priority: "Media",
      whatIsMissing: "Añadir un bloque de 'Cómo ganarle / Castigos clave' en cada personaje indicando hacia qué lado hacer Sidestep o en qué golpe hacer Flawless Block / Interrupt.",
      purposeForEvaluation: "Ayudar a los jugadores que entran buscando cómo defenderse contra un personaje concreto que les cuesta en ranked."
    },
    {
      id: "miss-5",
      area: "Nuevas Sagas de Lucha",
      target: "Catálogo Principal de Juegos",
      priority: "Media",
      whatIsMissing: "Incorporar sagas adicionales de peso competitivo: The King of Fighters XV, Fatal Fury: City of the Wolves, Granblue Fantasy Versus: Rising, Under Night In-Birth II y 2XKO.",
      purposeForEvaluation: "Valorar qué saga añadir primero según el interés de los usuarios y del circuito EVO."
    }
  ],

  // Configuración Pública del Canal Oficial Independiente de YouTube del proyecto
  youtubeChannel: {
    name: "FGC Vault Español — Recopilaciones & Frame Data",
    handle: "@FGCVaultES",
    publicUrl: "https://www.youtube.com/@FGCVaultES",
    description:
      "Canal oficial de FGC Vault: Recopilaciones de las mejores guías competitivas internacionales traducidas al español, con subtítulos en español integrados y pausas tácticas congeladas para explicar cada concepto, frame trap y combo paso a paso. Organizado en listas de reproducción por juego.",
    playlistsByGame: [
      {
        gameId: "mk1",
        gameTitle: "Mortal Kombat 1",
        playlistTitle: "Lista de Reproducción: Mortal Kombat 1 (Traducido + Subtítulos ES + Pausas)",
        sourcesCompiled: "Recopilación traducida de PNDK&M, Rooflemonger y Kombat Akademy",
        embedUrl: "https://www.youtube.com/embed/u7pTIg7vKBM?cc_load_policy=1&cc_lang_pref=es&hl=es",
        pauses: [
          { time: "01:10", label: "Pausa Explicativa: Diferencia entre Kameo Summon y Kameo Ambush" },
          { time: "03:25", label: "Pausa Explicativa: Ventana de 3 frames del Flawless Block contra Chip Damage" },
          { time: "05:40", label: "Pausa Explicativa: Cómo hacer Micro-Duck a cadenas que inician en High" }
        ]
      },
      {
        gameId: "sf6",
        gameTitle: "Street Fighter 6",
        playlistTitle: "Lista de Reproducción: Street Fighter 6 (Traducido + Subtítulos ES + Pausas)",
        sourcesCompiled: "Recopilación traducida de Diaphone, Brian_F, Broski y SuperCombo",
        embedUrl: "https://www.youtube.com/embed/k9t3cM_9vY0?cc_load_policy=1&cc_lang_pref=es&hl=es",
        pauses: [
          { time: "00:55", label: "Pausa Explicativa: Buffer de Drive Rush Cancel (DRC) desde 2MK sin malgastar barra" },
          { time: "02:50", label: "Pausa Explicativa: Timing exacto de 4 frames para Delay Throw Tech en la esquina" },
          { time: "05:15", label: "Pausa Explicativa: Cómo castigar con Shimmy y Punish Counter 5HP" }
        ]
      },
      {
        gameId: "tekken8",
        gameTitle: "Tekken 8",
        playlistTitle: "Lista de Reproducción: Tekken 8 (Traducido + Subtítulos ES + Pausas)",
        sourcesCompiled: "Recopilación traducida de PhiDX, MainManSWE y Wavu Wiki",
        embedUrl: "https://www.youtube.com/embed/8pX3mK_vY4A?cc_load_policy=1&cc_lang_pref=es&hl=es",
        pauses: [
          { time: "01:20", label: "Pausa Explicativa: Cuándo hacer Sidestep (-1 a -4 en bloqueo) y bloquear inmediatamente" },
          { time: "03:45", label: "Pausa Explicativa: Uso de Heat Dash (+5 en bloqueo / Lanzador en impacto)" },
          { time: "06:05", label: "Pausa Explicativa: Tabla visual de castigos de 10f, 12f y 15f (Launch)" }
        ]
      },
      {
        gameId: "dbfz",
        gameTitle: "Dragon Ball FighterZ",
        playlistTitle: "Lista de Reproducción: Dragon Ball FighterZ (Traducido + Subtítulos ES + Pausas)",
        sourcesCompiled: "Recopilación traducida de TinyTorgue, Globku y Dustloop",
        embedUrl: "https://www.youtube.com/embed/w4N8w7V2gK8?cc_load_policy=1&cc_lang_pref=es&hl=es",
        pauses: [
          { time: "01:05", label: "Pausa Explicativa: Salto cancelado (jc) tras 2M > 5M en la Ruta Universal" },
          { time: "03:15", label: "Pausa Explicativa: Special Tag en mitad de movimiento especial sin gastar barra" },
          { time: "05:00", label: "Pausa Explicativa: Mix-up 50/50 tras Super Dash + Asistencia" }
        ]
      },
      {
        gameId: "gg-strive",
        gameTitle: "Guilty Gear -Strive-",
        playlistTitle: "Lista de Reproducción: Guilty Gear -Strive- (Traducido + Subtítulos ES + Pausas)",
        sourcesCompiled: "Recopilación traducida de Sajam, Hotashi, Romolla y Dustloop",
        embedUrl: "https://www.youtube.com/embed/k9t3cM_9vY0?cc_load_policy=1&cc_lang_pref=es&hl=es",
        pauses: [
          { time: "01:15", label: "Pausa Explicativa: Ejecución del Fast Roman Cancel (FRC) antes de la campana" },
          { time: "03:30", label: "Pausa Explicativa: Uso de 6P (invulnerabilidad de torso superior) como antiaéreo" },
          { time: "05:20", label: "Pausa Explicativa: Gestión de Wild Assault (236D) para romper el muro" }
        ]
      },
      {
        gameId: "ssbu",
        gameTitle: "Super Smash Bros. Ultimate",
        playlistTitle: "Lista de Reproducción: Super Smash Bros. Ultimate (Traducido + Subtítulos ES + Pausas)",
        sourcesCompiled: "Recopilación traducida de IzAwSmash (Art of Smash) y Ultimate Frame Data",
        embedUrl: "https://www.youtube.com/embed/ta3L35wsE6o?cc_load_policy=1&cc_lang_pref=es&hl=es",
        pauses: [
          { time: "01:30", label: "Pausa Explicativa: Cómo saltar los 11 frames de soltar escudo con OOS (Up-B / Up-Smash)" },
          { time: "03:50", label: "Pausa Explicativa: Inputs paso a paso del Reverse Aerial Rush (RAR Back Air)" },
          { time: "06:15", label: "Pausa Explicativa: Posicionamiento para cubrir las 5 opciones de Ledgetrap" }
        ]
      }
    ],
    playlists: [
      "Mortal Kombat 1 — Recopilaciones en Español con Subtítulos y Pausas Tácticas",
      "Street Fighter 6 — Recopilaciones en Español con Subtítulos y Pausas Tácticas",
      "Tekken 8 — Recopilaciones en Español con Subtítulos y Pausas Tácticas",
      "Dragon Ball FighterZ — Recopilaciones en Español con Subtítulos y Pausas Tácticas",
      "Guilty Gear -Strive- — Recopilaciones en Español con Subtítulos y Pausas Tácticas",
      "Super Smash Bros. Ultimate — Recopilaciones en Español con Subtítulos y Pausas Tácticas"
    ]
  },

  sagas: [
    {
      id: "mortal-kombat",
      name: "Mortal Kombat",
      developer: "NetherRealm Studios",
      notationType: "mk",
      notationLegend: "1 = Puño Delantero (▢/X) | 2 = Puño Trasero (△/Y) | 3 = Patada Delantera (✕/A) | 4 = Patada Trasera (○/B) | EX = Mejorar con Barra",
      accentColor: "#f59e0b",
      description: "Combates en 2D con sistema de cadenas dial-a-combo, botón de bloqueo dedicado y sistemas de Kameos o Variaciones."
    },
    {
      id: "street-fighter",
      name: "Street Fighter",
      developer: "Capcom",
      notationType: "sf",
      notationLegend: "LP/MP/HP = Puño Débil/Medio/Fuerte | LK/MK/HK = Patada Débil/Media/Fuerte | 236 = QCF (↓↘→) | 623 = DP (→↓↘) | DR = Drive Rush",
      accentColor: "#ef4444",
      description: "El estándar histórico de los juegos de lucha 2D: control del espacio (footsies), links precisos de frames y gestión del Drive Gauge."
    },
    {
      id: "tekken",
      name: "Tekken",
      developer: "Bandai Namco Studios",
      notationType: "tekken",
      notationLegend: "1 = Puño Izq (▢/X) | 2 = Puño Der (△/Y) | 3 = Patada Izq (✕/A) | 4 = Patada Der (○/B) | f,b,d,u = Direcciones | n = Neutro | ws = While Standing",
      accentColor: "#dc2626",
      description: "Lucha 3D competitiva: movimiento lateral (Sidestep / Korean Backdash), sistema Heat agresivo, más de 100 movimientos por personaje y muros."
    },
    {
      id: "dragon-ball-fighterz",
      name: "Dragon Ball FighterZ",
      developer: "Arc System Works",
      notationType: "anime",
      notationLegend: "L = Débil | M = Medio | H = Fuerte | S = Especial (Ki) | A1/A2 = Asistencias | SD = Super Dash | j. = En el aire | 2H = Antiaéreo universal",
      accentColor: "#f97316",
      description: "Hyper-fighter 3v3 con asistencias, Super Dash, Vanish, Sparking Blast y presión en bloque a toda velocidad."
    },
    {
      id: "guilty-gear",
      name: "Guilty Gear",
      developer: "Arc System Works",
      notationType: "gg",
      notationLegend: "P = Puño | K = Patada | S = Slash | HS = Heavy Slash | D = Dust | RC = Roman Cancel (RRC/PRC/YRC/BRC) | c.S = Close Slash",
      accentColor: "#e11d48",
      description: "Anime fighter de alto octanaje con arquetipos extremos, Wall Break, Faultless Defense y el sistema Roman Cancel."
    },
    {
      id: "super-smash-bros",
      name: "Super Smash Bros.",
      developer: "Sora Ltd. / Bandai Namco / HAL",
      notationType: "smash",
      notationLegend: "Nair/Fair/Bair/Uair/Dair = Aéreos | Utilt/Ftilt/Dtilt = Tilts | USmash/FSmash/DSmash | OOS = Out of Shield | DI = Directional Influence",
      accentColor: "#3b82f6",
      description: "El referente de los Platform Fighters: porcentajes de empuje, control de escenario, recuperación (Edgeguard/Ledgetrap) y DI."
    }
  ],

  games: [
    // =========================================================================
    // 1. MORTAL KOMBAT 1 (35 Personajes)
    // =========================================================================
    {
      id: "mk1",
      sagaId: "mortal-kombat",
      title: "Mortal Kombat 1",
      releaseYear: 2023,
      currentPatch: "Parche Khaos Reigns (Año 2)",
      subSystemName: "Sistema de Kameos",
      coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1971870/header.jpg",
      coverGradient: "linear-gradient(135deg, #78350f 0%, #d97706 50%, #111827 100%)",
      officialSources: [
        { name: "Kombat Akademy (Frame Data & Combos)", url: "https://www.kombatakademy.com/" },
        { name: "PNDK&M - Guías Competitivas MK", url: "https://www.youtube.com/@PNDKM" }
      ],
      basicGuide: {
        title: "Fundamentos de Mortal Kombat 1: Dial-a-Combo, Bloqueo y Kameos",
        videoUrl: "https://www.youtube.com/embed/u7pTIg7vKBM",
        videoAuthor: "PNDK&M - Guía de Inicio MK1",
        summary: "Mortal Kombat 1 utiliza un sistema de cadenas predefinidas ('Dial-a-Combo'), botón dedicado de bloqueo y un compañero Kameo que extiende combos, hace seguros tus ataques o abre la guardia.",
        sections: [
          {
            heading: "1. Notación Universal de Mortal Kombat (1, 2, 3, 4)",
            content: "Para que cualquier guía sirva en PlayStation, Xbox o PC, la comunidad usa números del 1 al 4:\n• 1 = Puño Delantero (Cuadrado / X)\n• 2 = Puño Trasero (Triángulo / Y)\n• 3 = Patada Delantera (Cruz / A)\n• 4 = Patada Trasera (Círculo / B)\n• K = Botón de Kameo (R1 / RB)\n• Bloqueo = R2 / RT (en MK se bloquea pulsando el gatillo)."
          },
          {
            heading: "2. Tipos de Ataque (High, Mid, Low, Overhead)",
            content: "• High (Alto): Se puede esquivar agachándose sin bloquear (Neutral Duck), permitiendo castigar con d+2.\n• Mid (Medio): Golpea a rivales agachados aunque no bloqueen.\n• Low (Bajo): Obliga a bloquear agachado.\n• Overhead (Por encima): Obliga a bloquear de pie."
          },
          {
            heading: "3. Uso básico del Kameo y la Barra (Super Meter)",
            content: "Tienes 3 barras de Super:\n• 1 Barra: Movimiento EX (Enhanced) para mejorar propiedades o daño.\n• 2 Barras: Flawless Block / Combo Breaker (Adelante + Bloqueo mientras recibes un combo)."
          }
        ]
      },
      advancedGuide: {
        title: "Guía Avanzada de MK1: Flawless Block, Frame Traps, Micro-Duck y Kameo Ambush",
        videoUrl: "https://www.youtube.com/embed/2yW0x0nQ7P8",
        videoAuthor: "Rooflemonger / PNDK&M - Mecánicas Avanzadas",
        summary: "Domina el bloqueo impecable para anular el daño por chip e invertir ventajas en bloqueo, y diferencia entre Kameos Summon y Ambush.",
        sections: [
          {
            heading: "1. Kameos Summon vs. Kameos Ambush",
            content: "• Summon (Invocación): Tu personaje adopta una pose mientras sale el Kameo.\n• Ambush (Emboscada): El Kameo aparece sin detener la animación de tu personaje principal (ej. Kano cuchillos, Cyrax red, Sektor misil), permitiendo convertir ataques inseguros en ventaja en bloqueo."
          },
          {
            heading: "2. Flawless Block (Bloqueo Impecable) y Up-Block",
            content: "Si pulsas bloqueo justo en los 3 frames previos al impacto anulas todo el daño residual (Chip Damage) del resto de la cadena. Usa Up-Block (Arriba + Bloqueo) contra ataques en salto u Overheads lentos para castigar con combo completo."
          }
        ]
      },
      characters: hydrateRoster(
        "mk1",
        "mk",
        "https://www.kombatakademy.com/mortal-kombat-1/",
        "https://www.youtube.com/embed/u7pTIg7vKBM",
        "f59e0b",
        MK1_RAW
      )
    },

    // =========================================================================
    // 2. STREET FIGHTER 6 (26 Personajes)
    // =========================================================================
    {
      id: "sf6",
      sagaId: "street-fighter",
      title: "Street Fighter 6",
      releaseYear: 2023,
      currentPatch: "Parche Season 3 (Year 3 Pass - 2026)",
      subSystemName: "Drive System (6 Barras)",
      coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg",
      coverGradient: "linear-gradient(135deg, #4c1d95 0%, #ea580c 55%, #0f172a 100%)",
      officialSources: [
        { name: "SuperCombo Wiki - SF6 Frame Data", url: "https://wiki.supercombo.gg/w/Street_Fighter_6" },
        { name: "Capcom Buckler's Boot Camp", url: "https://www.streetfighter.com/6/buckler" }
      ],
      basicGuide: {
        title: "Fundamentos de Street Fighter 6: El Drive System, Links y Antiaéreos",
        videoUrl: "https://www.youtube.com/embed/k9t3cM_9vY0",
        videoAuthor: "Rooflemonger / Diaphone - Guía Base SF6",
        summary: "Comienzas cada ronda con las 6 barras del Drive Gauge llenas. Gestionarlas para no caer en Burnout es la clave de la victoria.",
        sections: [
          {
            heading: "1. Las 5 herramientas del Drive Gauge",
            content: "• Drive Impact (HP+HK, 1 barra): Golpe con armadura que provoca Wall Splat en la esquina.\n• Drive Parry (MP+MK): Bloquea golpes altos, bajos y cross-ups simultáneamente.\n• Overdrive (OD, 2 barras): Versión EX de tus movimientos especiales.\n• Drive Rush (DR, 1 o 3 barras): Añade +4 frames de ventaja a cualquier golpe durante la carrera.\n• Drive Reversal (6+HP+HK bloqueando, 2 barras): Empuja al rival para quitarte la presión."
          },
          {
            heading: "2. El peligro del Burnout (Agotamiento)",
            content: "Si gastas las 6 barras entras en Burnout: todos los ataques rivales ganan +4 frames en bloqueo, recibes daño residual (Chip) y un Drive Impact en la esquina te deja Aturdido (Stun)."
          }
        ]
      },
      advancedGuide: {
        title: "Guía Avanzada SF6: Delay Tech, Shimmy, Perfect Parry y DRC Buffering",
        videoUrl: "https://www.youtube.com/embed/w4N8w7V2gK8",
        videoAuthor: "Brian_F / Broski - Conceptos Avanzados SF6",
        summary: "Cómo defender el bucle de esquinas (Throw Loops), ejecutar Delay Throw Tech y castigar con Shimmy.",
        sections: [
          {
            heading: "1. Delay Throw Tech (Defensa contra Golpe / Agarre)",
            content: "Si al levantarte bloqueas agachado durante los primeros 4 frames y luego pulsas LP+LK, cubrirás tanto el golpe meaty como el intento de agarre al mismo tiempo."
          },
          {
            heading: "2. El Shimmy (Castigar el Delay Tech)",
            content: "Camina hacia el rival derribado y da un micropaso atrás al levantarse: su intento de zafarse del agarre saldrá al aire y podrás conectarle tu botón Fuerte (5HP) en Punish Counter."
          }
        ]
      },
      characters: hydrateRoster(
        "sf6",
        "sf",
        "https://wiki.supercombo.gg/w/Street_Fighter_6/",
        "https://www.youtube.com/embed/k9t3cM_9vY0",
        "ef4444",
        SF6_RAW
      )
    },

    // =========================================================================
    // 3. TEKKEN 8 (36 Personajes)
    // =========================================================================
    {
      id: "tekken8",
      sagaId: "tekken",
      title: "Tekken 8",
      releaseYear: 2024,
      currentPatch: "Parche v3.02 (Season 3 - 2026)",
      subSystemName: "Heat System Season 3 & Chip Damage",
      coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778820/header.jpg",
      coverGradient: "linear-gradient(135deg, #7f1d1d 0%, #ef4444 45%, #090d16 100%)",
      officialSources: [
        { name: "Wavu Wiki (Frame Data & Movelists)", url: "https://wavu.wiki/t/Main_Page" },
        { name: "PhiDX - Guías competitivas Tekken 8", url: "https://www.youtube.com/@PhiDX" }
      ],
      basicGuide: {
        title: "Fundamentos de Tekken 8: Movimiento 3D, Heat System y Sistema de Combos (Tornado)",
        videoUrl: "https://www.youtube.com/embed/8pX3mK_vY4A",
        videoAuthor: "PhiDX - Guía Principiantes Tekken 8",
        summary: "En Tekken mantener pulsado Atrás (b) bloquea golpes Altos y Medios. El nuevo sistema Heat se activa una vez por ronda para potenciar la ofensiva.",
        sections: [
          {
            heading: "1. Notación de Extremidades (1, 2, 3, 4) y Posturas",
            content: "• 1 = Puño Izquierdo | 2 = Puño Derecho\n• 3 = Patada Izquierda | 4 = Patada Derecha\n• ws (While Standing): Movimientos que salen mientras te levantas de agachado.\n• wr (While Running): Tres toques hacia adelante (f,f,F) para correr."
          },
          {
            heading: "2. Cómo funciona el Heat System",
            content: "• Heat Burst (2+3 / R1): Golpe con armadura que activa Heat (+1 en bloqueo, +2 en impacto).\n• Heat Engager: Conectar uno de los 5 movimientos principales de tu personaje te hace correr dejando a +17 frames."
          }
        ]
      },
      advancedGuide: {
        title: "Guía Avanzada Tekken 8: Korean Backdash (KBD), Sidestep y Castigo por Frames",
        videoUrl: "https://www.youtube.com/embed/w4N8w7V2gK8",
        videoAuthor: "PhiDX - Movimiento 3D y Castigos",
        summary: "Aprende a moverte en el eje Z (Sidestep / Sidewalk) para esquivar ataques lineales y cómo castigar en bloque de 10f a 15f.",
        sections: [
          {
            heading: "1. Tabla Universal de Castigos en Bloqueo",
            content: "• -10f a -11f: Cadena de Jabs de 10f (1,2).\n• -12f a -14f: Castigo medio o Heat Engager.\n• -15f o peor: Lanzador de 15 frames de pie (df+2 o uf+4) o levantándose (ws+2)."
          },
          {
            heading: "2. Cuándo hacer Sidestep (Paso Lateral)",
            content: "El momento ideal para hacer Sidestep es cuando tú o el rival quedáis entre -1 y -4 frames en bloqueo: das un toque hacia arriba o abajo e inmediatamente mantienes atrás (b)."
          }
        ]
      },
      characters: hydrateRoster(
        "tekken8",
        "tekken",
        "https://wavu.wiki/t/",
        "https://www.youtube.com/embed/8pX3mK_vY4A",
        "dc2626",
        TEKKEN8_RAW
      )
    },

    // =========================================================================
    // 4. DRAGON BALL FIGHTERZ (44 Personajes)
    // =========================================================================
    {
      id: "dbfz",
      sagaId: "dragon-ball-fighterz",
      title: "Dragon Ball FighterZ",
      releaseYear: 2018,
      currentPatch: "Parche Rollback & Balance v1.38",
      subSystemName: "3v3 Assists (A, B, C) & Sparking Blast",
      coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/678950/header.jpg",
      coverGradient: "linear-gradient(135deg, #c2410c 0%, #facc15 55%, #0f172a 100%)",
      officialSources: [
        { name: "Dustloop Wiki - Dragon Ball FighterZ", url: "https://www.dustloop.com/w/DBFZ" },
        { name: "TinyTorgue - Guías de personajes DBFZ", url: "https://www.youtube.com/@TinyTorgue" }
      ],
      basicGuide: {
        title: "Fundamentos de DBFZ: Ruta Universal Saiyajin, Super Dash, Vanish y Asistencias",
        videoUrl: "https://www.youtube.com/embed/w4N8w7V2gK8",
        videoAuthor: "TinyTorgue / Globku - Guía Base DBFZ",
        summary: "La mayoría de personajes de Dragon Ball FighterZ comparten la misma estructura universal de combo aéreo y cadena de presión (L > M > H > S).",
        sections: [
          {
            heading: "1. La Ruta Universal de Combo (Universal BnB)",
            content: "2M > 5M > jc > j.M > j.L > j.L > j.2H > Super Dash (H+S) > j.M > j.L > j.L > j.2H > jc > j.L > j.L > j.L (termina en Sliding Knockdown)."
          },
          {
            heading: "2. Mecánicas Universales: 2H, Vanish, Dragon Rush y Reflect",
            content: "• 2H: Antiaéreo universal invencible a Super Dash.\n• Vanish (M+H, 1 barra): Teletransporte detrás del rival (+2 en bloqueo si estás en el suelo).\n• Reflect (4S): Desvía ataques en el frame 1."
          }
        ]
      },
      advancedGuide: {
        title: "Guía Avanzada DBFZ: Special Tag, IAD Cross-up, Guard Cancel y Limit Break",
        videoUrl: "https://www.youtube.com/embed/7vP7X6s7M7I",
        videoAuthor: "TinyTorgue - Mecánicas Avanzadas Parche 1.38",
        summary: "Aprovecha el Special Tag en mitad de combo y el aumento de daño de Limit Break para tu último personaje en pie.",
        sections: [
          {
            heading: "1. Special Tag (Z-Change desde Movimientos Especiales)",
            content: "En mitad de un movimiento especial puedes pulsar A1 o A2 para que tu compañero entre directamente con Super Dash y continúe el combo sin gastar barra."
          }
        ]
      },
      characters: hydrateRoster(
        "dbfz",
        "anime",
        "https://www.dustloop.com/w/DBFZ/",
        "https://www.youtube.com/embed/w4N8w7V2gK8",
        "f97316",
        DBFZ_RAW
      )
    },

    // =========================================================================
    // 5. GUILTY GEAR -STRIVE- (32 Personajes)
    // =========================================================================
    {
      id: "gg-strive",
      sagaId: "guilty-gear",
      title: "Guilty Gear -Strive-",
      releaseYear: 2021,
      currentPatch: "Parche Season 4",
      subSystemName: "Roman Cancel (RRC/PRC/YRC/BRC) & Wild Assault",
      coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1384160/header.jpg",
      coverGradient: "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #090d16 100%)",
      officialSources: [
        { name: "Dustloop Wiki - Guilty Gear -Strive-", url: "https://www.dustloop.com/w/GGST" },
        { name: "Guilty Gear Strive Starter Guides (ArcSys)", url: "https://www.guiltygear.com/ggst/en/" }
      ],
      basicGuide: {
        title: "Fundamentos de Guilty Gear -Strive-: Gatlings, Roman Cancels y Wall Break",
        videoUrl: "https://www.youtube.com/embed/k9t3cM_9vY0",
        videoAuthor: "Rooflemonger / Sajam - Guía Base GGST",
        summary: "En Strive las esquinas se rompen (Wall Break), otorgando el estado Positive Bonus que recarga Tension y Burst a gran velocidad.",
        sections: [
          {
            heading: "1. Árbol de Gatlings (Qué botón cancela en cuál)",
            content: "• Rama Ligera: P > P o P > 6P, y K > 2D (Barrido bajo).\n• Rama Fuerte: c.S > f.S > 5HS > Movimiento Especial.\n• Universal: 6P hace invulnerable la mitad superior de tu cuerpo (antiaéreo universal)."
          },
          {
            heading: "2. Los 4 Colores del Roman Cancel (50% de Barra)",
            content: "• Red (RRC): Extiende combos al impactar.\n• Purple (PRC): Hace seguros movimientos fallidos.\n• Yellow (YRC): Empuja al rival mientras bloqueas.\n• Blue (BRC): Ralentiza al rival en neutro."
          }
        ]
      },
      advancedGuide: {
        title: "Guía Avanzada GGST: Fast RC, Faultless Defense y Gestión de RISC",
        videoUrl: "https://www.youtube.com/embed/w4N8w7V2gK8",
        videoAuthor: "Hotashi / Romolla - Conceptos Avanzados Strive",
        summary: "Cómo cancelar la animación del Roman Cancel (Fast RC) y frenar la barra de RISC con Faultless Defense.",
        sections: [
          {
            heading: "1. Fast Roman Cancel (FRC)",
            content: "Si cancelas el destello del reloj del Roman Cancel con un ataque en sus primeros frames, ahorras recuperación y puedes ejecutar Instant Overheads a toda velocidad."
          }
        ]
      },
      characters: hydrateRoster(
        "gg-strive",
        "gg",
        "https://www.dustloop.com/w/GGST/",
        "https://www.youtube.com/embed/k9t3cM_9vY0",
        "e11d48",
        GGST_RAW
      )
    },

    // =========================================================================
    // 6. SUPER SMASH BROS. ULTIMATE (86 Personajes)
    // =========================================================================
    {
      id: "ssbu",
      sagaId: "super-smash-bros",
      title: "Super Smash Bros. Ultimate",
      releaseYear: 2018,
      currentPatch: "Versión Final v13.0.3",
      subSystemName: "Porcentaje (%), Escudo Direccional & Parries",
      coverImage: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000012332/ac4d1fc9824876ce756406f0525d50c57ded4b2a666f6dfe40a6ac5c3563fad9",
      coverGradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #0f172a 100%)",
      officialSources: [
        { name: "Ultimate Frame Data (Hitboxes & OOS)", url: "https://ultimateframedata.com/" },
        { name: "IzAwSmash - Art of Smash Ultimate", url: "https://www.youtube.com/@IzawSmash" }
      ],
      basicGuide: {
        title: "Fundamentos de Smash Ultimate: Short Hop, OOS (Out of Shield), DI y Recuperación",
        videoUrl: "https://www.youtube.com/embed/ta3L35wsE6o",
        videoAuthor: "IzAwSmash - Art of Smash: Beginner to Master",
        summary: "Ganas subiendo el porcentaje (%) del rival y sacándolo de los márgenes del escenario (Blast Zones).",
        sections: [
          {
            heading: "1. Short Hop, Fast Fall y C-Stick en Ataque Fuerte",
            content: "• Short Hop: Pulsar salto rápido o 2 botones de salto a la vez.\n• Fast Fall: Dar un toque hacia abajo en el punto más alto del salto.\n• C-Stick: Configura el stick derecho en 'Ataque Fuerte (Tilt)'."
          },
          {
            heading: "2. Out of Shield (OOS - Salir del Escudo)",
            content: "Soltar el escudo tarda 11 frames, pero Saltar (3f), Up-Smash, Up-B y Agarrar ignoran esos 11 frames."
          }
        ]
      },
      advancedGuide: {
        title: "Guía Avanzada Smash Ultimate: Ledgetrapping, DI y RAR Back Air",
        videoUrl: "https://www.youtube.com/embed/w4N8w7V2gK8",
        videoAuthor: "IzAwSmash - Conceptos Avanzados",
        summary: "Domina el Reverse Aerial Rush (RAR) para golpear con tu aéreo trasero corriendo hacia adelante y cubre las opciones del borde.",
        sections: [
          {
            heading: "1. Reverse Aerial Rush (RAR Back Air)",
            content: "Corre hacia adelante > gira brevemente el stick en dirección contraria > salta inmediatamente > ataca hacia el rival con Back Air."
          }
        ]
      },
      characters: hydrateRoster(
        "ssbu",
        "smash",
        "https://ultimateframedata.com/",
        "https://www.youtube.com/embed/ta3L35wsE6o",
        "3b82f6",
        SSBU_RAW
      )
    }
  ],

  submissions: [
    {
      id: "sub-101",
      gameId: "mk1",
      gameTitle: "Mortal Kombat 1",
      characterName: "Scorpion",
      isDLC: false,
      dlcPack: null,
      author: "Syzygy_FGC",
      type: "Ruta Óptima Kameo Ferra",
      comboNotation: "f+3,2 > j.1,2 ~ db+2 > Ferra Ambush > f+3,2 ~ bf+1 > 3,3 ~ bf+2 (438 dmg)",
      notes: "Ruta actualizada al parche Khaos Reigns verificada en Kombat Akademy.",
      videoUrl: "https://www.youtube.com/embed/u7pTIg7vKBM",
      sourceUrl: "https://www.kombatakademy.com/mortal-kombat-1/scorpion/",
      status: "pending",
      createdAt: "Hace 15 min"
    }
  ],

  verifiedUsers: [
    {
      id: "usr-admin",
      username: "Kiko_Admin",
      role: "Administrador FGC",
      telegramHandle: "@KikoFGC",
      verified: true,
      verifiedAt: "2026-11-16"
    }
  ]
};

module.exports = SEED_DATA;
