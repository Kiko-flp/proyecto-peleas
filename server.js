require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const store = require("./src/db/store");
const telegramBot = require("./src/bot/telegramBot");

const app = express();
const PORT = process.env.PORT || 3000;
const PRIVATE_OWNER_KEY = (process.env.ADMIN_SECRET_KEY || process.env.TELEGRAM_ADMIN_CHAT_ID || "9297971350").trim();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/**
 * Middleware que protege las rutas de administración web para que solo el propietario (9297971350) pueda usarlas
 */
function requirePrivateOwner(req, res, next) {
  const clientKey = (req.headers["x-admin-key"] || req.body.adminKey || "").trim();
  if (clientKey !== PRIVATE_OWNER_KEY) {
    return res.status(403).json({
      error: "🔒 Acceso denegado: Panel de Bot en Modo Privado. Introduce tu clave/ID de propietario (9297971350)."
    });
  }
  next();
}

// =========================================================================
// HEALTH CHECK (Para Render.com)
// =========================================================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "FGC Vault - Fighting Games Encyclopedia",
    privateMode: true,
    botConfigured: telegramBot.isConfigured(),
    botUsername: telegramBot.botUsername || "@FGCVault_Bot (Modo Privado)"
  });
});

// =========================================================================
// ENDPOINTS DE SAGAS, JUEGOS Y PERSONAJES (BASE vs DLC)
// =========================================================================
app.get("/api/bootstrap", (req, res) => {
  const clientKey = (req.headers["x-admin-key"] || "").trim();
  const isOwnerUnlocked = clientKey === PRIVATE_OWNER_KEY;

  res.json({
    sagas: store.getSagas(),
    games: store.getGames(),
    submissions: store.getSubmissions(),
    verifiedUsers: store.state.verifiedUsers,
    // Solo enviamos códigos 2FA y logs privados si el propietario ha desbloqueado el panel con 9297971350
    authRequests: isOwnerUnlocked ? store.state.authRequests : [],
    botLogs: isOwnerUnlocked
      ? store.state.botLogs
      : [
          {
            id: "locked",
            time: "🔒",
            event: "Registro privado oculto. Desbloquea con tu ID de propietario para ver detalles."
          }
        ],
    botStatus: {
      isLiveTelegram: telegramBot.isConfigured(),
      privateMode: true,
      isOwnerUnlocked,
      ownerIdMasked: "929797****",
      botUsername: telegramBot.botUsername || "@Clayfacefightbot"
    }
  });
});

app.post("/api/bot/unlock", (req, res) => {
  const { adminKey } = req.body;
  if (String(adminKey || "").trim() === PRIVATE_OWNER_KEY) {
    store.addLog("🔓 Panel Web Privado desbloqueado por el propietario (9297971350).");
    return res.json({ unlocked: true });
  }
  store.addLog("🛑 Intento fallido de desbloquear el Panel Web Privado.");
  return res.status(403).json({ unlocked: false, error: "Clave/ID de propietario incorrecta." });
});

app.get("/api/games/:id", (req, res) => {
  const game = store.getGameById(req.params.id);
  if (!game) return res.status(404).json({ error: "Juego no encontrado" });
  res.json(game);
});

// =========================================================================
// ENDPOINTS DE PROPUESTAS DE GUÍAS Y MODERACIÓN PRIVADA CON BOT
// =========================================================================
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

// =========================================================================
// ENDPOINTS DE VERIFICACIÓN 2FA DE USUARIOS / ADMINS POR TELEGRAM PRIVADO
// =========================================================================
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
  console.log(`🥊 FGC Vault escuchando en http://localhost:${PORT} (Modo Bot Privado Activo)`);
  telegramBot.start();
});
