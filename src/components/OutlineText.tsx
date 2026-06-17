// OutlineText — ported verbatim from Framer (framer imports + addPropertyControls removed,
// defaults merged via DEFAULTS for React 19).

type OutlineTextProps = {
    text?: string
    strokeColor?: string
    strokeWidth?: number
    fontFamily?: string
    fontSize?: number
    fontWeight?: number
    letterSpacing?: number
    lineHeight?: number
}

const DEFAULTS: Required<OutlineTextProps> = {
    text: "Liberona",
    strokeColor: "#4F58AF",
    strokeWidth: 2.5,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    fontSize: 80,
    fontWeight: 400,
    letterSpacing: 0.01,
    lineHeight: 1.0,
}

export default function OutlineText(props: OutlineTextProps) {
    const { text, strokeColor, strokeWidth, fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } =
        { ...DEFAULTS, ...props }

    return (
        <span
            style={{
                fontFamily,
                fontSize,
                fontWeight,
                letterSpacing: `${letterSpacing}em`,
                lineHeight,
                WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
                color: "transparent",
                display: "inline-block",
            }}
        >
            {text}
        </span>
    )
}
