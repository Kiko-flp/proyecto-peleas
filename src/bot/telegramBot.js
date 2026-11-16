/**
 * Motor del Bot de Telegram PRIVADO (@Clayfacefightbot - "Clayface") — Versión v13
 * Alineado con todas las funciones actuales de FGC Vault:
 * 1. Moderación de Wikis, Canales de YouTube y Aportes de la comunidad con botones Inline.
 * 2. Gestión de la Hoja de Ruta ("Qué falta y a qué corresponde") para valorar y marcar tareas completadas.
 * 3. Publicación y consulta de Noticias FGC & Competitivo desde Telegram (/noticia).
 * 4. Consulta rápida en Telegram de Frame Data, Hitboxes, Combos, Ventajas y Counters de los 271 personajes (/ficha).
 * 5. Gestor del Canal de YouTube: Guiones traducidos al español, asignación de vídeos y creación de Pausas Explicativas (/yt_pausa).
 * 6. Modo Privado Estricto exclusivo para el propietario.
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
      store.addLog(`🔒 Bot ${this.botFirstName} (${this.botUsername}) conectado — ${ownerStatus}`);
      this.isPolling = true;
      this.pollLoop();
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
  // NOTIFICACIONES SALIENTES AL PROPIETARIO
  // =========================================================================
  async sendOwnerOtpCode(otpCode) {
    if (!this.isConfigured() || !this.adminChatId) return false;
    const ownerChat = this.adminChatId.split(",")[0].trim();

    const text =
      `🔐 *CÓDIGO DE ACCESO ÚNICO — FGC VAULT*\n\n` +
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
      `🌐 *NUEVO APORTE DE WIKI / CANAL / QUÉ FALTA*\n\n` +
      `🏷 *Tipo:* ${item.category}\n` +
      `🎮 *Juego / Destino:* ${item.targetGame}\n` +
      `📌 *Título:* *${item.title}*\n` +
      `🔗 *URL:* ${item.url}\n` +
      `📝 *Descripción:* ${item.description}\n` +
      `📋 *Resumen de qué falta (para valorar):*\n_${item.missingNotes}_\n` +
      `✍️ *Autor:* ${item.author}`;

    await this.callTelegram("sendMessage", {
      chat_id: ownerChat,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Mantener Publicado", callback_data: `res_keep:${item.id}` },
            { text: "🗑 Eliminar Aporte", callback_data: `res_del:${item.id}` }
          ],
          [{ text: "📋 Ver Resumen de Qué Falta", callback_data: "menu_roadmap" }]
        ]
      }
    });
  }

  async notifyNewAuthRequest(authReq) {
    if (!this.isConfigured() || !this.adminChatId) return;
    const ownerChat = this.adminChatId.split(",")[0].trim();

    const text =
      `🔐 *SOLICITUD DE VERIFICACIÓN*\n` +
      `👤 *Usuario:* \`${authReq.username}\` (${authReq.telegramHandle})\n` +
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
      `🥊 *NUEVA PROPUESTA DE PERSONAJE / GUÍA*\n` +
      `🕹 *Juego:* ${sub.gameTitle} — *${sub.characterName}*\n` +
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
  // MANEJO DE COMANDOS Y BOTONES EN TELEGRAM
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
            `🔒 *¡Bot Clayface (@Clayfacefightbot) blindado en Modo Privado!*\n\n` +
            `👤 *Propietario único:* @${username}\n` +
            `🆔 *Tu TELEGRAM_ADMIN_CHAT_ID personal:* \`${fromId}\``,
          parse_mode: "Markdown"
        });
        await this.sendMainMenu(chatId);
        return;
      }

      if (!this.isAuthorizedOwner(fromId, chatId)) {
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: "🔒 *ACCESO DENEGADO*\nEste bot es privado y exclusivo de su propietario.",
          parse_mode: "Markdown"
        });
        return;
      }

      if (text.startsWith("/start") || text.startsWith("/menu")) {
        await this.sendMainMenu(chatId);
      } else if (text.startsWith("/miid")) {
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `🔒 *Clayface Modo Privado*\n🆔 Tu Chat ID personal es: \`${fromId}\``,
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/backup")) {
        const snapshot = {
          updatedAt: new Date().toISOString(),
          customNewsCount: store.getCustomNews().length,
          communityResourcesCount: store.getCommunityResources().length,
          missingRoadmapCount: store.getMissingContentRoadmap().length,
          customNews: store.getCustomNews(),
          communityResources: store.getCommunityResources(),
          missingContentRoadmap: store.getMissingContentRoadmap()
        };
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text:
            `☁️ *COPIA DE SEGURIDAD INSTANTÁNEA (CLOUD SNAPSHOT)*\n\n` +
            `• Noticias propias: ${snapshot.customNewsCount}\n` +
            `• Fuentes registradas: ${snapshot.communityResourcesCount}\n` +
            `• Puntos en Hoja de Ruta: ${snapshot.missingRoadmapCount}\n\n` +
            `\`\`\`json\n${JSON.stringify(snapshot, null, 2).slice(0, 3200)}\n\`\`\``,
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/ficha")) {
        // /ficha <juego> <personaje> -> Devuelve Frame Data, Combos, Ventajas y Counters
        const parts = text.split(/\s+/);
        const gameId = parts[1];
        const charQuery = parts.slice(2).join(" ");
        await this.sendCharacterFicha(chatId, gameId, charQuery);
      } else if (text.startsWith("/noticia")) {
        // /noticia <Saga> | <Título> | <Resumen> | <URL>
        const rawArgs = text.replace(/^\/noticia\s*/i, "");
        const segments = rawArgs.split("|").map((s) => s.trim());
        if (segments.length < 3) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text:
              "⚠️ *Publicar Noticia FGC en la web:*\n" +
              "Usa el formato separado por `|`:\n" +
              "`/noticia Tekken 8 | Nuevo Torneo Master | Resumen de la noticia aquí | https://tekkenworldtour.com`",
            parse_mode: "Markdown"
          });
          return;
        }
        const created = store.addCustomNewsItem({
          saga: segments[0],
          category: "Competitivo / Torneos",
          title: segments[1],
          summary: segments[2],
          sourceUrl: segments[3] || "https://fgc-vault.onrender.com"
        });
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `✅ *Noticia publicada en la web:*\n📰 *${created.title}* (${created.saga} • ${created.isoDate})`,
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/falta")) {
        // /falta <Juego/Área> | <Qué falta para valorar>
        const rawArgs = text.replace(/^\/falta\s*/i, "");
        const segments = rawArgs.split("|").map((s) => s.trim());
        if (segments.length < 2) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/falta Mortal Kombat 1 | Añadir guía de Kameo Mavado y Janet Cage`",
            parse_mode: "Markdown"
          });
          return;
        }
        const added = store.addMissingRoadmapItem(segments[0], segments[1]);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: `📌 *Añadido al Resumen de Qué Falta:*\n🎮 *Destino:* ${added.target}\n📝 *Pendiente:* ${added.whatIsMissing}`,
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/parche")) {
        // /parche <gameId> <nuevo parche>
        const parts = text.split(/\s+/);
        const gameId = parts[1];
        const newPatch = parts.slice(2).join(" ");
        if (!gameId || !newPatch) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text: "⚠️ Uso: `/parche tekken8 Parche v3.03 (Balance Season 3)`",
            parse_mode: "Markdown"
          });
          return;
        }
        const updated = store.updateGamePatch(gameId, newPatch);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: updated
            ? `✅ *Parche actualizado en ${updated.title}:* \`${updated.currentPatch}\``
            : "❌ Juego no encontrado (usa: mk1, sf6, tekken8, dbfz, gg-strive, ssbu).",
          parse_mode: "Markdown"
        });
      } else if (text.startsWith("/yt_pausa")) {
        // /yt_pausa <gameId> <personaje> <MM:SS> | <Título> | <Explicación>
        const rawArgs = text.replace(/^\/yt_pausa\s*/i, "");
        const [firstBlock, pauseTitle, pauseExp] = rawArgs.split("|").map((s) => (s || "").trim());
        const firstParts = (firstBlock || "").split(/\s+/);
        const gameId = firstParts[0];
        const timeStr = firstParts[firstParts.length - 1];
        const charQuery = firstParts.slice(1, -1).join(" ");

        if (!gameId || !charQuery || !timeStr || !pauseExp) {
          await this.callTelegram("sendMessage", {
            chat_id: chatId,
            text:
              "⚠️ *Añadir Pausa Explicativa en Español al vídeo de un personaje:*\n" +
              "`/yt_pausa mk1 Scorpion 01:30 | Pausa Antiaéreo | Aquí pausamos para ver la hitbox de su d+2`",
            parse_mode: "Markdown"
          });
          return;
        }
        const ch = store.addCharacterVideoPause(gameId, charQuery, timeStr, pauseTitle, pauseExp);
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text: ch
            ? `⏸ *Pausa explicativa añadida a ${ch.name} (${timeStr}):*\n_${pauseExp}_`
            : "❌ No se encontró el personaje.",
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
            text: "⚠️ Uso: `/yt_guion mk1 Scorpion` o `/yt_guion tekken8 Reina`",
            parse_mode: "Markdown"
          });
          return;
        }
        await this.callTelegram("sendMessage", {
          chat_id: chatId,
          text:
            `🎬 *RECOPILACIÓN EN ESPAÑOL + SUBTÍTULOS + PAUSAS*\n` +
            `📂 *Lista:* ${seo.playlistTarget || gameId}\n` +
            `*Título:* \`${seo.title}\`\n\n` +
            `*Descripción con Pausas y Matchups:*\n\`\`\`\n${seo.description}\n\`\`\``,
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
          text: assigned
            ? `✅ *Vídeo con subtítulos ES vinculado a:* ${assigned.type} — *${assigned.target}*`
            : "❌ No se encontró el juego o personaje.",
          parse_mode: "Markdown"
        });
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
          text: `✅ *Canal público actualizado:* ${updated.publicUrl} (${updated.handle})`,
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
      } else if (data === "menu_resources") {
        await this.sendCommunityResourcesMenu(chatId);
      } else if (data === "menu_roadmap") {
        await this.sendMissingRoadmapMenu(chatId);
      } else if (data === "menu_news") {
        await this.sendNewsMenu(chatId);
      } else if (data === "menu_framedata") {
        await this.sendFrameDataHelp(chatId);
      } else if (data === "menu_youtube") {
        await this.sendYoutubeManagerMenu(chatId);
      } else if (data === "menu_games") {
        await this.sendGamesManagement(chatId);
      } else if (data.startsWith("res_keep:")) {
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: "✅ Recurso verificado y mantenido en la web"
        });
      } else if (data.startsWith("res_del:")) {
        const resId = data.split(":")[1];
        const removed = store.removeCommunityResource(resId);
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: removed ? "🗑 Aporte eliminado de la web" : "Ya eliminado"
        });
        await this.sendCommunityResourcesMenu(chatId);
      } else if (data.startsWith("miss_done:")) {
        const missId = data.split(":")[1];
        const done = store.completeMissingRoadmapItem(missId);
        await this.callTelegram("answerCallbackQuery", {
          callback_query_id: cb.id,
          text: done ? `✅ Completado: ${done.area}` : "Ya completado"
        });
        await this.sendMissingRoadmapMenu(chatId);
      }
    }
  }

  // =========================================================================
  // MENÚS INTERACTIVOS DE CLAYFACE ACTUALIZADOS A LAS NUEVAS FUNCIONES
  // =========================================================================
  async sendMainMenu(chatId) {
    const games = store.getGames();
    let totalChars = 0;
    games.forEach((g) => {
      totalChars += g.characters.length;
    });
    const commCount = store.getCommunityResources().length;
    const roadmapCount = store.getMissingContentRoadmap().length;

    const text =
      `🔒 *CLAYFACE (@Clayfacefightbot) — CENTRO DE CONTROL FGC VAULT*\n\n` +
      `• 🎮 *Juegos y Plantel:* ${games.length} juegos (${totalChars} personajes con Hitboxes y Counters)\n` +
      `• 🌐 *Wikis y Canales registrados:* ${commCount}\n` +
      `• 📋 *Puntos en "Qué Falta" para valorar:* ${roadmapCount}\n` +
      `• 🎬 *Canal YouTube:* Listas por juego con subtítulos ES y pausas\n\n` +
      `Selecciona qué área quieres gestionar:`;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: `🌐 Wikis y Canales (${commCount})`, callback_data: "menu_resources" },
            { text: `📋 Qué Falta (${roadmapCount})`, callback_data: "menu_roadmap" }
          ],
          [
            { text: "📰 Noticias y Competitivo", callback_data: "menu_news" },
            { text: "🥊 Frame Data y Counters", callback_data: "menu_framedata" }
          ],
          [
            { text: "🎬 Canal YouTube y Pausas ES", callback_data: "menu_youtube" },
            { text: "🎮 Juegos y Parches", callback_data: "menu_games" }
          ]
        ]
      }
    });
  }

  async sendCommunityResourcesMenu(chatId) {
    const resources = store.getCommunityResources().slice(0, 5);
    if (resources.length === 0) {
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: "🌐 No hay wikis ni canales registrados.",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ Volver al Menú", callback_data: "menu_main" }]]
        }
      });
      return;
    }

    for (const r of resources) {
      const text =
        `🌐 *${r.title}* (${r.category})\n` +
        `🎮 *Juego:* ${r.targetGame}\n` +
        `🔗 ${r.url}\n` +
        `📋 *Qué aporta/falta:* _${r.missingNotes}_`;

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
        text: "✨ *¡Todas las tareas de la hoja de ruta están completadas!*\nUsa `/falta <Juego> | <Qué falta>` para añadir una nueva.",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ Volver al Menú", callback_data: "menu_main" }]]
        }
      });
      return;
    }

    for (const m of items.slice(0, 6)) {
      const text =
        `📋 *${m.area}* — *${m.target}*\n` +
        `🏷 *Prioridad:* ${m.priority}\n` +
        `❗ *Qué falta:* ${m.whatIsMissing}\n` +
        `💡 *Para valorar:* _${m.purposeForEvaluation}_`;

      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Marcar como Completado", callback_data: `miss_done:${m.id}` },
              { text: "⬅️ Menú", callback_data: "menu_main" }
            ]
          ]
        }
      });
    }
  }

  async sendNewsMenu(chatId) {
    const custom = store.getCustomNews();
    const recent = [...custom, ...CURATED_FGC_NEWS].slice(0, 4);
    const lines = recent.map((n) => `• *[${n.isoDate}] ${n.saga}:* ${n.title}`);

    const text =
      `📰 *GESTIÓN DE NOTICIAS FGC Y COMPETITIVO*\n\n` +
      `*Últimos titulares activos:*\n${lines.join("\n")}\n\n` +
      `➕ *Para publicar una noticia nueva en la web:*\n` +
      `\`/noticia <Saga> | <Título> | <Resumen> | <URL>\``;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Volver al Menú", callback_data: "menu_main" }]]
      }
    });
  }

  async sendFrameDataHelp(chatId) {
    const text =
      `🥊 *CONSULTA RÁPIDA DE FRAME DATA, HITBOXES Y COUNTERS*\n\n` +
      `Escribe \`/ficha <id_juego> <personaje>\` para ver al instante todos sus datos competitivos:\n\n` +
      `*Ejemplos:*\n` +
      `• \`/ficha mk1 Scorpion\`\n` +
      `• \`/ficha sf6 Akuma\`\n` +
      `• \`/ficha tekken8 Armor King\`\n` +
      `• \`/ficha dbfz Gogeta\`\n` +
      `• \`/ficha gg-strive Baiken\`\n` +
      `• \`/ficha ssbu Corrin\``;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Volver al Menú", callback_data: "menu_main" }]]
      }
    });
  }

  async sendCharacterFicha(chatId, gameId, charQuery) {
    const game = store.getGameById(gameId);
    if (!game || !charQuery) {
      await this.sendFrameDataHelp(chatId);
      return;
    }
    const q = charQuery.toLowerCase();
    const ch = game.characters.find(
      (c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    );
    if (!ch) {
      await this.callTelegram("sendMessage", {
        chat_id: chatId,
        text: `❌ No se encontró "${charQuery}" en ${game.title}.`,
        parse_mode: "Markdown"
      });
      return;
    }

    const dlcTag = ch.isDLC ? `💎 DLC (${ch.dlcPack})` : "🎮 Juego Base";
    const sampleMoves = (ch.frameDataCards || [])
      .slice(0, 5)
      .map((m) => `• *${m.moveName}* (\`${m.input}\`): ${m.startup} | ${m.active} | ${m.onBlock}`)
      .join("\n");
    const favs = (ch.matchups?.favorable || [])
      .map((f) => `🟢 *Ventaja vs ${f.opponentName}:* ${f.reason}`)
      .join("\n");
    const cnts = (ch.matchups?.counters || [])
      .map((c) => `🔴 *Counter (${c.opponentName}):* ${c.reason}`)
      .join("\n");

    const text =
      `🥊 *${ch.name.toUpperCase()} — ${game.title}*\n` +
      `${dlcTag} • *Arquetipo:* ${ch.archetype}\n\n` +
      `📊 *MUESTRA DE FRAME DATA (${(ch.frameDataCards || []).length} ataques con Hitbox en web):*\n${sampleMoves}\n\n` +
      `⚔️ *MATCHUPS (VENTAJAS Y COUNTERS):*\n${favs}\n\n${cnts}`;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Volver al Menú", callback_data: "menu_main" }]]
      }
    });
  }

  async sendYoutubeManagerMenu(chatId) {
    const yt = store.state.youtubeChannel || {};
    const text =
      `🎬 *GESTOR DEL CANAL DE YOUTUBE — ${yt.handle || "@FGCVaultES"}*\n` +
      `*(Recopilaciones Traducidas al Español + Subtítulos ES + Pausas por Juego)*\n\n` +
      `🔗 *Canal público:* ${yt.publicUrl || "https://www.youtube.com/@FGCVaultES"}\n` +
      `📂 *Listas por Juego activas:* ${(yt.playlistsByGame || []).length}\n\n` +
      `*Comandos de gestión:*\n` +
      `• \`/yt_guion <juego> <personaje>\` — Genera guion en español, pausas y etiquetas.\n` +
      `• \`/yt_pausa <juego> <personaje> <MM:SS> | <Título> | <Explicación>\` — Añade una nueva pausa explicativa en español al vídeo de ese personaje.\n` +
      `• \`/yt_asignar <juego> <personaje> <url>\` — Conecta un vídeo subido a la ficha del personaje.\n` +
      `• \`/youtube <url> <@handle>\` — Actualiza el enlace del canal.`;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Volver al Menú", callback_data: "menu_main" }]]
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
      `🎮 *CATÁLOGO DE JUEGOS Y PARCHES ACTIVOS*\n\n` +
      `${lines.join("\n")}\n\n` +
      `🔄 *Para cambiar el parche de un juego:*\n` +
      `\`/parche <id_juego> <Nombre del nuevo parche>\``;

    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "⬅️ Volver al Menú", callback_data: "menu_main" }]]
      }
    });
  }
}

module.exports = new TelegramBotManager();
