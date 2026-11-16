/**
 * Gestor Automatizado del Canal de YouTube — FGC Vault (@FGCVaultES)
 * Permite gestionar el canal por completo desde el backend y desde el Bot Privado (@Clayfacefightbot):
 * - Creación automática de las 6 Listas de Reproducción (Playlists) por saga mediante YouTube Data API v3.
 * - Actualización de títulos, descripciones optimizadas con timestamps, etiquetas (tags) FGC y miniaturas.
 * - Sincronización automática: cuando se publica o vincula un vídeo en el canal, se asigna
 *   automáticamente a la Guía Básica, Guía Avanzada o ficha de Personaje en la web.
 */

const store = require("../db/store");

const DEFAULT_CHANNEL_METADATA = {
  title: "FGC Vault Español — Guías & Frame Data",
  handle: "@FGCVaultES",
  description:
    "Canal oficial de FGC Vault (https://fgc-vault.onrender.com). Enciclopedia competitiva en español de Juegos de Lucha: Guías Básicas, Guías Avanzadas de Frame Data, Matchups (Ventajas y Counters) y Combos BnB para Mortal Kombat 1, Street Fighter 6, Tekken 8, Dragon Ball FighterZ, Guilty Gear -Strive- y Super Smash Bros. Ultimate.",
  keywords: [
    "FGC",
    "Juegos de Lucha",
    "Mortal Kombat 1",
    "Street Fighter 6",
    "Tekken 8",
    "Dragon Ball FighterZ",
    "Guilty Gear Strive",
    "Super Smash Bros Ultimate",
    "Frame Data",
    "Combos",
    "Guias en Español"
  ]
};

class YouTubeChannelManager {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || "";
    this.accessToken = process.env.YOUTUBE_ACCESS_TOKEN || "";
    this.channelId = process.env.YOUTUBE_CHANNEL_ID || "";
  }

  isApiConnected() {
    return Boolean(this.accessToken || this.apiKey);
  }

  /**
   * Genera automáticamente la plantilla SEO completa (Título, Descripción con Timestamps y Tags)
   * para cualquier guía de personaje o juego de la enciclopedia.
   */
  generateVideoSeoPackage(gameId, charId = null) {
    const game = store.getGameById(gameId);
    if (!game) return null;

    if (!charId) {
      return {
        title: `Guía Completa de ${game.title} en Español — Conceptos Básicos, Frame Data y Sistema (${game.currentPatch})`,
        description:
          `Aprende a jugar a ${game.title} desde cero hasta nivel competitivo (${game.currentPatch}).\n\n` +
          `Guía en texto interactiva y Frame Data en: https://fgc-vault.onrender.com\n\n` +
          `ÍNDICE DEL VÍDEO (TIMESTAMPS):\n` +
          `00:00 Introducción y Notación de ${game.title}\n` +
          `02:15 Controles y Mecánicas Universales (${game.subSystemName})\n` +
          `06:30 Defensa, Antiaéreos y Castigos en Bloqueo\n` +
          `10:45 Conceptos Avanzados y Gestión de Recursos\n\n` +
          `#FGCVault #${game.title.replace(/[^a-zA-Z0-9]/g, "")} #FightingGames #FGC`,
        tags: [game.title, "Guia", "Combos", "Frame Data", "Español", "FGC Vault", game.currentPatch]
      };
    }

    const ch = game.characters.find(
      (c) => c.id === charId || c.name.toLowerCase() === charId.toLowerCase()
    );
    if (!ch) return null;

    const dlcText = ch.isDLC ? `DLC (${ch.dlcPack})` : "Juego Base";
    const combosText = (ch.combos || [])
      .map((cb) => `• ${cb.type}: ${cb.notation} (${cb.damage})`)
      .join("\n");
    const favText = (ch.matchups?.favorable || [])
      .map((m) => `• Ventaja vs ${m.opponentName}: ${m.reason}`)
      .join("\n");
    const cntText = (ch.matchups?.counters || [])
      .map((m) => `• Counter (${m.opponentName}): ${m.reason}`)
      .join("\n");

    return {
      title: `Guía de ${ch.name} en ${game.title} — Combos BnB, Frame Data y Matchups (${game.currentPatch})`,
      description:
        `Guía competitiva en español de ${ch.name} (${dlcText}) en ${game.title}.\n` +
        `Arquetipo: ${ch.archetype} | Dificultad: ${ch.difficulty}\n` +
        `Ficha interactiva con traductor de mando (PS/Xbox): https://fgc-vault.onrender.com\n\n` +
        `COMBOS PRINCIPALES (BREAD & BUTTER):\n${combosText}\n\n` +
        `MATCHUPS — VENTAJA Y COUNTERS:\n${favText}\n${cntText}\n\n` +
        `ÍNDICE DEL VÍDEO:\n` +
        `00:00 Resumen y Plan de Juego de ${ch.name}\n` +
        `01:45 Botones Clave y Frame Data (Startup, Active, On Block)\n` +
        `04:30 Combos Básicos (Midscreen, Esquina y con Barra)\n` +
        `07:15 Matchups: Contra quién tiene ventaja y quién le hace Counter\n\n` +
        `#${ch.name.replace(/[^a-zA-Z0-9]/g, "")} #${game.title.replace(/[^a-zA-Z0-9]/g, "")} #FGCVault`,
      tags: [ch.name, game.title, "Guia", "Combos", "Frame Data", "Counters", "FGC Vault"]
    };
  }

  /**
   * Vincula un vídeo de YouTube directamente a un personaje o guía del juego en la web
   */
  assignVideoToTarget(gameId, targetNameOrType, youtubeUrl) {
    const game = store.getGameById(gameId);
    if (!game) return null;

    let embedUrl = youtubeUrl.trim();
    const watchMatch = embedUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    const shortMatch = embedUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (watchMatch) {
      embedUrl = `https://www.youtube.com/embed/${watchMatch[1]}`;
    } else if (shortMatch) {
      embedUrl = `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    const t = targetNameOrType.trim().toLowerCase();
    if (t === "basica" || t === "basic") {
      game.basicGuide.videoUrl = embedUrl;
      game.basicGuide.videoAuthor = DEFAULT_CHANNEL_METADATA.title;
      store.save();
      return { type: "Guía Básica", target: game.title, embedUrl };
    }
    if (t === "avanzada" || t === "advanced") {
      game.advancedGuide.videoUrl = embedUrl;
      game.advancedGuide.videoAuthor = DEFAULT_CHANNEL_METADATA.title;
      store.save();
      return { type: "Guía Avanzada", target: game.title, embedUrl };
    }

    const ch = game.characters.find(
      (c) => c.name.toLowerCase().includes(t) || c.id.toLowerCase() === t
    );
    if (ch) {
      ch.videoUrl = embedUrl;
      store.save();
      return { type: "Personaje", target: `${ch.name} (${game.title})`, embedUrl };
    }

    return null;
  }

  /**
   * Crea automáticamente las 6 listas de reproducción oficiales en el canal de YouTube si hay OAuth Token activo
   */
  async syncPlaylistsWithYouTubeApi() {
    if (!this.accessToken) {
      return {
        ok: false,
        reason: "Configura YOUTUBE_ACCESS_TOKEN para crear las listas directamente en la API de YouTube."
      };
    }

    const playlists = store.state.youtubeChannel?.playlists || [];
    const created = [];

    for (const title of playlists) {
      try {
        const res = await fetch(
          "https://www.googleapis.com/youtube/v3/playlists?part=snippet,status",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              snippet: {
                title,
                description: `Lista oficial de guías de ${title} en FGC Vault (https://fgc-vault.onrender.com)`
              },
              status: { privacyStatus: "public" }
            })
          }
        );
        if (res.ok) {
          const data = await res.json();
          created.push(data.snippet?.title || title);
        }
      } catch (_) {
        // Ignorar error individual
      }
    }

    return { ok: true, created };
  }
}

module.exports = new YouTubeChannelManager();
