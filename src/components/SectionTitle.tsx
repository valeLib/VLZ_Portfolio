// SectionTitle.tsx
// Section heading with optional dot, optional label (kicker), title, and line/border.
// Ported from Framer: framer imports + addPropertyControls removed, RenderTarget canvas
// gate collapsed (isCanvas = false), DEFAULTS merge.

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"

// ── Animated title sub-component ──────────────────────────────────────────
function AnimatedTitle({
    text, ff, fontSize, fontWeight, titleColor, letterSpacing, textTransform,
    animation, animationDuration, staggerDelay, bounce, trigger, replayKey,
}: {
    text: string
    ff: string
    fontSize: number
    fontWeight: number
    titleColor: string
    letterSpacing: number
    textTransform: string
    animation: string
    animationDuration: number
    staggerDelay: number
    bounce: boolean
    trigger: string
    replayKey: number
}) {
    const baseStyle: React.CSSProperties = {
        fontFamily: ff,
        fontSize,
        fontWeight,
        color: titleColor,
        letterSpacing: `${letterSpacing}em`,
        textTransform: textTransform as any,
        lineHeight: 1.2,
        whiteSpace: "nowrap" as const,
        flexShrink: 0,
    }

    if (animation === "none") {
        return <span style={baseStyle}>{text}</span>
    }

    const isCanvas = false
    const useViewport = !isCanvas && (trigger === "once" || trigger === "every")
    const viewportConfig = useViewport
        ? { viewport: { once: trigger === "once", amount: 0.3 as const } }
        : {}
    const motionTrigger = useViewport
        ? { whileInView: "visible" }
        : { animate: "visible" }
    const initial = isCanvas ? "visible" : "hidden"

    // ── Whole-text animations (fade, slide, bounce) ───────────────────────
    if (animation === "fade" || animation === "slideUp" || animation === "slideDown" || animation === "bounce") {
        const hidden: any = { opacity: 0 }
        if (animation === "slideUp") hidden.y = 20
        if (animation === "slideDown") hidden.y = -20
        if (animation === "bounce") { hidden.y = 12; hidden.scale = 0.85 }

        const visible = { opacity: 1, y: 0, scale: 1 }

        return (
            <motion.span
                key={replayKey}
                initial={initial}
                {...motionTrigger}
                {...viewportConfig}
                variants={{ hidden, visible }}
                transition={animation === "bounce" || bounce
                    ? { type: "spring", stiffness: 380, damping: 18, mass: 0.8 }
                    : { duration: animationDuration, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    ...baseStyle,
                    display: "inline-block",
                }}
            >
                {text}
            </motion.span>
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
        if (animation === "wordByWord") hidden.y = 16

        const visible = { opacity: 1, y: 0, scale: 1 }

        const containerVariants = {
            hidden: { opacity: 1 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: staggerDelay,
                    delayChildren: 0,
                },
            },
        }

        const itemTransition = animation === "typewriter"
            ? { duration: 0.001 }
            : (bounce
                ? { type: "spring" as const, stiffness: 380, damping: 16, mass: 0.7 }
                : { duration: animationDuration, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] })

        return (
            <motion.span
                key={replayKey}
                initial={initial}
                {...motionTrigger}
                {...viewportConfig}
                variants={containerVariants}
                style={{
                    ...baseStyle,
                    display: "inline-block",
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
            </motion.span>
        )
    }

    return <span style={baseStyle}>{text}</span>
}

type SectionTitleProps = {
    title?: string
    layout?: string
    showLabel?: boolean
    label?: string
    labelPosition?: string
    labelColor?: string
    labelSize?: number
    labelSpacing?: number
    labelTransform?: string
    showDot?: boolean
    dotStyle?: string
    dotColor?: string
    dotSize?: number
    dotBorderColor?: string
    dotBorderWidth?: number
    dotShadowColor?: string
    dotShadowX?: number
    dotShadowY?: number
    dotGap?: number
    fontFamily?: string
    fontSize?: number
    fontWeight?: number
    titleColor?: string
    letterSpacing?: number
    textTransform?: string
    showBorder?: boolean
    borderColor?: string
    borderWidth?: number
    borderStyle?: string
    lineColor?: string
    lineColor2?: string
    lineThickness?: number
    lineGap?: number
    lineGapBelow?: number
    labelGap?: number
    paddingBottom?: number
    animation?: string
    animationDuration?: number
    staggerDelay?: number
    bounce?: boolean
    animationTrigger?: string
}

const DEFAULTS: Required<SectionTitleProps> = {
    title: "Core Game Loop",
    layout: "inline-line",
    showLabel: false,
    label: "Section",
    labelPosition: "above",
    labelColor: "#4F58AF",
    labelSize: 10,
    labelSpacing: 0.1,
    labelTransform: "uppercase",
    showDot: true,
    dotStyle: "shadow",
    dotColor: "#EE978E",
    dotSize: 12,
    dotBorderColor: "#1a1520",
    dotBorderWidth: 1.5,
    dotShadowColor: "#1a1520",
    dotShadowX: 2.5,
    dotShadowY: 2.5,
    dotGap: 10,
    fontFamily: "fredoka",
    fontSize: 22,
    fontWeight: 700,
    titleColor: "#1a1520",
    letterSpacing: 0,
    textTransform: "none",
    showBorder: true,
    borderColor: "#1a1520",
    borderWidth: 3,
    borderStyle: "solid",
    lineColor: "#EE978E",
    lineColor2: "transparent",
    lineThickness: 1.5,
    lineGap: 12,
    lineGapBelow: 8,
    labelGap: 4,
    paddingBottom: 0,
    animation: "none",
    animationDuration: 0.6,
    staggerDelay: 0.04,
    bounce: false,
    animationTrigger: "once",
}

export default function SectionTitle(props: SectionTitleProps) {
    const {
        title, layout,
        showLabel, label, labelPosition, labelColor, labelSize, labelSpacing, labelTransform,
        showDot, dotStyle, dotColor, dotSize,
        dotBorderColor, dotBorderWidth,
        dotShadowColor, dotShadowX, dotShadowY,
        dotGap,
        fontFamily, fontSize, fontWeight, titleColor, letterSpacing, textTransform,
        showBorder, borderColor, borderWidth, borderStyle,
        lineColor, lineColor2, lineThickness, lineGap, lineGapBelow,
        labelGap, paddingBottom,
        animation, animationDuration, staggerDelay, bounce, animationTrigger,
    } = { ...DEFAULTS, ...props }

    const ff =
        fontFamily === "fredoka" ? "'Fredoka', cursive" :
        fontFamily === "caveat" ? "'Caveat', cursive" :
        fontFamily === "mono" ? "'IBM Plex Mono', monospace" :
        fontFamily === "anon" ? "'Anonymous Pro', monospace" :
        fontFamily === "fascinate" ? "'Fascinate Inline', cursive" :
        fontFamily === "sans" ? "sans-serif" :
        "serif"

    const isInlineLine = layout === "inline-line"
    const isLineBelow = layout === "line-below"
    const isClassic = layout === "inline"
    const labelAbove = labelPosition === "above"
    const labelInline = labelPosition === "inline"

    const [replayKey, setReplayKey] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        setReplayKey(k => k + 1)
    }, [title, animation, animationDuration, staggerDelay, bounce])

    useEffect(() => {
        if (animationTrigger === "loop" && animation !== "none") {
            const intervalMs = Math.max(1500, (animationDuration + staggerDelay * 20 + 1) * 1000)
            intervalRef.current = setInterval(() => setReplayKey(k => k + 1), intervalMs)
            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animationTrigger, animation, animationDuration, staggerDelay])

    const dotStyles: React.CSSProperties = (() => {
        switch (dotStyle) {
            case "shadow":
                return {
                    background: dotColor,
                    border: `${dotBorderWidth}px solid ${dotBorderColor}`,
                    boxShadow: `${dotShadowX}px ${dotShadowY}px 0 ${dotShadowColor}`,
                }
            case "glow":
                return {
                    background: dotColor,
                    border: "none",
                    boxShadow: `0 0 0 3px ${dotColor}50, 0 2px 8px ${dotColor}70`,
                }
            default:
                return {
                    background: dotColor,
                    border: `${dotBorderWidth}px solid ${dotBorderColor}`,
                    boxShadow: "none",
                }
        }
    })()

    const DotEl = showDot ? (
        <div style={{
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            flexShrink: 0,
            ...dotStyles,
        }} />
    ) : null

    const LabelEl = showLabel && label ? (
        <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: labelSize,
            fontWeight: 700,
            color: labelColor,
            letterSpacing: `${labelSpacing}em`,
            textTransform: labelTransform as any,
            lineHeight: 1,
            whiteSpace: "nowrap" as const,
            flexShrink: 0,
        }}>{label}</span>
    ) : null

    const TitleEl = (
        <AnimatedTitle
            text={title}
            ff={ff}
            fontSize={fontSize}
            fontWeight={fontWeight}
            titleColor={titleColor}
            letterSpacing={letterSpacing}
            textTransform={textTransform}
            animation={animation}
            animationDuration={animationDuration}
            staggerDelay={staggerDelay}
            bounce={bounce}
            trigger={animationTrigger}
            replayKey={replayKey}
        />
    )

    const gradientLine = (
        <div style={{
            flex: 1,
            height: lineThickness,
            background: `linear-gradient(to right, ${lineColor}, ${lineColor2 || "transparent"})`,
            borderRadius: lineThickness,
        }} />
    )

    const MainRow = (
        <div style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: dotGap,
            paddingBottom: labelAbove ? paddingBottom : 0,
            borderBottom: !labelAbove && showBorder && isClassic
                ? `${borderWidth}px ${borderStyle} ${borderColor}`
                : "none",
            boxSizing: "border-box" as const,
        }}>
            {DotEl}
            {labelInline && LabelEl}
            {TitleEl}
            {isInlineLine && (
                <>
                    <div style={{ width: lineGap, flexShrink: 0 }} />
                    {gradientLine}
                </>
            )}
        </div>
    )

    const lineBelowEl = isLineBelow ? (
        <div style={{
            width: "100%",
            marginTop: lineGapBelow,
            display: "flex",
            alignItems: "center",
        }}>
            {gradientLine}
        </div>
    ) : null

    if (labelAbove && showLabel && label) {
        return (
            <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: labelGap,
                paddingBottom,
                borderBottom: showBorder && isClassic
                    ? `${borderWidth}px ${borderStyle} ${borderColor}`
                    : "none",
                boxSizing: "border-box" as const,
            }}>
                {LabelEl}
                {MainRow}
                {lineBelowEl}
            </div>
        )
    }

    if (isLineBelow) {
        return (
            <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                paddingBottom,
                boxSizing: "border-box" as const,
            }}>
                {MainRow}
                {lineBelowEl}
            </div>
        )
    }

    return MainRow
}
