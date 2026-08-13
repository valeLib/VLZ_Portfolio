// A reusable flow / process diagram for core loops, architectures, user journeys.
// Parses a text DSL ("A|sub -> B --> C <-> D -[label]-> E") or an array of nodes.

import * as React from "react"

// ── Palettes (shared with TagCloud) ────────────────────────────────────────
const PALETTES: Record<string, string[]> = {
    portfolio: ["#D4DF68", "#8BD9C3", "#EE978E", "#FABA32", "#f5eee6"],
    pastel:    ["#fce8f3", "#e8f4fc", "#ede8fc", "#e8faf4", "#fef0e8"],
    y2k:       ["#f7a8d0", "#a8dcf0", "#d4b8f0", "#7de8c8", "#f5e870"],
    warm:      ["#f9d0a8", "#f5b98a", "#fce8c8", "#f5d4a0", "#f0c890"],
    mono:      ["#f0f0f0", "#e6e6e6", "#dcdcdc", "#d2d2d2", "#c8c8c8"],
}

// Per-arrow data
type ArrowSpec = {
    kind: "single" | "double" | "none"
    style: "solid" | "dashed" | "dotted"
    label: string
}

type NodeSpec = {
    label: string
    sublabel: string
}

// Parse the DSL string into nodes + arrows
function parseDSL(input: string): { nodes: NodeSpec[]; arrows: ArrowSpec[] } {
    if (!input) return { nodes: [], arrows: [] }
    // Recognized arrow tokens, including labeled variants:
    //   -[lbl]->, -[lbl]-->, -[lbl]..>
    //   <-[lbl]->, <-[lbl]-->, <-[lbl]..>
    //   <->, <-->, <..>, <--, -->, <.., ..>, <-, ->
    const tokenRegex = /(<-\[[^\]]*\]->|<-\[[^\]]*\]-->|<-\[[^\]]*\]\.\.>|-\[[^\]]*\]->|-\[[^\]]*\]-->|-\[[^\]]*\]\.\.>|<-->|<\.\.>|<->|<--|-->|<\.\.|\.\.>|<-|->)/g

    const parts = input.split(tokenRegex).map(s => s.trim()).filter(Boolean)
    const nodes: NodeSpec[] = []
    const arrows: ArrowSpec[] = []

    parts.forEach((part, i) => {
        if (i % 2 === 0) {
            // Node — may carry a |sublabel
            const [label, ...rest] = part.split("|")
            nodes.push({
                label: (label || "").trim(),
                sublabel: rest.join("|").trim(),
            })
        } else {
            // Arrow
            const labelMatch = part.match(/\[([^\]]*)\]/)
            const label = labelMatch ? labelMatch[1] : ""
            const stripped = part.replace(/\[[^\]]*\]/, "")
            const hasLeft  = stripped.startsWith("<")
            const hasRight = stripped.endsWith(">")
            const kind: ArrowSpec["kind"] =
                hasLeft && hasRight ? "double"
              : hasRight           ? "single"
              : hasLeft            ? "single"
              : "none"
            const body = stripped.replace(/[<>]/g, "")
            const style: ArrowSpec["style"] =
                body.includes("..") ? "dotted"
              : body.includes("--") ? "dashed"
              : "solid"
            arrows.push({ kind, style, label })
        }
    })

    return { nodes, arrows }
}

// ── Arrow SVG renderer ─────────────────────────────────────────────────────
function ArrowGlyph(props: {
    horizontal: boolean
    length: number
    thickness: number
    color: string
    kind: ArrowSpec["kind"]
    style: ArrowSpec["style"]
    label: string
    fontFamily: string
    labelColor: string
    labelSize: number
}) {
    const { horizontal, length, thickness, color, kind, style, label, fontFamily, labelColor, labelSize } = props
    const head = Math.max(8, thickness * 3)
    const dash = style === "dashed" ? `${thickness * 3} ${thickness * 2}`
              : style === "dotted" ? `${thickness} ${thickness * 2}`
              : undefined

    const wantsRight = kind === "single" || kind === "double"
    const wantsLeft  = kind === "double"

    const W = horizontal ? length : Math.max(28, head * 2)
    const H = horizontal ? Math.max(28, head * 2) : length
    const cx = W / 2
    const cy = H / 2

    let x1: number, y1: number, x2: number, y2: number
    if (horizontal) {
        x1 = wantsLeft ? head : 4
        x2 = wantsRight ? W - head : W - 4
        y1 = cy; y2 = cy
    } else {
        x1 = cx; x2 = cx
        y1 = wantsLeft ? head : 4
        y2 = wantsRight ? H - head : H - 4
    }

    return (
        <div style={{
            position: "relative",
            width: W,
            height: H,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
                <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={color} strokeWidth={thickness}
                    strokeLinecap={style === "solid" ? "round" : "butt"}
                    strokeDasharray={dash}
                />
                {wantsRight && (
                    horizontal ? (
                        <polygon
                            points={`${W - head},${cy - head/2} ${W},${cy} ${W - head},${cy + head/2}`}
                            fill={color}
                        />
                    ) : (
                        <polygon
                            points={`${cx - head/2},${H - head} ${cx},${H} ${cx + head/2},${H - head}`}
                            fill={color}
                        />
                    )
                )}
                {wantsLeft && (
                    horizontal ? (
                        <polygon
                            points={`${head},${cy - head/2} 0,${cy} ${head},${cy + head/2}`}
                            fill={color}
                        />
                    ) : (
                        <polygon
                            points={`${cx - head/2},${head} ${cx},0 ${cx + head/2},${head}`}
                            fill={color}
                        />
                    )
                )}
            </svg>
            {label && (
                <span style={{
                    position: "absolute",
                    fontFamily,
                    fontSize: labelSize,
                    color: labelColor,
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.85)",
                    padding: "1px 6px",
                    borderRadius: 4,
                    lineHeight: 1.2,
                    whiteSpace: "nowrap" as const,
                    top: horizontal ? cy - labelSize - 6 : cy - labelSize/2,
                    left: horizontal ? cx : cx + head,
                    transform: horizontal ? "translateX(-50%)" : "none",
                    pointerEvents: "none" as const,
                }}>{label}</span>
            )}
        </div>
    )
}

type FlowDiagramProps = {
    inputMode?: string
    flowString?: string
    nodesArray?: { label: string; sublabel: string }[]
    direction?: "horizontal" | "vertical"
    wrap?: boolean
    nodeStyle?: "pill" | "rounded" | "sharp" | "dashed"
    minNodeWidth?: number
    nodePaddingH?: number
    nodePaddingV?: number
    nodeBorderRadius?: number
    nodeBorderWidth?: number
    nodeBorderColor?: string
    nodeShadowX?: number
    nodeShadowY?: number
    colorScheme?: string
    customColors?: string[]
    nodeFontFamily?: string
    nodeFontSize?: number
    nodeFontWeight?: number
    nodeTextColor?: string
    sublabelColor?: string
    sublabelSize?: number
    arrowKind?: "single" | "double" | "none"
    arrowStyle?: "solid" | "dashed" | "dotted"
    arrowThickness?: number
    arrowLength?: number
    arrowColor?: string
    arrowLabelColor?: string
    arrowLabelSize?: number
    gap?: number
    rowGap?: number
}

const DEFAULTS: Required<FlowDiagramProps> = {
    inputMode: "string",
    flowString: "Discover|research -> Design|wireframe -> Build|prototype -[test]-> Ship|launch",
    nodesArray: [
        { label: "Discover", sublabel: "research" },
        { label: "Design",   sublabel: "wireframe" },
        { label: "Build",    sublabel: "prototype" },
        { label: "Ship",     sublabel: "launch" },
    ],
    direction: "horizontal",
    wrap: false,
    nodeStyle: "rounded",
    minNodeWidth: 90,
    nodePaddingH: 14,
    nodePaddingV: 8,
    nodeBorderRadius: 8,
    nodeBorderWidth: 1.5,
    nodeBorderColor: "#1a1520",
    nodeShadowX: 2,
    nodeShadowY: 2,
    colorScheme: "portfolio",
    customColors: ["#D4DF68", "#8BD9C3", "#EE978E"],
    nodeFontFamily: "mono",
    nodeFontSize: 12,
    nodeFontWeight: 700,
    nodeTextColor: "#1a1520",
    sublabelColor: "#4a4060",
    sublabelSize: 10,
    arrowKind: "single",
    arrowStyle: "solid",
    arrowThickness: 2,
    arrowLength: 36,
    arrowColor: "#1a1520",
    arrowLabelColor: "#4F58AF",
    arrowLabelSize: 9,
    gap: 0,
    rowGap: 12,
}

export default function FlowDiagram(props: FlowDiagramProps) {
    const {
        inputMode, flowString, nodesArray,
        direction, wrap,
        nodeStyle, minNodeWidth, nodePaddingH, nodePaddingV, nodeBorderRadius,
        nodeBorderWidth, nodeBorderColor, nodeShadowX, nodeShadowY,
        colorScheme, customColors,
        nodeFontFamily, nodeFontSize, nodeFontWeight, nodeTextColor, sublabelColor, sublabelSize,
        arrowKind, arrowStyle, arrowThickness, arrowLength, arrowColor, arrowLabelColor, arrowLabelSize,
        gap, rowGap,
    } = { ...DEFAULTS, ...props }

    let nodes: NodeSpec[] = []
    let arrows: ArrowSpec[] = []
    if (inputMode === "string") {
        const parsed = parseDSL(flowString || "")
        nodes  = parsed.nodes
        arrows = parsed.arrows
        while (arrows.length < Math.max(0, nodes.length - 1)) {
            arrows.push({ kind: arrowKind, style: arrowStyle, label: "" })
        }
    } else {
        nodes = (nodesArray || []).map(n => ({
            label: n.label || "",
            sublabel: n.sublabel || "",
        }))
        arrows = new Array(Math.max(0, nodes.length - 1)).fill(0).map(() => ({
            kind: arrowKind, style: arrowStyle, label: "",
        }))
    }

    const ff =
        nodeFontFamily === "mono"    ? "'IBM Plex Mono', monospace" :
        nodeFontFamily === "anon"    ? "'Anonymous Pro', monospace" :
        nodeFontFamily === "fredoka" ? "'Fredoka One', cursive" :
        nodeFontFamily === "caveat"  ? "'Caveat', cursive" :
        "sans-serif"

    const colors = colorScheme === "custom" && customColors?.length
        ? customColors
        : (PALETTES[colorScheme] || PALETTES.portfolio)

    const radius =
        nodeStyle === "pill"   ? 999 :
        nodeStyle === "sharp"  ? 0 :
        nodeStyle === "dashed" ? nodeBorderRadius :
        nodeBorderRadius
    const borderStyle = nodeStyle === "dashed" ? "dashed" : "solid"

    if (!nodes.length) {
        return (
            <div style={{ fontFamily: ff, fontSize: 12, color: "#aaa", fontStyle: "italic", padding: "8px 0" }}>
                No flow — add nodes via the properties panel.
            </div>
        )
    }

    const horizontal = direction === "horizontal"

    return (
        <div style={{
            display: "flex",
            flexDirection: horizontal ? "row" : "column",
            flexWrap: (horizontal && wrap ? "wrap" : "nowrap") as React.CSSProperties["flexWrap"],
            // Always center children on the cross-axis: in horizontal mode this
            // vertically centers the arrows next to nodes; in vertical mode this
            // horizontally centers the (narrow) arrow glyph under each node.
            alignItems: "center",
            justifyContent: "flex-start",
            gap: horizontal ? `${rowGap}px ${gap}px` : `${gap}px`,
            width: "100%",
        }}>
            {nodes.map((node, i) => {
                const bg = colors[i % colors.length]
                const shadow = (nodeShadowX || nodeShadowY)
                    ? `${nodeShadowX}px ${nodeShadowY}px 0 ${nodeBorderColor}`
                    : "none"
                const arrowAfter = i < nodes.length - 1 ? arrows[i] : null
                return (
                    <React.Fragment key={i}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: minNodeWidth,
                            background: bg,
                            border: `${nodeBorderWidth}px ${borderStyle} ${nodeBorderColor}`,
                            borderRadius: radius,
                            padding: `${nodePaddingV}px ${nodePaddingH}px`,
                            boxShadow: shadow,
                            textAlign: "center" as const,
                            flexShrink: 0,
                        }}>
                            <span style={{
                                fontFamily: ff,
                                fontSize: nodeFontSize,
                                fontWeight: nodeFontWeight,
                                color: nodeTextColor,
                                lineHeight: 1.2,
                                whiteSpace: "nowrap" as const,
                            }}>{node.label}</span>
                            {node.sublabel && (
                                <span style={{
                                    fontFamily: ff,
                                    fontSize: sublabelSize,
                                    fontWeight: 500,
                                    color: sublabelColor,
                                    marginTop: 2,
                                    lineHeight: 1.2,
                                    opacity: 0.85,
                                }}>{node.sublabel}</span>
                            )}
                        </div>
                        {arrowAfter && (
                            <ArrowGlyph
                                horizontal={horizontal}
                                length={arrowLength}
                                thickness={arrowThickness}
                                color={arrowColor}
                                kind={arrowAfter.kind}
                                style={arrowAfter.style}
                                label={arrowAfter.label}
                                fontFamily={ff}
                                labelColor={arrowLabelColor}
                                labelSize={arrowLabelSize}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}
