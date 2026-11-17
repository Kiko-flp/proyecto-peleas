/**
 * Punto de entrada INDEPENDIENTE para el Bot Administrativo de Telegram (@Clayfacefightbot).
 * Permite ejecutar el bot sin necesidad de tener el servidor web Express ni la web activos:
 *   npm run bot
 */

require("dotenv").config();
const telegramBot = require("./src/bot/telegramBot");

async function main() {
  console.log("Iniciando Bot Administrativo @Clayfacefightbot en modo independiente (sin web)...");
  const started = await telegramBot.startStandalone();
  if (!started) {
    console.error("No se pudo iniciar el bot. Verifica TELEGRAM_BOT_TOKEN en tu archivo .env o variables de entorno.");
    process.exit(1);
  }
  console.log(`Bot ${telegramBot.botUsername} conectado en modo: ${telegramBot.mode}`);
}

process.on("SIGINT", () => {
  telegramBot.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  telegramBot.stop();
  process.exit(0);
});

main();
