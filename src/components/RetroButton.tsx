// Covers both CTA buttons (primary/ghost) and stat cards with value + label.

type RetroButtonProps = {
    variant?: string
    label?: string
    href?: string
    openNewTab?: boolean
    statValue?: string
    statLabel?: string
    bgColor?: string
    textColor?: string
    borderColor?: string
    statLabelColor?: string
    showShadow?: boolean
    shadowColor?: string
    shadowX?: number
    shadowY?: number
    borderWidth?: number
    borderRadius?: number
    fontFamily?: string
    fontSize?: number
    statValueSize?: number
    statLabelSize?: number
    fontWeight?: number
    letterSpacing?: number
    textTransform?: string
    paddingH?: number
    paddingV?: number
    hoverLift?: boolean
}

const DEFAULTS: Required<RetroButtonProps> = {
    variant: "primary",
    label: "See my work ↓",
    href: "",
    openNewTab: false,
    statValue: "7+",
    statLabel: "Years XP",
    bgColor: "#D4DF68",
    textColor: "#1a1520",
    statLabelColor: "#1a1520",
    borderColor: "#1a1520",
    showShadow: true,
    shadowColor: "#1a1520",
    shadowX: 3,
    shadowY: 3,
    borderWidth: 2,
    borderRadius: 8,
    fontFamily: "mono",
    fontSize: 14,
    statValueSize: 32,
    statLabelSize: 10,
    fontWeight: 700,
    letterSpacing: 0,
    textTransform: "none",
    paddingH: 16,
    paddingV: 10,
    hoverLift: true,
}

export default function RetroButton(props: RetroButtonProps) {
    const {
        variant,
        label,
        href,
        openNewTab,
        statValue,
        statLabel,
        bgColor,
        textColor,
        borderColor,
        statLabelColor,
        showShadow,
        shadowColor,
        shadowX,
        shadowY,
        borderWidth,
        borderRadius,
        fontFamily,
        fontSize,
        statValueSize,
        statLabelSize,
        fontWeight,
        letterSpacing,
        textTransform,
        paddingH,
        paddingV,
        hoverLift,
    } = { ...DEFAULTS, ...props }

    const ff =
        fontFamily === "fredoka"
            ? "'Fredoka', cursive"
            : fontFamily === "caveat"
            ? "'Caveat', cursive"
            : fontFamily === "mono"
            ? "'IBM Plex Mono', 'Courier New', monospace"
            : fontFamily === "anon"
            ? "'Anonymous Pro', 'Courier New', monospace"
            : fontFamily === "fascinate"
            ? "'Fascinate Inline', cursive"
            : fontFamily === "sans"
            ? "sans-serif"
            : "serif"

    const shadow = showShadow ? `${shadowX}px ${shadowY}px 0 ${shadowColor}` : "none"
    const isStat = variant === "stat"
    const isButton = variant === "primary" || variant === "ghost"

    const baseStyle: React.CSSProperties = {
        display: "inline-flex",
        flexDirection: isStat ? "column" : "row",
        alignItems: isStat ? "flex-start" : "center",
        justifyContent: isStat ? "flex-end" : "center",
        gap: isStat ? 2 : 0,
        // Size to content: in a flex row the buttons and stat cards keep their
        // intrinsic width instead of stretching to fill the line.
        width: "fit-content",
        boxSizing: "border-box",
        padding: `${paddingV}px ${paddingH}px`,
        background: bgColor,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius,
        boxShadow: shadow,
        cursor: isButton ? "pointer" : "default",
        textDecoration: "none",
        transition: hoverLift ? "transform 0.1s, box-shadow 0.1s" : "none",
        userSelect: "none" as const,
    }

    const content = isStat ? (
        <>
            <span
                style={{
                    fontFamily: ff,
                    fontSize: statValueSize,
                    fontWeight: 400,
                    color: textColor,
                    lineHeight: 1,
                }}
            >
                {statValue}
            </span>
            <span
                style={{
                    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                    fontSize: statLabelSize,
                    fontWeight: 700,
                    color: statLabelColor,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    lineHeight: 1,
                }}
            >
                {statLabel}
            </span>
        </>
    ) : (
        <span
            style={{
                fontFamily: ff,
                fontSize,
                fontWeight,
                color: textColor,
                letterSpacing: `${letterSpacing}em`,
                textTransform: textTransform as any,
                lineHeight: 1,
                whiteSpace: "nowrap" as const,
            }}
        >
            {label}
        </span>
    )

    if (isButton && href) {
        return (
            <a
                href={href}
                target={openNewTab ? "_blank" : "_self"}
                rel={openNewTab ? "noopener noreferrer" : undefined}
                style={baseStyle}
                onMouseEnter={(e) => {
                    if (!hoverLift) return
                    e.currentTarget.style.transform = "translate(-1px, -1px)"
                    e.currentTarget.style.boxShadow = showShadow
                        ? `${shadowX + 1}px ${shadowY + 1}px 0 ${shadowColor}`
                        : "none"
                }}
                onMouseLeave={(e) => {
                    if (!hoverLift) return
                    e.currentTarget.style.transform = "translate(0,0)"
                    e.currentTarget.style.boxShadow = shadow
                }}
            >
                {content}
            </a>
        )
    }

    return <div style={baseStyle}>{content}</div>
}
