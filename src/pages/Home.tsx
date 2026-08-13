import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import StickyNav from "../components/StickyNav"
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
import { projects, asset } from "../data/projects"
import { useBreakpoint } from "../hooks/useBreakpoint"
import { colors } from "../tokens"

const HOME_PROJECT_ORDER = ["claws-and-cue-balls", "pawtchi", "goblin-td", "matcha-puzzle"]
const homeProjects = HOME_PROJECT_ORDER
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is (typeof projects)[number] => Boolean(p))

const workCards = [
    {
        title: "Pignus", label: "Unity Dev + Frontend", badge: "2023–Now",
        tags: ["Unity", "C#", "Meta Quest", "Vue.js"], dark: true,
    },
    {
        title: "AmblyopiaVR — Oxford", label: "Unity Dev & Technical Artist", badge: "2022",
        tags: ["Unity", "HLSL", "VR"],
    },
    {
        title: "NeurospeechAI — UCL", label: "Frontend & UI/UX", badge: "2023",
        tags: ["React", "TypeScript", "WCAG 2.1"],
    },
    {
        title: "U. de Chile", label: "Unity Dev & UI/UX", badge: "2020-2021",
        tags: ["Unity", "Blender", "Meta Quest"],
    },
    {
        title: "Eye-Search — UCL", label: "Frontend & UI/UX", badge: "2022",
        tags: ["React", "TypeScript", "Unity WebGL"],
    },
    {
        title: "Radar— Pulso Escolar", label: "Full-Stack Developer", badge: "2019",
        tags: ["Vue.js", "Node.js", "GCP"],
    },
    {
        title: "Capitalizarme", label: "Frontend & UI/UX", badge: "2022-2023",
        tags: ["React", "Next.js", "Redux"],
    },
]

const skillCards = [
    {
        emoji: "🎮", title: "Game & VR", className: "hs-skill-a", hoverRotate: 1,
        bg: colors.teal, border: colors.gunmetalBlack, titleColor: colors.liberty, paddingV: 16,
        tags: ["Unity 6 (URP)", "C++", "Unreal 5", "C#", "HLSL", "Blender", "Substance Painter", "VR", "Meta Quest"],
        tagBg: "rgb(122, 199, 178)", tagText: "rgb(51, 102, 102)", tagRadius: 6,
    },
    {
        emoji: "💻", title: "Frontend", className: "hs-skill-b", hoverRotate: -1,
        bg: colors.tangerine, border: colors.gunmetalBlack, titleColor: colors.linen, paddingV: 16,
        tags: ["React", "TypeScript", "Next.js", "Vue.js", "Vite", "GSAP", "Three.js", "R3F", "Lenis", "Lottie", "Framer Motion", "Framer"],
        tagBg: colors.babyPink, tagText: "rgb(135, 104, 109)", tagRadius: 6,
    },
    {
        emoji: "✨", title: "Shared", className: "hs-skill-c", hoverRotate: 1,
        bg: colors.liberty, border: colors.gunmetalBlack, titleColor: colors.linen, paddingV: 30,
        tags: ["Git", "Node.js", "Python", "MongoDB", "PostgreSQL", "Figma", "Krita", "Affinity"],
        tagBg: "rgb(114, 121, 191)", tagText: colors.surface, tagRadius: 8,
    },
]

const whoamiRows = [
    { label: "Name:", value: "Valentina Liberona", valueColor: colors.tangerine },
    { label: "Role:", value: "Unity Dev + Frontend Eng", valueColor: colors.teal },
    { label: "Base:", value: "Santiago, Chile", valueColor: colors.saffron },
    { label: "Status:", value: "Available", valueColor: colors.straw, showDot: true, dotColor: colors.straw },
]

const whoamiTags = ["C#", "C++", "HLSL", "Unity", "Unreal Engine", "React", "Typescript", "Vue.js", "Python", "Figma"]

const contactDetails = [
    { label: "Email", value: "vliberonazuniga@gmail.com", url: "mailto:vliberonazuniga@gmail.com", color: colors.liberty, newTab: false },
    { label: "Based in", value: "Santiago, Chile", url: "#", color: colors.tangerine, newTab: false },
    { label: "GitHub", value: "@valeLib", url: "https://github.com/valeLib", color: colors.straw, newTab: true },
]

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

// Caveat eyebrow + big Fredoka heading used by every section.
function SectionHead({
    title,
    titleColor,
    header,
    headerColor,
}: {
    title: string
    titleColor: string
    header: string
    headerColor: string
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ maxWidth: 615 }}>
                <SectionTitle
                    title={title}
                    layout="inline"
                    showDot
                    dotStyle="shadow"
                    dotColor={titleColor}
                    dotBorderColor={colors.gunmetalBlack}
                    dotBorderWidth={2}
                    dotShadowColor={colors.gunmetalBlack}
                    dotShadowX={1.5}
                    dotShadowY={1}
                    dotGap={10}
                    fontFamily="caveat"
                    fontSize={20}
                    titleColor={titleColor}
                    showBorder
                    borderColor="rgb(54, 49, 59)"
                    borderWidth={2}
                    borderStyle="dashed"
                    paddingBottom={1}
                />
            </div>
            <Appear trigger="scroll" transition="tween 0.44,0,0.56,1 0.5s 0.2s">
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
// in-section phone layout.
function AboutWindows() {
    return (
        <>
            <Appear trigger="mount" transition="spring-duration 0.4s 0.2 0s" className="hs-win hs-win-profile">
                <RetroWindow
                    title="PROFILE.EXE"
                    titleBarColor={colors.liberty}
                    titleColor={colors.surface}
                    bodyColor="#ffffff"
                    bodyPadding={0}
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
                            commandSize={16}
                            commandTextColor={colors.liberty}
                            promptColor={colors.liberty}
                            rowSize={14}
                            labelColor={colors.gunmetalBlack}
                            labelValueGap={6}
                            rowGap={4}
                            sectionGap={10}
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
            <Appear trigger="mount" transition="spring-duration 0.4s 0.2 0.2s" className="hs-win hs-win-loc">
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
                        />
                    </div>
                </RetroWindow>
            </Appear>
        </>
    )
}

export default function Home() {
    const bp = useBreakpoint()
    const phone = bp === "phone"
    const tablet = bp === "tablet"

    const navProps = {
        wordmark: "Valentina LZ",
        wordmarkSize: phone ? 18 : 26,
        wordmarkFont: "Fredoka",
        wordmarkLayer: true,
        wordmarkLayerMode: "Relief",
        wordmarkLayerColor: colors.liberty,
        wordmarkLayerX: 2.5,
        wordmarkLayerY: 2,
        wordmarkLayerBlur: 6,
        linkSize: 16,
        linkHover: "Underline grow",
        showCTA: false,
        ctaLabel: "Contact",
        ctaAnchor: "#contact",
        ctaColor: colors.saffron,
        font: "Fredoka",
        background: phone ? "rgba(255, 253, 247, 0.7)" : "rgba(255, 253, 247, 0.41)",
        textColor: colors.liberty,
        wordmarkColor: phone ? colors.liberty : colors.tangerine,
        activeColor: colors.tangerine,
        hoverColor: colors.babyPink,
        overlay: true,
        overlayTop: phone ? 12 : 24,
        overlayInset: phone ? 16 : tablet ? 20 : 24,
        overlayMaxWidth: tablet ? 760 : 930,
        baseHeight: phone ? 48 : 56,
        shrinkOnScroll: true,
        shrunkHeight: 45,
        shrinkWidthOnScroll: true,
        shrunkWidth: phone ? 85 : tablet ? 95 : 50,
        scrollAlign: "right",
        fadeOnScroll: true,
        scrolledOpacity: phone ? 0.96 : 0.98,
        autoHide: phone,
        autoHideDelay: 2.5,
        autoHideOffset: 120,
        glass: true,
        blurOnScroll: false,
        blurAmount: phone ? 30 : 1,
        bgOpacity: phone ? 0.4 : 0.8,
        saturate: 100,
        menuBg: colors.background,
        menuOpacity: 1,
        menuBlur: 14,
        elevateOnScroll: true,
        shadowMode: "Always",
        shadowDepth: 6,
        shadowColor: colors.liberty,
        shadowRim: true,
        shadowRimColor: colors.background,
        shadowRimWidth: 0.5,
        bottomBorder: true,
        fullBorder: true,
        borderColor: colors.border,
        borderWidth: 0.5,
        radius: 30,
        maxWidth: 1085,
        links: [
            { label: "Work", anchor: "#work" },
            { label: "About", anchor: "#about" },
            { label: "Projects", anchor: "#projects" },
            { label: "Contact", anchor: "#contact" },
        ],
    }

    const statSize = phone ? 26 : tablet ? 28 : 32
    const statPadH = phone ? 10 : tablet ? 12 : 16
    const statPadV = phone || tablet ? 4 : 10
    const btnFontSize = tablet ? 13 : 14
    const btnPadH = tablet ? 12 : 16
    const btnPadV = tablet ? 8 : 10
    const badgePadV = tablet ? 4 : 6

    const statHover = (rotate: number) => ({
        whileHover: { y: -1, scale: 1.1, rotate },
        transition: { type: "spring" as const, duration: 0.4, bounce: 0.2 },
    })

    return (
        <div className="home-root" style={{ width: "100%", background: colors.background }}>
            <SmoothScroll />
            <StickyNav {...navProps} />

            <div className="hs-wrap">
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

                        <div className="hs-hero-title">
                            <div className="hs-title-box">
                                <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1s 0.2s">
                                    <div className="hs-tags">
                                        <span style={{ transform: "rotate(-1deg)", display: "inline-flex" }}>
                                            <RetroButton variant="primary" label="Unity Dev" bgColor={colors.teal} textColor={colors.primaryTxt} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={20} paddingV={badgePadV} />
                                        </span>
                                        <span style={{ transform: "rotate(1deg)", display: "inline-flex" }}>
                                            <RetroButton variant="primary" label="Creative Frontend" bgColor={colors.lilac} textColor={colors.primaryTxt} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={20} paddingV={badgePadV} />
                                        </span>
                                        <span style={{ transform: "rotate(-1deg)", display: "inline-flex" }}>
                                            <RetroButton variant="primary" label="Chile 🌍" bgColor={colors.tangerine} textColor={colors.surface} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={20} paddingV={badgePadV} />
                                        </span>
                                    </div>
                                </Appear>

                                {/* "My" overlaps the top-left of "Portfolio". */}
                                <h1 className="hs-wordmark">
                                    <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1s 0.2s" className="hs-portfolio-wrap">
                                        <span className="hs-portfolio">Portfolio</span>
                                    </Appear>
                                    <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1s 0.2s" className="hs-my-wrap">
                                        <span className="hs-my">My</span>
                                    </Appear>
                                </h1>
                            </div>

                            <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1s 0.6s">
                                <div className="hs-intro-row">
                                    <p className="hs-intro">
                                        7+ years building games, VR experiences, and motion-driven web interfaces.
                                    </p>
                                </div>
                            </Appear>

                            <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1s 0.8s">
                                <div className="hs-cta-block">
                                    <div className="hs-btn-row">
                                        <RetroButton variant="primary" label="See my work ↓" href="#projects" bgColor={colors.lilac} textColor={colors.gunmetalBlack} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" fontSize={btnFontSize} fontWeight={700} paddingH={btnPadH} paddingV={btnPadV} />
                                        <RetroButton variant="primary" label="Get in touch" href="#contact" bgColor={colors.linen} textColor={colors.primaryTxt} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" fontSize={btnFontSize} fontWeight={700} paddingH={btnPadH} paddingV={btnPadV} />
                                    </div>
                                    <div className="hs-stat-row">
                                        <motion.div {...statHover(2)}>
                                            <RetroButton variant="stat" statValue="7+" statLabel="Years XP" hoverLift={false} statValueSize={statSize} bgColor={colors.babyPink} textColor={colors.gunmetalBlack} statLabelColor={colors.gunmetalBlack} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={statPadH} paddingV={statPadV} />
                                        </motion.div>
                                        <motion.div {...statHover(-2)}>
                                            <RetroButton variant="stat" statValue="4+" statLabel="Fields" hoverLift={false} statValueSize={statSize} bgColor={colors.lilac} textColor={colors.gunmetalBlack} statLabelColor={colors.gunmetalBlack} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={statPadH} paddingV={statPadV} />
                                        </motion.div>
                                        <motion.div {...statHover(-2)}>
                                            <RetroButton variant="stat" statValue="20+" statLabel="Skills" hoverLift={false} statValueSize={statSize} bgColor={colors.liberty} textColor={colors.surface} statLabelColor={colors.surface} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={statPadH} paddingV={statPadV} />
                                        </motion.div>
                                    </div>
                                </div>
                            </Appear>
                        </div>

                        <div className="hs-hero-cat">
                            <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1.5s 0.6s" className="hs-strip">
                                {checkerStrip}
                            </Appear>
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

                        {/* Decorative stickers, absolutely placed over the section. */}
                        <Sticker className="hs-sticker-drag" image={asset("sticker.png")} tilt={0.4} elevation={0.2} draggable />
                        <Sticker className="hs-sticker-peel" image={asset("sticker.png")} peel />

                        <ScrollIndicator targetId="about" className="hs-scroll-ind" />
                    </section>

                    {/* ── ABOUT — stage 1: text on the left ────────────────── */}
                    <section id="about" className="hs hs-about" style={{ zIndex: 2 }}>
                        <div className="hs-bg">
                            <NotebookBackground paperColor={colors.liberty} gridType="grid" gridColor={colors.lilac} gridOpacity={0.05} gridSize={28} gridWeight={4} />
                        </div>
                        <CheckerDivider color1="rgb(114, 121, 191)" color2={colors.lilac} cellSize={12} rows={2} />
                        <div className="hs-about-inner">
                            <div className="hs-about-row">
                                <div className="hs-about-text">
                                    <SectionTitle title="ABOUT ME" layout="inline" showDot dotStyle="shadow" dotColor={colors.tangerine} dotBorderColor={colors.gunmetalBlack} dotBorderWidth={2} dotShadowColor={colors.gunmetalBlack} dotShadowX={1.5} dotShadowY={1} dotGap={10} fontFamily="caveat" fontSize={20} titleColor={colors.tangerine} showBorder borderColor="rgb(54, 49, 59)" borderWidth={2} borderStyle="dashed" paddingBottom={1} />
                                    <Appear trigger="inView" transition="spring-duration 0.5s 0.2 0.2s">
                                        <SectionHeader showDot={false} showLabel={false} title="Hi, I'm Vale." titleColor={colors.linen} titleSize={34} intro="" />
                                    </Appear>
                                    <Appear trigger="inView" transition="spring-duration 0.5s 0.2 0.2s">
                                        <p className="hs-body" style={{ color: colors.linen }}>
                                            I’m a game developer based in Chile, working remotely, focused on building optimized systems that are both performant and visually clear. My work spans Unity and Unreal, where I design gameplay, AI behaviors, and scalable architectures. I also use frontend tools when needed to support interfaces and interactive systems.
                                        </p>
                                    </Appear>
                                </div>
                                {/* On desktop and tablet this stays empty — the windows
                                    arrive with the next sticky stage. */}
                                <div className="hs-about-side" aria-hidden />
                            </div>
                            {/* Phone shows the windows inline, below the text. */}
                            <div className="hs-about-winmobile">
                                <AboutWindows />
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
                                <AboutWindows />
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
                        <CheckerDivider color1={colors.tangerine} color2={tablet ? colors.libertyHover : colors.linen} cellSize={12} rows={2} />
                        <div className="hs-proj-inner">
                            <SectionHead title="PROJECTS" titleColor={colors.liberty} header="Featured Work" headerColor={colors.gunmetalBlack} />
                            <div className="hs-project-grid">
                                {homeProjects.map((p) => (
                                    <Link key={p.slug} to={`/projects/${p.slug}`} className="hs-proj-cell">
                                        <ProjectShowcase
                                            itemCount={1}
                                            item1MediaType="image"
                                            item1Image={p.cover ?? ""}
                                            item1UrlBar={p.title}
                                            item1Title={p.title}
                                            item1Tags={p.tracks}
                                            item1ShowButton={false}
                                            showHeader={false}
                                            showCounter={false}
                                            showArrows={false}
                                            showDots={false}
                                            showSubtitle={false}
                                            showTags={!phone}
                                            imageFit="contain"
                                            imageBgColor={p.cover ? colors.linen : p.color}
                                            frameBorderColor={colors.gunmetalBlack}
                                            dotRed={colors.tangerine}
                                            dotYellow={colors.saffron}
                                            dotGreen={colors.straw}
                                            urlBarBg={colors.linen}
                                            urlBarTextColor="rgb(107, 101, 128)"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── WORK / EXPERIENCE ────────────────────────────────── */}
                    <section id="work" className="hs hs-work" style={{ zIndex: 4 }}>
                        <div className="hs-bg" style={{ background: colors.babyPink }} />
                        <div className="hs-work-divider">
                            <PatternDivider pattern="Dots" tile={37} color={colors.surface} background="rgba(0,0,0,0)" />
                        </div>
                        <div className="hs-work-content">
                            <SectionHead title="EXPERIENCE" titleColor={colors.liberty} header="Where I've worked" headerColor={colors.primaryTxt} />
                            <div className="hs-work-grid">
                                {workCards.map((w) => (
                                    <Appear key={w.title} trigger="scroll" transition="spring-duration 1s 0.2 0.2s">
                                        <motion.div whileHover={{ scale: 1.02, rotate: 1 }} transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}>
                                            <InfoCard
                                                device={phone ? "mobile" : "desktop"}
                                                label={w.label}
                                                labelPosition="below"
                                                labelColor={w.dark ? colors.teal : colors.liberty}
                                                title={w.title}
                                                titleSize={22}
                                                showBadge
                                                badgeText={w.badge}
                                                badgeBg={w.dark ? "rgb(54, 49, 59)" : "rgb(237, 235, 231)"}
                                                badgeText2={w.dark ? colors.lilac : colors.gunmetalBlack}
                                                badgeBorderColor={w.dark ? "rgb(102, 102, 102)" : colors.gunmetalBlack}
                                                badgeFontSize={tablet ? 12 : 13}
                                                badgePaddingH={tablet ? 8 : 12}
                                                badgePaddingV={tablet ? 5 : 6}
                                                bodyMode="tags"
                                                tags={w.tags}
                                                tagBg={w.dark ? "rgb(54, 49, 59)" : colors.lilac}
                                                tagText={w.dark ? colors.surface : colors.gunmetalBlack}
                                                tagBorder="rgba(36, 38, 46, 0.28)"
                                                tagBorderWidth={1.5}
                                                bgColor={w.dark ? colors.gunmetalBlack : colors.surface}
                                                borderColor={w.dark ? colors.gunmetalBlack : "#1a1520"}
                                                borderWidth={2}
                                                titleColor={w.dark ? colors.surface : colors.gunmetalBlack}
                                                showShadow
                                                shadowColor="rgba(36, 38, 46, 0.28)"
                                                shadowX={3}
                                                shadowY={3}
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
                        <CheckerDivider color1={colors.liberty} color2={colors.linen} cellSize={12} rows={2} />
                        <div className="hs-skills-body">
                            <SectionHead title="SKILLS" titleColor={colors.tangerine} header="What I use" headerColor={colors.primaryTxt} />
                            {/* Desktop staggers the three cards diagonally with
                                absolute anchors; tablet and phone stack them. */}
                            <div className="hs-skill-stage">
                                {skillCards.map((c, i) => (
                                    <Appear key={c.title} trigger="scroll" transition={`spring-duration 1s 0.2 ${0.2 + i * 0.2}s`} className={`hs-skill-card ${c.className}`}>
                                        <motion.div whileHover={{ scale: 1.02, rotate: c.hoverRotate }} transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}>
                                            <InfoCard
                                                device={phone ? "mobile" : "desktop"}
                                                iconType="emoji"
                                                iconEmoji={c.emoji}
                                                iconSize={22}
                                                label=""
                                                title={c.title}
                                                titleSize={22}
                                                showBadge={false}
                                                bodyMode="tags"
                                                tags={c.tags}
                                                tagBg={c.tagBg}
                                                tagText={c.tagText}
                                                tagBorder="rgba(36, 38, 46, 0.28)"
                                                tagBorderWidth={1.5}
                                                tagBorderRadius={c.tagRadius}
                                                tagFontSize={13}
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
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── CONTACT ──────────────────────────────────────────── */}
                    <section id="contact" className="hs hs-contact" style={{ zIndex: 10 }}>
                        <div className="hs-bg">
                            <NotebookBackground paperColor={colors.background} gridType="dot" gridColor={colors.liberty} gridOpacity={0.15} gridSize={36} gridWeight={2.4} />
                        </div>
                        <CheckerDivider color1={colors.tangerine} color2={colors.linen} cellSize={12} rows={2} />
                        <div className="hs-contact-body">
                            <ContactPage
                                eyebrow="Get in touch"
                                headline="Let's build something playful."
                                intro="Have a game, an interface, or a wild idea? Drop a line and I'll get back to you."
                                email="vliberonazuniga@gmail.com"
                                accent={colors.tangerine}
                                background="rgba(242, 239, 233, 0)"
                                cardColor={colors.surface}
                                textColor={colors.primaryTxt}
                                mutedColor={colors.secondaryTxt}
                                details={contactDetails}
                                hardShadow
                                shadowColor={colors.primaryTxt}
                                radius={20}
                                padding={64}
                                gap={40}
                                mobilePadding={28}
                                mobileGap={48}
                            />
                        </div>
                    </section>

                    {/* Extra scroll room while Contact stays pinned, before the
                        footer rises from the bottom of the document. */}
                    <div className="hs-tail" aria-hidden />
                </main>

                <div className="hs-backtotop">
                    <BackToTop fixed={false} alwaysShow fill={colors.liberty} hoverFill={colors.tangerine} />
                </div>

                {/* Above the section stack, so it slides over pinned Contact. */}
                <div className="hs-footer">
                    <Footer
                        wordmark="Valentina Liberona"
                        showTagline={false}
                        groups={[]}
                        showSocials
                        socials={[
                            { label: "GitHub", url: "https://github.com/valeLib" },
                            { label: "LinkedIn", url: "https://www.linkedin.com/in/valentina-liberona/" },
                        ]}
                        background={colors.liberty}
                        textColor={colors.gunmetalBlack}
                        mutedColor={colors.linen}
                        socialColor={colors.tangerine}
                        topBorder
                        borderColor={colors.primaryTxt}
                        radius={0}
                        padding={phone ? 21 : 48}
                        gap={phone ? 16 : 40}
                    />
                </div>
            </div>

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
                .hs-spacer, .hs-about2 { background: transparent; }
                .hs-spacer { pointer-events: none; }
                .hs-tail { height: 2017px; pointer-events: none; }

                /* Hero — two columns: title (1fr) + cat (38.42%) */
                .hs-hero { flex-direction: row; gap: 40px; padding: 0 40px 0 80px; }
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
                .hs-shelf { width: 100%; height: 71px; }
                .hs-glb-row { width: 100%; display: flex; justify-content: center; }
                .hs-glb { width: 348px; max-width: 100%; height: 348px; }
                .hs-strip-row { width: 100%; height: 85px; display: flex; justify-content: flex-end; align-items: center; padding: 16px 12px 0 0; box-sizing: border-box; }
                .hs-scroll-ind { position: absolute; bottom: 30px; left: 54.58%; transform: translateX(-50%); z-index: 8; }
                .hs-sticker-drag { position: absolute; top: 156px; left: 756px; width: 129px; height: 79px; z-index: 4; }
                .hs-sticker-peel { position: absolute; bottom: 81px; left: 1018px; width: 150px; height: 166px; z-index: 4; transform: rotate(-1deg); }

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
                .hs-whoami { display: flex; flex-direction: column; gap: 18px; padding: 10px 7px 10px 20px; }
                .hs-loc { padding: 0 42px; }
                .hs-about-winmobile { display: none; }

                /* Projects */
                .hs-proj-inner {
                    position: relative; z-index: 1;
                    width: 86.667%; margin: 0 auto; padding-top: 20px;
                    display: flex; flex-direction: column; gap: 10px;
                }
                .hs-project-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 10px; }
                .hs-proj-cell { text-decoration: none; display: block; width: 90%; }

                /* Work */
                .hs-work-divider { position: relative; z-index: 6; width: 100%; height: 9%; min-height: 40px; }
                .hs-work-content {
                    position: relative; z-index: 2; flex: 1; min-height: 0;
                    padding: 80px 80px 0; box-sizing: border-box;
                    display: flex; flex-direction: column; gap: 10px;
                }
                .hs-work-grid {
                    display: flex; flex-wrap: wrap; gap: 12px 80px;
                    align-items: center; padding: 0 0 10px 42px; width: 99%;
                }
                .hs-work-grid > * { width: 42%; }

                /* Skills — desktop cascades the cards along a diagonal */
                .hs-skills-body {
                    position: relative; z-index: 1; flex: 1; min-height: 0;
                    padding: 100px 80px 0; box-sizing: border-box;
                    display: flex; flex-direction: column; gap: 10px;
                }
                .hs-skill-stage { position: relative; flex: 0 0 auto; height: 332px; }
                .hs-skill-card { position: absolute; width: 31.5%; transform: translateY(-50%); }
                .hs-skill-a { left: 1.44%; top: 30.1%; }
                .hs-skill-b { left: 34.23%; top: 50%; }
                .hs-skill-c { left: 67.12%; top: 69.37%; }

                /* Contact */
                .hs-contact-body {
                    position: relative; z-index: 1; flex: 1; min-height: 0;
                    padding: 80px 80px 0; box-sizing: border-box;
                    display: flex; flex-direction: column; justify-content: center;
                }

                .hs-backtotop { position: absolute; right: 24px; bottom: 447px; z-index: 9; }
                .hs-footer { position: absolute; left: 0; right: 0; bottom: 0; z-index: 9; }

                /* ── Tablet (810–1199) ─────────────────────────────────────── */
                @media (max-width: 1199.98px) {
                    .hs-hero { padding: 0 52px; }
                    .hs-hero-title { flex-basis: 67.2%; padding-top: 80px; }
                    .hs-title-box { width: 100%; height: 260px; padding: 0 0 20px; }
                    .hs-portfolio { font-size: 96px; }
                    .hs-my { font-size: 56px; }
                    .hs-my-wrap { left: 44px; bottom: 95px; }
                    .hs-portfolio-wrap { bottom: 20px; }
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
                    .hs-win { width: 100%; }

                    .hs-project-grid { grid-template-columns: repeat(2, 1fr); }

                    .hs-work-grid {
                        display: grid; grid-template-columns: repeat(2, 1fr);
                        gap: 0 25px; padding: 10px; width: auto; align-items: center;
                    }
                    .hs-work-grid > * { width: auto; }

                    .hs-skill-stage { display: flex; flex-wrap: wrap; gap: 36px 18px; padding: 28px 0; min-height: 0; align-items: flex-start; }
                    .hs-skill-card { position: static; width: 80%; transform: none; }

                    .hs-tail { height: 849px; }
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

                    .hs-hero { flex-direction: column; align-items: center; gap: 0; padding: 20px 16px 0; min-height: 110vh; }
                    .hs-hero-title { flex: none; width: 100%; padding: 40px 0 0; min-height: 76vh; align-items: center; }
                    .hs-title-box { width: 99.4%; height: 238px; padding: 50px 0 0; display: flex; flex-direction: column; align-items: center; }
                    .hs-tags { width: 96%; min-width: 0; justify-content: center; }
                    .hs-portfolio { font-size: 86px; }
                    .hs-my { font-size: 42px; }
                    .hs-my-wrap { left: 56px; bottom: 83px; }
                    .hs-portfolio-wrap { bottom: 27px; }
                    .hs-intro-row { padding: 0 0 0 18px; width: 352px; }
                    .hs-cta-block { align-items: center; }
                    .hs-btn-row, .hs-stat-row { height: auto; justify-content: center; padding: 8px 6px 0; }
                    .hs-hero-cat { flex: none; flex-direction: row; justify-content: center; width: 73%; height: 30vh; padding-top: 40px; gap: 0; }
                    .hs-strip, .hs-strip-row, .hs-shelf { display: none; }
                    .hs-glb { width: 197px; height: 197px; }
                    .hs-sticker-drag, .hs-sticker-peel { display: none; }
                    .hs-scroll-ind { left: 47.95%; bottom: 162px; }

                    .hs-about { min-height: 111vh; }
                    .hs-about-inner { padding: 40px 42px 0; }
                    .hs-about-row { flex-direction: column; }
                    .hs-about-text { width: 100%; gap: 4px; }
                    .hs-about-side { display: none; }
                    .hs-about-winmobile {
                        display: flex; flex-direction: column; align-items: center;
                        gap: 10px; padding: 10px 0 40px; margin-top: 20px;
                    }
                    .hs-about-winmobile .hs-win { width: 100%; }

                    .hs-proj-inner { width: 80%; padding: 40px 0 20px; gap: 20px; }
                    .hs-project-grid { display: flex; flex-wrap: wrap; gap: 11px 5px; margin-top: 0; }
                    .hs-proj-cell { width: 100%; max-width: 283px; margin: 0 auto; }
                    .hs-projects { min-height: 0; }

                    .hs-work { min-height: 176vh; }
                    .hs-work-content { padding: 40px 0 0; align-items: center; }
                    .hs-work-grid { display: grid; grid-template-columns: 1fr; gap: 18px 0; padding: 6px; width: 315px; max-width: 100%; }
                    .hs-work-grid > * { width: auto; }

                    .hs-skills { min-height: 127vh; }
                    .hs-skills-body { padding: 40px 40px 222px; align-items: center; }
                    .hs-skill-stage { display: flex; flex-direction: column; gap: 40px; padding: 40px 8px 20px; min-height: 0; width: 100%; }
                    .hs-skill-card { position: static; width: 100%; transform: none; }

                    .hs-contact { min-height: 129vh; }
                    .hs-contact-body { padding: 40px 20px 0; justify-content: flex-start; }

                    .hs-backtotop { right: auto; left: 50%; transform: translateX(-50%); bottom: 191px; }
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
