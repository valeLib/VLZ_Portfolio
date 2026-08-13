type SectionHeaderProps = {
    num?: string
    label?: string
    title?: string
    intro?: string
    showDot?: boolean
    showLabel?: boolean
    dotColor?: string
    dotSize?: number
    eyebrowColor?: string
    eyebrowSize?: number
    titleColor?: string
    titleSize?: number
    introColor?: string
    introSize?: number
}

const DEFAULTS: Required<SectionHeaderProps> = {
    num: "04 —",
    label: "Projects",
    title: "Featured work",
    intro: "",
    showDot: true,
    showLabel: true,
    dotColor: "#4F58AF",
    dotSize: 9,
    eyebrowColor: "#9896A8",
    eyebrowSize: 15,
    titleColor: "#1C1B22",
    titleSize: 34,
    introColor: "#5A5870",
    introSize: 15,
}

export default function SectionHeader(props: SectionHeaderProps) {
    const {
        num, label, title, intro,
        showDot, showLabel,
        dotColor, dotSize,
        eyebrowColor, eyebrowSize,
        titleColor, titleSize,
        introColor, introSize,
    } = { ...DEFAULTS, ...props }

    const hasEyebrowRow = showDot || showLabel

    return (
        <div style={{ width: "100%" }}>
            {hasEyebrowRow && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    {showDot && (
                        <div style={{
                            width: dotSize,
                            height: dotSize,
                            borderRadius: "50%",
                            background: dotColor,
                            flexShrink: 0,
                        }} />
                    )}
                    {showLabel && (
                        <span style={{
                            fontFamily: "'Caveat', cursive",
                            fontSize: eyebrowSize,
                            fontWeight: 700,
                            color: eyebrowColor,
                        }}>{num} {label}</span>
                    )}
                </div>
            )}

            <h2 style={{
                fontFamily: "'Fredoka One', 'Fredoka', cursive",
                fontSize: titleSize,
                color: titleColor,
                lineHeight: 1.1,
                fontWeight: 400,
                letterSpacing: "0.01em",
                margin: 0,
                marginBottom: intro ? 8 : 0,
            }}>{title}</h2>

            {intro ? (
                <p style={{
                    fontFamily: "'Anonymous Pro', monospace",
                    fontSize: introSize,
                    color: introColor,
                    lineHeight: 1.8,
                    margin: 0,
                    marginTop: 8,
                }}>{intro}</p>
            ) : null}
        </div>
    )
}
