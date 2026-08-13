import { useEffect } from "react"
import Lenis from "lenis"
import { setLenis } from "../lib/scroll"

// Inertial smooth scrolling for mouse-wheel input. Lenis animates the native
// window scroll, so position: sticky keeps working. Disabled when the user
// prefers reduced motion; touch scrolling stays native either way.
export default function SmoothScroll() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        const lenis = new Lenis({ lerp: 0.1 })
        setLenis(lenis)
        // CSS smooth-behavior would ease Lenis's own scroll writes; turn it off.
        document.documentElement.classList.add("lenis-active")

        let raf = requestAnimationFrame(function loop(time) {
            lenis.raf(time)
            raf = requestAnimationFrame(loop)
        })

        return () => {
            cancelAnimationFrame(raf)
            lenis.destroy()
            setLenis(null)
            document.documentElement.classList.remove("lenis-active")
        }
    }, [])

    return null
}
