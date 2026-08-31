import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useNavVisibility } from "../hooks/useNavVisibility"
import { useLocation, useNavigate } from "react-router-dom"
import { scrollToElement, scrollToTop, setPendingAnchor } from "../lib/scroll"
import { LOCALES, stripLocale, useLocale, useLocalePath, useSetLocale } from "../lib/i18n"

/**
 * Retro / Y2K sticky navigation bar.
 * Smooth-scrolls to #section anchors, highlights the active section,
 * and can shrink (height + width) / re-align / fade / elevate / blur on scroll.
 * Optional always-on glassmorphism (frosted translucent bar).
 * Built-in locale pill (globe + language code) with a dropdown that switches
 * the app locale in place. Mobile: animated burger that morphs into an X,
 * with a vertically expanding dropdown of staggered links; the pill stays in
 * the bar next to the burger.
 */

const FONT_STACKS: Record<string, string> = {
    Fredoka: '"Fredoka", sans-serif',
    Jua: '"Jua", sans-serif',
    "Anonymous Pro": '"Anonymous Pro", monospace',
    "IBM Plex Mono": '"IBM Plex Mono", monospace',
    Caveat: '"Caveat", cursive',
    "System Sans": "system-ui, -apple-system, sans-serif",
}

// Hover effect label -> CSS class suffix
const HOVER_CLASS: Record<string, string> = {
    "Color shift": "color",
    "Underline grow": "underline",
    "Highlight swipe": "highlight",
    "Pill fill": "pill",
    Lift: "lift",
    "Scale up": "scale",
    Wiggle: "wiggle",
}

/**
 * Builds the wordmark's text-shadow.
 *
 * Relief stacks one shadow per pixel along the offset vector so the second
 * colour becomes a continuous extruded side rather than a detached copy.
 */
function buildWordmarkShadow(
    mode: string,
    x: number,
    y: number,
    blur: number,
    color: string
): string {
    if (mode === "Soft") return `${x}px ${y}px ${blur}px ${color}`
    if (mode === "Relief") {
        const steps = Math.max(1, Math.round(Math.max(Math.abs(x), Math.abs(y))))
        const layers: string[] = []
        for (let i = 1; i <= steps; i++) {
            const px = Math.round(((x * i) / steps) * 100) / 100
            const py = Math.round(((y * i) / steps) * 100) / 100
            layers.push(`${px}px ${py}px 0 ${color}`)
        }
        return layers.join(", ")
    }
    return `${x}px ${y}px 0 ${color}`
}

const DEFAULTS = {
    background: "#F2EFE9",
    textColor: "#1C1B22",
    font: "Fredoka",
    wordmark: "VL",
    wordmarkColor: "#4F58AF",
    wordmarkSize: 22,
    linkSize: 15,
    activeColor: "#EE978E",
    hoverColor: "#4F58AF",
    linkHover: "Underline grow",
    showCTA: true,
    ctaLabel: "Contact",
    ctaAnchor: "#contact",
    ctaColor: "#FABA32",
    baseHeight: 72,
    shrunkHeight: 56,
    shrinkOnScroll: true,
    shrinkWidthOnScroll: false,
    shrunkWidth: 86,
    /** Cap the compact bar takes instead of its full one. A CSS length, so it
     *  can be expressed against the shared content column. Empty = unchanged. */
    shrunkMaxWidth: "" as number | string,
    /** How far the page must move before the bar compacts. Deliberately longer
     *  than the 24px that flips `scrolled`, so the width change reads as
     *  intentional rather than twitching off the first wheel notch. */
    shrinkOffset: 24,
    scrollAlign: "center",
    fadeOnScroll: false,
    scrolledOpacity: 0.92,
    blurOnScroll: true,
    glass: false,
    blurAmount: 10,
    bgOpacity: 0.7,
    saturate: 160,
    elevateOnScroll: true,
    shadowColor: "#1C1B22",
    bottomBorder: true,
    fullBorder: false,
    borderColor: "#1C1B22",
    borderWidth: 2.5,
    radius: 0,
    maxWidth: 1200 as number | string,
    wordmarkFont: "Fredoka",
    wordmarkLayer: false,
    wordmarkLayerMode: "Relief",
    wordmarkLayerColor: "#EE978E",
    wordmarkLayerX: 3,
    wordmarkLayerY: 3,
    wordmarkLayerBlur: 6,
    wordmarkOutline: false,
    wordmarkOutlineWidth: 1.5,
    overlay: false,
    overlayTop: 20,
    overlayInset: 24,
    overlayMaxWidth: 930 as number | string,
    autoHide: false,
    autoHideDelay: 2.5,
    autoHideOffset: 120,
    menuBg: "#F2EFE9",
    menuOpacity: 1,
    menuBlur: 14,
    shadowMode: "On scroll",
    shadowDepth: 6,
    shadowRim: false,
    shadowRimColor: "#FFFDF8",
    shadowRimWidth: 1.5,
    showLocale: true,
    localeLabelMode: "code",
    localeShowGlobe: true,
    localeSize: 14,
    localeBg: "#FFFDF8",
    localeColor: "#1C1B22",
    localeAccent: "#4F58AF",
    localeBorderWidth: 0,
    localeBorderColor: "#1C1B22",
    localeRadius: 999,
    localeMenuBg: "#FFFDF8",
    localeMenuRadius: 14,
    links: [
        { label: "Work", anchor: "#work" },
        { label: "About", anchor: "#about" },
        { label: "Projects", anchor: "#projects" },
        { label: "Contact", anchor: "#contact" },
    ] as { label: string; anchor: string }[],
}

/** A bare number means px; a string passes through as authored CSS. */
const cssLength = (v: number | string) => (typeof v === "number" ? `${v}px` : v)

export default function StickyNav(props: Partial<typeof DEFAULTS> & { style?: React.CSSProperties }) {
    const {
        background,
        textColor,
        font,
        wordmark,
        wordmarkColor,
        wordmarkSize,
        links,
        linkSize,
        activeColor,
        hoverColor,
        linkHover,
        showCTA,
        ctaLabel,
        ctaAnchor,
        ctaColor,
        baseHeight,
        shrunkHeight,
        shrinkOnScroll,
        shrinkWidthOnScroll,
        shrunkWidth,
        shrunkMaxWidth,
        shrinkOffset,
        scrollAlign,
        fadeOnScroll,
        scrolledOpacity,
        blurOnScroll,
        glass,
        blurAmount,
        bgOpacity,
        saturate,
        elevateOnScroll,
        shadowColor,
        bottomBorder,
        fullBorder,
        borderColor,
        borderWidth,
        radius,
        maxWidth,
        wordmarkFont,
        wordmarkLayer,
        wordmarkLayerMode,
        wordmarkLayerColor,
        wordmarkLayerX,
        wordmarkLayerY,
        wordmarkLayerBlur,
        wordmarkOutline,
        wordmarkOutlineWidth,
        overlay,
        overlayTop,
        overlayInset,
        overlayMaxWidth,
        autoHide,
        autoHideDelay,
        autoHideOffset,
        menuBg,
        menuOpacity,
        menuBlur,
        shadowMode,
        shadowDepth,
        shadowRim,
        shadowRimColor,
        shadowRimWidth,
        showLocale,
        localeLabelMode,
        localeShowGlobe,
        localeSize,
        localeBg,
        localeColor,
        localeAccent,
        localeBorderWidth,
        localeBorderColor,
        localeRadius,
        localeMenuBg,
        localeMenuRadius,
        style,
    } = { ...DEFAULTS, ...props }

    const [scrolled, setScrolled] = useState(false)
    const [pastCompact, setPastCompact] = useState(false)
    const [active, setActive] = useState<string>("")
    const [menuOpen, setMenuOpen] = useState(false)
    const [localeOpen, setLocaleOpen] = useState(false)
    const localeRef = useRef<HTMLDivElement>(null)
    const navRef = useRef<HTMLDivElement>(null)

    const activeLocale = useLocale()
    const setLocale = useSetLocale()
    const localeList = LOCALES
    const currentEntry = localeList.find((l) => l.code === activeLocale)
    const currentLabel = currentEntry
        ? localeLabelMode === "name"
            ? currentEntry.name
            : currentEntry.code.slice(0, 2).toUpperCase()
        : "EN"

    // Close the locale dropdown on outside mousedown / Escape while open.
    useEffect(() => {
        if (!localeOpen) return
        const onDown = (e: MouseEvent) => {
            if (localeRef.current && !localeRef.current.contains(e.target as Node)) setLocaleOpen(false)
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLocaleOpen(false)
        }
        document.addEventListener("mousedown", onDown)
        document.addEventListener("keydown", onKey)
        return () => {
            document.removeEventListener("mousedown", onDown)
            document.removeEventListener("keydown", onKey)
        }
    }, [localeOpen])

    const stack = FONT_STACKS[font] ?? FONT_STACKS.Fredoka
    const wordmarkStack = FONT_STACKS[wordmarkFont] ?? stack
    const items: any[] = links ?? []
    const hoverSuffix = HOVER_CLASS[linkHover] ?? "color"

    // Both the active state and the click targets read the sections through
    // this one resolver, in document order, so the highlight can never point
    // somewhere the links do not go.
    const anchors = items.map((l) => (l.anchor || "").replace(/^#/, "")).filter(Boolean)
    const anchorKey = anchors.join("|")
    const sectionElements = useCallback((): HTMLElement[] => {
        return anchors
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => Boolean(el))
            .sort((a, b) =>
                a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
            )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anchorKey])

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 24)
            setPastCompact(window.scrollY > shrinkOffset)
            // Sticky sections all report a rect top of 0 once scrolled past, so
            // several match at a time. The one visually occupying the viewport
            // is the last match in document order — which is not the order the
            // links happen to be declared in. The bar's own height is the cutoff
            // so a section counts as current once it clears the bar.
            const line = (navRef.current?.getBoundingClientRect().bottom ?? 0) + 8
            const reached = sectionElements().filter(
                (el) => el.getBoundingClientRect().top <= line
            )
            setActive(reached.length ? reached[reached.length - 1].id : "")
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        // Section positions are viewport-relative, so a resize moves them.
        window.addEventListener("resize", onScroll)
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [sectionElements, shrinkOffset])

    // Anyone using the bar holds it open: pointer over it, keyboard focus
    // inside it, or one of its menus open.
    const [hover, setHover] = useState(false)
    const [focusWithin, setFocusWithin] = useState(false)

    // The sections the links point at live on the home page. From any other
    // route a link hands the section over to the route change, which positions
    // the home page on it before it first paints.
    const navigate = useNavigate()
    const location = useLocation()
    const lp = useLocalePath()
    const onHome = stripLocale(location.pathname) === "/"

    const visible = useNavVisibility({
        enabled: autoHide,
        held: localeOpen || menuOpen || hover || focusWithin,
        threshold: 12,
        revealAtTop: autoHideOffset,
        idleDelay: Math.max(0, autoHideDelay) * 1000,
        resetKey: location.pathname,
    })

    const goTo = (anchor: string) => (e: React.MouseEvent) => {
        e.preventDefault()
        setMenuOpen(false)
        const id = (anchor || "").replace(/^#/, "")
        if (!id || id === "/") {
            // Bare "#" would be handled by the hash router as a route change,
            // dropping the locale prefix along with the scroll position.
            if (onHome) scrollToTop()
            else navigate(lp("/"))
            return
        }
        const el = sectionElements().find((s) => s.id === id)
        if (el) {
            // A pinned section fills the viewport under the floating bar by
            // design, so it wants no offset. A section in normal flow — the
            // phone layout — would otherwise start underneath the bar.
            const pinned = getComputedStyle(el).position === "sticky"
            const offset = pinned ? 0 : (navRef.current?.getBoundingClientRect().height ?? 0) + 8
            scrollToElement(el, offset)
            return
        }
        setPendingAnchor(id)
        navigate(lp("/"))
    }

    const height = shrinkOnScroll && scrolled ? shrunkHeight : baseHeight
    // shadowMode "Always" matters in overlay mode, where the bar floats over the
    // page from the first frame with nothing else separating it from the background.
    const showShadow = elevateOnScroll && (shadowMode === "Always" || scrolled)
    const compact = shrinkWidthOnScroll && pastCompact
    const navWidth = compact ? `${shrunkWidth}%` : "100%"
    const navOpacity = fadeOnScroll && scrolled ? scrolledOpacity : 1

    const alignMargin =
        compact && scrollAlign === "left"
            ? "0 auto 0 0"
            : compact && scrollAlign === "right"
            ? "0 0 0 auto"
            : "0 auto"

    const borderCss = `${borderWidth}px solid ${borderColor}`

    const blurActive = glass || (blurOnScroll && scrolled)
    const filterCss = blurActive ? `blur(${blurAmount}px) saturate(${saturate}%)` : "none"
    const barBackground = blurActive ? hexToRgba(background, bgOpacity) : background

    // Wordmark. The stroke, when on, paints under the fill (paint-order) so it
    // thickens the letterforms from the outside instead of eating into them.
    const wordmarkCss: React.CSSProperties = {
        fontWeight: 600,
        fontSize: wordmarkSize,
        fontFamily: wordmarkStack,
        letterSpacing: -0.5,
        color: wordmarkColor,
        textDecoration: "none",
        whiteSpace: "nowrap",
        textShadow: wordmarkLayer
            ? buildWordmarkShadow(
                  wordmarkLayerMode,
                  wordmarkLayerX,
                  wordmarkLayerY,
                  wordmarkLayerBlur,
                  wordmarkLayerColor
              )
            : "none",
        ...(wordmarkOutline
            ? {
                  WebkitTextStrokeWidth: `${wordmarkOutlineWidth}px`,
                  WebkitTextStrokeColor: wordmarkLayerColor,
                  paintOrder: "stroke fill",
              }
            : {}),
        transition: "font-size 0.25s ease, text-shadow 0.25s ease",
    }

    // Mobile dropdown surface, deliberately independent of the bar's translucency:
    // a see-through bar is fine over a 72px strip, but the same alpha over a tall
    // panel of links makes them unreadable.
    const menuSolid = !(menuOpacity < 1)
    const menuBackground = menuSolid ? menuBg : hexToRgba(menuBg, menuOpacity)
    const menuFilterCss =
        !menuSolid && menuBlur > 0 ? `blur(${menuBlur}px) saturate(${saturate}%)` : "none"

    // Shadow stack. Earlier entries paint on top, so the rim is pushed last: it is
    // the same offset shadow grown by `spread`, peeking out as a thin outline that
    // keeps the pill legible over a dark section.
    const boxShadows: string[] = []
    if (showShadow) {
        boxShadows.push(`0 ${shadowDepth}px 0 0 ${shadowColor}`)
        if (shadowRim) boxShadows.push(`0 ${shadowDepth}px 0 ${shadowRimWidth}px ${shadowRimColor}`)
    }
    if (glass) boxShadows.push("inset 0 1px 0 rgba(255,255,255,0.45)")
    const barShadow = boxShadows.length ? boxShadows.join(", ") : "none"

    // Overlay mode: a sticky element still reserves its box in the document flow.
    // Fixed does not, so the bar floats over the sections instead of carving out
    // a band at the top. Applied after the `style` spread so it wins.
    const overlayOverrides = overlay
        ? ({
              position: "fixed",
              top: `${overlayTop}px`,
              left: `${overlayInset}px`,
              right: `${overlayInset}px`,
              bottom: "auto",
              width: "auto",
              height: "auto",
          } as React.CSSProperties)
        : {}

    const positionerStyle = {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        boxSizing: "border-box",
        fontFamily: stack,
        "--nav-link": textColor,
        "--nav-active": activeColor,
        "--nav-hover": hoverColor,
        "--nav-pill": hexToRgba(hoverColor, 0.16),
        "--nav-link-size": `${linkSize}px`,
        "--menu-bg": menuBackground,
        "--menu-blur": menuFilterCss,
        "--nav-radius": typeof radius === "number" ? `${radius}px` : radius,
        "--nav-border": fullBorder ? borderCss : "none",
        "--nav-border-bottom": fullBorder || bottomBorder ? borderCss : "none",
        "--nav-bw": fullBorder ? `${borderWidth}px` : "0px",
        "--nav-shadow": barShadow,
        "--nav-top": overlay ? `${overlayTop}px` : "0px",
        "--nav-pad": "24px",
        "--loc-bg": localeBg,
        "--loc-color": localeColor,
        "--loc-accent": localeAccent,
        "--loc-menu-bg": localeMenuBg,
        "--loc-menu-radius": `${localeMenuRadius}px`,
        "--loc-hover": hexToRgba(localeAccent, 0.12),
        "--loc-radius": `${localeRadius}px`,
        "--loc-size": `${localeSize}px`,
        "--loc-border": localeBorderWidth > 0 ? `${localeBorderWidth}px solid ${localeBorderColor}` : "none",
        ...style,
        ...overlayOverrides,
    } as React.CSSProperties

    const barStyle = {
        position: "relative",
        width: navWidth,
        // The compact cap is a CSS length rather than a Motion value: it is
        // written against --content-col, and Motion cannot tween a calc() over a
        // custom property. The browser interpolates the two computed lengths, so
        // the width still eases rather than snapping.
        maxWidth: overlay
            ? cssLength(compact && shrunkMaxWidth ? shrunkMaxWidth : overlayMaxWidth)
            : undefined,
        margin: alignMargin,
        boxSizing: "border-box",
        background: barBackground,
        backdropFilter: filterCss,
        WebkitBackdropFilter: filterCss,
        border: fullBorder ? borderCss : "none",
        borderBottom: fullBorder || bottomBorder ? borderCss : "none",
        borderRadius: radius,
        boxShadow: barShadow,
        transition:
            "width 0.35s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1), margin 0.3s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.2s ease, backdrop-filter 0.25s ease, border-radius 0.2s ease",
    } as React.CSSProperties

    const navClass = [
        "sticky-nav",
        overlay ? "sn-overlay" : "",
        autoHide ? "sn-autohide" : "",
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <nav className={navClass} style={positionerStyle}>
            {/* Visibility is a transform + fade on the bar alone; the fixed
                positioner never moves, so showing or hiding costs no layout. */}
            <motion.div
                ref={navRef}
                className={`sticky-nav-bar${menuOpen ? " is-open" : ""}`}
                style={barStyle}
                data-visible={visible ? "true" : "false"}
                animate={{ y: visible ? (compact ? -3 : 0) : "-150%", opacity: visible ? navOpacity : 0 }}
                transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                onPointerEnter={() => setHover(true)}
                onPointerLeave={() => setHover(false)}
                onFocus={() => setFocusWithin(true)}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false)
                }}
            >
                <div
                    style={{
                        maxWidth: cssLength(maxWidth),
                        margin: "0 auto",
                        height,
                        padding: "0 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24,
                        transition: "height 0.25s ease",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Wordmark */}
                    <a href="#" onClick={goTo("#")} style={wordmarkCss}>
                        {wordmark}
                    </a>

                    {/* Right-hand group: links · locale pill · burger */}
                    <div className="sticky-nav-right">
                        {/* Desktop links */}
                        <div className="sticky-nav-links">
                            {items.map((l, i) => {
                                const id = (l.anchor || "").replace(/^#/, "")
                                const isActive = id && id === active
                                return (
                                    <a
                                        key={i}
                                        href={l.anchor || "#"}
                                        onClick={goTo(l.anchor)}
                                        className={`snl snl-${hoverSuffix}${isActive ? " is-active" : ""}`}
                                        style={{
                                            fontSize: linkSize,
                                            fontWeight: 500,
                                            textDecoration: "none",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {l.label}
                                    </a>
                                )
                            })}

                            {showCTA && (
                                <a
                                    href={ctaAnchor || "#contact"}
                                    onClick={goTo(ctaAnchor)}
                                    className="snl-cta"
                                    style={{
                                        padding: "9px 18px",
                                        background: ctaColor,
                                        color: "#1C1B22",
                                        fontWeight: 600,
                                        fontSize: linkSize - 1,
                                        borderRadius: 999,
                                        border: `2.5px solid ${textColor}`,
                                        textDecoration: "none",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {ctaLabel}
                                </a>
                            )}
                        </div>

                        {/* Locale pill */}
                        {showLocale && (
                            <div className="sn-loc" ref={localeRef}>
                                <button
                                    type="button"
                                    className={`sn-loc-btn${localeOpen ? " is-open" : ""}`}
                                    aria-haspopup="listbox"
                                    aria-expanded={localeOpen}
                                    aria-label="Language"
                                    onClick={() => setLocaleOpen((o) => !o)}
                                >
                                    {localeShowGlobe && <GlobeIcon size={localeSize + 3} stroke={localeAccent} />}
                                    <span className="sn-loc-label">{currentLabel}</span>
                                    <svg
                                        className="sn-loc-chev"
                                        width={localeSize - 2}
                                        height={localeSize - 2}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M5 9l7 7 7-7" />
                                    </svg>
                                </button>
                                {localeOpen && localeList.length > 0 && (
                                    <div className="sn-loc-menu" role="listbox">
                                        {localeList.map((loc) => {
                                            const isCur = loc.code === activeLocale
                                            return (
                                                <button
                                                    key={loc.code}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isCur}
                                                    className={`sn-loc-item${isCur ? " is-active" : ""}`}
                                                    onClick={() => {
                                                        setLocale(loc.code)
                                                        setLocaleOpen(false)
                                                        setMenuOpen(false)
                                                    }}
                                                >
                                                    <span className="sn-loc-code">{loc.code.toUpperCase()}</span>
                                                    <span className="sn-loc-name">{loc.name}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile hamburger / cross */}
                        <button
                            aria-label="Menu"
                            aria-expanded={menuOpen}
                            className={`sticky-nav-burger${menuOpen ? " is-open" : ""}`}
                            onClick={() => setMenuOpen((o) => !o)}
                        >
                            <span className="snb-bar snb-top" />
                            <span className="snb-bar snb-mid" />
                            <span className="snb-bar snb-bot" />
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown (always mounted so it can animate open/closed) */}
                <div className={`sticky-nav-mobile${menuOpen ? " is-open" : ""}`}>
                    <div className="sticky-nav-mobile-inner" style={{ maxWidth: cssLength(maxWidth), margin: "0 auto" }}>
                        {items.map((l, i) => {
                            const id = (l.anchor || "").replace(/^#/, "")
                            const isActive = id && id === active
                            return (
                                <a
                                    key={i}
                                    href={l.anchor || "#"}
                                    onClick={goTo(l.anchor)}
                                    className={`snl-m${isActive ? " is-active" : ""}`}
                                    style={{ transitionDelay: `${menuOpen ? 60 + i * 45 : 0}ms` }}
                                >
                                    {l.label}
                                </a>
                            )
                        })}
                        {showCTA && (
                            <a
                                href={ctaAnchor || "#contact"}
                                onClick={goTo(ctaAnchor)}
                                className="snl-m snl-m-cta"
                                style={{
                                    transitionDelay: `${menuOpen ? 60 + items.length * 45 : 0}ms`,
                                    background: ctaColor,
                                    border: `2.5px solid ${textColor}`,
                                }}
                            >
                                {ctaLabel}
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Scoped styles: responsive switch, hover effects, burger morph, dropdown expand */}
            <style>{`
                nav .sticky-nav-right { display: flex; align-items: center; gap: 18px; }
                nav .sticky-nav-links { display: flex; align-items: center; gap: 28px; }

                /* Locale pill */
                nav .sn-loc { position: static; flex-shrink: 0; }
                nav .sn-loc-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 7px 12px;
                    background: var(--loc-bg); color: var(--loc-color);
                    border: var(--loc-border); border-radius: var(--loc-radius);
                    font: inherit; font-size: var(--loc-size); font-weight: 600; line-height: 1;
                    cursor: pointer; white-space: nowrap;
                    transition: background .18s ease, transform .15s ease;
                }
                nav .sn-loc-btn:hover { background: var(--loc-hover); }
                nav .sn-loc-btn:active { transform: translateY(1px); }
                nav .sn-loc-label { letter-spacing: .02em; }
                nav .sn-loc-chev { opacity: .7; transition: transform .22s ease; }
                nav .sn-loc-btn.is-open .sn-loc-chev { transform: rotate(180deg); }
                nav .sn-loc-menu {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: var(--nav-pad);
                    min-width: 160px; max-width: calc(100vw - 32px);
                    z-index: 1200;
                    display: flex; flex-direction: column;
                    padding: 6px;
                    background: var(--loc-menu-bg);
                    border: var(--loc-border);
                    border-radius: var(--loc-menu-radius);
                    box-shadow: 0 4px 14px rgba(0,0,0,.14);
                    animation: sn-loc-in .16s ease-out;
                }
                @keyframes sn-loc-in {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                nav .sn-loc-item {
                    display: flex; align-items: center; gap: 10px;
                    padding: 9px 12px;
                    background: transparent; border: none;
                    border-radius: max(4px, calc(var(--loc-menu-radius) - 5px));
                    color: var(--loc-color);
                    font: inherit; font-size: var(--loc-size); text-align: left;
                    cursor: pointer;
                    transition: background .15s ease, color .15s ease;
                }
                nav .sn-loc-item:hover { background: var(--loc-hover); }
                nav .sn-loc-item.is-active { color: var(--loc-accent); font-weight: 700; }
                nav .sn-loc-code { font-weight: 700; letter-spacing: .04em; min-width: 22px; }
                nav .sn-loc-name { opacity: .75; font-size: calc(var(--loc-size) - 1px); }

                /* base link */
                nav .snl {
                    position: relative;
                    color: var(--nav-link);
                    padding-bottom: 4px;
                    transition: color .18s ease, transform .18s ease, background .18s ease;
                }
                nav .snl.is-active { color: var(--nav-active); }

                /* Color shift */
                nav .snl-color:hover { color: var(--nav-hover); }

                /* Underline grow */
                nav .snl-underline::after {
                    content: ""; position: absolute; left: 0; bottom: 0;
                    width: 100%; height: 2.5px; background: var(--nav-hover);
                    transform: scaleX(0); transform-origin: left;
                    transition: transform .22s ease;
                }
                nav .snl-underline:hover { color: var(--nav-hover); }
                nav .snl-underline:hover::after { transform: scaleX(1); }
                nav .snl-underline.is-active { color: var(--nav-active); }
                nav .snl-underline.is-active::after { transform: scaleX(1); background: var(--nav-active); }

                /* Highlight swipe */
                nav .snl-highlight { z-index: 0; }
                nav .snl-highlight::before {
                    content: ""; position: absolute; left: -5px; right: -5px;
                    top: 34%; bottom: 1px; background: var(--nav-pill);
                    border-radius: 3px; z-index: -1;
                    transform: scaleX(0); transform-origin: left;
                    transition: transform .2s ease;
                }
                nav .snl-highlight:hover { color: var(--nav-hover); }
                nav .snl-highlight:hover::before,
                nav .snl-highlight.is-active::before { transform: scaleX(1); }

                /* Pill fill */
                nav .snl-pill { padding: 7px 14px; border-radius: 999px; }
                nav .snl-pill:hover,
                nav .snl-pill.is-active { background: var(--nav-pill); color: var(--nav-hover); }

                /* Lift */
                nav .snl-lift:hover { transform: translateY(-3px); color: var(--nav-hover); }

                /* Scale up */
                nav .snl-scale:hover { transform: scale(1.14); color: var(--nav-hover); }

                /* Wiggle */
                @keyframes snl-wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-7deg); }
                    75% { transform: rotate(7deg); }
                }
                nav .snl-wiggle:hover { animation: snl-wiggle .4s ease; color: var(--nav-hover); }

                /* CTA hover polish */
                nav .snl-cta { transition: transform .15s ease; }
                nav .snl-cta:hover { transform: translateY(-1px); }

                /* Burger button + bars */
                nav .sticky-nav-burger {
                    display: none; position: relative;
                    width: 30px; height: 22px;
                    background: transparent; border: none; cursor: pointer; padding: 0;
                }
                nav .snb-bar {
                    position: absolute; left: 3px; width: 24px; height: 2.5px;
                    background: var(--nav-link); border-radius: 2px;
                    transition: transform .3s cubic-bezier(.6,.05,.3,1),
                                opacity .2s ease, top .3s ease;
                }
                nav .snb-top { top: 3px; }
                nav .snb-mid { top: 10px; }
                nav .snb-bot { top: 17px; }
                nav .sticky-nav-burger.is-open .snb-top { top: 10px; transform: rotate(45deg); }
                nav .sticky-nav-burger.is-open .snb-mid { opacity: 0; transform: scaleX(0); }
                nav .sticky-nav-burger.is-open .snb-bot { top: 10px; transform: rotate(-45deg); }

                /* Mobile dropdown.
                   Absolutely positioned under the bar so the bar keeps a constant
                   height whether the menu is open or closed: expanding it overlays
                   the page instead of pushing the sections down.
                   Negative left/right offsets pull it out to the bar's OUTER edge so
                   its side borders line up with the bar's when Full border is on. */
                nav .sticky-nav-mobile {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: calc(0px - var(--nav-bw));
                    right: calc(0px - var(--nav-bw));
                    z-index: 999;
                    overflow: hidden;
                    box-sizing: border-box;
                    max-height: 0; opacity: 0; pointer-events: none;
                    background: var(--menu-bg);
                    backdrop-filter: var(--menu-blur);
                    -webkit-backdrop-filter: var(--menu-blur);
                    border-left: var(--nav-border);
                    border-right: var(--nav-border);
                    border-bottom: var(--nav-border-bottom);
                    border-bottom-left-radius: var(--nav-radius);
                    border-bottom-right-radius: var(--nav-radius);
                    box-shadow: var(--nav-shadow);
                    transition: max-height .34s ease, opacity .25s ease;
                }
                nav .sticky-nav-mobile.is-open {
                    max-height: 70vh; opacity: 1; pointer-events: auto;
                }
                nav .sticky-nav-mobile-inner {
                    display: flex; flex-direction: column; gap: 4px;
                    padding: 8px 24px 22px;
                    box-sizing: border-box; width: 100%;
                }
                nav .snl-m {
                    color: var(--nav-link); font-size: calc(var(--nav-link-size) + 2px);
                    font-weight: 500; text-decoration: none; padding: 11px 2px;
                    border-bottom: 1px dashed var(--nav-link);
                    opacity: 0; transform: translateY(-6px);
                    transition: opacity .25s ease, transform .25s ease, color .15s ease;
                }
                nav .sticky-nav-mobile.is-open .snl-m { opacity: 1; transform: translateY(0); }
                nav .snl-m:hover { color: var(--nav-hover); }
                nav .snl-m.is-active { color: var(--nav-active); }
                nav .snl-m-cta {
                    margin-top: 14px; text-align: center; color: #1C1B22;
                    font-weight: 600; border-radius: 999px; padding: 13px 18px;
                    border-bottom: none;
                }

                @media (max-width: 809px) {
                    nav .sticky-nav-links { display: none !important; }
                    nav .sticky-nav-burger { display: block !important; }
                    nav .sticky-nav-mobile { display: block !important; }
                    nav .sticky-nav-right { gap: 12px; }
                    nav .sn-loc-btn { padding: 6px 9px; gap: 6px; }

                    /* While open, the bar drops its bottom corners, bottom border and
                       drop shadow so nothing draws a seam between it and the panel. */
                    nav .sticky-nav-bar.is-open {
                        border-bottom-left-radius: 0 !important;
                        border-bottom-right-radius: 0 !important;
                        border-bottom-color: transparent !important;
                        box-shadow: none !important;
                    }

                }

                @media (prefers-reduced-motion: reduce) {
                    nav .sn-loc-menu { animation: none; }
                }
            
                /* Entrance: the bar settles down into place. Fill mode is
                   backwards so the transform releases to the stylesheet once the
                   animation ends — the auto-hide translate must still win. */
                @keyframes sn-enter {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                nav .sticky-nav-bar { animation: sn-enter .55s cubic-bezier(.22, 1, .36, 1) .08s backwards; }
                nav .snl:active, nav .snl-m:active, nav .snl-cta:active { transform: translateY(1px); }
                @media (prefers-reduced-motion: reduce) {
                    nav .sticky-nav-bar { animation: none; }
                }
            `}</style>
        </nav>
    )
}

function GlobeIcon({ size, stroke }: { size: number; stroke: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
            style={{ flexShrink: 0, display: "block" }}
        >
            <circle cx={12} cy={12} r={9.5} />
            <ellipse cx={12} cy={12} rx={4.2} ry={9.5} />
            <path d="M2.9 8.6h18.2M2.9 15.4h18.2" />
        </svg>
    )
}

function hexToRgba(hex: string, alpha: number): string {
    if (typeof hex !== "string" || !hex.startsWith("#")) return hex
    const m = hex.replace("#", "")
    const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m
    const r = parseInt(full.slice(0, 2), 16)
    const g = parseInt(full.slice(2, 4), 16)
    const b = parseInt(full.slice(4, 6), 16)
    if ([r, g, b].some(Number.isNaN)) return hex
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
