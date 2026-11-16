/**
 * Motor del Bot de Telegram PRIVADO (@Clayfacefightbot - "Clayface") para FGC Vault
 * - Modo Privado Estricto:
 *   Se vincula de forma exclusiva a tu cuenta personal de Telegram en cuanto le envías /start
 *   (o si defines TELEGRAM_ADMIN_CHAT_ID en Render). Cualquier otra persona queda bloqueada.
 */

const store = require("../db/store");

class TelegramBotManager {
  constructor() {
    this.token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
    this.botId = this.token.includes(":") ? this.token.split(":")[0].trim() : "9297971350";

    // Si TELEGRAM_ADMIN_CHAT_ID es igual al ID del propio bot (9297971350), usamos el vinculador automático del propietario
    const envChatId = (process.env.TELEGRAM_ADMIN_CHAT_ID || "").trim();
    this.adminChatId =
      envChatId && envChatId !== this.botId
        ? envChatId
        : store.state.ownerChatId || "";

    this.privateMode = process.env.BOT_PRIVATE_MODE !== "false";
    this.offset = 0;
    this.isPolling = false;
    this.botUsername = "@Clayfacefightbot";
    this.botFirstName = "Clayface";
  }

  isConfigured() {
    return Boolean(
      this.token &&
      this.token !== "tu_token_completo_de_botfather_aqui" &&
      this.token.includes(":")
    );
  }

  /**
   * Comprueba si el usuario de Telegram es el propietario exclusivo del bot
   */
  isAuthorizedOwner(fromId, chatId) {
    if (!this.privateMode) return true;

    // Si aún no se ha vinculado ningún propietario personal, permitimos que el primer /start del dueño se vincule
    if (!this.adminChatId) {
      return false;
    }

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
      `🔒 @Clayfacefightbot vinculado en MODO PRIVADO EXCLUSIVO a @${username} (Chat ID: ${this.adminChatId})`
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
    } catch (err) {
      return null;
    }
  }

  async start() {
    if (!this.isConfigured()) {
      store.addLog("🔒 @Clayfacefightbot listo en Modo Privado.");
      return;
    }

    const me = await this.callTelegram("getMe");
    if (me && me.username) {
      this.botUsername = `@${me.username}`;
      this.botFirstName = me.first_name || "Clayface";
      const ownerStatus = this.adminChatId
        ? `Propietario bloqueado ID: ${this.adminChatId}`
        : `Esperando tu primer /start en ${this.botUsername} para bloquearse a tu cuenta`;
      store.addLog(`🔒 Bot ${this.botFirstName} (${this.botUsername}) conectado en vivo — ${ownerStatus}`);
      this.isPolling = true;
      this.pollLoop();
    } else {
      store.addLog("⚠️ No se pudo conectar con @Clayfacefightbot. Revisa TELEGRAM_BOT_TOKEN en .env.");
    }
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
  // NOTIFICACIONES SALIENTES (SOLO AL CHAT PRIVADO DEL PROPIETARIO)
  // =========================================================================
  async sendOwnerOtpCode(otpCode) {
    if (!this.isConfigured() || !this.adminChatId) return false;
    const ownerChat = this.adminChatId.split(",")[0].trim();

    const text =
      `🔐 *CÓDIGO DE ACCESO UNICO — PANEL WEB FGC VAULT*\n\n` +
      `Tu código temporal para desbloquear el panel de administración web es:\n` +
      `👉 \`${otpCode}\`\n\n` +
      `_(Válido durante 10 minutos. No compartas este código con nadie)._`;

    const sent = await this.callTelegram("sendMessage", {
      chat_id: ownerChat,
      text,
      parse_mode: "Markdown"
    });
    return Boolean(sent);
  }

  async notifyNewAuthRequest(authReq) {
    if (!this.isConfigured() || !this.adminChatId) return;
    const ownerChat = this.adminChatId.split(",")[0].trim();

    const text =
      `🔐 *[CLAYFACE PRIVADO] SOLICITUD DE VERIFICACIÓN WEB*\n\n` +
      `👤 *Usuario:* \`${authReq.username}\`\n` +
      `📱 *Telegram:* \`${authReq.telegramHandle}\`\n` +
      `🏷 *Rol solicitado:* ${authReq.role}\n` +
      `🔑 *Código 2FA:* \`${authReq.code}\`\n\n` +
      `Pulsa un botón para autorizar o denegar este acceso:`;

    await this.callTelegram("sendMessage", {
      chat_id: ownerChat,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Autorizar Usuario", callback_data: `auth_approve:${authReq.code}` },
            { text: "🚫 Denegar", callback_data: `auth_reject:${authReq.code}` }
          ],
          [{ text: "🏠 Abrir Panel Privado", callback_data: "menu_main" }]
        ]
      }
    });
  }

  async notifyNewCommunityResource(item) {
    if (!this.isConfigured() || !this.adminChatId) return;
    const ownerChat = this.adminChatId.split(",")[0].trim();

    const text =
      `🌐 *NUEVO RECURSO / QUÉ FALTA ENVIADO EN LA WEB*\n\n` +
      `🏷 *Tipo:* ${item.category}\n` +
      `🎮 *Juego / Destino:* ${item.targetGame}\n` +
      `📌 *Título:* *${item.title}*\n` +
      `🔗 *URL:* ${item.url}\n` +
      `📝 *Descripción:* ${item.description}\n` +
      `📋 *Qué falta / Para valorar:* ${item.missingNotes}\n` +
      `✍️ *Enviado por:* ${item.author}`;

    await this.callTelegram("sendMessage", {
      chat_id: ownerChat,
      text,
      parse_mode: "Markdown"
    });
  }

  async notifyNewSubmission(sub) {
    if (!this.isConfigured() || !this.adminChatId) return;
    const ownerChat = this.adminChatId.split(",")[0].trim();

    const dlcTag = sub.isDLC ? `💎 DLC (${sub.dlcPack})` : "🎮 Juego Base";
    const text =
      `🥊 *[CLAYFACE PRIVADO] NUEVA GUÍA / PERSONAJE*\n\n` +
      `🕹 *Juego:* ${sub.gameTitle}\n` +
      `👤 *Personaje:* *${sub.characterName}* (${dlcTag})\n` +
      `✍️ *Autor:* ${sub.author}\n` +
      `⌨️ *Combo BnB:* \`${sub.comboNotation}\`\n` +
      `📝 *Notas:* ${sub.notes}\n\n` +
      `¿Publicar directamente en la web?`;

    await this.callTelegram("sendMessage", {
      chat_id: ownerChat,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Aprobar y Publicar", callback_data: `sub_approve:${sub.id}` },
            { text: "❌ Rechazar", callback_data: `sub_reject:${sub.id}` }
          ],
          [{ text: "📋 Ver todas las pendientes", callback_data: "menu_pending" }]
        ]
      }
    });
  }

  // =========================================================================
  // MANEJO DE COMANDOS Y BOTONES (PROTEGIDO EN MODO PRIVADO)
  // =========================================================================
  async handleUpdate(upd) {
    if (upd.message && upd.message.text) {
      const chatId = upd.message.chat.id;
      const fromId = upd.message.from ? upd.message.from.id : chatId;
      const username = upd.message.from
        ? upd.message.from.username || upd.message.from.first_name
        : "Propietario";
      const text = upd.message.text.trim();

      // Si aún no hay dueño vinculado, el primer /start o /vincular 9297971350 bloquea el bot para ti
      if (!this.adminChatId && (text.startsWith("/start") || text.startsWith("/vincular"))) {
        this.bindOwner(fromId, username);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text:
            `🔒 *¡Bot Clayface (@Clayfacefightbot) blindado en Modo Privado!*\n\n` +
            `👤 *Propietario único:* @${username}\n` +
            `🆔 *Tu TELEGRAM_ADMIN_CHAT_ID personal:* \`${fromId}\`\n\n` +
            `_(Guarda este número \`${fromId}\` para ponerlo en TELEGRAM_ADMIN_CHAT_ID cuando subas la web a Render. Nadie más podrá usar este bot)._`,
          parse_mode: "Markdown"
        });
        await this.sendMainMenu(chatId);
        return;
      }

      // Bloqueo estricto si escribe cualquier otra persona
      if (!this.isAuthorizedOwner(fromId, chatId)) {
        store.addLog(`🛑 Acceso denegado en @Clayfacefightbot a usuario externo: @${username} (ID: ${fromId})`);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text:
            "🔒 *ACCESO DENEGADO*\n\n*Clayface (@Clayfacefightbot)* es un bot privado y solo responde a su propietario.",
          parse_mode: "Markdown"
        });
        return;
      }

      if (text.startsWith("/start") || text.startsWith("/menu")) {
        await this.sendMainMenu(chatId);
      } else if (text.startsWith("/miid")) {
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `🔒 *Clayface Modo Privado*\n🆔 Tu Chat ID personal de propietario es: \`${fromId}\``,
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/verificar")) {
        const parts = text.split(/\s+/);
        const code = parts[1];
        if (!code) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/verificar 123456`",
            parse_mode: "Markdown"
          });
          return;
        }
        const resolved = store.resolveAuthRequest(code, "approve");
        if (resolved) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: `✅ *Verificación completada:* El usuario *${resolved.username}* (${resolved.telegramHandle}) ha sido verificado.`,
            parse_mode: "Markdown"
          });
        } else {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "❌ No se encontró ninguna solicitud pendiente con ese código.",
            parse_mode: "Markdown"
          });
        }
      } else if (text.startsWith("/pendientes")) {
        await this.sendPendingSubmissions(chatId);
      } else if (text.startsWith("/juegos")) {
        await this.sendGamesManagement(chatId);
      } else if (text.startsWith("/youtube")) {
        const parts = text.split(/\s+/);
        const newUrl = parts[1];
        const newHandle = parts[2];
        if (!newUrl) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/youtube https://www.youtube.com/@TuCanalNuevo @TuCanalNuevo`",
            parse_mode: "Markdown"
          });
          return;
        }
        const updated = store.updateYoutubeChannelUrl(newUrl, newHandle);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `✅ *Canal público de YouTube actualizado en la web:*\n🔗 ${updated.publicUrl}\n🏷 ${updated.handle}`,
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
          text: "🔒 Acceso denegado: Bot Privado.",
          show_alert: true
        });
        return;
      }

      if (data === "menu_main") {
        await this.sendMainMenu(chatId);
      } else if (data === "menu_pending") {
        await this.sendPendingSubmissions(chatId);
      } else if (data === "menu_auths") {
        await this.sendPendingAuths(chatId);
      } else if (data === "menu_games") {
        await this.sendGamesManagement(chatId);
      } else if (data === "menu_stats") {
        await this.sendStats(chatId);
      } else if (data.startsWith("sub_approve:")) {
        const subId = data.split(":")[1];
        const res = store.moderateSubmission(subId, "approve");
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: res ? `✅ Publicado: ${res.characterName}` : "Ya procesado"
        });
        await this.sendPendingSubmissions(chatId);
      } else if (data.startsWith("sub_reject:")) {
        const subId = data.split(":")[1];
        const res = store.moderateSubmission(subId, "reject");
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: res ? `❌ Rechazado: ${res.characterName}` : "Ya procesado"
        });
        await this.sendPendingSubmissions(chatId);
      } else if (data.startsWith("auth_approve:")) {
        const code = data.split(":")[1];
        const res = store.resolveAuthRequest(code, "approve");
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: res ? `✅ Usuario ${res.username} verificado` : "Código no encontrado"
        });
        await this.sendPendingAuths(chatId);
      } else if (data.startsWith("auth_reject:")) {
        const code = data.split(":")[1];
        const res = store.resolveAuthRequest(code, "reject");
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: res ? `🚫 Acceso denegado a ${res.username}` : "Código no encontrado"
        });
        await this.sendPendingAuths(chatId);
      }
    }
  }

  async sendMainMenu(chatId) {
    const pendingSubs = store.getSubmissions("pending").length;
    const pendingAuths = store.state.authRequests.filter((a) => a.status === "pending").length;

    const text =
      `🔒 *CLAYFACE (@Clayfacefightbot) — PANEL PRIVADO*\n` +
      `🆔 *Propietario vinculado:* \`${this.adminChatId}\`\n\n` +
      `• 📋 *Guías por aprobar:* ${pendingSubs}\n` +
      `• 🔐 *Verificaciones pendientes:* ${pendingAuths}\n` +
      `• 🎮 *Juegos activos:* ${store.getGames().length}`;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: `📋 Guías Pendientes (${pendingSubs})`, callback_data: "menu_pending" },
            { text: `🔐 Verificaciones (${pendingAuths})`, callback_data: "menu_auths" }
          ],
          [
            { text: "🎮 Juegos y Parches", callback_data: "menu_games" },
            { text: "📊 Estadísticas", callback_data: "menu_stats" }
          ]
        ]
      }
    });
  }

  async sendPendingSubmissions(chatId) {
    const pending = store.getSubmissions("pending");
    if (pending.length === 0) {
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: "✨ *No hay guías pendientes de moderación.* ¡Todo está al día!",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ Volver al Menú Privado", callback_data: "menu_main" }]]
        }
      });
      return;
    }

    for (const sub of pending) {
      const dlcLabel = sub.isDLC ? `💎 DLC: ${sub.dlcPack}` : "🎮 Juego Base";
      const text =
        `📌 *Propuesta #${sub.id}*\n` +
        `🕹 *Juego:* ${sub.gameTitle}\n` +
        `🥊 *Personaje:* *${sub.characterName}* (${dlcLabel})\n` +
        `⌨️ *Combo:* \`${sub.comboNotation}\`\n` +
        `📖 *Fuente/Notas:* ${sub.notes}`;

      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Aprobar y Publicar", callback_data: `sub_approve:${sub.id}` },
              { text: "❌ Rechazar", callback_data: `sub_reject:${sub.id}` }
            ]
          ]
        }
      });
    }
  }

  async sendPendingAuths(chatId) {
    const pending = store.state.authRequests.filter((a) => a.status === "pending");
    if (pending.length === 0) {
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: "🔐 *No hay solicitudes de verificación pendientes.*",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ Volver al Menú Privado", callback_data: "menu_main" }]]
        }
      });
      return;
    }

    for (const req of pending) {
      const text =
        `🔐 *Verificación Pendiente*\n` +
        `👤 *Usuario:* ${req.username} (${req.telegramHandle})\n` +
        `🔑 *Código:* \`${req.code}\``;

      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Autorizar", callback_data: `auth_approve:${req.code}` },
              { text: "🚫 Denegar", callback_data: `auth_reject:${req.code}` }
            ]
          ]
        }
      });
    }
  }

  async sendGamesManagement(chatId) {
    const games = store.getGames();
    const lines = games.map((g) => {
      const baseCount = g.characters.filter((c) => !c.isDLC).length;
      const dlcCount = g.characters.filter((c) => c.isDLC).length;
      return `• *${g.title}* — \`${g.currentPatch}\` (${baseCount} Base / ${dlcCount} DLC)`;
    });

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text: `🎮 *CATÁLOGO DE JUEGOS ACTIVOS*\n\n${lines.join("\n")}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Volver al Menú Privado", callback_data: "menu_main" }]]
      }
    });
  }

  async sendStats(chatId) {
    const games = store.getGames();
    let totalBase = 0;
    let totalDLC = 0;
    games.forEach((g) => {
      totalBase += g.characters.filter((c) => !c.isDLC).length;
      totalDLC += g.characters.filter((c) => c.isDLC).length;
    });

    const text =
      `📊 *ESTADÍSTICAS DE FGC VAULT*\n\n` +
      `• *Sagas Principales:* ${store.getSagas().length}\n` +
      `• *Juegos Documentados:* ${games.length}\n` +
      `• *Personajes Juego Base:* ${totalBase}\n` +
      `• *Personajes DLC (con Pack):* ${totalDLC}\n` +
      `• *Usuarios Verificados:* ${store.state.verifiedUsers.length}`;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Volver al Menú Privado", callback_data: "menu_main" }]]
      }
    });
  }
}

module.exports = new TelegramBotManager();
