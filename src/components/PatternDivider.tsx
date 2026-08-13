import { useEffect, useId, useRef, useState } from "react"

/**
 * Retro / Y2K horizontal divider band, companion to CheckerDivider.
 *
 * Nine tileable patterns drawn as a single inline SVG <pattern>, so the strip
 * stays crisp at any width and costs one node instead of dozens of repeated
 * shapes. Discrete patterns (the ones made of separate marks) can alternate
 * between two colours the way the checkerboard does.
 *
 * Height comes from the container, not a prop: the band measures itself with a
 * ResizeObserver so the geometry redraws live on resize.
 */

// Patterns built from separate marks, so a second colour can alternate between
// them. The continuous ones (Zigzag, Wave, Stripes, Grid) have no gaps to
// alternate across.
const DISCRETE = ["Dots", "Dashes", "Triangles", "Scallop", "Stars"]

/** One tile's worth of geometry. dx shifts the mark for the alternating pass. */
function mark(pattern: string, w: number, h: number, fill: string, dx: number, lineWidth: number) {
    const cx = dx + w / 2
    const r = Math.min(w, h) * 0.24

    switch (pattern) {
        case "Dots":
            return <circle cx={cx} cy={h / 2} r={r} fill={fill} />

        case "Dashes":
            return (
                <rect
                    x={dx + w * 0.12}
                    y={h * 0.36}
                    width={w * 0.76}
                    height={h * 0.28}
                    rx={h * 0.14}
                    fill={fill}
                />
            )

        case "Triangles":
            return <path d={`M${dx} 0 L${dx + w} 0 L${cx} ${h} Z`} fill={fill} />

        case "Scallop":
            return (
                <path
                    d={`M${dx} ${h} L${dx} ${h * 0.5} A ${w / 2} ${h * 0.5} 0 0 1 ${dx + w} ${h * 0.5} L${dx + w} ${h} Z`}
                    fill={fill}
                />
            )

        // Four-point sparkle with concave sides — the Y2K star, not a polygon.
        case "Stars":
            return (
                <path
                    d={`M${cx} ${h * 0.04}
                        Q${cx + w * 0.07} ${h * 0.43} ${dx + w * 0.96} ${h * 0.5}
                        Q${cx + w * 0.07} ${h * 0.57} ${cx} ${h * 0.96}
                        Q${cx - w * 0.07} ${h * 0.57} ${dx + w * 0.04} ${h * 0.5}
                        Q${cx - w * 0.07} ${h * 0.43} ${cx} ${h * 0.04} Z`}
                    fill={fill}
                />
            )

        case "Zigzag":
            return (
                <path
                    d={`M0 ${h} L0 ${h * 0.58} L${w / 2} ${h * 0.04} L${w} ${h * 0.58} L${w} ${h} Z`}
                    fill={fill}
                />
            )

        case "Wave":
            return (
                <path
                    d={`M0 ${h * 0.62} Q${w * 0.25} ${h * 0.08} ${w * 0.5} ${h * 0.62} T${w} ${h * 0.62} L${w} ${h} L0 ${h} Z`}
                    fill={fill}
                />
            )

        case "Stripes":
            // Rotated by patternTransform, so a plain half-tile block is enough.
            return <rect width={w / 2} height={w} fill={fill} />

        case "Grid":
            return (
                <>
                    <rect width={w} height={lineWidth} fill={fill} />
                    <rect width={lineWidth} height={h} fill={fill} />
                </>
            )

        default:
            return null
    }
}

const DEFAULTS = {
    pattern: "Zigzag",
    tile: 24,
    color: "#4F58AF",
    alternate: false,
    altColor: "#EE978E",
    background: "rgba(0,0,0,0)",
    angle: 45,
    lineWidth: 1.5,
    flip: false,
    edgeTop: false,
    edgeBottom: false,
    edgeColor: "#1C1B22",
    edgeWidth: 2.5,
}

export default function PatternDivider(
    props: Partial<typeof DEFAULTS> & { style?: React.CSSProperties }
) {
    const {
        pattern,
        tile,
        color,
        alternate,
        altColor,
        background,
        angle,
        lineWidth,
        flip,
        edgeTop,
        edgeBottom,
        edgeColor,
        edgeWidth,
        style,
    } = { ...DEFAULTS, ...props }

    // Stable per-instance id: two dividers on one page must not share a
    // <pattern> id, or the second would render with the first one's fill.
    // useId's colons are illegal inside url(#…), hence the strip.
    const uid = `pd-${useId().replace(/:/g, "")}`

    // Measure the band instead of taking a height prop. Seeded at the intrinsic
    // 28 so the very first paint, before the observer fires, is never zero.
    const boxRef = useRef<HTMLDivElement>(null)
    const [h, setH] = useState(28)
    useEffect(() => {
        const el = boxRef.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver((entries) => {
            for (const e of entries) {
                if (e.contentRect.height > 0) setH(e.contentRect.height)
            }
        })
        ro.observe(el)
        const measured = el.getBoundingClientRect().height
        if (measured > 0) setH(measured)
        return () => ro.disconnect()
    }, [])

    const useAlt = alternate && DISCRETE.includes(pattern)
    const tileW = useAlt ? tile * 2 : tile
    // Stripes tile square so the 45° rotation still lines up edge to edge.
    const tileH = pattern === "Stripes" ? tile : h

    const edgeCss = `${edgeWidth}px solid ${edgeColor}`

    return (
        <div
            ref={boxRef}
            style={{
                width: "100%",
                height: "100%",
                lineHeight: 0,
                borderTop: edgeTop ? edgeCss : "none",
                borderBottom: edgeBottom ? edgeCss : "none",
                boxSizing: "border-box",
                ...style,
            }}
        >
            <svg
                width="100%"
                height="100%"
                style={{
                    display: "block",
                    transform: flip ? "scaleY(-1)" : undefined,
                }}
            >
                <defs>
                    <pattern
                        id={uid}
                        width={tileW}
                        height={tileH}
                        patternUnits="userSpaceOnUse"
                        patternTransform={pattern === "Stripes" ? `rotate(${angle})` : undefined}
                    >
                        {mark(pattern, tile, h, color, 0, lineWidth)}
                        {useAlt && mark(pattern, tile, h, altColor, tile, lineWidth)}
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={background} />
                <rect width="100%" height="100%" fill={`url(#${uid})`} />
            </svg>
        </div>
    )
}
