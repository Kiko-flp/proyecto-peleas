const fs = require("fs");
const path = require("path");
const SEED_DATA = require("../data/seedData");

const DATA_DIR = path.join(__dirname, "../../data");
const DB_PATH = path.join(DATA_DIR, "runtime_db.json");

class DataStore {
  constructor() {
    this.state = null;
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        const saved = JSON.parse(raw);
        // Sincronizar siempre el catálogo completo de sagas, imágenes de portada y los 259 personajes
        this.state = {
          ...JSON.parse(JSON.stringify(SEED_DATA)),
          communityResources: saved.communityResources || SEED_DATA.communityResources,
          missingContentRoadmap: saved.missingContentRoadmap || SEED_DATA.missingContentRoadmap,
          ownerChatId: saved.ownerChatId || "",
          authRequests: saved.authRequests || [],
          verifiedUsers: saved.verifiedUsers || SEED_DATA.verifiedUsers,
          submissions: saved.submissions || SEED_DATA.submissions,
          botLogs: saved.botLogs || []
        };
        this.save();
      } else {
        this.state = JSON.parse(JSON.stringify(SEED_DATA));
        this.state.ownerChatId = "";
        this.state.authRequests = [];
        this.state.botLogs = [
          {
            id: "log-1",
            time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            event: "Sistema FGC Vault inicializado con 259 personajes y Bot Privado Clayface."
          }
        ];
        this.save();
      }
    } catch (err) {
      this.state = JSON.parse(JSON.stringify(SEED_DATA));
      this.state.ownerChatId = "";
      this.state.authRequests = [];
      this.state.botLogs = [];
    }
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(this.state, null, 2), "utf-8");
    } catch (_) {
      // En memoria si no se puede escribir en disco
    }

    // Sincronización automática en la nube si se configura CLOUD_SYNC_URL (Supabase / Firebase / Webhook)
    const cloudUrl = process.env.CLOUD_SYNC_URL;
    if (cloudUrl) {
      fetch(cloudUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customNews: this.state.customNews || [],
          communityResources: this.state.communityResources || [],
          missingContentRoadmap: this.state.missingContentRoadmap || [],
          ownerChatId: this.state.ownerChatId || ""
        })
      }).catch(() => {});
    }
  }

  addLog(eventText) {
    const entry = {
      id: "log-" + Date.now(),
      time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      event: eventText
    };
    this.state.botLogs.unshift(entry);
    if (this.state.botLogs.length > 35) {
      this.state.botLogs.pop();
    }
    this.save();
    return entry;
  }

  getSagas() {
    return this.state.sagas;
  }

  getGames(sagaId = null) {
    if (!sagaId || sagaId === "all") return this.state.games;
    return this.state.games.filter((g) => g.sagaId === sagaId);
  }

  getGameById(gameId) {
    return this.state.games.find((g) => g.id === gameId) || null;
  }

  getSubmissions(status = null) {
    if (!status) return this.state.submissions;
    return this.state.submissions.filter((s) => s.status === status);
  }

  getCommunityResources() {
    return this.state.communityResources || [];
  }

  getMissingContentRoadmap() {
    return this.state.missingContentRoadmap || [];
  }

  getCustomNews() {
    return this.state.customNews || [];
  }

  addCustomNewsItem({ saga, category, title, summary, sourceUrl }) {
    if (!this.state.customNews) this.state.customNews = [];
    const isoDate = new Date().toISOString().slice(0, 10);
    const item = {
      id: "news-bot-" + Date.now(),
      category: category || "Competitivo / Torneos",
      saga: saga || "FGC General",
      title: title.trim(),
      isoDate,
      date: isoDate,
      sourceName: "FGC Vault Oficial",
      sourceUrl: sourceUrl || "https://fgc-vault.onrender.com",
      imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg",
      summary: summary.trim()
    };
    this.state.customNews.unshift(item);
    this.addLog(`Noticia publicada desde Bot: ${item.title}`);
    this.save();
    return item;
  }

  removeCommunityResource(resId) {
    if (!this.state.communityResources) return false;
    const before = this.state.communityResources.length;
    this.state.communityResources = this.state.communityResources.filter((r) => r.id !== resId);
    this.save();
    return this.state.communityResources.length < before;
  }

  completeMissingRoadmapItem(missId) {
    if (!this.state.missingContentRoadmap) return null;
    const item = this.state.missingContentRoadmap.find((m) => m.id === missId);
    if (!item) return null;
    this.state.missingContentRoadmap = this.state.missingContentRoadmap.filter((m) => m.id !== missId);
    this.addLog(`Tarea de hoja de ruta completada: ${item.area} (${item.target})`);
    this.save();
    return item;
  }

  addMissingRoadmapItem(target, whatIsMissing, area = "Prioridad Propietario") {
    if (!this.state.missingContentRoadmap) this.state.missingContentRoadmap = [];
    const item = {
      id: "miss-" + Date.now(),
      area,
      target: target.trim(),
      priority: "Alta",
      whatIsMissing: whatIsMissing.trim(),
      purposeForEvaluation: "Añadido directamente desde el Bot Privado de Telegram."
    };
    this.state.missingContentRoadmap.unshift(item);
    this.save();
    return item;
  }

  addCharacterVideoPause(gameId, charQuery, timestamp, title, explanation) {
    const game = this.getGameById(gameId);
    if (!game) return null;
    const q = charQuery.trim().toLowerCase();
    const ch = game.characters.find(
      (c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase() === q
    );
    if (!ch) return null;
    if (!ch.spanishCompilation) {
      ch.spanishCompilation = {
        subtitleLang: "Español (CC activados + Traducción paso a paso)",
        compilationNote: `Recopilación traducida al español de ${ch.name}.`,
        pauses: []
      };
    }
    const parts = timestamp.split(":").map(Number);
    const seconds = parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
    ch.spanishCompilation.pauses.push({
      timestamp,
      seconds,
      title: title || `Pausa explicativa (${timestamp})`,
      explanation
    });
    this.save();
    return ch;
  }

  addCommunityResource(payload) {
    const newItem = {
      id: "res-" + Date.now(),
      category: (payload.category || "Wiki / Canal de YouTube").trim(),
      targetGame: (payload.targetGame || "General FGC").trim(),
      title: (payload.title || "Recurso de la comunidad").trim(),
      url: (payload.url || "#").trim(),
      description: (payload.description || "").trim(),
      missingNotes: (payload.missingNotes || "Sin especificar").trim(),
      author: (payload.author || "Comunidad").trim(),
      status: "approved",
      createdAt: new Date().toLocaleDateString("es-ES")
    };
    this.state.communityResources.unshift(newItem);

    // Si además indicó algo que falta, lo añadimos a la tabla de valoración de lo que falta
    if (payload.missingNotes && payload.missingNotes.trim().length > 5) {
      this.state.missingContentRoadmap.unshift({
        id: "miss-" + Date.now(),
        area: payload.category || "Aporte de Usuario",
        target: newItem.targetGame,
        priority: "Pendiente de Valorar",
        whatIsMissing: payload.missingNotes.trim(),
        purposeForEvaluation: `Propuesto por ${newItem.author} junto con el recurso "${newItem.title}"`
      });
    }

    this.save();
    return newItem;
  }

  createSubmission(payload) {
    const game = this.getGameById(payload.gameId);
    const newSub = {
      id: "sub-" + Math.floor(100 + Math.random() * 900),
      gameId: payload.gameId,
      gameTitle: game ? game.title : payload.gameId,
      characterName: payload.characterName,
      archetype: payload.archetype || "Versátil / Competitivo",
      difficulty: payload.difficulty || "Media",
      isDLC: Boolean(payload.isDLC),
      dlcPack: payload.isDLC ? (payload.dlcPack || "Season Pass DLC") : null,
      author: payload.author || "Comunidad_FGC",
      type: payload.isDLC ? `Personaje DLC (${payload.dlcPack || "Pack"})` : "Personaje Base / Guía",
      comboNotation: payload.comboNotation,
      notes: payload.notes || "Guía enviada por la comunidad y pendiente de verificación.",
      videoUrl: payload.videoUrl || "https://www.youtube.com/embed/u7pTIg7vKBM",
      sourceUrl: payload.sourceUrl || "https://wiki.supercombo.gg/",
      status: "pending",
      createdAt: "Ahora mismo"
    };
    this.state.submissions.unshift(newSub);
    this.addLog(`Nueva propuesta enviada: ${newSub.characterName} (${newSub.gameTitle}) por ${newSub.author}`);
    this.save();
    return newSub;
  }

  moderateSubmission(subId, action) {
    const sub = this.state.submissions.find((s) => s.id === subId);
    if (!sub) return null;

    if (action === "approve") {
      sub.status = "approved";
      const game = this.getGameById(sub.gameId);
      if (game) {
        const existingChar = game.characters.find(
          (c) => c.name.toLowerCase() === sub.characterName.toLowerCase()
        );
        if (existingChar) {
          existingChar.combos.push({
            type: `Aporte Verificado (${sub.author})`,
            notation: sub.comboNotation,
            damage: "Verificado"
          });
        } else {
          const slug = sub.characterName.toLowerCase().replace(/[^a-z0-9]/g, "-");
          game.characters.push({
            id: `${sub.gameId}-${slug}`,
            name: sub.characterName,
            archetype: sub.archetype || "Competitivo",
            difficulty: sub.difficulty || "Media",
            isDLC: Boolean(sub.isDLC),
            dlcPack: sub.isDLC ? (sub.dlcPack || "Season Pass DLC") : null,
            recommendedSubSystem: game.subSystemName,
            iconUrl: `/api/char-icon?name=${encodeURIComponent(sub.characterName)}&game=${sub.gameId}&bg=${sub.isDLC ? "2e1065" : "0f172a"}&border=${sub.isDLC ? "a855f7" : "f59e0b"}`,
            videoUrl: sub.videoUrl || game.basicGuide.videoUrl,
            sourceUrl: sub.sourceUrl || (game.officialSources[0] ? game.officialSources[0].url : "#"),
            overview: sub.notes,
            keyMoves: [
              { input: "Movimiento Principal", frames: "Verificado", notes: sub.notes }
            ],
            combos: [
              { type: "Combo Principal BnB", notation: sub.comboNotation, damage: "Óptimo" }
            ],
            gameplan: sub.notes
          });
        }
      }
      this.addLog(`Guía APROBADA desde Bot: ${sub.characterName} en ${sub.gameTitle}`);
    } else if (action === "reject") {
      sub.status = "rejected";
      this.addLog(`Guía RECHAZADA desde Bot: ${sub.characterName} (${sub.id})`);
    }

    this.save();
    return sub;
  }

  updateGamePatch(gameId, newPatch) {
    const game = this.getGameById(gameId);
    if (!game) return null;
    game.currentPatch = newPatch;
    this.addLog(`Parche actualizado en ${game.title}: ${newPatch}`);
    this.save();
    return game;
  }

  updateYoutubeChannelUrl(newUrl, newHandle) {
    if (!this.state.youtubeChannel) return null;
    if (newUrl) this.state.youtubeChannel.publicUrl = newUrl.trim();
    if (newHandle) this.state.youtubeChannel.handle = newHandle.trim();
    this.save();
    return this.state.youtubeChannel;
  }

  createAuthRequest(username, telegramHandle, role = "Colaborador Verificado") {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const reqObj = {
      id: "auth-" + Date.now(),
      username: username.trim(),
      telegramHandle: telegramHandle.startsWith("@") ? telegramHandle.trim() : `@${telegramHandle.trim()}`,
      role,
      code,
      status: "pending",
      createdAt: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    };
    this.state.authRequests.unshift(reqObj);
    this.addLog(`Solicitud de verificación Telegram para ${reqObj.username} (${reqObj.telegramHandle}) - Código: ${code}`);
    this.save();
    return reqObj;
  }

  resolveAuthRequest(codeOrId, decision) {
    const reqObj = this.state.authRequests.find(
      (r) => r.code === String(codeOrId).trim() || r.id === String(codeOrId).trim()
    );
    if (!reqObj) return null;

    if (decision === "approve") {
      reqObj.status = "approved";
      const existing = this.state.verifiedUsers.find(
        (u) => u.username.toLowerCase() === reqObj.username.toLowerCase()
      );
      if (!existing) {
        this.state.verifiedUsers.unshift({
          id: "usr-" + Date.now(),
          username: reqObj.username,
          role: reqObj.role,
          telegramHandle: reqObj.telegramHandle,
          verified: true,
          verifiedAt: new Date().toISOString().slice(0, 10)
        });
      }
      this.addLog(`Usuario VERIFICADO vía Telegram: ${reqObj.username} (${reqObj.telegramHandle})`);
    } else {
      reqObj.status = "rejected";
      this.addLog(`Solicitud de acceso DENEGADA para: ${reqObj.username}`);
    }

    this.save();
    return reqObj;
  }
}

module.exports = new DataStore();
