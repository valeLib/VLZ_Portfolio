// Project index: the fields shared by the home page grid and every detail hero.
// Detail-page body content lives in ./projectSections.ts, keyed by slug.

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
  tags: string
}

export const projects: Project[] = [
  {
    id: "kAQYWfo_i",
    slug: "pawtchi",
    title: "Pawtchi",
    year: "2026",
    tracks: "Game, Unity, UX, UI",
    tagline: "A casual game about raising a virtual robot cat.",
    context: "Academic Project, Universidad Europea de Madrid, 2025–26",
    stack: "Unity, Figma, Pixel Art, UX Research",
    role: "UX Designer, Game Designer, Unity Developer",
    status: "Academic project",
    color: "rgb(238, 151, 142)",
    cover: asset("pawtchi-cover.png"),
    tags: "UI/UX Design, Visual System Design, Accessibility, Game Design",
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
    tags: "UI/UX Design, Tower Defense, Team Collaboration",
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
    tags: "Puzzle Design, Moving Platforms, Cozy Game Design, Solo Development",
  },
  // Only title / year / colour are filled in: the case study is not written
  // yet, so this project's detail page renders the hero and nothing else.
  {
    id: "rWjfQAj5v",
    slug: "claws-and-cue-balls",
    title: "Claws & Cue Balls",
    year: "2026",
    tracks: "Game",
    tagline: "",
    context: "",
    stack: "",
    role: "",
    status: "",
    color: "rgb(212, 223, 104)",
    cover: null,
    tags: "",
  },
]

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug)
