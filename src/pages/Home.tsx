import { Link } from "react-router-dom"
import StickyNav from "../components/StickyNav"
import Footer from "../components/Footer"
import RetroButton from "../components/RetroButton"
import NotebookBackground from "../components/NotebookBackground"
import PatternBackground from "../components/PatternBackground"
import PatternDivider from "../components/PatternDivider"
import CheckerDivider from "../components/CheckerDivider"
import SectionTitle from "../components/SectionTitle"
import SectionHeader from "../components/SectionHeader"
import RetroWindow from "../components/RetroWindow"
import InfoCard from "../components/InfoCard"
import ProjectShowcase from "../components/ProjectShowcase"
import ContactPage from "../components/ContactPage"
import GLBModelViewer from "../components/GLBModelViewer"
import ScrollIndicator from "../components/ScrollIndicator"
import BackToTop from "../components/BackToTop"
import Sticker from "../components/Sticker"
import Appear from "../components/Appear"
import { projects, asset } from "../data/projects"
import { colors } from "../tokens"

const navProps = {
    wordmark: "Valentina LZ",
    wordmarkSize: 26,
    wordmarkFont: "Fredoka",
    wordmarkLayer: true,
    wordmarkLayerMode: "Relief",
    wordmarkLayerColor: colors.liberty,
    wordmarkLayerX: 2.5,
    wordmarkLayerY: 2,
    wordmarkLayerBlur: 6,
    wordmarkOutline: false,
    wordmarkOutlineWidth: 0.5,
    linkSize: 16,
    linkHover: "Underline grow",
    showCTA: false,
    ctaLabel: "Contact",
    ctaAnchor: "#contact",
    ctaColor: colors.saffron,
    font: "Fredoka",
    background: "rgba(255, 253, 247, 0.41)",
    textColor: colors.liberty,
    wordmarkColor: colors.tangerine,
    activeColor: colors.tangerine,
    hoverColor: colors.babyPink,
    overlay: true,
    overlayTop: 24,
    overlayInset: 24,
    overlayMaxWidth: 930,
    baseHeight: 56,
    shrinkOnScroll: true,
    shrunkHeight: 45,
    shrinkWidthOnScroll: true,
    shrunkWidth: 50,
    scrollAlign: "right",
    fadeOnScroll: true,
    scrolledOpacity: 0.98,
    autoHide: false,
    autoHideDelay: 2.5,
    autoHideOffset: 120,
    glass: true,
    blurOnScroll: false,
    blurAmount: 1,
    bgOpacity: 0.8,
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

// Condensed copy for the Experience grid. The full entries live in data/work.ts;
// these are the shortened labels the cards are laid out for.
const workCards = [
    { label: "Unity Dev + Frontend", title: "Pignus", badge: "2023–Now", dark: true },
    { label: "Unity Dev & Technical Artist", title: "AmblyopiaVR — Oxford", badge: "2022" },
    { label: "Frontend & UI/UX", title: "NeurospeechAI — UCL", badge: "2023" },
    { label: "Unity Dev & UI/UX", title: "U. de Chile", badge: "2020-2021" },
    { label: "Frontend & UI/UX", title: "Eye-Search — UCL", badge: "2022" },
    { label: "Full-Stack Developer", title: "Radar— Pulso Escolar", badge: "2019" },
    { label: "Frontend & UI/UX", title: "Capitalizarme", badge: "2022-2023" },
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

function SectionHead({
    title,
    titleColor,
    num,
    header,
    borderColor = "rgb(54, 49, 59)",
}: {
    title: string
    titleColor: string
    num: string
    header: { title: string; titleColor: string }
    borderColor?: string
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
            <div style={{ maxWidth: 615 }}>
                <SectionTitle
                    title={title}
                    layout="inline"
                    showDot
                    dotStyle="shadow"
                    dotColor={titleColor}
                    dotBorderColor={colors.gunmetalBlack}
                    dotShadowColor={colors.gunmetalBlack}
                    dotShadowX={1.5}
                    dotShadowY={1}
                    fontFamily="caveat"
                    fontSize={20}
                    titleColor={titleColor}
                    showBorder
                    borderColor={borderColor}
                    borderWidth={2}
                    borderStyle="dashed"
                    paddingBottom={1}
                />
            </div>
            <Appear trigger="scroll" transition="tween 0.44,0,0.56,1 0.5s 0.2s">
                <SectionHeader
                    num={num}
                    showDot={false}
                    showLabel={false}
                    title={header.title}
                    titleColor={header.titleColor}
                    titleSize={34}
                    intro=""
                />
            </Appear>
        </div>
    )
}

export default function Home() {
    return (
        <div className="home-root" style={{ width: "100%", background: colors.background, overflowX: "hidden" }}>
            <StickyNav {...navProps} />

            <main className="hs-stack">
                {/* ── HERO ─────────────────────────────────────────────────── */}
                <section id="top" className="hs hs-hero" style={{ zIndex: 1 }}>
                    <div className="hs-bg">
                        <NotebookBackground
                            paperColor="rgb(241, 238, 232)"
                            usePaperGradient
                            paperGradientAngle={135}
                            gridType="grid"
                            gridColor="rgb(252, 214, 219)"
                            gridOpacity={0.6}
                            gridSize={28}
                            gridWeight={3}
                        />
                    </div>

                    <div className="hs-hero-inner">
                        <div className="hs-hero-title">
                            <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1s 0.2s">
                                <div className="hs-tags">
                                    <span style={{ transform: "rotate(-1deg)", display: "inline-flex" }}>
                                        <RetroButton variant="primary" label="Unity Dev" bgColor={colors.teal} textColor={colors.primaryTxt} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={20} paddingV={6} />
                                    </span>
                                    <span style={{ transform: "rotate(1deg)", display: "inline-flex" }}>
                                        <RetroButton variant="primary" label="Creative Frontend" bgColor={colors.lilac} textColor={colors.primaryTxt} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={20} paddingV={6} />
                                    </span>
                                    <span style={{ transform: "rotate(-1deg)", display: "inline-flex" }}>
                                        <RetroButton variant="primary" label="Chile 🌍" bgColor={colors.tangerine} textColor="rgb(255, 253, 248)" borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={20} paddingV={6} />
                                    </span>
                                </div>
                            </Appear>

                            {/* "My" overlaps the top-left of "Portfolio"; see .hs-my below. */}
                            <div className="hs-wordmark">
                                <span className="hs-my">My</span>
                                <span className="hs-portfolio">Portfolio</span>
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
                                        <RetroButton variant="primary" label="See my work ↓" href="#projects" bgColor={colors.lilac} textColor={colors.gunmetalBlack} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" fontSize={14} fontWeight={700} paddingH={16} paddingV={10} />
                                        <RetroButton variant="primary" label="Get in touch" href="#contact" bgColor={colors.linen} textColor={colors.primaryTxt} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" fontSize={14} fontWeight={700} paddingH={16} paddingV={10} />
                                    </div>
                                    <div className="hs-stat-row">
                                        <RetroButton variant="stat" statValue="7+" statLabel="Years XP" bgColor={colors.babyPink} textColor={colors.gunmetalBlack} statLabelColor={colors.gunmetalBlack} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={16} paddingV={10} />
                                        <RetroButton variant="stat" statValue="4+" statLabel="Fields" bgColor={colors.lilac} textColor={colors.gunmetalBlack} statLabelColor={colors.gunmetalBlack} borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={16} paddingV={10} />
                                        <RetroButton variant="stat" statValue="20+" statLabel="Skills" bgColor={colors.liberty} textColor="rgb(255, 253, 248)" statLabelColor="rgb(255, 253, 248)" borderColor={colors.gunmetalBlack} shadowColor={colors.gunmetalBlack} shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={16} paddingV={10} />
                                    </div>
                                </div>
                            </Appear>
                        </div>

                        <div className="hs-hero-cat">
                            <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1.5s 0.6s" className="hs-strip">
                                {checkerStrip}
                            </Appear>
                            <Appear trigger="mount" transition="tween 0.44,0,0.56,1 1.5s 0.4s" style={{ width: "100%" }}>
                                <div className="hs-glb">
                                    <GLBModelViewer model={asset("cat.glb")} enableInteraction disableZoom camH={15} camV={85} camRadius={90} enableAnimation />
                                </div>
                            </Appear>
                            <div className="hs-strip hs-strip-end">{checkerStrip}</div>
                        </div>
                    </div>

                    {/* Decorative hero stickers, absolutely placed over the section. */}
                    <Sticker className="hs-sticker-drag" image={asset("sticker.png")} tilt={0.4} elevation={0.2} draggable />
                    <Sticker className="hs-sticker-peel" image={asset("sticker.png")} peel />

                    <ScrollIndicator targetId="about" className="hs-scroll-ind" />
                </section>

                {/* ── ABOUT ────────────────────────────────────────────────── */}
                <section id="about" className="hs hs-about" style={{ zIndex: 2 }}>
                    <div className="hs-bg">
                        <NotebookBackground paperColor={colors.liberty} gridType="grid" gridColor={colors.lilac} gridOpacity={0.05} gridSize={28} gridWeight={4} />
                    </div>
                    <CheckerDivider color1="rgb(114, 121, 191)" color2={colors.lilac} cellSize={12} rows={2} />
                    <div className="hs-inner hs-about-inner">
                        <div className="hs-about-col">
                            <div style={{ maxWidth: 615, marginBottom: 18 }}>
                                <SectionTitle title="ABOUT ME" layout="inline" showDot dotStyle="shadow" dotColor={colors.tangerine} dotBorderColor={colors.gunmetalBlack} dotShadowColor={colors.gunmetalBlack} dotShadowX={1.5} dotShadowY={1} fontFamily="caveat" fontSize={20} titleColor={colors.tangerine} showBorder borderColor={colors.linen} borderWidth={2} borderStyle="dashed" paddingBottom={1} />
                            </div>
                            <Appear trigger="inView" transition="spring-duration 0.5s 0.2 0.2s">
                                <SectionHeader num="" showDot={false} showLabel={false} title="Hi, I'm Vale." titleColor={colors.linen} titleSize={34} intro="" />
                            </Appear>
                            <p className="hs-body" style={{ color: "rgb(229, 224, 235)", marginTop: 18, maxWidth: 520 }}>
                                I’m a game developer based in Chile, working remotely, focused on building optimized systems that are both performant and visually clear. My work spans Unity and Unreal, where I design gameplay, AI behaviors, and scalable architectures. I also use frontend tools when needed to support interfaces and interactive systems.
                            </p>
                        </div>

                        <div className="hs-about-col hs-about-windows">
                            <Appear trigger="mount" transition="spring-duration 0.4s 0.2 0s" style={{ width: "90%", transform: "rotate(1deg)" }}>
                                <RetroWindow title="PROFILE.EXE" titleBarColor={colors.liberty} titleColor="rgb(255, 253, 248)" bodyColor="rgb(255, 255, 255)" contentMode="text" plainText={"Vale · Game & XR developer\n7+ years across Unity, Unreal, HLSL shaders and motion-driven frontends.\nUCL ×2 · Oxford · U. de Chile research."} plainTextColor={colors.gunmetalBlack} />
                            </Appear>
                            <Appear trigger="mount" transition="spring-duration 0.4s 0.2 0.2s" style={{ width: "90%", transform: "rotate(-1deg)" }}>
                                <RetroWindow title="LOCATION.EXE" titleBarColor={colors.teal} titleColor="rgb(255, 255, 255)" bodyColor="rgb(255, 253, 248)" contentMode="text" plainText={"📍 Santiago, Chile — working remotely (UTC−3).\nOpen to remote collaborations worldwide."} plainTextColor={colors.gunmetalBlack} />
                            </Appear>
                        </div>
                    </div>
                </section>

                {/* Empty sticky layers that pace the scroll between About and
                    Projects. Hidden on phone, where the stack is not sticky. */}
                <section className="hs hs-spacer hs-desktop-only" style={{ zIndex: 3, height: "90vh" }} aria-hidden />
                <section className="hs hs-spacer hs-desktop-only" style={{ zIndex: 3 }} aria-hidden />

                {/* ── PROJECTS ─────────────────────────────────────────────── */}
                <section id="projects" className="hs hs-projects" style={{ zIndex: 4 }}>
                    <div className="hs-bg">
                        <NotebookBackground paperColor={colors.background} gridType="grid" gridColor={colors.liberty} gridOpacity={0.15} gridSize={34} gridWeight={2.6} />
                    </div>
                    <CheckerDivider color1={colors.tangerine} color2={colors.linen} cellSize={12} rows={2} />
                    <div className="hs-inner">
                        <SectionHead title="PROJECTS" titleColor={colors.liberty} num="02 —" header={{ title: "Featured Work", titleColor: colors.gunmetalBlack }} />
                        <div className="hs-project-grid">
                            {projects.map((p) => (
                                <Link key={p.slug} to={`/projects/${p.slug}`} style={{ textDecoration: "none" }}>
                                    <ProjectShowcase
                                        itemCount={1}
                                        item1MediaType="image"
                                        item1Image={p.cover ?? ""}
                                        item1UrlBar={p.title}
                                        item1Title={p.title}
                                        item1Subtitle={p.title}
                                        item1Tags={p.tracks}
                                        item1ShowButton={false}
                                        showHeader={false}
                                        showCounter={false}
                                        showArrows={false}
                                        showDots={false}
                                        showSubtitle
                                        showTags
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

                {/* ── WORK / EXPERIENCE ────────────────────────────────────── */}
                <section id="work" className="hs hs-work" style={{ zIndex: 4 }}>
                    <div className="hs-work-divider">
                        <PatternDivider pattern="Dots" tile={37} color={colors.linen} background="rgba(0,0,0,0)" />
                    </div>
                    <CheckerDivider color1={colors.teal} color2={colors.linen} cellSize={12} rows={2} />
                    <div className="hs-inner">
                        <SectionHead title="EXPERIENCE" titleColor={colors.liberty} num="03 —" header={{ title: "Where I've worked", titleColor: colors.primaryTxt }} />
                        <div className="hs-work-grid">
                            {workCards.map((w, i) => (
                                <Appear key={w.title} trigger="scroll" transition={`spring-duration 1s 0.2 ${0.2 + i * 0.05}s`}>
                                    <InfoCard
                                        device="desktop"
                                        label={w.label}
                                        labelColor={w.dark ? colors.teal : colors.liberty}
                                        title={w.title}
                                        titleSize={19}
                                        showBadge
                                        badgeText={w.badge}
                                        badgeBg="rgb(54, 49, 59)"
                                        badgeText2={colors.lilac}
                                        badgeBorderColor="rgb(102, 102, 102)"
                                        badgeFontSize={13}
                                        badgePaddingH={12}
                                        badgePaddingV={6}
                                        bodyMode="text"
                                        body=""
                                        bgColor={w.dark ? colors.gunmetalBlack : "rgb(255, 253, 248)"}
                                        borderColor={w.dark ? colors.gunmetalBlack : colors.gunmetalBlack}
                                        titleColor={w.dark ? "rgb(255, 253, 248)" : colors.gunmetalBlack}
                                        bodyColor="rgb(170, 168, 184)"
                                        showShadow
                                        shadowColor="rgba(36, 38, 46, 0.28)"
                                        shadowX={3}
                                        shadowY={3}
                                        paddingH={28}
                                        paddingV={22}
                                        borderRadius={14}
                                    />
                                </Appear>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── SKILLS ───────────────────────────────────────────────── */}
                <section id="skills" className="hs hs-skills" style={{ zIndex: 5 }}>
                    <div className="hs-bg">
                        <NotebookBackground paperColor={colors.background} gridType="ruled" gridColor={colors.liberty} gridOpacity={0.15} gridSize={34} gridWeight={2.6} />
                    </div>
                    <CheckerDivider color1={colors.tangerine} color2={colors.linen} cellSize={12} rows={2} />
                    <div className="hs-inner">
                        <SectionHead title="SKILLS" titleColor={colors.tangerine} num="02 —" header={{ title: "What I use", titleColor: colors.primaryTxt }} />
                        <div className="hs-skill-row">
                            <Appear trigger="scroll" transition="spring-duration 1s 0.2 0.2s" className="hs-skill-card hs-skill-a">
                                <InfoCard
                                    iconType="emoji" iconEmoji="🎮" title="Game & VR"
                                    showBadge={false} bodyMode="tags"
                                    tags={["Unity", "C#", "HLSL shaders", "3D art", "VR optimization", "Meta Quest", "WebGL"]}
                                    tagBg="rgb(122, 199, 178)" tagText="rgb(51, 102, 102)" tagBorder="rgba(36, 38, 46, 0.28)" tagBorderWidth={1.5}
                                    bgColor={colors.teal} borderColor={colors.gunmetalBlack} borderWidth={2} titleColor="rgb(255, 255, 255)"
                                    showShadow shadowColor={colors.gunmetalBlack} shadowX={4} shadowY={4} paddingH={24} paddingV={16} borderRadius={14}
                                />
                            </Appear>
                            <Appear trigger="scroll" transition="spring-duration 1s 0.2 0.4s" className="hs-skill-card hs-skill-b">
                                <InfoCard
                                    iconType="emoji" iconEmoji="💻" title="Frontend"
                                    showBadge={false} bodyMode="tags"
                                    tags={["React", "Vue", "TypeScript", "GSAP", "Lenis", "React Three Fiber", "Design systems"]}
                                    tagBg={colors.babyPink} tagText="rgb(135, 104, 109)" tagBorder="rgba(36, 38, 46, 0.28)" tagBorderWidth={1.5} tagFontSize={11}
                                    bgColor={colors.tangerine} borderColor={colors.gunmetalBlack} borderWidth={2} titleColor={colors.gunmetalBlack}
                                    showShadow shadowColor={colors.gunmetalBlack} shadowX={4} shadowY={4} paddingH={24} paddingV={16} borderRadius={14}
                                />
                            </Appear>
                            <Appear trigger="scroll" transition="spring-duration 1s 0.2 0.6s" className="hs-skill-card hs-skill-c">
                                <InfoCard
                                    iconType="emoji" iconEmoji="✨" title="Shared"
                                    showBadge={false} bodyMode="tags"
                                    tags={["VR dashboards", "WebGL", "WCAG / a11y", "Shaders", "Visual identity"]}
                                    tagBg="rgb(114, 121, 191)" tagText="rgb(255, 253, 248)" tagBorder="rgba(36, 38, 46, 0.28)" tagBorderWidth={1.5} tagBorderRadius={8}
                                    bgColor={colors.liberty} borderColor={colors.gunmetalBlack} borderWidth={2} titleColor="rgb(255, 253, 248)"
                                    showShadow shadowColor={colors.gunmetalBlack} shadowX={4} shadowY={4} paddingH={24} paddingV={30} borderRadius={14}
                                />
                            </Appear>
                        </div>
                    </div>
                </section>

                {/* ── CONTACT ──────────────────────────────────────────────── */}
                <section id="contact" className="hs hs-contact" style={{ zIndex: 10 }}>
                    <div className="hs-bg">
                        <NotebookBackground paperColor={colors.background} gridType="ruled" gridColor={colors.liberty} gridOpacity={0.15} gridSize={34} gridWeight={2.6} />
                    </div>
                    <CheckerDivider color1={colors.tangerine} color2={colors.linen} cellSize={12} rows={2} />
                    <div className="hs-inner hs-contact-inner">
                        <ContactPage
                            eyebrow="Get in touch"
                            headline="Let's build something playful."
                            intro="Have a game, an interface, or a wild idea? Drop a line and I'll get back to you."
                            email="vliberonazuniga@gmail.com"
                            accent={colors.tangerine}
                            background={colors.background}
                            cardColor="rgb(255, 253, 248)"
                            textColor={colors.primaryTxt}
                            mutedColor={colors.mutedTxt}
                            hardShadow
                            shadowColor={colors.primaryTxt}
                            radius={20}
                            padding={48}
                            gap={40}
                            mobileGap={48}
                        />
                    </div>
                </section>
            </main>

            {/* Above the sticky stack, so it slides over the pinned Contact layer. */}
            <div className="hs-footer">
                <Footer
                    wordmark="Valentina Liberona"
                    showTagline={false}
                    showSocials
                    background={colors.liberty}
                    textColor={colors.gunmetalBlack}
                    mutedColor={colors.linen}
                    socialColor={colors.liberty}
                    topBorder
                    borderColor={colors.primaryTxt}
                    radius={0}
                    padding={48}
                    gap={40}
                />
            </div>

            <BackToTop fill={colors.liberty} hoverFill={colors.tangerine} />

            <style>{`
                /* Sticky scrollytelling stack (desktop + tablet). Each section pins at
                   the top and the next one slides over it, ordered by z-index. */
                .hs-stack { width: 100%; position: relative; }
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
                .hs-inner {
                    position: relative; z-index: 1;
                    width: 100%; max-width: 1200px; margin: 0 auto;
                    padding: 20px 80px 0;
                    box-sizing: border-box;
                    flex: 1; min-height: 0;
                    display: flex; flex-direction: column;
                }
                .hs-spacer { background: transparent; pointer-events: none; }

                /* Hero */
                .hs-hero { flex-direction: row; }
                .hs-hero-inner {
                    position: relative; z-index: 1;
                    width: 100%; max-width: 1200px; margin: 0 auto;
                    padding: 0 40px 0 80px;
                    box-sizing: border-box;
                    display: flex; gap: 40px; align-items: flex-start;
                }
                .hs-hero-title { flex: 1 1 auto; padding-top: 60px; display: flex; flex-direction: column; justify-content: center; }
                .hs-tags { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 18px; }
                .hs-wordmark { position: relative; display: inline-block; padding-top: 42px; }
                .hs-my {
                    position: absolute; left: 24px; top: 8px; z-index: 2;
                    font-family: "Leckerli One", cursive; font-size: 86px; line-height: 1em;
                    letter-spacing: -0.04em; color: ${colors.tangerine};
                }
                .hs-portfolio {
                    display: block;
                    font-family: "Leckerli One", cursive; font-size: 140px; line-height: 1em;
                    letter-spacing: -0.04em; color: ${colors.liberty};
                }
                .hs-intro-row { padding: 0 0 0 32px; }
                .hs-intro {
                    font-family: "Anonymous Pro", monospace; font-size: 14px; line-height: 1.75em;
                    letter-spacing: -0.02em; color: ${colors.secondaryTxt}; max-width: 440px; margin: 0;
                }
                .hs-cta-block { display: flex; flex-direction: column; gap: 8px; padding: 24px 0 8px; }
                .hs-btn-row { display: flex; gap: 14px; flex-wrap: wrap; padding: 0 6px; }
                .hs-stat-row { display: flex; gap: 15px; flex-wrap: wrap; padding: 0 6px; }

                .hs-hero-cat {
                    flex: 0 0 38.4%; display: flex; flex-direction: column;
                    align-items: center; gap: 10px; padding-top: 80px;
                }
                .hs-glb { width: 348px; max-width: 100%; height: 348px; }
                .hs-strip-end { align-self: flex-end; }
                .hs-scroll-ind { position: absolute; bottom: 30px; left: 54.58%; transform: translateX(-50%); z-index: 8; }
                .hs-sticker-drag { position: absolute; top: 156px; left: 756px; width: 129px; height: 79px; z-index: 4; }
                .hs-sticker-peel { position: absolute; bottom: 81px; left: 1018px; width: 150px; height: 166px; z-index: 4; }

                /* About */
                .hs-about-inner { flex-direction: row; gap: 48px; align-items: flex-start; padding: 20px 80px 0; }
                .hs-about-col { flex: 1 1 360px; min-width: 300px; }
                .hs-about-windows { display: flex; flex-direction: column; gap: 24px; align-items: center; }
                .hs-body {
                    font-family: "Anonymous Pro", monospace; font-size: 14px;
                    line-height: 1.75em; letter-spacing: -0.02em;
                }

                /* Projects / Work / Skills grids — see the breakpoint blocks below */
                .hs-project-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                .hs-work-divider { position: relative; z-index: 6; width: 100%; height: 9%; min-height: 40px; }
                .hs-work-grid {
                    display: flex; flex-wrap: wrap; gap: 12px 80px;
                    align-items: center; padding: 0 0 10px 42px;
                }
                .hs-work-grid > * { width: 42%; }
                .hs-skill-row { display: flex; gap: 20px; justify-content: center; align-items: center; padding: 0 8px; }
                .hs-skill-card { width: 31.5%; }

                .hs-contact-inner { padding: 40px 80px 0; }

                .hs-footer { position: relative; z-index: 11; width: 100%; padding: 56px 0; background: ${colors.background}; }

                /* ── Tablet (810–1199) ─────────────────────────────────────── */
                @media (max-width: 1199.98px) {
                    .hs-hero-inner { padding: 0 52px; }
                    .hs-hero-title { padding-top: 80px; width: 67.2%; }
                    .hs-portfolio { font-size: 96px; }
                    .hs-my { font-size: 56px; left: 20px; }
                    .hs-intro-row { padding: 0 0 0 18px; }
                    .hs-glb { width: 209px; height: 209px; }
                    .hs-hero-cat { flex-basis: 33%; }
                    .hs-project-grid { grid-template-columns: repeat(2, 1fr); }
                    .hs-work-grid {
                        display: grid; grid-template-columns: repeat(2, 1fr);
                        gap: 0 25px; padding: 10px; align-items: center;
                    }
                    .hs-work-grid > * { width: auto; }
                    .hs-skill-row { flex-wrap: wrap; gap: 36px 18px; align-items: flex-start; padding: 28px 0; }
                    .hs-skill-card { width: 80%; }
                }

                /* ── Phone (≤809) ──────────────────────────────────────────────
                   The sticky choreography is dropped entirely: every section
                   becomes a normal relative block with an auto height. */
                @media (max-width: 809.98px) {
                    .hs {
                        position: relative;
                        height: auto;
                        min-height: 0;
                        overflow: visible;
                    }
                    .hs-desktop-only { display: none; }
                    .hs-hero { flex-direction: column; padding: 20px 16px 0; }
                    .hs-hero-inner { flex-direction: column; gap: 0; padding: 0; align-items: center; }
                    .hs-hero-title { width: 100%; padding-top: 40px; align-items: center; text-align: center; }
                    .hs-wordmark { padding-top: 50px; }
                    .hs-portfolio { font-size: 86px; }
                    .hs-my { font-size: 42px; left: 10px; }
                    .hs-tags { justify-content: center; }
                    .hs-btn-row, .hs-stat-row { justify-content: center; }
                    .hs-hero-cat { flex-direction: row; padding-top: 40px; width: 73%; }
                    .hs-glb { width: 197px; height: 197px; }
                    .hs-strip { display: none; }
                    .hs-sticker-drag, .hs-sticker-peel { display: none; }
                    .hs-scroll-ind { left: 50%; bottom: 162px; }
                    .hs-inner { padding: 40px 42px 20px; }
                    .hs-about-inner { flex-direction: column; gap: 0; padding: 40px 42px 0; }
                    .hs-about-col { min-width: 0; width: 100%; }
                    .hs-project-grid { display: flex; flex-wrap: wrap; gap: 11px 5px; }
                    .hs-project-grid > * { width: 100%; }
                    .hs-work-grid { display: grid; grid-template-columns: 1fr; gap: 18px 0; padding: 6px; }
                    .hs-work-grid > * { width: auto; }
                    .hs-skill-row { flex-direction: column; gap: 40px; padding: 0 8px 20px; align-items: stretch; }
                    .hs-skill-card { width: 100%; }
                    .hs-contact-inner { padding: 40px 20px 0; }
                    .hs-footer { padding: 21px 0; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .hs { position: relative; height: auto; overflow: visible; }
                }
            `}</style>
        </div>
    )
}
