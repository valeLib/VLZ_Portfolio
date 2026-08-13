// Fixed circular button that appears after scrolling and smooth-scrolls to top.

import { useEffect, useState } from "react"

type BackToTopProps = {
  size?: number
  fill?: string
  iconColor?: string
  hoverFill?: string
  showAfter?: number // fraction of viewport scrolled before showing
  sideOffset?: number
  bottom?: number
}

export default function BackToTop({
  size = 56,
  fill = "rgb(79, 88, 175)",
  iconColor = "rgb(255, 255, 255)",
  hoverFill = "rgb(238, 151, 142)",
  showAfter = 0.25,
  sideOffset = 24,
  bottom = 24,
}: BackToTopProps) {
  const [visible, setVisible] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * showAfter)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [showAfter])

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "fixed",
        right: sideOffset,
        bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        background: hover ? hoverFill : fill,
        color: iconColor,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity .25s ease, transform .25s ease, background .2s ease",
        zIndex: 900,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke={iconColor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
