// Content for the project detail pages, keyed by project slug.
//
// Each project owns up to seven named sections (Brief, Snapshot, Game Design,
// UI, Prototype, Skills, Breakdown). A section carries its own copy plus
// optional referenced content: up to four items, up to ten gallery items, a
// video, diagram DSL strings and a table DSL string. Every field is optional —
// ProjectDetail renders a block only when its field is populated.

import { asset } from "./projects"

export type SectionItem = {
  title?: string
  subtitle?: string
  bodyHtml?: string
  badge?: string
  icon?: string
}

export type GalleryItem = {
  title?: string
  image?: string
}

export type ProjectSection = {
  title?: string
  displayTitle?: string
  bodyHtml?: string
  bodyMobileHtml?: string
  tags?: string
  diagram?: string
  diagram2?: string
  diagram3?: string
  table?: string
  /** Up to four items, positional — holes are preserved so slot N stays slot N. */
  items?: (SectionItem | undefined)[]
  /** Up to ten gallery items, in display order. */
  galleryItems?: GalleryItem[]
  video?: string
}

export type ProjectSections = {
  brief?: ProjectSection
  snapshot?: ProjectSection
  gameDesign?: ProjectSection
  ui?: ProjectSection
  prototype?: ProjectSection
  skills?: ProjectSection
  breakdown?: ProjectSection
}

export const projectSections: Record<string, ProjectSections> = {
  pawtchi: {
    brief: {
      title: "Pawtchi - Brief",
      displayTitle: "Project Brief",
      bodyHtml: "<p dir=\"auto\">Pawstchi is a casual mobile game centered around caring for and evolving a virtual robot cat.</p>",
      bodyMobileHtml: "<p dir=\"auto\">Pawstchi is a casual mobile game centered around caring for and evolving a virtual robot cat.</p>",
      tags: "Mobile Game, UI/UX, University Project",
      items: [
        {
          title: "INSPIRATION",
          bodyHtml: "<p dir=\"auto\">Inspired by Tamagotchi and <a href=\"https://www.theoldrobots.com/MeowChi.html\" target=\"_blank\"><strong>Meow-Chi</strong></a> robotic toys.</p>"
        },
        {
          title: "VISUAL DIRECTION",
          bodyHtml: "<p dir=\"auto\">A soft Y2K-inspired style built around pixel art and pastel colors.</p>"
        }
      ],
      video: asset("video-pawtchi-brief.mp4")
    },
    snapshot: {
      title: "Pawtchi - Project Snapshot",
      displayTitle: "Project Snapshot",
      items: [
        {
          title: "Concept",
          bodyHtml: "<p dir=\"auto\">Hybrid casual mobile game combining puzzle levels, resource rewards, and virtual pet care.</p>"
        },
        {
          title: "Player Goal",
          bodyHtml: "<p dir=\"auto\">Complete puzzle levels to earn hearts and gems, then use them to care for, evolve, and customize Pawstchi.</p>"
        },
        {
          title: "Role & Scope",
          bodyHtml: "<p dir=\"auto\">Designed the core loop, UI flow, visual identity, onboarding, accessibility rules, and monetization model.</p>"
        },
        {
          title: "Output",
          bodyHtml: "<p dir=\"auto\">Full UX dossier, Figma screens, Unity prototype, and academic presentation.</p>"
        }
      ]
    },
    gameDesign: {
      title: "Pawtchi - Game Design",
      displayTitle: "Game   Design",
      bodyHtml: "<p dir=\"auto\">Pawstchi was designed around a simple progression loop that connects <strong>pet care, customization, and casual gameplay</strong>. Players complete activities to earn resources, then use them to care for their Pawstchi, unlock new options, and support its evolution.</p><p dir=\"auto\">The game flow was mapped to define how these systems connect, from the main pet screen to activities, rewards, customization, and progression. The diagrams below show the <strong>core gameplay loop</strong> and the <strong>main navigation flow</strong> used to structure the experience.</p>",
      bodyMobileHtml: "<p dir=\"auto\">Pawstchi was designed around a simple progression loop that connects <strong>pet care, customization, and casual gameplay</strong>. Players complete activities to earn resources, then use them to care for their Pawstchi, unlock new options, and support its evolution.</p><p dir=\"auto\">The game flow was mapped to define how these systems connect, from the main pet screen to activities, rewards, customization, and progression. The diagrams below show the <strong>core gameplay loop</strong> and the <strong>main navigation flow</strong> used to structure the experience.</p>",
      diagram: "Start | open the app -> Onboard | choose and name Pawstchi -> Home | check status and resources -> Play | enter a puzzle level -> Solve | complete the match-3 grid -> Reward | earn hearts and gems -> Care | feed, wash, pet, or play -> Progress | evolve, customize, and continue",
      diagram2: "Action | play match-3 levels -> Reward | earn hearts & gems -> Progression | care for, evolve, and customize Pawstchi"
    },
    ui: {
      title: "Pawtchi - UI Design",
      displayTitle: "UI Design",
      bodyHtml: "<p dir=\"auto\">The interface and visual assets for <strong>Pawstchi</strong> were designed and assembled in <strong>Figma</strong>, with a focus on keeping a consistent visual language across the game.</p><p dir=\"auto\">The cat assets were originally created in <strong>Procreate</strong> and later refined in Figma. Some decorative elements and consumables were adapted from the <a href=\"https://toffeecraft.itch.io/pet-virtual-mobile-pixel-asset\">Pet Virtual Mobile Pixel Asset</a> pack, while several UI elements were based on and modified from the <a href=\"https://cupnooble.itch.io/sprout-lands-ui-pack\">Sprout Lands UI Pack</a>.</p><p dir=\"auto\">All remaining assets were created from scratch in Figma. Existing assets were also edited in color, shape, and detail to create a more cohesive look and match the game’s pastel Y2K and retro pixel aesthetic.</p><p dir=\"auto\">The final interface was then organized and prototyped in <strong>Figma Prototype</strong>, defining the main navigation, interactions, and screen flow.</p>",
      bodyMobileHtml: "<p dir=\"auto\">The UI and visual assets for <strong>Pawstchi</strong> were created and refined in <strong>Figma</strong>. The cat assets were originally drawn in <strong>Procreate</strong> and later edited in Figma.</p><p dir=\"auto\">Some decorative elements and consumables were adapted from the <a href=\"https://toffeecraft.itch.io/pet-virtual-mobile-pixel-asset\">Pet Virtual Mobile Pixel Asset</a> pack, while several UI elements were based on the <a href=\"https://cupnooble.itch.io/sprout-lands-ui-pack\">Sprout Lands UI Pack</a>.</p><p dir=\"auto\">All remaining assets were created from scratch in Figma. Both original and adapted assets were edited in color, shape, and detail to keep the interface cohesive and consistent with the game’s pastel Y2K retro-pixel aesthetic. The final screens, navigation, and interactions were then organized and prototyped in <strong>Figma Prototype</strong>.</p>",
      galleryItems: [
        {
          title: "Splash Screen",
          image: asset("gallery-pawstch-splash.png")
        },
        {
          title: "Store Screen",
          image: asset("gallery-store-screen.png")
        },
        {
          title: "Sttings Screen",
          image: asset("gallery-sttings-screen.png")
        },
        {
          title: "Shoop Screen",
          image: asset("gallery-shoop-screen.png")
        },
        {
          title: "Care Screen",
          image: asset("gallery-care-screen.png")
        },
        {
          title: "Puzzle Screen",
          image: asset("gallery-puzzle-screen.png")
        },
        {
          title: "Home Screen",
          image: asset("gallery-home-screen.png")
        },
        {
          title: "Confirm Screen",
          image: asset("gallery-confirm-screen.png")
        },
        {
          title: "Name Pawstchi Screen",
          image: asset("gallery-name-pawstchi-screen.png")
        },
        {
          title: "Choose Pawstchi Screen",
          image: asset("gallery-pawstch-choose.png")
        }
      ]
    }
  },
  "goblin-td": {
    snapshot: {
      title: "GoblinTD - Project Snapshot",
      displayTitle: "Project Snapshot",
      items: [
        {
          title: "Concept",
          subtitle: "Tower defense with physical goblin workers",
          bodyHtml: "<p dir=\"auto\">A tower defense game where goblins are not abstract resources, but visible agents that move, build, mine, and fight.</p>"
        },
        {
          title: "Context",
          subtitle: "Academic group project",
          bodyHtml: "<p dir=\"auto\">Developed in Unity 6 by a 4-person team at Universidad Europea de Madrid.</p>"
        },
        {
          title: "My Focus",
          subtitle: "Systems and UI",
          bodyHtml: "<p dir=\"auto\">Worked on grid placement variants, goblin animation, construction flow, and UI panels.</p>"
        },
        {
          title: "Output",
          subtitle: "Playable prototype",
          bodyHtml: "<p dir=\"auto\">Windows build with 3 levels, a complete build-to-defense loop, and modular C# architecture.</p>"
        }
      ]
    },
    gameDesign: {
      title: "GoblinTD - Game Design",
      displayTitle: "Game Design",
      bodyHtml: "<p dir=\"auto\">Pawstchi was designed around a simple progression loop that connects <strong>pet care, customization, and casual gameplay</strong>. Players complete activities to earn resources, then use them to care for their Pawstchi, unlock new options, and support its evolution.</p><p dir=\"auto\">The game flow was mapped to define how these systems connect, from the main pet screen to activities, rewards, customization, and progression. The diagrams below show the <strong>core gameplay loop</strong> and the <strong>main navigation flow</strong> used to structure the experience.</p>",
      diagram: "Start | enter construction phase -> Build | place structures on the grid -> Assign | send goblins to mines, farms, towers, or construction -> Prepare | manage resources and research upgrades -> Defend | survive the enemy wave -> Reward | gain resources and progress -> Upgrade | improve village systems and defenses -> Continue | face the next wave",
      diagram2: "Action | build structures and assign goblins -> Reward | earn gold, food, and wave progress -> Progression | upgrade defenses, research tech, and survive stronger waves",
      diagram3: "Select Structure -> Validate Footprint -> Assign Goblin -> Build Structure -> Activate Building -> Update UI",
      table: "Goblins are physical agents | Workers feel like part of the world, not abstract numbers. ;; Goblins are limited | Assigning a worker to one task means giving up another option. ;; Build and defense phases are separated | Players plan first, then watch their decisions succeed or fail under pressure. ;; Worker slots are visible | The player can read production and defense state directly from the scene. ;; Economy depends on assignments | Mines and farms become strategic choices because output depends on active workers.",
      items: [
        {
          title: "Grid Placement",
          bodyHtml: "<p dir=\"auto\">The placement system checks footprint size, tile validity, and occupancy before allowing a structure to be built.<br><br>Implementation focus:<br>Placement variants, footprint handling, and validation rules.</p>",
          badge: "01",
          icon: asset("si-goblin-td-breakdown-1.png")
        }
      ]
    }
  },
  "matcha-puzzle": {
    snapshot: {
      title: "MatchaPuzzle - Project Snapshot",
      displayTitle: "Project Snapshot",
      items: [
        {
          title: "Concept",
          subtitle: "Cozy 3D puzzle level",
          bodyHtml: "<p dir=\"auto\">A single-level puzzle game where the player prepares matcha by understanding the correct sequence of buttons, levers, platforms, and routes.</p>"
        },
        {
          title: "Context",
          subtitle: "Solo academic project",
          bodyHtml: "<p dir=\"auto\">Designed and built as a level design project at Universidad Europea de Madrid.</p>"
        },
        {
          title: "My Focus",
          subtitle: "Level design and interaction flow",
          bodyHtml: "<p dir=\"auto\">Focused on spatial readability, route planning, puzzle sequencing, and no-failure-state design.</p>"
        },
        {
          title: "Output",
          subtitle: "Unreal Engine prototype",
          bodyHtml: "<p dir=\"auto\">Playable Unreal Engine 5.7 level with a multi-tier layout, interactive props, moving platforms, and a complete matcha preparation sequence.</p>"
        }
      ]
    },
    gameDesign: {
      title: "Matcha Pzzle- Core Game Loop",
      displayTitle: "Core Loop + Game Flow",
      diagram: "Start | read the matcha recipe -> Activate | use the first buttons and joystick -> Pour | move the matcha into the bowl -> Branch | open routes with the blue door system -> Explore | reach the whisk, cup, and underground route -> Reconfigure | raise the kettle and invert doors -> Finish | pour water and complete the bowl sequence -> End | serve the matcha into the cup",
      diagram2: "Explore | read the space and identify possible routes -> Reconfigure | activate buttons, levers, and moving platforms -> Progress | unlock the next step of the matcha recipe"
    }
  }
}
