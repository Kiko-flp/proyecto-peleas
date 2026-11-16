/**
 * FGC Vault — Módulo de Herramientas Avanzadas (v15)
 * Contiene:
 * A) Calculadora Interactiva de Castigos en Bloqueo (Punish Calculator)
 * C) Reproductor con Auto-Pausa Inteligente y Superposición (Overlay) en Español
 * D) Inspector de Hitboxes Frame a Frame (⏮ -1f | ⏸ Pausa | ⏭ +1f + Barra deslizante)
 * E) Diccionario / Glosario FGC con Ventanas Flotantes (Tooltips automáticos)
 * F) Sistema de Tests de 10 Preguntas (Estilo de Juego + Personalidad):
 *    - 1 Test General (Todos los juegos)
 *    - 6 Tests Específicos por Juego (MK1, SF6, Tekken 8, DBFZ, GGST y Smash Ultimate),
 *      cada uno con 10 preguntas adaptadas a las mecánicas y personalidades de ese juego.
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
// D. INSPECTOR DE HITBOXES FRAME A FRAME
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
  inspectorState.currentFrame = nums.activeStart;
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

        <rect x="${105 + extendX * 0.4}" y="58" width="52" height="120" rx="16"
          fill="rgba(56, 189, 248, 0.18)" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3" />
        <text x="${108 + extendX * 0.4}" y="52" fill="#38bdf8" font-family="monospace" font-size="10">HURTBOX</text>

        <circle cx="${131 + extendX * 0.4}" cy="74" r="14" fill="#e2e8f0" />
        <path d="M${115 + extendX * 0.4} 90 L${147 + extendX * 0.4} 90 L${144 + extendX * 0.4} 140 L${118 + extendX * 0.4} 140 Z" fill="#cbd5e1" />
        <line x1="${122 + extendX * 0.4}" y1="140" x2="${110 + extendX * 0.4}" y2="178" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" />
        <line x1="${140 + extendX * 0.4}" y1="140" x2="${154 + extendX * 0.4}" y2="178" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" />

        <g transform="rotate(${limbAngle}, ${142 + extendX}, 102)">
          <line x1="${142 + extendX}" y1="102" x2="${238 + extendX * 2}" y2="98"
            stroke="${isHitboxActive ? "#fbbf24" : "#94a3b8"}" stroke-width="11" stroke-linecap="round" />
        </g>

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
// F. SISTEMA DE TESTS DE 10 PREGUNTAS:
//    1) TEST GENERAL (TODOS LOS JUEGOS)
//    2) TEST ESPECÍFICO DE 10 PREGUNTAS POR CADA JUEGO (MK1, SF6, TEKKEN 8, DBFZ, GGST, SSBU)
// =========================================================================

// Banco de preguntas comunes de Estilo de Juego + Personalidad (Preguntas 5 a 10 para completar los 10 ítems de cada juego)
const SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL = [
  {
    num: 5,
    category: "Cómo Quieres Jugar — Exigencia Técnica",
    question: "5. ¿Qué nivel de dificultad técnica y práctica en entrenamiento prefieres?",
    options: [
      { label: "Fácil e intuitivo: quiero combos directos para centrarme en leer al rival", diff: "Fácil", tags: ["simple", "fácil"] },
      { label: "Dificultad media: buen equilibrio entre profundidad y consistencia en torneo", diff: "Media", tags: ["versatil", "equilibrado"] },
      { label: "Alta dificultad: disfruto dominando personajes técnicos, posturas o ejecuciones precisas", diff: "Difícil", tags: ["postura", "puppet", "mishima", "difícil"] }
    ]
  },
  {
    num: 6,
    category: "Personalidad — Reacción Bajo Presión en la Esquina",
    question: "6. Estás acorralado contra el muro con poca vida. ¿Cómo reacciona tu personalidad?",
    options: [
      { label: "Sin miedo: lanzo un Parry o ataque invencible para robar el turno al instante", tags: ["parry", "contraataque", "shoto", "reversals"] },
      { label: "Escurridizo: escapo usando teletransporte, vuelo o movilidad aérea", tags: ["movilidad", "teleport", "aereo", "evasion"] },
      { label: "Imparable: aguanto con armadura y borro la vida rival de un solo golpe pesado", tags: ["armadura", "heavy", "grappler", "powerhouse"] },
      { label: "Frío y paciente: bloqueo hasta ver el hueco exacto para castigar con precisión", tags: ["all-rounder", "footsies", "defensivo", "whiff"] }
    ]
  },
  {
    num: 7,
    category: "Cómo Quieres Jugar — Velocidad vs. Potencia",
    question: "7. Entre velocidad de movimiento o potencia de daño por golpe, ¿qué eliges?",
    options: [
      { label: "Velocidad vertiginosa: quiero cruzar la pantalla y abrumar con ataques rápidos", tags: ["velocidad", "rushdown", "aereo", "glass", "rápido"] },
      { label: "Equilibrio completo: buena velocidad de paso y buen daño en cualquier situación", tags: ["all-rounder", "shoto", "equilibrado", "versátil"] },
      { label: "Potencia demoledora: prefiero golpes pesados que quiten media barra de vida", tags: ["powerhouse", "heavy", "grappler", "brawler", "daño"] }
    ]
  },
  {
    num: 8,
    category: "Personalidad — Carisma e Identidad de tu Luchador",
    question: "8. ¿Con qué personalidad y carisma de personaje te sientes más identificado?",
    options: [
      { label: "Maestro marcial disciplinado, héroe honorable o luchador clásico", tags: ["shoto", "all-rounder", "swordie", "karate", "equilibrado"] },
      { label: "Villano imponente, antihéroe oscuro o usuario de poderes sombríos", tags: ["mishima", "oscuridad", "caos", "veneno", "zoner", "powerhouse"] },
      { label: "Guerrero rebelde, ninja veloz, asesino letal o prodigio acrobático", tags: ["rushdown", "ninja", "movilidad", "sigilo", "velocidad"] },
      { label: "Coloso carismático, luchador de wrestling o mente maestra impredecible", tags: ["grappler", "heavy", "tricky", "puppet", "setplay"] }
    ]
  },
  {
    num: 9,
    category: "Cómo Quieres Jugar — Cómo Abrir la Guardia Rival",
    question: "9. ¿Cuál es tu forma favorita de romper a un oponente que no deja de bloquear?",
    options: [
      { label: "Obligarle a adivinar un 50/50 constante entre golpe bajo, overhead o cruce", tags: ["mix-up", "50/50", "overhead", "postura"] },
      { label: "Intimidarle con agarres de comando e imbloqueables de alto daño", tags: ["grappler", "agarre", "strike-throw"] },
      { label: "Desgastarle desde lejos con proyectiles, trampas y daño residual (Chip)", tags: ["zoner", "chip", "trapper", "proyectil"] },
      { label: "Hacer que falle un golpe al aire (Whiff) y castigarle con un combo óptimo", tags: ["whiff", "alcance", "footsies", "counter"] }
    ]
  },
  {
    num: 10,
    category: "Personalidad — Tu Mayor Satisfacción al Ganar",
    question: "10. ¿Qué te produce mayor satisfacción personal al cerrar una ronda?",
    options: [
      { label: "Leer la mente del rival como un libro abierto con un Counter o agarre letal", tags: ["counter", "parry", "grappler", "mishima"] },
      { label: "Ejecutar un combo largo y vistoso llevando al rival de punta a punta al muro", tags: ["rushdown", "combo", "corner"] },
      { label: "Ganar controlando toda la pantalla sin que el rival haya podido ni tocarme", tags: ["zoner", "alcance", "keepout", "trapper"] },
      { label: "Ganar por fundamentos puros adaptándome a cualquier situación de la partida", tags: ["all-rounder", "shoto", "equilibrado", "fundamentos"] }
    ]
  }
];

const QUIZ_BANKS = {
  // 1. TEST GENERAL (TODOS LOS JUEGOS)
  general: {
    title: "Test General FGC (Todos los Juegos)",
    subtitle: "Descubre qué personajes de los 6 juegos encajan mejor con tu forma de jugar y tu personalidad.",
    targetGameId: "all",
    questions: [
      {
        num: 1,
        category: "Cómo Quieres Jugar — Distancia en Pantalla",
        question: "1. ¿En qué distancia de la pantalla te sientes más cómodo durante el combate?",
        options: [
          { label: "Pegado al rival sin dejarle respirar (Cuerpo a cuerpo asfixiante)", tags: ["rushdown", "presión", "mix-up"] },
          { label: "A media distancia, controlando el espacio con golpes de buen alcance", tags: ["all-rounder", "shoto", "footsies", "whiff", "swordie"] },
          { label: "Desde lejos, dominando la pantalla con proyectiles o trampas", tags: ["zoner", "trapper", "alcance"] },
          { label: "Avanzando con fuerza para atrapar al rival con agarres o golpes pesados", tags: ["grappler", "heavy", "powerhouse", "brawler"] }
        ]
      },
      {
        num: 2,
        category: "Personalidad — Temperamento Competitivo",
        question: "2. ¿Cómo describes tu personalidad cuando juegas una partida competitiva?",
        options: [
          { label: "Agresivo, audaz y eléctrico: quiero llevar el ritmo del combate siempre", tags: ["rushdown", "velocidad", "ofensivo"] },
          { label: "Calculador, sereno y metódico: espero el error del rival para castigar", tags: ["defensivo", "parry", "contraataque", "whiff", "equilibrado"] },
          { label: "Creativo, travieso e impredecible: me encanta engañar y confundir", tags: ["mix-up", "setplay", "puppet", "tricky", "invisibilidad"] },
          { label: "Dominante e intimidante: prefiero que el rival tenga miedo de acercarse", tags: ["grappler", "powerhouse", "heavy", "daño"] }
        ]
      },
      {
        num: 3,
        category: "Cómo Quieres Jugar — Mecánicas de Sistema",
        question: "3. ¿Qué tipo de sistema de combate disfrutas más?",
        options: [
          { label: "Combos con asistencias o compañeros en pantalla (Kameos / 3v3 Assists)", tags: ["kameo", "setplay", "point", "anchor"] },
          { label: "Duelo 1 contra 1 puro de suelo, footsies y gestión de barra (Drive / Tension)", tags: ["shoto", "footsies", "all-rounder", "rushdown"] },
          { label: "Combate 3D con pasos laterales (Sidestep), posturas y muros explosivos", tags: ["mishima", "postura", "counter"] },
          { label: "Libertad total de plataformas, saltos múltiples y sacar al rival del escenario", tags: ["aereo", "swordie", "bair"] }
        ]
      },
      {
        num: 4,
        category: "Cómo Quieres Jugar — Recursos Especiales",
        question: "4. ¿Qué te gusta hacer durante el transcurso de la ronda?",
        options: [
          { label: "Subir niveles, cargar medidores propios o desbloquear transformaciones", tags: ["nivel", "stocks", "carga", "instakill", "arsene"] },
          { label: "Plagar el escenario de clones, bombas o proyectiles de control", tags: ["setplay", "trapper", "clones", "zoner"] },
          { label: "Alternar entre distintas posturas de ataque para ser impredecible", tags: ["postura", "stance", "mix-up"] },
          { label: "Ir directo al grano con mis ataques normales y especiales sin recargas extra", tags: ["shoto", "all-rounder", "rushdown", "brawler"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 2. TEST ESPECÍFICO: MORTAL KOMBAT 1
  mk1: {
    title: "Test de Mortal Kombat 1 (10 Preguntas)",
    subtitle: "Encuentra tu luchador ideal entre los 35 personajes (Juego Base, Kombat Pack 1 y Khaos Reigns).",
    targetGameId: "mk1",
    questions: [
      {
        num: 1,
        category: "Mortal Kombat 1 — Plan de Juego en Neutro",
        question: "1. En Mortal Kombat 1, ¿cómo quieres dominar el inicio de la ronda?",
        options: [
          { label: "Castigando fallos a media distancia con arpón, espadas o látigos largos", tags: ["whiff", "alcance", "mid-range"] },
          { label: "Entrando con presión cuerpo a cuerpo, Frame Traps y daño por Chip en bloqueo", tags: ["rushdown", "presión", "chip", "frame"] },
          { label: "Controlando el escenario con clones de hielo/sombra, portales o proyectiles", tags: ["zoner", "clones", "portales", "setplay"] },
          { label: "Con invisibilidad, teletransportes o vuelo para sorprender por cualquier ángulo", tags: ["invisibilidad", "teletransporte", "vuelo", "mix-up"] }
        ]
      },
      {
        num: 2,
        category: "Mortal Kombat 1 — Sinergia con tu Kameo",
        question: "2. ¿Para qué quieres usar principalmente a tu compañero Kameo (R1)?",
        options: [
          { label: "Para hacer seguros mis ataques arriesgados y mantenerme pegado presionando", tags: ["rushdown", "presión", "chip"] },
          { label: "Para crear un 50/50 imposible de bloquear (Overhead + Bajo simultáneo)", tags: ["mix-up", "invisibilidad", "clones"] },
          { label: "Para extender combos de más del 40-45% de daño desde cualquier toque", tags: ["whiff", "daño", "powerhouse", "vuelo"] },
          { label: "Para controlar toda la pantalla con proyectiles, bombas o redes de captura", tags: ["zoner", "setplay", "bombas", "trampas"] }
        ]
      },
      {
        num: 3,
        category: "Personalidad en MK1 — Identidad en el Torneo",
        question: "3. ¿Con qué facción o personalidad del universo de Mortal Kombat 1 conectas más?",
        options: [
          { label: "Ninjas clásicos (Lin Kuei / Shirai Ryu: fuego, hielo, humo, ácido o sombras)", tags: ["whiff", "clones", "invisibilidad", "teletransporte"] },
          { label: "Campeones marciales y realeza del Mundo Exterior (fuego, rayos, abanicos, magia)", tags: ["shoto", "rushdown", "zoner", "levitate"] },
          { label: "Hechiceros oscuros, cibernéticos (Cyrax/Sektor) o señores de la guerra implacables", tags: ["portales", "bombas", "misiles", "hacha", "grappler"] },
          { label: "Invitados icónicos del cine y cómics (Omni-Man, Homelander, Ghostface, Conan, T-1000)", tags: ["viltrumita", "vuelo", "sigilo", "metal", "bárbaro"] }
        ]
      },
      {
        num: 4,
        category: "Mortal Kombat 1 — Herramienta Favorita",
        question: "4. ¿Qué herramienta específica de MK1 te resulta más divertida de usar?",
        options: [
          { label: "Controlar un espíritu/marioneta (Sento) o clon para atacar en sándwich", tags: ["puppet", "clon", "setplay"] },
          { label: "Vuelo libre en el aire (Levitate / Air Dash) para dominar desde arriba", tags: ["vuelo", "levitate", "aérea"] },
          { label: "Agarres de comando, armadura o parries que destrozan al rival de cerca", tags: ["grappler", "parries", "armadura", "powerhouse"] },
          { label: "Cadenas rápidas de 7-9 frames y proyectiles sólidos sin complicaciones", tags: ["shoto", "rushdown", "frame"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 3. TEST ESPECÍFICO: STREET FIGHTER 6
  sf6: {
    title: "Test de Street Fighter 6 (10 Preguntas)",
    subtitle: "Encuentra tu Main entre los 30 luchadores de SF6 (Juego Base y Pases de Año 1, 2 y 3).",
    targetGameId: "sf6",
    questions: [
      {
        num: 1,
        category: "Street Fighter 6 — Uso del Drive Gauge",
        question: "1. En Street Fighter 6 empiezas con 6 barras verdes de Drive. ¿Cómo prefieres gastarlas?",
        options: [
          { label: "Lanzando Drive Rush en neutro para entrar a toda velocidad con ventaja (+frames)", tags: ["rushdown", "corner", "movilidad"] },
          { label: "Haciendo 2MK cancelado en Drive Rush para confirmar combos y llevar a la esquina", tags: ["shoto", "footsies", "equilibrado"] },
          { label: "Usando proyectiles OD y control de espacio para agotar el Drive rival (Burnout)", tags: ["zoner", "portales", "veneno"] },
          { label: "Avanzando con Parry y armadura para conectar un agarre de comando devastador", tags: ["grappler", "armadura", "medallas", "brawler"] }
        ]
      },
      {
        num: 2,
        category: "Street Fighter 6 — Arquetipo de Combate",
        question: "2. ¿Qué estilo de Street Fighter 6 va más con tu forma de pensar?",
        options: [
          { label: "Shoto versátil (Hadoken, Shoryuken antiaéreo y patada giratoria)", tags: ["shoto", "denjin", "equilibrado"] },
          { label: "Rushdown de presión constante, Divekicks, fintas o latas explosivas en esquina", tags: ["rushdown", "divekick", "fintas", "latas"] },
          { label: "Grappler o Brawler pesado: un par de lecturas correctas y se acabó la ronda", tags: ["grappler", "brawler", "armadura", "piledriver", "medallas"] },
          { label: "Zoner táctico de largo alcance (Sonic Boom, extremidades largas, veneno o portales)", tags: ["zoner", "portales", "veneno", "extremidades"] }
        ]
      },
      {
        num: 3,
        category: "Street Fighter 6 — Mecánica de Recurso Propio",
        question: "3. Muchos personajes de SF6 tienen un recurso único. ¿Cuál te llama más la atención?",
        options: [
          { label: "Cargas elementales o stocks para potenciar mis especiales (Denjin, Fuha, Viento, Bebida)", tags: ["denjin", "fuha", "viento", "bebida"] },
          { label: "Subir medallas de agarre (Nivel 1 a 5) o plantar minas explosivas (Psycho Mine)", tags: ["medallas", "mine", "grappler"] },
          { label: "Fintas de movimiento, posturas técnicas o gadgets de alta ejecución", tags: ["postura", "fintas", "gadgets", "capoeira"] },
          { label: "Prefiero no depender de contadores extra y centrarme en el Drive System puro", tags: ["shoto", "rushdown", "divekick", "grappler"] }
        ]
      },
      {
        num: 4,
        category: "Personalidad en SF6 — Tu Actitud en el Ring",
        question: "4. ¿Con qué personalidad de luchador de Street Fighter 6 te identificas más?",
        options: [
          { label: "El buscador de la perfección marcial (Ryu, Luke, Ken, Sagat, Terry)", tags: ["shoto", "muay", "equilibrado"] },
          { label: "El depredador agresivo y despiadado (Akuma, M. Bison, Juri, A.K.I.)", tags: ["glass", "mine", "fuha", "veneno"] },
          { label: "El espectáculo carismático y lleno de ritmo (Dee Jay, Kimberly, Rashid, Mai, Elena)", tags: ["fintas", "ninja", "movilidad", "abanicos", "capoeira"] },
          { label: "La fuerza imparable del coliseo (Marisa, Zangief, Manon, Alex, E. Honda)", tags: ["armadura", "grappler", "medallas", "carga"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 4. TEST ESPECÍFICO: TEKKEN 8
  tekken8: {
    title: "Test de Tekken 8 (10 Preguntas)",
    subtitle: "Encuentra tu personaje ideal entre los 44 luchadores de Tekken 8 (Base + Seasons 1, 2 y 3).",
    targetGameId: "tekken8",
    questions: [
      {
        num: 1,
        category: "Tekken 8 — Enfoque del Combate 3D",
        question: "1. En Tekken 8, ¿cuál quieres que sea tu arma principal para ganar?",
        options: [
          { label: "Dominio Mishima: Wave Dash, Electric (EWGF) y un Vortex 50/50 letal", tags: ["mishima", "vortex", "sentai", "warrior"] },
          { label: "Presión infinita con posturas (Stances), cadenas de patadas o fintas de boxeo", tags: ["posturas", "flamingo", "boxeador", "sentai", "capoeira"] },
          { label: "Cazar botones rivales con Counter Hits devastadores y muros explosivos", tags: ["counter", "powerhouse", "deathfist", "muay"] },
          { label: "Evasión extrema, Parries, Sabakis o cadenas de agarres imposibles de romper", tags: ["evasión", "parries", "grappler", "sidestep", "ninjutsu"] }
        ]
      },
      {
        num: 2,
        category: "Tekken 8 — Cómo Usas el Heat System",
        question: "2. Cuando activas el estado Heat en Tekken 8, ¿qué buscas hacer?",
        options: [
          { label: "Lanzar Electrics sin ejecución perfecta o potenciar mis barridos bajos", tags: ["mishima", "vortex", "devil"] },
          { label: "Asfixiar el bloqueo rival con daño residual (Chip) usando armas, motosierras o pistolas", tags: ["pistolas", "motosierras", "espada", "eikons"] },
          { label: "Forzar una adivinanza 50/50 garantizada tras correr con un Heat Engager", tags: ["mix-up", "posturas", "powerhouse", "grappler"] },
          { label: "Recuperar vida (curación) o tener un contraataque listo si el rival se precipita", tags: ["curación", "defensivo", "contraataques", "parries"] }
        ]
      },
      {
        num: 3,
        category: "Tekken 8 — Movimiento y Complejidad",
        question: "3. ¿Qué tipo de catálogo de movimientos prefieres manejar en Tekken 8?",
        options: [
          { label: "Directo y contundente: pocos movimientos clave pero de enorme impacto", tags: ["simple", "powerhouse", "keepout", "starburst"] },
          { label: "Fluido con transiciones automáticas a posturas de ataque", tags: ["posturas", "sentai", "libertador", "capoeira"] },
          { label: "Artes marciales tradicionales con pokes evasivos y excelente Sidestep", tags: ["sidestep", "kenpo", "karate", "bajiquan"] },
          { label: "Técnico y único: Just Frames, múltiples cadenas de agarres o trucos ninja", tags: ["just", "grappler", "ninjutsu", "flash", "boxeador"] }
        ]
      },
      {
        num: 4,
        category: "Personalidad en Tekken 8 — Tu Estilo en el Torneo del Puño de Hierro",
        question: "4. ¿Qué perfil de luchador de Tekken 8 encaja mejor con tu personalidad?",
        options: [
          { label: "Linaje Mishima / Kazama: ambición, rayos y poder absoluto (Jin, Kazuya, Reina, Heihachi)", tags: ["mishima", "kazama", "sentai"] },
          { label: "Luchador implacable de contacto puro (Bryan, Paul,Steve, Armor King, Fahkumram, Yujiro)", tags: ["counter", "powerhouse", "boxeador", "grappler", "muay", "baki"] },
          { label: "Maestro elegante, veloz o de armas (Victor, Clive, Kunimitsu, Lee, Lili, Lars)", tags: ["espada", "eikons", "ninjutsu", "sidestep", "posturas"] },
          { label: "Especialista impredecible o irreverente (Yoshimitsu, Xiaoyu, Kuma, Roger Jr., Azucena)", tags: ["flash", "evasión", "bear", "canguro", "libertador"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 5. TEST ESPECÍFICO: DRAGON BALL FIGHTERZ
  dbfz: {
    title: "Test de Dragon Ball FighterZ (10 Preguntas)",
    subtitle: "Descubre tus personajes ideales (y tu equipo 3v3: Point, Mid y Anchor) entre los 44 luchadores.",
    targetGameId: "dbfz",
    questions: [
      {
        num: 1,
        category: "Dragon Ball FighterZ — Tu Rol Favorito en el Equipo 3v3",
        question: "1. En un equipo de 3 personajes de DBFZ, ¿en qué posición disfrutas más brillando?",
        options: [
          { label: "Point (1º en salir): quiero abrir al rival respaldado por mis dos asistencias", tags: ["point", "mix-up", "loops", "presión"] },
          { label: "Mid (2º en salir): quiero dominar el neutro, tener buena asistencia y daño masivo", tags: ["mid", "alcance", "espada", "contraataques"] },
          { label: "Anchor (Último en pie): quiero remontar partidas 1 contra 3 con Limit Break y Sparking", tags: ["anchor", "beam", "todoterreno", "daño"] },
          { label: "Todoterreno flexible: quiero un personaje que funcione bien en cualquier posición", tags: ["todoterreno", "lariat", "fácil"] }
        ]
      },
      {
        num: 2,
        category: "Dragon Ball FighterZ — Cómo Ganar el Neutro",
        question: "2. A la velocidad de Dragon Ball FighterZ, ¿cómo prefieres controlar la pantalla?",
        options: [
          { label: "Con Kamehamehas (Beams) y Ki Blasts que cubran todo el ángulo horizontal", tags: ["beam", "zoner", "ki"] },
          { label: "Cruzando la pantalla al instante con un Lariat, espada de Ki o teletransporte", tags: ["lariat", "teleport", "espada", "velocidad"] },
          { label: "Con armadura de gigante, agarres imbloqueables o barreras defensivas", tags: ["grappler", "armadura", "barrera"] },
          { label: "Con contraataques (Counters), esquivas automáticas o doble Air Dash aéreo", tags: ["contraataques", "defensivo", "reversals", "air dash"] }
        ]
      },
      {
        num: 3,
        category: "Dragon Ball FighterZ — Estilo de Presión en Bloqueo",
        question: "3. Cuando tienes al rival bloqueando tus cadenas con asistencias, ¿qué buscas?",
        options: [
          { label: "Mezclar varios golpes bajos (2L/2M), saltos rápidos (IAD) y teletransportes", tags: ["mix-up", "point", "loops", "flips"] },
          { label: "Invocar ayudantes (Saibamen, Fuerzas Ginyu, Androide 17 o Fantasmas) para encerrarlo", tags: ["setplay", "invocación", "fantasmas", "barrera"] },
          { label: "Subir niveles (Gohan Adulto / Gogeta SS4) o aplicar debuffs (Lab Coat 21)", tags: ["niveles", "instakill", "debuff"] },
          { label: "Agarrarlo o romper su paciencia con ataques de alcance enorme", tags: ["grappler", "alcance", "patadas"] }
        ]
      },
      {
        num: 4,
        category: "Personalidad en DBFZ — Tu Energía Saiyajin",
        question: "4. ¿Con qué grupo de luchadores de Dragon Ball conectas más por personalidad?",
        options: [
          { label: "Guerreros Saiyajin y Fusiones imparables (Goku, Vegeta, Vegito, Gogeta, Gohan, Bardock)", tags: ["anchor", "point", "lariat", "patadas", "instakill"] },
          { label: "Villanos icónicos y destructores (Cell, Frieza, Kid Buu, Broly, Zamasu, Baby, Janemba)", tags: ["perfect", "zoner", "grappler", "vuelo", "teletransporte"] },
          { label: "Androides implacables (Androide 16, 17, 18, Androide 21 Majin / Lab Coat)", tags: ["grappler", "barrera", "absorción", "debuff"] },
          { label: "Maestros tácticos y asesinos de élite (Hit, Piccolo, Trunks, Jiren, Beerus, Roshi)", tags: ["contraataques", "orbes", "flips", "esferas", "mafuba"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 6. TEST ESPECÍFICO: GUILTY GEAR -STRIVE-
  "gg-strive": {
    title: "Test de Guilty Gear -Strive- (10 Preguntas)",
    subtitle: "Encuentra tu personaje ideal entre los 32 luchadores de GGST (Juego Base y Seasons 1, 2, 3 y 4).",
    targetGameId: "gg-strive",
    questions: [
      {
        num: 1,
        category: "Guilty Gear -Strive- — Ritmo de Combate",
        question: "1. En Guilty Gear -Strive- los personajes tienen estilos extremos. ¿Cuál buscas tú?",
        options: [
          { label: "Rushdown explosivo de corta distancia: botones positivos (+frames), agarre y daño brutal", tags: ["rushdown", "strike-throw", "dandy", "carrera"] },
          { label: "Dominio de media y larga distancia con espadas enormes, guadañas, látigos o Yo-Yo", tags: ["esquina", "espadas", "zoner", "yo-yo", "alcance"] },
          { label: "Mix-up de alta velocidad, vuelo Hoverdash o proyectiles de setplay en el despertar", tags: ["mix-up", "hoverdash", "velocidad", "setplay"] },
          { label: "Especialista único: Grappler colosal (Potemkin), Marioneta (Zato/Jack-O) o Mago (Asuka)", tags: ["grappler", "puppet", "siervos", "cartas", "billar"] }
        ]
      },
      {
        num: 2,
        category: "Guilty Gear -Strive- — Gestión de Recursos y Medidores",
        question: "2. ¿Qué relación quieres tener con los medidores especiales en Guilty Gear -Strive-?",
        options: [
          { label: "Solo quiero gestionar la barra universal de Tension (Roman Cancel) y Burst (Wild Assault)", tags: ["rushdown", "all-rounder", "shock", "carga"] },
          { label: "Me gusta controlar un medidor de riesgo/recompensa (Blood Gauge de Nago o Jealous Rage de A.B.A)", tags: ["blood", "celos", "samurái"] },
          { label: "Quiero gestionar munición, concentración, estamina o hechizos (Happy Chaos, Sin, Asuka)", tags: ["pistola", "stamina", "cartas"] },
          { label: "Prefiero colocar objetos en pantalla (Yo-Yo, Espadas, Siervos, Tatamis, Bolas de Billar)", tags: ["yo-yo", "siervos", "tatami", "billar", "hielo"] }
        ]
      },
      {
        num: 3,
        category: "Guilty Gear -Strive- — Cómo Romper el Muro (Wall Break)",
        question: "3. ¿Cómo prefieres llevar al rival hasta el Wall Break para ganar Positive Bonus?",
        options: [
          { label: "Con un Counter Hit masivo de Heavy Slash o Pilebunker que borre el 60% de la vida", tags: ["daño", "dandy", "behemoth", "samurái"] },
          { label: "Abase de velocidad, Rekka infinita, delfines o carreras imparables", tags: ["rekka", "delfín", "carrera", "velocidad"] },
          { label: "Atrapando al rival con una cuerda (Tether), un Parry de 1 frame o un Potemkin Buster", tags: ["parry", "tether", "grappler", "autoguard"] },
          { label: "Encerrándolo en la esquina con espadas, proyectiles o ataques de marioneta", tags: ["esquina", "espadas", "puppet", "zoner", "hielo"] }
        ]
      },
      {
        num: 4,
        category: "Personalidad en GGST — Tu Espíritu Rockero",
        question: "4. ¿Con qué personalidad del universo de Guilty Gear -Strive- vibras más?",
        options: [
          { label: "Rebelde directo, feroz y sin filtros (Sol, Slayer, Baiken, Giovanna, Johnny)", tags: ["strike-throw", "dandy", "parry", "carrera", "mist"] },
          { label: "Estratega elegante, caballeroso o místico (Ky, Nagoriyuki, Testament, Queen Dizzy, Venom)", tags: ["shock", "samurái", "stain", "hielo", "billar"] },
          { label: "Energía desbordante, carisma y velocidad (May, Bridget, Elphelt, Sin, Chipp, Millia)", tags: ["delfín", "yo-yo", "rekka", "stamina", "velocidad", "disco"] },
          { label: "Enigmático, caótico o fuera de toda norma (Happy Chaos, Faust, Zato-1, A.B.A, Bedman?, Lucy)", tags: ["pistola", "aleatorios", "puppet", "celos", "error", "netrunner"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 7. TEST ESPECÍFICO: SUPER SMASH BROS. ULTIMATE
  ssbu: {
    title: "Test de Super Smash Bros. Ultimate (10 Preguntas)",
    subtitle: "Encuentra tu Main ideal entre los 86 luchadores de Smash Ultimate (Base + Fighters Pass Vol. 1 y 2).",
    targetGameId: "ssbu",
    questions: [
      {
        num: 1,
        category: "Super Smash Bros. Ultimate — Estilo en el Escenario",
        question: "1. En Smash Ultimate, ¿cómo prefieres dominar el escenario y subir el porcentaje (%) rival?",
        options: [
          { label: "Con una espada de buen alcance (Swordie) espaciando Back Air y Fair seguros en escudo", tags: ["swordie", "espada", "bair", "distancia"] },
          { label: "A máxima velocidad (Rushdown / Fast Faller) encadenando combos verticales y malabares", tags: ["rushdown", "fast faller", "escalera", "velocidad"] },
          { label: "Controlando el escenario con proyectiles, trampas, bloques o ítems (Zoner / Trapper)", tags: ["zoner", "trapper", "bloques", "proyectiles", "bomba"] },
          { label: "Con el poder de un peso pesado (Heavy / Grappler) que mata de 3 golpes a 70%", tags: ["heavy", "super heavy", "grappler", "armor"] }
        ]
      },
      {
        num: 2,
        category: "Super Smash Bros. Ultimate — Cómo Cerrar el Stock (KO)",
        question: "2. Cuando el rival ya está por encima de 100%, ¿cómo te gusta quitarle la vida (Stock)?",
        options: [
          { label: "Saltando fuera del escenario a perseguirlo con un Edgeguard profundo o Spike (Dair)", tags: ["edgeguard", "combate aéreo", "saltos", "bair"] },
          { label: "Encerrándolo en el borde del escenario (Ledgetrap) con trampas, proyectiles o escudos", tags: ["ledgetrap", "trapper", "zoner", "bombas"] },
          { label: "Con una confirmación rápida desde un golpe ligero o un Up-B / Up-Smash desde el escudo (OOS)", tags: ["oos", "up-smash", "climhazzard", "confirm"] },
          { label: "Con una mecánica especial de Comeback o un golpe devastador (Arsene, KO Punch, EWGF, Limit)", tags: ["arsene", "touch of death", "limit", "waft", "aura"] }
        ]
      },
      {
        num: 3,
        category: "Super Smash Bros. Ultimate — Mecánicas Únicas",
        question: "3. ¿Qué tipo de personaje de Smash Ultimate te atrae más dominar?",
        options: [
          { label: "Personaje de fundamentos puros y honestos (Mario, Lucina, Wolf, Cloud, Pit, Fox)", tags: ["all-rounder", "fundamentos", "swordie", "honesto"] },
          { label: "Personaje con comandos de juego de lucha tradicional (Kazuya, Terry, Ryu, Ken)", tags: ["comandos", "inputs", "touch of death"] },
          { label: "Creador de jugadas de 200 IQ con recursos o objetos (Steve, Pac-Man, Snake, Peach, Shulk)", tags: ["bloques", "trapper", "float", "monado", "granadas"] },
          { label: "Personaje con cambio de forma o compañero (Pyra/Mythra, Pokémon Trainer, Joker, Rosalina)", tags: ["mythra", "squirtle", "arsene", "puppet"] }
        ]
      },
      {
        num: 4,
        category: "Personalidad en Smash — Tu Espíritu Nintendo / Crossover",
        question: "4. ¿Con qué tipo de icono de los videojuegos conectas más por tu personalidad?",
        options: [
          { label: "Héroes y espadachines legendarios (Link, Cloud, Sephiroth, Sora, Roy, Byleth, Joker)", tags: ["swordie", "espada", "arsene", "magia"] },
          { label: "Velocistas y luchadores de acción rápida (Fox, Falco, Sonic, Pikachu, Captain Falcon, Sheik)", tags: ["velocidad", "fast faller", "brawler", "mobility"] },
          { label: "Reyes y colosos intimidantes (Bowser, Ganondorf, Donkey Kong, King K. Rool, Ridley, Kazuya)", tags: ["super heavy", "heavy", "grappler", "touch of death"] },
          { label: "Estrategas creativos y tiradores (Steve, Samus, Snake, R.O.B., Pac-Man, Mega Man)", tags: ["bloques", "zoner", "trapper", "gyro"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  }
};

const quizState = {
  mode: "general", // general | mk1 | sf6 | tekken8 | dbfz | gg-strive | ssbu
  currentStep: 0,
  answers: new Array(10).fill(null)
};

window.initPersonalityQuiz = function (mode = null) {
  if (mode && QUIZ_BANKS[mode]) {
    quizState.mode = mode;
  }
  quizState.currentStep = 0;
  quizState.answers = new Array(10).fill(null);
  renderQuizModeSelector();
  renderQuizStep();
};

function renderQuizModeSelector() {
  const modeBar = document.getElementById("quizModeSelectorBar");
  if (!modeBar) return;

  const modes = [
    { id: "general", label: "Test General (Todos los Juegos)" },
    { id: "mk1", label: "Test Mortal Kombat 1" },
    { id: "sf6", label: "Test Street Fighter 6" },
    { id: "tekken8", label: "Test Tekken 8" },
    { id: "dbfz", label: "Test Dragon Ball FighterZ" },
    { id: "gg-strive", label: "Test Guilty Gear -Strive-" },
    { id: "ssbu", label: "Test Smash Bros. Ultimate" }
  ];

  modeBar.innerHTML = modes
    .map(
      (m) => `
      <button
        class="saga-tab-btn ${quizState.mode === m.id ? "active" : ""}"
        data-quizmode="${m.id}"
      >
        ${m.label}
      </button>
    `
    )
    .join("");

  modeBar.querySelectorAll("[data-quizmode]").forEach((btn) => {
    btn.onclick = () => {
      window.initPersonalityQuiz(btn.dataset.quizmode);
    };
  });
}

function renderQuizStep() {
  const container = document.getElementById("quizContainerBox");
  if (!container) return;

  const activeBank = QUIZ_BANKS[quizState.mode] || QUIZ_BANKS.general;
  const questions = activeBank.questions;

  if (quizState.currentStep >= questions.length) {
    renderQuizRecommendations(container, activeBank);
    return;
  }

  const qObj = questions[quizState.currentStep];
  const progressPct = Math.round(((quizState.currentStep + 1) / questions.length) * 100);

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #293548;">
      <div>
        <h3 style="font-family:var(--font-display);font-size:1.25rem;color:#fbbf24;">${activeBank.title}</h3>
        <p style="font-size:0.82rem;color:#94a3b8;">${activeBank.subtitle}</p>
      </div>
      <span class="base-game-badge">10 Preguntas (Juego + Personalidad)</span>
    </div>

    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;color:#fbbf24;margin-bottom:6px;">
        <span>${qObj.category}</span>
        <span>Pregunta ${qObj.num} de ${questions.length} (${progressPct}%)</span>
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
      <button class="btn btn-outline" id="btnQuizRestart">Reiniciar este test</button>
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
    restartBtn.onclick = () => window.initPersonalityQuiz(quizState.mode);
  }
}

function renderQuizRecommendations(container, activeBank) {
  const tagWeights = {};
  let preferredDiff = null;

  quizState.answers.forEach((ans) => {
    if (!ans) return;
    if (ans.diff) preferredDiff = ans.diff;
    (ans.tags || []).forEach((t) => {
      tagWeights[t.toLowerCase()] = (tagWeights[t.toLowerCase()] || 0) + 1;
    });
  });

  const isSingleGame = activeBank.targetGameId !== "all";
  const targetGames = isSingleGame
    ? state.games.filter((g) => g.id === activeBank.targetGameId)
    : state.games;

  const scored = [];
  targetGames.forEach((game) => {
    game.characters.forEach((ch) => {
      let score = 56;
      const textBlob = `${ch.name} ${ch.archetype} ${ch.overview} ${ch.gameplan} ${ch.recommendedSubSystem || ""}`.toLowerCase();

      Object.keys(tagWeights).forEach((tag) => {
        if (textBlob.includes(tag)) {
          score += tagWeights[tag] * 10;
        }
      });

      if (preferredDiff && ch.difficulty === preferredDiff) {
        score += 12;
      }

      const matchPct = Math.min(99, Math.max(78, score));
      scored.push({ game, ch, score, matchPct });
    });
  });

  scored.sort((a, b) => b.score - a.score);

  const topRecommendations = [];
  if (isSingleGame) {
    // En el test específico de un juego, mostrar el Top 6 de mejores personajes de ese juego
    scored.slice(0, 6).forEach((item) => topRecommendations.push(item));
  } else {
    // En el test general, mostrar el mejor personaje de cada uno de los 6 juegos
    const usedGames = new Set();
    scored.forEach((item) => {
      if (topRecommendations.length < 6 && !usedGames.has(item.game.id)) {
        topRecommendations.push(item);
        usedGames.add(item.game.id);
      }
    });
  }

  container.innerHTML = `
    <div class="ufd-section-banner" style="margin-top:0;">
      Resultados de ${activeBank.title} — Tus Personajes Ideales
    </div>
    <p style="font-size:0.88rem;color:#cbd5e1;margin-bottom:16px;">
      Basado en tus 10 respuestas sobre cómo quieres jugar y tu personalidad competitiva, estos son tus luchadores recomendados:
    </p>

    <div class="news-grid">
      ${topRecommendations
        .map(({ game, ch, matchPct }, rankIdx) => {
          const cachedSrc = clientPortraitCache.get(ch.id) || ch.iconUrl;
          const dlcBadge = ch.isDLC ? `DLC (${ch.dlcPack})` : "Juego Base";
          return `
            <div class="video-panel-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <span class="news-cat-badge">#${rankIdx + 1} • ${matchPct}% Afinidad</span>
                  <span class="news-saga-badge">${game.title} (${dlcBadge})</span>
                </div>
                <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px;">
                  <div class="portrait-img-box" style="width:64px;height:64px;flex-shrink:0;">
                    <img src="${cachedSrc}" alt="${ch.name}" onload="window.handlePortraitLoad(this)" />
                  </div>
                  <div>
                    <h4 style="font-family:var(--font-display);font-size:1.2rem;">${ch.name}</h4>
                    <div style="font-size:0.78rem;color:#fbbf24;">${ch.archetype} • Dif: ${ch.difficulty}</div>
                  </div>
                </div>
                <p style="font-size:0.82rem;color:#cbd5e1;">
                  <strong>Por qué encaja con tu juego y personalidad:</strong> ${ch.overview}
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

    <div style="margin-top:18px;display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-outline" id="btnRepeatQuiz10">Repetir este Test de 10 Preguntas</button>
      ${
        isSingleGame
          ? `<button class="btn btn-outline" id="btnSwitchToGeneralQuiz">Hacer el Test General (Todos los Juegos)</button>`
          : ""
      }
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

  document.getElementById("btnRepeatQuiz10").onclick = () => window.initPersonalityQuiz(quizState.mode);
  const genBtn = document.getElementById("btnSwitchToGeneralQuiz");
  if (genBtn) {
    genBtn.onclick = () => window.initPersonalityQuiz("general");
  }
}

// =========================================================================
// INICIALIZACIÓN DEL CENTRO DE HERRAMIENTAS
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
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
