import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { projects } from "../data/projects"
import { projectSections } from "../data/projectSections"
import type { ProjectSections, SectionItem } from "../data/projectSections"
import { colors } from "../tokens"
import RichText from "../components/RichText"
import Appear from "../components/Appear"
import NotebookBackground from "../components/NotebookBackground"
import CheckerDivider from "../components/CheckerDivider"
import SectionTitle from "../components/SectionTitle"
import RetroWindow from "../components/RetroWindow"
import HeroSection from "../components/HeroSection"
import TagCloud from "../components/TagCloud"
import PastelCard from "../components/PastelCard"
import MediaFrame from "../components/MediaFrame"
import Gallery from "../components/Gallery"
import FlowDiagram from "../components/FlowDiagram"
import CoreLoopDiagram from "../components/CoreLoopDiagram"
import DecisionImpactTable from "../components/DecisionImpactTable"
import FeatureModuleGrid from "../components/FeatureModuleGrid"
import ProjectShowcase from "../components/ProjectShowcase"

/**
 * One template for every project detail page: a sticky hero plus the Brief /
 * Snapshot / UI / Prototype / Game Design sections defined in projectSections.
 * Each block is conditional on its own data, so a project renders only the
 * sections it has content for.
 */

// Drives the prev / next footer links.
const PROJECT_ORDER = ["claws-and-cue-balls", "pawtchi", "goblin-td", "matcha-puzzle"]

type Breakpoint = "desktop" | "tablet" | "phone"

function useBreakpoint(): Breakpoint {
    const get = (): Breakpoint => {
        if (typeof window === "undefined") return "desktop"
        if (window.matchMedia("(max-width: 809.98px)").matches) return "phone"
        if (window.matchMedia("(max-width: 1199.98px)").matches) return "tablet"
        return "desktop"
    }
    const [bp, setBp] = useState<Breakpoint>(get)
    useEffect(() => {
        const onResize = () => setBp(get())
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])
    return bp
}

// Shared SectionTitle configuration; only the dot/line accents differ per section.
const sectionTitleBase = {
    layout: "inline-line",
    animation: "typewriter",
    animationTrigger: "every",
    animationDuration: 0.6,
    staggerDelay: 0.04,
    showLabel: false,
    showDot: true,
    dotStyle: "shadow",
    dotSize: 12,
    dotBorderColor: "#1a1520",
    dotBorderWidth: 1.5,
    dotShadowColor: "#1a1520",
    dotShadowX: 2,
    dotShadowY: 1,
    dotGap: 10,
    fontFamily: "fredoka",
    fontSize: 24,
    fontWeight: 500,
    titleColor: colors.primaryTxt,
    letterSpacing: 0.02,
    showBorder: true,
    borderColor: "#1a1520",
    borderWidth: 3,
    borderStyle: "solid",
    lineThickness: 2.5,
    lineGap: 12,
    lineGapBelow: 8,
} as const

const tangerineTitle = {
    ...sectionTitleBase,
    dotColor: colors.tangerine,
    lineColor: colors.tangerine,
    lineColor2: "rgba(238, 151, 142, 0.3)",
}

// Hover lift used by the snapshot pastel cards.
function LiftCard({ rotate = 0, children }: { rotate?: number; children: React.ReactNode }) {
    return (
        <motion.div
            style={{ width: "100%", rotate }}
            whileHover={{ y: -25 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
        >
            {children}
        </motion.div>
    )
}

// Renders both body variants and lets CSS pick one, so the copy swaps at the
// phone breakpoint without a resize listener re-rendering the whole page.
function BodyText({ html, mobileHtml }: { html?: string; mobileHtml?: string }) {
    if (!html && !mobileHtml) return null
    return (
        <>
            {html && (
                <div className="pd-not-phone" style={{ width: "100%" }}>
                    <RichText html={html} />
                </div>
            )}
            {mobileHtml && (
                <div className="pd-only-phone" style={{ width: "100%" }}>
                    <RichText html={mobileHtml} />
                </div>
            )}
        </>
    )
}

export default function ProjectDetail() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const bp = useBreakpoint()
    const phone = bp === "phone"
    const tablet = bp === "tablet"

    const project = projects.find((p) => p.slug === slug)
    const sections: ProjectSections = (slug && projectSections[slug]) || {}
    const { brief, snapshot, gameDesign, ui, prototype, breakdown } = sections
    const hasSections = Boolean(brief || snapshot || gameDesign || ui || prototype)

    // The hero is sticky underneath the sections, which are transparent, so it
    // has to fade out as the first section scrolls over it.
    const { scrollY } = useScroll()
    const fadeRange = typeof window !== "undefined" ? window.innerHeight * 0.85 : 800
    const heroOpacity = useTransform(scrollY, [0, fadeRange], [1, hasSections ? 0 : 1])
    const heroY = useTransform(scrollY, [0, fadeRange], [0, hasSections ? (phone ? -100 : -414) : 0])

    if (!project) {
        return (
            <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
                <h1 style={{ fontFamily: '"Fredoka One", "Fredoka", cursive', color: colors.primaryTxt }}>Project not found</h1>
                <Link to="/" style={{ color: colors.liberty }}>← Back home</Link>
            </div>
        )
    }

    const idx = PROJECT_ORDER.indexOf(project.slug)
    const prevSlug = idx > 0 ? PROJECT_ORDER[idx - 1] : undefined
    const nextSlug = idx >= 0 && idx < PROJECT_ORDER.length - 1 ? PROJECT_ORDER[idx + 1] : undefined

    const goToHomeProjects = () => {
        navigate("/")
        window.setTimeout(() => document.getElementById("projects")?.scrollIntoView(), 60)
    }

    const briefItems = (brief?.items ?? []).slice(0, 2)
    const snapItems = snapshot?.items ?? []
    const featureItem: SectionItem | undefined = gameDesign?.items?.[0]
    const galleryItems = (ui?.galleryItems ?? []).slice(0, 5)

    return (
        <div className="pd-page">
            <div className="pd-scroll">
                <div className="pd-paper">
                    <NotebookBackground
                        paperColor={colors.background}
                        gridType="ruled"
                        gridColor={colors.mutedTxt}
                        gridOpacity={0.25}
                        gridSize={24}
                        gridWeight={1.2}
                    />
                </div>

                {/* Sticky back link to the home Featured Work section */}
                <div className="pd-backlink">
                    <a
                        href="#/"
                        onClick={(e) => { e.preventDefault(); goToHomeProjects() }}
                        className="pd-code-link"
                    >
                        ‹ Back
                    </a>
                </div>

                <div className="pd-sections">
                    {/* ── Hero (sticky, 100vh) ─────────────────────────────── */}
                    <section className="pd-hero">
                        <motion.div className="pd-hero-inner" style={{ opacity: heroOpacity, y: heroY }}>
                            <Appear transition="spring-duration 0.4s 0.2 0s" style={{ width: "100%" }}>
                                <CheckerDivider color1={colors.lilac} color2="rgb(114, 121, 191)" cellSize={13} rows={2} />
                            </Appear>
                            <Appear transition="tween 0.44,0,0.56,1 0.6s 0.1s" style={{ width: "100%" }}>
                                <HeroSection
                                    title={project.title}
                                    year={project.year}
                                    tracks={project.tracks}
                                    tagline={project.tagline}
                                    stack={project.stack}
                                    context={project.context}
                                    role={project.role}
                                    animation="wordByWord"
                                    animationTrigger="once"
                                    animationDuration={0.6}
                                    elementStagger={0.1}
                                    staggerDelay={0.04}
                                    showBackLink={false}
                                    yearPosition="inline-right"
                                    stackLabel="Tools"
                                    contextLabel="Context"
                                    roleLabel="Role"
                                    dividerStyle="wavy"
                                    dividerThickness={3}
                                    dividerColor={colors.babyPink}
                                    dividerMarginTop={24}
                                    accentColor={project.color}
                                    inkColor="rgb(54, 49, 59)"
                                    mutedColor={colors.secondaryTxt}
                                    paddingTop={phone ? 28 : 60}
                                    paddingBottom={phone ? 8 : 24}
                                    paddingX={phone ? 16 : 24}
                                    maxWidth={760}
                                    titleFont="Jua"
                                    titleWeight="700"
                                    titleSize={phone ? 66 : 88}
                                    titleColor="rgb(54, 49, 59)"
                                    titleLineHeight={1.1}
                                    trackFont="IBM Plex Mono"
                                    trackSize={11}
                                    yearFont="IBM Plex Mono"
                                    yearWeight="700"
                                    yearSize={14}
                                    yearTextColor={colors.gunmetalBlack}
                                    yearPaddingH={14}
                                    yearPaddingV={4}
                                    yearBorderRadius={5}
                                    yearBorderWidth={1.5}
                                    yearShadowOffset={2}
                                    taglineFont="Anonymous Pro"
                                    taglineSize={16}
                                    taglineColor={colors.liberty}
                                    metaFont="IBM Plex Mono"
                                    metaSize={12}
                                />
                            </Appear>
                            {project.cover && (
                                <Appear transition="tween 0.44,0,0.56,1 0.5s 0.5s" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                    <div className="pd-banner" style={{ backgroundImage: `url(${project.cover})` }} />
                                </Appear>
                            )}
                            {project.tags && (
                                <Appear transition="tween 0.44,0,0.56,1 0.5s 0.55s">
                                    <TagCloud tagsString={project.tags} />
                                </Appear>
                            )}
                        </motion.div>
                    </section>

                    {/* Empty spacer that gives the hero room to fade out before Brief. */}
                    {snapshot && <div id="section-invisible" className="pd-spacer-invisible" />}

                    {/* ── Brief ────────────────────────────────────────────── */}
                    {brief && (
                        <section id="section-brief" className="pd-section pd-brief">
                            {brief.displayTitle && (
                                <SectionTitle {...tangerineTitle} title={brief.displayTitle} />
                            )}
                            {brief.bodyHtml && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-brief-body">
                                    <BodyText html={brief.bodyHtml} mobileHtml={brief.bodyMobileHtml} />
                                </Appear>
                            )}
                            {brief.tags && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-brief-tags">
                                    <TagCloud tagsString={brief.tags} />
                                </Appear>
                            )}
                            {brief.video && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-brief-video">
                                    <MediaFrame video={brief.video} style={{ width: phone ? "96%" : "70%" }} />
                                </Appear>
                            )}
                            {briefItems[0] && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" style={{ width: "100%" }}>
                                    <div className="pd-brief-grid">
                                        {briefItems.map((item, i) =>
                                            item ? (
                                                <div key={i} className="pd-brief-item">
                                                    {item.title && <div className="pd-kicker">{item.title}</div>}
                                                    {item.bodyHtml && <RichText html={item.bodyHtml} />}
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                </Appear>
                            )}
                            <div className="pd-space-29 pd-not-phone" />
                        </section>
                    )}

                    {/* ── Snapshot / About ─────────────────────────────────── */}
                    {snapshot && (
                        <section id="section-about" className="pd-section pd-about">
                            <SectionTitle
                                {...sectionTitleBase}
                                title="About the Game"
                                dotColor={colors.liberty}
                                lineColor={colors.liberty}
                                lineColor2="rgba(79, 88, 175, 0.3)"
                            />
                            <div className="pd-card-col">
                                {snapItems[0] && (
                                    <LiftCard>
                                        <PastelCardItem item={snapItems[0]} background="rgba(238, 151, 142, 0.88)" />
                                    </LiftCard>
                                )}
                                {snapItems[1] && (
                                    <LiftCard rotate={3}>
                                        <PastelCardItem item={snapItems[1]} background="rgba(139, 217, 195, 0.88)" />
                                    </LiftCard>
                                )}
                            </div>
                            <SectionTitle
                                {...sectionTitleBase}
                                title="Aboutmy Work"
                                dotColor={colors.teal}
                                lineColor={colors.liberty}
                                lineColor2="rgba(79, 88, 175, 0.3)"
                            />
                            <div className="pd-card-col">
                                {snapItems[2] && (
                                    <LiftCard rotate={-3}>
                                        <PastelCardItem item={snapItems[2]} background="rgb(114, 121, 191)" />
                                    </LiftCard>
                                )}
                                {snapItems[3] && (
                                    <LiftCard>
                                        <PastelCardItem item={snapItems[3]} background="rgba(238, 151, 142, 0.89)" />
                                    </LiftCard>
                                )}
                            </div>
                        </section>
                    )}

                    {/* ── UI ───────────────────────────────────────────────── */}
                    {ui && (
                        <section id="section-ui" className="pd-section pd-ui">
                            <div className="pd-space-41" />
                            {ui.title && <SectionTitle {...tangerineTitle} title={ui.title} />}
                            {ui.bodyHtml && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-ui-body">
                                    <BodyText html={ui.bodyHtml} mobileHtml={ui.bodyMobileHtml} />
                                </Appear>
                            )}
                            {galleryItems.length > 0 && (
                                <div className="pd-gallery-stage">
                                    <div className="pd-gallery">
                                        <Gallery
                                            itemCount={galleryItems.length}
                                            item1Image={galleryItems[0]?.image ?? ""}
                                            item1Title={galleryItems[0]?.title ?? ""}
                                            item2Image={galleryItems[1]?.image ?? ""}
                                            item2Title={galleryItems[1]?.title ?? ""}
                                            item3Image={galleryItems[2]?.image ?? ""}
                                            item3Title={galleryItems[2]?.title ?? ""}
                                            item4Image={galleryItems[3]?.image ?? ""}
                                            item4Title={galleryItems[3]?.title ?? ""}
                                            item5Image={galleryItems[4]?.image ?? ""}
                                            item5Title={galleryItems[4]?.title ?? ""}
                                            mode="stack"
                                            loop
                                            autoplay={false}
                                            enableDrag
                                            dragThreshold={80}
                                            imageAspectRatio="9:16"
                                            imageFit="contain"
                                            imageBgColor="rgba(232, 229, 223, 0)"
                                            cardRadius={16}
                                            cardBorderWidth={0}
                                            containerHeight={480}
                                            containerBg="rgba(242, 239, 233, 0)"
                                            showTitle
                                            titlePosition="above"
                                            titleFont="Doppio One"
                                            titleWeight="700"
                                            titleSize={18}
                                            titleColor={colors.liberty}
                                            titleBgColor="rgba(26, 21, 32, 0)"
                                            titlePadding={14}
                                            titleGapAbove={16}
                                            titleGap={16}
                                            showCounter
                                            counterFormat="{i} / {n}"
                                            counterPosition="bottom-right"
                                            counterFont="IBM Plex Mono"
                                            counterSize={11}
                                            counterColor="#fffdf8"
                                            counterBgColor="rgba(79, 89, 176, 0.8)"
                                            counterPadding="5px 10px"
                                            counterMarginTop={16}
                                            showArrows
                                            arrowPlacement="auto"
                                            arrowStyle="circle"
                                            arrowSize={40}
                                            arrowOffset={-72}
                                            arrowBg={colors.background}
                                            arrowBorderColor="rgba(79, 89, 176, 0.32)"
                                            arrowIconColor={colors.liberty}
                                            showDots
                                            dotActiveColor={colors.tangerine}
                                            dotInactiveColor="#c8c2d6"
                                            dotSize={8}
                                            navGap={16}
                                            stackPeek={32}
                                            stackRotation={4}
                                            stackOpacity={0.8}
                                        />
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* ── Prototype ────────────────────────────────────────── */}
                    {prototype && (
                        <section id="section-prototype" className="pd-section pd-prototype">
                            <div className="pd-space-4" />
                            {prototype.displayTitle && <SectionTitle {...tangerineTitle} title={prototype.displayTitle} />}
                            {prototype.bodyHtml && (
                                <div className="pd-proto-body">
                                    <BodyText html={prototype.bodyHtml} mobileHtml={prototype.bodyMobileHtml} />
                                </div>
                            )}
                            {prototype.video && (
                                <div className="pd-proto-stage">
                                    <div className="pd-proto-showcase">
                                        <ProjectShowcase
                                            itemCount={1}
                                            item1MediaType="video"
                                            item1VideoSource="file"
                                            item1VideoFile={prototype.video}
                                            item1Image={prototype.galleryItems?.[0]?.image ?? ""}
                                            item1UrlBar="unity-prototype"
                                            item1Title=""
                                            item1ShowButton={false}
                                            showHeader={false}
                                            showFooter={false}
                                            showArrows={false}
                                            showDots={false}
                                            imageAspectRatio="9:16"
                                            imageFit="contain"
                                            frameBorderColor={colors.gunmetalBlack}
                                            dotRed={colors.tangerine}
                                            dotYellow={colors.saffron}
                                            dotGreen={colors.straw}
                                            urlBarBg={colors.linen}
                                        />
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* ── Game Design ──────────────────────────────────────── */}
                    {gameDesign && snapshot && (
                        <section id="section-game-design" className="pd-section pd-gamedesign">
                            <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" style={{ width: "100%" }}>
                                <CheckerDivider color1={colors.lilac} color2={colors.tangerine} cellSize={13} rows={2} />
                            </Appear>
                            {gameDesign.displayTitle && (
                                <SectionTitle {...tangerineTitle} title={gameDesign.displayTitle} />
                            )}
                            {gameDesign.bodyHtml && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-gd-body">
                                    <BodyText html={gameDesign.bodyHtml} mobileHtml={gameDesign.bodyMobileHtml} />
                                </Appear>
                            )}
                            {(gameDesign.diagram || gameDesign.diagram2) && (
                                <div className="pd-coreloop-row">
                                    {gameDesign.diagram2 && (
                                        <div className="pd-window-loop">
                                            <RetroWindow
                                                title="CORELOOP.EXE"
                                                titleBarColor={colors.liberty}
                                                titleColor={phone ? "#ffffff" : colors.surface}
                                                bodyColor={phone ? "#ffffff" : colors.surface}
                                                bodyPadding={phone ? 6 : tablet ? 4 : 18}
                                                contentAlignH="center"
                                                contentAlignV="center"
                                                borderRadius={8}
                                                dotRed={colors.tangerine}
                                                dotYellow={colors.saffron}
                                                dotGreen={colors.straw}
                                                contentMode="frame"
                                            >
                                                <div className="pd-loop-frame">
                                                    <CoreLoopDiagram
                                                        inputMode="string"
                                                        flowString={gameDesign.diagram2}
                                                        radius={phone ? 75 : 125}
                                                        direction="cw"
                                                        closeLoop
                                                        labelPosition="inside"
                                                        nodeShape="circle"
                                                        nodeSize={phone ? 80 : 120}
                                                        fontFamily="mono"
                                                        iconSize={phone ? 18 : 19}
                                                        labelSize={phone ? 9 : 12}
                                                        labelWeight={600}
                                                        labelColor={colors.secondaryTxt}
                                                        sublabelSize={phone ? 8 : 9}
                                                        sublabelColor={colors.primaryTxt}
                                                        arrowThickness={phone ? 1.5 : 2}
                                                        arrowColor={colors.gunmetalBlack}
                                                        arrowCurve={phone ? 12 : 18}
                                                        arrowHeadSize={phone ? 8 : 10}
                                                        arrowGap={phone ? 4 : 6}
                                                        centerMode="text"
                                                        centerText={"CORE\nLOOP"}
                                                        centerSize={phone ? 52 : 40}
                                                        centerBorderWidth={0}
                                                        centerTextColor={colors.liberty}
                                                        centerTextSize={phone ? 14 : 17}
                                                        containerSize={phone ? 240 : 380}
                                                    />
                                                </div>
                                            </RetroWindow>
                                        </div>
                                    )}
                                    {gameDesign.diagram && (
                                        <div className="pd-window-flow">
                                            <RetroWindow
                                                title={phone ? "FLOWDIAGRAM.EXE" : "FLOWDIAGRAM.exe"}
                                                titleBarColor={colors.liberty}
                                                titleColor={phone ? "#ffffff" : colors.surface}
                                                bodyColor={phone ? "#ffffff" : colors.surface}
                                                bodyPadding={phone ? 20 : tablet ? 10 : 8}
                                                contentAlignH="center"
                                                contentAlignV="center"
                                                borderRadius={8}
                                                dotRed={colors.tangerine}
                                                dotYellow={colors.saffron}
                                                dotGreen={colors.straw}
                                                contentMode="frame"
                                            >
                                                <div className="pd-flow-frame">
                                                    <FlowDiagram
                                                        inputMode="string"
                                                        flowString={gameDesign.diagram}
                                                        direction="vertical"
                                                        minNodeWidth={90}
                                                        nodePaddingH={14}
                                                        nodePaddingV={8}
                                                        arrowLength={28}
                                                    />
                                                </div>
                                            </RetroWindow>
                                        </div>
                                    )}
                                </div>
                            )}
                            {gameDesign.diagram3 && (
                                <div className="pd-diagrams3">
                                    <FlowDiagram
                                        inputMode="string"
                                        flowString={gameDesign.diagram3}
                                        direction="horizontal"
                                        wrap
                                        minNodeWidth={110}
                                        nodePaddingH={26}
                                        nodePaddingV={10}
                                        arrowLength={36}
                                    />
                                </div>
                            )}
                            {featureItem && (
                                <div className="pd-features">
                                    <FeatureModuleGrid
                                        mediaPosition="left"
                                        colGap={32}
                                        rowGap={28}
                                        verticalAlign="center"
                                        mediaType="image"
                                        image={breakdown?.items?.[0]?.icon ?? ""}
                                        mediaAspectRatio="3:2"
                                        mediaFit="contain"
                                        mediaBgColor={colors.linen}
                                        showMediaBadge
                                        badgeText={featureItem.badge ?? ""}
                                        eyebrow={featureItem.subtitle ?? ""}
                                        title={featureItem.subtitle ?? ""}
                                        body={featureItem.bodyHtml ?? ""}
                                        animate="slideUp"
                                        animationTrigger="once"
                                        animationDuration={0.55}
                                        slideDistance={24}
                                    />
                                </div>
                            )}
                            {gameDesign.table && (
                                <div className="pd-table">
                                    <DecisionImpactTable
                                        inputMode="string"
                                        dslString={gameDesign.table}
                                        mode={phone ? "cards" : "rows"}
                                        maxWidth={840}
                                        showHeaders
                                        leftHeader="Design Decision"
                                        rightHeader="Gameplay Impact"
                                        leftColRatio={phone ? 40 : 38}
                                        cellPadding={phone ? 14 : 18}
                                        leftColorMode="fill"
                                        leftWeight={phone ? 600 : 700}
                                        leftSize={phone ? 15 : 18}
                                        rightWeight={phone ? 300 : 400}
                                        rightSize={phone ? 12 : 14}
                                        animate="slideUp"
                                        animationTrigger="once"
                                        animationDuration={0.5}
                                        staggerDelay={0.08}
                                        slideDistance={20}
                                    />
                                </div>
                            )}
                            {gameDesign.tags && <TagCloud tagsString={gameDesign.tags} />}
                        </section>
                    )}
                </div>
            </div>

            {/* Sticky prev / next footer bar */}
            <div className="pd-footer">
                {prevSlug ? (
                    <Link to={`/projects/${prevSlug}`} className="pd-code-link">‹ Previous</Link>
                ) : (
                    <span />
                )}
                {nextSlug && (
                    <Link to={`/projects/${nextSlug}`} className="pd-code-link pd-next">Next ›</Link>
                )}
            </div>

            <style>{`
                .pd-page {
                    width: 100%;
                    min-height: 100vh;
                    background: ${colors.background};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 160px;
                    overflow-x: clip;
                }
                .pd-scroll {
                    position: relative;
                    width: 90%;
                    max-width: 1200px;
                    padding: 20px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-sizing: border-box;
                }
                /* NotebookBackground paper — 92% x 90%, pinned to the top */
                .pd-paper {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    top: 0;
                    width: 92%;
                    height: 90%;
                    z-index: 0;
                    pointer-events: none;
                }

                .pd-backlink {
                    position: sticky;
                    top: 4px;
                    z-index: 20;
                    width: 100%;
                    padding: 21px 0 0;
                    display: flex;
                    justify-content: flex-start;
                }
                .pd-code-link {
                    font-family: "IBM Plex Mono", monospace;
                    font-size: 12px;
                    letter-spacing: -0.02em;
                    line-height: 1.8em;
                    color: ${colors.liberty};
                    text-decoration: none;
                }
                .pd-code-link:hover { text-decoration: underline; }
                .pd-next { font-weight: 500; font-size: 10.5px; }

                .pd-sections {
                    position: relative;
                    width: 80%;
                    padding: 60px 0 0 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-sizing: border-box;
                }

                /* Hero */
                .pd-hero {
                    position: sticky;
                    top: 0;
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 1;
                }
                .pd-hero-inner {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .pd-banner {
                    width: 97.2%;
                    height: 253px;
                    border-radius: 43px;
                    background-size: cover;
                    background-position: center;
                    z-index: 5;
                }

                .pd-spacer-invisible { width: 100%; height: 23vh; position: relative; z-index: 6; }

                .pd-section {
                    position: relative;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                    padding: 20px 0;
                    box-sizing: border-box;
                    z-index: 6;
                }
                .pd-brief { align-items: flex-start; }
                .pd-about { padding: 20px 0 40px; z-index: 5; }
                .pd-ui { gap: 0; z-index: 5; }
                .pd-prototype { gap: 50px; }
                .pd-gamedesign { padding: 40px 0; z-index: 6; }

                .pd-space-4 { width: 100%; height: 4px; }
                .pd-space-29 { width: 100%; height: 29px; }
                .pd-space-41 { width: 100%; height: 41px; }

                /* Brief */
                .pd-brief-body { width: 100%; padding: 10px 88px 0 20px; box-sizing: border-box; }
                .pd-brief-tags { width: 100%; padding: 4px 0 4px 20px; box-sizing: border-box; }
                .pd-brief-video { width: 100%; padding: 40px 0 4px; display: flex; justify-content: center; }
                .pd-brief-grid {
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    padding: 10px 0 0 20px;
                    box-sizing: border-box;
                }
                .pd-brief-item { width: 73%; display: flex; flex-direction: column; }
                .pd-kicker {
                    font-family: "Caveat", cursive;
                    font-weight: 600;
                    font-size: 20px;
                    line-height: 1.75em;
                    letter-spacing: -0.02em;
                    color: ${colors.mutedTxt};
                }

                /* Snapshot */
                .pd-card-col {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 20px;
                    padding: 0 10px;
                    box-sizing: border-box;
                    z-index: 4;
                }

                /* UI */
                .pd-ui-body { width: 100%; padding: 20px 0 0; box-sizing: border-box; }
                .pd-gallery-stage {
                    width: 100%;
                    height: 804px;
                    padding: 40px 0 0;
                    display: flex;
                    justify-content: center;
                    overflow: clip;
                    box-sizing: border-box;
                    z-index: 8;
                }
                .pd-gallery { width: 46%; }

                /* Prototype */
                .pd-proto-body { width: 100%; }
                .pd-proto-stage { width: 100%; height: 755px; overflow: hidden; display: flex; justify-content: center; }
                .pd-proto-showcase { width: 36%; }

                /* Game Design */
                .pd-gd-body { width: 100%; padding: 0 0 0 20px; box-sizing: border-box; }
                .pd-coreloop-row {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: flex-start;
                    gap: 54px;
                    padding: 20px;
                    box-sizing: border-box;
                }
                .pd-window-loop { flex: 1 1 0; min-width: 0; }
                .pd-window-flow { flex: 0 0 auto; }
                .pd-loop-frame { display: flex; justify-content: center; align-items: center; padding: 20px 20px 0; }
                .pd-flow-frame { width: 300px; display: flex; justify-content: center; }
                .pd-diagrams3 { width: 100%; display: flex; justify-content: center; padding: 8px 16px; box-sizing: border-box; }
                .pd-features { width: 100%; padding: 16px 16px 0; box-sizing: border-box; }
                .pd-table { width: 100%; display: flex; justify-content: center; padding: 8px 16px; box-sizing: border-box; }

                /* Sticky prev/next bar */
                .pd-footer {
                    position: sticky;
                    bottom: 25px;
                    z-index: 30;
                    width: 94%;
                    max-width: 1200px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 44px;
                    padding: 0 0 10px;
                    box-sizing: border-box;
                }

                .pd-only-phone { display: none; }

                /* ── Tablet (810–1199) ─────────────────────────────────── */
                @media (max-width: 1199.98px) {
                    .pd-coreloop-row { flex-direction: column; align-items: center; gap: 34px; }
                    .pd-window-loop, .pd-window-flow { width: auto; max-width: 100%; flex: 0 0 auto; }
                }

                /* ── Phone (≤809) ──────────────────────────────────────── */
                @media (max-width: 809.98px) {
                    .pd-not-phone { display: none !important; }
                    .pd-only-phone { display: block; }
                    .pd-sections { padding: 60px 0 0; }
                    .pd-hero { overflow: clip; padding: 20px 8px; box-sizing: border-box; }
                    .pd-banner { width: 174%; max-width: none; height: 90px; }
                    .pd-spacer-invisible { height: 8vh; }
                    .pd-section { padding: 20px 8px; }
                    .pd-about { padding: 20px 8px; }
                    .pd-gamedesign { padding: 20px 8px; }
                    .pd-brief-body { padding: 0 8px 0 16px; }
                    .pd-brief-grid { padding: 0 0 0 10px; }
                    .pd-brief-item { width: 98%; }
                    .pd-gd-body { padding: 0 0 0 16px; }
                    .pd-coreloop-row { flex-direction: column; align-items: center; gap: 21px; padding: 8px; width: 98%; }
                    .pd-flow-frame { width: 195px; }
                    .pd-loop-frame { padding: 8px 8px 0; }
                    .pd-gallery { width: 76%; }
                    .pd-gallery-stage { overflow: visible; }
                    .pd-proto-showcase { width: 80%; }
                    .pd-footer { flex-direction: column; gap: 8px; }
                }
            `}</style>
        </div>
    )
}

// Snapshot pastel card with the template's shared styling; only background
// and rotation vary between the four instances.
function PastelCardItem({ item, background }: { item: SectionItem; background: string }) {
    return (
        <PastelCard
            label={item.subtitle ?? ""}
            title={item.title ?? ""}
            body={item.bodyHtml ?? ""}
            backgroundColor={background}
            padding={24}
            borderColor="#1a1520"
            borderWidth={2}
            borderRadius={16}
            showShadow
            shadowColor="#1a1520"
            shadowOffsetX={4}
            shadowOffsetY={4}
            contentGap={0}
            labelTitleGap={0}
            titleBodyGap={0}
            showLabel={false}
            showTitle
            titleFont="System"
            titleWeight="700"
            titleSize={22}
            titleColor="#1a1520"
            titleLineHeight={1.15}
            showBody
            bodyFont="IBM Plex Mono"
            bodyWeight="400"
            bodySize={15}
            bodyColor="#1a1520"
            bodyLineHeight={1.5}
        />
    )
}
