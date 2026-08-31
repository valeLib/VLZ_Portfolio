import { useEffect, useSyncExternalStore } from "react"

/**
 * Hide-on-scroll for a floating bar, shared by every breakpoint.
 *
 * Direction is judged on travel, not on individual scroll events: deltas
 * accumulate in one direction and the bar reacts once they pass `threshold`,
 * so momentum jitter and the odd pixel of drift never toggle it. Above
 * `revealAtTop` the bar is always shown. After a scroll-up reveal it hides
 * again once `idleDelay` passes with no further scrolling — unless `held`, the
 * caller's word for "someone is using it": a pointer over it, keyboard focus
 * inside it, or one of its menus open. A hold also reveals the bar, so tabbing
 * into a hidden bar brings it back.
 *
 * The state lives in one module-level store outside React: the scroll
 * listener, the idle timer and the hold all write to it, and the component
 * subscribes. The site mounts a single navigation bar at a time, which is
 * what a single store assumes.
 */
type Settings = { threshold: number; revealAtTop: number; idleDelay: number }

const store = {
    visible: true,
    held: false,
    travel: 0,
    lastY: 0,
    idle: null as ReturnType<typeof setTimeout> | null,
    settings: { threshold: 12, revealAtTop: 120, idleDelay: 3000 } as Settings,
    listeners: new Set<() => void>(),

    subscribe(listener: () => void) {
        store.listeners.add(listener)
        return () => {
            store.listeners.delete(listener)
        }
    },
    read() {
        return store.visible
    },
    set(visible: boolean) {
        if (visible === store.visible) return
        store.visible = visible
        store.listeners.forEach((l) => l())
    },
    clearIdle() {
        if (store.idle) {
            clearTimeout(store.idle)
            store.idle = null
        }
    },
    armIdle() {
        store.clearIdle()
        store.idle = setTimeout(() => {
            store.idle = null
            if (!store.held && window.scrollY > store.settings.revealAtTop) store.set(false)
        }, store.settings.idleDelay)
    },
    onScroll() {
        const { threshold, revealAtTop } = store.settings
        const y = window.scrollY
        const dy = y - store.lastY
        store.lastY = y
        if (y <= revealAtTop) {
            store.travel = 0
            store.clearIdle()
            store.set(true)
            return
        }
        // A change of direction starts the count again from zero, so a
        // reversal needs a full threshold of travel before it counts.
        if (Math.sign(dy) !== Math.sign(store.travel)) store.travel = 0
        store.travel += dy
        if (store.travel > threshold) {
            store.travel = threshold
            if (!store.held) {
                store.clearIdle()
                store.set(false)
            }
        } else if (store.travel < -threshold) {
            store.travel = -threshold
            store.set(true)
            store.armIdle()
        }
    },
}

export function useNavVisibility({
    enabled,
    held,
    threshold = 12,
    revealAtTop = 120,
    idleDelay = 3000,
    resetKey,
}: {
    enabled: boolean
    held: boolean
    threshold?: number
    revealAtTop?: number
    idleDelay?: number
    /** Changes when the page does; the bar starts each page visible. */
    resetKey?: string
}): boolean {
    const visible = useSyncExternalStore(store.subscribe, store.read, store.read)

    useEffect(() => {
        store.settings = { threshold, revealAtTop, idleDelay }
    }, [threshold, revealAtTop, idleDelay])

    // A new page starts with the bar shown.
    useEffect(() => {
        store.set(true)
        store.travel = 0
        store.lastY = window.scrollY
        store.clearIdle()
    }, [resetKey])

    useEffect(() => {
        if (!enabled) {
            store.set(true)
            store.clearIdle()
            return
        }
        store.lastY = window.scrollY
        window.addEventListener("scroll", store.onScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", store.onScroll)
            store.clearIdle()
        }
    }, [enabled])

    // A hold reveals the bar and pauses the countdown; releasing it restarts
    // the countdown if the page is scrolled.
    useEffect(() => {
        store.held = held
        if (!enabled) return
        if (held) {
            store.clearIdle()
            store.set(true)
        } else if (window.scrollY > store.settings.revealAtTop) {
            store.armIdle()
        }
    }, [held, enabled])

    return enabled ? visible : true
}
