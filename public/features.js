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
// D. INSPECTOR DE HITBOXES FRAME A FRAME (CON DECODIFICADOR REAL DE GIF Y VÍDEO)
// =========================================================================
const gifFramesCache = new Map();

function parseGifBinaryToFrames(buffer) {
  const bytes = new Uint8Array(buffer);
  let pos = 0;
  const sig = String.fromCharCode(...bytes.slice(0, 6));
  if (sig !== "GIF87a" && sig !== "GIF89a") return null;
  pos = 6;

  const lsdW = bytes[pos] | (bytes[pos + 1] << 8);
  const lsdH = bytes[pos + 2] | (bytes[pos + 3] << 8);
  const packed = bytes[pos + 4];
  pos += 7; // incl. bgColorIndex + pixelAspectRatio

  const readColorTable = (size) => {
    const tbl = [];
    for (let i = 0; i < size; i++) {
      tbl.push([bytes[pos++], bytes[pos++], bytes[pos++]]);
    }
    return tbl;
  };

  let gct = null;
  if (packed & 0x80) {
    gct = readColorTable(1 << ((packed & 0x07) + 1));
  }

  const readSubBlocks = () => {
    const out = [];
    while (pos < bytes.length) {
      const sz = bytes[pos++];
      if (sz === 0) break;
      for (let i = 0; i < sz && pos < bytes.length; i++) out.push(bytes[pos++]);
    }
    return new Uint8Array(out);
  };

  const decodeLzw = (minCodeSize, data, pixelCount) => {
    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;
    let codeSize = minCodeSize + 1;
    let codeMask = (1 << codeSize) - 1;
    let nextCode = eoiCode + 1;
    const prefix = new Int32Array(4096);
    const suffix = new Uint8Array(4096);
    const stack = new Uint8Array(4096);
    const pixels = new Uint8Array(pixelCount);

    for (let i = 0; i < clearCode; i++) {
      prefix[i] = -1;
      suffix[i] = i;
    }

    let bitBuf = 0;
    let bitCnt = 0;
    let bytePos = 0;
    let pxPos = 0;
    let prevCode = -1;
    let firstChar = 0;

    while (pxPos < pixelCount) {
      while (bitCnt < codeSize && bytePos < data.length) {
        bitBuf |= data[bytePos++] << bitCnt;
        bitCnt += 8;
      }
      if (bitCnt < codeSize) break;
      const code = bitBuf & codeMask;
      bitBuf >>= codeSize;
      bitCnt -= codeSize;

      if (code === clearCode) {
        codeSize = minCodeSize + 1;
        codeMask = (1 << codeSize) - 1;
        nextCode = eoiCode + 1;
        prevCode = -1;
        continue;
      }
      if (code === eoiCode) break;

      let inCode = code;
      let sp = 0;
      if (code >= nextCode) {
        stack[sp++] = firstChar;
        inCode = prevCode;
      }
      while (inCode >= clearCode && sp < 4095) {
        stack[sp++] = suffix[inCode];
        inCode = prefix[inCode];
      }
      firstChar = suffix[inCode] & 0xff;
      stack[sp++] = firstChar;

      if (prevCode !== -1 && nextCode < 4096) {
        prefix[nextCode] = prevCode;
        suffix[nextCode] = firstChar;
        nextCode++;
        if (nextCode > codeMask && codeSize < 12) {
          codeSize++;
          codeMask = (1 << codeSize) - 1;
        }
      }
      prevCode = code;
      while (sp > 0 && pxPos < pixelCount) {
        pixels[pxPos++] = stack[--sp];
      }
    }
    return pixels;
  };

  const master = document.createElement("canvas");
  master.width = lsdW;
  master.height = lsdH;
  const mctx = master.getContext("2d");

  const tempCanvas = document.createElement("canvas");
  const tctx = tempCanvas.getContext("2d");

  let disposal = 0;
  let delayCs = 5;
  let transpIdx = -1;
  const frames = [];

  while (pos < bytes.length) {
    const b = bytes[pos++];
    if (b === 0x3b) break;
    if (b === 0x21) {
      const label = bytes[pos++];
      if (label === 0xf9) {
        pos++; // block size (4)
        const gcePacked = bytes[pos++];
        disposal = (gcePacked >> 2) & 0x07;
        delayCs = bytes[pos] | (bytes[pos + 1] << 8);
        pos += 2;
        transpIdx = (gcePacked & 0x01) ? bytes[pos++] : (pos++, -1);
        pos++; // terminator
      } else {
        readSubBlocks();
      }
    } else if (b === 0x2c) {
      const left = bytes[pos] | (bytes[pos + 1] << 8);
      const top = bytes[pos + 2] | (bytes[pos + 3] << 8);
      const w = bytes[pos + 4] | (bytes[pos + 5] << 8);
      const h = bytes[pos + 6] | (bytes[pos + 7] << 8);
      const imgPacked = bytes[pos + 8];
      pos += 9;

      const lct = (imgPacked & 0x80) ? readColorTable(1 << ((imgPacked & 0x07) + 1)) : gct;
      const interlaced = Boolean(imgPacked & 0x40);
      const minCodeSize = bytes[pos++];
      const lzwData = readSubBlocks();
      const idxPixels = decodeLzw(minCodeSize, lzwData, w * h);

      let prevImageData = null;
      if (disposal === 3) {
        prevImageData = mctx.getImageData(0, 0, lsdW, lsdH);
      }

      tempCanvas.width = w;
      tempCanvas.height = h;
      const imgData = tctx.createImageData(w, h);
      const d = imgData.data;

      const passStarts = [0, 4, 2, 1];
      const passSteps = [8, 8, 4, 2];
      let srcY = 0;

      const writeRow = (targetY, rowOffset) => {
        for (let x = 0; x < w; x++) {
          const ci = idxPixels[rowOffset + x];
          if (ci === transpIdx || !lct || !lct[ci]) continue;
          const off = (targetY * w + x) * 4;
          d[off] = lct[ci][0];
          d[off + 1] = lct[ci][1];
          d[off + 2] = lct[ci][2];
          d[off + 3] = 255;
        }
      };

      if (!interlaced) {
        for (let y = 0; y < h; y++) writeRow(y, y * w);
      } else {
        for (let p = 0; p < 4; p++) {
          for (let y = passStarts[p]; y < h; y += passSteps[p]) {
            writeRow(y, srcY * w);
            srcY++;
          }
        }
      }

      tctx.putImageData(imgData, 0, 0);
      mctx.drawImage(tempCanvas, left, top);

      const snap = document.createElement("canvas");
      snap.width = lsdW;
      snap.height = lsdH;
      snap.getContext("2d").drawImage(master, 0, 0);
      frames.push({ canvas: snap, delayMs: Math.max(16, (delayCs || 5) * 10) });

      if (disposal === 2) {
        mctx.clearRect(left, top, w, h);
      } else if (disposal === 3 && prevImageData) {
        mctx.putImageData(prevImageData, 0, 0);
      }
      disposal = 0;
      delayCs = 5;
      transpIdx = -1;
    }
  }
  return frames.length > 0 ? { frames, width: lsdW, height: lsdH } : null;
}

async function decodeGifFramesFromUrl(url) {
  if (gifFramesCache.has(url)) return gifFramesCache.get(url);

  const res = await fetch(url);
  if (!res.ok) return null;
  const buf = await res.arrayBuffer();

  if (typeof window.ImageDecoder === "function") {
    try {
      const decoder = new ImageDecoder({ data: buf, type: "image/gif" });
      await decoder.tracks.ready;
      const count = decoder.tracks.selectedTrack ? decoder.tracks.selectedTrack.frameCount : 0;
      if (count > 0) {
        const frames = [];
        let w = 0;
        let h = 0;
        for (let i = 0; i < count; i++) {
          const decoded = await decoder.decode({ frameIndex: i });
          const vf = decoded.image;
          w = vf.displayWidth || vf.codedWidth || w;
          h = vf.displayHeight || vf.codedHeight || h;
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          c.getContext("2d").drawImage(vf, 0, 0);
          const delayMs = vf.duration ? Math.max(16, Math.round(vf.duration / 1000)) : 50;
          vf.close();
          frames.push({ canvas: c, delayMs });
        }
        const out = { frames, width: w, height: h };
        gifFramesCache.set(url, out);
        return out;
      }
    } catch (_) {}
  }

  const parsed = parseGifBinaryToFrames(buf);
  if (parsed) gifFramesCache.set(url, parsed);
  return parsed;
}

const inspectorState = {
  charId: "",
  charName: "Luchador",
  gameId: "sf6",
  charImgUrl: "",
  fallbackSrc: "",
  realHitboxUrl: "",
  realHitboxType: "image",
  realHitboxSource: "",
  fetchingReal: false,
  gifFrames: null,
  decodingGif: false,
  videoDuration: 0,
  videoRaf: null,
  moveName: "",
  input: "",
  category: "",
  startupNum: 5,
  activeStart: 5,
  activeEnd: 7,
  recoveryNum: 18,
  totalFrames: 25,
  meterTotalFrames: 25,
  onBlock: "-4 On Block",
  currentFrame: 5,
  playing: false,
  timer: null,
  fps: 18
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

function updatePlaybackControlsVisibility() {
  const wrap = document.getElementById("hbPlaybackControlsWrap");
  if (!wrap) return;
  const hasPlayableVideo = inspectorState.realHitboxType === "video" && Boolean(inspectorState.realHitboxUrl);
  const hasPlayableGif = Array.isArray(inspectorState.gifFrames) && inspectorState.gifFrames.length > 1;
  const isFrameMeterInteractive = !inspectorState.realHitboxUrl && !inspectorState.fetchingReal && inspectorState.totalFrames > 1;
  wrap.style.display = hasPlayableVideo || hasPlayableGif || isFrameMeterInteractive ? "block" : "none";

  const slider = document.getElementById("hbFrameSlider");
  if (slider) {
    slider.min = 1;
    slider.max = inspectorState.totalFrames;
    slider.value = Math.min(inspectorState.totalFrames, Math.max(1, inspectorState.currentFrame));
  }
  const minLbl = document.getElementById("hbSliderMinLabel");
  const maxLbl = document.getElementById("hbSliderMaxLabel");
  if (minLbl) minLbl.textContent = "F1";
  if (maxLbl) maxLbl.textContent = `F${inspectorState.totalFrames}`;
}

async function preparePlayableMediaIfGif(targetKey, url) {
  if (!url || !url.toLowerCase().includes(".gif") || inspectorState.realHitboxType === "video") return;
  inspectorState.decodingGif = true;
  renderInspectorFrame();
  try {
    const decoded = await decodeGifFramesFromUrl(url);
    const currentKey = `${inspectorState.gameId}:${inspectorState.charName}:${inspectorState.moveName}`;
    if (currentKey !== targetKey) return;
    inspectorState.decodingGif = false;
    if (decoded && decoded.frames && decoded.frames.length > 1) {
      inspectorState.gifFrames = decoded.frames;
      inspectorState.totalFrames = decoded.frames.length;
      const ratio = Math.min(1, Math.max(0, (inspectorState.activeStart - 1) / Math.max(1, inspectorState.meterTotalFrames - 1)));
      inspectorState.currentFrame = Math.max(1, Math.min(decoded.frames.length, Math.round(ratio * (decoded.frames.length - 1)) + 1));
    }
    const cb = document.getElementById("hbInteractiveCanvas");
    if (cb) cb.innerHTML = "";
    renderInspectorFrame();
  } catch (_) {
    inspectorState.decodingGif = false;
  }
}

window.openHitboxInspector = async function (fcEncoded) {
  let fc;
  try {
    fc = JSON.parse(decodeURIComponent(fcEncoded));
  } catch (_) {
    return;
  }

  const nums = parseFrameNumbers(fc);
  inspectorState.charId = fc.charId || "";
  inspectorState.charName = fc.charName || "Personaje";
  inspectorState.gameId = fc.gameId || "sf6";
  inspectorState.charImgUrl =
    (fc.charId && typeof clientPortraitCache !== "undefined" && clientPortraitCache.get(fc.charId)) ||
    fc.charImgUrl ||
    "";
  inspectorState.fallbackSrc = fc.fallbackSrc || inspectorState.charImgUrl;
  inspectorState.realHitboxUrl = fc.realHitboxUrl || "";
  inspectorState.realHitboxType = fc.realHitboxType || "image";
  inspectorState.realHitboxSource = fc.realHitboxSource || "";
  inspectorState.fetchingReal = !inspectorState.realHitboxUrl;
  inspectorState.gifFrames = null;
  inspectorState.decodingGif = false;
  inspectorState.videoDuration = 0;
  inspectorState.moveName = fc.moveName;
  inspectorState.input = fc.translatedInput || fc.input;
  inspectorState.category = fc.category || "";
  inspectorState.startupNum = nums.startupNum;
  inspectorState.activeStart = nums.activeStart;
  inspectorState.activeEnd = nums.activeEnd;
  inspectorState.recoveryNum = nums.recoveryNum;
  inspectorState.totalFrames = nums.totalFrames;
  inspectorState.meterTotalFrames = Math.max(nums.totalFrames, nums.activeEnd);
  inspectorState.onBlock = fc.onBlock;
  inspectorState.currentFrame = nums.activeStart;
  stopInspectorPlayback();

  const modal = document.getElementById("hitboxInspectorModalBackdrop");
  if (!modal) return;
  modal.classList.remove("hidden");

  const canvasBox = document.getElementById("hbInteractiveCanvas");
  if (canvasBox) canvasBox.innerHTML = "";

  const targetKey = `${inspectorState.gameId}:${inspectorState.charName}:${inspectorState.moveName}`;
  renderInspectorFrame();

  if (inspectorState.realHitboxUrl) {
    await preparePlayableMediaIfGif(targetKey, inspectorState.realHitboxUrl);
    return;
  }

  if (inspectorState.gameId && inspectorState.charName) {
    try {
      const res = await fetch(
        `/api/char-hitboxes?gameId=${encodeURIComponent(inspectorState.gameId)}&charName=${encodeURIComponent(inspectorState.charName)}`
      );
      if (res.ok) {
        const data = await res.json();
        const entry =
          (typeof window.findHitboxEntryForCard === "function"
            ? window.findHitboxEntryForCard(data?.hitboxes, fc)
            : data?.hitboxes?.[fc.moveName]);
        if (
          entry &&
          entry.url &&
          `${inspectorState.gameId}:${inspectorState.charName}:${inspectorState.moveName}` === targetKey
        ) {
          inspectorState.realHitboxUrl =
            entry.localUrl ||
            (entry.url.startsWith("/") ? entry.url : `/api/hitbox-media?url=${encodeURIComponent(entry.url)}`);
          inspectorState.realHitboxType = entry.type || "image";
          inspectorState.realHitboxSource = entry.source || "Wiki Oficial";
        }
      }
    } catch (_) {}
    inspectorState.fetchingReal = false;
    if (!modal.classList.contains("hidden")) {
      const cb = document.getElementById("hbInteractiveCanvas");
      if (cb) cb.innerHTML = "";
      renderInspectorFrame();
      if (inspectorState.realHitboxUrl) {
        await preparePlayableMediaIfGif(targetKey, inspectorState.realHitboxUrl);
      }
    }
  }
};

function stopInspectorPlayback() {
  inspectorState.playing = false;
  if (inspectorState.timer) {
    clearTimeout(inspectorState.timer);
    inspectorState.timer = null;
  }
  if (inspectorState.videoRaf) {
    cancelAnimationFrame(inspectorState.videoRaf);
    inspectorState.videoRaf = null;
  }
  const vid = document.getElementById("hbRealVideoEl");
  if (vid && !vid.paused) vid.pause();
  const playBtn = document.getElementById("btnHbPlayPause");
  if (playBtn) playBtn.textContent = "▶ Reproducir Animación";
}

function toggleInspectorPlayback() {
  if (inspectorState.playing) {
    stopInspectorPlayback();
    renderInspectorFrame();
    return;
  }

  const hasGif = Array.isArray(inspectorState.gifFrames) && inspectorState.gifFrames.length > 1;
  const vidEl = document.getElementById("hbRealVideoEl");
  const hasVid = inspectorState.realHitboxType === "video" && Boolean(vidEl);
  const hasMeter = !inspectorState.realHitboxUrl && inspectorState.totalFrames > 1;
  if (!hasGif && !hasVid && !hasMeter) return;

  inspectorState.playing = true;
  const playBtn = document.getElementById("btnHbPlayPause");
  if (playBtn) playBtn.textContent = "⏸ Pausar Frame";

  if (hasMeter) {
    const stepMeter = () => {
      if (!inspectorState.playing) return;
      inspectorState.currentFrame++;
      if (inspectorState.currentFrame > inspectorState.totalFrames) {
        inspectorState.currentFrame = 1;
      }
      const slider = document.getElementById("hbFrameSlider");
      if (slider) slider.value = inspectorState.currentFrame;
      renderInspectorFrame();
      inspectorState.timer = setTimeout(stepMeter, 45);
    };
    inspectorState.timer = setTimeout(stepMeter, 45);
    return;
  }

  if (hasVid && vidEl) {
    vidEl.play().catch(() => {});
    const syncVideoLoop = () => {
      if (!inspectorState.playing) return;
      if (vidEl.duration > 0) {
        const frac = Math.min(1, Math.max(0, vidEl.currentTime / vidEl.duration));
        inspectorState.currentFrame = Math.min(
          inspectorState.totalFrames,
          Math.max(1, Math.round(frac * (inspectorState.totalFrames - 1)) + 1)
        );
        const slider = document.getElementById("hbFrameSlider");
        if (slider) slider.value = inspectorState.currentFrame;
        renderInspectorFrame(true);
      }
      inspectorState.videoRaf = requestAnimationFrame(syncVideoLoop);
    };
    inspectorState.videoRaf = requestAnimationFrame(syncVideoLoop);
    return;
  }

  if (hasGif) {
    const stepGif = () => {
      if (!inspectorState.playing) return;
      inspectorState.currentFrame++;
      if (inspectorState.currentFrame > inspectorState.totalFrames) {
        inspectorState.currentFrame = 1;
      }
      const slider = document.getElementById("hbFrameSlider");
      if (slider) slider.value = inspectorState.currentFrame;
      renderInspectorFrame();
      const idx = Math.min(inspectorState.gifFrames.length - 1, Math.max(0, inspectorState.currentFrame - 1));
      const delay = inspectorState.gifFrames[idx]?.delayMs || 50;
      inspectorState.timer = setTimeout(stepGif, delay);
    };
    const initIdx = Math.min(inspectorState.gifFrames.length - 1, Math.max(0, inspectorState.currentFrame - 1));
    inspectorState.timer = setTimeout(stepGif, inspectorState.gifFrames[initIdx]?.delayMs || 50);
  }
}

function renderInspectorFrame(fromVideoSync = false) {
  const f = inspectorState.currentFrame;
  const {
    charName,
    activeStart,
    activeEnd,
    totalFrames,
    meterTotalFrames,
    moveName,
    input,
    onBlock
  } = inspectorState;

  const progressRatio = (f - 1) / Math.max(1, totalFrames - 1);
  const approxGameFrame = Math.round(progressRatio * Math.max(1, meterTotalFrames - 1)) + 1;

  let phaseName = "STARTUP (Preparación antes del impacto)";
  let phaseColor = "#15803d";

  if (approxGameFrame >= activeStart && approxGameFrame <= activeEnd) {
    phaseName = "VENTANA ACTIVA — ¡FRAMES CON HITBOX ACTIVA!";
    phaseColor = "#e11d48";
  } else if (approxGameFrame > activeEnd) {
    phaseName = "RECUPERACIÓN / END LAG (Frames vulnerables)";
    phaseColor = "#6d28d9";
  }

  const headerTitle = document.getElementById("hbInspectorTitle");
  if (headerTitle) {
    headerTitle.textContent = `${charName} — ${moveName} (${input})`;
  }

  const statusBanner = document.getElementById("hbPhaseBanner");
  if (statusBanner) {
    statusBanner.style.background = phaseColor;
    statusBanner.textContent = `FRAME ${f} de ${totalFrames} — ${phaseName}`;
  }

  updatePlaybackControlsVisibility();

  const canvasBox = document.getElementById("hbInteractiveCanvas");
  if (canvasBox) {
    const cursorPct = `${((f - 0.5) / Math.max(1, totalFrames)) * 100}%`;
    const mStartW = (Math.max(0, activeStart - 1) / Math.max(1, meterTotalFrames)) * 100;
    const mActW = (Math.max(1, activeEnd - activeStart + 1) / Math.max(1, meterTotalFrames)) * 100;
    const mRecW = Math.max(0, 100 - mStartW - mActW);

    if (inspectorState.realHitboxUrl) {
      const hasDecodedGif = Array.isArray(inspectorState.gifFrames) && inspectorState.gifFrames.length > 1;
      const modeKey = `${inspectorState.realHitboxUrl}|${hasDecodedGif ? "gifcanvas" : inspectorState.realHitboxType}`;
      const existingStage = canvasBox.querySelector("[data-hb-mode]");

      if (!existingStage || existingStage.getAttribute("data-hb-mode") !== modeKey) {
        let mediaTag = "";
        if (inspectorState.realHitboxType === "video") {
          mediaTag = `<video id="hbRealVideoEl" src="${inspectorState.realHitboxUrl}" loop muted playsinline preload="auto" style="width:100%;height:210px;object-fit:contain;background:#262626;border-radius:6px;display:block;"></video>`;
        } else if (hasDecodedGif) {
          mediaTag = `<canvas id="hbRealGifCanvas" style="width:100%;height:210px;object-fit:contain;background:#262626;border-radius:6px;display:block;"></canvas>`;
        } else {
          mediaTag = `<img id="hbRealImgEl" src="${inspectorState.realHitboxUrl}" alt="Hitbox real de ${moveName}" style="width:100%;height:210px;object-fit:contain;background:#262626;border-radius:6px;display:block;" />`;
        }

        const badgeHint = inspectorState.decodingGif
          ? "⏳ Extrayendo frames del GIF..."
          : hasDecodedGif
            ? `${inspectorState.realHitboxSource || "Wiki Oficial"} • ${inspectorState.gifFrames.length} frames reales`
            : inspectorState.realHitboxType === "video"
              ? `${inspectorState.realHitboxSource || "Wiki Oficial"} • Vídeo MP4/WebM`
              : `${inspectorState.realHitboxSource || "Wiki Oficial"} • Captura fija (1 imagen)`;

        canvasBox.innerHTML = `
          <div class="hb-char-stage" data-hb-mode="${modeKey}" style="height:265px;background:#262626;padding:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;font-family:var(--font-mono);font-size:0.72rem;color:#fff;margin-bottom:6px;gap:8px;">
              <span id="hbStageFrameLabel"><strong>${charName}</strong> • ${moveName} (${input}) — F${f}/${totalFrames}</span>
              <span id="hbStageSourceBadge" style="color:#fbbf24;">${badgeHint}</span>
            </div>
            ${mediaTag}
            <div style="position:absolute;bottom:8px;left:14px;right:14px;height:14px;background:#07090f;border-radius:6px;overflow:hidden;display:flex;border:1px solid rgba(255,255,255,0.14);z-index:6;">
              <div style="width:${mStartW}%;background:#15803d;" title="Startup"></div>
              <div style="width:${mActW}%;background:#e11d48;" title="Hitbox Activa"></div>
              <div style="width:${mRecW}%;background:#6d28d9;" title="Recovery"></div>
            </div>
            <div id="hbCursorEl" style="position:absolute;bottom:6px;left:calc(14px + (100% - 28px) * ${(f - 0.5) / Math.max(1, totalFrames)});width:6px;height:18px;background:#fbbf24;border-radius:3px;transform:translateX(-50%);z-index:7;"></div>
          </div>
        `;

        const vidEl = document.getElementById("hbRealVideoEl");
        if (vidEl) {
          const applyVideoMeta = () => {
            if (vidEl.duration > 0) {
              inspectorState.videoDuration = vidEl.duration;
              inspectorState.totalFrames = Math.max(12, Math.min(180, Math.round(vidEl.duration * 60)));
              const frac = Math.min(1, Math.max(0, (inspectorState.activeStart - 1) / Math.max(1, inspectorState.meterTotalFrames - 1)));
              inspectorState.currentFrame = Math.max(1, Math.round(frac * (inspectorState.totalFrames - 1)) + 1);
              updatePlaybackControlsVisibility();
              renderInspectorFrame();
            }
          };
          vidEl.addEventListener("loadedmetadata", applyVideoMeta, { once: true });
          if (vidEl.readyState >= 1) applyVideoMeta();
        }
      } else {
        const lbl = document.getElementById("hbStageFrameLabel");
        if (lbl) lbl.innerHTML = `<strong>${charName}</strong> • ${moveName} (${input}) — F${f}/${totalFrames}`;
        const badgeEl = document.getElementById("hbStageSourceBadge");
        if (badgeEl) {
          badgeEl.textContent = inspectorState.decodingGif
            ? "⏳ Extrayendo frames del GIF..."
            : hasDecodedGif
              ? `${inspectorState.realHitboxSource || "Wiki Oficial"} • ${inspectorState.gifFrames.length} frames reales`
              : inspectorState.realHitboxType === "video"
                ? `${inspectorState.realHitboxSource || "Wiki Oficial"} • Vídeo MP4/WebM`
                : `${inspectorState.realHitboxSource || "Wiki Oficial"} • Captura fija (1 imagen)`;
        }
        const cur = document.getElementById("hbCursorEl");
        if (cur) cur.style.left = `calc(14px + (100% - 28px) * ${(f - 0.5) / Math.max(1, totalFrames)})`;
      }

      if (hasDecodedGif) {
        const gifCanvas = document.getElementById("hbRealGifCanvas");
        if (gifCanvas) {
          const idx = Math.min(inspectorState.gifFrames.length - 1, Math.max(0, f - 1));
          const frameObj = inspectorState.gifFrames[idx];
          if (frameObj && frameObj.canvas) {
            if (gifCanvas.width !== frameObj.canvas.width || gifCanvas.height !== frameObj.canvas.height) {
              gifCanvas.width = frameObj.canvas.width;
              gifCanvas.height = frameObj.canvas.height;
            }
            const gctx = gifCanvas.getContext("2d");
            gctx.clearRect(0, 0, gifCanvas.width, gifCanvas.height);
            gctx.drawImage(frameObj.canvas, 0, 0);
          }
        }
      }

      const vidEl = document.getElementById("hbRealVideoEl");
      if (vidEl && inspectorState.realHitboxType === "video" && !fromVideoSync) {
        if (!inspectorState.playing) {
          if (!vidEl.paused) vidEl.pause();
          if (vidEl.readyState >= 1 && vidEl.duration > 0) {
            const targetSec = ((f - 1) / Math.max(1, totalFrames - 1)) * vidEl.duration;
            vidEl.currentTime = Math.min(vidEl.duration, Math.max(0, targetSec));
          }
        }
      }
    } else {
      const noticeText = inspectorState.fetchingReal
        ? "⏳ Buscando captura/animación real del juego en wikis oficiales y carpeta local..."
        : approxGameFrame >= activeStart && approxGameFrame <= activeEnd
          ? `💥 F${approxGameFrame}: HITBOX ACTIVA — Momento exacto de impacto o bloqueo (Ventana F${activeStart}–${activeEnd}).`
          : approxGameFrame < activeStart
            ? `⏳ F${approxGameFrame}: STARTUP — Faltan ${activeStart - approxGameFrame} frame(s) para que aparezca la Hitbox Activa (F${activeStart}).`
            : `🛡 F${approxGameFrame}: RECUPERACIÓN / END LAG — La Hitbox ya desapareció (${onBlock}).`;

      const portraitHtml = inspectorState.charImgUrl
        ? `<div class="portrait-img-box" style="width:48px;height:48px;flex-shrink:0;"><img src="${inspectorState.charImgUrl}" alt="${charName}" referrerpolicy="no-referrer" /></div>`
        : "";

      canvasBox.innerHTML = `
        <div class="hb-char-stage" style="min-height:210px;background:#18191c;padding:16px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-family:var(--font-mono);font-size:0.75rem;color:#fff;">
            <span><strong>${charName}</strong> • ${moveName} (${input})</span>
            <span style="color:#f59e0b;">Frame ${f} / ${totalFrames}</span>
          </div>

          <div style="display:flex;align-items:center;gap:12px;background:rgba(0,0,0,0.45);border:1px solid ${phaseColor};border-radius:8px;padding:12px 14px;">
            ${portraitHtml}
            <div style="font-family:var(--font-mono);font-size:0.78rem;color:#e2e8f0;line-height:1.5;">
              <div>${noticeText}</div>
              <div style="font-size:0.7rem;color:#94a3b8;margin-top:4px;">Usa el deslizador o ⏮ -1 / ▶ / ⏭ +1 abajo para analizar frame por frame el Frame Meter (60 FPS).</div>
            </div>
          </div>

          <div style="position:relative;height:28px;display:flex;align-items:center;">
            <div style="width:100%;height:16px;background:#07090f;border-radius:6px;overflow:hidden;display:flex;border:1px solid rgba(255,255,255,0.14);">
              <div style="width:${mStartW}%;background:#15803d;" title="Startup"></div>
              <div style="width:${mActW}%;background:#e11d48;" title="Hitbox Activa"></div>
              <div style="width:${mRecW}%;background:#6d28d9;" title="Recovery"></div>
            </div>
            <div style="position:absolute;top:3px;left:calc(${cursorPct});width:6px;height:22px;background:#fbbf24;border-radius:3px;transform:translateX(-50%);box-shadow:0 0 8px #fbbf24;"></div>
          </div>
        </div>
      `;
    }
  }

  const metaEl = document.getElementById("hbFrameMetaInfo");
  if (metaEl) {
    metaEl.innerHTML = `
      <span><strong style="color:#4ade80;">Startup:</strong> Frames 1–${activeStart - 1}</span>
      <span><strong style="color:#fb7185;">Hitbox Activa:</strong> Frames ${activeStart}–${activeEnd}</span>
      <span><strong style="color:#c084fc;">End Lag:</strong> Frames ${activeEnd + 1}–${meterTotalFrames}</span>
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

  const populateChars = async () => {
    let game = state.games.find((g) => g.id === gameSel.value) || state.games[0];
    if (!game) return;
    if (typeof window.ensureFullGameLoaded === "function") {
      game = (await window.ensureFullGameLoaded(game.id)) || game;
    }

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
    const tr = (txt) =>
      typeof window.translateNotation === "function"
        ? window.translateNotation(txt, game.sagaId, state.notationMode)
        : txt;

    oppMoveSel.innerHTML =
      `<option value="all">Ver todos los ataques de ${oppChar.name}</option>` +
      moves
        .map(
          (m, idx) =>
            `<option value="${idx}">${m.moveName} (${tr(m.input)}) — [${m.onBlock}]</option>`
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

    const tr = (txt) =>
      typeof window.translateNotation === "function"
        ? window.translateNotation(txt, game.sagaId, state.notationMode)
        : txt;

    outEl.innerHTML = targetMoves
      .map((oppMove) => {
        const obVal = extractOnBlockNumber(oppMove.onBlock);
        const oppInputTr = tr(oppMove.input);

        if (obVal === null) {
          return `
            <div class="guide-section-item" style="border-left:4px solid #a855f7;">
              <h4>${oppChar.name}: ${oppMove.moveName} (<code>${oppInputTr}</code>) — ${oppMove.onBlock}</h4>
              <p>Este movimiento es un agarre o propiedad especial imbloqueable: debes esquivarlo saltando, agachándote o haciendo Tech de agarre.</p>
            </div>
          `;
        }

        if (obVal >= 0) {
          return `
            <div class="guide-section-item" style="border-left:4px solid #ef4444;">
              <h4>${oppChar.name}: ${oppMove.moveName} (<code>${oppInputTr}</code>) — <span style="color:#f87171;">+${obVal} en Bloqueo</span></h4>
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
              <h4>${oppChar.name}: ${oppMove.moveName} (<code>${oppInputTr}</code>) — <span style="color:#fbbf24;">${obVal} en Bloqueo (Seguro)</span></h4>
              <p>Es seguro en bloqueo (${obVal}f), pero <strong>${oppChar.name} pierde su turno</strong>. Responde inmediatamente con tu golpe rápido de ${myChar.name} (<code>${tr(myMoves[0]?.input || "Jab")}</code> de ${myMoves[0]?.startVal || 7}f) para tomar la iniciativa.</p>
            </div>
          `;
        }

        return `
          <div class="guide-section-item" style="border-left:4px solid #10b981;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
              <h4>${oppChar.name}: ${oppMove.moveName} (<code>${oppInputTr}</code>) — <span style="color:#34d399;">${obVal} en Bloqueo (¡CASTIGABLE!)</span></h4>
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
                    ${pm.moveName} (${tr(pm.input)}) • Inicio ${pm.startVal}f (Margen: ${disadvantage - pm.startVal}f)
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
// F. SISTEMA DE TESTS DE 10 PREGUNTAS (PREGUNTAS GENÉRICAS Y ACCESIBLES SOBRE
//    CÓMO QUIERES JUGAR Y TU PERSONALIDAD — TEST GENERAL + 1 POR JUEGO)
// =========================================================================

// Preguntas genéricas de Estilo de Juego + Personalidad (Preguntas 5 a 10)
const SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL = [
  {
    num: 5,
    category: "Cómo Quieres Jugar — Aprendizaje y Controles",
    question: "5. ¿Qué prefieres a la hora de aprender a manejar a tu personaje?",
    options: [
      { label: "Sencillo y directo: quiero aprender lo básico rápido y centrarme en la pelea", diff: "Fácil", tags: ["simple", "fácil"] },
      { label: "Un punto intermedio: fácil de entender pero con trucos por descubrir", diff: "Media", tags: ["versatil", "equilibrado"] },
      { label: "Complejo y profundo: me gusta dedicar tiempo a dominar un personaje único y difícil", diff: "Difícil", tags: ["postura", "puppet", "mishima", "difícil"] }
    ]
  },
  {
    num: 6,
    category: "Personalidad — Reacción en Situaciones Límite",
    question: "6. Te queda muy poca vida y tu rival te tiene contra las cuerdas. ¿Cómo reaccionas?",
    options: [
      { label: "Arriesgo todo con un contraataque sorpresa para dar la vuelta a la partida", tags: ["parry", "contraataque", "shoto", "reversals"] },
      { label: "Uso mi agilidad para escapar del peligro y recolocarme en el escenario", tags: ["movilidad", "teleport", "aereo", "evasion"] },
      { label: "Aguanto el golpe con fuerza bruta esperando conectar un solo impacto decisivo", tags: ["armadura", "heavy", "grappler", "powerhouse"] },
      { label: "Mantengo la calma, me defiendo bien y espero a que el rival cometa un error", tags: ["all-rounder", "footsies", "defensivo", "whiff"] }
    ]
  },
  {
    num: 7,
    category: "Cómo Quieres Jugar — Velocidad vs. Fuerza",
    question: "7. ¿Qué prefieres sentir cuando mueves a tu personaje por la pantalla?",
    options: [
      { label: "Mucha velocidad: moverme rapidísimo y lanzar muchos golpes seguidos", tags: ["velocidad", "rushdown", "aereo", "glass", "rápido"] },
      { label: "Equilibrio total: ni muy lento ni muy frágil, adaptable a todo", tags: ["all-rounder", "shoto", "equilibrado", "versátil"] },
      { label: "Mucha fuerza: aunque sea más lento, quiero que cada golpe quite muchísima vida", tags: ["powerhouse", "heavy", "grappler", "brawler", "daño"] }
    ]
  },
  {
    num: 8,
    category: "Personalidad — Carácter e Identidad",
    question: "8. ¿Con qué tipo de personalidad de personaje te sientes más cómodo?",
    options: [
      { label: "Alguien disciplinado, heroico, serio o centrado en las artes marciales", tags: ["shoto", "all-rounder", "swordie", "karate", "equilibrado"] },
      { label: "Alguien oscuro, intimidante, implacable o con estética de villano", tags: ["mishima", "oscuridad", "caos", "veneno", "zoner", "powerhouse"] },
      { label: "Alguien rebelde, veloz, energético, confiado o acrobático", tags: ["rushdown", "ninja", "movilidad", "sigilo", "velocidad"] },
      { label: "Alguien gigante, imponente o con un estilo raro y divertido", tags: ["grappler", "heavy", "tricky", "puppet", "setplay"] }
    ]
  },
  {
    num: 9,
    category: "Cómo Quieres Jugar — Romper la Defensa",
    question: "9. Si tu rival se pasa toda la partida cubriéndose, ¿cómo prefieres abrir su defensa?",
    options: [
      { label: "Atacando por arriba y por abajo rápido para que no sepa dónde cubrirse", tags: ["mix-up", "50/50", "overhead", "postura"] },
      { label: "Acercándome para hacerle un agarre que no pueda bloquear", tags: ["grappler", "agarre", "strike-throw"] },
      { label: "Lanzando ataques desde lejos para desgastarle poco a poco", tags: ["zoner", "chip", "trapper", "proyectil"] },
      { label: "Amagando para que lance un golpe al aire y castigar su fallo", tags: ["whiff", "alcance", "footsies", "counter"] }
    ]
  },
  {
    num: 10,
    category: "Personalidad — TuForma de Disfrutar la Victoria",
    question: "10. ¿Qué es lo que más te divierte conseguir durante una partida?",
    options: [
      { label: "Adivinar exactamente qué iba a hacer el rival y anticiparme a él", tags: ["counter", "parry", "grappler", "mishima"] },
      { label: "Hacer combos largos y espectaculares sin dejar caer al oponente", tags: ["rushdown", "combo", "corner"] },
      { label: "Dominar el espacio de forma que el rival no pueda ni acercarse a mí", tags: ["zoner", "alcance", "keepout", "trapper"] },
      { label: "Tener una respuesta sólida para cualquier situación que se presente", tags: ["all-rounder", "shoto", "equilibrado", "fundamentos"] }
    ]
  }
];

const QUIZ_BANKS = {
  // 1. TEST GENERAL (TODOS LOS JUEGOS)
  general: {
    title: "Test General (Todos los Juegos)",
    subtitle: "Responde 10 preguntas generales sobre tu personalidad y cómo te gusta jugar para descubrir tus personajes ideales.",
    targetGameId: "all",
    questions: [
      {
        num: 1,
        category: "Cómo Quieres Jugar — Distancia Favorita",
        question: "1. ¿A qué distancia del rival prefieres estar durante la pelea?",
        options: [
          { label: "Muy cerca: quiero estar encima del rival atacando sin parar", tags: ["rushdown", "presión", "mix-up"] },
          { label: "A media distancia: ni muy lejos ni pegado, controlando el terreno", tags: ["all-rounder", "shoto", "footsies", "whiff", "swordie"] },
          { label: "De lejos: prefiero atacar a distancia y frenar su avance", tags: ["zoner", "trapper", "alcance"] },
          { label: "Cara a cara buscando el momento de conectar un agarre o golpe demoledor", tags: ["grappler", "heavy", "powerhouse", "brawler"] }
        ]
      },
      {
        num: 2,
        category: "Personalidad — Tu Actitud Jugando",
        question: "2. ¿Cuál de estas frases define mejor tu personalidad al jugar?",
        options: [
          { label: "“La mejor defensa es un buen ataque”: soy directo y ofensivo", tags: ["rushdown", "velocidad", "ofensivo"] },
          { label: "“La paciencia gana partidas”: observo y espero el momento perfecto", tags: ["defensivo", "parry", "contraataque", "whiff", "equilibrado"] },
          { label: "“Sé impredecible”: me gusta usar engaños, trampas y sorprender", tags: ["mix-up", "setplay", "puppet", "tricky", "invisibilidad"] },
          { label: "“Pega fuerte una vez”: prefiero imponer respeto con pura potencia", tags: ["grappler", "powerhouse", "heavy", "daño"] }
        ]
      },
      {
        num: 3,
        category: "Cómo Quieres Jugar — Estilo de Acción",
        question: "3. ¿Qué estilo de combate te resulta más atractivo visualmente?",
        options: [
          { label: "Combates donde puedo llamar a un compañero en pantalla para ayudarme", tags: ["kameo", "setplay", "point", "anchor"] },
          { label: "Artes marciales clásicas uno contra uno midiendo cada paso", tags: ["shoto", "footsies", "all-rounder", "rushdown"] },
          { label: "Peleas cuerpo a cuerpo intensas con esquivas laterales y combinaciones", tags: ["mishima", "postura", "counter"] },
          { label: "Combates muy ágiles con saltos altos, armas y gran movilidad por el escenario", tags: ["aereo", "swordie", "bair"] }
        ]
      },
      {
        num: 4,
        category: "Cómo Quieres Jugar — Habilidades Preferidas",
        question: "4. ¿Qué tipo de habilidades especiales te gusta más tener en tu personaje?",
        options: [
          { label: "Habilidades que hacen más fuerte a mi personaje a medida que avanza la pelea", tags: ["nivel", "stocks", "carga", "instakill", "arsene"] },
          { label: "Proyectiles, trampas u objetos que controlan el escenario", tags: ["setplay", "trapper", "clones", "zoner"] },
          { label: "Distintas posturas o formas de ataque para variar mi estilo", tags: ["postura", "stance", "mix-up"] },
          { label: "Golpes directos, rápidos y efectivos sin tener que cargar nada", tags: ["shoto", "all-rounder", "rushdown", "brawler"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 2. TEST MORTAL KOMBAT 1 (PREGUNTAS GENÉRICAS ADAPTADAS A MK1)
  mk1: {
    title: "Test de Mortal Kombat 1 (10 Preguntas)",
    subtitle: "Descubre qué luchador de Mortal Kombat 1 encaja mejor con tu forma de jugar y tu personalidad.",
    targetGameId: "mk1",
    questions: [
      {
        num: 1,
        category: "Cómo Quieres Jugar — Estrategia Principal",
        question: "1. ¿Cómo te gustaría llevar el control del combate en Mortal Kombat 1?",
        options: [
          { label: "Alcanzando al rival desde media distancia con armas o ataques largos", tags: ["whiff", "alcance", "mid-range"] },
          { label: "Pegándome al oponente con combinaciones rápidas sin dejarle turno", tags: ["rushdown", "presión", "chip", "frame"] },
          { label: "Dominando desde lejos con magia, proyectiles o trampas en el suelo", tags: ["zoner", "clones", "portales", "setplay"] },
          { label: "Apareciendo por sorpresa con teletransportes, vuelo o invisibilidad", tags: ["invisibilidad", "teletransporte", "vuelo", "mix-up"] }
        ]
      },
      {
        num: 2,
        category: "Cómo Quieres Jugar — Uso del Compañero",
        question: "2. ¿Qué ayuda prefieres recibir de tu compañero de apoyo durante la pelea?",
        options: [
          { label: "Que me cubra cuando ataco para poder seguir presionando sin peligro", tags: ["rushdown", "presión", "chip"] },
          { label: "Que golpee a la vez que yo para que el rival no pueda bloquearlo todo", tags: ["mix-up", "invisibilidad", "clones"] },
          { label: "Que alargue mis combos para quitar muchísima más vida de un solo toque", tags: ["whiff", "daño", "powerhouse", "vuelo"] },
          { label: "Que me ayude a mantener al rival lejos con proyectiles o barreras", tags: ["zoner", "setplay", "bombas", "trampas"] }
        ]
      },
      {
        num: 3,
        category: "Personalidad — Afinidad de Personaje",
        question: "3. ¿Qué temática de personaje va más con tus gustos personales?",
        options: [
          { label: "Ninjas y asesinos elementales (fuego, hielo, humo, sombras o sigilo)", tags: ["whiff", "clones", "invisibilidad", "teletransporte"] },
          { label: "Guerreros marciales, monjes o realeza con poderes místicos", tags: ["shoto", "rushdown", "zoner", "levitate"] },
          { label: "Hechiceros oscuros, guerreros cibernéticos o conquistadores implacables", tags: ["portales", "bombas", "misiles", "hacha", "grappler"] },
          { label: "Personajes invitados de cine, series y cómics de acción", tags: ["viltrumita", "vuelo", "sigilo", "metal", "bárbaro"] }
        ]
      },
      {
        num: 4,
        category: "Cómo Quieres Jugar — Herramienta Especial",
        question: "4. ¿Cuál de estas ventajas te gustaría que tuviera tu luchador?",
        options: [
          { label: "Poder atacar desde dos sitios a la vez con un clon o espíritu", tags: ["puppet", "clon", "setplay"] },
          { label: "Poder volar o flotar en el aire para esquivar ataques del suelo", tags: ["vuelo", "levitate", "aérea"] },
          { label: "Tener agarres potentes, escudos de armadura o contraataques físicos", tags: ["grappler", "parries", "armadura", "powerhouse"] },
          { label: "Tener golpes muy rápidos y equilibrados que sirvan para todo", tags: ["shoto", "rushdown", "frame"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 3. TEST STREET FIGHTER 6 (PREGUNTAS GENÉRICAS ADAPTADAS A SF6)
  sf6: {
    title: "Test de Street Fighter 6 (10 Preguntas)",
    subtitle: "Descubre qué luchador de Street Fighter 6 encaja mejor con tu forma de jugar y tu personalidad.",
    targetGameId: "sf6",
    questions: [
      {
        num: 1,
        category: "Cómo Quieres Jugar — Ritmo de la Partida",
        question: "1. ¿Cómo prefieres usar tu barra de energía desde que empieza la ronda?",
        options: [
          { label: "Correr hacia adelante de forma explosiva para atacar primero", tags: ["rushdown", "corner", "movilidad"] },
          { label: "Controlar el centro del escenario y convertir cualquier toque en un buen combo", tags: ["shoto", "footsies", "equilibrado"] },
          { label: "Lanzar ataques a distancia para agotar la paciencia y energía del rival", tags: ["zoner", "portales", "veneno"] },
          { label: "Avanzar bloqueando con firmeza para acorralar al oponente", tags: ["grappler", "armadura", "medallas", "brawler"] }
        ]
      },
      {
        num: 2,
        category: "Cómo Quieres Jugar — Estilo de Pelea",
        question: "2. ¿Con cuál de estos estilos de lucha te sientes más cómodo?",
        options: [
          { label: "Equilibrado clásico: buen proyectil, buen antiaéreo y buenos golpes de suelo", tags: ["shoto", "denjin", "equilibrado"] },
          { label: "Ofensiva veloz: saltos rápidos, engaños y presión constante", tags: ["rushdown", "divekick", "fintas", "latas"] },
          { label: "Potencia física: agarres demoledores o golpes con armadura que rompen todo", tags: ["grappler", "brawler", "armadura", "piledriver", "medallas"] },
          { label: "Control lejano: ataques que cubren toda la pantalla y mantienen lejos al rival", tags: ["zoner", "portales", "veneno", "extremidades"] }
        ]
      },
      {
        num: 3,
        category: "Cómo Quieres Jugar — Mecánica Propia",
        question: "3. ¿Te gusta que tu personaje pueda acumular cargas para mejorar sus golpes?",
        options: [
          { label: "Sí, me gusta cargar energía durante la ronda para desbloquear golpes más fuertes", tags: ["denjin", "fuha", "viento", "bebida"] },
          { label: "Sí, quiero que mis agarres o bombas hagan cada vez más daño en la partida", tags: ["medallas", "mine", "grappler"] },
          { label: "Prefiero tener fintas de movimiento, baile o técnicas ágiles", tags: ["postura", "fintas", "gadgets", "capoeira"] },
          { label: "No, prefiero tener todos mis golpes al 100% desde el primer segundo", tags: ["shoto", "rushdown", "divekick", "grappler"] }
        ]
      },
      {
        num: 4,
        category: "Personalidad — Actitud de tu Luchador",
        question: "4. ¿Qué personalidad de luchador te inspira más al competir?",
        options: [
          { label: "Un luchador honorable y centrado en superarse a sí mismo", tags: ["shoto", "muay", "equilibrado"] },
          { label: "Alguien agresivo, rebelde, despiadado o intimidante", tags: ["glass", "mine", "fuha", "veneno"] },
          { label: "Alguien alegre, con ritmo, carismático y lleno de estilo", tags: ["fintas", "ninja", "movilidad", "abanicos", "capoeira"] },
          { label: "Un coloso imparable que impone respeto solo con su presencia", tags: ["armadura", "grappler", "medallas", "carga"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 4. TEST TEKKEN 8 (PREGUNTAS GENÉRICAS ADAPTADAS A TEKKEN 8)
  tekken8: {
    title: "Test de Tekken 8 (10 Preguntas)",
    subtitle: "Descubre qué luchador de Tekken 8 encaja mejor con tu forma de jugar y tu personalidad.",
    targetGameId: "tekken8",
    questions: [
      {
        num: 1,
        category: "Cómo Quieres Jugar — Tu Punto Fuerte",
        question: "1. En un combate cuerpo a cuerpo en 3D, ¿cuál quieres que sea tu mayor virtud?",
        options: [
          { label: "Un avance agresivo que obligue al rival a adivinar entre golpes bajos o medios", tags: ["mishima", "vortex", "sentai", "warrior"] },
          { label: "Una lluvia constante de ataques fluidos y cambios de postura", tags: ["posturas", "flamingo", "boxeador", "sentai", "capoeira"] },
          { label: "Golpes contundentes que castiguen cualquier intento de ataque del rival", tags: ["counter", "powerhouse", "deathfist", "muay"] },
          { label: "Esquivar los golpes rivales con agilidad, contraataques o llaves de agarre", tags: ["evasión", "parries", "grappler", "sidestep", "ninjutsu"] }
        ]
      },
      {
        num: 2,
        category: "Cómo Quieres Jugar — Modo Ofensivo",
        question: "2. Cuando activas tu modo de potencia en la ronda, ¿qué prefieres conseguir?",
        options: [
          { label: "Que mis técnicas más difíciles y potentes salgan con mucha más facilidad", tags: ["mishima", "vortex", "devil"] },
          { label: "Usar armas o ataques especiales que desgasten al rival aunque se cubra", tags: ["pistolas", "motosierras", "espada", "eikons"] },
          { label: "Acercarme corriendo al instante para acorralar al oponente contra el muro", tags: ["mix-up", "posturas", "powerhouse", "grappler"] },
          { label: "Recuperar vida y tener defensas especiales listas contra ataques enemigos", tags: ["curación", "defensivo", "contraataques", "parries"] }
        ]
      },
      {
        num: 3,
        category: "Cómo Quieres Jugar — Estilo de Arte Marcial",
        question: "3. ¿Qué tipo de estilo de combate te resulta más cómodo en las manos?",
        options: [
          { label: "Directo y demoledor: pocos golpes clave pero que quitan muchísima vida", tags: ["simple", "powerhouse", "keepout", "starburst"] },
          { label: "Dinámico y acrobático: encadenar movimientos que fluyen solos entre sí", tags: ["posturas", "sentai", "libertador", "capoeira"] },
          { label: "Elegante y técnico: esquivar de lado y castigar con precisión quirúrgica", tags: ["sidestep", "kenpo", "karate", "bajiquan"] },
          { label: "Especializado: boxeo puro, lucha libre de agarres o ninjutsu con armas", tags: ["just", "grappler", "ninjutsu", "flash", "boxeador"] }
        ]
      },
      {
        num: 4,
        category: "Personalidad — Carácter en el Torneo",
        question: "4. ¿Qué perfil de personaje va más con tu personalidad?",
        options: [
          { label: "Ambicioso, serio y con aura de poder oscuro o eléctrico", tags: ["mishima", "kazama", "sentai"] },
          { label: "Duro, directo y amante del combate físico sin adornos", tags: ["counter", "powerhouse", "boxeador", "grappler", "muay", "baki"] },
          { label: "Sofisticado, veloz y con estilo propio", tags: ["espada", "eikons", "ninjutsu", "sidestep", "posturas"] },
          { label: "Divertido, impredecible y capaz de sacar de quicio al rival", tags: ["flash", "evasión", "bear", "canguro", "libertador"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 5. TEST DRAGON BALL FIGHTERZ (PREGUNTAS GENÉRICAS ADAPTADAS A DBFZ)
  dbfz: {
    title: "Test de Dragon Ball FighterZ (10 Preguntas)",
    subtitle: "Descubre qué personajes de Dragon Ball FighterZ encajan mejor con tu juego y personalidad.",
    targetGameId: "dbfz",
    questions: [
      {
        num: 1,
        category: "Cómo Quieres Jugar — Tu Rol en el Equipo",
        question: "1. Al formar un equipo de tres luchadores, ¿qué papel te gusta más protagonizar?",
        options: [
          { label: "El que sale primero para llevar la iniciativa ayudado por sus compañeros", tags: ["point", "mix-up", "loops", "presión"] },
          { label: "El refuerzo intermedio que controla la pantalla y apoya al equipo", tags: ["mid", "alcance", "espada", "contraataques"] },
          { label: "El as final capaz de remontar la partida él solo cuando queda último", tags: ["anchor", "beam", "todoterreno", "daño"] },
          { label: "Un luchador versátil que rinda igual de bien en cualquier puesto", tags: ["todoterreno", "lariat", "fácil"] }
        ]
      },
      {
        num: 2,
        category: "Cómo Quieres Jugar — Control de la Pantalla",
        question: "2. En un combate aéreo tan rápido, ¿cómo prefieres acercarte o controlar al rival?",
        options: [
          { label: "Lanzando grandes ondas de energía que crucen toda la pantalla", tags: ["beam", "zoner", "ki"] },
          { label: "Avanzando a toda velocidad con embestidas o teletransportes instantáneos", tags: ["lariat", "teleport", "espada", "velocidad"] },
          { label: "Abase de tamaño gigante, escudos de energía y agarres que rompen la guardia", tags: ["grappler", "armadura", "barrera"] },
          { label: "Usando esquivas, contraataques automáticos o doble impulso en el aire", tags: ["contraataques", "defensivo", "reversals", "air dash"] }
        ]
      },
      {
        num: 3,
        category: "Cómo Quieres Jugar — Estilo de Ataque",
        question: "3. Cuando tienes acorralado al oponente, ¿qué te divierte más hacer?",
        options: [
          { label: "Atacarle por todos los ángulos posibles a gran velocidad", tags: ["mix-up", "point", "loops", "flips"] },
          { label: "Llamar a compañeros o trampas de energía para no dejarle hueco de salida", tags: ["setplay", "invocación", "fantasmas", "barrera"] },
          { label: "Aumentar el poder de mi personaje durante la pelea para un ataque definitivo", tags: ["niveles", "instakill", "debuff"] },
          { label: "Usar golpes largos y potentes que alcancen desde lejos", tags: ["grappler", "alcance", "patadas"] }
        ]
      },
      {
        num: 4,
        category: "Personalidad — Tu Afinidad en Dragon Ball",
        question: "4. ¿Con qué tipo de luchador conectas más por su personalidad?",
        options: [
          { label: "Héroes competitivos que siempre buscan superar sus límites", tags: ["anchor", "point", "lariat", "patadas", "instakill"] },
          { label: "Villanos imponentes y destructivos que dominan por intimidación", tags: ["perfect", "zoner", "grappler", "vuelo", "teletransporte"] },
          { label: "Luchadores calculadores, sintéticos o con habilidades de absorción", tags: ["grappler", "barrera", "absorción", "debuff"] },
          { label: "Maestros estratégicos con técnicas únicas y poco convencionales", tags: ["contraataques", "orbes", "flips", "esferas", "mafuba"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 6. TEST GUILTY GEAR -STRIVE- (PREGUNTAS GENÉRICAS ADAPTADAS A GGST)
  "gg-strive": {
    title: "Test de Guilty Gear -Strive- (10 Preguntas)",
    subtitle: "Descubre qué personaje de Guilty Gear -Strive- encaja mejor con tu forma de jugar y tu personalidad.",
    targetGameId: "gg-strive",
    questions: [
      {
        num: 1,
        category: "Cómo Quieres Jugar — Estilo Principal",
        question: "1. ¿Qué forma de pelear te llama más la atención en Guilty Gear -Strive-?",
        options: [
          { label: "Ir hacia adelante sin freno con golpes cuerpo a cuerpo de muchísimo daño", tags: ["rushdown", "strike-throw", "dandy", "carrera"] },
          { label: "Controlar la pantalla con armas largas que golpeen desde muy lejos", tags: ["esquina", "espadas", "zoner", "yo-yo", "alcance"] },
          { label: "Moverme por el aire a toda velocidad confundiendo la defensa del rival", tags: ["mix-up", "hoverdash", "velocidad", "setplay"] },
          { label: "Jugar de forma única: agarres gigantes, controlar una sombra o lanzar hechizos", tags: ["grappler", "puppet", "siervos", "cartas", "billar"] }
        ]
      },
      {
        num: 2,
        category: "Cómo Quieres Jugar — Sencillez vs. Gestión",
        question: "2. ¿Te gusta estar pendiente de barras o recursos especiales propios durante el combate?",
        options: [
          { label: "No, prefiero centrarme solo en la pelea sin medidores complicados", tags: ["rushdown", "all-rounder", "shock", "carga"] },
          { label: "Me gusta el riesgo: ganar muchísimo poder a cambio de controlar mi límite", tags: ["blood", "celos", "samurái"] },
          { label: "Sí, disfruto gestionando munición, energía o cartas mágicas", tags: ["pistola", "stamina", "cartas"] },
          { label: "Prefiero colocar objetos o proyectiles en la pantalla para preparar mi jugada", tags: ["yo-yo", "siervos", "tatami", "billar", "hielo"] }
        ]
      },
      {
        num: 3,
        category: "Cómo Quieres Jugar — Presión Ofensiva",
        question: "3. ¿Cómo prefieres ganar tus intercambios de golpes?",
        options: [
          { label: "Con un solo golpe fortísimo que castigue el error del rival", tags: ["daño", "dandy", "behemoth", "samurái"] },
          { label: "Con ataques encadenados rápidos y constantes que no den respiro", tags: ["rekka", "delfín", "carrera", "velocidad"] },
          { label: "Con un contraataque instantáneo o un agarre que cambie la ronda", tags: ["parry", "tether", "grappler", "autoguard"] },
          { label: "Acorralando al oponente contra la esquina sin dejarle escapar", tags: ["esquina", "espadas", "puppet", "zoner", "hielo"] }
        ]
      },
      {
        num: 4,
        category: "Personalidad — Tu Carácter",
        question: "4. ¿Con cuál de estas personalidades te identificas más?",
        options: [
          { label: "Directo, rebelde, intenso y seguro de sí mismo", tags: ["strike-throw", "dandy", "parry", "carrera", "mist"] },
          { label: "Sereno, elegante, metódico y con gran temple", tags: ["shock", "samurái", "stain", "hielo", "billar"] },
          { label: "Alegre, dinámico, carismático y lleno de energía", tags: ["delfín", "yo-yo", "rekka", "stamina", "velocidad", "disco"] },
          { label: "Misterioso, excéntrico, creativo y totalmente impredecible", tags: ["pistola", "aleatorios", "puppet", "celos", "error", "netrunner"] }
        ]
      },
      ...SHARED_PERSONALITY_AND_PLAYSTYLE_TAIL
    ]
  },

  // 7. TEST SUPER SMASH BROS. ULTIMATE (PREGUNTAS GENÉRICAS ADAPTADAS A SMASH)
  ssbu: {
    title: "Test de Super Smash Bros. Ultimate (10 Preguntas)",
    subtitle: "Descubre qué luchador de Smash Ultimate encaja mejor con tu forma de jugar y tu personalidad.",
    targetGameId: "ssbu",
    questions: [
      {
        num: 1,
        category: "Cómo Quieres Jugar — Dominio del Escenario",
        question: "1. ¿Cómo te sientes más cómodo peleando en un escenario con plataformas?",
        options: [
          { label: "Usando un arma o espada con buen alcance para golpear sin que me toquen", tags: ["swordie", "espada", "bair", "distancia"] },
          { label: "Corriendo y saltando a toda velocidad para encadenar muchos golpes seguidos", tags: ["rushdown", "fast faller", "escalera", "velocidad"] },
          { label: "Controlando el mapa desde lejos con disparos, proyectiles o trampas", tags: ["zoner", "trapper", "bloques", "proyectiles", "bomba"] },
          { label: "Siendo un luchador grande y resistente que aguanta mucho y pega durísimo", tags: ["heavy", "super heavy", "grappler", "armor"] }
        ]
      },
      {
        num: 2,
        category: "Cómo Quieres Jugar — Cómo Conseguir el KO",
        question: "2. ¿De qué forma te gusta más sacar al rival fuera de la pantalla?",
        options: [
          { label: "Saliendo a perseguirlo por el aire fuera del escenario para rematarlo", tags: ["edgeguard", "combate aéreo", "saltos", "bair"] },
          { label: "Esperándolo en el borde del escenario con una trampa lista cuando intente subir", tags: ["ledgetrap", "trapper", "zoner", "bombas"] },
          { label: "Defendiéndome con el escudo y respondiendo al instante cuando me golpee", tags: ["oos", "up-smash", "climhazzard", "confirm"] },
          { label: "Con un golpe especial cargado o una transformación cuando el combate está igualado", tags: ["arsene", "touch of death", "limit", "waft", "aura"] }
        ]
      },
      {
        num: 3,
        category: "Cómo Quieres Jugar — Tipo de Mecánica",
        question: "3. ¿Qué tipo de control prefieres cuando juegas a Smash?",
        options: [
          { label: "Un personaje equilibrado e intuitivo que responda bien en cualquier situación", tags: ["all-rounder", "fundamentos", "swordie", "honesto"] },
          { label: "Un luchador de combate cuerpo a cuerpo con combinaciones de gran daño", tags: ["comandos", "inputs", "touch of death"] },
          { label: "Un personaje estratégico que cree objetos, bloques o controle el terreno", tags: ["bloques", "trapper", "float", "monado", "granadas"] },
          { label: "Un personaje que pueda cambiar de estilo o transformar sus habilidades en partida", tags: ["mythra", "squirtle", "arsene", "puppet"] }
        ]
      },
      {
        num: 4,
        category: "Personalidad — Tu Estilo de Personaje",
        question: "4. ¿Qué estilo de protagonista encaja mejor con tu personalidad?",
        options: [
          { label: "Aventurero valiente, héroe de fantasía o espadachín ágil", tags: ["swordie", "espada", "arsene", "magia"] },
          { label: "Competidor veloz, audaz y amante de la adrenalina", tags: ["velocidad", "fast faller", "brawler", "mobility"] },
          { label: "Jefe final imponente, poderoso y difícil de derribar", tags: ["super heavy", "heavy", "grappler", "touch of death"] },
          { label: "Ingenioso, táctico y amante de las jugadas inteligentes", tags: ["bloques", "zoner", "trapper", "gyro"] }
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
          const fallbackSrc = (ch.fallbackIconUrl || ch.iconUrl).replace(/'/g, "\\'");
          const safeName = ch.name.replace(/'/g, "\\'");
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

// =========================================================================
// E. COMPARADOR MATCHUP EN TIEMPO REAL (TÚ VS. RIVAL)
// =========================================================================
window.initMatchupComparator = function () {
  const gameSel = document.getElementById("compareGameSelect");
  const mySel = document.getElementById("compareMyCharSelect");
  const oppSel = document.getElementById("compareOppCharSelect");
  const outEl = document.getElementById("compareResultsContainer");
  if (!gameSel || !mySel || !oppSel || !outEl || typeof state === "undefined" || !state.games.length) return;

  if (!gameSel.options.length) {
    gameSel.innerHTML = state.games.map((g) => `<option value="${g.id}">${g.title}</option>`).join("");
  }

  const populate = async () => {
    let game = state.games.find((g) => g.id === gameSel.value) || state.games[0];
    if (game && typeof window.ensureFullGameLoaded === "function") {
      game = (await window.ensureFullGameLoaded(game.id)) || game;
    }
    const opts = game.characters.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
    mySel.innerHTML = opts;
    oppSel.innerHTML = opts;
    if (oppSel.options.length > 1) oppSel.selectedIndex = 1;
    renderComparison();
  };

  const renderComparison = () => {
    const game = state.games.find((g) => g.id === gameSel.value) || state.games[0];
    const myChar = game.characters.find((c) => c.id === mySel.value) || game.characters[0];
    const oppChar = game.characters.find((c) => c.id === oppSel.value) || game.characters[1] || game.characters[0];
    if (!myChar || !oppChar) return;

    const myMoves = (myChar.frameDataCards || []).map((m) => ({
      ...m,
      startupNum: extractStartupNumber(m.startup),
      onBlockNum: extractOnBlockNumber(m.onBlock)
    }));
    const oppMoves = (oppChar.frameDataCards || []).map((m) => ({
      ...m,
      startupNum: extractStartupNumber(m.startup),
      onBlockNum: extractOnBlockNumber(m.onBlock)
    }));

    const myFastest = [...myMoves].sort((a, b) => a.startupNum - b.startupNum)[0];
    const oppFastest = [...oppMoves].sort((a, b) => a.startupNum - b.startupNum)[0];
    const myBestCombo = myChar.combos?.[0];
    const oppBestCombo = oppChar.combos?.[0];
    const oppUnsafe = oppMoves.filter((m) => m.onBlockNum !== null && m.onBlockNum <= -4);

    const rowsHTML = oppUnsafe
      .slice(0, 12)
      .map((om) => {
        const deficit = Math.abs(om.onBlockNum);
        const punishers = myMoves
          .filter((mm) => mm.startupNum > 0 && mm.startupNum <= deficit)
          .sort((a, b) => b.startupNum - a.startupNum)
          .slice(0, 3);
        const oppCmd = typeof translateNotation === "function" ? translateNotation(om.input, game.sagaId, state.notationMode) : om.input;
        const punishStr = punishers.length
          ? punishers
              .map((p) => {
                const cmd = typeof translateNotation === "function" ? translateNotation(p.input, game.sagaId, state.notationMode) : p.input;
                return `<span class="code-input-pill" style="margin:2px;">${cmd} (${p.startupNum}f)</span>`;
              })
              .join(" ")
          : `<span style="color:#94a3b8;font-size:0.78rem;">Seguro (-${deficit}f &lt; tu botón más rápido)</span>`;
        return `
          <tr>
            <td><strong>${om.moveName}</strong><br/><span class="code-input-pill">${oppCmd}</span></td>
            <td style="color:#f87171;font-family:var(--font-mono);font-weight:700;">${om.onBlockNum}f</td>
            <td>${punishStr}</td>
          </tr>
        `;
      })
      .join("");

    outEl.innerHTML = `
      <div class="guide-split-layout" style="margin-bottom:18px;">
        <div class="guide-section-item" style="margin-top:0;border-left:3px solid #22c55e;">
          <h4 style="margin-bottom:6px;">⚡ Tu Personaje: ${myChar.name}</h4>
          <p style="font-size:0.84rem;margin-bottom:4px;"><strong>Arquetipo:</strong> ${myChar.archetype}</p>
          <p style="font-size:0.84rem;margin-bottom:4px;"><strong>Poke más rápido:</strong> ${myFastest ? `${myFastest.moveName} (${myFastest.startupNum}f)` : "—"}</p>
          ${myBestCombo ? `<p style="font-size:0.78rem;color:#34d399;margin:0;"><strong>BnB Clave:</strong> ${myBestCombo.notation} (${myBestCombo.damage})</p>` : ""}
        </div>
        <div class="guide-section-item" style="margin-top:0;border-left:3px solid #e11d48;">
          <h4 style="margin-bottom:6px;">🎯 Rival: ${oppChar.name}</h4>
          <p style="font-size:0.84rem;margin-bottom:4px;"><strong>Arquetipo:</strong> ${oppChar.archetype}</p>
          <p style="font-size:0.84rem;margin-bottom:4px;"><strong>Poke más rápido:</strong> ${oppFastest ? `${oppFastest.moveName} (${oppFastest.startupNum}f)` : "—"}</p>
          ${oppBestCombo ? `<p style="font-size:0.78rem;color:#fca5a5;margin:0;"><strong>Amenaza BnB:</strong> ${oppBestCombo.notation} (${oppBestCombo.damage})</p>` : ""}
        </div>
      </div>

      <h4 style="font-family:var(--font-display);margin-bottom:10px;">
        Tabla Automática de Castigos (${myChar.name} castigando a ${oppChar.name})
      </h4>
      <table class="moves-table">
        <thead>
          <tr>
            <th>Ataque del Rival</th>
            <th>En Bloqueo</th>
            <th>Con qué castiga ${myChar.name}</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML || '<tr><td colspan="3" style="color:#94a3b8;">No hay movimientos castigables detectados en esta ficha.</td></tr>'}
        </tbody>
      </table>
    `;
  };

  if (!gameSel.dataset.bound) {
    gameSel.dataset.bound = "1";
    gameSel.addEventListener("change", populate);
    mySel.addEventListener("change", renderComparison);
    oppSel.addEventListener("change", renderComparison);
    populate();
  } else {
    renderComparison();
  }
};

// =========================================================================
// F. PERFIL LOCAL DE ENTRENAMIENTO (MIS MAINS, NOTAS Y CHECKLIST)
// =========================================================================
const PROFILE_STORAGE_KEY = "fgc_vault_training_profile_v1";

function loadTrainingProfileData() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    mains: [],
    notesByChar: {},
    drillsByChar: {}
  };
}

function saveTrainingProfileData(data) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
  } catch (_) {}
}

window.isFavoriteMain = function (gameId, charId) {
  const data = loadTrainingProfileData();
  return data.mains.some((m) => m.gameId === gameId && m.charId === charId);
};

window.toggleFavoriteMain = function (gameId, charId, charName, gameTitle) {
  const data = loadTrainingProfileData();
  const existsIdx = data.mains.findIndex((m) => m.gameId === gameId && m.charId === charId);
  let nowFav = false;
  if (existsIdx >= 0) {
    data.mains.splice(existsIdx, 1);
    nowFav = false;
  } else {
    data.mains.unshift({ gameId, charId, charName, gameTitle });
    if (!data.drillsByChar[`${gameId}:${charId}`]) {
      data.drillsByChar[`${gameId}:${charId}`] = [
        { text: "Confirmar combo BnB sin gastar barra (5 veces seguidas por lado)", done: false },
        { text: "Reaccionar consistentemente al antiaéreo principal", done: false },
        { text: "Castigar sweeps (-12f / -14f) al bloquear en Training Mode", done: false }
      ];
    }
    nowFav = true;
  }
  saveTrainingProfileData(data);
  if (typeof window.initTrainingProfile === "function") window.initTrainingProfile();
  return nowFav;
};

window.initTrainingProfile = function () {
  const container = document.getElementById("trainingProfileContainer");
  if (!container) return;
  const data = loadTrainingProfileData();

  const backupBarHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;padding:12px 14px;background:rgba(12,14,18,0.88);border:1px solid rgba(255,255,255,0.12);border-radius:8px;">
      <span style="font-size:0.8rem;color:#cbd5e1;"><strong>Respaldo Personal (Mains, Notas y Drills):</strong> Lleva tus datos entre PC y móvil.</span>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button type="button" class="btn btn-outline" id="btnExportProfileJson" style="padding:6px 12px;font-size:0.72rem;">⬇ Exportar Backup JSON</button>
        <label class="btn btn-outline" style="padding:6px 12px;font-size:0.72rem;cursor:pointer;">
          ⬆ Importar JSON
          <input type="file" id="inpImportProfileJson" accept="application/json" style="display:none;" />
        </label>
      </div>
    </div>
  `;

  if (data.mains.length === 0) {
    container.innerHTML =
      backupBarHTML +
      `
      <div class="guide-section-item" style="margin-top:0;text-align:center;padding:28px;">
        <h4 style="margin-bottom:8px;">Aún no tienes ningún Main guardado</h4>
        <p style="font-size:0.88rem;color:#9b9b9b;">
          Abre la ficha de cualquier personaje dentro de cualquier juego y pulsa <strong>☆ Marcar Main</strong> arriba a la derecha para guardarlo aquí con tus notas y ejercicios de entrenamiento.
        </p>
      </div>
    `;
    bindProfileBackupControls();
    return;
  }

  container.innerHTML =
    backupBarHTML +
    data.mains
    .map((m) => {
      const k = `${m.gameId}:${m.charId}`;
      const note = data.notesByChar[k] || "";
      const drills = data.drillsByChar[k] || [];
      return `
        <div class="guide-section-item profile-main-card" style="margin-top:0;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
            <div>
              <span class="diff-badge">${m.gameTitle}</span>
              <h4 style="margin:6px 0 0;font-size:1.15rem;">★ ${m.charName}</h4>
            </div>
            <div style="display:flex;gap:8px;">
              <button class="btn btn-primary" data-profopen="${m.gameId}|${m.charId}" style="padding:7px 12px;font-size:0.75rem;">Abrir Frame Data</button>
              <button class="btn btn-outline" data-profdel="${m.gameId}|${m.charId}" style="padding:7px 12px;font-size:0.75rem;">Quitar</button>
            </div>
          </div>

          <label style="display:block;font-size:0.76rem;color:#fbbf24;margin-bottom:6px;">Notas personales de Matchups / Setups:</label>
          <textarea class="profile-note-input" data-profnote="${k}" rows="2" placeholder="Apunta aquí castigos clave, setups o debilidades del rival...">${note}</textarea>

          <div style="margin-top:12px;">
            <strong style="font-size:0.78rem;color:#e5e5e5;display:block;margin-bottom:6px;">Checklist de Training Mode:</strong>
            ${drills
              .map(
                (d, idx) => `
                <label class="drill-check-row">
                  <input type="checkbox" data-drilltoggle="${k}|${idx}" ${d.done ? "checked" : ""} />
                  <span style="${d.done ? "text-decoration:line-through;color:#737373;" : ""}">${d.text}</span>
                </label>
              `
              )
              .join("")}
            <div style="display:flex;gap:8px;margin-top:8px;">
              <input type="text" class="in-game-search" style="flex:1;" id="addDrillInput_${k}" placeholder="Añadir nuevo ejercicio de práctica..." />
              <button class="btn btn-outline" data-adddrill="${k}" style="padding:6px 12px;font-size:0.74rem;">+ Añadir</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll("[data-profopen]").forEach((b) => {
    b.onclick = () => {
      const [gId, cId] = b.dataset.profopen.split("|");
      document.getElementById("toolsView")?.classList.add("hidden");
      openGameHub(gId, "page-roster");
      openCharacterModal(gId, cId);
    };
  });
  container.querySelectorAll("[data-profdel]").forEach((b) => {
    b.onclick = () => {
      const [gId, cId] = b.dataset.profdel.split("|");
      window.toggleFavoriteMain(gId, cId, "", "");
    };
  });
  container.querySelectorAll("[data-profnote]").forEach((ta) => {
    ta.addEventListener("input", () => {
      const d = loadTrainingProfileData();
      d.notesByChar[ta.dataset.profnote] = ta.value;
      saveTrainingProfileData(d);
    });
  });
  container.querySelectorAll("[data-drilltoggle]").forEach((cb) => {
    cb.addEventListener("change", () => {
      const [k, idx] = cb.dataset.drilltoggle.split("|");
      const d = loadTrainingProfileData();
      if (d.drillsByChar[k] && d.drillsByChar[k][Number(idx)]) {
        d.drillsByChar[k][Number(idx)].done = cb.checked;
        saveTrainingProfileData(d);
        window.initTrainingProfile();
      }
    });
  });
  container.querySelectorAll("[data-adddrill]").forEach((btn) => {
    btn.onclick = () => {
      const k = btn.dataset.adddrill;
      const inp = document.getElementById(`addDrillInput_${k}`);
      const val = (inp?.value || "").trim();
      if (!val) return;
      const d = loadTrainingProfileData();
      if (!d.drillsByChar[k]) d.drillsByChar[k] = [];
      d.drillsByChar[k].push({ text: val, done: false });
      saveTrainingProfileData(d);
      window.initTrainingProfile();
    };
  });
};


// =========================================================================
// G. LABORATORIO DE KAMEOS MK1, SINERGIAS Y POSICIONAMIENTO 3v3 DBFZ
// =========================================================================
window.initSynergyAndTeamLab = function (preselectOpts = {}) {
  if (typeof state === "undefined" || !state.games.length) return;
  initMk1SynergyLab(preselectOpts);
  initDbfzTeamBuilder(preselectOpts);
};

function evaluateMk1MainKameoPair(mainChar, kameo) {
  const hpNum = parseInt(String(kameo.hpBonus || "0").replace(/[^-\d]/g, ""), 10) || 0;
  const totalHp = 1000 + hpNum;
  const curatedList = mainChar.kameoSynergy?.topKameos || [];
  const curated = curatedList.find((x) => x.kameo === kameo.name);

  if (curated) {
    return {
      score: curated.score || "S",
      tag: curated.tag || kameo.callType,
      route: curated.route,
      reason: curated.reason,
      totalHp,
      isCurated: true
    };
  }

  const needs = mainChar.kameoSynergy?.needs || ["combo_extender", "safe_pressure"];
  const kameoTags = kameo.tags || [];
  const matches = needs.filter((n) => kameoTags.includes(n));

  const tagLabels = {
    overhead_low: "Mix-up Overhead/Low",
    safe_pressure: "Seguridad en Bloqueo (+frames)",
    combo_extender: "Extensión de Combos (+Daño)",
    anti_zoning: "Defensa Anti-Zoning",
    setup: "Setplay y Trampas en Esquina",
    chip_damage: "Chip Damage en Bloqueo",
    damage_boost: "Escalado de Daño Alto",
    armor_break: "Rompe-Armadura / Agarre",
    fast_recharge: "Recarga Rápida de Kameo",
    meter_drain: "Drenaje de Barra Super"
  };

  let score = "B+";
  if (matches.length >= 3) score = "S";
  else if (matches.length === 2) score = "A+";
  else if (matches.length === 1) score = "A";

  const matchedText = matches.length
    ? matches.map((m) => tagLabels[m] || m).join(", ")
    : kameoTags.slice(0, 2).map((m) => tagLabels[m] || m).join(", ");

  const firstMove = kameo.moves?.[0];
  return {
    score,
    tag: matches.length >= 2 ? "Sinergia Sólida" : "Cobertura Táctica",
    route: `${mainChar.keyMoves?.[0]?.input || "f+3,2"} + ${firstMove ? `${firstMove.input} (${firstMove.name})` : kameo.name}`,
    reason: `${kameo.name} aporta a ${mainChar.name}: ${matchedText}. ${kameo.gameplan}`,
    totalHp,
    isCurated: false
  };
}

function compareTwoKameos(k1, k2) {
  if (!k1 || !k2) return "";
  if (k1.id === k2.id) {
    return `<div style="color:#94a3b8;font-size:0.84rem;">Selecciona un segundo Kameo distinto arriba para analizar cómo se complementan y en qué matchups cambiar entre uno y otro.</div>`;
  }

  const tags1 = new Set(k1.tags || []);
  const tags2 = new Set(k2.tags || []);
  const only1 = (k1.tags || []).filter((t) => !tags2.has(t));
  const only2 = (k2.tags || []).filter((t) => !tags1.has(t));
  const shared = (k1.tags || []).filter((t) => tags2.has(t));

  const tagNames = {
    overhead_low: "Mix-up Overhead/Low",
    safe_pressure: "Seguridad en Bloqueo",
    combo_extender: "Extensión de Combos",
    anti_zoning: "Anti-Zoning / Proyectiles",
    setup: "Setups y Trampas Oki",
    chip_damage: "Chip Damage",
    damage_boost: "Daño Bruto",
    armor_break: "Armadura / Agarre",
    fast_recharge: "Recarga Rápida",
    meter_drain: "Drenaje Super"
  };

  const complementaryScore = only1.length + only2.length;
  const verdictBadge = complementaryScore >= 3 ? "Complemento Torneo Óptimo (Alternar en Set)" : "Estilo Similar (Ajuste Fino de Matchup)";

  const has = (k, t) => (k.tags || []).includes(t);
  const featRow = (label, t) => `
    <tr>
      <td style="color:#cbd5e1;font-weight:600;">${label}</td>
      <td style="text-align:center;">${has(k1, t) ? "✅ Sí" : "—"}</td>
      <td style="text-align:center;">${has(k2, t) ? "✅ Sí" : "—"}</td>
    </tr>
  `;

  return `
    <div style="margin-top:16px;padding:14px;background:rgba(12,14,18,0.88);border:1px solid rgba(251,191,36,0.3);border-radius:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
        <h4 style="margin:0;color:#fbbf24;font-family:var(--font-display);">Sinergia y Comparativa entre Kameos: ${k1.name} vs ${k2.name}</h4>
        <span class="synergy-tier-pill ${complementaryScore >= 3 ? "tier-splus" : ""}">${verdictBadge}</span>
      </div>
      <p style="font-size:0.83rem;color:#cbd5e1;margin-bottom:10px;">
        <strong>Cuándo usar ${k1.name} (${k1.hpBonus}):</strong> ${only1.length ? `Cubre ${only1.map((t) => tagNames[t] || t).join(" y ")}. ` : ""}${k1.bestWithMainTypes}
        <br />
        <strong>Cuándo cambiar a ${k2.name} (${k2.hpBonus}):</strong> ${only2.length ? `Aporta ${only2.map((t) => tagNames[t] || t).join(" y ")}. ` : ""}${k2.bestWithMainTypes}
        ${shared.length ? `<br /><span style="color:#94a3b8;">En común: ${shared.map((t) => tagNames[t] || t).join(", ")}.</span>` : ""}
      </p>
      <table class="moves-table" style="margin-bottom:0;">
        <thead>
          <tr>
            <th>Propiedad Táctica</th>
            <th style="text-align:center;">${k1.name} (${k1.hpBonus})</th>
            <th style="text-align:center;">${k2.name} (${k2.hpBonus})</th>
          </tr>
        </thead>
        <tbody>
          ${featRow("Mix-up Overhead / Low", "overhead_low")}
          ${featRow("Seguridad en Bloqueo (Ambush)", "safe_pressure")}
          ${featRow("Extensión de Combos / Daño", "combo_extender")}
          ${featRow("Defensa Anti-Zoning", "anti_zoning")}
          ${featRow("Setplay / Trampas / Oki", "setup")}
          ${featRow("Recarga Rápida de Barra", "fast_recharge")}
        </tbody>
      </table>
    </div>
  `;
}

function initMk1SynergyLab(preselectOpts = {}) {
  const container = document.getElementById("mk1SynergyLabContainer");
  if (!container) return;
  const mk1 = state.games.find((g) => g.id === "mk1");
  if (!mk1 || !Array.isArray(mk1.kameos) || !mk1.kameos.length) return;

  if (!container.dataset.built) {
    container.dataset.built = "1";
    container.innerHTML = `
      <div class="news-filter-bar" style="margin-bottom:16px;">
        <div class="filter-inputs-row" style="width:100%;">
          <div class="date-filter-group" style="flex:1;min-width:190px;">
            <label for="synMkMainSelect">1. Luchador Principal MK1 (35)</label>
            <select id="synMkMainSelect">${mk1.characters.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}</select>
          </div>
          <div class="date-filter-group" style="flex:1;min-width:190px;">
            <label for="synMkKameoASelect">2. Kameo Principal (21)</label>
            <select id="synMkKameoASelect">${mk1.kameos.map((k) => `<option value="${k.id}">${k.name} (${k.hpBonus})</option>`).join("")}</select>
          </div>
          <div class="date-filter-group" style="flex:1;min-width:190px;">
            <label for="synMkKameoBSelect">3. Comparar / Sinergia con Kameo B</label>
            <select id="synMkKameoBSelect">${mk1.kameos.map((k) => `<option value="${k.id}">${k.name} (${k.hpBonus})</option>`).join("")}</select>
          </div>
        </div>
      </div>
      <div id="mk1SynergyResults"></div>
    `;

    const selMain = document.getElementById("synMkMainSelect");
    const selKA = document.getElementById("synMkKameoASelect");
    const selKB = document.getElementById("synMkKameoBSelect");
    if (selKB.options.length > 1) selKB.selectedIndex = 16; // Khameleon por defecto

    const renderMkSyn = () => {
      const mChar = mk1.characters.find((c) => c.id === selMain.value) || mk1.characters[0];
      const k1 = mk1.kameos.find((k) => k.id === selKA.value) || mk1.kameos[0];
      const k2 = mk1.kameos.find((k) => k.id === selKB.value) || mk1.kameos[1];
      const eval1 = evaluateMk1MainKameoPair(mChar, k1);
      const eval2 = evaluateMk1MainKameoPair(mChar, k2);
      const resEl = document.getElementById("mk1SynergyResults");
      if (!resEl) return;

      const cardHTML = (label, k, ev) => `
        <div class="synergy-card">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
            <div class="portrait-img-box" style="width:54px;height:54px;flex-shrink:0;">
              <img src="${k.iconUrl}" alt="${k.name}" referrerpolicy="no-referrer" />
            </div>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                <span style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;">${label}</span>
                <span class="synergy-tier-pill ${ev.score.includes("S") ? "tier-splus" : ""}">Sinergia ${ev.score}</span>
              </div>
              <strong style="font-size:1.05rem;color:#fff;">${mChar.name} + ${k.name}</strong>
              <div style="font-size:0.74rem;color:#fbbf24;">${ev.tag} • Vida Total: ${ev.totalHp} HP (${k.hpBonus})</div>
            </div>
          </div>
          <div style="font-size:0.82rem;color:#cbd5e1;margin-bottom:8px;">${ev.reason}</div>
          <div class="combo-box" style="margin:0;padding:8px 10px;">
            <div style="font-size:0.7rem;color:#94a3b8;">Ruta / Uso Recomendado:</div>
            <div class="combo-string" style="font-size:0.8rem;">${ev.route}</div>
          </div>
        </div>
      `;

      resEl.innerHTML = `
        <div class="synergy-compare-grid">
          ${cardHTML("Kameo Primario", k1, eval1)}
          ${cardHTML("Kameo Alternativo", k2, eval2)}
        </div>
        ${compareTwoKameos(k1, k2)}
      `;
    };

    selMain.addEventListener("change", renderMkSyn);
    selKA.addEventListener("change", renderMkSyn);
    selKB.addEventListener("change", renderMkSyn);
    container._renderMkSyn = renderMkSyn;
  }

  if (preselectOpts.mkMainId) {
    const selMain = document.getElementById("synMkMainSelect");
    if (selMain) selMain.value = preselectOpts.mkMainId;
  }
  if (preselectOpts.mkKameoId) {
    const selKA = document.getElementById("synMkKameoASelect");
    if (selKA) selKA.value = preselectOpts.mkKameoId;
  }
  if (typeof container._renderMkSyn === "function") {
    container._renderMkSyn();
  }
}

function scoreDbfzOrderPermutation(chars) {
  // chars = [pointChar, midChar, anchorChar]
  let score = 0;
  const slotNames = ["Point", "Mid", "Anchor"];
  chars.forEach((c, idx) => {
    const pos = c.dbfzPosition;
    if (!pos) return;
    const slot = slotNames[idx];
    if (pos.primaryPos === slot) score += 5;
    else if ((pos.viablePositions || []).includes(slot)) score += 2;
    else score -= 3;

    if (idx === 2 && String(pos.limitBreakRating || "").startsWith("S")) score += 4;
    if (idx === 0 && String(pos.meterNeed || "").includes("Generador")) score += 3;
    if (idx === 0 && String(pos.meterNeed || "").includes("Alta")) score -= 2;
  });
  return score;
}

function getBestDbfzPermutation(threeChars) {
  const perms = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0]
  ];
  let bestPerm = [0, 1, 2];
  let bestScore = -999;
  perms.forEach((p) => {
    const sc = scoreDbfzOrderPermutation([threeChars[p[0]], threeChars[p[1]], threeChars[p[2]]]);
    if (sc > bestScore) {
      bestScore = sc;
      bestPerm = p;
    }
  });
  return { bestPerm, bestScore };
}

function initDbfzTeamBuilder(preselectOpts = {}) {
  const container = document.getElementById("dbfzTeamBuilderContainer");
  if (!container) return;
  const dbfz = state.games.find((g) => g.id === "dbfz");
  if (!dbfz || !dbfz.characters?.length) return;

  if (!container.dataset.built) {
    container.dataset.built = "1";
    const charOpts = dbfz.characters
      .map((c) => {
        const pos = c.dbfzPosition ? ` (${c.dbfzPosition.primaryPos})` : "";
        return `<option value="${c.id}">${c.name}${pos}</option>`;
      })
      .join("");

    const metaPills = (dbfz.metaTeams || [])
      .map(
        (mt, idx) =>
          `<button class="btn-chip" data-loadmetateam="${idx}">${mt.title}</button>`
      )
      .join("");

    container.innerHTML = `
      <div style="margin-bottom:14px;">
        <span style="font-size:0.75rem;color:#fbbf24;font-weight:700;display:block;margin-bottom:6px;">
          Equipos Meta Pre-armados (1 clic para cargar y analizar):
        </span>
        <div class="combo-filter-pills">${metaPills}</div>
      </div>

      <div class="dbfz-team-slots-grid">
        <div class="dbfz-slot-card">
          <div class="dbfz-slot-header">
            <span class="dbfz-role-pill dbfz-role-point">1. POINT (Punta)</span>
            <span style="font-size:0.72rem;color:#94a3b8;">Abre ronda • 0 barras</span>
          </div>
          <select id="dbfzSlot0Select" class="search-input" style="padding:8px 10px;">${charOpts}</select>
          <div class="assist-chip-row" data-assist-slot="0">
            <button type="button" class="assist-chip assist-A active" data-assist="A">Assist A</button>
            <button type="button" class="assist-chip assist-B" data-assist="B">Assist B</button>
            <button type="button" class="assist-chip assist-C" data-assist="C">Assist C</button>
          </div>
          <div id="dbfzSlot0Info" style="margin-top:10px;font-size:0.79rem;"></div>
        </div>

        <div class="dbfz-slot-card">
          <div class="dbfz-slot-header">
            <span class="dbfz-role-pill dbfz-role-mid">2. MID (Medio)</span>
            <span style="font-size:0.72rem;color:#94a3b8;">Soporte / Special Tag</span>
          </div>
          <select id="dbfzSlot1Select" class="search-input" style="padding:8px 10px;">${charOpts}</select>
          <div class="assist-chip-row" data-assist-slot="1">
            <button type="button" class="assist-chip assist-A active" data-assist="A">Assist A</button>
            <button type="button" class="assist-chip assist-B" data-assist="B">Assist B</button>
            <button type="button" class="assist-chip assist-C" data-assist="C">Assist C</button>
          </div>
          <div id="dbfzSlot1Info" style="margin-top:10px;font-size:0.79rem;"></div>
        </div>

        <div class="dbfz-slot-card">
          <div class="dbfz-slot-header">
            <span class="dbfz-role-pill dbfz-role-anchor">3. ANCHOR (Ancla)</span>
            <span style="font-size:0.72rem;color:#94a3b8;">Limit Break • 1v3</span>
          </div>
          <select id="dbfzSlot2Select" class="search-input" style="padding:8px 10px;">${charOpts}</select>
          <div class="assist-chip-row" data-assist-slot="2">
            <button type="button" class="assist-chip assist-A active" data-assist="A">Assist A</button>
            <button type="button" class="assist-chip assist-B" data-assist="B">Assist B</button>
            <button type="button" class="assist-chip assist-C" data-assist="C">Assist C</button>
          </div>
          <div id="dbfzSlot2Info" style="margin-top:10px;font-size:0.79rem;"></div>
        </div>
      </div>

      <div id="dbfzTeamAnalysisBox"></div>
    `;

    const sel0 = document.getElementById("dbfzSlot0Select");
    const sel1 = document.getElementById("dbfzSlot1Select");
    const sel2 = document.getElementById("dbfzSlot2Select");
    const assistChoices = ["B", "A", "A"];

    const findCharByName = (nm) => dbfz.characters.find((c) => c.name === nm);
    // Cargar equipo meta inicial (Gogeta SS4 / Android 17 / Base Goku)
    const defTeam = dbfz.metaTeams?.[0];
    if (defTeam) {
      const c0 = findCharByName(defTeam.point.name);
      const c1 = findCharByName(defTeam.mid.name);
      const c2 = findCharByName(defTeam.anchor.name);
      if (c0) sel0.value = c0.id;
      if (c1) sel1.value = c1.id;
      if (c2) sel2.value = c2.id;
      assistChoices[0] = defTeam.point.assist;
      assistChoices[1] = defTeam.mid.assist;
      assistChoices[2] = defTeam.anchor.assist;
    }

    const syncAssistBtns = () => {
      [0, 1, 2].forEach((slotIdx) => {
        const row = container.querySelector(`[data-assist-slot="${slotIdx}"]`);
        if (!row) return;
        row.querySelectorAll(".assist-chip").forEach((b) => {
          b.classList.toggle("active", b.dataset.assist === assistChoices[slotIdx]);
        });
      });
    };

    const renderTeam = () => {
      syncAssistBtns();
      const picks = [
        dbfz.characters.find((c) => c.id === sel0.value) || dbfz.characters[0],
        dbfz.characters.find((c) => c.id === sel1.value) || dbfz.characters[1],
        dbfz.characters.find((c) => c.id === sel2.value) || dbfz.characters[2]
      ];
      const slotLabels = ["Point", "Mid", "Anchor"];

      picks.forEach((ch, idx) => {
        const infoEl = document.getElementById(`dbfzSlot${idx}Info`);
        if (!infoEl) return;
        const pos = ch.dbfzPosition || { primaryPos: "Mid", viablePositions: ["Point", "Mid"], bestAssist: "A", assists: {}, positioningReason: "" };
        const chosenAssist = assistChoices[idx];
        const assistObj = pos.assists?.[chosenAssist] || { name: `Assist ${chosenAssist}`, type: "Estándar", blockstun: "28f", notes: "" };
        const roleWanted = slotLabels[idx];

        let fitBadge = `<span style="color:#f87171;">⚠ Recomendado en ${pos.primaryPos}</span>`;
        if (pos.primaryPos === roleWanted) fitBadge = `<span style="color:#34d399;">✓ Posición Óptima (${roleWanted})</span>`;
        else if ((pos.viablePositions || []).includes(roleWanted)) fitBadge = `<span style="color:#fbbf24;">⚡ Viable en ${roleWanted} (Ideal: ${pos.primaryPos})</span>`;

        infoEl.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div class="portrait-img-box" style="width:48px;height:48px;flex-shrink:0;">
              <img src="${ch.iconUrl}" alt="${ch.name}" referrerpolicy="no-referrer" />
            </div>
            <div>
              <div style="font-weight:700;color:#fff;">${ch.name}</div>
              <div>${fitBadge}</div>
              <div style="font-size:0.7rem;color:#94a3b8;">Limit Break: ${pos.limitBreakRating || "A"} • Barra: ${pos.meterNeed || "Media"}</div>
            </div>
          </div>
          <div class="dbfz-assist-box ${pos.bestAssist === chosenAssist ? "is-recommended" : ""}">
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;">
              <strong style="color:#fbbf24;">Assist ${chosenAssist}: ${assistObj.name}</strong>
              <span style="color:#94a3b8;">${assistObj.blockstun || ""}</span>
            </div>
            <div style="font-size:0.72rem;color:#cbd5e1;margin-top:3px;">${assistObj.type} — ${assistObj.notes}</div>
          </div>
        `;
      });

      const currentScore = scoreDbfzOrderPermutation(picks);
      const { bestPerm, bestScore } = getBestDbfzPermutation(picks);
      const needsReorder = bestScore > currentScore && (bestPerm[0] !== 0 || bestPerm[1] !== 1 || bestPerm[2] !== 2);
      const optimalNames = bestPerm.map((i) => picks[i].name);

      // Cobertura táctica del equipo
      const assistInfos = picks.map((c, i) => c.dbfzPosition?.assists?.[assistChoices[i]] || {});
      const allTypesStr = assistInfos.map((a) => `${a.type || ""} ${a.notes || ""}`).join(" ").toLowerCase();
      const hasBeam = allTypesStr.includes("beam") || allTypesStr.includes("proyectil") || allTypesStr.includes("ki");
      const hasLockdown = allTypesStr.includes("lockdown") || allTypesStr.includes("blockstun") || allTypesStr.includes("parálisis");
      const hasDefense = allTypesStr.includes("dp") || allTypesStr.includes("invencible") || allTypesStr.includes("escudo");
      const hasDuplicate = new Set(picks.map((p) => p.id)).size < 3;

      const anchorPos = picks[2].dbfzPosition || {};
      const box = document.getElementById("dbfzTeamAnalysisBox");
      if (!box) return;

      box.innerHTML = `
        <div class="guide-section-item" style="margin-top:0;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:8px;">
            <h4 style="margin:0;">Análisis de Sinergia y Posicionamiento del Equipo 3v3</h4>
            <span class="synergy-tier-pill ${!needsReorder && !hasDuplicate ? "tier-splus" : ""}">
              ${hasDuplicate ? "⚠ Luchadores Duplicados" : needsReorder ? "🔄 Se puede optimizar el orden" : "✓ Orden de Posiciones Óptimo"}
            </span>
          </div>

          ${
            needsReorder
              ? `<div style="background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.45);padding:10px 12px;border-radius:6px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                  <div style="font-size:0.83rem;color:#fde68a;">
                    <strong>Consejo de Posicionamiento:</strong> Rendirían mejor ordenados como:
                    <strong>Point:</strong> ${optimalNames[0]} • <strong>Mid:</strong> ${optimalNames[1]} • <strong>Anchor:</strong> ${optimalNames[2]}
                  </div>
                  <button type="button" class="btn btn-primary" id="btnApplyBestDbfzOrder" style="padding:5px 12px;font-size:0.72rem;">Aplicar Orden Recomendado</button>
                </div>`
              : ""
          }

          <div class="roster-split-pills" style="margin-bottom:10px;">
            <span class="pill-base">${hasBeam ? "✅ Control Neutro / Beam o Ki" : "⚠ Falta Beam o Ki en Asistencias"}</span>
            <span class="pill-base">${hasLockdown ? "✅ Mix-up 50/50 / Blockstun Largo" : "ℹ Blockstun estándar (sin Lockdown pesado)"}</span>
            <span class="pill-base">${hasDefense ? "✅ Cobertura Defensiva (DP / Barrera)" : "ℹ Sin Asistencia DP/Invencible"}</span>
            <span class="pill-base">Limit Break Anchor: ${anchorPos.limitBreakRating || "A"}</span>
          </div>

          <p style="font-size:0.82rem;color:#cbd5e1;margin:0;">
            <strong>Por qué funciona este orden:</strong>
            <br />• <strong>Point (${picks[0].name}):</strong> ${picks[0].dbfzPosition?.positioningReason || ""}
            <br />• <strong>Mid (${picks[1].name}):</strong> ${picks[1].dbfzPosition?.positioningReason || ""}
            <br />• <strong>Anchor (${picks[2].name}):</strong> ${picks[2].dbfzPosition?.positioningReason || ""}
          </p>
        </div>
      `;

      const applyBtn = document.getElementById("btnApplyBestDbfzOrder");
      if (applyBtn) {
        applyBtn.onclick = () => {
          const oldPicks = [...picks];
          const oldAssists = [...assistChoices];
          sel0.value = oldPicks[bestPerm[0]].id;
          sel1.value = oldPicks[bestPerm[1]].id;
          sel2.value = oldPicks[bestPerm[2]].id;
          assistChoices[0] = oldAssists[bestPerm[0]];
          assistChoices[1] = oldAssists[bestPerm[1]];
          assistChoices[2] = oldAssists[bestPerm[2]];
          renderTeam();
        };
      }
    };

    [sel0, sel1, sel2].forEach((s) => s.addEventListener("change", renderTeam));
    container.querySelectorAll("[data-assist-slot]").forEach((row) => {
      const idx = Number(row.dataset.assistSlot);
      row.querySelectorAll(".assist-chip").forEach((btn) => {
        btn.onclick = () => {
          assistChoices[idx] = btn.dataset.assist;
          renderTeam();
        };
      });
    });

    container.querySelectorAll("[data-loadmetateam]").forEach((btn) => {
      btn.onclick = () => {
        const mt = dbfz.metaTeams?.[Number(btn.dataset.loadmetateam)];
        if (!mt) return;
        const c0 = findCharByName(mt.point.name);
        const c1 = findCharByName(mt.mid.name);
        const c2 = findCharByName(mt.anchor.name);
        if (c0) sel0.value = c0.id;
        if (c1) sel1.value = c1.id;
        if (c2) sel2.value = c2.id;
        assistChoices[0] = mt.point.assist;
        assistChoices[1] = mt.mid.assist;
        assistChoices[2] = mt.anchor.assist;
        renderTeam();
      };
    });

    container._setDbfzCharacter = (charId, slotIndex = 0) => {
      const ch = dbfz.characters.find((c) => c.id === charId);
      if (!ch) return;
      const targetPos = ch.dbfzPosition?.primaryPos;
      const sIdx = targetPos === "Point" ? 0 : targetPos === "Mid" ? 1 : targetPos === "Anchor" ? 2 : slotIndex;
      const sel = [sel0, sel1, sel2][sIdx];
      if (sel) sel.value = ch.id;
      if (ch.dbfzPosition?.bestAssist) assistChoices[sIdx] = ch.dbfzPosition.bestAssist;
      renderTeam();
    };
    container._renderTeam = renderTeam;
  }

  if (preselectOpts.dbfzCharId && typeof container._setDbfzCharacter === "function") {
    container._setDbfzCharacter(preselectOpts.dbfzCharId);
  } else if (typeof container._renderTeam === "function") {
    container._renderTeam();
  }
}

function bindProfileBackupControls() {
  const expBtn = document.getElementById("btnExportProfileJson");
  if (expBtn) {
    expBtn.onclick = () => {
      const payload = loadTrainingProfileData();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fgc_vault_mains_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
  }
  const impInp = document.getElementById("inpImportProfileJson");
  if (impInp) {
    impInp.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || "{}"));
          if (parsed && Array.isArray(parsed.mains)) {
            saveTrainingProfileData({
              mains: parsed.mains,
              notesByChar: parsed.notesByChar || {},
              drillsByChar: parsed.drillsByChar || {}
            });
            window.initTrainingProfile();
          }
        } catch (_) {}
      };
      reader.readAsText(file);
    };
  }
}

// Re-bind backup controls even when mains > 0
const _origInitTrainingProfile = window.initTrainingProfile;
window.initTrainingProfile = function () {
  _origInitTrainingProfile();
  bindProfileBackupControls();
};

// =========================================================================
// H. MINIJUEGO INTERACTIVO DE FRAME DATA ("¿SEGURO O CASTIGABLE?")
// =========================================================================
const FRAME_QUIZ_RECORD_KEY = "fgc_vault_frame_quiz_best_v1";
const frameQuizState = {
  gameId: "sf6",
  streak: 0,
  best: Number(localStorage.getItem(FRAME_QUIZ_RECORD_KEY) || 0),
  totalAnswered: 0,
  correct: 0,
  currentItem: null,
  answered: false
};

window.initFrameQuizGame = async function () {
  const container = document.getElementById("frameQuizContainer");
  if (!container || typeof state === "undefined" || !state.games.length) return;

  if (!container.dataset.built) {
    container.dataset.built = "1";
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
        <div class="date-filter-group" style="min-width:220px;">
          <label for="fquizGameSelect">Juego para entrenar:</label>
          <select id="fquizGameSelect">${state.games.map((g) => `<option value="${g.id}" ${g.id === "sf6" ? "selected" : ""}>${g.title}</option>`).join("")}</select>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;font-family:var(--font-mono);font-size:0.8rem;">
          <span class="pill-base" id="fqStreakPill">🔥 Racha: 0</span>
          <span class="pill-base" id="fqBestPill">🏆 Récord: ${frameQuizState.best}</span>
          <span class="pill-base" id="fqAccPill">✓ Aciertos: 0/0</span>
        </div>
      </div>
      <div id="frameQuizStage"></div>
    `;

    const gSel = document.getElementById("fquizGameSelect");
    gSel.addEventListener("change", () => {
      frameQuizState.gameId = gSel.value;
      loadNextFrameQuizQuestion();
    });
  }

  await loadNextFrameQuizQuestion();
};

async function loadNextFrameQuizQuestion() {
  const stage = document.getElementById("frameQuizStage");
  if (!stage) return;
  let game = state.games.find((g) => g.id === frameQuizState.gameId) || state.games[0];
  if (game && typeof window.ensureFullGameLoaded === "function") {
    game = (await window.ensureFullGameLoaded(game.id)) || game;
  }

  const pool = [];
  (game.characters || []).forEach((c) => {
    (c.frameDataCards || []).forEach((m) => {
      const ob = extractOnBlockNumber(m.onBlock);
      if (ob !== null && ob >= -35 && ob <= 15 && !String(m.onBlock || "").toLowerCase().includes("unblockable")) {
        pool.push({ char: c, move: m, onBlockNum: ob, game });
      }
    });
  });

  if (pool.length === 0) {
    stage.innerHTML = `<p style="color:#94a3b8;">No hay movimientos compatibles en este juego todavía.</p>`;
    return;
  }

  const pick = pool[Math.floor(Math.random() * pool.length)];
  frameQuizState.currentItem = pick;
  frameQuizState.answered = false;

  const cmd = typeof translateNotation === "function" ? translateNotation(pick.move.input, game.sagaId, state.notationMode) : pick.move.input;
  const answerCat = pick.onBlockNum >= -4 ? "safe" : pick.onBlockNum >= -9 ? "light" : "launch";

  stage.innerHTML = `
    <div class="guide-section-item" style="margin-top:0;padding:20px;">
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px;">
        <div class="portrait-img-box" style="width:64px;height:64px;flex-shrink:0;">
          <img src="${pick.char.iconUrl}" alt="${pick.char.name}" referrerpolicy="no-referrer" />
        </div>
        <div>
          <span class="diff-badge">${game.title}</span>
          <h4 style="margin:4px 0 2px;font-size:1.25rem;color:#fff;">${pick.char.name} — ${pick.move.moveName}</h4>
          <div><span class="code-input-pill">${cmd}</span> <span style="font-family:var(--font-mono);font-size:0.78rem;color:#94a3b8;">Startup: ${pick.move.startup}</span></div>
        </div>
      </div>

      <p style="font-size:0.9rem;color:#e2e8f0;margin-bottom:14px;">
        Acabas de bloquear este ataque. ¿Cuál es la respuesta correcta sin regalar tu turno?
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-bottom:14px;">
        <button type="button" class="quiz-option-btn" data-fqchoice="safe">
          <span class="quiz-opt-letter">A</span>
          <span>🛡 Seguro / Positivo (+ o -1 a -4)</span>
        </button>
        <button type="button" class="quiz-option-btn" data-fqchoice="light">
          <span class="quiz-opt-letter">B</span>
          <span>👊 Castigo Rápido (-5 a -9)</span>
        </button>
        <button type="button" class="quiz-option-btn" data-fqchoice="launch">
          <span class="quiz-opt-letter">C</span>
          <span>💥 ¡Castigo Fuerte / Combo! (-10 o peor)</span>
        </button>
      </div>

      <div id="fqFeedbackBox"></div>
    </div>
  `;

  stage.querySelectorAll("[data-fqchoice]").forEach((btn) => {
    btn.onclick = () => {
      if (frameQuizState.answered) return;
      frameQuizState.answered = true;
      frameQuizState.totalAnswered++;
      const chosen = btn.dataset.fqchoice;
      const ok = chosen === answerCat;

      if (ok) {
        frameQuizState.correct++;
        frameQuizState.streak++;
        if (frameQuizState.streak > frameQuizState.best) {
          frameQuizState.best = frameQuizState.streak;
          try { localStorage.setItem(FRAME_QUIZ_RECORD_KEY, String(frameQuizState.best)); } catch (_) {}
        }
      } else {
        frameQuizState.streak = 0;
      }

      document.getElementById("fqStreakPill").textContent = `🔥 Racha: ${frameQuizState.streak}`;
      document.getElementById("fqBestPill").textContent = `🏆 Récord: ${frameQuizState.best}`;
      document.getElementById("fqAccPill").textContent = `✓ Aciertos: ${frameQuizState.correct}/${frameQuizState.totalAnswered}`;

      const exactLabel =
        answerCat === "safe"
          ? "SEGURO / POSITIVO en bloqueo (bloqueando normal no se castiga)"
          : answerCat === "light"
            ? "CASTIGABLE LIGERO (puedes castigar con ataques rápidos de 5f–9f)"
            : "ALTAMENTE INSEGURO (castígalo siempre con tu combo más pesado / lanzador)";

      document.getElementById("fqFeedbackBox").innerHTML = `
        <div style="padding:12px 14px;border-radius:8px;background:${ok ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"};border:1px solid ${ok ? "#10b981" : "#ef4444"};display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <strong style="color:${ok ? "#34d399" : "#fca5a5"};">${ok ? "✅ ¡Correcto!" : "❌ Fallaste"} — ${pick.move.onBlock}</strong>
            <div style="font-size:0.82rem;color:#e2e8f0;margin-top:3px;">Es <strong>${exactLabel}</strong>.</div>
          </div>
          <button type="button" class="btn btn-primary" id="btnNextFrameQuiz">Siguiente Ataque ➔</button>
        </div>
      `;
      document.getElementById("btnNextFrameQuiz")?.addEventListener("click", loadNextFrameQuizQuestion);
    };
  });
}
