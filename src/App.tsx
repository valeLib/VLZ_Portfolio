import { HashRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom"
import { useEffect, useLayoutEffect, useRef } from "react"
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import ProjectDetail from "./pages/ProjectDetail"
import { LocaleContext, STRINGS, pick, stripLocale, type Locale } from "./lib/i18n"
import { jumpTo } from "./lib/scroll"

/**
 * Scroll position across route changes.
 *
 * The reset runs in a layout effect so the new page is positioned before the
 * browser paints it — in a passive effect the incoming page renders once at the
 * outgoing page's scroll position, which reads as a flash followed by a jump to
 * the top.
 *
 * Back / forward returns to where the visitor left that route. The browser's own
 * restoration is turned off because it fires against the outgoing page's height,
 * and on a hash router it also races the route swap.
 */
function ScrollManager() {
    const { pathname } = useLocation()
    const navigationType = useNavigationType()
    // Locale-only changes are the same page in another language: keep the
    // visitor where they are.
    const route = stripLocale(pathname)
    const previous = useRef<string | null>(null)
    const positions = useRef(new Map<string, number>())
    // Sampled by the scroll listener rather than read during the route change:
    // by then the incoming page's height may already have clamped window.scrollY.
    const lastY = useRef(0)

    useEffect(() => {
        if (!("scrollRestoration" in window.history)) return
        const original = window.history.scrollRestoration
        window.history.scrollRestoration = "manual"
        return () => {
            window.history.scrollRestoration = original
        }
    }, [])

    useEffect(() => {
        const onScroll = () => {
            lastY.current = window.scrollY
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useLayoutEffect(() => {
        if (previous.current === route) return
        if (previous.current !== null) positions.current.set(previous.current, lastY.current)
        previous.current = route
        const restored = navigationType === "POP" ? positions.current.get(route) : undefined
        const target = restored ?? 0
        lastY.current = target
        jumpTo(target)
    }, [route, navigationType])

    return null
}

// The routed pages, wrapped in the active locale. The locale lives in the URL:
// "#/..." is English (default locale), "#/es/..." is Spanish.
function LocalizedRoutes({ locale }: { locale: Locale }) {
    useEffect(() => {
        document.title = pick(locale, STRINGS.siteTitle)
    }, [locale])
    return (
        <LocaleContext.Provider value={locale}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </LocaleContext.Provider>
    )
}

// HashRouter chosen for GitHub Pages reliability (zero server config).
export default function App() {
    return (
        <HashRouter>
            <ScrollManager />
            <Routes>
                <Route path="/es/*" element={<LocalizedRoutes locale="es" />} />
                <Route path="/*" element={<LocalizedRoutes locale="en" />} />
            </Routes>
        </HashRouter>
    )
}
