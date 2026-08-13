// Two-column "cause → effect" table (Design Decision | Gameplay Impact) with
// rows / cards / split modes and a ";;" / "|" text DSL for the row content.

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

// ── Font stacks (shared with PastelCard / InfoCard) ───────────────────────
const FONT_STACKS: Record<string, string> = {
    "Fredoka":       "'Fredoka', system-ui, sans-serif",
    "Jua":           "'Jua', system-ui, sans-serif",
    "IBM Plex Mono": "'IBM Plex Mono', 'Courier New', monospace",
    "Anonymous Pro": "'Anonymous Pro', 'Courier New', monospace",
    "Caveat":        "'Caveat', cursive",
    "Doppio One":    "'Doppio One', system-ui, sans-serif",
    "Kantumruy Pro": "'Kantumruy Pro', system-ui, sans-serif",
    "System":        "system-ui, -apple-system, sans-serif",
    "Inherit":       "inherit",
}

// Portfolio palette (matches the rest of the components)
const PALETTES: Record<string, string[]> = {
    portfolio: ["#D4DF68", "#8BD9C3", "#EE978E", "#FABA32", "#4F58AF"],
    pastel:    ["#fce8f3", "#e8f4fc", "#ede8fc", "#e8faf4", "#fef0e8"],
    y2k:       ["#f7a8d0", "#a8dcf0", "#d4b8f0", "#7de8c8", "#f5e870"],
    warm:      ["#f9d0a8", "#f5b98a", "#fce8c8", "#f5d4a0", "#f0c890"],
    mono:      ["#f0f0f0", "#e6e6e6", "#dcdcdc", "#d2d2d2", "#c8c8c8"],
    sunset:    ["#ffd6a5", "#fdb6c5", "#ff9aa2", "#ffb7b2", "#fbc4ab"],
    ocean:     ["#a8e8e0", "#a0d8ef", "#b8c6ff", "#cab8ff", "#a0c4ff"],
}

type Pair = {
    icon: string
    left: string
    right: string
    color?: string
}

type PairInput = {
    icon?: string
    left?: string
    right?: string
    color?: string
}

function extractIcon(text: string): { icon: string; rest: string } {
    if (!text) return { icon: "", rest: "" }
    const trimmed = text.trim()
    const firstSpace = trimmed.indexOf(" ")
    if (firstSpace === -1) return { icon: "", rest: trimmed }
    const head = trimmed.slice(0, firstSpace)
    const tail = trimmed.slice(firstSpace + 1).trim()
    if (/[^\w-.,'"!?:;()&/]/.test(head)) return { icon: head, rest: tail }
    return { icon: "", rest: trimmed }
}

// The separator is user-supplied, so it has to be neutralised before it goes
// into a RegExp — ";;" is harmless but "||" or "**" would not be.
function escapeRe(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function parseDSL(input: string, rowSep: string, colSep: string): Pair[] {
    if (!input) return []
    const col = colSep && colSep.length ? colSep : "|"
    // Newlines stay valid alongside the row separator, so content can be
    // written either way.
    const rowPattern =
        rowSep && rowSep.length ? `${escapeRe(rowSep)}|\\r?\\n` : `\\r?\\n`

    return String(input)
        .split(new RegExp(rowPattern))
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.startsWith("#"))
        .map(line => {
            const parts = line.split(col).map(p => p.trim())
            const leftRaw = parts[0] || ""
            const right = parts.slice(1).join(col).trim()
            const { icon, rest } = extractIcon(leftRaw)
            return { icon, left: rest, right }
        })
}

// Hex → rgba tint
function tintHex(hex: string, opacity: number): string {
    const m = hex.replace("#", "")
    if (m.length !== 6) return hex
    const r = parseInt(m.slice(0, 2), 16)
    const g = parseInt(m.slice(2, 4), 16)
    const b = parseInt(m.slice(4, 6), 16)
    return `rgba(${r},${g},${b},${opacity})`
}

type DecisionImpactTableProps = {
    inputMode?: string
    dslString?: string
    pairsArray?: PairInput[]
    rowSeparator?: string
    colSeparator?: string
    mode?: string
    maxWidth?: number
    showHeaders?: boolean
    leftHeader?: string
    rightHeader?: string
    showIndex?: boolean
    indexStart?: number
    indexFormat?: string
    leftColRatio?: number
    rowGap?: number
    colGap?: number
    cellPadding?: number
    surfaceColor?: string
    borderColor?: string
    borderWidth?: number
    cornerRadius?: number
    showShadow?: boolean
    shadowX?: number
    shadowY?: number
    shadowColor?: string
    leftColorMode?: string
    leftTintOpacity?: number
    colorScheme?: string
    customColors?: string[]
    arrowColor?: string
    arrowSize?: number
    eyebrowFont?: string
    eyebrowSize?: number
    eyebrowTracking?: number
    eyebrowColor?: string
    eyebrowUppercase?: boolean
    showIcon?: boolean
    iconSize?: number
    leftFont?: string
    leftWeight?: number
    leftSize?: number
    leftColor?: string
    leftLineHeight?: number
    rightFont?: string
    rightWeight?: number
    rightSize?: number
    rightColor?: string
    rightLineHeight?: number
    animate?: string
    animationTrigger?: string
    animationDuration?: number
    staggerDelay?: number
    slideDistance?: number
    bounce?: boolean
    bgColor?: string
}

const DEFAULTS: Required<DecisionImpactTableProps> = {
    inputMode: "array",
    dslString:
`🧌 Goblins are physical agents | Workers feel like part of the world, not abstract numbers. ;; ⚖️ Goblins are limited | Assigning a worker to one task means giving up another option. ;; ⏳ Build and defense phases are separated | Players plan first, then watch their decisions succeed or fail under pressure. ;; 👁️ Worker slots are visible | The player can read production and defense state directly from the scene. ;; 💰 Economy depends on assignments | Mines and farms become strategic choices because output depends on active workers.`,
    pairsArray: [
        { icon: "🧌", left: "Goblins are physical agents", right: "Workers feel like part of the world, not abstract numbers.", color: "" },
        { icon: "⚖️", left: "Goblins are limited", right: "Assigning a worker to one task means giving up another option.", color: "" },
        { icon: "⏳", left: "Build and defense phases are separated", right: "Players plan first, then watch their decisions succeed or fail under pressure.", color: "" },
        { icon: "👁️", left: "Worker slots are visible", right: "The player can read production and defense state directly from the scene.", color: "" },
        { icon: "💰", left: "Economy depends on assignments", right: "Mines and farms become strategic choices because output depends on active workers.", color: "" },
    ],
    rowSeparator: ";;",
    colSeparator: "|",
    mode: "rows",
    maxWidth: 760,
    showHeaders: true,
    leftHeader: "Design Decision",
    rightHeader: "Gameplay Impact",
    showIndex: false,
    indexStart: 1,
    indexFormat: "{n}",
    leftColRatio: 38,
    rowGap: 14,
    colGap: 12,
    cellPadding: 18,
    surfaceColor: "#fffdf8",
    borderColor: "#1a1520",
    borderWidth: 2,
    cornerRadius: 16,
    showShadow: true,
    shadowX: 5,
    shadowY: 5,
    shadowColor: "#1a1520",
    leftColorMode: "fill",
    leftTintOpacity: 0.22,
    colorScheme: "portfolio",
    customColors: ["#D4DF68", "#8BD9C3", "#EE978E", "#FABA32", "#4F58AF"],
    arrowColor: "#1a1520",
    arrowSize: 32,
    eyebrowFont: "IBM Plex Mono",
    eyebrowSize: 11,
    eyebrowTracking: 0.12,
    eyebrowColor: "#1a1520",
    eyebrowUppercase: true,
    showIcon: true,
    iconSize: 20,
    leftFont: "Fredoka",
    leftWeight: 700,
    leftSize: 18,
    leftColor: "#1a1520",
    leftLineHeight: 1.25,
    rightFont: "Anonymous Pro",
    rightWeight: 400,
    rightSize: 14,
    rightColor: "#1a1520",
    rightLineHeight: 1.6,
    animate: "slideUp",
    animationTrigger: "once",
    animationDuration: 0.5,
    staggerDelay: 0.08,
    slideDistance: 20,
    bounce: false,
    bgColor: "rgba(0,0,0,0)",
}

export default function DecisionImpactTable(props: DecisionImpactTableProps) {
    const {
        inputMode, dslString, pairsArray,
        rowSeparator, colSeparator,
        mode,
        maxWidth,
        showHeaders, leftHeader, rightHeader,
        showIndex, indexStart, indexFormat,
        leftColRatio,
        rowGap, colGap, cellPadding,
        // surface
        surfaceColor, borderColor, borderWidth, cornerRadius,
        showShadow, shadowX, shadowY, shadowColor,
        // color application
        leftColorMode, leftTintOpacity,
        colorScheme, customColors,
        // arrow (split mode)
        arrowColor, arrowSize,
        // eyebrow / headers
        eyebrowFont, eyebrowSize, eyebrowTracking, eyebrowColor, eyebrowUppercase,
        // typography
        showIcon, iconSize,
        leftFont, leftWeight, leftSize, leftColor, leftLineHeight,
        rightFont, rightWeight, rightSize, rightColor, rightLineHeight,
        // animation
        animate, animationTrigger, animationDuration, staggerDelay, slideDistance, bounce,
        bgColor,
    } = { ...DEFAULTS, ...props }

    let pairs: Pair[] = []
    if (inputMode === "string") {
        pairs = parseDSL(dslString || "", rowSeparator, colSeparator)
    } else {
        pairs = (pairsArray || []).map((p: PairInput) => {
            let icon = p.icon || ""
            let left = p.left || ""
            if (!icon && left) {
                const ex = extractIcon(left)
                icon = ex.icon
                left = ex.rest
            }
            return { icon, left, right: p.right || "", color: p.color || undefined }
        })
    }

    const total = pairs.length
    const ffEyebrow = FONT_STACKS[eyebrowFont] ?? "inherit"
    const ffLeft = FONT_STACKS[leftFont] ?? "inherit"
    const ffRight = FONT_STACKS[rightFont] ?? "inherit"

    const colors = colorScheme === "custom" && customColors?.length
        ? customColors
        : (PALETTES[colorScheme] || PALETTES.portfolio)

    const useViewport = animate !== "none" && (animationTrigger === "once" || animationTrigger === "every")
    const initialState = animate === "none" ? "visible" : "hidden"
    const motionTriggerProp: any = animate === "none"
        ? {}
        : (useViewport
            ? { whileInView: "visible", viewport: { once: animationTrigger === "once", amount: 0.2 } }
            : { animate: "visible" })

    const hidden: any = { opacity: 0 }
    if (animate === "slideUp") hidden.y = slideDistance
    else if (animate === "slideDown") hidden.y = -slideDistance
    else if (animate === "slideLeft") hidden.x = slideDistance
    else if (animate === "slideRight") hidden.x = -slideDistance
    else if (animate === "scale") hidden.scale = 0.9

    const itemVariants = { hidden, visible: { opacity: 1, x: 0, y: 0, scale: 1 } }
    const itemTransition = bounce
        ? { type: "spring" as const, stiffness: 320, damping: 18, mass: 0.9 }
        : { duration: animationDuration, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: staggerDelay } },
    }

    const [replayKey, setReplayKey] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    useEffect(() => {
        if (animationTrigger === "loop" && animate !== "none") {
            const intervalMs = Math.max(1500, (animationDuration + staggerDelay * total + 1) * 1000)
            intervalRef.current = setInterval(() => setReplayKey(k => k + 1), intervalMs)
            return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
        }
    }, [animationTrigger, animate, animationDuration, staggerDelay, total])
    useEffect(() => { setReplayKey(k => k + 1) }, [dslString, mode, animate])

    if (total === 0) {
        return (
            <div style={{
                fontFamily: ffRight, fontSize: 12, color: "#aaa", fontStyle: "italic",
                padding: "16px 0", textAlign: "center" as const,
            }}>
                No rows — add some via the properties panel.
            </div>
        )
    }

    const hardShadow = showShadow
        ? `${shadowX}px ${shadowY}px 0 ${shadowColor}`
        : "none"
    const surfaceBorder = borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none"
    const innerBorder = `${Math.max(1, borderWidth)}px solid ${borderColor}`

    // Eyebrow style (label like "DECISION 01")
    const eyebrowStyle: React.CSSProperties = {
        fontFamily: ffEyebrow,
        fontSize: eyebrowSize,
        fontWeight: 700,
        color: eyebrowColor,
        letterSpacing: `${eyebrowTracking}em`,
        textTransform: eyebrowUppercase ? ("uppercase" as const) : ("none" as const),
        lineHeight: 1.4,
    }

    // Reusable text blocks
    function LeftText({ pair }: { pair: Pair }) {
        return (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                {showIcon && pair.icon && (
                    <span style={{ fontSize: iconSize, lineHeight: 1.2, flexShrink: 0 }}>{pair.icon}</span>
                )}
                <span style={{
                    fontFamily: ffLeft,
                    fontSize: leftSize,
                    fontWeight: leftWeight,
                    color: leftColor,
                    lineHeight: leftLineHeight,
                }}>{pair.left}</span>
            </div>
        )
    }
    function RightText({ pair }: { pair: Pair }) {
        return (
            <span style={{
                fontFamily: ffRight,
                fontSize: rightSize,
                fontWeight: rightWeight,
                color: rightColor,
                lineHeight: rightLineHeight,
            }}>{pair.right}</span>
        )
    }

    const leftPct = Math.max(20, Math.min(70, leftColRatio))

    // Resolve the left-cell background based on the color application mode
    function leftBgForColor(color: string): string {
        if (leftColorMode === "fill") return color
        if (leftColorMode === "tint") return tintHex(color, leftTintOpacity)
        return "transparent" // "strip" mode — only the side accent renders
    }

    // The vertical color strip (only used in "strip" mode for rows)
    function StripAccent({ color }: { color: string }) {
        if (leftColorMode !== "strip") return null
        return (
            <div style={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: 6,
                background: color,
            }} />
        )
    }

    const formatIndex = (i: number) => {
        const n = i + indexStart
        const pad = String(n).padStart(2, "0")
        return (indexFormat || "{n}").replace("{n}", pad).replace("{i}", String(n))
    }

    // ── MODE: Rows (table) ────────────────────────────────────────────────
    function renderRows() {
        return (
            <motion.div
                key={replayKey}
                initial={initialState}
                {...motionTriggerProp}
                variants={containerVariants}
                style={{
                    border: surfaceBorder,
                    borderRadius: cornerRadius,
                    overflow: "hidden",
                    boxShadow: hardShadow,
                    background: surfaceColor,
                }}
            >
                {showHeaders && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: `${leftPct}% ${100 - leftPct}%`,
                        background: surfaceColor,
                        borderBottom: innerBorder,
                    }}>
                        <div style={{
                            padding: `${Math.max(10, cellPadding - 4)}px ${cellPadding}px`,
                            borderRight: innerBorder,
                            ...eyebrowStyle,
                        }}>{leftHeader}</div>
                        <div style={{
                            padding: `${Math.max(10, cellPadding - 4)}px ${cellPadding}px`,
                            ...eyebrowStyle,
                        }}>{rightHeader}</div>
                    </div>
                )}

                {pairs.map((pair, i) => {
                    const color = pair.color || colors[i % colors.length]
                    const leftBg = leftBgForColor(color)
                    const isLast = i === total - 1
                    return (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            transition={itemTransition}
                            style={{
                                display: "grid",
                                gridTemplateColumns: `${leftPct}% ${100 - leftPct}%`,
                                borderBottom: isLast ? "none" : innerBorder,
                            }}
                        >
                            <div style={{
                                padding: cellPadding,
                                background: leftBg,
                                borderRight: innerBorder,
                                display: "flex",
                                flexDirection: "column" as const,
                                gap: 6,
                                position: "relative",
                            }}>
                                <StripAccent color={color} />
                                <div style={{ paddingLeft: leftColorMode === "strip" ? 14 : 0 }}>
                                    {showIndex && (
                                        <div style={{ ...eyebrowStyle, marginBottom: 4 }}>{formatIndex(i)}</div>
                                    )}
                                    <LeftText pair={pair} />
                                </div>
                            </div>
                            <div style={{
                                padding: cellPadding,
                                display: "flex",
                                alignItems: "flex-start",
                                background: surfaceColor,
                            }}>
                                <RightText pair={pair} />
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>
        )
    }

    // ── MODE: Stacked cards ───────────────────────────────────────────────
    function renderCards() {
        return (
            <motion.div
                key={replayKey}
                initial={initialState}
                {...motionTriggerProp}
                variants={containerVariants}
                style={{
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: rowGap,
                }}
            >
                {pairs.map((pair, i) => {
                    const color = pair.color || colors[i % colors.length]
                    return (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            transition={itemTransition}
                            style={{
                                border: surfaceBorder,
                                borderRadius: cornerRadius,
                                overflow: "hidden",
                                boxShadow: hardShadow,
                                background: surfaceColor,
                            }}
                        >
                            {/* Decision header strip — full palette color */}
                            <div style={{
                                background: color,
                                padding: cellPadding,
                                borderBottom: innerBorder,
                                display: "flex",
                                flexDirection: "column" as const,
                                gap: 6,
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between",
                                    gap: 12,
                                }}>
                                    {showHeaders && (
                                        <span style={eyebrowStyle}>{leftHeader}</span>
                                    )}
                                    {showIndex && (
                                        <span style={{
                                            ...eyebrowStyle,
                                            opacity: 0.65,
                                        }}>{formatIndex(i)}</span>
                                    )}
                                </div>
                                <LeftText pair={pair} />
                            </div>

                            {/* Impact body — surface color */}
                            <div style={{ padding: cellPadding }}>
                                {showHeaders && (
                                    <div style={{
                                        ...eyebrowStyle,
                                        marginBottom: 8,
                                    }}>{rightHeader}</div>
                                )}
                                <RightText pair={pair} />
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>
        )
    }

    // ── MODE: Split (cards connected by → arrow) ──────────────────────────
    function renderSplit() {
        const colTemplate = `1fr ${arrowSize + 24}px 1fr`
        return (
            <motion.div
                key={replayKey}
                initial={initialState}
                {...motionTriggerProp}
                variants={containerVariants}
                style={{
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: rowGap,
                }}
            >
                {showHeaders && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: colTemplate,
                        alignItems: "center",
                        gap: colGap,
                        paddingLeft: cellPadding,
                        paddingRight: cellPadding,
                    }}>
                        <div style={eyebrowStyle}>{leftHeader}</div>
                        <div />
                        <div style={eyebrowStyle}>{rightHeader}</div>
                    </div>
                )}

                {pairs.map((pair, i) => {
                    const color = pair.color || colors[i % colors.length]
                    const leftBg = leftBgForColor(color)
                    return (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            transition={itemTransition}
                            style={{
                                display: "grid",
                                gridTemplateColumns: colTemplate,
                                alignItems: "stretch",
                                gap: colGap,
                            }}
                        >
                            {/* Left card — decision */}
                            <div style={{
                                background: leftBg,
                                border: surfaceBorder,
                                borderRadius: cornerRadius,
                                boxShadow: hardShadow,
                                padding: cellPadding,
                                display: "flex",
                                flexDirection: "column" as const,
                                gap: 6,
                                position: "relative",
                                overflow: "hidden",
                            }}>
                                <StripAccent color={color} />
                                <div style={{ paddingLeft: leftColorMode === "strip" ? 14 : 0 }}>
                                    {showIndex && (
                                        <div style={{ ...eyebrowStyle, marginBottom: 4 }}>{formatIndex(i)}</div>
                                    )}
                                    <LeftText pair={pair} />
                                </div>
                            </div>

                            {/* Arrow */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <svg width={arrowSize} height={arrowSize * 0.7} viewBox="0 0 24 16" style={{ overflow: "visible" }}>
                                    <line x1="0" y1="8" x2="18" y2="8" stroke={arrowColor} strokeWidth="2.5" strokeLinecap="round" />
                                    <polygon points="24,8 16,3 16,13" fill={arrowColor} />
                                </svg>
                            </div>

                            {/* Right card — impact */}
                            <div style={{
                                background: surfaceColor,
                                border: surfaceBorder,
                                borderRadius: cornerRadius,
                                boxShadow: hardShadow,
                                padding: cellPadding,
                                display: "flex",
                                alignItems: "center",
                            }}>
                                <RightText pair={pair} />
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>
        )
    }

    const body = (() => {
        switch (mode) {
            case "rows":  return renderRows()
            case "cards": return renderCards()
            case "split": return renderSplit()
            default:      return renderRows()
        }
    })()

    return (
        <div style={{
            width: "100%",
            maxWidth,
            margin: "0 auto",
            background: bgColor,
            boxSizing: "border-box" as const,
            fontFamily: ffRight,
        }}>
            {body}
        </div>
    )
}
