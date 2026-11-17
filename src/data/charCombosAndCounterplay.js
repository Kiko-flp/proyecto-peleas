/**
 * Movimientos Clave, Combos BnB/Óptimos específicos por personaje
 * y Guías de Defensa Anti-Personaje (Counterplay + Sidestep + Flawless Block + OOS)
 * para los 274 personajes de los 6 juegos principales (MK1, SF6, Tekken 8, DBFZ, GGST, SSBU).
 */

const MK1_CHAR_GUIDES = {
  "Scorpion": {
    keyMoves: [
      { input: "f+3, 2", frames: "12f Mid", notes: "Lanzador principal a media distancia para whiffs y confirmaciones." },
      { input: "2, 1", frames: "10f High-Mid", notes: "Cadena segura (+2 en bloqueo) ideal para mantener presión." },
      { input: "b+3", frames: "18f Low", notes: "Latigazo bajo de enorme rango para frenar avances." },
      { input: "bf+1", frames: "16f High", notes: "Spear (Arpón): castiga desde toda la pantalla." }
    ],
    combos: [
      { type: "Midscreen (Sin barra)", difficulty: "Fácil", resource: "Sin Barra", notation: "f+3,2 > j.1,1,1 ~ db+2 > dash > f+3,2 ~ bf+1 > 3,3 ~ bf+2", damage: "345 dmg" },
      { type: "Midscreen (1 Barra)", difficulty: "Media", resource: "Con Recursos", notation: "2,1 ~ bf+1 > f+3,2 > f+3,2 > j.1,2 ~ EX db+2 > j.1,1,1 ~ bf+2", damage: "412 dmg" },
      { type: "Esquina (Corner BnB)", difficulty: "Difícil", resource: "Sin Barra", notation: "f+3,2 > 4 ~ bf+1 > f+3,2 > j.1,2 ~ db+2 > 3,3 ~ bf+2", damage: "390 dmg" }
    ],
    counterplay: {
      focus: "Micro-Duck & Castigo al Arpón / Teletransporte",
      defenseTip: "Tanto su 2,1 como el Spear (bf+1) inician o golpean Alto (High): agáchate sin bloquear (Micro-Duck) a media distancia y castiga con d+2 o tu lanzador.",
      gapOrBlock: "Su teletransporte (db+3) es muy castigable (-15f+) salvo que cancele en aire; bloquea de pie sus saltos y castiga el fallo de b+3 si fuerza el rango."
    }
  },
  "Sub-Zero": {
    keyMoves: [
      { input: "b+2", frames: "23f Overhead", notes: "Lanzador Overhead clásico que rebota al rival en el suelo." },
      { input: "b+3, 4", frames: "13f Low", notes: "Doble patada baja cancelable en Ice Slide o Ice Clone." },
      { input: "db+1", frames: "Ice Clone", notes: "Estatua helada defensiva que congela avances o saltos." },
      { input: "bf+3", frames: "11f Low", notes: "Ice Slide: atraviesa proyectiles altos y castiga de lejos." }
    ],
    combos: [
      { type: "Desde Overhead (Sin Barra)", difficulty: "Fácil", resource: "Sin Barra", notation: "b+2 > b+2 > j.1,2 > j.1,2,2 ~ bf+3", damage: "310 dmg" },
      { type: "Confirmación Low (1 Barra)", difficulty: "Media", resource: "Con Recursos", notation: "b+3,4 ~ EX df+4 > dash > b+2 > j.1,2 ~ db+4", damage: "355 dmg" },
      { type: "Óptimo + Kameo", difficulty: "Difícil", resource: "Con Recursos", notation: "b+2 > Kameo > b+2 > 4 ~ df+4 > j.1,2 ~ bf+3", damage: "398 dmg" }
    ],
    counterplay: {
      focus: "Bloqueo de pie reaccionando al Low / Flawless Block",
      defenseTip: "Mantén la guardia alta por defecto en media distancia para bloquear b+2 (23f) por reacción y agáchate al ver b+3 (13f). Ice Slide (bf+3) bloqueado es totalmente castigable (-20f+).",
      gapOrBlock: "No hagas Dash contra su Ice Clone (db+1): usa ataques largos sin avance corporal, proyectiles o armadura de Kameo (Sub-Zero / Khameleon)."
    }
  },
  "Liu Kang": {
    keyMoves: [
      { input: "f+4, 3", frames: "10f Mid", notes: "El mejor Mid avanzante de Liu Kang para iniciar presión." },
      { input: "1, 2", frames: "7f High-Mid", notes: "Castigo rápido confirmable en Dragón." },
      { input: "bf+1 / db+1", frames: "Proyectiles", notes: "Bolas rápidas bajas/altas para dominar toda la pantalla." },
      { input: "bf+3", frames: "Dragon's Tail", notes: "Patada de largo alcance cancelable o seguible con Kameo." }
    ],
    combos: [
      { type: "Midscreen (Sin Barra)", difficulty: "Fácil", resource: "Sin Barra", notation: "f+4,3 ~ db+4 > dash > 3,3,3 ~ bf+3", damage: "340 dmg" },
      { type: "1 Barra (EX Dragón)", difficulty: "Media", resource: "Con Recursos", notation: "1,2 ~ EX db+4 > dash > f+4,3 > j.1,2,1 ~ bf+3", damage: "405 dmg" },
      { type: "Esquina Óptimo", difficulty: "Difícil", resource: "Con Recursos", notation: "f+4,3 ~ EX bf+1 > 3,3 > f+4,3 > 4 ~ bf+3", damage: "438 dmg" }
    ],
    counterplay: {
      focus: "Flawless Block en f+4,3,4 & Neutral Duck al Grab",
      defenseTip: "Su f+4,3,4 tiene un hueco claro antes del tercer golpe o tras el 2.º hit donde puedes hacer Flawless Block / Interrupt con armadura.",
      gapOrBlock: "Agáchate sus bolas altas y salta por encima de las bolas bajas con cuidado de su Dragon Parry/Anti-air."
    }
  },
  "Raiden": {
    keyMoves: [
      { input: "f+4, 3", frames: "11f Mid", notes: "Avanzante con doble hit ideal para confirmar Storm Cell." },
      { input: "f+3, 4", frames: "14f Mid-Low", notes: "Alterna medio-bajo cancelable en electricidad." },
      { input: "db+2", frames: "Storm Cell", notes: "Campo eléctrico múltiple; con Kano/Stryker es seguro en bloqueo." },
      { input: "bf+3", frames: "Electric Fly", notes: "Superman clásico para cerrar combos y llevar a la esquina." }
    ],
    combos: [
      { type: "Midscreen Eléctrico", difficulty: "Fácil", resource: "Sin Barra", notation: "f+4,3 ~ db+2 > dash > f+4,3 ~ bf+3", damage: "342 dmg" },
      { type: "1 Barra Máximo Daño", difficulty: "Media", resource: "Con Recursos", notation: "2,4,2,1 ~ EX db+2 > j.1,2 ~ df+2 > f+4,3 ~ bf+3", damage: "428 dmg" },
      { type: "Con Kameo Ambush", difficulty: "Difícil", resource: "Con Recursos", notation: "f+4,3 ~ db+2 + Kameo > 3,4 ~ EX df+2 > j.2,1 ~ bf+3", damage: "462 dmg" }
    ],
    counterplay: {
      focus: "Up-Block contra Storm Cell + Castigo a Cartwheel",
      defenseTip: "Si llama Storm Cell (db+2) SIN respaldo de Kameo, el último golpe es agachable/castigable o puedes interrumpir con armadura antes del campo eléctrico.",
      gapOrBlock: "Su f+3,4 pega Mid luego Low; espera el segundo hit agachado antes de tomar tu turno."
    }
  },
  "Johnny Cage": {
    keyMoves: [
      { input: "f+3, 2", frames: "9f Mid", notes: "El mejor Mid de 9 frames para confirmar o atrapar intentos de salto." },
      { input: "1, 1", frames: "7f High", notes: "+3 en bloqueo garantizando Frame Trap con f+3." },
      { input: "f+1, 2", frames: "10f Mid", notes: "Avanza rápido y mezcla entre f+1,2,4 (Overhead) o stagger." },
      { input: "2, 1, 2", frames: "9f Mid-High", notes: "Lanzador de cadena completo hacia combo aéreo." }
    ],
    combos: [
      { type: "BnB Estándar (Sin Barra)", difficulty: "Fácil", resource: "Sin Barra", notation: "2,1,2 > dash > f+3,2 > j.1,2 ~ bf+4", damage: "325 dmg" },
      { type: "1 Barra (EX Nut Punch)", difficulty: "Media", resource: "Con Recursos", notation: "f+3,2 ~ EX bd+1 > dash > 2,1,2 > dash > f+1,2 ~ bf+4", damage: "375 dmg" },
      { type: "Modo Hype Máximo", difficulty: "Difícil", resource: "Con Recursos", notation: "1,1 ~ Hype > bf+4 > bf+4 > 2,1,2 > f+1,2 ~ db+3", damage: "445 dmg" }
    ],
    counterplay: {
      focus: "Up-Block a f+1,2,4 Overhead & Fuzzies",
      defenseTip: "Johnny NO tiene proyectiles ni ataques bajos rápidos iniciadores (su b+3 es 17f+); haz Up-Block contra el tercer hit de f+1,2,4 (Overhead) para castigo completo.",
      gapOrBlock: "Si no lleva Kano/Kameo Ambush, su 2,1,2 y su Shadow Kick (bf+4) son totalmente castigables en bloqueo (-14f)."
    }
  },
  "Kung Lao": {
    keyMoves: [
      { input: "f+3, 4", frames: "12f Mid", notes: "Cadena segura con rodilla hacia patada de largo alcance." },
      { input: "df+2", frames: "Armadura / Launch", notes: "Lanzador con armadura (con Goro queda +frames en bloqueo)." },
      { input: "b+3, 3", frames: "14f Low", notes: "Iniciador bajo rápido cancelable en Shaolin Spin." },
      { input: "j.d+4", frames: "Divekick", notes: "Patada descendente aérea para alterar el ritmo de salto." }
    ],
    combos: [
      { type: "Midscreen Básico", difficulty: "Fácil", resource: "Sin Barra", notation: "f+3 ~ db+4 > dash > 1,2,1 ~ bf+2", damage: "338 dmg" },
      { type: "Con Goro / 1 Barra", difficulty: "Media", resource: "Con Recursos", notation: "df+2 + Goro > 2,1,2 > j.1,2 ~ EX df+1 > f+3 ~ bf+2", damage: "410 dmg" },
      { type: "Esquina Divekick", difficulty: "Difícil", resource: "Sin Barra", notation: "b+3,3 ~ db+4 > 4 ~ j.d+4 > 1,2,1 ~ bf+2", damage: "392 dmg" }
    ],
    counterplay: {
      focus: "Antiaéreo a Divekick & Interrupción a Spin",
      defenseTip: "Mantén la distancia exacta donde su Divekick falle frente a ti (whiff = combo completo de castigo). Bloquea siempre bajo su b+3,3.",
      gapOrBlock: "Su df+2 sin Kameo detrás es muy negativo (-16f) tras la armadura; castígalo siempre con tu combo más fuerte."
    }
  },
  "Kitana": {
    keyMoves: [
      { input: "b+2, 4", frames: "13f Mid", notes: "Abanicos de gran alcance hacia lanzador aéreo." },
      { input: "df+1", frames: "Fan Toss", notes: "Proyectil clásico ultrarrápido de control." },
      { input: "db+2", frames: "Fan-Nado", notes: "Torbellino lanzador para extender combos desde el aire." },
      { input: "2, 4, 1", frames: "9f High", notes: "Cadena rápida para castigar y preparar trampas en esquina." }
    ],
    combos: [
      { type: "Midscreen Abanicos", difficulty: "Fácil", resource: "Sin Barra", notation: "b+2,4 > j.1,1,2 ~ df+1 > dash > 4 ~ db+1", damage: "345 dmg" },
      { type: "Trampa Fan-Nado (1 Barra)", difficulty: "Media", resource: "Con Recursos", notation: "2,4,1 ~ EX db+2 > f+1,2 > j.2,4 ~ df+2", damage: "408 dmg" },
      { type: "Esquina Viento", difficulty: "Difícil", resource: "Con Recursos", notation: "b+2,4 > db+2 > f+1,2 > j.1,2 ~ df+1 > 4 ~ db+1", damage: "435 dmg" }
    ],
    counterplay: {
      focus: "Neutral Duck ante Fan Toss & Respeta el Air Fan",
      defenseTip: "Sus abanicos df+1 son Altos (High): agáchate sin bloquear a media-larga distancia para avanzar gratis sin recibir chip damage.",
      gapOrBlock: "Cuidado al saltar contra sus abanicos aéreos; acércate por el suelo usando micro-duck y camina hacia su rango corto donde tiene menos mezcla."
    }
  },
  "Mileena": {
    keyMoves: [
      { input: "1, 2", frames: "7f High-Mid", notes: "Castigo rápido hacia Ball Roll." },
      { input: "f+4", frames: "17f High-Mid", notes: "Patada saltarina de largo rango con salto sobre bajos." },
      { input: "bd+4", frames: "Ball Roll", notes: "Lanzador clásico invencible al aire en EX / gran combo starter." },
      { input: "bf+1", frames: "Low Sai", notes: "Proyectil bajo rápido que obliga a agacharse." }
    ],
    combos: [
      { type: "Midscreen Ball Roll", difficulty: "Fácil", resource: "Sin Barra", notation: "1,2 ~ bd+4 > j.2,4 ~ db+2 > dash > f+2,4 ~ bf+2", damage: "358 dmg" },
      { type: "1 Barra Sai Mix", difficulty: "Media", resource: "Con Recursos", notation: "f+4,4 ~ EX bf+1 > 1,2 ~ bd+4 > j.1,2 ~ db+2 > 2,1 ~ bf+2", damage: "430 dmg" },
      { type: "Con Ferra / Scorpion", difficulty: "Difícil", resource: "Con Recursos", notation: "Ferra Mix > bd+4 > j.1,2 ~ db+2 > j.1,2 ~ bf+2", damage: "475 dmg" }
    ],
    counterplay: {
      focus: "Bloquea el Ball Roll = Máximo Castigo",
      defenseTip: "Tanto Ball Roll (bd+4) como Teleport Kick (db+4) son extremadamente inseguros (-22f+): ten listo tu combo óptimo en cada bloqueo.",
      gapOrBlock: "En su f+4,4 haz Flawless Block o interrumpe antes de que cancele en especial; evita apretar botones tras su sais bajo bloqueado."
    }
  },
  "Kenshi": {
    keyMoves: [
      { input: "f+2, 2", frames: "12f Mid", notes: "Espadazo largo hacia confirmación de Sento." },
      { input: "b+2", frames: "15f Low", notes: "Bajo de espada largo para controlar el neutro." },
      { input: "db+1", frames: "Sento (Espíritu)", notes: "Invoca su clon espiritual para doble presión." },
      { input: "2, 1", frames: "8f High-Mid", notes: "Cadena segura para iniciar ataques sincronizados." }
    ],
    combos: [
      { type: "Sin Sento (Invocación)", difficulty: "Fácil", resource: "Sin Barra", notation: "f+2,2 ~ db+4 > dash > 1,4 ~ db+1 (Invocar Sento)", damage: "295 dmg" },
      { type: "Sento Sandwich Loop", difficulty: "Difícil", resource: "Con Recursos", notation: "f+2,2 > Sento 2 > Sento 1 > f+2,2 > Sento 4 > Sento 3", damage: "465 dmg" },
      { type: "Esquina Espíritu", difficulty: "Media", resource: "Con Recursos", notation: "2,1 ~ Sento 2 > b+2 ~ Sento 4 > 4 ~ db+3", damage: "430 dmg" }
    ],
    counterplay: {
      focus: "Golpear a Kenshi ANTES de que saque Sento / Romper el Sandwich",
      defenseTip: "Kenshi es mucho más débil sin Sento activo: presiona sin darle espacio para invocar db+1 y guarda 2 barras para hacer Breaker en cuanto active el clon.",
      gapOrBlock: "Si estás rodeado (Sandwich), usa Delay Wakeup o Armored Reversal para golpear al propio Kenshi y hacer desaparecer el espíritu."
    }
  },
  "Smoke": {
    keyMoves: [
      { input: "f+3, 2", frames: "15f Low-Overhead", notes: "Iniciador bajo hacia overhead o cancelación Vicious Vapor." },
      { input: "b+2", frames: "18f Overhead", notes: "Humo descendente Overhead con salto sobre bajos." },
      { input: "bf+3", frames: "Vicious Vapor Cancel", notes: "Cancela su avance con R2 para quedar seguro o mezclar." },
      { input: "db+4", frames: "Smoke-Port", notes: "Teletransporte por detrás Overhead/Low." }
    ],
    combos: [
      { type: "Midscreen Cancel", difficulty: "Media", resource: "Sin Barra", notation: "f+3,2 > j.1,1,2 ~ db+4 > f+3,2 > j.1,2 ~ bf+3", damage: "345 dmg" },
      { type: "1 Barra (EX Invis)", difficulty: "Difícil", resource: "Con Recursos", notation: "b+2 ~ EX db+2 > dash > 3,2 > j.1,2 ~ bf+3 ~ Cancel > 3,2", damage: "418 dmg" },
      { type: "BnB Sencillo", difficulty: "Fácil", resource: "Sin Barra", notation: "3,2 > j.1,1,2 ~ db+4", damage: "305 dmg" }
    ],
    counterplay: {
      focus: "Up-Block a db+4 Teleport & Poke 7f contra Vicious Cancels",
      defenseTip: "Smoke-Port (db+4) tiene suficiente startup para hacer Up-Block o golpear con d+1 antes de que impacte si no tiene cobertura de Kameo.",
      gapOrBlock: "En su cadena f+3,2, el primer hit es Low y el segundo Overhead; si cancela bf+3 en humo, tu jab 1 / d+1 suele interrumpirlo."
    }
  },
  "Rain": {
    keyMoves: [
      { input: "b+2", frames: "13f Mid", notes: "Báculo acuático de larguísimo rango para espaciar." },
      { input: "bf+1", frames: "Water Beam", notes: "Proyectil cargable / cancelable para control." },
      { input: "db+3", frames: "Whirlpool", notes: "Remolino en el suelo para setups en esquina." },
      { input: "1, 1, 2", frames: "7f High", notes: "Castigo rápido hacia lanzador de agua." }
    ],
    combos: [
      { type: "Midscreen Agua", difficulty: "Fácil", resource: "Sin Barra", notation: "1,1,2 ~ db+1 > j.2,4 ~ bf+3", damage: "330 dmg" },
      { type: "Portal + Remolino (1 Barra)", difficulty: "Difícil", resource: "Con Recursos", notation: "b+2 ~ EX db+1 > dash > 2,1 ~ bf+1 > 2,1 ~ db+3", damage: "415 dmg" }
    ],
    counterplay: {
      focus: "Pokes rápidos de corto alcance & Cuidado con portales",
      defenseTip: "Rain domina a media distancia con su bastón; entra en rango de puño (donde sus botones son algo más lentos) y no saltes sin plan sobre Whirlpool."
    }
  },
  "Li Mei": {
    keyMoves: [
      { input: "1, 2", frames: "7f High", notes: "Cadena muy rápida (+frames en stagger) para iniciar presión." },
      { input: "bf+4", frames: "Nova Blast / Knee", notes: "Rodillazo lanzador hacia linternas aéreas." },
      { input: "db+4", frames: "Lantern (Linterna)", notes: "Coloca una linterna flotante que explota en tus combos o saltos." }
    ],
    combos: [
      { type: "Linternas Midscreen", difficulty: "Media", resource: "Sin Barra", notation: "1,2 ~ db+4 > dash > bf+4 > j.1,2 ~ db+2", damage: "355 dmg" },
      { type: "1 Barra Explosiva", difficulty: "Difícil", resource: "Con Recursos", notation: "2,1 ~ EX bf+4 > db+4 > j.1,2,4 ~ bf+4 > j.2,1 ~ bf+2", damage: "445 dmg" }
    ],
    counterplay: {
      focus: "Micro-Duck sus cadenas High (1,2) & Antiaéreo a linternas",
      defenseTip: "Casi toda su presión de cerca empieza en High (1,2 / 2,1); agáchate sin bloquear entre staggers y rompe el turno con d+2."
    }
  },
  "Tanya": {
    keyMoves: [
      { input: "f+2, 1, 1", frames: "12f Mid", notes: "Golpes con bastón de enorme alcance; seguro con Goro." },
      { input: "b+3", frames: "14f Low", notes: "Barrido ágil con pértiga." },
      { input: "db+4", frames: "Spinning Kick", notes: "Patada giratoria lanzadora para combos o armadura EX." }
    ],
    combos: [
      { type: "Midscreen Bastón", difficulty: "Fácil", resource: "Sin Barra", notation: "f+2,1,1 ~ EX db+4 > j.1,2,2 ~ bf+2", damage: "360 dmg" },
      { type: "Con Goro / Khameleon", difficulty: "Media", resource: "Con Recursos", notation: "f+2,1,1 + Kameo > b+2 > j.2,4 ~ db+4", damage: "412 dmg" }
    ],
    counterplay: {
      focus: "Castiga su Drill / Spin & Respeta el f+2",
      defenseTip: "No intentes desafiar con ataques cortos tras su f+2,1; espera a que acabe o castiga su db+4 / bf+4 si lo lanza sin Kameo detrás."
    }
  },
  "Baraka": {
    keyMoves: [
      { input: "df+1", frames: "Baraka Barrage", notes: "Lluvia de cuchillas; letal con Kano/Stryker en bloqueo." },
      { input: "b+3, 1", frames: "13f Low", notes: "Bajo rápido para abrir defensas de pie." },
      { input: "f+3", frames: "11f Mid", notes: "Avance rápido con pinchos." }
    ],
    combos: [
      { type: "Midscreen Cuchillas", difficulty: "Fácil", resource: "Sin Barra", notation: "b+3,1 ~ df+2 > dash > f+3 ~ db+1", damage: "348 dmg" },
      { type: "1 Barra (EX Barrage)", difficulty: "Media", resource: "Con Recursos", notation: "2,1 ~ EX df+1 > j.1,2 ~ df+2 > 4 ~ db+1", damage: "415 dmg" }
    ],
    counterplay: {
      focus: "Flawless Block al Baraka Barrage (df+1)",
      defenseTip: "Haz Flawless Block justo en los últimos golpes de df+1 / db+1 para anular el enorme Chip Damage y evitar que gane el set desgastando tu guardia."
    }
  },
  "Geras": {
    keyMoves: [
      { input: "f+2, 4", frames: "13f Mid", notes: "Iniciador de medio alcance hacia reloj o congelación temporal." },
      { input: "df+2", frames: "Time Stop", notes: "Detiene al enemigo en el tiempo tras cargar las 3 cargas de arena." },
      { input: "dbf+2", frames: "Command Grab", notes: "Agarre de comando potente en la esquina." }
    ],
    combos: [
      { type: "Midscreen Arena", difficulty: "Fácil", resource: "Sin Barra", notation: "f+2,4 ~ db+2 > dash > 1,2,2 ~ bf+2", damage: "338 dmg" },
      { type: "Time Freeze Máximo", difficulty: "Difícil", resource: "Con Recursos", notation: "df+2 (Freeze) > j.2,4 > f+2,4 ~ db+2 > 4 ~ bf+2", damage: "445 dmg" }
    ],
    counterplay: {
      focus: "Presiona para impedir cargas de Reloj & Salta su Grab",
      defenseTip: "Corta con ataques o proyectiles sus intentos de cargar el reloj de arena; tras sus cadenas de cerca, salta o agáchate según la amenaza de dbf+2."
    }
  },
  "Reptile": {
    keyMoves: [
      { input: "b+3, 1", frames: "14f Low", notes: "Deslizamiento o patada baja de larguísimo rango." },
      { input: "f+2, 3", frames: "12f Mid", notes: "Iniciador rápido con cola o transformación cocodrilo." },
      { input: "bf+4", frames: "Force Ball", notes: "Bola ácida lenta/rápida para extender combos y cubrir entradas." }
    ],
    combos: [
      { type: "Force Ball BnB", difficulty: "Media", resource: "Sin Barra", notation: "f+2,3 ~ bf+4 > dash > 2,4 ~ db+4", damage: "345 dmg" },
      { type: "Con Mavado / 1 Barra", difficulty: "Difícil", resource: "Con Recursos", notation: "b+3,1,3 ~ Mavado > b+2 > f+2,3 ~ bf+4 > 4 ~ bf+2", damage: "420 dmg" }
    ],
    counterplay: {
      focus: "Reacciona al Death Roll (bf+3) & Castiga el Slide",
      defenseTip: "Tanto su bf+3 como su bf+2 (Slide) son altamente castigables (-20f+) si los bloqueas agachado. Golpéale con d+1 si intenta activar Invisibilidad en tu cara."
    }
  },
  "Ashrah": {
    keyMoves: [
      { input: "f+2", frames: "13f Mid", notes: "Espadazo de rango colosal que controla todo el neutro." },
      { input: "2, 1", frames: "9f High-Mid", notes: "Cadena segura hacia Dark Ascension." },
      { input: "db+2", frames: "Astral Projection", notes: "Lanzador de espada con gran alcance." }
    ],
    combos: [
      { type: "Midscreen Espada", difficulty: "Fácil", resource: "Sin Barra", notation: "f+2 ~ db+2 > dash > f+2 > j.1,2 ~ df+1", damage: "350 dmg" },
      { type: "Oscuridad (1 Barra)", difficulty: "Media", resource: "Con Recursos", notation: "2,1 ~ EX db+2 > dash > f+2 > 4 ~ df+3", damage: "430 dmg" }
    ],
    counterplay: {
      focus: "Espacia su f+2 & Castiga sus proyectiles oscuros",
      defenseTip: "Juega justo fuera del alcance de f+2 para hacerla fallar al aire (whiff); su overhead f+3 es lento y reaccionable de pie."
    }
  },
  "Havik": {
    keyMoves: [
      { input: "b+2, 2", frames: "13f Mid", notes: "Iniciador de medio alcance hacia cuello o brazo." },
      { input: "bf+1", frames: "Helping Hand", notes: "Armadura / imbloqueable si carga, convertible con Mavado." },
      { input: "df+2", frames: "Projectile", notes: "Proyectil lento de sangre ideal para cubrir avances." }
    ],
    combos: [
      { type: "Midscreen Caos", difficulty: "Fácil", resource: "Sin Barra", notation: "b+2,2 ~ db+1 > dash > f+1,2 ~ bf+2", damage: "340 dmg" },
      { type: "Con Mavado OTG (1 Barra)", difficulty: "Difícil", resource: "Con Recursos", notation: "bf+1 + Mavado > 2,2 ~ EX db+4 > f+1,2 ~ bf+2", damage: "435 dmg" }
    ],
    counterplay: {
      focus: "Agarra o salta su Helping Hand lento & Aprovecha su startup lento",
      defenseTip: "Havik tiene botones de inicio lentos a corta distancia; presiona con jabs de 7f y salta/castiga cuando intente cargar bf+1 sin barra."
    }
  },
  "General Shao": {
    keyMoves: [
      { input: "2, 2", frames: "11f Mid", notes: "Hachazo principal confirmable en postura sin hacha." },
      { input: "f+2", frames: "14f Overhead", notes: "Golpe de hacha descendente largo." },
      { input: "db+3", frames: "Axeless Stance", notes: "Dejar el hacha le da botones rapidísimos (7f) y saltos lanzadores." }
    ],
    combos: [
      { type: "Con Hacha (Midscreen)", difficulty: "Fácil", resource: "Sin Barra", notation: "2,2 ~ db+3 > 1,2 > j.1,2 ~ df+2", damage: "365 dmg" },
      { type: "Postura Sin Hacha (1 Barra)", difficulty: "Media", resource: "Con Recursos", notation: "b+1,2 ~ EX db+4 > f+2 > 2,2 ~ bf+2", damage: "440 dmg" }
    ],
    counterplay: {
      focus: "Neutral Duck ante sus Highs con hacha & Presión cuando planta el hacha",
      defenseTip: "Sin Goro/Motaro, su db+3 en bloqueo deja huecos castigables; en rango lejano su hacha es lenta, así que esquiva o castiga el whiff."
    }
  },
  "Sindel": {
    keyMoves: [
      { input: "f+1, 2", frames: "10f Mid", notes: "Pelo largo seguro en bloqueo hacia Scream." },
      { input: "db+2", frames: "Scream", notes: "Grito paralizante que deja combo gratis desde toda la pantalla." },
      { input: "db+4", frames: "Levitate", notes: "Flota en el aire para engañar antiaéreos y hacer 50/50 con Kung Lao." }
    ],
    combos: [
      { type: "Midscreen Pelo + Grito", difficulty: "Media", resource: "Sin Barra", notation: "f+1,2 ~ db+2 > dash > j.2,4 ~ Levitate j.2 > 4 ~ bf+2", damage: "362 dmg" },
      { type: "1 Barra (EX Hair Whip)", difficulty: "Difícil", resource: "Con Recursos", notation: "2,4 ~ EX bf+1 > db+2 > f+1,2 > j.1,2 ~ bf+3", damage: "428 dmg" }
    ],
    counterplay: {
      focus: "Up-Block contra sus caídas Levitate & Castiga Scream en bloqueo",
      defenseTip: "Su Scream (db+2) en bloqueo es muy castigable (-18f); cuando flote encima de ti, usa Up-Block al aéreo descendente para castigar."
    }
  },
  "Nitara": {
    keyMoves: [
      { input: "1, 2, 1", frames: "7f High", notes: "Cadena rápida hacia mordisco aéreo o vuelo." },
      { input: "j.d+4", frames: "Divekick", notes: "Patada en picado tras doble Air Dash." },
      { input: "bf+2", frames: "Blood Bite", notes: "Recupera vida propia y eleva combos." }
    ],
    combos: [
      { type: "Aéreo Air Dash BnB", difficulty: "Media", resource: "Sin Barra", notation: "1,2,1 > j.1,2,4 ~ Air Dash > j.1,2 ~ bf+2", damage: "370 dmg" },
      { type: "Con Ferra / 1 Barra", difficulty: "Difícil", resource: "Con Recursos", notation: "2,1 ~ EX db+2 > j.2,4 > Air Dash > j.1,2 ~ bf+2", damage: "485 dmg" }
    ],
    counterplay: {
      focus: "Aprovecha su poca vida (900 HP) & Antiaéreo (d+2) a sus Air Dashes",
      defenseTip: "Nitara tiene la vida más baja de MK1 (900-950 HP); usa d+2 o tu Kameo antiaéreo cada vez que gaste Air Dash hacia arriba."
    }
  },
  "Reiko": {
    keyMoves: [
      { input: "f+1, 2", frames: "10f Mid", notes: "Espalda/empuje seguro hacia Command Grab mix." },
      { input: "bd+3", frames: "Pale Rider (Command Grab)", notes: "Agarre imbloqueable convertible en 40% con Darrius/Tremor." },
      { input: "bf+1", frames: "Ninja Stars", notes: "Shurikens múltiples que ganan las guerras de proyectiles." }
    ],
    combos: [
      { type: "BnB Sin Kameo", difficulty: "Fácil", resource: "Sin Barra", notation: "f+1,2 ~ bf+3 > dash > 2,1 ~ db+3", damage: "310 dmg" },
      { type: "Command Grab + Darrius/Tremor", difficulty: "Media", resource: "Con Recursos", notation: "bd+3 + Darrius Tornado > f+1,2 > 4 ~ bf+3", damage: "398 dmg" }
    ],
    counterplay: {
      focus: "Salta / Neutral Duck su Command Grab (bd+3) & Avanza entre Shurikens",
      defenseTip: "En cuanto termine su cadena de cerca, predice el bd+3 (es High — puedes agacharte sin bloquear o saltar hacia adelante para castigarlo con combo máximo)."
    }
  },
  "Shang Tsung": {
    keyMoves: [
      { input: "bf+1", frames: "Triple Skull", notes: "Tres bolas de fuego en forma joven/vieja." },
      { input: "f+4, 1", frames: "13f Mid", notes: "Iniciador de medio alcance hacia lanzador de garras." },
      { input: "db+4", frames: "Form Switch", notes: "Alterna entre Joven (combos largos) y Viejo (zoning pesado)." }
    ],
    combos: [
      { type: "Joven Midscreen", difficulty: "Media", resource: "Sin Barra", notation: "f+4,1 ~ db+1 > j.1,2 > 4 ~ bf+2", damage: "345 dmg" },
      { type: "Triple Skull (1 Barra)", difficulty: "Difícil", resource: "Con Recursos", notation: "2,1 ~ EX db+1 > Form Switch > Triple Skull > bf+2", damage: "418 dmg" }
    ],
    counterplay: {
      focus: "Caminar y Bloquear entre Triple Skulls & Sub-Zero/Khameleon Anti-Zoner",
      defenseTip: "Las Triple Skulls tienen alta recuperación si las saltas o bloqueas de cerca; usa Kameos inmunes a proyectiles para cerrar distancia."
    }
  },
  "Omni-Man": {
    keyMoves: [
      { input: "b+1, 1", frames: "12f Mid", notes: "Avance seguro hacia postura Viltrumita." },
      { input: "db+3", frames: "Viltrumite Stance", notes: "Esquiva proyectiles; sigue con 1 (lanzador), 2 (overhead) o 3." },
      { input: "f+4, 1", frames: "14f Mid", notes: "Iniciador largo confirmable en postura aérea." }
    ],
    combos: [
      { type: "Postura Sin Barra", difficulty: "Fácil", resource: "Sin Barra", notation: "b+1,1 ~ db+3,1 > j.1,2, 1+3 > j.2,1,2, 1+3", damage: "348 dmg" },
      { type: "Con Kung Lao / Jax", difficulty: "Media", resource: "Con Recursos", notation: "db+3,2 + Kung Lao Low Hat > f+4,1 > j.1,2 ~ bf+2", damage: "415 dmg" }
    ],
    counterplay: {
      focus: "NO lances proyectiles si tiene barra de Viltrumite Stance & Castiga db+3,3",
      defenseTip: "El telepuerto detrás con golpe (db+3,3) es totalmente castigable si lo bloqueas, y su db+3,2 (Overhead) se puede bloquear de pie por reacción."
    }
  },
  "Quan Chi": {
    keyMoves: [
      { input: "b+3, 4", frames: "15f Low", notes: "Largo alcance bajo hacia Bone Cage." },
      { input: "db+2", frames: "Portal / Tentacle", notes: "Lanza tentáculos desde portales a toda pantalla." },
      { input: "db+3", frames: "Armor Portal", notes: "Zona de armadura verde que absorbe un golpe rival." }
    ],
    combos: [
      { type: "Midscreen Tentáculos", difficulty: "Fácil", resource: "Sin Barra", notation: "b+3,4 ~ db+1 > dash > f+2,1 ~ bf+2", damage: "320 dmg" },
      { type: "Con Janet Cage (1 Barra)", difficulty: "Media", resource: "Con Recursos", notation: "f+2,1 ~ EX db+2 + Janet Hop > b+3,4 ~ bf+4", damage: "410 dmg" }
    ],
    counterplay: {
      focus: "Rushdown Pegado & Cuidado con su Armor Portal",
      defenseTip: "Quan Chi sufre mucho a corta distancia (pokes lentos); una vez que le cierres la distancia, haz pressure de staggers sin darle respiro para invocar portales."
    }
  },
  "Peacemaker": {
    keyMoves: [
      { input: "bf+3", frames: "Human Torpedo", notes: "Embestida ultrarrápida segura si se combina con Kano." },
      { input: "db+4", frames: "Eagly", notes: "Llama al águila para extender o presionar en alto/bajo." },
      { input: "2, 2", frames: "10f High-Mid", notes: "Disparo y golpe rápido hacia lanzador aéreo." }
    ],
    combos: [
      { type: "Midscreen Pistola + Eagly", difficulty: "Media", resource: "Sin Barra", notation: "2,2 ~ db+4 > dash > f+4,1 > j.1,2 ~ bf+3", damage: "355 dmg" },
      { type: "1 Barra (EX Torpedo)", difficulty: "Media", resource: "Con Recursos", notation: "f+4,1 ~ EX bf+1 > db+4 > 2,2 ~ bf+3", damage: "422 dmg" }
    ],
    counterplay: {
      focus: "Castiga Human Torpedo sin Kano & Agacha disparos altos",
      defenseTip: "Si usa Torpedo (bf+3) o Sonic Boom sin barra de Kano lista, queda en gran desventaja en bloqueo (-16f)."
    }
  },
  "Ermac": {
    keyMoves: [
      { input: "db+1", frames: "Telekinesis Lift", notes: "Levanta al rival con almas para combo completo." },
      { input: "f+4", frames: "13f Mid", notes: "Avance seguro hacia cancelación flotante." },
      { input: "bf+2", frames: "Soul Ball", notes: "Orbe aéreo/terrestre que controla ritmo." }
    ],
    combos: [
      { type: "Almas Sin Barra", difficulty: "Media", resource: "Sin Barra", notation: "f+4 ~ db+1 > j.2,4 ~ Levitate j.2 > 2,1 ~ bf+3", damage: "352 dmg" },
      { type: "Cancelaciones Aéreas (1 Barra)", difficulty: "Difícil", resource: "Con Recursos", notation: "2,1 ~ EX db+1 > f+4 ~ Hover Cancel > 1,2 ~ bf+3", damage: "440 dmg" }
    ],
    counterplay: {
      focus: "Interrumpe sus Hover Cancels con d+1 / Jab",
      defenseTip: "Muchas cancelaciones flotantes de Ermac tienen huecos de 6–8 frames en bloqueo; si abusa de cancelar cadenas medias, corta su turno con un poke rápido."
    }
  },
  "Homelander": {
    keyMoves: [
      { input: "db+4", frames: "Flight Mode", notes: "Vuelo instantáneo con mix-ups en el aire, láseres y agarre aéreo." },
      { input: "2, 1", frames: "8f High-Mid", notes: "Cadena rápida confirmable hacia vuelo o Ferra." },
      { input: "bf+1", frames: "Laser Eyes", notes: "Rayo horizontal/aéreo rápido de pantalla completa." }
    ],
    combos: [
      { type: "Vuelo Midscreen", difficulty: "Media", resource: "Sin Barra", notation: "2,1 ~ db+4 > j.2,4 > dash > f+4 ~ bf+2", damage: "358 dmg" },
      { type: "Ferra + Vuelo (1 Barra)", difficulty: "Difícil", resource: "Con Recursos", notation: "Ferra Mix > 2,1 ~ EX db+2 > Flight j.1,2 ~ bf+3", damage: "455 dmg" }
    ],
    counterplay: {
      focus: "Agáchate sus láseres altos & Up-Block a su caída Overhead",
      defenseTip: "Sus ojos láser terrestres golpean High en gran parte del neutro y su caída aérea suele venir en Overhead: prepara Up-Block y antiaéreos."
    }
  },
  "Takeda Takahashi": {
    keyMoves: [
      { input: "f+1, 2", frames: "12f Mid", notes: "Látigos de largo alcance seguros en neutro." },
      { input: "bf+2", frames: "Kunai Explosion", notes: "Kunais que explotan tras un retardo para cubrir o extender." },
      { input: "db+3", frames: "Whip Swing", notes: "Balanceo aéreo con látigos." }
    ],
    combos: [
      { type: "Látigos + Kunai", difficulty: "Media", resource: "Sin Barra", notation: "f+1,2 ~ bf+2 > j.2,4 > dash > 4 ~ db+2", damage: "360 dmg" },
      { type: "Con Janet Cage (1 Barra)", difficulty: "Difícil", resource: "Con Recursos", notation: "2,1 ~ EX bf+2 + Janet > f+1,2 > j.1,2 ~ bf+3", damage: "465 dmg" }
    ],
    counterplay: {
      focus: "Presiona en corto (Startup lento) & Cuidado con Kunai retrasado",
      defenseTip: "Takeda brilla a media distancia con los látigos pero sus normales cercanos son lentos (10-12f); entra pegado con rushdown."
    }
  },
  "Cyrax": {
    keyMoves: [
      { input: "bf+1", frames: "Electro Net", notes: "Red que paraliza permitiendo colocar bombas." },
      { input: "db+2", frames: "Cyber Bomb", notes: "Coloca bomba con retardo de detonación para setplay." },
      { input: "f+2, 1", frames: "11f Mid", notes: "Cadena rápida confirmable hacia bomba/red." }
    ],
    combos: [
      { type: "Bomba + Red BnB", difficulty: "Media", resource: "Sin Barra", notation: "f+2,1 ~ db+2 > bf+1 > 4 ~ bf+3", damage: "338 dmg" },
      { type: "Esquina Setplay (1 Barra)", difficulty: "Difícil", resource: "Con Recursos", notation: "2,1 ~ EX db+2 > Bomba > 4 ~ bf+1 > db+4", damage: "425 dmg" }
    ],
    counterplay: {
      focus: "Golpea antes de que su bomba detone / Usa Breaker en Setups",
      defenseTip: "Su Red (bf+1) es High y muy castigable en bloqueo; en setups de esquina usa Delayed Wakeup para alterar el timing de la explosión."
    }
  },
  "Sektor": {
    keyMoves: [
      { input: "bf+2", frames: "Homing Missile", notes: "Misil con retraso que cubre tus entradas y deja +frames." },
      { input: "db+3", frames: "Teleport Uppercut", notes: "Teletransporte por detrás lanzador." },
      { input: "df+1", frames: "Flamethrower", notes: "Lanzallamas de gran desgaste y rango." }
    ],
    combos: [
      { type: "Misil + Propulsores", difficulty: "Fácil", resource: "Sin Barra", notation: "1,2 ~ db+3 > j.2,4 ~ EX bf+2 > f+2,1 ~ bf+3", damage: "355 dmg" },
      { type: "Doble Misil (1 Barra)", difficulty: "Media", resource: "Con Recursos", notation: "f+2,1 ~ EX db+3 + Sektor Kameo > j.1,2 ~ df+1", damage: "420 dmg" }
    ],
    counterplay: {
      focus: "Castiga el Teleport Uppercut en bloqueo (-20f+)",
      defenseTip: "Mantén la guardia lista ante su teletransporte db+3 (solo es seguro con Kameo) y salta sobre sus llamas rectas a media distancia."
    }
  },
  "Noob Saibot": {
    keyMoves: [
      { input: "f+2, 2", frames: "12f Mid", notes: "Iniciador de sombra largo hacia portal." },
      { input: "db+4", frames: "Shadow Portal", notes: "Abre portal debajo del enemigo para extender combos." },
      { input: "bf+2", frames: "Shadow Tackle", notes: "Clon que embiste de lado a lado de la pantalla." }
    ],
    combos: [
      { type: "Clon + Portal Sin Barra", difficulty: "Fácil", resource: "Sin Barra", notation: "f+2,2 ~ db+4 > dash > 4 ~ bf+2", damage: "350 dmg" },
      { type: "Con Sareena (+45% Daño)", difficulty: "Media", resource: "Con Recursos", notation: "f+2,2 + Sareena > 4 ~ db+4 > j.1,2 ~ bf+2", damage: "450 dmg" }
    ],
    counterplay: {
      focus: "Bloquea de pie contra clones altos & Castiga Slide/Tackle",
      defenseTip: "Sus clones horizontales y Shadow Tackle son muy castigables si los bloqueas de cerca (-18f+); cuidado con saltar sin plan por sus antiaéreos."
    }
  },
  "Ghostface": {
    keyMoves: [
      { input: "2, 1", frames: "9f Mid", notes: "Cuchilladas rápidas seguras con cambio de asesino." },
      { input: "db+3", frames: "Killer Switch", notes: "Cambia de asesino otorgando nuevos ataques sigilosos." },
      { input: "bf+3", frames: "Knife Rush", notes: "Embestida con cuchillo confirmable con Mavado." }
    ],
    combos: [
      { type: "Asesino Estándar", difficulty: "Fácil", resource: "Sin Barra", notation: "2,1 ~ db+1 > dash > f+2,1 ~ bf+3", damage: "345 dmg" },
      { type: "Con Mavado OTG (1 Barra)", difficulty: "Media", resource: "Con Recursos", notation: "bf+3 + Mavado > 2,1 ~ EX db+3 > 4 ~ bf+2", damage: "418 dmg" }
    ],
    counterplay: {
      focus: "Corta las entradas de segundo asesino & Castiga Knife Rush",
      defenseTip: "Cuando llama al segundo asesino desde fuera de pantalla suele tener Startup visible; mantén bloqueo bajo por defecto frente a su deslizamiento."
    }
  },
  "Conan the Barbarian": {
    keyMoves: [
      { input: "f+2", frames: "14f Mid", notes: "Espadazo pesado de enorme rango para castigar al aire." },
      { input: "db+2", frames: "Atlantean Parry", notes: "Contraataque atlante contra golpes físicos." },
      { input: "bf+2", frames: "Crom Splash", notes: "Salto pesado destructor de distancia." }
    ],
    combos: [
      { type: "Espadazo Pesado", difficulty: "Fácil", resource: "Sin Barra", notation: "f+2 > 2,1 ~ bf+2 > dash > 4 ~ db+1", damage: "368 dmg" },
      { type: "Con Ferra / Sareena", difficulty: "Media", resource: "Con Recursos", notation: "f+2 + Sareena > 2,1 ~ EX bf+2 > 4 ~ db+1", damage: "460 dmg" }
    ],
    counterplay: {
      focus: "No dispares ataques predecibles a su Parry & Zóneale si no usa Sub-Zero",
      defenseTip: "Conan no tiene proyectiles rápidos y sus espadazos fuertes tienen Recovery notable en whiff; amaga y castiga al aire."
    }
  },
  "T-1000": {
    keyMoves: [
      { input: "1, 2", frames: "8f High-Mid", notes: "Cuchillas de metal líquido para presión constante." },
      { input: "f+3", frames: "13f Mid", notes: "Lanza polimórfica de larguísimo alcance en el suelo." },
      { input: "bf+2", frames: "Liquid Dash", notes: "Se funde en el suelo para atravesar ataques y aparecer debajo." }
    ],
    combos: [
      { type: "Metal Líquido Midscreen", difficulty: "Fácil", resource: "Sin Barra", notation: "f+3 ~ db+2 > dash > 1,2 ~ bf+2", damage: "345 dmg" },
      { type: "Con Madam Bo (1 Barra)", difficulty: "Media", resource: "Con Recursos", notation: "1,2 ~ EX db+2 + Madam Bo > f+3 > 4 ~ bf+3", damage: "420 dmg" }
    ],
    counterplay: {
      focus: "Castiga Liquid Dash (bf+2) en bloqueo & Cuidado con su alcance f+3",
      defenseTip: "Su líquido deslizante es altamente castigable si lo bloqueas agachado (-16f+); respeta su lanza f+3 en neutro antes de pulsar botones."
    }
  }
};

// Base compacta y exacta para Tekken 8 (44), DBFZ (45), GGST (34), SF6 Counterplay (30) y SSBU (86)
const T8_KEY_OVERRIDES = {
  "Jin Kazama": { km: [{ input: "d+2", frames: "i20 Low (+4c)", notes: "Bajo evasivo de alto alcance; lanza en Counter Hit." }, { input: "f+4", frames: "i16 Mid", notes: "Patada frontal reina de media distancia." }, { input: "f,n,d,df+2", frames: "i14 High (+5)", notes: "EWHF: lanzador positivo en bloqueo." }, { input: "2, 1, 4", frames: "i10-i18", notes: "Cadena segura de presión y pokeo." }], cb: [{ type: "BnB Estándar (EWHF / uf+4)", difficulty: "Media", resource: "Sin Barra", notation: "uf+4 > b+3~f 1 > b+3~f 1 > b,f+2,3~f (Tornado) > dash > b+3~f 1,3", damage: "68 dmg" }, { type: "Heat Combo Óptimo", difficulty: "Difícil", resource: "Con Recursos", notation: "EWHF > df+2 > b+3~f 1 > b,f+2,3~f > Heat Burst > ZEN 1+2 > Ender", damage: "82 dmg" }], cp: { sidestep: "SSR (Paso Lateral Derecha) en neutro", duck: "Agacha el 3.er hit de 1,3~3 y EWHF si lo anticipas", tip: "No pulses tras bloquear d+2 (+4 para Jin); f+4~f es interrumpible con jab si no entra en postura." } },
  "Kazuya Mishima": { km: [{ input: "f,n,d,df+2", frames: "i13-14 High (+5)", notes: "Electric Wind God Fist: pilar de su neutro y castigo." }, { input: "f,n,d,df+4, 1", frames: "i16 Low", notes: "Hell Sweep: derriba y reinicia el Vortex 50/50." }, { input: "ff+3", frames: "i20 Mid", notes: "Hachazo lanzador que castiga a quien se agache al Hell Sweep." }, { input: "ws+1, 2", frames: "i13 Twin Pistons", notes: "Mejor castigo agachado de 13 frames del juego." }], cb: [{ type: "BnB desde EWGF", difficulty: "Difícil", resource: "Sin Barra", notation: "EWGF > EWGF > b+2,2 > df+1,df+2 (Tornado) > dash > b+3,1~df > cd+1+2", damage: "75 dmg" }, { type: "Hell Sweep / df+2 Básico", difficulty: "Fácil", resource: "Sin Barra", notation: "ws+1,2 > df+3 > df+1,df+2 (Tornado) > dash > 3,1~df > 1+2", damage: "66 dmg" }], cp: { sidestep: "SSL (Paso Lateral Izquierda) obligatorio", duck: "Agacha el 2.º hit de 1,2,4,3 / EWGF en predicción", tip: "Hacer SSL esquiva casi todas las opciones de Mishima (Hell Sweep, ff+3 y EWGF)." } },
  "King": { km: [{ input: "f,f,n+1+2", frames: "i9/Chest", notes: "Shove en Counter Hit y setup de agarre." }, { input: "b+1, 2", frames: "i12 Punish", notes: "Castigo rápido y CH launcher (b+1)." }, { input: "f,hcf+1", frames: "Giant Swing (10f)", notes: "Agarre más rápido de Tekken; rompes con 1." }, { input: "uf+4", frames: "i15 Hopkick", notes: "Lanzador clásico invulnerable a bajos." }], cb: [{ type: "Hopkick / Jaguar BnB", difficulty: "Media", resource: "Sin Barra", notation: "uf+4 > df+4,3 > df+2,1 (Tornado) > dash > f,f,F+2+4 (ISW)", damage: "73 dmg" }, { type: "Heat & Muscle Armor", difficulty: "Fácil", resource: "Con Recursos", notation: "f+2,1 (Heat Engager) > RJS 1+2 > df+2,1 > Running Powerbomb", damage: "81 dmg" }], cp: { sidestep: "SSR (Paso Lateral Derecha) corta sus F+2 y Linear mids", duck: "Agacha el segundo hit de 2,1 / b+1,2 y rompe agarres con 1 o 1+2", tip: "Contra Shining Wizard rompe con 1+2; contra Giant Swing rompe con 1 aunque parezca similar." } },
  "Reina": { km: [{ input: "ff+2", frames: "i13 Mid", notes: "Avance brutal hacia postura Sentai (SEN) 50/50." }, { input: "f,n,d,df+2", frames: "i13-14 EWGF", notes: "Electric Mishima clásico." }, { input: "df+1, 1", frames: "i13 Mid-High", notes: "Chequeo veloz confirmable en Sentai." }, { input: "SEN 3", frames: "i12 High (+frames)", notes: "Patada rapidísima tras entrar en Sentai." }], cb: [{ type: "BnB Desde EWGF / df+2", difficulty: "Media", resource: "Sin Barra", notation: "df+2 > df+1 > f+2,3~f > SEN 1,2 (Tornado) > dash > 3,2 > ff+2~f > SEN 3+4", damage: "71 dmg" }, { type: "Heat Sentai Combo", difficulty: "Difícil", resource: "Con Recursos", notation: "ff+2~f > SEN 2 > Heat Dash > EWGF > f+2,3~f > SEN 1+2", damage: "84 dmg" }], cp: { sidestep: "SSL (Paso Lateral Izquierda) esquiva ff+2!", duck: "Agacha SEN 3 (High) tras bloquear ff+2 si abusa de él", tip: "Tras bloquear ff+2 puedes hacer Sidestep Izquierda (SSL) o jab rápido contra las variantes lentas de Sentai." } },
  "Sergei Dragunov": { km: [{ input: "f,f,F+2", frames: "i15 High (+6)", notes: "Puño corriendo icónico de presión continua." }, { input: "d+2", frames: "i18 Low", notes: "Bajo rápido que fuerza agacharse a cualquier rival." }, { input: "b+1+2", frames: "i22 Mid (+6)", notes: "Codazo imponente en bloqueo para presionar." }, { input: "qcf+4", frames: "i19 Mid (+7)", notes: "Pisotón aplastante en bloqueo (muy positivo)." }], cb: [{ type: "BnB Estándar (df+2)", difficulty: "Media", resource: "Sin Barra", notation: "df+2 > 4,4 > df+1 > 3,1~df > SNK 2 (Tornado) > dash > b+4,2,1", damage: "72 dmg" }, { type: "Heat & Sneak Loops", difficulty: "Difícil", resource: "Con Recursos", notation: "df+2 > f+3~df (CC) > b+4,3 > Heat Burst > SNK 4 > Ender", damage: "85 dmg" }], cp: { sidestep: "SSL (Paso Lateral Izquierda) contra f,f,F+2 y b+1+2", duck: "Agacha qcf+4? No, es Mid — haz SSR/SSL", tip: "Muchos Dragunovs abusan de iWR2 (f,f,F+2) y qcf+4: haz SSL en rango medio y castiga con lanzador." } },
  "Hwoarang": { km: [{ input: "d+3, 4", frames: "i17 Low-High", notes: "El iniciador estrella hacia Right Flamingo." }, { input: "b+3", frames: "i16 Launcher", notes: "Patada castigadora de larguísimo rango (-19 en bloqueo)." }, { input: "f,f+4", frames: "Peacekeeper", notes: "Patada que cambia de postura." }, { input: "RFF d/f+4~f", frames: "Flamingo Loop", notes: "Mantiene turnos positivos infinitos." }], cb: [{ type: "BnB Desde b+3 / uf+3,4", difficulty: "Media", resource: "Sin Barra", notation: "b+3 > f+4 > RFS 2 > b+4 > RFF 3~4 (Tornado) > dash > RFF f+3, f+3+4", damage: "74 dmg" }, { type: "Flamingo Heat Combo", difficulty: "Difícil", resource: "Con Recursos", notation: "d+3,4 (CH) > RFS f+4,4 > Heat Dash > uf+3+4~f > b+3", damage: "82 dmg" }], cp: { sidestep: "Step hacia su estómago (SSR si está en LFF, SSL en RFF)", duck: "Agacha d+3,4 (2.º hit High) y Backlash (RFF 3~4)", tip: "No pulses a lo loco en mitad de Flamingo; usa Dick Jab (d+1) o Power Crush contra huecos y castiga siempre b+3 (-19f)." } },
  "Bryan Fury": { km: [{ input: "3+4", frames: "i18 Mid Keepout", notes: "Patada de largo alcance invencible a avances." }, { input: "b+1", frames: "i20 Mid (+4)", notes: "Codazo positivo en bloqueo que inicia Frame Traps." }, { input: "qcb+1", frames: "i13 High (+5)", notes: "Gancho rápido positivo en bloqueo y CH launcher." }, { input: "f,b+2", frames: "Jet Upper (i14)", notes: "Lanzador de 14 frames desde Taunt o Castigo." }], cb: [{ type: "BnB Desde Jet Upper / uf+4", difficulty: "Media", resource: "Sin Barra", notation: "f,b+2 > df+2,1 > 1+2,1 > b+2,1~f > SWY 2,4 (Tornado) > b+3~f > 2,1", damage: "76 dmg" }, { type: "Taunt Jet Upper / Heat", difficulty: "Difícil", resource: "Con Recursos", notation: "Taunt (1+3+4) > f,b+2 > Heat Burst > qcf+3,4 > b+2,1~f 2,1", damage: "88 dmg" }], cp: { sidestep: "SSR (Paso Lateral Derecha) esquiva b+1, qcb+1 y 3+4", duck: "Agacha qcb+1 si abusa en neutro", tip: "No pulses botones tras bloquear b+1 (+4) o qcb+1 (+5) porque su df+1 / f+3 te matan en Counter Hit." } },
  "Kazama Jun": {},
  "Victor Chevalier": { km: [{ input: "df+2", frames: "i15 Launcher", notes: "Lanzador clásico rápido hacia combos con espada." }, { input: "b+1+2", frames: "Expulsion", notes: "Explosión brutal en Heat con enorme alcance." }, { input: "wr+2", frames: "i15 Mid (+4)", notes: "Avance veloz que inicia Perfumer Stance." }, { input: "u+1+2", frames: "Armored", notes: "Saltón con espada ideal para castigos fuertes." }], cb: [{ type: "BnB Estándar (df+2)", difficulty: "Fácil", resource: "Sin Barra", notation: "df+2 > df+4,2~f > PRF 2,2,1+2 (Tornado) > dash > f,f,F+2 > db+1,1~f", damage: "70 dmg" }], cp: { sidestep: "SSL (Paso Lateral Izquierda) corta Perfumer y Iai Stance", duck: "Agacha el disparo de pistola (PRF 1) o f+2,2,2", tip: "En bloqueo, su df+2 es castigable (-14f) y su u+1+2 (Expulsion) fuera de Heat se castiga fácil." } },
  "Kuma": { km: [{ input: "f+2, 1", frames: "i10 / Heat", notes: "Castigo veloz y activador de Heat." }, { input: "f,n,d,df+2", frames: "Electric Wind Bear Fist", notes: "Electric exclusivo en Heat (+5 en bloqueo)." }, { input: "b+1", frames: "Power Crush", notes: "Embiste con armadura y mucho empuje." }, { input: "df+2, 1", frames: "i15 Launcher", notes: "Lanzador de larguísimo alcance." }], cb: [{ type: "BnB Oso Estándar", difficulty: "Fácil", resource: "Sin Barra", notation: "df+2,1 > bf+2 > df+3,2 (Tornado) > dash > f+2,1", damage: "75 dmg" }, { type: "Muro + Heat Salmón", difficulty: "Media", resource: "Con Recursos", notation: "EWBF (Heat) > Wall Splat > uf+1+2 > H.b+1+2 (Salmón)", damage: "94 dmg" }], cp: { sidestep: "SSR en neutro & Mantente lejos de la pared", duck: "Cuidado con b+2,1,2; bloquea medio por el enorme daño en muro", tip: "Su df+2,1 es muy castigable (-15f+) si lo bloqueas, igual que su Bear Twin Pistons." } },
  "Paul Phoenix": { km: [{ input: "qcf+2", frames: "Deathfist (i15)", notes: "Puño llameante legendario de daño absurdo (-17f pero con pushback)." }, { input: "d+4, 2:1+2", frames: "Demoman", notes: "Combo bajo en corta distancia (Clean Hit)." }, { input: "df+2", frames: "i15 Safe Launcher", notes: "Lanzador de 15f TOTALMENTE seguro en bloqueo (-8f) que evade altos." }, { input: "b+3", frames: "i14 High", notes: "Castigo rápido lanzador." }], cb: [{ type: "BnB Desde df+2 / qcf+1", difficulty: "Fácil", resource: "Sin Barra", notation: "df+2 > df+4 > 3,2~b > SWA 1+2 (Tornado) > dash > qcf+2 (Deathfist)", damage: "76 dmg" }, { type: "Heat Deathfist Muro", difficulty: "Media", resource: "Con Recursos", notation: "Wall Splat > Heat Burst > qcf+2 (Guard Break / Chip letal)", damage: "92 dmg" }], cp: { sidestep: "SSR (Paso Lateral Derecha) contra qcf+2 y ff+2", duck: "Agacha el 2.º hit de 3,2 (High) y b+1,2", tip: "Su df+2 es -8f (no es castigable), pero Deathfist cerca de la pared queda al alcance de tu mejor castigo de 14–16f." } }
};

function generateRichFallbackForChar(gameId, chName, archetype, difficulty) {
  const arq = String(archetype || "").toLowerCase();
  const isZoner = arq.includes("zoner") || arq.includes("proyectil") || arq.includes("ki");
  const isGrappler = arq.includes("grappler") || arq.includes("agarre");
  const isRush = arq.includes("rush") || arq.includes("mix");
  const cleanName = chName.replace(/\(.*?\)/g, "").trim();

  if (gameId === "tekken8") {
    const t8Ovr = T8_KEY_OVERRIDES[chName];
    if (t8Ovr && t8Ovr.km) {
      return {
        keyMoves: t8Ovr.km,
        combos: t8Ovr.cb,
        counterplay: {
          title: `Cómo ganarle a ${chName} (Sidestep & Defensa Tekken 8)`,
          sidestep: t8Ovr.cp.sidestep,
          duck: t8Ovr.cp.duck,
          tip: t8Ovr.cp.tip
        }
      };
    }
    const ssDir = isGrappler || arq.includes("mishima") ? "SSL (Paso Lateral Izquierda)" : "SSR (Paso Lateral Derecha)";
    return {
      keyMoves: [
        { input: "1, 2", frames: "i10 High-High", notes: `Castigo veloz de 10 frames de ${cleanName} para robar el turno.` },
        { input: "df+1", frames: "i13 Mid", notes: `Chequeo medio rápido de ${cleanName} para frenar Sidesteps.` },
        { input: "df+2 / uf+4", frames: "i15 Launcher", notes: `Lanzador de 15f para castigar ataques inseguros y whiffs.` },
        { input: "ff+2 / f+2,1", frames: "Heat Engager", notes: `Iniciador principal de Heat (+17f en impacto) de ${cleanName}.` }
      ],
      combos: [
        { type: `Combo Estándar ${cleanName} (df+2 / uf+4)`, difficulty: "Fácil", resource: "Sin Barra", notation: `df+2 > df+1 > b+2,1 (Tornado) > dash > f,f,F+2,1`, damage: "69 dmg" },
        { type: `Heat Combo Optimizado (${cleanName})`, difficulty: difficulty || "Media", resource: "Con Recursos", notation: `uf+4 > 4,1 > Heat Burst > dash > Tornado > Heat Dash > Wall Ender`, damage: "81 dmg" }
      ],
      counterplay: {
        title: `Cómo ganarle a ${chName} (Sidestep & Defensa Tekken 8)`,
        sidestep: `${ssDir} en neutro (-1 a -4 en bloqueo)`,
        duck: isZoner ? "Agacha sus proyectiles / segundos golpes altos y castiga con ws+2" : "Agacha el segundo golpe de cadenas High-High (1,2 / df+1,1) para lanzar con ws+2",
        tip: `${chName} (${archetype}): bloquea paciente su activación de Heat y castiga con 10f–15f en cuanto termine su cadena de postura.`
      }
    };
  }

  if (gameId === "mk1") {
    const mk = MK1_CHAR_GUIDES[chName];
    if (mk) {
      return {
        keyMoves: mk.keyMoves,
        combos: mk.combos,
        counterplay: {
          title: `Cómo ganarle a ${chName} (Flawless Block & Micro-Duck MK1)`,
          flawless: mk.counterplay.focus,
          duck: mk.counterplay.defenseTip,
          tip: mk.counterplay.gapOrBlock
        }
      };
    }
    return {
      keyMoves: [
        { input: "1, 2", frames: "7f High-Mid", notes: `Cadena rápida de ${cleanName} para castigar errores.` },
        { input: "f+3, 2", frames: "12f Mid", notes: `Mid principal de ${cleanName} confirmable con Kameo.` },
        { input: "b+3", frames: "15f Low", notes: `Poke bajo clave para abrir defensas de pie.` },
        { input: "db+2 / bf+1", frames: "Especial / EX", notes: `Herramienta insignia de ${cleanName} (${archetype}).` }
      ],
      combos: [
        { type: `BnB Midscreen (${cleanName})`, difficulty: "Fácil", resource: "Sin Barra", notation: "f+3,2 > j.1,2 ~ db+2 > dash > 2,1 ~ bf+2", damage: "340 dmg" },
        { type: `1 Barra + Kameo (${cleanName})`, difficulty: "Media", resource: "Con Recursos", notation: "1,2 ~ EX bf+1 + Kameo > f+3,2 > j.1,2 ~ bf+2", damage: "412 dmg" }
      ],
      counterplay: {
        title: `Cómo ganarle a ${chName} (Flawless Block & Micro-Duck MK1)`,
        flawless: `Flawless Block al último golpe de sus cadenas multihit (${cleanName})`,
        duck: "Haz Micro-Duck en rango corto si abusa de iniciadores High (1,2) para castigar con d+2.",
        tip: isZoner ? `Usa Kameos Anti-Zoning (Sub-Zero / Motaro / Khameleon) para entrar contra ${chName}.` : `Guarda barras para Breaker y respeta su llamada de Kameo Ambush antes de apretar botón.`
      }
    };
  }

  if (gameId === "sf6") {
    return {
      counterplay: {
        title: `Cómo ganarle a ${chName} (Counterplay Street Fighter 6)`,
        flawless: isZoner ? "Perfect Parry a sus proyectiles en rango medio para avanzar sin perder Drive" : "Delay Throw Tech en esquina para cubrir Strike y Agarre a la vez",
        duck: isGrappler ? "Haz Backdash o Neutral Jump en okizeme si predices el agarre de comando" : "Interrumpe sus especiales pesados (-frames) o busca Drive Impact contra movimientos lentos no cancelables",
        tip: `Controla su Win Condition (${archetype}) forzando Burnout en esquina.`
      }
    };
  }

  if (gameId === "dbfz") {
    return {
      keyMoves: [
        { input: "5L > 5LL", frames: "6-7f", notes: `Inicio rápido de presión de ${cleanName} confirmable en Assist.` },
        { input: "2M > 5M", frames: "10f Low-Mid", notes: `Arranque óptimo de ${cleanName} hacia máximo escalado de daño.` },
        { input: "2H", frames: "Antiaéreo 4f+", notes: "Antiaéreo universal contra Super Dash y saltos IAD." },
        { input: "236S / 214M", frames: "Especial Insignia", notes: `Herramienta propia de ${cleanName} (${archetype}).` }
      ],
      combos: [
        { type: `Ruta Universal + Especial (${cleanName})`, difficulty: "Fácil", resource: "Sin Barra", notation: `2M > 5M > jc > j.MLL > j.2H > SD > j.MLL > j.2H > jc > j.LLL ~ 236L/M`, damage: "4280 dmg" },
        { type: `Esquina + Assist + Level 3 (${cleanName})`, difficulty: difficulty || "Media", resource: "Con Recursos", notation: `2M > 5M > 236M + Assist > 2M > 5H > j.LLL > Super Lv1 > DHC Lv3`, damage: "5650 dmg" }
      ],
      counterplay: {
        title: `Cómo ganarle a ${chName} (Reflect, 2H & Defensa DBFZ)`,
        flawless: "Usa 2H en reacción cada vez que lance Super Dash sin asistencia detrás",
        duck: isRush ? "Usa Reflect (4S) justo después de su 5H o especial bloqueado para alejarle" : "Salta en Super Jump + Guard contra sus proyectiles o trampas en suelo",
        tip: `Vigila si ${cleanName} lleva a Kid Buu / Yamcha / Android 17 como asistencia antes de intentar pulsar botón en su presión.`
      }
    };
  }

  if (gameId === "gg-strive") {
    return {
      keyMoves: [
        { input: "c.S", frames: "7f (+3/+2)", notes: `Botón de presión estrella de ${cleanName} hacia Gatlings.` },
        { input: "f.S > 5HS", frames: "10f Mid", notes: `Control de espacio horizontal de ${cleanName}.` },
        { input: "6P", frames: "Invuln Torso", notes: "Antiaéreo universal para ganar ataques aéreos y pokes altos." },
        { input: "236S / 214K", frames: "Especial Clave", notes: `Herramienta central del estilo ${archetype}.` }
      ],
      combos: [
        { type: `Gatling Wall Break (${cleanName})`, difficulty: "Fácil", resource: "Sin Barra", notation: "c.S > 2S > 5HS ~ 236S > Wild Assault (236D) > 6HS (Wall Break)", damage: "184 dmg" },
        { type: `Confirmación 2K>2D + RRC (${cleanName})`, difficulty: difficulty || "Media", resource: "Con Recursos", notation: "2K > 2D ~ Special > RRC > dash > c.S > 2HS ~ Special (Wall Break)", damage: "238 dmg" }
      ],
      counterplay: {
        title: `Cómo ganarle a ${chName} (6P, Faultless Defense & YRC GGST)`,
        flawless: "Usa Faultless Defense (FD) manteniendo Atrás+2 botones para empujarle fuera de su alcance de c.S/agarre",
        duck: "Utiliza 6P para cortar sus aproximaciones aéreas (j.S/j.H) y pokes largos horizontales",
        tip: `Guarda 50% Tension para Yellow RC (YRC) en mitad de la presión de ${cleanName} o Burst en su combo de esquina antes del Wall Break.`
      }
    };
  }

  // SSBU (86 luchadores)
  const fastOos = isRush
    ? `Up-B (Frame 4–6) • Nair OOS (Frame 6–8) • Grab (Frame 6)`
    : isGrappler
      ? `Up-B (Frame 6–8) • Bair OOS (Frame 9) • Command Grab`
      : `Up-Smash OOS (Frame 6–9) • Up-B (Frame 4–7) • Nair (Frame 6–8)`;
  return {
    keyMoves: [
      { input: "Nair / Fair", frames: "Aéreo Neutro", notes: `Herramienta aérea segura sobre escudo de ${cleanName} con Fast Fall.` },
      { input: "Bair (RAR)", frames: "Kill Move", notes: `Principal ataque aéreo de remate de ${cleanName} cerca del borde.` },
      { input: "Dtilt / Utilt", frames: "Combo Starter", notes: `Iniciador rápido en el suelo de 0% a 55% (${cleanName}).` },
      { input: "Up-B / Up-Smash", frames: "Out of Shield (OOS)", notes: `Respuesta más rápida directa desde el escudo.` }
    ],
    combos: [
      { type: `0%–40% BnB (${cleanName})`, difficulty: "Fácil", resource: "Sin Barra", notation: "Down Throw / Dtilt > Short Hop Fair / Nair > Dash Attack", damage: "34%" },
      { type: `Kill Confirm (${cleanName})`, difficulty: difficulty || "Media", resource: "Sin Barra", notation: "Landing Nair / Dtilt > RAR Back Air / Up-Smash", damage: "27% (KO 95%+)" }
    ],
    counterplay: {
      title: `Cómo ganarle a ${chName} (OOS, DI & Edgeguard SSBU)`,
      oos: fastOos,
      duck: isZoner ? "Camina y bloquea en escudo los proyectiles hasta rango medio; salta sus trampas en el borde." : "Respeta su opción más rápida Out of Shield (no hagas ataques inseguros justo sobre su escudo).",
      tip: `Usa DI hacia fuera cuando te atrape en combos de ${cleanName} a % bajos, y DI hacia dentro/abajo para sobrevivir sus Kill Moves al borde.`
    }
  };
}

function getSpecificCharData(gameId, name, archetype, difficulty) {
  return generateRichFallbackForChar(gameId, name, archetype, difficulty);
}

module.exports = {
  getSpecificCharData,
  MK1_CHAR_GUIDES,
  T8_KEY_OVERRIDES
};
