// ContactPage.tsx
// Retro / Y2K contact section with a styled form (Formspree/webhook + mailto fallback).
// Ported from Framer: framer imports + addPropertyControls removed,
// RenderTarget canvas gate collapsed (isCanvas = false),
// defaultProps + property-control `details` default merged into DEFAULTS.

import { useEffect, useRef, useState } from "react"

const FONT_STACKS: Record<string, string> = {
    Fredoka: '"Fredoka", sans-serif',
    Jua: '"Jua", sans-serif',
    "Anonymous Pro": '"Anonymous Pro", monospace',
    "IBM Plex Mono": '"IBM Plex Mono", monospace',
    Caveat: '"Caveat", cursive',
    "System Sans": "system-ui, -apple-system, sans-serif",
}

// Fallback palette: used when a contact detail has no explicit Dot color set.
const ACCENTS = ["#4F58AF", "#EE978E", "#FABA32", "#D4DF68", "#8BD9C3"]

type Detail = { label: string; value: string; url: string; color?: string; newTab?: boolean }

const DEFAULTS = {
    background: "#F2EFE9",
    cardColor: "#FFFDF8",
    textColor: "#1C1B22",
    mutedColor: "#9896A8",
    headingFont: "Fredoka",
    bodyFont: "Anonymous Pro",
    accent: "#FABA32",
    eyebrow: "Get in touch",
    headline: "Let's build something playful.",
    intro: "Have a game, an interface, or a wild idea? Drop a line and I'll get back to you.",
    endpoint: "",
    email: "hello@valentina.dev",
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    buttonLabel: "Send message",
    successMessage: "Thanks! I'll be in touch soon.",
    hardShadow: true,
    shadowColor: "#1C1B22",
    radius: 20,
    padding: 64,
    breakpoint: 720,
    mobilePadding: 28,
    details: [
        { label: "Email", value: "hello@valentina.dev", url: "mailto:hello@valentina.dev", color: "#4F58AF", newTab: false },
        { label: "Based in", value: "Santiago, Chile", url: "#", color: "#EE978E", newTab: false },
        { label: "GitHub", value: "@valentina", url: "#", color: "#FABA32", newTab: true },
    ] as Detail[],
}

export default function ContactPage(props: Partial<typeof DEFAULTS> & { style?: React.CSSProperties }) {
    const {
        background,
        cardColor,
        textColor,
        mutedColor,
        headingFont,
        bodyFont,
        accent,
        eyebrow,
        headline,
        intro,
        endpoint,
        email,
        nameLabel,
        emailLabel,
        messageLabel,
        buttonLabel,
        successMessage,
        details,
        hardShadow,
        shadowColor,
        radius,
        padding,
        breakpoint,
        mobilePadding,
        style,
    } = { ...DEFAULTS, ...props }

    const [name, setName] = useState("")
    const [from, setFrom] = useState("")
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")

    // Container-query style responsiveness: track the section's own width.
    const containerRef = useRef<HTMLElement>(null)
    const [width, setWidth] = useState(0)
    useEffect(() => {
        const el = containerRef.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver((entries) => {
            for (const e of entries) setWidth(e.contentRect.width)
        })
        ro.observe(el)
        setWidth(el.getBoundingClientRect().width)
        return () => ro.disconnect()
    }, [])
    const isNarrow = width > 0 && width < breakpoint

    const headingStack = FONT_STACKS[headingFont] ?? FONT_STACKS.Fredoka
    const bodyStack = FONT_STACKS[bodyFont] ?? FONT_STACKS["Anonymous Pro"]
    const isCanvas = false

    // Responsive values
    const pad = isNarrow ? mobilePadding : padding
    const colGap = isNarrow ? 28 : 40
    const headlineSize = isNarrow ? 32 : 44
    const introSize = isNarrow ? 15 : 16
    const cardPad = isNarrow ? 20 : 28

    const submit = async () => {
        if (isCanvas) return
        if (!from || !message) {
            setStatus("error")
            return
        }
        // Endpoint set → POST as JSON (Formspree / webhook compatible).
        if (endpoint) {
            try {
                setStatus("sending")
                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({ name, email: from, message }),
                })
                setStatus(res.ok ? "done" : "error")
            } catch {
                setStatus("error")
            }
            return
        }
        // No endpoint → mailto fallback.
        const subject = encodeURIComponent(`Portfolio message from ${name || "someone"}`)
        const body = encodeURIComponent(`${message}\n\n— ${name}\n${from}`)
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
        setStatus("done")
    }

    const inputStyle: React.CSSProperties = {
        width: "100%",
        boxSizing: "border-box",
        padding: "14px 16px",
        fontFamily: bodyStack,
        fontSize: 15,
        color: textColor,
        background: "#FFFDF8",
        border: `2.5px solid ${textColor}`,
        borderRadius: 12,
        boxShadow: hardShadow ? `4px 4px 0 ${shadowColor}` : "none",
        outline: "none",
    }

    return (
        <section
            ref={containerRef as any}
            id="contact"
            style={{
                background,
                color: textColor,
                fontFamily: bodyStack,
                padding: pad,
                boxSizing: "border-box",
                width: "100%",
                display: "flex",
                flexDirection: isNarrow ? "column" : "row",
                flexWrap: isNarrow ? "nowrap" : "wrap",
                gap: colGap,
                alignItems: isNarrow ? "stretch" : "flex-start",
                justifyContent: "center",
                ...style,
            }}
        >
            {/* Left: copy + details */}
            <div
                style={{
                    flex: isNarrow ? "1 1 auto" : "1 1 320px",
                    width: isNarrow ? "100%" : undefined,
                    maxWidth: isNarrow ? "100%" : 460,
                }}
            >
                {eyebrow && (
                    <div
                        style={{
                            fontFamily: bodyStack,
                            fontSize: 13,
                            fontWeight: 700,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            color: accent,
                            marginBottom: 12,
                        }}
                    >
                        {eyebrow}
                    </div>
                )}
                <h2
                    style={{
                        fontFamily: headingStack,
                        fontSize: headlineSize,
                        lineHeight: 1.05,
                        margin: 0,
                        letterSpacing: -1,
                    }}
                >
                    {headline}
                </h2>
                <p style={{ fontSize: introSize, lineHeight: 1.6, color: mutedColor, marginTop: 16 }}>
                    {intro}
                </p>

                <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
                    {(details ?? []).map((d, i: number) => (
                        <a
                            key={i}
                            href={d.url || "#"}
                            target={d.newTab ? "_blank" : undefined}
                            rel={d.newTab ? "noopener noreferrer" : undefined}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                textDecoration: "none",
                                color: textColor,
                                fontSize: 15,
                            }}
                        >
                            <span
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 4,
                                    background: d.color || ACCENTS[i % ACCENTS.length],
                                    flexShrink: 0,
                                }}
                            />
                            <span style={{ fontWeight: 600 }}>{d.label}</span>
                            <span style={{ color: mutedColor }}>{d.value}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Right: form card */}
            <div
                style={{
                    flex: isNarrow ? "1 1 auto" : "1 1 320px",
                    width: isNarrow ? "100%" : undefined,
                    maxWidth: isNarrow ? "100%" : 440,
                    background: cardColor,
                    border: `3px solid ${textColor}`,
                    borderRadius: radius,
                    boxShadow: hardShadow ? `8px 8px 0 ${shadowColor}` : "none",
                    padding: cardPad,
                    boxSizing: "border-box",
                }}
            >
                {status === "done" ? (
                    <div style={{ textAlign: "center", padding: "32px 8px" }}>
                        <div style={{ fontSize: 40, marginBottom: 8 }}>✺</div>
                        <p style={{ fontFamily: headingStack, fontSize: 20, margin: 0 }}>
                            {successMessage}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>
                                {nameLabel}
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={inputStyle}
                                placeholder="Jane Doe"
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>
                                {emailLabel}
                            </label>
                            <input
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                type="email"
                                style={inputStyle}
                                placeholder="jane@studio.com"
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>
                                {messageLabel}
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                style={{ ...inputStyle, resize: "vertical", minHeight: 96 }}
                                placeholder="Tell me about your project…"
                            />
                        </div>

                        {status === "error" && (
                            <span style={{ fontSize: 13, color: "#C7443B" }}>
                                Please add your email and a message, then try again.
                            </span>
                        )}

                        <button
                            onClick={submit}
                            disabled={status === "sending"}
                            style={{
                                marginTop: 4,
                                padding: "14px 20px",
                                fontFamily: headingStack,
                                fontSize: 16,
                                fontWeight: 600,
                                color: "#1C1B22",
                                background: accent,
                                border: `3px solid ${textColor}`,
                                borderRadius: 12,
                                boxShadow: hardShadow ? `4px 4px 0 ${shadowColor}` : "none",
                                cursor: status === "sending" ? "default" : "pointer",
                                transition: "transform 0.1s",
                            }}
                            onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
                            onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
                        >
                            {status === "sending" ? "Sending…" : buttonLabel}
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}
