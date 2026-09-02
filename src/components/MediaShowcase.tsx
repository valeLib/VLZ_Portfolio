// A group of captures shown as one editorial block: a compact left-to-right
// sequence joined by arrows, or a grid of supporting frames. Frames carry the
// page's ink border and hard shadow so a screenshot sits in the layout the same
// way a feature module's media does.

import { Fragment, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useBreakpoint } from "../hooks/useBreakpoint"
import { pick } from "../lib/i18n"
import type { Locale } from "../lib/i18n"
import type { MediaGroup, MediaItem } from "../data/projectSections"
import { colors } from "../tokens"
import Appear from "./Appear"
import MediaFrame from "./MediaFrame"

const INK = "#1a1520"
// Matches featureBase.mediaBgColor, so an unloaded frame reads as paper rather
// than a hole in the page.
const PAPER = "#f5eee6"

const isVideo = (item: MediaItem) =>
    item.kind === "video" || (!item.kind && /\.(mp4|webm|mov|m4v)$/i.test(item.src))

/** "16:9" → 1.777…; anything unparseable falls back to 16:9. */
function aspect(ratio?: string): number {
    const [w, h] = String(ratio ?? "16:9").split(":").map(Number)
    return w > 0 && h > 0 ? w / h : 16 / 9
}

/**
 * True once the element has come within `rootMargin` of the viewport, and then
 * permanently. Used to hold a clip out of the DOM until it is worth fetching:
 * a `<video>` starts loading its poster and metadata the moment it exists, and
 * `poster` has no lazy equivalent, so the element itself is what has to wait.
 */
function useNearViewport(rootMargin = "600px") {
    const ref = useRef<HTMLDivElement | null>(null)
    const [near, setNear] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el || typeof IntersectionObserver === "undefined") {
            setNear(true)
            return
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setNear(true)
                    io.disconnect()
                }
            },
            { rootMargin }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [rootMargin])
    return { ref, near }
}

/**
 * One frame. Clips go through MediaFrame, which pauses them off-screen and only
 * preloads metadata — the alternative, a page of simultaneously playing videos,
 * is what actually costs frames and battery. The placeholder that stands in
 * before a clip mounts is the same box, so the swap shifts nothing.
 */
function Frame({ item, radius }: { item: MediaItem; radius: number }) {
    const reduce = useReducedMotion()
    const ratio = aspect(item.ratio)
    const shadow = `5px 5px 0 ${INK}`
    const { ref, near } = useNearViewport()

    const box: React.CSSProperties = {
        width: "100%",
        aspectRatio: String(ratio),
        background: PAPER,
        borderRadius: radius,
        border: `2px solid ${INK}`,
        boxShadow: shadow,
        overflow: "hidden",
        boxSizing: "border-box",
    }

    const media = isVideo(item) ? (
        <div ref={ref} style={{ width: "100%" }}>
            {near ? (
                <MediaFrame
                    video={item.src}
                    poster={item.poster}
                    playMode="inView"
                    loop
                    muted
                    controls={false}
                    ratio={item.ratio ?? "16:9"}
                    fit="cover"
                    background={PAPER}
                    radius={radius}
                    borderWidth={2}
                    borderColor={INK}
                    shadow={shadow}
                />
            ) : (
                <div style={box} />
            )}
        </div>
    ) : (
        <div style={box}>
            <img
                src={item.src}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
        </div>
    )

    return (
        <motion.div
            style={{ width: "100%" }}
            whileHover={reduce ? undefined : { y: -4, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            {media}
        </motion.div>
    )
}

function Caption({ text }: { text: string }) {
    if (!text) return null
    return (
        <div
            style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#4F58AF",
                lineHeight: 1.5,
                paddingTop: 10,
            }}
        >
            {text}
        </div>
    )
}

function Cell({ item, radius, locale }: { item: MediaItem; radius: number; locale: Locale }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <Frame item={item} radius={radius} />
            <Caption text={pick(locale, item.label)} />
        </div>
    )
}

export default function MediaShowcase({
    group,
    locale,
}: {
    group: MediaGroup
    locale: Locale
}) {
    const bp = useBreakpoint()
    const phone = bp === "phone"
    const tablet = bp === "tablet"

    const items = (group.items ?? []).filter(Boolean) as MediaItem[]
    if (items.length === 0) return null

    const radius = phone ? 14 : tablet ? 15 : 16
    const requested = group.columns ?? 2
    // Tablets cap at two columns; phones stack unless the group asks otherwise.
    const columns = phone ? (group.phoneColumns ?? 1) : tablet ? Math.min(requested, 2) : requested
    // Two large captures need more air between them than a row of thumbnails
    // did, or the frames' hard shadows run into the next frame's border.
    const gap = phone ? 18 : columns <= 2 ? 26 : 20

    // Sequences read as a row of steps joined by arrows, which turn to point
    // downward once the row has to stack. Frames and captions sit on two grid
    // rows rather than inside per-step columns, so an arrow lands on the
    // frames' centre line however many lines a neighbouring caption runs to.
    // Tablets stack the sequence too: three 16:9 frames sharing ~700px leaves
    // each one too small to read the state it is meant to show.
    const stackSequence = phone || tablet
    const arrow = (i: number) => (
        <div
            key={`arrow-${i}`}
            aria-hidden
            style={{
                gridRow: stackSequence ? undefined : 1,
                alignSelf: "center",
                justifySelf: "center",
                fontFamily: '"Fredoka", sans-serif',
                fontSize: stackSequence ? 20 : 24,
                lineHeight: 1,
                color: colors.mutedTxt,
            }}
        >
            {stackSequence ? "↓" : "→"}
        </div>
    )

    const body = group.sequence ? (
        stackSequence ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                {items.map((item, i) => (
                    <Fragment key={item.id}>
                        {i > 0 && arrow(i)}
                        <Cell item={item} radius={radius} locale={locale} />
                    </Fragment>
                ))}
            </div>
        ) : (
            <div
                style={{
                    display: "grid",
                    // frame, arrow, frame, arrow, frame …
                    gridTemplateColumns: items
                        .map(() => "minmax(0, 1fr)")
                        .join(" auto "),
                    gridTemplateRows: "auto auto",
                    columnGap: 12,
                    width: "100%",
                }}
            >
                {items.map((item, i) => (
                    <Fragment key={item.id}>
                        {i > 0 && arrow(i)}
                        <div style={{ gridRow: 1, minWidth: 0 }}>
                            <Frame item={item} radius={radius} />
                        </div>
                    </Fragment>
                ))}
                {items.map((item, i) => (
                    <div
                        key={`cap-${item.id}`}
                        // Columns are 1-based and interleaved with the arrows.
                        style={{ gridRow: 2, gridColumn: i * 2 + 1, minWidth: 0 }}
                    >
                        <Caption text={pick(locale, item.label)} />
                    </div>
                ))}
            </div>
        )
    ) : (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap,
                width: "100%",
                alignItems: "start",
            }}
        >
            {items.map((item) => (
                <div
                    key={item.id}
                    style={item.wide || columns === 1 ? { gridColumn: "1 / -1", minWidth: 0 } : { minWidth: 0 }}
                >
                    <Cell item={item} radius={radius} locale={locale} />
                </div>
            ))}
        </div>
    )

    const title = pick(locale, group.displayTitle)
    const caption = pick(locale, group.caption)

    return (
        <Appear trigger="inView" once threshold={0.08} transition="spring-duration 0.5s 0.2 0s" style={{ width: "100%" }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                {title && (
                    <div
                        style={{
                            fontFamily: '"IBM Plex Mono", monospace',
                            fontSize: phone ? 11 : 12,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            color: colors.liberty,
                        }}
                    >
                        {title}
                    </div>
                )}
                {body}
                {caption && (
                    <div
                        style={{
                            fontFamily: '"Anonymous Pro", monospace',
                            fontSize: phone ? 13 : 14,
                            lineHeight: 1.65,
                            color: colors.secondaryTxt,
                            maxWidth: 760,
                        }}
                    >
                        {caption}
                    </div>
                )}
            </div>
        </Appear>
    )
}
