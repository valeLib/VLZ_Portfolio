// Compact info card: icon + title + subtitle + accent line.

type LocationCardProps = {
    iconEmoji?: string
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
}

const DEFAULTS: Required<LocationCardProps> = {
    iconEmoji: "🗺️",
    iconSize: 40,
    title: "Santiago, Chile",
    subtitle: "GMT-3 · Remote friendly",
    accentLine: "Open to relocation",
    accentSuffix: "✓",
    bgColor: "rgba(255, 255, 255, 0)",
    titleColor: "#1a1520",
    subtitleColor: "#4a4560",
    accentColor: "#4F58AF",
    titleFont: '"Caveat", cursive',
    subtitleFont: '"Anonymous Pro", monospace',
    accentFont: '"IBM Plex Mono", monospace',
    titleSize: 22,
    subtitleSize: 13,
    accentSize: 13,
    padding: 6,
    gap: 14,
    borderRadius: 12,
}

export default function LocationCard(props: LocationCardProps) {
    const {
        iconEmoji, iconSize,
        title, subtitle, accentLine, accentSuffix,
        bgColor, titleColor, subtitleColor, accentColor,
        titleFont, subtitleFont, accentFont,
        titleSize, subtitleSize, accentSize,
        padding, gap, borderRadius,
    } = { ...DEFAULTS, ...props }

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
        }}>
            <div style={{
                width: iconSize + 16,
                height: iconSize + 16,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <span style={{ fontSize: iconSize, lineHeight: 1 }}>{iconEmoji}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                {title && (
                    <div style={{ fontFamily: titleFont, fontSize: titleSize, color: titleColor, lineHeight: 1.2 }}>
                        {title}
                    </div>
                )}
                {subtitle && (
                    <div style={{ fontFamily: subtitleFont, fontSize: subtitleSize, color: subtitleColor, lineHeight: 1.5 }}>
                        {subtitle}
                    </div>
                )}
                {accentLine && (
                    <div style={{
                        fontFamily: accentFont,
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
