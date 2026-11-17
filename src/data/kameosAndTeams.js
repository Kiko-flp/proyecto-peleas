/**
 * Base de datos oficial de Kameos de Mortal Kombat 1 (21 Kameos),
 * motor de Sinergias Main ↔ Kameo y entre Kameos,
 * y Posicionamiento Competitivo 3v3 (Point / Mid / Anchor) + Asistencias de DBFZ (45 Luchadores).
 */

const MK1_KAMEOS = [
  {
    id: "kameo-darrius",
    name: "Darrius",
    pack: "Base",
    isDLC: false,
    callType: "Híbrido (Ambush / Summon)",
    hpBonus: "+50 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/f/f3/Darrius_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260708235249",
    tags: ["combo_extender", "setup", "overhead_low", "armor_break"],
    overview: "Especialista en extensiones de combo tras agarres (Throw Combos) y setups con Tornado Kick que permiten rebotes únicos en la esquina.",
    bestWithMainTypes: "Grapplers o personajes con gran control terrestre y agarres fuertes (Reiko, General Shao, Havik, Li Mei).",
    bestPartners: ["Reiko", "Havik", "General Shao", "Li Mei"],
    moves: [
      { input: "n+K", name: "Tornado Kick", type: "Summon", cost: "50%", frames: "19f Mid", notes: "Múltiples patadas giratorias; excelente para alargar combos en la esquina." },
      { input: "f+K", name: "Spinning Heel", type: "Summon", cost: "50%", frames: "16f Overhead", notes: "Overhead de largo alcance que mantiene presión a media distancia." },
      { input: "b+K", name: "Handstand Heel Drop", type: "Ambush", cost: "100%", frames: "22f Overhead", notes: "Permite combo completo tras ciertos agarres normales y ataques especiales." }
    ],
    gameplan: "Reserva la barra de Kameo para convertir cualquier agarre o cadena segura en más de 380+ de daño o para cerrar la esquina con Tornado Kick."
  },
  {
    id: "kameo-cyrax",
    name: "Cyrax (Kameo)",
    pack: "Base",
    isDLC: false,
    callType: "Ambush / Setup",
    hpBonus: "+0 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/1/1d/Cyrax_Battle_Icon_%28MK1%29_Kameo.png/revision/latest?cb=20260713200502",
    tags: ["setup", "safe_pressure", "combo_extender", "chip_damage"],
    overview: "Genera presión de chip damage y trampas con su bomba y red eléctrica (Net) para reiniciar la ofensiva tras un derribo.",
    bestWithMainTypes: "Personajes de presión cerrada o setplay que quieren hacer seguras sus cadenas y encerrar en bomba (Baraka, Kitana, Cyrax, Sektor).",
    bestPartners: ["Baraka", "Kitana", "Sektor", "Cyrax"],
    moves: [
      { input: "n+K", name: "Kopter Chopper (Horizontal)", type: "Ambush", cost: "50%", frames: "21f High/Mid", notes: "Cubre tus ataques en bloqueo con múltiples golpes de sierra y chip damage." },
      { input: "f+K", name: "Vertical Kopter", type: "Ambush", cost: "100%", frames: "22f Mid", notes: "Lanza al rival al aire para extender combos en mitad de pantalla." },
      { input: "b+K", name: "Electro Net", type: "Summon", cost: "50%", frames: "28f High", notes: "Captura al rival en red para reiniciar tu mejor mix-up o cargar recursos." },
      { input: "d+K", name: "Cyber Bomb", type: "Ambush", cost: "50%", frames: "Trampa", notes: "Coloca una bomba con retardo para setups imbloqueables/Oki." }
    ],
    gameplan: "Usa Electro Net para ganar tiempo en setups (Kenshi/Quan Chi/Geras) o Horizontal Chopper para hacer seguras cuerdas arriesgadas."
  },
  {
    id: "kameo-frost",
    name: "Frost",
    pack: "Base",
    isDLC: false,
    callType: "Summon / Control",
    hpBonus: "+0 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/7/7a/Frost_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260713200528",
    tags: ["overhead_low", "combo_extender", "setup", "fast_recharge"],
    overview: "Kameo muy intuitiva: ofrece un Low rápido desde media distancia (Ice Karpet) que congela al rival para combo gratis y un orbe de presión.",
    bestWithMainTypes: "Personajes con Overheads fuertes que necesitan amenaza baja a distancia o conversión fácil (Sub-Zero, Ashrah, Smoke, Reptile).",
    bestPartners: ["Sub-Zero", "Ashrah", "Smoke", "Reptile"],
    moves: [
      { input: "b+K", name: "Ice Karpet", type: "Summon", cost: "50%", frames: "21f Low", notes: "Deslizamiento de hielo bajo que congela al rival para combo completo." },
      { input: "f+K", name: "Ice Crash", type: "Summon", cost: "50%", frames: "20f Mid", notes: "Ataque rápido de puñales de hielo para asegurar cadenas o romper distancia." },
      { input: "n+K", name: "Snowflake (Orbe)", type: "Ambush", cost: "50%", frames: "Proyectil lento", notes: "Orbe flotante que protege tu avance mientras ejecutas 50/50." }
    ],
    gameplan: "Alterna tu Overhead natural con Ice Karpet para obligar al rival a agacharse en neutro, o coloca el orbe tras un derribo para Oki garantizado."
  },
  {
    id: "kameo-goro",
    name: "Goro",
    pack: "Base",
    isDLC: false,
    callType: "Ambush / Presión",
    hpBonus: "+50 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/2/2c/Goro_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260709000802",
    tags: ["safe_pressure", "combo_extender", "damage_boost", "armor_break"],
    overview: "Convierte especiales inseguros o lanzadores bloqueados en situaciones positivas gracias a Raise the Roof (Ambush).",
    bestWithMainTypes: "Luchadores cuyos especiales o lanzadores quedan muy negativos en bloqueo (General Shao, Kung Lao, Li Mei, Kenshi).",
    bestPartners: ["Kung Lao", "General Shao", "Kenshi", "Li Mei"],
    moves: [
      { input: "n+K", name: "Raise the Roof", type: "Ambush", cost: "50%", frames: "18f Mid", notes: "Salto de puños desde arriba; hace seguros lanzadores e invita a seguir presionando." },
      { input: "f+K", name: "Shokan Walk", type: "Summon", cost: "50%", frames: "16f High-Mid", notes: "Puñetazos con gran empuje y chip damage." },
      { input: "b+K", name: "Stomp", type: "Ambush", cost: "50%", frames: "Unblockable", notes: "Pisotón teletransportado desde arriba para castigar zoners." }
    ],
    gameplan: "Llama a Raise the Roof al mismo tiempo que tu lanzador o ataque especial arriesgado: si impacta haces combo, si bloquean quedas seguro."
  },
  {
    id: "kameo-jax",
    name: "Jax",
    pack: "Base",
    isDLC: false,
    callType: "Ambush / Extensor",
    hpBonus: "+100 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/6/6d/Jax_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260713200653",
    tags: ["combo_extender", "damage_boost", "setup", "fast_recharge"],
    overview: "Otorga la mayor bonificación de vida (+100 HP) y permite combos explosivos con Energy Wave y Ground Pound imbloqueable.",
    bestWithMainTypes: "Personajes aéreos o con combos de agarre que buscan más vida y un cierre imbloqueable (Omni-Man, Kitana, Scorpion, Mileena).",
    bestPartners: ["Omni-Man", "Kitana", "Scorpion", "Geras"],
    moves: [
      { input: "n+K", name: "Back Breaker (Air)", type: "Ambush", cost: "50%", frames: "Air Grab", notes: "Atrapa al rival en el aire en pleno combo para daño masivo y oki limpio." },
      { input: "d+K", name: "Ground Pound", type: "Ambush", cost: "50%", frames: "35f Unblockable", notes: "Golpea todo el suelo: obliga al rival a saltar o comerse combo completo." },
      { input: "f+K", name: "Energy Wave", type: "Summon", cost: "50%", frames: "15f Mid", notes: "Onda expansiva rápida para controlar el espacio medio." }
    ],
    gameplan: "Maximiza tu ventaja de 1100 HP totales, usa Energy Wave para extender lanzadores y presiona al rival derribado con Ground Pound cronometrado."
  },
  {
    id: "kameo-kano",
    name: "Kano",
    pack: "Base",
    isDLC: false,
    callType: "Ambush Puro",
    hpBonus: "-50 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/8/8b/Kano_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260713200746",
    tags: ["safe_pressure", "chip_damage", "fast_recharge", "anti_zoning"],
    overview: "El rey de la presión en bloqueo: sus cuchillos Ambush mantienen tu turno en +frames constantes con recarga ultrarrápida.",
    bestWithMainTypes: "Rushdown puros y personajes de chip damage (Johnny Cage, Baraka, Peacemaker, Raiden).",
    bestPartners: ["Johnny Cage", "Baraka", "Raiden", "Peacemaker"],
    moves: [
      { input: "n+K", name: "Knife Toss (Cuchillos)", type: "Ambush", cost: "50%", frames: "19f Mid/High", notes: "Lanza 3 cuchillos mientras atacas; deja en gran ventaja positiva en bloqueo." },
      { input: "f+K", name: "Kano Ball", type: "Ambush", cost: "50%", frames: "18f Mid", notes: "Bola voladora que cubre lanzadores inseguros o sorprende desde lejos." },
      { input: "b+K", name: "Eye Laser", type: "Summon", cost: "50%", frames: "22f Mid", notes: "Láser de pantalla completa con enorme hitstun para controlar el neutro." }
    ],
    gameplan: "Lanza tus cuerdas inseguras o Mix-ups junto a Kano Ball o Knife Toss para robar turnos infinitos y desgastar en bloqueo."
  },
  {
    id: "kameo-kung-lao",
    name: "Kung Lao (Kameo)",
    pack: "Base",
    isDLC: false,
    callType: "Ambush / Híbrido",
    hpBonus: "-50 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/2/22/Kung_Lao_Battle_Icon_%28MK1%29_Kameo.png/revision/latest?cb=20260713200812",
    tags: ["overhead_low", "safe_pressure", "setup", "fast_recharge", "combo_extender"],
    overview: "El Kameo más polivalente del juego: sombrero bajo de recarga rápida (Buzzsaw Hat), teleport y Spin lanzador.",
    bestWithMainTypes: "Casi todo el plantel, especialmente personajes sin ataque bajo rápido o que necesitan seguridad tras lanzadores (Omni-Man, Sindel, Rain, Raiden).",
    bestPartners: ["Omni-Man", "Sindel", "Johnny Cage", "Peacemaker"],
    moves: [
      { input: "d+K (Hold)", name: "Low Hat", type: "Ambush", cost: "50%", frames: "20f Low", notes: "Sombrero bajo cargable; combinado con tu Overhead crea un 50/50 inbloqueable." },
      { input: "n+K", name: "Tempest Spin", type: "Summon", cost: "50%", frames: "15f Mid", notes: "Antiaéreo y extensor de combos cercano." },
      { input: "b+K", name: "Teleport", type: "Summon", cost: "50%", frames: "Evasión", notes: "Te reposiciona al instante o evade proyectiles." }
    ],
    gameplan: "Carga Low Hat en el suelo mientras saltas o lanzas un Overhead para forzar un auténtico 50/50, o úsalo como proyectil de recarga veloz en neutro."
  },
  {
    id: "kameo-motaro",
    name: "Motaro",
    pack: "Base",
    isDLC: false,
    callType: "Ambush / Anti-Zoning",
    hpBonus: "+0 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/7/77/Motaro_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260709003225",
    tags: ["anti_zoning", "safe_pressure", "combo_extender", "setup"],
    overview: "Teletransporte gratuito tras golpes especiales y escudo reflector de proyectiles ideal para entrar contra zoners.",
    bestWithMainTypes: "Luchadores con especiales inseguros de largo alcance o vulnerables al zoning (Liu Kang, Geras, Reiko, Ermac).",
    bestPartners: ["Liu Kang", "Geras", "General Shao", "Noob Saibot"],
    moves: [
      { input: "b+K", name: "Teleport", type: "Ambush", cost: "50%", frames: "Instantáneo", notes: "Te teletransporta detrás del rival tras cualquier ataque para hacer seguro el golpe o extender combo." },
      { input: "f+K", name: "Turret Shot", type: "Summon", cost: "50%", frames: "3 disparos Mid/Low", notes: "Triple láser de cola de escorpión para presionar a media y larga distancia." },
      { input: "d+K", name: "Reflect", type: "Ambush", cost: "50%", frames: "Escudo", notes: "Refleja cualquier proyectil hacia el zoner rival." }
    ],
    gameplan: "Usa el Teleport en mitad de tus especiales lentos (o tras un proyectil como la bola de Liu Kang) para aparecer justo detrás y castigar."
  },
  {
    id: "kameo-sareena",
    name: "Sareena",
    pack: "Base",
    isDLC: false,
    callType: "Summon / Daño Puro",
    hpBonus: "+0 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/a/ac/Sareena_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260708235658",
    tags: ["combo_extender", "damage_boost", "meter_drain"],
    overview: "Kameo #1 para principiantes y conversión de daño brutal: su boomerang doble Kia's Blades convierte cualquier toque en +400 de daño sin barra.",
    bestWithMainTypes: "Cualquier personaje que quiera convertir cualquier toque (1,2 o Sweep) en 40%+ de vida sin gastar barras (Noob Saibot, Smoke, Quan Chi, Sub-Zero).",
    bestPartners: ["Smoke", "Noob Saibot", "Liu Kang", "Conan the Barbarian"],
    moves: [
      { input: "b+K", name: "Kia's Blades (Dobles)", type: "Summon", cost: "50%", frames: "16f High", notes: "4 impactos de boomerang de ida y vuelta que garantizan combo completo desde cualquier distancia." },
      { input: "f+K", name: "Demonic Retreat", type: "Summon", cost: "50%", frames: "17f Overhead", notes: "Patada descendente con mucho empuje que ayuda a cerrar distancia." },
      { input: "d+K", name: "Demonik Rune", type: "Summon", cost: "100%", frames: "Campo", notes: "Drena la barra de Super del rival mientras permaneces dentro del círculo." }
    ],
    gameplan: "Confirma en hit antes de pulsar b+K (evita lanzarlo en bloqueo porque el segundo boomerang es High y agachable en neutro)."
  },
  {
    id: "kameo-scorpion",
    name: "Scorpion (Kameo)",
    pack: "Base",
    isDLC: false,
    callType: "Ambush / Overhead & Daño",
    hpBonus: "+0 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/a/ab/Scorpion_Battle_Icon_%28MK1%29_Kameo.png/revision/latest?cb=20260713201027",
    tags: ["combo_extender", "overhead_low", "damage_boost"],
    overview: "Extiende combos aéreos al máximo con Fire Breath y añade un Overhead rápido en suelo (18f) para castigar defensas bajas.",
    bestWithMainTypes: "Luchadores con ataques bajos fuertes pero sin Overhead, o combos aéreos que escalan poco (Mileena, Reiko, Raiden, Nitara).",
    bestPartners: ["Reiko", "Mileena", "Nitara", "Takeda Takahashi"],
    moves: [
      { input: "u+K", name: "Flame Aura / Fire Breath", type: "Ambush", cost: "50%", frames: "Air Extender", notes: "Alarga cualquier combo aéreo rebotando al rival sin consumir barra principal." },
      { input: "f+K", name: "Hell Blades", type: "Summon", cost: "50%", frames: "18f Overhead", notes: "Espada rápida Overhead de rango medio ideal tras Low pokes." },
      { input: "b+K", name: "Spear Pull", type: "Ambush", cost: "50%", frames: "Retirada", notes: "Tira de tu propio personaje hacia atrás para esquivar castigos." }
    ],
    gameplan: "Usa Fire Breath justo cuando el rival cae del aire en tu BnB y aprovecha Hell Blades para castigar a rivales que siempre bloquean agachados."
  },
  {
    id: "kameo-sektor",
    name: "Sektor (Kameo)",
    pack: "Base",
    isDLC: false,
    callType: "Ambush / Presión & Zoning",
    hpBonus: "+0 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/d/de/Sektor_Battle_Icon_%28MK1%29_Kameo.png/revision/latest?cb=20260712004912",
    tags: ["safe_pressure", "setup", "combo_extender", "anti_zoning"],
    overview: "Su misil guiado Up Rocket cae del cielo cubriendo tu ofensiva, rompiendo escapes y haciendo seguro cualquier movimiento arriesgado.",
    bestWithMainTypes: "Personajes de presión mixta, clones o trucos a media distancia (Kenshi, Johnny Cage, Shang Tsung, Sektor).",
    bestPartners: ["Kenshi", "Sindel", "Johnny Cage", "Sektor"],
    moves: [
      { input: "b+K / n+K", name: "Up Rocket (Misil)", type: "Ambush", cost: "50%", frames: "Misil con retardo", notes: "Cae desde el cielo sobre el rival: si golpea lanza para combo, si bloquea te da +frames." },
      { input: "f+K", name: "Flame Thrower", type: "Summon", cost: "50%", frames: "14f Mid", notes: "Lanzallamas de alto chip damage que mantiene el turno." },
      { input: "u+K", name: "Teleport Punch", type: "Ambush", cost: "50%", frames: "Teletransporte", notes: "Aparece detrás con gancho lanzador para confirmar combos." }
    ],
    gameplan: "Dispara Up Rocket tras un derribo o cadena bloqueada para quedar totalmente cubierto y forzar al rival a respetar tu siguiente entrada."
  },
  {
    id: "kameo-shujinko",
    name: "Shujinko",
    pack: "Base",
    isDLC: false,
    callType: "Especialista (Mimic)",
    hpBonus: "+50 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/3/37/Shujinko_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260713201351",
    tags: ["setup", "combo_extender", "damage_boost"],
    overview: "Kameo técnico que medita para robar y copiar los movimientos especiales del oponente (clones, lanzas, teletransportes, Fatal Blow).",
    bestWithMainTypes: "Especialistas en setplay y counter-pick contra personajes top-tier con especiales rotos (Kenshi, Quan Chi, Ashrah, Sindel).",
    bestPartners: ["Sindel", "Li Mei", "Johnny Cage", "Shang Tsung"],
    moves: [
      { input: "n+K (Hold)", name: "Meditate", type: "Summon", cost: "Carga", frames: "Carga Pasiva", notes: "Carga la barra de Shujinko más rápido en pantalla." },
      { input: "f+K / b+K", name: "Mimic (Robo de Poder)", type: "Summon", cost: "50%", frames: "Variable", notes: "Ejecuta el especial insignia del rival que estás enfrentando (por ejemplo Sento o Ice Clone)." }
    ],
    gameplan: "Medita tras knockdowns largos o proyectiles y usa las propias herramientas robadas del rival contra él en momentos clave."
  },
  {
    id: "kameo-sonya",
    name: "Sonya",
    pack: "Base",
    isDLC: false,
    callType: "Ambush / Aéreo & Proyectil",
    hpBonus: "-50 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/b/bd/Sonya_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260713201421",
    tags: ["combo_extender", "safe_pressure", "anti_zoning", "fast_recharge"],
    overview: "Extensión aérea ultrarrápida con Square Wave y proyectiles cargables (Energy Rings) para controlar el ritmo desde lejos.",
    bestWithMainTypes: "Luchadores que lanzan al aire pero necesitan extender combos en la nube o ganar guerras de proyectiles (Sub-Zero, Tanya, Nitara, Li Mei).",
    bestPartners: ["Sub-Zero", "Li Mei", "Tanya", "Nitara"],
    moves: [
      { input: "u+K", name: "Square Wave (Air)", type: "Ambush", cost: "50%", frames: "Air Punch", notes: "Golpea y rebota en pleno combo aéreo para continuar la cadena en suelo." },
      { input: "n+K (Hold)", name: "Energy Rings", type: "Summon", cost: "50%", frames: "16f High/Mid", notes: "Proyectil cargable hasta volverse imbloqueable o romper armadura." },
      { input: "b+K", name: "Leg Grab", type: "Summon", cost: "50%", frames: "Lanzador", notes: "Salto raso antiaéreo y extensor en esquina." }
    ],
    gameplan: "Extiende lanzadores que normalmente no conectan (como el db+2 / b+2 de Sub-Zero) con Square Wave sin gastar barra Super."
  },
  {
    id: "kameo-stryker",
    name: "Stryker",
    pack: "Base",
    isDLC: false,
    callType: "Ambush Defensivo/Ofensivo",
    hpBonus: "+0 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/8/89/Stryker_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260713201449",
    tags: ["safe_pressure", "chip_damage", "fast_recharge", "anti_zoning"],
    overview: "Granadas dobles Ambush para blindar especiales inseguros y mezcla instantánea entre Baton Low y Baton Overhead.",
    bestWithMainTypes: "Personajes con especiales muy arriesgados (-15f+) o chip damage masivo (Raiden, Baraka, Havik, General Shao).",
    bestPartners: ["Raiden", "Baraka", "Havik", "Reiko"],
    moves: [
      { input: "b+K", name: "Double Grenades", type: "Ambush", cost: "50%", frames: "Granadas Ambush", notes: "Lanza 2 granadas sobre el rival: hace completamente seguro cualquier ataque fallido o bloqueado." },
      { input: "f+K", name: "Baton Overhead / Low", type: "Summon", cost: "50%", frames: "20f Mix", notes: "Mezcla rápida con porra o táser desde media distancia." }
    ],
    gameplan: "Usa Double Grenades al final de especiales arriesgados para evitar castigos y generar chip damage constante."
  },
  {
    id: "kameo-sub-zero",
    name: "Sub-Zero (Kameo)",
    pack: "Base",
    isDLC: false,
    callType: "Summon / Anti-Zoning",
    hpBonus: "+0 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/6/6a/Sub-Zero_Battle_Icon_%28MK1%29_Kameo.png/revision/latest?cb=20260713201525",
    tags: ["anti_zoning", "combo_extender", "setup"],
    overview: "El mejor Kameo defensivo contra zoners gracias a Ice Armor (armadura ante proyectiles) y Freeze de combo.",
    bestWithMainTypes: "Luchadores sin proyectiles o rushdown que sufren para acercarse contra Kitana, Liu Kang o Quan Chi (Kenshi, Johnny Cage, Omni-Man, Baraka).",
    bestPartners: ["Kenshi", "Havik", "General Shao", "T-1000"],
    moves: [
      { input: "d+K", name: "Ice Armor", type: "Ambush", cost: "50%", frames: "Armadura Total", notes: "Te vuelve completamente inmune a proyectiles durante varios segundos." },
      { input: "f+K", name: "Arctic Freeze", type: "Summon", cost: "50%", frames: "22f Mid", notes: "Congela al rival en medio del combo para recargar recursos o hacer setup." },
      { input: "n+K", name: "Shoulder Charge", type: "Summon", cost: "50%", frames: "16f Mid", notes: "Embestida helada de largo alcance y buen empuje." }
    ],
    gameplan: "Activa Ice Armor frente a zoners para caminar gratis hasta rango cuerpo a cuerpo y congela con Arctic Freeze para preparar tus trampas (ej. Sento)."
  },
  {
    id: "kameo-tremor",
    name: "Tremor",
    pack: "Kombat Pack 1",
    isDLC: true,
    callType: "Ambush / Posturas (3 Variantes)",
    hpBonus: "+50 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/d/d4/Tremor_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260713201546",
    tags: ["safe_pressure", "combo_extender", "overhead_low", "armor_break"],
    overview: "Cambia dinámicamente entre 3 formas (Aftershock, Metallic y Crystalline) ofreciendo armadura, lanzadores bajos, proyectiles y presión Ambush.",
    bestWithMainTypes: "Personajes técnicos que aprovechan cambiar herramientas según la fase de la ronda (Reiko, General Shao, Peacemaker, Rain).",
    bestPartners: ["Reiko", "Peacemaker", "General Shao", "Reptile"],
    moves: [
      { input: "d+K", name: "Cambiar Variación (Postura)", type: "Ambush", cost: "Gratis", frames: "Switch", notes: "Alterna entre Aftershock (Low/Terremoto), Metallic (Lava/Lanzador) y Crystalline (Armadura)." },
      { input: "n+K", name: "Rock Toss / Rolling Rock", type: "Ambush", cost: "50%", frames: "20f Low/Mid", notes: "Roca rodante o aérea para extender combos y cubrir cuerdas." }
    ],
    gameplan: "Empieza en Aftershock/Metallic para extender tus combos con Overhead/Low y cambia a Crystalline para ganar un hit de armadura."
  },
  {
    id: "kameo-khameleon",
    name: "Khameleon",
    pack: "Kombat Pack 1",
    isDLC: true,
    callType: "Ambush / Versatilidad Élite",
    hpBonus: "-50 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/5/51/Khameleon_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260709011731",
    tags: ["overhead_low", "safe_pressure", "combo_extender", "fast_recharge"],
    overview: "Considerada uno de los mejores Kameos competitivos de MK1: rota entre Kitana (abanico/elevación), Mileena (ball roll/sai) y Jade (glaive/inmunidad a proyectiles).",
    bestWithMainTypes: "Casi cualquier personaje top-tier (Sub-Zero, Scorpion, Johnny Cage, Li Mei, Ashrah, Tanya).",
    bestPartners: ["Scorpion", "Sub-Zero", "Johnny Cage", "Ashrah"],
    moves: [
      { input: "Disfraz Kitana", name: "Fan Lift / Fan Toss", type: "Ambush", cost: "50%", frames: "Elevación", notes: "Levanta al rival con un torbellino en pleno bloqueo o combo para daño gratis." },
      { input: "Disfraz Mileena", name: "Ball Roll / Sai", type: "Ambush", cost: "50%", frames: "Low / Mid", notes: "Cierra huecos con ataque bajo lanzador y proyectil de presión." },
      { input: "Disfraz Jade", name: "Glow (Inmune Proyectil) / Glaive", type: "Ambush", cost: "50%", frames: "Overhead / Escudo", notes: "Te vuelve inmune a proyectiles o golpea con Overhead de largo alcance." }
    ],
    gameplan: "Adapta tu ofensiva al instante según el color activo de Khameleon (Verde = Anti-Zoning/Overhead, Morado = Low/Mix, Azul = Extensión/Seguridad)."
  },
  {
    id: "kameo-janet-cage",
    name: "Janet Cage",
    pack: "Kombat Pack 1",
    isDLC: true,
    callType: "Ambush / Puppet & Daño",
    hpBonus: "+0 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/c/c8/Janet_Cage_Battle_Icon_%28MK1%29_Kameo.png/revision/latest?cb=20260713200625",
    tags: ["combo_extender", "damage_boost", "setup"],
    overview: "Invoca un muñeco stunt-double que golpea repetidamente (Sentō Punch) para extender cualquier lanzamiento aéreo hasta +450 de daño y mantener presión.",
    bestWithMainTypes: "Personajes con lanzadores rápidos o combos en la esquina que quieren escalado mínimo (Takeda, Peacemaker, Havik, Homelander).",
    bestPartners: ["Peacemaker", "Takeda Takahashi", "Havik", "Homelander"],
    moves: [
      { input: "n+K (Hold/Tap)", name: "Sentō / Stunt Hop Kick", type: "Ambush", cost: "50%", frames: "Multi-Hit", notes: "Doble patada aérea o combo de puños para extender cualquier combo." },
      { input: "f+K", name: "Nut Punch", type: "Summon", cost: "50%", frames: "16f Mid", notes: "Deja al rival aturdido de pie en neutro para combo adicional." }
    ],
    gameplan: "Domina el timing doble de su Stunt Double en aire para sumar +10% extra en prácticamente cualquier ruta de combo."
  },
  {
    id: "kameo-mavado",
    name: "Mavado",
    pack: "Kombat Pack 1",
    isDLC: true,
    callType: "Ambush / OTG & Trampas",
    hpBonus: "-50 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/1/16/Mavado_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260713201104",
    tags: ["combo_extender", "setup", "damage_boost"],
    overview: "Revolucionó el meta con 'Mine' (trampa de mina terrestre) y sus cuerdas elásticas (Elastic Slam) que recogen del suelo (OTG) cualquier derribo o agarre.",
    bestWithMainTypes: "Luchadores con agarres especiales, deslizamientos o derribos duros que antes no daban combo (Omni-Man, Nitara, Havik, Ghostface).",
    bestPartners: ["Havik", "Omni-Man", "Nitara", "Ghostface"],
    moves: [
      { input: "u+K", name: "Best Laid Plans (Trap Drop)", type: "Ambush", cost: "50%", frames: "OTG / Air Drop", notes: "Desciende de las cuerdas recogiendo del suelo tras un barrido o ataque especial." },
      { input: "n+K", name: "Mine (Mina Terrestre)", type: "Ambush", cost: "50%", frames: "Trampa Suelo", notes: "Coloca una mina bajo el rival; explota lanzando por los aires para combo gratis." }
    ],
    gameplan: "Convierte tus derribos o barridos inseguros en combos completos llamando a Trap Drop en el momento exacto del impacto."
  },
  {
    id: "kameo-ferra",
    name: "Ferra",
    pack: "Kombat Pack 1",
    isDLC: true,
    callType: "Mix-up 50/50 + Buff",
    hpBonus: "-50 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/2/24/Ferra_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260718160037",
    tags: ["overhead_low", "safe_pressure", "combo_extender", "damage_boost"],
    overview: "Salta sobre tu espalda para darte mix-up instantáneo de Overhead/Low inbloqueable en el mismo frame + buff de daño bruto (Pain & Gain).",
    bestWithMainTypes: "Personajes sin mix-up 50/50 natural pero con grandes normales en neutro (Scorpion, Mileena, Nitara, Conan, Homelander).",
    bestPartners: ["Scorpion", "Mileena", "Nitara", "Homelander"],
    moves: [
      { input: "n+K > 2", name: "Ferra Leap (Overhead / Low)", type: "Ambush", cost: "50%", frames: "50/50 Real", notes: "Desde la postura de hombro eliges golpe Overhead o Low que inician combo completo." },
      { input: "d+K", name: "Pain & Gain", type: "Buff", cost: "50%", frames: "+Daño", notes: "Sacrifica un poco de vida propia para aumentar tu daño total un 20%." }
    ],
    gameplan: "Monta a Ferra en la espalda del luchador para obligar al rival a adivinar en cada toque, haciendo seguros incluso golpes arriesgados."
  },
  {
    id: "kameo-madam-bo",
    name: "Madam Bo",
    pack: "Khaos Reigns",
    isDLC: true,
    callType: "Ambush / Oki & Setup",
    hpBonus: "+50 HP",
    iconUrl: "https://static.wikia.nocookie.net/mkwikia/images/4/4e/Madam_Bo_Battle_Icon_%28MK1%29.png/revision/latest?cb=20260718160110",
    tags: ["setup", "combo_extender", "safe_pressure", "overhead_low"],
    overview: "Maestra de la casa de té (incorporada con T-1000): aporta lanzamientos con botella de sake, saltos con patada aérea y cancelaciones únicas en el aire y esquina.",
    bestWithMainTypes: "Luchadores agresivos de corto/medio alcance y especialistas en esquina (T-1000, Liu Kang, Kung Lao, Li Mei).",
    bestPartners: ["T-1000", "Liu Kang", "Kung Lao", "Raiden"],
    moves: [
      { input: "n+K", name: "Bottle Toss (Sake)", type: "Ambush", cost: "50%", frames: "Splash Area", notes: "Lanza botella incendiaria/sake para extender combos o crear ventaja en bloqueo." },
      { input: "f+K", name: "Tea House Kick", type: "Summon", cost: "50%", frames: "Lanzador Mid", notes: "Patada ágil que levanta para extender rutas sin gastar Super." },
      { input: "b+K", name: "Flying Slipper / Sweep", type: "Ambush", cost: "50%", frames: "Low / Mix", notes: "Barre al oponente o interrumpe intentos de contraataque." }
    ],
    gameplan: "Usa Bottle Toss en la esquina para encadenar resets impredecibles y aprovechar su bonificación extra de +50 HP."
  }
];

// Perfiles de los 35 personajes principales de MK1 para calcular sinergias exactas con cualquier Kameo
const MK1_MAIN_SYNERGIES = {
  "Scorpion": {
    needs: ["overhead_low", "safe_pressure", "combo_extender"],
    topKameos: [
      { kameo: "Ferra", score: "S+", tag: "50/50 + Daño", route: "2,1 ~ bf+1 > f+3,2 + Ferra Overhead/Low", reason: "Ferra soluciona la mayor debilidad de Scorpion (falta de mix-up rápido Overhead/Low) y eleva sus combos por encima del 45%." },
      { kameo: "Khameleon", score: "S", tag: "Versatilidad + Extensor", route: "f+3,2 ~ Khameleon Fan Lift > j.1,2", reason: "Permite hacer seguro f+3,2, da mix-ups de Mileena/Jade y extiende combos sin barra." },
      { kameo: "Jax", score: "A+", tag: "+100 HP + Ground Pound", route: "f+3,2 > j.1,1,1 ~ db+2 + Jax Energy Wave", reason: "Brinda 1100 HP y setups imbloqueables tras Speared knockdown." }
    ]
  },
  "Sub-Zero": {
    needs: ["combo_extender", "overhead_low", "safe_pressure"],
    topKameos: [
      { kameo: "Khameleon", score: "S+", tag: "Extensión b+2 + Mix", route: "b+2 > Khameleon Fan Lift > b+2 > j.1,2", reason: "Extiende el lento Overhead b+2 con altísimo daño y cubre cadenas negativas en bloqueo." },
      { kameo: "Sonya", score: "S", tag: "Extensión Aérea", route: "b+2 > j.2,1 + Sonya Square Wave > dash > f+1,2", reason: "Square Wave arregla el escalado natural de Sub-Zero para superar los 380+ sin barra." },
      { kameo: "Frost", score: "A+", tag: "Orbe + Doble Congelado", route: "Snowflake Orb > b+2 / b+3 50/50", reason: "El orbe obliga al rival a bloquear tu mezcla Overhead/Low de pie y agachado." }
    ]
  },
  "Liu Kang": {
    needs: ["anti_zoning", "combo_extender", "setup"],
    topKameos: [
      { kameo: "Motaro", score: "S+", tag: "Teleport + Combo desde Throw", route: "bf+1 > Motaro Teleport > 3,3,3", reason: "El Teleport de Motaro convierte sus bolas de fuego y su famoso agarre con dragón en combos devastadores." },
      { kameo: "Kung Lao (Kameo)", score: "S", tag: "Low Hat Pressure", route: "Low Hat > b+2,3 Overhead Mix", reason: "Aporta una amenaza Low que obliga a respetar el neutro junto a sus bolas bajas." },
      { kameo: "Madam Bo", score: "A+", tag: "+50 HP + Oki Sake", route: "b+2,3 > Madam Bo Bottle Toss", reason: "Mantiene la presión cerrada en esquina y amplía la vida total a 1050 HP." }
    ]
  },
  "Raiden": {
    needs: ["safe_pressure", "chip_damage", "overhead_low"],
    topKameos: [
      { kameo: "Kano", score: "S+", tag: "Chip + Seguridad Storm Cell", route: "f+4,3 ~ db+2 + Kano Knives (+frames)", reason: "Kano hace completamente seguro el Storm Cell bloqueado e inflige chip damage brutal." },
      { kameo: "Stryker", score: "S", tag: "Granadas Ambush", route: "df+2 + Stryker Double Grenades", reason: "Blinda sus especiales arriesgados para evitar castigos en bloqueo." },
      { kameo: "Scorpion (Kameo)", score: "A+", tag: "Overhead Mix", route: "f+3,4 + Hell Blades / Fire Breath", reason: "Añade Overhead real y extensión aérea a sus descargas eléctricas." }
    ]
  },
  "Kung Lao": {
    needs: ["safe_pressure", "combo_extender"],
    topKameos: [
      { kameo: "Goro", score: "S+", tag: "Seguridad Armoured Launcher", route: "df+2 (Armor) + Goro Raise the Roof", reason: "Convierte el lanzador con armadura (df+2) de Kung Lao en una jugada totalmente segura y positiva." },
      { kameo: "Sektor (Kameo)", score: "S", tag: "Misil Setup", route: "b+3,3 + Up Rocket > Divekick Mix", reason: "El misil obliga a quedarse quieto mientras entras con divekicks o agarre." },
      { kameo: "Madam Bo", score: "A+", tag: "Esquina Sake", route: "2,1,2 > Madam Bo Tea House Kick", reason: "Alarga sus combos de patadas y añade +50 HP." }
    ]
  },
  "Kitana": {
    needs: ["setup", "combo_extender", "anti_zoning"],
    topKameos: [
      { kameo: "Jax", score: "S+", tag: "Ground Pound Setup", route: "b+2,4 ~ db+2 + Jax Ground Pound", reason: "Obliga a saltar el golpe al suelo directo hacia los abanicos flotantes (Fan Nado)." },
      { kameo: "Cyrax (Kameo)", score: "A+", tag: "Bomba + Red", route: "df+1 > Cyrax Bomb Setup", reason: "Encierra al rival entre trampa de viento y bomba para resets en la esquina." },
      { kameo: "Scorpion (Kameo)", score: "A", tag: "Extensión Aérea", route: "b+2,4 > db+1 + Fire Breath", reason: "Eleva notablemente su daño por cada conversión de abanicos." }
    ]
  },
  "Mileena": {
    needs: ["overhead_low", "combo_extender"],
    topKameos: [
      { kameo: "Ferra", score: "S+", tag: "Mix-up Imparable", route: "1,2 + Ferra Overhead/Low > bd+4 (Ball Roll)", reason: "Cualquier toque de Ferra confirma directamente en Ball Roll para +40% de vida." },
      { kameo: "Scorpion (Kameo)", score: "S", tag: "Daño Aéreo Máximo", route: "bd+4 > j.1,2 + Fire Breath > Air Sai", reason: "Combos que rozan el 50% con una sola barra." },
      { kameo: "Kung Lao (Kameo)", score: "A+", tag: "Low Hat Mix", route: "Low Hat > f+4 Overhead", reason: "Crea mezcla real entre su patada alta f+4 y el sombrero bajo." }
    ]
  },
  "Johnny Cage": {
    needs: ["safe_pressure", "anti_zoning", "chip_damage"],
    topKameos: [
      { kameo: "Kano", score: "S+", tag: "Presión Eterna + Hype", route: "f+1,2,4 + Kano Knives / Ball", reason: "Hace que sus mixes más arriesgados queden en +frames para recargar Hype o seguir el rushdown." },
      { kameo: "Khameleon", score: "S", tag: "Anti-Zoning + Fan Lift", route: "Jade Glow > Advance > Fan Lift", reason: "Resuelve la falta de proyectil de Johnny y añade un Low/Overhead adicional." },
      { kameo: "Sektor (Kameo)", score: "A+", tag: "Misil Rushdown", route: "Up Rocket > Shadow Dash Mix", reason: "Fuerza bloqueo mientras Johnny entra en rango óptimo." }
    ]
  },
  "Kenshi": {
    needs: ["setup", "safe_pressure", "anti_zoning"],
    topKameos: [
      { kameo: "Sub-Zero (Kameo)", score: "S+", tag: "Congelar para Sacar a Sento", route: "b+1,2 + Arctic Freeze > db+1 (Sento)", reason: "El Freeze da el tiempo exacto y garantizado para invocar el espíritu Sento sin riesgo." },
      { kameo: "Goro", score: "S", tag: "Seguridad db+4", route: "f+2,2 + Goro Raise the Roof", reason: "Cubre su postura y castigos medios mientras prepara el ataque doble." },
      { kameo: "Cyrax (Kameo)", score: "A+", tag: "Red para Invocar", route: "2,1 ~ Cyrax Net > Sento Stance", reason: "Red te garantiza el setup de doble personaje al instante." }
    ]
  },
  "Smoke": {
    needs: ["safe_pressure", "combo_extender"],
    topKameos: [
      { kameo: "Sareena", score: "S", tag: "Conversión Fácíl +42%", route: "f+3,2 + Sareena Blades > Vicious Vapor", reason: "Cualquier poke rápido de Smoke se convierte en más de 400 de daño." },
      { kameo: "Frost", score: "A+", tag: "Low / Overhead Smoke", route: "Frost Ice Karpet / Vapor Cancel Mix", reason: "Suma un Low seguro de media distancia a sus teletransportes Overhead." },
      { kameo: "Khameleon", score: "S+", tag: "Seguridad Invisible", route: "db+4 Invis + Khameleon Fan Lift", reason: "Garantiza invisibilidad segura y extiende combos en aire." }
    ]
  },
  "Rain": {
    needs: ["setup", "combo_extender", "anti_zoning"],
    topKameos: [
      { kameo: "Sub-Zero (Kameo)", score: "S", tag: "Hielo + Portal", route: "bf+1 > Arctic Freeze > Portal Setup", reason: "Congela para colocar remolinos de agua e iniciar loops de presión." },
      { kameo: "Kung Lao (Kameo)", score: "A+", tag: "Low Hat Control", route: "Water Beam / Low Hat Zoning", reason: "Refuerza su control de pantalla y cubre sus cancelaciones lentas." },
      { kameo: "Janet Cage", score: "A+", tag: "Stunt Double Daño", route: "j.1,2 + Janet Hop Kick", reason: "Dispara el daño de sus combos de agua sin gastar barras." }
    ]
  },
  "Li Mei": {
    needs: ["combo_extender", "safe_pressure"],
    topKameos: [
      { kameo: "Scorpion (Kameo)", score: "S+", tag: "Lanzadores de Farolillo", route: "bf+4 > Farolillos + Fire Breath", reason: "Multiplica el daño de las linternas aéreas llegando a +460 con facilidad." },
      { kameo: "Goro", score: "S", tag: "Seguridad Knee", route: "df+2 / Knees + Raise the Roof", reason: "Hace su rodillazo lanzador y cadenas bajas completamente seguras." },
      { kameo: "Janet Cage", score: "A+", tag: "Daño sin barra", route: "db+4 > Janet Double Hop", reason: "Extiende sus cuerdas rápidas en la esquina." }
    ]
  },
  "Tanya": {
    needs: ["safe_pressure", "combo_extender"],
    topKameos: [
      { kameo: "Goro", score: "S+", tag: "Seguridad f+2 + Daño", route: "f+2,1,1 + Goro Raise the Roof", reason: "Cubre los golpes largos con bastón convirtiendo cada Poke en combo completo." },
      { kameo: "Khameleon", score: "S", tag: "Mix-up Aéreo/Medio", route: "2,1,2 + Khameleon Ball Roll", reason: "Aporta presión y extensión sin perder alcance." },
      { kameo: "Sonya", score: "A+", tag: "Anillo & Rebote", route: "db+4 > Square Wave", reason: "Aporta un proyectil fuerte de largo alcance." }
    ]
  },
  "Baraka": {
    needs: ["chip_damage", "safe_pressure", "anti_zoning"],
    topKameos: [
      { kameo: "Kano", score: "S+", tag: "Chip Damage Letal", route: "df+1 ~ db+1 + Kano Knives", reason: "Obliga a gastar barra o recibir enorme chip damage en bloqueo." },
      { kameo: "Stryker", score: "S", tag: "Granadas Seguras", route: "bf+3 + Double Grenades", reason: "Mantiene intacta la seguridad tras los giros de cuchillas." },
      { kameo: "Cyrax (Kameo)", score: "A+", tag: "Kopter Chip", route: "2,1 ~ Cyrax Horizontal", reason: "Refuerza el desgaste continuo contra defensas cerradas." }
    ]
  },
  "Geras": {
    needs: ["setup", "combo_extender", "anti_zoning"],
    topKameos: [
      { kameo: "Motaro", score: "S+", tag: "Combos de Tiempo + Teleport", route: "Sand Storm + Motaro Teleport", reason: "Motaro arregla su movilidad lenta contra zoners y le permite combos de agarre." },
      { kameo: "Kung Lao (Kameo)", score: "S", tag: "Setup de Reloj", route: "Time Stop + Low Hat", reason: "Fuerza mix-ups ineludibles cuando carga las cargas de reloj." },
      { kameo: "Jax", score: "A+", tag: "1100 HP Titan", route: "Command Grab + Jax Ground Pound", reason: "Daño y vida descomunales para intercambiar golpes." }
    ]
  },
  "Reptile": {
    needs: ["combo_extender", "overhead_low"],
    topKameos: [
      { kameo: "Mavado", score: "S+", tag: "Combo desde Deslizamiento/Invis", route: "b+3,1,3 ~ Mavado Trap Drop", reason: "Permite combo completo tras el deslizamiento bajo o tras activar invisibilidad." },
      { kameo: "Khameleon", score: "S", tag: "Invis + Fan Lift", route: "db+4 Invis > Mix + Fan Lift", reason: "Protege la activación de invisibilidad." },
      { kameo: "Frost", score: "A+", tag: "Low / Overhead", route: "Frost Karpet / b+2 Mix", reason: "Combina su poderoso Overhead con el hielo bajo." }
    ]
  },
  "Ashrah": {
    needs: ["safe_pressure", "combo_extender", "overhead_low"],
    topKameos: [
      { kameo: "Khameleon", score: "S+", tag: "La Pareja Más Top-Tier", route: "f+2 + Khameleon Fan Lift / Mileena Roll", reason: "Aprovecha el largo alcance de su espada junto a todas las herramientas Ambush de Khameleon." },
      { kameo: "Frost", score: "A+", tag: "Espaciado Bajo", route: "Frost Ice Karpet > f+2 Sword", reason: "Complementa su enorme rango medio con un golpe bajo sorpresivo." },
      { kameo: "Sareena", score: "A+", tag: "Daño Fácil +43%", route: "2,1 ~ b+K (Blades) > Dark Ascension", reason: "Conversión inmediata desde cualquier alcance medio." }
    ]
  },
  "Havik": {
    needs: ["combo_extender", "safe_pressure", "setup"],
    topKameos: [
      { kameo: "Mavado", score: "S+", tag: "OTG Desde Agarre/Armadura", route: "bf+2 / bf+1 + Mavado Trap Drop", reason: "Convierte su especial imbloqueable/brazo largo y su agarre en 40%+ de vida." },
      { kameo: "Darrius", score: "S", tag: "+50 HP + Throw Combos", route: "Throw + Darrius Heel Drop", reason: "Potencia aún más la vida de Havik y convierte cada agarre." },
      { kameo: "Stryker", score: "A+", tag: "Granadas Seguras", route: "bf+1 (Armadura) + Stryker Grenades", reason: "Hace seguro su ataque lento de armadura." }
    ]
  },
  "General Shao": {
    needs: ["safe_pressure", "combo_extender", "anti_zoning"],
    topKameos: [
      { kameo: "Motaro", score: "S+", tag: "Anti-Zoning + Teleport", route: "db+3 (Postura Hacha) + Motaro Teleport", reason: "Aporta proyectil, escudo reflector y seguridad en sus hachazos lentos." },
      { kameo: "Goro", score: "S", tag: "Seguridad en Hachazo", route: "2,2 ~ db+4 + Goro Raise the Roof", reason: "Vuelve +frames sus golpes sin hacha o lanzadores de postura." },
      { kameo: "Tremor", score: "A+", tag: "+50 HP + Armadura", route: "2,2 + Tremor Metallic Launcher", reason: "Suma 1050+ HP con opciones bajas y de armadura." }
    ]
  },
  "Sindel": {
    needs: ["setup", "overhead_low", "combo_extender"],
    topKameos: [
      { kameo: "Kung Lao (Kameo)", score: "S+", tag: "Levitación 50/50", route: "Low Hat + Float j.2 Overhead", reason: "Mantiene al rival adivinando simultáneamente entre el sombrero bajo y su caída flotante." },
      { kameo: "Sektor (Kameo)", score: "S", tag: "Misil Setup", route: "Up Rocket > Levitate Mix", reason: "Cubre el tiempo que tarda Sindel en elevarse en el aire." },
      { kameo: "Shujinko", score: "A+", tag: "Control Total", route: "Scream > Shujinko Meditate", reason: "Grito de largo hitstun le regala carga gratuita de Shujinko." }
    ]
  },
  "Nitara": {
    needs: ["overhead_low", "safe_pressure", "combo_extender"],
    topKameos: [
      { kameo: "Ferra", score: "S+", tag: "Explosión de Daño + Mix", route: "Air Dash + Ferra Overhead/Low > Divekick", reason: "Ferra añade la apertura en suelo que necesitaba y eleva su daño aéreo más allá del 48%." },
      { kameo: "Scorpion (Kameo)", score: "S", tag: "Doble Extensión Aérea", route: "j.1,2,4 + Fire Breath > Air Bite", reason: "Aprovecha al límite los combos de vuelo de Nitara." },
      { kameo: "Mavado", score: "A+", tag: "Mina & OTG", route: "Air Dive + Mavado Trap Drop", reason: "Recoge al oponente desde divekicks fallidos o bloqueados." }
    ]
  },
  "Reiko": {
    needs: ["combo_extender", "armor_break"],
    topKameos: [
      { kameo: "Darrius", score: "S+", tag: "Command Grab = 40% Vida", route: "bd+3 (Command Grab) + Darrius Tornado Kick", reason: "El dúo clásico de Reiko: convierte su agarre de comando en combo completo sin gastar barras." },
      { kameo: "Tremor", score: "S", tag: "Combo desde Grab + 1100 HP", route: "bd+3 + Tremor Rolling Rock > f+1,2", reason: "Alternativa top con aún más vida y presión Ambush." },
      { kameo: "Stryker", score: "A+", tag: "Granadas + Shuriken", route: "bf+3 + Double Grenades", reason: "Asegura su carga embestida de rango medio." }
    ]
  },
  "Shang Tsung": {
    needs: ["setup", "combo_extender", "overhead_low"],
    topKameos: [
      { kameo: "Ferra", score: "S", tag: "Mix-up Sorpresa", route: "Old/Young Switch + Ferra Overhead/Low", reason: "Da un 50/50 devastador para cuando decide cerrar la distancia." },
      { kameo: "Khameleon", score: "S", tag: "Escudo y Extensión", route: "Fire Skulls + Jade Glow / Fan Lift", reason: "Gana las guerras de proyectiles y alarga combos." },
      { kameo: "Sektor (Kameo)", score: "A+", tag: "Lluvia de Misiles y Calaveras", route: "Triple Fire Skull + Up Rocket", reason: "Convierte la pantalla en un muro imposible de cruzar." }
    ]
  },
  "Omni-Man": {
    needs: ["overhead_low", "safe_pressure", "combo_extender"],
    topKameos: [
      { kameo: "Kung Lao (Kameo)", score: "S+", tag: "Invasión Aérea + Low Hat", route: "Viltrumite Stance > 2 (Overhead) + Low Hat", reason: "Combinación icónica de torneo: cae en Overhead al mismo frame que impacta el sombrero bajo." },
      { kameo: "Jax", score: "S", tag: "1100 HP + Ground Pound", route: "b+1,1 ~ db+3,1 > Jax Back Breaker", reason: "Combos aéreos cerrados con Back Breaker directo a trampa imbloqueable." },
      { kameo: "Mavado", score: "A+", tag: "Combo desde Grab / Air", route: "db+3, 1+3 (Grab) + Mavado Trap Drop", reason: "Convierte su agarre de postura aérea en combo completo." }
    ]
  },
  "Quan Chi": {
    needs: ["safe_pressure", "combo_extender", "setup"],
    topKameos: [
      { kameo: "Janet Cage", score: "S+", tag: "Daño & Armadura Portal", route: "db+2 + Janet Stunt Hop > Tentacles", reason: "Compensa su bajo daño base con extensiones de altísimo rendimiento." },
      { kameo: "Sareena", score: "S", tag: "Seguridad Zoner + 38%", route: "b+3,4 ~ Sareena Blades > Bone Cage", reason: "Permite iniciar setups de jaula desde lejos." },
      { kameo: "Khameleon", score: "A+", tag: "Defensa Corta Distancia", route: "Jade Glow / Ball Roll Escape", reason: "Le ayuda cuando los rushdown logran pegarse." }
    ]
  },
  "Peacemaker": {
    needs: ["combo_extender", "safe_pressure", "chip_damage"],
    topKameos: [
      { kameo: "Kano", score: "S+", tag: "Torpedo Seguro + Eagly", route: "bf+3 (Torpedo) + Kano Ball / Knives", reason: "Hace seguro su avance rápido por tierra y presiona tras el águila Eagly." },
      { kameo: "Janet Cage", score: "S", tag: "Daño Máximo +42%", route: "Eagly Launch + Janet Double Hop", reason: "Convierte los lanzadores con pistola en combos enormes." },
      { kameo: "Tremor", score: "A+", tag: "Armadura + Proyectil", route: "Anti-Gravity + Tremor Rock", reason: "Multiplica sus opciones defensivas frente a rushdown." }
    ]
  },
  "Ermac": {
    needs: ["safe_pressure", "combo_extender", "anti_zoning"],
    topKameos: [
      { kameo: "Janet Cage", score: "S+", tag: "Almas + Doble Patada", route: "db+1 (Telekinesis) + Janet Hop > Hover", reason: "Extiende sus cancelaciones de vuelo con mayor facilidad y menos gasto de barra." },
      { kameo: "Motaro", score: "S", tag: "Teleport Presión", route: "f+4 + Motaro Teleport > 1,2", reason: "Añade engaños detrás de la espalda tras sus cancelaciones fantasmales." },
      { kameo: "Sektor (Kameo)", score: "A+", tag: "Misil Cobertura", route: "Up Rocket > Levitate Cancels", reason: "Cubre los huecos de inicio en sus cancels aéreos." }
    ]
  },
  "Homelander": {
    needs: ["overhead_low", "safe_pressure", "combo_extender"],
    topKameos: [
      { kameo: "Ferra", score: "S+", tag: "50/50 + Vuelo Letal", route: "2,1 + Ferra Overhead/Low > Flight Cancel", reason: "Una combinación temida en torneos: mezcla terrestre directa en vuelo aéreo." },
      { kameo: "Janet Cage", score: "S", tag: "Daño con Láser Aéreo", route: "Air Command Grab + Janet Hop", reason: "Aumenta el daño tras sus agarres aéreos y vuelos bajos." },
      { kameo: "Khameleon", score: "A+", tag: "Escudo y Extensión", route: "Laser + Fan Lift", reason: "Aporta defensa contra proyectiles y combos en el aire." }
    ]
  },
  "Takeda Takahashi": {
    needs: ["safe_pressure", "combo_extender"],
    topKameos: [
      { kameo: "Janet Cage", score: "S+", tag: "Látigos + Extensor", route: "bf+2 (Kunai) > Janet Hop Kick > Air Whip", reason: "Lleva sus combos de látigo por encima del 46% con una barra." },
      { kameo: "Jax", score: "S", tag: "Ground Pound Setup", route: "Kunai Explosion + Jax Ground Pound", reason: "Sincroniza explosiones de kunai con golpe de suelo imbloqueable." },
      { kameo: "Cyrax (Kameo)", score: "A+", tag: "Látigo Seguro", route: "f+1,2 + Cyrax Chopper", reason: "Mantiene seguras sus cadenas largas de látigo." }
    ]
  },
  "Cyrax": {
    needs: ["setup", "combo_extender", "safe_pressure"],
    topKameos: [
      { kameo: "Cyrax (Kameo)", score: "S+", tag: "Doble Bomba & Red", route: "Bomba propia + Electro Net Kameo", reason: "Sinergia temática y brutal de sets imbloqueables con doble bomba y red." },
      { kameo: "Janet Cage", score: "S", tag: "Extensión de Captura", route: "Red + Bomba + Janet Stunt Double", reason: "Optimiza el daño en mitad de tus setups explosivos." },
      { kameo: "Kano", score: "A+", tag: "Turnos con Bombas", route: "Bomb Set + Kano Knives", reason: "Obliga a bloquear mientras detona la bomba bajo sus pies." }
    ]
  },
  "Sektor": {
    needs: ["safe_pressure", "chip_damage", "combo_extender"],
    topKameos: [
      { kameo: "Sektor (Kameo)", score: "S+", tag: "Doble Misil Guiado", route: "Misil Propio + Up Rocket Kameo", reason: "Dos misiles cayendo a distinta altura hacen imposible acercarse o salir de la esquina." },
      { kameo: "Motaro", score: "S", tag: "Teletransporte Aéreo", route: "Flamethrower + Motaro Teleport", reason: "Cubre las bajadas tras usar los propulsores aéreos." },
      { kameo: "Mavado", score: "A+", tag: "Combo desde Teleport", route: "Teleport Uppercut + Mavado Trap Drop", reason: "Convierte su teletransporte en máximo rendimiento de daño." }
    ]
  },
  "Noob Saibot": {
    needs: ["combo_extender", "setup", "anti_zoning"],
    topKameos: [
      { kameo: "Sareena", score: "S+", tag: "Clon + Boomerangs +45%", route: "f+2,2 ~ Sareena Blades > Portal Combo", reason: "Sinergia natural desde media y larga distancia con daño directo gigantesco." },
      { kameo: "Motaro", score: "S", tag: "Doble Teleport + Clon", route: "Shadow Tackle + Motaro Teleport", reason: "Engaña al rival apareciendo al lado opuesto al clon de sombra." },
      { kameo: "Janet Cage", score: "A+", tag: "Portales + Stunt", route: "db+4 Portal + Janet Hop", reason: "Extiende sus capturas con clones." }
    ]
  },
  "Ghostface": {
    needs: ["overhead_low", "combo_extender", "setup"],
    topKameos: [
      { kameo: "Mavado", score: "S+", tag: "OTG Desde Cuchillo / Cambio", route: "Killer Switch + Mavado Trap Drop", reason: "Recoge del suelo tras ataques de cuchillo y agarres rápidos de sigilo." },
      { kameo: "Ferra", score: "S", tag: "Mix-up de Asesinos", route: "Stance Mix + Ferra Overhead/Low", reason: "Hace aún más letal la adivinanza cuando cambia al segundo asesino." },
      { kameo: "Scorpion (Kameo)", score: "A+", tag: "Extensión de Cuchilladas", route: "bf+3 + Fire Breath", reason: "Maximiza el daño en sus conversiones aéreas." }
    ]
  },
  "Conan the Barbarian": {
    needs: ["safe_pressure", "anti_zoning", "combo_extender"],
    topKameos: [
      { kameo: "Sareena", score: "S+", tag: "Espadazo +45% Fáciles", route: "f+2 + Sareena Blades > Crom Splash", reason: "Sube el brutal daño por toque del bárbaro desde rango largo de espada." },
      { kameo: "Ferra", score: "S", tag: "Mix-up de Espada + Pain", route: "2,1 + Ferra Overhead/Low + +20% Dmg", reason: "Un único acierto con Pain & Gain rompe la barra de vida." },
      { kameo: "Sub-Zero (Kameo)", score: "A+", tag: "Ice Armor Avance", route: "Ice Armor > Walk + Sword Range", reason: "Permite ignorar proyectiles para meter su espadazo pesado." }
    ]
  },
  "T-1000": {
    needs: ["setup", "combo_extender", "safe_pressure"],
    topKameos: [
      { kameo: "Madam Bo", score: "S+", tag: "Lanzamiento Oficial + Oki Sake", route: "1,2 ~ bf+2 + Madam Bo Bottle Toss", reason: "Diseñada codo con codo en su parche: alarga los ataques polimórficos y domina la esquina." },
      { kameo: "Sub-Zero (Kameo)", score: "S", tag: "Armadura + Lanzas Líquidas", route: "Ice Armor > f+3 Polearm Control", reason: "Cubre su avance frente a zoners puros." },
      { kameo: "Kano", score: "A+", tag: "Presión Metal Líquido", route: "Liquid Dash + Kano Knives", reason: "Hace seguras sus incursiones con cuchillas en bloqueo." }
    ]
  }
};

// =========================================================================
// 2. BASE DE DATOS DE POSICIONAMIENTO Y ASISTENCIAS DBFZ (45 PERSONAJES)
// =========================================================================
const DBFZ_CHARACTER_POSITIONS = {
  "Goku (Super Saiyan)": {
    primaryPos: "Anchor",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Equilibrada (No depende)",
    limitBreakRating: "S (Anchor Élite)",
    assists: {
      A: { name: "Kamehameha (Beam)", type: "Beam Horizontal", blockstun: "29f", notes: "El beam clásico de referencia para ganar neutro, cubrir entradas y extender combos." },
      B: { name: "Dragon Flash Fist (DP)", type: "Largo Alcance / Mix", blockstun: "28f", notes: "Puño rápido con gran hitbox para proteger espacio cercano." },
      C: { name: "Super Dash Kamehameha", type: "C-Assist Rastreador", blockstun: "40f", notes: "Caza al rival por toda la pantalla convirtiendo cualquier toque." }
    },
    positioningReason: "Su Beam A apoya a cualquier Point/Mid y con Limit Break sus botones largos (2M, j.M, Kamehameha) + Nivel 1/3 le convierten en uno de los Anchors más fiables."
  },
  "Vegeta (Super Saiyan)": {
    primaryPos: "Anchor",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Baja (Generador)",
    limitBreakRating: "S (Anchor Élite)",
    assists: {
      A: { name: "Consecutive Energy Blast", type: "Barrera de Ki (Lockdown)", blockstun: "38f", notes: "Lluvia continua de bolas que mantiene al rival bloqueando mientras haces Mix-up." },
      B: { name: "Crushing Knee Kick", type: "Patada Diagonal", blockstun: "26f", notes: "Golpe físico invulnerable a proyectiles de buen alcance." },
      C: { name: "Super Big Bang C", type: "C-Assist Vertical", blockstun: "40f", notes: "Captura en el aire para confirmar combos altos." }
    },
    positioningReason: "Aporta una de las mejores asistencias de presión (A-Assist) del juego y posee DP real (214M/H) + gran daño en Limit Break para remontar 1v3."
  },
  "Goku (SSGSS / Blue)": {
    primaryPos: "Point",
    viablePositions: ["Point"],
    bestAssist: "B",
    meterNeed: "Equilibrada (Gran Generador)",
    limitBreakRating: "B (Necesita Asistencia)",
    assists: {
      A: { name: "Dragon Flash Fist", type: "Overhead / Empuje", blockstun: "24f", notes: "Golpe veloz hacia adelante desde arriba." },
      B: { name: "Extreme Speed Elbow", type: "Lariat Horizontal", blockstun: "25f", notes: "Codazo veloz ideal para confirmar en neutro." },
      C: { name: "Instant Transmission", type: "C-Assist Mix/Tele", blockstun: "40f", notes: "Teletransporte directo sobre el rival." }
    },
    positioningReason: "Point puro: con dos asistencias detrás ejecuta loops en la esquina, Instant Transmission 50/50 y agarres rápidos (214L), generando barra para todo el equipo."
  },
  "Vegeta (SSGSS / Blue)": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Media",
    limitBreakRating: "B (Mejora con Asistencias)",
    assists: {
      A: { name: "Big Bang Attack", type: "Proyectil Explosivo", blockstun: "26f", notes: "Gran daño residual y control de salto en el aire." },
      B: { name: "On a Scale of 1 to 10", type: "Patadas Múltiples", blockstun: "31f", notes: "Múltiples patadas útiles para bloqueo cercano." },
      C: { name: "Galick Gun C", type: "C-Assist Beam", blockstun: "40f", notes: "Confirma combos desde lejos sin dificultad." }
    },
    positioningReason: "Sus agarres de comando aéreos y Big Bang mix-ups necesitan al menos 1 asistencia rápida (Beam/Blockstun) detrás para abrir defensas sólidas."
  },
  "Gohan (Teen)": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Generador Élite",
    limitBreakRating: "A (Gran Daño Solo)",
    assists: {
      A: { name: "Five-Star Ball (DP)", type: "Antiaéreo Invencible", blockstun: "20f", notes: "Sale rápido con invulnerabilidad aérea para cortar Super Dash." },
      B: { name: "Machine Gun Kick", type: "Blockstun Largo", blockstun: "35f", notes: "Patadas rápidas para presionar en la esquina." },
      C: { name: "Masenko / Lightning Legs", type: "C-Assist Rastreador", blockstun: "42f", notes: "Fácil confirmación para extender combos." }
    },
    positioningReason: "Genera cantidades absurdas de barra (Bomb Loops) y tiene mix-ups con 236L/M si tiene asistencias que cubran el hueco en neutro (donde su tamaño pequeño le penaliza)."
  },
  "Gohan (Adult)": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid", "Anchor"],
    bestAssist: "B",
    meterNeed: "Alta (Consume Nivel 1-7)",
    limitBreakRating: "S (Nivel 5/7 Monstruoso)",
    assists: {
      A: { name: "Jet Uppercut (DP)", type: "DP Invencible", blockstun: "22f", notes: "Antiaéreo limpio y rápido para proteger la presión." },
      B: { name: "Masenko / Leg Loops", type: "Multi-Patada Blockstun", blockstun: "38f", notes: "Una de las mejores asistencias de bloqueo para mix-ups rápidos." },
      C: { name: "Ultimate Kamehameha", type: "C-Assist Beam", blockstun: "40f", notes: "Beam vertical/diagonal práctico." }
    },
    positioningReason: "Mid ideal: entra mediante Special Tag o DHC cuando ya tienes barra acumulada por el Point para subir rápido a Nivel 1, 5 o 7 y dominar el partido."
  },
  "Trunks": {
    primaryPos: "Anchor",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "B",
    meterNeed: "Media",
    limitBreakRating: "S (Anchor Élite)",
    assists: {
      A: { name: "Change the Future", type: "Explosión Área", blockstun: "28f", notes: "Explosión gigante anti-superdash que controla medio campo." },
      B: { name: "Masenko", type: "Beam Rápido", blockstun: "29f", notes: "Beam rápido de libro para cubrir neutro." },
      C: { name: "Cyclone Buster", type: "C-Assist Rastreador", blockstun: "40f", notes: "Seguimiento directo de combo." }
    },
    positioningReason: "Con Limit Break y barras de Sparking, Trunks ejecuta mixes de Flip (EX) totalmente solo desde cualquier lugar y da un Beam A/B top al equipo."
  },
  "Piccolo": {
    primaryPos: "Mid",
    viablePositions: ["Mid"],
    bestAssist: "A",
    meterNeed: "Alta (Hellzone + EX)",
    limitBreakRating: "A (Fuerte en Esquina)",
    assists: {
      A: { name: "Homing Energy Blast", type: "Orbe Teledirigido", blockstun: "21f", notes: "Fuerza al rival a bloquear en neutro o cubre saltos de Oki." },
      B: { name: "Demon Elbow", type: "Golpe Medio", blockstun: "28f", notes: "Extensión de combo rápida en suelo." },
      C: { name: "Special Beam Cannon", type: "C-Assist Proyectil", blockstun: "40f", notes: "Rayo perforante a toda la pantalla." }
    },
    positioningReason: "Mid por excelencia: sufre un poco el neutro inicial en Point, pero entra tras DHC/Tag cuando ya tienes 1+ barras para encadenar Hellzone Grenade Oki con el Orbe A."
  },
  "Krillin": {
    primaryPos: "Anchor",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Baja",
    limitBreakRating: "S (Muy peligroso en parches actuales)",
    assists: {
      A: { name: "Roca / Semilla Senzu", type: "Proyectil / Curación", blockstun: "24f", notes: "Lanza roca veloz o cura vida azul con Senzu manteniendo adelante." },
      B: { name: "Kamehameha", type: "Beam Horizontal", blockstun: "29f", notes: "Beam clásico que facilita neutro a todo el equipo." },
      C: { name: "Destructo Disc", type: "C-Assist Seguimiento", blockstun: "40f", notes: "Confirmación segura en el aire." }
    },
    positioningReason: "Ofrece tanto Beam (B) como Semilla Senzu + Roca (A) en los slots traseros y tiene Solar Flare + Nivel 3 Oki en Limit Break."
  },
  "Yamcha": {
    primaryPos: "Anchor",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Baja",
    limitBreakRating: "S (Remontadas Rápidas)",
    assists: {
      A: { name: "Wolf Fang Fist", type: "Lockdown Instantáneo", blockstun: "42f", notes: "Una de las asistencias de bloqueo más rápidas y duraderas del juego." },
      B: { name: "Kamehameha", type: "Beam Horizontal", blockstun: "29f", notes: "Alternativa Beam para equipos sin control lejano." },
      C: { name: "Gale Claws", type: "C-Assist", blockstun: "40f", notes: "Seguimiento aéreo directo." }
    },
    positioningReason: "Anchor clásico de DBFZ: Wolf Fang Fist A regala 50/50 gratuitos a tu Point/Mid, y solo en Limit Break sigue haciendo mix-ups izquierda/derecha rapidísimos."
  },
  "Tien": {
    primaryPos: "Anchor",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Media/Alta (Kikoho)",
    limitBreakRating: "S+ (Daño Letal 1-Touch)",
    assists: {
      A: { name: "Dodon Ray", type: "Beam Rápido (Startup Top)", blockstun: "26f", notes: "Beam rapidísimo para confirmar toques y frenar Super Dash." },
      B: { name: "Telekinesis", type: "Parálisis / Captura", blockstun: "33f", notes: "Paraliza en el aire o suelo para setups de agarre." },
      C: { name: "Volleyball Fist", type: "C-Assist", blockstun: "40f", notes: "Extensión sencilla para rematar combos." }
    },
    positioningReason: "Uno de los mejores Anchors del juego: con Limit Break + Sparking mata de un toque gastando barras con Neo Tri-Beam."
  },
  "Nappa": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Media",
    limitBreakRating: "B (Mejor con Asistencias)",
    assists: {
      A: { name: "Too Bad! (Explosion)", type: "Antiaéreo Explosivo", blockstun: "32f", notes: "Alto daño y buen control encima de la cabeza." },
      B: { name: "Saibaman Spit", type: "Proyectil Ácido", blockstun: "22f", notes: "Escupe ácido para extender esquina o cubrir avances." },
      C: { name: "Armored Smash", type: "C-Assist Armadura", blockstun: "40f", notes: "Golpe con superarmadura." }
    },
    positioningReason: "Necesita asistencias largas (Kid Buu, Yamcha, Roshi, Android 17) para plantar Saibaman de forma segura en mitad de presión y crear resets mortales en Point."
  },
  "Captain Ginyu": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Baja (Generador)",
    limitBreakRating: "C (Depende del Ginyu Force)",
    assists: {
      A: { name: "Strong Jersey", type: "Lariat / Empuje", blockstun: "25f", notes: "Embestida horizontal sólida para acercarse." },
      B: { name: "Ginyu Force Call", type: "Invocación Asistencia", blockstun: "Variable", notes: "Llama al miembro actual de la Fuerza Ginyu." },
      C: { name: "Milky Cannon", type: "C-Assist", blockstun: "40f", notes: "Seguimiento estándar C." }
    },
    positioningReason: "Requiere 2 asistencias de respaldo desde el segundo 1 en Point para llenar la pantalla junto a Recoome, Burter, Jeice y Guldo."
  },
  "Frieza": {
    primaryPos: "Anchor",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "B",
    meterNeed: "Alta (Golden Frieza 3 Barras)",
    limitBreakRating: "A (Golden + Limit Break Letal)",
    assists: {
      A: { name: "Earth Breaker", type: "Pilar Diagonal", blockstun: "27f", notes: "Columna que controla espacio aéreo en neutro." },
      B: { name: "Death Slash", type: "Corte Rápido Horizontal", blockstun: "31f", notes: "Corte con gran blockstun y salida veloz." },
      C: { name: "Death Saucer", type: "C-Assist Tracking", blockstun: "40f", notes: "Confirmación sencilla tras impacto." }
    },
    positioningReason: "Anchor/Mid zoner único: entra con 3+ barras acumuladas para activar Golden Frieza + Limit Break, obteniendo doble air-dash y velocidad extrema."
  },
  "Cell": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Baja (Excelente batería)",
    limitBreakRating: "A (Muy completo)",
    assists: {
      A: { name: "Kamehameha Aéreo", type: "Beam Diagonal", blockstun: "29f", notes: "Ángulo diagonal perfecto para cubrir saltos." },
      B: { name: "Rolling Crush", type: "Avance / Empuje", blockstun: "32f", notes: "Múltiples patadas que mantienen al rival bloqueando." },
      C: { name: "Perfect Attack C", type: "C-Assist Antiaéreo", blockstun: "40f", notes: "Inicia combos desde cualquier toque." }
    },
    positioningReason: "Point dominante tras el último parche: Perfect Attack EX, loops con gran ganancia de barra y mix-ups de alta prioridad cuando está cubierto por asistencias."
  },
  "Majin Buu": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid"],
    bestAssist: "B",
    meterNeed: "Media",
    limitBreakRating: "B (Menos resets solo)",
    assists: {
      A: { name: "Sweeping Breath", type: "Cono Amplio Horizontal", blockstun: "32f", notes: "Onda expansiva de mucho alcance." },
      B: { name: "Fat Throw (Grasa)", type: "Inmovilización", blockstun: "40f+", notes: "Atrapa al rival en bola rosa para resets gratuitos." },
      C: { name: "Cartwheel Smash", type: "C-Assist", blockstun: "40f", notes: "Seguimiento estándar." }
    },
    positioningReason: "Especialista en resets con Fat Throw que brilla como Point o Mid rodeado de asistencias Beam o Ki que ayuden a atrapar en neutro."
  },
  "Kid Buu": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Media",
    limitBreakRating: "A (Solo Mix bueno)",
    assists: {
      A: { name: "Arm Ball", type: "Lockdown Supremo (48f+)", blockstun: "48f+", notes: "La asistencia con mayor blockstun de DBFZ; regala mix-ups 50/50 reales a todo el plantel." },
      B: { name: "Mystic Ball Attack", type: "Rebote Diagonal", blockstun: "26f", notes: "Cubre el espacio aéreo superior." },
      C: { name: "Kamehameha", type: "C-Assist Beam", blockstun: "40f", notes: "Beam rastreador clásico." }
    },
    positioningReason: "El mejor Mid habilitador de mix-ups: su A-Assist otorga 50/50 inmediatos al Point y entra después con barras para continuar la presión con j.S/2S."
  },
  "Android 16": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Media",
    limitBreakRating: "B (Solo le cuesta acercarse)",
    assists: {
      A: { name: "Flying Powerbomb", type: "Puño Corto / Blockstun", blockstun: "34f", notes: "Alta duración en bloqueo con recuperación rápida." },
      B: { name: "Hell's Flash Rocket", type: "Dobles Proyectiles", blockstun: "23f", notes: "Disparo múltiple de muñecas para frenar saltos." },
      C: { name: "Dynamite Driver", type: "C-Assist Agarre", blockstun: "40f", notes: "Caza desde el aire para combo." }
    },
    positioningReason: "Grappler puro que rinde muchísimo más en Point o Mid apoyado por Beams/Blockstun para forzar la moneda entre agarre de comando y golpe medio."
  },
  "Android 18": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "B",
    meterNeed: "Generador (Barrera + 17)",
    limitBreakRating: "A (Buena presión 1v1)",
    assists: {
      A: { name: "Barrier", type: "Escudo Absorbente", blockstun: "Especial", notes: "Absorbe proyectiles y ataques dando barras gratis." },
      B: { name: "Destructo-Disc", type: "Proyectil Rápido", blockstun: "26f", notes: "Disco rápido para extender combos o mantener neutro." },
      C: { name: "Accel Dance C", type: "C-Assist Tracking", blockstun: "40f", notes: "Combo directo." }
    },
    positioningReason: "Su barrera y sus llamadas de Android 17 en Oki la convierten en una máquina en Point que destruye asistencias rivales y genera barra sin parar."
  },
  "Android 21 (Majin)": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Equilibrada",
    limitBreakRating: "S (Alcance + Level 3 Oki)",
    assists: {
      A: { name: "Total Detonation Ball", type: "Proyectil Rápido Horizontal", blockstun: "29f", notes: "Gran bola de energía veloz con hitstun perfecto." },
      B: { name: "Aerial Connoisseur", type: "Lariat Horizontal", blockstun: "28f", notes: "Corte veloz a media distancia." },
      C: { name: "Photon Wave C", type: "C-Assist", blockstun: "40f", notes: "Extensión fácil." }
    },
    positioningReason: "Extremadamente flexible: puede ir de Point para robar habilidades pronto, de Mid con su A-Assist top-tier o de Anchor gracias a su alcance j.M/5M."
  },
  "Gotenks": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "B",
    meterNeed: "Equilibrada",
    limitBreakRating: "A (Ghost Oki Fuerte)",
    assists: {
      A: { name: "Galactic Donut", type: "Aro Paralizante", blockstun: "42f+", notes: "Atrapa al rival en bloqueo para mix-ups y rebotes." },
      B: { name: "Miracle Super Punch", type: "Avance Rápido Blockstun", blockstun: "34f", notes: "Fácil de usar para combos y blockstrings." },
      C: { name: "Super Ghost Kamikaze", type: "C-Assist", blockstun: "40f", notes: "Fantasmas guiados." }
    },
    positioningReason: "Aportando Galactic Donut o Super Punch y manteniendo Ghost Oki con cualquier knockdown tras DHC, rinde de maravilla en Point o Mid."
  },
  "Beerus": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Media/Alta",
    limitBreakRating: "S (Nivel 3 y Orbes Letales)",
    assists: {
      A: { name: "Spheres of Destruction", type: "Orbe Horizontal Rebotable", blockstun: "25f", notes: "Controla la pantalla horizontal tras los últimos buffs." },
      B: { name: "Multi-Kick (DP)", type: "Patadas Rápidas", blockstun: "34f", notes: "Buen blockstun a corta distancia." },
      C: { name: "Hakaisphere C", type: "C-Assist", blockstun: "40f", notes: "Seguimiento." }
    },
    positioningReason: "Mid o Anchor explosivo tras los parches recientes: sus orbes dominan el knockdown en esquina y su Nivel 1/2/3 quita vida monstruosa."
  },
  "Hit": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Media",
    limitBreakRating: "A (Invisibilidad/EX Letal)",
    assists: {
      A: { name: "Deadly Impact", type: "Golpe Rápido Invencible", blockstun: "28f", notes: "Sale rápido con invulnerabilidad parcial y cubre al frente." },
      B: { name: "Tides of Time (Low)", type: "Onda Baja", blockstun: "25f", notes: "Corta opciones a ras de suelo." },
      C: { name: "Time-Skip Molotov", type: "C-Assist", blockstun: "40f", notes: "Caza desde cualquier punto." }
    },
    positioningReason: "Como carece de proyectiles estándar, funciona mejor en Mid entrando tras el Point o en Point apoyado por un Beam (Goku SSJ/Trunks) + Lockdown."
  },
  "Goku Black": {
    primaryPos: "Mid",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Equilibrada",
    limitBreakRating: "A (Buen 2H y Teleport)",
    assists: {
      A: { name: "Black Kamehameha", type: "Beam Horizontal", blockstun: "29f", notes: "Beam de referencia de pantalla completa." },
      B: { name: "God Slicer", type: "Corte Rápido con Espada", blockstun: "28f", notes: "Cubre ángulos delanteros." },
      C: { name: "Instant Transmission", type: "C-Assist Mix", blockstun: "40f", notes: "Aparece encima para convertir combos." }
    },
    positioningReason: "Su Beam A apoya muy bien en Mid/Anchor mientras sus mejoras de Instant Transmission le permiten presionar solo cuando queda vivo al final."
  },
  "Bardock": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "B",
    meterNeed: "Baja (Generador)",
    limitBreakRating: "A (Lariat + Autocombo)",
    assists: {
      A: { name: "Rebellion Spear", type: "Lariat Horizontal Veloz", blockstun: "25f", notes: "El clásico lariat veloz para extender combos." },
      B: { name: "Tyrant Lancer", type: "Lockdown Pesado (46f)", blockstun: "46f", notes: "Una de las asistencias con mayor blockstun para garantizar 50/50." },
      C: { name: "Riot Javelin C", type: "C-Assist", blockstun: "40f", notes: "Confirmación sencilla." }
    },
    positioningReason: "Point todo-terreno por excelencia: genera barras rápidas, abre con Lariat + Asistencia y si pasa a Mid da 46 frames de bloqueo con su B-Assist."
  },
  "Broly (Z)": {
    primaryPos: "Anchor",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Alta (EX Armadura y Nivel 3)",
    limitBreakRating: "S+ (El Rey del Anchor)",
    assists: {
      A: { name: "Eraser Blow", type: "Proyectil Gigante con Prioridad", blockstun: "28f", notes: "Atraviesa proyectiles normales y controla todo el neutro." },
      B: { name: "Ki Blast Volley", type: "Lluvia de Ki", blockstun: "30f", notes: "Múltiples bolas para presionar saltos." },
      C: { name: "Lariat Express C", type: "C-Assist Armadura", blockstun: "40f", notes: "Lariat con superarmadura." }
    },
    positioningReason: "Anchor #1 de la historia de DBFZ: sus bolas de Ki ganan toda guerra a distancia, tiene Superarmadura + agarre imbloqueable de 17f y con barras + Limit Break da miedo real."
  },
  "Zamasu (Fused)": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Alta para ToDs (pero genera muy bien)",
    limitBreakRating: "B (Menos mix sin asistencia)",
    assists: {
      A: { name: "Heavenly Arrow", type: "Rayo Horizontal Veloz", blockstun: "28f", notes: "Proyectil rápido con gran hitstun." },
      B: { name: "Eternal Justice", type: "Lariat / Empuje", blockstun: "32f", notes: "Combo extensor sólido." },
      C: { name: "Blades of Judgment C", type: "C-Assist", blockstun: "40f", notes: "Caza desde lejos." }
    },
    positioningReason: "Con dos asistencias detrás puede cargar Blades of Judgment (214L/M) en mitad de bloqueo y ejecutar ToDs desde prácticamente cualquier toque."
  },
  "Vegito (SSGSS)": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Equilibrada",
    limitBreakRating: "S (5M + Espada + Air 236H)",
    assists: {
      A: { name: "Split Finger Shot", type: "Abánico Gigante de Ki", blockstun: "29f", notes: "Domina la mitad de la pantalla en diagonal y frena Super Dash." },
      B: { name: "Slicing Spin", type: "Combo Extender", blockstun: "32f", notes: "Fácil confirmación a corta distancia." },
      C: { name: "Spirit Excalibur C", type: "C-Assist", blockstun: "40f", notes: "Alcance enorme." }
    },
    positioningReason: "Uno de los mejores Mids de la historia competitiva: su 5M enorme y A-Assist (Split Finger Shot) cubren media pantalla para tus otros dos personajes."
  },
  "Goku (Base)": {
    primaryPos: "Anchor",
    viablePositions: ["Anchor"],
    bestAssist: "A",
    meterNeed: "Alta (Nivel 3 Genkidama / Kaioken)",
    limitBreakRating: "S+ (Kaioken x20 Invencible)",
    assists: {
      A: { name: "Energy Wave (Shockwave)", type: "Empuje Veloz Wallbounce", blockstun: "37f", notes: "De las mejores asistencias para combos y 50/50 por su enorme empuje/hitstun." },
      B: { name: "Lend Me Your Energy", type: "Carga +1 Barra Ki", blockstun: "0 (Soporte)", notes: "Recarga directamente 1 barra de Super para tu Point/Mid!" },
      C: { name: "Mini Spirit Bomb", type: "C-Assist", blockstun: "40f", notes: "Confirmación sencilla." }
    },
    positioningReason: "Anchor por definición: su Kaioken se multiplica a x20 cuando es el último vivo (daño absurdo con agarres/reversals) y permite DHC directo hacia Super Spirit Bomb."
  },
  "Vegeta (Base)": {
    primaryPos: "Point",
    viablePositions: ["Point"],
    bestAssist: "A",
    meterNeed: "Baja (Generador #1)",
    limitBreakRating: "B (Es mucho mejor en Point)",
    assists: {
      A: { name: "Energy Scatter", type: "Disparo Diagonal Abajo", blockstun: "24f", notes: "Rápido para controlar el suelo desde el aire." },
      B: { name: "Destructo Knee", type: "Control Corto", blockstun: "28f", notes: "Extensor físico cercano." },
      C: { name: "Galaxy Breaker C", type: "C-Assist", blockstun: "40f", notes: "Explosión vertical." }
    },
    positioningReason: "Point puro: tiene el mejor mix-up de disc/236H tras asistencia, Ki Blasts rápidos para ganar neutro, loops de esquina con enorme ganancia de barra y Nivel 3 Oki."
  },
  "Cooler": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Equilibrada",
    limitBreakRating: "A (Alcance + DP)",
    assists: {
      A: { name: "Genocidal Uppercut (DP)", type: "DP Antiaéreo Invencible", blockstun: "21f", notes: "DP gigante para frenar saltos y presionar." },
      B: { name: "Death Crusher", type: "Embestida Inmune a Ki", blockstun: "25f", notes: "Atraviesa proyectiles normales." },
      C: { name: "Death Chaser C", type: "C-Assist", blockstun: "40f", notes: "Seguimiento estándar." }
    },
    positioningReason: "Excelente Mid/Anchor contra equipos con mucho Zoning: posee 3H inmune a proyectiles, DP con alcance enorme y gran 2M."
  },
  "Android 17": {
    primaryPos: "Mid",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Baja (Generador Masivo)",
    limitBreakRating: "A (Muy completo tras buffs)",
    assists: {
      A: { name: "Barrier + Blast", type: "Escudo Invencible + Onda", blockstun: "31f", notes: "Una de las mejores asistencias de DBFZ: invencible desde el frame 4, frena Super Dash y cubre mixes." },
      B: { name: "Power Blitz", type: "Carga de Energía", blockstun: "30f", notes: "Carga golpe masivo a media distancia." },
      C: { name: "Acrobatic Assault C", type: "C-Assist", blockstun: "40f", notes: "Fácil confirmación." }
    },
    positioningReason: "El Mid estrella del meta actual: su A-Assist es prácticamente un reversal gratuito para proteger al Point y genera barras de Ki más rápido que nadie."
  },
  "Jiren": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Equilibrada",
    limitBreakRating: "S (2S + Parries Letales)",
    assists: {
      A: { name: "Colossal Slash", type: "Golpe Enorme Blockstun", blockstun: "38f", notes: "Altísimo blockstun y wallbounce ideal para combos y mix." },
      B: { name: "Shockwave Counter", type: "Antiaéreo Rápido", blockstun: "29f", notes: "Controla saltos y corta ofensivas." },
      C: { name: "Infinity Rush C", type: "C-Assist", blockstun: "40f", notes: "Seguimiento directo." }
    },
    positioningReason: "Funciona como tanque en Mid o Anchor gracias al mejor 2L/2S de castigo del juego, parries EX que cubren todo y su increíble asistencia A de 38f."
  },
  "Videl": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "B",
    meterNeed: "Media",
    limitBreakRating: "B (Sin Reflect sufre sola)",
    assists: {
      A: { name: "Justice Combination", type: "Patada Rápida", blockstun: "28f", notes: "Extensión sólida en suelo." },
      B: { name: "Frankensteiner / 2H Assist", type: "Blockstun Largo", blockstun: "36f", notes: "Larga duración para cubrir mix-ups de esquina." },
      C: { name: "Great Saiyaman C", type: "C-Assist", blockstun: "40f", notes: "Ataque combinado." }
    },
    positioningReason: "Point agresivo de mix-ups rápidos con Great Saiyaman; como carece de Reflect estándar (solo Dodge), agradece mucho salir acompañada en Point."
  },
  "Goku (GT)": {
    primaryPos: "Mid",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Media",
    limitBreakRating: "S (Spirit Bomb + Báculo)",
    assists: {
      A: { name: "Kamehameha (Diagonal Arriba)", type: "Beam Diagonal Aéreo", blockstun: "29f", notes: "El beam diagonal por excelencia que domina la parte alta de la pantalla." },
      B: { name: "Power Pole (Báculo)", type: "Lockdown Corto", blockstun: "41f", notes: "Golpes de báculo con enorme duración de bloqueo." },
      C: { name: "Reverse Kamehameha", type: "C-Assist", blockstun: "40f", notes: "Seguimiento aéreo." }
    },
    positioningReason: "Su Beam diagonal A y su Báculo B sirven en Mid/Anchor mientras reserva barras para su potente Nivel 3 Oki en Limit Break."
  },
  "Janemba": {
    primaryPos: "Anchor",
    viablePositions: ["Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Baja",
    limitBreakRating: "S (Mix Teleport + Espada)",
    assists: {
      A: { name: "Tracking Ki Blasts", type: "Proyectil Teledirigido Múltiple", blockstun: "27f", notes: "Persigue al oponente en toda la pantalla y fuerza a bloquear." },
      B: { name: "Demonic Blade", type: "Corte Largo Horizontal", blockstun: "33f", notes: "Gran alcance horizontal para confirmar." },
      C: { name: "Dimension Cut C", type: "C-Assist", blockstun: "40f", notes: "Caza desde lejos." }
    },
    positioningReason: "Uno de los mejores Anchors del juego: ofrece seguimiento de pantalla completa con la A-Assist y ejecuta mixes de teletransporte solo en Limit Break."
  },
  "Gogeta (SSGSS)": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Media",
    limitBreakRating: "A (Daño masivo, botones lentos)",
    assists: {
      A: { name: "Rising Vortex (DP)", type: "Patada Explosiva Wallbounce", blockstun: "25f", notes: "Rebota al rival contra el muro desde medio escenario." },
      B: { name: "Stardust Fall", type: "Avance Rápido", blockstun: "27f", notes: "Avanza horizontalmente muy rápido." },
      C: { name: "Kamehameha C", type: "C-Assist Beam", blockstun: "40f", notes: "Beam rastreador clásico." }
    },
    positioningReason: "Point explosivo: sus normales tienen un recovery algo lento al aire, así que necesita asistencias que le cubran en bloqueo mientras busca sus ToDs."
  },
  "Broly (DBS)": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "B",
    meterNeed: "Media (Nivel 3 Buff +15% Daño)",
    limitBreakRating: "A (Con Buff de Nivel 3 es letal)",
    assists: {
      A: { name: "Eraser Blow", type: "Empuje Frontal", blockstun: "26f", notes: "Embestida rápida con mucho daño." },
      B: { name: "Gigantic Charge (Orbe Arriba)", type: "Proyectil Antiaéreo Gigante", blockstun: "29f", notes: "Cubre toda la zona diagonal superior del mapa." },
      C: { name: "Gigantic Fury C", type: "C-Assist", blockstun: "40f", notes: "Captura en el aire." }
    },
    positioningReason: "Rinde en Point o Mid apoyado por asistencias para forzar los Stomps (piso) y agarres lentos; tras tirar su Nivel 3 gana +15% de daño permanente."
  },
  "Kefla": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Baja (Muy Rápida)",
    limitBreakRating: "A (Buenos Low/Mixes)",
    assists: {
      A: { name: "Fist Cannonball", type: "Lluvia Múltiple", blockstun: "31f", notes: "Cubre bien en diagonal." },
      B: { name: "Mighty Cannonball", type: "Lockdown Corto Rápido", blockstun: "35f", notes: "Muy bueno para extender presión." },
      C: { name: "Gigantic Ray C", type: "C-Assist", blockstun: "40f", notes: "Beam C." }
    },
    positioningReason: "Point veloz que abre con doble Low/Overhead y velocidad de carrera superior si tiene asistencias detrás."
  },
  "Goku (Ultra Instinct)": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Equilibrada",
    limitBreakRating: "A (Reversals únicos)",
    assists: {
      A: { name: "Rising Heat (DP)", type: "DP Vertical Invencible", blockstun: "23f", notes: "Protege todo el eje vertical sobre tu personaje." },
      B: { name: "Kamehameha", type: "Beam Clásico", blockstun: "29f", notes: "Beam horizontal tradicional." },
      C: { name: "Unrestrained Will C", type: "C-Assist Tracker", blockstun: "40f", notes: "Caza desde cualquier punto." }
    },
    positioningReason: "Brilla tanto en Point como en Mid gracias a su arsenal defensivo completo (6H counter, Wakeup Tech, DP A-Assist / Beam B-Assist)."
  },
  "Master Roshi": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid"],
    bestAssist: "B",
    meterNeed: "Equilibrada",
    limitBreakRating: "B (Movilidad sin SD)",
    assists: {
      A: { name: "Kamehameha", type: "Beam Horizontal", blockstun: "29f", notes: "Beam rápido horizontal clásico." },
      B: { name: "Turtle Hermit Blast (DP/Blockstun)", type: "Lockdown + Invuln", blockstun: "37f", notes: "Una asistencia brutal para forzar 50/50 con gran seguridad." },
      C: { name: "Mafuba C", type: "C-Assist", blockstun: "40f", notes: "Atrapa al rival en frasco." }
    },
    positioningReason: "Mid técnico con una de las mejores asistencias B de bloqueo del juego para potenciar al Point, entrando luego con sus mix-ups únicos de saltos sin Super Dash."
  },
  "Super Baby 2": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid", "Anchor"],
    bestAssist: "B",
    meterNeed: "Baja (Excelente Generador)",
    limitBreakRating: "S (Ki Blasts que regresan + Monos)",
    assists: {
      A: { name: "Revenge Final Flash Blasts", type: "Muro de Ki Horizontal", blockstun: "31f", notes: "Dispara múltiples rayos con control masivo." },
      B: { name: "Revenge Blast (Tracker)", type: "Tracking Aéreo", blockstun: "32f", notes: "Golpea desde arriba persiguiendo en cualquier posición." },
      C: { name: "Great Ape C", type: "C-Assist", blockstun: "40f", notes: "Rastreo completo." }
    },
    positioningReason: "Puede jugar en las 3 posiciones, pero brilla en Mid donde genera barra con Ki Blasts que regresan y roba la asistencia de los rivales ya KO."
  },
  "Gogeta (SS4)": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "B",
    meterNeed: "Generador Masivo",
    limitBreakRating: "S (Doble Air Dash + Instakill Nv7)",
    assists: {
      A: { name: "Finish Sign (Taunt/Nivel)", type: "Carga Nivel + 0.5 Barra", blockstun: "0 (Soporte)", notes: "Sube niveles para el Nivel 7 Instakill mientras da barra." },
      B: { name: "Plus Energy Kick", type: "Lariat Masivo Rápido", blockstun: "36f", notes: "Asistencia física rapidísima para mantener presión y combos." },
      C: { name: "Big Bang Kamehameha", type: "C-Assist", blockstun: "40f", notes: "Seguimiento estándar." }
    },
    positioningReason: "Point #1 de rushdown puro: doble Air Dash y doble salto aéreo hacen imposible defender su Mix-up cuando tiene detrás un Beam o Lockdown."
  },
  "Android 21 (Lab Coat)": {
    primaryPos: "Mid",
    viablePositions: ["Point", "Mid", "Anchor"],
    bestAssist: "A",
    meterNeed: "Baja",
    limitBreakRating: "S+ (Top 3 del Juego)",
    assists: {
      A: { name: "Spinning Heel Kick", type: "Lariat Largo", blockstun: "31f", notes: "Lariat rapidísimo que cubre media pantalla y extiende combos sin esfuerzo." },
      B: { name: "Photon Ray", type: "Beam Horizontal", blockstun: "29f", notes: "Beam clásico rápido." },
      C: { name: "Photon Pulse C", type: "C-Assist", blockstun: "40f", notes: "Seguimiento C." }
    },
    positioningReason: "Funciona perfecto en cualquier posición (especialmente Mid): debilita un 21% el ataque del rival con su agarre especial (214S) y posee lariats inmunes a Ki."
  },
  "Goku (Super Saiyan 4 - DAIMA)": {
    primaryPos: "Point",
    viablePositions: ["Point", "Mid"],
    bestAssist: "A",
    meterNeed: "Baja (Generador DAIMA)",
    limitBreakRating: "A (Alcance Báculo + Presión)",
    assists: {
      A: { name: "Power Pole Surge", type: "Ataque Horizontal Báculo", blockstun: "31f", notes: "Gran alcance horizontal rápido para extender combos o cubrir neutro." },
      B: { name: "Kamehameha DAIMA", type: "Beam Rápido", blockstun: "29f", notes: "Beam fiable para neutralizar saltos y Super Dash." },
      C: { name: "SS4 Wild Rush C", type: "C-Assist", blockstun: "40f", notes: "Confirmación directa." }
    },
    positioningReason: "Point/Mid ágil del parche v1.50 DAIMA: su báculo extensible y presión rápida generan muchísima barra y mix-ups con apoyo de asistencias."
  }
};

const DBFZ_META_TEAMS = [
  {
    id: "dbfz-team-balanced",
    title: "Shell Equilibrado Top-Tier (Meta Moderno)",
    playstyle: "Rushdown + Generación de Barra + Daño ToD",
    point: { name: "Gogeta (SS4)", assist: "B" },
    mid: { name: "Android 17", assist: "A" },
    anchor: { name: "Goku (Base)", assist: "A" },
    synergyNotes: "Gogeta SS4 abre y genera barra cubierto por la barrera invencible de Android 17 (A). Cualquier DHC de 17 o Gogeta conecta directo con la Super Spirit Bomb (Nivel 3) de Base Goku."
  },
  {
    id: "dbfz-team-mixup",
    title: "Presión 50/50 Imparable (Lockdown)",
    playstyle: "Mix-up Puro + Control Aéreo",
    point: { name: "Gohan (Teen)", assist: "A" },
    mid: { name: "Kid Buu", assist: "A" },
    anchor: { name: "Trunks", assist: "B" },
    synergyNotes: "Kid Buu A (48f+ de blockstun) regala 50/50 reales a Gohan Teen y Trunks, mientras Trunks B da un Beam horizontal para controlar neutro y rematar con Limit Break."
  },
  {
    id: "dbfz-team-fusion",
    title: "Trío Fusión & Neutro Dominante",
    playstyle: "Alcance Enorme + Neutral + Daño Explosivo",
    point: { name: "Gogeta (SSGSS)", assist: "A" },
    mid: { name: "Vegito (SSGSS)", assist: "A" },
    anchor: { name: "Janemba", assist: "A" },
    synergyNotes: "Vegito A cubre la entrada de Blue Gogeta y las bolas teledirigidas de Janemba A aseguran cualquier mezcla y convierten toques desde toda la pantalla."
  },
  {
    id: "dbfz-team-beginner",
    title: "Equipo Sólido Recomendado para Empezar",
    playstyle: "Fundamentos Claros + Beams + Anchors Fiables",
    point: { name: "Bardock", assist: "B" },
    mid: { name: "Goku (Super Saiyan)", assist: "A" },
    anchor: { name: "Vegeta (Super Saiyan)", assist: "A" },
    synergyNotes: "Ruta Universal compartida en los 3 personajes, dos asistencias épicas de referencia (Beam A + Bolas de Vegeta A) y combos muy fáciles de confirmar."
  },
  {
    id: "dbfz-team-daima",
    title: "Meta Parche 1.50 DAIMA + Lab Coat",
    playstyle: "Presión Constante + Debuff + Remontada Letal",
    point: { name: "Goku (Super Saiyan 4 - DAIMA)", assist: "A" },
    mid: { name: "Android 21 (Lab Coat)", assist: "A" },
    anchor: { name: "Tien", assist: "A" },
    synergyNotes: "Goku SS4 DAIMA abre la ronda, Special Tag mete a Lab Coat para aplicar el debuff del -21% al rival, y Tien cierra el partido eliminando personajes en Limit Break con Dodon + Neo Tri-Beam."
  }
];

module.exports = {
  MK1_KAMEOS,
  MK1_MAIN_SYNERGIES,
  DBFZ_CHARACTER_POSITIONS,
  DBFZ_META_TEAMS
};
