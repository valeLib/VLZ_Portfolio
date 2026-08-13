// Single video or GIF in a styled frame with aspect ratio, fit and play-mode options.
// "inView" mode uses an IntersectionObserver so off-screen clips stay paused.

import { useEffect, useRef, useState } from "react"

type MediaFrameProps = {
    mediaType?: string
    video?: string
    videoUrl?: string
    gif?: string
    poster?: string
    playMode?: string
    loop?: boolean
    muted?: boolean
    controls?: boolean
    ratio?: string
    mobileRatio?: string
    breakpoint?: number
    fit?: string
    position?: string
    background?: string
    radius?: number
    borderWidth?: number
    borderColor?: string
    shadow?: string
    style?: React.CSSProperties
}

const DEFAULTS = {
    mediaType: "video",
    video: "",
    videoUrl: "",
    gif: "",
    poster: "",
    playMode: "inView",
    loop: true,
    muted: true,
    controls: false,
    ratio: "16:9",
    mobileRatio: "inherit",
    breakpoint: 600,
    fit: "cover",
    position: "center",
    background: "rgba(0,0,0,0)",
    radius: 16,
    borderWidth: 0,
    borderColor: "#1C1B22",
    shadow: "",
    style: undefined as React.CSSProperties | undefined,
}

export default function MediaFrame(props: MediaFrameProps) {
    const {
        mediaType,
        video,
        videoUrl,
        gif,
        poster,
        playMode,
        loop,
        muted,
        controls,
        ratio,
        mobileRatio,
        breakpoint,
        fit,
        position,
        background,
        radius,
        borderWidth,
        borderColor,
        shadow,
        style,
    } = { ...DEFAULTS, ...props }

    const rootRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const el = rootRef.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver((entries) => {
            for (const e of entries) setWidth(e.contentRect.width)
        })
        ro.observe(el)
        setWidth(el.getBoundingClientRect().width)
        return () => ro.disconnect()
    }, [])
    const isNarrow = width > 0 && width < breakpoint

    // Play when scrolled into view. Pausing on exit matters more than starting
    // on entry: several autoplaying clips on one page is what actually costs
    // battery and dropped frames.
    useEffect(() => {
        if (playMode !== "inView") return
        const el = videoRef.current
        if (!el || typeof IntersectionObserver === "undefined") return
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) el.play().catch(() => {})
                    else el.pause()
                }
            },
            { threshold: 0.25 }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [playMode, video, videoUrl])

    const src = video || videoUrl || ""
    const isGif = mediaType === "gif"
    const hasMedia = isGif ? !!gif : !!src

    const autoPlay = playMode === "auto"
    // Browsers refuse autoplay with sound, so muting is not optional here.
    const effectiveMuted = muted || autoPlay || playMode === "inView"

    const activeRatio = isNarrow && mobileRatio !== "inherit" ? mobileRatio : ratio
    const [arW, arH] = String(activeRatio).split(":").map(Number)

    const onEnter = () => {
        if (playMode !== "hover") return
        videoRef.current?.play().catch(() => {})
    }
    const onLeave = () => {
        if (playMode !== "hover") return
        const el = videoRef.current
        if (!el) return
        el.pause()
        el.currentTime = 0
    }

    const frame: React.CSSProperties = {
        width: "100%",
        aspectRatio: arW && arH ? `${arW} / ${arH}` : "16 / 9",
        background,
        borderRadius: radius,
        border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
        boxShadow: shadow || "none",
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
        ...style,
    }

    const inner: React.CSSProperties = {
        width: "100%",
        height: "100%",
        objectFit: fit as React.CSSProperties["objectFit"],
        objectPosition: position,
        display: "block",
    }

    if (!hasMedia) {
        return (
            <div
                ref={rootRef}
                style={{
                    ...frame,
                    border: `2px dashed ${borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 12,
                    color: "#9896A8",
                    textAlign: "center",
                    padding: 20,
                }}
            >
                {isGif ? "Add a GIF or image." : "Add a video file, or paste a video URL."}
            </div>
        )
    }

    return (
        <div ref={rootRef} style={frame} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            {isGif ? (
                <img src={gif} alt="" draggable={false} style={inner} />
            ) : (
                <video
                    ref={videoRef}
                    src={src}
                    poster={poster || undefined}
                    autoPlay={autoPlay}
                    loop={loop}
                    muted={effectiveMuted}
                    controls={controls}
                    playsInline
                    preload={playMode === "auto" ? "auto" : "metadata"}
                    style={inner}
                />
            )}
        </div>
    )
}
