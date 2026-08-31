import { motion, useReducedMotion } from "framer-motion"
import type { CSSProperties, ReactNode } from "react"

// Route entrance: the incoming page fades up into place. Entrance only — an
// exit animation on a hash router would have to hold the outgoing page on
// screen while the scroll position is already being reset for the incoming one.
export default function PageEnter({
    children,
    className,
    style,
}: {
    children: ReactNode
    className?: string
    style?: CSSProperties
}) {
    const reduce = useReducedMotion()
    return (
        <motion.div
            className={className}
            style={style}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    )
}
