/**
 * FGC Vault — Frontend Application Logic (Optimizado)
 * - Fondos con la imagen principal oficial de cada juego (coverImage).
 * - Pestaña principal "Todos los juegos".
 * - Icono visual de retrato para cada uno de los 259 personajes.
 * - Interfaz limpia sin exceso de emojis y con filtrado instantáneo.
 * - Kit de Canal Oficial de YouTube integrado.
 */

const state = {
  youtubeChannel: null,
  sagas: [],
  games: [],
  submissions: [],
  verifiedUsers: [],
  authRequests: [],
  botLogs: [],
  botStatus: {},
  selectedSagaId: "all",
  selectedGameId: null,
  selectedCharacter: null,
  selectedDlcPackFilter: "all",
  inGameSearchQuery: "",
  notationMode: "technical", // technical | ps | xbox
  searchQuery: "",
  adminKey: localStorage.getItem("fgc_private_owner_key") || ""
};

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
// CARGA INICIAL Y RENDERIZADO PRINCIPAL
// =========================================================================
async function loadBootstrap() {
  try {
    const res = await fetch("/api/bootstrap", {
      headers: { "x-admin-key": state.adminKey }
    });
    const data = await res.json();
    state.youtubeChannel = data.youtubeChannel || null;
    state.sagas = data.sagas || [];
    state.games = data.games || [];
    state.submissions = data.submissions || [];
    state.verifiedUsers = data.verifiedUsers || [];
    state.authRequests = data.authRequests || [];
    state.botLogs = data.botLogs || [];
    state.botStatus = data.botStatus || {};
    renderAll();
  } catch (err) {
    console.error("Error cargando datos del servidor:", err);
  }
}

function renderAll() {
  renderHeroStats();
  renderSagaTabs();
  renderGamesGrid();
  renderQuickSearch();
  renderTelegramBadgeAndDrawer();
  renderYoutubeModal();
  populateFormSelects();

  if (state.selectedGameId) {
    renderGameDetailView(state.selectedGameId);
  }
  if (state.selectedCharacter) {
    openCharacterModal(state.selectedCharacter.gameId, state.selectedCharacter.charId);
  }
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
    <div style="margin-bottom:10px;font-weight:700;color:#fbbf24;">
      Personajes y Packs DLC encontrados para "${state.searchQuery}" (${matches.length}):
    </div>
    <div class="characters-grid">
      ${matches
        .slice(0, 24)
        .map(({ game, ch }) => {
          const badge = ch.isDLC
            ? `<span class="dlc-pack-badge">DLC • ${ch.dlcPack}</span>`
            : `<span class="base-game-badge">Juego Base</span>`;
          return `
            <div class="char-card ${ch.isDLC ? "is-dlc" : ""}" data-quickgame="${game.id}" data-quickchar="${ch.id}">
              <div class="char-top-row">
                <img class="char-avatar-img" src="${ch.iconUrl}" alt="${ch.name}" loading="lazy" />
                <div>
                  <div class="char-name">${ch.name}</div>
                  <div class="char-archetype">${game.title} • ${ch.archetype}</div>
                </div>
              </div>
              <div class="char-badges-row">
                ${badge}
                <span class="diff-badge">Dif: ${ch.difficulty}</span>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  box.querySelectorAll(".char-card").forEach((card) => {
    card.addEventListener("click", () => {
      const gId = card.dataset.quickgame;
      const cId = card.dataset.quickchar;
      openGameHub(gId);
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
            <span>Abrir Guías y Plantel (${game.characters.length} luchadores)</span>
            <span>➔</span>
          </div>
        </article>
      `;
    })
    .join("");

  container.querySelectorAll(".game-card").forEach((card) => {
    card.addEventListener("click", () => {
      openGameHub(card.dataset.gameid);
    });
  });
}

// =========================================================================
// VISTA DETALLADA DE UN JUEGO: BÁSICA, AVANZADA Y ROSTER COMPLETO
// =========================================================================
function openGameHub(gameId) {
  state.selectedGameId = gameId;
  state.selectedDlcPackFilter = "all";
  state.inGameSearchQuery = "";
  const inGameInput = document.getElementById("inGameCharSearch");
  if (inGameInput) inGameInput.value = "";

  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("gameDetailView").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderGameDetailView(gameId);
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

  // Cabecera del juego con la imagen oficial de fondo
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
      <button class="btn btn-outline" id="btnQuickAddCharHere">Añadir Guía a ${game.title}</button>
    </div>
  `;

  document.getElementById("btnQuickAddCharHere").addEventListener("click", () => {
    document.getElementById("subGameSelect").value = game.id;
    document.getElementById("submitModalBackdrop").classList.remove("hidden");
  });

  document.getElementById("gameNotationBanner").innerHTML = `
    <strong>Notación (${saga ? saga.name : game.title}):</strong> ${
    saga ? saga.notationLegend : ""
  }
  `;

  // Separar personajes Base vs DLC y aplicar filtro rápido por nombre
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

  // Renderizar Grid Juego Base
  const baseGrid = document.getElementById("baseCharactersGrid");
  baseGrid.innerHTML = baseChars.map((ch) => buildCharacterCardHTML(game, ch)).join("");
  attachCharacterCardEvents(baseGrid, game.id);

  // Renderizar Grid Personajes DLC
  renderDlcGrid(game, filteredDlcChars);

  // Renderizar Guía Básica y Guía Avanzada
  renderGuideSplit("basicGuideContainer", game.basicGuide, "Guía Básica de Conceptos", game.officialSources);
  renderGuideSplit("advancedGuideContainer", game.advancedGuide, "Guía Avanzada Competitiva", game.officialSources);
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
  return `
    <div
      class="portrait-tile ${ch.isDLC ? "is-dlc" : ""}"
      data-charid="${ch.id}"
      title="${ch.name} — ${ch.archetype} (${ch.isDLC ? ch.dlcPack : "Juego Base"})"
    >
      <div class="portrait-img-box">
        <img src="${ch.iconUrl}" alt="${ch.name}" loading="lazy" />
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
// MODAL DE GUÍA INDIVIDUAL DE PERSONAJE (CON ICONO, VÍDEO Y TEXTO)
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

  header.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;">
      <img class="char-avatar-img" style="width:64px;height:64px;" src="${ch.iconUrl}" alt="${ch.name}" />
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

  body.innerHTML = `
    <div class="guide-split-layout">
      <div>
        <div class="video-panel-card" style="margin-bottom:16px;">
          <div class="hero-pill">VÍDEO GUÍA DEL PERSONAJE</div>
          <div class="video-frame-wrapper">
            <iframe
              src="${ch.videoUrl}"
              title="Guía de ${ch.name}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <p style="font-size:0.88rem;color:#e2e8f0;margin-top:8px;">
            <strong>Resumen:</strong> ${ch.overview}
          </p>
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
  `;

  backdrop.classList.remove("hidden");

  document.getElementById("btnCloseCharModal").onclick = () => {
    backdrop.classList.add("hidden");
    state.selectedCharacter = null;
  };
}

// =========================================================================
// MODAL DEL CANAL DE YOUTUBE DEL PROYECTO
// =========================================================================
function renderYoutubeModal() {
  const body = document.getElementById("youtubeModalBody");
  if (!body || !state.youtubeChannel) return;

  const yt = state.youtubeChannel;
  body.innerHTML = `
    <div class="yt-banner-preview">
      <div class="yt-avatar-circle">FGC</div>
      <div>
        <h3 style="font-family:var(--font-display);font-size:1.35rem;">${yt.name}</h3>
        <div style="color:#fca5a5;font-family:var(--font-mono);font-size:0.85rem;">${yt.handle}</div>
        <p style="font-size:0.83rem;color:#e2e8f0;margin-top:4px;">${yt.description}</p>
      </div>
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;">
      <a href="${yt.createUrl}" target="_blank" rel="noopener" class="btn btn-primary">
        Abrir Creador de Canal en YouTube
      </a>
      <a href="${yt.studioUrl}" target="_blank" rel="noopener" class="btn btn-outline">
        Ir a YouTube Studio
      </a>
      <button class="btn btn-outline" id="btnCopyYtData">
        Copiar Nombre y Descripción del Canal
      </button>
    </div>

    <div class="guide-section-item">
      <h4>Estructura de Listas de Reproducción (Playlists) lista para tu canal</h4>
      <ul style="padding-left:18px;margin-top:8px;font-size:0.86rem;color:#cbd5e1;display:flex;flex-direction:column;gap:6px;">
        ${(yt.playlists || []).map((p) => `<li>${p}</li>`).join("")}
      </ul>
    </div>
  `;

  const copyBtn = document.getElementById("btnCopyYtData");
  if (copyBtn) {
    copyBtn.onclick = () => {
      const clipText = `Nombre: ${yt.name}\nIdentificador: ${yt.handle}\nDescripción:\n${yt.description}`;
      navigator.clipboard.writeText(clipText);
      copyBtn.textContent = "Copiado al portapapeles";
      setTimeout(() => {
        copyBtn.textContent = "Copiar Nombre y Descripción del Canal";
      }, 2000);
    };
  }
}

// =========================================================================
// PANEL DE TELEGRAM: MODERACIÓN CON BOTONES Y VERIFICACIÓN 2FA
// =========================================================================
function renderTelegramBadgeAndDrawer() {
  const pendingSubs = state.submissions.filter((s) => s.status === "pending");
  const pendingAuths = state.authRequests.filter((a) => a.status === "pending");
  const totalPending = pendingSubs.length + pendingAuths.length;
  const isUnlocked = Boolean(state.botStatus && state.botStatus.isOwnerUnlocked);

  document.getElementById("pendingBadgeCount").textContent = totalPending;

  const badgeEl = document.getElementById("tgConnectionBadge");
  if (state.botStatus && state.botStatus.isLiveTelegram) {
    badgeEl.textContent = `Bot Privado en vivo (${state.botStatus.botUsername})`;
  } else {
    badgeEl.textContent = `Bot en Modo Privado Estricto (Solo Propietario Autorizado)`;
  }

  const lockBox = document.getElementById("tgPrivateLockBox");
  const lockTitle = document.getElementById("tgLockStatusTitle");
  const lockSub = document.getElementById("tgLockStatusSub");
  const unlockFormRow = document.getElementById("tgUnlockFormRow");

  if (isUnlocked) {
    lockBox.style.borderColor = "#10b981";
    lockBox.style.background = "rgba(16, 185, 129, 0.1)";
    lockTitle.style.color = "#34d399";
    lockTitle.textContent = "Sesión de Propietario Activa (Acceso Privado Verificado)";
    lockSub.textContent = "Tienes control total sobre aprobaciones, parches y verificaciones 2FA.";
    unlockFormRow.innerHTML = `<button class="tg-inline-btn reject" id="btnLockPrivateBot">Bloquear Panel</button>`;
    document.getElementById("btnLockPrivateBot").onclick = () => {
      state.adminKey = "";
      localStorage.removeItem("fgc_private_owner_key");
      location.reload();
    };
  } else {
    lockBox.style.borderColor = "#f59e0b";
    lockBox.style.background = "rgba(245, 158, 11, 0.08)";
    lockTitle.style.color = "#fbbf24";
    lockTitle.textContent = "Bot en Modo Privado Estricto";
    lockSub.textContent = "Introduce tu ID/API privado (9297971350) para habilitar los botones de gestión.";
  }

  const subListEl = document.getElementById("tgPendingSubmissionsList");
  if (!isUnlocked) {
    subListEl.innerHTML = `
      <div class="tg-message-bubble">
        <strong>Contenido protegido (${pendingSubs.length} propuestas en cola).</strong><br/>
        Desbloquea arriba con tu ID de propietario o gestiónalas desde tu chat privado de Telegram.
      </div>
    `;
  } else if (pendingSubs.length === 0) {
    subListEl.innerHTML = `<div class="tg-message-bubble">No hay guías pendientes. Todo el contenido está verificado.</div>`;
  } else {
    subListEl.innerHTML = pendingSubs
      .map((s) => {
        const dlcInfo = s.isDLC ? `DLC (${s.dlcPack})` : `Juego Base`;
        return `
          <div class="tg-message-bubble">
            <div class="tg-msg-title">${s.gameTitle} — ${s.characterName} (${dlcInfo})</div>
            <div style="font-size:0.8rem;color:#cbd5e1;margin-bottom:6px;">
              Enviado por <strong>${s.author}</strong> (${s.createdAt})
            </div>
            <div style="font-family:var(--font-mono);font-size:0.78rem;background:#0e1621;padding:6px 8px;border-radius:6px;margin-bottom:6px;">
              ${s.comboNotation}
            </div>
            <div style="font-size:0.8rem;color:#94a3b8;">${s.notes}</div>
            <div class="tg-inline-grid">
              <button class="tg-inline-btn approve" data-modid="${s.id}" data-modact="approve">
                Aprobar y Publicar
              </button>
              <button class="tg-inline-btn reject" data-modid="${s.id}" data-modact="reject">
                Rechazar
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    subListEl.querySelectorAll("[data-modid]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const submissionId = btn.dataset.modid;
        const action = btn.dataset.modact;
        await fetch("/api/bot/moderate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": state.adminKey
          },
          body: JSON.stringify({ submissionId, action })
        });
        await loadBootstrap();
      });
    });
  }

  const authListEl = document.getElementById("tgPendingAuthsList");
  if (!isUnlocked) {
    authListEl.innerHTML = `<p style="font-size:0.82rem;color:#fbbf24;">Desbloquea como propietario para autorizar o denegar verificaciones 2FA.</p>`;
  } else if (pendingAuths.length === 0) {
    authListEl.innerHTML = `<p style="font-size:0.82rem;color:#94a3b8;">No hay solicitudes de verificación pendientes.</p>`;
  } else {
    authListEl.innerHTML = pendingAuths
      .map(
        (req) => `
        <div class="tg-message-bubble" style="margin-top:8px;">
          <div class="tg-msg-title">Solicitud de ${req.username} (${req.telegramHandle})</div>
          <div style="font-size:0.82rem;">Rol: <strong>${req.role}</strong> • Código 2FA: <code>${req.code}</code></div>
          <div class="tg-inline-grid">
            <button class="tg-inline-btn approve" data-authcode="${req.code}" data-authdec="approve">
              Verificar Cuenta (${req.code})
            </button>
            <button class="tg-inline-btn reject" data-authcode="${req.code}" data-authdec="reject">
              Denegar
            </button>
          </div>
        </div>
      `
      )
      .join("");

    authListEl.querySelectorAll("[data-authcode]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await fetch("/api/auth/verify-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": state.adminKey
          },
          body: JSON.stringify({
            code: btn.dataset.authcode,
            decision: btn.dataset.authdec
          })
        });
        await loadBootstrap();
      });
    });
  }

  const verifiedEl = document.getElementById("tgVerifiedUsersList");
  verifiedEl.innerHTML = state.verifiedUsers
    .map(
      (u) => `
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #243447;font-size:0.83rem;">
        <span><strong>${u.username}</strong> (${u.telegramHandle})</span>
        <span style="color:#38bdf8;">${u.role}</span>
      </div>
    `
    )
    .join("");

  const logsEl = document.getElementById("tgLiveLogsList");
  logsEl.innerHTML = state.botLogs
    .map(
      (l) => `
      <div class="tg-log-line">
        <span style="color:#38bdf8;">[${l.time}]</span> ${l.event}
      </div>
    `
    )
    .join("");
}

function populateFormSelects() {
  const subSelect = document.getElementById("subGameSelect");
  const patchSelect = document.getElementById("tgPatchGameSelect");
  const currentSubVal = subSelect.value;
  const currentPatchVal = patchSelect.value;

  const opts = state.games
    .map((g) => `<option value="${g.id}">${g.title}</option>`)
    .join("");

  subSelect.innerHTML = opts;
  patchSelect.innerHTML = opts;

  if (currentSubVal) subSelect.value = currentSubVal;
  if (currentPatchVal) patchSelect.value = currentPatchVal;
}

// =========================================================================
// EVENT LISTENERS GLOBALES
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadBootstrap();

  const goHome = () => {
    state.selectedGameId = null;
    document.getElementById("gameDetailView").classList.add("hidden");
    document.getElementById("homeView").classList.remove("hidden");
  };
  document.getElementById("btnHomeBrand").addEventListener("click", goHome);
  document.getElementById("btnBackToCatalog").addEventListener("click", goHome);

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

  // Buscador rápido dentro de un juego
  const inGameSearch = document.getElementById("inGameCharSearch");
  if (inGameSearch) {
    inGameSearch.addEventListener("input", (e) => {
      state.inGameSearchQuery = e.target.value;
      if (state.selectedGameId) {
        renderGameDetailView(state.selectedGameId);
      }
    });
  }

  document.querySelectorAll(".game-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".game-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // Modal Canal de YouTube
  const ytModal = document.getElementById("youtubeModalBackdrop");
  document.getElementById("btnOpenYoutubeModal").addEventListener("click", () => {
    ytModal.classList.remove("hidden");
  });
  document.getElementById("btnCloseYoutubeModal").addEventListener("click", () => {
    ytModal.classList.add("hidden");
  });

  // Modal de enviar guía / personaje
  const submitModal = document.getElementById("submitModalBackdrop");
  document.getElementById("btnOpenSubmitModal").addEventListener("click", () => {
    submitModal.classList.remove("hidden");
  });
  document.getElementById("btnCloseSubmitModal").addEventListener("click", () => {
    submitModal.classList.add("hidden");
  });

  const dlcCheckbox = document.getElementById("subIsDLC");
  const dlcPackInput = document.getElementById("subDlcPack");
  dlcCheckbox.addEventListener("change", () => {
    dlcPackInput.classList.toggle("hidden", !dlcCheckbox.checked);
    if (dlcCheckbox.checked) dlcPackInput.focus();
  });

  document.getElementById("submitGuideForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      gameId: document.getElementById("subGameSelect").value,
      characterName: document.getElementById("subCharName").value,
      archetype: document.getElementById("subArchetype").value,
      difficulty: document.getElementById("subDifficulty").value,
      isDLC: dlcCheckbox.checked,
      dlcPack: dlcPackInput.value,
      comboNotation: document.getElementById("subCombo").value,
      notes: document.getElementById("subNotes").value,
      videoUrl: document.getElementById("subVideoUrl").value,
      author: document.getElementById("subAuthor").value
    };

    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    e.target.reset();
    dlcPackInput.classList.add("hidden");
    submitModal.classList.add("hidden");
    await loadBootstrap();
    document.getElementById("telegramDrawerBackdrop").classList.remove("hidden");
  });

  // Drawer de Telegram
  const tgDrawer = document.getElementById("telegramDrawerBackdrop");
  document.getElementById("btnOpenTelegramPanel").addEventListener("click", () => {
    tgDrawer.classList.remove("hidden");
  });
  document.getElementById("btnCloseTelegramDrawer").addEventListener("click", () => {
    tgDrawer.classList.add("hidden");
  });

  document.querySelectorAll(".tg-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tg-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tg-tab-content").forEach((c) => c.classList.add("hidden"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tgtab).classList.remove("hidden");
    });
  });

  // Desbloquear el panel privado del Bot con el ID/API del propietario (9297971350)
  const unlockBtn = document.getElementById("btnUnlockPrivateBot");
  if (unlockBtn) {
    unlockBtn.addEventListener("click", async () => {
      const keyVal = document.getElementById("tgOwnerKeyInput").value.trim();
      if (!keyVal) return;
      const res = await fetch("/api/bot/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey: keyVal })
      });
      if (res.ok) {
        state.adminKey = keyVal;
        localStorage.setItem("fgc_private_owner_key", keyVal);
        await loadBootstrap();
      } else {
        alert("Clave o ID de propietario incorrecto. Acceso privado denegado.");
      }
    });
  }

  document.getElementById("btnApplyPatchUpdate").addEventListener("click", async () => {
    const gameId = document.getElementById("tgPatchGameSelect").value;
    const currentPatch = document.getElementById("tgPatchTextInput").value.trim();
    if (!currentPatch) return;
    const res = await fetch("/api/bot/update-patch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": state.adminKey
      },
      body: JSON.stringify({ gameId, currentPatch })
    });
    if (!res.ok) {
      alert("Desbloquea primero el panel privado con tu ID de propietario (9297971350).");
      return;
    }
    document.getElementById("tgPatchTextInput").value = "";
    await loadBootstrap();
  });

  document.getElementById("requestAuthForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("authUsernameInput").value;
    const telegramHandle = document.getElementById("authTelegramInput").value;
    const role = document.getElementById("authRoleSelect").value;

    await fetch("/api/auth/request-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, telegramHandle, role })
    });

    e.target.reset();
    await loadBootstrap();
  });
});
