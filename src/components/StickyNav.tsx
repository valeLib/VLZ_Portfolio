import { useEffect, useRef, useState } from "react"

/**
 * Retro / Y2K sticky navigation bar.
 * Smooth-scrolls to #section anchors, highlights the active section,
 * and can shrink (height + width) / re-align / fade / elevate / blur on scroll.
 * Optional always-on glassmorphism (frosted translucent bar).
 * Mobile: animated burger that morphs into an X, with a vertically
 * expanding dropdown of staggered links.
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

// Ignore sub-pixel / momentum jitter when deciding scroll direction.
const DIR_THRESHOLD = 4

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
    maxWidth: 1200,
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
    overlayMaxWidth: 930,
    autoHide: false,
    autoHideDelay: 2.5,
    autoHideOffset: 120,
    menuBg: "#F2EFE9",
    menuOpacity: 1,
    menuBlur: 14,
    shadowMode: "On scroll",
    shadowDepth: 6,
    shadowRim: false,
    shadowRimColor: "#F2EFE9",
    shadowRimWidth: 0.5,
    links: [
        { label: "Work", anchor: "#work" },
        { label: "About", anchor: "#about" },
        { label: "Projects", anchor: "#projects" },
        { label: "Contact", anchor: "#contact" },
    ] as { label: string; anchor: string }[],
}

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
        style,
    } = { ...DEFAULTS, ...props }

    const [scrolled, setScrolled] = useState(false)
    const [active, setActive] = useState<string>("")
    const [menuOpen, setMenuOpen] = useState(false)
    const [retracted, setRetracted] = useState(false)
    const lastY = useRef(0)
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const stack = FONT_STACKS[font] ?? FONT_STACKS.Fredoka
    const wordmarkStack = FONT_STACKS[wordmarkFont] ?? stack
    const items: any[] = links ?? []
    const hoverSuffix = HOVER_CLASS[linkHover] ?? "color"

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 24)
            let current = ""
            for (const l of items) {
                const id = (l.anchor || "").replace(/^#/, "")
                if (!id) continue
                const el = document.getElementById(id)
                if (el && el.getBoundingClientRect().top <= 120) current = id
            }
            setActive(current)
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(items)])

    // Auto-hide: above the offset the bar is always visible; scrolling down
    // retracts it; scrolling up reveals it and arms a timer that retracts it
    // again once the scroll has been idle for autoHideDelay.
    useEffect(() => {
        const clearIdle = () => {
            if (idleTimer.current) {
                clearTimeout(idleTimer.current)
                idleTimer.current = null
            }
        }
        // barRetracted already gates on autoHide, so no reset is needed here.
        if (!autoHide) {
            clearIdle()
            return
        }
        lastY.current = window.scrollY
        const onScroll = () => {
            const y = window.scrollY
            const dy = y - lastY.current
            if (Math.abs(dy) < DIR_THRESHOLD) return
            lastY.current = y

            if (y <= autoHideOffset) {
                clearIdle()
                setRetracted(false)
                return
            }
            if (dy > 0) {
                clearIdle()
                setRetracted(true)
            } else {
                setRetracted(false)
                clearIdle()
                idleTimer.current = setTimeout(
                    () => setRetracted(true),
                    Math.max(0, autoHideDelay) * 1000
                )
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", onScroll)
            clearIdle()
        }
    }, [autoHide, autoHideDelay, autoHideOffset])

    const goTo = (anchor: string) => (e: React.MouseEvent) => {
        const id = (anchor || "").replace(/^#/, "")
        const el = document.getElementById(id)
        if (el) {
            e.preventDefault()
            el.scrollIntoView({ behavior: "smooth", block: "start" })
            setMenuOpen(false)
        }
    }

    const height = shrinkOnScroll && scrolled ? shrunkHeight : baseHeight
    // shadowMode "Always" matters in overlay mode, where the bar floats over the
    // page from the first frame with nothing else separating it from the background.
    const showShadow = elevateOnScroll && (shadowMode === "Always" || scrolled)
    // An open menu always wins: never retract the bar out from under it.
    const barRetracted = autoHide && retracted && !menuOpen
    const shrunk = shrinkWidthOnScroll && scrolled
    const navWidth = shrunk ? `${shrunkWidth}%` : "100%"
    const navOpacity = fadeOnScroll && scrolled ? scrolledOpacity : 1

    const alignMargin =
        shrunk && scrollAlign === "left"
            ? "0 auto 0 0"
            : shrunk && scrollAlign === "right"
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
        ...style,
        ...overlayOverrides,
    } as React.CSSProperties

    const barStyle = {
        position: "relative",
        width: navWidth,
        maxWidth: overlay ? `${overlayMaxWidth}px` : undefined,
        margin: alignMargin,
        boxSizing: "border-box",
        opacity: navOpacity,
        background: barBackground,
        backdropFilter: filterCss,
        WebkitBackdropFilter: filterCss,
        border: fullBorder ? borderCss : "none",
        borderBottom: fullBorder || bottomBorder ? borderCss : "none",
        borderRadius: radius,
        boxShadow: barShadow,
        transition:
            "width 0.3s ease, margin 0.3s ease, box-shadow 0.25s ease, background 0.25s ease, opacity 0.25s ease, border-color 0.2s ease, backdrop-filter 0.25s ease, border-radius 0.2s ease, transform 0.34s cubic-bezier(0.4, 0, 0.2, 1)",
    } as React.CSSProperties

    const navClass = [
        "sticky-nav",
        overlay ? "sn-overlay" : "",
        autoHide ? "sn-autohide" : "",
        barRetracted ? "is-retracted" : "",
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <nav className={navClass} style={positionerStyle}>
            <div className={`sticky-nav-bar${menuOpen ? " is-open" : ""}`} style={barStyle}>
                <div
                    style={{
                        maxWidth,
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

                    {/* Desktop links */}
                    <div
                        className="sticky-nav-links"
                        style={{ display: "flex", alignItems: "center", gap: 28 }}
                    >
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

                {/* Mobile dropdown (always mounted so it can animate open/closed) */}
                <div className={`sticky-nav-mobile${menuOpen ? " is-open" : ""}`}>
                    <div className="sticky-nav-mobile-inner" style={{ maxWidth, margin: "0 auto" }}>
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
            </div>

            {/* Scoped styles: responsive switch, hover effects, burger morph, dropdown expand */}
            <style>{`
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

                    /* While open, the bar drops its bottom corners, bottom border and
                       drop shadow so nothing draws a seam between it and the panel. */
                    nav .sticky-nav-bar.is-open {
                        border-bottom-left-radius: 0 !important;
                        border-bottom-right-radius: 0 !important;
                        border-bottom-color: transparent !important;
                        box-shadow: none !important;
                    }

                    /* Auto-hide. React only toggles .is-retracted; the translate lives
                       here so the behaviour is mobile-only without measuring in JS.
                       Travel = bar height (-100%) + its offset below the top edge
                       (--nav-top) + 24px of slack for the retro drop shadow. */
                    nav.sn-autohide.is-retracted .sticky-nav-bar {
                        transform: translateY(calc(-100% - var(--nav-top, 0px) - 24px));
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    nav.sn-autohide .sticky-nav-bar { transition-duration: .01ms; }
                }
            `}</style>
        </nav>
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
