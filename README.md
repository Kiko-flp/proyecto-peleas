# 🥊 FGC Vault — Enciclopedia & Guías de Juegos de Lucha + Bot de Telegram

Plataforma web diseñada para reunir las guías verificadas de las principales sagas de lucha (**Mortal Kombat, Street Fighter, Tekken, Dragon Ball FighterZ, Guilty Gear y Super Smash Bros.**), lista para desplegar en **GitHub + Render** con un **Bot de Telegram** integrado para verificación de usuarios (2FA) y gestión rápida por botones.

---

## ✨ Características Principales

1. **Catálogo por Sagas y Juegos:**
   - Filtro por saga (*Mortal Kombat*, *Street Fighter*, *Tekken*, *Dragon Ball FighterZ*, *Guilty Gear*, *Super Smash Bros.*) y buscador instantáneo de personajes o Packs DLC.
2. **Estructura Triple por Juego:**
   - **📘 Guía Básica de Conceptos:** Vídeo integrado + guía paso a paso en texto sobre controles, bloqueo y mecánicas universales (*Kameos*, *Drive System*, *Heat System*, *Roman Cancel*, *OOS*).
   - **🔥 Guía Avanzada Competitiva:** Vídeo + texto sobre *Frame Traps*, *Flawless Block*, *Delay Throw Tech*, *Shimmy*, *Korean Backdash* y *Fast RC*.
   - **🥊 Guías Individuales de Personajes (Juego Base vs. DLC):**
     - **Plantel del Juego Base** claramente separado de los **Personajes DLC de Pago**.
     - Cada personaje DLC muestra su **etiqueta exacta de Pack / Fighter Pass** (*Kombat Pack 1*, *Khaos Reigns Expansion*, *Year 1 / Year 2 Character Pass*, *FighterZ Pass 3*, *GGST Season Pass 1-3*, *Fighters Pass Vol. 1 & 2*) y un filtro por Pack.
3. **Traductor Interactivo de Notación en Tiempo Real:**
   - Selector en la barra superior para ver los combos en **Notación Técnica FGC** (`1,2,3,4` / `236LP`), **PlayStation (`▢ △ ✕ ○`)** o **Xbox / PC (`X Y A B`)**.
4. **Fuentes Reales y Verificadas:**
   - Datos referenciados directamente de *Kombat Akademy*, *SuperCombo Wiki*, *Wavu Wiki*, *Dustloop Wiki* y *Ultimate Frame Data*.
5. **🤖 Bot de Telegram Integrado (Verificación + Moderación por Botones):**
   - **Verificación de Usuarios / Admins (2FA):** Genera solicitudes con código de 6 dígitos que se aprueban con botones Inline (`[✅ Autorizar Usuario]` / `[🚫 Denegar]`) o con el comando `/verificar CODIGO`.
   - **Moderación de Guías y DLC:** Cuando alguien envía una guía o personaje desde la web, el bot envía una tarjeta a tu Telegram con botones `[✅ Aprobar y Publicar]` y `[❌ Rechazar]`.
   - **Simulador Interactivo en la Web:** Puedes probar todos los botones del bot directamente desde el panel lateral de la web incluso antes de configurar el token de `@BotFather`.

---

## 🚀 Cómo probarlo en tu PC

```bash
npm install
npm start
```

Abre `http://localhost:3000` en tu navegador.

---

## ☁️ Cómo desplegar en GitHub + Render y conectar tu Bot de Telegram

1. **Crear el Bot en Telegram:**
   - Habla con `@BotFather` en Telegram y envía `/newbot`.
   - Copia el token que te entrega (`TELEGRAM_BOT_TOKEN`).
2. **Subir a GitHub:**
   - Sube este repositorio a tu cuenta de GitHub (ya incluye [render.yaml](file:///c:/Users/Kiko/Desktop/MortalKombat%20serie/proyecto-peleas/render.yaml) y [.gitignore](file:///c:/Users/Kiko/Desktop/MortalKombat%20serie/proyecto-peleas/.gitignore)).
3. **Desplegar en Render (Onrender.com):**
   - En Render, selecciona **New + → Blueprint** (o **Web Service**) y conecta tu repositorio de GitHub.
   - En la sección **Environment Variables**, añade:
     - `TELEGRAM_BOT_TOKEN`: Tu token de `@BotFather`.
     - `TELEGRAM_ADMIN_CHAT_ID`: Tu ID de Telegram (puedes obtenerlo enviando `/miid` a tu bot una vez iniciado).
4. **Comandos rápidos del Bot de Telegram:**
   - `/menu` o `/start` — Abre el panel de control con botones interactivos.
   - `/pendientes` — Muestra las guías propuestas con botones `[✅ Aprobar]` y `[❌ Rechazar]`.
   - `/verificar <CODIGO>` — Verifica una cuenta de usuario/admin desde Telegram.
   - `/juegos` — Lista los juegos activos, su parche actual y el recuento de personajes Base vs. DLC.
   - `/miid` — Devuelve tu `CHAT_ID` para configurarlo en Render.

---

## ⚖️ Licencia

Este proyecto cuenta con doble protección legal detallada en el archivo [LICENSE](file:///c:/Users/Kiko/Desktop/MortalKombat%20serie/proyecto-peleas/LICENSE):

* **Código fuente:** **GNU GPLv3** (`GPL-3.0-or-later`) — Cualquier derivado debe mantener el reconocimiento de autoría y permanecer como software libre bajo la misma licencia.
* **Contenido de guías y recopilación de datos:** **Creative Commons BY-NC-SA 4.0** — Se exige atribución al autor original, se prohíbe su explotación comercial sin permiso y cualquier adaptación debe compartirse bajo los mismos términos.
* **Aviso de marcas:** Todas las franquicias y personajes mencionados (*Mortal Kombat*, *Street Fighter*, *Tekken*, *Dragon Ball FighterZ*, *Guilty Gear*, *Super Smash Bros.*) pertenecen a sus respectivos creadores y se documentan con fines educativos y competitivos para la comunidad (FGC).
