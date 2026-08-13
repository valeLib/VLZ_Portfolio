// Notebook paper background with grid, dot, ruled, or cross patterns.
// Paper: solid color OR multi-stop gradient (up to 5 stops, angle, positions).
// Grid: solid color OR 2–3 color gradient.

type NotebookBackgroundProps = {
    paperColor?: string
    usePaperGradient?: boolean
    paperGradientColors?: string[]
    paperGradientAngle?: number
    paperGradientPositions?: string
    gridType?: string
    gridColor?: string
    useGridGradient?: boolean
    gridGradientColor2?: string
    gridGradientColor3?: string
    gridGradientAngle?: number
    gridOpacity?: number
    gridSize?: number
    gridWeight?: number
    showMargin?: boolean
    marginColor?: string
    marginOffset?: number
    showHoles?: boolean
    holeColor?: string
    holeBorder?: string
    holeCount?: number
    holeSide?: string
    showShadow?: boolean
    borderRadius?: number
}

const DEFAULTS: Required<NotebookBackgroundProps> = {
    paperColor: "#F1EEE8",
    usePaperGradient: false,
    paperGradientColors: ["#f5eee6", "#e8d4f0"],
    paperGradientAngle: 135,
    paperGradientPositions: "",
    gridType: "grid",
    gridColor: "#b8c4b0",
    useGridGradient: false,
    gridGradientColor2: "#b8a9f0",
    gridGradientColor3: "",
    gridGradientAngle: 90,
    gridOpacity: 0.6,
    gridSize: 28,
    gridWeight: 3,
    showMargin: false,
    marginColor: "#EE978E",
    marginOffset: 64,
    showHoles: false,
    holeColor: "#f0ece4",
    holeBorder: "#c8bfb0",
    holeCount: 3,
    holeSide: "left",
    showShadow: false,
    borderRadius: 0,
}

export default function NotebookBackground(props: NotebookBackgroundProps) {
    const {
        paperColor,
        usePaperGradient,
        paperGradientColors,
        paperGradientAngle,
        paperGradientPositions,
        gridType,
        gridColor,
        useGridGradient,
        gridGradientColor2,
        gridGradientColor3,
        gridGradientAngle,
        gridOpacity,
        gridSize,
        gridWeight,
        showMargin,
        marginColor,
        marginOffset,
        showHoles,
        holeColor,
        holeBorder,
        holeCount,
        holeSide,
        showShadow,
        borderRadius,
    } = { ...DEFAULTS, ...props }

    // ── Paper background CSS ──────────────────────────────────────────────────
    const buildPaperBg = (): string => {
        if (!usePaperGradient || !paperGradientColors || paperGradientColors.length < 2) return paperColor
        const positions = (paperGradientPositions || "")
            .split(",").map((s) => s.trim()).filter(Boolean)
        const stops = paperGradientColors.map((c, i) => {
            const pos = positions[i] !== undefined ? ` ${positions[i]}%` : ""
            return `${c}${pos}`
        }).join(", ")
        return `linear-gradient(${paperGradientAngle}deg, ${stops})`
    }

    // ── Grid gradient SVG defs ────────────────────────────────────────────────
    const uid = `nb-${gridType}-${gridSize}-${gridColor.replace(/[^a-z0-9]/gi, "")}`
    const gradId = `${uid}-grad`

    const angleToVec = (deg: number) => {
        const rad = ((deg - 90) * Math.PI) / 180
        const x2 = Math.round((0.5 + Math.cos(rad) * 0.5) * 1e4) / 1e4
        const y2 = Math.round((0.5 + Math.sin(rad) * 0.5) * 1e4) / 1e4
        return { x1: 1 - x2, y1: 1 - y2, x2, y2 }
    }
    const gv = angleToVec(gridGradientAngle)

    const gridFill = useGridGradient ? `url(#${gradId})` : gridColor
    const op = gridOpacity

    const gridStops = [
        { offset: "0%", color: gridColor },
        { offset: gridGradientColor3 ? "50%" : "100%", color: gridGradientColor2 },
        ...(gridGradientColor3 ? [{ offset: "100%", color: gridGradientColor3 }] : []),
    ]

    const GridGradientDef = useGridGradient ? (
        <linearGradient id={gradId} x1={gv.x1} y1={gv.y1} x2={gv.x2} y2={gv.y2} gradientUnits="objectBoundingBox">
            {gridStops.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={op} />
            ))}
        </linearGradient>
    ) : null

    // ── Grid pattern ──────────────────────────────────────────────────────────
    const gridPattern = () => {
        if (gridType === "dot") return (
            <pattern id={uid} x="0" y="0" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                <circle cx={gridSize / 2} cy={gridSize / 2} r={gridWeight * 0.9} fill={gridFill} opacity={useGridGradient ? 1 : op} />
            </pattern>
        )
        if (gridType === "ruled") return (
            <pattern id={uid} x="0" y="0" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                <line x1="0" y1={gridSize} x2={gridSize} y2={gridSize} stroke={gridFill} strokeWidth={gridWeight} opacity={useGridGradient ? 1 : op} />
            </pattern>
        )
        if (gridType === "grid") return (
            <pattern id={uid} x="0" y="0" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke={gridFill} strokeWidth={gridWeight} opacity={useGridGradient ? 1 : op} />
            </pattern>
        )
        // cross
        return (
            <pattern id={uid} x="0" y="0" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                <line x1={gridSize / 2} y1={gridSize / 2 - gridWeight * 2} x2={gridSize / 2} y2={gridSize / 2 + gridWeight * 2} stroke={gridFill} strokeWidth={gridWeight} opacity={useGridGradient ? 1 : op} />
                <line x1={gridSize / 2 - gridWeight * 2} y1={gridSize / 2} x2={gridSize / 2 + gridWeight * 2} y2={gridSize / 2} stroke={gridFill} strokeWidth={gridWeight} opacity={useGridGradient ? 1 : op} />
            </pattern>
        )
    }

    const holeSpacing = 100 / (holeCount + 1)
    const holePositions = Array.from({ length: holeCount }, (_, i) => (i + 1) * holeSpacing)

    return (
        <div style={{
            width: "100%", height: "100%", position: "relative",
            background: buildPaperBg(),
            borderRadius, overflow: "hidden",
            boxShadow: showShadow ? "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)" : "none",
            boxSizing: "border-box",
        }}>
            <svg width="100%" height="100%"
                style={{ position: "absolute", inset: 0, display: "block", pointerEvents: "none" }}
                xmlns="http://www.w3.org/2000/svg">
                <defs>
                    {GridGradientDef}
                    {gridPattern()}
                </defs>
                <rect width="100%" height="100%" fill={`url(#${uid})`} />
            </svg>

            {showMargin && (
                <div style={{
                    position: "absolute", top: 0, bottom: 0,
                    left: holeSide === "left" && showHoles ? marginOffset + 32 : marginOffset,
                    width: 1.5, background: marginColor, opacity: 0.7, pointerEvents: "none",
                }} />
            )}

            {showHoles && holePositions.map((pct, i) => {
                const style: React.CSSProperties = {
                    position: "absolute", width: 20, height: 20,
                    borderRadius: "50%", background: holeColor,
                    border: `2px solid ${holeBorder}`,
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)", pointerEvents: "none",
                    ...(holeSide === "left" ? { left: 12, top: `${pct}%`, transform: "translateY(-50%)" } : {}),
                    ...(holeSide === "right" ? { right: 12, top: `${pct}%`, transform: "translateY(-50%)" } : {}),
                    ...(holeSide === "top" ? { top: 12, left: `${pct}%`, transform: "translateX(-50%)" } : {}),
                    ...(holeSide === "bottom" ? { bottom: 12, left: `${pct}%`, transform: "translateX(-50%)" } : {}),
                }
                return <div key={i} style={style} />
            })}
        </div>
    )
}
