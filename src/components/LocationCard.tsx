// Compact info card: icon + title + subtitle + accent line.

type LocationCardProps = {
    iconType?: "none" | "emoji" | "svg" | "image"
    iconEmoji?: string
    iconSvgUrl?: string
    iconImage?: string
    iconSize?: number
    title?: string
    subtitle?: string
    accentLine?: string
    accentSuffix?: string
    bgColor?: string
    titleColor?: string
    subtitleColor?: string
    accentColor?: string
    titleFont?: string
    subtitleFont?: string
    accentFont?: string
    titleSize?: number
    subtitleSize?: number
    accentSize?: number
    padding?: number
    gap?: number
    borderRadius?: number
    showBorder?: boolean
    borderColor?: string
    showShadow?: boolean
    shadowColor?: string
    shadowX?: number
    shadowY?: number
}

// Callers may pass a font key from this map or a literal CSS stack, which
// passes straight through.
const FONT_MAP: Record<string, string> = {
    caveat: '"Caveat", cursive',
    anon: '"Anonymous Pro", monospace',
    mono: '"IBM Plex Mono", monospace',
    fredoka: '"Fredoka One", "Fredoka", cursive',
    fascinate: '"Fascinate Inline", cursive',
    sans: "system-ui, -apple-system, sans-serif",
    serif: "Georgia, serif",
}
const resolveFont = (f: string) => FONT_MAP[f] ?? f

const DEFAULTS: Required<Omit<LocationCardProps, "iconImage">> & { iconImage?: string } = {
    iconType: "emoji",
    iconEmoji: "🗺️",
    iconSvgUrl: "",
    iconImage: undefined,
    iconSize: 40,
    title: "Santiago, Chile",
    subtitle: "GMT-3 · Remote friendly",
    accentLine: "Open to relocation",
    accentSuffix: "✓",
    bgColor: "#f5eee6",
    titleColor: "#1a1520",
    subtitleColor: "#4a4560",
    accentColor: "#4F58AF",
    titleFont: "caveat",
    subtitleFont: "anon",
    accentFont: "mono",
    titleSize: 22,
    subtitleSize: 13,
    accentSize: 13,
    padding: 16,
    gap: 14,
    borderRadius: 12,
    showBorder: false,
    borderColor: "#1a1520",
    showShadow: false,
    shadowColor: "#1a1520",
    shadowX: 3,
    shadowY: 3,
}

export default function LocationCard(props: LocationCardProps) {
    const {
        iconType, iconEmoji, iconSvgUrl, iconImage, iconSize,
        title, subtitle, accentLine, accentSuffix,
        bgColor, titleColor, subtitleColor, accentColor,
        titleFont, subtitleFont, accentFont,
        titleSize, subtitleSize, accentSize,
        padding, gap, borderRadius,
        showBorder, borderColor, showShadow, shadowColor, shadowX, shadowY,
    } = { ...DEFAULTS, ...props }

    const iconSrc = iconType === "svg" ? iconSvgUrl : iconType === "image" ? iconImage : ""

    return (
        <div style={{
            width: "100%",
            background: bgColor,
            borderRadius,
            padding,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap,
            border: showBorder ? `2px solid ${borderColor}` : "none",
            boxShadow: showShadow ? `${shadowX}px ${shadowY}px 0 ${shadowColor}` : "none",
        }}>
            {iconType !== "none" && (
                <div style={{
                    width: iconSize + 16,
                    height: iconSize + 16,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {iconType === "emoji" ? (
                        <span style={{ fontSize: iconSize, lineHeight: 1 }}>{iconEmoji}</span>
                    ) : iconSrc ? (
                        <img src={iconSrc} alt="" style={{ width: iconSize, height: iconSize, objectFit: "contain" }} />
                    ) : null}
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                {title && (
                    <div style={{ fontFamily: resolveFont(titleFont), fontWeight: 400, fontSize: titleSize, color: titleColor, lineHeight: 1.2 }}>
                        {title}
                    </div>
                )}
                {subtitle && (
                    <div style={{ fontFamily: resolveFont(subtitleFont), fontWeight: 400, fontSize: subtitleSize, color: subtitleColor, lineHeight: 1.5 }}>
                        {subtitle}
                    </div>
                )}
                {accentLine && (
                    <div style={{
                        fontFamily: resolveFont(accentFont),
                        fontSize: accentSize,
                        color: accentColor,
                        lineHeight: 1.5,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                    }}>
                        {accentLine}
                        {accentSuffix && <span style={{ fontWeight: 400, opacity: 0.8 }}>{accentSuffix}</span>}
                    </div>
                )}
            </div>
        </div>
    )
}
