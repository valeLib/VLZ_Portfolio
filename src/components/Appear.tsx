import { motion, useReducedMotion } from "framer-motion"
import type { Transition } from "framer-motion"
import type { ReactNode } from "react"

/**
 * Entrance wrapper: a short fade with a small upward settle. The transition is
 * passed as a compact string so section markup can declare timing inline
 * instead of building a Transition object:
 *
 *   "tween <x1,y1,x2,y2> <duration> <delay>"
 *   "spring-duration <duration> <bounce> <delay>"
 *
 * `trigger` picks when it plays: on mount, or on entering the viewport.
 * Viewport entrances play once and stay — replaying on every pass reads as
 * flicker whenever the reader scrolls back a little. Under
 * prefers-reduced-motion the wrapper is inert and the content is simply there.
 */

const secs = (s: string) => parseFloat(s) || 0

function parseTransition(spec: string): Transition {
    const parts = spec.trim().split(/\s+/)
    if (parts[0] === "tween") {
        const ease = parts[1].split(",").map(Number) as [number, number, number, number]
        return { type: "tween", ease, duration: secs(parts[2]), delay: secs(parts[3]) }
    }
    if (parts[0] === "spring-duration") {
        return {
            type: "spring",
            duration: secs(parts[1]),
            bounce: parseFloat(parts[2]) || 0,
            delay: secs(parts[3]),
        }
    }
    return { duration: 0 }
}

export default function Appear({
    children,
    transition,
    trigger = "mount",
    threshold = 0.3,
    once = true,
    y = 14,
    style,
    className,
}: {
    children: ReactNode
    transition: string
    trigger?: "mount" | "inView" | "scroll"
    threshold?: number
    /** Replay the entrance on every viewport entry instead of holding it. */
    once?: boolean
    /** Upward settle distance in px; 0 for a plain fade. Keep it 0 on an
     *  element whose own stylesheet transform must survive. */
    y?: number
    style?: React.CSSProperties
    className?: string
}) {
    const reduce = useReducedMotion()
    if (reduce) {
        return (
            <div className={className} style={style}>
                {children}
            </div>
        )
    }

    const t = parseTransition(transition)
    const hidden = { opacity: 0, y }
    const shown = { opacity: 1, y: 0 }

    if (trigger === "mount") {
        return (
            <motion.div className={className} style={style} initial={hidden} animate={shown} transition={t}>
                {children}
            </motion.div>
        )
    }

    return (
        <motion.div
            className={className}
            style={style}
            initial={hidden}
            whileInView={shown}
            viewport={{ amount: threshold, once }}
            transition={t}
        >
            {children}
        </motion.div>
    )
}
