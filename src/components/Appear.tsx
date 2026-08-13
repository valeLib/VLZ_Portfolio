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
    style,
    className,
}: {
    children: ReactNode
    transition: string
    trigger?: "mount" | "inView" | "scroll"
    threshold?: number
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

    // once: false so the fade replays on every entry and reverses on exit.
    return (
        <motion.div
            className={className}
            style={style}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: threshold, once: false }}
            transition={t}
        >
            {children}
        </motion.div>
    )
}
