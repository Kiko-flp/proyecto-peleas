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
      imgEl.src = found;
      return;
    }
  }
  if (fallbackUrl && imgEl.src !== fallbackUrl && !imgEl.dataset.usedFallback) {
    imgEl.dataset.usedFallback = "1";
    imgEl.src = fallbackUrl;
  }
};

// =========================================================================
// RESOLUTOR DE RETRATOS EN EL NAVEGADOR (CON pilimit=50 Y BÚSQUEDA INDIVIDUAL)
// =========================================================================
const FANDOM_WIKIS = {
  mk1: "https://mortalkombat.fandom.com/api.php",
  sf6: "https://streetfighter.fandom.com/api.php",
  tekken8: "https://tekken.fandom.com/api.php",
  dbfz: "https://dragonballfighterz.fandom.com/api.php",
  "gg-strive": "https://guiltygear.fandom.com/api.php"
};

async function searchSingleCharacterPortrait(gameId, charName) {
  const cleanName = charName.replace(/\s+\(.*?\)/g, "").trim();
  const endpoints = [
    FANDOM_WIKIS[gameId],
    "https://en.wikipedia.org/w/api.php"
  ].filter(Boolean);

  for (const api of endpoints) {
    try {
      const url = `${api}?action=query&generator=search&gsrsearch=${encodeURIComponent(
        cleanName
      )}&gsrlimit=3&prop=pageimages&piprop=thumbnail&pithumbsize=320&pilimit=10&format=json&origin=*`;
      const res = await fetch(url);
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

  const chars = game.characters.filter((c) => !clientPortraitCache.has(c.id));
  for (let i = 0; i < chars.length; i += 20) {
    const chunk = chars.slice(i, i + 20);
    const titleMap = {};
    chunk.forEach((c) => {
      const cleanTitle = c.name.replace(/\s+\(.*?\)/g, "").trim();
      titleMap[cleanTitle.toLowerCase()] = c;
    });

    const titlesParam = Object.keys(titleMap)
      .map((k) => titleMap[k].name.replace(/\s+\(.*?\)/g, "").trim())
      .join("|");

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
          chunk.find((c) =>
            pageTitle.includes(c.name.split(" ")[0].toLowerCase())
          );

        if (matchedChar) {
          resolvedInChunk.add(matchedChar.id);
          clientPortraitCache.set(matchedChar.id, thumb);
          matchedChar.iconUrl = thumb;
          document
            .querySelectorAll(`img[data-charimg="${matchedChar.id}"]`)
            .forEach((imgEl) => {
              imgEl.src = thumb;
            });
        }
      });

      for (const ch of chunk) {
        if (!resolvedInChunk.has(ch.id) && !clientPortraitCache.has(ch.id)) {
          searchSingleCharacterPortrait(game.id, ch.name).then((foundUrl) => {
            if (foundUrl) {
              clientPortraitCache.set(ch.id, foundUrl);
              ch.iconUrl = foundUrl;
              document
                .querySelectorAll(`img[data-charimg="${ch.id}"]`)
                .forEach((imgEl) => {
                  imgEl.src = foundUrl;
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
// TRADUCTOR INTERACTIVO DE NOTACIÓN DE LUCHA
// =========================================================================
function translateNotation(text, sagaId, mode) {
  if (!text || mode === "technical") return text;

  const isPS = mode === "ps";
  let out = text;

  out = out
    .replace(/\b236236/g, "↓↘→↓↘→")
    .replace(/\b214214/g, "↓↙←↓↙←")
    .replace(/\b236/g, "↓↘→")
    .replace(/\b214/g, "↓↙←")
    .replace(/\b623/g, "→↓↘");

  if (sagaId === "mortal-kombat" || sagaId === "tekken") {
    const map = isPS
      ? { "1+2": "▢+△", "3+4": "✕+○", "1+3": "▢+✕", "1": "▢", "2": "△", "3": "✕", "4": "○" }
      : { "1+2": "X+Y", "3+4": "A+B", "1+3": "X+A", "1": "X", "2": "Y", "3": "A", "4": "B" };

    out = out
      .replace(/1\+2/g, map["1+2"])
      .replace(/3\+4/g, map["3+4"])
      .replace(/1\+3/g, map["1+3"])
      .replace(/\b1\b/g, map["1"])
      .replace(/\b2\b/g, map["2"])
      .replace(/\b3\b/g, map["3"])
      .replace(/\b4\b/g, map["4"]);
  } else if (sagaId === "street-fighter") {
    const map = isPS
      ? { LP: "▢", MP: "△", HP: "R1", LK: "✕", MK: "○", HK: "R2" }
      : { LP: "X", MP: "Y", HP: "RB", LK: "A", MK: "B", HK: "RT" };
    Object.keys(map).forEach((k) => {
      out = out.replace(new RegExp(k, "g"), map[k]);
    });
  } else if (sagaId === "dragon-ball-fighterz") {
    const map = isPS
      ? { L: "▢", M: "△", H: "○", S: "✕" }
      : { L: "X", M: "Y", H: "B", S: "A" };
    out = out
      .replace(/\b2L\b/g, `↓${map.L}`)
      .replace(/\b5L\b/g, map.L)
      .replace(/\b2M\b/g, `↓${map.M}`)
      .replace(/\b5M\b/g, map.M)
      .replace(/\b2H\b/g, `↓${map.H}`)
      .replace(/\b5H\b/g, map.H);
  } else if (sagaId === "guilty-gear") {
    const map = isPS
      ? { P: "▢", K: "✕", S: "△", HS: "○", D: "R1" }
      : { P: "X", K: "A", S: "Y", HS: "B", D: "RB" };
    out = out
      .replace(/\bHS\b/g, map.HS)
      .replace(/\b2HS\b/g, `↓${map.HS}`)
      .replace(/\b5HS\b/g, map.HS)
      .replace(/\b6HS\b/g, `→${map.HS}`)
      .replace(/\bc\.S\b/g, `Cerca-${map.S}`)
      .replace(/\bf\.S\b/g, `Lejos-${map.S}`)
      .replace(/\b2S\b/g, `↓${map.S}`)
      .replace(/\b2K\b/g, `↓${map.K}`)
      .replace(/\b5K\b/g, map.K)
      .replace(/\b2D\b/g, `↓${map.D}`);
  }

  return out;
}

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
async function loadBootstrap() {
  try {
    const res = await fetch("/api/bootstrap");
    const data = await res.json();
    state.youtubeChannel = data.youtubeChannel || null;
    state.news = data.news || [];
    state.communityResources = data.communityResources || [];
    state.missingContentRoadmap = data.missingContentRoadmap || [];
    state.sagas = data.sagas || [];
    state.games = data.games || [];
    renderAll();

    fetch("/api/news")
      .then((r) => r.json())
      .then((nData) => {
        if (nData && Array.isArray(nData.news)) {
          state.news = nData.news;
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
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("gameDetailView").classList.add("hidden");
  document.getElementById("newsView").classList.add("hidden");
  document.getElementById("communityView").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderCommunitySection();
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

function renderNewsSections() {
  const homePreview = document.getElementById("homeNewsPreviewGrid");
  if (homePreview) {
    homePreview.innerHTML = state.news
      .slice(0, 3)
      .map((item) => buildNewsCardHTML(item))
      .join("");
  }

  const fullGrid = document.getElementById("fullNewsGridContainer");
  if (fullGrid) {
    let list = state.news.slice();

    // 1. Filtrar por categoría
    if (state.selectedNewsCategory !== "all") {
      list = list.filter((n) => n.category === state.selectedNewsCategory);
    }

    // 2. Filtrar por texto (título, resumen, saga o fuente)
    const q = (state.newsSearchQuery || "").trim().toLowerCase();
    if (q) {
      list = list.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.summary && n.summary.toLowerCase().includes(q)) ||
          (n.saga && n.saga.toLowerCase().includes(q)) ||
          (n.sourceName && n.sourceName.toLowerCase().includes(q))
      );
    }

    // 3. Filtrar por rango de fechas exacto (Desde / Hasta)
    if (state.newsDateFrom) {
      list = list.filter((n) => String(n.isoDate || "") >= state.newsDateFrom);
    }
    if (state.newsDateTo) {
      list = list.filter((n) => String(n.isoDate || "") <= state.newsDateTo);
    }

    // 4. Filtrar por periodo rápido
    if (state.newsQuickPeriod !== "all") {
      if (state.newsQuickPeriod === "2026" || state.newsQuickPeriod === "2025") {
        list = list.filter((n) => String(n.isoDate || "").startsWith(state.newsQuickPeriod));
      } else {
        const days = state.newsQuickPeriod === "30d" ? 30 : 90;
        const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
        list = list.filter((n) => String(n.isoDate || "") >= cutoff);
      }
    }

    const countLabel = document.getElementById("newsFilteredCountLabel");
    if (countLabel) {
      countLabel.textContent = `${list.length} noticias encontradas`;
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
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("gameDetailView").classList.add("hidden");
  document.getElementById("communityView").classList.add("hidden");
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
            <div class="portrait-tile ${ch.isDLC ? "is-dlc" : ""}" data-quickgame="${game.id}" data-quickchar="${ch.id}">
              <div class="portrait-img-box">
                <img
                  data-charimg="${ch.id}"
                  src="${cachedSrc}"
                  alt="${ch.name}"
                  loading="lazy"
                  onload="window.handlePortraitLoad(this)"
                  onerror="window.handlePortraitError(this, '${game.id}', '${ch.id}', '${safeName}', '${fallbackSrc}')"
                />
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
              <div style="font-size:0.79rem;color:#e2e8f0;margin-top:3px;">
                ${saga ? saga.developer : ""} • ${game.releaseYear} • ${game.subSystemName}
              </div>
            </div>
            <div class="game-card-body">
              <p>${game.basicGuide.summary}</p>
              <div class="roster-split-pills">
                <span class="pill-base">${baseChars.length} Personajes Base</span>
                <span class="pill-dlc">${dlcChars.length} Personajes DLC (${uniquePacks.length} Packs)</span>
              </div>
              <div style="font-size:0.77rem;color:#94a3b8;">
                Packs DLC: <strong>${uniquePacks.join(" • ")}</strong>
              </div>
            </div>
          </div>
          <div class="game-card-footer">
            <span>Entrar a Guía Básica, Avanzada y Plantel (${game.characters.length})</span>
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

  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("newsView").classList.add("hidden");
  document.getElementById("communityView").classList.add("hidden");
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
      <button class="btn btn-outline" id="btnSuggestResourceForGame">Aportar Wiki / Canal para ${game.title}</button>
    </div>
  `;

  document.getElementById("btnSuggestResourceForGame").addEventListener("click", () => {
    openCommunityPage();
    const targetInput = document.getElementById("commTargetGameInput");
    if (targetInput) {
      targetInput.value = game.title;
      targetInput.focus();
    }
  });

  document.getElementById("gameNotationBanner").innerHTML = `
    <strong>Notación (${saga ? saga.name : game.title}):</strong> ${
    saga ? saga.notationLegend : ""
  }
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

  return `
    <div
      class="portrait-tile ${ch.isDLC ? "is-dlc" : ""}"
      data-charid="${ch.id}"
      title="${ch.name} — ${ch.archetype} (${ch.isDLC ? ch.dlcPack : "Juego Base"})"
    >
      <div class="portrait-img-box">
        <img
          data-charimg="${ch.id}"
          src="${cachedSrc}"
          alt="${ch.name}"
          loading="lazy"
          onload="window.handlePortraitLoad(this)"
          onerror="window.handlePortraitError(this, '${game.id}', '${ch.id}', '${safeName}', '${fallbackSrc}')"
        />
      </div>
      <div class="portrait-name">${ch.name}</div>
      ${ch.isDLC ? `<div class="portrait-pack-sub">${ch.dlcPack}</div>` : ""}
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
            .map(
              (fc) => `
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
                <div class="ufd-hitbox-box">
                  <img
                    src="${fc.hitboxGifUrl || `/api/hitbox-anim?move=${encodeURIComponent(fc.moveName)}`}"
                    alt="Hitbox de ${fc.moveName}"
                    loading="lazy"
                  />
                  <div class="ufd-hitbox-caption">Hitbox Activa (Rosa) • Hurtbox (Azul)</div>
                </div>
                <div class="ufd-card-notes">${fc.notes}</div>
                <div class="ufd-card-footer">${fc.totalFrames}</div>
              </div>
            `
            )
            .join("")}
        </div>
      `;
    })
    .join("");

  // Construir bloque de Matchups: Contra quién tiene Ventaja y Quién le hace Counter con el porqué
  const favList = ch.matchups?.favorable || [];
  const counterList = ch.matchups?.counters || [];

  const matchupsHTML = `
    <div class="ufd-section-banner" style="background:#38bdf8;color:#090d16;">
      Matchups — Ventajas y Counters de ${ch.name}
    </div>
    <div class="matchups-grid">
      <div class="matchup-column favorable-col">
        <h4 style="color:#34d399;font-family:var(--font-display);font-size:1.08rem;">
          Tiene Ventaja contra (Matchups Favorables)
        </h4>
        <p style="font-size:0.78rem;color:#94a3b8;">Personajes a los que ${ch.name} domina y por qué:</p>
        ${favList
          .map(
            (m) => `
            <div class="matchup-item">
              <div class="portrait-img-box" style="width:54px;height:54px;flex-shrink:0;">
                <img src="${m.opponentIcon}" alt="${m.opponentName}" onload="window.handlePortraitLoad(this)" />
              </div>
              <div>
                <div class="matchup-opp-name">${m.opponentName} <span style="font-size:0.74rem;color:#34d399;">(${m.opponentArchetype || ""})</span></div>
                <div class="matchup-reason"><strong>Por qué tiene ventaja:</strong> ${m.reason}</div>
              </div>
            </div>
          `
          )
          .join("")}
      </div>

      <div class="matchup-column counter-col">
        <h4 style="color:#f87171;font-family:var(--font-display);font-size:1.08rem;">
          Le hacen Counter (Matchups Desfavorables)
        </h4>
        <p style="font-size:0.78rem;color:#94a3b8;">Personajes que complican a ${ch.name} y por qué:</p>
        ${counterList
          .map(
            (m) => `
            <div class="matchup-item">
              <div class="portrait-img-box" style="width:54px;height:54px;flex-shrink:0;">
                <img src="${m.opponentIcon}" alt="${m.opponentName}" onload="window.handlePortraitLoad(this)" />
              </div>
              <div>
                <div class="matchup-opp-name">${m.opponentName} <span style="font-size:0.74rem;color:#f87171;">(${m.opponentArchetype || ""})</span></div>
                <div class="matchup-reason"><strong>Por qué le hace counter:</strong> ${m.reason}</div>
              </div>
            </div>
          `
          )
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
          onload="window.handlePortraitLoad(this)"
          onerror="window.handlePortraitError(this, '${game.id}', '${ch.id}', '${safeName}', '${fallbackSrc}')"
        />
      </div>
      <div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:5px;">
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
                  : "Xbox (X Y A B)"
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

  // Permitir saltar al segundo exacto de cada pausa explicativa en el reproductor
  body.querySelectorAll("[data-seeksec]").forEach((pauseEl) => {
    pauseEl.addEventListener("click", () => {
      const sec = Number(pauseEl.dataset.seeksec || 0);
      const iframe = document.getElementById("charModalVideoIframe");
      if (iframe) {
        const baseUrl = ch.videoUrl.split("?")[0];
        iframe.src = `${baseUrl}?start=${sec}&autoplay=1&cc_load_policy=1&cc_lang_pref=es&hl=es`;
      }
    });
  });

  document.getElementById("btnCloseCharModal").onclick = () => {
    backdrop.classList.add("hidden");
    state.selectedCharacter = null;
  };
}

// =========================================================================
// MODAL PÚBLICO DEL CANAL DE YOUTUBE (RECOPILACIONES EN ESPAÑOL CON PAUSAS Y LISTAS POR JUEGO)
// =========================================================================
function renderYoutubeModal() {
  const body = document.getElementById("youtubeModalBody");
  if (!body || !state.youtubeChannel) return;

  const yt = state.youtubeChannel;
  const publicUrl = yt.publicUrl || "https://www.youtube.com/@FGCVaultES";
  const playlistsByGame = yt.playlistsByGame || [];

  body.innerHTML = `
    <div class="yt-banner-preview" style="justify-content:space-between;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:16px;max-width:680px;">
        <div class="yt-avatar-circle">FGC</div>
        <div>
          <h3 style="font-family:var(--font-display);font-size:1.35rem;">${yt.name}</h3>
          <div style="color:#fca5a5;font-family:var(--font-mono);font-size:0.85rem;">${yt.handle} • Subtítulos en Español + Pausas Explicativas</div>
          <p style="font-size:0.84rem;color:#e2e8f0;margin-top:4px;">${yt.description}</p>
        </div>
      </div>
      <div>
        <a href="${publicUrl}" target="_blank" rel="noopener" class="btn btn-primary">
          Abrir Canal en YouTube (${yt.handle}) ➔
        </a>
      </div>
    </div>

    <div class="ufd-section-banner" style="margin-top:6px;">
      Listas de Reproducción por Juego (Recopilaciones Traducidas al Español con Pausas)
    </div>

    <div class="news-grid">
      ${playlistsByGame
        .map(
          (pl) => `
          <div class="video-panel-card">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <span class="news-cat-badge">${pl.gameTitle}</span>
              <span class="base-game-badge">Subtítulos ES + Pausas</span>
            </div>
            <h4 style="font-family:var(--font-display);font-size:1rem;">${pl.playlistTitle}</h4>
            <p style="font-size:0.78rem;color:#94a3b8;margin-top:2px;">${pl.sourcesCompiled}</p>
            <div class="video-frame-wrapper">
              <iframe
                src="${pl.embedUrl}"
                title="${pl.playlistTitle}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div style="margin-top:8px;">
              <strong style="font-size:0.76rem;color:#fbbf24;">Pausas de explicación incluidas en esta lista:</strong>
              ${(pl.pauses || [])
                .map(
                  (p) => `
                  <div class="pause-step-box" style="padding:7px 10px;margin-top:6px;font-size:0.76rem;">
                    <span class="pause-time-badge">${p.time}</span>
                    <span style="color:#e2e8f0;">${p.label}</span>
                  </div>
                `
                )
                .join("")}
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;
}

// =========================================================================
// EVENT LISTENERS GLOBALES
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadBootstrap();

  const goHome = () => {
    state.selectedGameId = null;
    document.getElementById("gameDetailView").classList.add("hidden");
    document.getElementById("newsView").classList.add("hidden");
    document.getElementById("communityView").classList.add("hidden");
    document.getElementById("homeView").classList.remove("hidden");
  };
  document.getElementById("btnHomeBrand").addEventListener("click", goHome);
  document.getElementById("btnBackToCatalog").addEventListener("click", goHome);
  document.getElementById("btnBackFromNews").addEventListener("click", goHome);
  document.getElementById("btnBackFromCommunity").addEventListener("click", goHome);

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
    if (state.selectedCharacter) {
      openCharacterModal(state.selectedCharacter.gameId, state.selectedCharacter.charId);
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
  document.getElementById("btnOpenYoutubeModal").addEventListener("click", () => {
    ytModal.classList.remove("hidden");
  });
  document.getElementById("btnCloseYoutubeModal").addEventListener("click", () => {
    ytModal.classList.add("hidden");
  });
});
