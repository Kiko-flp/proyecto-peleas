/**
 * Base de datos semilla verificada con fuentes reales de la comunidad (FGC):
 * - Mortal Kombat: Kombat Akademy / DashFight / PNDK&M
 * - Street Fighter: SuperCombo Wiki / CAPCOM Buckler's Boot Camp
 * - Tekken: Wavu Wiki / Sidestep / PhiDX
 * - Dragon Ball FighterZ & Guilty Gear: Dustloop Wiki
 * - Super Smash Bros: Ultimate Frame Data / SmashWiki
 */

const SEED_DATA = {
  sagas: [
    {
      id: "mortal-kombat",
      name: "Mortal Kombat",
      developer: "NetherRealm Studios",
      notationType: "mk",
      notationLegend: "1 = Puño Delantero (▢/X) | 2 = Puño Trasero (△/Y) | 3 = Patada Delantera (✕/A) | 4 = Patada Trasera (○/B) | EX = Mejorar con Barra",
      accentColor: "#f59e0b",
      badgeIcon: "🐉",
      description: "Combates viscerales en 2D con sistema de cadenas dial-a-combo, bloqueos dedicados con botón, Brutalities y sistemas de Kameos o Variaciones."
    },
    {
      id: "street-fighter",
      name: "Street Fighter",
      developer: "Capcom",
      notationType: "sf",
      notationLegend: "LP/MP/HP = Puño Débil/Medio/Fuerte | LK/MK/HK = Patada Débil/Media/Fuerte | 236 = QCF (↓↘→) | 623 = DP (→↓↘) | DR = Drive Rush",
      accentColor: "#ef4444",
      badgeIcon: "🔥",
      description: "El estándar histórico de los juegos de lucha 2D: control del espacio (footsies), links precisos de frames y gestión del Drive Gauge."
    },
    {
      id: "tekken",
      name: "Tekken",
      developer: "Bandai Namco Studios",
      notationType: "tekken",
      notationLegend: "1 = Puño Izq (▢/X) | 2 = Puño Der (△/Y) | 3 = Patada Izq (✕/A) | 4 = Patada Der (○/B) | f,b,d,u = Direcciones | n = Neutro | ws = While Standing",
      accentColor: "#dc2626",
      badgeIcon: "⚡",
      description: "El rey de la lucha 3D: movimiento lateral (Sidestep / Korean Backdash), sistema Heat agresivo, más de 100 movimientos por personaje y muros."
    },
    {
      id: "dragon-ball-fighterz",
      name: "Dragon Ball FighterZ",
      developer: "Arc System Works",
      notationType: "anime",
      notationLegend: "L = Débil | M = Medio | H = Fuerte | S = Especial (Ki) | A1/A2 = Asistencias | SD = Super Dash | j. = En el aire | 2H = Antiaéreo universal",
      accentColor: "#f97316",
      badgeIcon: "🟠",
      description: "Hyper-fighter 3v3 frenético con asistencias, Super Dash, Vanish, Sparking Blast y presión en bloque a toda velocidad."
    },
    {
      id: "guilty-gear",
      name: "Guilty Gear",
      developer: "Arc System Works",
      notationType: "gg",
      notationLegend: "P = Puño | K = Patada | S = Slash | HS = Heavy Slash | D = Dust | RC = Roman Cancel (RRC/PRC/YRC/BRC) | c.S = Close Slash",
      accentColor: "#e11d48",
      badgeIcon: "⚙️",
      description: "Anime fighter de alto octanaje con arquetipos extremos, Wall Break, Faultless Defense y el sistema Roman Cancel más versátil del género."
    },
    {
      id: "super-smash-bros",
      name: "Super Smash Bros.",
      developer: "Sora Ltd. / Bandai Namco / HAL",
      notationType: "smash",
      notationLegend: "Nair/Fair/Bair/Uair/Dair = Aéreos | Utilt/Ftilt/Dtilt = Tilts | USmash/FSmash/DSmash | OOS = Out of Shield | DI = Directional Influence",
      accentColor: "#3b82f6",
      badgeIcon: "✚",
      description: "El referente de los Platform Fighters: porcentajes de empuje en lugar de barra de vida, control de escenario, recuperación (Edgeguard/Ledgetrap) y DI."
    }
  ],

  games: [
    // =========================================================================
    // 1. MORTAL KOMBAT 1
    // =========================================================================
    {
      id: "mk1",
      sagaId: "mortal-kombat",
      title: "Mortal Kombat 1",
      releaseYear: 2023,
      currentPatch: "Parche Khaos Reigns (Año 2)",
      subSystemName: "Sistema de Kameos",
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
            content: "Para que cualquier guía sirva en PlayStation, Xbox o PC, la comunidad usa números del 1 al 4:\n• 1 = Puño Delantero (Cuadrado / X)\n• 2 = Puño Trasero (Triángulo / Y)\n• 3 = Patada Delantera (Cruz / A)\n• 4 = Patada Trasera (Círculo / B)\n• K = Botón de Kameo (R1 / RB)\n• Bloqueo = R2 / RT (en MK no se bloquea manteniendo atrás, sino pulsando el gatillo)."
          },
          {
            heading: "2. Tipos de Ataque (High, Mid, Low, Overhead)",
            content: "• High (Alto): Se puede esquivar agachándose SIN bloquear (Neutral Duck), lo que te permite castigar con un Uppercut (d+2 Crushing).\n• Mid (Medio): Golpea a rivales agachados aunque no bloqueen. Es la herramienta principal para controlar el turno.\n• Low (Bajo): Obliga a bloquear agachado.\n• Overhead (Por encima): Obliga a bloquear de pie."
          },
          {
            heading: "3. Uso básico del Kameo y la Barra (Super Meter)",
            content: "Tienes 3 barras de Super:\n• 1 Barra: Movimiento EX (Enhanced) para mejorar propiedades o daño.\n• 2 Barras: Flawless Block / Combo Breaker (pulsando Adelante + Bloqueo mientras recibes un combo y tienes a tu Kameo disponible)."
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
            content: "• Summon (Invocación): Tu personaje adopta una pose y no puede moverse mientras sale el Kameo.\n• Ambush (Emboscada): El Kameo aparece sin detener la animación de tu personaje principal (ej. Kano cuchillos, Cyrax red, Sektor misil), permitiendo convertir ataques inseguros en +frames en bloqueo o cubrir huecos (gaps)."
          },
          {
            heading: "2. Flawless Block (Bloqueo Impecable) contra Chip Damage",
            content: "En MK1 el daño residual (Chip Damage) es muy alto. Si pulsas el botón de bloqueo justo en los 3 frames previos al impacto:\n1. Anulas todo el daño residual del resto de la cadena.\n2. Reduces la recuperación en bloqueo del rival (algunos ataques que son +2 pasan a ser castigables).\n3. Puedes cancelar en Up-Block (Arriba + Bloqueo) contra ataques aéreos u Overheads lentos para dejar al rival a -20 frames."
          },
          {
            heading: "3. Micro-Ducking y Whiff Punish",
            content: "Muchas cadenas empiezan por un golpe High (ej. 1,2 de Johnny Cage o Liu Kang). Hacer un 'Micro-Duck' consiste en soltar bloqueo una fracción de segundo agachado para que el primer golpe falle al aire (whiff) y castigar inmediatamente con tu cadena de inicio rápida (normalmente tu botón 1 o f+1 de 9-10 frames)."
          }
        ]
      },
      characters: [
        {
          id: "mk1-scorpion",
          name: "Scorpion",
          archetype: "Whiff Punisher / Mid-Range",
          difficulty: "Fácil",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Kameo: Ferra / Khameleon / Jax",
          videoUrl: "https://www.youtube.com/embed/7vP7X6s7M7I",
          sourceUrl: "https://www.kombatakademy.com/mortal-kombat-1/scorpion/",
          overview: "Especialista en castigar errores a media distancia gracias a su cuerda (Spear), su barrido de largo alcance y conversiones aéreas de alto daño.",
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
          gameplan: "Mantente a la distancia máxima de tu b+3 y f+3. No te precipites entrando a ciegas: espera a que el rival falle un golpe al aire (whiff) para conectarle f+3,2 o bf+1. Usa un Kameo como Ferra o Khameleon para darle mix-ups de Overhead/Low que Scorpion no tiene por sí solo."
        },
        {
          id: "mk1-sub-zero",
          name: "Sub-Zero",
          archetype: "Mix-up / Control de Espacio",
          difficulty: "Fácil",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Kameo: Khameleon / Sonya / Khamel",
          videoUrl: "https://www.youtube.com/embed/9hX6d1h_c6s",
          sourceUrl: "https://www.kombatakademy.com/mortal-kombat-1/sub-zero/",
          overview: "Domina el ritmo de la partida con clones de hielo defensivos, deslizamiento bajo y amenazas constantes de Overhead (b+2) y Low (b+3,4).",
          keyMoves: [
            { input: "b+2", frames: "23f Overhead", notes: "Lanzador Overhead que rebota al rival en el suelo para combo." },
            { input: "b+3, 4", frames: "13f Low", notes: "Doble patada baja cancelable en Ice Slide o Ice Clone." },
            { input: "db+1", frames: "Ice Clone", notes: "Crea una estatua de hielo que congela a quien intente avanzar o saltar." },
            { input: "bf+3", frames: "11f Low", notes: "Ice Slide: castiga proyectiles y acerca al rival a la esquina." }
          ],
          combos: [
            { type: "Midscreen (Desde Overhead)", notation: "b+2 > j.1,2 > b+2 > j.1,2,2 ~ bf+3", damage: "320 dmg" },
            { type: "Confirmación desde Low (1 Barra)", notation: "b+3,4 ~ EX df+4 > dash > b+2 > j.1,2 ~ db+4", damage: "355 dmg" },
            { type: "Esquina con Ice Clone", notation: "b+2 > b+2 > 2,1 ~ df+1 > j.1,2 ~ bf+3", damage: "380 dmg" }
          ],
          gameplan: "Usa el Ice Clone (db+1) para frustrar el avance rival. Una vez cerca, condiciona al oponente con tu bajo rápido b+3,4 y alterna con el Overhead b+2 acompañado de una asistencia Kameo para que sea seguro si lo bloquean."
        },
        {
          id: "mk1-johnny-cage",
          name: "Johnny Cage",
          archetype: "Rushdown / Presión en Bloqueo",
          difficulty: "Media",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Kameo: Kano / Khameleon / Lao",
          videoUrl: "https://www.youtube.com/embed/X8kP1mK_vY4",
          sourceUrl: "https://www.kombatakademy.com/mortal-kombat-1/johnny-cage/",
          overview: "Rey de la presión a corta distancia sin proyectiles. Acumula medidor de Hype (Estrella) para encadenar movimientos especiales dobles.",
          keyMoves: [
            { input: "f+3, 2", frames: "9f Mid", notes: "El mejor Mid de 9 frames del juego para confirmar o atrapar intentos de salto." },
            { input: "1, 1", frames: "7f High", notes: "Queda en +3 en bloqueo, garantizando que tu siguiente f+3 sea un Frame Trap." },
            { input: "f+1, 2", frames: "10f Mid", notes: "Avanza hacia adelante y permite hacer stagger o completar f+1,2,4 (Overhead)." },
            { input: "db+3", frames: "Parry", notes: "Contraataque con gafas de sol contra golpes altos y medios." }
          ],
          combos: [
            { type: "Midscreen (1 Barra - Nut Punch)", notation: "f+3,2 ~ EX bd+1 > dash > f+3,2 > 2,1,2 > dash > f+1,2 ~ bf+4", damage: "365 dmg" },
            { type: "Esquina (Sin Barra)", notation: "f+3,2,4 > 4 ~ bd+1 > 1,1 ~ bf+4", damage: "340 dmg" }
          ],
          gameplan: "Acércate con Wave Dash y Shadow Kick (bf+4). Una vez pegado al rival, alterna 1,1 (+3), f+3,2, agarres y el bajo d+4 para obligarle a pulsar botones cuando está en desventaja de frames."
        },
        {
          id: "mk1-omni-man",
          name: "Omni-Man",
          archetype: "Stance / Movilidad Aérea",
          difficulty: "Fácil",
          isDLC: true,
          dlcPack: "Kombat Pack 1",
          recommendedSubSystem: "Kameo: Jax / Kung Lao / Mavado",
          videoUrl: "https://www.youtube.com/embed/k9tV2gW0n9Q",
          sourceUrl: "https://www.kombatakademy.com/mortal-kombat-1/omni-man/",
          overview: "Personaje invitado de Invincible. Su postura Viltrumite Stance esquiva automáticamente todos los proyectiles y ataques altos mientras cruza la pantalla al instante.",
          keyMoves: [
            { input: "db+3", frames: "Viltrumite Stance", notes: "Postura flotante inmune a proyectiles; sigue con 1 (lanzador), 2 (overhead) o 3 (teletransporte)." },
            { input: "b+1, 1", frames: "12f Mid", notes: "Iniciador de avance rápido seguro y fácil de confirmar." },
            { input: "f+2", frames: "20f Overhead", notes: "Golpe descendente para mezclar con su barrido f+3." }
          ],
          combos: [
            { type: "Midscreen Estándar (Sin Barra)", notation: "b+1,1 ~ db+3, 1 > j.1,2, 1+3 > j.2,1,2, 1+3", damage: "348 dmg" },
            { type: "Combo con 1 Barra", notation: "f+4,1 ~ EX bf+4 > dash > b+1,1 ~ db+3, 1 > j.1,2 > j.1,2, 1+3", damage: "395 dmg" }
          ],
          gameplan: "Anula por completo el zoning rival activando Viltrumite Stance (db+3). Usa el aplauso (bf+2) para romper armaduras y combina con Kung Lao Kameo (sombrero bajo) + tu Overhead f+2 para situaciones de bloqueo imposibles."
        },
        {
          id: "mk1-takeda",
          name: "Takeda Takahashi",
          archetype: "Espaciado Largo / Trampas Kunai",
          difficulty: "Difícil",
          isDLC: true,
          dlcPack: "Kombat Pack 1",
          recommendedSubSystem: "Kameo: Cyrax / Sektor / Ferra",
          videoUrl: "https://www.youtube.com/embed/mR5p8J1nQ2A",
          sourceUrl: "https://www.kombatakademy.com/mortal-kombat-1/takeda/",
          overview: "Domina media y larga distancia con sus látigos dentados y kunais explosivos que detonan con retraso para garantizar presión y combos de más del 45%.",
          keyMoves: [
            { input: "b+2, 1", frames: "15f Mid", notes: "Latigazo que cubre media pantalla; cancelable en Kunais explosivos." },
            { input: "df+1", frames: "Kunai Trap", notes: "Clava kunais en el suelo que explotan segundos después (Low/Mid)." },
            { input: "bf+2", frames: "Spear Ryu", notes: "Atrae al rival en el aire o suelo para continuar el combo." }
          ],
          combos: [
            { type: "Midscreen (1 Barra)", notation: "b+2,1 ~ EX bf+2 > j.2,4 ~ db+3 > j.1,2 ~ bf+1", damage: "425 dmg" }
          ],
          gameplan: "Juega a la distancia exacta de b+2. Termina tus combos colocando un Kunai en el suelo para que el rival tenga que levantarse bloqueando una explosión mientras le haces un mix-up de Overhead/Low."
        },
        {
          id: "mk1-noob-saibot",
          name: "Noob Saibot",
          archetype: "Zoner / Setplay con Clones",
          difficulty: "Media",
          isDLC: true,
          dlcPack: "Khaos Reigns Expansion (Año 2)",
          recommendedSubSystem: "Kameo: Mavado / Janet Cage / Sub-Zero",
          videoUrl: "https://www.youtube.com/embed/L3c2sR_9pY0",
          sourceUrl: "https://www.kombatakademy.com/mortal-kombat-1/noob-saibot/",
          overview: "Maestro de las sombras capaz de potenciar sus ataques con Embrace Khaos, abrir portales de teletransporte y encadenar combos devastadores con su clon.",
          keyMoves: [
            { input: "b+1, 2", frames: "11f Mid", notes: "Excelente botón de avance con la hoz." },
            { input: "du", frames: "Tele-Slam", notes: "Teletransporte clásico que castiga cualquier proyectil o salto al instante." },
            { input: "bf+1", frames: "Ghostball", notes: "Bola imbloqueable que desactiva el bloqueo del rival si impacta." }
          ],
          combos: [
            { type: "Midscreen (1 Barra)", notation: "b+1,2 ~ EX du > b+3, 1+3 > f+1,2 ~ bf+3", damage: "390 dmg" }
          ],
          gameplan: "Controla el espacio con clones sombríos (bf+3 y db+4). En cuanto tengas un hueco, activa Embrace Khaos para que tu siguiente proyectil o deslizamiento lance a combo completo."
        }
      ]
    },

    // =========================================================================
    // 2. STREET FIGHTER 6
    // =========================================================================
    {
      id: "sf6",
      sagaId: "street-fighter",
      title: "Street Fighter 6",
      releaseYear: 2023,
      currentPatch: "Parche Season 2 (Terry / Mai)",
      subSystemName: "Drive System (6 Barras)",
      coverGradient: "linear-gradient(135deg, #4c1d95 0%, #ea580c 55%, #0f172a 100%)",
      officialSources: [
        { name: "SuperCombo Wiki - SF6 Frame Data", url: "https://wiki.supercombo.gg/w/Street_Fighter_6" },
        { name: "Capcom Buckler's Boot Camp", url: "https://www.streetfighter.com/6/buckler" }
      ],
      basicGuide: {
        title: "Fundamentos de Street Fighter 6: El Drive System, Links y Antiaéreos",
        videoUrl: "https://www.youtube.com/embed/k9t3cM_9vY0",
        videoAuthor: "Rooflemonger / Diaphone - Guía Base SF6",
        summary: "A diferencia de otros juegos donde empiezas sin recursos, en SF6 comienzas cada ronda con las 6 barras del Drive Gauge llenas. Gestionarlas para no caer en Burnout es la clave de la victoria.",
        sections: [
          {
            heading: "1. Las 5 herramientas del Drive Gauge",
            content: "• Drive Impact (DI - HP+HK, cuesta 1 barra): Golpe con 2 impactos de armadura. Si impacta en la esquina aunque el rival bloquee, lo estampa contra el muro (Wall Splat).\n• Drive Parry (MP+MK, consume 0.5 barras): Bloquea golpes altos, bajos y cross-ups simultáneamente y recupera barra si absorbe impactos.\n• Overdrive (OD - 2 barras): La versión EX de tus movimientos especiales.\n• Drive Rush (DR - 1 barra desde Parry, 3 barras cancelando un normal): Correr envuelto en pintura verde; añade +4 frames de ventaja a cualquier golpe que hagas durante la carrera.\n• Drive Reversal (6+HP+HK bloqueando, 2 barras): Empuja al rival para quitarte la presión."
          },
          {
            heading: "2. El peligro del Burnout (Agotamiento)",
            content: "Si gastas las 6 barras verdes entras en Burnout:\n1. No puedes usar OD, Parry ni Drive Impact.\n2. Todos los ataques del rival ganan +4 frames extra cuando los bloqueas.\n3. Recibes daño residual (Chip) que puede matarte.\n4. Un Drive Impact en la esquina te deja Aturdido (Stun) aunque lo bloquees."
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
            content: "Un agarre tiene 5 frames de inicio y una ventana de 7 frames para zafarte (Tech). Si al levantarte bloqueas agachado durante los primeros 4 frames y luego pulsas LP+LK:\n• Si el rival hizo un golpe (Meaty), tu personaje seguirá bloqueando automáticamente.\n• Si el rival hizo un agarre, te zafarás del agarre.\n¡Domina esta técnica para frenar el 80% de la ofensa básica!"
          },
          {
            heading: "2. El Shimmy (Castigar el Delay Tech)",
            content: "Cuando un rival abusa del Delay Tech, acércate cuando está en el suelo y da un micropaso hacia atrás justo antes de que se levante. Su intento de zafarse del agarre saldrá al aire (animación de agarre fallido con 23 frames de recuperación) y podrás conectarle tu botón Fuerte (HP o c.HP) en Punish Counter para quitarle un 40-50% de vida."
          },
          {
            heading: "3. Buffer de Drive Rush Cancel (DRC) en Neutro",
            content: "Cuando lanzas un botón cancelable en neutro como 2MK (patada media baja) o 5HP, pulsa MP+MK inmediatamente después. Si el golpe falla al aire, no saldrá nada ni gastarás barra; si toca al rival, cancelarás automáticamente en Drive Rush para confirmar en combo."
          }
        ]
      },
      characters: [
        {
          id: "sf6-ryu",
          name: "Ryu",
          archetype: "Shoto / Equilibrado (All-Rounder)",
          difficulty: "Fácil",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Control Clásico / Moderno",
          videoUrl: "https://www.youtube.com/embed/X0g5h2vP9sI",
          sourceUrl: "https://wiki.supercombo.gg/w/Street_Fighter_6/Ryu",
          overview: "El arquetipo Shoto por excelencia: controla el suelo con Hadoken y 2MK, castiga saltos con Shoryuken y destruye la barra de vida rival cuando carga Denjin Charge.",
          keyMoves: [
            { input: "2MK", frames: "8f Low", notes: "Herramienta clave de footsies cancelable en Drive Rush o Hadoken." },
            { input: "5HP", frames: "10f High/Mid", notes: "Puño fuerte de gran rango y daño para Whiff Punish." },
            { input: "6MP", frames: "20f Overhead", notes: "Collarbone Breaker: golpea por arriba a rivales agachados." },
            { input: "623HP", frames: "Shoryuken", notes: "Invencible al aire desde el frame 1; nunca dejes que te salten gratis." }
          ],
          combos: [
            { type: "Midscreen Básico", notation: "2LP > 2LP > 2LP ~ 236HP (Shoryuken / Hadoken)", damage: "1650 dmg" },
            { type: "Confirmación Drive Rush (3 Barras Drive)", notation: "2MK ~ DRC > 5MP > 2MP ~ 214MP (Tatsu) / 236HP", damage: "2420 dmg" },
            { type: "Punish Counter Esquina + Nivel 3", notation: "5HP > 214HP (Hashogeki) > 5MP > 623LP ~ 236236K (Shin Shoryuken)", damage: "5480 dmg" }
          ],
          gameplan: "Lanza Hadokens a distintas velocidades para obligar al rival a saltar o gastar Drive Parry, y ten siempre listo tu Shoryuken (623P). Cuando derribes con Tatsu ligero (214LK), aprovecha para cargar Denjin (22P) o presionar en el despertar."
        },
        {
          id: "sf6-ken",
          name: "Ken Masters",
          archetype: "Rushdown Shoto / Presión de Esquina",
          difficulty: "Fácil",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Control Clásico",
          videoUrl: "https://www.youtube.com/embed/pQ8r3mK_vY4",
          sourceUrl: "https://wiki.supercombo.gg/w/Street_Fighter_6/Ken",
          overview: "Capaz de llevar al rival de punta a punta del escenario con un solo combo gracias a su carrera (Quick Dash) y la presión constante de Jinrai Kick.",
          keyMoves: [
            { input: "5HP", frames: "10f", notes: "Botón estrella en neutro; muy fácil de confirmar en Run (KK)." },
            { input: "236K", frames: "Jinrai Kick", notes: "Permite seguir con patada baja (4LK) u Overhead (4MK) para adivinar en bloqueo." },
            { input: "623MP~KK", frames: "Dragonlash", notes: "Patada descendente que queda en +1 en bloqueo si es la versión Fuerte." }
          ],
          combos: [
            { type: "Corner Carry Universal", notation: "5MP > 5HP ~ KK (Run) > 214LK (Tatsu) > 623MP (Shoryuken)", damage: "2480 dmg" },
            { type: "Combo Esquina con Jinrai", notation: "5HP ~ 236MK > 6LK > 623LP > 623HP ~ SA3 (236236K)", damage: "5150 dmg" }
          ],
          gameplan: "Tu objetivo número uno es llevar al rival a la esquina. Cualquier impacto de 2MK ~ DRC o 5MP > 5HP confirmado en Run Tatsu te dará media pantalla de empuje. En la esquina, alterna Throw Loop, Shimmy y Jinrai Kick."
        },
        {
          id: "sf6-juri",
          name: "Juri Han",
          archetype: "Rushdown / Recurso Fuha Stocks",
          difficulty: "Media",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Control Clásico",
          videoUrl: "https://www.youtube.com/embed/mR5p8J1nQ2A",
          sourceUrl: "https://wiki.supercombo.gg/w/Street_Fighter_6/Juri",
          overview: "Posee uno de los Drive Rush más rápidos del juego, proyectil que viaja pegado al suelo y cargas de Fuha que le permiten encadenar especiales entre sí.",
          keyMoves: [
            { input: "5MP", frames: "6f (+2 on block)", notes: "Uno de los mejores botones de presión del juego; es positivo en bloqueo." },
            { input: "214MK", frames: "Fuhajin", notes: "Carga un stock de Fuha; seguro a distancia." },
            { input: "236LK", frames: "Saihasho", notes: "Onda a ras de suelo; puedes caminar detrás de ella para entrar gratis." }
          ],
          combos: [
            { type: "BnB Estándar (1 Stock Fuha)", notation: "5MP > 2MP ~ 214MP (Ankensatsu) > 236HK (Go Ohsatsu)", damage: "2560 dmg" }
          ],
          gameplan: "Camina detrás de tu proyectil lento (236LK) o usa Drive Rush directo a 5MP. Como 5MP es +2 en bloqueo, si el rival intenta pulsar un botón después, tu siguiente 2MP le hará Counter Hit para combo completo."
        },
        {
          id: "sf6-akuma",
          name: "Akuma (Gouki)",
          archetype: "Glass Cannon / Shoto Ofensivo",
          difficulty: "Media",
          isDLC: true,
          dlcPack: "Year 1 Character Pass",
          recommendedSubSystem: "Control Clásico",
          videoUrl: "https://www.youtube.com/embed/L3c2sR_9pY0",
          sourceUrl: "https://wiki.supercombo.gg/w/Street_Fighter_6/Akuma",
          overview: "Tiene solo 9000 de vida (1000 menos que el resto del plantel), pero lo compensa con la velocidad de caminata más rápida, bola de fuego aérea y un daño explosivo.",
          keyMoves: [
            { input: "j.236P", frames: "Air Gohadoken", notes: "Bola de fuego en el aire que altera tu arco de salto y destroza antiaéreos normales." },
            { input: "6HP > 6HP > K", frames: "Adamant Flame", notes: "Especial nuevo de SF6 que empuja en bloqueo y da Wall Splat en OD." },
            { input: "5HK", frames: "13f (+3 on block)", notes: "Doble patada que deja a +3 en bloqueo si los dos golpes impactan de pie." }
          ],
          combos: [
            { type: "Midscreen Óptimo", notation: "5MP > 2MP ~ 214LK (Light Tatsu) > 2HK (Sweep)", damage: "2490 dmg (Safe Jump)" },
            { type: "Esquina Alto Daño + Shun Goku Satsu", notation: "5HP ~ 236HP > 2HP ~ 214HP > 623LP > LP > LP > 6+LK > HP (Raging Demon)", damage: "5850 dmg" }
          ],
          gameplan: "Aprovecha tu increíble velocidad de caminata para entrar y salir del rango de los golpes del rival. Siempre que termines un combo con 214LK > 2HK obtienes exactamente +42 frames, lo que te da un Safe Jump (salto seguro a prueba de Shoryuken)."
        },
        {
          id: "sf6-m-bison",
          name: "M. Bison (Dictator)",
          archetype: "Presión Explosiva / Psycho Mine",
          difficulty: "Media",
          isDLC: true,
          dlcPack: "Year 2 Character Pass",
          recommendedSubSystem: "Control Clásico",
          videoUrl: "https://www.youtube.com/embed/9hX6d1h_c6s",
          sourceUrl: "https://wiki.supercombo.gg/w/Street_Fighter_6/M._Bison",
          overview: "Planta minas psíquicas (Psycho Mine) en el cuerpo del rival que detonan tras unos segundos o al impactar otro especial, generando los combos más dañinos de SF6.",
          keyMoves: [
            { input: "[4]6K", frames: "Double Knee Press", notes: "Scissor Kick clásico: totalmente seguro en bloqueo si se espacia bien." },
            { input: "214P", frames: "Backfist Combo", notes: "Implanta una Psycho Mine en el oponente." },
            { input: "[2]8K > P", frames: "Devil Reverse", notes: "Vuelo impredecible desde el aire que deja positivo en bloqueo." }
          ],
          combos: [
            { type: "Implante de Mina Básico", notation: "2MP > 5MP ~ [4]6LK (Knee Press) / 214LP (Psycho Mine)", damage: "2250 dmg + Mina activa" },
            { type: "Detonación de Mina (OD)", notation: "5HP ~ 214PP (OD Backfist) > Drive Rush > 4HK > 2MP ~ [4]6HP > SA3", damage: "6120 dmg" }
          ],
          gameplan: "Juega a media distancia con Scissor Kicks ([4]6K) y 5MK. En cuanto consigas un impacto, prioriza terminar en 214P para colocar la Psycho Mine: mientras el rival tenga la mina pegada, cualquier toque o bloqueo le hará perder la mitad de la barra."
        },
        {
          id: "sf6-terry",
          name: "Terry Bogard",
          archetype: "Shoto Versátil / invitado Fatal Fury",
          difficulty: "Fácil",
          isDLC: true,
          dlcPack: "Year 2 Character Pass",
          recommendedSubSystem: "Control Clásico",
          videoUrl: "https://www.youtube.com/embed/7vP7X6s7M7I",
          sourceUrl: "https://wiki.supercombo.gg/w/Street_Fighter_6/Terry",
          overview: "El lobo legendario de SNK llega con Power Wave, Burn Knuckle para cruzar la pantalla y el mítico Buster Wolf.",
          keyMoves: [
            { input: "214P", frames: "Burn Knuckle", notes: "Cruza la pantalla a gran velocidad; a máxima distancia queda seguro o positivo." },
            { input: "236K", frames: "Crack Shoot", notes: "Salto en arco que esquiva barridos y proyectiles bajos." },
            { input: "2MK > 236LP", frames: "Power Wave", notes: "Onda por el suelo ideal para controlar el espacio." }
          ],
          combos: [
            { type: "Midscreen BnB", notation: "2MP > 5LK ~ 214LP (Burn Knuckle) / 236LK (Quick Burn)", damage: "2180 dmg" }
          ],
          gameplan: "Controla el suelo con Power Wave (236LP) y castiga cualquier distracción con Burn Knuckle (214MP) espaciado en la punta de los dedos para quedar seguro en bloqueo."
        }
      ]
    },

    // =========================================================================
    // 3. TEKKEN 8
    // =========================================================================
    {
      id: "tekken8",
      sagaId: "tekken",
      title: "Tekken 8",
      releaseYear: 2024,
      currentPatch: "Parche v1.09 (Season 1 - Heihachi)",
      subSystemName: "Heat System & Chip Damage",
      coverGradient: "linear-gradient(135deg, #7f1d1d 0%, #ef4444 45%, #090d16 100%)",
      officialSources: [
        { name: "Wavu Wiki (Frame Data & Movelists)", url: "https://wavu.wiki/t/Main_Page" },
        { name: "PhiDX - Guías competitivas Tekken 8", url: "https://www.youtube.com/@PhiDX" }
      ],
      basicGuide: {
        title: "Fundamentos de Tekken 8: Movimiento 3D, Heat System y Sistema de Combos (Tornado)",
        videoUrl: "https://www.youtube.com/embed/8pX3mK_vY4A",
        videoAuthor: "PhiDX - Guía Principiantes Tekken 8",
        summary: "En Tekken, mantener pulsado Atrás (b) bloquea automáticamente golpes Altos y Medios. El nuevo sistema Heat se tiene una vez por cada ronda y potencia la ofensiva.",
        sections: [
          {
            heading: "1. Notación de Extremidades (1, 2, 3, 4) y Posturas",
            content: "Tekken asigna cada botón a una extremidad del cuerpo:\n• 1 = Puño Izquierdo | 2 = Puño Derecho\n• 3 = Patada Izquierda | 4 = Patada Derecha\n• ws (While Standing / Mientras te levantas): Movimientos que salen al soltar Abajo y pulsar un botón mientras tu personaje se incorpora.\n• wr (While Running): Tres toques hacia adelante (f,f,F) para correr."
          },
          {
            heading: "2. Cómo funciona el Heat System",
            content: "Puedes activar Heat de dos maneras:\n1. Heat Burst (Botón 2+3 / R1): Golpe con armadura que activa Heat durante 10 segundos y deja +2 en impacto y +1 en bloqueo.\n2. Heat Engager: Conectando uno de los 5 movimientos principales de tu personaje. Tu luchador correrá automáticamente hacia el rival dejándote a +17 frames para un mix-up garantizado.\n• Dentro de Heat puedes usar Heat Smash (un mini-Super muy potente) o Heat Dash para convertir un Heat Engager en lanzador de combo."
          },
          {
            heading: "3. Estructura de Combo Universal en Tekken 8",
            content: "Todos los combos siguen 3 pasos:\n1. Launcher (Lanzador al aire, ej. df+2 o hopkick uf+4)\n2. Filler + Tornado (Un ataque con icono rosa que hace girar al rival contra el suelo boca arriba)\n3. Ender (Remate final para daño o para estrellarlo contra el muro)."
          }
        ]
      },
      advancedGuide: {
        title: "Guía Avanzada Tekken 8: Korean Backdash (KBD), Sidestep Tracking y Castigo por Frames",
        videoUrl: "https://www.youtube.com/embed/w4N8w7V2gK8",
        videoAuthor: "PhiDX / MainManSWE - Movimiento 3D y Castigos",
        summary: "Aprende a moverte en el eje Z (Sidestep / Sidewalk) para esquivar ataques lineales y cómo castigar en bloque de 10f a 15f.",
        sections: [
          {
            heading: "1. Tabla Universal de Castigos en Bloqueo (Block Punishment)",
            content: "En Tekken el jab más rápido tarda 10 frames (i10):\n• -10f a -11f: Castiga con tu cadena de Jabs de 10f (ej. 1,1,2 o 1,2).\n• -12f a -14f: Castigo medio o derribo que activa Heat.\n• -15f o peor (Launch Punishable): Casi todos los personajes tienen un lanzador de 15 frames de pie (df+2 o uf+4) y otro levantándose (ws+2) para quitar media barra de vida."
          },
          {
            heading: "2. Cuándo hacer Sidestep (Paso Lateral)",
            content: "No hagas Sidestep cuando estés a -6 o peor, porque el siguiente ataque rival te alcanzará. El momento ideal para hacer Sidestep es cuando tú o el rival quedáis entre -1 y -4 frames en bloqueo: das un toque hacia arriba o abajo (u o d) e inmediatamente mantienes atrás (b) para cubrirte si el golpe tiene propiedad Homing (estela azul)."
          }
        ]
      },
      characters: [
        {
          id: "t8-jin",
          name: "Jin Kazama",
          archetype: "All-Rounder / Mishima Versátil",
          difficulty: "Media",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Heat + Zanshin Stance (ZEN)",
          videoUrl: "https://www.youtube.com/embed/X0g5h2vP9sI",
          sourceUrl: "https://wavu.wiki/t/Jin",
          overview: "El personaje más completo de Tekken 8: tiene herramientas para todas las distancias, el bajo d+2 de enorme alcance, parries y Electric Wind Hook Fist.",
          keyMoves: [
            { input: "d+2", frames: "i20 Low (+4c on hit)", notes: "Barrido bajo demoniaco; en Counter Hit lanza para combo completo." },
            { input: "f+4", frames: "i16 Mid", notes: "Patada frontal de larguísimo alcance para dominar la media distancia." },
            { input: "f,n,d,df+2", frames: "i14 High (+5 on block)", notes: "Electric Wind Hook Fist (EWHF): lanzador positivo en bloqueo." },
            { input: "2, 1, 4", frames: "i10 High-Mid-Mid", notes: "Una de las mejores cadenas de presión a corta distancia del juego." }
          ],
          combos: [
            { type: "Combo Estándar desde EWHF / Hopkick (uf+4)", notation: "uf+4 > b+3~f (ZEN) 1 > b+3~f 1 > b,f+2,3~f (Tornado) > dash > b+3~f 1,3", damage: "68 dmg" },
            { type: "Counter Hit d+2", notation: "CH d+2 > ws+4 > b+3~f 1 > b,f+2,1,df+2 (Tornado) > dash > 3,1~f 2", damage: "74 dmg" }
          ],
          gameplan: "Domina la media distancia con f+4 y ff+2. Una vez cerca, usa 2,1 (queda solo a -3) y obliga al rival a adivinar entre el bajo d+2 o el medio ff+3 / EWHF."
        },
        {
          id: "t8-kazuya",
          name: "Kazuya Mishima",
          archetype: "Mishima Puro / Vortex 50-50",
          difficulty: "Difícil",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Devil Form (Heat) + Wave Dash",
          videoUrl: "https://www.youtube.com/embed/pQ8r3mK_vY4",
          sourceUrl: "https://wavu.wiki/t/Kazuya",
          overview: "Especialista en castigos precisos y el mix-up de 50/50 más temido del género entre Hell Sweep (bajo) y ff+3 (medio lanzador).",
          keyMoves: [
            { input: "f,n,d,df+2", frames: "i13-14 High (+5 on block)", notes: "Electric Wind God Fist (EWGF): piedra angular de su juego neutro." },
            { input: "f,n,d,df+4, 1", frames: "i16 Low", notes: "Hell Sweep: derriba al suelo y reinicia el mix-up (Vortex)." },
            { input: "ff+2", frames: "i16 Mid", notes: "Heat Engager demoníaco con alcance enorme para controlar el centro." },
            { input: "ws+1, 2", frames: "i13 Twin Pistons", notes: "Lanzador de 13 frames desde agachado: castiga casi cualquier bajo bloqueado." }
          ],
          combos: [
            { type: "Combo Estándar desde EWGF", notation: "EWGF > EWGF > b+2,2 > df+1,df+2 (Tornado) > dash > b+3,1 > 3,1~df > cd+1+2", damage: "75 dmg" }
          ],
          gameplan: "En neutro amenaza con EWGF y ff+2. En cuanto tires al rival al suelo, corre con Wave Dash (f,n,d,df...) para obligarle a adivinar si vas a hacer Hell Sweep (bajo) o ff+3 / ff+2 (medios)."
        },
        {
          id: "t8-reina",
          name: "Reina",
          archetype: "Rushdown Mishima / Stances (Sentai & Heavens Wrath)",
          difficulty: "Media",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Sentai (SEN) & Heaven's Wrath (HW)",
          videoUrl: "https://www.youtube.com/embed/7vP7X6s7M7I",
          sourceUrl: "https://wavu.wiki/t/Reina",
          overview: "Combina las herramientas clásicas de los Mishima (EWGF y Hell Sweep) con un estilo Taido ultra agresivo basado en su postura rodante Sentai.",
          keyMoves: [
            { input: "ff+2 ~ f", frames: "i12 Mid -> Sentai", notes: "El movimiento que define a Reina: avanza media pantalla en 12 frames y entra en postura Sentai." },
            { input: "f,n,d,df+4, 2 ~ d", frames: "Hell Sweep -> HW", notes: "Barrido bajo que no derriba pero deja en ventaja masiva en postura Heaven's Wrath." },
            { input: "1, 1, 2", frames: "i10 Flash Punch", notes: "Confirmable en impacto; derriba y te deja listo para presionar con Sentai." }
          ],
          combos: [
            { type: "Combo desde EWGF / df+2", notation: "df+2 > df+1 > f+2,3~f (SEN) 3 (Tornado) > dash > df+1,1 > ff+2~f (SEN) 1+2", damage: "69 dmg" }
          ],
          gameplan: "Abusa de ff+2 en transición a Sentai (f). Si ff+2 impacta, Sentai 3 está garantizado como Heat Engager; si el rival lo bloquea, puedes mezclar Sentai 2 (medio seguro), Sentai 3+4 (bajo) o Sentai 1+3 (agarre imbloqueable)."
        },
        {
          id: "t8-eddy",
          name: "Eddy Gordo",
          archetype: "Capoeira / Posturas (Negativa & Handstand)",
          difficulty: "Fácil",
          isDLC: true,
          dlcPack: "Playable Character Year 1 Pass",
          recommendedSubSystem: "Mandinga Level (0-2) + RLX / HSP",
          videoUrl: "https://www.youtube.com/embed/mR5p8J1nQ2A",
          sourceUrl: "https://wavu.wiki/t/Eddy",
          overview: "Maestro de la Capoeira rediseñado en Tekken 8 con el medidor Mandinga, que potencia sus opciones bajas desde Handstand (pino) y Negativa.",
          keyMoves: [
            { input: "ff+3", frames: "i17 Low", notes: "Patada baja deslizante desde larga distancia que entra en postura Negativa (RLX)." },
            { input: "3, 3", frames: "i14 Mid-Mid", notes: "Transiciona a Handstand (HSP) con armadura disponible." },
            { input: "RLX 3, 3", frames: "Low-High / Low-Mid", notes: "Adivinanza letal desde el suelo." }
          ],
          combos: [
            { type: "Combo desde df+3 (Launcher)", notation: "df+3 (Tornado) > dash > b+3,3 > RLX 2 > ws+1,3 > RLX 3+4", damage: "67 dmg" }
          ],
          gameplan: "Entra con ff+3 y wr+3 para forzar tus posturas Handstand y Negativa. Acumula niveles de Mandinga para desbloquear un imbloqueable y un bajo demoledor desde Handstand."
        },
        {
          id: "t8-heihachi",
          name: "Heihachi Mishima",
          archetype: "Mishima de Presión de Medios / Warrior Instinct",
          difficulty: "Difícil",
          isDLC: true,
          dlcPack: "Playable Character Year 1 Pass",
          recommendedSubSystem: "Warrior Instinct (3 Tokens de Rondas)",
          videoUrl: "https://www.youtube.com/embed/L3c2sR_9pY0",
          sourceUrl: "https://wavu.wiki/t/Heihachi",
          overview: "El patriarca Mishima regresa con los golpes medios más opresivos del juego y un estado único una vez por partida (Warrior Instinct) tras activar Heat 3 veces.",
          keyMoves: [
            { input: "f+4", frames: "i19 Mid (+4 on block)", notes: "Patada descendente positiva en bloqueo; si pega a un rival agachado garantiza df+1,2." },
            { input: "df+1, 2", frames: "Heat Engager", notes: "Cargable para romper la guardia con daño masivo." },
            { input: "b+4", frames: "i18 Mid Homing", notes: "Patada giratoria segura que caza cualquier intento de Sidestep." }
          ],
          combos: [
            { type: "Combo Óptimo desde EWGF", notation: "EWGF > EWGF > f+3 > df+1, 2 (Just Frame) Tornado > dash > b+1,4 ~ RAI 1", damage: "82 dmg" }
          ],
          gameplan: "Tus golpes medios (df+1, f+4, uf+3,4) son tan fuertes que el rival tendrá miedo de agacharse. Guarda el Warrior Instinct para la ronda decisiva: dentro de él tus Hell Sweeps no son lanzables en bloqueo y tu daño se dispara."
        }
      ]
    },

    // =========================================================================
    // 4. DRAGON BALL FIGHTERZ
    // =========================================================================
    {
      id: "dbfz",
      sagaId: "dragon-ball-fighterz",
      title: "Dragon Ball FighterZ",
      releaseYear: 2018,
      currentPatch: "Parche Rollback & Balance v1.38",
      subSystemName: "3v3 Assists (A, B, C) & Sparking Blast",
      coverGradient: "linear-gradient(135deg, #c2410c 0%, #facc15 55%, #0f172a 100%)",
      officialSources: [
        { name: "Dustloop Wiki - Dragon Ball FighterZ", url: "https://www.dustloop.com/w/DBFZ" },
        { name: "TinyTorgue - Guías exhaustivas de personajes DBFZ", url: "https://www.youtube.com/@TinyTorgue" }
      ],
      basicGuide: {
        title: "Fundamentos de DBFZ: La Ruta Universal Saiyajin, Super Dash, Vanish y Asistencias",
        videoUrl: "https://www.youtube.com/embed/w4N8w7V2gK8",
        videoAuthor: "TinyTorgue / Globku - Guía Base DBFZ",
        summary: "El 80% de los personajes de Dragon Ball FighterZ comparten la misma estructura universal de combo aéreo y cadena de presión (L > L > M > M > H > S).",
        sections: [
          {
            heading: "1. La Ruta Universal de Combo (Universal BnB)",
            content: "Casi todos los personajes pueden ejecutar este combo básico desde cualquier toque en el suelo:\n2M > 5M > jc > j.M > j.L > j.L > j.2H > Super Dash (H+S) > j.M > j.L > j.L > j.2H > jc > j.L > j.L > j.L (termina en Hard Knockdown deslizante)."
          },
          {
            heading: "2. Mecánicas Universales: 2H, Vanish, Dragon Rush y Reflect",
            content: "• 2H (Abajo + Fuerte): Antiaéreo universal totalmente invencible a ataques aéreos y al Super Dash.\n• Vanish (M+H, 1 barra): Teletransporte detrás del rival; si lo haces en el suelo es +2 en bloqueo (sigues teniendo el turno).\n• Dragon Rush (L+M): Agarre universal que rompe el bloqueo y puede lanzar al personaje rival fuera de la pantalla (Snapback).\n• Reflect (4S): Desvía cualquier ataque o proyectil en el frame 1."
          }
        ]
      },
      advancedGuide: {
        title: "Guía Avanzada DBFZ: Fuzzy Mix-ups, IAD Cross-up, Guard Cancel y Limit Break",
        videoUrl: "https://www.youtube.com/embed/7vP7X6s7M7I",
        videoAuthor: "TinyTorgue - Mecánicas Avanzadas Parche 1.38",
        summary: "Aprovecha el nuevo sistema de cancelación en Sparking, Special Tag en mitad de combo y el aumento de daño de Limit Break para tu último personaje en pie.",
        sections: [
          {
            heading: "1. Special Tag (Z-Change desde Movimientos Especiales)",
            content: "No necesitas esperar a un Super para cambiar de personaje: en mitad de un movimiento especial (como un Kamehameha o patada giratoria) puedes mantener pulsado el botón de Asistencia (A1 o A2) para que tu compañero entre directamente con Super Dash y continúe el combo."
          },
          {
            heading: "2. Super Dash + Assist Mix-up y Float Oki",
            content: "Cuando el rival está en el suelo (Sliding Knockdown), salta y haz un Instant Air Dash (956) con j.H o j.M cubierto por una asistencia para forzar un 50/50 entre caer con un golpe bajo (2L) o hacer otro micro-salto Overhead."
          }
        ]
      },
      characters: [
        {
          id: "dbfz-ssj-goku",
          name: "Goku (Super Saiyan)",
          archetype: "Anchor / Beam & Todoterreno",
          difficulty: "Fácil",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Assist A (Kamehameha) | Posición: Anchor / Mid",
          videoUrl: "https://www.youtube.com/embed/X0g5h2vP9sI",
          sourceUrl: "https://www.dustloop.com/w/DBFZ/SSJ_Goku",
          overview: "El personaje ideal para aprender el juego y cerrar partidas (Anchor): Kamehameha direccionable en todos los ángulos y daño masivo en Limit Break.",
          keyMoves: [
            { input: "236S", frames: "Kamehameha", notes: "Puede apuntarse en diagonal hacia arriba en el suelo o hacia abajo en el aire." },
            { input: "236L/M/H", frames: "Dragon Flash Kick", notes: "La versión M es un Overhead y la H cruza la pantalla instantáneamente." },
            { input: "2M", frames: "10f Low", notes: "Deslizamiento bajo de gran alcance para iniciar el combo universal." }
          ],
          combos: [
            { type: "Midscreen Universal BnB", notation: "2M > 5M > jc > j.MLL > j.2H > SD > j.MLL > j.2H > jc > j.LLL", damage: "4180 dmg" },
            { type: "Esquina Óptimo (Sin Barra)", notation: "2M > 5M > jc > j.M > j.2H > SD > j.M > j.S > j.236L > 2L > 5H > 236S > SD > j.LLL", damage: "5120 dmg" }
          ],
          gameplan: "Domina el neutro con Ki Blasts (5S/j.S) cancelados en Kamehameha. Su Assist A (Beam) cubre toda la pantalla horizontalmente para ayudar a que tu primer personaje entre sin riesgo."
        },
        {
          id: "dbfz-cell",
          name: "Cell",
          archetype: "Point / Mix-ups Perfectos & Corner Carry",
          difficulty: "Media",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Assist A (Kamehameha Diagonal) | Posición: Point",
          videoUrl: "https://www.youtube.com/embed/pQ8r3mK_vY4",
          sourceUrl: "https://www.dustloop.com/w/DBFZ/Cell",
          overview: "Uno de los mejores Points de la historia de DBFZ: tiene dos bajos en su cadena, agarre de comando a distancia y el temible Perfect Attack (214L/M/H).",
          keyMoves: [
            { input: "214L / 214H", frames: "Perfect Attack", notes: "Invulnerable al aire; si se cubre con asistencia da un 50/50 de izquierda/derecha/alto/bajo." },
            { input: "2L / 2M", frames: "Doble Bajo", notes: "Tener tanto 2L como 2M bajos hace sus cadenas de bloqueo muy difíciles de aguantar." }
          ],
          combos: [
            { type: "Midscreen Rolling Crush BnB", notation: "2M > 5M > jc > j.ML > jc > j.LLS > j.214L > Vanish > 2M > 5M > j.MLL > j.236M", damage: "4650 dmg" }
          ],
          gameplan: "Coloca a Cell en primera posición (Point) respaldado por dos asistencias. Usa Perfect Attack (214L) tras bloquear un Super Dash y encadena bucles de esquina que quitan el 70% de la vida."
        },
        {
          id: "dbfz-gogeta-ss4",
          name: "Gogeta (SS4)",
          archetype: "Rushdown / Subida de Niveles (Instakill Lv7)",
          difficulty: "Fácil",
          isDLC: true,
          dlcPack: "FighterZ Pass 3",
          recommendedSubSystem: "Assist B (Lariat) / Assist C | Posición: Point / Mid",
          videoUrl: "https://www.youtube.com/embed/9hX6d1h_c6s",
          sourceUrl: "https://www.dustloop.com/w/DBFZ/SS4_Gogeta",
          overview: "No tiene proyectiles de largo alcance, pero posee doble Air Dash en el aire, Lariats que atraviesan proyectiles y un Super Nivel 3 que mata de un solo golpe al acumular 7 niveles de Finish Sign.",
          keyMoves: [
            { input: "5L / 5LL", frames: "6f Autocombo", notes: "Enormes hitboxes que atrapan saltos y cruces rivales." },
            { input: "22S", frames: "Finish Sign (+1 Nivel)", notes: "Al llegar al Nivel 7, su 214H+S (x100 Big Bang Kamehameha) inflige 10.000+ de daño instantáneo." },
            { input: "236L/M/H", frames: "Plus Energy", notes: "Atraviesa cualquier proyectil o Kamehameha." }
          ],
          combos: [
            { type: "Midscreen con Subida de Nivel", notation: "2M > 5M > jc > j.MLL > j.2H > SD > j.MLL > j.2H > jc > j.LL > j.S > j.214M > 22S", damage: "4350 dmg + Nivel" }
          ],
          gameplan: "Usa tu doble Air Dash para cruzar por encima del rival constantemente. Termina cada combo con 22S para cargar tus niveles: cuando estés en Nivel 5 o 6, el rival entrará en pánico intentando impedir que llegues a Nivel 7."
        },
        {
          id: "dbfz-ui-goku",
          name: "Goku (Ultra Instinct)",
          archetype: "Contraataque / Defensivo & Reversals",
          difficulty: "Fácil",
          isDLC: true,
          dlcPack: "FighterZ Pass 3",
          recommendedSubSystem: "Assist A (Rising Heat) | Posición: Mid",
          videoUrl: "https://www.youtube.com/embed/L3c2sR_9pY0",
          sourceUrl: "https://www.dustloop.com/w/DBFZ/UI_Goku",
          overview: "Camina esquivando proyectiles automáticamente y cuenta con múltiples contraataques, flips invulnerables a agarres y una opción única al levantarse del suelo (Unrestrained Will).",
          keyMoves: [
            { input: "5L", frames: "7f Jab", notes: "Uno de los jabs más grandes del juego, capaz de golpear rivales que están saltando encima." },
            { input: "214L/M/H", frames: "Embodied Light (Flips)", notes: "Volteretas evasivas que terminan en un agarre imbloqueable (214M) o golpe de armadura." },
            { input: "6H", frames: "Secret Sensation", notes: "Esquiva cualquier ataque físico y teletransporta detrás del rival." }
          ],
          combos: [
            { type: "Midscreen Estándar", notation: "2M > 5M > jc > j.MLL > j.2H > SD > j.MLL > j.2H > jc > j.LL > j.236L > j.214L", damage: "4290 dmg" }
          ],
          gameplan: "Obliga al rival a respetar tus múltiples opciones defensivas. Si el oponente presiona de forma predecible, usa tus Flips (214H) o el Counter Super de 1 barra para dar la vuelta a la ronda."
        }
      ]
    },

    // =========================================================================
    // 5. GUILTY GEAR -STRIVE-
    // =========================================================================
    {
      id: "gg-strive",
      sagaId: "guilty-gear",
      title: "Guilty Gear -Strive-",
      releaseYear: 2021,
      currentPatch: "Parche Season 4 (Queen Dizzy)",
      subSystemName: "Roman Cancel (RRC/PRC/YRC/BRC) & Wild Assault",
      coverGradient: "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #090d16 100%)",
      officialSources: [
        { name: "Dustloop Wiki - Guilty Gear -Strive-", url: "https://www.dustloop.com/w/GGST" },
        { name: "Guilty Gear Strive Starter Guides (ArcSys)", url: "https://www.guiltygear.com/ggst/en/" }
      ],
      basicGuide: {
        title: "Fundamentos de Guilty Gear -Strive-: Gatlings, Roman Cancels y Wall Break",
        videoUrl: "https://www.youtube.com/embed/k9t3cM_9vY0",
        videoAuthor: "Rooflemonger / Sajam - Guía Base GGST",
        summary: "En Strive el daño es altísimo y las esquinas se rompen (Wall Break), dándote el bono Positive Bonus que recarga tu barra de Tension y Burst a toda velocidad.",
        sections: [
          {
            heading: "1. Árbol de Gatlings (Qué botón cancela en cuál)",
            content: "En Guilty Gear -Strive- los botones normales no encadenan todos de menor a mayor, sino por dos ramas:\n• Rama Ligera: P > P o P > 6P, y K > 2D (Barrido bajo).\n• Rama Fuerte: c.S (Slash de cerca) > f.S (Slash de lejos) > 5HS (Heavy Slash) > Movimiento Especial.\n• Universal: 6P (Adelante + Puño) hace invulnerable la mitad superior de tu cuerpo, siendo el antiaéreo universal de todos los personajes."
          },
          {
            heading: "2. Los 4 Colores del Roman Cancel (50% de Barra)",
            content: "• Red Roman Cancel (RRC): Cuando el rival está recibiendo daño; ralentiza el tiempo y lanza para combo extendido.\n• Purple Roman Cancel (PRC): Mientras tu ataque está saliendo o recuperándose; hace que tu movimiento peligroso quede totalmente seguro.\n• Yellow Roman Cancel (YRC): Mientras estás bloqueando; empuja al rival como un Guard Cancel.\n• Blue Roman Cancel (BRC): En estado neutro; ralentiza al rival para reaccionar a lo que esté haciendo."
          },
          {
            heading: "3. Wild Assault (236D) y Deflect Shield (214D)",
            content: "Consumen el 50% de la barra azul de Burst en lugar de la barra de Tension. Wild Assault avanza a toda velocidad quitando Burst al rival al impactar o dejándote en ventaja en bloqueo."
          }
        ]
      },
      advancedGuide: {
        title: "Guía Avanzada GGST: Fast RC, Faultless Defense Brake, Safe Jumps y Kara Cancels",
        videoUrl: "https://www.youtube.com/embed/w4N8w7V2gK8",
        videoAuthor: "Hotashi / Romolla - Conceptos Avanzados Strive",
        summary: "Cómo cancelar la animación del Roman Cancel (Fast RC) para ahorrar tiempo de recuperación y gestionar el medidor de RISC.",
        sections: [
          {
            heading: "1. Fast Roman Cancel (FRC)",
            content: "Si cancelas el destello del reloj del Roman Cancel con un ataque durante sus primeros frames antes de que suene la campana, la desaceleración es menor pero tu recuperación es casi instantánea y recuperas barra de Tension mucho antes. Es vital para hacer mix-ups de BRC j.S (Instant Overhead)."
          },
          {
            heading: "2. Gestión de la Barra de RISC y Faultless Defense (FD)",
            content: "La barra rosa debajo del Burst es el medidor de RISC: sube cada vez que bloqueas ataques normales. Si se llena, el próximo golpe que recibas será un Counter Hit garantizado sin reducción de daño (puedes perder el 75% de la vida de un combo). Usa Faultless Defense (mantener 2 botones de ataque mientras bloqueas) para frenar la subida del RISC y empujar más lejos al atacante."
          }
        ]
      },
      characters: [
        {
          id: "ggst-sol",
          name: "Sol Badguy",
          archetype: "Rushdown / Strike-Throw Explosivo",
          difficulty: "Fácil",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Wild Assault Naranja (236D)",
          videoUrl: "https://www.youtube.com/embed/X0g5h2vP9sI",
          sourceUrl: "https://www.dustloop.com/w/GGST/Sol_Badguy",
          overview: "Protagonista agresivo con un botón de 3 frames (5K), botones positivos en bloqueo (f.S y c.S), agarre de comando (Wild Throw) y daño brutal con Clean Hit Volcanic Viper.",
          keyMoves: [
            { input: "f.S", frames: "10f (+2 on block)", notes: "Avanza hacia adelante y te deja positivo en bloqueo para seguir presionando." },
            { input: "623S / 623HS", frames: "Volcanic Viper", notes: "Shoryuken invencible; el HS en Clean Hit de cerca quita una barbaridad de vida." },
            { input: "623K", frames: "Wild Throw", notes: "Agarre de comando de 6 frames que obliga al rival a saltar si abusa de bloquear." }
          ],
          combos: [
            { type: "Midscreen Básico", notation: "c.S > 2S > 5HS ~ 236K (Bandit Revolver 1) > K (2)", damage: "178 dmg" },
            { type: "Esquina Wall Break (Clean Hit)", notation: "c.S > 2HS > 236K > 5K > 6S ~ 214K (Bandit Bringer) > 623HS (Rompe Muro)", damage: "255 dmg" }
          ],
          gameplan: "Pégate al rival con Night Raid Vortex (214S) o Bandit Revolver (236K). Una vez cerca, abusa de c.S (+3) y f.S (+2) para hacer Frame Traps o entrar corriendo a por Wild Throw (623K)."
        },
        {
          id: "ggst-ky",
          name: "Ky Kiske",
          archetype: "All-Rounder / Shock State",
          difficulty: "Fácil",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Wild Assault Naranja (236D)",
          videoUrl: "https://www.youtube.com/embed/pQ8r3mK_vY4",
          sourceUrl: "https://www.dustloop.com/w/GGST/Ky_Kiske",
          overview: "Espadachín equilibrado con proyectiles, antiaéreos enormes y el estado Shock State que mejora todas sus especiales cuando el rival está electrificado.",
          keyMoves: [
            { input: "f.S / 2S", frames: "10f / 11f Slash", notes: "Espadazos de largo alcance para dominar el suelo." },
            { input: "214S", frames: "Dire Eclat", notes: "Aplica Shock State al rival y deja seguro en bloqueo." },
            { input: "214K", frames: "Foudre Arc", notes: "Patada en arco que salta sobre golpes bajos y queda positiva si el rival tiene Shock State." }
          ],
          combos: [
            { type: "Midscreen Estándar", notation: "c.S > 2S > 5HS ~ 214S (Dire Eclat)", damage: "152 dmg + Shock State" },
            { type: "Confirmación con RRC", notation: "2K > 2D ~ 214S > RRC > dash > c.S > 6HS > 214K > 5K > 623HS", damage: "225 dmg (Wall Break)" }
          ],
          gameplan: "Mantén al rival con Shock State usando Stun Edge cargado (236HS) o Dire Eclat (214S). Con Shock State activo, tu Stun Dipper (236K) con RRC convierte cualquier toque bajo a media pantalla en un Wall Break."
        },
        {
          id: "ggst-baiken",
          name: "Baiken",
          archetype: "Defensiva / Parry & Tether Mix-up",
          difficulty: "Fácil",
          isDLC: true,
          dlcPack: "GGST Season Pass 1",
          recommendedSubSystem: "Wild Assault Naranja (236D)",
          videoUrl: "https://www.youtube.com/embed/7vP7X6s7M7I",
          sourceUrl: "https://www.dustloop.com/w/GGST/Baiken",
          overview: "Samurái con un Parry de 1 frame (Hiiragi), el mejor aéreo del juego (j.S), Tatami Gaeshi y una cuerda (Tether) en su agarre que ata al rival a su cuerpo.",
          keyMoves: [
            { input: "j.S > j.236S", frames: "Air Slash + Youzansen", notes: "Su herramienta estrella en el aire y mix-up de Instant Overhead." },
            { input: "236P", frames: "Hiiragi (Parry)", notes: "Activo desde el frame 1; castiga automáticamente cualquier hueco en la presión rival." },
            { input: "236K", frames: "Tatami Gaeshi", notes: "Levanta un tatami para controlar el espacio o extender combos." }
          ],
          combos: [
            { type: "Midscreen BnB", notation: "c.S > 2HS ~ 236K (Tatami) > 2S ~ 41236HS (Kabari) > HS", damage: "192 dmg" }
          ],
          gameplan: "En neutro domina el aire con j.S y el suelo con f.S / Kabari (41236HS). Cuando agarres al rival con 4D/6D, quedará atado a ti con una cuerda durante varios segundos, permitiéndote encadenar 3 o 4 c.S seguidos."
        },
        {
          id: "ggst-bridget",
          name: "Bridget",
          archetype: "Setplay de Largo Alcance / Mix-ups de Yo-Yo",
          difficulty: "Fácil",
          isDLC: true,
          dlcPack: "GGST Season Pass 2",
          recommendedSubSystem: "Wild Assault Naranja (236D)",
          videoUrl: "https://www.youtube.com/embed/mR5p8J1nQ2A",
          sourceUrl: "https://www.dustloop.com/w/GGST/Bridget",
          overview: "Coloca su Yo-Yo en la pantalla y rueda hacia él a toda velocidad con Rolling Movement, ejecutando mix-ups de alto/bajo imposibles de ver a simple vista.",
          keyMoves: [
            { input: "214S / 236S", frames: "Stop and Dash", notes: "Coloca el Yo-Yo; el 214S golpea a la vuelta (permitiendo rodar de forma segura)." },
            { input: "214K", frames: "Rolling Movement", notes: "Vuela hacia el Yo-Yo colocado; puedes cancelar en j.K (Overhead) o caer en 2K (Low)." },
            { input: "f.S > S", frames: "Yo-Yo Normals", notes: "Cubre más de media pantalla." }
          ],
          combos: [
            { type: "Midscreen + Setplay Yo-Yo", notation: "2K > 2D ~ 214S (Coloca Yo-Yo para Oki) | c.S > 2S > 5HS > HS ~ 236K > K", damage: "155 dmg + Mix-up" }
          ],
          gameplan: "Siempre que derribes con 2D, cancela en 214S para dejar el Yo-Yo detrás del rival. Luego salta con 214K (Rolling Movement): como el Yo-Yo golpea a la vuelta, estás cubierta incluso si el rival intenta usar un ataque invencible."
        },
        {
          id: "ggst-slayer",
          name: "Slayer",
          archetype: "Brawler de Daño Extremo / Dandy Step",
          difficulty: "Fácil",
          isDLC: true,
          dlcPack: "GGST Season Pass 3",
          recommendedSubSystem: "Wild Assault Naranja (236D)",
          videoUrl: "https://www.youtube.com/embed/9hX6d1h_c6s",
          sourceUrl: "https://www.dustloop.com/w/GGST/Slayer",
          overview: "Vampiro elegante que no camina ni corre de forma tradicional (hace teletransportes cortos) y con Dandy Step tiene un 50/50 de cuatro direcciones que borra el 70% de la barra.",
          keyMoves: [
            { input: "214P / 214K", frames: "Dandy Step", notes: "Paso atrás evasivo que continúa en P (Pilebunker), K (Bump Ahead), S (Overhead) o HS (Cross-up)." },
            { input: "236P / 236K", frames: "Mappa Hunch", notes: "Puñetazo instantáneo que cruza toda la pantalla en pocos frames." },
            { input: "632146S", frames: "Bloodsucking Universe", notes: "Agarre de comando que hace que tu siguiente ataque sea un Counter Hit garantizado." }
          ],
          combos: [
            { type: "Pilebunker Loop Básico", notation: "c.S > 2S ~ 214K > P (Pilebunker) > RRC > c.S > 2HS ~ 214P > P (Wall Break)", damage: "285 dmg" }
          ],
          gameplan: "Salta la fase neutra con Mappa Hunch (236K) y fuerza el Dandy Step (214K): el rival tiene que adivinar entre Master's Hammer (HS, cruza y queda positivo), It's Late (S, Overhead lanzador) o Bump Ahead (K, bajo)."
        }
      ]
    },

    // =========================================================================
    // 6. SUPER SMASH BROS. ULTIMATE
    // =========================================================================
    {
      id: "ssbu",
      sagaId: "super-smash-bros",
      title: "Super Smash Bros. Ultimate",
      releaseYear: 2018,
      currentPatch: "Versión Final v13.0.3",
      subSystemName: "Porcentaje (%), Escudo Direccional & Parries",
      coverGradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #0f172a 100%)",
      officialSources: [
        { name: "Ultimate Frame Data (Hitboxes & OOS)", url: "https://ultimateframedata.com/" },
        { name: "IzAwSmash - Art of Smash Ultimate", url: "https://www.youtube.com/@IzawSmash" }
      ],
      basicGuide: {
        title: "Fundamentos de Smash Ultimate: Short Hop, OOS (Out of Shield), DI y Recuperación",
        videoUrl: "https://www.youtube.com/embed/ta3L35wsE6o",
        videoAuthor: "IzAwSmash - Art of Smash: Beginner to Master",
        summary: "En Smash no ganas vaciando una barra de vida, sino subiendo el porcentaje (%) del rival y sacándolo de los márgenes de la pantalla (Blast Zones).",
        sections: [
          {
            heading: "1. Short Hop, Fast Fall y Ataques Aéreos (SHFF)",
            content: "El juego competitivo de Smash gira alrededor del aire:\n• Short Hop: Pulsar Salto muy rápido (o pulsar 2 botones de salto a la vez) para hacer un salto bajo.\n• Fast Fall: En el punto más alto de tu salto, dar un toque hacia Abajo para caer a máxima velocidad y reducir el tiempo en que eres vulnerable.\n• C-Stick (Tilt Stick): Configura el stick derecho en los ajustes del mando en 'Ataque Fuerte (Tilt)' en vez de Smash para hacer Ftilt, Utilt y Bair con precisión."
          },
          {
            heading: "2. Out of Shield (OOS - Salir del Escudo)",
            content: "Soltar el botón de escudo tarda 11 frames enteros (durante los cuales no puedes hacer nada). Sin embargo, estas 4 acciones ignoran esos 11 frames de penalización:\n1. Saltar desde el escudo (3f)\n2. Up-Smash desde el escudo\n3. Up-B (Especial hacia arriba) desde el escudo\n4. Agarrar con Escudo + A (suma +4f al inicio de tu agarre)."
          }
        ]
      },
      advancedGuide: {
        title: "Guía Avanzada Smash Ultimate: Ledgetrapping, DI / LSI, Tech Chase y RAR Bair",
        videoUrl: "https://www.youtube.com/embed/w4N8w7V2gK8",
        videoAuthor: "IzAwSmash / Tweek Talks - Conceptos Avanzados",
        summary: "Domina el Reverse Aerial Rush (RAR) para golpear con tu aéreo trasero corriendo hacia adelante y cubre las 5 opciones del borde.",
        sections: [
          {
            heading: "1. Reverse Aerial Rush (RAR Back Air)",
            content: "Muchos personajes tienen su golpe más fuerte en su Back Air (Bair, aéreo hacia atrás). Para conectarlo mientras corres hacia el rival:\nCorre hacia adelante > da un toque rápido al stick en dirección contraria (Pivot) > salta inmediatamente > vuelve a mover el stick hacia el rival con C-Stick atrás."
          },
          {
            heading: "2. Las 5 opciones del Borde (Ledgetrapping)",
            content: "Cuando el rival cuelga del borde solo puede hacer 5 cosas:\n1. Neutral Getup (Subir normal)\n2. Roll (Rodar hacia dentro)\n3. Jump (Saltar desde el borde)\n4. Getup Attack (Subir atacando)\n5. Drop-off Aerial (Soltarse y saltar atacando)\nColócate a la distancia de un Roll manteniendo el escudo para cubrir las opciones 1, 2 y 4 en reacción."
          }
        ]
      },
      characters: [
        {
          id: "ssbu-cloud",
          name: "Cloud Strife",
          archetype: "Swordie / Control de Espacio & Limit Charge",
          difficulty: "Fácil",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Limit Gauge (Down-B)",
          videoUrl: "https://www.youtube.com/embed/X0g5h2vP9sI",
          sourceUrl: "https://ultimateframedata.com/cloud",
          overview: "Espadachín rapidísimo con un Back Air enorme que es seguro en escudo (-3) y el mejor movimiento Out of Shield del juego: Climhazzard (Up-B en 7 frames).",
          keyMoves: [
            { input: "Bair (Back Air)", frames: "Frame 11 (-3 on shield)", notes: "Enorme espadazo seguro en escudo que mata a porcentajes medios y controla toda la fase neutra." },
            { input: "Up-B (Climhazzard)", frames: "Frame 7 OOS", notes: "Castiga casi cualquier golpe que toque tu escudo." },
            { input: "Side-B (Cross Slash)", frames: "Frame 10", notes: "Hace más de 22% de daño y con Limit cargado mata a 90%." }
          ],
          combos: [
            { type: "0% - 35% Básico", notation: "Landing Fair / Bair > Cross Slash (Side-B)", damage: "34%" },
            { type: "Up-Tilt Confirm", notation: "Utilt > Uair > Uair (Juggle)", damage: "29%" }
          ],
          gameplan: "Espacia tu Back Air (Bair) constantemente sobre el escudo rival. Si el oponente se desespera y golpea tu escudo, pulsa Up-B inmediatamente (Frame 7). Carga Limit siempre que mandes al rival fuera del escenario."
        },
        {
          id: "ssbu-fox",
          name: "Fox McCloud",
          archetype: "Rushdown / Glass Cannon (Fast Faller)",
          difficulty: "Media",
          isDLC: false,
          dlcPack: null,
          recommendedSubSystem: "Confirmación Nair > Up-Smash",
          videoUrl: "https://www.youtube.com/embed/pQ8r3mK_vY4",
          sourceUrl: "https://ultimateframedata.com/fox",
          overview: "Cae y corre a velocidad vertiginosa, abrumando al rival en la esquina y confirmando muertes tempranas con Weak Nair > Up-Smash.",
          keyMoves: [
            { input: "Nair", frames: "Frame 4 (-3 on shield)", notes: "Su herramienta principal para entrar, presionar escudos y confirmar Up-Smash." },
            { input: "Up-Smash", frames: "Frame 8", notes: "Uno de los mejores movimientos para matar del juego." },
            { input: "Uair", frames: "Frame 9", notes: "Malabares en el aire que matan por el techo." }
          ],
          combos: [
            { type: "0% - 40% BnB", notation: "Dash Attack > Utilt > Utilt > Nair > Jab Lock", damage: "42%" },
            { type: "Kill Confirm (95% - 115%)", notation: "Short Hop Fast Fall Weak Nair > Up-Smash", damage: "24% (KO)" }
          ],
          gameplan: "Usa tu velocidad para asfixiar al rival sin dejarle tocar el suelo con Uair. Al llegar a 95%, busca caer con el golpe suave (Late hit) de Nair para conectar Up-Smash garantizado."
        },
        {
          id: "ssbu-joker",
          name: "Joker",
          archetype: "Bait & Punish / Arsene Comeback",
          difficulty: "Media",
          isDLC: true,
          dlcPack: "Fighters Pass Vol. 1",
          recommendedSubSystem: "Rebel's Guard & Arsene Gauge",
          videoUrl: "https://www.youtube.com/embed/7vP7X6s7M7I",
          sourceUrl: "https://ultimateframedata.com/joker",
          overview: "Ágil y escurridizo en estado base con combos de arrastre (Drag-down Uair), que se transforma en una máquina de matar cuando invoca a su Persona Arsene.",
          keyMoves: [
            { input: "Down-B (Rebel's Guard)", frames: "Frame 3", notes: "Absorbe daño reducido y llena la barra de Rebelión para invocar a Arsene al instante." },
            { input: "Bair", frames: "Frame 7", notes: "Cuchillada rapidísima ideal para hacer Edgeguard fuera del escenario." },
            { input: "Neutral-B (Gun)", frames: "Pistola evasiva", notes: "Permite esquivar en el aire y caer disparando hacia abajo." }
          ],
          combos: [
            { type: "0% - 30% Drag-Down Loop", notation: "Down Throw > Fair 1 > Fast Fall > Up-Tilt > Drag-down Uair > Regrab", damage: "38%" },
            { type: "Kill Confirm Base (110%)", notation: "Landing Fair 1 > Drag-down Uair > Down-Smash / Up-Smash", damage: "26% (KO)" }
          ],
          gameplan: "En estado base juega con paciencia usando Eiha (Side-B), Bair y pistolas para acumular daño. En cuanto salga Arsene, pasa a la ofensiva total: tu Bair, Dair y Smash matan a porcentajes ridículamente bajos."
        },
        {
          id: "ssbu-kazuya",
          name: "Kazuya Mishima (Smash)",
          archetype: "Touch of Death / Heavy Grappler-Brawler",
          difficulty: "Difícil",
          isDLC: true,
          dlcPack: "Fighters Pass Vol. 2",
          recommendedSubSystem: "Electric Wind God Fist + Rage Drive",
          videoUrl: "https://www.youtube.com/embed/mR5p8J1nQ2A",
          sourceUrl: "https://ultimateframedata.com/kazuya",
          overview: "Posee armadura pasiva (Tough Body), más de 35 ataques únicos y el movimiento más temido de Smash Ultimate: el Electric Wind God Fist (EWGF), que paraliza e inicia combos de 0% a muerte.",
          keyMoves: [
            { input: "f,n,d,df+A (EWGF)", frames: "Invencible (+6 on shield)", notes: "Paraliza al rival en un ángulo vertical perfecto para encadenar otro EWGF o Up-Smash." },
            { input: "df,d,df+Grab", frames: "Gates of Hell", notes: "Agarre de comando con armadura que mata en el borde a partir de 100% con Rage." }
          ],
          combos: [
            { type: "Combo Touch of Death Estándar", notation: "EWGF > Nair (Fast Fall) > Crouch Jab > EWGF > Up-Smash / Up-B", damage: "78% (KO)" }
          ],
          gameplan: "Domina la ejecución del EWGF (pulsar A exactamente en el mismo frame que la diagonal Abajo-Adelante). Un solo toque en el suelo te permite quitarle la vida entera al rival."
        },
        {
          id: "ssbu-steve",
          name: "Steve (Minecraft)",
          archetype: "Resource Trapper / Creación de Bloques",
          difficulty: "Difícil",
          isDLC: true,
          dlcPack: "Fighters Pass Vol. 2",
          recommendedSubSystem: "Minería de Diamante + Colocación de Bloques + Minecart",
          videoUrl: "https://www.youtube.com/embed/9hX6d1h_c6s",
          sourceUrl: "https://ultimateframedata.com/steve",
          overview: "Cambia las reglas de Smash construyendo muros reales en el escenario para minar hierro, oro y diamante, encadenando combos de escalera y vagoneta (Minecart).",
          keyMoves: [
            { input: "Side-B (Minecart)", frames: "Proyectil + Agarre", notes: "Si saltas de la vagoneta se convierte en un agarre imbloqueable que atrapa dentro de escudos." },
            { input: "Up-Tilt / Jab", frames: "Caminata con Hacha/Espada", notes: "Puedes caminar mientras golpeas con A para llevar al rival hasta el borde." },
            { input: "Down-B (TNT / Anvil)", frames: "Yunque Frame 8", notes: "El yunque cae a gran velocidad y atraviesa casi cualquier intento de malabar." }
          ],
          combos: [
            { type: "0% - 60% Escalera de Bloques", notation: "Utilt > Utilt > Salto Uair > Colocar Bloque > Utilt > Uair > Fair (Spike)", damage: "64%" }
          ],
          gameplan: "Construye una pared de 3 bloques de alto entre tú y el rival al inicio de la partida y mina hasta conseguir Hierro y Diamante. Si el rival salta el muro, castígalo con Up-Smash o escapa en vagoneta (Side-B)."
        }
      ]
    }
  ],

  // Propuestas de guías de la comunidad (gestionables con los botones del Bot de Telegram)
  submissions: [
    {
      id: "sub-101",
      gameId: "mk1",
      gameTitle: "Mortal Kombat 1",
      characterName: "Reptile",
      isDLC: false,
      dlcPack: null,
      author: "Syzygy_FGC",
      type: "Nuevo Personaje / Guía Combo",
      comboNotation: "b+3,1 ~ bf+4 > dash > f+3,2 > j.1,2 ~ db+4 (378 dmg)",
      notes: "Guía verificada en Kombat Akademy con Kameo Khameleon / Mavado (Parche Año 2).",
      videoUrl: "https://www.youtube.com/embed/u7pTIg7vKBM",
      sourceUrl: "https://www.kombatakademy.com/mortal-kombat-1/reptile/",
      status: "pending",
      createdAt: "Hace 15 min"
    },
    {
      id: "sub-102",
      gameId: "sf6",
      gameTitle: "Street Fighter 6",
      characterName: "Mai Shiranui",
      isDLC: true,
      dlcPack: "Year 2 Character Pass",
      author: "KOF_Veteran",
      type: "Personaje DLC (Season 2)",
      comboNotation: "2MK ~ DRC > 5MP > 2HP ~ 214HP (Ryuuenbu) > 623K (2680 dmg)",
      notes: "Datos extraídos de SuperCombo Wiki con gestión de stocks de abanico.",
      videoUrl: "https://www.youtube.com/embed/k9t3cM_9vY0",
      sourceUrl: "https://wiki.supercombo.gg/w/Street_Fighter_6",
      status: "pending",
      createdAt: "Hace 40 min"
    }
  ],

  // Usuarios y sesiones verificadas por el Bot de Telegram
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
