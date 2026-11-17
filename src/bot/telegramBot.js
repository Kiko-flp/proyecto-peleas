/**
 * Motor Administrativo del Bot Privado de Telegram (@Clayfacefightbot - "Clayface")
 * Diseñado para operar de forma autónoma sin depender de que la web esté abierta o activa:
 * 1. Modo Independiente (node bot.js / npm run bot) sin servidor web Express.
 * 2. Modo Webhook (/api/telegram/webhook) que despierta el servicio bajo demanda desde Telegram.
 * 3. Centro completo de Administración: Moderación (propuestas y verificaciones),
 *    Usuarios verificados, Candados (Pronto), Parches, Personajes, Noticias/Eventos,
 *    Comunidad/Hoja de ruta, Canal YouTube, Seguridad OTP/Sesiones, Logs y Backup .json.
 */

const store = require("../db/store");
const youtubeManager = require("../youtube/youtubeManager");
const { CURATED_FGC_NEWS } = require("../data/fgcNews");

class TelegramBotManager {
  constructor() {
    this.token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
    this.botId = this.token.includes(":") ? this.token.split(":")[0].trim() : "9297971350";

    const envChatId = (process.env.TELEGRAM_ADMIN_CHAT_ID || "").trim();
    this.adminChatId =
      envChatId && envChatId !== this.botId
        ? envChatId
        : store.state.ownerChatId || "";

    this.privateMode = process.env.BOT_PRIVATE_MODE !== "false";
    this.webhookSecret = (process.env.TELEGRAM_WEBHOOK_SECRET || this.botId || "fgc_admin_secret").replace(/[^a-zA-Z0-9_-]/g, "");
    this.offset = 0;
    this.isPolling = false;
    this.mode = "idle"; // "standalone-polling" | "web-webhook" | "web-polling" | "idle"
    this.startedAt = Date.now();
    this.botUsername = "@Clayfacefightbot";
    this.botFirstName = "Clayface";
    this.serverAdminHooks = null;
  }

  registerServerAdminHooks(hooks) {
    this.serverAdminHooks = hooks;
  }

  isConfigured() {
    return Boolean(
      this.token &&
      this.token !== "tu_token_completo_de_botfather_aqui" &&
      this.token.includes(":")
    );
  }

  isAuthorizedOwner(fromId, chatId) {
    if (!this.privateMode) return true;
    if (!this.adminChatId) return false;

    const allowedIds = this.adminChatId
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const strFrom = String(fromId || "");
    const strChat = String(chatId || "");
    return allowedIds.includes(strFrom) || allowedIds.includes(strChat);
  }

  bindOwner(fromId, username) {
    this.adminChatId = String(fromId);
    store.state.ownerChatId = this.adminChatId;
    store.save();
    store.addLog(
      `🔒 @Clayfacefightbot vinculado en MODO ADMIN PRIVADO a @${username} (Chat ID: ${this.adminChatId})`
    );
  }

  getApiUrl(method) {
    return `https://api.telegram.org/bot${this.token}/${method}`;
  }

  async callTelegram(method, body = {}) {
    if (!this.isConfigured()) return null;
    try {
      const res = await fetch(this.getApiUrl(method), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      return data.ok ? data.result : null;
    } catch (_) {
      return null;
    }
  }

  async sendDocumentJson(chatId, filename, jsonObj, caption = "") {
    if (!this.isConfigured()) return false;
    try {
      const form = new FormData();
      form.append("chat_id", String(chatId));
      if (caption) form.append("caption", caption);
      const blob = new Blob([JSON.stringify(jsonObj, null, 2)], { type: "application/json" });
      form.append("document", blob, filename);
      const res = await fetch(this.getApiUrl("sendDocument"), {
        method: "POST",
        body: form
      });
      const data = await res.json();
      return Boolean(data && data.ok);
    } catch (_) {
      return false;
    }
  }

  async syncAdminMutationToWeb(actionType, payload = {}) {
    const webUrl = (process.env.FGC_WEB_URL || "").trim().replace(/\/+$/, "");
    const adminKey = (process.env.ADMIN_SECRET_KEY || process.env.TELEGRAM_ADMIN_CHAT_ID || "").trim();
    if (!webUrl || !adminKey || this.mode !== "standalone-polling") return;

    try {
      await fetch(`${webUrl}/api/admin/bot-sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey
        },
        body: JSON.stringify({ actionType, payload })
      });
    } catch (_) {
      // Silencioso si la web está dormida o desconectada
    }
  }

  async registerBotCommands() {
    await this.callTelegram("setMyCommands", {
      commands: [
        { command: "menu", description: "Abrir panel de administración" },
        { command: "moderacion", description: "Ver propuestas y solicitudes pendientes" },
        { command: "estado", description: "Estado del sistema y últimos logs" },
        { command: "otp", description: "Generar código OTP de acceso admin" },
        { command: "parche", description: "Actualizar parche (/parche juego versión)" },
        { command: "candado", description: "Bloquear/desbloquear personaje (/candado juego nombre)" },
        { command: "add_char", description: "Añadir personaje (/add_char juego|Nombre|Arq|Base)" },
        { command: "noticia", description: "Publicar noticia FGC" },
        { command: "evento", description: "Añadir torneo/evento con fechas" },
        { command: "falta", description: "Añadir tarea a hoja de ruta" },
        { command: "add_wiki", description: "Registrar wiki o canal" },
        { command: "youtube", description: "Actualizar enlace/@handle del canal" },
        { command: "yt_asignar", description: "Vincular vídeo a personaje/juego" },
        { command: "yt_pausa", description: "Añadir pausa explicativa ES" },
        { command: "backup", description: "Descargar copia de seguridad JSON" },
        { command: "miid", description: "Consultar tu Chat ID autorizado" }
      ]
    });
  }

  async start(options = {}) {
    const { standalone = false } = options;
    if (!this.isConfigured()) {
      store.addLog("⚠️ TELEGRAM_BOT_TOKEN no configurado. Bot admin en espera.");
      return false;
    }

    const me = await this.callTelegram("getMe");
    if (!me || !me.username) {
      store.addLog("❌ No se pudo conectar con Telegram API (revisa TELEGRAM_BOT_TOKEN).");
      return false;
    }

    this.botUsername = `@${me.username}`;
    this.botFirstName = me.first_name || "Clayface";
    this.startedAt = Date.now();
    await this.registerBotCommands();

    const rawWebhookBase = (
      process.env.TELEGRAM_WEBHOOK_URL ||
      process.env.RENDER_EXTERNAL_URL ||
      ""
    ).trim().replace(/\/+$/, "");
    const forcePolling = process.env.TELEGRAM_MODE === "polling" || standalone;

    if (!forcePolling && rawWebhookBase) {
      const fullWebhookUrl = `${rawWebhookBase}/api/telegram/webhook`;
      const ok = await this.callTelegram("setWebhook", {
        url: fullWebhookUrl,
        secret_token: this.webhookSecret,
        allowed_updates: ["message", "callback_query"]
      });
      if (ok) {
        this.mode = "web-webhook";
        this.isPolling = false;
        store.addLog(`🤖 Bot Admin ${this.botFirstName} (${this.botUsername}) activo por WEBHOOK (${fullWebhookUrl})`);
        return true;
      }
    }

    // Modo Polling (autónomo en bot.js o local)
    await this.callTelegram("deleteWebhook", { drop_pending_updates: false });
    this.mode = standalone ? "standalone-polling" : "web-polling";
    this.isPolling = true;
    const ownerStatus = this.adminChatId
      ? `Propietario Admin ID: ${this.adminChatId}`
      : `Esperando tu primer /start en ${this.botUsername}`;
    store.addLog(`🤖 Bot Admin ${this.botFirstName} (${this.botUsername}) en modo [${this.mode}] — ${ownerStatus}`);
    this.pollLoop();
    return true;
  }

  async startStandalone() {
    return this.start({ standalone: true });
  }

  stop() {
    this.isPolling = false;
  }

  async pollLoop() {
    while (this.isPolling && this.isConfigured()) {
      try {
        const updates = await this.callTelegram("getUpdates", {
          offset: this.offset,
          timeout: 20,
          allowed_updates: ["message", "callback_query"]
        });

        if (Array.isArray(updates)) {
          for (const upd of updates) {
            this.offset = upd.update_id + 1;
            await this.handleUpdate(upd);
          }
        }
      } catch (_) {
        // Reintento silencioso
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  // =========================================================================
  // NOTIFICACIONES SALIENTES AL PROPIETARIO ADMIN
  // =========================================================================
  async sendOwnerOtpCode(otpCode) {
    if (!this.isConfigured() || !this.adminChatId) return false;
    const ownerChat = this.adminChatId.split(",")[0].trim();

    const text =
      `🔐 *CÓDIGO DE ACCESO ADMIN — FGC VAULT*\n\n` +
      `Tu código temporal es: \`${otpCode}\`\n` +
      `_(Válido por 10 minutos)._`;

    const sent = await this.callTelegram("sendMessage", {
      chat_id: ownerChat,
      text,
      parse_mode: "Markdown"
    });
    return Boolean(sent);
  }

  async notifyNewCommunityResource(item) {
    if (!this.isConfigured() || !this.adminChatId) return;
    const ownerChat = this.adminChatId.split(",")[0].trim();

    const text =
      `🌐 *NUEVO APORTE DE COMUNIDAD / QUÉ FALTA*\n\n` +
      `🏷 *Tipo:* ${item.category}\n` +
      `🎮 *Destino:* ${item.targetGame}\n` +
      `📌 *Título:* *${item.title}*\n` +
      `🔗 *URL:* ${item.url}\n` +
      `📋 *Nota:* _${item.missingNotes}_\n` +
      `✍️ *Autor:* ${item.author}`;

    await this.callTelegram("sendMessage", {
      chat_id: ownerChat,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Mantener", callback_data: `res_keep:${item.id}` },
            { text: "🗑 Eliminar", callback_data: `res_del:${item.id}` }
          ],
          [{ text: "📋 Ver Qué Falta", callback_data: "menu_roadmap" }]
        ]
      }
    });
  }

  async notifyNewAuthRequest(authReq) {
    if (!this.isConfigured() || !this.adminChatId) return;
    const ownerChat = this.adminChatId.split(",")[0].trim();

    const text =
      `🔐 *SOLICITUD DE VERIFICACIÓN DE USUARIO*\n` +
      `👤 *Usuario:* \`${authReq.username}\` (${authReq.telegramHandle})\n` +
      `🏷 *Rol:* ${authReq.role}\n` +
      `🔑 *Código:* \`${authReq.code}\``;

    await this.callTelegram("sendMessage", {
      chat_id: ownerChat,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Autorizar", callback_data: `auth_approve:${authReq.code}` },
            { text: "🚫 Denegar", callback_data: `auth_reject:${authReq.code}` }
          ]
        ]
      }
    });
  }

  async notifyNewSubmission(sub) {
    if (!this.isConfigured() || !this.adminChatId) return;
    const ownerChat = this.adminChatId.split(",")[0].trim();
    const text =
      `🛡️ *NUEVA PROPUESTA PENDIENTE DE MODERACIÓN*\n` +
      `🕹 *Juego:* ${sub.gameTitle} — *${sub.characterName}*\n` +
      `✍️ *Autor:* ${sub.author}\n` +
      `⌨️ *Combo:* \`${sub.comboNotation}\``;

    await this.callTelegram("sendMessage", {
      chat_id: ownerChat,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Aprobar", callback_data: `sub_approve:${sub.id}` },
            { text: "❌ Rechazar", callback_data: `sub_reject:${sub.id}` }
          ]
        ]
      }
    });
  }

  // =========================================================================
  // MANEJO DE COMANDOS Y BOTONES DE ADMINISTRACIÓN EN TELEGRAM
  // =========================================================================
  async handleUpdate(upd) {
    if (upd.message && upd.message.text) {
      const chatId = upd.message.chat.id;
      const fromId = upd.message.from ? upd.message.from.id : chatId;
      const username = upd.message.from
        ? upd.message.from.username || upd.message.from.first_name
        : "Propietario";
      const text = upd.message.text.trim();

      if (!this.adminChatId && (text.startsWith("/start") || text.startsWith("/vincular"))) {
        this.bindOwner(fromId, username);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text:
            `🔒 *¡Bot Clayface vinculado como Panel Admin Privado!*\n\n` +
            `👤 *Administrador único:* @${username}\n` +
            `🆔 *Tu TELEGRAM_ADMIN_CHAT_ID:* \`${fromId}\``,
          parse_mode: "Markdown"
        });
        await this.sendMainMenu(chatId);
        return;
      }

      if (!this.isAuthorizedOwner(fromId, chatId)) {
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: "🔒 *ACCESO DENEGADO*\nEste bot es únicamente para administración privada.",
          parse_mode: "Markdown"
        });
        return;
      }

      if (text.startsWith("/start") || text.startsWith("/menu") || text.startsWith("/admin")) {
        await this.sendMainMenu(chatId);
      } else if (text.startsWith("/moderacion")) {
        await this.sendModerationQueueMenu(chatId);
      } else if (text.startsWith("/estado")) {
        await this.sendSystemStatusMenu(chatId);
      } else if (text.startsWith("/otp")) {
        await this.handleGenerateAdminOtp(chatId);
      } else if (text.startsWith("/miid")) {
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `🔒 *Admin Privado Clayface*\n🆔 Tu Chat ID es: \`${fromId}\``,
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/backup")) {
        const snapshot = {
          updatedAt: new Date().toISOString(),
          mode: this.mode,
          customNews: store.getCustomNews(),
          customEvents: store.getCustomEvents(),
          communityResources: store.getCommunityResources(),
          missingContentRoadmap: store.getMissingContentRoadmap(),
          submissions: store.getSubmissions(),
          verifiedUsers: store.state.verifiedUsers || [],
          authRequests: store.state.authRequests || [],
          patchOverrides: store.state.patchOverrides || {},
          charLockOverrides: store.state.charLockOverrides || {},
          youtubeChannel: store.state.youtubeChannel
        };
        const fileName = `fgc-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
        const sentFile = await this.sendDocumentJson(
          chatId,
          fileName,
          snapshot,
          `☁️ Backup completo FGC Vault (${snapshot.submissions.length} propuestas, ${snapshot.communityResources.length} recursos, ${snapshot.customNews.length} noticias).`
        );
        if (!sentFile) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text:
              `☁️ *RESUMEN BACKUP ADMIN*\n` +
              `• Propuestas: ${snapshot.submissions.length}\n` +
              `• Noticias propias: ${snapshot.customNews.length}\n` +
              `• Eventos propios: ${snapshot.customEvents.length}\n` +
              `• Recursos: ${snapshot.communityResources.length}`,
            parse_mode: "Markdown"
          });
        }
      } else if (text.startsWith("/noticia")) {
        const rawArgs = text.replace(/^\/noticia\s*/i, "");
        const segments = rawArgs.split("|").map((s) => s.trim());
        if (segments.length < 3) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text:
              "⚠️ *Publicar Noticia (Admin):*\n" +
              "`/noticia Tekken 8 | Nuevo Torneo Master | Resumen aquí | https://tekkenworldtour.com`",
            parse_mode: "Markdown"
          });
          return;
        }
        const payload = {
          saga: segments[0],
          category: "Competitivo / Torneos",
          title: segments[1],
          summary: segments[2],
          sourceUrl: segments[3] || "https://fgc-vault.onrender.com"
        };
        const created = store.addCustomNewsItem(payload);
        await this.syncAdminMutationToWeb("add_news", payload);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `✅ *Noticia publicada:*\n📰 *${created.title}* (${created.saga} • ${created.isoDate})`,
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/evento")) {
        const rawArgs = text.replace(/^\/evento\s*/i, "");
        const segments = rawArgs.split("|").map((s) => s.trim());
        if (segments.length < 4) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text:
              "⚠️ *Añadir Evento / Torneo (Admin):*\n" +
              "`/evento EVO 2027 | SF6 & Tekken 8 | 2027-07-30 | 2027-08-01 | Las Vegas, EEUU`",
            parse_mode: "Markdown"
          });
          return;
        }
        const evPayload = {
          name: segments[0],
          game: segments[1],
          startDate: segments[2],
          endDate: segments[3],
          location: segments[4] || "Mundial / Online"
        };
        const ev = store.addCustomEvent(evPayload);
        await this.syncAdminMutationToWeb("add_event", evPayload);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `📅 *Evento añadido:* *${ev.name}*\n🕹 ${ev.game} | ${ev.startDate} → ${ev.endDate}\n📍 ${ev.location}`,
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/falta")) {
        const rawArgs = text.replace(/^\/falta\s*/i, "");
        const segments = rawArgs.split("|").map((s) => s.trim());
        if (segments.length < 2) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/falta Mortal Kombat 1 | Añadir guía de Kameo Mavado`",
            parse_mode: "Markdown"
          });
          return;
        }
        const added = store.addMissingRoadmapItem(segments[0], segments[1]);
        await this.syncAdminMutationToWeb("add_roadmap", { target: segments[0], whatIsMissing: segments[1] });
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `📌 *Añadido a Hoja de Ruta:*\n🎮 ${added.target}\n📝 ${added.whatIsMissing}`,
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/add_wiki")) {
        const rawArgs = text.replace(/^\/add_wiki\s*/i, "");
        const segments = rawArgs.split("|").map((s) => s.trim());
        if (segments.length < 4) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/add_wiki Wiki Oficial | Street Fighter 6 | SuperCombo Wiki | https://wiki.supercombo.gg | Faltan frames DLC`",
            parse_mode: "Markdown"
          });
          return;
        }
        const resPayload = {
          category: segments[0],
          targetGame: segments[1],
          title: segments[2],
          url: segments[3],
          missingNotes: segments[4] || "",
          author: "Admin Telegram"
        };
        const created = store.addCommunityResource(resPayload);
        await this.syncAdminMutationToWeb("add_wiki", resPayload);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `🌐 *Wiki/Canal añadido:* *${created.title}* (${created.targetGame})`,
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/parche")) {
        const parts = text.split(/\s+/);
        const gameId = parts[1];
        const newPatch = parts.slice(2).join(" ");
        if (!gameId || !newPatch) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/parche tekken8 Parche v3.05 (17 Nov 2026)`",
            parse_mode: "Markdown"
          });
          return;
        }
        const updated = store.updateGamePatch(gameId, newPatch);
        if (updated) await this.syncAdminMutationToWeb("update_patch", { gameId, currentPatch: newPatch });
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: updated
            ? `✅ *Parche actualizado en ${updated.title}:* \`${updated.currentPatch}\``
            : "❌ Juego no encontrado (`mk1`, `sf6`, `tekken8`, `dbfz`, `gg-strive`, `ssbu`).",
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/candado")) {
        const parts = text.split(/\s+/);
        const gameId = parts[1];
        const lastTok = parts[parts.length - 1];
        let forceLocked = null;
        let charParts = parts.slice(2);
        if (/^(on|off|lock|unlock|si|no)$/i.test(lastTok) && parts.length >= 4) {
          forceLocked = /^(on|lock|si)$/i.test(lastTok);
          charParts = parts.slice(2, -1);
        }
        const charQuery = charParts.join(" ");
        if (!gameId || !charQuery) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/candado tekken8 Yujiro off` (o `on` para bloquear con 🔒 Pronto)",
            parse_mode: "Markdown"
          });
          return;
        }
        const res = store.toggleCharacterLock(gameId, charQuery, forceLocked);
        if (res) await this.syncAdminMutationToWeb("toggle_lock", { gameId, charQuery: res.character.id, forceLocked: res.character.isUnreleased });
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: res
            ? `${res.character.isUnreleased ? "🔒 BLOQUEADO (Pronto)" : "🔓 DESBLOQUEADO"}: *${res.character.name}* en ${res.game.title}`
            : "❌ No se encontró el personaje o juego.",
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/add_char")) {
        const rawArgs = text.replace(/^\/add_char\s*/i, "");
        const segments = rawArgs.split("|").map((s) => s.trim());
        if (segments.length < 2) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/add_char tekken8 | Marduk | Grappler / Brawler | Season 3 Pass` (pon `Base` si es inicial)",
            parse_mode: "Markdown"
          });
          return;
        }
        const added = store.addAdminCharacter(segments[0], segments[1], segments[2], segments[3]);
        if (added) await this.syncAdminMutationToWeb("add_char", { gameId: segments[0], name: segments[1], archetype: segments[2], dlcPack: segments[3] });
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: added
            ? `✅ *Personaje añadido:* *${added.character.name}* en ${added.game.title} (${added.character.isDLC ? added.character.dlcPack : "Base"})`
            : "❌ No se pudo añadir (juego inválido o personaje ya existente).",
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/yt_pausa")) {
        const rawArgs = text.replace(/^\/yt_pausa\s*/i, "");
        const [firstBlock, pauseTitle, pauseExp] = rawArgs.split("|").map((s) => (s || "").trim());
        const firstParts = (firstBlock || "").split(/\s+/);
        const gameId = firstParts[0];
        const timeStr = firstParts[firstParts.length - 1];
        const charQuery = firstParts.slice(1, -1).join(" ");

        if (!gameId || !charQuery || !timeStr || !pauseExp) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/yt_pausa mk1 Scorpion 01:30 | Pausa Antiaéreo | Explicación aquí`",
            parse_mode: "Markdown"
          });
          return;
        }
        const ch = store.addCharacterVideoPause(gameId, charQuery, timeStr, pauseTitle, pauseExp);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: ch ? `⏸ *Pausa añadida a ${ch.name} (${timeStr}):*\n_${pauseExp}_` : "❌ Personaje no encontrado.",
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/yt_guion")) {
        const parts = text.split(/\s+/);
        const gameId = parts[1] || "mk1";
        const charName = parts.slice(2).join(" ");
        const seo = youtubeManager.generateVideoSeoPackage(gameId, charName || null);
        if (!seo) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/yt_guion mk1 Scorpion`",
            parse_mode: "Markdown"
          });
          return;
        }
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `🎬 *GUION SEO YOUTUBE*\n📂 *Lista:* ${seo.playlistTarget || gameId}\n*Título:* \`${seo.title}\`\n\n\`\`\`\n${seo.description}\n\`\`\``,
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/yt_asignar")) {
        const parts = text.split(/\s+/);
        const gameId = parts[1];
        const target = parts[2];
        const videoUrl = parts[3];
        if (!gameId || !target || !videoUrl) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/yt_asignar mk1 Scorpion https://youtu.be/XXXX`",
            parse_mode: "Markdown"
          });
          return;
        }
        const assigned = youtubeManager.assignVideoToTarget(gameId, target, videoUrl);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: assigned ? `✅ *Vídeo vinculado:* ${assigned.type} — *${assigned.target}*` : "❌ Juego o personaje no encontrado.",
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/youtube")) {
        const parts = text.split(/\s+/);
        const newUrl = parts[1];
        const newHandle = parts[2];
        if (!newUrl) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/youtube https://www.youtube.com/@TuCanal @TuCanal`",
            parse_mode: "Markdown"
          });
          return;
        }
        const updated = store.updateYoutubeChannelUrl(newUrl, newHandle);
        await this.syncAdminMutationToWeb("update_youtube", { newUrl, newHandle });
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `✅ *Canal actualizado:* ${updated.publicUrl} (${updated.handle})`,
          parse_mode: "Markdown"
        });
      }
    }

    if (upd.callback_query) {
      const cb = upd.callback_query;
      const chatId = cb.message.chat.id;
      const fromId = cb.from ? cb.from.id : chatId;
      const data = cb.data || "";

      if (!this.isAuthorizedOwner(fromId, chatId)) {
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: "🔒 Acceso denegado: Solo Administrador.",
          show_alert: true
        });
        return;
      }

      if (data === "menu_main") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id });
        await this.sendMainMenu(chatId);
      } else if (data === "menu_moderation") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id });
        await this.sendModerationQueueMenu(chatId);
      } else if (data === "menu_users") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id });
        await this.sendVerifiedUsersMenu(chatId);
      } else if (data === "menu_resources") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id });
        await this.sendCommunityResourcesMenu(chatId);
      } else if (data === "menu_roadmap") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id });
        await this.sendMissingRoadmapMenu(chatId);
      } else if (data === "menu_news") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id });
        await this.sendNewsMenu(chatId);
      } else if (data === "menu_games") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id });
        await this.sendGamesManagement(chatId);
      } else if (data === "menu_locks") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id });
        await this.sendLocksManagementMenu(chatId);
      } else if (data === "menu_youtube") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id });
        await this.sendYoutubeManagerMenu(chatId);
      } else if (data === "menu_security") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id });
        await this.sendSecurityMenu(chatId);
      } else if (data === "admin_status") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id });
        await this.sendSystemStatusMenu(chatId);
      } else if (data === "admin_otp") {
        await this.callTelegram("answerCallbackQuery", { callback_query_id: cb.id, text: "Generando OTP..." });
        await this.handleGenerateAdminOtp(chatId);
      } else if (data === "admin_revoke_sessions") {
        const count = this.serverAdminHooks ? this.serverAdminHooks.revokeAllSessions() : 0;
        store.addLog(`Sesiones web revocadas desde Telegram Admin (${count})`);
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: `🚫 Sesiones web cerradas (${count})`,
          show_alert: true
        });
        await this.sendSecurityMenu(chatId);
      } else if (data.startsWith("sub_approve:") || data.startsWith("sub_reject:")) {
        const [act, subId] = data.split(":");
        const decision = act === "sub_approve" ? "approve" : "reject";
        const updated = store.moderateSubmission(subId, decision);
        if (updated) await this.syncAdminMutationToWeb("moderate_sub", { subId, decision });
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: updated
            ? `${decision === "approve" ? "✅ Aprobada" : "❌ Rechazada"}: ${updated.characterName}`
            : "Propuesta no encontrada"
        });
        await this.sendModerationQueueMenu(chatId);
      } else if (data.startsWith("auth_approve:") || data.startsWith("auth_reject:")) {
        const [act, code] = data.split(":");
        const decision = act === "auth_approve" ? "approve" : "reject";
        const resolved = store.resolveAuthRequest(code, decision);
        if (resolved) await this.syncAdminMutationToWeb("resolve_auth", { code, decision });
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: resolved
            ? `${decision === "approve" ? "✅ Usuario verificado" : "🚫 Denegado"}: ${resolved.username}`
            : "Solicitud no encontrada"
        });
        await this.sendModerationQueueMenu(chatId);
      } else if (data.startsWith("usr_del:")) {
        const uid = data.split(":")[1];
        const removed = store.removeVerifiedUser(uid);
        if (removed) await this.syncAdminMutationToWeb("remove_user", { userId: uid });
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: removed ? "🚫 Verificación revocada" : "Usuario ya eliminado"
        });
        await this.sendVerifiedUsersMenu(chatId);
      } else if (data.startsWith("res_keep:")) {
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: "✅ Recurso verificado y mantenido"
        });
      } else if (data.startsWith("res_del:")) {
        const resId = data.split(":")[1];
        const removed = store.removeCommunityResource(resId);
        if (removed) await this.syncAdminMutationToWeb("remove_resource", { resId });
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: removed ? "🗑 Aporte eliminado" : "Ya eliminado"
        });
        await this.sendCommunityResourcesMenu(chatId);
      } else if (data.startsWith("miss_done:")) {
        const missId = data.split(":")[1];
        const done = store.completeMissingRoadmapItem(missId);
        if (done) await this.syncAdminMutationToWeb("complete_roadmap", { missId });
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: done ? `✅ Completado: ${done.area}` : "Ya completado"
        });
        await this.sendMissingRoadmapMenu(chatId);
      } else if (data.startsWith("news_del:")) {
        const nId = data.split(":")[1];
        const removed = store.removeCustomNews(nId);
        if (removed) await this.syncAdminMutationToWeb("remove_news", { newsId: nId });
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: removed ? "🗑 Noticia eliminada" : "Ya eliminada"
        });
        await this.sendNewsMenu(chatId);
      } else if (data.startsWith("event_del:")) {
        const eId = data.split(":")[1];
        const removed = store.removeCustomEvent(eId);
        if (removed) await this.syncAdminMutationToWeb("remove_event", { eventId: eId });
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: removed ? "🗑 Evento eliminado" : "Ya eliminado"
        });
        await this.sendNewsMenu(chatId);
      } else if (data.startsWith("lock_toggle:")) {
        const [, gameId, charId] = data.split(":");
        const res = store.toggleCharacterLock(gameId, charId);
        if (res) await this.syncAdminMutationToWeb("toggle_lock", { gameId, charQuery: charId, forceLocked: res.character.isUnreleased });
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: res
            ? `${res.character.isUnreleased ? "🔒 Bloqueado" : "🔓 Desbloqueado"}: ${res.character.name}`
            : "No encontrado"
        });
        await this.sendLocksManagementMenu(chatId);
      }
    }
  }

  // =========================================================================
  // MENÚS DE ADMINISTRACIÓN DE CLAYFACE (@Clayfacefightbot)
  // =========================================================================
  async sendMainMenu(chatId) {
    const games = store.getGames();
    let totalChars = 0;
    let lockedCount = 0;
    games.forEach((g) => {
      totalChars += g.characters.length;
      lockedCount += g.characters.filter((c) => c.isUnreleased).length;
    });
    const pendingSubs = store.getSubmissions("pending").length;
    const pendingAuths = (store.state.authRequests || []).filter((a) => a.status === "pending").length;
    const commCount = store.getCommunityResources().length;
    const roadmapCount = store.getMissingContentRoadmap().length;

    const text =
      `🔒 *CLAYFACE ADMIN (${this.botUsername})*\n` +
      `_Modo de ejecución: \`${this.mode}\` (autónomo)_\n\n` +
      `• 🛡️ *Pendientes moderación:* ${pendingSubs} guías | ${pendingAuths} verificaciones\n` +
      `• 🎮 *Catálogo:* ${games.length} juegos | ${totalChars} personajes (${lockedCount} con 🔒)\n` +
      `• 🌐 *Comunidad / Hoja de Ruta:* ${commCount} wikis | ${roadmapCount} tareas\n\n` +
      `Selecciona un módulo administrativo:`;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: `🛡️ Moderación (${pendingSubs + pendingAuths})`, callback_data: "menu_moderation" },
            { text: `👥 Verificados (${(store.state.verifiedUsers || []).length})`, callback_data: "menu_users" }
          ],
          [
            { text: `🔒 Candados (${lockedCount})`, callback_data: "menu_locks" },
            { text: "🎮 Juegos y Parches", callback_data: "menu_games" }
          ],
          [
            { text: "📰 Noticias y Eventos", callback_data: "menu_news" },
            { text: "🎬 YouTube Admin", callback_data: "menu_youtube" }
          ],
          [
            { text: `🌐 Wikis (${commCount})`, callback_data: "menu_resources" },
            { text: `📋 Qué Falta (${roadmapCount})`, callback_data: "menu_roadmap" }
          ],
          [
            { text: "🔐 Seguridad / OTP", callback_data: "menu_security" },
            { text: "📊 Estado y Logs", callback_data: "admin_status" }
          ]
        ]
      }
    });
  }

  async sendModerationQueueMenu(chatId) {
    const pendingSubs = store.getSubmissions("pending");
    const pendingAuths = (store.state.authRequests || []).filter((a) => a.status === "pending");

    if (pendingSubs.length === 0 && pendingAuths.length === 0) {
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: "✅ *Cola de moderación vacía.*\nNo hay propuestas ni solicitudes pendientes ahora mismo.",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]]
        }
      });
      return;
    }

    for (const s of pendingSubs.slice(0, 5)) {
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: `🛡️ *Propuesta (${s.id})*\n🎮 ${s.gameTitle} — *${s.characterName}*\n✍️ Autor: ${s.author}\n⌨️ \`${s.comboNotation}\``,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Aprobar", callback_data: `sub_approve:${s.id}` },
              { text: "❌ Rechazar", callback_data: `sub_reject:${s.id}` }
            ],
            [{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]
          ]
        }
      });
    }

    for (const a of pendingAuths.slice(0, 5)) {
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: `🔐 *Verificación pendiente*\n👤 *${a.username}* (${a.telegramHandle})\n🔑 Código: \`${a.code}\``,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Autorizar", callback_data: `auth_approve:${a.code}` },
              { text: "🚫 Denegar", callback_data: `auth_reject:${a.code}` }
            ],
            [{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]
          ]
        }
      });
    }
  }

  async sendVerifiedUsersMenu(chatId) {
    const users = (store.state.verifiedUsers || []).slice(0, 8);
    if (users.length === 0) {
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: "👥 No hay usuarios verificados registrados.",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]]
        }
      });
      return;
    }

    for (const u of users) {
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: `👤 *${u.username}* (${u.telegramHandle || "-"})\n🏷 Rol: ${u.role} • Desde: ${u.verifiedAt || "-"}`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🚫 Revocar Verificación", callback_data: `usr_del:${u.id}` },
              { text: "⬅️ Menú", callback_data: "menu_main" }
            ]
          ]
        }
      });
    }
  }

  async sendLocksManagementMenu(chatId) {
    const games = store.getGames();
    const locked = [];
    games.forEach((g) => {
      g.characters.forEach((c) => {
        if (c.isUnreleased) locked.push({ game: g, char: c });
      });
    });

    const buttons = locked.slice(0, 6).map((item) => [
      {
        text: `🔓 Quitar candado a ${item.char.name} (${item.game.title})`,
        callback_data: `lock_toggle:${item.game.id}:${item.char.id}`
      }
    ]);
    buttons.push([{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]);

    const text =
      `🔒 *GESTIÓN DE CANDADOS (PRONTO) Y PERSONAJES*\n\n` +
      `Personajes actualmente con candado: *${locked.length}*\n` +
      (locked.length > 0
        ? locked.map((x) => `• 🔒 *${x.char.name}* (${x.game.title}) — ${x.char.releaseWindow || "Anunciado"}`).join("\n")
        : "_Ningún personaje bloqueado actualmente._") +
      `\n\n*Comandos Admin:*\n` +
      `• \`/candado <gameId> <personaje> on|off\`\n` +
      `• \`/add_char <gameId> | <Nombre> | <Arquetipo> | <Pack o Base>\``;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons }
    });
  }

  async sendCommunityResourcesMenu(chatId) {
    const resources = store.getCommunityResources().slice(0, 6);
    if (resources.length === 0) {
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: "🌐 No hay wikis ni canales registrados. Usa `/add_wiki` para añadir uno.",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]]
        }
      });
      return;
    }

    for (const r of resources) {
      const text =
        `🌐 *${r.title}* (${r.category})\n` +
        `🎮 *Juego:* ${r.targetGame}\n` +
        `🔗 ${r.url}\n` +
        `📋 *Nota:* _${r.missingNotes}_`;

      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🗑 Eliminar de la web", callback_data: `res_del:${r.id}` },
              { text: "⬅️ Menú", callback_data: "menu_main" }
            ]
          ]
        }
      });
    }
  }

  async sendMissingRoadmapMenu(chatId) {
    const items = store.getMissingContentRoadmap();
    if (items.length === 0) {
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: "✨ *Hoja de ruta al día.*\nUsa `/falta <Juego> | <Qué falta>` para añadir una tarea.",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]]
        }
      });
      return;
    }

    for (const m of items.slice(0, 6)) {
      const text =
        `📋 *${m.area}* — *${m.target}*\n` +
        `🏷 *Prioridad:* ${m.priority}\n` +
        `❗ *Pendiente:* ${m.whatIsMissing}\n` +
        `💡 *Nota:* _${m.purposeForEvaluation}_`;

      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Marcar Completado", callback_data: `miss_done:${m.id}` },
              { text: "⬅️ Menú", callback_data: "menu_main" }
            ]
          ]
        }
      });
    }
  }

  async sendNewsMenu(chatId) {
    const customNews = store.getCustomNews();
    const customEvents = store.getCustomEvents();
    const recent = [...customNews, ...CURATED_FGC_NEWS].slice(0, 4);
    const lines = recent.map((n) => `• *[${n.isoDate}] ${n.saga}:* ${n.title}`);

    const buttons = [];
    customNews.slice(0, 3).forEach((n) => {
      buttons.push([{ text: `🗑 Borrar noticia: ${n.title.slice(0, 28)}`, callback_data: `news_del:${n.id}` }]);
    });
    customEvents.slice(0, 3).forEach((e) => {
      buttons.push([{ text: `🗑 Borrar evento: ${e.name.slice(0, 28)}`, callback_data: `event_del:${e.id}` }]);
    });
    buttons.push([{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]);

    const text =
      `📰 *ADMIN DE NOTICIAS Y EVENTOS FGC*\n\n` +
      `*Últimas noticias activas:*\n${lines.join("\n")}\n\n` +
      `📅 *Eventos añadidos por Admin:* ${customEvents.length}\n\n` +
      `*Comandos:*\n` +
      `• \`/noticia <Saga> | <Título> | <Resumen> | <URL>\`\n` +
      `• \`/evento <Nombre> | <Juego> | <Inicio> | <Fin> | <Lugar>\``;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons }
    });
  }

  async sendYoutubeManagerMenu(chatId) {
    const yt = store.state.youtubeChannel || {};
    const text =
      `🎬 *ADMIN DEL CANAL YOUTUBE — ${yt.handle || "@FGCVaultES"}*\n\n` +
      `🔗 *URL pública:* ${yt.publicUrl || "https://www.youtube.com/@FGCVaultES"}\n` +
      `📂 *Listas por Juego:* ${(yt.playlistsByGame || []).length}\n\n` +
      `*Comandos de administración:*\n` +
      `• \`/youtube <url> <@handle>\` — Cambia enlace del canal.\n` +
      `• \`/yt_asignar <juego> <personaje> <url>\` — Conecta un vídeo.\n` +
      `• \`/yt_pausa <juego> <personaje> <MM:SS> | <Título> | <Explicación>\`\n` +
      `• \`/yt_guion <juego> <personaje>\` — Genera guion SEO ES.`;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]]
      }
    });
  }

  async sendGamesManagement(chatId) {
    const games = store.getGames();
    const lines = games.map((g) => {
      const baseCount = g.characters.filter((c) => !c.isDLC).length;
      const dlcCount = g.characters.filter((c) => c.isDLC).length;
      return `• *${g.title}* (\`${g.id}\`) — \`${g.currentPatch}\` (${baseCount} Base / ${dlcCount} DLC)`;
    });

    const text =
      `🎮 *ADMIN DE JUEGOS Y PARCHES*\n\n` +
      `${lines.join("\n")}\n\n` +
      `🔄 *Actualizar versión/fecha de parche:*\n` +
      `\`/parche <id_juego> <Versión y fecha>\``;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]]
      }
    });
  }

  async handleGenerateAdminOtp(chatId) {
    if (this.serverAdminHooks && typeof this.serverAdminHooks.generateOtp === "function") {
      const code = this.serverAdminHooks.generateOtp();
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: `🔐 *Nuevo código OTP generado:* \`${code}\`\n_(Válido durante 10 minutos para desbloquear funciones de administrador en la web)._`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ Menú Seguridad", callback_data: "menu_security" }]]
        }
      });
      return;
    }

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text:
        `🔐 *Bot en modo independiente sin proceso web local.*\n` +
        `Puedes usar tu clave privada \`ADMIN_SECRET_KEY\` directamente o solicitar el OTP cuando el servidor web esté escuchando.`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Menú Seguridad", callback_data: "menu_security" }]]
      }
    });
  }

  async sendSecurityMenu(chatId) {
    const activeSessions = this.serverAdminHooks ? this.serverAdminHooks.getSessionCount() : 0;
    const text =
      `🔐 *SEGURIDAD Y ACCESO PRIVADO*\n\n` +
      `• 👤 *Admin autorizado ID:* \`${this.adminChatId || "Sin vincular"}\`\n` +
      `• 🌐 *Sesiones web activas:* ${activeSessions}\n` +
      `• ⚙️ *Modo Bot:* \`${this.mode}\`\n\n` +
      `Usa los botones inferiores para generar un OTP o revocar todas las sesiones activas:`;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔑 Generar Código OTP ahora", callback_data: "admin_otp" }],
          [{ text: `🚫 Cerrar todas las sesiones web (${activeSessions})`, callback_data: "admin_revoke_sessions" }],
          [{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]
        ]
      }
    });
  }

  async sendSystemStatusMenu(chatId) {
    const uptimeMin = Math.floor((Date.now() - this.startedAt) / 60000);
    const logs = (store.state.botLogs || []).slice(0, 6);
    const logLines = logs.length > 0
      ? logs.map((l) => `• \`${l.time}\` ${l.event}`).join("\n")
      : "_Sin registros recientes._";

    const text =
      `📊 *ESTADO DEL SISTEMA Y AUDITORÍA*\n\n` +
      `• 🤖 *Bot:* ${this.botFirstName} (${this.botUsername})\n` +
      `• ⚙️ *Modo activo:* \`${this.mode}\`\n` +
      `• ⏱️ *Tiempo encendido:* ${uptimeMin} min\n` +
      `• ☁️ *Persistencia:* ${store.getCloudStatus()}\n` +
      `• 🚀 *CDN Animaciones:* ${process.env.ANIM_CDN_BASE_URL ? "CDN Externo" : "Local (/animaciones-personajes)"}\n\n` +
      `*Últimos registros de administración:*\n${logLines}`;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔄 Actualizar Estado", callback_data: "admin_status" }],
          [{ text: "⬅️ Menú Admin", callback_data: "menu_main" }]
        ]
      }
    });
  }
}

module.exports = new TelegramBotManager();
