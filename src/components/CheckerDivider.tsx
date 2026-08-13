type CheckerDividerProps = {
    color1?: string
    color2?: string
    cellSize?: number
    rows?: number
    borderRadius?: number
    outline?: boolean
    outlineColor?: string
}

const DEFAULTS: Required<CheckerDividerProps> = {
    color1: "#D4DF68",
    color2: "#f5eee6",
    cellSize: 12,
    rows: 2,
    borderRadius: 0,
    outline: false,
    outlineColor: "#1a1520",
}

export default function CheckerDivider(props: CheckerDividerProps) {
    const { color1, color2, cellSize, rows, borderRadius, outline, outlineColor } = { ...DEFAULTS, ...props }

    const height = cellSize * rows

    // An SVG pattern instead of pixel math, so the board scales to any width.
    const patternId = `chk-${color1.replace(/[^a-z0-9]/gi, "")}-${color2.replace(/[^a-z0-9]/gi, "")}-${cellSize}`

    return (
        <div style={{
            width: "100%",
            height: height,
            overflow: "hidden",
            borderRadius: borderRadius,
            border: outline ? `2px solid ${outlineColor}` : "none",
            boxSizing: "border-box",
            flexShrink: 0,
        }}>
            <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block" }}
            >
                <defs>
                    <pattern
                        id={patternId}
                        x="0" y="0"
                        width={cellSize * 2}
                        height={cellSize * 2}
                        patternUnits="userSpaceOnUse"
                    >
                        {/* Top-left */}
                        <rect x="0" y="0" width={cellSize} height={cellSize} fill={color1} />
                        {/* Top-right */}
                        <rect x={cellSize} y="0" width={cellSize} height={cellSize} fill={color2} />
                        {/* Bottom-left */}
                        <rect x="0" y={cellSize} width={cellSize} height={cellSize} fill={color2} />
                        {/* Bottom-right */}
                        <rect x={cellSize} y={cellSize} width={cellSize} height={cellSize} fill={color1} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>
        </div>
    )
}
