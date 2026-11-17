# FGC Vault — Enciclopedia Competitiva de Juegos de Lucha

**FGC Vault** es una plataforma web centralizada que reúne guías estructuradas, conceptos competitivos, *frame data*, planteles completos y actualidad de las principales sagas de juegos de lucha (**Mortal Kombat, Street Fighter, Tekken, Dragon Ball FighterZ, Guilty Gear y Super Smash Bros.**).

El objetivo del proyecto es unificar en un solo lugar la información que habitualmente se encuentra dispersa en múltiples wikis, hojas de cálculo y canales especializados de la *Fighting Game Community (FGC)*, presentando todo el contenido en un formato claro tanto en **vídeo** como en **texto**.

[Aquí esta el enlace a la web](https://fgc-vault.onrender.com/)

---

## Resumen de lo Realizado

### 1. Catálogo por Juegos y Sagas Principales
* Acceso rápido desde la pantalla principal a todos los juegos incluidos y filtrado directo por franquicia (*Mortal Kombat*, *Street Fighter*, *Tekken*, *Dragon Ball FighterZ*, *Guilty Gear* y *Super Smash Bros.*).
* Buscador global en tiempo real por nombre de juego, luchador, arquetipo o paquete de expansión (*DLC*).

### 2. Estructura en Tres Páginas Independientes por Juego
Al seleccionar cualquier título del catálogo, la información se organiza en tres páginas dedicadas manteniendo un menú de navegación persistente:
1. **Guía Básica (Conceptos Fundamentales):** Explicación en vídeo y texto de la notación del juego, controles universales, tipos de guardia y mecánicas principales del sistema (*Kameos*, *Drive System*, *Heat System*, *Roman Cancel*, *Sparking Blast*, *Out of Shield*).
2. **Guía Avanzada (Juego Competitivo y Frame Data):** Conceptos de alto nivel en vídeo y texto sobre *Frame Traps*, *Whiff Punish*, *Flawless Block*, *Delay Throw Tech*, *Shimmy*, *Korean Backdash (KBD)*, *Fast RC* y *Ledgetrapping*.
3. **Plantel Completo de Personajes (Juego Base vs. Packs DLC):**
   * Mosaico visual con los retratos oficiales centrados en el rostro de los **271 personajes actuales** de los títulos principales.
   * Separación clara entre los personajes incluidos de serie en el **Juego Base** y los **Personajes DLC de pago**, agrupados e identificados según su expansión o *Season Pass* (*Kombat Pack 1*, *Khaos Reigns Expansion*, *Year 1 / 2 / 3 Character Pass*, *Season 1 / 2 / 3 Character Pass*, *FighterZ Pass 1–3*, *GGST Season Pass 1–4*, *Fighters Pass Vol. 1 & 2*).
   * Ficha individual por personaje con vídeo guía, resumen de estilo de juego, tabla de movimientos clave, rutas de combos (*Bread & Butter*) y enlace directo a su wiki de referencia.

### 3. Traductor Interactivo de Notación
* Selector integrado en la cabecera que traduce instantáneamente la notación de todos los movimientos y combos entre:
  * **Notación Técnica FGC** (`1,2,3,4` / `236LP` / `c.S > 2HS`)
  * **Mando de PlayStation** (`▢ △ ✕ ○`)
  * **Mando de Xbox / PC** (`X Y A B`)

### 4. Sección de Noticias de Juegos de Lucha y Competitivo
* Apartado dedicado exclusivamente a novedades de juegos de lucha y torneos del circuito internacional (**EVO**, **Capcom Cup / Capcom Pro Tour**, **Tekken World Tour**, **Arc World Tour** y **Final Kombat**), además de notas de parche y lanzamientos de personajes.

### 5. Aportes de la Comunidad y Hoja de Ruta
* Espacio abierto en la web donde los usuarios pueden:
  * Proponer nuevas **Wikis, canales de YouTube y guías especializadas** indicando a qué juego o personaje pertenecen.
  * Consultar el **resumen de contenido pendiente / qué falta por ampliar** en cada saga y enviar sugerencias detalladas para su valoración e incorporación a la enciclopedia.

---

## Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3 moderno (Grid/Flexbox adaptable) y JavaScript Vanilla modular sin dependencias pesadas.
* **Backend:** Node.js con Express para la API REST de juegos, resolución de retratos, agregación de noticias competitivas y gestión de aportes comunitarios.
* **Despliegue:** Preparado para alojamiento continuo en la nube mediante Render ([render.yaml](file:///c:/Users/Kiko/Desktop/MortalKombat%20serie/proyecto-peleas/render.yaml)).

---

## Licencia

Este proyecto utiliza un modelo de doble licencia detallado en el archivo [LICENSE](file:///c:/Users/Kiko/Desktop/MortalKombat%20serie/proyecto-peleas/LICENSE):

* **Código fuente:** **GNU General Public License v3.0 (GPL-3.0)** — Cualquier obra derivada debe mantener el reconocimiento de autoría original y distribuirse bajo la misma licencia libre.
* **Contenido editorial y estructura de guías:** **Creative Commons BY-NC-SA 4.0** — Se exige atribución, se prohíbe su uso comercial sin autorización y cualquier adaptación debe compartirse bajo los mismos términos.
* **Aviso de marcas:** *Mortal Kombat*, *Street Fighter*, *Tekken*, *Dragon Ball FighterZ*, *Guilty Gear* y *Super Smash Bros.* son marcas registradas de sus respectivos propietarios y se documentan con fines exclusivamente educativos e informativos para la comunidad.
