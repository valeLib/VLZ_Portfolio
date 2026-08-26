import StickyNav from "./StickyNav"
import { useBreakpoint } from "../hooks/useBreakpoint"
import { useT } from "../lib/i18n"
import { colors } from "../tokens"

// The site's one navigation bar. Every page renders this so a project page gets
// exactly the bar the home page has; the links resolve across routes (see
// StickyNav), so "Projects" from a project page lands on Featured Work.
export default function SiteNav({ autoHide = "phone" }: {
    /** Hide while scrolling down and return on scroll up: on phones only
     *  (the home page), or at every width (the project pages). */
    autoHide?: "phone" | "all"
}) {
    const bp = useBreakpoint()
    const phone = bp === "phone"
    const tablet = bp === "tablet"
    const t = useT()

    return (
        <StickyNav
            wordmark="Valentina LZ"
            wordmarkSize={phone ? 18 : 26}
            wordmarkFont="Fredoka"
            wordmarkLayer
            wordmarkLayerMode="Relief"
            wordmarkLayerColor={colors.liberty}
            wordmarkLayerX={2.5}
            wordmarkLayerY={2}
            wordmarkLayerBlur={6}
            linkSize={16}
            linkHover="Underline grow"
            showCTA={false}
            ctaLabel={t("navContact")}
            ctaAnchor="#contact"
            ctaColor={colors.saffron}
            font="Fredoka"
            background={phone ? "rgba(255, 253, 247, 0.7)" : "rgba(255, 253, 247, 0.41)"}
            textColor={colors.liberty}
            wordmarkColor={colors.tangerine}
            activeColor={colors.tangerine}
            hoverColor={colors.babyPink}
            overlay
            overlayTop={phone ? 12 : 27}
            overlayInset={phone ? 16 : tablet ? 20 : 30}
            overlayMaxWidth={tablet ? 760 : 870}
            baseHeight={phone ? 48 : 52}
            shrinkOnScroll
            shrunkHeight={45}
            shrinkWidthOnScroll
            shrunkWidth={phone ? 85 : tablet ? 95 : 64}
            scrollAlign="center"
            fadeOnScroll
            scrolledOpacity={phone ? 0.96 : 0.98}
            autoHide={autoHide === "all" || phone}
            autoHideDelay={3}
            autoHideOffset={120}
            glass
            blurOnScroll={false}
            blurAmount={phone ? 30 : 1}
            bgOpacity={phone ? 0.4 : 0.8}
            saturate={100}
            menuBg={colors.background}
            menuOpacity={1}
            menuBlur={14}
            elevateOnScroll
            shadowMode="Always"
            shadowDepth={6}
            shadowColor={colors.liberty}
            shadowRim
            shadowRimColor={colors.background}
            shadowRimWidth={0.5}
            bottomBorder
            fullBorder
            borderColor={colors.border}
            borderWidth={0.5}
            radius={30}
            maxWidth={1085}
            showLocale
            localeSize={13}
            links={[
                { label: t("navWork"), anchor: "#work" },
                { label: t("navAbout"), anchor: "#about" },
                { label: t("navProjects"), anchor: "#projects" },
                { label: t("navContact"), anchor: "#contact" },
            ]}
        />
    )
}
