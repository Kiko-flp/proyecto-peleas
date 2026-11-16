/**
 * FGC Vault — Módulo de Herramientas Avanzadas (v14)
 * Contiene:
 * A) Calculadora Interactiva de Castigos en Bloqueo (Punish Calculator)
 * C) Reproductor con Auto-Pausa Inteligente y Superposición (Overlay) en Español
 * D) Inspector de Hitboxes Frame a Frame (⏮ -1f | ⏸ Pausa | ⏭ +1f + Barra deslizante)
 * E) Diccionario / Glosario FGC con Ventanas Flotantes (Tooltips automáticos)
 * F) Test de 10 Preguntas: "¿Qué Personaje Debería Elegir?" (Por Estilo de Juego y Personalidad)
 */

// =========================================================================
// E. GLOSARIO FGC Y TOOLTIPS AUTOMÁTICOS EN ESPAÑOL
// =========================================================================
const FGC_GLOSSARY = [
  {
    term: "Frame Trap",
    regex: /\bFrame Traps?\b/gi,
    category: "Ofensiva",
    definition: "Dejar un pequeño hueco entre dos ataques (de 1 a 3 frames) para que, si el rival intenta pulsar un botón, tu segundo golpe le impacte antes en Counter Hit."
  },
  {
    term: "Whiff Punish",
    regex: /\bWhiff Punish(?:ing|er)?\b/gi,
    category: "Neutro",
    definition: "Hacer que el ataque del rival falle al aire (whiff) manteniéndote justo fuera de su alcance y castigar inmediatamente su extremidad en recuperación."
  },
  {
    term: "Shimmy",
    regex: /\bShimmy\b/gi,
    category: "Ofensiva / Esquina",
    definition: "Acercarse al rival derribado amagando un agarre y dar un micropaso atrás para que su intento de zafarse del agarre falle al aire, castigándolo con combo máximo."
  },
  {
    term: "Delay Throw Tech",
    regex: /\bDelay (?:Throw )?Tech\b/gi,
    category: "Defensa",
    definition: "Técnica defensiva en la que bloqueas durante los primeros frames al levantarte y pulsas agarre con un ligero retraso, cubriendo tanto el golpe como el agarre rival."
  },
  {
    term: "Okizeme (Oki)",
    regex: /\b(?:Okizeme|Oki)\b/gi,
    category: "Ofensiva",
    definition: "La presión y opciones de ataque que aplicas sobre el oponente mientras está en el suelo a punto de levantarse."
  },
  {
    term: "Meaty",
    regex: /\bMeaty\b/gi,
    category: "Ofensiva",
    definition: "Lanzar un ataque sincronizado para que sus frames activos golpeen al rival en el primer frame exacto en que se levanta del suelo."
  },
  {
    term: "Flawless Block",
    regex: /\bFlawless Block\b/gi,
    category: "Defensa (MK)",
    definition: "Bloquear justo en los 3 frames previos al impacto en Mortal Kombat para anular el daño residual (Chip) y reducir la ventaja del atacante."
  },
  {
    term: "Micro-Duck",
    regex: /\bMicro-Duck(?:ing)?\b/gi,
    category: "Defensa (MK/Tekken)",
    definition: "Agacharse sin bloquear durante una fracción de segundo para esquivar un primer golpe alto (High) y castigar al instante antes de que salga el segundo golpe."
  },
  {
    term: "Drive Rush",
    regex: /\bDrive Rush(?: Cancel)?\b/gi,
    category: "Sistema (SF6)",
    definition: "Carrera rápida envuelta en energía verde en Street Fighter 6 que añade +4 frames de ventaja adicional a cualquier ataque normal."
  },
  {
    term: "Burnout",
    regex: /\bBurnout\b/gi,
    category: "Sistema (SF6)",
    definition: "Estado de agotamiento en SF6 al vaciar las 6 barras de Drive: recibes daño residual, todos los golpes rivales ganan +4 frames en tu bloqueo y puedes ser aturdido en la esquina."
  },
  {
    term: "Korean Backdash",
    regex: /\b(?:Korean Backdash|KBD)\b/gi,
    category: "Movimiento (Tekken)",
    definition: "Técnica avanzada de movimiento hacia atrás en Tekken (b, b, db, b...) que cancela la recuperación del paso atrás con un micro-agachado para alejarse a máxima velocidad."
  },
  {
    term: "Sidestep",
    regex: /\bSidestep\b/gi,
    category: "Movimiento 3D",
    definition: "Paso lateral hacia el fondo o el primer plano en Tekken para esquivar ataques lineales y castigar la espalda del rival."
  },
  {
    term: "Roman Cancel",
    regex: /\b(?:Roman Cancel|RRC|PRC|YRC|BRC|Fast RC)\b/gi,
    category: "Sistema (Guilty Gear)",
    definition: "Mecánica de Guilty Gear que consume 50% de Tension para cancelar cualquier animación, ralentizar el tiempo y extender combos o hacer seguros ataques arriesgados."
  },
  {
    term: "Safe Jump",
    regex: /\bSafe Jumps?\b/gi,
    category: "Ofensiva",
    definition: "Salto ofensivo calculado al frame tras un derribo que golpea si el rival no hace nada, pero aterriza a tiempo de bloquear si el rival usa un ataque invencible (DP/Shoryuken)."
  },
  {
    term: "Out of Shield (OOS)",
    regex: /\b(?:Out of Shield|OOS)\b/gi,
    category: "Defensa (Smash)",
    definition: "Acciones en Super Smash Bros. (Saltar, Up-Smash, Up-B o Agarrar) que permiten actuar directamente desde el escudo sin sufrir los 11 frames de penalización por soltarlo."
  },
  {
    term: "RAR (Reverse Aerial Rush)",
    regex: /\b(?:Reverse Aerial Rush|RAR)\b/gi,
    category: "Técnica (Smash)",
    definition: "Girar en dirección contraria un instante antes de saltar corriendo hacia adelante para golpear al rival con tu aéreo trasero (Back Air) a máxima velocidad."
  },
  {
    term: "Ledgetrap",
    regex: /\bLedgetrap(?:ping)?\b/gi,
    category: "Control (Smash)",
    definition: "Posicionarse cerca del borde del escenario en Smash para cubrir y castigar las 5 opciones que tiene el rival al subir desde el borde."
  },
  {
    term: "50/50",
    regex: /\b50\/50\b/g,
    category: "Ofensiva",
    definition: "Situación de ataque donde el defensor no puede reaccionar visualmente y está obligado a adivinar entre dos opciones (por ejemplo Bajo vs. Overhead, o Golpe vs. Agarre)."
  },
  {
    term: "Punish Counter",
    regex: /\bPunish Counter\b/gi,
    category: "Castigo",
    definition: "Golpear al rival mientras está en los frames de recuperación de un ataque fallido o bloqueado, otorgando daño extra y ventaja de frames masiva."
  }
];

window.decorateTextWithGlossaryTooltips = function (rootEl) {
  if (!rootEl) return;
  const paragraphs = rootEl.querySelectorAll(".guide-section-item p, .matchup-reason, .ufd-card-notes");
  paragraphs.forEach((p) => {
    if (p.dataset.glossaryApplied) return;
    p.dataset.glossaryApplied = "1";
    let html = p.innerHTML;
    FGC_GLOSSARY.forEach((entry) => {
      html = html.replace(entry.regex, (matched) => {
        return `<span class="fgc-tooltip-term" data-tip="${entry.definition.replace(/"/g, "&quot;")}">${matched}</span>`;
      });
    });
    p.innerHTML = html;
  });
};

// =========================================================================
// D. INSPECTOR DE HITBOXES FRAME A FRAME (CON DESLIZADOR Y CONTROLES)
// =========================================================================
const inspectorState = {
  moveName: "",
  input: "",
  startupNum: 5,
  activeStart: 5,
  activeEnd: 7,
  recoveryNum: 18,
  totalFrames: 25,
  onBlock: "-4 On Block",
  type: "jab",
  currentFrame: 5,
  playing: false,
  timer: null,
  fps: 12
};

function parseFrameNumbers(fc) {
  const sMatch = String(fc.startup || "").match(/(\d+)/);
  const aMatch = String(fc.active || "").match(/(\d+)[–-](\d+)/);
  const rMatch = String(fc.recovery || "").match(/(\d+)/);
  const tMatch = String(fc.totalFrames || "").match(/(\d+)/);

  const startupNum = sMatch ? parseInt(sMatch[1], 10) : 6;
  const activeStart = aMatch ? parseInt(aMatch[1], 10) : startupNum;
  const activeEnd = aMatch ? parseInt(aMatch[2], 10) : startupNum + 2;
  const recoveryNum = rMatch ? parseInt(rMatch[1], 10) : 18;
  const totalFrames = tMatch ? parseInt(tMatch[1], 10) : activeEnd + recoveryNum;

  return { startupNum, activeStart, activeEnd, recoveryNum, totalFrames };
}

window.openHitboxInspector = function (fcEncoded) {
  let fc;
  try {
    fc = JSON.parse(decodeURIComponent(fcEncoded));
  } catch (_) {
    return;
  }

  const nums = parseFrameNumbers(fc);
  inspectorState.moveName = fc.moveName;
  inspectorState.input = fc.input;
  inspectorState.startupNum = nums.startupNum;
  inspectorState.activeStart = nums.activeStart;
  inspectorState.activeEnd = nums.activeEnd;
  inspectorState.recoveryNum = nums.recoveryNum;
  inspectorState.totalFrames = nums.totalFrames;
  inspectorState.onBlock = fc.onBlock;
  inspectorState.currentFrame = nums.activeStart; // Empezar en el primer frame activo para ver la hitbox
  stopInspectorPlayback();

  const modal = document.getElementById("hitboxInspectorModalBackdrop");
  if (!modal) return;
  modal.classList.remove("hidden");

  const slider = document.getElementById("hbFrameSlider");
  if (slider) {
    slider.min = 1;
    slider.max = inspectorState.totalFrames;
    slider.value = inspectorState.currentFrame;
  }

  renderInspectorFrame();
};

function stopInspectorPlayback() {
  inspectorState.playing = false;
  if (inspectorState.timer) {
    clearInterval(inspectorState.timer);
    inspectorState.timer = null;
  }
  const playBtn = document.getElementById("btnHbPlayPause");
  if (playBtn) playBtn.textContent = "▶ Reproducir Animación";
}

function toggleInspectorPlayback() {
  if (inspectorState.playing) {
    stopInspectorPlayback();
    return;
  }
  inspectorState.playing = true;
  const playBtn = document.getElementById("btnHbPlayPause");
  if (playBtn) playBtn.textContent = "⏸ Pausar Frame";

  inspectorState.timer = setInterval(() => {
    inspectorState.currentFrame++;
    if (inspectorState.currentFrame > inspectorState.totalFrames) {
      inspectorState.currentFrame = 1;
    }
    const slider = document.getElementById("hbFrameSlider");
    if (slider) slider.value = inspectorState.currentFrame;
    renderInspectorFrame();
  }, Math.round(1000 / inspectorState.fps));
}

function renderInspectorFrame() {
  const f = inspectorState.currentFrame;
  const { activeStart, activeEnd, totalFrames, moveName, input, onBlock } = inspectorState;

  let phaseName = "STARTUP (Preparación — Sin Hitbox)";
  let phaseColor = "#15803d";
  let isHitboxActive = false;
  let limbAngle = -20 + ((f / Math.max(1, activeStart - 1)) * 15);
  let extendX = 0;

  if (f >= activeStart && f <= activeEnd) {
    phaseName = "VENTANA ACTIVA — ¡HITBOX ACTIVA EN PANTALLA!";
    phaseColor = "#e11d48";
    isHitboxActive = true;
    limbAngle = 0;
    extendX = 12;
  } else if (f > activeEnd) {
    phaseName = "END LAG / RECUPERACIÓN (Hurtbox expuesta a Whiff Punish)";
    phaseColor = "#6d28d9";
    isHitboxActive = false;
    limbAngle = 10;
    extendX = 4;
  }

  const headerTitle = document.getElementById("hbInspectorTitle");
  if (headerTitle) {
    headerTitle.textContent = `${moveName} (${input}) — Inspector Frame a Frame`;
  }

  const statusBanner = document.getElementById("hbPhaseBanner");
  if (statusBanner) {
    statusBanner.style.background = phaseColor;
    statusBanner.textContent = `FRAME ${f} de ${totalFrames} — ${phaseName}`;
  }

  const canvasBox = document.getElementById("hbInteractiveCanvas");
  if (canvasBox) {
    canvasBox.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 210" width="100%" height="230">
        <rect width="380" height="210" rx="10" fill="#181b22" />
        <line x1="0" y1="70" x2="380" y2="70" stroke="#293040" stroke-dasharray="4 4" />
        <line x1="0" y1="130" x2="380" y2="130" stroke="#293040" stroke-dasharray="4 4" />
        <line x1="190" y1="0" x2="190" y2="180" stroke="#293040" stroke-dasharray="4 4" />
        <line x1="20" y1="180" x2="360" y2="180" stroke="#475569" stroke-width="3" />

        <!-- Hurtbox del personaje (Azul/Cian) -->
        <rect x="${105 + extendX * 0.4}" y="58" width="52" height="120" rx="16"
          fill="rgba(56, 189, 248, 0.18)" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3" />
        <text x="${108 + extendX * 0.4}" y="52" fill="#38bdf8" font-family="monospace" font-size="10">HURTBOX</text>

        <!-- Silueta del luchador en el frame f -->
        <circle cx="${131 + extendX * 0.4}" cy="74" r="14" fill="#e2e8f0" />
        <path d="M${115 + extendX * 0.4} 90 L${147 + extendX * 0.4} 90 L${144 + extendX * 0.4} 140 L${118 + extendX * 0.4} 140 Z" fill="#cbd5e1" />
        <line x1="${122 + extendX * 0.4}" y1="140" x2="${110 + extendX * 0.4}" y2="178" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" />
        <line x1="${140 + extendX * 0.4}" y1="140" x2="${154 + extendX * 0.4}" y2="178" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" />

        <!-- Extremidad de ataque posicionada según el frame exacto -->
        <g transform="rotate(${limbAngle}, ${142 + extendX}, 102)">
          <line x1="${142 + extendX}" y1="102" x2="${238 + extendX * 2}" y2="98"
            stroke="${isHitboxActive ? "#fbbf24" : "#94a3b8"}" stroke-width="11" stroke-linecap="round" />
        </g>

        <!-- Esferas de Hitbox Activa (SOLO visibles durante los frames activos) -->
        ${
          isHitboxActive
            ? `
            <circle cx="${248 + extendX * 1.5}" cy="98" r="38" fill="rgba(244, 63, 94, 0.55)" stroke="#f43f5e" stroke-width="3" />
            <circle cx="${208 + extendX * 1.2}" cy="100" r="26" fill="rgba(236, 72, 153, 0.55)" stroke="#fda4af" stroke-width="2" />
            <text x="${214 + extendX * 1.5}" y="52" fill="#fda4af" font-family="monospace" font-weight="bold" font-size="11">¡HITBOX ACTIVA! (F${f})</text>
          `
            : `
            <text x="210" y="102" fill="#64748b" font-family="monospace" font-size="11">
              ${f < activeStart ? `Faltan ${activeStart - f} frames para activar Hitbox` : `Hitbox cerrada hace ${f - activeEnd} frames`}
            </text>
          `
        }

        <!-- Barra de línea temporal de frames en la base -->
        <rect x="20" y="190" width="340" height="10" rx="4" fill="#0f172a" />
        <rect x="20" y="190" width="${((activeStart - 1) / totalFrames) * 340}" height="10" fill="#15803d" />
        <rect x="${20 + ((activeStart - 1) / totalFrames) * 340}" y="190" width="${((activeEnd - activeStart + 1) / totalFrames) * 340}" height="10" fill="#e11d48" />
        <rect x="${20 + (activeEnd / totalFrames) * 340}" y="190" width="${((totalFrames - activeEnd) / totalFrames) * 340}" height="10" fill="#6d28d9" />
        <circle cx="${20 + ((f - 0.5) / totalFrames) * 340}" cy="195" r="7" fill="#fbbf24" stroke="#090d16" stroke-width="2" />
      </svg>
    `;
  }

  const metaEl = document.getElementById("hbFrameMetaInfo");
  if (metaEl) {
    metaEl.innerHTML = `
      <span><strong style="color:#4ade80;">Startup:</strong> Frames 1–${activeStart - 1}</span>
      <span><strong style="color:#fb7185;">Hitbox Activa:</strong> Frames ${activeStart}–${activeEnd}</span>
      <span><strong style="color:#c084fc;">End Lag:</strong> Frames ${activeEnd + 1}–${totalFrames}</span>
      <span><strong style="color:#f87171;">Bloqueo:</strong> ${onBlock}</span>
    `;
  }
}

// =========================================================================
// C. REPRODUCTOR CON AUTO-PAUSA INTELIGENTE Y OVERLAY EN ESPAÑOL
// =========================================================================
let pauseOverlayTimer = null;

window.triggerVideoTacticalPauseOverlay = function (iframeId, overlayId, videoUrl, pauseObj) {
  const iframe = document.getElementById(iframeId);
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;

  if (pauseOverlayTimer) clearInterval(pauseOverlayTimer);

  // Llevar el vídeo al segundo de la pausa y mostrar la superposición explicativa en español
  if (iframe && videoUrl) {
    const baseUrl = videoUrl.split("?")[0];
    iframe.src = `${baseUrl}?start=${pauseObj.seconds || 0}&autoplay=0&cc_load_policy=1&cc_lang_pref=es&hl=es`;
  }

  let remaining = 7;
  overlay.classList.remove("hidden");

  const renderOverlayContent = () => {
    overlay.innerHTML = `
      <div class="tactical-overlay-card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px;">
          <span class="pause-time-badge">⏸ PAUSA EXPLICATIVA EN ESPAÑOL (${pauseObj.timestamp})</span>
          <span style="font-size:0.76rem;color:#fbbf24;font-family:var(--font-mono);">
            Reanudando vídeo en ${remaining}s...
          </span>
        </div>
        <h4 style="font-family:var(--font-display);font-size:1.1rem;color:#fff;margin-bottom:6px;">
          ${pauseObj.title}
        </h4>
        <p style="font-size:0.88rem;color:#e2e8f0;line-height:1.5;margin-bottom:12px;">
          ${pauseObj.explanation}
        </p>
        <div style="display:flex;justify-content:flex-end;gap:8px;">
          <button class="btn btn-primary" id="btnResumeAfterPause">▶ Continuar reproducción ahora</button>
        </div>
      </div>
    `;

    const resumeBtn = overlay.querySelector("#btnResumeAfterPause");
    if (resumeBtn) {
      resumeBtn.onclick = () => {
        clearInterval(pauseOverlayTimer);
        overlay.classList.add("hidden");
        if (iframe && videoUrl) {
          const baseUrl = videoUrl.split("?")[0];
          iframe.src = `${baseUrl}?start=${pauseObj.seconds || 0}&autoplay=1&cc_load_policy=1&cc_lang_pref=es&hl=es`;
        }
      };
    }
  };

  renderOverlayContent();

  pauseOverlayTimer = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(pauseOverlayTimer);
      overlay.classList.add("hidden");
      if (iframe && videoUrl) {
        const baseUrl = videoUrl.split("?")[0];
        iframe.src = `${baseUrl}?start=${pauseObj.seconds || 0}&autoplay=1&cc_load_policy=1&cc_lang_pref=es&hl=es`;
      }
    } else {
      renderOverlayContent();
    }
  }, 1000);
};

// =========================================================================
// A. CALCULADORA INTERACTIVA DE CASTIGOS EN BLOQUEO (PUNISH CALCULATOR)
// =========================================================================
function extractOnBlockNumber(onBlockStr) {
  const m = String(onBlockStr || "").match(/([+-]\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function extractStartupNumber(startupStr) {
  const m = String(startupStr || "").match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 10;
}

window.initPunishCalculator = function () {
  const gameSel = document.getElementById("punishGameSelect");
  const myCharSel = document.getElementById("punishMyCharSelect");
  const oppCharSel = document.getElementById("punishOppCharSelect");
  const oppMoveSel = document.getElementById("punishOppMoveSelect");
  if (!gameSel || !myCharSel || !oppCharSel || !oppMoveSel) return;

  gameSel.innerHTML = state.games
    .map((g) => `<option value="${g.id}">${g.title}</option>`)
    .join("");

  const populateChars = () => {
    const game = state.games.find((g) => g.id === gameSel.value) || state.games[0];
    if (!game) return;

    myCharSel.innerHTML = game.characters
      .map((c) => `<option value="${c.id}">${c.name}</option>`)
      .join("");

    oppCharSel.innerHTML = game.characters
      .map((c, idx) => `<option value="${c.id}" ${idx === 1 ? "selected" : ""}>${c.name}</option>`)
      .join("");

    populateMoves();
  };

  const populateMoves = () => {
    const game = state.games.find((g) => g.id === gameSel.value) || state.games[0];
    if (!game) return;
    const oppChar = game.characters.find((c) => c.id === oppCharSel.value) || game.characters[0];
    if (!oppChar) return;

    const moves = oppChar.frameDataCards || [];
    oppMoveSel.innerHTML =
      `<option value="all">Ver todos los ataques de ${oppChar.name}</option>` +
      moves
        .map(
          (m, idx) =>
            `<option value="${idx}">${m.moveName} (${m.input}) — [${m.onBlock}]</option>`
        )
        .join("");

    renderPunishResults();
  };

  const renderPunishResults = () => {
    const outEl = document.getElementById("punishResultsContainer");
    const game = state.games.find((g) => g.id === gameSel.value) || state.games[0];
    if (!outEl || !game) return;

    const myChar = game.characters.find((c) => c.id === myCharSel.value) || game.characters[0];
    const oppChar = game.characters.find((c) => c.id === oppCharSel.value) || game.characters[0];
    if (!myChar || !oppChar) return;

    const myMoves = (myChar.frameDataCards || []).map((m) => ({
      ...m,
      startVal: extractStartupNumber(m.startup)
    }));

    const oppMovesAll = oppChar.frameDataCards || [];
    const targetMoves =
      oppMoveSel.value === "all"
        ? oppMovesAll
        : [oppMovesAll[Number(oppMoveSel.value)]].filter(Boolean);

    outEl.innerHTML = targetMoves
      .map((oppMove) => {
        const obVal = extractOnBlockNumber(oppMove.onBlock);

        if (obVal === null) {
          return `
            <div class="guide-section-item" style="border-left:4px solid #a855f7;">
              <h4>${oppChar.name}: ${oppMove.moveName} (<code>${oppMove.input}</code>) — ${oppMove.onBlock}</h4>
              <p>Este movimiento es un agarre o propiedad especial imbloqueable: debes esquivarlo saltando, agachándote o haciendo Tech de agarre.</p>
            </div>
          `;
        }

        if (obVal >= 0) {
          return `
            <div class="guide-section-item" style="border-left:4px solid #ef4444;">
              <h4>${oppChar.name}: ${oppMove.moveName} (<code>${oppMove.input}</code>) — <span style="color:#f87171;">+${obVal} en Bloqueo</span></h4>
              <p><strong>¡Cuidado!</strong> ${oppChar.name} queda con ventaja de +${obVal} frames si bloqueas este ataque. No pulses botones normales o te hará Counter Hit; mantén el bloqueo o usa un Parry / Reversal invencible.</p>
            </div>
          `;
        }

        const disadvantage = Math.abs(obVal);
        const guaranteedPunishes = myMoves
          .filter((m) => m.startVal <= disadvantage)
          .sort((a, b) => b.startVal - a.startVal);

        if (guaranteedPunishes.length === 0) {
          return `
            <div class="guide-section-item" style="border-left:4px solid #f59e0b;">
              <h4>${oppChar.name}: ${oppMove.moveName} (<code>${oppMove.input}</code>) — <span style="color:#fbbf24;">${obVal} en Bloqueo (Seguro)</span></h4>
              <p>Es seguro en bloqueo (${obVal}f), pero <strong>${oppChar.name} pierde su turno</strong>. Responde inmediatamente con tu golpe rápido de ${myChar.name} (<code>${myMoves[0]?.input || "Jab"}</code> de ${myMoves[0]?.startVal || 7}f) para tomar la iniciativa.</p>
            </div>
          `;
        }

        return `
          <div class="guide-section-item" style="border-left:4px solid #10b981;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
              <h4>${oppChar.name}: ${oppMove.moveName} (<code>${oppMove.input}</code>) — <span style="color:#34d399;">${obVal} en Bloqueo (¡CASTIGABLE!)</span></h4>
              <span class="base-game-badge">${guaranteedPunishes.length} castigos garantizados con ${myChar.name}</span>
            </div>
            <p style="margin-bottom:8px;font-size:0.84rem;color:#cbd5e1;">
              Con <strong>${myChar.name}</strong> puedes castigar este ataque de forma 100% garantizada con:
            </p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${guaranteedPunishes
                .slice(0, 6)
                .map(
                  (pm) => `
                  <span class="code-input-pill" style="background:rgba(16,185,129,0.16);color:#6ee7b7;border:1px solid rgba(16,185,129,0.4);">
                    ${pm.moveName} (${pm.input}) • Inicio ${pm.startVal}f (Margen: ${disadvantage - pm.startVal}f)
                  </span>
                `
                )
                .join("")}
            </div>
          </div>
        `;
      })
      .join("");
  };

  gameSel.onchange = populateChars;
  myCharSel.onchange = renderPunishResults;
  oppCharSel.onchange = populateMoves;
  oppMoveSel.onchange = renderPunishResults;

  populateChars();
};

// =========================================================================
// F. TEST DE 10 PREGUNTAS: "¿QUÉ PERSONAJE DEBERÍA ELEGIR?" (JUEGO + PERSONALIDAD)
// =========================================================================
const QUIZ_10_QUESTIONS = [
  {
    num: 1,
    category: "Cómo Quieres Jugar — Distancia Ideal",
    question: "1. ¿En qué distancia de la pantalla te sientes más cómodo durante el combate?",
    options: [
      { label: "Pegado al rival sin dejarle respirar (Cuerpo a cuerpo total)", tags: ["rushdown", "presion", "mix-up"] },
      { label: "A media distancia, entrando y saliendo con golpes precisos", tags: ["all-rounder", "shoto", "footsies", "whiff", "swordie"] },
      { label: "Desde el otro lado de la pantalla controlando el espacio con proyectiles o trampas", tags: ["zoner", "trapper", "alcance"] },
      { label: "Avanzando como un muro imparable para cazar al rival con un agarre letal", tags: ["grappler", "heavy", "powerhouse", "brawler"] }
    ]
  },
  {
    num: 2,
    category: "Personalidad en Combate — Mentalidad",
    question: "2. ¿Cómo describirías tu personalidad y temperamento cuando compites?",
    options: [
      { label: "Impaciente, explosivo y audaz: prefiero llevar siempre la iniciativa", tags: ["rushdown", "velocidad", "ofensivo"] },
      { label: "Calculador, paciente y analítico: me gusta leer los hábitos del rival y castigar", tags: ["defensivo", "parry", "contraataque", "whiff", "equilibrado"] },
      { label: "Creativo, caótico e impredecible: disfruto confundiendo la mente del oponente", tags: ["mix-up", "setplay", "puppet", "tricky", "invisibilidad"] },
      { label: "Implacable, dominante y directo: pocos golpes pero que hagan temblar la barra de vida", tags: ["grappler", "powerhouse", "heavy", "brawler", "daño"] }
    ]
  },
  {
    num: 3,
    category: "Cómo Quieres Jugar — Cómo Abrir la Guardia",
    question: "3. Cuando el oponente se cierra en defensa, ¿cómo prefieres romper su guardia?",
    options: [
      { label: "Con un 50/50 rápido de alto/bajo o cruzándole por encima en el aire", tags: ["mix-up", "rushdown", "aereo"] },
      { label: "Con agarres de comando que le obliguen a tener miedo de bloquear", tags: ["grappler", "strike-throw"] },
      { label: "Desgastando su barra de bloqueo desde lejos hasta que salte desesperado", tags: ["zoner", "chip", "trapper"] },
      { label: "Con cadenas seguras en bloqueo que atrapen cualquier botón que intente tocar (Frame Traps)", tags: ["frame", "all-rounder", "shoto", "brawler"] }
    ]
  },
  {
    num: 4,
    category: "Personalidad — Arquetipo y Carisma",
    question: "4. ¿Con qué tipo de personaje o estética conectas más por tu personalidad?",
    options: [
      { label: "Artista marcial disciplinado, héroe clásico o espadachín honorable", tags: ["shoto", "all-rounder", "swordie", "equilibrado"] },
      { label: "Villano imponente, antihéroe oscuro o maestro de poderes prohibidos", tags: ["mishima", "zoner", "powerhouse", "vortex"] },
      { label: "Ninja veloz, asesino acrobático o luchador rebelde de alta energía", tags: ["rushdown", "movilidad", "ninja", "velocidad"] },
      { label: "Coloso de fuerza bruta, luchador de wrestling o personaje excéntrico y único", tags: ["grappler", "heavy", "tricky", "puppet"] }
    ]
  },
  {
    num: 5,
    category: "Cómo Quieres Jugar — Exigencia Técnica",
    question: "5. ¿Qué nivel de dificultad técnica y práctica en modo entrenamiento buscas?",
    options: [
      { label: "Fácil e intuitivo: quiero combos directos para centrarme en ganar la partida ya", diff: "Fácil", tags: ["simple"] },
      { label: "Dificultad media: un equilibrio entre buena profundidad y ejecución consistente", diff: "Media", tags: ["versatil"] },
      { label: "Alta dificultad: me encantan los retos técnicos, posturas múltiples o Just Frames", diff: "Difícil", tags: ["postura", "puppet", "mishima"] }
    ]
  },
  {
    num: 6,
    category: "Personalidad — Reacción Bajo Presión",
    question: "6. Estás acorralado en la esquina con poca vida. ¿Qué te pide el cuerpo hacer?",
    options: [
      { label: "Lanzar un ataque invencible o un Parry arriesgado para cambiar las tornas al instante", tags: ["parry", "contraataque", "shoto", "reversals"] },
      { label: "Escapar usando teletransporte, vuelo o movilidad extrema", tags: ["movilidad", "teleport", "aereo", "evasion"] },
      { label: "Aguantar firme con armadura y borrarle la vida de dos golpes en cuanto falle", tags: ["armadura", "heavy", "grappler", "comeback"] },
      { label: "Bloquear con calma fría y salir con un poke rápido y seguro", tags: ["all-rounder", "footsies", "defensivo"] }
    ]
  },
  {
    num: 7,
    category: "Cómo Quieres Jugar — Velocidad vs. Potencia",
    question: "7. Si tuvieras que elegir entre velocidad de movimiento o daño por impacto, ¿qué priorizas?",
    options: [
      { label: "Velocidad máxima: correr, saltar con doble Air Dash y abrumar con mil impactos", tags: ["velocidad", "rushdown", "aereo", "glass"] },
      { label: "Equilibrio total: buena caminata, buenos proyectiles y daño sólido", tags: ["all-rounder", "shoto", "equilibrado"] },
      { label: "Potencia devastadora: no me importa moverme más despacio si cada golpe quita un 40%", tags: ["powerhouse", "heavy", "grappler", "brawler"] }
    ]
  },
  {
    num: 8,
    category: "Cómo Quieres Jugar — Recursos y Mecánicas Especiales",
    question: "8. ¿Qué mecánica especial te resulta más divertida de gestionar en partida?",
    options: [
      { label: "Subir de nivel, cargar stocks o potenciar mis ataques durante la ronda", tags: ["nivel", "stocks", "carga", "instakill"] },
      { label: "Colocar trampas, clones o proyectiles en pantalla para encerrar al rival", tags: ["setplay", "trapper", "clones", "zoner"] },
      { label: "Cambiar entre distintas posturas de combate (Stances) con múltiples opciones", tags: ["postura", "stance", "mix-up"] },
      { label: "Sin complicaciones de contadores extra: mis puños, patadas y barras universales", tags: ["shoto", "all-rounder", "rushdown", "brawler"] }
    ]
  },
  {
    num: 9,
    category: "Personalidad — Qué te da más Satisfacción",
    question: "9. ¿Qué momento te produce mayor satisfacción cuando ganas una partida?",
    options: [
      { label: "Adivinar exactamente lo que iba a hacer el rival y destruirle con un agarre o Counter", tags: ["grappler", "counter", "parry", "mishima"] },
      { label: "Ejecutar un combo largo y estilizado llevando al rival de punta a punta del escenario", tags: ["rushdown", "corner", "combo"] },
      { label: "Ganar por frustración rival sin dejar que se acerque a mí en toda la ronda", tags: ["zoner", "alcance", "keepout"] },
      { label: "Dominar el centro del escenario con fundamentos limpios y sin fisuras", tags: ["all-rounder", "shoto", "fundamentos"] }
    ]
  },
  {
    num: 10,
    category: "Preferencia de Juego",
    question: "10. ¿Para qué juego quieres ver tus personajes ideales recomendados?",
    options: [
      { label: "Mostrar mis mejores personajes en TODOS los juegos a la vez", gameFilter: "all", tags: [] },
      { label: "Mortal Kombat 1 o Street Fighter 6 (Lucha 2D tradicional)", gameFilter: "2d", tags: [] },
      { label: "Tekken 8 (Lucha 3D)", gameFilter: "tekken8", tags: [] },
      { label: "Dragon Ball FighterZ, Guilty Gear -Strive- o Super Smash Bros. Ultimate", gameFilter: "anime_smash", tags: [] }
    ]
  }
];

const quizState = {
  currentStep: 0,
  answers: new Array(10).fill(null)
};

window.initPersonalityQuiz = function () {
  quizState.currentStep = 0;
  quizState.answers = new Array(10).fill(null);
  renderQuizStep();
};

function renderQuizStep() {
  const container = document.getElementById("quizContainerBox");
  if (!container) return;

  if (quizState.currentStep >= QUIZ_10_QUESTIONS.length) {
    renderQuizRecommendations(container);
    return;
  }

  const qObj = QUIZ_10_QUESTIONS[quizState.currentStep];
  const progressPct = Math.round(((quizState.currentStep + 1) / QUIZ_10_QUESTIONS.length) * 100);

  container.innerHTML = `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;color:#fbbf24;margin-bottom:6px;">
        <span>${qObj.category}</span>
        <span>Pregunta ${qObj.num} de 10 (${progressPct}%)</span>
      </div>
      <div style="width:100%;height:8px;background:#090d16;border-radius:999px;overflow:hidden;border:1px solid #293548;">
        <div style="width:${progressPct}%;height:100%;background:linear-gradient(90deg,#f59e0b,#ec4899);"></div>
      </div>
    </div>

    <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:14px;">
      ${qObj.question}
    </h3>

    <div style="display:flex;flex-direction:column;gap:10px;">
      ${qObj.options
        .map(
          (opt, idx) => `
          <button class="quiz-option-btn" data-optidx="${idx}">
            <span class="quiz-opt-letter">${String.fromCharCode(65 + idx)}</span>
            <span>${opt.label}</span>
          </button>
        `
        )
        .join("")}
    </div>

    <div style="display:flex;justify-content:space-between;margin-top:16px;">
      ${
        quizState.currentStep > 0
          ? `<button class="btn btn-outline" id="btnQuizPrev">⬅ Pregunta anterior</button>`
          : `<span></span>`
      }
      <button class="btn btn-outline" id="btnQuizRestart">Reiniciar test</button>
    </div>
  `;

  container.querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.onclick = () => {
      const idx = Number(btn.dataset.optidx);
      quizState.answers[quizState.currentStep] = qObj.options[idx];
      quizState.currentStep++;
      renderQuizStep();
    };
  });

  const prevBtn = document.getElementById("btnQuizPrev");
  if (prevBtn) {
    prevBtn.onclick = () => {
      quizState.currentStep--;
      renderQuizStep();
    };
  }

  const restartBtn = document.getElementById("btnQuizRestart");
  if (restartBtn) {
    restartBtn.onclick = () => window.initPersonalityQuiz();
  }
}

function renderQuizRecommendations(container) {
  const tagWeights = {};
  let preferredDiff = null;
  let gameFilter = "all";

  quizState.answers.forEach((ans) => {
    if (!ans) return;
    if (ans.diff) preferredDiff = ans.diff;
    if (ans.gameFilter) gameFilter = ans.gameFilter;
    (ans.tags || []).forEach((t) => {
      tagWeights[t] = (tagWeights[t] || 0) + 1;
    });
  });

  // Evaluar los 271 personajes según afinidad con las 10 respuestas
  let targetGames = state.games;
  if (gameFilter === "2d") {
    targetGames = state.games.filter((g) => g.id === "mk1" || g.id === "sf6");
  } else if (gameFilter === "tekken8") {
    targetGames = state.games.filter((g) => g.id === "tekken8");
  } else if (gameFilter === "anime_smash") {
    targetGames = state.games.filter((g) => ["dbfz", "gg-strive", "ssbu"].includes(g.id));
  }

  const scored = [];
  targetGames.forEach((game) => {
    game.characters.forEach((ch) => {
      let score = 50;
      const textBlob = `${ch.archetype} ${ch.overview} ${ch.gameplan}`.toLowerCase();

      Object.keys(tagWeights).forEach((tag) => {
        if (textBlob.includes(tag)) {
          score += tagWeights[tag] * 11;
        }
      });

      if (preferredDiff && ch.difficulty === preferredDiff) {
        score += 14;
      }

      const matchPct = Math.min(99, Math.max(76, score));
      scored.push({ game, ch, score, matchPct });
    });
  });

  scored.sort((a, b) => b.score - a.score);

  // Seleccionar el mejor personaje de cada juego objetivo (hasta 6 recomendaciones principales)
  const topRecommendations = [];
  const usedGames = new Set();

  scored.forEach((item) => {
    if (topRecommendations.length < 6 && (!usedGames.has(item.game.id) || targetGames.length < 3)) {
      topRecommendations.push(item);
      usedGames.add(item.game.id);
    }
  });

  container.innerHTML = `
    <div class="ufd-section-banner" style="margin-top:0;">
      Resultado de tus 10 Respuestas — Tus Personajes Ideales (Estilo de Juego + Personalidad)
    </div>
    <p style="font-size:0.88rem;color:#cbd5e1;margin-bottom:16px;">
      Según tu forma de jugar y tu temperamento competitivo, estos son los luchadores que mejor encajan contigo:
    </p>

    <div class="news-grid">
      ${topRecommendations
        .map(({ game, ch, matchPct }) => {
          const cachedSrc = clientPortraitCache.get(ch.id) || ch.iconUrl;
          return `
            <div class="video-panel-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <span class="news-cat-badge">${matchPct}% Afinidad Contigo</span>
                  <span class="news-saga-badge">${game.title}</span>
                </div>
                <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px;">
                  <div class="portrait-img-box" style="width:64px;height:64px;flex-shrink:0;">
                    <img src="${cachedSrc}" alt="${ch.name}" onload="window.handlePortraitLoad(this)" />
                  </div>
                  <div>
                    <h4 style="font-family:var(--font-display);font-size:1.2rem;">${ch.name}</h4>
                    <div style="font-size:0.78rem;color:#fbbf24;">${ch.archetype} • Dificultad: ${ch.difficulty}</div>
                  </div>
                </div>
                <p style="font-size:0.82rem;color:#cbd5e1;">
                  <strong>Por qué encaja con tu personalidad y juego:</strong> ${ch.overview}
                </p>
              </div>
              <button class="btn btn-primary" data-openrecgame="${game.id}" data-openrecchar="${ch.id}" style="width:100%;justify-content:center;">
                Abrir Guía, Hitboxes y Combos de ${ch.name} ➔
              </button>
            </div>
          `;
        })
        .join("")}
    </div>

    <div style="margin-top:18px;text-align:center;">
      <button class="btn btn-outline" id="btnRepeatQuiz10">🔄 Volver a hacer el Test de 10 Preguntas</button>
    </div>
  `;

  container.querySelectorAll("[data-openrecchar]").forEach((btn) => {
    btn.onclick = () => {
      const gId = btn.dataset.openrecgame;
      const cId = btn.dataset.openrecchar;
      document.getElementById("toolsView")?.classList.add("hidden");
      openGameHub(gId, "page-roster");
      openCharacterModal(gId, cId);
    };
  });

  document.getElementById("btnRepeatQuiz10").onclick = () => window.initPersonalityQuiz();
}

// =========================================================================
// INICIALIZACIÓN DEL CENTRO DE HERRAMIENTAS (TEST 10 PREGUNTAS, CALCULADORA, GLOSARIO E INSPECTOR)
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Controles del modal Inspector de Hitboxes Frame a Frame
  const hbSlider = document.getElementById("hbFrameSlider");
  const btnPrevF = document.getElementById("btnHbPrevFrame");
  const btnNextF = document.getElementById("btnHbNextFrame");
  const btnPlayP = document.getElementById("btnHbPlayPause");
  const btnCloseHb = document.getElementById("btnCloseHitboxInspector");

  if (hbSlider) {
    hbSlider.addEventListener("input", (e) => {
      stopInspectorPlayback();
      inspectorState.currentFrame = Number(e.target.value);
      renderInspectorFrame();
    });
  }
  if (btnPrevF) {
    btnPrevF.addEventListener("click", () => {
      stopInspectorPlayback();
      inspectorState.currentFrame = Math.max(1, inspectorState.currentFrame - 1);
      if (hbSlider) hbSlider.value = inspectorState.currentFrame;
      renderInspectorFrame();
    });
  }
  if (btnNextF) {
    btnNextF.addEventListener("click", () => {
      stopInspectorPlayback();
      inspectorState.currentFrame = Math.min(inspectorState.totalFrames, inspectorState.currentFrame + 1);
      if (hbSlider) hbSlider.value = inspectorState.currentFrame;
      renderInspectorFrame();
    });
  }
  if (btnPlayP) {
    btnPlayP.addEventListener("click", toggleInspectorPlayback);
  }
  if (btnCloseHb) {
    btnCloseHb.addEventListener("click", () => {
      stopInspectorPlayback();
      document.getElementById("hitboxInspectorModalBackdrop")?.classList.add("hidden");
    });
  }

  // Renderizar lista del Glosario FGC en la pestaña de herramientas
  const glossaryGrid = document.getElementById("glossaryCardsGrid");
  const glossarySearch = document.getElementById("glossarySearchInput");
  const renderGlossary = (filterText = "") => {
    if (!glossaryGrid) return;
    const q = filterText.trim().toLowerCase();
    const list = FGC_GLOSSARY.filter(
      (g) => !q || g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q)
    );
    glossaryGrid.innerHTML = list
      .map(
        (g) => `
        <div class="guide-section-item" style="margin-top:0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <h4 style="margin:0;">${g.term}</h4>
            <span class="diff-badge">${g.category}</span>
          </div>
          <p style="font-size:0.85rem;">${g.definition}</p>
        </div>
      `
      )
      .join("");
  };
  renderGlossary();
  if (glossarySearch) {
    glossarySearch.addEventListener("input", (e) => renderGlossary(e.target.value));
  }
});
