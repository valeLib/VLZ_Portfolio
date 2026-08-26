import { useState } from "react"
import type { CSSProperties } from "react"

// Bracketed pill for links that leave the site: `[ ▶ Play Prototype ↗ ]`.

const FONT_STACKS: Record<string, string> = {
    Fredoka: "'Fredoka', system-ui, sans-serif",
    Jua: "'Jua', system-ui, sans-serif",
    "IBM Plex Mono": "'IBM Plex Mono', 'Courier New', monospace",
    "Anonymous Pro": "'Anonymous Pro', 'Courier New', monospace",
    Caveat: "'Caveat', cursive",
    "Doppio One": "'Doppio One', system-ui, sans-serif",
    System: "system-ui, -apple-system, sans-serif",
    Inherit: "inherit",
}

const LEAD_GLYPHS: Record<string, string> = {
    Play: "▶", Download: "↓", Code: "</>", Doc: "▤", Link: "🔗", Star: "✦", Folder: "▸", None: "",
}
const TRAIL_GLYPHS: Record<string, string> = {
    "Arrow up-right": "↗", "Arrow right": "→", External: "⧉", Chevron: "›", None: "",
}
const BRACKETS: Record<string, [string, string]> = {
    Square: ["[", "]"], Round: ["(", ")"], Curly: ["{", "}"], Angle: ["<", ">"],
    Slash: ["/", "/"], Pipe: ["|", "|"], None: ["", ""],
}

export type ExternalLinkProps = {
    label?: string
    href?: string
    newTab?: boolean
    bracketStyle?: string
    bracketOpen?: string
    bracketClose?: string
    bracketColor?: string
    bracketGap?: number
    leadStyle?: string
    leadCustom?: string
    trailStyle?: string
    trailCustom?: string
    glyphGap?: number
    leadColor?: string
    trailColor?: string
    font?: string
    fontSize?: number
    fontWeight?: number
    letterSpacing?: number
    textTransform?: string
    textColor?: string
    fill?: string
    radius?: number
    paddingX?: number
    paddingY?: number
    borderWidth?: number
    borderStyle?: string
    borderColor?: string
    shadowOn?: boolean
    shadowX?: number
    shadowY?: number
    shadowColor?: string
    hoverEffect?: string
    hoverFill?: string
    hoverTextColor?: string
    hoverBorderColor?: string
    hoverArrowShift?: number
    fullWidth?: boolean
    align?: string
    style?: CSSProperties
}

const DEFAULTS = {
    label: "Play Prototype",
    href: "",
    newTab: true,
    bracketStyle: "Square",
    bracketOpen: "[",
    bracketClose: "]",
    bracketColor: "",
    bracketGap: 8,
    leadStyle: "Play",
    leadCustom: "▶",
    trailStyle: "Arrow up-right",
    trailCustom: "↗",
    glyphGap: 8,
    leadColor: "",
    trailColor: "",
    font: "IBM Plex Mono",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.02,
    textTransform: "none",
    textColor: "#1C1B22",
    fill: "#FFFDF8",
    radius: 999,
    paddingX: 18,
    paddingY: 12,
    borderWidth: 2.5,
    borderStyle: "solid",
    borderColor: "#1C1B22",
    shadowOn: true,
    shadowX: 4,
    shadowY: 4,
    shadowColor: "#1C1B22",
    hoverEffect: "Nudge arrow",
    hoverFill: "",
    hoverTextColor: "",
    hoverBorderColor: "",
    hoverArrowShift: 2,
    fullWidth: false,
    align: "left",
} satisfies ExternalLinkProps

export default function ExternalLink(props: ExternalLinkProps) {
    const {
        label, href, newTab, bracketStyle, bracketOpen, bracketClose, bracketColor, bracketGap,
        leadStyle, leadCustom, trailStyle, trailCustom, glyphGap, leadColor, trailColor,
        font, fontSize, fontWeight, letterSpacing, textTransform, textColor, fill, radius,
        paddingX, paddingY, borderWidth, borderStyle, borderColor,
        shadowOn, shadowX, shadowY, shadowColor,
        hoverEffect, hoverFill, hoverTextColor, hoverBorderColor, hoverArrowShift,
        fullWidth, align, style,
    } = { ...DEFAULTS, ...props }

    const [hover, setHover] = useState(false)
    const [pressed, setPressed] = useState(false)

    const ff = FONT_STACKS[font] ?? "inherit"
    const [defOpen, defClose] = BRACKETS[bracketStyle] ?? ["", ""]
    const openChar = bracketStyle === "Custom" ? bracketOpen : defOpen
    const closeChar = bracketStyle === "Custom" ? bracketClose : defClose
    const lead = leadStyle === "Custom" ? leadCustom : (LEAD_GLYPHS[leadStyle] ?? "")
    const trail = trailStyle === "Custom" ? trailCustom : (TRAIL_GLYPHS[trailStyle] ?? "")

    const active = hover
    const lift = hoverEffect === "Lift" && active
    const press = pressed
    const invert = hoverEffect === "Invert" && active
    const nudge = hoverEffect === "Nudge arrow" && active
    const grow = hoverEffect === "Scale" && active
    const underline = hoverEffect === "Underline" && active

    const bgNow = invert || (active && hoverFill) ? (hoverFill || fill) : fill
    const textNow = active && hoverTextColor ? hoverTextColor : textColor
    const borderNow = active && hoverBorderColor ? hoverBorderColor : borderColor

    // Press sinks the pill into its own shadow — always active, independent of hoverEffect.
    const shadowNow = shadowOn
        ? press
            ? `0px 0px 0 ${shadowColor}`
            : `${lift ? shadowX + 2 : shadowX}px ${lift ? shadowY + 2 : shadowY}px 0 ${shadowColor}`
        : "none"
    const translate = press
        ? `translate(${shadowX}px, ${shadowY}px)`
        : lift
            ? "translate(-2px, -2px)"
            : grow
                ? "scale(1.04)"
                : "none"

    const wrapperStyle: CSSProperties = {
        display: fullWidth ? "flex" : "inline-flex",
        justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        width: fullWidth ? "100%" : undefined,
        ...style,
    }

    const linkStyle: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: bracketGap,
        boxSizing: "border-box",
        padding: `${paddingY}px ${paddingX}px`,
        background: bgNow,
        color: textNow,
        fontFamily: ff,
        fontSize,
        fontWeight,
        letterSpacing: `${letterSpacing}em`,
        textTransform: textTransform as CSSProperties["textTransform"],
        lineHeight: 1,
        textDecoration: "none",
        whiteSpace: "nowrap",
        borderRadius: radius,
        border: borderWidth > 0 ? `${borderWidth}px ${borderStyle} ${borderNow}` : "none",
        boxShadow: shadowNow,
        transform: translate,
        cursor: "pointer",
        transition:
            "transform .13s ease, box-shadow .13s ease, background .18s ease, color .18s ease, border-color .18s ease",
    }

    const bracketCss: CSSProperties = {
        color: bracketColor || textNow,
        opacity: bracketColor ? 1 : 0.55,
        flexShrink: 0,
    }

    return (
        <div style={wrapperStyle}>
            <a
                href={href || "#"}
                target={newTab ? "_blank" : undefined}
                rel={newTab ? "noopener noreferrer" : undefined}
                style={linkStyle}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => { setHover(false); setPressed(false) }}
                onMouseDown={() => setPressed(true)}
                onMouseUp={() => setPressed(false)}
            >
                {openChar && <span style={bracketCss} aria-hidden="true">{openChar}</span>}
                <span style={{ display: "inline-flex", alignItems: "center", gap: glyphGap }}>
                    {lead && (
                        <span aria-hidden="true" style={{ color: leadColor || "currentColor", flexShrink: 0 }}>
                            {lead}
                        </span>
                    )}
                    <span
                        style={{
                            borderBottom: underline ? "1.5px solid currentColor" : "1.5px solid transparent",
                            paddingBottom: 1,
                            transition: "border-color .18s ease",
                        }}
                    >
                        {label}
                    </span>
                    {trail && (
                        <span
                            aria-hidden="true"
                            style={{
                                color: trailColor || "currentColor",
                                flexShrink: 0,
                                transform: nudge ? `translate(${hoverArrowShift}px, -${hoverArrowShift}px)` : "none",
                                transition: "transform .18s ease",
                            }}
                        >
                            {trail}
                        </span>
                    )}
                </span>
                {closeChar && <span style={bracketCss} aria-hidden="true">{closeChar}</span>}
            </a>
        </div>
    )
}
