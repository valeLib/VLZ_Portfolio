// A retro pastel info card with three text layers: label (uppercase eyebrow),
// title (bold heading), and body (plain text, HTML string, or React node).

// ── Font stacks (shared across the project) ────────────────────────────────
const FONT_STACKS: Record<string, string> = {
    "IBM Plex Mono":   "'IBM Plex Mono', 'Courier New', monospace",
    "Anonymous Pro":   "'Anonymous Pro', 'Courier New', monospace",
    "Fredoka":         "'Fredoka', system-ui, sans-serif",
    "Jua":             "'Jua', system-ui, sans-serif",
    "Caveat":          "'Caveat', cursive",
    "Doppio One":      "'Doppio One', system-ui, sans-serif",
    "Kantumruy Pro":   "'Kantumruy Pro', system-ui, sans-serif",
    "Leckerli One":    "'Leckerli One', cursive",
    "Gveret Levin":    "'Gveret Levin', system-ui, sans-serif",
    "System":          "system-ui, -apple-system, sans-serif",
    "Inherit":         "inherit",
}

type PastelCardProps = {
    // Content
    label?: string
    title?: string
    body?: any // React node or HTML string
    // Card
    backgroundColor?: string
    padding?: number
    borderColor?: string
    borderWidth?: number
    borderRadius?: number
    // Shadow
    showShadow?: boolean
    shadowColor?: string
    shadowOffsetX?: number
    shadowOffsetY?: number
    // Stack
    contentGap?: number
    // Label
    showLabel?: boolean
    labelFont?: string
    labelWeight?: string
    labelSize?: number
    labelColor?: string
    labelTracking?: number
    labelUppercase?: boolean
    // Title
    showTitle?: boolean
    titleFont?: string
    titleWeight?: string
    titleSize?: number
    titleColor?: string
    titleLineHeight?: number
    // Body
    showBody?: boolean
    bodyFont?: string
    bodyWeight?: string
    bodySize?: number
    bodyColor?: string
    bodyLineHeight?: number
    // Spacing between blocks
    labelTitleGap?: number
    titleBodyGap?: number
}

const DEFAULTS: Required<PastelCardProps> = {
    label: "AUTONOMY",
    title: "Player in control",
    body: "<p>No energy systems, no timers, no forced rest windows. Every session is player-initiated. Monetization is optional and transparent.</p>",
    backgroundColor: "#7AC7B2",
    padding: 24,
    borderColor: "#1a1520",
    borderWidth: 2,
    borderRadius: 16,
    showShadow: true,
    shadowColor: "#1a1520",
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    contentGap: 4,
    showLabel: true,
    labelFont: "IBM Plex Mono",
    labelWeight: "700",
    labelSize: 11,
    labelColor: "#1a1520",
    labelTracking: 0.12,
    labelUppercase: true,
    showTitle: true,
    titleFont: "Fredoka",
    titleWeight: "700",
    titleSize: 22,
    titleColor: "#1a1520",
    titleLineHeight: 1.15,
    showBody: true,
    bodyFont: "IBM Plex Mono",
    bodyWeight: "400",
    bodySize: 13,
    bodyColor: "#1a1520",
    bodyLineHeight: 1.5,
    labelTitleGap: 6,
    titleBodyGap: 10,
}

export default function PastelCard(props: PastelCardProps) {
    const {
        label, title, body,
        backgroundColor, padding, borderColor, borderWidth, borderRadius,
        showShadow, shadowColor, shadowOffsetX, shadowOffsetY,
        contentGap,
        showLabel, labelFont, labelWeight, labelSize, labelColor, labelTracking, labelUppercase,
        showTitle, titleFont, titleWeight, titleSize, titleColor, titleLineHeight,
        showBody, bodyFont, bodyWeight, bodySize, bodyColor, bodyLineHeight,
        labelTitleGap, titleBodyGap,
    } = { ...DEFAULTS, ...props }

    const shadow = showShadow
        ? `${shadowOffsetX}px ${shadowOffsetY}px 0 ${shadowColor}`
        : "none"

    // Body accepts a React node, an HTML string, or plain text.
    let bodyContent: React.ReactNode = null
    if (showBody) {
        const bodyStyle: React.CSSProperties = {
            fontFamily: FONT_STACKS[bodyFont] ?? "inherit",
            fontWeight: bodyWeight as any,
            fontSize: bodySize,
            lineHeight: bodyLineHeight,
            color: bodyColor,
            width: "100%",
        }
        if (body != null && typeof body !== "string") {
            bodyContent = <div style={bodyStyle}>{body as React.ReactNode}</div>
        } else if (typeof body === "string") {
            bodyContent = <div style={bodyStyle} dangerouslySetInnerHTML={{ __html: body }} />
        }
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            background: backgroundColor,
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: borderRadius,
            padding: padding,
            boxShadow: shadow,
            display: "flex",
            flexDirection: "column",
            gap: contentGap,
            overflow: "hidden",
        }}>
            {showLabel && (
                <div style={{
                    fontFamily: FONT_STACKS[labelFont] ?? "inherit",
                    fontWeight: labelWeight as any,
                    fontSize: labelSize,
                    color: labelColor,
                    letterSpacing: `${labelTracking}em`,
                    textTransform: (labelUppercase ? "uppercase" : "none") as React.CSSProperties["textTransform"],
                    lineHeight: 1.2,
                    marginBottom: showTitle ? Math.max(0, labelTitleGap - contentGap) : 0,
                }}>
                    {label}
                </div>
            )}
            {showTitle && (
                <div style={{
                    fontFamily: FONT_STACKS[titleFont] ?? "inherit",
                    fontWeight: titleWeight as any,
                    fontSize: titleSize,
                    color: titleColor,
                    lineHeight: titleLineHeight,
                    marginBottom: showBody ? Math.max(0, titleBodyGap - contentGap) : 0,
                }}>
                    {title}
                </div>
            )}
            {bodyContent}
        </div>
    )
}
