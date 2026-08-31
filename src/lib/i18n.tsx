/**
 * Localization: English (default) and Spanish.
 *
 * The locale lives in the URL, inside the hash router: #/... is English,
 * #/es/... is Spanish. Nothing is persisted beyond the URL, so a shared link
 * always opens in the language it was written in.
 *
 * Page content carries its translations inline as { en, es } pairs (see
 * src/data/*); static UI chrome is translated through the STRINGS table below.
 */

import { createContext, useCallback, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export type Locale = "en" | "es"

/** A string with one value per locale. */
export type L10n = { en: string; es: string }

export const LOCALES: { code: Locale; label: string; name: string }[] = [
    { code: "en", label: "EN", name: "English" },
    { code: "es", label: "ES", name: "Spanish" },
]

export const LocaleContext = createContext<Locale>("en")

export const useLocale = (): Locale => useContext(LocaleContext)

/** Resolve a localized value for the given locale (falls back to EN). */
export const pick = (locale: Locale, v?: L10n | string | null): string => {
    if (v == null) return ""
    if (typeof v === "string") return v
    return (locale === "es" ? v.es : v.en) || v.en
}

/** Prefix an app path with the locale segment ("/es") when needed. */
export const localePath = (locale: Locale, path: string): string => {
    if (locale !== "es") return path
    return path === "/" ? "/es" : `/es${path}`
}

/** Strip the locale segment from a location pathname. */
export const stripLocale = (pathname: string): string => {
    const stripped = pathname.replace(/^\/es(?=\/|$)/, "")
    return stripped === "" ? "/" : stripped
}

/** Locale-aware `to` builder for react-router Links. */
export function useLocalePath() {
    const locale = useLocale()
    return useCallback((path: string) => localePath(locale, path), [locale])
}

/** Switch locale in place: same route, new locale prefix. */
export function useSetLocale() {
    const locale = useLocale()
    const navigate = useNavigate()
    const location = useLocation()
    return useCallback(
        (next: Locale) => {
            if (next === locale) return
            navigate(localePath(next, stripLocale(location.pathname)))
        },
        [locale, navigate, location.pathname]
    )
}

/**
  * Static UI text, keyed by surface. In-page navigation scrolls to stable
  * element ids rather than URL hashes, so anchor slugs are not localized.
  */
export const STRINGS = {
    // Site metadata
    siteTitle: { en: "Valentina Liberona Zuñiga Portfolio", es: "Portafolio de Valentina Liberona Zuñiga" },

    // Navbar
    navWork: { en: "Work", es: "Trabajo" },
    navAbout: { en: "About", es: "Acerca de" },
    navProjects: { en: "Projects", es: "Proyectos" },
    navContact: { en: "Contact", es: "Contacto" },

    // Home · hero
    heroMy: { en: "My", es: "Mi" },
    heroPortfolio: { en: "Portfolio", es: "Portafolio" },
    heroTagline: {
        en: "7+ years building games, VR experiences, and motion-driven web interfaces.",
        es: "Más de 7 años creando juegos, experiencias de realidad virtual e interfaces web basadas en movimiento.",
    },
    heroSeeWork: { en: "See my work ↓", es: "Mira mi trabajo ↓" },
    heroGetInTouch: { en: "Get in touch", es: "Ponte en contacto" },
    statUnityDev: { en: "Unity Dev", es: "Desarrollador de Unity" },
    statCreativeFrontend: { en: "Creative Frontend", es: "Frontend creativo" },
    statYearsXP: { en: "Years XP", es: "Años de experiencia" },
    statFields: { en: "Fields", es: "Campos" },
    statSkills: { en: "Skills", es: "Habilidades" },

    // Home · about
    aboutEyebrow: { en: "ABOUT ME", es: "SOBRE MÍ" },
    aboutTitle: { en: "Hi, I'm Vale.", es: "Hola, soy Vale." },
    aboutBodyHtml: {
        en: "<p dir=\"auto\">I’m a game developer based in Chile, working remotely, focused on building optimized systems that are both performant and visually clear. My work spans Unity and Unreal, where I design gameplay, AI behaviors, and scalable architectures. I also use frontend tools when needed to support interfaces and interactive systems.</p>",
        es: "<p dir=\"auto\">Soy un desarrollador de videojuegos radicado en Chile, trabajo de forma remota y me enfoco en construir sistemas optimizados que sean de alto rendimiento y visualmente claros. Mi trabajo abarca Unity y Unreal, donde diseño jugabilidad, comportamientos de IA y arquitecturas escalables. También utilizo herramientas de frontend cuando es necesario para dar soporte a interfaces y sistemas interactivos.</p>",
    },
    profileExe: { en: "PROFILE.EXE", es: "PERFIL.EXE" },

    // Home · projects
    projectsEyebrow: { en: "PROJECTS", es: "PROYECTOS" },
    projectsTitle: { en: "Featured Work", es: "Trabajo destacado" },

    // Home · work
    workEyebrow: { en: "EXPERIENCE", es: "EXPERIENCIA" },
    workTitle: { en: "Where I've worked", es: "Dónde he trabajado" },

    // Home · skills
    skillsEyebrow: { en: "SKILLS", es: "HABILIDADES" },
    skillsTitle: { en: "What I use", es: "Lo que uso" },

    // Contact
    contactTitle: { en: "Let's build something playful.", es: "Construyamos algo lúdico." },
    contactBody: {
        en: "Have a game, an interface, or a wild idea? Drop a line and I'll get back to you.",
        es: "¿Tienes un juego, una interfaz o una idea descabellada? Escríbeme y me pondré en contacto contigo.",
    },
    contactName: { en: "Name", es: "Nombre" },
    contactEmail: { en: "Email", es: "Correo electrónico" },
    contactMessage: { en: "Message", es: "Mensaje" },
    contactSend: { en: "Send message", es: "Enviar mensaje" },
    contactThanks: { en: "Thanks! I'll be in touch soon.", es: "¡Gracias! Me pondré en contacto pronto." },
    contactBasedIn: { en: "Based in", es: "Basado en" },

    // Footer
    footerTagline: {
        en: "Unity developer & creative frontend engineer building playful, retro-flavored interfaces.",
        es: "Desarrollador de Unity e ingeniero de frontend creativo que crea interfaces divertidas y con un toque retro.",
    },
    footerCopyright: {
        en: "© {year} Valentina Liberona Zúñiga. All rights reserved.",
        es: "© {year} Valentina Liberona Zúñiga. Todos los derechos reservados.",
    },

    // Project detail pages
    backLink: { en: "‹ Back", es: "‹ Volver" },
    aboutTheGame: { en: "About the Game", es: "Acerca del juego" },
    aboutMyWork: { en: "About my Work", es: "Sobre mi trabajo" },
    toolsLabel: { en: "Tools", es: "Herramientas" },
    contextLabel: { en: "Context", es: "Contexto" },
    roleLabel: { en: "Role", es: "Rol" },
    playPrototype: { en: "Play Prototype", es: "Jugar prototipo" },
    metaLoopWindow: { en: "META_PROGRESSION_LOOP.EXE", es: "BUCLE_DE_METAPROGRESION.EXE" },
    tableLeftHeader: { en: "Design Decision", es: "Decisión de diseño" },
    tableRightHeader: { en: "Gameplay Impact", es: "Impacto en el juego" },
    coreLoopCenter: { en: "CORE\nLOOP", es: "BUCLE\nPRINCIPAL" },
    metaLoopCenter: { en: "META CORE\nLOOP", es: "NÚCLEO META\nBUCLE" },
    prevProject: { en: "Previous project", es: "Proyecto anterior" },
    nextProject: { en: "Next project", es: "Proyecto siguiente" },
    projectNavigation: { en: "Other projects", es: "Otros proyectos" },
    projectNotFound: { en: "Project not found", es: "Proyecto no encontrado" },
    backHome: { en: "← Back home", es: "← Volver al inicio" },
} as const satisfies Record<string, L10n>

export type StringKey = keyof typeof STRINGS

/** Translate a static UI string for the active locale. */
export function useT() {
    const locale = useLocale()
    return useCallback((key: StringKey) => pick(locale, STRINGS[key]), [locale])
}
