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
        en: "",
        es: "",
    },
    heroSeeWork: { en: "See my work ↓", es: "Mira mi trabajo ↓" },
    heroGetInTouch: { en: "Get in touch", es: "Ponte en contacto" },
    statUnityDev: { en: "Game Dev", es: "Game dev" },
    statCreativeFrontend: { en: "Frontend Dev", es: "Frontend dev" },
    statYearsXP: { en: "Years XP", es: "Años de experiencia" },
    statFields: { en: "Fields", es: "Campos" },
    statSkills: { en: "Skills", es: "Habilidades" },

    // Home · about
    aboutEyebrow: { en: "ABOUT ME", es: "SOBRE MÍ" },
    aboutTitle: { en: "Hi, I'm Vale.", es: "Hola, soy Vale." },
    aboutBodyHtml: {
        en: "<p dir=\"auto\">I’m a game developer and technical artist focused on gameplay, UI, VFX, and interactive systems. I work mainly with Unreal Engine and Unity, combining code and visual design to turn ideas into polished, playable experiences.</p>",
        es: "<p dir=\"auto\">Soy desarrolladora de videojuegos y technical artist, enfocada en gameplay, UI, VFX y sistemas interactivos. Trabajo principalmente con Unreal Engine y Unity, combinando código y diseño visual para transformar ideas en experiencias jugables y pulidas.</p>",
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
    contactTitle: { en: "Let's build something playful.", es: "Construyamos algo único." },
    contactBody: {
        en: "Have a game, an interface, or a wild idea? Drop a line and I'll get back to you.",
        es: "¿Tienes un juego, una interfaz o una gran idea? Escríbeme y me pondré en contacto contigo.",
    },
    contactName: { en: "Name", es: "Nombre" },
    contactEmail: { en: "Email", es: "Correo electrónico" },
    contactMessage: { en: "Message", es: "Mensaje" },
    contactSend: { en: "Send message", es: "Enviar mensaje" },
    contactSending: { en: "Sending…", es: "Enviando…" },
    contactThanks: { en: "Thanks! I'll be in touch soon.", es: "¡Gracias! Me pondré en contacto pronto." },
    contactBasedIn: { en: "Based in", es: "Basado en" },
    // Sample values, not copy: the two names read the same in both locales.
    contactNamePlaceholder: { en: "Jane Doe", es: "Jane Doe" },
    contactEmailPlaceholder: { en: "jane@studio.com", es: "jane@studio.com" },
    contactMessagePlaceholder: {
        en: "Tell me about your project…",
        es: "Cuéntame sobre tu proyecto…",
    },
    contactFormError: {
        en: "Please add your email and a message, then try again.",
        es: "Agrega tu correo y un mensaje, luego inténtalo de nuevo.",
    },
    // Subject line of the mailto fallback, so the visitor's mail client opens
    // in the language they were reading in. {name} is the name they typed.
    contactMailSubject: {
        en: "Portfolio message from {name}",
        es: "Mensaje del portafolio de {name}",
    },
    contactMailSomeone: { en: "someone", es: "alguien" },

    // Footer
    footerIntro: {
        en: "Hi, I’m Valentina Sofía Liberona Zúñiga.",
        es: "Hola, soy Valentina Sofía Liberona Zúñiga.",
    },
    footerSummary: {
        en: "Game Developer, Game Designer and Technical Artist. I build gameplay, game feel, VFX, and UI, with a focus on technical art and technical game design.",
        es: "Game Developer, Game Designer y Technical Artist. Desarrollo gameplay, game feel, VFX y UI, con foco en technical art y diseño técnico de videojuegos.",
    },
    // Rendered uppercase by the footer's own stylesheet.
    footerLinksTitle: { en: "Find me", es: "Encuéntrame" },
    footerDownloadCv: { en: "Download CV", es: "Descargar CV" },
    footerDownloadCvAria: {
        en: "Download CV — Valentina Sofía Liberona Zúñiga (PDF)",
        es: "Descargar CV — Valentina Sofía Liberona Zúñiga (PDF)",
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
