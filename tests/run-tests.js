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

  // 1. Verificar 6 juegos y sus 274 personajes con datos reales
  const games = store.getGames();
  assert.strictEqual(games.length, 6, "Deben existir exactamente 6 juegos principales");

  const totalChars = games.reduce((sum, g) => sum + g.characters.length, 0);
  assert.strictEqual(totalChars, 274, `Esperados 274 personajes, encontrados ${totalChars}`);

  const tekken = store.getGameById("tekken8");
  const yujiro = tekken.characters.find((c) => c.name.includes("Yujiro"));
  assert(yujiro && yujiro.isUnreleased === true, "Yujiro Hanma debe tener isUnreleased=true");

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
