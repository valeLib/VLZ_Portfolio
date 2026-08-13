// Scrapbook-style info card.

type InfoCardProps = {
    device?: string
    iconType?: string
    iconEmoji?: string
    iconImage?: string
    iconSvgUrl?: string
    iconSize?: number
    iconBg?: string
    showIconBg?: boolean
    label?: string
    labelPosition?: string
    labelBottomGap?: number
    title?: string
    showBadge?: boolean
    badgeText?: string
    badgeBg?: string
    badgeText2?: string
    badgeBorderColor?: string
    badgeBorderWidth?: number
    badgeBorderRadius?: number
    badgeFontSize?: number
    badgePaddingH?: number
    badgePaddingV?: number
    badgeFontFamily?: string
    titleBadgeGap?: number
    badgeMarginLeft?: number
    stackBadgeOnMobile?: boolean
    bodyMode?: string
    body?: string
    tags?: string[]
    tagBg?: string
    tagText?: string
    tagBorder?: string
    tagBorderWidth?: number
    tagBorderRadius?: number
    tagFontSize?: number
    tagPaddingH?: number
    tagPaddingV?: number
    tagGap?: number
    bgColor?: string
    borderColor?: string
    labelColor?: string
    titleColor?: string
    bodyColor?: string
    borderWidth?: number
    borderRadius?: number
    showShadow?: boolean
    shadowColor?: string
    shadowX?: number
    shadowY?: number
    paddingH?: number
    paddingV?: number
    paddingHMobile?: number
    paddingVMobile?: number
    labelSize?: number
    titleSize?: number
    titleSizeMobile?: number
    bodySize?: number
    labelSpacing?: number
    rotate?: number
}

const DEFAULTS: Required<InfoCardProps> = {
    device: "desktop",
    iconType: "none",
    iconEmoji: "🎮",
    iconImage: "",
    iconSvgUrl: "",
    iconSize: 22,
    iconBg: "#8BD9C3",
    showIconBg: false,
    label: "Unity Dev + Frontend",
    labelPosition: "below",
    labelBottomGap: 10,
    title: "Pignus",
    showBadge: true,
    badgeText: "2023–Now",
    badgeBg: "#FABA32",
    badgeText2: "#1a1520",
    badgeBorderColor: "#1a1520",
    badgeBorderWidth: 2,
    badgeBorderRadius: 8,
    badgeFontSize: 13,
    badgePaddingH: 12,
    badgePaddingV: 6,
    badgeFontFamily: "mono",
    titleBadgeGap: 10,
    badgeMarginLeft: 0,
    stackBadgeOnMobile: true,
    bodyMode: "tags",
    body: "Unity, C#, HLSL shaders, VR optimization.",
    tags: ["Unity", "C#", "Meta Quest", "Vue.js"],
    tagBg: "rgba(255,255,255,0.12)",
    tagText: "#ffffff",
    tagBorder: "rgba(255,255,255,0.35)",
    tagBorderWidth: 1.5,
    tagBorderRadius: 6,
    tagFontSize: 13,
    tagPaddingH: 12,
    tagPaddingV: 6,
    tagGap: 8,
    bgColor: "#1a1520",
    borderColor: "#1a1520",
    labelColor: "#8BD9C3",
    titleColor: "#ffffff",
    bodyColor: "#aaa8b8",
    borderWidth: 0,
    borderRadius: 14,
    showShadow: false,
    shadowColor: "#1a1520",
    shadowX: 3,
    shadowY: 3,
    paddingH: 18,
    paddingV: 16,
    paddingHMobile: 14,
    paddingVMobile: 12,
    labelSize: 10,
    titleSize: 22,
    titleSizeMobile: 18,
    bodySize: 13,
    labelSpacing: 0.08,
    rotate: 0,
}

export default function InfoCard(props: InfoCardProps) {
    const {
        device,
        iconType, iconEmoji, iconImage, iconSvgUrl,
        iconSize, iconBg, showIconBg,
        label, labelPosition, labelBottomGap, title,
        showBadge, badgeText, badgeBg, badgeText2, badgeBorderColor, badgeBorderWidth,
        badgeBorderRadius, badgeFontSize, badgePaddingH, badgePaddingV, badgeFontFamily,
        titleBadgeGap, badgeMarginLeft, stackBadgeOnMobile,
        bodyMode, body, tags,
        tagBg, tagText, tagBorder, tagBorderWidth, tagBorderRadius,
        tagFontSize, tagPaddingH, tagPaddingV, tagGap,
        bgColor, borderColor, labelColor, titleColor, bodyColor,
        borderWidth, borderRadius,
        showShadow, shadowColor, shadowX, shadowY,
        paddingH, paddingV, paddingHMobile, paddingVMobile,
        labelSize, titleSize, titleSizeMobile, bodySize,
        labelSpacing, rotate,
    } = { ...DEFAULTS, ...props }

    // ── Device-aware values ─────────────────────────────────────────────────
    const isMobile = device === "mobile"
    const stackBadge = isMobile && stackBadgeOnMobile
    const effTitleSize = isMobile ? titleSizeMobile : titleSize
    const effPaddingH = isMobile ? paddingHMobile : paddingH
    const effPaddingV = isMobile ? paddingVMobile : paddingV

    const shadow = showShadow ? `${shadowX}px ${shadowY}px 0 ${shadowColor}` : "none"

    const resolveBadgeFont = (f: string) =>
        f === "fredoka" ? "'Fredoka One', cursive" :
        f === "caveat" ? "'Caveat', cursive" :
        f === "mono" ? "'IBM Plex Mono', monospace" :
        f === "anon" ? "'Anonymous Pro', monospace" :
        f === "fascinate" ? "'Fascinate Inline', cursive" :
        "sans-serif"

    const renderIcon = () => {
        if (iconType === "none") return null
        let src = ""
        if (iconType === "svg") src = iconSvgUrl
        if (iconType === "image") src = iconImage
        const inner = iconType === "emoji"
            ? <span style={{ fontSize: iconSize, lineHeight: 1 }}>{iconEmoji}</span>
            : src ? <img src={src} alt="" style={{ width: iconSize, height: iconSize, objectFit: "contain", display: "block" }} /> : null
        if (!inner) return null
        const cs = iconSize + 12
        return (
            <div style={{
                width: showIconBg ? cs : iconSize,
                height: showIconBg ? cs : iconSize,
                borderRadius: showIconBg ? "50%" : 0,
                background: showIconBg ? iconBg : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
            }}>{inner}</div>
        )
    }

    const LabelEl = label ? (
        <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: labelSize,
            fontWeight: 700,
            color: labelColor,
            letterSpacing: `${labelSpacing}em`,
            textTransform: "uppercase" as const,
        }}>{label}</div>
    ) : null

    const TitleRow = (
        <div style={{
            display: "flex",
            flexDirection: stackBadge ? "column" : "row",
            alignItems: stackBadge ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: titleBadgeGap,
        }}>
            <div style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: effTitleSize,
                fontWeight: 400,
                color: titleColor,
                lineHeight: 1.2,
                flex: stackBadge ? "none" : 1,
                minWidth: 0,
                overflowWrap: "anywhere" as const,
                wordBreak: "break-word" as const,
            }}>{title}</div>

            {showBadge && badgeText && (
                <span style={{
                    fontFamily: resolveBadgeFont(badgeFontFamily),
                    fontSize: badgeFontSize,
                    fontWeight: 700,
                    color: badgeText2,
                    background: badgeBg,
                    border: `${badgeBorderWidth}px solid ${badgeBorderColor}`,
                    borderRadius: badgeBorderRadius,
                    padding: `${badgePaddingV}px ${badgePaddingH}px`,
                    marginLeft: stackBadge ? 0 : badgeMarginLeft,
                    whiteSpace: "nowrap" as const,
                    lineHeight: 1,
                    flexShrink: 0,
                }}>{badgeText}</span>
            )}
        </div>
    )

    const BodyEl = () => {
        if (bodyMode === "text" && body) {
            return (
                <p style={{
                    fontFamily: "'Anonymous Pro', 'Courier New', monospace",
                    fontSize: bodySize,
                    color: bodyColor,
                    lineHeight: 1.7,
                    margin: 0,
                }}>{body}</p>
            )
        }
        if (bodyMode === "tags" && tags?.length > 0) {
            return (
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: tagGap }}>
                    {tags.map((tag, i) => (
                        <span key={i} style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: tagFontSize,
                            fontWeight: 700,
                            color: tagText,
                            background: tagBg,
                            border: `${tagBorderWidth}px solid ${tagBorder}`,
                            borderRadius: tagBorderRadius,
                            padding: `${tagPaddingV}px ${tagPaddingH}px`,
                            lineHeight: 1,
                            whiteSpace: "nowrap" as const,
                            display: "inline-block",
                        }}>{tag}</span>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div style={{
            width: "100%",
            background: bgColor,
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius,
            boxShadow: shadow,
            padding: `${effPaddingV}px ${effPaddingH}px`,
            boxSizing: "border-box",
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            transform: `rotate(${rotate}deg)`,
            fontFamily: "'Anonymous Pro', 'Courier New', monospace",
        }}>
            {renderIcon()}

            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0 }}>
                {labelPosition === "above" && label && (
                    <div style={{ marginBottom: labelBottomGap }}>{LabelEl}</div>
                )}

                <div style={{ marginBottom: labelPosition === "below" ? 0 : (bodyMode !== "none" ? 10 : 0) }}>
                    {TitleRow}
                </div>

                {labelPosition === "below" && label && (
                    <div style={{ marginTop: 4, marginBottom: labelBottomGap }}>{LabelEl}</div>
                )}

                <BodyEl />
            </div>
        </div>
    )
}
