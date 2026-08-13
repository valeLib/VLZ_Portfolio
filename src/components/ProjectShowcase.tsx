// Carousel of project / website cards in a macOS-style browser frame.
// Per-item props are flat and positional (item1Title, item2Title, …) so a slot
// can be filled or left empty independently of its neighbours.

import { useState, useEffect, useRef } from "react"

const MAX_ITEMS = 8

// ── Font stacks ────────────────────────────────────────────────────────────
const FONT_STACKS: Record<string, string> = {
    "Fredoka": "'Fredoka One', 'Fredoka', system-ui, sans-serif",
    "Jua": "'Jua', system-ui, sans-serif",
    "IBM Plex Mono": "'IBM Plex Mono', 'Courier New', monospace",
    "Anonymous Pro": "'Anonymous Pro', 'Courier New', monospace",
    "Caveat": "'Caveat', cursive",
    "Doppio One": "'Doppio One', system-ui, sans-serif",
    "System": "system-ui, -apple-system, sans-serif",
    "Inherit": "inherit",
}

type MediaType = "image" | "video" | "iframe"
type VideoSource = "file" | "url"

type Slide = {
    mediaType: MediaType
    image: string
    videoSource: VideoSource
    videoFile: string
    videoUrl: string
    videoAutoplay: boolean
    videoLoop: boolean
    videoMuted: boolean
    videoControls: boolean
    iframeUrl: string
    iframeAllow: string
    urlBar: string
    title: string
    subtitle: string
    tags: string
    link: string
    buttonText: string
    showButton: boolean
}

const DEFAULTS = {
    itemCount: 3,
    showHeader: true,
    headerTitle: "Web Design & Development",
    showCounter: true,
    counterFormat: "{i} / {n}",
    frameBgColor: "#fffdf8",
    frameBorderColor: "#1a1520",
    frameBorderWidth: 2,
    frameRadius: 14,
    frameShadowOffset: 4,
    showTrafficLights: true,
    dotRed: "#EE978E",
    dotYellow: "#FABA32",
    dotGreen: "#D4DF68",
    showUrlBar: true,
    urlBarBg: "#f5eee6",
    urlBarTextColor: "#6b6580",
    imageAspectRatio: "4:3",
    imageFit: "cover",
    imageBgColor: "#f5eee6",
    showFooter: true,
    showSubtitle: true,
    showTags: true,
    tagColors: ["#D4DF68", "#8BD9C3", "#EE978E", "#FABA32"],
    tagTextColor: "#1a1520",
    tagBorderColor: "#1a1520",
    showArrows: true,
    showDots: true,
    loop: false,
    arrowBorderColor: "#1a1520",
    arrowIconColor: "#1a1520",
    arrowBg: "rgba(0,0,0,0)",
    dotActiveColor: "#1a1520",
    dotInactiveColor: "#c8c2d6",
    headerFont: "Fredoka",
    headerSize: 28,
    headerColor: "#1a1520",
    counterFont: "IBM Plex Mono",
    counterSize: 14,
    counterColor: "#6b6580",
    subtitleFont: "Fredoka",
    subtitleSize: 16,
    subtitleColor: "#1a1520",
    tagFont: "IBM Plex Mono",
    tagSize: 10,
    buttonFont: "IBM Plex Mono",
    buttonSize: 12,
    buttonBg: "#1a1520",
    buttonTextColor: "#fffdf8",
    urlBarFont: "IBM Plex Mono",
    urlBarFontSize: 12,
    headerGap: 8,
    footerGap: 16,
    navGap: 12,
    contentGap: 0,
}

export default function ProjectShowcase(rawProps: any) {
    const props: any = { ...DEFAULTS, ...rawProps }
    const {
        itemCount,
        showHeader, headerTitle, showCounter, counterFormat,
        frameBgColor, frameBorderColor, frameBorderWidth, frameRadius, frameShadowOffset,
        showTrafficLights, dotRed, dotYellow, dotGreen,
        showUrlBar, urlBarBg, urlBarTextColor,
        imageAspectRatio, imageFit, imageBgColor,
        showFooter, showSubtitle, showTags,
        tagColors, tagTextColor, tagBorderColor,
        showArrows, showDots, loop,
        arrowBorderColor, arrowIconColor, arrowBg,
        dotActiveColor, dotInactiveColor,
        headerFont, headerSize, headerColor,
        counterFont, counterSize, counterColor,
        subtitleFont, subtitleSize, subtitleColor,
        tagFont, tagSize,
        buttonFont, buttonSize, buttonBg, buttonTextColor,
        urlBarFont, urlBarFontSize,
        headerGap, footerGap, navGap, contentGap,
    } = props

    const count = Math.max(0, Math.min(MAX_ITEMS, itemCount ?? 0))
    const slides: Slide[] = []
    for (let i = 1; i <= count; i++) {
        const mediaType = (props[`item${i}MediaType`] as MediaType | undefined) ?? "image"
        const videoSource = (props[`item${i}VideoSource`] as VideoSource | undefined) ?? "url"
        const image = props[`item${i}Image`] as string | undefined
        const videoFile = props[`item${i}VideoFile`] as string | undefined
        const videoUrl = props[`item${i}VideoUrl`] as string | undefined
        const videoAutoplay = props[`item${i}VideoAutoplay`] as boolean | undefined
        const videoLoop = props[`item${i}VideoLoop`] as boolean | undefined
        const videoMuted = props[`item${i}VideoMuted`] as boolean | undefined
        const videoControls = props[`item${i}VideoControls`] as boolean | undefined
        const iframeUrl = props[`item${i}IframeUrl`] as string | undefined
        const iframeAllow = props[`item${i}IframeAllow`] as string | undefined
        const urlBar = props[`item${i}UrlBar`] as string | undefined
        const title = props[`item${i}Title`] as string | undefined
        const subtitle = props[`item${i}Subtitle`] as string | undefined
        const tags = props[`item${i}Tags`] as string | undefined
        const link = props[`item${i}Link`] as string | undefined
        const buttonText = props[`item${i}ButtonText`] as string | undefined
        const showButton = props[`item${i}ShowButton`] as boolean | undefined

        const hasMedia = !!image || !!videoFile || !!videoUrl || !!iframeUrl
        const hasMeta = !!urlBar || !!subtitle || !!tags || !!link
        if (!hasMedia && !hasMeta) continue

        slides.push({
            mediaType,
            image: image ?? "",
            videoSource,
            videoFile: videoFile ?? "",
            videoUrl: videoUrl ?? "",
            videoAutoplay: videoAutoplay ?? true,
            videoLoop: videoLoop ?? true,
            videoMuted: videoMuted ?? true,
            videoControls: videoControls ?? false,
            iframeUrl: iframeUrl ?? "",
            iframeAllow: iframeAllow ?? "fullscreen; clipboard-read; clipboard-write",
            urlBar: urlBar ?? "",
            title: title ?? "",
            subtitle: subtitle ?? "",
            tags: tags ?? "",
            link: link ?? "",
            buttonText: buttonText ?? "Visit Website",
            showButton: showButton ?? true,
        })
    }

    const total = slides.length
    const [index, setIndex] = useState(0)
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (index >= total && total > 0) setIndex(0)
    }, [total, index])

    const goTo = (i: number) => {
        if (total === 0) return
        if (loop) {
            setIndex(((i % total) + total) % total)
        } else {
            setIndex(Math.max(0, Math.min(total - 1, i)))
        }
    }
    const next = () => goTo(index + 1)
    const prev = () => goTo(index - 1)

    useEffect(() => {
        const node = rootRef.current
        if (!node) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next()
            if (e.key === "ArrowLeft") prev()
        }
        node.addEventListener("keydown", handler)
        return () => node.removeEventListener("keydown", handler)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, total, loop])

    if (total === 0) {
        return (
            <div style={{
                width: "100%",
                padding: 32,
                border: `${frameBorderWidth}px dashed ${frameBorderColor}`,
                borderRadius: frameRadius,
                fontFamily: FONT_STACKS["IBM Plex Mono"],
                color: "#888",
                fontSize: 13,
                textAlign: "center" as const,
            }}>
                Set Item count above 0 and fill in Item 1 to start.
            </div>
        )
    }

    const current = slides[index]
    const ffHeader = FONT_STACKS[headerFont] ?? "inherit"
    const ffCounter = FONT_STACKS[counterFont] ?? "inherit"
    const ffSubtitle = FONT_STACKS[subtitleFont] ?? "inherit"
    const ffTag = FONT_STACKS[tagFont] ?? "inherit"
    const ffButton = FONT_STACKS[buttonFont] ?? "inherit"
    const ffUrl = FONT_STACKS[urlBarFont] ?? "inherit"

    const tagList = (current.tags || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)

    const pad = (n: number) => String(n).padStart(2, "0")
    const counterText = (counterFormat as string)
        .replace("{i}", pad(index + 1))
        .replace("{n}", pad(total))

    const [arW, arH] = (imageAspectRatio as string).split(":").map(Number)
    const aspectPct = (arW && arH) ? `${(arH / arW) * 100}%` : "75%"

    const prevDisabled = !loop && index === 0
    const nextDisabled = !loop && index === total - 1

    const activeVideoSrc =
        current.videoSource === "file" ? current.videoFile : current.videoUrl

    // ── Media renderer (image / video / iframe) ───────────────────────────
    const renderMedia = () => {
        if (current.mediaType === "video" && activeVideoSrc) {
            return (
                <video
                    key={`vid-${index}`}
                    src={activeVideoSrc}
                    autoPlay={current.videoAutoplay}
                    loop={current.videoLoop}
                    muted={current.videoMuted}
                    controls={current.videoControls}
                    playsInline
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: imageFit,
                        display: "block",
                    }}
                />
            )
        }
        if (current.mediaType === "iframe" && current.iframeUrl) {
            return (
                <iframe
                    key={`frame-${index}`}
                    src={current.iframeUrl}
                    allow={current.iframeAllow}
                    allowFullScreen
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        display: "block",
                        background: imageBgColor,
                    }}
                />
            )
        }
        // Default: image
        if (current.image) {
            return (
                <img
                    src={current.image}
                    alt={current.title || ""}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: imageFit,
                        display: "block",
                    }}
                />
            )
        }
        return null
    }

    // For non-image media, the link wrapper should not capture pointer events.
    const isInteractiveMedia = current.mediaType !== "image"

    return (
        <div
            ref={rootRef}
            tabIndex={0}
            style={{
                width: "100%",
                alignSelf: "flex-start",
                boxSizing: "border-box",
                outline: "none",
                fontFamily: FONT_STACKS["IBM Plex Mono"],
                display: "flex",
                flexDirection: "column",
                gap: contentGap,
            }}
        >
            {/* ── Header row ── */}
            {showHeader && (
                <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 16,
                    marginBottom: headerGap,
                    flexWrap: "wrap" as const,
                }}>
                    {headerTitle ? (
                        <span style={{
                            fontFamily: ffHeader,
                            fontSize: headerSize,
                            color: headerColor,
                            lineHeight: 1.1,
                        }}>{headerTitle}</span>
                    ) : <span />}
                    {showCounter && (
                        <span style={{
                            fontFamily: ffCounter,
                            fontSize: counterSize,
                            color: counterColor,
                            letterSpacing: "0.05em",
                        }}>{counterText}</span>
                    )}
                </div>
            )}

            {/* ── Browser frame ── */}
            <div style={{
                width: "100%",
                background: frameBgColor,
                border: `${frameBorderWidth}px solid ${frameBorderColor}`,
                borderRadius: frameRadius,
                boxShadow: frameShadowOffset > 0
                    ? `${frameShadowOffset}px ${frameShadowOffset}px 0 ${frameBorderColor}`
                    : "none",
                overflow: "hidden",
                boxSizing: "border-box",
            }}>
                {(showTrafficLights || showUrlBar) && (
                    <div style={{
                        background: frameBgColor,
                        borderBottom: `${frameBorderWidth}px solid ${frameBorderColor}`,
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}>
                        {showTrafficLights && (
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                {[dotRed, dotYellow, dotGreen].map((c: string, i: number) => (
                                    <div key={i} style={{
                                        width: 11,
                                        height: 11,
                                        borderRadius: "50%",
                                        background: c,
                                        border: `1.5px solid ${frameBorderColor}`,
                                    }} />
                                ))}
                            </div>
                        )}
                        {showUrlBar && (
                            <div style={{
                                flex: 1,
                                background: urlBarBg,
                                border: `1.5px solid ${frameBorderColor}`,
                                borderRadius: 999,
                                padding: "4px 14px",
                                fontFamily: ffUrl,
                                fontSize: urlBarFontSize,
                                color: urlBarTextColor,
                                textAlign: "center" as const,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap" as const,
                            }}>{current.urlBar}</div>
                        )}
                    </div>
                )}

                <div style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: aspectPct,
                    background: imageBgColor,
                }}>
                    {isInteractiveMedia ? (
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            display: "block",
                        }}>
                            {renderMedia()}
                        </div>
                    ) : (
                        <a
                            href={current.link || undefined}
                            target={current.link ? "_blank" : undefined}
                            rel={current.link ? "noopener noreferrer" : undefined}
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "block",
                                cursor: current.link ? "pointer" : "default",
                            }}
                        >
                            {renderMedia()}
                        </a>
                    )}
                </div>
            </div>

            {/* ── Footer ── */}
            {showFooter && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    marginTop: footerGap,
                    flexWrap: "wrap" as const,
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap" as const,
                    }}>
                        {showSubtitle && current.subtitle && (
                            <span style={{
                                fontFamily: ffSubtitle,
                                fontSize: subtitleSize,
                                color: subtitleColor,
                                lineHeight: 1.2,
                            }}>{current.subtitle}</span>
                        )}
                        {showTags && tagList.length > 0 && (
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap" as const,
                                gap: 6,
                            }}>
                                {tagList.map((tag: string, i: number) => (
                                    <span key={i} style={{
                                        fontFamily: ffTag,
                                        fontSize: tagSize,
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase" as const,
                                        color: tagTextColor,
                                        background: tagColors[i % Math.max(1, tagColors.length)] || "#D4DF68",
                                        border: `1.5px solid ${tagBorderColor}`,
                                        borderRadius: 999,
                                        padding: "4px 10px",
                                        boxShadow: `1.5px 1.5px 0 ${tagBorderColor}`,
                                    }}>{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {current.showButton && current.link && current.buttonText && (
                        <a
                            href={current.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontFamily: ffButton,
                                fontSize: buttonSize,
                                fontWeight: 700,
                                color: buttonTextColor,
                                background: buttonBg,
                                border: `1.5px solid ${frameBorderColor}`,
                                borderRadius: 999,
                                padding: "8px 18px",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                boxShadow: `2px 2px 0 ${frameBorderColor}`,
                                whiteSpace: "nowrap" as const,
                            }}
                        >
                            {current.buttonText} <span>→</span>
                        </a>
                    )}
                </div>
            )}

            {/* ── Navigation ── */}
            {(showArrows || showDots) && total > 1 && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                    marginTop: navGap,
                    position: "relative",
                    zIndex: 2,
                }}>
                    {showArrows && (
                        <div
                            role="button"
                            tabIndex={0}
                            aria-label="Previous slide"
                            onClick={prevDisabled ? undefined : prev}
                            onKeyDown={(e) => {
                                if ((e.key === "Enter" || e.key === " ") && !prevDisabled) {
                                    e.preventDefault()
                                    prev()
                                }
                            }}
                            style={{
                                width: 38, height: 38,
                                borderRadius: "50%",
                                border: `1.5px solid ${arrowBorderColor}`,
                                background: arrowBg,
                                color: arrowIconColor,
                                cursor: prevDisabled ? "default" : "pointer",
                                opacity: prevDisabled ? 0.4 : 1,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                fontFamily: FONT_STACKS["IBM Plex Mono"],
                                userSelect: "none" as const,
                                outline: "none",
                            }}
                        >‹</div>
                    )}

                    {showDots && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            {slides.map((_, i) => (
                                <div
                                    key={i}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Go to slide ${i + 1}`}
                                    onClick={() => goTo(i)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            goTo(i)
                                        }
                                    }}
                                    style={{
                                        width: i === index ? 10 : 8,
                                        height: i === index ? 10 : 8,
                                        borderRadius: "50%",
                                        background: i === index ? dotActiveColor : dotInactiveColor,
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                        outline: "none",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {showArrows && (
                        <div
                            role="button"
                            tabIndex={0}
                            aria-label="Next slide"
                            onClick={nextDisabled ? undefined : next}
                            onKeyDown={(e) => {
                                if ((e.key === "Enter" || e.key === " ") && !nextDisabled) {
                                    e.preventDefault()
                                    next()
                                }
                            }}
                            style={{
                                width: 38, height: 38,
                                borderRadius: "50%",
                                border: `1.5px solid ${arrowBorderColor}`,
                                background: arrowBg,
                                color: arrowIconColor,
                                cursor: nextDisabled ? "default" : "pointer",
                                opacity: nextDisabled ? 0.4 : 1,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                fontFamily: FONT_STACKS["IBM Plex Mono"],
                                userSelect: "none" as const,
                                outline: "none",
                            }}
                        >›</div>
                    )}
                </div>
            )}
        </div>
    )
}
