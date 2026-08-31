import { Link } from "react-router-dom"
import { useLayoutEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import SiteNav from "../components/SiteNav"
import SmoothScroll from "../components/SmoothScroll"
import Footer from "../components/Footer"
import RetroButton from "../components/RetroButton"
import NotebookBackground from "../components/NotebookBackground"
import PatternBackground from "../components/PatternBackground"
import PatternDivider from "../components/PatternDivider"
import CheckerDivider from "../components/CheckerDivider"
import SectionTitle from "../components/SectionTitle"
import SectionHeader from "../components/SectionHeader"
import RetroWindow from "../components/RetroWindow"
import TerminalBlock from "../components/TerminalBlock"
import TagCloud from "../components/TagCloud"
import LocationCard from "../components/LocationCard"
import InfoCard from "../components/InfoCard"
import ProjectShowcase from "../components/ProjectShowcase"
import ContactPage from "../components/ContactPage"
import GLBModelViewer from "../components/GLBModelViewer"
import ScrollIndicator from "../components/ScrollIndicator"
import BackToTop from "../components/BackToTop"
import Sticker from "../components/Sticker"
import Appear from "../components/Appear"
import PageEnter from "../components/PageEnter"
import { publicProjects, asset } from "../data/projects"
import { useBreakpoint } from "../hooks/useBreakpoint"
import { pick, useLocale, useLocalePath, useT } from "../lib/i18n"
import type { L10n, Locale } from "../lib/i18n"
import { colors } from "../tokens"

// Featured Work renders the public projects in catalogue order; drafts never
// appear here.

type LTags = { en: string[]; es: string[] }
const tags = (en: string[], es?: string[]): LTags => ({ en, es: es ?? en })

// Work cards are static page content, not part of the project catalogue.
const workCards: { title: L10n; label: L10n; badge: L10n; tags: LTags }[] = [
    {
        title: { en: "Icnovatio", es: "Icnovatio" },
        label: { en: "Frontend & UI Designer", es: "Diseñador de Frontend y de Interfaz de Usuario" },
        badge: { en: "2026–Now", es: "2026–Presente" },
        tags: tags(["React", "Typescript", "Figma"], ["React", "TypeScript", "Figma"]),
    },
    {
        title: { en: "Rehaviour —  Pignus", es: "Rehaviour — Pignus" },
        label: { en: "Unity Dev & Frontend", es: "Desarrollador Unity y Frontend" },
        badge: { en: "2023–Now", es: "2023–presente" },
        tags: tags(
            ["Unity", "C#", "Blender", "HLSL", "VR", "Meta Quest", "Vue.js"],
            ["Unidad", "C#", "Licuadora", "HLSL", "RV", "Meta Quest", "Vue.js"]
        ),
    },
    {
        title: { en: "AmblyopiaVR — Oxford", es: "AmblyopiaVR — Oxford" },
        label: { en: "Unity Dev & Technical Artist", es: "Desarrollador Unity y Artista Técnico" },
        badge: { en: "2022", es: "2022" },
        tags: tags(["Unity", "HLSL", "VR"], ["Unidad", "HLSL", "RV"]),
    },
    {
        title: { en: "NeurospeechAI  — UCL", es: "NeurospeechAI — UCL" },
        label: { en: "Frontend & UI/UX", es: "Frontend y UI/UX" },
        badge: { en: "2023", es: "2023" },
        tags: tags(["React", "TypeScript", "WCAG 2.1"], ["Reaccionar", "TypeScript", "WCAG 2.1"]),
    },
    {
        title: { en: "U. de Chile", es: "U. de Chile" },
        label: { en: "Unity Dev & UI/UX", es: "Desarrollo en Unity y UI/UX" },
        badge: { en: "2020-2021", es: "2020-2021" },
        tags: tags(["Unity", "Blender", "Meta Quest"], ["Unidad", "licuadora", "Meta Quest"]),
    },
    {
        title: { en: "Eye-Search — UCL", es: "Búsqueda ocular — UCL" },
        label: { en: "Frontend & UI/UX", es: "Frontend y UI/UX" },
        badge: { en: "2022", es: "2022" },
        tags: tags(["React", "TypeScript", "Unity WebGL"]),
    },
    {
        title: { en: "Radar— Pulso Escolar", es: "Radar — Pulso Escolar" },
        label: { en: "Full-Stack Developer", es: "Desarrollador Full-Stack" },
        badge: { en: "2019", es: "2019" },
        tags: tags(["Vue.js", "Node.js", "GCP"]),
    },
    {
        title: { en: "Capitalizarme", es: "Capitalizarme" },
        label: { en: "Frontend & UI/UX", es: "Frontend y UI/UX" },
        badge: { en: "2022-2023", es: "2022-2023" },
        tags: tags(["React", "Next.js", "Redux"]),
    },
]

const skillCards = [
    {
        emoji: "🎮", title: { en: "Game & VR", es: "Juegos y RV" }, className: "hs-skill-a", hoverRotate: 1,
        bg: colors.teal, border: colors.gunmetalBlack, titleColor: colors.liberty, paddingV: 16, tagFontSize: 13,
        tags: tags(
            ["Unity 6 (URP)", "C++", "Unreal 5", "C#", "HLSL", "Blender", "Substance Painter", "VR", "Meta Quest"],
            ["Unity 6 (URP)", "C++", "Unreal 5", "C#", "HLSL", "Licuadora", "Substance Painter", "RV", "Meta Quest"]
        ),
        tagBg: "rgb(122, 199, 178)", tagText: "rgb(51, 102, 102)", tagRadius: 6,
    },
    {
        emoji: "💻", title: { en: "Frontend", es: "Frontend" }, className: "hs-skill-b", hoverRotate: -1,
        bg: colors.tangerine, border: colors.gunmetalBlack, titleColor: colors.linen, paddingV: 16, tagFontSize: 11,
        tags: tags(["React", "TypeScript", "Next.js", "Vue.js", "Vite", "GSAP", "Three.js", "R3F", "Lenis", "Lottie", "Framer Motion", "Framer"]),
        tagBg: colors.babyPink, tagText: "rgb(135, 104, 109)", tagRadius: 6,
    },
    {
        emoji: "✨", title: { en: "Shared", es: "Compartido" }, className: "hs-skill-c", hoverRotate: 1,
        bg: colors.liberty, border: colors.gunmetalBlack, titleColor: colors.linen, paddingV: 30, tagFontSize: 13,
        tags: tags(
            ["Git", "Node.js", "Python", "MongoDB", "PostgreSQL", "Figma", "Krita", "Affinity"],
            ["Git", "Node.js", "Python", "MongoDB", "PostgreSQL", "Figma", "Krita", "Afinidad"]
        ),
        tagBg: "rgb(114, 121, 191)", tagText: colors.surface, tagRadius: 8,
    },
]

// The PROFILE.EXE terminal keeps its code-styled EN copy in both locales.
const whoamiRows = [
    { label: "Name:", value: "Valentina Liberona", valueColor: colors.tangerine },
    { label: "Role:", value: "Unity Dev + Frontend Eng", valueColor: colors.teal },
    { label: "Base:", value: "Santiago, Chile", valueColor: colors.saffron },
    { label: "Status:", value: "Available", valueColor: colors.straw, showDot: true, dotColor: colors.straw },
]

const whoamiTags = ["C#", "C++", "HLSL", "Unity", "Unreal Engine", "React", "Typescript", "Vue.js", "Python", "Figma"]

const checkerStrip = (
    <div style={{ width: 168, height: 56 }}>
        <PatternBackground
            patternType="checker"
            checkerColor2={colors.background}
            checkerSize={28}
            patternColor={colors.tangerine}
            bgColor="rgb(240, 235, 224)"
        />
    </div>
)

// One hero tag; the three settle in one after another.
function HeroTag({ rotate, delay, children }: { rotate: number; delay: number; children: React.ReactNode }) {
    const reduce = useReducedMotion()
    return (
        <motion.span
            style={{ display: "inline-flex", rotate }}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.25, delay }}
        >
            {children}
        </motion.span>
    )
}

// Caveat eyebrow + big Fredoka heading used by every section.
function SectionHead({
    title,
    titleColor,
    dotColor,
    header,
    headerColor,
}: {
    title: string
    titleColor: string
    dotColor?: string
    header: string
    headerColor: string
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Appear trigger="inView" threshold={0.2} transition="tween 0.44,0,0.56,1 0.45s 0s" style={{ maxWidth: 615 }}>
                <SectionTitle
                    title={title}
                    layout="inline"
                    showDot
                    dotStyle="shadow"
                    dotColor={dotColor ?? titleColor}
                    dotBorderColor={colors.gunmetalBlack}
                    dotBorderWidth={2}
                    dotShadowColor={colors.gunmetalBlack}
                    dotShadowX={1.5}
                    dotShadowY={1}
                    dotGap={10}
                    fontFamily="caveat"
                    fontSize={20}
                    fontWeight={400}
                    titleColor={titleColor}
                    showBorder
                    borderColor="rgb(54, 49, 59)"
                    borderWidth={2}
                    borderStyle="dashed"
                    paddingBottom={1}
                />
            </Appear>
            <Appear trigger="scroll" threshold={0.2} transition="tween 0.44,0,0.56,1 0.5s 0.15s">
                <SectionHeader
                    showDot={false}
                    showLabel={false}
                    title={header}
                    titleColor={headerColor}
                    titleSize={34}
                    intro=""
                />
            </Appear>
        </div>
    )
}

// PROFILE.EXE + LOCATION.EXE, shared by the desktop reveal stage and the
// in-section phone layout. Tablet/phone use the compact terminal variant and a
// counter-rotated profile window (net 0°).
function AboutWindows({ compact }: { compact: boolean }) {
    return (
        <>
            <div className="hs-win hs-win-profile" style={compact ? { transform: "none" } : undefined}>
                <Appear trigger="inView" threshold={0.25} transition="spring-duration 0.55s 0.2 0s">
                    <RetroWindow
                        title="PROFILE.EXE"
                        titleBarColor={colors.liberty}
                        titleColor={colors.surface}
                        bodyColor="#ffffff"
                        bodyPadding={compact ? 2 : 0}
                        borderRadius={8}
                        dotRed={colors.tangerine}
                        dotYellow={colors.saffron}
                        dotGreen={colors.straw}
                        contentMode="frame"
                    >
                        <div className="hs-whoami">
                            <TerminalBlock
                                topCommands={["whoami"]}
                                rows={whoamiRows}
                                bottomCommands={["skills --list"]}
                                commandSize={compact ? 15 : 16}
                                commandTextColor={colors.liberty}
                                promptColor={colors.liberty}
                                rowSize={compact ? 13 : 14}
                                labelColor={colors.gunmetalBlack}
                                labelValueGap={6}
                                rowGap={compact ? 3 : 4}
                                sectionGap={compact ? 8 : 10}
                            />
                            <TagCloud
                                inputMode="array"
                                tagsArray={whoamiTags}
                                colorScheme="portfolio"
                                fontSize={11}
                                paddingH={10}
                                paddingV={5}
                                borderRadius={6}
                                borderWidth={1.5}
                                shadowX={2}
                                shadowY={2}
                                gap={8}
                                rowGap={8}
                            />
                        </div>
                    </RetroWindow>
                </Appear>
            </div>
            <div className="hs-win hs-win-loc">
                <Appear trigger="inView" threshold={0.25} transition="spring-duration 0.55s 0.2 0.15s">
                    <RetroWindow
                        title="LOCATION.EXE"
                        titleBarColor={colors.teal}
                        titleColor="#ffffff"
                        bodyColor={colors.surface}
                        bodyPadding={0}
                        borderRadius={8}
                        dotRed={colors.tangerine}
                        dotYellow={colors.saffron}
                        dotGreen={colors.saffron}
                        contentMode="frame"
                    >
                        <div className="hs-loc">
                            <LocationCard
                                iconEmoji="🗺️"
                                iconSize={40}
                                title="Santiago, Chile"
                                subtitle="GMT-3 · Remote friendly"
                                accentLine="Open to relocation"
                                accentSuffix="✓"
                                bgColor="rgba(255, 255, 255, 0)"
                                padding={6}
                            />
                        </div>
                    </RetroWindow>
                </Appear>
            </div>
        </>
    )
}

export default function Home() {
    const bp = useBreakpoint()
    const phone = bp === "phone"
    const tablet = bp === "tablet"

    // The grid sizes its cards by how many projects there are; four or more
    // share one wrapping layout.
    const projectCount = publicProjects.length >= 4 ? "many" : String(publicProjects.length)

    // The footer band rises over the last pinned section, so that section has to
    // reserve the height the band actually occupies. Measured rather than
    // guessed: the band reflows with the breakpoint and the locale's text.
    const footerRef = useRef<HTMLDivElement>(null)
    const [footerHeight, setFooterHeight] = useState(0)
    // Read once before the first paint, then keep it in step. The observer alone
    // would leave the reservation at zero until it first delivers, which is long
    // enough to show the footer sitting on top of the contact card.
    useLayoutEffect(() => {
        const el = footerRef.current
        if (!el) return
        setFooterHeight(el.offsetHeight)
        const observer = new ResizeObserver(([entry]) => {
            setFooterHeight(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height)
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    // Contact may run taller than the viewport (see its CSS). While pinned, that
    // excess is scrolled through before the footer can show, so the tail hands
    // it back — otherwise short laptop viewports get a longer dead stretch than
    // tall ones. The footer height feeds Contact's padding, so the section is
    // re-measured once that reservation has been laid out rather than waiting
    // on the observer to notice.
    const contactRef = useRef<HTMLElement>(null)
    const [contactExcess, setContactExcess] = useState(0)
    useLayoutEffect(() => {
        const el = contactRef.current
        if (!el) return
        const update = () => setContactExcess(Math.max(0, el.offsetHeight - window.innerHeight))
        update()
        const observer = new ResizeObserver(update)
        observer.observe(el)
        window.addEventListener("resize", update)
        return () => {
            observer.disconnect()
            window.removeEventListener("resize", update)
        }
    }, [footerHeight])
    const locale = useLocale()
    const t = useT()
    const lp = useLocalePath()
    const LT = (v: LTags) => (locale === "es" ? v.es : v.en)


    const statSize = phone ? 26 : tablet ? 28 : 32
    const statPadH = phone ? 10 : tablet ? 12 : 16
    const statPadV = phone || tablet ? 4 : 10
    const btnFontSize = tablet ? 13 : 14
    const btnPadH = tablet ? 12 : 16
    const btnPadV = tablet ? 8 : 10
    const badgePadV = phone || tablet ? 4 : 6
    const badgePadH = phone ? 6 : 20

    const statHover = (rotate: number) => ({
        whileHover: { y: -1, scale: 1.1, rotate },
        transition: { type: "spring" as const, duration: 0.4, bounce: 0.2 },
    })

    return (
        <div
            className="home-root"
            style={{
                width: "100%",
                background: colors.background,
                ["--footer-h" as string]: `${footerHeight}px`,
                ["--contact-excess" as string]: `${contactExcess}px`,
            }}
        >
            <SmoothScroll />
            <SiteNav />

            <PageEnter className="hs-wrap">
                <main className="hs-stack">
                    {/* ── HERO ─────────────────────────────────────────────── */}
                    <section id="hero" className="hs hs-hero" style={{ zIndex: 1 }}>
                        <div className="hs-bg hs-hero-bg">
                            <NotebookBackground
                                paperColor="rgb(241, 238, 232)"
                                usePaperGradient
                                paperGradientColors={["rgb(255, 255, 252)", "rgb(245, 238, 230)"]}
                                paperGradientAngle={135}
                                gridType="grid"
                                gridColor="rgb(252, 214, 219)"
                                gridOpacity={0.6}
                                gridSize={28}
                                gridWeight={3}
                            />
                        </div>

                        {/* Reading column. The scroll cue lives here rather than
                            with the decorations because the phone layout places it
                            in flow between the copy and the cat. */}
                        <div className="hs-hero-inner">
                            <div className="hs-hero-title">
                                <div className="hs-title-box">
                                    <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1s 0.2s">
                                        <div className="hs-tags">
                                            <HeroTag rotate={-1} delay={0.25}>
                                                <RetroButton variant="primary" label={t("statUnityDev")} bgColor={colors.teal} textColor={colors.primaryTxt} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={badgePadH} paddingV={badgePadV} />
                                            </HeroTag>
                                            <HeroTag rotate={1} delay={0.35}>
                                                <RetroButton variant="primary" label={t("statCreativeFrontend")} bgColor={colors.lilac} textColor={colors.primaryTxt} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={badgePadH} paddingV={badgePadV} />
                                            </HeroTag>
                                            <HeroTag rotate={-1} delay={0.45}>
                                                <RetroButton variant="primary" label="Chile 🌍" bgColor={colors.tangerine} textColor={colors.surface} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={badgePadH} paddingV={badgePadV} />
                                            </HeroTag>
                                        </div>
                                    </Appear>

                                    {/* "My" overlaps the top-left of "Portfolio". */}
                                    <h1 className="hs-wordmark">
                                        <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1s 0.2s" className="hs-portfolio-wrap">
                                            <span className="hs-portfolio">{t("heroPortfolio")}</span>
                                        </Appear>
                                        <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1s 0.2s" className="hs-my-wrap">
                                            <span className="hs-my">{t("heroMy")}</span>
                                        </Appear>
                                    </h1>
                                </div>

                                <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1s 0.6s">
                                    <div className="hs-intro-row">
                                        <p className="hs-intro">{t("heroTagline")}</p>
                                    </div>
                                </Appear>

                                <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1s 0.8s">
                                    <div className="hs-cta-block">
                                        <div className="hs-btn-row">
                                            <RetroButton variant="primary" label={t("heroSeeWork")} href="#projects" bgColor={colors.lilac} textColor={colors.gunmetalBlack} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" fontSize={btnFontSize} fontWeight={700} paddingH={btnPadH} paddingV={btnPadV} />
                                            <RetroButton variant="primary" label={t("heroGetInTouch")} href="#projects" bgColor={colors.linen} textColor={colors.primaryTxt} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" fontSize={btnFontSize} fontWeight={700} paddingH={btnPadH} paddingV={btnPadV} />
                                        </div>
                                        <div className="hs-stat-row">
                                            <motion.div {...statHover(2)}>
                                                <RetroButton variant="stat" statValue="7+" statLabel={t("statYearsXP")} statValueSize={statSize} bgColor={colors.babyPink} textColor={colors.gunmetalBlack} statLabelColor={colors.gunmetalBlack} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={statPadH} paddingV={statPadV} />
                                            </motion.div>
                                            <motion.div {...statHover(-2)}>
                                                <RetroButton variant="stat" statValue="4+" statLabel={t("statFields")} statValueSize={statSize} bgColor={colors.lilac} textColor={colors.gunmetalBlack} statLabelColor={colors.gunmetalBlack} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={statPadH} paddingV={statPadV} />
                                            </motion.div>
                                            <motion.div {...statHover(-2)}>
                                                <RetroButton variant="stat" statValue="20+" statLabel={t("statSkills")} statValueSize={statSize} bgColor={colors.liberty} textColor={colors.gunmetalBlack} statLabelColor={colors.gunmetalBlack} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={statPadH} paddingV={statPadV} />
                                            </motion.div>
                                        </div>
                                    </div>
                                </Appear>
                            </div>

                            <div className="hs-hero-cat">
                                {/* The top strip renders immediately; only the spacer
                                    below it carries the appear delay. */}
                                <div className="hs-strip">{checkerStrip}</div>
                                <div className="hs-shelf" aria-hidden />
                                <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1.5s 0.4s" className="hs-glb-row">
                                    <div className="hs-glb">
                                        <GLBModelViewer model={asset("cat.glb")} enableInteraction disableZoom camH={15} camV={85} camRadius={90} enableAnimation />
                                    </div>
                                </Appear>
                                <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1.5s 0.6s" className="hs-strip-row">
                                    {checkerStrip}
                                </Appear>
                            </div>

                            <ScrollIndicator targetId="about" className="hs-scroll-ind" />
                        </div>

                        {/* Decorations sit in their own layer, placed against the
                            same column as the content so they keep their relation
                            to it however wide the sheet runs. */}
                        <div className="hs-hero-deco">
                            <Sticker className="hs-sticker-drag" image={asset("sticker.png")} tilt={0.4} elevation={0.2} draggable />
                            <Sticker className="hs-sticker-peel" image={asset("sticker.png")} peel />
                        </div>
                    </section>

                    {/* ── ABOUT — stage 1: text on the left ────────────────── */}
                    <section id="about" className="hs hs-about" style={{ zIndex: 2 }}>
                        <div className="hs-bg hs-about-bg">
                            <NotebookBackground paperColor={colors.liberty} gridType="grid" gridColor={colors.lilac} gridOpacity={0.05} gridSize={28} gridWeight={4} />
                        </div>
                        <div className="hs-divider"><CheckerDivider color1="rgb(114, 121, 191)" color2={colors.lilac} cellSize={12} rows={2} /></div>
                        <div className="hs-about-inner">
                            <div className="hs-about-row">
                                <div className="hs-about-text">
                                    <SectionTitle title={t("aboutEyebrow")} layout="inline" showDot dotStyle="shadow" dotColor={colors.tangerine} dotBorderColor={colors.gunmetalBlack} dotBorderWidth={2} dotShadowColor={colors.gunmetalBlack} dotShadowX={1.5} dotShadowY={1} dotGap={10} fontFamily="caveat" fontSize={20} fontWeight={400} titleColor={colors.tangerine} showBorder borderColor="rgb(54, 49, 59)" borderWidth={2} borderStyle="dashed" paddingBottom={1} />
                                    <Appear trigger="inView" transition="spring-duration 0.5s 0.2 0.2s">
                                        <SectionHeader showDot={false} showLabel={false} title={t("aboutTitle")} titleColor={colors.linen} titleSize={34} intro="" />
                                    </Appear>
                                    <Appear trigger="inView" transition="spring-duration 0.5s 0.2 0.2s">
                                        <div
                                            className="hs-body"
                                            style={{ color: colors.linen }}
                                            dangerouslySetInnerHTML={{ __html: pick(locale, {
                                                en: "I’m a game developer based in Chile, working remotely, focused on building optimized systems that are both performant and visually clear. My work spans Unity and Unreal, where I design gameplay, AI behaviors, and scalable architectures. I also use frontend tools when needed to support interfaces and interactive systems.",
                                                es: "Soy un desarrollador de videojuegos radicado en Chile, trabajo de forma remota y me enfoco en construir sistemas optimizados que sean de alto rendimiento y visualmente claros. Mi trabajo abarca Unity y Unreal, donde diseño jugabilidad, comportamientos de IA y arquitecturas escalables. También utilizo herramientas de frontend cuando es necesario para dar soporte a interfaces y sistemas interactivos.",
                                            }) }}
                                        />
                                    </Appear>
                                </div>
                                {/* On desktop and tablet this stays empty — the windows
                                    arrive with the next sticky stage. */}
                                <div className="hs-about-side" aria-hidden />
                            </div>
                            {/* Phone shows the windows inline, below the text. */}
                            <div className="hs-about-winmobile">
                                <AboutWindows compact />
                            </div>
                        </div>
                    </section>

                    {/* ── ABOUT — stage 2: the window column rises over stage 1.
                        Transparent 90vh sticky layer; its left side is empty so
                        the pinned text stays visible behind it. ─────────────── */}
                    <section className="hs hs-about2 hs-desktop-only" style={{ zIndex: 3 }}>
                        <div className="hs-about2-inner">
                            <div className="hs-about2-spacer" aria-hidden />
                            <div className="hs-about2-col">
                                <AboutWindows compact={tablet} />
                            </div>
                        </div>
                    </section>

                    {/* Empty sticky stage: holds the finished About composition
                        for a beat before Projects rises. */}
                    <section className="hs hs-spacer hs-desktop-only" style={{ zIndex: 3 }} aria-hidden />

                    {/* ── PROJECTS ─────────────────────────────────────────── */}
                    <section id="projects" className="hs hs-projects" style={{ zIndex: 4 }}>
                        <div className="hs-bg">
                            <NotebookBackground paperColor={colors.background} gridType="grid" gridColor={colors.liberty} gridOpacity={0.15} gridSize={34} gridWeight={2.6} />
                        </div>
                        <div className="hs-divider"><CheckerDivider color1={colors.tangerine} color2={tablet ? colors.libertyHover : colors.linen} cellSize={12} rows={2} /></div>
                        <div className="hs-proj-inner">
                            <SectionHead title={t("projectsEyebrow")} titleColor={colors.liberty} header={t("projectsTitle")} headerColor={colors.gunmetalBlack} />
                            <div className="hs-project-grid" data-count={projectCount}>
                                {publicProjects.map((p, i) => (
                                    <Appear key={p.slug} trigger="inView" threshold={0.2} transition={`spring-duration 0.7s 0.2 ${0.1 + i * 0.1}s`} className="hs-proj-item">
                                        <Link to={lp(`/projects/${p.slug}`)} className="hs-proj-cell">
                                            <ProjectShowcase
                                                itemCount={1}
                                                item1MediaType="image"
                                                item1Image={p.cover ?? ""}
                                                item1UrlBar={pick(locale, p.title)}
                                                item1Title={pick(locale, p.title)}
                                                item1Tags={pick(locale, p.tags)}
                                                item1ShowButton={false}
                                                showHeader={false}
                                                showCounter
                                                showArrows
                                                showDots
                                                showSubtitle={false}
                                                showTags={!phone}
                                                imageFit="contain"
                                                imageBgColor="#f5eee6"
                                                frameBorderColor={colors.gunmetalBlack}
                                                dotRed={colors.tangerine}
                                                dotYellow={colors.saffron}
                                                dotGreen={colors.straw}
                                                urlBarBg={colors.linen}
                                                urlBarTextColor="rgb(107, 101, 128)"
                                            />
                                        </Link>
                                    </Appear>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── WORK / EXPERIENCE ────────────────────────────────── */}
                    <section id="work" className="hs hs-work" style={{ zIndex: 4 }}>
                        <div className="hs-bg">
                            <NotebookBackground paperColor="rgb(100, 108, 185)" gridType="dot" gridColor={colors.liberty} gridOpacity={1} gridSize={34} gridWeight={2.6} />
                        </div>
                        <div className="hs-work-divider">
                            <PatternDivider pattern="Scallop" tile={phone ? 26 : 30} color={colors.linen} background="rgba(0,0,0,0)" flip />
                        </div>
                        <div className="hs-work-content">
                            <SectionHead title={t("workEyebrow")} titleColor={colors.countryWhite} dotColor={colors.tangerine} header={t("workTitle")} headerColor={colors.primaryTxt} />
                            <div className="hs-work-grid">
                                {workCards.map((w, i) => (
                                    <Appear key={w.title.en} trigger="scroll" threshold={0.2} transition={`spring-duration 0.8s 0.2 ${0.1 + i * 0.06}s`}>
                                        <motion.div whileHover={{ scale: 1.02, rotate: 1 }} transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}>
                                            <InfoCard
                                                device={phone ? "mobile" : "desktop"}
                                                label={pick(locale, w.label)}
                                                labelPosition="below"
                                                labelColor={colors.liberty}
                                                title={pick(locale, w.title)}
                                                titleSize={23}
                                                showBadge
                                                badgeText={pick(locale, w.badge)}
                                                badgeBg="rgb(237, 235, 231)"
                                                badgeText2={colors.gunmetalBlack}
                                                badgeBorderColor={colors.gunmetalBlack}
                                                badgeFontSize={tablet ? 12 : 13}
                                                badgePaddingH={tablet ? 8 : 12}
                                                badgePaddingV={tablet ? 5 : 6}
                                                bodyMode="tags"
                                                tags={LT(w.tags)}
                                                tagBg={colors.saffron}
                                                tagText={colors.gunmetalBlack}
                                                tagBorder={colors.gunmetalBlack}
                                                tagBorderWidth={2}
                                                tagBorderRadius={6}
                                                tagFontSize={13}
                                                tagPaddingH={10}
                                                tagPaddingV={1}
                                                tagGap={4}
                                                bgColor={colors.surface}
                                                borderColor={colors.gunmetalBlack}
                                                borderWidth={1}
                                                titleColor={colors.gunmetalBlack}
                                                showShadow
                                                shadowColor={colors.gunmetalBlack}
                                                shadowX={3}
                                                shadowY={3}
                                                paddingH={34}
                                                paddingV={16}
                                                borderRadius={14}
                                            />
                                        </motion.div>
                                    </Appear>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── SKILLS ───────────────────────────────────────────── */}
                    <section id="skills" className="hs hs-skills" style={{ zIndex: 5 }}>
                        <div className="hs-bg">
                            <NotebookBackground paperColor={colors.background} gridType="ruled" gridColor={colors.liberty} gridOpacity={0.15} gridSize={34} gridWeight={2.6} />
                        </div>
                        <div className="hs-divider"><CheckerDivider color1={colors.liberty} color2={colors.linen} cellSize={12} rows={2} /></div>
                        <div className="hs-skills-body">
                            <SectionHead title={t("skillsEyebrow")} titleColor={colors.tangerine} header={t("skillsTitle")} headerColor={colors.gunmetalBlack} />
                            {/* Desktop staggers the three cards diagonally with
                                absolute anchors; tablet and phone stack them. */}
                            <div className="hs-skill-stage">
                                {skillCards.map((c, i) => (
                                    <div key={c.title.en} className={`hs-skill-card ${c.className}`}>
                                        <Appear trigger="scroll" threshold={0.2} transition={`spring-duration 0.8s 0.2 ${0.1 + i * 0.15}s`}>
                                            <motion.div whileHover={{ scale: 1.02, rotate: c.hoverRotate }} transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}>
                                                <InfoCard
                                                    device={phone ? "mobile" : "desktop"}
                                                    iconType="emoji"
                                                    iconEmoji={c.emoji}
                                                    iconSize={22}
                                                    label=""
                                                    title={pick(locale, c.title)}
                                                    titleSize={22}
                                                    showBadge={false}
                                                    bodyMode="tags"
                                                    tags={LT(c.tags)}
                                                    tagBg={c.tagBg}
                                                    tagText={c.tagText}
                                                    tagBorder="rgba(36, 38, 46, 0.28)"
                                                    tagBorderWidth={1.5}
                                                    tagBorderRadius={c.tagRadius}
                                                    tagFontSize={c.tagFontSize}
                                                    tagPaddingH={8}
                                                    tagPaddingV={6}
                                                    tagGap={5}
                                                    bgColor={c.bg}
                                                    borderColor={c.border}
                                                    borderWidth={2}
                                                    titleColor={c.titleColor}
                                                    showShadow
                                                    shadowColor={colors.gunmetalBlack}
                                                    shadowX={4}
                                                    shadowY={4}
                                                    paddingH={24}
                                                    paddingV={c.paddingV}
                                                    borderRadius={14}
                                                />
                                            </motion.div>
                                        </Appear>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── CONTACT ──────────────────────────────────────────── */}
                    <section id="contact" ref={contactRef} className="hs hs-contact" style={{ zIndex: 10 }}>
                        <div className="hs-bg">
                            <NotebookBackground paperColor={colors.background} gridType="dot" gridColor={colors.liberty} gridOpacity={0.15} gridSize={36} gridWeight={2.4} />
                        </div>
                        <div className="hs-divider"><CheckerDivider color1={colors.tangerine} color2={colors.linen} cellSize={12} rows={2} /></div>
                        <div className="hs-contact-body">
                            <div className="hs-contact-inner">
                                <ContactPage
                                    eyebrow={t("heroGetInTouch")}
                                    headline={t("contactTitle")}
                                    intro={t("contactBody")}
                                    email="vliberonazuniga@gmail.com"
                                    accent={colors.tangerine}
                                    background="rgba(242, 239, 233, 0)"
                                    cardColor={colors.surface}
                                    textColor={colors.primaryTxt}
                                    mutedColor={colors.secondaryTxt}
                                    details={contactDetails(locale)}
                                    hardShadow
                                    shadowColor={colors.primaryTxt}
                                    radius={20}
                                    padding={64}
                                    gap={40}
                                    mobilePadding={28}
                                    mobileGap={48}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Scroll room while Contact stays pinned: the footer's own
                        height plus a short lead before it starts to rise. */}
                    <div className="hs-tail" aria-hidden />
                </main>

                <div className="hs-backtotop">
                    <BackToTop fixed={false} alwaysShow fill={colors.liberty} hoverFill={colors.tangerine} />
                </div>

                {/* Above the section stack, so it rises over pinned Contact from
                    the end of the document. */}
                <div className="hs-footer">
                    <div className="hs-footer-bar" ref={footerRef}>
                    <Footer
                        background={colors.liberty}
                        mutedColor={colors.countryWhite}
                        introColor={colors.countryWhite}
                        linksTitleColor={colors.tangerine}
                        socialColor={colors.countryWhite}
                        socialHoverColor={colors.tangerine}
                        topBorder
                        borderColor={colors.primaryTxt}
                        radius={0}
                        padding={phone ? 21 : 48}
                        gap={phone ? 20 : 40}
                    />
                    </div>
                </div>
            </PageEnter>

            <style>{`
                /* Layered sticky stack (desktop + tablet): every section pins at
                   the top of the viewport and the next one rises over it, in
                   z-index order. overflow: clip does not create a scroll
                   container, so position: sticky keeps working inside. */
                .hs-wrap { position: relative; overflow: clip; }
                .hs-stack { position: relative; z-index: 1; width: 100%; }
                .hs {
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    width: 100%;
                    box-sizing: border-box;
                    overflow: hidden;
                    background: ${colors.background};
                    display: flex;
                    flex-direction: column;
                }
                .hs-bg { position: absolute; inset: 0; z-index: 0; }
                /* The sheet is an absolutely positioned layer, so it would paint
                   over an in-flow divider; the dividers get their own layer. */
                .hs-divider { position: relative; z-index: 1; width: 100%; flex-shrink: 0; }
                .hs-spacer, .hs-about2 { background: transparent; }
                .hs-spacer { pointer-events: none; }
                /* The footer bar rises from the document's end, so the bar's own
                   height is exactly the scroll it takes to reveal; the rest is
                   the lead between Contact settling and the reveal beginning.
                   Anything more is dead scroll that reads as the page having
                   ended. */
                .hs-tail {
                    height: max(0px, calc(var(--footer-h, 0px) + 160px - var(--contact-excess, 0px)));
                    pointer-events: none;
                }

                /* Hero — two columns: title (1fr) + cat (38.42%) */
                .hs-hero-inner {
                    position: relative; z-index: 1;
                    flex: 1 1 auto; min-height: 0; width: 100%;
                    display: flex; flex-direction: row; gap: 40px;
                    padding: 0 40px 0 80px; box-sizing: border-box;
                }
                .hs-hero-deco { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
                .hs-hero-deco > * { pointer-events: auto; }
                .hs-hero-bg { inset: 0 0 -24px 0; }
                .hs-hero-title {
                    position: relative; z-index: 1;
                    flex: 1 1 0; min-width: 0;
                    padding-top: 60px;
                    display: flex; flex-direction: column; justify-content: center;
                }
                .hs-title-box { position: relative; width: 618px; max-width: 100%; height: 375px; padding-top: 42px; box-sizing: border-box; }
                .hs-tags { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; width: 72%; min-width: 320px; }
                .hs-wordmark { position: absolute; inset: 0; margin: 0; font-weight: 400; }
                .hs-portfolio-wrap { position: absolute; bottom: 34px; left: 0; right: 0; display: flex; justify-content: center; }
                .hs-my-wrap { position: absolute; left: 104px; bottom: 132px; z-index: 2; }
                .hs-portfolio {
                    font-family: "Leckerli One", cursive; font-size: 140px; line-height: 1em;
                    letter-spacing: -0.04em; color: ${colors.liberty}; white-space: nowrap;
                }
                .hs-my {
                    font-family: "Leckerli One", cursive; font-size: 86px; line-height: 1em;
                    letter-spacing: -0.04em; color: ${colors.tangerine};
                }
                .hs-intro-row { padding: 0 0 0 32px; width: 439px; max-width: 100%; box-sizing: border-box; }
                .hs-intro {
                    font-family: "Anonymous Pro", monospace; font-size: 14px; line-height: 1.75em;
                    letter-spacing: -0.02em; color: ${colors.secondaryTxt}; margin: 0;
                }
                .hs-cta-block { display: flex; flex-direction: column; }
                .hs-btn-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; height: 65px; padding: 0 6px; box-sizing: border-box; }
                .hs-stat-row { display: flex; gap: 15px; align-items: center; flex-wrap: wrap; height: 109px; padding: 0 6px; box-sizing: border-box; }

                .hs-hero-cat {
                    position: relative; z-index: 1;
                    flex: 0 0 38.42%; display: flex; flex-direction: column;
                    align-items: center; gap: 10px; padding-top: 80px;
                }
                .hs-strip { display: flex; }
                .hs-shelf { width: 100%; height: 71px; }
                .hs-glb-row { width: 100%; display: flex; justify-content: center; }
                .hs-glb { width: 348px; max-width: 100%; height: 348px; }
                .hs-strip-row { width: 100%; height: 85px; display: flex; justify-content: flex-end; align-items: center; padding: 16px 12px 0 0; box-sizing: border-box; }
                .hs-scroll-ind { position: absolute; bottom: 30px; left: 54.58%; transform: translateX(-50%); z-index: 8; }
                .hs-sticker-drag { position: absolute; top: 156px; left: 63%; width: 129px; height: 79px; z-index: 4; }
                .hs-sticker-peel { position: absolute; bottom: 81px; left: 81.333%; width: 150px; height: 166px; transform: rotate(-1deg); }

                /* About stage 1 — text in the left 36.25%, right side empty */
                .hs-about-inner { position: relative; z-index: 1; margin-top: 40px; padding: 20px 80px 0; }
                .hs-about-row { display: flex; }
                .hs-about-text { width: 36.25%; padding-top: 20px; display: flex; flex-direction: column; gap: 10px; }
                .hs-about-side { flex: 1; }
                .hs-body {
                    font-family: "Anonymous Pro", monospace; font-size: 14px;
                    line-height: 1.75em; letter-spacing: -0.02em; margin: 0;
                }

                /* About stage 2 — transparent overlay carrying the windows */
                .hs-about2 { height: 90vh; }
                .hs-about2-inner { display: flex; padding: 80px 80px 0; height: 100%; box-sizing: border-box; }
                .hs-about2-spacer { width: 36.25%; }
                .hs-about2-col {
                    flex: 1; min-width: 0;
                    display: flex; flex-direction: column; justify-content: center; align-items: center;
                    gap: 20px; padding-top: 20px;
                }
                .hs-win { width: 80%; }
                .hs-win-profile { transform: rotate(1deg); }
                .hs-win-loc { transform: rotate(-1deg); }
                .hs-win > * { width: 95%; margin: 0 auto; }
                .hs-whoami { display: flex; flex-direction: column; gap: 18px; padding: 10px 7px 10px 27px; }
                .hs-loc { padding: 0 42px; }
                .hs-about-winmobile { display: none; }

                /* Projects */
                .hs-proj-inner {
                    position: relative; z-index: 1;
                    width: 86.667%; margin: 0 auto; padding-top: 56px;
                    display: flex; flex-direction: column; gap: 10px;
                }
                /* The row is shared between the cards that exist, so each card
                   is as large as the count allows: one is a feature, two a pair,
                   three share the row, four or more wrap into a grid. The cap
                   keeps a lone card from becoming a banner, and keeps every card
                   short enough to sit inside the 100vh sheet under the heading
                   (a card is 3:4 of its width plus its browser chrome). */
                .hs-project-grid {
                    --card-max: min(560px, calc((100vh - 430px) / 0.75));
                    display: grid; justify-content: center; align-items: start;
                    gap: 32px; margin-top: 40px;
                    /* Four fit one row of the reading column; a 100vh sheet has no
                       room for a second row on a short viewport. */
                    grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
                }
                .hs-project-grid[data-count="1"] { grid-template-columns: minmax(0, var(--card-max)); }
                .hs-project-grid[data-count="2"] { grid-template-columns: repeat(2, minmax(0, var(--card-max))); }
                .hs-project-grid[data-count="3"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                .hs-proj-item { min-width: 0; }
                /* Hover lifts the whole card and lets a soft shadow follow its
                   silhouette (the frame itself does not clip, so the thumbnail
                   is not scaled). */
                .hs-proj-cell { text-decoration: none; display: block; width: 100%; transition: transform .25s ease, filter .25s ease; }
                .hs-proj-cell:hover { transform: translateY(-4px); filter: drop-shadow(0 10px 14px rgba(26, 21, 32, 0.14)); }

                /* Work — violet dot-grid paper behind the cards */
                .hs-work-divider { position: relative; z-index: 6; width: 100%; height: 3%; min-height: 24px; }
                .hs-work-content {
                    position: relative; z-index: 2; flex: 1; min-height: 0;
                    padding: 70px 80px 0; box-sizing: border-box;
                    display: flex; flex-direction: column; gap: 10px;
                }
                .hs-work-grid {
                    display: flex; flex-wrap: wrap; gap: 14px 80px;
                    align-items: center; padding: 8px 0 10px 42px; width: 99%;
                }
                .hs-work-grid > * { width: 40%; }

                /* Skills — desktop cascades the cards along a diagonal */
                .hs-skills-body {
                    position: relative; z-index: 1; flex: 1; min-height: 0;
                    padding: 100px 80px 0; box-sizing: border-box;
                    display: flex; flex-direction: column; gap: 10px;
                }
                /* Desktop anchors the three cards on a diagonal, so the stage
                   needs a fixed height. Every other layout stacks them and must
                   size to content, or the later cards get flattened to nothing. */
                .hs-skill-stage { position: relative; flex: 0 0 auto; height: 332px; }
                .hs-skill-card { position: absolute; width: 31.5%; transform: translateY(-50%); }
                .hs-skill-a { left: 1.44%; top: 30.1%; }
                .hs-skill-b { left: 34.23%; top: 50%; }
                .hs-skill-c { left: 67.12%; top: 69.37%; }

                /* Contact. The last pinned section reserves the footer's height
                   below its content, so on a short viewport the two together can
                   exceed 100vh; it is allowed to grow so the card is never cut
                   by the section box or covered by the bar. As the last sticky
                   section it simply slides up by the excess before the end. */
                .hs-contact { height: auto; min-height: 100vh; }
                .hs-contact-body {
                    position: relative; z-index: 1; flex: 1; min-height: 0;
                    /* Contact is the section the footer rises over, so it reserves
                       the bar's measured height plus a little air above it. */
                    padding: 80px 80px calc(var(--footer-h, 0px) + 24px); box-sizing: border-box;
                    display: flex; flex-direction: column; justify-content: center;
                }
                .hs-contact-inner { padding-top: 20px; }

                /* Placed off the measured footer bar, not the document end, so it
                   keeps its distance from the bar whatever height the bar takes. */
                .hs-backtotop { position: absolute; right: 24px; bottom: calc(var(--footer-h, 0px) + 72px); z-index: 9; }
                .hs-footer { position: absolute; left: 0; right: 0; bottom: 0; z-index: 9; }
                .hs-footer-bar { width: 100%; }

                /* ── Large desktop (>1200) ─────────────────────────────────────
                   Three widths, from the outside in: the section — and with it
                   the paper and the checker dividers — runs edge to edge, so
                   there are no solid gutters for the sheet to end against; the
                   decoration layer and the reading column are centred containers
                   inside it. The column itself is --content-w, defined once in
                   index.css and shared with the navigation bar.
                   This block must stay below the base rules: it overrides them at
                   equal specificity, so it wins only by coming later. */
                @media (min-width: 1200.02px) {
                    .hs-hero-inner,
                    .hs-hero-deco,
                    .hs-about-inner,
                    .hs-about2-inner,
                    .hs-work-content,
                    .hs-skills-body,
                    .hs-contact-body {
                        width: 100%;
                        max-width: var(--content-w);
                        margin-left: auto;
                        margin-right: auto;
                    }
                    /* The same 80px insets as the other sections. */
                    .hs-proj-inner { width: 100%; max-width: var(--content-col); }
                }

                /* ── Tablet (810–1199) ─────────────────────────────────────── */
                @media (max-width: 1199.98px) {
                    .hs-hero-inner { padding: 0 52px; }
                    .hs-hero-title { flex-basis: 67.2%; padding-top: 80px; }
                    .hs-title-box { width: 100%; height: 260px; padding: 0 0 20px; }
                    .hs-portfolio { font-size: 96px; }
                    .hs-my { font-size: 56px; }
                    .hs-my-wrap { left: 44px; bottom: 95px; }
                    .hs-intro-row { padding: 0 0 0 18px; }
                    .hs-cta-block { gap: 8px; padding: 24px 0 8px; }
                    .hs-btn-row, .hs-stat-row { height: auto; padding: 0 6px 2px; }
                    .hs-hero-cat { flex-basis: 33%; gap: 0; }
                    .hs-glb { width: 209px; height: 209px; }
                    .hs-scroll-ind { left: 56.17%; bottom: 113px; }
                    .hs-sticker-drag { top: 167px; left: 526px; width: 105px; height: 64px; }
                    .hs-sticker-peel { bottom: 44px; left: 632px; width: 102px; height: 113px; }

                    .hs-about-text { width: 32.46%; }
                    .hs-about2 { height: 66vh; }
                    .hs-about2-spacer { width: 34.46%; }
                    .hs-win { width: 100%; }
                    .hs-win-profile { transform: none; }

                    /* Tablet widths are landscape tablets and small laptops, so the
                       sheet is short: cards keep to one row, smaller, rather than
                       wrapping into a second row that a 768px viewport cannot hold. */
                    .hs-project-grid { gap: 24px; }
                    .hs-project-grid[data-count="many"] { grid-template-columns: repeat(auto-fill, minmax(min(100%, 190px), 1fr)); }

                    .hs-work-grid {
                        display: grid; grid-template-columns: repeat(2, 1fr);
                        gap: 0 25px; padding: 10px; width: auto; align-items: center;
                    }
                    .hs-work-grid > * { width: auto; }

                    .hs-skill-stage { display: flex; flex-wrap: wrap; gap: 36px 18px; padding: 28px 0; height: auto; min-height: 0; align-items: flex-start; }
                    .hs-skill-card { position: static; width: 80%; transform: none; }

                    .hs-contact-body { justify-content: flex-start; }
                    .hs-contact-inner { padding-top: 0; }

                    .hs-backtotop { right: 47px; bottom: calc(var(--footer-h, 0px) + 40px); }
                }

                /* ── Phone (≤809) ──────────────────────────────────────────────
                   The sticky choreography is dropped entirely: sections become
                   normal blocks and the About windows render inside About. */
                @media (max-width: 809.98px) {
                    .hs {
                        position: relative;
                        height: auto;
                        overflow: visible;
                    }
                    .hs-desktop-only, .hs-tail { display: none; }

                    .hs-hero { min-height: 100vh; }
                    .hs-hero-inner { flex-direction: column; align-items: center; gap: 0; padding: 20px 16px 0; }
                    .hs-hero-deco { display: none; }
                    .hs-hero-bg { inset: 0 0 -20px 0; }
                    /* Sized by its content: a viewport-height floor here left
                       slack that the scroll cue had to be positioned around. */
                    .hs-hero-title { flex: none; width: 100%; padding: 70px 0 0; min-height: 0; align-items: center; }
                    .hs-title-box { width: 99.4%; height: 206px; padding: 10px 0 0; display: flex; flex-direction: column; align-items: center; }
                    .hs-tags { width: 96%; min-width: 0; justify-content: center; }
                    .hs-portfolio { font-size: 86px; }
                    .hs-my { font-size: 42px; }
                    .hs-my-wrap { left: 6px; bottom: 83px; }
                    .hs-portfolio-wrap { bottom: 27px; }
                    .hs-intro-row { padding: 0 0 0 18px; width: 340px; }
                    .hs-cta-block { align-items: center; }
                    .hs-btn-row, .hs-stat-row { height: auto; justify-content: center; padding: 6px 6px 0; }
                    .hs-hero-cat { flex: none; flex-direction: row; justify-content: center; width: 73%; height: 30vh; padding-top: 0; gap: 0; }
                    .hs-strip, .hs-strip-row, .hs-shelf { display: none; }
                    .hs-glb { width: 197px; height: 197px; }
                    .hs-sticker-drag, .hs-sticker-peel { display: none; }
                    /* In flow between the stat boxes and the cat, so the cue owns
                       a band of its own instead of floating over the copy. The
                       markup order puts it last, hence the explicit order values. */
                    .hs-hero-title { order: 1; }
                    .hs-scroll-ind {
                        order: 2; position: static; left: auto; bottom: auto;
                        transform: none; flex: 0 0 auto; margin: 10px 0 14px;
                    }
                    .hs-hero-cat { order: 3; }

                    /* The sheet covers the whole section: a fixed height here
                       stopped short of the content and left a pale band before
                       the next transition. Content sizes the section. */
                    .hs-about { min-height: 0; background: rgb(245, 238, 230); }
                    .hs-about-bg { inset: 0; height: auto; }
                    .hs-about-inner { padding: 40px 42px 0; margin-top: 0; }
                    .hs-about-row { flex-direction: column; }
                    .hs-about-text { width: 100%; gap: 4px; }
                    .hs-about-side { display: none; }
                    .hs-about-winmobile {
                        display: flex; flex-direction: column; align-items: center;
                        gap: 10px; padding: 10px 0 40px; margin-top: 20px;
                    }
                    .hs-about-winmobile .hs-win { width: 100%; }
                    .hs-about-winmobile .hs-win-profile { transform: none; }

                    .hs-proj-inner { width: 80%; padding: 40px 0 24px; gap: 20px; }
                    .hs-project-grid, .hs-project-grid[data-count] { grid-template-columns: minmax(0, 1fr); gap: 24px; margin-top: 16px; }
                    .hs-proj-item { width: 100%; max-width: 320px; margin: 0 auto; }
                    .hs-projects { min-height: 0; }

                    .hs-work { min-height: 0; }
                    /* A percentage height made the scallops grow with the section
                       and turned them into spikes; pin the band instead. */
                    .hs-work-divider { height: 20px; min-height: 0; }
                    .hs-work-content { padding: 40px 0 0; align-items: center; }
                    .hs-work-grid { display: grid; grid-template-columns: 1fr; gap: 18px 0; padding: 6px; width: 315px; max-width: 100%; }
                    .hs-work-grid > * { width: auto; }

                    .hs-skills-body { padding: 40px 40px 60px; align-items: center; }
                    .hs-skill-stage { display: flex; flex-direction: column; gap: 40px; padding: 40px 8px 20px; height: auto; min-height: 0; width: 100%; }
                    .hs-skill-card { position: static; width: 100%; transform: none; }

                    /* The end of the page reads form → button → footer. The
                       section is content-sized and reserves the button's zone in
                       its own padding, so the button can never land on the form
                       however tall the form gets on a narrow screen. The footer
                       overlays the section's last --footer-h pixels. */
                    .hs-wrap { --btt-size: 56px; --btt-gap-form: 40px; --btt-gap-footer: 32px; }
                    .hs-contact { min-height: 0; }
                    .hs-contact-body {
                        padding: 40px 20px
                            calc(var(--footer-h, 0px) + var(--btt-gap-footer) + var(--btt-size) + var(--btt-gap-form));
                        justify-content: flex-start;
                    }

                    .hs-backtotop {
                        right: auto; left: 50%; transform: translateX(-50%);
                        bottom: calc(var(--footer-h, 0px) + var(--btt-gap-footer));
                    }
                }

                /* Reduced motion: Lenis and appear effects are disabled elsewhere;
                   flatten the scroll choreography too so nothing depends on
                   scroll-linked layering. */
                @media (prefers-reduced-motion: reduce) {
                    .hs { position: relative; height: auto; min-height: 100vh; overflow: visible; }
                    .hs-spacer, .hs-tail { display: none; }
                    .hs-about2 { height: auto; }
                    .hs-about2-inner { padding-bottom: 40px; }
                }
            `}</style>
        </div>
    )
}

function contactDetails(locale: Locale) {
    return [
        { label: pick(locale, { en: "Email", es: "Correo electrónico" }), value: "vliberonazuniga@gmail.com", url: "mailto:vliberonazuniga@gmail.com", color: colors.liberty, newTab: false },
        { label: pick(locale, { en: "Based in", es: "Basado en" }), value: "Santiago, Chile", url: "#", color: colors.tangerine, newTab: false },
        { label: "GitHub", value: "@valeLib", url: "https://github.com/valeLib", color: colors.straw, newTab: true },
    ]
}
