// Shared scroll entry points. When Lenis is active (see SmoothScroll), all
// programmatic scrolling must go through it — mixing native smooth scrolling
// with Lenis makes the two fight over the scroll position.

import type Lenis from "lenis"

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
    lenis = instance
}

export function scrollToElement(el: HTMLElement) {
    if (lenis) lenis.scrollTo(el)
    else el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function scrollToTop() {
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: "smooth" })
}
