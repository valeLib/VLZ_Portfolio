import { useEffect } from "react"
import Lenis from "lenis"
import { clearLenis, setLenis } from "../lib/scroll"

// Inertial smooth scrolling for mouse-wheel input. Lenis animates the native
// window scroll, so position: sticky keeps working. Disabled when the user
// prefers reduced motion; touch scrolling stays native either way.
export default function SmoothScroll() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        const lenis = new Lenis({ lerp: 0.1 })
        setLenis(lenis)

        let raf = requestAnimationFrame(function loop(time) {
            lenis.raf(time)
            raf = requestAnimationFrame(loop)
        })

        return () => {
            cancelAnimationFrame(raf)
            clearLenis(lenis)
            lenis.destroy()
        }
    }, [])

    return null
}
