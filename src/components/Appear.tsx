import { motion } from "framer-motion"
import type { Transition } from "framer-motion"
import type { ReactNode } from "react"

/**
 * Opacity-fade wrapper. The transition is passed as a compact string so section
 * markup can declare timing inline instead of building a Transition object:
 *
 *   "tween <x1,y1,x2,y2> <duration> <delay>"
 *   "spring-duration <duration> <bounce> <delay>"
 *
 * `trigger` picks when it plays: on mount, or on entering the viewport.
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
    threshold = 0.5,
    once = false,
    style,
    className,
}: {
    children: ReactNode
    transition: string
    trigger?: "mount" | "inView" | "scroll"
    threshold?: number
    /** Keep the element visible once revealed, instead of fading it back out. */
    once?: boolean
    style?: React.CSSProperties
    className?: string
}) {
    const t = parseTransition(transition)

    if (trigger === "mount") {
        return (
            <motion.div
                className={className}
                style={style}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={t}
            >
                {children}
            </motion.div>
        )
    }

    // By default the fade replays on every entry and reverses on exit. `once`
    // pins it open, for content that must not blink out while it is still on
    // screen — a block taller than the threshold allows can otherwise sit at
    // zero opacity for the whole time it is being read.
    return (
        <motion.div
            className={className}
            style={style}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: threshold, once }}
            transition={t}
        >
            {children}
        </motion.div>
    )
}
