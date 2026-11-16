/**
 * FGC Vault — Frontend Application Logic (v8)
 * - Sin botones de Bot de Telegram ni elementos internos en la interfaz pública.
 * - Nueva sección "Wikis, Canales y Qué Falta" para que los usuarios añadan wikis/canales de YouTube
 *   y consulten o amplíen el resumen de lo que falta y a qué corresponde para su valoración.
 * - Sección de Noticias de Juegos de Lucha y Competitivo.
 * - Retratos de personajes centrados en la cara y 3 páginas independientes por juego manteniendo el menú.
 */

const state = {
  youtubeChannel: null,
  events: [],
  news: [],
  communityResources: [],
  missingContentRoadmap: [],
  selectedNewsCategory: "all",
  newsSearchQuery: "",
  newsDateFrom: "",
  newsDateTo: "",
  newsQuickPeriod: "all",
  sagas: [],
  games: [],
  selectedSagaId: "all",
  selectedGameId: null,
  selectedSubpage: "page-basic",
  selectedCharacter: null,
  selectedDlcPackFilter: "all",
  inGameSearchQuery: "",
  notationMode: "technical",
  searchQuery: ""
};

const clientPortraitCache = new Map();
const pendingWikiSearch = new Set();

// Si la imagen descargada es de cuerpo entero (alta), aplicamos zoom automático a la cara
window.handlePortraitLoad = function (imgEl) {
  if (!imgEl) return;
  if (imgEl.naturalHeight > imgEl.naturalWidth * 1.22) {
    imgEl.classList.add("face-crop-zoom");
  } else {
    imgEl.classList.remove("face-crop-zoom");
  }
};

// Si una URL directa de CDN falla, busca inmediatamente el retrato en la Wiki desde el navegador y usa fallback
window.handlePortraitError = async function (imgEl, gameId, charId, charName, fallbackUrl) {
  if (!imgEl) return;
  const key = `${gameId}:${charId}`;
  if (!pendingWikiSearch.has(key)) {
    pendingWikiSearch.add(key);
    const found = await searchSingleCharacterPortrait(gameId, charName);
    if (found && imgEl.src !== found) {
      clientPortraitCache.set(charId, found);
      document.querySelectorAll(`img[data-charimg="${charId}"]`).forEach((el) => {
        el.src = found;
      });
      return;
    }
  }
  if (fallbackUrl && imgEl.src !== fallbackUrl && !imgEl.dataset.usedFallback) {
    imgEl.dataset.usedFallback = "1";
    imgEl.src = fallbackUrl;
  }
};

// =========================================================================
// RESOLUTOR AVANZADO DE RETRATOS EN EL NAVEGADOR (CUBRE LOS 271 PERSONAJES)
// =========================================================================
const FANDOM_WIKIS = {
  mk1: "https://mortalkombat.fandom.com/api.php",
  sf6: "https://streetfighter.fandom.com/api.php",
  tekken8: "https://tekken.fandom.com/api.php",
  dbfz: "https://dragonballfighterz.fandom.com/api.php",
  "gg-strive": "https://guiltygear.fandom.com/api.php",
  ssbu: "https://www.ssbwiki.com/api.php"
};

const CLIENT_EXACT_WIKI_TITLES = {
  // MK1
  "General Shao": "General Shao",
  "Takeda Takahashi": "Takeda Takahashi",
  "Omni-Man": "Omni-Man",
  "Peacemaker": "Peacemaker",
  "Homelander": "Homelander",
  "Ghostface": "Ghostface",
  "Conan the Barbarian": "Conan the Barbarian",
  "T-1000": "T-1000",
  // SF6
  "Ken Masters": "Ken Masters",
  "Juri Han": "Juri Han",
  "E. Honda": "E. Honda",
  "A.K.I.": "A.K.I.",
  "M. Bison": "M. Bison",
  "Dee Jay": "Dee Jay",
  "Terry Bogard": "Terry Bogard",
  "Mai Shiranui": "Mai Shiranui",
  "C. Viper": "Crimson Viper",
  "Sagat": "Sagat",
  "Alex": "Alex",
  "Ingrid": "Ingrid",
  // Tekken 8
  "Jack-8": "Jack-8",
  "Armor King": "Armor King II",
  "Kunimitsu": "Kunimitsu II",
  "Roger Jr.": "Roger Jr.",
  "Clive Rosfield": "Clive Rosfield",
  "Yujiro Hanma": "Yujiro Hanma",
  "Miary Zo": "Miary Zo",
  // DBFZ (Preserva sufijos de transformación para que cada variante tenga su foto real)
  "Goku (Super Saiyan)": "Goku (Super Saiyan)",
  "Vegeta (Super Saiyan)": "Vegeta (Super Saiyan)",
  "Goku (SSGSS / Blue)": "Goku (SSGSS)",
  "Vegeta (SSGSS / Blue)": "Vegeta (SSGSS)",
  "Gohan (Teen)": "Gohan (Teen)",
  "Gohan (Adult)": "Gohan (Adult)",
  "Android 21 (Majin)": "Android 21",
  "Android 21 (Lab Coat)": "Android 21 (Lab Coat)",
  "Broly (Z)": "Broly",
  "Broly (DBS)": "Broly (DBS)",
  "Zamasu (Fused)": "Fused Zamasu",
  "Vegito (SSGSS)": "Vegito (SSGSS)",
  "Goku (Base)": "Goku",
  "Vegeta (Base)": "Vegeta",
  "Goku (GT)": "Goku (GT)",
  "Gogeta (SSGSS)": "Gogeta (SSGSS)",
  "Goku (Ultra Instinct)": "Goku (Ultra Instinct)",
  "Gogeta (SS4)": "Gogeta (SS4)",
  // GGST
  "Jack-O'": "Jack-O' Valentine",
  "Bedman?": "Bedman?",
  "Asuka R#": "Asuka R. Kreutz",
  "A.B.A": "A.B.A",
  "Queen Dizzy": "Dizzy",
  "Unika": "Unika",
  "Lucy": "Lucyna Kushinada",
  // SSBU
  "Ryu (Smash)": "Ryu (SSBU)",
  "Ken (Smash)": "Ken (SSBU)",
  "Pyra / Mythra": "Pyra (SSBU)"
};

const CLIENT_GUEST_WIKIS = {
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

function getWikiTitleForChar(charName) {
  if (CLIENT_EXACT_WIKI_TITLES[charName]) {
    return CLIENT_EXACT_WIKI_TITLES[charName];
  }
  return charName.replace(/\s+\(.*?\)/g, "").trim();
}

async function searchSingleCharacterPortrait(gameId, charName) {
  const exactTitle = getWikiTitleForChar(charName);
  const cleanName = charName.replace(/\s+\(.*?\)/g, "").trim();
  const endpoints = [
    CLIENT_GUEST_WIKIS[charName],
    FANDOM_WIKIS[gameId],
    gameId === "dbfz" ? "https://dragonball.fandom.com/api.php" : null,
    "https://en.wikipedia.org/w/api.php"
  ].filter(Boolean);

  for (const api of endpoints) {
    try {
      // 1. Intento por título exacto con redirecciones
      const exactUrl = `${api}?action=query&titles=${encodeURIComponent(
        `${exactTitle}|${cleanName}`
      )}&prop=pageimages&piprop=thumbnail&pithumbsize=320&pilimit=10&redirects=1&format=json&origin=*`;
      const exactRes = await fetch(exactUrl);
      if (exactRes.ok) {
        const exactData = await exactRes.json();
        const exactPages = exactData?.query?.pages || {};
        for (const pid of Object.keys(exactPages)) {
          const src = exactPages[pid]?.thumbnail?.source;
          if (src) return src;
        }
      }

      // 2. Búsqueda aproximada (generator=search)
      const searchUrl = `${api}?action=query&generator=search&gsrsearch=${encodeURIComponent(
        exactTitle
      )}&gsrlimit=4&prop=pageimages&piprop=thumbnail&pithumbsize=320&pilimit=10&format=json&origin=*`;
      const res = await fetch(searchUrl);
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data?.query?.pages || {};
      for (const pid of Object.keys(pages)) {
        const src = pages[pid]?.thumbnail?.source;
        if (src) return src;
      }
    } catch (_) {
      // Continuar al siguiente endpoint
    }
  }
  return null;
}

async function hydrateBrowserPortraits(game) {
  if (!game || !FANDOM_WIKIS[game.id]) return;
  const api = FANDOM_WIKIS[game.id];

  // Hidratar proactivamente los personajes que aún no estén en caché
  const chars = game.characters.filter((c) => !clientPortraitCache.has(c.id));
  for (let i = 0; i < chars.length; i += 20) {
    const chunk = chars.slice(i, i + 20);
    const titleMap = {};
    chunk.forEach((c) => {
      const wikiTitle = getWikiTitleForChar(c.name);
      titleMap[wikiTitle.toLowerCase()] = c;
    });

    const titlesParam = chunk.map((c) => getWikiTitleForChar(c.name)).join("|");

    try {
      const url = `${api}?action=query&titles=${encodeURIComponent(
        titlesParam
      )}&prop=pageimages&piprop=thumbnail&pithumbsize=320&pilimit=50&redirects=1&format=json&origin=*`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const redirects = data?.query?.redirects || [];
      const redirectLookup = {};
      redirects.forEach((r) => {
        redirectLookup[r.to.toLowerCase()] = r.from.toLowerCase();
      });

      const resolvedInChunk = new Set();

      Object.values(pages).forEach((p) => {
        const thumb = p?.thumbnail?.source;
        if (!thumb) return;
        const pageTitle = (p.title || "").toLowerCase();
        const origTitle = redirectLookup[pageTitle] || pageTitle;
        const matchedChar =
          titleMap[origTitle] ||
          chunk.find((c) => getWikiTitleForChar(c.name).toLowerCase() === pageTitle);

        if (matchedChar) {
          resolvedInChunk.add(matchedChar.id);
          clientPortraitCache.set(matchedChar.id, thumb);
          if (matchedChar.iconUrl.startsWith("/api/")) {
            matchedChar.iconUrl = thumb;
          }
          document
            .querySelectorAll(`img[data-charimg="${matchedChar.id}"]`)
            .forEach((imgEl) => {
              if (
                imgEl.src.includes("/api/char-icon") ||
                imgEl.dataset.usedFallback === "1" ||
                game.id === "tekken8" ||
                game.id === "mk1"
              ) {
                imgEl.src = thumb;
              }
            });
        }
      });

      for (const ch of chunk) {
        if (!resolvedInChunk.has(ch.id) && !clientPortraitCache.has(ch.id)) {
          searchSingleCharacterPortrait(game.id, ch.name).then((foundUrl) => {
            if (foundUrl) {
              clientPortraitCache.set(ch.id, foundUrl);
              if (ch.iconUrl.startsWith("/api/")) {
                ch.iconUrl = foundUrl;
              }
              document
                .querySelectorAll(`img[data-charimg="${ch.id}"]`)
                .forEach((imgEl) => {
                  if (
                    imgEl.src.includes("/api/char-icon") ||
                    imgEl.dataset.usedFallback === "1" ||
                    game.id === "tekken8" ||
                    game.id === "mk1"
                  ) {
                    imgEl.src = foundUrl;
                  }
                });
            }
          });
        }
      }
    } catch (_) {
      // Mantiene CDN directo o fallback
    }
  }
}

// =========================================================================
// TRADUCTOR COMPLETO DE NOTACIÓN DE COMANDOS (TÉCNICA / PS / XBOX / SWITCH)
// =========================================================================
function translateNotation(text, sagaId, mode) {
  if (!text || mode === "technical") return text;

  let out = String(text);

  // 1. Movimientos direccionales universales (QCF, QCB, DP, Half Circle, Supers)
  out = out
    .replace(/\b236236/g, "↓↘→↓↘→")
    .replace(/\b214214/g, "↓↙←↓↙←")
    .replace(/\b632146/g, "→↘↓↙←→")
    .replace(/\b41236/g, "←↙↓↘→")
    .replace(/\b236/g, "↓↘→")
    .replace(/\b214/g, "↓↙←")
    .replace(/\b623/g, "→↓↘");

  // 2. Direcciones en juegos de letras/números (MK1 y Tekken)
  if (sagaId === "mortal-kombat" || sagaId === "tekken") {
    out = out
      .replace(/\bf,n,d,df\+/gi, "→ ★ ↓ ↘+")
      .replace(/\bf,f,F\+/g, "→→→+")
      .replace(/\bdf\+/gi, "↘+")
      .replace(/\bdb\+/gi, "↙+")
      .replace(/\buf\+/gi, "↗+")
      .replace(/\bub\+/gi, "↖+")
      .replace(/\bbf\+/gi, "←→+")
      .replace(/\bbd\+/gi, "←↓+")
      .replace(/\bff\+/gi, "→→+")
      .replace(/\bws\+/gi, "Al levantarse+")
      .replace(/\bwr\+/gi, "Corriendo+")
      .replace(/\bcd\+/gi, "Crouch Dash+")
      .replace(/\bf\+/gi, "→+")
      .replace(/\bb\+/gi, "←+")
      .replace(/\bd\+/gi, "↓+")
      .replace(/\bu\+/gi, "↑+")
      .replace(/\bj\./gi, "Salto ");

    const map =
      mode === "ps"
        ? { "1+2": "▢+△", "3+4": "✕+○", "1+3": "▢+✕", "2+3": "△+✕", "1+4": "▢+○", "1": "▢", "2": "△", "3": "✕", "4": "○", "EX": "EX (R2)" }
        : mode === "switch"
        ? { "1+2": "Y+X", "3+4": "B+A", "1+3": "Y+B", "2+3": "X+B", "1+4": "Y+A", "1": "Y", "2": "X", "3": "B", "4": "A", "EX": "EX (ZR)" }
        : { "1+2": "X+Y", "3+4": "A+B", "1+3": "X+A", "2+3": "Y+A", "1+4": "X+B", "1": "X", "2": "Y", "3": "A", "4": "B", "EX": "EX (RT)" };

    out = out
      .replace(/1\+2/g, map["1+2"])
      .replace(/3\+4/g, map["3+4"])
      .replace(/1\+3/g, map["1+3"])
      .replace(/2\+3/g, map["2+3"])
      .replace(/1\+4/g, map["1+4"])
      .replace(/\bEX\b/g, map["EX"])
      .replace(/\b1\b/g, map["1"])
      .replace(/\b2\b/g, map["2"])
      .replace(/\b3\b/g, map["3"])
      .replace(/\b4\b/g, map["4"]);
  } else if (sagaId === "street-fighter") {
    const map =
      mode === "ps"
        ? { LP: "▢", MP: "△", HP: "R1", LK: "✕", MK: "○", HK: "R2", PP: "2 Puños (L1)", KK: "2 Patadas (L2)" }
        : mode === "switch"
        ? { LP: "Y", MP: "X", HP: "R", LK: "B", MK: "A", HK: "ZR", PP: "2 Puños (L)", KK: "2 Patadas (ZL)" }
        : { LP: "X", MP: "Y", HP: "RB", LK: "A", MK: "B", HK: "RT", PP: "2 Puños (LB)", KK: "2 Patadas (LT)" };

    out = out
      .replace(/\bj\./gi, "Salto ")
      .replace(/\b5(LP|MP|HP|LK|MK|HK)\b/g, (_, b) => map[b])
      .replace(/\b2(LP|MP|HP|LK|MK|HK)\b/g, (_, b) => `↓${map[b]}`)
      .replace(/\b6(LP|MP|HP|LK|MK|HK)\b/g, (_, b) => `→${map[b]}`)
      .replace(/\b4(LP|MP|HP|LK|MK|HK)\b/g, (_, b) => `←${map[b]}`)
      .replace(/\b(PP|KK|LP|MP|HP|LK|MK|HK)\b/g, (m) => map[m] || m);
  } else if (sagaId === "dragon-ball-fighterz") {
    const map =
      mode === "ps"
        ? { L: "▢", M: "△", H: "○", S: "✕" }
        : mode === "switch"
        ? { L: "Y", M: "X", H: "A", S: "B" }
        : { L: "X", M: "Y", H: "B", S: "A" };

    out = out
      .replace(/\bj\./gi, "Salto ")
      .replace(/\b5(L|M|H|S)\b/g, (_, b) => map[b])
      .replace(/\b2(L|M|H|S)\b/g, (_, b) => `↓${map[b]}`)
      .replace(/\b6(L|M|H|S)\b/g, (_, b) => `→${map[b]}`)
      .replace(/\b4(L|M|H|S)\b/g, (_, b) => `←${map[b]}`)
      .replace(/\bMLL\b/g, `${map.M}→${map.L}→${map.L}`)
      .replace(/\bLLL\b/g, `${map.L}→${map.L}→${map.L}`)
      .replace(/\bLL\b/g, `${map.L}→${map.L}`)
      .replace(/\b(L|M|H|S)\b/g, (m) => map[m] || m);
  } else if (sagaId === "guilty-gear") {
    const map =
      mode === "ps"
        ? { P: "▢", K: "✕", S: "△", HS: "○", D: "R1" }
        : mode === "switch"
        ? { P: "Y", K: "B", S: "X", HS: "A", D: "R" }
        : { P: "X", K: "A", S: "Y", HS: "B", D: "RB" };

    out = out
      .replace(/\bj\./gi, "Salto ")
      .replace(/\bc\.S\b/g, `Cerca ${map.S}`)
      .replace(/\bf\.S\b/g, `Lejos ${map.S}`)
      .replace(/\b5(HS|P|K|S|D)\b/g, (_, b) => map[b])
      .replace(/\b2(HS|P|K|S|D)\b/g, (_, b) => `↓${map[b]}`)
      .replace(/\b6(HS|P|K|S|D)\b/g, (_, b) => `→${map[b]}`)
      .replace(/\b4(HS|P|K|S|D)\b/g, (_, b) => `←${map[b]}`)
      .replace(/\b(HS|P|K|S|D)\b/g, (m) => map[m] || m);
  } else if (sagaId === "super-smash-bros") {
    const map =
      mode === "ps"
        ? { A: "✕", B: "▢", Grab: "L1 / R1" }
        : mode === "xbox"
        ? { A: "A", B: "X", Grab: "LB / RB" }
        : { A: "A (Ataque)", B: "B (Especial)", Grab: "L / R / Z" };

    out = out
      .replace(/\bNeutral A\b/gi, map.A)
      .replace(/\bAdelante \+ A\b/gi, `→ + ${map.A}`)
      .replace(/\bArriba \+ A\b/gi, `↑ + ${map.A}`)
      .replace(/\bAbajo \+ A\b/gi, `↓ + ${map.A}`)
      .replace(/\bCorrer \+ A\b/gi, `Correr + ${map.A}`)
      .replace(/\bAdelante \+ B\b/gi, `→ + ${map.B}`)
      .replace(/\bArriba \+ B\b/gi, `↑ + ${map.B}`)
      .replace(/\bAbajo \+ B\b/gi, `↓ + ${map.B}`)
      .replace(/\bZ \/ R\+A\b/gi, map.Grab)
      .replace(/\bB\b/g, map.B);
  }

  return out;
}
window.translateNotation = translateNotation;

function getGameCoverBackground(game) {
  if (game.coverImage) {
    return `linear-gradient(180deg, rgba(9, 13, 22, 0.25) 0%, rgba(9, 13, 22, 0.92) 100%), url('${game.coverImage}')`;
  }
  return game.coverGradient;
}

// =========================================================================
// CAMBIO ENTRE LAS 3 PÁGINAS INDEPENDIENTES DEL JUEGO MANTENIENDO EL MENÚ
// =========================================================================
function switchGameSubpage(subpageId) {
  state.selectedSubpage = subpageId;

  document.querySelectorAll(".game-tab[data-subpage]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.subpage === subpageId);
  });

  document.querySelectorAll(".game-subpage").forEach((pageEl) => {
    pageEl.classList.toggle("hidden", pageEl.id !== subpageId);
  });

  const rosterControls = document.getElementById("rosterQuickControls");
  if (rosterControls) {
    rosterControls.classList.toggle("hidden", subpageId !== "page-roster");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =========================================================================
// CARGA INICIAL Y RENDERIZADO PRINCIPAL
// =========================================================================
function setActiveTopNav(activeId) {
  ["btnNavHome", "btnOpenToolsView", "btnOpenNewsView", "btnOpenCommunityView", "btnOpenYoutubeModal"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("active", id === activeId);
  });
}

async function loadBootstrap() {
  try {
    const res = await fetch("/api/bootstrap");
    const data = await res.json();
    state.youtubeChannel = data.youtubeChannel || null;
    state.events = data.events || [];
    state.news = data.news || [];
    state.communityResources = data.communityResources || [];
    state.missingContentRoadmap = data.missingContentRoadmap || [];
    state.sagas = data.sagas || [];
    state.games = data.games || [];
    renderAll();

    // Precargar en segundo plano los retratos de todos los juegos para que todas las fotos estén listas al instante
    setTimeout(() => {
      state.games.forEach((g) => hydrateBrowserPortraits(g));
    }, 150);

    fetch("/api/news")
      .then((r) => r.json())
      .then((nData) => {
        if (nData && Array.isArray(nData.news)) {
          state.news = nData.news;
          if (Array.isArray(nData.events)) {
            state.events = nData.events;
          }
          renderNewsSections();
        }
      })
      .catch(() => {});
  } catch (err) {
    console.error("Error cargando datos del servidor:", err);
  }
}

function renderAll() {
  renderHeroStats();
  renderSagaTabs();
  renderGamesGrid();
  renderNewsSections();
  renderCommunitySection();
  renderQuickSearch();
  renderYoutubeModal();

  if (state.selectedGameId) {
    renderGameDetailView(state.selectedGameId);
  }
  if (state.selectedCharacter) {
    openCharacterModal(state.selectedCharacter.gameId, state.selectedCharacter.charId);
  }
}

// =========================================================================
// SECCIÓN DE COMUNIDAD: WIKIS, CANALES DE YOUTUBE Y RESUMEN DE LO QUE FALTA
// =========================================================================
function renderCommunitySection() {
  const roadmapEl = document.getElementById("missingContentRoadmapList");
  if (roadmapEl) {
    roadmapEl.innerHTML = state.missingContentRoadmap
      .map(
        (item) => `
        <div class="guide-section-item" style="margin-top:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
            <strong style="color:#fbbf24;font-family:var(--font-display);font-size:0.98rem;">
              ${item.area} — <span style="color:#f8fafc;">${item.target}</span>
            </strong>
            <span class="dlc-pack-badge">Prioridad: ${item.priority}</span>
          </div>
          <p style="font-size:0.86rem;color:#e2e8f0;margin-bottom:6px;">
            <strong>Qué falta:</strong> ${item.whatIsMissing}
          </p>
          <p style="font-size:0.8rem;color:#94a3b8;">
            <strong>Para valorar:</strong> ${item.purposeForEvaluation}
          </p>
        </div>
      `
      )
      .join("");
  }

  const countPill = document.getElementById("communityResourcesCountPill");
  if (countPill) {
    countPill.textContent = `${state.communityResources.length} fuentes registradas`;
  }

  const gridEl = document.getElementById("communityResourcesGrid");
  if (gridEl) {
    gridEl.innerHTML = state.communityResources
      .map(
        (res) => `
        <article class="news-card">
          <div class="news-card-body">
            <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
              <span class="news-cat-badge">${res.category}</span>
              <span class="news-saga-badge">${res.targetGame}</span>
            </div>
            <h3>${res.title}</h3>
            <p style="margin-bottom:8px;">${res.description}</p>
            <div style="font-size:0.78rem;color:#cbd5e1;background:rgba(9,13,22,0.55);padding:8px 10px;border-radius:8px;border:1px solid #293548;">
              <strong>Qué aporta / Qué falta cubrir:</strong> ${res.missingNotes}
            </div>
          </div>
          <div class="news-card-footer">
            <span style="color:#94a3b8;">Aportado por: ${res.author}</span>
            <a href="${res.url}" target="_blank" rel="noopener" class="news-source-link">
              Abrir enlace ➔
            </a>
          </div>
        </article>
      `
      )
      .join("");
  }
}

function openCommunityPage() {
  state.selectedGameId = null;
  setActiveTopNav("btnOpenCommunityView");
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("gameDetailView").classList.add("hidden");
  document.getElementById("newsView").classList.add("hidden");
  document.getElementById("toolsView")?.classList.add("hidden");
  document.getElementById("youtubeView")?.classList.add("hidden");
  document.getElementById("communityView").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderCommunitySection();
}

function openToolsPage(initialTab = "tool-quiz", quizMode = "general") {
  state.selectedGameId = null;
  setActiveTopNav("btnOpenToolsView");
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("gameDetailView").classList.add("hidden");
  document.getElementById("newsView").classList.add("hidden");
  document.getElementById("communityView").classList.add("hidden");
  document.getElementById("youtubeView")?.classList.add("hidden");
  document.getElementById("toolsView")?.classList.remove("hidden");

  document.querySelectorAll("[data-tooltab]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tooltab === initialTab);
  });
  document.querySelectorAll(".tool-subview").forEach((el) => {
    el.classList.toggle("hidden", el.id !== initialTab);
  });

  if (typeof window.initPersonalityQuiz === "function") {
    window.initPersonalityQuiz(quizMode);
  }
  if (typeof window.initPunishCalculator === "function") {
    window.initPunishCalculator();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =========================================================================
// SECCIÓN DE NOTICIAS DE JUEGOS DE LUCHA Y COMPETITIVO
// =========================================================================
function buildNewsCardHTML(item) {
  const bg = item.imageUrl
    ? `linear-gradient(180deg, rgba(9,13,22,0.2) 0%, rgba(9,13,22,0.92) 100%), url('${item.imageUrl}')`
    : "linear-gradient(135deg, #1e293b, #090d16)";

  return `
    <article class="news-card">
      <div>
        <div class="news-card-banner" style="background-image: ${bg};">
          <span class="news-cat-badge">${item.category}</span>
          <span class="news-saga-badge">${item.saga}</span>
        </div>
        <div class="news-card-body">
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </div>
      </div>
      <div class="news-card-footer">
        <span style="color:#94a3b8;">${item.sourceName} • ${item.date}</span>
        <a href="${item.sourceUrl}" target="_blank" rel="noopener" class="news-source-link">
          Leer fuente oficial ➔
        </a>
      </div>
    </article>
  `;
}

function buildEventCardHTML(evt) {
  const bg = evt.imageUrl
    ? `linear-gradient(180deg, rgba(9,13,22,0.2) 0%, rgba(9,13,22,0.92) 100%), url('${evt.imageUrl}')`
    : "linear-gradient(135deg, #1e293b, #090d16)";
  const isLive = evt.status === "En Curso";

  return `
    <article class="news-card" style="border-color: ${isLive ? "#10b981" : "rgba(245, 158, 11, 0.45)"};">
      <div>
        <div class="news-card-banner" style="background-image: ${bg};">
          <span class="news-cat-badge" style="background:${isLive ? "#10b981" : "#f59e0b"};">
            ${evt.status}
          </span>
          <span class="news-saga-badge">${evt.location}</span>
        </div>
        <div class="news-card-body">
          <h3>${evt.title}</h3>
          <div style="background:rgba(9,13,22,0.65);border:1px solid #293548;border-radius:8px;padding:10px 12px;margin:10px 0;font-size:0.81rem;">
            <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:4px;">
              <strong style="color:#4ade80;">Cuándo empieza:</strong>
              <span style="font-family:var(--font-mono);color:#f8fafc;">${evt.startLabel}</span>
            </div>
            <div style="display:flex;justify-content:space-between;gap:8px;">
              <strong style="color:#f87171;">Cuándo termina:</strong>
              <span style="font-family:var(--font-mono);color:#f8fafc;">${evt.endLabel}</span>
            </div>
          </div>
          <p style="margin-bottom:8px;">${evt.summary}</p>
          <div style="font-size:0.77rem;color:#fbbf24;">
            <strong>Juegos principales:</strong> ${evt.games}
          </div>
        </div>
      </div>
      <div class="news-card-footer">
        <span style="color:#94a3b8;">${evt.saga}</span>
        <a href="${evt.sourceUrl}" target="_blank" rel="noopener" class="news-source-link">
          Web oficial del evento ➔
        </a>
      </div>
    </article>
  `;
}

function renderNewsSections() {
  const homePreview = document.getElementById("homeNewsPreviewGrid");
  if (homePreview) {
    homePreview.innerHTML = state.news
      .slice(0, 3)
      .map((item) => buildNewsCardHTML(item))
      .join("");
  }

  const eventsSection = document.getElementById("eventsCalendarSection");
  const eventsGrid = document.getElementById("eventsGridContainer");
  const newsSection = document.getElementById("newsArticlesSection");
  const fullGrid = document.getElementById("fullNewsGridContainer");

  const q = (state.newsSearchQuery || "").trim().toLowerCase();

  // Filtrar Eventos por texto y fecha (Inicio / Fin)
  let filteredEvents = (state.events || []).slice();
  if (q) {
    filteredEvents = filteredEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.games.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    );
  }
  if (state.newsDateFrom) {
    filteredEvents = filteredEvents.filter((e) => String(e.endDate || "") >= state.newsDateFrom);
  }
  if (state.newsDateTo) {
    filteredEvents = filteredEvents.filter((e) => String(e.startDate || "") <= state.newsDateTo);
  }
  if (
    state.newsQuickPeriod === "2027" ||
    state.newsQuickPeriod === "2026" ||
    state.newsQuickPeriod === "2025"
  ) {
    filteredEvents = filteredEvents.filter(
      (e) =>
        String(e.startDate || "").startsWith(state.newsQuickPeriod) ||
        String(e.endDate || "").startsWith(state.newsQuickPeriod)
    );
  }

  // Mostrar u ocultar secciones según la pestaña activa
  const showEvents =
    state.selectedNewsCategory === "all" ||
    state.selectedNewsCategory === "events-only" ||
    state.selectedNewsCategory === "Competitivo / Torneos";
  const showNews = state.selectedNewsCategory !== "events-only";

  if (eventsSection && eventsGrid) {
    eventsSection.classList.toggle("hidden", !showEvents);
    if (filteredEvents.length === 0) {
      eventsGrid.innerHTML = `
        <div class="roster-block" style="grid-column: 1 / -1; text-align:center;">
          <p style="color:#94a3b8;">No hay eventos programados que coincidan con ese filtro de fechas.</p>
        </div>
      `;
    } else {
      eventsGrid.innerHTML = filteredEvents.map((evt) => buildEventCardHTML(evt)).join("");
    }
  }

  if (newsSection && fullGrid) {
    newsSection.classList.toggle("hidden", !showNews);
    let list = state.news.slice();

    if (
      state.selectedNewsCategory !== "all" &&
      state.selectedNewsCategory !== "events-only"
    ) {
      list = list.filter((n) => n.category === state.selectedNewsCategory);
    }

    if (q) {
      list = list.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.summary && n.summary.toLowerCase().includes(q)) ||
          (n.saga && n.saga.toLowerCase().includes(q)) ||
          (n.sourceName && n.sourceName.toLowerCase().includes(q))
      );
    }

    if (state.newsDateFrom) {
      list = list.filter((n) => String(n.isoDate || "") >= state.newsDateFrom);
    }
    if (state.newsDateTo) {
      list = list.filter((n) => String(n.isoDate || "") <= state.newsDateTo);
    }

    if (state.newsQuickPeriod !== "all") {
      if (
        state.newsQuickPeriod === "2027" ||
        state.newsQuickPeriod === "2026" ||
        state.newsQuickPeriod === "2025"
      ) {
        list = list.filter((n) => String(n.isoDate || "").startsWith(state.newsQuickPeriod));
      } else {
        const days = state.newsQuickPeriod === "30d" ? 30 : 90;
        const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
        list = list.filter((n) => String(n.isoDate || "") >= cutoff);
      }
    }

    const countLabel = document.getElementById("newsFilteredCountLabel");
    if (countLabel) {
      countLabel.textContent = `${filteredEvents.length} eventos y ${list.length} noticias`;
    }

    if (list.length === 0) {
      fullGrid.innerHTML = `
        <div class="roster-block" style="grid-column: 1 / -1; text-align:center;">
          <p style="color:#94a3b8;">No se encontraron noticias en ese rango de fechas o búsqueda.</p>
        </div>
      `;
    } else {
      fullGrid.innerHTML = list.map((item) => buildNewsCardHTML(item)).join("");
    }
  }
}

function openNewsPage() {
  state.selectedGameId = null;
  setActiveTopNav("btnOpenNewsView");
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("gameDetailView").classList.add("hidden");
  document.getElementById("communityView").classList.add("hidden");
  document.getElementById("toolsView")?.classList.add("hidden");
  document.getElementById("youtubeView")?.classList.add("hidden");
  document.getElementById("newsView").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderNewsSections();
}

function renderHeroStats() {
  const box = document.getElementById("heroStatsBox");
  let totalBase = 0;
  let totalDLC = 0;
  state.games.forEach((g) => {
    totalBase += g.characters.filter((c) => !c.isDLC).length;
    totalDLC += g.characters.filter((c) => c.isDLC).length;
  });

  box.innerHTML = `
    <div class="stat-box">
      <strong>${state.games.length}</strong>
      <span>Juegos</span>
    </div>
    <div class="stat-box">
      <strong>${totalBase + totalDLC}</strong>
      <span>Personajes Totales</span>
    </div>
    <div class="stat-box">
      <strong>${totalBase}</strong>
      <span>Juego Base</span>
    </div>
    <div class="stat-box">
      <strong>${totalDLC}</strong>
      <span>Personajes DLC</span>
    </div>
  `;
}

function renderSagaTabs() {
  const container = document.getElementById("sagaTabsContainer");
  const allBtn = `
    <button class="saga-tab-btn ${state.selectedSagaId === "all" ? "active" : ""}" data-saga="all">
      Todos los juegos (${state.games.length})
    </button>
  `;

  const sagaBtns = state.sagas
    .map((s) => {
      const active = state.selectedSagaId === s.id ? "active" : "";
      return `
        <button class="saga-tab-btn ${active}" data-saga="${s.id}">
          ${s.name}
        </button>
      `;
    })
    .join("");

  container.innerHTML = allBtn + sagaBtns;

  container.querySelectorAll(".saga-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedSagaId = btn.dataset.saga;
      renderSagaTabs();
      renderGamesGrid();
    });
  });
}

function renderQuickSearch() {
  const box = document.getElementById("quickCharSearchResults");
  const q = state.searchQuery.trim().toLowerCase();
  if (!q) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }

  const matches = [];
  state.games.forEach((game) => {
    game.characters.forEach((ch) => {
      const packMatch = ch.dlcPack && ch.dlcPack.toLowerCase().includes(q);
      if (
        ch.name.toLowerCase().includes(q) ||
        ch.archetype.toLowerCase().includes(q) ||
        packMatch
      ) {
        matches.push({ game, ch });
      }
    });
  });

  if (matches.length === 0) {
    box.classList.add("hidden");
    return;
  }

  box.classList.remove("hidden");
  box.innerHTML = `
    <div style="margin-bottom:12px;font-weight:700;color:#fbbf24;">
      Personajes y Packs DLC encontrados para "${state.searchQuery}" (${matches.length}):
    </div>
    <div class="portrait-select-grid">
      ${matches
        .slice(0, 28)
        .map(({ game, ch }) => {
          const cachedSrc = clientPortraitCache.get(ch.id) || ch.iconUrl;
          const fallbackSrc = (ch.fallbackIconUrl || ch.iconUrl).replace(/'/g, "\\'");
          const safeName = ch.name.replace(/'/g, "\\'");
          return `
            <div class="portrait-tile ${ch.isDLC ? "is-dlc" : ""} ${ch.isUnreleased ? "is-locked" : ""}" data-quickgame="${game.id}" data-quickchar="${ch.id}">
              <div class="portrait-img-box">
                <img
                  data-charimg="${ch.id}"
                  src="${cachedSrc}"
                  alt="${ch.name}"
                  referrerpolicy="no-referrer"
                  loading="lazy"
                  onload="window.handlePortraitLoad(this)"
                  onerror="window.handlePortraitError(this, '${game.id}', '${ch.id}', '${safeName}', '${fallbackSrc}')"
                />
                ${ch.isUnreleased ? `<div class="portrait-lock-badge"><span class="portrait-lock-icon">🔒</span><span class="portrait-lock-tag">Pronto</span></div>` : ""}
              </div>
              <div class="portrait-name">${ch.name}</div>
              <div class="portrait-pack-sub">${game.title}</div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  box.querySelectorAll("[data-quickchar]").forEach((card) => {
    card.addEventListener("click", () => {
      const gId = card.dataset.quickgame;
      const cId = card.dataset.quickchar;
      openGameHub(gId, "page-roster");
      openCharacterModal(gId, cId);
    });
  });
}

function renderGamesGrid() {
  const container = document.getElementById("gamesGridContainer");
  const q = state.searchQuery.trim().toLowerCase();

  let list = state.games;
  if (state.selectedSagaId !== "all") {
    list = list.filter((g) => g.sagaId === state.selectedSagaId);
  }

  if (q) {
    list = list.filter((g) => {
      const inTitle = g.title.toLowerCase().includes(q);
      const inChar = g.characters.some(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.dlcPack && c.dlcPack.toLowerCase().includes(q))
      );
      return inTitle || inChar;
    });
  }

  container.innerHTML = list
    .map((game) => {
      const saga = state.sagas.find((s) => s.id === game.sagaId);
      const baseChars = game.characters.filter((c) => !c.isDLC);
      const dlcChars = game.characters.filter((c) => c.isDLC);
      const uniquePacks = [...new Set(dlcChars.map((c) => c.dlcPack).filter(Boolean))];
      const coverBg = getGameCoverBackground(game);

      return `
        <article class="game-card" data-gameid="${game.id}">
          <div>
            <div class="game-card-banner" style="background-image: ${coverBg};">
              <span class="game-patch-pill">${game.currentPatch}</span>
              <h3>${game.title}</h3>
              <div class="game-card-meta">
                ${saga ? saga.developer : ""} • ${game.releaseYear}
              </div>
            </div>
            <div class="game-card-body">
              <p>${game.basicGuide.summary}</p>
              <div class="roster-split-pills">
                <span class="pill-base">${baseChars.length} Base</span>
                <span class="pill-dlc">+${dlcChars.length} DLC (${uniquePacks.length} Packs)</span>
              </div>
            </div>
          </div>
          <div class="game-card-footer">
            <span>Explorar guías y ${game.characters.length} luchadores</span>
            <span>➔</span>
          </div>
        </article>
      `;
    })
    .join("");

  container.querySelectorAll(".game-card").forEach((card) => {
    card.addEventListener("click", () => {
      openGameHub(card.dataset.gameid, "page-basic");
    });
  });
}

// =========================================================================
// VISTA DETALLADA DE UN JUEGO (3 PÁGINAS SEPARADAS CON MENÚ FIJO)
// =========================================================================
function openGameHub(gameId, initialSubpage = "page-basic") {
  state.selectedGameId = gameId;
  state.selectedDlcPackFilter = "all";
  state.inGameSearchQuery = "";
  const inGameInput = document.getElementById("inGameCharSearch");
  if (inGameInput) inGameInput.value = "";

  setActiveTopNav("btnNavHome");
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("newsView").classList.add("hidden");
  document.getElementById("communityView").classList.add("hidden");
  document.getElementById("toolsView")?.classList.add("hidden");
  document.getElementById("youtubeView")?.classList.add("hidden");
  document.getElementById("gameDetailView").classList.remove("hidden");

  renderGameDetailView(gameId);
  switchGameSubpage(initialSubpage);
}

function renderGameDetailView(gameId) {
  const game = state.games.find((g) => g.id === gameId);
  if (!game) return;
  const saga = state.sagas.find((s) => s.id === game.sagaId);

  const sourcesEl = document.getElementById("gameOfficialSources");
  sourcesEl.innerHTML =
    `<span style="font-size:0.76rem;color:#94a3b8;">Fuentes fiables:</span>` +
    (game.officialSources || [])
      .map(
        (src) =>
          `<a href="${src.url}" target="_blank" rel="noopener" class="source-link">${src.name}</a>`
      )
      .join("");

  const headerEl = document.getElementById("gameHeaderBanner");
  headerEl.style.backgroundImage = getGameCoverBackground(game);
  headerEl.innerHTML = `
    <div>
      <span class="game-patch-pill">${game.currentPatch}</span>
      <h1>${game.title}</h1>
      <p style="color:#e2e8f0;font-size:0.9rem;margin-top:4px;">
        Sistema clave: <strong>${game.subSystemName}</strong> • Plantel total: <strong>${game.characters.length} personajes</strong>
      </p>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary" id="btnOpenGameSpecificQuiz">Test: ¿Qué personaje de ${game.title} elegir?</button>
      <button class="btn btn-outline" id="btnSuggestResourceForGame">Aportar Wiki / Canal para ${game.title}</button>
    </div>
  `;

  document.getElementById("btnOpenGameSpecificQuiz").addEventListener("click", () => {
    openToolsPage("tool-quiz", game.id);
  });

  document.getElementById("btnSuggestResourceForGame").addEventListener("click", () => {
    openCommunityPage();
    const targetInput = document.getElementById("commTargetGameInput");
    if (targetInput) {
      targetInput.value = game.title;
      targetInput.focus();
    }
  });

function getControllerLegend(sagaId, mode) {
  const legends = {
    "mortal-kombat": {
      technical: "1 = Puño Delantero | 2 = Puño Trasero | 3 = Patada Delantera | 4 = Patada Trasera | EX = Mejorar Especial | K = Kameo",
      ps: "▢ = Puño Delantero | △ = Puño Trasero | ✕ = Patada Delantera | ○ = Patada Trasera | R2 = Bloqueo / EX | R1 = Kameo",
      xbox: "X = Puño Delantero | Y = Puño Trasero | A = Patada Delantera | B = Patada Trasera | RT = Bloqueo / EX | RB = Kameo",
      switch: "Y = Puño Delantero | X = Puño Trasero | B = Patada Delantera | A = Patada Trasera | ZR = Bloqueo / EX | R = Kameo"
    },
    "street-fighter": {
      technical: "LP/MP/HP = Puño Débil/Medio/Fuerte | LK/MK/HK = Patada Débil/Media/Fuerte | ↓↘→ = Hadoken | →↓↘ = Shoryuken | DR = Drive Rush",
      ps: "▢ = Puño Débil | △ = Puño Medio | R1 = Puño Fuerte | ✕ = Patada Débil | ○ = Patada Media | R2 = Patada Fuerte | L1/L2 = Drive",
      xbox: "X = Puño Débil | Y = Puño Medio | RB = Puño Fuerte | A = Patada Débil | B = Patada Media | RT = Patada Fuerte | LB/LT = Drive",
      switch: "Y = Puño Débil | X = Puño Medio | R = Puño Fuerte | B = Patada Débil | A = Patada Media | ZR = Patada Fuerte | L/ZL = Drive"
    },
    "tekken": {
      technical: "1 = Puño Izquierdo | 2 = Puño Derecho | 3 = Patada Izquierda | 4 = Patada Derecha | → / ↓ = Direcciones | ws = Al levantarse",
      ps: "▢ = Puño Izquierdo | △ = Puño Derecho | ✕ = Patada Izquierda | ○ = Patada Derecha | △+✕ (R1) = Heat Burst | R2 = Rage Art",
      xbox: "X = Puño Izquierdo | Y = Puño Derecho | A = Patada Izquierda | B = Patada Derecha | Y+A (RB) = Heat Burst | RT = Rage Art",
      switch: "Y = Puño Izquierdo | X = Puño Derecho | B = Patada Izquierda | A = Patada Derecha | X+B (R) = Heat Burst | ZR = Rage Art"
    },
    "dragon-ball-fighterz": {
      technical: "L = Débil | M = Medio | H = Fuerte | S = Especial (Ki) | A1/A2 = Asistencias | H+S = Super Dash | 2H = Antiaéreo universal",
      ps: "▢ = Débil (L) | △ = Medio (M) | ○ = Fuerte (H) | ✕ = Ki (S) | R2 = Super Dash | R1 = Dragon Rush | L1/L2 = Asistencias",
      xbox: "X = Débil (L) | Y = Medio (M) | B = Fuerte (H) | A = Ki (S) | RT = Super Dash | RB = Dragon Rush | LB/LT = Asistencias",
      switch: "Y = Débil (L) | X = Medio (M) | A = Fuerte (H) | B = Ki (S) | ZR = Super Dash | R = Dragon Rush | L/ZL = Asistencias"
    },
    "guilty-gear": {
      technical: "P = Puño | K = Patada | S = Slash | HS = Heavy Slash | D = Dust | RC = Roman Cancel (RRC/PRC/YRC/BRC) | c.S = Close Slash",
      ps: "▢ = Puño (P) | ✕ = Patada (K) | △ = Slash (S) | ○ = Heavy Slash (HS) | R1 = Dust (D) | R2 = Dash | △+○+✕ = Roman Cancel",
      xbox: "X = Puño (P) | A = Patada (K) | Y = Slash (S) | B = Heavy Slash (HS) | RB = Dust (D) | RT = Dash | Y+B+A = Roman Cancel",
      switch: "Y = Puño (P) | B = Patada (K) | X = Slash (S) | A = Heavy Slash (HS) | R = Dust (D) | ZR = Dash | X+A+B = Roman Cancel"
    },
    "super-smash-bros": {
      technical: "Nair/Fair/Bair/Uair/Dair = Aéreos | Utilt/Ftilt/Dtilt = Tilts | USmash/FSmash/DSmash | OOS = Out of Shield | DI = Directional Influence",
      ps: "✕ = Ataque Normal | ▢ = Especial | △/○ = Salto | L1/R1 = Agarre | L2/R2 = Escudo (Nota: SSBU es nativo de Nintendo Switch)",
      xbox: "A = Ataque Normal | X = Especial | Y/B = Salto | LB/RB = Agarre | LT/RT = Escudo (Nota: SSBU es nativo de Nintendo Switch)",
      switch: "A = Ataque Normal | B = Especial | X/Y = Salto | L/R/Z = Agarre | ZL/ZR = Escudo | Stick Derecho = Tilt / Smash"
    }
  };
  return legends[sagaId]?.[mode] || legends[sagaId]?.technical || "";
}

  const activeLegend = saga ? getControllerLegend(game.sagaId, state.notationMode) : "";
  const modeLabel =
    state.notationMode === "technical"
      ? "Notación Técnica FGC"
      : state.notationMode === "ps"
      ? "Mando PlayStation"
      : state.notationMode === "xbox"
      ? "Mando Xbox / PC"
      : "Mando Nintendo Switch";
  document.getElementById("gameNotationBanner").innerHTML = `
    <strong>${modeLabel}:</strong> ${activeLegend}
  `;

  const q = state.inGameSearchQuery.trim().toLowerCase();
  const baseChars = game.characters.filter(
    (c) =>
      !c.isDLC &&
      (!q || c.name.toLowerCase().includes(q) || c.archetype.toLowerCase().includes(q))
  );
  const allDlcChars = game.characters.filter((c) => c.isDLC);
  const filteredDlcChars = allDlcChars.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.archetype.toLowerCase().includes(q) ||
      (c.dlcPack && c.dlcPack.toLowerCase().includes(q))
  );

  document.getElementById("baseRosterCountPill").textContent = `${baseChars.length} personajes Base`;

  const packSelect = document.getElementById("dlcPackFilterSelect");
  const packs = [...new Set(allDlcChars.map((c) => c.dlcPack || "DLC Pack"))];
  packSelect.innerHTML =
    `<option value="all">Todos los Packs DLC (${allDlcChars.length})</option>` +
    packs
      .map(
        (p) =>
          `<option value="${p}" ${state.selectedDlcPackFilter === p ? "selected" : ""}>${p}</option>`
      )
      .join("");

  packSelect.onchange = (e) => {
    state.selectedDlcPackFilter = e.target.value;
    renderDlcGrid(game, filteredDlcChars);
  };

  const baseGrid = document.getElementById("baseCharactersGrid");
  baseGrid.innerHTML = baseChars.map((ch) => buildCharacterCardHTML(game, ch)).join("");
  attachCharacterCardEvents(baseGrid, game.id);

  renderDlcGrid(game, filteredDlcChars);

  renderGuideSplit("basicGuideContainer", game.basicGuide, "Guía Básica de Conceptos", game.officialSources);
  renderGuideSplit("advancedGuideContainer", game.advancedGuide, "Guía Avanzada Competitiva", game.officialSources);

  hydrateBrowserPortraits(game);
}

function renderDlcGrid(game, dlcChars) {
  const container = document.getElementById("dlcPacksGroupedContainer");
  if (!container) return;

  const filtered =
    state.selectedDlcPackFilter === "all"
      ? dlcChars
      : dlcChars.filter((c) => c.dlcPack === state.selectedDlcPackFilter);

  const packs = [...new Set(filtered.map((c) => c.dlcPack || "DLC Pack"))];

  if (packs.length === 0) {
    container.innerHTML = `<p style="color:#94a3b8;font-size:0.86rem;">No se encontraron personajes DLC con ese filtro.</p>`;
    return;
  }

  container.innerHTML = packs
    .map((packName) => {
      const charsInPack = filtered.filter((c) => (c.dlcPack || "DLC Pack") === packName);
      return `
        <div class="dlc-pack-subblock">
          <div class="dlc-pack-subblock-title">
            <span>Pack DLC: <strong>${packName}</strong></span>
            <span class="dlc-pack-badge">${charsInPack.length} personajes</span>
          </div>
          <div class="portrait-select-grid">
            ${charsInPack.map((ch) => buildCharacterCardHTML(game, ch)).join("")}
          </div>
        </div>
      `;
    })
    .join("");

  attachCharacterCardEvents(container, game.id);
}

function buildCharacterCardHTML(game, ch) {
  const cachedSrc = clientPortraitCache.get(ch.id) || ch.iconUrl;
  const fallbackSrc = (ch.fallbackIconUrl || ch.iconUrl).replace(/'/g, "\\'");
  const safeName = ch.name.replace(/'/g, "\\'");
  const statusLabel = ch.isUnreleased
    ? `${ch.releaseWindow || "Anunciado — Próximamente"}`
    : ch.isDLC
    ? ch.dlcPack
    : "Juego Base";

  return `
    <div
      class="portrait-tile ${ch.isDLC ? "is-dlc" : ""} ${ch.isUnreleased ? "is-locked" : ""}"
      data-charid="${ch.id}"
      title="${ch.name} — ${ch.archetype} (${statusLabel})"
    >
      <div class="portrait-img-box">
        <img
          data-charimg="${ch.id}"
          src="${cachedSrc}"
          alt="${ch.name}"
          referrerpolicy="no-referrer"
          loading="lazy"
          onload="window.handlePortraitLoad(this)"
          onerror="window.handlePortraitError(this, '${game.id}', '${ch.id}', '${safeName}', '${fallbackSrc}')"
        />
        ${
          ch.isUnreleased
            ? `<div class="portrait-lock-badge"><span class="portrait-lock-icon">🔒</span><span class="portrait-lock-tag">Pronto</span></div>`
            : ""
        }
      </div>
      <div class="portrait-name">${ch.name}</div>
    </div>
  `;
}

function attachCharacterCardEvents(container, gameId) {
  container.querySelectorAll("[data-charid]").forEach((card) => {
    card.addEventListener("click", () => {
      openCharacterModal(gameId, card.dataset.charid);
    });
  });
}

function renderGuideSplit(containerId, guideObj, badgeLabel, sources) {
  const el = document.getElementById(containerId);
  if (!guideObj) return;

  el.innerHTML = `
    <div class="video-panel-card">
      <div class="hero-pill">${badgeLabel} — VÍDEO EXPLICATIVO</div>
      <h3>${guideObj.title}</h3>
      <p style="color:#94a3b8;font-size:0.85rem;margin-top:4px;">
        Fuente en vídeo: <strong>${guideObj.videoAuthor}</strong>
      </p>
      <div class="video-frame-wrapper">
        <iframe
          src="${guideObj.videoUrl}"
          title="${guideObj.title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <p style="font-size:0.87rem;color:#cbd5e1;">${guideObj.summary}</p>
    </div>

    <div class="text-panel-card">
      <div class="hero-pill">VERSIÓN EN TEXTO ESTRUCTURADA</div>
      <h3>Conceptos Paso a Paso</h3>
      ${(guideObj.sections || [])
        .map(
          (sec) => `
          <div class="guide-section-item">
            <h4>${sec.heading}</h4>
            <p>${sec.content}</p>
          </div>
        `
        )
        .join("")}
      <div style="margin-top:16px;font-size:0.82rem;color:#94a3b8;">
        Fuentes de datos: ${(sources || [])
          .map((s) => `<a href="${s.url}" target="_blank" style="color:#38bdf8;">${s.name}</a>`)
          .join(" • ")}
      </div>
    </div>
  `;

  if (typeof window.decorateTextWithGlossaryTooltips === "function") {
    window.decorateTextWithGlossaryTooltips(el);
  }
}

// =========================================================================
// VISUALIZADOR LIMPIO DE FRAME METER (RESPALDO MIENTRAS CARGA LA HITBOX REAL)
// Muestra la línea temporal proporcional de Startup / Activa / Recovery del ataque.
// =========================================================================
function buildCharacterHitboxStageHTML(game, ch, fc) {
  const sMatch = String(fc.startup || "").match(/(\d+)/);
  const aMatch = String(fc.active || "").match(/(\d+)[–-](\d+)/);
  const rMatch = String(fc.recovery || "").match(/(\d+)/);
  const tMatch = String(fc.totalFrames || "").match(/(\d+)/);

  const startupN = sMatch ? parseInt(sMatch[1], 10) : 6;
  const activeStart = aMatch ? parseInt(aMatch[1], 10) : startupN;
  const activeEnd = aMatch ? parseInt(aMatch[2], 10) : startupN + 2;
  const activeN = Math.max(1, activeEnd - activeStart + 1);
  const recoveryN = rMatch ? parseInt(rMatch[1], 10) : 16;
  const totalN = tMatch ? parseInt(tMatch[1], 10) : startupN + activeN + recoveryN;

  const pStart = Math.max(8, Math.round((Math.max(1, activeStart - 1) / totalN) * 100));
  const pAct = Math.max(8, Math.round((activeN / totalN) * 100));
  const pRec = Math.max(10, 100 - pStart - pAct);

  const translatedInput = translateNotation(fc.input, game.sagaId, state.notationMode);

  return `
    <div style="width:100%;padding:12px 10px;background:#1a1c20;border:1px solid rgba(255,255,255,0.08);border-radius:6px;display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;font-family:var(--font-mono);font-size:0.65rem;color:#c4c4c4;">
        <span>${translatedInput}</span>
        <span style="color:#fda4af;">Activa: F${activeStart}–${activeEnd}</span>
      </div>
      <div style="display:flex;height:18px;width:100%;border-radius:4px;overflow:hidden;border:1px solid rgba(255,255,255,0.12);background:#000;">
        <div style="width:${pStart}%;background:#15803d;" title="Startup: ${Math.max(0, activeStart - 1)}f"></div>
        <div style="width:${pAct}%;background:#e11d48;" title="Hitbox Activa: ${activeN}f"></div>
        <div style="width:${pRec}%;background:#6d28d9;" title="Recovery: ${recoveryN}f"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.6rem;color:#9b9b9b;">
        <span>Start ${startupN}f</span>
        <span>Act ${activeN}f</span>
        <span>Rec ${recoveryN}f</span>
      </div>
    </div>
  `;
}

const clientHitboxCache = new Map();
const clientCharVideoCache = new Map();

async function hydrateCharacterVideo(game, ch, modalBody) {
  if (!game || !ch || !modalBody) return;
  const cacheKey = `${game.id}:${ch.id}`;
  let embedUrl = clientCharVideoCache.get(cacheKey);
  if (embedUrl === undefined) {
    try {
      const res = await fetch(
        `/api/char-video?gameTitle=${encodeURIComponent(game.title)}&charName=${encodeURIComponent(ch.name)}`
      );
      if (res.ok) {
        const data = await res.json();
        embedUrl = data?.embedUrl || null;
        clientCharVideoCache.set(cacheKey, embedUrl);
      }
    } catch (_) {
      embedUrl = null;
    }
  }
  if (embedUrl) {
    const iframeEl = modalBody.querySelector("#charModalVideoIframe");
    if (iframeEl && iframeEl.src !== embedUrl) {
      iframeEl.src = embedUrl;
    }
  }
}

function getMoveOverlayBoxes(fc) {
  const rawDesc = `${fc.moveName || ""} ${fc.input || ""} ${fc.category || ""}`.toLowerCase();
  if (rawDesc.includes("low") || rawDesc.includes("sweep") || rawDesc.includes("2mk") || rawDesc.includes("2d") || rawDesc.includes("d+4") || rawDesc.includes("db+3")) {
    return `<div class="hb-box-hurt" style="bottom:16px;left:28%;width:24%;height:48%;"></div><div class="hb-box-hit" style="bottom:14px;left:48%;width:28%;height:18%;">HITBOX LOW</div>`;
  }
  if (rawDesc.includes("anti-air") || rawDesc.includes("up ") || rawDesc.includes("623") || rawDesc.includes("2hp") || rawDesc.includes("2h") || rawDesc.includes("6p") || rawDesc.includes("df+2") || rawDesc.includes("uf+4")) {
    return `<div class="hb-box-hurt" style="bottom:20px;left:28%;width:22%;height:56%;"></div><div class="hb-box-hit" style="bottom:48px;left:46%;width:24%;height:38%;">HITBOX AA</div>`;
  }
  if (rawDesc.includes("throw") || rawDesc.includes("grab")) {
    return `<div class="hb-box-hurt" style="bottom:18px;left:28%;width:22%;height:54%;"></div><div class="hb-box-hit hb-box-throw" style="bottom:36px;left:45%;width:24%;height:34%;">THROW</div>`;
  }
  return `<div class="hb-box-hurt" style="bottom:18px;left:28%;width:22%;height:54%;"></div><div class="hb-box-hit" style="bottom:46px;left:48%;width:26%;height:22%;">HITBOX</div>`;
}

async function hydrateCharacterRealHitboxes(game, ch, modalBody) {
  if (!game || !ch || !modalBody) return;
  const cacheKey = `${game.id}:${ch.id}`;
  let hbMap = clientHitboxCache.get(cacheKey);

  if (!hbMap) {
    try {
      const res = await fetch(
        `/api/char-hitboxes?gameId=${encodeURIComponent(game.id)}&charName=${encodeURIComponent(ch.name)}`
      );
      if (res.ok) {
        const data = await res.json();
        hbMap = data?.hitboxes || {};
        clientHitboxCache.set(cacheKey, hbMap);
      }
    } catch (_) {
      hbMap = {};
    }
  }

  if (!hbMap || Object.keys(hbMap).length === 0) return;

  modalBody.querySelectorAll("[data-hbmove]").forEach((boxEl) => {
    const moveName = boxEl.dataset.hbmove;
    const entry = hbMap[moveName];
    if (!entry || !entry.url) return;

    const proxyUrl = `/api/hitbox-media?url=${encodeURIComponent(entry.url)}`;
    const mediaWrap = boxEl.querySelector(".ufd-real-hitbox-wrap");
    if (!mediaWrap) return;

    const fcObj = (ch.frameDataCards || []).find((c) => c.moveName === moveName);
    const overlayBoxes = entry.hasNativeHitbox ? "" : getMoveOverlayBoxes(fcObj || { moveName });

    if (entry.type === "video") {
      mediaWrap.innerHTML = `
        <div class="hb-real-media-stage">
          <video src="${proxyUrl}" autoplay loop muted playsinline></video>
          ${overlayBoxes}
          <span class="hb-overlay-tag">${entry.source}</span>
        </div>
      `;
    } else {
      mediaWrap.innerHTML = `
        <div class="hb-real-media-stage">
          <img src="${proxyUrl}" alt="Hitbox real de ${moveName} (${ch.name})" />
          ${overlayBoxes}
          <span class="hb-overlay-tag">${entry.source}</span>
        </div>
      `;
    }

    const cap = boxEl.querySelector(".ufd-hitbox-caption");
    if (cap) {
      cap.textContent = `🔍 Clic para ver frame a frame (${entry.source})`;
    }

    if (fcObj) {
      const updatedPayload = {
        ...fcObj,
        translatedInput: translateNotation(fcObj.input, game.sagaId, state.notationMode),
        charId: ch.id,
        charName: ch.name,
        gameId: game.id,
        charImgUrl: clientPortraitCache.get(ch.id) || ch.iconUrl,
        fallbackSrc: ch.fallbackIconUrl || ch.iconUrl,
        realHitboxUrl: proxyUrl,
        realHitboxType: entry.type,
        realHitboxSource: entry.source,
        hasNativeHitbox: Boolean(entry.hasNativeHitbox)
      };
      boxEl.setAttribute(
        "onclick",
        `window.openHitboxInspector('${encodeURIComponent(JSON.stringify(updatedPayload))}')`
      );
    }
  });
}

// =========================================================================
// MODAL DE GUÍA INDIVIDUAL DE PERSONAJE
// =========================================================================
function openCharacterModal(gameId, charId) {
  const game = state.games.find((g) => g.id === gameId);
  if (!game) return;
  const ch = game.characters.find((c) => c.id === charId);
  if (!ch) return;

  state.selectedCharacter = { gameId, charId };

  const backdrop = document.getElementById("characterModalBackdrop");
  const header = document.getElementById("charModalHeader");
  const body = document.getElementById("charModalBody");

  const lockBadge = ch.isUnreleased
    ? `<span class="dlc-pack-badge" style="background:#C05530;color:#fff;border-color:#C05530;font-size:0.78rem;">🔒 ${ch.releaseWindow || "Anunciado — Próximamente"}</span>`
    : "";

  const statusBadge = ch.isDLC
    ? `<span class="dlc-pack-badge" style="font-size:0.8rem;">DLC DE PAGO — Pack: ${ch.dlcPack}</span>`
    : `<span class="base-game-badge" style="font-size:0.8rem;">INCLUIDO EN EL JUEGO BASE</span>`;

  const cachedSrc = clientPortraitCache.get(ch.id) || ch.iconUrl;
  const fallbackSrc = (ch.fallbackIconUrl || ch.iconUrl).replace(/'/g, "\\'");
  const safeName = ch.name.replace(/'/g, "\\'");

  // Agrupar las tarjetas visuales de Frame Data estilo UltimateFrameData por categoría
  const fdCards = ch.frameDataCards || [];
  const fdCategories = [...new Set(fdCards.map((c) => c.category || "Ground Attacks"))];

  const fdBlocksHTML = fdCategories
    .map((catName) => {
      const cardsInCat = fdCards.filter((c) => (c.category || "Ground Attacks") === catName);
      return `
        <div class="ufd-section-banner">${catName}</div>
        <div class="ufd-cards-grid">
          ${cardsInCat
            .map((fc) => {
              const inspectorPayload = {
                ...fc,
                translatedInput: translateNotation(fc.input, game.sagaId, state.notationMode),
                charId: ch.id,
                charName: ch.name,
                gameId: game.id,
                charImgUrl: clientPortraitCache.get(ch.id) || ch.iconUrl,
                fallbackSrc: ch.fallbackIconUrl || ch.iconUrl
              };
              return `
              <div class="ufd-card">
                <div class="ufd-card-title">
                  <span>${fc.moveName}</span>
                  <span class="ufd-card-input">${translateNotation(
                    fc.input,
                    game.sagaId,
                    state.notationMode
                  )}</span>
                </div>
                <div class="ufd-bar ufd-bar-startup">${fc.startup}</div>
                <div class="ufd-bar ufd-bar-active">${fc.active}</div>
                <div class="ufd-bar ufd-bar-recovery">${fc.recovery}</div>
                <div class="ufd-bar ufd-bar-onblock">${fc.onBlock}</div>
                <div
                  class="ufd-hitbox-box"
                  data-hbmove="${fc.moveName.replace(/"/g, "&quot;")}"
                  title="Haz clic para abrir el Inspector de Hitbox Frame a Frame con ${ch.name}"
                  onclick="window.openHitboxInspector('${encodeURIComponent(JSON.stringify(inspectorPayload))}')"
                >
                  <div class="ufd-real-hitbox-wrap" style="width:100%;">
                    ${buildCharacterHitboxStageHTML(game, ch, fc)}
                  </div>
                  <div class="ufd-hitbox-caption">🔍 Clic para ver frame a frame la imagen de hitbox</div>
                </div>
                <div class="ufd-card-notes">${fc.notes}</div>
                <div class="ufd-card-footer">${fc.totalFrames}</div>
              </div>
            `;
            })
            .join("")}
        </div>
      `;
    })
    .join("");

  // Construir bloque de Matchups: Contra quién tiene Ventaja y Quién le hace Counter con el porqué
  const favList = ch.matchups?.favorable || [];
  const counterList = ch.matchups?.counters || [];

  const matchupsHTML = `
    <div class="ufd-section-banner">
      Matchups — Ventajas y Counters de ${ch.name}
    </div>
    <div class="matchups-grid">
      <div class="matchup-column favorable-col">
        <h4 style="color:#34d399;font-family:var(--font-display);font-size:1.08rem;">
          Tiene Ventaja contra (Matchups Favorables)
        </h4>
        <p style="font-size:0.78rem;color:#94a3b8;">Personajes a los que ${ch.name} domina y por qué:</p>
        ${favList
          .map((m) => {
            const oppSrc = (m.opponentId && clientPortraitCache.get(m.opponentId)) || m.opponentIcon;
            const oppSafeName = (m.opponentName || "").replace(/'/g, "\\'");
            return `
            <div class="matchup-item">
              <div class="portrait-img-box" style="width:54px;height:54px;flex-shrink:0;">
                <img
                  data-charimg="${m.opponentId || ""}"
                  src="${oppSrc}"
                  alt="${m.opponentName}"
                  referrerpolicy="no-referrer"
                  onload="window.handlePortraitLoad(this)"
                  onerror="window.handlePortraitError(this, '${game.id}', '${m.opponentId || ""}', '${oppSafeName}', '${m.opponentIcon}')"
                />
              </div>
              <div>
                <div class="matchup-opp-name">${m.opponentName} <span style="font-size:0.74rem;color:#34d399;">(${m.opponentArchetype || ""})</span></div>
                <div class="matchup-reason"><strong>Por qué tiene ventaja:</strong> ${m.reason}</div>
              </div>
            </div>
          `;
          })
          .join("")}
      </div>

      <div class="matchup-column counter-col">
        <h4 style="color:#f87171;font-family:var(--font-display);font-size:1.08rem;">
          Le hacen Counter (Matchups Desfavorables)
        </h4>
        <p style="font-size:0.78rem;color:#94a3b8;">Personajes que complican a ${ch.name} y por qué:</p>
        ${counterList
          .map((m) => {
            const oppSrc = (m.opponentId && clientPortraitCache.get(m.opponentId)) || m.opponentIcon;
            const oppSafeName = (m.opponentName || "").replace(/'/g, "\\'");
            return `
            <div class="matchup-item">
              <div class="portrait-img-box" style="width:54px;height:54px;flex-shrink:0;">
                <img
                  data-charimg="${m.opponentId || ""}"
                  src="${oppSrc}"
                  alt="${m.opponentName}"
                  referrerpolicy="no-referrer"
                  onload="window.handlePortraitLoad(this)"
                  onerror="window.handlePortraitError(this, '${game.id}', '${m.opponentId || ""}', '${oppSafeName}', '${m.opponentIcon}')"
                />
              </div>
              <div>
                <div class="matchup-opp-name">${m.opponentName} <span style="font-size:0.74rem;color:#f87171;">(${m.opponentArchetype || ""})</span></div>
                <div class="matchup-reason"><strong>Por qué le hace counter:</strong> ${m.reason}</div>
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
  `;

  header.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;">
      <div class="portrait-img-box" style="width:68px;height:68px;border:2px solid #f59e0b;flex-shrink:0;">
        <img
          data-charimg="${ch.id}"
          src="${cachedSrc}"
          alt="${ch.name}"
          referrerpolicy="no-referrer"
          onload="window.handlePortraitLoad(this)"
          onerror="window.handlePortraitError(this, '${game.id}', '${ch.id}', '${safeName}', '${fallbackSrc}')"
        />
      </div>
      <div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:5px;">
          ${lockBadge}
          ${statusBadge}
          <span class="diff-badge">Arquetipo: ${ch.archetype}</span>
          <span class="diff-badge">Dificultad: ${ch.difficulty}</span>
          <span class="diff-badge">${ch.recommendedSubSystem || game.subSystemName}</span>
        </div>
        <h2 style="font-family:var(--font-display);font-size:1.65rem;">
          ${ch.name} <span style="color:#94a3b8;font-size:1rem;">(${game.title})</span>
        </h2>
      </div>
    </div>
    <button class="btn-close-modal" id="btnCloseCharModal">✕</button>
  `;

  const comp = ch.spanishCompilation || {
    subtitleLang: "Español (Subtítulos activados)",
    compilationNote: `Recopilación traducida al español con pausas explicativas de ${ch.name}.`,
    pauses: []
  };

  body.innerHTML = `
    <div class="guide-split-layout">
      <div>
        <div class="video-panel-card" style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
            <div class="hero-pill" style="margin:0;">RECOPILACIÓN EN ESPAÑOL + SUBTÍTULOS + PAUSAS</div>
            <span class="base-game-badge">${comp.subtitleLang}</span>
          </div>
          <div class="video-frame-wrapper">
            <iframe
              id="charModalVideoIframe"
              src="${ch.videoUrl}"
              title="Guía de ${ch.name}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <!-- SUPERPOSICIÓN FLOTANTE DE AUTO-PAUSA EXPLICATIVA EN ESPAÑOL -->
            <div id="charVideoPauseOverlay" class="video-pause-overlay hidden"></div>
          </div>
          <p style="font-size:0.86rem;color:#e2e8f0;margin-top:6px;">
            <strong>Resumen:</strong> ${ch.overview}
          </p>

          <!-- PAUSAS EXPLICATIVAS EN ESPAÑOL DEL VÍDEO -->
          <div style="margin-top:12px;">
            <strong style="font-size:0.82rem;color:#fbbf24;display:block;margin-bottom:6px;">
              Pausas Tácticas Explicativas en Español (Haz clic para ir al segundo exacto):
            </strong>
            ${(comp.pauses || [])
              .map(
                (p) => `
                <div class="pause-step-box" style="cursor:pointer;" data-seeksec="${p.seconds || 0}">
                  <div>
                    <span class="pause-time-badge">Pausa ${p.timestamp}</span>
                    <strong style="font-size:0.83rem;color:#f8fafc;">${p.title}</strong>
                  </div>
                  <p style="font-size:0.79rem;color:#cbd5e1;margin-top:4px;">${p.explanation}</p>
                </div>
              `
              )
              .join("")}
          </div>
        </div>

        <div class="guide-section-item">
          <h4>Plan de Juego (Gameplan en Neutro y Presión)</h4>
          <p>${ch.gameplan}</p>
          <div style="margin-top:12px;">
            <a href="${ch.sourceUrl}" target="_blank" rel="noopener" class="source-link">
              Ver Frame Data completa en Wiki Oficial ➔
            </a>
          </div>
        </div>
      </div>

      <div>
        <div class="text-panel-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div class="hero-pill" style="margin:0;">GUÍA EN TEXTO Y COMBOS BNB</div>
            <span style="font-size:0.76rem;color:#fbbf24;">
              Modo: <strong>${
                state.notationMode === "technical"
                  ? "Notación Técnica"
                  : state.notationMode === "ps"
                  ? "PlayStation (▢ △ ✕ ○)"
                  : state.notationMode === "xbox"
                  ? "Xbox (X Y A B)"
                  : "Nintendo Switch (Y X B A)"
              }</strong>
            </span>
          </div>

          <h4 style="margin-top:6px;font-family:var(--font-display);">1. Botones Clave y Movimientos Principales</h4>
          <table class="moves-table">
            <thead>
              <tr>
                <th>Comando</th>
                <th>Frames / Tipo</th>
                <th>Uso en partida</th>
              </tr>
            </thead>
            <tbody>
              ${(ch.keyMoves || [])
                .map(
                  (m) => `
                  <tr>
                    <td><span class="code-input-pill">${translateNotation(
                      m.input,
                      game.sagaId,
                      state.notationMode
                    )}</span></td>
                    <td style="font-family:var(--font-mono);font-size:0.78rem;color:#cbd5e1;">${m.frames}</td>
                    <td>${m.notes}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>

          <h4 style="margin-bottom:10px;font-family:var(--font-display);">2. Combos Básicos y Óptimos (Bread & Butter)</h4>
          ${(ch.combos || [])
            .map(
              (cb) => `
              <div class="combo-box">
                <div class="combo-box-header">
                  <strong>${cb.type}</strong>
                  <span style="color:#34d399;font-weight:700;">${cb.damage}</span>
                </div>
                <div class="combo-string">
                  ${translateNotation(cb.notation, game.sagaId, state.notationMode)}
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      </div>
    </div>

    <!-- TARJETAS DE FRAME DATA ESTILO ULTIMATEFRAMEDATA (STARTUP, ACTIVE, RECOVERY, ON BLOCK/SHIELD) -->
    ${fdBlocksHTML}

    <!-- SECCIÓN DE MATCHUPS: VENTAJAS Y COUNTERS CON EL PORQUÉ -->
    ${matchupsHTML}
  `;

  backdrop.classList.remove("hidden");

  if (typeof window.decorateTextWithGlossaryTooltips === "function") {
    window.decorateTextWithGlossaryTooltips(body);
  }

  // Permitir saltar al segundo exacto de cada pausa explicativa mostrando el Overlay táctico en español
  body.querySelectorAll("[data-seeksec]").forEach((pauseEl, idx) => {
    pauseEl.addEventListener("click", () => {
      const pObj = (comp.pauses || [])[idx] || {
        timestamp: "00:45",
        seconds: Number(pauseEl.dataset.seeksec || 0),
        title: "Pausa Táctica Explicativa",
        explanation: "Análisis detallado del frame trap y confirmación."
      };
      if (typeof window.triggerVideoTacticalPauseOverlay === "function") {
        window.triggerVideoTacticalPauseOverlay(
          "charModalVideoIframe",
          "charVideoPauseOverlay",
          ch.videoUrl,
          pObj
        );
      }
    });
  });

  document.getElementById("btnCloseCharModal").onclick = () => {
    backdrop.classList.add("hidden");
    state.selectedCharacter = null;
  };

  hydrateCharacterRealHitboxes(game, ch, body);
  hydrateCharacterVideo(game, ch, body);
}

// =========================================================================
// CANAL OFICIAL DE YOUTUBE (VISTA DEDICADA + PREVIEW EN PORTADA + PAUSAS INTERACTIVAS)
// =========================================================================
function buildPlaylistCardHTML(pl, prefix = "ytpage") {
  const iframeId = `${prefix}_iframe_${pl.gameId}`;
  const overlayId = `${prefix}_overlay_${pl.gameId}`;
  const watchUrl = pl.watchUrl || pl.embedUrl.replace("/embed/", "/watch?v=").split("?")[0];

  return `
    <div class="video-panel-card" style="display:flex;flex-direction:column;justify-content:space-between;">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <span class="news-cat-badge">${pl.gameTitle}</span>
          <span class="base-game-badge">Subtítulos ES + Pausas</span>
        </div>
        <h4 style="font-family:var(--font-display);font-size:1.05rem;">${pl.playlistTitle}</h4>
        <p style="font-size:0.79rem;color:#94a3b8;margin-top:3px;">${pl.sourcesCompiled}</p>
        <div class="video-frame-wrapper">
          <iframe
            id="${iframeId}"
            src="${pl.embedUrl}"
            title="${pl.playlistTitle}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <div id="${overlayId}" class="video-pause-overlay hidden"></div>
        </div>
        <div style="margin-top:10px;">
          <strong style="font-size:0.76rem;color:#fbbf24;display:block;margin-bottom:6px;">
            Pausas Tácticas Explicativas en Español (Haz clic para ir a la pausa):
          </strong>
          ${(pl.pauses || [])
            .map((p, idx) => {
              const parts = String(p.time || "01:00").split(":").map(Number);
              const secs = p.seconds || (parts.length === 2 ? parts[0] * 60 + parts[1] : 60);
              return `
                <div
                  class="pause-step-box"
                  style="padding:8px 11px;margin-top:6px;font-size:0.78rem;cursor:pointer;"
                  data-ytpause-iframe="${iframeId}"
                  data-ytpause-overlay="${overlayId}"
                  data-ytpause-url="${pl.embedUrl}"
                  data-ytpause-time="${p.time}"
                  data-ytpause-sec="${secs}"
                  data-ytpause-label="${p.label.replace(/"/g, "&quot;")}"
                >
                  <span class="pause-time-badge">⏸ ${p.time}</span>
                  <span style="color:#e2e8f0;font-weight:500;">${p.label}</span>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
      <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
        <button class="btn btn-outline" data-opengamefromyt="${pl.gameId}" style="padding:6px 12px;font-size:0.76rem;">
          Ir al Hub de ${pl.gameTitle}
        </button>
        <a href="${watchUrl}" target="_blank" rel="noopener" class="news-source-link" style="font-size:0.78rem;">
          Ver en YouTube ➔
        </a>
      </div>
    </div>
  `;
}

function attachYoutubePlaylistPauseEvents(container) {
  if (!container) return;
  container.querySelectorAll("[data-ytpause-iframe]").forEach((box) => {
    box.addEventListener("click", () => {
      const iframeId = box.dataset.ytpauseIframe;
      const overlayId = box.dataset.ytpauseOverlay;
      const embedUrl = box.dataset.ytpauseUrl;
      const pauseObj = {
        timestamp: box.dataset.ytpauseTime || "01:00",
        seconds: Number(box.dataset.ytpauseSec || 60),
        title: `Pausa Táctica Explicativa (${box.dataset.ytpauseTime})`,
        explanation: box.dataset.ytpauseLabel
      };
      if (typeof window.triggerVideoTacticalPauseOverlay === "function") {
        window.triggerVideoTacticalPauseOverlay(iframeId, overlayId, embedUrl, pauseObj);
      }
    });
  });

  container.querySelectorAll("[data-opengamefromyt]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const gId = btn.dataset.opengamefromyt;
      document.getElementById("youtubeModalBackdrop")?.classList.add("hidden");
      openGameHub(gId, "page-basic");
    });
  });
}

function renderYoutubeModal() {
  if (!state.youtubeChannel) return;

  const yt = state.youtubeChannel;
  const publicUrl = yt.publicUrl || "https://www.youtube.com/results?search_query=FGC+Frame+Data+Gu%C3%ADa";
  const playlistsByGame = yt.playlistsByGame || [];

  // 1. Renderizar preview de 3 listas en la portada principal (#homeYoutubePreviewGrid)
  const homePreviewGrid = document.getElementById("homeYoutubePreviewGrid");
  if (homePreviewGrid) {
    homePreviewGrid.innerHTML = playlistsByGame
      .slice(0, 3)
      .map((pl) => buildPlaylistCardHTML(pl, "homeyt"))
      .join("");
    attachYoutubePlaylistPauseEvents(homePreviewGrid);
  }

  // 2. Construir el bloque completo del Canal de YouTube para #youtubeView y #youtubeModalBody
  const fullChannelHTML = (prefix) => `
    <div class="yt-banner-preview" style="justify-content:space-between;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:16px;max-width:720px;">
        <div class="yt-avatar-circle">FGC</div>
        <div>
          <div class="hero-pill" style="margin-bottom:6px;">VIDEOTECA OFICIAL EN ESPAÑOL</div>
          <h2 style="font-family:var(--font-display);font-size:1.55rem;">${yt.name}</h2>
          <div style="color:#fca5a5;font-family:var(--font-mono);font-size:0.84rem;margin-top:2px;">
            ${yt.handle} • Recopilaciones Traducidas con Subtítulos ES + Pausas Explicativas
          </div>
          <p style="font-size:0.86rem;color:#e2e8f0;margin-top:6px;">${yt.description}</p>
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <a href="${publicUrl}" target="_blank" rel="noopener" class="btn btn-primary">
          Buscar más guías en YouTube ➔
        </a>
      </div>
    </div>

    <div class="ufd-section-banner" style="margin-top:8px;">
      Listas de Reproducción por Juego (${playlistsByGame.length} Sagas • Subtítulos en Español y Pausas Interactivas)
    </div>

    <div class="news-grid">
      ${playlistsByGame.map((pl) => buildPlaylistCardHTML(pl, prefix)).join("")}
    </div>
  `;

  const pageContainer = document.getElementById("youtubePageContainer");
  if (pageContainer) {
    pageContainer.innerHTML = fullChannelHTML("ytview");
    attachYoutubePlaylistPauseEvents(pageContainer);
  }

  const modalBody = document.getElementById("youtubeModalBody");
  if (modalBody) {
    modalBody.innerHTML = fullChannelHTML("ytmodal");
    attachYoutubePlaylistPauseEvents(modalBody);
  }
}

function openYoutubePage() {
  state.selectedGameId = null;
  setActiveTopNav("btnOpenYoutubeModal");
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("gameDetailView").classList.add("hidden");
  document.getElementById("newsView").classList.add("hidden");
  document.getElementById("communityView").classList.add("hidden");
  document.getElementById("toolsView")?.classList.add("hidden");
  document.getElementById("youtubeView")?.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderYoutubeModal();
}

// =========================================================================
// EVENT LISTENERS GLOBALES
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadBootstrap();

  const goHome = () => {
    state.selectedGameId = null;
    setActiveTopNav("btnNavHome");
    document.getElementById("gameDetailView").classList.add("hidden");
    document.getElementById("newsView").classList.add("hidden");
    document.getElementById("communityView").classList.add("hidden");
    document.getElementById("toolsView")?.classList.add("hidden");
    document.getElementById("youtubeView")?.classList.add("hidden");
    document.getElementById("homeView").classList.remove("hidden");
  };
  document.getElementById("btnHomeBrand").addEventListener("click", goHome);
  document.getElementById("btnNavHome")?.addEventListener("click", goHome);
  document.getElementById("btnBackToCatalog").addEventListener("click", goHome);
  document.getElementById("btnBackFromNews").addEventListener("click", goHome);
  document.getElementById("btnBackFromCommunity").addEventListener("click", goHome);
  document.getElementById("btnBackFromTools")?.addEventListener("click", goHome);
  document.getElementById("btnBackFromYoutube")?.addEventListener("click", goHome);

  // Abrir Herramientas Interactivas (Test de 10 preguntas, Calculadora de Castigos y Glosario)
  document.getElementById("btnOpenToolsView")?.addEventListener("click", () => openToolsPage("tool-quiz"));
  document.getElementById("btnPromoOpenQuiz")?.addEventListener("click", () => openToolsPage("tool-quiz"));
  document.getElementById("btnPromoOpenPunish")?.addEventListener("click", () => openToolsPage("tool-punish"));

  document.querySelectorAll("[data-tooltab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openToolsPage(btn.dataset.tooltab);
    });
  });

  // Abrir vista de Noticias y Competitivo
  document.getElementById("btnOpenNewsView").addEventListener("click", openNewsPage);
  const seeAllNewsBtn = document.getElementById("btnSeeAllNews");
  if (seeAllNewsBtn) {
    seeAllNewsBtn.addEventListener("click", openNewsPage);
  }

  // Abrir vista de Wikis, Canales de YouTube y Qué Falta
  document.getElementById("btnOpenCommunityView").addEventListener("click", openCommunityPage);

  // Enviar nuevo recurso de la comunidad (Wiki / Canal de YouTube / Qué falta)
  const commForm = document.getElementById("communityResourceForm");
  if (commForm) {
    commForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        category: document.getElementById("commCategorySelect").value,
        targetGame: document.getElementById("commTargetGameInput").value,
        title: document.getElementById("commTitleInput").value,
        url: document.getElementById("commUrlInput").value,
        description: document.getElementById("commDescInput").value,
        missingNotes: document.getElementById("commMissingInput").value,
        author: document.getElementById("commAuthorInput").value
      };

      const res = await fetch("/api/community-resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        state.communityResources = data.communityResources || state.communityResources;
        state.missingContentRoadmap = data.missingContentRoadmap || state.missingContentRoadmap;
        commForm.reset();
        renderCommunitySection();
        alert("Tu aporte y resumen han sido registrados para su valoración.");
      }
    });
  }

  // Filtros de categorías y fechas de Noticias
  document.querySelectorAll("#newsCategoryTabs .saga-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("#newsCategoryTabs .saga-tab-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.selectedNewsCategory = btn.dataset.newscat;
      renderNewsSections();
    });
  });

  const newsSearchInput = document.getElementById("newsSearchInput");
  const newsDateFrom = document.getElementById("newsDateFrom");
  const newsDateTo = document.getElementById("newsDateTo");
  const newsQuickPeriod = document.getElementById("newsQuickPeriod");
  const btnResetNewsFilters = document.getElementById("btnResetNewsFilters");

  if (newsSearchInput) {
    newsSearchInput.addEventListener("input", (e) => {
      state.newsSearchQuery = e.target.value;
      renderNewsSections();
    });
  }
  if (newsDateFrom) {
    newsDateFrom.addEventListener("change", (e) => {
      state.newsDateFrom = e.target.value;
      renderNewsSections();
    });
  }
  if (newsDateTo) {
    newsDateTo.addEventListener("change", (e) => {
      state.newsDateTo = e.target.value;
      renderNewsSections();
    });
  }
  if (newsQuickPeriod) {
    newsQuickPeriod.addEventListener("change", (e) => {
      state.newsQuickPeriod = e.target.value;
      renderNewsSections();
    });
  }
  if (btnResetNewsFilters) {
    btnResetNewsFilters.addEventListener("click", () => {
      state.newsSearchQuery = "";
      state.newsDateFrom = "";
      state.newsDateTo = "";
      state.newsQuickPeriod = "all";
      if (newsSearchInput) newsSearchInput.value = "";
      if (newsDateFrom) newsDateFrom.value = "";
      if (newsDateTo) newsDateTo.value = "";
      if (newsQuickPeriod) newsQuickPeriod.value = "all";
      renderNewsSections();
    });
  }

  document.getElementById("globalNotationSelect").addEventListener("change", (e) => {
    state.notationMode = e.target.value;
    if (state.selectedGameId) {
      renderGameDetailView(state.selectedGameId);
    }
    if (state.selectedCharacter) {
      openCharacterModal(state.selectedCharacter.gameId, state.selectedCharacter.charId);
    }
    if (typeof window.initPunishCalculator === "function") {
      window.initPunishCalculator();
    }
  });

  document.getElementById("searchGameOrCharInput").addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderQuickSearch();
    renderGamesGrid();
  });

  const inGameSearch = document.getElementById("inGameCharSearch");
  if (inGameSearch) {
    inGameSearch.addEventListener("input", (e) => {
      state.inGameSearchQuery = e.target.value;
      if (state.selectedGameId) {
        renderGameDetailView(state.selectedGameId);
      }
    });
  }

  document.querySelectorAll(".game-tab[data-subpage]").forEach((tab) => {
    tab.addEventListener("click", () => {
      switchGameSubpage(tab.dataset.subpage);
    });
  });

  document.querySelectorAll("[data-goto-subpage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchGameSubpage(btn.dataset.gotoSubpage);
    });
  });

  const ytModal = document.getElementById("youtubeModalBackdrop");
  document.getElementById("btnOpenYoutubeModal").addEventListener("click", openYoutubePage);
  document.getElementById("btnHomeOpenYoutubeView")?.addEventListener("click", openYoutubePage);
  document.getElementById("btnCloseYoutubeModal").addEventListener("click", () => {
    ytModal.classList.add("hidden");
  });
});
