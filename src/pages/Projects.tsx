import { Link } from "react-router-dom"
import { publicProjects } from "../data/projects"
import ProjectShowcase from "../components/ProjectShowcase"
import Footer from "../components/Footer"
import NotebookBackground from "../components/NotebookBackground"
import { pick, useLocale, useLocalePath, useT } from "../lib/i18n"

/**
 * /projects is not linked from the site chrome — the nav points at the home
 * page's Featured Work section instead. Kept as a working index of the public
 * projects; drafts are filtered by the shared visibility rule.
 */
export default function Projects() {
  const locale = useLocale()
  const lp = useLocalePath()
  const t = useT()
  return (
    <div style={{ width: "100%", background: "rgb(242, 239, 233)", overflowX: "hidden", minHeight: "100vh" }}>
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <NotebookBackground paperColor="rgb(242, 239, 233)" gridType="grid" gridColor="rgb(79, 88, 175)" gridOpacity={0.15} gridSize={34} gridWeight={2.6} />
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1085, margin: "0 auto", padding: "72px clamp(24px, 6vw, 80px) 80px" }}>
          <Link to={lp("/")} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, color: "rgb(79,88,175)", textDecoration: "none" }}>{t("backHome")}</Link>
          <h1 style={{ fontFamily: '"Leckerli One", cursive', fontSize: "clamp(40px, 7vw, 72px)", color: "rgb(28,27,34)", letterSpacing: "-0.04em", margin: "16px 0 8px" }}>
            {t("navProjects")}
          </h1>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {publicProjects.map((p) => (
              <Link key={p.slug} to={lp(`/projects/${p.slug}`)} style={{ textDecoration: "none" }}>
                <ProjectShowcase
                  itemCount={1}
                  item1MediaType="image"
                  item1Image={p.cover ?? ""}
                  item1UrlBar={pick(locale, p.title)}
                  item1Title={pick(locale, p.title)}
                  item1Subtitle={pick(locale, p.title)}
                  item1Tags={pick(locale, p.tags)}
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

      <Footer
        wordmark="Valentina Liberona"
        showTagline={false}
        background="rgb(79, 88, 175)"
        textColor="rgb(26, 21, 32)"
        mutedColor="rgb(245, 238, 230)"
        borderColor="rgb(28, 27, 34)"
      />
    </div>
  )
}
