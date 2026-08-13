// Project hero header: animated title, year badge, tracks line, tagline, divider,
// and Stack/Context/Role meta rows, with a staggered entrance cascade.

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"

// ── Font options (shared with PastelCard) ──────────────────────────────────
const FONT_STACKS: Record<string, string> = {
    Fredoka: "'Fredoka One', 'Fredoka', system-ui, sans-serif",
    Jua: "'Jua', system-ui, sans-serif",
    "IBM Plex Mono": "'IBM Plex Mono', 'Courier New', monospace",
    "Anonymous Pro": "'Anonymous Pro', 'Courier New', monospace",
    Caveat: "'Caveat', cursive",
    "Doppio One": "'Doppio One', system-ui, sans-serif",
    "Kantumruy Pro": "'Kantumruy Pro', system-ui, sans-serif",
    "Leckerli One": "'Leckerli One', cursive",
    "Gveret Levin": "'Gveret Levin', system-ui, sans-serif",
    System: "system-ui, -apple-system, sans-serif",
    Inherit: "inherit",
}

type DividerStyle =
    | "none"
    | "solidBar"
    | "hairline"
    | "dashed"
    | "dotted"
    | "double"
    | "wavy"
    | "pixelChecker"
    | "asciiBar"
    | "gradient"
    | "dots"

// ── Animated text wrapper (same mechanism as SectionTitle) ─────────────────
// Wraps any text node and animates its entrance per the chosen mode.
// `elementDelay` is the additional delay before THIS element starts (used to
// stagger the cascade across multiple text elements in the hero).
function AnimatedText({
    text, children,
    animation, animationDuration, staggerDelay, bounce, trigger,
    elementDelay, replayKey,
    style, asElement = "span",
}: {
    text: string
    children?: React.ReactNode
    animation: string
    animationDuration: number
    staggerDelay: number
    bounce: boolean
    trigger: string
    elementDelay: number
    replayKey: number
    style?: React.CSSProperties
    asElement?: "span" | "div" | "h1" | "p"
}) {
    if (animation === "none") {
        if (asElement === "h1") return <h1 style={style}>{children ?? text}</h1>
        if (asElement === "p")  return <p  style={style}>{children ?? text}</p>
        if (asElement === "div") return <div style={style}>{children ?? text}</div>
        return <span style={style}>{children ?? text}</span>
    }

    const useViewport = trigger === "once" || trigger === "every"
    const viewportConfig = useViewport
        ? { viewport: { once: trigger === "once", amount: 0.3 as const } }
        : {}
    const motionTrigger = useViewport
        ? { whileInView: "visible" }
        : { animate: "visible" }

    const MotionTag =
        asElement === "h1" ? motion.h1 :
        asElement === "p"  ? motion.p  :
        asElement === "div" ? motion.div :
        motion.span

    const initial = "hidden"

    // ── Whole-text animations (fade, slide, bounce) ───────────────────────
    if (animation === "fade" || animation === "slideUp" || animation === "slideDown" || animation === "bounce") {
        const hidden: any = { opacity: 0 }
        if (animation === "slideUp")   hidden.y =  20
        if (animation === "slideDown") hidden.y = -20
        if (animation === "bounce")    { hidden.y = 12; hidden.scale = 0.85 }

        const visible = { opacity: 1, y: 0, scale: 1 }

        return (
            <MotionTag
                key={replayKey}
                initial={initial}
                {...motionTrigger}
                {...viewportConfig}
                variants={{ hidden, visible }}
                transition={animation === "bounce" || bounce
                    ? { type: "spring", stiffness: 380, damping: 18, mass: 0.8, delay: elementDelay }
                    : { duration: animationDuration, ease: [0.22, 1, 0.36, 1], delay: elementDelay }}
                style={{
                    ...style,
                    display: asElement === "span" ? "inline-block" : style?.display,
                }}
            >
                {children ?? text}
            </MotionTag>
        )
    }

    // ── Per-word and per-letter staggered animations ──────────────────────
    if (animation === "wordByWord" || animation === "letterByLetter" || animation === "typewriter") {
        const isWords = animation === "wordByWord"
        const units = isWords
            ? text.split(/(\s+)/)
            : Array.from(text)

        const hidden: any = { opacity: 0 }
        if (animation === "letterByLetter") { hidden.y = 14; hidden.scale = 0.6 }
        if (animation === "wordByWord")     hidden.y = 16

        const visible = { opacity: 1, y: 0, scale: 1 }

        const containerVariants = {
            hidden: { opacity: 1 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: staggerDelay,
                    delayChildren: elementDelay,
                },
            },
        }

        const itemTransition = animation === "typewriter"
            ? { duration: 0.001 }
            : (bounce
                ? { type: "spring" as const, stiffness: 380, damping: 16, mass: 0.7 }
                : { duration: animationDuration, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] })

        return (
            <MotionTag
                key={replayKey}
                initial={initial}
                {...motionTrigger}
                {...viewportConfig}
                variants={containerVariants}
                style={{
                    ...style,
                    display: asElement === "span" ? "inline-block" : style?.display,
                }}
                aria-label={text}
            >
                {units.map((unit, i) => {
                    const isWhitespace = /^\s+$/.test(unit)
                    if (isWhitespace) {
                        return (
                            <span key={i} style={{ whiteSpace: "pre" }} aria-hidden="true">
                                {unit}
                            </span>
                        )
                    }
                    return (
                        <motion.span
                            key={i}
                            variants={{ hidden, visible }}
                            transition={itemTransition}
                            style={{
                                display: "inline-block",
                                whiteSpace: "pre",
                            }}
                            aria-hidden="true"
                        >
                            {unit}
                        </motion.span>
                    )
                })}
            </MotionTag>
        )
    }

    if (asElement === "h1") return <h1 style={style}>{children ?? text}</h1>
    if (asElement === "p")  return <p  style={style}>{children ?? text}</p>
    if (asElement === "div") return <div style={style}>{children ?? text}</div>
    return <span style={style}>{children ?? text}</span>
}

// ── Divider renderer ───────────────────────────────────────────────────────
function Divider({
    style, color, accent, thickness, marginTop, font,
}: {
    style: DividerStyle
    color: string
    accent: string
    thickness: number
    marginTop: number
    font: string
}) {
    if (style === "none") return null

    const base: React.CSSProperties = { marginTop, width: "100%" }

    switch (style) {
        case "solidBar":
            return <div style={{ ...base, height: thickness, background: color, borderRadius: 2 }}/>
        case "hairline":
            return <div style={{ ...base, height: 1, background: color, opacity: 0.7 }}/>
        case "dashed":
            return <div style={{ ...base, height: 0, borderTop: `${thickness}px dashed ${color}` }}/>
        case "dotted":
            return <div style={{ ...base, height: 0, borderTop: `${thickness}px dotted ${color}` }}/>
        case "double":
            return <div style={{ ...base, height: 0, borderTop: `${thickness + 2}px double ${color}` }}/>
        case "gradient":
            return <div style={{
                ...base,
                height: thickness,
                background: `linear-gradient(to right, ${accent}, ${color}, ${accent}00)`,
                borderRadius: thickness,
            }}/>
        case "wavy":
            return (
                <div style={{ ...base, height: thickness * 4, lineHeight: 0 }}>
                    <svg width="100%" height={thickness * 4}
                        viewBox={`0 0 200 ${thickness * 4}`}
                        preserveAspectRatio="none" style={{ display: "block" }}>
                        <path
                            d={`M 0 ${thickness * 2} q 10 -${thickness * 2}, 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0`}
                            fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round"/>
                    </svg>
                </div>
            )
        case "pixelChecker":
            return <div style={{
                ...base, height: thickness * 3,
                backgroundImage: `linear-gradient(90deg, ${color} 50%, transparent 50%)`,
                backgroundSize: `${thickness * 3 * 2}px ${thickness * 3}px`,
                backgroundRepeat: "repeat-x", backgroundPosition: "left center",
                imageRendering: "pixelated" as const,
            }}/>
        case "asciiBar":
            return <div style={{
                ...base, fontFamily: font, color,
                fontSize: thickness * 6, lineHeight: 1, letterSpacing: "-0.05em",
                whiteSpace: "nowrap" as const, overflow: "hidden",
                fontWeight: 700, userSelect: "none" as const,
            }}>{"─".repeat(120)}</div>
        case "dots":
            return (
                <div style={{
                    ...base, display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    height: thickness * 3, overflow: "hidden",
                }}>
                    {Array.from({ length: 24 }).map((_, i) => (
                        <span key={i} style={{
                            width: thickness * 1.5, height: thickness * 1.5,
                            borderRadius: "50%",
                            background: i % 4 === 0 ? accent : color,
                            opacity: i % 4 === 0 ? 1 : 0.6, flexShrink: 0,
                        }}/>
                    ))}
                </div>
            )
        default:
            return null
    }
}

type HeroSectionProps = {
    title?: string
    year?: string
    tracks?: string
    tagline?: string
    stack?: string
    context?: string
    role?: string
    showBackLink?: boolean
    backLinkText?: string
    backLink?: string
    backLinkOpenInNewTab?: boolean
    showTracks?: boolean
    showYear?: boolean
    yearPosition?: "inline-right" | "left" | "above-title"
    showTagline?: boolean
    showStack?: boolean
    stackLabel?: string
    showContext?: boolean
    contextLabel?: string
    showRole?: boolean
    roleLabel?: string
    dividerStyle?: DividerStyle
    dividerThickness?: number
    dividerColor?: string
    dividerMarginTop?: number
    accentColor?: string
    inkColor?: string
    mutedColor?: string
    bgColor?: string
    paddingTop?: number
    paddingBottom?: number
    paddingX?: number
    maxWidth?: number
    titleFont?: string
    titleWeight?: string
    titleSize?: number
    titleColor?: string
    titleLineHeight?: number
    trackFont?: string
    trackSize?: number
    yearFont?: string
    yearWeight?: string
    yearSize?: number
    yearTextColor?: string
    yearPaddingH?: number
    yearPaddingV?: number
    yearBorderRadius?: number
    yearBorderWidth?: number
    yearShadowOffset?: number
    taglineFont?: string
    taglineSize?: number
    taglineColor?: string
    metaFont?: string
    metaSize?: number
    animation?: string
    animationTrigger?: string
    animationDuration?: number
    staggerDelay?: number
    elementStagger?: number
    bounce?: boolean
}

const DEFAULTS: Required<HeroSectionProps> = {
    title: "Pawstchi",
    year: "2026",
    tracks: "Game, Unity, UX, UI",
    tagline: "Hybrid casual mobile game combining match-3 puzzles with a virtual pixel-art robot cat.",
    stack: "Unity, Figma, UX Research, Pixel Art, Accessibility",
    context: "Academic UX project, Universidad Europea de Madrid, 2025-26",
    role: "UX Designer, Game Designer",
    showBackLink: true,
    backLinkText: "All projects",
    backLink: "",
    backLinkOpenInNewTab: false,
    showTracks: true,
    showYear: true,
    yearPosition: "inline-right",
    showTagline: true,
    showStack: true,
    stackLabel: "Stack",
    showContext: true,
    contextLabel: "Type",
    showRole: true,
    roleLabel: "Role",
    dividerStyle: "solidBar",
    dividerThickness: 3,
    dividerColor: "#1a1520",
    dividerMarginTop: 24,
    accentColor: "#EE978E",
    inkColor: "#1a1520",
    mutedColor: "#6b6580",
    bgColor: "rgba(0,0,0,0)",
    paddingTop: 32,
    paddingBottom: 24,
    paddingX: 24,
    maxWidth: 760,
    titleFont: "Fredoka",
    titleWeight: "700",
    titleSize: 56,
    titleColor: "#1a1520",
    titleLineHeight: 1.1,
    trackFont: "IBM Plex Mono",
    trackSize: 11,
    yearFont: "IBM Plex Mono",
    yearWeight: "700",
    yearSize: 11,
    yearTextColor: "#1a1520",
    yearPaddingH: 10,
    yearPaddingV: 4,
    yearBorderRadius: 4,
    yearBorderWidth: 1.5,
    yearShadowOffset: 2,
    taglineFont: "Caveat",
    taglineSize: 18,
    taglineColor: "#4F58AF",
    metaFont: "IBM Plex Mono",
    metaSize: 12,
    animation: "none",
    animationTrigger: "once",
    animationDuration: 0.6,
    staggerDelay: 0.04,
    elementStagger: 0.1,
    bounce: false,
}

export default function HeroSection(props: HeroSectionProps) {
    const {
        title, year, tracks, tagline, stack, context, role,
        showBackLink, backLinkText, backLink, backLinkOpenInNewTab,
        showTracks, showYear, yearPosition, showTagline,
        showStack, stackLabel, showContext, contextLabel,
        showRole, roleLabel,
        dividerStyle, dividerThickness, dividerColor, dividerMarginTop,
        accentColor, inkColor, mutedColor, bgColor,
        paddingTop, paddingBottom, paddingX, maxWidth,
        titleFont, titleWeight, titleSize, titleColor, titleLineHeight,
        trackFont, trackSize,
        yearFont, yearWeight, yearSize, yearTextColor, yearPaddingH, yearPaddingV,
        yearBorderRadius, yearBorderWidth, yearShadowOffset,
        taglineFont, taglineSize, taglineColor,
        metaFont, metaSize,
        animation, animationTrigger, animationDuration, staggerDelay, elementStagger, bounce,
    } = { ...DEFAULTS, ...props }

    const ffTitle = FONT_STACKS[titleFont] ?? "inherit"
    const ffTrack = FONT_STACKS[trackFont] ?? "inherit"
    const ffYear = FONT_STACKS[yearFont] ?? "inherit"
    const ffTagline = FONT_STACKS[taglineFont] ?? "inherit"
    const ffMeta = FONT_STACKS[metaFont] ?? "inherit"

    const trackItems = (tracks || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    const trackText = trackItems.join(" — ").toUpperCase()

    let cascadeIndex = 0
    const nextDelay = () => {
        const d = cascadeIndex * elementStagger
        cascadeIndex++
        return d
    }
    const backLinkDelay = showBackLink ? nextDelay() : 0
    const tracksDelay   = (showTracks && trackText) ? nextDelay() : 0
    const yearDelay     = (showYear && year) ? nextDelay() : 0
    const titleDelay    = title ? nextDelay() : 0
    const taglineDelay  = (showTagline && tagline) ? nextDelay() : 0
    const stackDelay    = (showStack && stack) ? nextDelay() : 0
    const contextDelay  = (showContext && context) ? nextDelay() : 0
    const roleDelay     = (showRole && role) ? nextDelay() : 0

    const [replayKey, setReplayKey] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        setReplayKey(k => k + 1)
    }, [title, year, tracks, tagline, stack, context, role,
        animation, animationDuration, staggerDelay, elementStagger, bounce])

    useEffect(() => {
        if (animationTrigger === "loop" && animation !== "none") {
            const intervalMs = Math.max(1500, (animationDuration + staggerDelay * 20 + elementStagger * 8 + 1) * 1000)
            intervalRef.current = setInterval(() => setReplayKey(k => k + 1), intervalMs)
            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current)
            }
        }
    }, [animationTrigger, animation, animationDuration, staggerDelay, elementStagger])

    const animProps = {
        animation, animationDuration, staggerDelay, bounce,
        trigger: animationTrigger, replayKey,
    }

    const yearBadge =
        showYear && year ? (
            <AnimatedText
                {...animProps}
                elementDelay={yearDelay}
                text={year}
                asElement="span"
                style={{
                    fontFamily: ffYear,
                    fontSize: yearSize,
                    fontWeight: yearWeight as any,
                    color: yearTextColor,
                    background: accentColor,
                    padding: `${yearPaddingV}px ${yearPaddingH}px`,
                    borderRadius: yearBorderRadius,
                    border: `${yearBorderWidth}px solid ${inkColor}`,
                    boxShadow:
                        yearShadowOffset > 0
                            ? `${yearShadowOffset}px ${yearShadowOffset}px 0 ${inkColor}`
                            : "none",
                    letterSpacing: "0.06em",
                    display: "inline-block",
                    whiteSpace: "nowrap" as const,
                    lineHeight: 1.2,
                }}
            />
        ) : null

    const inlineRowVisible =
        (showTracks && trackText) ||
        (yearPosition === "inline-right" && yearBadge)

    const metaRowStyle: React.CSSProperties = {
        fontFamily: ffMeta,
        fontSize: metaSize,
        color: mutedColor,
        lineHeight: 1.6,
        marginBottom: 4,
    }
    const metaLabelStyle: React.CSSProperties = {
        fontWeight: 700,
        color: inkColor,
    }

    return (
        <div
            style={{
                width: "100%",
                background: bgColor,
                padding: `${paddingTop}px ${paddingX}px ${paddingBottom}px`,
                boxSizing: "border-box",
                fontFamily: ffMeta,
            }}
        >
            <div
                style={{
                    maxWidth,
                    margin: "0 auto",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                {/* ── Back link ── */}
                {showBackLink && (
                    <div style={{ marginBottom: 24 }}>
                        <AnimatedText
                            {...animProps}
                            elementDelay={backLinkDelay}
                            text={`← ${backLinkText}`}
                            asElement="span"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <a
                                href={typeof backLink === "string" && backLink ? backLink : "#"}
                                target={backLinkOpenInNewTab ? "_blank" : undefined}
                                rel={backLinkOpenInNewTab ? "noopener noreferrer" : undefined}
                                style={{
                                    fontFamily: ffMeta,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: mutedColor,
                                    textDecoration: "none",
                                    letterSpacing: "0.06em",
                                }}
                            >
                                ← {backLinkText}
                            </a>
                        </AnimatedText>
                    </div>
                )}

                {/* ── Year above title ── */}
                {yearPosition === "above-title" && yearBadge && (
                    <div style={{ marginBottom: 12 }}>{yearBadge}</div>
                )}

                {/* ── Track + Year inline row ── */}
                {inlineRowVisible && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap" as const,
                            gap: 8,
                            marginBottom: 10,
                        }}
                    >
                        {showTracks && trackText ? (
                            <AnimatedText
                                {...animProps}
                                elementDelay={tracksDelay}
                                text={trackText}
                                asElement="span"
                                style={{
                                    fontFamily: ffTrack,
                                    fontSize: trackSize,
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase" as const,
                                    color: accentColor,
                                }}
                            />
                        ) : (
                            <span />
                        )}
                        {yearPosition === "inline-right" && yearBadge}
                    </div>
                )}

                {/* ── Year on the left ── */}
                {yearPosition === "left" && yearBadge && (
                    <div style={{ marginBottom: 12 }}>{yearBadge}</div>
                )}

                {/* ── Title ── */}
                {title && (
                    <AnimatedText
                        {...animProps}
                        elementDelay={titleDelay}
                        text={title}
                        asElement="h1"
                        style={{
                            fontFamily: ffTitle,
                            fontSize: titleSize,
                            fontWeight: titleWeight as any,
                            color: titleColor,
                            lineHeight: titleLineHeight,
                            margin: "0 0 12px 0",
                            letterSpacing: "-0.01em",
                        }}
                    />
                )}

                {/* ── Tagline ── */}
                {showTagline && tagline && (
                    <AnimatedText
                        {...animProps}
                        elementDelay={taglineDelay}
                        text={tagline}
                        asElement="p"
                        style={{
                            fontFamily: ffTagline,
                            fontSize: taglineSize,
                            color: taglineColor,
                            lineHeight: 1.5,
                            margin: "0 0 12px 0",
                            fontWeight: 700,
                            fontStyle: "italic",
                        }}
                    />
                )}

                {/* ── Stack ── */}
                {showStack && stack && (
                    <AnimatedText
                        {...animProps}
                        elementDelay={stackDelay}
                        text={`${stackLabel}: ${stack}`}
                        asElement="div"
                        style={metaRowStyle}
                    >
                        <span style={metaLabelStyle}>{stackLabel}: </span>
                        {stack}
                    </AnimatedText>
                )}

                {/* ── Context ── */}
                {showContext && context && (
                    <AnimatedText
                        {...animProps}
                        elementDelay={contextDelay}
                        text={`${contextLabel}: ${context}`}
                        asElement="div"
                        style={metaRowStyle}
                    >
                        <span style={metaLabelStyle}>{contextLabel}: </span>
                        {context}
                    </AnimatedText>
                )}

                {/* ── Role ── */}
                {showRole && role && (
                    <AnimatedText
                        {...animProps}
                        elementDelay={roleDelay}
                        text={`${roleLabel}: ${role}`}
                        asElement="div"
                        style={metaRowStyle}
                    >
                        <span style={metaLabelStyle}>{roleLabel}: </span>
                        {role}
                    </AnimatedText>
                )}

                {/* ── Divider ── */}
                <Divider
                    style={dividerStyle}
                    color={dividerColor}
                    accent={accentColor}
                    thickness={dividerThickness}
                    marginTop={dividerMarginTop}
                    font={ffMeta}
                />
            </div>
        </div>
    )
}
