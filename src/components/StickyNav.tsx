import { useEffect, useState } from "react"

/**
 * STICKY NAV
 * Retro / Y2K sticky navigation bar.
 * Smooth-scrolls to #section anchors, highlights the active section,
 * and can shrink (height + width) / re-align / fade / elevate / blur on scroll.
 * Optional always-on glassmorphism (frosted translucent bar).
 * Mobile: animated burger that morphs into an X, with a vertically
 * expanding dropdown of staggered links.
 *
 * Ported from Framer: framer imports + addPropertyControls removed,
 * RenderTarget canvas gate collapsed, defaultProps -> DEFAULTS merge (React 19).
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
        style,
    } = { ...DEFAULTS, ...props }

    const [scrolled, setScrolled] = useState(false)
    const [active, setActive] = useState<string>("")
    const [menuOpen, setMenuOpen] = useState(false)

    const stack = FONT_STACKS[font] ?? FONT_STACKS.Fredoka
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
    const showShadow = elevateOnScroll && scrolled
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

    const boxShadows: string[] = []
    if (showShadow) boxShadows.push(`0 6px 0 ${shadowColor}`)
    if (glass) boxShadows.push("inset 0 1px 0 rgba(255,255,255,0.45)")
    const barShadow = boxShadows.length ? boxShadows.join(", ") : "none"

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
        ...style,
    } as React.CSSProperties

    const barStyle = {
        width: navWidth,
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
            "width 0.3s ease, margin 0.3s ease, box-shadow 0.25s ease, background 0.25s ease, opacity 0.25s ease, border-color 0.2s ease, backdrop-filter 0.25s ease",
    } as React.CSSProperties

    return (
        <nav style={positionerStyle}>
            <div style={barStyle}>
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
                    <a
                        href="#"
                        onClick={goTo("#")}
                        style={{
                            fontWeight: 600,
                            fontSize: wordmarkSize,
                            letterSpacing: -0.5,
                            color: wordmarkColor,
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                        }}
                    >
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
                    <div className="sticky-nav-mobile-inner">
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

                /* Mobile dropdown */
                nav .sticky-nav-mobile {
                    display: none; overflow: hidden;
                    max-height: 0; opacity: 0; pointer-events: none;
                    transition: max-height .34s ease, opacity .25s ease;
                }
                nav .sticky-nav-mobile.is-open {
                    max-height: 70vh; opacity: 1; pointer-events: auto;
                }
                nav .sticky-nav-mobile-inner {
                    display: flex; flex-direction: column; gap: 4px;
                    padding: 8px 24px 22px;
                    border-bottom: 2.5px solid var(--nav-link);
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
                }

                @media (max-width: 809px) {
                    nav .sticky-nav-links { display: none !important; }
                    nav .sticky-nav-burger { display: block !important; }
                    nav .sticky-nav-mobile { display: block !important; }
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
