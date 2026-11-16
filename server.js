require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const store = require("./src/db/store");
const telegramBot = require("./src/bot/telegramBot");
const { resolveCharacterPortraitUrl } = require("./src/utils/portraitResolver");
const { CURATED_FGC_NEWS, getFgcNews } = require("./src/data/fgcNews");

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

  res.json({
    youtubeChannel: store.state.youtubeChannel,
    news: CURATED_FGC_NEWS,
    communityResources: store.getCommunityResources(),
    missingContentRoadmap: store.getMissingContentRoadmap(),
    sagas: store.getSagas(),
    games: store.getGames()
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

app.get("/api/news", async (req, res) => {
  const allNews = await getFgcNews();
  res.json({ news: allNews });
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

// SPA Fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`FGC Vault escuchando en http://localhost:${PORT} (Modo Bot Privado Activo)`);
  telegramBot.start();
});
