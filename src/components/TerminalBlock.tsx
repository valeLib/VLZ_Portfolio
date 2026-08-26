// Terminal / CLI-style content block: optional prompt lines above and below a
// list of label:value rows, each value optionally prefixed with a status dot.

type Row = {
    label: string
    value: string
    valueColor: string
    showDot?: boolean
    dotColor?: string
}

type TerminalBlockProps = {
    backgroundColor?: string
    padding?: number
    rowGap?: number
    sectionGap?: number
    topCommands?: string[]
    rows?: Row[]
    bottomCommands?: string[]
    commandFont?: string
    commandWeight?: number
    commandSize?: number
    commandTextColor?: string
    promptSymbol?: string
    promptColor?: string
    promptSpacing?: number
    rowFont?: string
    rowWeight?: number
    rowSize?: number
    labelColor?: string
    labelValueGap?: number
    valueWeight?: number
    dotSize?: number
    dotValueGap?: number
}

const DEFAULTS: Required<TerminalBlockProps> = {
    backgroundColor: "rgba(0,0,0,0)",
    padding: 0,
    rowGap: 6,
    sectionGap: 18,
    topCommands: ["whoami"],
    rows: [
        { label: "Name:", value: "Valentina Liberona", valueColor: "#EE978E" },
        { label: "Role:", value: "Unity Dev + Frontend Eng", valueColor: "#7AC7B2" },
        { label: "Base:", value: "Santiago, Chile", valueColor: "#FABA32" },
        { label: "Status:", value: "Available", valueColor: "#3a8265", showDot: true, dotColor: "#3a8265" },
    ],
    bottomCommands: ["skills --list"],
    commandFont: "'IBM Plex Mono', 'Courier New', monospace",
    commandWeight: 700,
    commandSize: 15,
    commandTextColor: "#1a1520",
    promptSymbol: ">",
    promptColor: "#4F58AF",
    promptSpacing: 8,
    rowFont: "'IBM Plex Mono', 'Courier New', monospace",
    rowWeight: 400,
    rowSize: 14,
    labelColor: "#1a1520",
    labelValueGap: 8,
    valueWeight: 700,
    dotSize: 7,
    dotValueGap: 6,
}

export default function TerminalBlock(props: TerminalBlockProps) {
    const {
        backgroundColor, padding, rowGap, sectionGap,
        topCommands, rows, bottomCommands,
        commandFont, commandWeight, commandSize, commandTextColor,
        promptSymbol, promptColor, promptSpacing,
        rowFont, rowWeight, rowSize, labelColor, labelValueGap, valueWeight,
        dotSize, dotValueGap,
    } = { ...DEFAULTS, ...props }

    const renderCommand = (text: string, key: string) => (
        <div key={key} style={{
            display: "flex",
            alignItems: "baseline",
            gap: promptSpacing,
            fontFamily: commandFont,
            fontWeight: commandWeight,
            fontSize: commandSize,
            color: commandTextColor,
            lineHeight: 1.4,
        }}>
            <span style={{ color: promptColor }}>{promptSymbol}</span>
            <span>{text}</span>
        </div>
    )

    return (
        <div style={{
            width: "100%",
            height: "100%",
            background: backgroundColor,
            padding,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: sectionGap,
        }}>
            {topCommands.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: rowGap }}>
                    {topCommands.map((c, i) => renderCommand(c, `top-${i}`))}
                </div>
            )}

            {rows.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: rowGap }}>
                    {rows.map((row, i) => (
                        <div key={i} style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: labelValueGap,
                            fontFamily: rowFont,
                            fontWeight: rowWeight,
                            fontSize: rowSize,
                            lineHeight: 1.4,
                            flexWrap: "wrap",
                        }}>
                            <span style={{ color: labelColor }}>{row.label}</span>
                            <span style={{
                                display: "inline-flex",
                                alignItems: "baseline",
                                gap: dotValueGap,
                                color: row.valueColor,
                                fontWeight: valueWeight,
                            }}>
                                {row.showDot && (
                                    <span style={{
                                        display: "inline-block",
                                        width: dotSize,
                                        height: dotSize,
                                        borderRadius: "50%",
                                        background: row.dotColor,
                                        flexShrink: 0,
                                        transform: "translateY(-1px)",
                                    }} />
                                )}
                                <span>{row.value}</span>
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {bottomCommands.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: rowGap }}>
                    {bottomCommands.map((c, i) => renderCommand(c, `bot-${i}`))}
                </div>
            )}
        </div>
    )
}
