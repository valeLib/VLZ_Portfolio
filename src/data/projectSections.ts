// Content for the project detail pages, keyed by project slug.
//
// A project references named sections (Brief, Snapshot, Game Design, Development,
// VFX, UI, Skills, Breakdown). Sections carry copy, string DSLs (diagrams/table),
// positional Items 1-4, Gallery Items 1-10, and up to three Subsections, which in
// turn carry their own copy, Items 1-5, a diagram DSL and a table DSL.
// Arrays are positional — holes stay undefined so slot N remains slot N.

import { asset } from "./projects"
import type { L10n } from "../lib/i18n"

export type SectionItem = {
  id: string
  draft?: boolean
  displayTitle?: L10n
  subtitle?: L10n
  bodyHtml?: L10n
  badge?: L10n
  icon?: string
  order?: number
}

export type SubSection = {
  id: string
  displayTitle?: L10n
  bodyHtml?: L10n
  items?: (SectionItem | undefined)[]
  diagram1?: L10n
  table1?: L10n
}

export type GalleryItem = {
  id: string
  title?: L10n
  image?: string
}

export type ProjectSection = {
  id: string
  title?: L10n
  displayTitle?: L10n
  bodyHtml?: L10n
  bodyMobileHtml?: L10n
  tags?: L10n
  table?: L10n
  diagram1?: L10n
  diagram2?: L10n
  diagram3?: L10n
  subsections?: (SubSection | undefined)[]
  items?: (SectionItem | undefined)[]
  galleryItems?: (GalleryItem | undefined)[]
  video?: string
  /** Still image alternative to `video` (Brief media slot). */
  image?: string
  order?: number
}

export type ProjectSectionsMap = {
  brief?: ProjectSection
  snapshot?: ProjectSection
  gameDesign?: ProjectSection
  development?: ProjectSection
  vfx?: ProjectSection
  ui?: ProjectSection
  skills?: ProjectSection
  breakdown?: ProjectSection
}

export const projectSections: Record<string, ProjectSectionsMap> = {
  "claws-and-cue-balls": {
    brief: {
      id: "WpRFyCEdG",
      title: { en: "Claws & Cue Balls - Brief", es: "Garras y bolas de billar - Resumen" },
      displayTitle: { en: "Project Brief", es: "Resumen del proyecto" },
      bodyHtml: { en: "<p dir=\"auto\"><strong>Claws &amp; Cue Balls</strong> is a physics-based billiards game built around short runs, card abilities, and changing table conditions. Players use cards to modify their shots, alter ball behavior, and create combinations before attempting to clear each table.</p><p dir=\"auto\">Progression introduces new cards, stronger effects, table modifiers, and boss encounters, turning each run into a mix of <strong>precision, strategy, and experimentation</strong>.</p>", es: "<p dir=\"auto\"><strong>Garras y Bolas de Billar</strong> (Claws &amp; Cue Balls) es un juego de billar basado en la física y estructurado en torno a partidas rápidas, habilidades de cartas y condiciones cambiantes en la mesa. Los jugadores utilizan cartas para modificar sus tiros, alterar el comportamiento de las bolas y crear combinaciones antes de intentar despejar cada mesa.</p><p dir=\"auto\">La progresión introduce nuevas cartas, efectos más potentes, modificadores de mesa y enfrentamientos con jefes, convirtiendo cada partida en una mezcla de <strong>precisión, estrategia y experimentación</strong>.</p>" },
      bodyMobileHtml: { en: "<p dir=\"auto\"><strong>Claws &amp; Cue Balls</strong> is a physics-based billiards game built around short runs, card abilities, and changing table conditions. Players use cards to modify their shots, alter ball behavior, and create combinations before attempting to clear each table.</p><p dir=\"auto\">Progression introduces new cards, stronger effects, table modifiers, and boss encounters, turning each run into a mix of <strong>precision, strategy, and experimentation</strong>.</p>", es: "<p dir=\"auto\"><strong>Garras y Bolas de Billar</strong> (Claws &amp; Cue Balls) es un juego de billar basado en la física y estructurado en torno a partidas rápidas, habilidades de cartas y condiciones cambiantes en la mesa. Los jugadores utilizan cartas para modificar sus tiros, alterar el comportamiento de las bolas y crear combinaciones antes de intentar despejar cada mesa.</p><p dir=\"auto\">La progresión introduce nuevas cartas, efectos más potentes, modificadores de mesa y enfrentamientos con jefes, convirtiendo cada partida en una mezcla de <strong>precisión, estrategia y experimentación</strong>.</p>" },
      tags: { en: "PC Game, Billiards, Roguelite, Card-Based, Physics, Stylized 3D", es: "Juego de PC, Billar, Roguelite, Basado en cartas, Físicas, 3D estilizado" },
      items: [
        {
          id: "gZpRBxFor",
          displayTitle: { en: "CORE IDEA", es: "IDEA CENTRAL" },
          bodyHtml: { en: "<p dir=\"auto\">Combine billiards skill with card effects to create powerful shots and adapt to each table.</p>", es: "<p dir=\"auto\">Combina tu habilidad en el billar con los efectos de las cartas para crear tiros potentes y adaptarte a cada mesa.</p>" },
          order: 0,
        },
        {
          id: "VXZL25tuJ",
          displayTitle: { en: "VISUAL DIRECTION", es: "DIRECCIÓN VISUAL" },
          bodyHtml: { en: "<p dir=\"auto\">A stylized pool-hall aesthetic with strong silhouettes, readable effects, and colorful visual feedback layered over the physics gameplay.</p>", es: "<p dir=\"auto\">Una estética estilizada de sala de billar con siluetas marcadas, efectos legibles y una colorida respuesta visual superpuesta a la jugabilidad de físicas.</p>" },
          order: 0,
        },
      ],
      // No gameplay capture exists yet, so the Brief leans on the key art:
      // a pool-hall detail cropped from the cover instead of a borrowed video.
      image: asset("Claws/claws-detail-hall.png"),
      order: 0,
    },
    snapshot: {
      id: "QCun0CyRG",
      title: { en: "Claws and Cue balls - Snapshot", es: "Garras y bolas de billar - Instantánea" },
      displayTitle: { en: "Project Snapshot", es: "Resumen del proyecto" },
      items: [
        {
          id: "yAirsEDT6",
          displayTitle: { en: "Concept", es: "Concepto" },
          bodyHtml: { en: "<p dir=\"auto\">A billiards roguelite where <strong>cards modify ball physics, shot behavior, and table conditions</strong>, giving players multiple ways to approach each turn.</p>", es: "<p dir=\"auto\">Un roguelite de billar donde <strong>las cartas modifican la física de las bolas, el comportamiento de los tiros y las condiciones de la mesa</strong>, ofreciendo a los jugadores múltiples formas de abordar cada turno.</p>" },
          order: 0,
        },
        {
          id: "QbLgj4_qw",
          displayTitle: { en: "Context", es: "Contexto" },
          bodyHtml: { en: "<p dir=\"auto\">Developed in <strong>Unreal Engine 5</strong> as a playable prototype combining physics-based gameplay, card systems, progression, boss encounters, and real-time visual effects.</p>", es: "<p dir=\"auto\">Desarrollado en <strong>Unreal Engine 5</strong> como un prototipo jugable que combina jugabilidad basada en físicas, sistemas de cartas, progresión, encuentros con jefes y efectos visuales en tiempo real.</p>" },
          order: 0,
        },
        {
          id: "E70hWveNZ",
          displayTitle: { en: "Contributions", es: "Contribuciones" },
          bodyHtml: { en: "<p dir=\"auto\">Worked across <strong>gameplay systems, card abilities, ball behavior, UI, progression, and VFX</strong>. My work focused on connecting card effects with the billiards physics, improving shot feedback, and building systems that could support many different abilities without requiring separate logic for every card.</p>", es: "<p dir=\"auto\">Trabajé en los <strong>sistemas de juego, habilidades de cartas, comportamiento de la bola, interfaz de usuario, progresión y efectos visuales (VFX)</strong>. Mi trabajo se centró en conectar los efectos de las cartas con las físicas del billar, mejorar la retroalimentación del tiro y construir sistemas que pudieran soportar muchas habilidades diferentes sin requerir una lógica separada para cada carta.</p>" },
          order: 0,
        },
        {
          id: "eF_9UBeI1",
          displayTitle: { en: "Output", es: "Resultado" },
          bodyHtml: { en: "<p dir=\"auto\">A playable prototype featuring multiple tables, card-based abilities, run progression, boss encounters, scoring systems, deck management, and a modular library of gameplay and visual effects.</p>", es: "<p dir=\"auto\">Un prototipo jugable que cuenta con múltiples mesas, habilidades basadas en cartas, progresión de la partida, enfrentamientos con jefes, sistemas de puntuación, gestión de mazos y una biblioteca modular de jugabilidad y efectos visuales.</p>" },
          order: 0,
        },
      ],
      order: 1,
    },
    gameDesign: {
      id: "T9xQdQP5C",
      title: { en: "Claws and Cue balls - Game Design", es: "Garras y bolas de billar - Diseño de juegos" },
      displayTitle: { en: "Game Design", es: "Diseño de videojuegos" },
      bodyHtml: { en: "<p dir=\"auto\">Claws &amp; Cue Balls was designed around a loop that connects <strong>shot planning, card selection, billiards execution, rewards, and progression</strong>. Before taking a shot, players can modify the current situation with cards, then aim and execute the shot while the active effects interact with the table physics.</p><p dir=\"auto\">Successful shots generate score and progression, while rewards expand the player's card options for later tables. As a run continues, stronger cards, modifiers, and boss mechanics create more complex combinations and decisions.</p>", es: "<p dir=\"auto\">Claws &amp; Cue Balls se diseñó en torno a un bucle que conecta la <strong>planificación de tiros, la selección de cartas, la ejecución del billar, las recompensas y la progresión</strong>. Antes de realizar un tiro, los jugadores pueden modificar la situación actual con cartas, luego apuntar y ejecutar el tiro mientras los efectos activos interactúan con la física de la mesa.</p><p dir=\"auto\">Los tiros exitosos generan puntuación y progresión, mientras que las recompensas amplían las opciones de cartas del jugador para las mesas posteriores. A medida que avanza la partida, cartas más fuertes, modificadores y mecánicas de jefes crean combinaciones y decisiones más complejas.</p>" },
      bodyMobileHtml: { en: "<p dir=\"auto\">Claws &amp; Cue Balls was designed around a loop that connects <strong>shot planning, card selection, billiards execution, rewards, and progression</strong>. Before taking a shot, players can modify the current situation with cards, then aim and execute the shot while the active effects interact with the table physics.</p><p dir=\"auto\">Successful shots generate score and progression, while rewards expand the player's card options for later tables. As a run continues, stronger cards, modifiers, and boss mechanics create more complex combinations and decisions.</p>", es: "<p dir=\"auto\">Claws &amp; Cue Balls se diseñó en torno a un bucle que conecta la <strong>planificación de tiros, la selección de cartas, la ejecución del billar, las recompensas y la progresión</strong>. Antes de realizar un tiro, los jugadores pueden modificar la situación actual con cartas, para luego apuntar y ejecutar el tiro mientras los efectos activos interactúan con la física de la mesa.</p><p dir=\"auto\">Los tiros acertados generan puntuación y progresión, mientras que las recompensas amplían las opciones de cartas del jugador para mesas posteriores. A medida que avanza la partida, cartas más fuertes, modificadores y mecánicas de jefes crean combinaciones y decisiones más complejas.</p>" },
      diagram1: { en: "Start Run | Enter the first table -> Prepare Shot | Read the table and manage the current hand -> Play Cards | Activate abilities and combine effects -> Aim & Shoot | Set trajectory and power -> Resolve | Process collisions, abilities, pockets, and scoring -> Reward | Gain score, currency, and card choices -> Progress | Move to the next table and improve the deck -> Boss / Final Table | Adapt to unique mechanics and table conditions", es: "Iniciar partida | Entra a la primera mesa -> Preparar el tiro | Lee la mesa y gestiona la mano actual -> Jugar cartas | Activa habilidades y combina efectos -> Apuntar y disparar | Ajusta la trayectoria y la potencia -> Resolver | Procesa colisiones, habilidades, troneras y puntuación -> Recompensa | Obtén puntos, dinero y opciones de cartas -> Progresar | Avanza a la siguiente mesa y mejora el mazo -> Jefe / Mesa final | Adáptate a mecánicas y condiciones únicas de la mesa" },
      diagram2: { en: "Plan | Read the table and choose a strategy -> Action | Activate cards, aim, and take the shot -> Result | Resolve physics, abilities, pockets, and score -> Progression | Gain cards and prepare for harder tables", es: "Planear | Lee la mesa y elige una estrategia -> Acción | Activa cartas, apunta y ejecuta el tiro -> Resultado | Resuelve físicas, habilidades, troneras y puntuación -> Progresión | Gana cartas y prepárate para mesas más difíciles" },
      diagram3: { en: "Play Runs | Complete tables and experiment with card combinations -> Earn Progress | Gain rewards, unlocks, and progression resources -> Expand Options | Unlock and upgrade cards, decks, or persistent progression -> Return | Start new runs with more strategic options", es: "Jugar partidas | Completa tablas y experimenta con combinaciones de cartas -> Progresar | Obtén recompensas, desbloqueos y recursos de progresión -> Ampliar opciones | Desbloquea y mejora cartas, barajas o progresión persistente -> Volver | Inicia nuevas partidas con más opciones estratégicas" },
      items: [
        {
          id: "claws-core-loop",
          displayTitle: { en: "Core Loop", es: "Bucle central" },
          bodyHtml: { en: "<p dir=\"auto\"><strong>Plan → Play Cards → Aim &amp; Shoot → Resolve Effects → Earn Rewards → Upgrade</strong></p><p dir=\"auto\">Before each shot, cards reshape the situation; the shot then resolves through the table physics and feeds score, rewards, and deck growth for the next table.</p>", es: "<p dir=\"auto\"><strong>Planear → Jugar cartas → Apuntar y disparar → Resolver efectos → Ganar recompensas → Mejorar</strong></p><p dir=\"auto\">Antes de cada tiro, las cartas transforman la situación; después el tiro se resuelve con la física de la mesa y alimenta la puntuación, las recompensas y el crecimiento del mazo para la siguiente mesa.</p>" },
          badge: { en: "LOOP", es: "BUCLE" },
          icon: asset("Claws/claws-detail-cards.png"),
          order: 0,
        },
      ],
      order: 2,
    },
    development: {
      id: "ndS16HLUv",
      title: { en: "Claws and Cue Balls - Development", es: "Garras y Bolas de Billar - Desarrollo" },
      displayTitle: { en: "Development", es: "Desarrollo" },
      bodyHtml: { en: "<p dir=\"auto\">Development focused on creating modular systems that allow <strong>cards, physics, UI, and VFX to react to the same gameplay events</strong>. This made it possible to add new abilities while keeping shot resolution and player feedback consistent.</p>", es: "<p dir=\"auto\">Desarrollo enfocado en crear sistemas modulares que permiten que las <strong>cartas, la física, la interfaz de usuario y los efectos visuales reaccionen a los mismos eventos de juego</strong>. Esto hizo posible agregar nuevas habilidades manteniendo la resolución de disparos y la retroalimentación del jugador de manera consistente.</p>" },
      bodyMobileHtml: { en: "<p dir=\"auto\">Development focused on creating modular systems that allow <strong>cards, physics, UI, and VFX to react to the same gameplay events</strong>. This made it possible to add new abilities while keeping shot resolution and player feedback consistent.</p>", es: "<p dir=\"auto\">El desarrollo se centró en la creación de sistemas modulares que permiten que <strong>las cartas, la física, la interfaz de usuario y los efectos visuales reaccionen a los mismos eventos de juego</strong>. Esto hizo posible agregar nuevas habilidades manteniendo la resolución de los disparos y la respuesta al jugador de manera consistente.</p>" },
      subsections: [
        {
          id: "RVFSTUTy_",
          displayTitle: { en: "1. Card & Ability System", es: "1. Sistema de cartas y habilidades" },
          items: [
            {
              id: "Yqnx9zdUc",
              displayTitle: { en: "Ability Flow", es: "Flujo de la habilidad" },
              bodyHtml: { en: "<p dir=\"auto\">The card system connects player input with ball modifiers, physics events, and visual feedback through a shared gameplay flow.</p><p dir=\"auto\">Cards can trigger at different stages of the turn, allowing effects to activate immediately, when the cue ball is struck, or as part of chained interactions.</p>", es: "<p dir=\"auto\">El sistema de cartas conecta la entrada del jugador con los modificadores de la bola, los eventos de física y la retroalimentación visual a través de un flujo de juego compartido.</p><p dir=\"auto\">Las cartas pueden activarse en diferentes etapas del turno, lo que permite que los efectos se activen de inmediato, cuando se golpea la bola blanca, o como parte de interacciones encadenadas.</p>" },
              badge: { en: "01", es: "01" },
              icon: asset("Claws/claws-si-ability-flow.svg"),
              order: 1,
            },
          ],
          diagram1: { en: "Draw Card | Draw or receive a card into the hand -> Activate Card | Select and play the card -> Apply Ability | Attach the ability or modifier to its target -> Take Shot | Take the shot with the active effect -> Resolve Effect | Trigger the ability on its activation condition -> Cleanup | Remove temporary effects and reset the card state", es: "Robar carta | Roba o recibe una carta en la mano -> Activar carta | Selecciona y juega la carta -> Aplicar habilidad | Vincula la habilidad o el modificador a su objetivo -> Ejecutar tiro | Realiza el tiro con el efecto activo -> Resolver efecto | Activa la habilidad según su condición de activación -> Limpieza | Elimina los efectos temporales y restablece el estado de la carta" },
        },
        {
          id: "OUoOAqaPP",
          displayTitle: { en: "2. Key Systems", es: "2. Sistemas clave" },
          items: [
            {
              id: "O4DKyD11Q",
              displayTitle: { en: "01 · Ball Ability Framework", es: "01 · Sistema de habilidades de bola" },
              bodyHtml: { en: "<p dir=\"auto\">Card effects modify properties and behavior such as <strong>size, power, collisions, rebounds, explosions, elemental states, and movement</strong>.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Reusable ability logic, effect lifetimes, simultaneous modifiers, activation rules, and cleanup.</p>", es: "<p dir=\"auto\">Los efectos de las cartas modifican propiedades y comportamientos como el <strong>tamaño, la potencia, las colisiones, los rebotes, las explosiones, los estados elementales y el movimiento</strong>.</p><p dir=\"auto\"><strong>Enfoque de implementación</strong><br>Lógica de habilidades reutilizable, duración de los efectos, modificadores simultáneos, reglas de activación y limpieza.</p>" },
              badge: { en: "01", es: "01" },
              icon: asset("Claws/claws-si-ball-framework.svg"),
              order: 1,
            },
            {
              id: "Wah9xKDDo",
              displayTitle: { en: "02 · Shot & Aiming System", es: "02 · Sistema de tiro y apuntado" },
              bodyHtml: { en: "<p dir=\"auto\">The shot system handles the transition between planning and execution, including trajectory visualization, target information, cue power, and camera behavior.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Pre-shot and post-shot states, trajectory beams, ghost-ball prediction, target markers, power control, and camera transitions.</p>", es: "<p dir=\"auto\">El sistema de tiro maneja la transición entre la planificación y la ejecución, incluyendo la visualización de la trayectoria, la información del objetivo, la potencia del taco y el comportamiento de la cámara.</p><p dir=\"auto\"><strong>Enfoque de la implementación</strong><br>Estados previos y posteriores al tiro, haces de trayectoria, predicción de la bola fantasma, marcadores de objetivo, control de potencia y transiciones de cámara.</p>" },
              badge: { en: "02", es: "02" },
              icon: asset("Claws/claws-si-shot-aiming.svg"),
              order: 2,
            },
            {
              id: "zqYNggNiR",
              displayTitle: { en: "03 · Card Activation & Timing", es: "03 · Activación y tiempos de las cartas" },
              bodyHtml: { en: "<p dir=\"auto\">Cards can affect different moments of a shot, from preparation to collision-driven effects. Activation rules keep these behaviors predictable while supporting combinations.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Immediate, cue-hit, and chained activation, card state, effect sequencing, and interaction between active abilities.</p>", es: "<p dir=\"auto\">Las cartas pueden afectar a diferentes momentos de un golpe, desde la preparación hasta los efectos provocados por la colisión. Las reglas de activación mantienen estos comportamientos de forma predecible al tiempo que admiten combinaciones.</p><p dir=\"auto\"><strong>Enfoque de la implementación</strong><br>Activación inmediata, al golpear la señal y encadenada, estado de la carta, secuenciación de efectos e interacción entre habilidades activas.</p>" },
              badge: { en: "03", es: "03" },
              icon: asset("Claws/claws-si-card-timing.svg"),
              order: 3,
            },
            {
              id: "iSixWPPSF",
              displayTitle: { en: "04 · Scoring & Run Progression", es: "04 · Puntuación y progresión de la partida" },
              bodyHtml: { en: "<p dir=\"auto\">The scoring system rewards successful pockets, multi-ball plays, streaks, and efficient shots. Table targets and limited attempts create pressure as the player advances through a run.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Score calculation, streaks, table goals, lives, shot tracking, rewards, and run progression.</p>", es: "<p dir=\"auto\">El sistema de puntuación recompensa las troneras exitosas, las jugadas de varias bolas, las rachas y los tiros eficientes. Los objetivos de la mesa y los intentos limitados generan presión a medida que el jugador avanza en una serie.</p><p dir=\"auto\"><strong>Enfoque de la implementación</strong><br>Cálculo de puntuación, rachas, objetivos de la mesa, vidas, seguimiento de tiros, recompensas y progresión de la serie.</p>" },
              badge: { en: "04", es: "04" },
              icon: asset("Claws/claws-si-scoring.svg"),
              order: 4,
            },
          ],
        },
      ],
      order: 2,
    },
    vfx: {
      id: "lDTCToA6p",
      title: { en: "Claws and Cue Balls - VFX", es: "Garras y Bolas de Billar - VFX" },
      displayTitle: { en: "VFX & Game Feel", es: "VFX y sensación de juego" },
      bodyHtml: { en: "<p dir=\"auto\">Because many cards change the physical behavior of a ball, visual feedback was designed to make each active effect immediately recognizable during play.</p><p dir=\"auto\">Abilities such as <strong>Fire, Ice, Orbit, Explosion, Giant, and Ricochet</strong> use combinations of Niagara particles, material overlays, trails, decals, impact effects, and camera feedback. Effects follow the ball and react to gameplay events while preserving visibility of the billiards action.</p>", es: "<p dir=\"auto\">Debido a que muchas cartas cambian el comportamiento físico de la bola, se diseñó la retroalimentación visual para que cada efecto activo sea reconocible de inmediato durante el juego.</p><p dir=\"auto\">Habilidades como <strong>Fuego, Hielo, Órbita, Explosión, Gigante y Rebote</strong> utilizan combinaciones de partículas de Niagara, superposiciones de materiales, rastros, calcomanías, efectos de impacto y retroalimentación de la cámara. Los efectos siguen a la bola y reaccionan a los eventos del juego mientras conservan la visibilidad de la acción del billar.</p>" },
      bodyMobileHtml: { en: "<p dir=\"auto\">Because many cards change the physical behavior of a ball, visual feedback was designed to make each active effect immediately recognizable during play.</p><p dir=\"auto\">Abilities such as <strong>Fire, Ice, Orbit, Explosion, Giant, and Ricochet</strong> use combinations of Niagara particles, material overlays, trails, decals, impact effects, and camera feedback. Effects follow the ball and react to gameplay events while preserving visibility of the billiards action.</p>", es: "<p dir=\"auto\">Debido a que muchas cartas cambian el comportamiento físico de la bola, se diseñó la retroalimentación visual para que cada efecto activo sea reconocible de inmediato durante el juego.</p><p dir=\"auto\">Habilidades como <strong>Fuego, Hielo, Órbita, Explosión, Gigante y Rebote</strong> utilizan combinaciones de partículas Niagara, superposiciones de materiales, estelas, calcomanías, efectos de impacto y retroalimentación de cámara. Los efectos siguen a la bola y reaccionan a los eventos del juego, manteniendo la visibilidad de la acción del billar.</p>" },
      subsections: [
        {
          id: "K7Nfeyo8u",
          items: [
            {
              id: "dCeIDZLcz",
              displayTitle: { en: "01 · Modular Ball Effects", es: "01 · Efectos modulares de bola" },
              bodyHtml: { en: "<p dir=\"auto\">Visual effects can be attached to individual balls and combined when multiple abilities are active.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Niagara systems, reusable effect configuration, effect duration, ball-scale awareness, and simultaneous VFX.</p>", es: "<p dir=\"auto\">Los efectos visuales se pueden adjuntar a bolas individuales y combinar cuando hay múltiples habilidades activas.</p><p dir=\"auto\"><strong>Enfoque de la implementación</strong><br>Sistemas Niagara, configuración de efectos reutilizables, duración de los efectos, adaptabilidad a la escala de la bola y efectos visuales (VFX) simultáneos.</p>" },
              badge: { en: "01", es: "01" },
              icon: asset("Claws/claws-si-vfx-modular.svg"),
              order: 1,
            },
            {
              id: "DSJsMjCh7",
              displayTitle: { en: "02 · Material Effects", es: "02 · Efectos de materiales" },
              bodyHtml: { en: "<p dir=\"auto\">Ball materials can receive temporary visual layers for effects such as fire, ice, or energy states.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Material overlays, Fresnel effects, animated textures, emissive response, and reusable shell materials.</p>", es: "<p dir=\"auto\">Los materiales de la bola pueden recibir capas visuales temporales para efectos como fuego, hielo o estados de energía.</p><p dir=\"auto\"><strong>Enfoque de implementación</strong><br>Superposiciones de materiales, efectos Fresnel, texturas animadas, respuesta emisiva y materiales de carcasa reutilizables.</p>" },
              badge: { en: "02", es: "02" },
              icon: asset("Claws/claws-si-vfx-material.svg"),
              order: 2,
            },
            {
              id: "jrrh8KgD_",
              displayTitle: { en: "03 · Impact Feedback", es: "03 · Feedback de impacto" },
              bodyHtml: { en: "<p dir=\"auto\">Collisions and ability triggers use particles, decals, animation, and camera feedback to communicate force and timing.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Impact bursts, smoke, debris, trails, decals, camera shake, and effect synchronization.</p>", es: "<p dir=\"auto\">Las colisiones y los activadores de habilidades utilizan partículas, calcomanías, animación y retroalimentación de la cámara para comunicar la fuerza y el tiempo.</p><p dir=\"auto\"><strong>Enfoque de implementación</strong><br>Ráfagas de impacto, humo, escombros, estelas, calcomanías, sacudida de cámara y sincronización de efectos.</p>" },
              badge: { en: "03", es: "03" },
              icon: asset("Claws/claws-si-vfx-impact.svg"),
              order: 3,
            },
          ],
        },
      ],
      order: 2,
    },
    ui: {
      id: "l3m8X0wz4",
      title: { en: "Claws and Cue balls- UI", es: "Garras y bolas de billar: interfaz de usuario" },
      displayTitle: { en: "UI & Player Feedback", es: "Interfaz y feedback del jugador" },
      bodyHtml: { en: "<p dir=\"auto\">The interface was designed around the different stages of a billiards turn, keeping information available when it becomes relevant.</p><p dir=\"auto\">During the pre-shot phase, players can manage cards, read the predicted trajectory, identify targets, and adjust shot power. During and after the shot, the interface shifts toward scoring, active effects, remaining lives, and table progression.</p>", es: "<p dir=\"auto\">La interfaz se diseñó en torno a las diferentes etapas del turno de billar, manteniendo la información disponible a medida que resulta relevante.</p><p dir=\"auto\">Durante la fase previa al tiro, los jugadores pueden gestionar las cartas, leer la trayectoria prevista, identificar objetivos y ajustar la potencia del tiro. Durante y después del tiro, la interfaz cambia hacia la puntuación, los efectos activos, las vidas restantes y la progresión de la mesa.</p>" },
      bodyMobileHtml: { en: "<p dir=\"auto\">The interface was designed around the different stages of a billiards turn, keeping information available when it becomes relevant.</p><p dir=\"auto\">During the pre-shot phase, players can manage cards, read the predicted trajectory, identify targets, and adjust shot power. During and after the shot, the interface shifts toward scoring, active effects, remaining lives, and table progression.</p>", es: "<p dir=\"auto\">La interfaz se diseñó en torno a las diferentes etapas del turno de billar, manteniendo la información disponible cuando es relevante.</p><p dir=\"auto\">Durante la fase previa al tiro, los jugadores pueden gestionar las cartas, leer la trayectoria prevista, identificar objetivos y ajustar la potencia del tiro. Durante y después del tiro, la interfaz cambia hacia la puntuación, los efectos activos, las vidas restantes y la progresión de la mesa.</p>" },
      subsections: [
        {
          id: "YfP5o9Nel",
          displayTitle: { en: "Key UI Systems", es: "Sistemas clave de la interfaz de usuario" },
          items: [
            {
              id: "m3nj1_xpI",
              displayTitle: { en: "01 · Card Hand", es: "01 · Mano de cartas" },
              bodyHtml: { en: "<p dir=\"auto\">Shows available cards and supports activating multiple effects before a shot.</p>", es: "<p dir=\"auto\">Muestra las cartas disponibles y permite activar varios efectos antes de un disparo.</p>" },
              badge: { en: "01", es: "01" },
              icon: asset("Claws/claws-si-ui-hand.svg"),
              order: 1,
            },
            {
              id: "eLAXJfgVL",
              displayTitle: { en: "02 · Shot Feedback", es: "02 · Feedback del tiro" },
              bodyHtml: { en: "<p dir=\"auto\">Trajectory lines, ghost-ball prediction, target markers, and power visualization support shot planning.</p>", es: "<p dir=\"auto\">Las líneas de trayectoria, la predicción de bola fantasma, los marcadores de objetivo y la visualización de potencia apoyan la planificación del tiro.</p>" },
              badge: { en: "02", es: "02" },
              icon: asset("Claws/claws-si-ui-shot.svg"),
              order: 2,
            },
            {
              id: "OQow04KZn",
              displayTitle: { en: "03 · Run HUD", es: "03 · HUD de la partida" },
              bodyHtml: { en: "<p dir=\"auto\">Displays score, lives, table progression, rewards, and active gameplay states.</p>", es: "<p dir=\"auto\">Muestra la puntuación, las vidas, el progreso de la mesa, las recompensas y los estados de juego activos.</p>" },
              badge: { en: "03", es: "03" },
              icon: asset("Claws/claws-si-ui-hud.svg"),
              order: 3,
            },
            {
              id: "aPAq6JJI6",
              displayTitle: { en: "04 · Deck Management", es: "04 · Gestión del mazo" },
              bodyHtml: { en: "<p dir=\"auto\">Allows players to review their deck, card upgrades, passive effects, and available cards between runs.</p>", es: "<p dir=\"auto\">Permite a los jugadores revisar su mazo, mejoras de cartas, efectos pasivos y cartas disponibles entre partidas.</p>" },
              badge: { en: "04", es: "04" },
              icon: asset("Claws/claws-si-ui-deck.svg"),
              order: 4,
            },
          ],
        },
      ],
      order: 3,
    },
  },
  "goblin-td": {
    brief: {
      id: "GA_A97RkC",
      title: { en: "Goblin TD - Brief", es: "Goblin TD - Resumen" },
      displayTitle: { en: "Project Brief", es: "Ficha del Proyecto" },
      bodyHtml: { en: "<p dir=\"auto\">Goblin TD is a tower defense game centered on managing goblin workers who gather resources, build structures, and defend the village. Players alternate between build and defense phases, using upgrades and assignments to prepare for each wave. The goal is to survive five waves while protecting the central crystal.</p>", es: "<p dir=\"auto\">Goblin TD es un juego de defensa de torres centrado en la gestión de trabajadores goblins que recolectan recursos, construyen estructuras y defienden la aldea. Los jugadores alternan entre fases de construcción y defensa, utilizando mejoras y asignaciones para prepararse para cada oleada. El objetivo es sobrevivir a cinco oleadas mientras se protege el cristal central.</p>" },
      bodyMobileHtml: { en: "<p dir=\"auto\">Goblin TD is a tower defense game where players manage goblin workers to gather, build, and defend. Upgrade your village, survive enemy waves, and protect the central crystal.</p>", es: "<p dir=\"auto\">Goblin TD es un juego de defensa de torres en el que los jugadores gestionan trabajadores goblins para recolectar, construir y defender. Mejora tu aldea, sobrevive a las oleadas de enemigos y protege el cristal central.</p>" },
      tags: { en: "PC Game, Tower Defense, Worker Management, Resource Management, Base Building, Stylized 3D", es: "Juego de PC, Defensa de Torres, Gestión de Trabajadores, Gestión de Recursos, Construcción de Bases, 3D Estilizado" },
      items: [
        {
          id: "v7uDoaolG",
          displayTitle: { en: "CORE IDEA", es: "IDEA CENTRAL" },
          bodyHtml: { en: "<p dir=\"auto\">Manage goblin workers, grow your economy, and prepare your defenses between enemy waves.</p>", es: "<p dir=\"auto\">Gestiona trabajadores goblins, haz crecer tu economía y prepara tus defensas entre las oleadas de enemigos.</p>" },
          order: 0,
        },
        {
          id: "eslSQJaTT",
          displayTitle: { en: "VISUAL DIRECTION", es: "DIRECCIÓN VISUAL" },
          bodyHtml: { en: "<p dir=\"auto\">A stylized low-poly fantasy aesthetic designed around clear silhouettes and readable gameplay.</p>", es: "<p dir=\"auto\">Una estética de fantasía estilizada de baja poligonalización diseñada en torno a siluetas claras y una jugabilidad legible.</p>" },
          order: 0,
        },
      ],
      video: asset("GoblinTD_Demo.mp4"),
      order: 0,
    },
    snapshot: {
      id: "p616KT9Bj",
      title: { en: "GoblinTD - Project Snapshot", es: "GoblinTD - Captura del proyecto" },
      displayTitle: { en: "Project Snapshot", es: "Resumen del proyecto" },
      items: [
        {
          id: "MzcAEaLqO",
          displayTitle: { en: "Concept", es: "Concepto" },
          bodyHtml: { en: "<p dir=\"auto\">A tower defense game built around active goblin workers who gather resources, construct buildings, and take defensive roles during enemy waves.</p>", es: "<p dir=\"auto\">Un juego de defensa de torres creado en torno a trabajadores goblin activos que recolectan recursos, construyen edificios y asumen roles defensivos durante las oleadas de enemigos.</p>" },
          order: 0,
        },
        {
          id: "ZVbvq63XV",
          displayTitle: { en: "Context", es: "Contexto" },
          bodyHtml: { en: "<p dir=\"auto\">Developed in Unity 6 by a four-person team at Universidad Europea de Madrid as a complete playable game project.</p>", es: "<p dir=\"auto\">Desarrollado en Unity 6 por un equipo de cuatro personas en la Universidad Europea de Madrid como un proyecto de juego jugable completo.</p>" },
          order: 0,
        },
        {
          id: "XDXAGE6KA",
          displayTitle: { en: "Contributions", es: "Contribuciones" },
          bodyHtml: { en: "<p dir=\"auto\">Worked on the <strong>grid-based building system</strong>, including placement variants and construction flow, as well as <strong>goblin movement and animation</strong>. I also designed and implemented key <strong>UI panels and gameplay interactions</strong>, helping connect the resource, building, and defense systems into a clear player experience.</p>", es: "<p dir=\"auto\">Trabajé en el <strong>sistema de construcción basado en cuadrícula</strong>, incluyendo las variantes de colocación y el flujo de construcción, así como en el <strong>movimiento y animación de los duendes</strong>. También diseñé e implementé paneles clave de la <strong>interfaz de usuario e interacciones de juego</strong>, ayudando a conectar los sistemas de recursos, construcción y defensa en una experiencia de juego clara.</p>" },
          order: 0,
        },
        {
          id: "kMnDoGGVZ",
          displayTitle: { en: "Output", es: "Salida" },
          bodyHtml: { en: "<p dir=\"auto\">A Windows and WebGL prototype with three playable levels, a complete build-to-defense gameplay loop, tech progression, resource management, and a modular C# architecture.</p>", es: "<p dir=\"auto\">Un prototipo para Windows y WebGL con tres niveles jugables, un bucle de juego completo de construcción y defensa, progresión tecnológica, gestión de recursos y una arquitectura modular en C#.</p>" },
          order: 0,
        },
      ],
      order: 1,
    },
    gameDesign: {
      id: "IzyBZF2NC",
      title: { en: "GoblinTD - Game Design", es: "GoblinTD - Diseño de juego" },
      displayTitle: { en: "Game Design", es: "Diseño de videojuegos" },
      bodyHtml: { en: "<p dir=\"auto\">Goblin TD was designed around a gameplay loop that connects <strong>resource management, worker assignment, base building, and tower defense</strong>. During the build phase, players gather resources, construct production and defensive structures, assign goblins to different tasks, and unlock upgrades through the tech tree.</p><p dir=\"auto\">Each decision prepares the village for the next enemy wave. The game flow was mapped to show how <strong>resource gathering, progression, and defense phases</strong> connect, while the core loop illustrates how players expand their economy and defenses to protect the central crystal.</p>", es: "<p dir=\"auto\">Goblin TD se diseñó en torno a un bucle de juego que conecta la <strong>gestión de recursos, la asignación de trabajadores, la construcción de bases y la defensa de torres</strong>. Durante la fase de construcción, los jugadores recolectan recursos, construyen estructuras de producción y defensivas, asignan goblins a diferentes tareas y desbloquean mejoras a través del árbol de tecnología.</p><p dir=\"auto\">Cada decisión prepara a la aldea para la siguiente oleada de enemigos. El flujo del juego se mapeó para mostrar cómo se conectan las fases de <strong>recolección de recursos, progresión y defensa</strong>, mientras que el bucle principal ilustra cómo los jugadores expanden su economía y defensas para proteger el cristal central.</p>" },
      bodyMobileHtml: { en: "<p dir=\"auto\">Goblin TD connects <strong>resource management, worker assignment, base building, and tower defense</strong>. Players gather resources, assign goblins, build defenses, and unlock upgrades between waves.</p><p dir=\"auto\">Each phase prepares the village for the next attack, creating a loop of <strong>economy, progression, and defense</strong> centered on protecting the crystal.</p>", es: "<p dir=\"auto\">Goblin TD conecta la <strong>gestión de recursos, la asignación de trabajadores, la construcción de bases y la defensa de torres</strong>. Los jugadores recolectan recursos, asignan goblins, construyen defensas y desbloquean mejoras entre oleadas.</p><p dir=\"auto\">Cada fase prepara a la aldea para el siguiente ataque, creando un ciclo de <strong>economía, progresión y defensa</strong> centrado en proteger el cristal.</p>" },
      diagram1: { en: "Start | Enter construction phase -> Build | Place structures on the grid -> Assign | Send goblins to mines, farms, towers, or construction -> Prepare | manage resources and research upgrades -> Defend | Survive the enemy wave -> Reward | Gain resources and progress -> Upgrade | Improve village systems and defenses -> Continue | Face the next wave", es: "Comenzar | Entrar en la fase de construcción -> Construir | Colocar estructuras en la cuadrícula -> Asignar | Enviar duendes a minas, granjas, torres o construcción -> Preparar | Gestionar recursos e investigar mejoras -> Defender | Sobrevivir a la oleada enemiga -> Recompensa | Obtener recursos y progresar -> Mejorar | Perfeccionar los sistemas y defensas de la aldea -> Continuar | Enfrentar la siguiente oleada" },
      diagram2: { en: "Action | Build structures and assign goblins -> Progression | Upgrade defenses, research tech, and survive stronger waves -> Reward | Earn gold, food, and wave progress", es: "Acción | Construir estructuras y asignar duendes -> Progresión | Mejorar defensas, investigar tecnología y sobrevivir a oleadas más fuertes -> Recompensa | Obtener oro, comida y progreso de oleada" },
      order: 2,
    },
    development: {
      id: "cZiQ5Jx8i",
      title: { en: "GoblinTD - Development", es: "GoblinTD - Desarrollo" },
      displayTitle: { en: "Development", es: "Desarrollo" },
      bodyHtml: { en: "<p dir=\"auto\">Development focused on connecting <strong>goblin workers, construction, resources, progression, and wave defense</strong> into a complete gameplay loop.</p>", es: "<p dir=\"auto\">El desarrollo se centró en conectar <strong>duendes trabajadores, construcción, recursos, progresión y defensa por oleadas</strong> en un ciclo de juego completo.</p>" },
      bodyMobileHtml: { en: "<p dir=\"auto\">Development focused on connecting <strong>goblin workers, construction, resources, progression, and wave defense</strong> into a complete gameplay loop.</p>", es: "<p dir=\"auto\">El desarrollo se centró en conectar <strong>duendes trabajadores, construcción, recursos, progresión y defensa por oleadas</strong> en un ciclo de juego completo.</p>" },
      subsections: [
        {
          id: "KO9BLYXge",
          displayTitle: { en: "Key Systems", es: "Sistemas clave" },
          items: [
            {
              id: "mSNHgqZhI",
              displayTitle: { en: "01 · Construction & Grid Placement", es: "01 · Construcción y colocación en la cuadrícula" },
              bodyHtml: { en: "<p dir=\"auto\">Players place structures on a validated grid, then assign a goblin to complete construction.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Grid validation, footprints, occupancy, worker assignment, and construction states.</p>", es: "<p dir=\"auto\">El jugador coloca estructuras en una cuadrícula validada y luego asigna un duende para completar la construcción.</p><p dir=\"auto\"><strong>Enfoque de la implementación</strong><br>Validación de la cuadrícula, huellas, ocupación, asignación de trabajadores y estados de construcción.</p>" },
              badge: { en: "01", es: "01" },
              icon: asset("GoblinTD/GoblinTd_StructurePlacement.png"),
              order: 1,
            },
            {
              id: "Wk9mx9_Pf",
              displayTitle: { en: "02 · Goblin Task Assignment", es: "02 · Asignación de tareas a los duendes" },
              bodyHtml: { en: "<p dir=\"auto\">Goblins move through the world and can be assigned to <strong>build, mine, farm, or defend</strong>.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Worker availability, movement, task states, and role transitions.</p>", es: "<p dir=\"auto\">Los duendes se desplazan por el mundo y pueden asignarse a <strong>construir, minar, cultivar o defender</strong>.</p><p dir=\"auto\"><strong>Enfoque de la implementación</strong><br>Disponibilidad de trabajadores, desplazamiento, estados de tarea y transiciones de rol.</p>" },
              badge: { en: "02", es: "02" },
              icon: asset("GoblinTD/GoblinTd_GoblinAssign.png"),
              order: 2,
            },
            {
              id: "goblin-resource-production",
              displayTitle: { en: "03 · Resources & Production", es: "03 · Recursos y producción" },
              bodyHtml: { en: "<p dir=\"auto\">Mines and farms produce resources through active workers, while different minerals introduce progression through their <strong>availability and hardness</strong>.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Worker slots, production, resource tiers, and mineral requirements.</p>", es: "<p dir=\"auto\">Las minas y las granjas producen recursos gracias a los trabajadores activos, mientras que los distintos minerales aportan progresión a través de su <strong>disponibilidad y dureza</strong>.</p><p dir=\"auto\"><strong>Enfoque de la implementación</strong><br>Puestos de trabajo, producción, niveles de recurso y requisitos de mineral.</p>" },
              badge: { en: "03", es: "03" },
              icon: asset("GoblinTD/GoblinTd_Construction.png"),
              order: 3,
            },
            {
              id: "goblin-tech-tree",
              displayTitle: { en: "04 · Tech Tree & Progression", es: "04 · Árbol tecnológico y progresión" },
              bodyHtml: { en: "<p dir=\"auto\">Resources are invested into a tech tree that unlocks <strong>better production, materials, and defenses</strong>.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Node dependencies, costs, unlock states, and gameplay upgrades.</p>", es: "<p dir=\"auto\">Los recursos se invierten en un árbol tecnológico que desbloquea <strong>mejor producción, materiales y defensas</strong>.</p><p dir=\"auto\"><strong>Enfoque de la implementación</strong><br>Dependencias entre nodos, costes, estados de desbloqueo y mejoras de juego.</p>" },
              badge: { en: "04", es: "04" },
              icon: asset("GoblinTD/GoblinTd_TechTree_02.png"),
              order: 4,
            },
            {
              id: "goblin-wave-defense",
              displayTitle: { en: "05 · Wave & Defense System", es: "05 · Sistema de oleadas y defensa" },
              bodyHtml: { en: "<p dir=\"auto\">During attack phases, assigned goblins defend the crystal against enemy waves before the game returns to preparation.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Wave spawning, phase states, enemy behavior, defense assignments, and win conditions.</p>", es: "<p dir=\"auto\">Durante las fases de ataque, los duendes asignados defienden el cristal de las oleadas enemigas antes de que el juego vuelva a la preparación.</p><p dir=\"auto\"><strong>Enfoque de la implementación</strong><br>Generación de oleadas, estados de fase, comportamiento enemigo, asignaciones defensivas y condiciones de victoria.</p>" },
              badge: { en: "05", es: "05" },
              icon: asset("GoblinTD/GoblinTd_Waves_02.png"),
              order: 5,
            },
            {
              id: "goblin-enemy-progression",
              displayTitle: { en: "06 · Difficulty Progression", es: "06 · Progresión de la dificultad" },
              bodyHtml: { en: "<p dir=\"auto\">Stronger enemies increase the need for <strong>better resources, technology, and defensive structures</strong> as the game progresses.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Enemy scaling, resource progression, defensive requirements, and balance.</p>", es: "<p dir=\"auto\">Enemigos más fuertes aumentan la necesidad de <strong>mejores recursos, tecnología y estructuras defensivas</strong> a medida que avanza el juego.</p><p dir=\"auto\"><strong>Enfoque de la implementación</strong><br>Escalado de enemigos, progresión de recursos, requisitos defensivos y equilibrio.</p>" },
              badge: { en: "06", es: "06" },
              icon: asset("GoblinTD/GoblinTd_GolemnInfo.png"),
              order: 6,
            },
          ],
          diagram1: { en: "Select Structure -> Validate Footprint -> Assign Goblin -> Build Structure -> Activate Building -> Update UI", es: "Seleccionar estructura -> Validar huella -> Asignar duende -> Construir estructura -> Activar edificio -> Actualizar interfaz" },
        },
        {
          id: "goblin-levels",
          items: [
            {
              id: "goblin-three-levels",
              displayTitle: { en: "07 · Three-Level Structure", es: "07 · Estructura en tres niveles" },
              bodyHtml: { en: "<p dir=\"auto\">The prototype contains <strong>three levels</strong>, each increasing the pressure and complexity of resource management, progression, and defense.</p><p dir=\"auto\"><strong>Implementation focus</strong><br>Level configuration, enemy progression, available upgrades, and difficulty scaling.</p>", es: "<p dir=\"auto\">El prototipo incluye <strong>tres niveles</strong>, cada uno con mayor presión y complejidad en la gestión de recursos, la progresión y la defensa.</p><p dir=\"auto\"><strong>Enfoque de la implementación</strong><br>Configuración de niveles, progresión de enemigos, mejoras disponibles y escalado de dificultad.</p>" },
              badge: { en: "07", es: "07" },
              icon: asset("si-goblin-level3.jpg"),
              order: 7,
            },
          ],
          diagram1: { en: "Level 1 | 3 waves · Stone golems · 9 techs -> Level 2 | 6 waves · Copper and Iron · 13 techs -> Level 3 | 9 waves · up to Diamond · 18 techs", es: "Nivel 1 | 3 oleadas · gólems de piedra · 9 tecnologías -> Nivel 2 | 6 oleadas · cobre y hierro · 13 tecnologías -> Nivel 3 | 9 oleadas · hasta diamante · 18 tecnologías" },
        },
      ],
      order: 2,
    },
  },
  "pawtchi": {
    brief: {
      id: "w00AL_cBC",
      title: { en: "Pawtchi - Brief", es: "Pawtchi - Resumen" },
      displayTitle: { en: "Project Brief", es: "Informe del proyecto" },
      bodyHtml: { en: "<p dir=\"auto\">Pawstchi is a casual mobile game centered around caring for and evolving a virtual robot cat.</p>", es: "<p dir=\"auto\">Pawstchi es un juego móvil casual centrado en cuidar y hacer evolucionar a un gato robot virtual.</p>" },
      bodyMobileHtml: { en: "<p dir=\"auto\">Pawstchi is a casual mobile game centered around caring for and evolving a virtual robot cat.</p>", es: "<p dir=\"auto\">Pawstchi es un juego móvil casual centrado en el cuidado y la evolución de un gato robot virtual.</p>" },
      tags: { en: "Mobile Game, Cozy Game, Virtual Pet, Life/Pet Sims, Match-3, Pixel Art", es: "Juego móvil, juego acogedor, mascota virtual, simuladores de vida/mascotas, combina 3, pixel art" },
      items: [
        {
          id: "YrVWpgn7J",
          displayTitle: { en: "INSPIRATION", es: "INSPIRACIÓN" },
          bodyHtml: { en: "<p dir=\"auto\">Inspired by Tamagotchi and <a href=\"https://www.theoldrobots.com/MeowChi.html\" target=\"_blank\"><strong>Meow-Chi</strong></a> robotic toys.</p>", es: "<p dir=\"auto\">Inspirado por Tamagotchi y los juguetes robóticos <a href=\"https://www.theoldrobots.com/MeowChi.html\" target=\"_blank\"><strong>Meow-Chi</strong></a>.</p>" },
          order: 0,
        },
        {
          id: "GJUmEG2Yv",
          displayTitle: { en: "VISUAL DIRECTION", es: "DIRECCIÓN VISUAL" },
          bodyHtml: { en: "<p dir=\"auto\">A soft Y2K-inspired style built around pixel art and pastel colors.</p>", es: "<p dir=\"auto\">Un estilo suave inspirado en el año 2000 (Y2K) creado en torno al arte de píxeles y los colores pastel.</p>" },
          order: 0,
        },
      ],
      video: asset("video-pawtchi-brief.mp4"),
      order: 0,
    },
    snapshot: {
      id: "kYXk3DiBK",
      title: { en: "Pawtchi - Project Snapshot", es: "Pawtchi - Instantánea del proyecto" },
      displayTitle: { en: "Project Snapshot", es: "Resumen del proyecto" },
      items: [
        {
          id: "SKvQgSsap",
          displayTitle: { en: "Concept", es: "Concepto" },
          bodyHtml: { en: "<p dir=\"auto\">Hybrid casual mobile game combining puzzle levels, resource rewards, and virtual pet care.</p>", es: "<p dir=\"auto\">Juego móvil casual híbrido que combina niveles de rompecabezas, recompensas de recursos y el cuidado de mascotas virtuales.</p>" },
          order: 0,
        },
        {
          id: "PbGvYzO6I",
          displayTitle: { en: "Player Goal", es: "Objetivo del jugador" },
          bodyHtml: { en: "<p dir=\"auto\">Complete puzzle levels to earn hearts and gems, then use them to care for, evolve, and customize Pawstchi.</p>", es: "<p dir=\"auto\">Completa niveles de rompecabezas para ganar corazones y gemas, y luego úsalos para cuidar, evolucionar y personalizar a Pawstchi.</p>" },
          order: 0,
        },
        {
          id: "qo1YkIArP",
          displayTitle: { en: "Contributions", es: "Contribuciones" },
          bodyHtml: { en: "<p dir=\"auto\">Designed the core loop, UI flow, visual identity, onboarding, accessibility rules, and monetization model.</p>", es: "<p dir=\"auto\">Diseñó el bucle central, el flujo de la interfaz de usuario, la identidad visual, el proceso de incorporación, las reglas de accesibilidad y el modelo de monetización.</p>" },
          order: 0,
        },
        {
          id: "zojs9T9BA",
          displayTitle: { en: "Output", es: "Resultado" },
          bodyHtml: { en: "<p dir=\"auto\">Full UX dossier, Figma screens, Unity prototype, and academic presentation.</p>", es: "<p dir=\"auto\">Dossier UX completo, pantallas de Figma, prototipo de Unity y presentación académica.</p>" },
          order: 0,
        },
      ],
      order: 1,
    },
    gameDesign: {
      id: "pHQjUOobl",
      title: { en: "Pawtchi - Game Design", es: "Pawtchi - Diseño de juegos" },
      displayTitle: { en: "Game   Design", es: "Diseño de videojuegos" },
      bodyHtml: { en: "<p dir=\"auto\">Pawstchi was designed around a simple progression loop that connects <strong>pet care, customization, and casual gameplay</strong>. Players complete activities to earn resources, then use them to care for their Pawstchi, unlock new options, and support its evolution.</p><p dir=\"auto\">The game flow was mapped to define how these systems connect, from the main pet screen to activities, rewards, customization, and progression. The diagrams below show the <strong>core gameplay loop</strong> and the <strong>main navigation flow</strong> used to structure the experience.</p>", es: "<p dir=\"auto\">Pawstchi fue diseñado en torno a un bucle de progresión simple que conecta el <strong>cuidado de la mascota, la personalización y el juego casual</strong>. Los jugadores completan actividades para ganar recursos y luego los usan para cuidar a su Pawstchi, desbloquear nuevas opciones y apoyar su evolución.</p><p dir=\"auto\">El flujo del juego se mapeó para definir cómo se conectan estos sistemas, desde la pantalla principal de la mascota hasta las actividades, las recompensas, la personalización y la progresión. Los diagramas a continuación muestran el <strong>bucle de juego principal</strong> y el <strong>flujo de navegación principal</strong> utilizados para estructurar la experiencia.</p>" },
      bodyMobileHtml: { en: "<p dir=\"auto\">Pawstchi was designed around a simple progression loop that connects <strong>pet care, customization, and casual gameplay</strong>. Players complete activities to earn resources, then use them to care for their Pawstchi, unlock new options, and support its evolution.</p><p dir=\"auto\">The game flow was mapped to define how these systems connect, from the main pet screen to activities, rewards, customization, and progression. The diagrams below show the <strong>core gameplay loop</strong> and the <strong>main navigation flow</strong> used to structure the experience.</p>", es: "<p dir=\"auto\">Pawstchi se diseñó en torno a un bucle de progresión simple que conecta el <strong>cuidado de mascotas, la personalización y la jugabilidad casual</strong>. Los jugadores completan actividades para ganar recursos, que luego utilizan para cuidar a su Pawstchi, desbloquear nuevas opciones y apoyar su evolución.</p><p dir=\"auto\">El flujo del juego se mapeó para definir cómo se conectan estos sistemas, desde la pantalla principal de la mascota hasta las actividades, las recompensas, la personalización y la progresión. Los siguientes diagramas muestran el <strong>bucle de juego principal</strong> y el <strong>flujo de navegación principal</strong> utilizados para estructurar la experiencia.</p>" },
      diagram1: { en: "Start | open the app -> Onboard | choose and name Pawstchi -> Home | check status and resources -> Play | enter a puzzle level -> Solve | complete the match-3 grid -> Reward | earn hearts and gems -> Care | feed, wash, pet, or play -> Progress | evolve, customize, and continue", es: "Inicio | abre la aplicación -> Incorporación | elige y nombra a tu Pawstchi -> Inicio | consulta el estado y los recursos -> Juego | entra a un nivel de rompecabezas -> Resolver | completa la cuadrícula de conecta 3 -> Recompensa | gana corazones y gemas -> Cuidado | alimenta, baña, acaricia o juega -> Progreso | evoluciona, personaliza y continúa" },
      diagram2: { en: "Action | play match-3 levels -> Reward | earn hearts & gems -> Progression | care for, evolve, and customize Pawstchi", es: "Acción | juega niveles de combina 3 -> Recompensa | gana corazones y gemas -> Progresión | cuida, evoluciona y personaliza a tu Pawstchi" },
      order: 2,
    },
    ui: {
      id: "LMbCbB1Nh",
      title: { en: "Pawtchi - UI Design", es: "Pawtchi - Diseño de interfaz de usuario" },
      displayTitle: { en: "UI Design", es: "Diseño de interfaz de usuario" },
      bodyHtml: { en: "<p dir=\"auto\">The interface and visual assets for <strong>Pawstchi</strong> were designed and assembled in <strong>Figma</strong>, with a focus on keeping a consistent visual language across the game.</p><p dir=\"auto\">The cat assets were originally created in <strong>Procreate</strong> and later refined in Figma. Some decorative elements and consumables were adapted from the <a href=\"https://toffeecraft.itch.io/pet-virtual-mobile-pixel-asset\">Pet Virtual Mobile Pixel Asset</a> pack, while several UI elements were based on and modified from the <a href=\"https://cupnooble.itch.io/sprout-lands-ui-pack\">Sprout Lands UI Pack</a>.</p><p dir=\"auto\">All remaining assets were created from scratch in Figma. Existing assets were also edited in color, shape, and detail to create a more cohesive look and match the game’s pastel Y2K and retro pixel aesthetic.</p><p dir=\"auto\">The final interface was then organized and prototyped in <strong>Figma Prototype</strong>, defining the main navigation, interactions, and screen flow.</p>", es: "<p dir=\"auto\">La interfaz y los recursos visuales de <strong>Pawstchi</strong> se diseñaron y ensamblaron en <strong>Figma</strong>, con un enfoque en mantener un lenguaje visual coherente en todo el juego.</p><p dir=\"auto\">Los recursos de los gatos se crearon originalmente en <strong>Procreate</strong> y luego se perfeccionaron en Figma. Algunos elementos decorativos y consumibles se adaptaron del paquete <a href=\"https://toffeecraft.itch.io/pet-virtual-mobile-pixel-asset\">Pet Virtual Mobile Pixel Asset</a>, mientras que varios elementos de la interfaz de usuario se basaron y modificaron a partir del <a href=\"https://cupnooble.itch.io/sprout-lands-ui-pack\">Sprout Lands UI Pack</a>.</p><p dir=\"auto\">Todos los recursos restantes se crearon desde cero en Figma. Los recursos existentes también se editaron en color, forma y detalle para crear una apariencia más cohesiva y coincidir con la estética pastel Y2K y pixel retro del juego.</p><p dir=\"auto\">Luego, la interfaz final se organizó y se prototipó en <strong>Figma Prototype</strong>, definiendo la navegación principal, las interacciones y el flujo de pantallas.</p>" },
      bodyMobileHtml: { en: "<p dir=\"auto\">The UI and visual assets for <strong>Pawstchi</strong> were created and refined in <strong>Figma</strong>. The cat assets were originally drawn in <strong>Procreate</strong> and later edited in Figma.</p><p dir=\"auto\">Some decorative elements and consumables were adapted from the <a href=\"https://toffeecraft.itch.io/pet-virtual-mobile-pixel-asset\">Pet Virtual Mobile Pixel Asset</a> pack, while several UI elements were based on the <a href=\"https://cupnooble.itch.io/sprout-lands-ui-pack\">Sprout Lands UI Pack</a>.</p><p dir=\"auto\">All remaining assets were created from scratch in Figma. Both original and adapted assets were edited in color, shape, and detail to keep the interface cohesive and consistent with the game’s pastel Y2K retro-pixel aesthetic. The final screens, navigation, and interactions were then organized and prototyped in <strong>Figma Prototype</strong>.</p>", es: "<p dir=\"auto\">La interfaz de usuario y los elementos visuales de <strong>Pawstchi</strong> se crearon y perfeccionaron en <strong>Figma</strong>. Los recursos de los gatos se dibujaron originalmente en <strong>Procreate</strong> y luego se editaron en Figma.</p><p dir=\"auto\">Algunos elementos decorativos y consumibles se adaptaron del paquete <a href=\"https://toffeecraft.itch.io/pet-virtual-mobile-pixel-asset\">Pet Virtual Mobile Pixel Asset</a>, mientras que varios elementos de la interfaz de usuario se basaron en el <a href=\"https://cupnooble.itch.io/sprout-lands-ui-pack\">Sprout Lands UI Pack</a>.</p><p dir=\"auto\">Todos los recursos restantes se crearon desde cero en Figma. Tanto los recursos originales como los adaptados se editaron en color, forma y detalle para mantener la interfaz cohesiva y coherente con la estética retro-píxel pastel Y2K del juego. Las pantallas finales, la navegación y las interacciones se organizaron y prototiparon posteriormente en <strong>Figma Prototype</strong>.</p>" },
      galleryItems: [
        {
          id: "W1__nXUgF",
          title: { en: "Splash Screen", es: "Pantalla de inicio" },
          image: asset("gallery-pawstch-splash.png"),
        },
        {
          id: "NseTZtGXl",
          title: { en: "Store Screen", es: "Pantalla de la tienda" },
          image: asset("gallery-store-screen.png"),
        },
        {
          id: "GxrbQXiMu",
          title: { en: "Sttings Screen", es: "Pantalla de Ajustes" },
          image: asset("gallery-sttings-screen.png"),
        },
        {
          id: "m4ZCRdOUV",
          title: { en: "Shoop Screen", es: "Pantalla de Shoop" },
          image: asset("gallery-shoop-screen.png"),
        },
        {
          id: "yVU1bcR7E",
          title: { en: "Care Screen", es: "Pantalla de atención" },
          image: asset("gallery-care-screen.png"),
        },
        {
          id: "ZZkpEcLOm",
          title: { en: "Puzzle Screen", es: "Pantalla de rompecabezas" },
          image: asset("gallery-puzzle-screen.png"),
        },
        {
          id: "xmIO8J61p",
          title: { en: "Home Screen", es: "Pantalla de inicio" },
          image: asset("gallery-home-screen.png"),
        },
        {
          id: "CsrRaqTpx",
          title: { en: "Confirm Screen", es: "Pantalla de confirmación" },
          image: asset("gallery-confirm-screen.png"),
        },
        {
          id: "U_MIJJCYd",
          title: { en: "Name Pawstchi Screen", es: "Pantalla de Nombre de Pawstchi" },
          image: asset("gallery-name-pawstchi-screen.png"),
        },
        {
          id: "G60lWKzbi",
          title: { en: "Choose Pawstchi Screen", es: "Elegir la pantalla de Pawstchi" },
          image: asset("gallery-pawstch-choose.png"),
        },
      ],
      order: 3,
    },
  },
  "matcha-puzzle": {
    snapshot: {
      id: "ICLwpFKof",
      title: { en: "MatchaPuzzle - Project Snapshot", es: "MatchaPuzzle - Instantánea del proyecto" },
      displayTitle: { en: "Project Snapshot", es: "Perspectiva General del Proyecto" },
      items: [
        {
          id: "tLUNGIAhV",
          displayTitle: { en: "Concept", es: "Concepto" },
          subtitle: { en: "Cozy 3D puzzle level", es: "Acogedor nivel de rompecabezas en 3D" },
          bodyHtml: { en: "<p dir=\"auto\">A single-level puzzle game where the player prepares matcha by understanding the correct sequence of buttons, levers, platforms, and routes.</p>", es: "<p dir=\"auto\">Un juego de rompecabezas de un solo nivel donde el jugador prepara matcha comprendiendo la secuencia correcta de botones, palancas, plataformas y rutas.</p>" },
          order: 0,
        },
        {
          id: "sxKaYxHus",
          displayTitle: { en: "Context", es: "Contexto" },
          subtitle: { en: "Solo academic project", es: "Proyecto académico individual" },
          bodyHtml: { en: "<p dir=\"auto\">Designed and built as a level design project at Universidad Europea de Madrid.</p>", es: "<p dir=\"auto\">Diseñado y construido como un proyecto de diseño de niveles en la Universidad Europea de Madrid.</p>" },
          order: 0,
        },
        {
          id: "TzaHDzgFt",
          displayTitle: { en: "My Focus", es: "Mi enfoque" },
          subtitle: { en: "Level design and interaction flow", es: "Diseño de niveles y flujo de interacción" },
          bodyHtml: { en: "<p dir=\"auto\">Focused on spatial readability, route planning, puzzle sequencing, and no-failure-state design.</p>", es: "<p dir=\"auto\">Centrado en la legibilidad espacial, la planificación de rutas, la secuenciación de rompecabezas y un diseño sin estados de falla.</p>" },
          order: 0,
        },
        {
          id: "Ce4u_VFKZ",
          displayTitle: { en: "Output", es: "Salida" },
          subtitle: { en: "Unreal Engine prototype", es: "Prototipo de Unreal Engine" },
          bodyHtml: { en: "<p dir=\"auto\">Playable Unreal Engine 5.7 level with a multi-tier layout, interactive props, moving platforms, and a complete matcha preparation sequence.</p>", es: "<p dir=\"auto\">Nivel jugable de Unreal Engine 5.7 con un diseño de varios niveles, accesorios interactivos, plataformas móviles y una secuencia completa de preparación de matcha.</p>" },
          order: 0,
        },
      ],
      order: 1,
    },
    gameDesign: {
      id: "AglfalWVe",
      title: { en: "Matcha Pzzle- Core Game Loop", es: "Rompecabezas de Matcha - Bucle de Juego Principal" },
      displayTitle: { en: "Core Loop + Game Flow", es: "Bucle central y flujo del juego" },
      bodyHtml: { en: "<p dir=\"auto\"><br class=\"trailing-break\"></p>", es: "<p dir=\"auto\"><br class=\"trailing-break\"></p>" },
      diagram1: { en: "Start | read the matcha recipe -> Activate | use the first buttons and joystick -> Pour | move the matcha into the bowl -> Branch | open routes with the blue door system -> Explore | reach the whisk, cup, and underground route -> Reconfigure | raise the kettle and invert doors -> Finish | pour water and complete the bowl sequence -> End | serve the matcha into the cup", es: "Inicio | lee la receta de matcha -> Activar | usa los primeros botones y el joystick -> Verter | mueve el matcha al tazón -> Ramificar | abre caminos con el sistema de puertas azules -> Explorar | llega al batidor, la taza y la ruta subterránea -> Reconfigurar | eleva la tetera e invierte las puertas -> Finalizar | vierte agua y completa la secuencia del tazón -> Fin | sirve el matcha en la taza" },
      diagram2: { en: "Explore | read the space and identify possible routes -> Reconfigure | activate buttons, levers, and moving platforms -> Progress | unlock the next step of the matcha recipe", es: "Explorar | leer el espacio e identificar posibles rutas -> Reconfigurar | activar botones, palancas y plataformas móviles -> Progresar | desbloquear el siguiente paso de la receta de matcha" },
      order: 2,
    },
  },
}
