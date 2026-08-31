// Shared scroll entry points. When Lenis is active (see SmoothScroll), all
// programmatic scrolling must go through it — mixing native smooth scrolling
// with Lenis makes the two fight over the scroll position.

import type Lenis from "lenis"

let lenis: Lenis | null = null

export function setLenis(instance: Lenis) {
    lenis = instance
    // CSS smooth-behavior would ease Lenis's own scroll writes.
    document.documentElement.classList.add("lenis-active")
}

/**
 * Deregister an instance, but only if it is still the current one.
 *
 * A component's cleanup can land after its replacement has already mounted —
 * StrictMode's double-invoke in development does exactly that. Clearing
 * unconditionally leaves a live Lenis driving the page with nothing registered,
 * at which point every programmatic scroll falls back to a native call that the
 * live instance immediately reverts, and anchors stop working entirely.
 */
export function clearLenis(instance: Lenis) {
    if (lenis !== instance) return
    lenis = null
    document.documentElement.classList.remove("lenis-active")
}

/**
 * Document-relative top of an element's layout box.
 *
 * A `position: sticky` section that has been scrolled past stays pinned at the
 * viewport top, and both getBoundingClientRect() and offsetTop report that
 * pinned position rather than where the section actually sits in the document.
 * Scrolling to either value is a no-op, which is why an anchor pointing back up
 * the page appears to do nothing.
 *
 * Dropping the element to `static` for the duration of one measurement gives up
 * its real position. Sticky does not participate in layout, so nothing else on
 * the page moves, and the write/read/restore happens inside a single task — the
 * browser never paints the intermediate state.
 */
export function flowOffsetTop(el: HTMLElement): number {
    const measure = () => el.getBoundingClientRect().top + window.scrollY
    if (getComputedStyle(el).position !== "sticky") return measure()

    const inline = el.style.position
    el.style.position = "static"
    const top = measure()
    el.style.position = inline
    return top
}

export function scrollToElement(el: HTMLElement, offset = 0) {
    const top = Math.max(0, flowOffsetTop(el) - offset)
    if (lenis) lenis.scrollTo(top)
    else window.scrollTo({ top, behavior: "smooth" })
}

export function scrollToTop() {
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: "smooth" })
}

/** Jump with no animation, for route changes. */
export function jumpTo(y: number) {
    // Move the document first. Lenis applies even an `immediate` scrollTo on its
    // next animation frame, and that one frame is long enough to show the
    // incoming page at the outgoing page's scroll position.
    //
    // "instant" has to be spelled out: the default of "auto" defers to the
    // global `scroll-behavior: smooth`, which turns the reset into a glide up
    // the whole page whenever Lenis is not the one driving.
    window.scrollTo({ top: y, left: 0, behavior: "instant" })
    // Then bring Lenis's own position along, or it eases back on its next frame.
    lenis?.scrollTo(y, { immediate: true, force: true })
}

// A section id to land on when the next route mounts. Set by a nav link that
// points at a section which is not on the current page; consumed by the route
// scroll reset, so the incoming page is positioned before its first paint
// instead of rendering at the top and visibly travelling to the section.
let pendingAnchor: string | null = null

export function setPendingAnchor(id: string) {
    pendingAnchor = id
}

export function takePendingAnchor(): string | null {
    const id = pendingAnchor
    pendingAnchor = null
    return id
}
