require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const store = require("./src/db/store");
const telegramBot = require("./src/bot/telegramBot");
const youtubeManager = require("./src/youtube/youtubeManager");
const { resolveCharacterPortraitUrl } = require("./src/utils/portraitResolver");
const { resolveCharacterHitboxes } = require("./src/utils/hitboxResolver");
const { FGC_EVENTS, CURATED_FGC_NEWS, getFgcNews, getFgcEvents } = require("./src/data/fgcNews");

const app = express();
const PORT = process.env.PORT || 3000;
const PRIVATE_OWNER_KEY = (process.env.ADMIN_SECRET_KEY || process.env.TELEGRAM_ADMIN_CHAT_ID || "9297971350").trim();

// Almacén en memoria de códigos temporales OTP enviados al Telegram privado del propietario y sesiones activas
let currentOwnerOtp = null;
let currentOwnerOtpExpires = 0;
const activeAdminSessions = new Set();

app.use(cors());
app.use(express.json());
app.use(
  "/animaciones-personajes",
  express.static(path.join(__dirname, "animaciones-personajes"), {
    maxAge: "7d"
  })
);
app.use(
  express.static(path.join(__dirname, "public"), {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    }
  })
);

function isValidAdminSession(tokenOrKey) {
  const clean = String(tokenOrKey || "").trim();
  if (!clean) return false;
  if (clean === PRIVATE_OWNER_KEY) return true;
  if (activeAdminSessions.has(clean)) return true;
  return false;
}

function requirePrivateOwner(req, res, next) {
  const clientKey = (req.headers["x-admin-key"] || req.body.adminKey || "").trim();
  if (!isValidAdminSession(clientKey)) {
    return res.status(403).json({
      error: "Acceso denegado: Panel en Modo Privado. Solicita un código temporal desde tu bot privado de Telegram."
    });
  }
  next();
}

// =========================================================================
// GENERADOR DE ICONOS DE PERSONAJES (RETRATO DE LUCHADOR PERSONALIZADO)
// =========================================================================
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

app.get("/api/char-icon", async (req, res) => {
  const name = String(req.query.name || "Fighter");
  const game = String(req.query.game || "fgc");
  const border = String(req.query.border || "f59e0b").replace(/[^a-fA-F0-9]/g, "") || "f59e0b";

  // 1. Intentar obtener el retrato oficial real del personaje (SuperCombo, Dustloop, Wavu, SmashBros, MK)
  try {
    const realPortraitUrl = await resolveCharacterPortraitUrl(game, name);
    if (realPortraitUrl) {
      const imgRes = await fetch(realPortraitUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
        }
      });
      if (imgRes.ok) {
        const contentType = imgRes.headers.get("content-type") || "image/png";
        const arrayBuf = await imgRes.arrayBuffer();
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=3600");
        return res.send(Buffer.from(arrayBuf));
      }
    }
  } catch (_) {
    // Si falla la red externa, cae al retrato SVG de respaldo
  }

  // 2. Respaldo visual SVG (sin caché para que reintente cargar la foto real)
  const h = hashString(`${game}:${name}`);

  // Paleta de retrato única por personaje
  const palettes = [
    ["#f59e0b", "#78350f"],
    ["#38bdf8", "#0c4a6e"],
    ["#ef4444", "#7f1d1d"],
    ["#a855f7", "#3b0764"],
    ["#10b981", "#064e3b"],
    ["#ec4899", "#831843"],
    ["#eab308", "#713f12"],
    ["#6366f1", "#1e1b4b"]
  ];
  const [primary, secondary] = palettes[h % palettes.length];
  const eyeColor = h % 3 === 0 ? "#fef08a" : h % 3 === 1 ? "#7dd3fc" : "#fca5a5";
  const hasMask = game === "mk1" || h % 2 === 0;
  const label = name.replace(/\(.*?\)/g, "").trim().slice(0, 11).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${secondary}"/>
        <stop offset="100%" stop-color="#090d16"/>
      </linearGradient>
      <linearGradient id="armorGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${primary}"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <!-- Fondo y marco del icono -->
    <rect x="2" y="2" width="92" height="92" rx="16" fill="url(#bgGrad)" stroke="#${border}" stroke-width="3"/>
    <!-- Aura energética de fondo -->
    <circle cx="48" cy="42" r="28" fill="${primary}" opacity="0.18"/>
    <!-- Hombros / Gi / Armadura de combate -->
    <path d="M16 86 C18 64, 32 58, 48 58 C64 58, 78 64, 80 86 Z" fill="url(#armorGrad)" stroke="#0f172a" stroke-width="2"/>
    <path d="M34 58 L48 74 L62 58" fill="none" stroke="${primary}" stroke-width="3"/>
    <!-- Cabeza / Silueta de luchador -->
    <path d="M33 34 C33 21, 63 21, 63 34 C63 48, 56 55, 48 55 C40 55, 33 48, 33 34 Z" fill="#1e293b" stroke="${primary}" stroke-width="2"/>
    <!-- Cinta / Cowl / Pelo estilizado -->
    <path d="M31 29 L65 29 L62 21 L48 17 L34 21 Z" fill="${primary}"/>
    ${
      hasMask
        ? `<path d="M34 40 L48 44 L62 40 L59 53 L48 56 L37 53 Z" fill="${primary}" opacity="0.9"/>
           <line x1="40" y1="46" x2="56" y2="46" stroke="#090d16" stroke-width="2"/>`
        : `<path d="M42 46 Q48 49 54 46" fill="none" stroke="#94a3b8" stroke-width="2"/>`
    }
    <!-- Ojos de luchador -->
    <polygon points="37,35 45,37 44,39 36,38" fill="${eyeColor}"/>
    <polygon points="59,35 51,37 52,39 60,38" fill="${eyeColor}"/>
    <!-- Etiqueta inferior con nombre -->
    <rect x="6" y="75" width="84" height="15" rx="5" fill="#090d16" opacity="0.9"/>
    <text x="48" y="85.5" text-anchor="middle" fill="#f8fafc" font-family="Arial, sans-serif" font-weight="bold" font-size="8.5" letter-spacing="0.5">${label}</text>
  </svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-store");
  res.send(svg);
});

// =========================================================================
// GENERADOR DE ANIMACIONES DE HITBOX EN TIEMPO REAL (ESTILO ULTIMATEFRAMEDATA)
// Muestra la silueta del luchador en movimiento, Hurtbox (amarillo/azul) y
// Hitboxes activas (esferas rosas/rojas translúcidas) en bucle continuo.
// =========================================================================
app.get("/api/hitbox-anim", (req, res) => {
  const type = String(req.query.type || "jab").toLowerCase();
  const move = String(req.query.move || "Attack").slice(0, 22);
  const startup = String(req.query.startup || "5f");
  const active = String(req.query.active || "5-7");

  // Posición y forma de la hitbox según el tipo de ataque
  let hitboxShape = `<circle class="hb-active" cx="150" cy="68" r="22" /><circle class="hb-active-inner" cx="128" cy="70" r="15" />`;
  let limbPath = `<line class="limb-atk" x1="92" y1="68" x2="152" y2="66" stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" />`;

  if (type.includes("low") || type.includes("dtilt") || type.includes("sweep") || type.includes("2mk") || type.includes("2d")) {
    hitboxShape = `<ellipse class="hb-active" cx="152" cy="112" rx="30" ry="14" /><circle class="hb-active-inner" cx="126" cy="110" r="12" />`;
    limbPath = `<line class="limb-atk" x1="88" y1="95" x2="158" y2="114" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round" />`;
  } else if (type.includes("anti") || type.includes("up") || type.includes("uair") || type.includes("utilt") || type.includes("623") || type.includes("2h")) {
    hitboxShape = `<ellipse class="hb-active" cx="118" cy="34" rx="26" ry="22" /><circle class="hb-active-inner" cx="106" cy="52" r="15" />`;
    limbPath = `<line class="limb-atk" x1="90" y1="66" x2="122" y2="26" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round" />`;
  } else if (type.includes("proj") || type.includes("236") || type.includes("shot") || type.includes("beam")) {
    hitboxShape = `<circle class="hb-proj" cx="165" cy="68" r="20" /><ellipse class="hb-active-inner" cx="145" cy="68" rx="28" ry="12" />`;
    limbPath = `<line class="limb-atk" x1="92" y1="68" x2="125" y2="68" stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" />`;
  } else if (type.includes("throw") || type.includes("grab")) {
    hitboxShape = `<circle class="hb-grab" cx="132" cy="68" r="24" />`;
    limbPath = `<line class="limb-atk" x1="92" y1="66" x2="136" y2="66" stroke="#f59e0b" stroke-width="7" stroke-linecap="round" />`;
  } else if (type.includes("super") || type.includes("smash") || type.includes("heat") || type.includes("fatal")) {
    hitboxShape = `<circle class="hb-active" cx="154" cy="66" r="32" /><circle class="hb-active-inner" cx="126" cy="68" r="22" />`;
    limbPath = `<line class="limb-atk" x1="92" y1="68" x2="164" y2="64" stroke="#fbbf24" stroke-width="9" stroke-linecap="round" />`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 145" width="220" height="145">
    <style>
      .bg { fill: #262930; }
      .floor { stroke: #3f4451; stroke-width: 2; }
      .grid-line { stroke: #313540; stroke-width: 1; stroke-dasharray: 3 3; }
      .hurtbox { fill: rgba(56, 189, 248, 0.16); stroke: #38bdf8; stroke-width: 1.5; stroke-dasharray: 2 2; }
      .fighter-body { fill: #cbd5e1; opacity: 0.88; }
      .limb-atk {
        animation: strikeAnim 1.35s infinite ease-in-out;
        transform-origin: 85px 72px;
      }
      .hb-active {
        fill: rgba(236, 72, 153, 0.52);
        stroke: #f43f5e;
        stroke-width: 2;
        animation: hitboxPulse 1.35s infinite steps(1);
      }
      .hb-active-inner {
        fill: rgba(244, 63, 94, 0.62);
        stroke: #fda4af;
        stroke-width: 1.5;
        animation: hitboxPulse 1.35s infinite steps(1);
      }
      .hb-proj {
        fill: rgba(236, 72, 153, 0.6);
        stroke: #f43f5e;
        stroke-width: 2;
        animation: projMove 1.35s infinite linear;
      }
      .hb-grab {
        fill: rgba(168, 85, 247, 0.55);
        stroke: #d8b4fe;
        stroke-width: 2;
        animation: hitboxPulse 1.35s infinite steps(1);
      }
      @keyframes strikeAnim {
        0%, 22% { transform: rotate(-18deg) translateX(-4px); opacity: 0.65; }
        25%, 58% { transform: rotate(0deg) translateX(4px); opacity: 1; }
        60%, 100% { transform: rotate(8deg) translateX(0px); opacity: 0.7; }
      }
      @keyframes hitboxPulse {
        0%, 24% { opacity: 0; }
        25%, 56% { opacity: 1; }
        57%, 100% { opacity: 0; }
      }
      @keyframes projMove {
        0%, 24% { opacity: 0; transform: translateX(-35px); }
        25%, 70% { opacity: 1; transform: translateX(18px); }
        71%, 100% { opacity: 0; transform: translateX(35px); }
      }
    </style>
    <rect class="bg" width="220" height="145" />
    <line class="grid-line" x1="0" y1="45" x2="220" y2="45" />
    <line class="grid-line" x1="0" y1="85" x2="220" y2="85" />
    <line class="grid-line" x1="110" y1="0" x2="110" y2="124" />
    <line class="floor" x1="10" y1="124" x2="210" y2="124" />

    <!-- Hurtbox del personaje (Azul/Cian) -->
    <rect class="hurtbox" x="62" y="38" width="34" height="84" rx="12" />

    <!-- Silueta animada del luchador -->
    <circle class="fighter-body" cx="79" cy="48" r="10" />
    <path class="fighter-body" d="M68 60 L90 60 L88 94 L70 94 Z" />
    <line x1="73" y1="94" x2="64" y2="123" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
    <line x1="85" y1="94" x2="96" y2="123" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />

    <!-- Extremidad/Arma ejecutando el ataque -->
    ${limbPath}

    <!-- Esferas de Hitbox Activa (Rosa/Rojo translúcido estilo UltimateFrameData) -->
    ${hitboxShape}

    <!-- Indicador de Fase de Frames -->
    <rect x="6" y="6" width="208" height="16" rx="4" fill="rgba(9,13,22,0.75)" />
    <text x="12" y="17" fill="#fda4af" font-family="monospace" font-size="9.5" font-weight="bold">HITBOX: ${move} (Start ${startup} | Act ${active})</text>
  </svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(svg);
});

// =========================================================================
// RESOLUTOR DE HITBOXES REALES DESDE ULTIMATEFRAMEDATA, DUSTLOOP, SUPERCOMBO Y WAVU
// =========================================================================
app.get("/api/char-hitboxes", async (req, res) => {
  const gameId = String(req.query.gameId || "").trim();
  const charName = String(req.query.charName || "").trim();
  if (!gameId || !charName) {
    return res.json({ hitboxes: {} });
  }
  const hitboxes = await resolveCharacterHitboxes(gameId, charName);
  res.json({ hitboxes });
});

const charVideoCache = new Map();

app.get("/api/char-video", async (req, res) => {
  const gameTitle = String(req.query.gameTitle || "").trim();
  const charName = String(req.query.charName || "").trim();
  if (!gameTitle || !charName) return res.json({ embedUrl: null });

  const cacheKey = `${gameTitle}:${charName}`;
  if (charVideoCache.has(cacheKey)) {
    return res.json({ embedUrl: charVideoCache.get(cacheKey) });
  }

  try {
    const cleanChar = charName.replace(/\(.*?\)/g, "").trim();
    const query = `${cleanChar} ${gameTitle} guide combos`;
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const ytRes = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8"
      }
    });
    if (ytRes.ok) {
      const html = await ytRes.text();
      const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      if (match && match[1]) {
        const embedUrl = `https://www.youtube.com/embed/${match[1]}?cc_load_policy=1&cc_lang_pref=es&hl=es`;
        charVideoCache.set(cacheKey, embedUrl);
        return res.json({ embedUrl });
      }
    }
  } catch (_) {}

  return res.json({ embedUrl: null });
});

app.get("/api/hitbox-media", async (req, res) => {
  const targetUrl = String(req.query.url || "").trim();
  const allowedHosts = ["ultimateframedata.com", "www.dustloop.com", "wiki.supercombo.gg", "wavu.wiki", "static.wikia.nocookie.net"];
  try {
    const parsed = new URL(targetUrl);
    if (!allowedHosts.includes(parsed.hostname)) {
      return res.status(403).send("Host no permitido");
    }

    const baseName = path.basename(decodeURIComponent(parsed.pathname)).replace(/[^a-zA-Z0-9._-]/g, "_") || "media.bin";
    const safeHost = parsed.hostname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const cacheDir = path.join(__dirname, "animaciones-personajes", "_cache", safeHost);
    const cacheFile = path.join(cacheDir, baseName);

    if (fs.existsSync(cacheFile)) {
      res.setHeader("Cache-Control", "public, max-age=604800");
      return res.sendFile(cacheFile);
    }

    const extRes = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: `${parsed.protocol}//${parsed.hostname}/`
      }
    });
    if (!extRes.ok) {
      return res.status(extRes.status).send("No disponible");
    }
    const contentType = extRes.headers.get("content-type") || "image/gif";
    const buf = Buffer.from(await extRes.arrayBuffer());

    try {
      fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(cacheFile, buf);
    } catch (_) {}

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=604800");
    return res.send(buf);
  } catch (_) {
    return res.status(400).send("URL inválida");
  }
});

// =========================================================================
// HEALTH CHECK (Para Render.com)
// =========================================================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "FGC Vault - Fighting Games Encyclopedia",
    privateMode: true,
    botConfigured: telegramBot.isConfigured(),
    botUsername: telegramBot.botUsername || "@Clayfacefightbot"
  });
});

// =========================================================================
// ENDPOINTS DE SAGAS, JUEGOS, PERSONAJES Y CANAL DE YOUTUBE
// =========================================================================
app.get("/api/bootstrap", (req, res) => {
  const clientKey = (req.headers["x-admin-key"] || "").trim();
  const isOwnerUnlocked = isValidAdminSession(clientKey);
  const customNews = store.getCustomNews();
  const useLite = req.query.lite === "1";

  res.json({
    youtubeChannel: store.state.youtubeChannel,
    events: [...store.getCustomEvents(), ...FGC_EVENTS],
    news: [...customNews, ...CURATED_FGC_NEWS],
    communityResources: store.getCommunityResources(),
    missingContentRoadmap: store.getMissingContentRoadmap(),
    sagas: store.getSagas(),
    games: useLite ? store.getGamesLite() : store.getGames()
  });
});

app.get("/api/character-details", (req, res) => {
  const gameId = String(req.query.gameId || "").trim();
  const charId = String(req.query.charId || "").trim();
  const game = store.getGameById(gameId);
  if (!game) return res.status(404).json({ error: "Juego no encontrado" });
  const character = (game.characters || []).find((c) => c.id === charId);
  if (!character) return res.status(404).json({ error: "Personaje no encontrado" });
  res.json({ gameId, character });
});

app.get("/api/news", async (req, res) => {
  const [allNews, allEvents] = await Promise.all([getFgcNews(), getFgcEvents()]);
  const customNews = store.getCustomNews();
  res.json({
    news: [...customNews, ...allNews],
    events: [...store.getCustomEvents(), ...allEvents]
  });
});

app.get("/api/youtube-channel", async (req, res) => {
  const latestVideos = await youtubeManager.fetchLatestChannelVideos();
  res.json({
    youtubeChannel: store.state.youtubeChannel,
    latestVideos,
    apiConnected: youtubeManager.isApiConnected()
  });
});

app.post("/api/community-resources", async (req, res) => {
  const { category, targetGame, title, url, description, missingNotes, author } = req.body;
  if (!title || !targetGame) {
    return res.status(400).json({ error: "Indica al menos el nombre del recurso y el juego/saga al que corresponde." });
  }
  const created = store.addCommunityResource({
    category,
    targetGame,
    title,
    url,
    description,
    missingNotes,
    author
  });
  await telegramBot.notifyNewCommunityResource(created);
  res.status(201).json({
    resource: created,
    communityResources: store.getCommunityResources(),
    missingContentRoadmap: store.getMissingContentRoadmap()
  });
});

app.post("/api/bot/request-otp", async (req, res) => {
  if (!telegramBot.adminChatId) {
    return res.status(400).json({
      error: "Primero abre Telegram, busca @Clayfacefightbot y envíale /start para vincular tu cuenta como propietario único."
    });
  }
  currentOwnerOtp = String(Math.floor(100000 + Math.random() * 900000));
  currentOwnerOtpExpires = Date.now() + 10 * 60 * 1000;
  const sent = await telegramBot.sendOwnerOtpCode(currentOwnerOtp);
  if (!sent) {
    return res.status(500).json({ error: "No se pudo enviar el código a Telegram. Comprueba TELEGRAM_BOT_TOKEN." });
  }
  res.json({ message: "Código temporal de 6 dígitos enviado a tu chat privado con @Clayfacefightbot." });
});

app.post("/api/bot/unlock", (req, res) => {
  const input = String(req.body.adminKey || "").trim();
  const isOtpValid =
    currentOwnerOtp &&
    Date.now() < currentOwnerOtpExpires &&
    input === currentOwnerOtp;

  if (isOtpValid || input === PRIVATE_OWNER_KEY) {
    currentOwnerOtp = null;
    const sessionToken = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    activeAdminSessions.add(sessionToken);
    store.addLog("Sesión privada de propietario iniciada correctamente.");
    return res.json({ unlocked: true, sessionToken });
  }

  store.addLog("Intento fallido de acceso al Panel Privado.");
  return res.status(403).json({ unlocked: false, error: "Código o clave de propietario inválida." });
});

app.get("/api/games/:id", (req, res) => {
  const game = store.getGameById(req.params.id);
  if (!game) return res.status(404).json({ error: "Juego no encontrado" });
  res.json(game);
});

app.post("/api/submissions", async (req, res) => {
  const { gameId, characterName, comboNotation } = req.body;
  if (!gameId || !characterName || !comboNotation) {
    return res.status(400).json({ error: "Faltan campos obligatorios (juego, personaje y combo)." });
  }

  const created = store.createSubmission(req.body);
  await telegramBot.notifyNewSubmission(created);

  res.status(201).json({
    message: "Propuesta enviada al Bot Privado de Telegram para verificación del propietario.",
    submission: created
  });
});

app.post("/api/bot/moderate", requirePrivateOwner, (req, res) => {
  const { submissionId, action } = req.body;
  const updated = store.moderateSubmission(submissionId, action);
  if (!updated) {
    return res.status(404).json({ error: "Propuesta no encontrada" });
  }
  res.json({
    submission: updated,
    games: store.getGames(),
    submissions: store.getSubmissions(),
    botLogs: store.state.botLogs
  });
});

app.post("/api/bot/update-patch", requirePrivateOwner, (req, res) => {
  const { gameId, currentPatch } = req.body;
  const updated = store.updateGamePatch(gameId, currentPatch);
  if (!updated) {
    return res.status(404).json({ error: "Juego no encontrado" });
  }
  res.json({
    game: updated,
    games: store.getGames(),
    botLogs: store.state.botLogs
  });
});

app.post("/api/auth/request-verification", async (req, res) => {
  const { username, telegramHandle, role } = req.body;
  if (!username || !telegramHandle) {
    return res.status(400).json({ error: "Introduce tu nombre de usuario y tu @usuario de Telegram." });
  }

  const authReq = store.createAuthRequest(username, telegramHandle, role);
  await telegramBot.notifyNewAuthRequest(authReq);

  res.status(201).json({
    message: "Solicitud enviada al Bot Privado del propietario.",
    requestId: authReq.id
  });
});

app.post("/api/auth/verify-code", requirePrivateOwner, (req, res) => {
  const { code, decision } = req.body;
  const resolved = store.resolveAuthRequest(code, decision || "approve");
  if (!resolved) {
    return res.status(404).json({ error: "Código de verificación no encontrado o expirado." });
  }
  res.json({
    authRequest: resolved,
    verifiedUsers: store.state.verifiedUsers,
    authRequests: store.state.authRequests,
    botLogs: store.state.botLogs
  });
});

// =========================================================================
// WEBHOOK AUTÓNOMO DE TELEGRAM Y SINCRONIZACIÓN DE ADMINISTRACIÓN DESDE BOT.JS
// =========================================================================
app.post("/api/telegram/webhook", async (req, res) => {
  const headerSecret = String(req.headers["x-telegram-bot-api-secret-token"] || "");
  if (telegramBot.webhookSecret && headerSecret && headerSecret !== telegramBot.webhookSecret) {
    return res.status(403).send("Secret inválido");
  }
  try {
    await telegramBot.handleUpdate(req.body);
  } catch (_) {}
  return res.status(200).json({ ok: true });
});

app.post("/api/admin/bot-sync", requirePrivateOwner, (req, res) => {
  const { actionType, payload } = req.body || {};
  const p = payload || {};
  if (actionType === "add_news") store.addCustomNewsItem(p);
  else if (actionType === "remove_news") store.removeCustomNews(p.newsId);
  else if (actionType === "add_event") store.addCustomEvent(p);
  else if (actionType === "remove_event") store.removeCustomEvent(p.eventId);
  else if (actionType === "add_roadmap") store.addMissingRoadmapItem(p.target, p.whatIsMissing);
  else if (actionType === "complete_roadmap") store.completeMissingRoadmapItem(p.missId);
  else if (actionType === "add_wiki") store.addCommunityResource(p);
  else if (actionType === "remove_resource") store.removeCommunityResource(p.resId);
  else if (actionType === "update_patch") store.updateGamePatch(p.gameId, p.currentPatch);
  else if (actionType === "toggle_lock") store.toggleCharacterLock(p.gameId, p.charQuery, p.forceLocked);
  else if (actionType === "add_char") store.addAdminCharacter(p.gameId, p.name, p.archetype, p.dlcPack);
  else if (actionType === "moderate_sub") store.moderateSubmission(p.subId, p.decision);
  else if (actionType === "resolve_auth") store.resolveAuthRequest(p.code, p.decision);
  else if (actionType === "remove_user") store.removeVerifiedUser(p.userId);
  else if (actionType === "update_youtube") store.updateYoutubeChannelUrl(p.newUrl, p.newHandle);
  return res.json({ synced: true });
});

telegramBot.registerServerAdminHooks({
  generateOtp: () => {
    currentOwnerOtp = String(Math.floor(100000 + Math.random() * 900000));
    currentOwnerOtpExpires = Date.now() + 10 * 60 * 1000;
    return currentOwnerOtp;
  },
  revokeAllSessions: () => {
    const count = activeAdminSessions.size;
    activeAdminSessions.clear();
    return count;
  },
  getSessionCount: () => activeAdminSessions.size
});

// SPA Fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`FGC Vault escuchando en http://localhost:${PORT}`);
  if (process.env.ENABLE_WEB_BOT !== "false") {
    telegramBot.start();
  } else {
    console.log("Bot de Telegram desactivado en server.js (ENABLE_WEB_BOT=false); usa 'npm run bot'.");
  }
});
