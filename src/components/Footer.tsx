import type { CSSProperties } from "react"
import Appear from "./Appear"
import { CV_FILE, CV_URL } from "../lib/paths"
import { useT } from "../lib/i18n"

// Retro / Y2K portfolio footer: a compact closing profile card — a short
// self-introduction on the left, the outbound links on the right, and a thin
// signature line underneath.

const FONT_STACKS: Record<string, string> = {
    Fredoka: '"Fredoka", sans-serif',
    Jua: '"Jua", sans-serif',
    "Anonymous Pro": '"Anonymous Pro", monospace',
    "IBM Plex Mono": '"IBM Plex Mono", monospace',
    Caveat: '"Caveat", cursive',
    "System Sans": "system-ui, -apple-system, sans-serif",
}

/**
 * Icons are drawn inline rather than pulled from a library: the project has no
 * icon dependency and four glyphs do not justify adding one. All four are
 * single-colour, filled, and share the 24x24 box so they align optically.
 */
type IconName = "github" | "linkedin" | "itch" | "download"

function LinkIcon({ name, size = 17 }: { name: IconName; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            {name === "github" && (
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            )}
            {name === "linkedin" && (
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            )}
            {name === "itch" && (
                <>
                    {/* Scalloped awning over a storefront: the itch.io silhouette,
                        simplified to shapes that hold up at 17px. */}
                    <path d="M2 6.6 L4.2 2.6 H19.8 L22 6.6 q-2 1.8 -4 0 q-2 1.8 -4 0 q-2 1.8 -4 0 q-2 1.8 -4 0 q-2 1.8 -4 0 Z" />
                    <path
                        fillRule="evenodd"
                        d="M3.4 9.4 h17.2 v9.6 a2.4 2.4 0 0 1 -2.4 2.4 h-12.4 a2.4 2.4 0 0 1 -2.4 -2.4 Z M10.15 12.8 h3.7 v5.2 h-3.7 Z"
                    />
                </>
            )}
            {name === "download" && (
                <>
                    <path d="M10.7 2.8 h2.6 v7.9 h-2.6 z" />
                    <path d="M12 16.2 L6.9 10.2 H17.1 Z" />
                    <path d="M3.6 14.6 h2.6 v3.9 h11.6 v-3.9 h2.6 v4.5 a2.2 2.2 0 0 1 -2.2 2.2 h-12.4 a2.2 2.2 0 0 1 -2.2 -2.2 z" />
                </>
            )}
        </svg>
    )
}

type Social = {
    label: string
    url: string
    icon: IconName
    /** Filename to save as. Present => rendered as a download link. */
    download?: string
    /** Replaces the visible label for assistive tech when it needs more context. */
    ariaLabel?: string
}

const DEFAULTS = {
    // Both call sites sit the footer on the indigo sheet; the defaults describe
    // that pairing so off-white type is legible without being passed a colour.
    background: "#4F58AF", // liberty
    mutedColor: "#F5EEE6", // countryWhite
    headingFont: "Fredoka",
    bodyFont: "Anonymous Pro",
    introColor: "#F5EEE6", // countryWhite
    showSummary: true,
    linksTitleColor: "#EE978E", // tangerine
    // Links rest in off-white and only warm to tangerine on hover/focus, so the
    // group reads as one block rather than four permanent accents.
    socialColor: "#F5EEE6", // countryWhite
    socialHoverColor: "#EE978E", // tangerine
    copyright: "© {year} Valentina Sofía Liberona Zúñiga",
    autoYear: true,
    topBorder: true,
    borderColor: "#1C1B22",
    hardShadow: false,
    shadowColor: "#1C1B22",
    radius: 0,
    padding: 48,
    /** Caps the content at the site's reading column so the two halves do not
     *  drift a thousand pixels apart on a wide display. */
    contentMaxWidth: 1200,
    gap: 40,
    showSocials: true,
}

/** The three outbound profiles: proper names, identical in every locale. */
const PROFILE_LINKS: Social[] = [
    { label: "GitHub", url: "https://github.com/valeLib", icon: "github" },
    {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/valentina-liberona/",
        icon: "linkedin",
    },
    { label: "Itch.io", url: "https://valelizu.itch.io/", icon: "itch" },
]

/** Copy that follows the active locale unless the call site overrides it. */
type FooterCopy = {
    /** First line of the mini profile — carries the name at reading size. */
    intro: string
    summary: string
    linksTitle: string
    socials: Social[]
}

export default function Footer(
    props: Partial<typeof DEFAULTS> & Partial<FooterCopy> & { style?: CSSProperties }
) {
    const t = useT()
    // Translated first, so an explicit prop still wins over the locale default.
    const copy: FooterCopy = {
        intro: t("footerIntro"),
        summary: t("footerSummary"),
        linksTitle: t("footerLinksTitle"),
        socials: [
            ...PROFILE_LINKS,
            {
                label: t("footerDownloadCv"),
                url: CV_URL,
                icon: "download",
                download: CV_FILE,
                ariaLabel: t("footerDownloadCvAria"),
            },
        ],
    }
    const {
        background,
        mutedColor,
        headingFont,
        bodyFont,
        intro,
        introColor,
        showSummary,
        summary,
        linksTitle,
        linksTitleColor,
        showSocials,
        socials,
        socialColor,
        socialHoverColor,
        copyright,
        autoYear,
        topBorder,
        borderColor,
        hardShadow,
        shadowColor,
        radius,
        padding,
        contentMaxWidth,
        gap,
        style,
    } = { ...DEFAULTS, ...copy, ...props }

    const year = new Date().getFullYear()
    const copyText = !copyright
        ? ""
        : autoYear
            ? copyright.replace(/\{year\}/g, String(year))
            : copyright

    const headingStack = FONT_STACKS[headingFont] ?? FONT_STACKS.Fredoka
    const bodyStack = FONT_STACKS[bodyFont] ?? FONT_STACKS["Anonymous Pro"]
    // Auto side margins centre each row once it hits the cap.
    const column: CSSProperties = { width: "100%", maxWidth: contentMaxWidth, margin: "0 auto" }

    return (
        <footer
            style={{
                background,
                color: mutedColor,
                fontFamily: bodyStack,
                borderRadius: radius,
                // Vertical padding runs shorter than horizontal: the band should
                // close the page, not open another one.
                padding: `${Math.round(padding * 0.7)}px ${padding}px`,
                boxSizing: "border-box",
                width: "100%",
                borderTop: topBorder ? `3px solid ${borderColor}` : "none",
                boxShadow: hardShadow ? `6px 6px 0 ${shadowColor}` : "none",
                display: "flex",
                flexDirection: "column",
                gap: Math.round(padding * 0.42),
                ...style,
            }}
        >
            {/* Mini profile: statement left, outbound links right. Wraps to a
                single stacked column once the two no longer fit side by side. */}
            <div
                style={{
                    ...column,
                    display: "flex",
                    flexWrap: "wrap",
                    gap,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <Appear
                    trigger="inView"
                    threshold={0.15}
                    y={12}
                    transition="spring-duration 0.5s 0.2 0s"
                    style={{ flex: "1 1 300px", maxWidth: 520 }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontFamily: headingStack,
                            // Above the body copy, below a section heading.
                            fontSize: "clamp(17px, 1.7vw, 20px)",
                            fontWeight: 600,
                            lineHeight: 1.4,
                            letterSpacing: "-0.01em",
                            color: introColor,
                        }}
                    >
                        {intro}
                    </p>
                    {showSummary && (
                        <p
                            style={{
                                margin: "10px 0 0",
                                fontSize: 13.5,
                                lineHeight: 1.65,
                                color: mutedColor,
                                opacity: 0.72,
                            }}
                        >
                            {summary}
                        </p>
                    )}
                </Appear>

                {showSocials && (
                    <Appear
                        trigger="inView"
                        threshold={0.15}
                        y={12}
                        transition="spring-duration 0.5s 0.2 0.08s"
                        style={{ flex: "0 1 300px", minWidth: 0 }}
                    >
                        <div
                            style={{
                                fontFamily: headingStack,
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: 1.4,
                                color: linksTitleColor,
                                marginBottom: 12,
                            }}
                        >
                            {linksTitle}
                        </div>
                        <div className="vlz-footer-links">
                            {(socials ?? []).map((s, si: number) => (
                                    <a
                                        key={si}
                                        href={s.url || "#"}
                                        // The CV is same-origin, so `download` wins and the
                                        // file is saved; a browser that insists on rendering
                                        // the PDF opens it in its own tab instead of
                                        // unmounting the app.
                                        download={s.download}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.ariaLabel}
                                        className="vlz-footer-link"
                                        style={
                                            {
                                                "--link-color": socialColor,
                                                "--link-hover": socialHoverColor,
                                            } as CSSProperties
                                        }
                                    >
                                        <span className="vlz-footer-link-icon">
                                            <LinkIcon name={s.icon} />
                                        </span>
                                        <span className="vlz-footer-link-label">{s.label}</span>
                                    </a>
                            ))}
                        </div>
                    </Appear>
                )}
            </div>

            {/* Signature line */}
            <div
                style={{
                    ...column,
                    paddingTop: 14,
                    borderTop: `1.5px dotted ${mutedColor}`,
                }}
            >
                <span style={{ fontSize: 12.5, lineHeight: 1.4, color: mutedColor, opacity: 0.7 }}>
                    {copyText}
                </span>
            </div>

            <style>{`
                /* Two across while there is room for both labels, one when there
                   is not — so a narrow phone never scrolls sideways. */
                .vlz-footer-links {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
                    gap: 10px 14px;
                }
                .vlz-footer-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-height: 40px;
                    color: var(--link-color);
                    opacity: 0.86;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: 0.2px;
                    transition: color 0.18s ease, opacity 0.18s ease, transform 0.18s ease;
                }
                .vlz-footer-link-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    flex-shrink: 0;
                    border: 1.5px solid currentColor;
                    border-radius: 10px;
                    opacity: 0.55;
                    transition: opacity 0.18s ease, background 0.18s ease;
                }
                .vlz-footer-link-label {
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .vlz-footer-link:hover,
                .vlz-footer-link:focus-visible {
                    color: var(--link-hover);
                    opacity: 1;
                    transform: translateY(-2px);
                }
                .vlz-footer-link:hover .vlz-footer-link-icon,
                .vlz-footer-link:focus-visible .vlz-footer-link-icon {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.08);
                }
                .vlz-footer-link:focus-visible {
                    outline: 2px solid var(--link-hover);
                    outline-offset: 3px;
                    border-radius: 4px;
                }
                @media (prefers-reduced-motion: reduce) {
                    .vlz-footer-link,
                    .vlz-footer-link-icon { transition: none; }
                    .vlz-footer-link:hover,
                    .vlz-footer-link:focus-visible { transform: none; }
                }
                /* Roomier targets on touch. */
                @media (max-width: 640px) {
                    .vlz-footer-link { min-height: 44px; }
                }
            `}</style>
        </footer>
    )
}
