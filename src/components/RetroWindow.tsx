// RetroWindow.tsx
// A retro OS-style window chrome component.
// Ported from Framer: framer imports + addPropertyControls removed, DEFAULTS merge.

type ContentMode = "frame" | "text" | "richText"
type Align = "start" | "center" | "end"

type RetroWindowProps = {
    title?: string
    titleBarColor?: string
    titleColor?: string
    showTrafficLights?: boolean
    dotRed?: string
    dotYellow?: string
    dotGreen?: string
    dotSize?: number
    bodyColor?: string
    bodyPadding?: number
    contentAlignH?: Align
    contentAlignV?: Align
    borderColor?: string
    borderWidth?: number
    borderRadius?: number
    showShadow?: boolean
    shadowColor?: string
    shadowOffsetX?: number
    shadowOffsetY?: number
    contentMode?: ContentMode
    plainText?: string
    plainTextColor?: string
    plainTextSize?: number
    plainTextAlign?: "left" | "center" | "right"
    richText?: any
    richTextColor?: string
    richTextSize?: number
    children?: React.ReactNode
}

const DEFAULTS = {
    title: "PROFILE.EXE",
    titleBarColor: "#4F58AF",
    titleColor: "#ffffff",
    showTrafficLights: true,
    dotRed: "#EE978E",
    dotYellow: "#FABA32",
    dotGreen: "#D4DF68",
    dotSize: 11,
    bodyColor: "#ffffff",
    bodyPadding: 20,
    contentAlignH: "start" as Align,
    contentAlignV: "start" as Align,
    borderColor: "#1a1520",
    borderWidth: 2,
    borderRadius: 8,
    showShadow: true,
    shadowColor: "#1a1520",
    shadowOffsetX: 4,
    shadowOffsetY: 4,
    contentMode: "frame" as ContentMode,
    plainText: "Type something here…",
    plainTextColor: "#1a1520",
    plainTextSize: 14,
    plainTextAlign: "left" as "left" | "center" | "right",
    richText: "<p>Bind this to a <strong>CMS formatted text field</strong>.</p>",
    richTextColor: "#1a1520",
    richTextSize: 14,
}

export default function RetroWindow(props: RetroWindowProps) {
    const {
        title, titleBarColor, titleColor,
        showTrafficLights, dotRed, dotYellow, dotGreen, dotSize,
        bodyColor, bodyPadding,
        contentAlignH, contentAlignV,
        borderColor, borderWidth, borderRadius,
        showShadow, shadowColor, shadowOffsetX, shadowOffsetY,
        contentMode, plainText, plainTextColor, plainTextSize, plainTextAlign,
        richText, richTextColor, richTextSize,
        children,
    } = { ...DEFAULTS, ...props }

    const shadow = showShadow
        ? `${shadowOffsetX}px ${shadowOffsetY}px 0 ${shadowColor}`
        : "none"

    let bodyContent: React.ReactNode
    if (contentMode === "text") {
        bodyContent = (
            <div style={{
                color: plainTextColor,
                fontSize: plainTextSize,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap" as const,
                fontFamily: "inherit",
                textAlign: plainTextAlign,
                width: "100%",
            }}>
                {plainText}
            </div>
        )
    } else if (contentMode === "richText") {
        const baseStyle: React.CSSProperties = {
            color: richTextColor,
            fontSize: richTextSize,
            lineHeight: 1.6,
            width: "100%",
            fontFamily: "inherit",
        }
        if (richText != null && typeof richText !== "string") {
            bodyContent = <div style={baseStyle}>{richText as React.ReactNode}</div>
        } else if (typeof richText === "string") {
            bodyContent = (
                <div
                    style={baseStyle}
                    dangerouslySetInnerHTML={{ __html: richText }}
                />
            )
        } else {
            bodyContent = null
        }
    } else {
        bodyContent = children
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: borderRadius,
            overflow: "hidden",
            boxShadow: shadow,
            boxSizing: "border-box",
            fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
        }}>
            <div style={{
                background: titleBarColor,
                borderBottom: `${borderWidth}px solid ${borderColor}`,
                padding: "0 12px",
                height: 36,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
            }}>
                {showTrafficLights && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        {[dotRed, dotYellow, dotGreen].map((c, i) => (
                            <div key={i} style={{
                                width: dotSize,
                                height: dotSize,
                                borderRadius: "50%",
                                background: c,
                                border: `${borderWidth}px solid ${borderColor}`,
                                flexShrink: 0,
                            }} />
                        ))}
                    </div>
                )}
                <span style={{
                    color: titleColor,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    userSelect: "none" as const,
                    textShadow: "1px 1px 0 rgba(0,0,0,0.25)",
                    flex: 1,
                    whiteSpace: "nowrap" as const,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>{title}</span>
            </div>

            <div style={{
                flex: 1,
                background: bodyColor,
                padding: bodyPadding,
                overflow: "auto",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: contentAlignV,
                alignItems: contentAlignH,
            }}>
                {bodyContent}
            </div>
        </div>
    )
}
