import { HashRouter, Routes, Route, useLocation } from "react-router-dom"
import { useEffect, useRef } from "react"
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import ProjectDetail from "./pages/ProjectDetail"
import { LocaleContext, STRINGS, pick, stripLocale, type Locale } from "./lib/i18n"

// Reset scroll position on route (path) change — but not when only the hash
// changes (in-page anchors) or when only the locale prefix flips: the language
// selector must keep the visitor where they are.
function ScrollToTop() {
    const { pathname } = useLocation()
    const bare = stripLocale(pathname)
    const prev = useRef(bare)
    useEffect(() => {
        if (prev.current !== bare) window.scrollTo(0, 0)
        prev.current = bare
    }, [bare])
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
            <ScrollToTop />
            <Routes>
                <Route path="/es/*" element={<LocalizedRoutes locale="es" />} />
                <Route path="/*" element={<LocalizedRoutes locale="en" />} />
            </Routes>
        </HashRouter>
    )
}
