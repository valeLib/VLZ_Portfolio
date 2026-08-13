// Renders a list of tags as colorful chips. Two input modes: "string" for
// comma-separated content fields, and "array" for an explicit list.

const PALETTES: Record<string, string[]> = {
    portfolio: ["#D4DF68", "#8BD9C3", "#EE978E", "#FABA32", "#f5eee6"],
    pastel:    ["#fce8f3", "#e8f4fc", "#ede8fc", "#e8faf4", "#fef0e8"],
    y2k:       ["#f7a8d0", "#a8dcf0", "#d4b8f0", "#7de8c8", "#f5e870"],
    warm:      ["#f9d0a8", "#f5b98a", "#fce8c8", "#f5d4a0", "#f0c890"],
    mono:      ["#f0f0f0", "#e6e6e6", "#dcdcdc", "#d2d2d2", "#c8c8c8"],
}
const ROTS = [-1.5, 0.8, -0.4, 1.2, -0.9, 0.5, -1.1, 0.7, -0.3, 1.0, -0.6, 0.4]

type TagCloudProps = {
    inputMode?: string
    tagsString?: string
    tagsArray?: string[]
    colorScheme?: string
    customColors?: string[]
    textColor?: string
    borderColor?: string
    borderWidth?: number
    shadowX?: number
    shadowY?: number
    fontFamily?: string
    fontSize?: number
    fontWeight?: number
    textTransform?: string
    letterSpacing?: number
    paddingH?: number
    paddingV?: number
    borderRadius?: number
    gap?: number
    rowGap?: number
    rotateChips?: boolean
}

const DEFAULTS: Required<TagCloudProps> = {
    inputMode: "string",
    tagsString: "UX Research, Competitive Market Analysis, Buyer Persona, Information Architecture, Navigation Flow, Visual System Design, Pixel Art Aesthetics, Color Psychology",
    tagsArray: ["UX Research", "Figma", "Unity", "Game Design", "C#"],
    colorScheme: "portfolio",
    customColors: ["#D4DF68", "#8BD9C3", "#EE978E"],
    textColor: "#1a1520",
    borderColor: "#1a1520",
    borderWidth: 1.5,
    shadowX: 2,
    shadowY: 2,
    fontFamily: "mono",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "none",
    letterSpacing: 0,
    paddingH: 10,
    paddingV: 5,
    borderRadius: 6,
    gap: 8,
    rowGap: 8,
    rotateChips: false,
}

export default function TagCloud(props: TagCloudProps) {
    const {
        inputMode, tagsString, tagsArray,
        colorScheme, customColors, textColor, borderColor, borderWidth, shadowX, shadowY,
        fontFamily, fontSize, fontWeight, textTransform, letterSpacing,
        paddingH, paddingV, borderRadius, gap, rowGap, rotateChips,
    } = { ...DEFAULTS, ...props }

    const tags: string[] = inputMode === "string"
        ? (tagsString || "").split(",").map((t: string) => t.trim()).filter(Boolean)
        : (tagsArray || []).filter(Boolean)

    const ff =
        fontFamily === "mono"    ? "'IBM Plex Mono', monospace" :
        fontFamily === "anon"    ? "'Anonymous Pro', monospace" :
        fontFamily === "fredoka" ? "'Fredoka One', cursive" :
        fontFamily === "caveat"  ? "'Caveat', cursive" :
        "sans-serif"

    const colors = colorScheme === "custom" && customColors?.length
        ? customColors
        : (PALETTES[colorScheme] || PALETTES.portfolio)

    const shadow = (shadowX || shadowY) ? `${shadowX}px ${shadowY}px 0 ${borderColor}` : "none"

    if (!tags.length) {
        return (
            <div style={{ fontFamily: ff, fontSize: 12, color: "#aaa", fontStyle: "italic", padding: "8px 0" }}>
                No tags — add some via the properties panel.
            </div>
        )
    }

    return (
        <div style={{
            display: "flex", flexWrap: "wrap" as const,
            gap: `${rowGap}px ${gap}px`,
            width: "100%", alignItems: "flex-start",
        }}>
            {tags.map((tag, i) => (
                <span key={i} style={{
                    fontFamily: ff, fontSize, fontWeight, color: textColor,
                    letterSpacing: `${letterSpacing}em`,
                    textTransform: textTransform as any,
                    background: colors[i % colors.length],
                    border: `${borderWidth}px solid ${borderColor}`,
                    borderRadius,
                    padding: `${paddingV}px ${paddingH}px`,
                    boxShadow: shadow,
                    display: "inline-block",
                    whiteSpace: "nowrap" as const,
                    lineHeight: 1,
                    transform: rotateChips ? `rotate(${ROTS[i % ROTS.length]}deg)` : "none",
                }}>{tag}</span>
            ))}
        </div>
    )
}
