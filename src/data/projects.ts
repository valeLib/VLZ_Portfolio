// Project catalogue. Every user-facing string is localized: { en, es }.
// Draft projects stay in the data but must never reach a public surface — use
// publicProjects / isPublicProject, never the raw array, for anything rendered.

import type { L10n } from "../lib/i18n"

export const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`

export type Project = {
  id: string
  slug: string
  draft: boolean
  title: L10n
  year?: L10n
  tracks?: L10n
  tagline?: L10n
  context?: L10n
  stack?: L10n
  tags?: L10n
  bodyHtml?: L10n
  role?: L10n
  status?: string
  featured: boolean
  color: string
  colorName?: string
  cover: string | null
}

// Catalogue order — prev/next navigation follows this order.
export const projects: Project[] = [
  {
    id: "rWjfQAj5v",
    slug: "claws-and-cue-balls",
    draft: false,
    title: { en: "Claws & Cue Balls", es: "Garras y bolas de billar" },
    year: { en: "2026", es: "2026" },
    tagline: { en: "A physics-based billiards roguelite where cards reshape every shot.", es: "Un roguelite de billar basado en la física donde las cartas transforman cada tiro." },
    context: { en: "Playable game prototype developed in Unreal Engine 5.", es: "Prototipo de juego jugable desarrollado en Unreal Engine 5." },
    tags: { en: "PC Game, Billiards, Roguelite, Card-Based, Physics, Stylized 3D", es: "Juego de PC, Billar, Roguelite, Basado en cartas, Física, 3D estilizado" },
    status: "Academic project",
    featured: true,
    color: "rgb(212, 223, 104)",
    colorName: "Straw",
    cover: asset("claws-cover.png"),
  },
  {
    id: "dmMjfq9Y8",
    slug: "goblin-td",
    draft: false,
    title: { en: "Goblin TD", es: "TD de duendes" },
    year: { en: "2026", es: "2026" },
    tagline: { en: "A resource-driven tower defense where goblins gather, build, and protect the crystal.", es: "Un juego de defensa de torres impulsado por recursos donde los duendes recolectan, construyen y protegen el cristal." },
    context: { en: "Academic group project, Universidad Europea de Madrid, 2025–26", es: "Proyecto académico en grupo, Universidad Europea de Madrid, 2025–26" },
    stack: { en: "Game Design, UI/UX Design, Unity 6, C#, URP", es: "Diseño de videojuegos, Diseño de UI/UX, Unity 6, C#, URP" },
    tags: { en: "Game Design, UI/UX Design, Unity 6, C#, URP", es: "Diseño de juegos, Diseño de UI/UX, Unity 6, C#, URP" },
    bodyHtml: { en: "<p dir=\"auto\">Goblin TD is a tower defense game with a goblin worker management layer. Instead of passive automated towers, the player manages a living village of goblin workers who physically move through the world, construct structures, mine resources, and staff defense positions as stationed archers.</p><p dir=\"auto\">The game alternates between two phases: a <strong>build phase</strong> (construct structures, assign goblins, research technologies) and a <strong>defense phase</strong> (survive enemy waves). Victory requires surviving five waves without losing the central crystal.</p>", es: "<p dir=\"auto\">Goblin TD es un juego de defensa de torres con una capa de gestión de trabajadores goblin. En lugar de torres automatizadas pasivas, el jugador gestiona una aldea viva de trabajadores goblin que se mueven físicamente por el mundo, construyen estructuras, extraen recursos y ocupan posiciones defensivas como arqueros apostados.</p><p dir=\"auto\">El juego alterna entre dos fases: una <strong>fase de construcción</strong> (construir estructuras, asignar goblins, investigar tecnologías) y una <strong>fase de defensa</strong> (sobrevivir a las oleadas enemigas). La victoria requiere sobrevivir a cinco oleadas sin perder el cristal central.</p>" },
    role: { en: "Game Developer, Systems Developer", es: "Desarrollador de videojuegos, desarrollador de sistemas" },
    status: "Playable prototype",
    featured: true,
    color: "rgb(250, 186, 50)",
    colorName: "Saffron",
    cover: asset("goblin-td-cover.png"),
  },
  {
    id: "kAQYWfo_i",
    slug: "pawtchi",
    draft: true,
    title: { en: "Pawtchi", es: "Pawtchi" },
    year: { en: "2026", es: "2026" },
    tagline: { en: "A casual game about raising a virtual robot cat.", es: "Un juego casual sobre criar a un gato robot virtual." },
    context: { en: "Academic Project, Universidad Europea de Madrid, 2025–26", es: "Proyecto académico, Universidad Europea de Madrid, 2025–26" },
    stack: { en: "Game Design, UI/UX Design, Unity 6, C#, URP, Figma", es: "Diseño de videojuegos, Diseño de UI/UX, Unity 6, C#, URP, Figma" },
    tags: { en: "Game Design, UI/UX Design, Unity 6, C#, URP, Figma", es: "Diseño de juegos, Diseño de UI/UX, Unity 6, C#, URP, Figma" },
    bodyHtml: { en: "<p dir=\"auto\"><strong>Pawstchi</strong> is a hybrid casual mobile game that blends <em>match-3</em> puzzles with virtual pet care. Players solve paw-print puzzle levels to earn resources, which they can use to feed, evolve, and customize a pixel art robot cat.</p><p dir=\"auto\">The project was developed for the <em>Diseño de UX e Interfaces</em> course at Universidad Europea de Madrid. Its concept draws inspiration from nostalgic digital pets such as <strong>Tamagotchi</strong> and robotic toys like <a href=\"https://www.theoldrobots.com/MeowChi.html\" target=\"_blank\"><strong>Meow-Chi</strong></a>, combining virtual pet care with a casual puzzle loop.</p><p dir=\"auto\">Pawstchi explores how a soft retro aesthetic, built with pixel art and a pastel palette, can make the game feel approachable, reduce visual complexity, and help players form an emotional bond with the pet.</p>", es: "<p dir=\"auto\"><strong>Pawstchi</strong> es un juego móvil casual híbrido que combina rompecabezas de <em>conecta 3</em> con el cuidado de una mascota virtual. Los jugadores resuelven niveles de rompecabezas de huellas para ganar recursos, los cuales pueden usar para alimentar, evolucionar y personalizar a un gato robot en estilo pixel art.</p><p dir=\"auto\">El proyecto fue desarrollado para la asignatura de <em>Diseño de UX e Interfaces</em> en la Universidad Europea de Madrid. Su concepto se inspira en mascotas digitales nostálgicas como <strong>Tamagotchi</strong> y juguetes robóticos como <a href=\"https://www.theoldrobots.com/MeowChi.html\" target=\"_blank\"><strong>Meow-Chi</strong></a>, combinando el cuidado de una mascota virtual con un bucle de juego de rompecabezas casual.</p><p dir=\"auto\">Pawstchi explora cómo una estética retro suave, construida con pixel art y una paleta de colores pastel, puede hacer que el juego se sienta accesible, reducir la complejidad visual y ayudar a los jugadores a formar un vínculo emocional con la mascota.</p>" },
    role: { en: "UX Designer, Game Designer, Unity Developer", es: "Diseñador de UX, Diseñador de videojuegos, Desarrollador de Unity" },
    status: "Academic project",
    featured: true,
    color: "rgb(238, 151, 142)",
    colorName: "Tangerine",
    cover: asset("pawtchi-cover.png"),
  },
  {
    id: "uCB9APRyr",
    slug: "matcha-puzzle",
    draft: true,
    title: { en: "Matcha Puzzle", es: "Rompecabezas de matcha" },
    year: { en: "2026", es: "2026" },
    tracks: { en: "Game", es: "Juego" },
    tagline: { en: "Cozy Unreal Engine puzzle level about preparing a cup of matcha.", es: "Acogedor nivel de rompecabezas de Unreal Engine sobre preparar una taza de matcha." },
    context: { en: "Academic level design project, Universidad Europea de Madrid, 2025–26", es: "Proyecto de diseño de nivel académico, Universidad Europea de Madrid, 2025–26" },
    stack: { en: "Unreal Engine 5.7, Level Design, Interaction Design, Cozy Game Design", es: "Unreal Engine 5.7, Diseño de niveles, diseño de interacción, diseño de juegos acogedores" },
    tags: { en: "Puzzle Design, Moving Platforms, Cozy Game Design, Solo Development", es: "Diseño de rompecabezas, plataformas móviles, diseño de juegos acogedores, desarrollo independiente" },
    bodyHtml: { en: "<p dir=\"auto\">Matcha Puzzle is a single-level 3D puzzle game built around one concept: the player prepares a cup of matcha tea by navigating a multi-tiered isometric environment and activating interactive elements in the correct sequence. No combat, no time pressure, no punishing failure states. The experience rewards observation, spatial reasoning, and patient exploration.</p>", es: "<p dir=\"auto\">Matcha Puzzle es un juego de puzles 3D de un solo nivel construido en torno a un solo concepto: el jugador prepara una taza de té matcha navegando por un entorno isométrico de varios niveles y activando elementos interactivos en la secuencia correcta. Sin combate, sin presión de tiempo ni estados de fallo punitivos. La experiencia recompensa la observación, el razonamiento espacial y la exploración paciente.</p>" },
    role: { en: "Level Designer, Game Designer", es: "Diseñador de niveles, diseñador de juegos" },
    status: "Academic project",
    featured: true,
    color: "rgb(139, 217, 195)",
    colorName: "Teal",
    cover: null,
  },
]

// Central visibility rule: draft items exist in the data but are never public.
export const isPublicProject = (p: Project) => !p.draft

export const publicProjects: Project[] = projects.filter(isPublicProject)

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug)

/** Detail routes use this: a draft project must behave like an unknown slug. */
export const getPublicProject = (slug?: string) =>
  publicProjects.find((p) => p.slug === slug)
