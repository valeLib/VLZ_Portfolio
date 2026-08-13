// Unified pattern background with gradient support.

type PatternBackgroundProps = {
    patternType?: string
    bgColor?: string
    useBgGradient?: boolean
    bgGradientColors?: string[]
    bgGradientAngle?: number
    bgGradientPositions?: string
    patternColor?: string
    usePatternGradient?: boolean
    patternGradientColor2?: string
    patternGradientColor3?: string
    patternGradientAngle?: number
    patternOpacity?: number
    borderRadius?: number
    showShadow?: boolean
    checkerSize?: number
    checkerColor2?: string
    cellSize?: number
    lineWeight?: number
    dotSize?: number
    dotSpacing?: number
    diagonalAngle?: number
    stripeWidth?: number
    stripeWidth2?: number
    useTwoWidths?: boolean
    stripeGap?: number
    stripeGap2?: number
    useTwoGaps?: boolean
    stripeColor2?: string
    stripeRounded?: boolean
    wavyCellSize?: number
    wavyWeight?: number
    wavyAmplitude?: number
    wavyFrequency?: number
    showMargin?: boolean
    marginColor?: string
    marginOffset?: number
    showHoles?: boolean
    holeSide?: string
    holeCount?: number
    holeColor?: string
    holeBorder?: string
}

const DEFAULTS: Required<PatternBackgroundProps> = {
    patternType: "wavy",
    bgColor: "#f0ebe0",
    useBgGradient: false,
    bgGradientColors: ["#f0ebe0", "#d4c8f0"],
    bgGradientAngle: 135,
    bgGradientPositions: "0, 100",
    patternColor: "#6b8cba",
    usePatternGradient: false,
    patternGradientColor2: "#b8a9f0",
    patternGradientColor3: "",
    patternGradientAngle: 90,
    patternOpacity: 0.7,
    borderRadius: 0,
    showShadow: false,
    checkerSize: 12,
    checkerColor2: "#4F58AF",
    cellSize: 24,
    lineWeight: 0.8,
    dotSize: 2,
    dotSpacing: 16,
    diagonalAngle: 45,
    stripeWidth: 20,
    stripeWidth2: 8,
    useTwoWidths: false,
    stripeGap: 20,
    stripeGap2: 20,
    useTwoGaps: false,
    stripeColor2: "#f5eee6",
    stripeRounded: false,
    wavyCellSize: 50,
    wavyWeight: 1.2,
    wavyAmplitude: 4,
    wavyFrequency: 1,
    showMargin: false,
    marginColor: "#EE978E",
    marginOffset: 64,
    showHoles: false,
    holeSide: "left",
    holeCount: 3,
    holeColor: "#f0ece4",
    holeBorder: "#c8bfb0",
}

export default function PatternBackground(props: PatternBackgroundProps) {
    const {
        patternType, bgColor,
        useBgGradient, bgGradientColors, bgGradientAngle, bgGradientPositions,
        patternColor, usePatternGradient, patternGradientColor2, patternGradientColor3, patternGradientAngle,
        patternOpacity,
        borderRadius, showShadow,
        checkerSize, checkerColor2,
        cellSize, lineWeight,
        dotSize, dotSpacing, diagonalAngle,
        stripeWidth, stripeWidth2, useTwoWidths,
        stripeGap, stripeGap2, useTwoGaps,
        stripeColor2, stripeRounded,
        wavyCellSize, wavyWeight, wavyAmplitude, wavyFrequency,
        showMargin, marginColor, marginOffset,
        showHoles, holeSide, holeCount, holeColor, holeBorder,
    } = { ...DEFAULTS, ...props }

    const isWavy = patternType === "wavy"
    const isStripeV = patternType === "stripes-v"
    const isStripeH = patternType === "stripes-h"
    const isStripe = isStripeV || isStripeH
    const isChecker = patternType === "checker"
    const shadow = showShadow ? "0 4px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.08)" : "none"

    // ── Background CSS value ──────────────────────────────────────────────────
    const buildBgCss = (): string => {
        if (!useBgGradient || !bgGradientColors || bgGradientColors.length < 2) return bgColor
        const positions = (bgGradientPositions || "")
            .split(",")
            .map(s => s.trim())
            .filter(s => s !== "")
        const stops = bgGradientColors.map((c, i) => {
            const pos = positions[i] !== undefined ? ` ${positions[i]}%` : ""
            return `${c}${pos}`
        }).join(", ")
        return `linear-gradient(${bgGradientAngle}deg, ${stops})`
    }

    // ── Pattern gradient SVG def ID ───────────────────────────────────────────
    const uid = `pat-${patternType}-${patternColor.replace(/[^a-z0-9]/gi, "")}-${cellSize}-${wavyCellSize}`
    const gradId = `${uid}-grad`

    // Pattern fill: either a solid color or a gradient url()
    const patternFill = usePatternGradient ? `url(#${gradId})` : patternColor

    // Build CSS gradient string for pattern (for SVG linearGradient)
    const pgStops = [
        { color: patternColor, offset: "0%" },
        { color: patternGradientColor2, offset: "50%" },
        ...(patternGradientColor3 ? [{ color: patternGradientColor3, offset: "100%" }] : []),
    ]
    if (!patternGradientColor3) {
        pgStops[1].offset = "100%"
    }

    const bgCss = buildBgCss()
    const effectiveBg = isChecker ? checkerColor2 : isStripe ? stripeColor2 : bgCss

    // ── SVG gradient definition ───────────────────────────────────────────────
    const angleToVec = (deg: number) => {
        const rad = ((deg - 90) * Math.PI) / 180
        const x2 = Math.round((0.5 + Math.cos(rad) * 0.5) * 1000) / 1000
        const y2 = Math.round((0.5 + Math.sin(rad) * 0.5) * 1000) / 1000
        const x1 = 1 - x2
        const y1 = 1 - y2
        return { x1, y1, x2, y2 }
    }
    const pgVec = angleToVec(patternGradientAngle)

    const PatternGradientDef = usePatternGradient ? (
        <linearGradient id={gradId} x1={pgVec.x1} y1={pgVec.y1} x2={pgVec.x2} y2={pgVec.y2}>
            {pgStops.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={patternOpacity} />
            ))}
        </linearGradient>
    ) : null

    // ── Wavy grid ─────────────────────────────────────────────────────────────
    const buildWavyGrid = () => {
        const cs = wavyCellSize
        const amp = wavyAmplitude
        const freq = wavyFrequency
        const w = wavyWeight
        const steps = 80
        const TW = cs * 3
        const TH = cs * 3

        const wavyH = (y: number): string => {
            let d = `M 0 ${y}`
            for (let i = 1; i <= steps; i++) {
                const x = (i / steps) * TW
                d += ` L ${x} ${y + Math.sin((x / cs) * freq * Math.PI * 2) * amp}`
            }
            return d
        }
        const wavyV = (x: number): string => {
            let d = `M ${x} 0`
            for (let i = 1; i <= steps; i++) {
                const y = (i / steps) * TH
                d += ` L ${x + Math.sin((y / cs) * freq * Math.PI * 2) * amp} ${y}`
            }
            return d
        }

        const paths: React.ReactNode[] = []
        let k = 0
        for (let r = 0; r <= 3; r++) paths.push(<path key={k++} d={wavyH(r * cs)} fill="none" stroke={patternFill} strokeWidth={w} strokeLinecap="round" opacity={usePatternGradient ? 1 : patternOpacity} />)
        for (let c = 0; c <= 3; c++) paths.push(<path key={k++} d={wavyV(c * cs)} fill="none" stroke={patternFill} strokeWidth={w} strokeLinecap="round" opacity={usePatternGradient ? 1 : patternOpacity} />)

        return (
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    {PatternGradientDef}
                    <pattern id={uid} x="0" y="0" width={TW} height={TH} patternUnits="userSpaceOnUse">{paths}</pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${uid})`} />
            </svg>
        )
    }

    // ── Standard patterns ─────────────────────────────────────────────────────
    const w1 = stripeWidth
    const w2 = useTwoWidths ? stripeWidth2 : stripeWidth
    const g1 = stripeGap
    const g2 = useTwoGaps ? stripeGap2 : stripeGap
    const tileSize = w1 + g1 + w2 + g2
    const rx = stripeRounded ? Math.min(w1, w2) / 2 : 0
    const op = usePatternGradient ? 1 : patternOpacity

    const buildPattern = () => {
        if (isStripeV) return { patternW: tileSize, patternH: tileSize, shapes: (<>
            <rect x="0" y="0" width={tileSize} height={tileSize} fill={stripeColor2} />
            <rect x="0" y="0" width={w1} height={tileSize} fill={patternFill} opacity={op} rx={rx} ry={rx} />
            {useTwoWidths && <rect x={w1 + g1} y="0" width={w2} height={tileSize} fill={patternFill} opacity={op} rx={rx} ry={rx} />}
        </>) }
        if (isStripeH) return { patternW: tileSize, patternH: tileSize, shapes: (<>
            <rect x="0" y="0" width={tileSize} height={tileSize} fill={stripeColor2} />
            <rect x="0" y="0" width={tileSize} height={w1} fill={patternFill} opacity={op} rx={rx} ry={rx} />
            {useTwoWidths && <rect x="0" y={w1 + g1} width={tileSize} height={w2} fill={patternFill} opacity={op} rx={rx} ry={rx} />}
        </>) }
        switch (patternType) {
            case "checker": { const s = checkerSize; return { patternW: s * 2, patternH: s * 2, shapes: (<>
                <rect x="0" y="0" width={s} height={s} fill={patternFill} opacity={op} />
                <rect x={s} y="0" width={s} height={s} fill={checkerColor2} opacity={op} />
                <rect x="0" y={s} width={s} height={s} fill={checkerColor2} opacity={op} />
                <rect x={s} y={s} width={s} height={s} fill={patternFill} opacity={op} />
            </>) } }
            case "grid": { const s = cellSize; return { patternW: s, patternH: s, shapes: (
                <path d={`M ${s} 0 L 0 0 0 ${s}`} fill="none" stroke={patternFill} strokeWidth={lineWeight} opacity={op} />
            ) } }
            case "dots": { const s = dotSpacing; return { patternW: s, patternH: s, shapes: (
                <circle cx={s / 2} cy={s / 2} r={dotSize / 2} fill={patternFill} opacity={op} />
            ) } }
            case "ruled": { const s = cellSize; return { patternW: s, patternH: s, shapes: (
                <line x1="0" y1={s} x2={s} y2={s} stroke={patternFill} strokeWidth={lineWeight} opacity={op} />
            ) } }
            case "cross": { const s = cellSize, arm = lineWeight * 2.5; return { patternW: s, patternH: s, shapes: (<>
                <line x1={s / 2} y1={s / 2 - arm} x2={s / 2} y2={s / 2 + arm} stroke={patternFill} strokeWidth={lineWeight} opacity={op} />
                <line x1={s / 2 - arm} y1={s / 2} x2={s / 2 + arm} y2={s / 2} stroke={patternFill} strokeWidth={lineWeight} opacity={op} />
            </>) } }
            case "diagonal": { const s = cellSize; return { patternW: s, patternH: s, patternTransform: `rotate(${diagonalAngle})`, shapes: (
                <line x1="0" y1="0" x2="0" y2={s} stroke={patternFill} strokeWidth={lineWeight} opacity={op} />
            ) } }
            default: return { patternW: 20, patternH: 20, shapes: null }
        }
    }

    const notebookType = patternType === "grid" || patternType === "ruled"
    const holeSpacing = 100 / (holeCount + 1)
    const holePositions = Array.from({ length: holeCount }, (_, i) => (i + 1) * holeSpacing)

    if (isWavy) {
        return (
            <div style={{ width: "100%", height: "100%", position: "relative", background: effectiveBg, borderRadius, overflow: "hidden", boxShadow: shadow, boxSizing: "border-box" }}>
                {buildWavyGrid()}
            </div>
        )
    }

    const pat = buildPattern()

    return (
        <div style={{ width: "100%", height: "100%", position: "relative", background: effectiveBg, borderRadius, overflow: "hidden", boxShadow: shadow, boxSizing: "border-box" }}>
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, display: "block", pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    {PatternGradientDef}
                    <pattern id={uid} x="0" y="0" width={pat.patternW} height={pat.patternH} patternUnits="userSpaceOnUse" patternTransform={(pat as any).patternTransform || ""}>
                        {pat.shapes}
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${uid})`} />
            </svg>

            {showMargin && notebookType && (
                <div style={{ position: "absolute", top: 0, bottom: 0, left: showHoles && holeSide === "left" ? marginOffset + 32 : marginOffset, width: 1.5, background: marginColor, opacity: 0.75, pointerEvents: "none" }} />
            )}

            {showHoles && notebookType && holePositions.map((pct, i) => {
                const s: React.CSSProperties = {
                    position: "absolute", width: 20, height: 20, borderRadius: "50%",
                    background: holeColor, border: `2px solid ${holeBorder}`,
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)", pointerEvents: "none",
                    ...(holeSide === "left" ? { left: 12, top: `${pct}%`, transform: "translateY(-50%)" } : {}),
                    ...(holeSide === "right" ? { right: 12, top: `${pct}%`, transform: "translateY(-50%)" } : {}),
                    ...(holeSide === "top" ? { top: 12, left: `${pct}%`, transform: "translateX(-50%)" } : {}),
                    ...(holeSide === "bottom" ? { bottom: 12, left: `${pct}%`, transform: "translateX(-50%)" } : {}),
                }
                return <div key={i} style={s} />
            })}
        </div>
    )
}
