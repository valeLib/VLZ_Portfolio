import { useMemo } from "react"

// Retro / Y2K portfolio footer.

const FONT_STACKS: Record<string, string> = {
    Fredoka: '"Fredoka", sans-serif',
    Jua: '"Jua", sans-serif',
    "Anonymous Pro": '"Anonymous Pro", monospace',
    "IBM Plex Mono": '"IBM Plex Mono", monospace',
    Caveat: '"Caveat", cursive',
    "System Sans": "system-ui, -apple-system, sans-serif",
}

// Accent palette — cycled across link-group headings via modulo indexing.
const ACCENTS = ["#4F58AF", "#EE978E", "#FABA32", "#D4DF68", "#8BD9C3"]

type FooterLink = { label: string; url: string; newTab?: boolean }
type FooterGroup = { title: string; links: FooterLink[] }
type Social = { label: string; url: string }

const DEFAULTS = {
    background: "#F2EFE9",
    textColor: "#1C1B22",
    mutedColor: "#9896A8",
    headingFont: "Fredoka",
    bodyFont: "Anonymous Pro",
    wordmark: "Valentina Liberona",
    showTagline: true,
    tagline:
        "Unity developer & creative frontend engineer building playful, retro-flavored interfaces.",
    socialColor: "#4F58AF",
    copyright: "© {year} Valentina Liberona Zúñiga. All rights reserved.",
    autoYear: true,
    topBorder: true,
    borderColor: "#1C1B22",
    hardShadow: false,
    shadowColor: "#1C1B22",
    radius: 0,
    padding: 48,
    gap: 40,
    showSocials: true,
    groups: [
        {
            title: "Work",
            links: [
                { label: "Pawstchi", url: "#pawstchi", newTab: false },
                { label: "Goblin TD", url: "#goblin-td", newTab: false },
                { label: "Claws & Cue Balls", url: "#claws", newTab: false },
            ],
        },
        {
            title: "About",
            links: [
                { label: "Bio", url: "#about", newTab: false },
                { label: "Contact", url: "#contact", newTab: false },
            ],
        },
    ] as FooterGroup[],
    socials: [
        { label: "GitHub", url: "#" },
        { label: "LinkedIn", url: "#" },
        { label: "Itch.io", url: "#" },
    ] as Social[],
}

export default function Footer(props: Partial<typeof DEFAULTS> & { style?: React.CSSProperties }) {
    const {
        background,
        textColor,
        mutedColor,
        headingFont,
        bodyFont,
        wordmark,
        showTagline,
        tagline,
        groups,
        showSocials,
        socials,
        socialColor,
        copyright,
        autoYear,
        topBorder,
        borderColor,
        hardShadow,
        shadowColor,
        radius,
        padding,
        gap,
        style,
    } = { ...DEFAULTS, ...props }

    const year = new Date().getFullYear()
    const copyText = useMemo(() => {
        if (!copyright) return ""
        return autoYear ? copyright.replace(/\{year\}/g, String(year)) : copyright
    }, [copyright, autoYear, year])

    const headingStack = FONT_STACKS[headingFont] ?? FONT_STACKS.Fredoka
    const bodyStack = FONT_STACKS[bodyFont] ?? FONT_STACKS["Anonymous Pro"]

    return (
        <footer
            style={{
                background,
                color: textColor,
                fontFamily: bodyStack,
                borderRadius: radius,
                padding,
                boxSizing: "border-box",
                width: "100%",
                borderTop: topBorder ? `3px solid ${borderColor}` : "none",
                boxShadow: hardShadow ? `6px 6px 0 ${shadowColor}` : "none",
                display: "flex",
                flexDirection: "column",
                gap: padding * 0.75,
                ...style,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap,
                    justifyContent: "space-between",
                }}
            >
                {/* Brand block */}
                <div style={{ flex: "1 1 220px", minWidth: 200 }}>
                    <div
                        style={{
                            fontFamily: headingStack,
                            fontSize: 28,
                            fontWeight: 600,
                            letterSpacing: -0.5,
                        }}
                    >
                        {wordmark}
                    </div>
                    {showTagline && (
                        <p
                            style={{
                                margin: "10px 0 0",
                                fontSize: 14,
                                lineHeight: 1.5,
                                color: mutedColor,
                                maxWidth: 320,
                            }}
                        >
                            {tagline}
                        </p>
                    )}
                </div>

                {/* Link groups */}
                {(groups ?? []).map((g, gi: number) => (
                    <div key={gi} style={{ flex: "0 1 auto", minWidth: 120 }}>
                        <div
                            style={{
                                fontFamily: headingStack,
                                fontSize: 13,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: 1,
                                color: ACCENTS[gi % ACCENTS.length],
                                marginBottom: 12,
                            }}
                        >
                            {g.title}
                        </div>
                        <ul
                            style={{
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}
                        >
                            {(g.links ?? []).map((l, li: number) => (
                                <li key={li}>
                                    <a
                                        href={l.url || "#"}
                                        target={l.newTab ? "_blank" : undefined}
                                        rel={l.newTab ? "noopener noreferrer" : undefined}
                                        style={{
                                            color: textColor,
                                            textDecoration: "none",
                                            fontSize: 14,
                                            opacity: 0.85,
                                            transition: "opacity 0.15s, color 0.15s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = ACCENTS[gi % ACCENTS.length]
                                            e.currentTarget.style.opacity = "1"
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = textColor
                                            e.currentTarget.style.opacity = "0.85"
                                        }}
                                    >
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom bar */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    paddingTop: 18,
                    borderTop: `1.5px dashed ${mutedColor}`,
                }}
            >
                <span style={{ fontSize: 13, color: mutedColor }}>{copyText}</span>

                {showSocials && (
                    <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                        {(socials ?? []).map((s, si: number) => (
                            <a
                                key={si}
                                href={s.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: socialColor,
                                    textDecoration: "none",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    letterSpacing: 0.3,
                                    transition: "color 0.15s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color = ACCENTS[si % ACCENTS.length])
                                }
                                onMouseLeave={(e) => (e.currentTarget.style.color = socialColor)}
                            >
                                {s.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </footer>
    )
}
