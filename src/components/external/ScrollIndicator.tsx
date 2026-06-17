// ScrollIndicator — approximation of the Framer marketplace ScrollIndicator.
// Renders a minimalist mouse/pill outline with an animated dot, used as the
// hero "scroll down" cue. Clicking scrolls to the next section if provided.

type ScrollIndicatorProps = {
  borderColor?: string
  borderOpacity?: number
  dotColor?: string
  pillWidth?: number
  pillHeight?: number
  dotSize?: number
  borderWidth?: number
  borderRadius?: number
  animationSpeed?: number
  targetId?: string
  style?: React.CSSProperties
}

export default function ScrollIndicator({
  borderColor = "rgb(79, 88, 175)",
  borderOpacity = 0.5,
  dotColor = "rgb(79, 88, 175)",
  pillWidth = 28,
  pillHeight = 40,
  dotSize = 6,
  borderWidth = 2,
  borderRadius = 20,
  animationSpeed = 3,
  targetId = "about",
  style,
}: ScrollIndicatorProps) {
  const onClick = () => {
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <button
      aria-label="Scroll down"
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          justifyContent: "center",
          width: pillWidth,
          height: pillHeight,
          paddingTop: 7,
          borderRadius,
          border: `${borderWidth}px solid ${borderColor}`,
          opacity: borderOpacity + 0.3,
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: dotColor,
            animation: `scroll-ind ${animationSpeed}s ease-in-out infinite`,
          }}
        />
      </span>
      <style>{`
        @keyframes scroll-ind {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(${pillHeight - dotSize - 16}px); opacity: 0.3; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </button>
  )
}
