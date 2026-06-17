import { Link } from "react-router-dom"
import StickyNav from "../components/StickyNav"
import Footer from "../components/Footer"
import RetroButton from "../components/RetroButton"
import OutlineText from "../components/OutlineText"
import NotebookBackground from "../components/NotebookBackground"
import PatternBackground from "../components/PatternBackground"
import CheckerDivider from "../components/CheckerDivider"
import SectionTitle from "../components/SectionTitle"
import SectionHeader from "../components/SectionHeader"
import RetroWindow from "../components/RetroWindow"
import InfoCard from "../components/InfoCard_1"
import ProjectShowcase from "../components/ProjectShowcase_1"
import ContactPage from "../components/ContactPage"
import GLBModelViewer from "../components/GLBModelViewer"
import ScrollIndicator from "../components/external/ScrollIndicator"
import BackToTop from "../components/external/BackToTop"
import { projects, asset } from "../data/projects"
import { work } from "../data/work"

/**
 * HOME — home page (/).
 *
 * Faithful re-creation of the Framer home page composition. NOTE: the Framer
 * original stacks each section as a sticky 100vh layer that slides over the
 * previous one (scrollytelling). That fragile choreography is intentionally
 * rendered here as normal stacked sections for robustness; visuals/content
 * match per-section.
 */

const SIDE_PAD = "clamp(24px, 6vw, 80px)"

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim()
}

const navProps = {
  wordmark: "Portfolio",
  wordmarkSize: 26,
  linkSize: 16,
  showCTA: false,
  font: "Fredoka",
  background: "rgba(255, 253, 247, 0.41)",
  textColor: "rgb(79, 88, 175)",
  wordmarkColor: "rgb(79, 88, 175)",
  activeColor: "rgb(255, 131, 117)",
  hoverColor: "rgb(212, 223, 104)",
  baseHeight: 58,
  shrinkOnScroll: true,
  shrunkHeight: 45,
  shrinkWidthOnScroll: true,
  shrunkWidth: 50,
  scrollAlign: "right",
  fadeOnScroll: true,
  scrolledOpacity: 0.8,
  glass: true,
  blurOnScroll: true,
  blurAmount: 9,
  bgOpacity: 0.44,
  saturate: 125,
  elevateOnScroll: true,
  shadowColor: "rgb(79, 88, 175)",
  bottomBorder: true,
  fullBorder: true,
  borderColor: "rgb(228, 223, 214)",
  borderWidth: 0.5,
  radius: 30,
  maxWidth: 1085,
}

// Checker-bordered pattern strip used to frame the hero 3D model.
const checkerStrip = (
  <div style={{ width: 168, height: 56 }}>
    <PatternBackground
      patternType="checker"
      checkerColor2="rgb(242, 239, 233)"
      checkerSize={28}
      patternColor="rgb(238, 151, 142)"
      bgColor="rgb(240, 235, 224)"
    />
  </div>
)

// ── Section title block (eyebrow title + Fredoka header) reused across sections ──
function SectionHead({
  title,
  titleColor,
  num,
  header,
}: {
  title: string
  titleColor: string
  num: string
  header: { title: string; titleColor: string }
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
          dotBorderColor="rgb(26, 21, 32)"
          dotShadowColor="rgb(26, 21, 32)"
          dotShadowX={1.5}
          dotShadowY={1}
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
      <SectionHeader
        num={num}
        showDot={false}
        showLabel={false}
        title={header.title}
        titleColor={header.titleColor}
        titleSize={34}
        intro=""
      />
    </div>
  )
}

export default function Home() {
  return (
    <div style={{ width: "100%", background: "rgb(242, 239, 233)", overflowX: "hidden" }}>
      <StickyNav {...navProps} />

      <main style={{ width: "100%" }}>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section
          id="top"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
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

          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 1200,
              margin: "0 auto",
              padding: `90px ${SIDE_PAD} 60px`,
              display: "flex",
              gap: 40,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Left: title + content */}
            <div style={{ flex: "1 1 560px", minWidth: 300, paddingTop: 20 }}>
              {/* Role tags */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
                <span style={{ transform: "rotate(-1deg)", display: "inline-flex" }}>
                  <RetroButton variant="primary" label="Unity Dev" bgColor="rgb(139, 217, 195)" textColor="rgb(28, 27, 34)" borderColor="rgb(26, 21, 32)" shadowColor="rgb(26, 21, 32)" shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={20} paddingV={6} />
                </span>
                <span style={{ transform: "rotate(1deg)", display: "inline-flex" }}>
                  <RetroButton variant="primary" label="Creative Frontend" bgColor="rgb(204, 204, 255)" textColor="rgb(28, 27, 34)" borderColor="rgb(26, 21, 32)" shadowColor="rgb(26, 21, 32)" shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={20} paddingV={6} />
                </span>
                <span style={{ transform: "rotate(-1deg)", display: "inline-flex" }}>
                  <RetroButton variant="primary" label="Chile 🌍" bgColor="rgb(238, 151, 142)" textColor="rgb(255, 253, 248)" borderColor="rgb(26, 21, 32)" shadowColor="rgb(26, 21, 32)" shadowX={2} shadowY={2} borderRadius={52} fontFamily="caveat" fontSize={14} fontWeight={600} paddingH={20} paddingV={6} />
                </span>
              </div>

              <div style={{ fontFamily: '"Leckerli One", cursive', fontSize: "clamp(56px, 8vw, 96px)", lineHeight: "1em", letterSpacing: "-0.04em", color: "rgb(28, 27, 34)" }}>
                Portfolio
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ fontFamily: '"Jua", sans-serif', fontSize: "clamp(56px, 8vw, 100px)", lineHeight: "1em", letterSpacing: "-0.04em", color: "rgb(28, 27, 34)" }}>
                  Valentina
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(79, 88, 175, 0.95)", borderRadius: 19, padding: "8px 18px", marginBottom: 16 }}>
                  <OutlineText text="LZ" strokeColor="rgb(228, 223, 214)" strokeWidth={2} fontFamily="'Jua', sans-serif" fontSize={68} letterSpacing={0.01} lineHeight={0.8} />
                </span>
              </div>

              <p style={{ fontFamily: '"Anonymous Pro", monospace', fontSize: 14, lineHeight: "1.85em", letterSpacing: "-0.02em", color: "rgb(90, 88, 112)", maxWidth: 440, margin: "26px 0 0" }}>
                7+ years building games, VR experiences, and motion-driven web interfaces.
              </p>

              <div style={{ display: "flex", gap: 14, marginTop: 26, flexWrap: "wrap" }}>
                <RetroButton variant="primary" label="See my work ↓" href="#projects" bgColor="rgb(204, 204, 255)" textColor="rgb(26, 21, 32)" borderColor="rgb(26, 21, 32)" shadowColor="rgb(26, 21, 32)" shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" fontSize={14} fontWeight={700} paddingH={16} paddingV={10} />
                <RetroButton variant="primary" label="Get in touch" href="#contact" bgColor="rgb(245, 238, 230)" textColor="rgb(28, 27, 34)" borderColor="rgb(26, 21, 32)" shadowColor="rgb(26, 21, 32)" shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" fontSize={14} fontWeight={700} paddingH={16} paddingV={10} />
              </div>

              {/* Stat cards */}
              <div style={{ display: "flex", gap: 15, marginTop: 22, flexWrap: "wrap" }}>
                <RetroButton variant="stat" statValue="7+" statLabel="Years XP" bgColor="rgb(243, 182, 176)" textColor="rgb(26, 21, 32)" statLabelColor="rgb(26, 21, 32)" borderColor="rgb(26, 21, 32)" shadowColor="rgb(26, 21, 32)" shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={16} paddingV={10} />
                <RetroButton variant="stat" statValue="4+" statLabel="Fields" bgColor="rgb(204, 204, 255)" textColor="rgb(26, 21, 32)" statLabelColor="rgb(26, 21, 32)" borderColor="rgb(26, 21, 32)" shadowColor="rgb(26, 21, 32)" shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={16} paddingV={10} />
                <RetroButton variant="stat" statValue="20+" statLabel="Skills" bgColor="rgb(79, 88, 175)" textColor="rgb(255, 253, 248)" statLabelColor="rgb(255, 253, 248)" borderColor="rgb(26, 21, 32)" shadowColor="rgb(26, 21, 32)" shadowX={3} shadowY={3} borderRadius={8} fontFamily="mono" paddingH={16} paddingV={10} />
              </div>
            </div>

            {/* Right: 3D model framed by checker strips */}
            <div style={{ flex: "0 1 360px", minWidth: 280, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 80 }}>
              {checkerStrip}
              <div style={{ width: "100%", maxWidth: 348, height: 348 }}>
                <GLBModelViewer model={asset("astronaut.glb")} enableInteraction disableZoom camH={15} camV={85} camRadius={90} enableAnimation />
              </div>
              <div style={{ alignSelf: "flex-end" }}>{checkerStrip}</div>
            </div>
          </div>

          <ScrollIndicator targetId="about" style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", zIndex: 2 }} />
        </section>

        {/* ── ABOUT ────────────────────────────────────────────────────── */}
        <section id="about" style={{ position: "relative", overflow: "hidden", background: "rgb(79, 88, 175)" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <NotebookBackground paperColor="rgb(79, 88, 175)" gridType="grid" gridColor="rgb(204, 204, 255)" gridOpacity={0.05} gridSize={28} gridWeight={4} />
          </div>
          <CheckerDivider color1="rgb(114, 121, 191)" color2="rgb(204, 204, 255)" cellSize={12} rows={2} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: `60px ${SIDE_PAD} 80px`, display: "flex", gap: 48, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 360px", minWidth: 300 }}>
              <div style={{ maxWidth: 615, marginBottom: 18 }}>
                <SectionTitle title="ABOUT ME" layout="inline" showDot dotStyle="shadow" dotColor="rgb(238, 151, 142)" dotBorderColor="rgb(26, 21, 32)" dotShadowColor="rgb(26, 21, 32)" dotShadowX={1.5} dotShadowY={1} fontFamily="caveat" fontSize={20} titleColor="rgb(238, 151, 142)" showBorder borderColor="rgb(245, 238, 230)" borderWidth={2} borderStyle="dashed" paddingBottom={1} />
              </div>
              <SectionHeader num="" showDot={false} showLabel={false} title="Hi, I'm Vale." titleColor="rgb(245, 238, 230)" titleSize={34} intro="" />
              <p style={{ fontFamily: '"Anonymous Pro", monospace', fontSize: 14, lineHeight: "1.85em", letterSpacing: "-0.02em", color: "rgb(229, 224, 235)", marginTop: 18, maxWidth: 520 }}>
                I’m a game developer based in Chile, working remotely, focused on building optimized systems that are both performant and visually clear. My work spans Unity and Unreal, where I design gameplay, AI behaviors, and scalable architectures. I also use frontend tools when needed to support interfaces and interactive systems.
              </p>
            </div>

            <div style={{ flex: "1 1 360px", minWidth: 300, display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
              <div style={{ width: "90%", transform: "rotate(1deg)" }}>
                <RetroWindow title="PROFILE.EXE" titleBarColor="rgb(79, 88, 175)" titleColor="rgb(255, 253, 248)" bodyColor="rgb(255, 255, 255)" contentMode="text" plainText={"Vale · Game & XR developer\n7+ years across Unity, Unreal, HLSL shaders and motion-driven frontends.\nUCL ×2 · Oxford · U. de Chile research."} plainTextColor="rgb(26, 21, 32)" />
              </div>
              <div style={{ width: "90%", transform: "rotate(-1deg)" }}>
                <RetroWindow title="LOCATION.EXE" titleBarColor="rgb(139, 217, 195)" titleColor="rgb(255, 255, 255)" bodyColor="rgb(255, 253, 248)" contentMode="text" plainText={"📍 Santiago, Chile — working remotely (UTC−3).\nOpen to remote collaborations worldwide."} plainTextColor="rgb(26, 21, 32)" />
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ─────────────────────────────────────────────────── */}
        <section id="projects" style={{ position: "relative", overflow: "hidden", background: "rgb(242, 239, 233)" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <NotebookBackground paperColor="rgb(242, 239, 233)" gridType="grid" gridColor="rgb(79, 88, 175)" gridOpacity={0.15} gridSize={34} gridWeight={2.6} />
          </div>
          <CheckerDivider color1="rgb(238, 151, 142)" color2="rgb(245, 238, 230)" cellSize={12} rows={2} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: `60px ${SIDE_PAD} 80px` }}>
            <SectionHead title="PROJECTS" titleColor="rgb(79, 88, 175)" num="02 —" header={{ title: "Featured Work", titleColor: "rgb(26, 21, 32)" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
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
                    imageBgColor={p.cover ? "rgb(245, 238, 230)" : p.color}
                    frameBorderColor="rgb(26, 21, 32)"
                    dotRed="rgb(238, 151, 142)"
                    dotYellow="rgb(250, 186, 50)"
                    dotGreen="rgb(212, 223, 104)"
                    urlBarBg="rgb(245, 238, 230)"
                    urlBarTextColor="rgb(107, 101, 128)"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── WORK / EXPERIENCE ────────────────────────────────────────── */}
        <section id="work" style={{ position: "relative", overflow: "hidden", background: "rgb(139, 217, 195)" }}>
          <CheckerDivider color1="rgb(139, 217, 195)" color2="rgb(245, 238, 230)" cellSize={12} rows={2} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: `60px ${SIDE_PAD} 80px` }}>
            <SectionHead title="EXPERIENCE" titleColor="rgb(79, 88, 175)" num="03 —" header={{ title: "Where I've worked", titleColor: "rgb(28, 27, 34)" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: "16px 40px" }}>
              {work.map((w) => (
                <InfoCard
                  key={w.id}
                  device="desktop"
                  title={w.title}
                  titleSize={19}
                  showBadge
                  badgeText={w.year}
                  badgeBg="rgb(54, 49, 59)"
                  badgeText2="rgb(204, 204, 255)"
                  badgeBorderColor="rgb(102, 102, 102)"
                  bodyMode="text"
                  body={stripHtml(w.contentHtml)}
                  label=""
                  bgColor="rgb(26, 21, 32)"
                  borderColor="rgb(26, 21, 32)"
                  titleColor="rgb(255, 253, 248)"
                  bodyColor="rgb(170, 168, 184)"
                  showShadow
                  shadowColor="rgba(36, 38, 46, 0.28)"
                  shadowX={3}
                  shadowY={3}
                  paddingH={28}
                  paddingV={22}
                  borderRadius={14}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── SKILLS ───────────────────────────────────────────────────── */}
        <section id="skills" style={{ position: "relative", overflow: "hidden", background: "rgb(242, 239, 233)" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <NotebookBackground paperColor="rgb(242, 239, 233)" gridType="ruled" gridColor="rgb(79, 88, 175)" gridOpacity={0.15} gridSize={34} gridWeight={2.6} />
          </div>
          <CheckerDivider color1="rgb(238, 151, 142)" color2="rgb(245, 238, 230)" cellSize={12} rows={2} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: `60px ${SIDE_PAD} 80px` }}>
            <SectionHead title="SKILLS" titleColor="rgb(238, 151, 142)" num="02 —" header={{ title: "What I use", titleColor: "rgb(28, 27, 34)" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              <InfoCard
                iconType="emoji" iconEmoji="🎮" title="Game & VR"
                showBadge={false} bodyMode="tags"
                tags={["Unity", "C#", "HLSL shaders", "3D art", "VR optimization", "Meta Quest", "WebGL"]}
                tagBg="rgb(122, 199, 178)" tagText="rgb(51, 102, 102)" tagBorder="rgba(36, 38, 46, 0.28)" tagBorderWidth={1.5}
                bgColor="rgb(139, 217, 195)" borderColor="rgb(26, 21, 32)" borderWidth={2} titleColor="rgb(255, 255, 255)"
                showShadow shadowColor="rgb(26, 21, 32)" shadowX={4} shadowY={4} paddingH={24} paddingV={16} borderRadius={14}
              />
              <InfoCard
                iconType="emoji" iconEmoji="💻" title="Frontend"
                showBadge={false} bodyMode="tags"
                tags={["React", "Vue", "TypeScript", "GSAP", "Lenis", "React Three Fiber", "Design systems"]}
                tagBg="rgb(243, 182, 176)" tagText="rgb(135, 104, 109)" tagBorder="rgba(36, 38, 46, 0.28)" tagBorderWidth={1.5} tagFontSize={11}
                bgColor="rgb(238, 151, 142)" borderColor="rgb(26, 21, 32)" borderWidth={2} titleColor="rgb(26, 21, 32)"
                showShadow shadowColor="rgb(26, 21, 32)" shadowX={4} shadowY={4} paddingH={24} paddingV={16} borderRadius={14}
              />
              <InfoCard
                iconType="emoji" iconEmoji="✨" title="Shared"
                showBadge={false} bodyMode="tags"
                tags={["VR dashboards", "WebGL", "WCAG / a11y", "Shaders", "Visual identity"]}
                tagBg="rgb(114, 121, 191)" tagText="rgb(255, 253, 248)" tagBorder="rgba(36, 38, 46, 0.28)" tagBorderWidth={1.5} tagBorderRadius={8}
                bgColor="rgb(79, 88, 175)" borderColor="rgb(26, 21, 32)" borderWidth={2} titleColor="rgb(255, 253, 248)"
                showShadow shadowColor="rgb(26, 21, 32)" shadowX={4} shadowY={4} paddingH={24} paddingV={30} borderRadius={14}
              />
            </div>
          </div>
        </section>

        {/* ── CONTACT ──────────────────────────────────────────────────── */}
        <section style={{ position: "relative", background: "rgb(242, 239, 233)" }}>
          <CheckerDivider color1="rgb(238, 151, 142)" color2="rgb(245, 238, 230)" cellSize={12} rows={2} />
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: `40px ${SIDE_PAD} 40px` }}>
            <ContactPage
              eyebrow="Get in touch"
              headline="Let's build something playful."
              intro="Have a game, an interface, or a wild idea? Drop a line and I'll get back to you."
              email="vliberonazuniga@gmail.com"
              accent="rgb(238, 151, 142)"
              background="rgb(242, 239, 233)"
              cardColor="rgb(255, 253, 248)"
              textColor="rgb(28, 27, 34)"
              mutedColor="rgb(152, 150, 168)"
              hardShadow
              shadowColor="rgb(28, 27, 34)"
              radius={20}
              padding={48}
            />
          </div>
        </section>
      </main>

      <Footer
        wordmark="Valentina Liberona"
        showTagline={false}
        showSocials
        background="rgb(79, 88, 175)"
        textColor="rgb(26, 21, 32)"
        mutedColor="rgb(245, 238, 230)"
        socialColor="rgb(79, 88, 175)"
        topBorder
        borderColor="rgb(28, 27, 34)"
        radius={0}
        padding={48}
        gap={40}
      />

      <BackToTop fill="rgb(79, 88, 175)" hoverFill="rgb(238, 151, 142)" />
    </div>
  )
}
