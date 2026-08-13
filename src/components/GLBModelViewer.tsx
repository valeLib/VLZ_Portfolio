// @google/model-viewer is imported for its side effect: it registers the
// <model-viewer> custom element used below.

import { useEffect, useRef } from "react"
import "@google/model-viewer"

type GLBModelViewerProps = {
    model?: string
    uploadedModel?: string
    enableInteraction?: boolean
    showHandIcon?: boolean
    disableZoom?: boolean
    autoRotate?: boolean
    camH?: number
    camV?: number
    camRadius?: number
    rotX?: number
    rotY?: number
    rotZ?: number
    modelScale?: number
    shadowIntensity?: number
    shadowSoftness?: number
    enableAnimation?: boolean
    animationName?: string
    style?: React.CSSProperties
}

const DEFAULTS: Required<Omit<GLBModelViewerProps, "uploadedModel" | "style" | "animationName">> = {
    model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    enableInteraction: true,
    showHandIcon: false,
    disableZoom: false,
    autoRotate: false,
    camH: 0,
    camV: 75,
    camRadius: 105,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    modelScale: 1,
    shadowIntensity: 1,
    shadowSoftness: 0.5,
    enableAnimation: false,
}

export default function GLBModelViewer(props: GLBModelViewerProps) {
    const p = { ...DEFAULTS, ...props }
    const modelSrc = props.uploadedModel || p.model
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const mv = document.createElement("model-viewer") as any
        mv.setAttribute("src", modelSrc)
        mv.setAttribute("alt", "3D Model")
        mv.setAttribute("touch-action", "pan-y")

        if (p.enableInteraction) mv.setAttribute("camera-controls", "")
        if (p.autoRotate) mv.setAttribute("auto-rotate", "")
        if (p.disableZoom) mv.setAttribute("disable-zoom", "")

        mv.setAttribute("camera-orbit", `${p.camH}deg ${p.camV}deg ${p.camRadius}%`)
        mv.setAttribute("min-camera-orbit", "auto auto 10%")
        mv.setAttribute("max-camera-orbit", "auto auto 300%")
        mv.setAttribute("orientation", `${p.rotX}deg ${p.rotY}deg ${p.rotZ}deg`)
        mv.setAttribute("scale", `${p.modelScale} ${p.modelScale} ${p.modelScale}`)
        mv.setAttribute("shadow-intensity", String(p.shadowIntensity))
        mv.setAttribute("shadow-softness", String(p.shadowSoftness))
        mv.setAttribute("exposure", "1")

        if (p.enableAnimation) {
            mv.setAttribute("autoplay", "")
            if (props.animationName) mv.setAttribute("animation-name", props.animationName)
        }

        if (!p.showHandIcon) mv.setAttribute("interaction-prompt", "none")

        mv.style.width = "100%"
        mv.style.height = "100%"

        container.innerHTML = ""
        container.appendChild(mv)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        modelSrc,
        p.enableInteraction, p.showHandIcon, p.autoRotate, p.disableZoom,
        p.camH, p.camV, p.camRadius, p.rotX, p.rotY, p.rotZ,
        p.modelScale, p.shadowIntensity, p.shadowSoftness,
        p.enableAnimation, props.animationName,
    ])

    return (
        <div style={{ width: "100%", height: "100%", position: "relative", ...props.style }}>
            <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
        </div>
    )
}
