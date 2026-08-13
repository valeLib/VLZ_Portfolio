import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

/**
 * Decorative hero sticker, in two variants:
 *   "drag" — draggable, tilts toward the cursor and lifts its shadow while held
 *   "peel" — sits on a curled corner that flattens on hover
 */

const SHADOW_FLAT = "0px 1px 2px 0px rgba(0, 0, 0, 0.30)"
const SHADOW_LIFTED = "0px 13px 14px 0px rgba(0, 0, 0, 0.30)"

export default function Sticker({
    image,
    className,
    style,
    tilt = 0.4,
    elevation = 0.2,
    draggable = false,
    peel = false,
    alt = "",
}: {
    image: string
    className?: string
    style?: React.CSSProperties
    tilt?: number
    elevation?: number
    draggable?: boolean
    peel?: boolean
    alt?: string
}) {
    const ref = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(false)

    // Pointer position, normalised to -1..1 across the sticker, drives the tilt.
    const px = useMotionValue(0)
    const py = useMotionValue(0)
    const sx = useSpring(px, { stiffness: 500, damping: 60 })
    const sy = useSpring(py, { stiffness: 500, damping: 60 })
    const rotateY = useTransform(sx, [-1, 1], [-18 * tilt, 18 * tilt])
    const rotateX = useTransform(sy, [-1, 1], [18 * tilt, -18 * tilt])

    const onMove = (e: React.PointerEvent) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        px.set(((e.clientX - r.left) / r.width) * 2 - 1)
        py.set(((e.clientY - r.top) / r.height) * 2 - 1)
    }

    const reset = () => {
        px.set(0)
        py.set(0)
        setActive(false)
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ perspective: 900, ...style }}
            drag={draggable}
            dragMomentum={false}
            dragElastic={0.18}
            onDragStart={() => setActive(true)}
            onDragEnd={reset}
            onPointerMove={onMove}
            onPointerEnter={() => setActive(true)}
            onPointerLeave={reset}
        >
            <motion.div
                style={{
                    width: "100%",
                    height: "100%",
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    // The peel variant sits on a curled corner until hovered flat.
                    transformOrigin: peel ? "top left" : "center",
                }}
                animate={{
                    y: active ? -6 * (elevation * 10) : 0,
                    rotate: peel ? (active ? 0 : -6) : 0,
                    scale: active ? 1.04 : 1,
                    filter: `drop-shadow(${active ? SHADOW_LIFTED : SHADOW_FLAT})`,
                }}
                transition={{ type: "tween", ease: [0.44, 0, 0.56, 1], duration: 0.6 }}
            >
                <img
                    src={image}
                    alt={alt}
                    draggable={false}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        userSelect: "none",
                        pointerEvents: "none",
                        // Curl highlight for the peeling variant.
                        maskImage: peel
                            ? "linear-gradient(135deg, rgba(0,0,0,1) 78%, rgba(0,0,0,0.85) 100%)"
                            : undefined,
                    }}
                />
            </motion.div>
        </motion.div>
    )
}
