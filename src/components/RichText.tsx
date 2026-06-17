// RichText — renders CMS Formatted Text (HTML) with styling that matches the
// portfolio's body typography. Used for project case studies and work entries.

import { useMemo } from "react"

type RichTextProps = {
    html: string
    style?: React.CSSProperties
    className?: string
}

let injected = false
function injectStylesOnce() {
    if (injected || typeof document === "undefined") return
    injected = true
    const css = `
    .rich-text { font-family: "Anonymous Pro", monospace; color: rgb(90, 88, 112); line-height: 1.85; font-size: 15px; }
    .rich-text h2 { font-family: "Fredoka One", "Fredoka", cursive; font-weight: 400; color: rgb(28,27,34); font-size: 26px; line-height: 1.2; margin: 32px 0 12px; }
    .rich-text h3 { font-family: "Fredoka One", "Fredoka", cursive; font-weight: 400; color: rgb(28,27,34); font-size: 20px; margin: 24px 0 10px; }
    .rich-text p { margin: 0 0 14px; }
    .rich-text a { color: rgb(79,88,175); text-decoration: underline; }
    .rich-text strong { color: rgb(28,27,34); }
    .rich-text ul, .rich-text ol { margin: 0 0 16px; padding-left: 22px; }
    .rich-text li { margin-bottom: 8px; }
    .rich-text code { font-family: "IBM Plex Mono", monospace; font-size: 0.86em; background: rgba(79,88,175,0.1); color: rgb(46,52,112); padding: 2px 6px; border-radius: 4px; }
    .rich-text pre { background: rgb(24,24,42); color: rgb(200,214,240); font-family: "IBM Plex Mono", monospace; font-size: 12.5px; line-height: 1.7; padding: 16px 18px; border-radius: 10px; overflow-x: auto; margin: 0 0 18px; }
    .rich-text pre code { background: none; color: inherit; padding: 0; }
    .rich-text blockquote { margin: 0 0 18px; padding: 10px 18px; border-left: 3px solid rgb(238,151,142); background: rgba(238,151,142,0.08); border-radius: 0 8px 8px 0; }
    .rich-text figure { margin: 0 0 20px; overflow-x: auto; }
    .rich-text table { border-collapse: collapse; width: 100%; font-size: 13px; }
    .rich-text th, .rich-text td { border: 1.5px solid rgb(228,223,214); padding: 8px 12px; text-align: left; vertical-align: top; }
    .rich-text th { background: rgba(79,88,175,0.08); font-family: "IBM Plex Mono", monospace; color: rgb(28,27,34); }
    .rich-text img { border-radius: 10px; margin: 0 0 16px; }
    `
    const el = document.createElement("style")
    el.setAttribute("data-rich-text", "")
    el.textContent = css
    document.head.appendChild(el)
}

export default function RichText({ html, style, className }: RichTextProps) {
    useMemo(injectStylesOnce, [])
    return (
        <div
            className={`rich-text${className ? ` ${className}` : ""}`}
            style={style}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}
