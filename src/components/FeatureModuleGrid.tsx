// A single feature module: media block (image / video / iframe) paired with a
// text block (eyebrow + title + body + optional bullets), media positionable
// left / right / above / below with a responsive stack breakpoint.

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

// ── Font stacks (shared with the rest of the project) ────────────────────
const FONT_STACKS: Record<string, string> = {
    "Fredoka":       "'Fredoka', system-ui, sans-serif",
    "Jua":           "'Jua', system-ui, sans-serif",
    "IBM Plex Mono": "'IBM Plex Mono', 'Courier New', monospace",
    "Anonymous Pro": "'Anonymous Pro', 'Courier New', monospace",
    "Caveat":        "'Caveat', cursive",
    "Doppio One":    "'Doppio One', system-ui, sans-serif",
    "Kantumruy Pro": "'Kantumruy Pro', system-ui, sans-serif",
    "System":        "system-ui, -apple-system, sans-serif",
    "Inherit":       "inherit",
}

type MediaType = "image" | "video" | "iframe"
type MediaPosition = "left" | "right" | "above" | "below"

// Image fields may arrive as a plain URL or as a {src, srcSet, alt} object.
type ImageInput = string | { src: string; srcSet?: string; alt?: string }

type FeatureModuleGridProps = {
    // Layout
    mediaPosition?: MediaPosition
    /** % of the row the media column takes in left/right layouts (10–90). */
    mediaColumnWidth?: number
    breakpointBelow?: number
    colGap?: number
    rowGap?: number
    verticalAlign?: "top" | "center" | "bottom"

    // Stacked / narrow overrides
    stackedOrder?: "mediaFirst" | "textFirst"
    stackedMediaWidth?: number
    stackedMediaAlign?: "left" | "center" | "right"
    stackedAspectRatio?: string
    stackedTextScale?: number

    // Media
    mediaType?: MediaType
    image?: ImageInput
    videoSource?: "url" | "file"
    videoFile?: string
    videoUrl?: string
    videoAutoplay?: boolean
    videoLoop?: boolean
    videoMuted?: boolean
    videoControls?: boolean
    iframeUrl?: string
    iframeAllow?: string

    // Media frame
    mediaAspectRatio?: string
    mediaFit?: "cover" | "contain"
    mediaBgColor?: string
    mediaRadius?: number
    mediaBorderWidth?: number
    mediaBorderColor?: string
    showMediaShadow?: boolean
    mediaShadowX?: number
    mediaShadowY?: number
    mediaShadowColor?: string

    // Media badge
    showMediaBadge?: boolean
    badgeText?: string
    badgeBg?: string
    badgeTextColor?: string
    badgeBorderColor?: string

    // Text content
    eyebrow?: string
    title?: string
    body?: any // FormattedText (React node) or HTML string
    bullets?: string

    // Panel (fill / radius / frame / shadow around the text block or module)
    panelScope?: "text" | "module"
    textBg?: string
    textRadius?: number
    showFrame?: boolean
    textBorderStyle?: "solid" | "dashed" | "dotted" | "double" | "none"
    textBorderWidth?: number
    textBorderColor?: string
    textBorderOffset?: number
    showTextShadow?: boolean
    textShadowX?: number
    textShadowY?: number
    textShadowColor?: string

    // Text styling
    textPadding?: number
    contentGap?: number
    accentColor?: string

    eyebrowFont?: string
    eyebrowSize?: number
    eyebrowTracking?: number
    eyebrowColor?: string
    eyebrowUppercase?: boolean

    titleFont?: string
    titleWeight?: number
    titleSize?: number
    titleColor?: string
    titleLineHeight?: number

    bodyFont?: string
    bodyWeight?: number
    bodySize?: number
    bodyColor?: string
    bodyLineHeight?: number

    bullet?: string
    bulletColor?: string
    bulletGap?: number

    // Animation
    animate?: string
    animationTrigger?: string
    animationDuration?: number
    slideDistance?: number
    bounce?: boolean

    // Background
    bgColor?: string
}

const DEFAULTS: Required<FeatureModuleGridProps> = {
    mediaPosition: "left",
    mediaColumnWidth: 50,
    breakpointBelow: 720,
    colGap: 32,
    rowGap: 24,
    verticalAlign: "center",

    stackedOrder: "mediaFirst",
    stackedMediaWidth: 65,
    stackedMediaAlign: "left",
    stackedAspectRatio: "inherit",
    stackedTextScale: 0.9,

    mediaType: "image",
    image: "",
    videoSource: "url",
    videoFile: "",
    videoUrl: "",
    videoAutoplay: true,
    videoLoop: true,
    videoMuted: true,
    videoControls: false,
    iframeUrl: "",
    iframeAllow: "fullscreen; clipboard-read; clipboard-write",

    mediaAspectRatio: "4:3",
    mediaFit: "cover",
    mediaBgColor: "#f5eee6",
    mediaRadius: 16,
    mediaBorderWidth: 2,
    mediaBorderColor: "#1a1520",
    showMediaShadow: true,
    mediaShadowX: 5,
    mediaShadowY: 5,
    mediaShadowColor: "#1a1520",

    showMediaBadge: false,
    badgeText: "01",
    badgeBg: "",
    badgeTextColor: "#1a1520",
    badgeBorderColor: "",

    eyebrow: "MODULE 01",
    title: "Grid Placement",
    body: "<p>Players place towers on a grid with hover and snap feedback. The system enforces buildable surfaces and gives instant visual confirmation.</p>",
    bullets: "",

    panelScope: "text",
    textBg: "rgba(0,0,0,0)",
    textRadius: 0,
    showFrame: false,
    textBorderStyle: "solid",
    textBorderWidth: 2,
    textBorderColor: "#1a1520",
    textBorderOffset: 0,
    showTextShadow: false,
    textShadowX: 5,
    textShadowY: 5,
    textShadowColor: "#1a1520",

    textPadding: 0,
    contentGap: 12,
    accentColor: "#D4DF68",

    eyebrowFont: "IBM Plex Mono",
    eyebrowSize: 11,
    eyebrowTracking: 0.12,
    eyebrowColor: "#4F58AF",
    eyebrowUppercase: true,

    titleFont: "Fredoka",
    titleWeight: 700,
    titleSize: 28,
    titleColor: "#1a1520",
    titleLineHeight: 1.2,

    bodyFont: "Anonymous Pro",
    bodyWeight: 400,
    bodySize: 15,
    bodyColor: "#1a1520",
    bodyLineHeight: 1.65,

    bullet: "▸",
    bulletColor: "",
    bulletGap: 6,

    animate: "slideUp",
    animationTrigger: "once",
    animationDuration: 0.55,
    slideDistance: 24,
    bounce: false,

    bgColor: "rgba(0,0,0,0)",
}

export default function FeatureModuleGrid(props: FeatureModuleGridProps) {
    const {
        mediaPosition, mediaColumnWidth, breakpointBelow, colGap, rowGap, verticalAlign,
        stackedOrder, stackedMediaWidth, stackedMediaAlign, stackedAspectRatio, stackedTextScale,

        mediaType, image,
        videoSource, videoFile, videoUrl, videoAutoplay, videoLoop, videoMuted, videoControls,
        iframeUrl, iframeAllow,

        mediaAspectRatio, mediaFit, mediaBgColor, mediaRadius,
        mediaBorderWidth, mediaBorderColor,
        showMediaShadow, mediaShadowX, mediaShadowY, mediaShadowColor,

        showMediaBadge, badgeText, badgeBg, badgeTextColor, badgeBorderColor,

        eyebrow, title, body, bullets,

        panelScope, textBg, textRadius,
        showFrame, textBorderStyle, textBorderWidth, textBorderColor, textBorderOffset,
        showTextShadow, textShadowX, textShadowY, textShadowColor,

        textPadding, contentGap, accentColor,
        eyebrowFont, eyebrowSize, eyebrowTracking, eyebrowColor, eyebrowUppercase,
        titleFont, titleWeight, titleSize, titleColor, titleLineHeight,
        bodyFont, bodyWeight, bodySize, bodyColor, bodyLineHeight,
        bullet, bulletColor, bulletGap,

        animate, animationTrigger, animationDuration, slideDistance, bounce,
        bgColor,
    } = { ...DEFAULTS, ...props }

    const imageSrc = typeof image === "string" ? image : (image?.src || "")
    const imageAlt = typeof image === "string" ? "" : (image?.alt || "")

    const ffEyebrow = FONT_STACKS[eyebrowFont] ?? "inherit"
    const ffTitle = FONT_STACKS[titleFont] ?? "inherit"
    const ffBody = FONT_STACKS[bodyFont] ?? "inherit"

    const useViewport = animate !== "none" && (animationTrigger === "once" || animationTrigger === "every")
    const initialState = animate === "none" ? "visible" : "hidden"
    const motionTriggerProp: any = animate === "none"
        ? {}
        : (useViewport
            ? { whileInView: "visible", viewport: { once: animationTrigger === "once", amount: 0.2 } }
            : { animate: "visible" })

    const hidden: any = { opacity: 0 }
    if (animate === "slideUp") hidden.y = slideDistance
    else if (animate === "slideDown") hidden.y = -slideDistance
    else if (animate === "slideLeft") hidden.x = slideDistance
    else if (animate === "slideRight") hidden.x = -slideDistance
    else if (animate === "scale") hidden.scale = 0.92

    const motionVariants = { hidden, visible: { opacity: 1, x: 0, y: 0, scale: 1 } }
    const motionTransition = bounce
        ? { type: "spring" as const, stiffness: 320, damping: 18, mass: 0.9 }
        : { duration: animationDuration, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }

    const [replayKey, setReplayKey] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    useEffect(() => {
        if (animationTrigger === "loop" && animate !== "none") {
            const intervalMs = Math.max(1500, (animationDuration + 1) * 1000)
            intervalRef.current = setInterval(() => setReplayKey(k => k + 1), intervalMs)
            return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
        }
    }, [animationTrigger, animate, animationDuration])

    // ── Responsive (only matters for left/right layouts) ─────────────────
    const rootRef = useRef<HTMLDivElement>(null)
    const [stacked, setStacked] = useState(false)
    useEffect(() => {
        if (!rootRef.current || typeof ResizeObserver === "undefined") return
        const el = rootRef.current
        // Decide the first layout from a direct measurement; waiting for the
        // observer's first delivery paints one frame of the row layout on a
        // phone before it collapses.
        setStacked(el.getBoundingClientRect().width < breakpointBelow)
        const ro = new ResizeObserver(entries => {
            for (const entry of entries) {
                const w = entry.contentRect.width
                setStacked(w < breakpointBelow)
            }
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [breakpointBelow])

    // ── Layout resolution ─────────────────────────────────────────────────
    // A collapsed side-by-side layout stacks in the configured order.
    const effectivePosition: MediaPosition =
        stacked && (mediaPosition === "left" || mediaPosition === "right")
            ? (stackedOrder === "textFirst" ? "below" : "above")
            : mediaPosition
    const isColumn = effectivePosition === "above" || effectivePosition === "below"

    // Narrow widths scale the type down; column layouts may swap the ratio.
    const typeScale = stacked ? stackedTextScale : 1
    const effTitleSize = Math.max(10, Math.round(titleSize * typeScale))
    const effBodySize = Math.max(9, Math.round(bodySize * typeScale))

    // ── Aspect ratio parsing ──────────────────────────────────────────────
    const activeRatio = isColumn && stackedAspectRatio !== "inherit" ? stackedAspectRatio : mediaAspectRatio
    // "auto" sizes the frame to the image itself, so a capture is shown whole
    // instead of centre-cropped to a fixed box. Video and iframes still need
    // a box and fall back to 16:9.
    const autoRatio = activeRatio === "auto"
    const [arW, arH] = (autoRatio ? "16:9" : (activeRatio as string)).split(":").map(Number)
    const aspectPct = (arW && arH) ? `${(arH / arW) * 100}%` : "75%"

    // ── Panel style (text block or whole module, never both) ──────────────
    const hasFrame = showFrame === true && textBorderWidth > 0
    const frameStyle = textBorderStyle === "none" ? "solid" : textBorderStyle
    const panelStyle: React.CSSProperties = {
        background: textBg,
        borderRadius: textRadius,
        padding: textPadding,
        boxSizing: "border-box" as const,
        ...(hasFrame
            ? { outline: `${textBorderWidth}px ${frameStyle} ${textBorderColor}`, outlineOffset: textBorderOffset }
            : {}),
        ...(showTextShadow
            ? { boxShadow: `${textShadowX}px ${textShadowY}px 0 ${textShadowColor}` }
            : {}),
    }

    // ── Media renderer ────────────────────────────────────────────────────
    function renderMedia() {
        const activeVideoSrc = videoSource === "file" ? videoFile : videoUrl

        if (mediaType === "video" && activeVideoSrc) {
            return (
                <video
                    src={activeVideoSrc}
                    autoPlay={videoAutoplay}
                    loop={videoLoop}
                    muted={videoMuted}
                    controls={videoControls}
                    playsInline
                    style={{
                        width: "100%", height: "100%",
                        objectFit: mediaFit, display: "block",
                    }}
                />
            )
        }
        if (mediaType === "iframe" && iframeUrl) {
            return (
                <iframe
                    src={iframeUrl}
                    allow={iframeAllow}
                    allowFullScreen
                    style={{
                        width: "100%", height: "100%",
                        border: "none", display: "block",
                        background: mediaBgColor,
                    }}
                />
            )
        }
        if (imageSrc) {
            return (
                <img
                    src={imageSrc}
                    alt={imageAlt || title || ""}
                    style={{
                        width: "100%", height: autoRatio ? "auto" : "100%",
                        objectFit: mediaFit, display: "block",
                    }}
                />
            )
        }
        // Placeholder box so the layout keeps its shape when media is missing.
        return (
            <div style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: ffEyebrow, fontSize: 11, color: "#aaa",
                letterSpacing: "0.08em", textTransform: "uppercase" as const,
            }}>media slot</div>
        )
    }

    // ── Bullets parsing ───────────────────────────────────────────────────
    function parseBullets(text: string): string[] {
        if (!text) return []
        return text
            .split(/\r?\n/)
            .map(l => l.replace(/^[-•*▸]\s*/, "").trim())
            .filter(l => l.length > 0)
    }
    const bulletList = parseBullets(bullets)

    const eyebrowStyle: React.CSSProperties = {
        fontFamily: ffEyebrow,
        fontSize: eyebrowSize,
        fontWeight: 700,
        color: eyebrowColor,
        letterSpacing: `${eyebrowTracking}em`,
        textTransform: eyebrowUppercase ? ("uppercase" as const) : ("none" as const),
        lineHeight: 1.4,
    }

    // ── Body renderer — accepts a React node or an HTML/plain string ─────
    const bodyStyle: React.CSSProperties = {
        fontFamily: ffBody,
        fontWeight: bodyWeight as any,
        fontSize: bodySize,
        color: bodyColor,
        lineHeight: bodyLineHeight,
        width: "100%",
    }
    bodyStyle.fontSize = effBodySize
    let bodyContent: React.ReactNode = null
    if (body != null) {
        if (typeof body !== "string") {
            bodyContent = <div style={bodyStyle}>{body as React.ReactNode}</div>
        } else if (body.length > 0) {
            const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(body)
            if (looksLikeHtml) {
                bodyContent = <div style={bodyStyle} dangerouslySetInnerHTML={{ __html: body }} />
            } else {
                bodyContent = (
                    <div style={{ ...bodyStyle, whiteSpace: "pre-wrap" as const }}>{body}</div>
                )
            }
        }
    }

    // ── Media block ───────────────────────────────────────────────────────
    const mediaBlock = (
        <div style={{
            position: "relative",
            width: "100%",
            paddingBottom: autoRatio && imageSrc ? 0 : aspectPct,
            // A self-sized frame must not be stretched to the text's height by
            // the row grid; it follows the card's vertical alignment instead.
            alignSelf: autoRatio && imageSrc
                ? (verticalAlign === "center" ? "center" : verticalAlign === "bottom" ? "end" : "start")
                : undefined,
            background: mediaBgColor,
            borderRadius: mediaRadius,
            border: mediaBorderWidth > 0 ? `${mediaBorderWidth}px solid ${mediaBorderColor}` : "none",
            boxShadow: showMediaShadow
                ? `${mediaShadowX}px ${mediaShadowY}px 0 ${mediaShadowColor}`
                : "none",
            overflow: "hidden",
            boxSizing: "border-box" as const,
        }}>
            <div style={autoRatio && imageSrc ? undefined : { position: "absolute", inset: 0 }}>
                {renderMedia()}
            </div>
            {showMediaBadge && badgeText && (
                <div style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: badgeBg || accentColor,
                    border: `${Math.max(1, mediaBorderWidth)}px solid ${badgeBorderColor || mediaBorderColor}`,
                    borderRadius: 999,
                    padding: "4px 10px",
                    boxShadow: `2px 2px 0 ${badgeBorderColor || mediaBorderColor}`,
                    fontFamily: ffEyebrow,
                    fontSize: Math.max(9, eyebrowSize - 1),
                    fontWeight: 700,
                    letterSpacing: `${eyebrowTracking}em`,
                    textTransform: eyebrowUppercase ? ("uppercase" as const) : ("none" as const),
                    color: badgeTextColor,
                    pointerEvents: "none" as const,
                    lineHeight: 1,
                }}>{badgeText}</div>
            )}
        </div>
    )

    // ── Text block ────────────────────────────────────────────────────────
    // The panel styles wrap either this block or the whole module, never both.
    const textBlock = (
        <div style={{
            ...(panelScope === "module" ? { padding: 0 } : panelStyle),
            display: "flex",
            flexDirection: "column" as const,
            gap: contentGap,
            justifyContent:
                verticalAlign === "top" ? "flex-start" :
                verticalAlign === "bottom" ? "flex-end" :
                "center",
            boxSizing: "border-box" as const,
            height: "100%",
        }}>
            {eyebrow && (
                <div style={eyebrowStyle}>{eyebrow}</div>
            )}
            {title && (
                <div style={{
                    fontFamily: ffTitle,
                    fontSize: effTitleSize,
                    fontWeight: titleWeight,
                    color: titleColor,
                    lineHeight: titleLineHeight,
                }}>{title}</div>
            )}
            {bodyContent}
            {bulletList.length > 0 && (
                <ul style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: bulletGap,
                }}>
                    {bulletList.map((b, bi) => (
                        <li key={bi} style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                            fontFamily: ffBody,
                            fontSize: effBodySize,
                            color: bodyColor,
                            lineHeight: bodyLineHeight,
                        }}>
                            <span style={{
                                color: bulletColor || accentColor,
                                lineHeight: bodyLineHeight,
                                flexShrink: 0,
                            }}>{bullet}</span>
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

    // ── Compose layout based on the resolved position ─────────────────────
    // In column layouts the media is width-constrained and aligned.
    const mediaChild = isColumn ? (
        <div style={{
            width: `${stackedMediaWidth}%`,
            marginLeft: stackedMediaAlign === "left" ? 0 : "auto",
            marginRight: stackedMediaAlign === "right" ? 0 : "auto",
        }}>
            {mediaBlock}
        </div>
    ) : mediaBlock

    const mediaCol = Math.max(10, Math.min(90, mediaColumnWidth ?? 50))
    const textCol = 100 - mediaCol

    let gridStyle: React.CSSProperties = {}
    let children: React.ReactNode[] = []

    switch (effectivePosition) {
        case "left":
            gridStyle = {
                display: "grid",
                gridTemplateColumns: `${mediaCol}fr ${textCol}fr`,
                gap: colGap,
                alignItems: "stretch",
            }
            children = [mediaChild, textBlock]
            break
        case "right":
            gridStyle = {
                display: "grid",
                gridTemplateColumns: `${textCol}fr ${mediaCol}fr`,
                gap: colGap,
                alignItems: "stretch",
            }
            children = [textBlock, mediaChild]
            break
        case "above":
            gridStyle = {
                display: "flex",
                flexDirection: "column" as const,
                gap: rowGap,
            }
            children = [mediaChild, textBlock]
            break
        case "below":
            gridStyle = {
                display: "flex",
                flexDirection: "column" as const,
                gap: rowGap,
            }
            children = [textBlock, mediaChild]
            break
    }

    return (
        <div
            ref={rootRef}
            style={{
                width: "100%",
                background: bgColor,
                boxSizing: "border-box" as const,
                fontFamily: ffBody,
            }}
        >
            <motion.div
                key={replayKey}
                initial={initialState}
                {...motionTriggerProp}
                variants={motionVariants}
                transition={motionTransition}
                style={panelScope === "module" ? { ...gridStyle, ...panelStyle } : gridStyle}
            >
                {children.map((child, i) => (
                    <React.Fragment key={i}>{child}</React.Fragment>
                ))}
            </motion.div>
        </div>
    )
}
