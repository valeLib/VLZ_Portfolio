import { useEffect, useState } from "react"

// Site-wide breakpoints: desktop ≥1200, tablet 810–1199, phone ≤809.
export type Breakpoint = "desktop" | "tablet" | "phone"

const get = (): Breakpoint => {
    if (typeof window === "undefined") return "desktop"
    if (window.matchMedia("(max-width: 809.98px)").matches) return "phone"
    if (window.matchMedia("(max-width: 1199.98px)").matches) return "tablet"
    return "desktop"
}

export function useBreakpoint(): Breakpoint {
    const [bp, setBp] = useState<Breakpoint>(get)
    useEffect(() => {
        const onResize = () => setBp(get())
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])
    return bp
}
