// A circular core-loop diagram: nodes arranged around a circle, connected by
// curved arrows that loop last → first. Same text DSL as FlowDiagram plus an
// emoji/icon prefix per node.

import * as React from "react"

const PALETTES: Record<string, string[]> = {
    portfolio: ["#D4DF68", "#8BD9C3", "#EE978E", "#FABA32", "#f5eee6"],
    pastel:    ["#fce8f3", "#e8f4fc", "#ede8fc", "#e8faf4", "#fef0e8"],
    y2k:       ["#f7a8d0", "#a8dcf0", "#d4b8f0", "#7de8c8", "#f5e870"],
    warm:      ["#f9d0a8", "#f5b98a", "#fce8c8", "#f5d4a0", "#f0c890"],
    mono:      ["#f0f0f0", "#e6e6e6", "#dcdcdc", "#d2d2d2", "#c8c8c8"],
    sunset:    ["#ffd6a5", "#fdb6c5", "#ff9aa2", "#ffb7b2", "#fbc4ab"],
    ocean:     ["#a8e8e0", "#a0d8ef", "#b8c6ff", "#cab8ff", "#a0c4ff"],
}

type NodeSpec = {
    label: string
    sublabel: string
    icon: string
    color?: string
}

function extractIcon(label: string): { icon: string; rest: string } {
    if (!label) return { icon: "", rest: "" }
    const trimmed = label.trim()
    const firstSpace = trimmed.indexOf(" ")
    if (firstSpace === -1) return { icon: "", rest: trimmed }
    const head = trimmed.slice(0, firstSpace)
    const tail = trimmed.slice(firstSpace + 1).trim()
    const isIconish = /[^\w-.,'"!?:;()&/]/.test(head)
    if (isIconish) return { icon: head, rest: tail }
    return { icon: "", rest: trimmed }
}

function parseDSL(input: string): NodeSpec[] {
    if (!input) return []
    const tokenRegex = /(<-->|<\.\.>|<->|<--|-->|<\.\.|\.\.>|<-|->)/g
    const parts = input.split(tokenRegex).map(s => s.trim()).filter(Boolean)
    const nodes: NodeSpec[] = []
    parts.forEach((part, i) => {
        if (i % 2 === 0) {
            const [labelRaw, ...rest] = part.split("|")
            const { icon, rest: cleanLabel } = extractIcon(labelRaw || "")
            nodes.push({
                label: cleanLabel,
                sublabel: rest.join("|").trim(),
                icon,
            })
        }
    })
    return nodes
}

function shapeStyles(shape: string, size: number, radius: number): React.CSSProperties {
    switch (shape) {
        case "circle":
            return { width: size, height: size, borderRadius: "50%" }
        case "pill":
            return { minWidth: size, height: size * 0.65, borderRadius: 999 }
        case "rounded":
            return { width: size, height: size, borderRadius: radius }
        case "sharp":
            return { width: size, height: size, borderRadius: 0 }
        case "hexagon":
            return {
                width: size,
                height: size * 0.866,
                clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                borderRadius: 0,
            }
        default:
            return { width: size, height: size, borderRadius: radius }
    }
}

type CoreLoopDiagramProps = {
    inputMode?: string
    flowString?: string
    nodesArray?: { label: string; sublabel: string; icon: string; color: string }[]

    nodeCountHint?: number
    radius?: number
    rotationOffset?: number
    direction?: "cw" | "ccw"
    closeLoop?: boolean

    nodeShape?: "circle" | "rounded" | "pill" | "hexagon" | "sharp"
    nodeSize?: number
    nodeBorderRadius?: number
    nodeBorderWidth?: number
    nodeBorderColor?: string
    nodeBorderStyle?: "solid" | "dashed" | "dotted"
    nodeShadowX?: number
    nodeShadowY?: number
    nodeShadowColor?: string

    colorScheme?: string
    customColors?: string[]

    fontFamily?: string
    iconSize?: number
    labelSize?: number
    labelWeight?: number
    labelColor?: string
    sublabelSize?: number
    sublabelColor?: string

    // Label placement
    labelPosition?: "inside" | "outside" | "belowDot"
    labelGap?: number
    labelMaxWidth?: number
    outsideDotSize?: number

    arrowKind?: "single" | "double" | "none"
    arrowStyle?: "solid" | "dashed" | "dotted"
    arrowThickness?: number
    arrowColor?: string
    arrowCurve?: number
    arrowHeadSize?: number
    arrowGap?: number

    centerMode?: "none" | "text" | "icon" | "both"
    centerText?: string
    centerIcon?: string
    centerSize?: number
    centerBg?: string
    centerBorderColor?: string
    centerBorderWidth?: number
    centerTextColor?: string
    centerTextSize?: number
    centerIconSize?: number
    showInnerRing?: boolean
    innerRingColor?: string
    innerRingStyle?: "solid" | "dashed" | "dotted"
    innerRingWidth?: number
    innerRingPadding?: number

    containerSize?: number
    containerBg?: string
    alignH?: "left" | "center" | "right"
}

const DEFAULTS: Required<CoreLoopDiagramProps> = {
    inputMode: "string",
    flowString: "🎯 Engage|combat -> ⚔️ Defeat|enemy -> 💎 Reward|XP & loot -> 📈 Progress|level up",
    nodesArray: [
        { icon: "🎯", label: "Engage",   sublabel: "combat",       color: "" },
        { icon: "⚔️", label: "Defeat",   sublabel: "enemy",        color: "" },
        { icon: "💎", label: "Reward",   sublabel: "XP & loot",    color: "" },
        { icon: "📈", label: "Progress", sublabel: "level up",     color: "" },
    ],

    nodeCountHint: 0,
    radius: 160,
    rotationOffset: 0,
    direction: "cw",
    closeLoop: true,

    nodeShape: "circle",
    nodeSize: 100,
    nodeBorderRadius: 16,
    nodeBorderWidth: 1.5,
    nodeBorderColor: "#1a1520",
    nodeBorderStyle: "solid",
    nodeShadowX: 2,
    nodeShadowY: 2,
    nodeShadowColor: "#1a1520",

    colorScheme: "portfolio",
    customColors: ["#D4DF68", "#8BD9C3", "#EE978E", "#FABA32"],

    fontFamily: "mono",
    iconSize: 24,
    labelSize: 13,
    labelWeight: 700,
    labelColor: "#1a1520",
    sublabelSize: 10,
    sublabelColor: "#4a4060",

    labelPosition: "inside",
    labelGap: 10,
    labelMaxWidth: 130,
    outsideDotSize: 64,

    arrowKind: "single",
    arrowStyle: "solid",
    arrowThickness: 2,
    arrowColor: "#1a1520",
    arrowCurve: 30,
    arrowHeadSize: 10,
    arrowGap: 6,

    centerMode: "text",
    centerText: "CORE\nLOOP",
    centerIcon: "♻️",
    centerSize: 110,
    centerBg: "rgba(0,0,0,0)",
    centerBorderColor: "#1a1520",
    centerBorderWidth: 0,
    centerTextColor: "#1a1520",
    centerTextSize: 14,
    centerIconSize: 36,
    showInnerRing: false,
    innerRingColor: "#1a1520",
    innerRingStyle: "dashed",
    innerRingWidth: 1.5,
    innerRingPadding: 60,

    containerSize: 480,
    containerBg: "rgba(0,0,0,0)",
    alignH: "center",
}

export default function CoreLoopDiagram(props: CoreLoopDiagramProps) {
    const {
        inputMode, flowString, nodesArray,
        nodeCountHint, radius, rotationOffset, direction, closeLoop,
        nodeShape, nodeSize, nodeBorderRadius, nodeBorderWidth, nodeBorderColor, nodeBorderStyle,
        nodeShadowX, nodeShadowY, nodeShadowColor,
        colorScheme, customColors,
        fontFamily, iconSize, labelSize, labelWeight, labelColor, sublabelSize, sublabelColor,
        labelPosition, labelGap, labelMaxWidth, outsideDotSize,
        arrowKind, arrowStyle, arrowThickness, arrowColor, arrowCurve, arrowHeadSize, arrowGap,
        centerMode, centerText, centerIcon, centerSize,
        centerBg, centerBorderColor, centerBorderWidth, centerTextColor,
        centerTextSize, centerIconSize,
        showInnerRing, innerRingColor, innerRingStyle, innerRingWidth, innerRingPadding,
        containerSize, containerBg, alignH,
    } = { ...DEFAULTS, ...props }

    let nodes: NodeSpec[] = []
    if (inputMode === "string") {
        nodes = parseDSL(flowString || "")
    } else {
        nodes = (nodesArray || []).map(n => {
            const { icon: parsedIcon, rest } = extractIcon(n.label || "")
            return {
                label: n.icon ? (n.label || "") : rest,
                sublabel: n.sublabel || "",
                icon: n.icon || parsedIcon,
                color: n.color || undefined,
            }
        })
    }

    if (nodeCountHint > 0 && nodes.length > nodeCountHint) {
        nodes = nodes.slice(0, nodeCountHint)
    }

    const ff =
        fontFamily === "mono"    ? "'IBM Plex Mono', monospace" :
        fontFamily === "anon"    ? "'Anonymous Pro', monospace" :
        fontFamily === "fredoka" ? "'Fredoka One', cursive" :
        fontFamily === "caveat"  ? "'Caveat', cursive" :
        fontFamily === "jua"     ? "'Jua', sans-serif" :
        "sans-serif"

    const colors = colorScheme === "custom" && customColors?.length
        ? customColors
        : (PALETTES[colorScheme] || PALETTES.portfolio)

    const justifyValue: React.CSSProperties["justifyContent"] =
        alignH === "left" ? "flex-start" :
        alignH === "right" ? "flex-end" :
        "center"

    const outerWrapperStyle: React.CSSProperties = {
        width: "100%",
        display: "flex",
        justifyContent: justifyValue,
        alignItems: "center",
        boxSizing: "border-box" as const,
    }

    if (!nodes.length) {
        return (
            <div style={outerWrapperStyle}>
                <div style={{
                    fontFamily: ff, fontSize: 12, color: "#aaa",
                    fontStyle: "italic", padding: "8px 0",
                    width: containerSize, height: containerSize,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textAlign: "center" as const,
                }}>
                    No loop — add nodes via the properties panel.
                </div>
            </div>
        )
    }

    const n = nodes.length
    const cx = containerSize / 2
    const cy = containerSize / 2
    const startAngle = (rotationOffset - 90) * (Math.PI / 180)
    const sweep = direction === "cw" ? 1 : -1

    // Effective dot size: in "outside" mode the node footprint is the smaller
    // outsideDotSize (it only carries the icon); otherwise the full nodeSize.
    const effectiveNodeSize = labelPosition === "outside" ? outsideDotSize :
                              labelPosition === "belowDot" ? outsideDotSize :
                              nodeSize

    const positions = nodes.map((_, i) => {
        const angle = startAngle + sweep * (i * (2 * Math.PI) / n)
        return {
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
            angle,
        }
    })

    type ArrowPath = {
        d: string
        endX: number
        endY: number
        endAngle: number
        showHead: boolean
        showTail: boolean
    }

    const arrowPaths: ArrowPath[] = []
    const totalArrows = closeLoop ? n : Math.max(0, n - 1)

    for (let i = 0; i < totalArrows; i++) {
        const a = positions[i]
        const b = positions[(i + 1) % n]

        const dx = b.x - a.x
        const dy = b.y - a.y
        const len = Math.hypot(dx, dy) || 1
        const ux = dx / len
        const uy = dy / len

        const offset = effectiveNodeSize / 2 + arrowGap
        const sx = a.x + ux * offset
        const sy = a.y + uy * offset
        const ex = b.x - ux * offset
        const ey = b.y - uy * offset

        const mx = (sx + ex) / 2
        const my = (sy + ey) / 2

        const nxv = mx - cx
        const nyv = my - cy
        const nlen = Math.hypot(nxv, nyv) || 1
        const normX = nxv / nlen
        const normY = nyv / nlen

        // Control point always pushes along the outward radial normal — positive
        // arrowCurve bows outward in both travel directions.
        const ctrlX = mx + normX * arrowCurve
        const ctrlY = my + normY * arrowCurve

        const tangentX = ex - ctrlX
        const tangentY = ey - ctrlY
        const endAngle = Math.atan2(tangentY, tangentX)

        const d = `M ${sx} ${sy} Q ${ctrlX} ${ctrlY} ${ex} ${ey}`
        const showHead = arrowKind === "single" || arrowKind === "double"
        const showTail = arrowKind === "double"

        arrowPaths.push({ d, endX: ex, endY: ey, endAngle, showHead, showTail })
    }

    const dash =
        arrowStyle === "dashed" ? `${arrowThickness * 3} ${arrowThickness * 2}` :
        arrowStyle === "dotted" ? `${arrowThickness} ${arrowThickness * 2}` :
        undefined

    const centerEl = (centerMode !== "none" || showInnerRing) ? (
        <>
            {showInnerRing && (
                <div style={{
                    position: "absolute",
                    left: cx - (radius - innerRingPadding),
                    top:  cy - (radius - innerRingPadding),
                    width:  (radius - innerRingPadding) * 2,
                    height: (radius - innerRingPadding) * 2,
                    borderRadius: "50%",
                    border: `${innerRingWidth}px ${innerRingStyle} ${innerRingColor}`,
                    pointerEvents: "none" as const,
                    boxSizing: "border-box" as const,
                }} />
            )}
            {centerMode !== "none" && (
                <div style={{
                    position: "absolute",
                    left: cx - centerSize / 2,
                    top:  cy - centerSize / 2,
                    width: centerSize,
                    height: centerSize,
                    borderRadius: "50%",
                    background: centerBg,
                    border: centerBorderWidth > 0 ? `${centerBorderWidth}px solid ${centerBorderColor}` : "none",
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box" as const,
                    padding: 8,
                    gap: 2,
                    textAlign: "center" as const,
                    pointerEvents: "none" as const,
                }}>
                    {(centerMode === "icon" || centerMode === "both") && centerIcon && (
                        <span style={{
                            fontSize: centerIconSize,
                            lineHeight: 1,
                        }}>{centerIcon}</span>
                    )}
                    {(centerMode === "text" || centerMode === "both") && centerText && (
                        <span style={{
                            fontFamily: ff,
                            fontSize: centerTextSize,
                            fontWeight: 700,
                            color: centerTextColor,
                            lineHeight: 1.15,
                            whiteSpace: "pre-wrap" as const,
                        }}>{centerText}</span>
                    )}
                </div>
            )}
        </>
    ) : null

    const baseShape = shapeStyles(nodeShape, effectiveNodeSize, nodeBorderRadius)

    // Label block (label + sublabel), reused across positions.
    function LabelBlock({ node, align }: { node: NodeSpec; align: "left" | "center" | "right" }) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column" as const,
                alignItems: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
                gap: 2,
                textAlign: align as any,
                maxWidth: labelMaxWidth || undefined,
            }}>
                {node.label && (
                    <span style={{
                        fontSize: labelSize,
                        fontWeight: labelWeight,
                        color: labelColor,
                        lineHeight: 1.15,
                        whiteSpace: "normal" as const,
                        wordBreak: "break-word" as const,
                    }}>{node.label}</span>
                )}
                {node.sublabel && (
                    <span style={{
                        fontSize: sublabelSize,
                        color: sublabelColor,
                        lineHeight: 1.15,
                        fontWeight: 500,
                        opacity: 0.85,
                        whiteSpace: "normal" as const,
                        wordBreak: "break-word" as const,
                    }}>{node.sublabel}</span>
                )}
            </div>
        )
    }

    return (
        <div style={outerWrapperStyle}>
            <div style={{
                position: "relative",
                width: containerSize,
                height: containerSize,
                background: containerBg,
                fontFamily: ff,
                boxSizing: "border-box" as const,
                flexShrink: 0,
            }}>
                <svg
                    width={containerSize}
                    height={containerSize}
                    viewBox={`0 0 ${containerSize} ${containerSize}`}
                    style={{
                        position: "absolute",
                        inset: 0,
                        overflow: "visible",
                        pointerEvents: "none" as const,
                    }}
                >
                    {arrowPaths.map((p, i) => {
                        const headLen = arrowHeadSize
                        const headEndX = p.endX
                        const headEndY = p.endY
                        const ax = headEndX - Math.cos(p.endAngle) * headLen
                        const ay = headEndY - Math.sin(p.endAngle) * headLen
                        const perpX = -Math.sin(p.endAngle) * headLen * 0.5
                        const perpY =  Math.cos(p.endAngle) * headLen * 0.5
                        const triEnd = `${headEndX},${headEndY} ${ax + perpX},${ay + perpY} ${ax - perpX},${ay - perpY}`

                        return (
                            <g key={i}>
                                <path
                                    d={p.d}
                                    fill="none"
                                    stroke={arrowColor}
                                    strokeWidth={arrowThickness}
                                    strokeLinecap={arrowStyle === "solid" ? "round" : "butt"}
                                    strokeDasharray={dash}
                                />
                                {p.showHead && (
                                    <polygon points={triEnd} fill={arrowColor} />
                                )}
                            </g>
                        )
                    })}
                </svg>

                {centerEl}

                {nodes.map((node, i) => {
                    const pos = positions[i]
                    const bg = node.color || colors[i % colors.length]
                    const shadow = (nodeShadowX || nodeShadowY)
                        ? `${nodeShadowX}px ${nodeShadowY}px 0 ${nodeShadowColor}`
                        : "none"

                    // The visual node (circle/shape). In "inside" mode it carries
                    // icon + label + sublabel. In "outside"/"belowDot" it carries
                    // only the icon (compact).
                    const showInsideText = labelPosition === "inside"

                    const nodeEl = (
                        <div
                            style={{
                                ...baseShape,
                                background: bg,
                                border: nodeShape === "hexagon"
                                    ? "none"
                                    : `${nodeBorderWidth}px ${nodeBorderStyle} ${nodeBorderColor}`,
                                boxShadow: nodeShape === "hexagon" ? "none" : shadow,
                                display: "flex",
                                flexDirection: "column" as const,
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center" as const,
                                boxSizing: "border-box" as const,
                                padding: nodeShape === "pill" ? "0 14px" : 8,
                                gap: 2,
                            }}
                        >
                            {node.icon && (
                                <span style={{
                                    fontSize: iconSize,
                                    lineHeight: 1,
                                }}>{node.icon}</span>
                            )}
                            {showInsideText && node.label && (
                                <span style={{
                                    fontSize: labelSize,
                                    fontWeight: labelWeight,
                                    color: labelColor,
                                    lineHeight: 1.15,
                                    whiteSpace: "normal" as const,
                                    wordBreak: "break-word" as const,
                                }}>{node.label}</span>
                            )}
                            {showInsideText && node.sublabel && (
                                <span style={{
                                    fontSize: sublabelSize,
                                    color: sublabelColor,
                                    lineHeight: 1.15,
                                    fontWeight: 500,
                                    opacity: 0.85,
                                }}>{node.sublabel}</span>
                            )}
                        </div>
                    )

                    // ── INSIDE ──────────────────────────────────────────────
                    if (labelPosition === "inside") {
                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    left: pos.x - effectiveNodeSize / 2,
                                    top:  pos.y - effectiveNodeSize / 2,
                                    zIndex: 2,
                                }}
                            >
                                {nodeEl}
                            </div>
                        )
                    }

                    // ── BELOW DOT ───────────────────────────────────────────
                    // Compact node, label centered just below it.
                    if (labelPosition === "belowDot") {
                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    left: pos.x,
                                    top:  pos.y - effectiveNodeSize / 2,
                                    transform: "translateX(-50%)",
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    alignItems: "center",
                                    gap: labelGap,
                                    zIndex: 2,
                                    width: labelMaxWidth || 140,
                                }}
                            >
                                {nodeEl}
                                <LabelBlock node={node} align="center" />
                            </div>
                        )
                    }

                    // ── OUTSIDE ─────────────────────────────────────────────
                    // Node shows only the icon; label radiates outward from the
                    // center, positioned beyond the node along the radius.
                    // We decide text alignment based on which side of the circle
                    // the node sits (left half → right-align, right half → left-align).
                    const dirX = Math.cos(pos.angle)
                    const dirY = Math.sin(pos.angle)
                    // Label anchor point: push outward from node center by half the
                    // node + gap.
                    const labelAnchorX = pos.x + dirX * (effectiveNodeSize / 2 + labelGap)
                    const labelAnchorY = pos.y + dirY * (effectiveNodeSize / 2 + labelGap)

                    // Horizontal alignment: if node is on the left side (dirX < 0),
                    // text should grow leftward (right-aligned). On the right, left-aligned.
                    // Near top/bottom (|dirX| small), center it.
                    const horiz: "left" | "center" | "right" =
                        dirX > 0.3 ? "left" :
                        dirX < -0.3 ? "right" :
                        "center"

                    // We position a flex container at the label anchor and use
                    // transform to align it relative to that anchor.
                    const translateX =
                        horiz === "left" ? "0%" :
                        horiz === "right" ? "-100%" :
                        "-50%"
                    // Vertical centering on the anchor for side nodes; for top/bottom
                    // nodes we offset fully above/below.
                    const translateY =
                        Math.abs(dirX) >= 0.3 ? "-50%" :
                        (dirY < 0 ? "-100%" : "0%")

                    return (
                        <React.Fragment key={i}>
                            {/* Compact icon node */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: pos.x - effectiveNodeSize / 2,
                                    top:  pos.y - effectiveNodeSize / 2,
                                    zIndex: 2,
                                }}
                            >
                                {nodeEl}
                            </div>
                            {/* Outward label */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: labelAnchorX,
                                    top:  labelAnchorY,
                                    transform: `translate(${translateX}, ${translateY})`,
                                    zIndex: 2,
                                    width: labelMaxWidth || 130,
                                    display: "flex",
                                    justifyContent: horiz === "left" ? "flex-start" : horiz === "right" ? "flex-end" : "center",
                                }}
                            >
                                <LabelBlock node={node} align={horiz} />
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}
