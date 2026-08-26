import { useRef } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import type { MotionValue } from "framer-motion"
import { getProject, getPublicProject, publicProjects } from "../data/projects"
import { projectSections } from "../data/projectSections"
import type { ProjectSection, ProjectSectionsMap, SectionItem, SubSection } from "../data/projectSections"
import { colors } from "../tokens"
import { scrollToElement } from "../lib/scroll"
import { useBreakpoint } from "../hooks/useBreakpoint"
import { pick, useLocale, useLocalePath, useT } from "../lib/i18n"
import type { L10n } from "../lib/i18n"
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
import ExternalLink from "../components/ExternalLink"
import PageEnter from "../components/PageEnter"

/**
 * One layout for every public project detail page: sticky hero, then Brief /
 * About (Snapshot) / Game Design / Development / VFX / UI sections. Every block
 * is conditional on its own section data, so a project renders only the
 * sections it has content for. Draft projects never render here — a draft slug
 * behaves like an unknown one.
 */

// Shared SectionTitle configuration; only the dot/line accents differ per use.
const sectionTitleBase = {
    layout: "inline-line",
    animation: "typewriter",
    animationTrigger: "once",
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

// Subsection headings: Ivory Blue dot, no gradient line.
const subsectionTitle = {
    ...sectionTitleBase,
    dotColor: "rgb(114, 121, 191)",
    showLine: false,
    lineColor: colors.tangerine,
    lineColor2: "rgba(238, 151, 142, 0.3)",
}

// Shared FeatureModule styling; per-slot layout numbers (mediaColumnWidth,
// stackedMediaWidth, mediaPosition) vary per call.
const featureBase = {
    colGap: 28,
    rowGap: 24,
    breakpointBelow: 720,
    stackedOrder: "mediaFirst",
    stackedAspectRatio: "inherit",
    mediaType: "image",
    mediaAspectRatio: "3:2",
    mediaFit: "cover",
    mediaBgColor: "#f5eee6",
    mediaBorderWidth: 2,
    mediaBorderColor: "#1a1520",
    showMediaShadow: true,
    mediaShadowX: 5,
    mediaShadowY: 5,
    mediaShadowColor: "#1a1520",
    showMediaBadge: false,
    panelScope: "module",
    textBg: "rgba(0, 0, 0, 0)",
    showFrame: false,
    contentGap: 12,
    accentColor: "#D4DF68",
    eyebrowFont: "IBM Plex Mono",
    eyebrowSize: 11,
    eyebrowTracking: 0.12,
    eyebrowColor: "#4F58AF",
    eyebrowUppercase: true,
    titleFont: "Fredoka",
    titleWeight: 700,
    titleSize: 22,
    titleColor: "#1a1520",
    titleLineHeight: 1.2,
    bodyFont: "Anonymous Pro",
    bodyWeight: 400,
    bodySize: 15,
    bodyColor: "#1a1520",
    bodyLineHeight: 1.65,
    animate: "slideUp",
    animationTrigger: "once",
    animationDuration: 0.55,
    slideDistance: 24,
} as const

// Hover lift used by the snapshot pastel cards (rotation is preserved).
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

// How far a section lifts as it leaves, on top of the scroll itself. Enough to
// clear the viewport ahead of the section below it, small enough that the gap it
// opens reads as more of the page underneath.
const SECTION_LIFT = -160

/**
 * Scroll-linked exit for a whole project section.
 *
 * Progress tracks the section leaving through the top of the viewport: 0 while
 * its bottom edge is still at or below the viewport bottom, 1 once that edge has
 * passed the viewport top. Anchoring on the section's own exit — rather than on
 * its arrival — is what keeps a heading at full strength for as long as it is on
 * screen, and what stops one section's content from drifting into the band of
 * the next.
 */
function useSectionExit(target: React.RefObject<HTMLElement | null>): {
    y: MotionValue<number>
    opacity: MotionValue<number>
} {
    const { scrollYProgress } = useScroll({
        target: target as React.RefObject<HTMLElement>,
        offset: ["end end", "end start"],
    })
    const smooth = useSpring(scrollYProgress, { stiffness: 500, damping: 60 })
    const reduce = useReducedMotion()
    const y = useTransform(smooth, [0, 1], [0, reduce ? 0 : SECTION_LIFT])
    // Held at full opacity through the first part of the exit so the fade reads
    // as the section leaving rather than as it dimming in place.
    const opacity = useTransform(smooth, [0.35, 1], [1, 0])
    return { y, opacity }
}

/**
 * One project section. Everything the section owns — its checker divider
 * included — sits in a single transformed layer, so the section enters, moves
 * and leaves as one piece instead of each block animating on its own clock.
 */
function ProjectSection({
    id,
    variant,
    showDivider = true,
    children,
}: {
    id: string
    variant: string
    showDivider?: boolean
    children: React.ReactNode
}) {
    const ref = useRef<HTMLElement | null>(null)
    const { y, opacity } = useSectionExit(ref)
    return (
        <section id={id} ref={ref} className={`pd-section ${variant}`}>
            <motion.div className="pd-section-inner" style={{ y, opacity }}>
                {showDivider && (
                    // Painted directly rather than behind a viewport reveal: the
                    // divider marks where the section begins, so it has to be
                    // there whenever the section is, and it already travels with
                    // the section through this wrapper.
                    <div className="pd-divider">
                        <CheckerDivider color1={colors.lilac} color2={colors.tangerine} cellSize={13} rows={2} />
                    </div>
                )}
                {children}
            </motion.div>
        </section>
    )
}

export default function ProjectDetail() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const bp = useBreakpoint()
    const phone = bp === "phone"
    const tablet = bp === "tablet"
    const locale = useLocale()
    const t = useT()
    const lp = useLocalePath()
    const L = (v?: L10n) => pick(locale, v)

    const project = getPublicProject(slug)
    const knownButDraft = !project && Boolean(getProject(slug))
    const sections: ProjectSectionsMap = (slug && projectSections[slug]) || {}
    const { brief, snapshot, gameDesign, development, vfx, ui } = sections
    const hasSections = Boolean(brief || snapshot || gameDesign || development || vfx || ui)

    // The hero is sticky underneath the sections, which are transparent, so it
    // fades / translates out (and the banner+tags scale down) as the first
    // section scrolls over it.
    const { scrollY } = useScroll()
    const fadeRange = typeof window !== "undefined" ? window.innerHeight * 0.85 : 800
    const heroOpacity = useTransform(scrollY, [0, fadeRange], [1, hasSections ? 0 : 1])
    const heroY = useTransform(scrollY, [0, fadeRange], [0, hasSections ? (phone ? -100 : -414) : 0])
    const heroScale = useTransform(scrollY, [0, fadeRange], [1, hasSections && !phone ? 0.6 : 1])

    if (!project) {
        // Draft projects and unknown slugs share the same public dead end.
        void knownButDraft
        return (
            <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
                <h1 style={{ fontFamily: '"Fredoka One", "Fredoka", cursive', color: colors.primaryTxt }}>{t("projectNotFound")}</h1>
                <Link to={lp("/")} style={{ color: colors.liberty }}>{t("backHome")}</Link>
            </div>
        )
    }

    // Prev / next follow the CMS collection order, drafts excluded.
    const idx = publicProjects.findIndex((p) => p.slug === project.slug)
    const prev = idx > 0 ? publicProjects[idx - 1] : undefined
    const next = idx >= 0 && idx < publicProjects.length - 1 ? publicProjects[idx + 1] : undefined

    const goToHomeProjects = () => {
        navigate(lp("/"))
        // The home page has to mount and lay out before its sections can be
        // measured; two frames is the first point at which that is true.
        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                const el = document.getElementById("projects")
                if (el) scrollToElement(el)
            })
        )
    }

    const briefItems = (brief?.items ?? []).slice(0, 2)
    const snapItems = snapshot?.items ?? []
    const galleryItems = (ui?.galleryItems ?? []).slice(0, 5)
    const uiFeatureItems = (ui?.subsections?.[0]?.items ?? []).slice(0, 4)
    const vfxFeatureItems = (vfx?.subsections?.[0]?.items ?? []).slice(0, 3)
    const gdFeatureItem = gameDesign?.items?.[0]

    return (
        <div className="pd-page">
            <PageEnter className="pd-scroll">
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
                        href={`#${lp("/")}`}
                        onClick={(e) => { e.preventDefault(); goToHomeProjects() }}
                        className="pd-code-link"
                    >
                        {t("backLink")}
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
                                    title={L(project.title)}
                                    year={L(project.year)}
                                    tracks={L(project.tracks)}
                                    tagline={L(project.tagline)}
                                    stack={L(project.stack)}
                                    context={L(project.context)}
                                    role={L(project.role)}
                                    animation="wordByWord"
                                    animationTrigger="once"
                                    animationDuration={0.6}
                                    elementStagger={0.1}
                                    staggerDelay={0.04}
                                    showBackLink={false}
                                    yearPosition="inline-right"
                                    stackLabel={t("toolsLabel")}
                                    contextLabel={t("contextLabel")}
                                    roleLabel={t("roleLabel")}
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
                            {project.tags && (
                                <motion.div style={{ scale: heroScale }} className="pd-hero-tags">
                                    <Appear transition="tween 0.44,0,0.56,1 0.5s 0.55s">
                                        <TagCloud tagsString={L(project.tags)} />
                                    </Appear>
                                </motion.div>
                            )}
                            {project.cover && (
                                <motion.div style={{ scale: heroScale, width: "100%", display: "flex", justifyContent: "center" }}>
                                    <Appear transition="tween 0.44,0,0.56,1 0.5s 0.5s" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                        <div className="pd-banner" style={{ backgroundImage: `url(${project.cover})` }} />
                                    </Appear>
                                </motion.div>
                            )}
                        </motion.div>
                    </section>

                    {/* Empty spacer that gives the hero room to fade out before Brief. */}
                    {snapshot && <div id="section-invisible" className="pd-spacer-invisible" />}

                    {/* ── Brief ────────────────────────────────────────────── */}
                    {brief && (
                        <ProjectSection id="section-brief" variant="pd-brief" showDivider={false}>
                            {brief.displayTitle && (
                                <SectionTitle {...tangerineTitle} title={L(brief.displayTitle)} />
                            )}
                            {brief.bodyHtml && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-brief-body">
                                    <BodyText locale={locale} html={brief.bodyHtml} mobileHtml={brief.bodyMobileHtml} />
                                </Appear>
                            )}
                            <div className="pd-brief-cta">
                                <ExternalLink
                                    label={t("playPrototype")}
                                    href="https://valelizu.itch.io/goblin-td"
                                    newTab
                                    bracketStyle="None"
                                    leadStyle="Play"
                                    trailStyle="Arrow up-right"
                                    glyphGap={8}
                                    font="IBM Plex Mono"
                                    fontSize={14}
                                    fontWeight={700}
                                    letterSpacing={0.02}
                                    textColor={colors.border}
                                    fill="rgb(114, 121, 191)"
                                    radius={999}
                                    paddingX={18}
                                    paddingY={8}
                                    borderWidth={2}
                                    borderStyle="solid"
                                    borderColor={colors.libertyHover}
                                    shadowOn
                                    shadowX={3}
                                    shadowY={3}
                                    shadowColor="#1C1B22"
                                    hoverEffect="Nudge arrow"
                                    hoverArrowShift={2}
                                />
                            </div>
                            {brief.tags && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-brief-tags">
                                    <TagCloud tagsString={L(brief.tags)} />
                                </Appear>
                            )}
                            {brief.video && (
                                // The clip is the tallest block on the page, so it
                                // reveals as soon as any of it is on screen and
                                // then stays put — the default half-visible
                                // threshold leaves it blank for most of its scroll.
                                <Appear
                                    trigger="inView"
                                    once
                                    threshold={0.05}
                                    transition="spring-duration 0.4s 0.2 0s"
                                    className="pd-brief-video"
                                >
                                    <MediaFrame video={brief.video} style={{ width: phone ? "96%" : "70%" }} />
                                </Appear>
                            )}
                            {briefItems[0] && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" style={{ width: "100%" }}>
                                    <div className="pd-brief-grid">
                                        {briefItems.map((item, i) =>
                                            item ? (
                                                <div key={i} className="pd-brief-item">
                                                    {item.displayTitle && <div className="pd-kicker">{L(item.displayTitle)}</div>}
                                                    {item.bodyHtml && <RichText html={L(item.bodyHtml)} />}
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                </Appear>
                            )}
                            <div className="pd-space-29 pd-not-phone" />
                        </ProjectSection>
                    )}

                    {/* ── Snapshot / About ─────────────────────────────────── */}
                    {snapshot && (
                        <ProjectSection id="section-about" variant="pd-about">
                            <div style={{ width: "100%" }}>
                                <SectionTitle
                                    {...sectionTitleBase}
                                    title={t("aboutTheGame")}
                                    dotColor={colors.liberty}
                                    lineColor={colors.liberty}
                                    lineColor2="rgba(79, 88, 175, 0.3)"
                                />
                            </div>
                            <div className="pd-card-col">
                                {snapItems[0] && (
                                    <Appear trigger="inView" threshold={0.2} transition="spring-duration 0.6s 0.2 0s" style={{ width: "100%" }}>
                                        <LiftCard>
                                            <PastelCardItem locale={locale} item={snapItems[0]} background="rgba(238, 151, 142, 0.88)" />
                                        </LiftCard>
                                    </Appear>
                                )}
                                {snapItems[1] && (
                                    <Appear trigger="inView" threshold={0.2} transition="spring-duration 0.6s 0.2 0.1s" style={{ width: "100%" }}>
                                        <LiftCard rotate={3}>
                                            <PastelCardItem locale={locale} item={snapItems[1]} background="rgba(139, 217, 195, 0.88)" />
                                        </LiftCard>
                                    </Appear>
                                )}
                            </div>
                            <div style={{ width: "100%" }}>
                                <SectionTitle
                                    {...sectionTitleBase}
                                    title={t("aboutMyWork")}
                                    dotColor={colors.teal}
                                    lineColor={colors.liberty}
                                    lineColor2="rgba(79, 88, 175, 0.3)"
                                />
                            </div>
                            <div className="pd-card-col">
                                {snapItems[2] && (
                                    <Appear trigger="inView" threshold={0.2} transition="spring-duration 0.6s 0.2 0s" style={{ width: "100%" }}>
                                        <LiftCard rotate={-3}>
                                            <PastelCardItem locale={locale} item={snapItems[2]} background="rgb(114, 121, 191)" />
                                        </LiftCard>
                                    </Appear>
                                )}
                                {snapItems[3] && (
                                    <Appear trigger="inView" threshold={0.2} transition="spring-duration 0.6s 0.2 0.1s" style={{ width: "100%" }}>
                                        <LiftCard>
                                            <PastelCardItem locale={locale} item={snapItems[3]} background="rgba(238, 151, 142, 0.89)" />
                                        </LiftCard>
                                    </Appear>
                                )}
                            </div>
                        </ProjectSection>
                    )}

                    {/* ── Game Design ──────────────────────────────────────── */}
                    {gameDesign && (
                        <ProjectSection id="section-game-design" variant="pd-gamedesign">
                            {gameDesign.displayTitle && (
                                <div style={{ width: "100%" }}>
                                    <SectionTitle {...tangerineTitle} title={L(gameDesign.displayTitle)} />
                                </div>
                            )}
                            {gameDesign.bodyHtml && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-gd-body">
                                    <BodyText locale={locale} html={gameDesign.bodyHtml} mobileHtml={gameDesign.bodyMobileHtml} />
                                </Appear>
                            )}
                            {(gameDesign.diagram1 || gameDesign.diagram2 || gameDesign.diagram3) && (
                                <div className="pd-coreloop-row">
                                    {/* Window order flips on phone: CORELOOP first. */}
                                    {gameDesign.diagram1 && !phone && (
                                        <FlowWindow locale={locale} diagram={gameDesign.diagram1} phone={false} bodyPadding={tablet ? 10 : 8} />
                                    )}
                                    {gameDesign.diagram2 && (
                                        <LoopWindow
                                            locale={locale}
                                            diagram={gameDesign.diagram2}
                                            phone={phone}
                                            bodyPadding={phone ? 6 : tablet ? 4 : 18}
                                            title="CORELOOP.EXE"
                                            centerText={t("coreLoopCenter")}
                                            curve={phone ? 12 : 18}
                                        />
                                    )}
                                    {gameDesign.diagram1 && phone && (
                                        <FlowWindow locale={locale} diagram={gameDesign.diagram1} phone bodyPadding={20} />
                                    )}
                                    {gameDesign.diagram3 && (
                                        <LoopWindow
                                            locale={locale}
                                            diagram={gameDesign.diagram3}
                                            phone={phone}
                                            bodyPadding={18}
                                            title={t("metaLoopWindow")}
                                            centerText={t("metaLoopCenter")}
                                            curve={phone ? 4 : 6}
                                            arrowHeadSize={phone ? 7 : 10}
                                            arrowGap={phone ? 3 : 6}
                                            radiusOverride={phone ? 80 : 125}
                                        />
                                    )}
                                </div>
                            )}
                            {gdFeatureItem && (
                                <div className="pd-features">
                                    <FeatureModuleGrid
                                        {...featureBase}
                                        mediaPosition="left"
                                        mediaColumnWidth={50}
                                        colGap={32}
                                        rowGap={28}
                                        verticalAlign="center"
                                        stackedMediaWidth={65}
                                        stackedMediaAlign="left"
                                        stackedTextScale={0.9}
                                        mediaFit="contain"
                                        mediaRadius={tablet ? 15 : 16}
                                        image={gdFeatureItem.icon ?? ""}
                                        showMediaBadge
                                        badgeText={L(gdFeatureItem.badge)}
                                        badgeTextColor="#1a1520"
                                        eyebrow={L(gdFeatureItem.subtitle)}
                                        title={L(gdFeatureItem.displayTitle)}
                                        body={L(gdFeatureItem.bodyHtml)}
                                        panelScope="text"
                                        textPadding={0}
                                        textRadius={0}
                                        titleSize={28}
                                    />
                                </div>
                            )}
                            {gameDesign.table && (
                                <div className="pd-table">
                                    <ImpactTable locale={locale} phone={phone} dsl={gameDesign.table}
                                        leftHeader={t("tableLeftHeader")} rightHeader={t("tableRightHeader")} />
                                </div>
                            )}
                            {gameDesign.tags && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s">
                                    <TagCloud tagsString={L(gameDesign.tags)} />
                                </Appear>
                            )}
                        </ProjectSection>
                    )}

                    {/* ── Development ──────────────────────────────────────── */}
                    {development && (
                        <ProjectSection id="section-development" variant="pd-development">
                            {development.displayTitle && (
                                <div style={{ width: "100%" }}>
                                    <SectionTitle {...tangerineTitle} title={L(development.displayTitle)} />
                                </div>
                            )}
                            {development.bodyHtml && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-gd-body">
                                    <RichText html={L(development.bodyHtml)} />
                                </Appear>
                            )}
                            {development.subsections?.[0] && (
                                <div className="pd-subsections">
                                    {development.subsections.map((sub, i) =>
                                        sub ? (
                                            <DevSubsection
                                                key={sub.id}
                                                locale={locale}
                                                sub={sub}
                                                index={i}
                                                phone={phone}
                                                tablet={tablet}
                                                tableLeftHeader={t("tableLeftHeader")}
                                                tableRightHeader={t("tableRightHeader")}
                                            />
                                        ) : null
                                    )}
                                </div>
                            )}
                        </ProjectSection>
                    )}

                    {/* ── VFX ──────────────────────────────────────────────── */}
                    {vfx && (
                        <ProjectSection id="section-vfx" variant="pd-vfx">
                            {vfx.displayTitle && (
                                <div style={{ width: "100%" }}>
                                    <SectionTitle {...tangerineTitle} title={L(vfx.displayTitle)} />
                                </div>
                            )}
                            {vfx.bodyHtml && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-vfx-body">
                                    <RichText html={L(vfx.bodyHtml)} />
                                </Appear>
                            )}
                            {vfxFeatureItems.some(Boolean) && (
                                <div className="pd-feature-col">
                                    {vfxFeatureItems.map((item, i) =>
                                        item ? (
                                            <FeatureModuleGrid
                                                key={item.id}
                                                {...featureBase}
                                                mediaPosition={i % 2 === 0 ? "left" : "right"}
                                                mediaColumnWidth={50}
                                                verticalAlign="center"
                                                stackedMediaWidth={phone ? 100 : tablet ? 60 : 40}
                                                stackedMediaAlign={phone ? "center" : "left"}
                                                stackedTextScale={phone ? 0.85 : 0.9}
                                                mediaRadius={tablet ? 15 : 16}
                                                image={item.icon ?? ""}
                                                eyebrow=""
                                                title={L(item.displayTitle)}
                                                body={L(item.bodyHtml)}
                                                textPadding={phone ? 4 : 10}
                                                textRadius={phone ? 16 : 22}
                                            />
                                        ) : null
                                    )}
                                </div>
                            )}
                        </ProjectSection>
                    )}

                    {/* ── UI ───────────────────────────────────────────────── */}
                    {ui && (
                        <ProjectSection id="section-ui" variant="pd-ui">
                            {/* This heading reads the section's `title`, not its
                                `displayTitle` like the other sections. */}
                            {ui.title && (
                                <div style={{ width: "100%" }}>
                                    <SectionTitle {...tangerineTitle} title={L(ui.title)} />
                                </div>
                            )}
                            {ui.bodyHtml && (
                                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-ui-body">
                                    <BodyText locale={locale} html={ui.bodyHtml} mobileHtml={ui.bodyMobileHtml} />
                                </Appear>
                            )}
                            {uiFeatureItems.some(Boolean) && (
                                <div className="pd-feature-col pd-ui-features">
                                    {uiFeatureItems.map((item, i) =>
                                        item ? (
                                            <FeatureModuleGrid
                                                key={item.id}
                                                {...featureBase}
                                                mediaPosition={i % 2 === 0 ? "right" : "left"}
                                                mediaColumnWidth={tablet ? 70 : 35}
                                                verticalAlign="center"
                                                stackedMediaWidth={phone ? 100 : tablet ? 60 : 20}
                                                stackedMediaAlign={phone ? "center" : "left"}
                                                stackedTextScale={phone ? 0.85 : 0.9}
                                                mediaRadius={tablet ? 15 : 16}
                                                image={item.icon ?? ""}
                                                eyebrow=""
                                                title={L(item.displayTitle)}
                                                body={L(item.bodyHtml)}
                                                textPadding={phone ? 4 : 10}
                                                textRadius={phone ? 16 : 22}
                                            />
                                        ) : null
                                    )}
                                </div>
                            )}
                            {galleryItems.length > 0 && (
                                <div className="pd-gallery-stage">
                                    <div className="pd-gallery">
                                        <Gallery
                                            itemCount={galleryItems.length}
                                            item1Image={galleryItems[0]?.image ?? ""}
                                            item1Title={L(galleryItems[0]?.title)}
                                            item2Image={galleryItems[1]?.image ?? ""}
                                            item2Title={L(galleryItems[1]?.title)}
                                            item3Image={galleryItems[2]?.image ?? ""}
                                            item3Title={L(galleryItems[2]?.title)}
                                            item4Image={galleryItems[3]?.image ?? ""}
                                            item4Title={L(galleryItems[3]?.title)}
                                            item5Image={galleryItems[4]?.image ?? ""}
                                            item5Title={L(galleryItems[4]?.title)}
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
                        </ProjectSection>
                    )}
                </div>
            </PageEnter>

            {/* Sticky prev / next footer bar (public projects, CMS order) */}
            <div className="pd-footer">
                {prev ? (
                    <Link to={lp(`/projects/${prev.slug}`)} className="pd-code-link">{t("prevProject")}</Link>
                ) : (
                    <span />
                )}
                {next && (
                    <Link to={lp(`/projects/${next.slug}`)} className="pd-code-link pd-next">{t("nextProject")}</Link>
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
                    z-index: 2;
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
                .pd-hero-tags {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    overflow: clip;
                }
                .pd-banner {
                    width: 97.2%;
                    height: 366px;
                    border-radius: 43px;
                    background-size: cover;
                    background-position: center;
                    z-index: 5;
                }

                .pd-spacer-invisible { width: 100%; height: 23vh; position: relative; z-index: 6; }

                /* The outer element holds the section's place in the flow; the
                   inner one is the single layer that moves and fades on exit, so
                   the divider and the content can never separate. */
                .pd-section {
                    position: relative;
                    width: 100%;
                    padding: 20px 0;
                    box-sizing: border-box;
                    z-index: 6;
                }
                .pd-section-inner {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                }
                /* Decorative layer: above the paper, below the content. */
                .pd-divider { position: relative; z-index: 1; width: 100%; flex-shrink: 0; }
                .pd-brief { z-index: 6; }
                .pd-brief .pd-section-inner { align-items: flex-start; }
                .pd-about { padding: 20px 0 40px; z-index: 5; }
                .pd-gamedesign { padding: 40px 0; z-index: 1; }
                .pd-development { padding: 40px 0; z-index: 1; }
                .pd-vfx { padding: 44px 0 0; z-index: 6; }
                .pd-vfx .pd-section-inner { gap: 40px; }
                .pd-ui { padding: 101px 0 20px; z-index: 5; }
                .pd-ui .pd-section-inner { gap: 40px; }

                .pd-space-29 { width: 100%; height: 29px; }

                /* Brief */
                .pd-brief-body { width: 100%; padding: 10px 88px 0 20px; box-sizing: border-box; }
                .pd-brief-cta { width: 100%; padding: 6px 6px 6px 20px; box-sizing: border-box; display: flex; justify-content: flex-start; }
                .pd-brief-tags { width: 100%; padding: 2px 0 4px 20px; box-sizing: border-box; display: flex; justify-content: center; }
                .pd-brief-video { width: 100%; padding: 40px 0 4px; display: flex; justify-content: center; overflow: hidden; }
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

                /* Game Design / Development */
                .pd-gd-body { width: 100%; padding: 0 0 0 20px; box-sizing: border-box; }
                .pd-coreloop-row {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    gap: 64px 32px;
                    padding: 20px;
                    box-sizing: border-box;
                }
                .pd-loop-frame { display: flex; justify-content: center; align-items: center; padding: 20px 20px 0; }
                .pd-flow-frame { width: 300px; display: flex; justify-content: center; }
                .pd-features { width: 100%; padding: 16px 16px 0; box-sizing: border-box; }
                .pd-feature-col {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    padding: 8px;
                    box-sizing: border-box;
                }
                .pd-ui-features { gap: 12px; }
                .pd-table { width: 100%; display: flex; justify-content: center; padding: 8px 16px; box-sizing: border-box; }

                .pd-subsections {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .pd-subsection {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                    padding: 16px;
                    box-sizing: border-box;
                }
                .pd-sub-features {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    padding: 8px;
                    box-sizing: border-box;
                }
                .pd-sub-diagram {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    padding: 16px 0 8px;
                    box-sizing: border-box;
                }

                /* VFX / UI */
                .pd-vfx-body { width: 100%; box-sizing: border-box; }
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
                }

                /* ── Phone (≤809) ──────────────────────────────────────── */
                @media (max-width: 809.98px) {
                    .pd-not-phone { display: none !important; }
                    .pd-only-phone { display: block; }
                    /* Phones trade the desktop reading column for a near
                       full-width grid: one small gutter on the page and none
                       repeated inside the blocks, so media, diagrams and text
                       share the same edges. */
                    .pd-scroll { width: 100%; }
                    .pd-sections { width: 100%; padding: 60px 16px 0; }
                    .pd-backlink { padding: 21px 16px 0; }
                    .pd-subsection { padding: 16px 0; }
                    .pd-sub-features { padding: 8px 0; }
                    .pd-features { padding: 16px 0 0; }
                    .pd-feature-col { padding: 8px 0; }
                    .pd-table { padding: 8px 0; }
                    .pd-card-col { padding: 0; }
                    .pd-brief-cta { padding: 6px 0; }
                    .pd-brief-tags { padding: 2px 0 4px; }
                    .pd-hero { overflow: clip; padding: 20px 0; box-sizing: border-box; }
                    .pd-banner { width: 174%; max-width: none; height: 90px; }
                    .pd-spacer-invisible { height: 8vh; }
                    .pd-section { padding: 20px 0; }
                    .pd-about { padding: 20px 0; }
                    .pd-gamedesign { padding: 20px 0; }
                    .pd-development { padding: 20px 0; }
                    .pd-brief-body { padding: 0; }
                    .pd-brief-grid { padding: 0; }
                    .pd-brief-item { width: 98%; }
                    .pd-gd-body { padding: 0; }
                    .pd-coreloop-row { flex-direction: column; align-items: center; gap: 21px; padding: 8px; width: 98%; }
                    .pd-flow-frame { width: 191px; }
                    .pd-loop-frame { padding: 8px 8px 0; }
                    .pd-gallery { width: 76%; }
                    .pd-gallery-stage { overflow: visible; }
                    .pd-footer { flex-direction: column; gap: 8px; }
                }
            `}</style>
        </div>
    )
}

// Renders both body variants and lets CSS pick one, so the copy swaps at the
// phone breakpoint without a resize listener re-rendering the whole page.
function BodyText({ locale, html, mobileHtml }: { locale: "en" | "es"; html?: L10n; mobileHtml?: L10n }) {
    const desktop = html ? pick(locale, html) : ""
    const mobile = mobileHtml ? pick(locale, mobileHtml) : ""
    if (!desktop && !mobile) return null
    return (
        <>
            {desktop && (
                <div className={mobile ? "pd-not-phone" : undefined} style={{ width: "100%" }}>
                    <RichText html={desktop} />
                </div>
            )}
            {mobile && (
                <div className="pd-only-phone" style={{ width: "100%" }}>
                    <RichText html={mobile} />
                </div>
            )}
        </>
    )
}

// Snapshot pastel card; only background and rotation vary between the four
// instances.
function PastelCardItem({ locale, item, background }: { locale: "en" | "es"; item: SectionItem; background: string }) {
    return (
        <PastelCard
            label={pick(locale, item.subtitle)}
            title={pick(locale, item.displayTitle)}
            body={pick(locale, item.bodyHtml)}
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

// FLOWDIAGRAM.exe retro window (vertical flow of Diagram 1).
function FlowWindow({ locale, diagram, phone, bodyPadding }: { locale: "en" | "es"; diagram: L10n; phone: boolean; bodyPadding: number }) {
    return (
        <div className="pd-window-flow">
            <RetroWindow
                title={phone ? "FLOWDIAGRAM.EXE" : "FLOWDIAGRAM.exe"}
                titleBarColor={colors.liberty}
                titleColor={phone ? "#ffffff" : colors.surface}
                bodyColor={phone ? "#ffffff" : colors.surface}
                bodyPadding={bodyPadding}
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
                        flowString={pick(locale, diagram)}
                        direction="vertical"
                        minNodeWidth={90}
                        nodePaddingH={14}
                        nodePaddingV={8}
                        nodeFontSize={12}
                        arrowThickness={2}
                        arrowLength={28}
                    />
                </div>
            </RetroWindow>
        </div>
    )
}

// CORELOOP.EXE / META_PROGRESSION_LOOP.EXE retro window (circular diagram).
function LoopWindow({
    locale, diagram, phone, bodyPadding, title, centerText, curve,
    arrowHeadSize, arrowGap, radiusOverride,
}: {
    locale: "en" | "es"
    diagram: L10n
    phone: boolean
    bodyPadding: number
    title: string
    centerText: string
    curve: number
    arrowHeadSize?: number
    arrowGap?: number
    radiusOverride?: number
}) {
    return (
        <div className="pd-window-loop">
            <RetroWindow
                title={title}
                titleBarColor={colors.liberty}
                titleColor={phone ? "#ffffff" : colors.surface}
                bodyColor={phone ? "#ffffff" : colors.surface}
                bodyPadding={bodyPadding}
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
                        flowString={pick(locale, diagram)}
                        radius={radiusOverride ?? (phone ? 75 : 125)}
                        direction={phone ? "cw" : "ccw"}
                        closeLoop
                        labelPosition="inside"
                        nodeShape="circle"
                        nodeSize={phone ? 84 : 132}
                        fontFamily="mono"
                        iconSize={phone ? 18 : 19}
                        labelSize={phone ? 8 : 14}
                        labelWeight={600}
                        labelColor={colors.secondaryTxt}
                        sublabelSize={phone ? 7 : 10}
                        sublabelColor={colors.primaryTxt}
                        arrowThickness={phone ? 1.5 : 2}
                        arrowColor={colors.gunmetalBlack}
                        arrowCurve={curve}
                        arrowHeadSize={arrowHeadSize ?? (phone ? 8 : 10)}
                        arrowGap={arrowGap ?? (phone ? 4 : 6)}
                        centerMode="text"
                        centerText={centerText}
                        centerSize={phone ? 52 : 40}
                        centerBorderWidth={0}
                        centerTextColor={colors.liberty}
                        centerTextSize={phone ? 14 : 17}
                        containerSize={phone ? 240 : 380}
                    />
                </div>
            </RetroWindow>
        </div>
    )
}

// Decision/impact table with the page's shared styling.
function ImpactTable({ locale, phone, dsl, leftHeader, rightHeader }: {
    locale: "en" | "es"; phone: boolean; dsl: L10n; leftHeader: string; rightHeader: string
}) {
    return (
        <DecisionImpactTable
            inputMode="string"
            dslString={pick(locale, dsl)}
            mode={phone ? "cards" : "rows"}
            maxWidth={840}
            showHeaders
            leftHeader={leftHeader}
            rightHeader={rightHeader}
            leftColRatio={phone ? 40 : 38}
            rowGap={14}
            colGap={12}
            cellPadding={phone ? 14 : 18}
            surfaceColor="#fffdf8"
            borderColor="#1a1520"
            borderWidth={2}
            cornerRadius={16}
            showShadow
            shadowX={5}
            shadowY={5}
            shadowColor="#1a1520"
            leftColorMode="fill"
            leftTintOpacity={0.22}
            arrowColor="#1a1520"
            arrowSize={32}
            showIcon
            iconSize={20}
            leftFont="Fredoka"
            leftWeight={phone ? 600 : 700}
            leftSize={phone ? 15 : 18}
            leftColor="#1a1520"
            leftLineHeight={1.25}
            rightFont="Anonymous Pro"
            rightWeight={phone ? 300 : 400}
            rightSize={phone ? 12 : 14}
            rightColor="#1a1520"
            rightLineHeight={1.6}
            animate="slideUp"
            animationTrigger="once"
            animationDuration={0.5}
            staggerDelay={0.08}
            slideDistance={20}
        />
    )
}

/**
 * One Development subsection: heading, body, feature items, diagram, table.
 *
 * A diagram documents the first item, so it renders directly after it: a
 * subsection with one item reads item → diagram, one with several reads
 * item 1 → diagram → items 2…. Plain step lists flow left to right; a longer
 * list whose steps carry sublabels needs the width and stacks instead, as
 * does everything on a phone.
 */
function DevSubsection({ locale, sub, index, phone, tablet, tableLeftHeader, tableRightHeader }: {
    locale: "en" | "es"
    sub: SubSection
    index: number
    phone: boolean
    tablet: boolean
    tableLeftHeader: string
    tableRightHeader: string
}) {
    const L = (v?: L10n) => pick(locale, v)
    const first = index === 0
    const items = sub.items ?? []
    const rest = items.slice(1)
    const diagram = sub.diagram1 ? L(sub.diagram1) : ""
    const vertical = phone || (diagram.includes("|") && diagram.split("->").length > 3)

    const feature = (item: SectionItem, i: number) => (
        <FeatureModuleGrid
            key={item.id}
            {...featureBase}
            mediaPosition={i % 2 === 0 ? "left" : "right"}
            mediaColumnWidth={first ? 40 : tablet ? 70 : 50}
            verticalAlign={first ? "top" : "center"}
            stackedMediaWidth={phone ? 100 : tablet ? (first ? 65 : 60) : 40}
            stackedMediaAlign={phone ? "center" : "left"}
            stackedTextScale={phone ? 0.85 : 0.9}
            mediaRadius={tablet ? 15 : 16}
            mediaAspectRatio="auto"
            image={item.icon ?? ""}
            eyebrow=""
            title={L(item.displayTitle)}
            body={L(item.bodyHtml)}
            textPadding={phone ? 4 : 10}
            textRadius={phone ? 16 : 22}
        />
    )

    return (
        <div className="pd-subsection">
            {sub.displayTitle && (
                <SectionTitle {...subsectionTitle} title={L(sub.displayTitle)} />
            )}
            {sub.bodyHtml && (
                <Appear trigger="inView" transition="spring-duration 0.4s 0.2 0s" className="pd-gd-body">
                    <RichText html={L(sub.bodyHtml)} />
                </Appear>
            )}
            {diagram ? (
                <>
                    {items[0] && <div className="pd-sub-features">{feature(items[0], 0)}</div>}
                    <div className="pd-sub-diagram">
                        <FlowDiagram
                            inputMode="string"
                            flowString={diagram}
                            direction={vertical ? "vertical" : "horizontal"}
                            wrap
                            minNodeWidth={vertical ? 100 : 110}
                            nodePaddingH={vertical ? 4 : 26}
                            nodePaddingV={10}
                            nodeFontSize={vertical ? 11 : 12}
                            sublabelSize={vertical ? 8 : 10}
                            arrowThickness={vertical ? 1.5 : 2}
                            arrowLength={vertical ? 24 : 36}
                            arrowLabelSize={vertical ? 7 : 9}
                        />
                    </div>
                    {rest.some(Boolean) && (
                        <div className="pd-sub-features">
                            {rest.map((item, i) => (item ? feature(item, i + 1) : null))}
                        </div>
                    )}
                </>
            ) : (
                items.some(Boolean) && (
                    <div className="pd-sub-features">
                        {items.map((item, i) => (item ? feature(item, i) : null))}
                    </div>
                )
            )}
            {sub.table1 && (
                <div className="pd-table">
                    <ImpactTable locale={locale} phone={phone} dsl={sub.table1}
                        leftHeader={tableLeftHeader} rightHeader={tableRightHeader} />
                </div>
            )}
        </div>
    )
}
