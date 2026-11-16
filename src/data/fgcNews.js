/**
 * Módulo de Noticias Globales de Juegos de Lucha y Competitivo (FGC & Esports)
 * - Incluye noticias de todo el género de lucha (Street Fighter, Tekken, Mortal Kombat,
 *   Guilty Gear, Dragon Ball FighterZ, Super Smash Bros., Fatal Fury: City of the Wolves,
 *   2XKO, The King of Fighters, Granblue Fantasy Versus: Rising, Under Night In-Birth).
 * - Cada noticia cuenta con fecha ISO exacta (YYYY-MM-DD) para el buscador y filtro por fechas.
 * - Se sincroniza además en vivo con la API oficial de noticias de Steam y el feed RSS de EventHubs.
 */

/**
 * Calendario de Eventos y Torneos Oficiales de Juegos de Lucha (Con Fecha de Inicio y Fecha de Fin)
 */
const FGC_EVENTS = [
  {
    id: "evt-cc13-tokyo-qualifier",
    title: "Capcom Pro Tour — World Warrior Regional Finals",
    saga: "Street Fighter 6",
    location: "Online / Global Regional",
    startDate: "2026-11-14",
    endDate: "2026-11-29",
    startLabel: "14 de Noviembre de 2026",
    endLabel: "29 de Noviembre de 2026",
    status: "En Curso",
    games: "Street Fighter 6",
    sourceUrl: "https://sf.esports.capcom.com/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg",
    summary: "Finales regionales clasificatorias de todo el mundo que otorgan las últimas plazas directas para la Capcom Cup 13 en Tokio."
  },
  {
    id: "evt-final-kombat",
    title: "Final Kombat — Campeonato Mundial de Mortal Kombat 1",
    saga: "Mortal Kombat 1",
    location: "Presencial Internacional",
    startDate: "2026-12-11",
    endDate: "2026-12-13",
    startLabel: "11 de Diciembre de 2026",
    endLabel: "13 de Diciembre de 2026",
    status: "Próximo Evento",
    games: "Mortal Kombat 1 (Khaos Reigns)",
    sourceUrl: "https://www.mortalkombat.com/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1971870/header.jpg",
    summary: "Gran final mundial del circuito Pro Kompetition de NetherRealm Studios con los 20 mejores jugadores clasificados y el Last Chance Qualifier."
  },
  {
    id: "evt-twt-finals-singapore",
    title: "Tekken World Tour Global Finals & EVO Singapore",
    saga: "Tekken 8 / Multi-Juego",
    location: "Singapur (Singapore Expo)",
    startDate: "2027-01-14",
    endDate: "2027-01-17",
    startLabel: "14 de Enero de 2027",
    endLabel: "17 de Enero de 2027",
    status: "Próximo Evento",
    games: "Tekken 8, Street Fighter 6, Guilty Gear -Strive-",
    sourceUrl: "https://tekkenworldtour.com/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778820/header.jpg",
    summary: "Las Finales Globales del Tekken World Tour reúnen a los mejores jugadores del ranking mundial y del Last Chance Qualifier (LCQ) durante cuatro días en Singapur."
  },
  {
    id: "evt-frosty-faustings",
    title: "Frosty Faustings XIX — Major Internacional de Invierno",
    saga: "Multi-Juego FGC",
    location: "Lombard, Illinois (EE. UU.)",
    startDate: "2027-01-28",
    endDate: "2027-01-31",
    startLabel: "28 de Enero de 2027",
    endLabel: "31 de Enero de 2027",
    status: "Próximo Evento",
    games: "Guilty Gear -Strive-, Street Fighter 6, Tekken 8, DBFZ, MK1, Granblue Rising",
    sourceUrl: "https://frostyfaustings.com/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1384160/header.jpg",
    summary: "Uno de los mayores Majors de invierno de la FGC con más de 25 torneos oficiales de juegos de lucha 2D, 3D y Anime Fighters."
  },
  {
    id: "evt-genesis-smash",
    title: "GENESIS — Supermajor Mundial de Super Smash Bros.",
    saga: "Super Smash Bros. & Rivals",
    location: "San José, California (EE. UU.)",
    startDate: "2027-02-12",
    endDate: "2027-02-14",
    startLabel: "12 de Febrero de 2027",
    endLabel: "14 de Febrero de 2027",
    status: "Próximo Evento",
    games: "Super Smash Bros. Ultimate, Super Smash Bros. Melee",
    sourceUrl: "https://www.start.gg/",
    imageUrl: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000012332/ac4d1fc9824876ce756406f0525d50c57ded4b2a666f6dfe40a6ac5c3563fad9",
    summary: "El torneo histórico más prestigioso de la comunidad de Super Smash Bros., con cuadros individuales, dobles y exhibiciones internacionales."
  },
  {
    id: "evt-awt-finals-ny",
    title: "Arc World Tour Finals — Gran Final Mundial Arc System Works",
    saga: "Guilty Gear -Strive-",
    location: "Nueva York (Terminal 5, EE. UU.)",
    startDate: "2027-03-05",
    endDate: "2027-03-07",
    startLabel: "05 de Marzo de 2027",
    endLabel: "07 de Marzo de 2027",
    status: "Próximo Evento",
    games: "Guilty Gear -Strive-, Granblue Fantasy Versus: Rising, Under Night In-Birth II",
    sourceUrl: "https://www.arcsystemworks.jp/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1384160/header.jpg",
    summary: "Tres días de competición en Nueva York con clasificatorio presencial de última oportunidad (LCQ) y las finales mundiales del circuito Arc World Tour."
  },
  {
    id: "evt-capcom-cup-13",
    title: "Capcom Cup 13 & Street Fighter League World Championship",
    saga: "Street Fighter 6",
    location: "Tokio, Japón (Estadio Ryogoku Kokugikan)",
    startDate: "2027-03-10",
    endDate: "2027-03-14",
    startLabel: "10 de Marzo de 2027",
    endLabel: "14 de Marzo de 2027",
    status: "Próximo Evento",
    games: "Street Fighter 6",
    sourceUrl: "https://sf.esports.capcom.com/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg",
    summary: "Cinco días en el legendario estadio de sumo de Tokio: Fase de Grupos (10-12 Mar), Top 16 a Gran Final de Capcom Cup 13 (13 Mar) y Final Mundial SFL (14 Mar)."
  },
  {
    id: "evt-evo-japan",
    title: "EVO Japan — Evolution Championship Series Tokyo",
    saga: "Multi-Juego (EVO)",
    location: "Tokio, Japón (Tokyo Big Sight)",
    startDate: "2027-04-30",
    endDate: "2027-05-02",
    startLabel: "30 de Abril de 2027",
    endLabel: "02 de Mayo de 2027",
    status: "Próximo Evento",
    games: "Street Fighter 6, Tekken 8, Guilty Gear -Strive-, KOF XV, Fatal Fury, Granblue",
    sourceUrl: "https://www.evojapan.gg/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg",
    summary: "La gran cita asiática de EVO durante la Golden Week japonesa, con miles de competidores en los principales títulos 2D y 3D."
  },
  {
    id: "evt-combo-breaker",
    title: "COMBO BREAKER — Festival Internacional de Juegos de Lucha",
    saga: "Multi-Juego FGC",
    location: "Schaumburg, Illinois (EE. UU.)",
    startDate: "2027-05-28",
    endDate: "2027-05-30",
    startLabel: "28 de Mayo de 2027",
    endLabel: "30 de Mayo de 2027",
    status: "Próximo Evento",
    games: "Mortal Kombat 1, Street Fighter 6, Tekken 8, DBFZ, GGST, Smash, Juegos Clásicos",
    sourceUrl: "https://combobreaker.org/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1971870/header.jpg",
    summary: "Tres días ininterrumpidos dedicados al 100% a los juegos de lucha modernos y retro, parada oficial de los principales circuitos mundiales."
  }
];

const CURATED_FGC_NEWS = [
  {
    id: "news-capcom-cup-13-tickets",
    category: "Competitivo / Torneos",
    saga: "Street Fighter",
    title: "Capcom Cup 13 y SFL World Championship: Calendario oficial confirmado en el Ryogoku Kokugikan de Tokio",
    isoDate: "2026-11-15",
    date: "15 Nov 2026",
    sourceName: "Capcom Pro Tour Oficial",
    sourceUrl: "https://sf.esports.capcom.com/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg",
    summary:
      "Capcom ha abierto el registro de entradas y confirmado los horarios de los 5 días de competición en Tokio para la Capcom Cup 13 y la gran final mundial de la Street Fighter League con 1 millón de dólares en premios."
  },
  {
    id: "news-tekken8-roger-s3",
    category: "Parches y DLC",
    saga: "Tekken",
    title: "Tekken 8 Season 3: Roger Jr. se une al plantel junto con el parche de balance v3.02",
    isoDate: "2026-11-10",
    date: "10 Nov 2026",
    sourceName: "Bandai Namco Oficial",
    sourceUrl: "https://en.bandainamcoent.eu/tekken/tekken-8",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778820/header.jpg",
    summary:
      "El tercer luchador del Season 3 Pass de Tekken 8 ya está disponible en acceso anticipado, acompañado de ajustes en el sistema Heat, reducción de daño residual (Chip) en ataques medios y mejoras de seguimiento lateral."
  },
  {
    id: "news-twt-thaiger-2026",
    category: "Competitivo / Torneos",
    saga: "Tekken",
    title: "Tekken World Tour 2026: Atif Butt conquista Thaiger Uppercut tras vencer 3-2 a LowHigh",
    isoDate: "2026-10-26",
    date: "26 Oct 2026",
    sourceName: "Tekken World Tour",
    sourceUrl: "https://tekkenworldtour.com/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778820/header.jpg",
    summary:
      "El último evento Master de la temporada regular del TWT 2026 en Bangkok cerró la clasificación del ranking global antes de las Finales Mundiales y el Last Chance Qualifier (LCQ) en Singapur."
  },
  {
    id: "news-evo-france-nice",
    category: "Competitivo / Torneos",
    saga: "Multi-Juego (EVO)",
    title: "EVO Europe reúne a la comunidad internacional de lucha con récords de inscripción en SF6, Tekken 8 y GGST",
    isoDate: "2026-10-12",
    date: "12 Oct 2026",
    sourceName: "EVO.gg Oficial",
    sourceUrl: "https://www.evo.gg/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1384160/header.jpg",
    summary:
      "La cita europea de Evolution consolidó el calendario competitivo de otoño con cuadros principales de Street Fighter 6, Tekken 8, Guilty Gear -Strive-, Fatal Fury: City of the Wolves, Granblue Fantasy Versus: Rising y Street Fighter III: 3rd Strike."
  },
  {
    id: "news-awt-finals-ny",
    category: "Competitivo / Torneos",
    saga: "Guilty Gear / ArcSys",
    title: "Arc World Tour Finals: Terminal 5 en Nueva York acogerá la gran final mundial de Arc System Works",
    isoDate: "2026-09-28",
    date: "28 Sep 2026",
    sourceName: "Arc System Works",
    sourceUrl: "https://www.arcsystemworks.jp/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1384160/header.jpg",
    summary:
      "Arc System Works ha detallado el formato de tres días en Nueva York para coronar a los campeones mundiales de Guilty Gear -Strive- (Season 4), Granblue Fantasy Versus: Rising y Under Night In-Birth II Sys:Celes."
  },
  {
    id: "news-2xko-competitive",
    category: "Juegos de Lucha General",
    saga: "2XKO / Tag Fighters",
    title: "2XKO amplía su circuito de torneos comunitarios First Impact y presenta ajustes al sistema de Fuse",
    isoDate: "2026-09-14",
    date: "14 Sep 2026",
    sourceName: "EventHubs / Riot Games",
    sourceUrl: "https://www.eventhubs.com/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1384160/header.jpg",
    summary:
      "El tag fighter 2v2 continúa protagonizando eventos presenciales de la FGC con soporte oficial para torneos comunitarios y retoques en las asistencias activas y el Dynamic Save."
  },
  {
    id: "news-ssbu-supernova",
    category: "Competitivo / Torneos",
    saga: "Super Smash Bros.",
    title: "Supernova (antes Super Smash Con): Más de 2.500 jugadores compiten en el mayor Supermajor de Smash Ultimate y Melee",
    isoDate: "2026-08-17",
    date: "17 Ago 2026",
    sourceName: "Start.gg / SmashWiki",
    sourceUrl: "https://www.ssbwiki.com/",
    imageUrl: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000012332/ac4d1fc9824876ce756406f0525d50c57ded4b2a666f6dfe40a6ac5c3563fad9",
    summary:
      "El evento insignia de Platform Fighters volvió a demostrar la enorme salud competitiva de Super Smash Bros. Ultimate y Melee, con enfrentamientos históricos en el Top 8 entre especialistas de Steve, Sonic, Game & Watch, Joker y Fox."
  },
  {
    id: "news-tekken8-bob",
    category: "Parches y DLC",
    saga: "Tekken",
    title: "Bob regresa oficialmente a Tekken 8 como segundo luchador del Season 3 Character Pass",
    isoDate: "2026-08-05",
    date: "05 Ago 2026",
    sourceName: "Bandai Namco Oficial",
    sourceUrl: "https://en.bandainamcoent.eu/tekken/tekken-8",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778820/header.jpg",
    summary:
      "Con su lema 'Speed and Weight', Bob se reincorpora al plantel de Tekken 8 combinando movilidad explosiva, Wave Dash, barridos bajos y nuevas transiciones en estado Heat."
  },
  {
    id: "news-evo-vegas-2026",
    category: "Competitivo / Torneos",
    saga: "Multi-Juego (EVO)",
    title: "Resultados de EVO Las Vegas 2026: MenaRD bicampeón en SF6, Arslan Ash gana Tekken 8 y Xiaohai vence en Fatal Fury",
    isoDate: "2026-06-28",
    date: "28 Jun 2026",
    sourceName: "EVO.gg Oficial",
    sourceUrl: "https://www.evo.gg/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg",
    summary:
      "Con casi 5.800 competidores en Las Vegas, MenaRD logró su segundo EVO consecutivo en Street Fighter 6, Arslan Ash venció 3-2 a Rangchu en Tekken 8, RedDitto triunfó en Guilty Gear -Strive- y Xiaohai se llevó Fatal Fury: City of the Wolves."
  },
  {
    id: "news-cotw-snk",
    category: "Juegos de Lucha General",
    saga: "Fatal Fury / KOF (SNK)",
    title: "SNK anuncia el nuevo calendario del SNK World Championship (SWC) para Fatal Fury: City of the Wolves y KOF XV",
    isoDate: "2026-06-29",
    date: "29 Jun 2026",
    sourceName: "SNK Esports Oficial",
    sourceUrl: "https://www.snk-corp.co.jp/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg",
    summary:
      "SNK refuerza su presencia en la escena competitiva mundial con paradas clasificatorias para el SWC y actualizaciones del sistema REV en Fatal Fury: City of the Wolves."
  },
  {
    id: "news-sf6-year3-ingrid-alex",
    category: "Parches y DLC",
    saga: "Street Fighter",
    title: "Street Fighter 6 completa su Year 3 Character Pass con las llegadas de Sagat, C. Viper, Alex e Ingrid",
    isoDate: "2026-05-20",
    date: "20 May 2026",
    sourceName: "StreetFighter.com / SuperCombo",
    sourceUrl: "https://www.streetfighter.com/6",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg",
    summary:
      "El tercer año de soporte de Street Fighter 6 amplía el plantel a 30 luchadores e introduce un parche global de equilibrio centrado en el Drive Reversal, el escalado de daño tras Perfect Parry y las cajas de colisión antiaéreas."
  },
  {
    id: "news-mk1-final-kombat",
    category: "Competitivo / Torneos",
    saga: "Mortal Kombat",
    title: "Mortal Kombat 1 Pro Kompetition & Khaos Reigns: Análisis del metajuego con T-1000, Conan, Ghostface y Noob Saibot",
    isoDate: "2026-04-18",
    date: "18 Abr 2026",
    sourceName: "MortalKombat.com / Kombat Akademy",
    sourceUrl: "https://www.mortalkombat.com/",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1971870/header.jpg",
    summary:
      "El plantel completo de 35 luchadores de Mortal Kombat 1 junto a las sinergias de Kameos como Ferra, Khameleon, Mavado y Janet Cage protagonizan la temporada competitiva de NetherRealm Studios."
  },
  {
    id: "news-dbfz-patch-138",
    category: "Parches y DLC",
    saga: "Dragon Ball FighterZ",
    title: "Dragon Ball FighterZ: El Rollback Netcode y el parche de balance v1.38 impulsan los torneos internacionales",
    isoDate: "2025-11-22",
    date: "22 Nov 2025",
    sourceName: "Dustloop / Bandai Namco",
    sourceUrl: "https://www.dustloop.com/w/DBFZ",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/678950/header.jpg",
    summary:
      "Las nuevas rutas de Special Tag y cancelaciones en Sparking Blast han renovado la variedad de equipos competitivos en los principales torneos de anime fighters."
  },
  {
    id: "news-tekken8-s2-miary-armorking",
    category: "Parches y DLC",
    saga: "Tekken",
    title: "Tekken 8 Season 2: Repaso al impacto de Anna Williams, Fahkumram, Armor King y la debutante Miary Zo",
    isoDate: "2025-12-04",
    date: "04 Dic 2025",
    sourceName: "Wavu Wiki / Bandai Namco",
    sourceUrl: "https://wavu.wiki/t/Main_Page",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778820/header.jpg",
    summary:
      "El segundo pase de temporada de Tekken 8 trajo de vuelta a tres favoritos de la comunidad junto a Miary Zo, la primera luchadora original de Madagascar especializada en Moraingy y Dambe."
  }
];

let cachedLiveNews = null;
let lastNewsFetch = 0;

function formatSpanishShortDate(isoStr) {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  const day = String(d.getUTCDate()).padStart(2, "0");
  const mon = months[d.getUTCMonth()];
  const yr = d.getUTCFullYear();
  return `${day} ${mon} ${yr}`;
}

/**
 * Descarga noticias en directo de:
 * 1) EventHubs RSS (Comunidad global de juegos de lucha)
 * 2) API oficial de Steam News para SF6, Tekken 8, MK1 y Guilty Gear -Strive-
 */
async function getFgcNews() {
  if (cachedLiveNews && Date.now() - lastNewsFetch < 15 * 60 * 1000) {
    return cachedLiveNews;
  }

  const liveItems = [];

  // 1. Feed RSS de EventHubs
  try {
    const res = await fetch("https://www.eventhubs.com/feeds/news/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"
      }
    });
    if (res.ok) {
      const xml = await res.text();
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;
      let count = 0;
      while ((match = itemRegex.exec(xml)) !== null && count < 8) {
        const block = match[1];
        const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
        const linkMatch = block.match(/<link>(.*?)<\/link>/);
        const pubDateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/);
        const descMatch = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/);

        const rawTitle = ((titleMatch && (titleMatch[1] || titleMatch[2])) || "").trim();
        const rawLink = ((linkMatch && linkMatch[1]) || "").trim();
        const rawPub = ((pubDateMatch && pubDateMatch[1]) || "").trim();
        const rawDesc = ((descMatch && (descMatch[1] || descMatch[2])) || "")
          .replace(/<[^>]+>/g, "")
          .trim()
          .slice(0, 230);

        let isoDate = new Date().toISOString().slice(0, 10);
        if (rawPub) {
          const parsed = new Date(rawPub);
          if (!isNaN(parsed.getTime())) {
            isoDate = parsed.toISOString().slice(0, 10);
          }
        }

        if (rawTitle && rawLink) {
          liveItems.push({
            id: `eh-live-${count}`,
            category: "Juegos de Lucha General",
            saga: "Actualidad Internacional FGC",
            title: rawTitle,
            isoDate,
            date: formatSpanishShortDate(isoDate),
            sourceName: "EventHubs FGC",
            sourceUrl: rawLink,
            imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg",
            summary: rawDesc ? `${rawDesc}...` : "Noticia internacional de la comunidad de juegos de lucha."
          });
          count++;
        }
      }
    }
  } catch (_) {
    // Continuar si el RSS no responde
  }

  // 2. API Oficial de Steam News para SF6 (1364780), Tekken 8 (1778820), MK1 (1971870) y GGST (1384160)
  const steamApps = [
    { appId: "1364780", saga: "Street Fighter 6", img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg" },
    { appId: "1778820", saga: "Tekken 8", img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778820/header.jpg" },
    { appId: "1971870", saga: "Mortal Kombat 1", img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1971870/header.jpg" },
    { appId: "1384160", saga: "Guilty Gear -Strive-", img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1384160/header.jpg" }
  ];

  for (const appInfo of steamApps) {
    try {
      const sUrl = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${appInfo.appId}&count=2&maxlength=240&format=json`;
      const sRes = await fetch(sUrl);
      if (sRes.ok) {
        const sData = await sRes.json();
        const items = sData?.appnews?.newsitems || [];
        items.forEach((it) => {
          const d = new Date((it.date || 0) * 1000);
          const isoDate = !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : "2026-01-01";
          const cleanBody = String(it.contents || "")
            .replace(/\[.*?\]/g, "")
            .replace(/<[^>]+>/g, "")
            .trim()
            .slice(0, 220);

          if (it.title && it.url) {
            liveItems.push({
              id: `steam-${it.gid}`,
              category: "Parches y DLC",
              saga: appInfo.saga,
              title: `${appInfo.saga}: ${it.title}`,
              isoDate,
              date: formatSpanishShortDate(isoDate),
              sourceName: it.feedlabel || "Steam Official News",
              sourceUrl: it.url,
              imageUrl: appInfo.img,
              summary: cleanBody ? `${cleanBody}...` : `Comunicado oficial de ${appInfo.saga}.`
            });
          }
        });
      }
    } catch (_) {
      // Ignorar si falla un appId
    }
  }

  const combined = [...CURATED_FGC_NEWS, ...liveItems].sort((a, b) =>
    String(b.isoDate || "").localeCompare(String(a.isoDate || ""))
  );

  cachedLiveNews = combined;
  lastNewsFetch = Date.now();
  return cachedLiveNews;
}

module.exports = {
  FGC_EVENTS,
  CURATED_FGC_NEWS,
  getFgcNews
};
