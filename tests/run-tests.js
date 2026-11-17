/**
 * Batería de pruebas automáticas para FGC Vault (node tests/run-tests.js)
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const seedData = require("../src/data/seedData");
const store = require("../src/db/store");
const hitboxResolver = require("../src/utils/hitboxResolver");
const telegramBot = require("../src/bot/telegramBot");
const youtubeManager = require("../src/youtube/youtubeManager");

async function run() {
  console.log("Ejecutando tests de FGC Vault...");

  // 1. Verificar juegos (6 principales + 5 nuevas sagas + 6 clásicos = 17 juegos) y planteles reales
  const games = store.getGames();
  assert.strictEqual(games.length, 17, `Deben existir exactamente 17 juegos (encontrados ${games.length})`);

  const classicGames = games.filter((g) => g.isClassic === true);
  assert.strictEqual(classicGames.length, 6, "Deben existir exactamente 6 entregas clásicas históricas");

  const coreCount = games
    .filter((g) => ["mk1", "sf6", "tekken8", "dbfz", "gg-strive", "ssbu"].includes(g.id))
    .reduce((sum, g) => sum + g.characters.length, 0);
  assert.strictEqual(coreCount, 274, `Esperados 274 personajes en los 6 juegos base, encontrados ${coreCount}`);

  const totalChars = games.reduce((sum, g) => sum + g.characters.length, 0);
  assert(totalChars >= 440, `Esperados >=440 personajes totales en catálogo ampliado, encontrados ${totalChars}`);

  const mk1 = store.getGameById("mk1");
  assert(mk1 && Array.isArray(mk1.kameos) && mk1.kameos.length === 21, "MK1 debe tener exactamente 21 Kameos");
  assert(mk1.kameos.every((k) => Array.isArray(k.frameDataCards) && k.frameDataCards.length >= 2), "Todos los Kameos deben incluir frameDataCards");

  const liteGames = store.getGamesLite();
  assert.strictEqual(liteGames.length, 17, "getGamesLite debe devolver los 17 juegos");
  assert(!liteGames[0].characters[0].frameDataCards, "getGamesLite no debe incluir frameDataCards pesados en el bootstrap");

  const tekken = store.getGameById("tekken8");
  const yujiro = tekken.characters.find((c) => c.name.includes("Yujiro"));
  assert(yujiro && yujiro.isUnreleased === true, "Yujiro Hanma debe tener isUnreleased=true");
  assert(yujiro.counterplay && yujiro.counterplay.sidestep, "Tekken 8 debe incluir counterplay y sidestep");

  // 2. Verificar que realFrameData.json cargó datos reales (e.g. SF6 Ryu o MK1 Ashrah)
  const sf6 = store.getGameById("sf6");
  const ryu = sf6.characters.find((c) => c.name === "Ryu");
  assert(ryu && ryu.frameDataCards.length >= 10, "Ryu SF6 debe tener tarjetas reales de Frame Data");
  assert.strictEqual(ryu.frameDataCards[0].isRealWikiData, true, "Ryu SF6 debe usar realFrameData.json");

  // 3. Verificar manifest.json de animaciones-personajes
  const manifestPath = path.join(__dirname, "..", "animaciones-personajes", "manifest.json");
  assert(fs.existsSync(manifestPath), "Debe existir animaciones-personajes/manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8").replace(/^\uFEFF/, ""));
  assert(Object.keys(manifest).length >= 100, "manifest.json debe indexar más de 100 personajes");

  const jamieHbs = await hitboxResolver.resolveCharacterHitboxes("sf6", "Jamie");
  assert(Object.keys(jamieHbs).length >= 5, "Jamie SF6 debe resolver hitboxes reales locales");

  // 4. Verificar métodos administrativos de store (sin mutar runtime_db permanentemente o restaurando)
  const beforeNewsCount = store.getCustomNews().length;
  const newsItem = store.addCustomNewsItem({ saga: "SF6", title: "Test News", summary: "Summary Test" });
  assert.strictEqual(store.getCustomNews().length, beforeNewsCount + 1);
  assert.strictEqual(store.removeCustomNews(newsItem.id), true);

  const evItem = store.addCustomEvent({ name: "Test Event", game: "Tekken 8", startDate: "2027-01-01", endDate: "2027-01-02" });
  assert.strictEqual(store.removeCustomEvent(evItem.id), true);

  // 5. Verificar autorización privada del bot y generador YouTube SEO
  assert.strictEqual(telegramBot.isAuthorizedOwner("0000000", "0000000"), false, "Bot debe bloquear usuarios no autorizados");
  const seo = youtubeManager.generateVideoSeoPackage("sf6", "ryu");
  assert(seo && seo.title.includes("Ryu"), "YouTube SEO debe generar paquete para Ryu");

  // 6. Verificar archivos PWA en public/
  assert(fs.existsSync(path.join(__dirname, "..", "public", "manifest.webmanifest")), "Debe existir manifest.webmanifest");
  assert(fs.existsSync(path.join(__dirname, "..", "public", "sw.js")), "Debe existir sw.js");

  console.log("Todos los tests pasaron correctamente (6/6 suites).");
}

run().catch((err) => {
  console.error("Error en tests:", err);
  process.exit(1);
});
