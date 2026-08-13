// Unified gallery showcase: one dataset (up to 10 items), one Mode prop —
// fade, slide, stack (deck), fan, scale, capsule 3D, curve, click-focus, tilted grid, marquee.

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion"

const MAX_ITEMS = 10

const FONT_STACKS: Record<string, string> = {
    "Fredoka":       "'Fredoka One', 'Fredoka', system-ui, sans-serif",
    "Jua":           "'Jua', system-ui, sans-serif",
    "IBM Plex Mono": "'IBM Plex Mono', 'Courier New', monospace",
    "Anonymous Pro": "'Anonymous Pro', 'Courier New', monospace",
    "Caveat":        "'Caveat', cursive",
    "Doppio One":    "'Doppio One', system-ui, sans-serif",
    "System":        "system-ui, -apple-system, sans-serif",
    "Inherit":       "inherit",
}

type Item = {
    image: string
    title: string
    link: string
}

type Mode =
    | "fade" | "slide" | "stack" | "fan" | "scale"
    | "capsule3D" | "curve" | "clickFocus"
    | "tiltedGrid" | "marquee"

const ARROW_NAV_MODES: Mode[] = ["fade", "slide", "stack", "fan", "scale", "capsule3D", "curve"]
const DOTS_MODES: Mode[] = ["fade", "slide", "stack", "fan", "scale", "capsule3D", "curve"]

// Section data may name an option by its display title ("Stack (deck)") or by
// its raw value ("stack"), so titles are mapped back to values before use.
// Keys are unique across every enum prop, so one flat map is enough.
const ENUM_TITLE_TO_VALUE: Record<string, string> = {
    // mode
    "Fade": "fade", "Slide": "slide", "Stack (deck)": "stack", "Fan (arc)": "fan",
    "Scale (coverflow)": "scale", "Capsule 3D": "capsule3D", "Curve carousel": "curve",
    "Click to focus": "clickFocus", "Tilted grid": "tiltedGrid", "Marquee scroll": "marquee",
    // image fit
    "Cover (crop)": "cover", "Contain (fit)": "contain",
    // title position
    "Above image (own row)": "above", "Overlay top (on image)": "top",
    "Overlay bottom (on image)": "bottom", "Below image (own row)": "below", "None": "none",
    // counter position
    "Top left": "top-left", "Top right": "top-right",
    "Bottom left": "bottom-left", "Bottom right": "bottom-right",
    // arrow placement + shape
    "Auto": "auto", "Sides (centered on stage)": "sides", "Below stage": "below",
    "Circle": "circle", "Square": "square",
    // title weight
    "Regular": "400", "Medium": "500", "Semibold": "600",
    "Bold": "700", "Extra Bold": "800", "Black": "900",
    // capsule orientation
    "Vertical (stack up)": "vertical", "Horizontal (fan right)": "horizontal",
    // curve direction
    "Smile (cards dip down)": "down", "Frown (cards rise up)": "up",
    // click-focus start position
    "Leftmost card": "left", "Centermost card": "center", "Rightmost card": "right",
    // marquee direction
    "Scroll left": "left", "Scroll right": "right",
}
const resolveEnum = (v: string | number | undefined): string => {
    const s = String(v ?? "")
    return ENUM_TITLE_TO_VALUE[s] ?? s
}

type ImageInput = string | { src: string }
type ItemIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

type GalleryProps = {
    itemCount?: number
    mode?: string
    animationDuration?: number
    bounceStrength?: number
    loop?: boolean
    autoplay?: boolean
    autoplayInterval?: number
    enableDrag?: boolean
    dragThreshold?: number
    imageAspectRatio?: string
    aspectRatio?: string          // template alias for imageAspectRatio
    imageFit?: string
    imageBgColor?: string
    cardRadius?: number
    cardBorderWidth?: number
    cardBorderColor?: string
    cardShadow?: string
    containerHeight?: number
    stageHeight?: number          // template alias for containerHeight
    containerBg?: string
    showTitle?: boolean
    titlePosition?: string
    titleFont?: string
    titleSize?: number
    titleWeight?: string | number
    titleColor?: string
    titleBgColor?: string
    titlePadding?: number
    titleGap?: number
    titleGapAbove?: number
    showCounter?: boolean
    counterFormat?: string
    counterPosition?: string
    counterFont?: string
    counterSize?: number
    counterColor?: string
    counterBgColor?: string
    counterPadding?: string
    counterMarginTop?: number
    showArrows?: boolean
    showDots?: boolean
    arrowPlacement?: string
    arrowStyle?: string
    arrowShape?: string           // template alias for arrowStyle
    arrowBorderColor?: string
    arrowIconColor?: string
    arrowBg?: string
    arrowSize?: number
    arrowOffset?: number
    dotActiveColor?: string
    dotInactiveColor?: string
    dotSize?: number
    navGap?: number
    stackPeek?: number
    stackRotation?: number
    stackOpacity?: number
    stackBackOpacity?: number     // template alias for stackOpacity
    fanSpread?: number
    fanRotation?: number
    scaleSide?: number
    capsuleOrientation?: string
    capsuleStackOffset?: number
    capsulePerspective?: number
    capsuleZ?: number
    capsuleRotate?: number
    capsuleScale?: number
    capsuleOpacityStep?: number
    curveRadius?: number
    curveSlideSpacing?: number
    curveDirection?: string
    curveRotationFactor?: number
    curveZ?: number
    curveScaleStep?: number
    curveOpacityFalloff?: number
    curveFadeInActive?: boolean
    curveFadeInStartOpacity?: number
    curveFadeInStartScale?: number
    focusDefaultPosition?: string
    focusCardWidth?: number
    focusCardHeight?: number
    focusMainGap?: number
    focusBackGap?: number
    focusRotation?: number
    focusScaleStep?: number
    focusHoverScale?: number
    focusDimOpacity?: number
    focusDimColor?: string
    focusSpringStiffness?: number
    focusSpringDamping?: number
    gridColumns?: number
    gridGap?: number
    gridRotation?: number
    gridFocusScale?: number
    marqueeSpeed?: number
    marqueeDirection?: string
    marqueeGap?: number
    marqueePauseOnHover?: boolean
} & {
    [K in `item${ItemIndex}Image` | `_${ItemIndex}Image`]?: ImageInput
} & {
    [K in `item${ItemIndex}Title` | `item${ItemIndex}Link` | `_${ItemIndex}Title` | `_${ItemIndex}Link`]?: string
}

const DEFAULTS = {
    itemCount: 5,
    mode: "stack",
    animationDuration: 0.5,
    bounceStrength: 2,
    loop: true,
    autoplay: false,
    autoplayInterval: 3500,
    enableDrag: true,
    dragThreshold: 80,
    imageAspectRatio: "3:2",
    imageFit: "cover",
    imageBgColor: "rgba(0,0,0,0)",
    cardRadius: 16,
    cardBorderWidth: 0,
    cardBorderColor: "#1a1520",
    cardShadow: "0 8px 32px rgba(0,0,0,0.18)",
    containerHeight: 480,
    containerBg: "rgba(0,0,0,0)",
    showTitle: false,
    titlePosition: "above",
    titleFont: "Fredoka",
    titleWeight: "700",
    titleSize: 18,
    titleColor: "#fffdf8",
    titleBgColor: "rgba(26,21,32,0.65)",
    titlePadding: 14,
    titleGapAbove: 16,
    titleGap: 16,
    showCounter: true,
    counterFormat: "{i} / {n}",
    counterPosition: "bottom-right",
    counterFont: "IBM Plex Mono",
    counterSize: 11,
    counterColor: "#fffdf8",
    counterBgColor: "rgba(26,21,32,0.65)",
    counterPadding: "5px 10px",
    counterMarginTop: 16,
    showArrows: true,
    arrowPlacement: "auto",
    arrowStyle: "circle",
    arrowSize: 40,
    arrowOffset: 12,
    arrowBg: "rgba(255,253,248,0.85)",
    arrowBorderColor: "rgba(26,21,32,0.2)",
    arrowIconColor: "#1a1520",
    showDots: true,
    dotActiveColor: "#1a1520",
    dotInactiveColor: "#c8c2d6",
    dotSize: 8,
    navGap: 16,
    stackPeek: 32,
    stackRotation: 4,
    stackOpacity: 0.7,
    fanSpread: 80,
    fanRotation: 12,
    scaleSide: 180,
    capsuleOrientation: "vertical",
    capsuleStackOffset: 60,
    capsulePerspective: 900,
    capsuleZ: 80,
    capsuleRotate: 10,
    capsuleScale: 0.12,
    capsuleOpacityStep: 0.1,
    curveRadius: 600,
    curveSlideSpacing: 200,
    curveDirection: "down",
    curveRotationFactor: 1,
    curveZ: 40,
    curveScaleStep: 0.08,
    curveOpacityFalloff: 0.25,
    curveFadeInActive: true,
    curveFadeInStartOpacity: 0.8,
    curveFadeInStartScale: 1.05,
    focusDefaultPosition: "left",
    focusCardWidth: 280,
    focusCardHeight: 400,
    focusMainGap: 200,
    focusBackGap: 30,
    focusRotation: 8,
    focusScaleStep: 0.05,
    focusHoverScale: 1.05,
    focusDimOpacity: 0.45,
    focusDimColor: "#000000",
    focusSpringStiffness: 260,
    focusSpringDamping: 20,
    gridColumns: 3,
    gridGap: 16,
    gridRotation: -3,
    gridFocusScale: 1.6,
    marqueeSpeed: 1,
    marqueeDirection: "left",
    marqueeGap: 16,
    marqueePauseOnHover: true,
}

export default function Gallery(props: GalleryProps) {
    const merged = { ...DEFAULTS, ...props }
    const {
        itemCount,
        animationDuration,
        bounceStrength,
        loop,
        autoplay,
        autoplayInterval,
        enableDrag,
        dragThreshold,
        imageBgColor,
        cardRadius,
        cardBorderWidth,
        cardBorderColor,
        cardShadow,
        containerBg,
        showTitle,
        titleFont,
        titleSize,
        titleColor,
        titleBgColor,
        titlePadding,
        titleGap,
        titleGapAbove,
        showCounter,
        counterFormat,
        counterFont,
        counterSize,
        counterColor,
        counterBgColor,
        counterPadding,
        counterMarginTop,
        showArrows,
        showDots,
        arrowBorderColor,
        arrowIconColor,
        arrowBg,
        arrowSize,
        arrowOffset,
        dotActiveColor,
        dotInactiveColor,
        dotSize,
        navGap,
        stackPeek,
        stackRotation,
        fanSpread,
        fanRotation,
        scaleSide,
        capsuleStackOffset,
        capsulePerspective,
        capsuleZ,
        capsuleRotate,
        capsuleScale,
        capsuleOpacityStep,
        curveRadius,
        curveSlideSpacing,
        curveRotationFactor,
        curveZ,
        curveScaleStep,
        curveOpacityFalloff,
        curveFadeInActive,
        curveFadeInStartOpacity,
        curveFadeInStartScale,
        focusCardWidth,
        focusCardHeight,
        focusMainGap,
        focusBackGap,
        focusRotation,
        focusScaleStep,
        focusHoverScale,
        focusDimOpacity,
        focusDimColor,
        focusSpringStiffness,
        focusSpringDamping,
        gridColumns,
        gridGap,
        gridRotation,
        gridFocusScale,
        marqueeSpeed,
        marqueeGap,
        marqueePauseOnHover,
    } = merged

    // Normalize enum titles to values and resolve the shorthand prop aliases.
    const mode = resolveEnum(merged.mode) as Mode
    const imageAspectRatio = props.aspectRatio ?? merged.imageAspectRatio
    const imageFit = resolveEnum(merged.imageFit) as "cover" | "contain"
    const containerHeight = props.stageHeight ?? merged.containerHeight
    const stackOpacity = props.stackBackOpacity ?? merged.stackOpacity
    const titlePosition = resolveEnum(merged.titlePosition)
    const titleWeight = resolveEnum(merged.titleWeight)
    const counterPosition = resolveEnum(merged.counterPosition)
    const arrowPlacement = resolveEnum(merged.arrowPlacement)
    const arrowStyle = resolveEnum(props.arrowShape ?? merged.arrowStyle)
    const capsuleOrientation = resolveEnum(merged.capsuleOrientation)
    const curveDirection = resolveEnum(merged.curveDirection)
    const focusDefaultPosition = resolveEnum(merged.focusDefaultPosition)
    const marqueeDirection = resolveEnum(merged.marqueeDirection)

    const P = props as Record<string, any>
    const count = Math.max(0, Math.min(MAX_ITEMS, itemCount ?? 0))
    const items: Item[] = []
    for (let i = 1; i <= count; i++) {
        const rawImage = P[`item${i}Image`] ?? P[`_${i}Image`]
        const image: string | undefined = typeof rawImage === "string" ? rawImage : rawImage?.src
        const title = (P[`item${i}Title`] ?? P[`_${i}Title`]) as string | undefined
        const link  = (P[`item${i}Link`]  ?? P[`_${i}Link`])  as string | undefined
        if (!image && !title && !link) continue
        items.push({
            image: image ?? "",
            title: title ?? "",
            link:  link  ?? "",
        })
    }

    const total = items.length
    const [index, setIndex] = useState(0)
    const [direction, setDirection] = useState(1)
    const [hovered, setHovered] = useState<number | null>(null)
    const [focusActive, setFocusActive] = useState(0)
    const [gridFocused, setGridFocused] = useState<number | null>(null)
    const rootRef = useRef<HTMLDivElement>(null)
    const dragX = useMotionValue(0)

    useEffect(() => {
        if (index >= total && total > 0) setIndex(0)
    }, [total, index])

    useEffect(() => {
        if (mode !== "clickFocus" || total === 0) return
        const initial =
            focusDefaultPosition === "left"  ? 0 :
            focusDefaultPosition === "right" ? total - 1 :
            Math.floor(total / 2)
        setFocusActive(initial)
    }, [mode, focusDefaultPosition, total])

    const goTo = (i: number, dir: number = 1) => {
        if (total === 0) return
        setDirection(dir)
        if (loop) {
            setIndex(((i % total) + total) % total)
        } else {
            setIndex(Math.max(0, Math.min(total - 1, i)))
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const next = useCallback(() => goTo(index + 1, 1), [index, total, loop])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const prev = useCallback(() => goTo(index - 1, -1), [index, total, loop])

    useEffect(() => {
        const node = rootRef.current
        if (!node || !ARROW_NAV_MODES.includes(mode)) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); next() }
            if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { e.preventDefault(); prev() }
        }
        node.addEventListener("keydown", handler)
        return () => node.removeEventListener("keydown", handler)
    }, [mode, next, prev])

    useEffect(() => {
        if (!autoplay || total < 2 || !ARROW_NAV_MODES.includes(mode)) return
        const t = setInterval(() => {
            setDirection(1)
            setIndex(prevIdx => loop ? (prevIdx + 1) % total : Math.min(prevIdx + 1, total - 1))
        }, Math.max(1000, autoplayInterval))
        return () => clearInterval(t)
    }, [autoplay, autoplayInterval, total, loop, mode])

    if (total === 0) {
        return (
            <div style={{
                width: "100%",
                padding: 32,
                border: `2px dashed ${cardBorderColor}`,
                borderRadius: cardRadius,
                fontFamily: FONT_STACKS["IBM Plex Mono"],
                color: "#888",
                fontSize: 13,
                textAlign: "center" as const,
            }}>
                Set Item count above 0 and add Item 1 image to start.
            </div>
        )
    }

    const ffTitle   = FONT_STACKS[titleFont]   ?? "inherit"
    const ffCounter = FONT_STACKS[counterFont] ?? "inherit"

    // Accept "9:16" as well as titled variants like "9:16 vertical video".
    const arMatch = String(imageAspectRatio).match(/([\d.]+)\s*:\s*([\d.]+)/)
    const arW = arMatch ? Number(arMatch[1]) : 0
    const arH = arMatch ? Number(arMatch[2]) : 0
    const aspectPct = (arW && arH) ? `${(arH / arW) * 100}%` : "75%"

    const current = items[index]
    const prevDisabled = !loop && index === 0
    const nextDisabled = !loop && index === total - 1
    const speed = Math.max(0.1, animationDuration)

    const pad = (n: number) => String(n).padStart(2, "0")
    const counterText = counterFormat
        .replace("{i}", pad(index + 1))
        .replace("{n}", pad(total))

    const isTransparentBg = (() => {
        if (!imageBgColor) return true
        const v = String(imageBgColor).trim().toLowerCase()
        if (v === "transparent") return true
        const m = v.match(/rgba?\([^)]*,\s*0(?:\.0+)?\s*\)/)
        if (m) return true
        return false
    })()
    const effectiveShadow = isTransparentBg ? "none" : cardShadow

    const cardStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: cardRadius,
        border: cardBorderWidth > 0 ? `${cardBorderWidth}px solid ${cardBorderColor}` : "none",
        boxShadow: effectiveShadow,
        background: imageBgColor,
        overflow: "hidden",
        boxSizing: "border-box" as const,
    }

    const renderImage = (item: Item) => (
        <a
            href={item.link || undefined}
            target={item.link ? "_blank" : undefined}
            rel={item.link ? "noopener noreferrer" : undefined}
            style={{
                position: "absolute",
                inset: 0,
                display: "block",
                cursor: item.link ? "pointer" : "default",
            }}
        >
            {item.image && (
                <img
                    src={item.image}
                    alt={item.title || ""}
                    draggable={false}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: imageFit,
                        display: "block",
                        userSelect: "none" as const,
                    }}
                />
            )}
        </a>
    )

    const renderFade = () => (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: speed, ease: "easeInOut" }}
                style={cardStyle}
            >
                {renderImage(current)}
            </motion.div>
        </AnimatePresence>
    )

    const renderSlide = () => (
        <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
                key={index}
                custom={direction}
                initial={{ x: direction * 100 + "%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -100 + "%", opacity: 0 }}
                transition={{ duration: speed, ease: [0.32, 0.72, 0, 1] }}
                style={cardStyle}
            >
                {renderImage(current)}
            </motion.div>
        </AnimatePresence>
    )

    const offsetIndex = (offset: number) => {
        if (loop) return ((index + offset) % total + total) % total
        const i = index + offset
        return (i >= 0 && i < total) ? i : -1
    }

    const renderStack = () => {
        const visible: { item: Item; offset: number; key: number }[] = []
        for (let offset = -2; offset <= 2; offset++) {
            const i = offsetIndex(offset)
            if (i === -1) continue
            visible.push({ item: items[i], offset, key: i })
        }
        visible.sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset))

        return (
            <>
                {visible.map(({ item, offset, key }) => {
                    const abs = Math.abs(offset)
                    const tx = offset * stackPeek
                    const ty = offset * stackPeek * 0.4
                    const rot = offset * stackRotation
                    const opacity = abs === 0 ? 1 : Math.max(0.05, stackOpacity - abs * 0.15)
                    const scale = abs === 0 ? 1 : 1 - abs * 0.04
                    return (
                        <motion.div
                            key={key}
                            initial={false}
                            animate={{ x: tx, y: ty, rotate: rot, opacity, scale, zIndex: 10 - abs }}
                            transition={{ duration: speed, ease: [0.32, 0.72, 0, 1] }}
                            style={{ ...cardStyle, pointerEvents: abs === 0 ? "auto" : "none" }}
                        >
                            {renderImage(item)}
                        </motion.div>
                    )
                })}
            </>
        )
    }

    const renderFan = () => {
        const range = 3
        const visible: { item: Item; offset: number; key: number }[] = []
        for (let offset = -range; offset <= range; offset++) {
            const i = offsetIndex(offset)
            if (i === -1) continue
            visible.push({ item: items[i], offset, key: i })
        }
        visible.sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset))

        return (
            <>
                {visible.map(({ item, offset, key }) => {
                    const abs = Math.abs(offset)
                    const tx = offset * fanSpread
                    const rot = offset * fanRotation
                    const scale = abs === 0 ? 1 : Math.max(0.5, 1 - abs * 0.07)
                    const opacity = abs === 0 ? 1 : Math.max(0.3, 1 - abs * 0.15)
                    return (
                        <motion.div
                            key={key}
                            initial={false}
                            animate={{ x: tx, rotate: rot, scale, opacity, zIndex: 10 - abs }}
                            transition={{ duration: speed, ease: [0.32, 0.72, 0, 1] }}
                            style={{ ...cardStyle, transformOrigin: "center bottom", pointerEvents: abs === 0 ? "auto" : "none" }}
                        >
                            {renderImage(item)}
                        </motion.div>
                    )
                })}
            </>
        )
    }

    const renderScale = () => {
        const visible: { item: Item; offset: number; key: number }[] = []
        for (let offset = -2; offset <= 2; offset++) {
            const i = offsetIndex(offset)
            if (i === -1) continue
            visible.push({ item: items[i], offset, key: i })
        }
        visible.sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset))

        return (
            <>
                {visible.map(({ item, offset, key }) => {
                    const abs = Math.abs(offset)
                    const tx = offset * scaleSide
                    const scale = abs === 0 ? 1 : Math.max(0.55, 0.85 - (abs - 1) * 0.15)
                    const opacity = abs === 0 ? 1 : Math.max(0.35, 0.7 - (abs - 1) * 0.2)
                    return (
                        <motion.div
                            key={key}
                            initial={false}
                            animate={{ x: tx, scale, opacity, zIndex: 10 - abs }}
                            transition={{ duration: speed, ease: [0.32, 0.72, 0, 1] }}
                            style={{ ...cardStyle, pointerEvents: abs === 0 ? "auto" : "none" }}
                        >
                            {renderImage(item)}
                        </motion.div>
                    )
                })}
            </>
        )
    }

    const renderCapsule3D = () => {
        const resolveXY = () => {
            if (capsuleOrientation === "vertical")   return { x: 0,                 y: -capsuleStackOffset }
            if (capsuleOrientation === "horizontal") return { x: capsuleStackOffset, y: 0 }
            return { x: 0, y: -capsuleStackOffset }
        }
        const { x: effX, y: effY } = resolveXY()
        const easing = `cubic-bezier(.4, ${bounceStrength}, .3, 1)`
        const transition = `transform ${speed}s ${easing}, opacity ${speed * 0.8}s ease`

        return (
            <>
                {items.map((item, i) => {
                    let rel = i - index
                    if (rel < -Math.floor(total / 2)) rel += total
                    if (rel >  Math.floor(total / 2)) rel -= total
                    const abs = Math.abs(rel)

                    const z = -abs * capsuleZ
                    const scale = 1 / (1 + abs * capsuleScale)
                    const x = rel * effX
                    const y = rel * effY
                    const rotate = rel * capsuleRotate
                    const opacity = rel === 0 ? 1 : Math.max(0, 0.7 - capsuleOpacityStep * abs)
                    const isFront = rel === 0

                    return (
                        <div
                            key={i}
                            aria-hidden={!isFront}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                width: "70%",
                                height: "60%",
                                transform:
                                    `translate(-50%, -50%) ` +
                                    `translateX(${x}px) ` +
                                    `translateY(${y}px) ` +
                                    `translateZ(${z}px) ` +
                                    `scale(${scale}) ` +
                                    `rotateZ(${rotate}deg)`,
                                zIndex: 100 - abs,
                                boxShadow: isFront ? effectiveShadow : (isTransparentBg ? "none" : "0 2px 8px rgba(0,0,0,0.08)"),
                                borderRadius: cardRadius,
                                border: cardBorderWidth > 0 ? `${cardBorderWidth}px solid ${cardBorderColor}` : "none",
                                overflow: "hidden",
                                opacity,
                                transition,
                                background: imageBgColor,
                                cursor: isFront && item.link ? "pointer" : "default",
                                pointerEvents: isFront ? "auto" : "none",
                                boxSizing: "border-box",
                            }}
                            onClick={isFront && item.link
                                ? () => window.open(item.link, "_blank", "noopener,noreferrer")
                                : undefined}
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.title || `Card ${i + 1}`}
                                    draggable={false}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: imageFit,
                                        display: "block",
                                        userSelect: "none" as const,
                                        pointerEvents: "none" as const,
                                    }}
                                />
                            )}
                        </div>
                    )
                })}
            </>
        )
    }

    const renderCurve = () => {
        const dirMult = curveDirection === "down" ? 1 : -1

        const cardTransform = (rel: number) => {
            const angleStep = (curveSlideSpacing / Math.max(curveRadius, 50))
            const angle = rel * angleStep
            const x = Math.sin(angle) * curveRadius
            const y = dirMult * (1 - Math.cos(angle)) * curveRadius
            const rotateZ = (angle * (180 / Math.PI)) * curveRotationFactor * dirMult
            const abs = Math.abs(rel)
            const z = -abs * curveZ
            const scale = 1 / (1 + abs * curveScaleStep)
            const opacity = rel === 0 ? 1 : Math.max(0, 1 - abs * curveOpacityFalloff)
            return { x, y, rotateZ, z, scale, opacity, abs }
        }

        const computeRel = (i: number) => {
            let rel = i - index
            if (loop) {
                if (rel < -Math.floor(total / 2)) rel += total
                if (rel >  Math.floor(total / 2)) rel -= total
            }
            return rel
        }

        const transformTransition = {
            type: "spring" as const,
            stiffness: 180 + (3 - bounceStrength) * 60,
            damping:  Math.max(8, 30 - bounceStrength * 7),
            mass: 1,
        }
        const sideTransformTransition = {
            type: "spring" as const, stiffness: 200, damping: 24, mass: 0.9,
        }

        return (
            <>
                {items.map((item, i) => {
                    const rel = computeRel(i)
                    const t = cardTransform(rel)
                    const isFront = rel === 0

                    return (
                        <motion.div
                            key={i}
                            aria-hidden={!isFront}
                            initial={false}
                            animate={{
                                x: t.x, y: t.y, z: t.z,
                                rotateZ: t.rotateZ, scale: t.scale,
                                opacity: t.opacity, zIndex: 100 - t.abs,
                            }}
                            transition={{
                                x:       isFront ? transformTransition : sideTransformTransition,
                                y:       isFront ? transformTransition : sideTransformTransition,
                                z:       isFront ? transformTransition : sideTransformTransition,
                                rotateZ: isFront ? transformTransition : sideTransformTransition,
                                scale:   isFront ? transformTransition : sideTransformTransition,
                                opacity: {
                                    duration: speed * (isFront ? 0.7 : 0.5),
                                    ease: "easeOut",
                                    delay: isFront && curveFadeInActive ? speed * 0.15 : 0,
                                },
                                zIndex: { duration: 0 },
                            }}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                marginLeft: "-35%",
                                marginTop: "-30%",
                                width: "70%",
                                height: "60%",
                                borderRadius: cardRadius,
                                border: cardBorderWidth > 0 ? `${cardBorderWidth}px solid ${cardBorderColor}` : "none",
                                background: imageBgColor,
                                overflow: "hidden",
                                boxShadow: isFront ? effectiveShadow : (isTransparentBg ? "none" : "0 2px 8px rgba(0,0,0,0.08)"),
                                cursor: isFront && item.link ? "pointer" : "default",
                                pointerEvents: isFront ? "auto" : "none",
                                boxSizing: "border-box",
                                willChange: "transform, opacity",
                            }}
                            onClick={isFront && item.link
                                ? () => window.open(item.link, "_blank", "noopener,noreferrer")
                                : undefined}
                        >
                            {item.image && isFront && curveFadeInActive ? (
                                <motion.img
                                    key={`active-${index}-${i}`}
                                    src={item.image}
                                    alt={item.title || `Card ${i + 1}`}
                                    draggable={false}
                                    initial={{ opacity: curveFadeInStartOpacity, scale: curveFadeInStartScale }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        opacity: { duration: speed * 0.6, ease: "easeOut", delay: speed * 0.1 },
                                        scale:   { type: "spring", stiffness: 180, damping: 14, delay: speed * 0.05 },
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: imageFit,
                                        display: "block",
                                        userSelect: "none" as const,
                                        pointerEvents: "none" as const,
                                    }}
                                />
                            ) : item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.title || `Card ${i + 1}`}
                                    draggable={false}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: imageFit,
                                        display: "block",
                                        userSelect: "none" as const,
                                        pointerEvents: "none" as const,
                                    }}
                                />
                            ) : null}
                        </motion.div>
                    )
                })}
            </>
        )
    }

    const renderClickFocus = () => {
        const transformFor = (i: number) => {
            const diff = i - focusActive
            const abs = Math.abs(diff)
            let x: number
            if (diff === 0)        x = 0
            else if (diff === -1)  x = -focusMainGap
            else if (diff === 1)   x =  focusMainGap
            else if (diff < -1)    x = -focusMainGap + (diff + 1) * focusBackGap
            else                   x =  focusMainGap + (diff - 1) * focusBackGap
            return {
                rotate: diff * focusRotation,
                x,
                zIndex: total - abs,
                scale: Math.max(0.5, 1 - abs * focusScaleStep),
            }
        }

        return (
            <>
                {items.map((item, i) => {
                    const t = transformFor(i)
                    const isActive  = i === focusActive
                    const isHovered = hovered === i
                    const scaleNow  = isHovered ? t.scale * focusHoverScale : t.scale
                    const shadow = isTransparentBg ? "none" : `0 ${isActive ? 25 : 12}px 50px ${isActive ? "-12px rgba(0,0,0,0.25)" : "-8px rgba(0,0,0,0.10)"}`

                    return (
                        <motion.div
                            key={i}
                            initial={false}
                            animate={{ rotate: t.rotate, x: t.x, scale: scaleNow, zIndex: t.zIndex }}
                            transition={{
                                type: "spring",
                                stiffness: focusSpringStiffness,
                                damping: focusSpringDamping,
                            }}
                            onClick={() => setFocusActive(i)}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                marginLeft: -focusCardWidth / 2,
                                marginTop:  -focusCardHeight / 2,
                                width:  focusCardWidth,
                                height: focusCardHeight,
                                borderRadius: cardRadius,
                                border: cardBorderWidth > 0 ? `${cardBorderWidth}px solid ${cardBorderColor}` : "none",
                                background: imageBgColor,
                                overflow: "hidden",
                                cursor: "pointer",
                                boxShadow: shadow,
                                boxSizing: "border-box",
                            }}
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.title || `Card ${i + 1}`}
                                    draggable={false}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: imageFit,
                                        display: "block",
                                        userSelect: "none" as const,
                                        pointerEvents: "none" as const,
                                    }}
                                />
                            )}
                            {!isActive && (
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: focusDimColor,
                                    opacity: focusDimOpacity,
                                    transition: "opacity 0.25s ease",
                                    pointerEvents: "none" as const,
                                }}/>
                            )}
                            {isActive && item.link && (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "block",
                                        zIndex: 5,
                                    }}
                                />
                            )}
                        </motion.div>
                    )
                })}
            </>
        )
    }

    const renderTiltedGrid = () => {
        const cols = Math.max(1, gridColumns)
        return (
            <div style={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: gridGap,
                transform: `rotate(${gridRotation}deg)`,
                transformOrigin: "center",
                padding: "8%",
                boxSizing: "border-box" as const,
            }}>
                {items.map((item, i) => {
                    const isFocused = gridFocused === i
                    const cellRot = (i % 2 === 0 ? -1 : 1) * (gridRotation * 0.3)
                    return (
                        <motion.div
                            key={i}
                            onClick={() => setGridFocused(isFocused ? null : i)}
                            initial={false}
                            animate={{
                                scale: isFocused ? gridFocusScale : 1,
                                rotate: isFocused ? 0 : cellRot,
                                zIndex: isFocused ? 50 : 1,
                            }}
                            transition={{ type: "spring", stiffness: 220, damping: 22 }}
                            style={{
                                position: "relative",
                                aspectRatio: "1 / 1",
                                borderRadius: cardRadius,
                                border: cardBorderWidth > 0 ? `${cardBorderWidth}px solid ${cardBorderColor}` : "none",
                                background: imageBgColor,
                                overflow: "hidden",
                                boxShadow: isFocused ? effectiveShadow : (isTransparentBg ? "none" : "0 4px 12px rgba(0,0,0,0.10)"),
                                cursor: "pointer",
                                boxSizing: "border-box" as const,
                            }}
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.title || `Image ${i + 1}`}
                                    draggable={false}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: imageFit,
                                        display: "block",
                                        userSelect: "none" as const,
                                        pointerEvents: "none" as const,
                                    }}
                                />
                            )}
                        </motion.div>
                    )
                })}
            </div>
        )
    }

    const renderMarquee = () => {
        const dirSign = marqueeDirection === "left" ? -1 : 1
        const duration = Math.max(5, 60 / Math.max(0.1, marqueeSpeed))

        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                }}
                onMouseEnter={(e) => {
                    if (marqueePauseOnHover) {
                        const track = e.currentTarget.querySelector(".marquee-track") as HTMLElement | null
                        if (track) track.style.animationPlayState = "paused"
                    }
                }}
                onMouseLeave={(e) => {
                    if (marqueePauseOnHover) {
                        const track = e.currentTarget.querySelector(".marquee-track") as HTMLElement | null
                        if (track) track.style.animationPlayState = "running"
                    }
                }}
            >
                <style>{`
                    @keyframes gallery-marquee-scroll {
                        from { transform: translateX(${dirSign < 0 ? "0%" : "-50%"}); }
                        to   { transform: translateX(${dirSign < 0 ? "-50%" : "0%"}); }
                    }
                `}</style>
                <div
                    className="marquee-track"
                    style={{
                        display: "flex",
                        gap: marqueeGap,
                        flexShrink: 0,
                        animation: `gallery-marquee-scroll ${duration}s linear infinite`,
                        willChange: "transform",
                    }}
                >
                    {[...items, ...items].map((item, i) => (
                        <a
                            key={i}
                            href={item.link || undefined}
                            target={item.link ? "_blank" : undefined}
                            rel={item.link ? "noopener noreferrer" : undefined}
                            style={{
                                flexShrink: 0,
                                height: "100%",
                                aspectRatio: `${arW || 4} / ${arH || 3}`,
                                borderRadius: cardRadius,
                                border: cardBorderWidth > 0 ? `${cardBorderWidth}px solid ${cardBorderColor}` : "none",
                                background: imageBgColor,
                                overflow: "hidden",
                                boxShadow: effectiveShadow,
                                cursor: item.link ? "pointer" : "default",
                                display: "block",
                                boxSizing: "border-box" as const,
                            }}
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.title || `Image ${(i % items.length) + 1}`}
                                    draggable={false}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: imageFit,
                                        display: "block",
                                        userSelect: "none" as const,
                                    }}
                                />
                            )}
                        </a>
                    ))}
                </div>
            </div>
        )
    }

    const modeRenderer = (() => {
        switch (mode) {
            case "fade":       return renderFade()
            case "slide":      return renderSlide()
            case "stack":      return renderStack()
            case "fan":        return renderFan()
            case "scale":      return renderScale()
            case "capsule3D":  return renderCapsule3D()
            case "curve":      return renderCurve()
            case "clickFocus": return renderClickFocus()
            case "tiltedGrid": return renderTiltedGrid()
            case "marquee":    return renderMarquee()
            default:           return renderFade()
        }
    })()

    const activeItem: Item =
        mode === "clickFocus" ? items[focusActive] :
        mode === "tiltedGrid" && gridFocused != null ? items[gridFocused] :
        current

    // Shared title text style for above/below (non-overlay) positions
    const titleTextStyle: React.CSSProperties = {
        fontFamily: ffTitle,
        fontSize: titleSize,
        fontWeight: titleWeight as any,
        color: titleColor,
        lineHeight: 1.2,
        textAlign: "center" as const,
    }

    // Overlay-on-image title (top or bottom)
    const titleOverlay = showTitle && activeItem.title && (titlePosition === "top" || titlePosition === "bottom") ? (
        <div style={{
            position: "absolute",
            left: 0,
            right: 0,
            [titlePosition === "top" ? "top" : "bottom"]: 0,
            padding: titlePadding,
            background: titleBgColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 20,
            pointerEvents: "none" as const,
        } as React.CSSProperties}>
            <span style={titleTextStyle}>{activeItem.title}</span>
        </div>
    ) : null

    // Title row ABOVE the image (in its own row, no overlay)
    const titleAbove = showTitle && activeItem.title && titlePosition === "above" ? (
        <div style={{
            marginBottom: titleGapAbove,
            display: "flex",
            justifyContent: "center",
        }}>
            <span style={titleTextStyle}>{activeItem.title}</span>
        </div>
    ) : null

    // Title row BELOW the image (in its own row, no overlay)
    const titleBelow = showTitle && activeItem.title && titlePosition === "below" ? (
        <div style={{
            marginTop: titleGap,
            display: "flex",
            justifyContent: "center",
        }}>
            <span style={titleTextStyle}>{activeItem.title}</span>
        </div>
    ) : null

    const counterEl = showCounter && ARROW_NAV_MODES.includes(mode) ? (
        <div style={{
            position: "absolute",
            [counterPosition.includes("top")    ? "top"    : "bottom"]: 12,
            [counterPosition.includes("right")  ? "right"  : "left"  ]: 12,
            padding: counterPadding,
            background: counterBgColor,
            borderRadius: 999,
            zIndex: 21,
            fontFamily: ffCounter,
            fontSize: counterSize,
            color: counterColor,
            letterSpacing: "0.05em",
            pointerEvents: "none" as const,
            lineHeight: 1,
        } as React.CSSProperties}>{counterText}</div>
    ) : null

    const ArrowBtn = ({ dir, disabled, onClick }: {
        dir: "left" | "right"
        disabled: boolean
        onClick: () => void
    }) => {
        const isCircle = arrowStyle === "circle"
        return (
            <div
                role="button"
                tabIndex={0}
                aria-label={dir === "left" ? "Previous" : "Next"}
                onClick={disabled ? undefined : onClick}
                onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !disabled) {
                        e.preventDefault()
                        onClick()
                    }
                }}
                style={{
                    width: arrowSize,
                    height: arrowSize,
                    borderRadius: isCircle ? "50%" : 8,
                    border: `1.5px solid ${arrowBorderColor}`,
                    background: arrowBg,
                    color: arrowIconColor,
                    cursor: disabled ? "default" : "pointer",
                    opacity: disabled ? 0.35 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: arrowSize * 0.45,
                    fontFamily: FONT_STACKS["IBM Plex Mono"],
                    userSelect: "none" as const,
                    outline: "none",
                }}
            >{dir === "left" ? "‹" : "›"}</div>
        )
    }

    const arrowsAreSides = arrowPlacement === "sides" || (arrowPlacement === "auto" && mode !== "capsule3D")
    const showNav = ARROW_NAV_MODES.includes(mode)

    const handleDragEnd = (_: any, info: { offset: { x: number }, velocity: { x: number } }) => {
        const offset = info.offset.x
        const velocity = info.velocity.x
        if (offset < -dragThreshold || velocity < -500) next()
        else if (offset > dragThreshold || velocity > 500) prev()
        animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 })
    }

    const useAspectStage = ["fade", "slide", "stack", "fan", "scale"].includes(mode)
    const stageNeedsPerspective = mode === "capsule3D" || mode === "curve"

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
                position: "relative",
                background: containerBg,
            }}
        >
            {titleAbove}

            <div style={{
                position: "relative",
                width: "100%",
                paddingBottom: useAspectStage ? aspectPct : 0,
                height: useAspectStage ? 0 : containerHeight,
                perspective: stageNeedsPerspective ? `${mode === "curve" ? 1200 : capsulePerspective}px` : undefined,
                overflow: mode === "marquee" ? "hidden" : "visible",
            }}>
                <div style={{
                    position: useAspectStage ? "absolute" : "relative",
                    inset: useAspectStage ? 0 : undefined,
                    width: useAspectStage ? undefined : "100%",
                    height: useAspectStage ? undefined : "100%",
                    transformStyle: stageNeedsPerspective ? "preserve-3d" as const : undefined,
                }}>
                    {/* Drag-to-navigate: enabled for every stepped-nav mode (stack, curve, ...) */}
                    {enableDrag && showNav ? (
                        <motion.div
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "relative",
                                transformStyle: stageNeedsPerspective ? "preserve-3d" as const : undefined,
                                cursor: "grab",
                                touchAction: "pan-y",
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            whileDrag={{ cursor: "grabbing" }}
                        >
                            {modeRenderer}
                        </motion.div>
                    ) : (
                        modeRenderer
                    )}
                    {titleOverlay}
                    {counterEl}
                </div>

                {showNav && showArrows && total > 1 && arrowsAreSides && (
                    <>
                        <div style={{
                            position: "absolute",
                            top: "50%",
                            transform: "translateY(-50%)",
                            left: arrowOffset,
                            zIndex: 30,
                        }}>
                            <ArrowBtn dir="left" disabled={prevDisabled} onClick={prev} />
                        </div>
                        <div style={{
                            position: "absolute",
                            top: "50%",
                            transform: "translateY(-50%)",
                            right: arrowOffset,
                            zIndex: 30,
                        }}>
                            <ArrowBtn dir="right" disabled={nextDisabled} onClick={next} />
                        </div>
                    </>
                )}
            </div>

            {titleBelow}

            {showNav && total > 1 && (showDots || (showArrows && !arrowsAreSides)) && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                    marginTop: navGap,
                    position: "relative",
                    zIndex: 40,
                }}>
                    {showArrows && !arrowsAreSides && (
                        <ArrowBtn dir="left" disabled={prevDisabled} onClick={prev} />
                    )}

                    {showDots && DOTS_MODES.includes(mode) && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            {items.map((_, i) => (
                                <div
                                    key={i}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Go to ${i + 1}`}
                                    onClick={() => goTo(i, i > index ? 1 : -1)}
                                    style={{
                                        width:  i === index ? dotSize + 2 : dotSize,
                                        height: i === index ? dotSize + 2 : dotSize,
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

                    {showArrows && !arrowsAreSides && (
                        <ArrowBtn dir="right" disabled={nextDisabled} onClick={next} />
                    )}
                </div>
            )}

            {showCounter && mode === "clickFocus" && total > 1 && (
                <div style={{
                    marginTop: counterMarginTop,
                    fontFamily: ffCounter,
                    fontSize: counterSize,
                    color: counterColor,
                    letterSpacing: "0.05em",
                    textAlign: "center" as const,
                }}>
                    {counterFormat
                        .replace("{i}", pad(focusActive + 1))
                        .replace("{n}", pad(total))}
                </div>
            )}
        </div>
    )
}
