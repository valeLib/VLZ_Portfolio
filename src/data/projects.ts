// Projects — ported from the Framer "Projects" CMS collection (E2LL5RnrG).
// Full case-study HTML lives in ./content/<slug>.html (imported raw).

import pawstchiContent from "./content/pawstchi.html?raw"
import goblinContent from "./content/goblin-td.html?raw"
import matchaContent from "./content/matcha-puzzle.html?raw"

export const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`

export type Project = {
  id: string
  slug: string
  title: string
  year: string
  tracks: string
  tagline: string
  context: string
  stack: string
  role: string
  status: string
  color: string
  cover: string | null
  overviewHtml: string
  contentHtml: string
}

export const projects: Project[] = [
  {
    id: "kAQYWfo_i",
    slug: "pawstchi",
    title: "Pawstchi",
    year: "2026",
    tracks: "Game, Unity, UX, UI",
    tagline:
      "Hybrid casual mobile game combining match-3 puzzles with a virtual pixel-art robot cat.",
    context: "Academic UX project, Universidad Europea de Madrid, 2025–26",
    stack: "Unity, Figma, Pixel Art, UX Research",
    role: "UX Designer, Game Designer, Unity Developer",
    status: "Academic project",
    color: "rgb(238, 151, 142)",
    cover: asset("pawstchi-cover.png"),
    overviewHtml:
      "<p><strong>Pawstchi</strong> is a hybrid casual mobile game that blends <em>match-3</em> puzzles with virtual pet care. Players solve paw-print puzzle levels to earn resources, which they can use to feed, evolve, and customize a pixel art robot cat. The project was developed for the <em>Diseño de UX e Interfaces</em> course at Universidad Europea de Madrid, with a focus on how visual style can support the player experience.</p><p>Pawstchi explores how a soft retro aesthetic, built with pixel art and a pastel palette, can make the game feel more approachable, reduce visual complexity, and help players form an emotional bond with the pet.</p>",
    contentHtml: pawstchiContent,
  },
  {
    id: "dmMjfq9Y8",
    slug: "goblin-td",
    title: "Goblin TD",
    year: "2026",
    tracks: "Game",
    tagline:
      "Tower defense game where goblin workers physically move, build, mine, and fight.",
    context: "Academic group project, Universidad Europea de Madrid, 2025–26",
    stack: "Unity 6, C#, URP, GitLab",
    role: "Game Developer, Systems Developer",
    status: "Playable prototype",
    color: "rgb(250, 186, 50)",
    cover: null,
    overviewHtml:
      "<p>Goblin TD is a tower defense game with a goblin worker management layer. Instead of passive automated towers, the player manages a living village of goblin workers who physically move through the world, construct structures, mine resources, and staff defense positions as stationed archers.</p><p>The game alternates between two phases: a <strong>build phase</strong> (construct structures, assign goblins, research technologies) and a <strong>defense phase</strong> (survive enemy waves). Victory requires surviving five waves without losing the central crystal.</p>",
    contentHtml: goblinContent,
  },
  {
    id: "uCB9APRyr",
    slug: "matcha-puzzle",
    title: "Matcha Puzzle",
    year: "2026",
    tracks: "Game",
    tagline: "Cozy Unreal Engine puzzle level about preparing a cup of matcha.",
    context: "Academic level design project, Universidad Europea de Madrid, 2025–26",
    stack: "Unreal Engine 5.7, Level Design, Interaction Design, Cozy Game Design",
    role: "Level Designer, Game Designer",
    status: "Academic project",
    color: "rgb(139, 217, 195)",
    cover: null,
    overviewHtml:
      "<p>Matcha Puzzle is a single-level 3D puzzle game built around one concept: the player prepares a cup of matcha tea by navigating a multi-tiered isometric environment and activating interactive elements in the correct sequence. No combat, no time pressure, no punishing failure states. The experience rewards observation, spatial reasoning, and patient exploration.</p>",
    contentHtml: matchaContent,
  },
]

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug)
