import { Link, useParams } from "react-router-dom"
import { getProject } from "../data/projects"
import RichText from "../components/RichText"
import Footer from "../components/Footer"
import RetroButton from "../components/RetroButton"

/**
 * PROJECT DETAIL — /projects/:slug
 * Data-driven page: project hero (from CMS metadata) + the full case-study
 * rich text. (The Framer project also had four bespoke per-project page
 * components; this renders the authoritative CMS content for every project
 * through one consistent, styled template.)
 */

const CONTENT_MAX = 820

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProject(slug)

  if (!project) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
        <h1 style={{ fontFamily: '"Fredoka One", "Fredoka", cursive', color: "rgb(28,27,34)" }}>Project not found</h1>
        <Link to="/projects" style={{ color: "rgb(79,88,175)" }}>← Back to all projects</Link>
      </div>
    )
  }

  const tags = project.tracks.split(",").map((t) => t.trim()).filter(Boolean)

  return (
    <div style={{ width: "100%", background: "rgb(245, 238, 230)", overflowX: "hidden" }}>
      {/* Hero */}
      <header
        style={{
          position: "relative",
          background: `linear-gradient(160deg, ${project.color} 0%, rgb(245,238,230) 75%)`,
          borderBottom: "3px solid rgb(26,21,32)",
        }}
      >
        <div style={{ maxWidth: CONTENT_MAX, margin: "0 auto", padding: "40px clamp(20px, 5vw, 40px) 44px", boxSizing: "border-box" }}>
          <div style={{ marginBottom: 24 }}>
            <Link to="/projects" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, fontWeight: 700, color: "rgb(79,88,175)", letterSpacing: "0.06em", background: "rgb(255,253,248)", padding: "5px 13px", borderRadius: 100, border: "1.5px solid rgb(26,21,32)", boxShadow: "2px 2px 0 rgb(26,21,32)" }}>
                ← All projects
              </span>
            </Link>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <Tag text={project.year} bg="rgb(250,186,50)" />
            {tags.map((t) => (
              <Tag key={t} text={t} bg="rgb(249,208,232)" />
            ))}
          </div>

          <h1 style={{ fontFamily: '"Fredoka One", "Fredoka", cursive', fontWeight: 400, fontSize: "clamp(40px, 7vw, 64px)", lineHeight: 1, color: "rgb(26,21,32)", margin: "0 0 10px", textShadow: "3px 3px 0 rgba(255,255,255,0.5)" }}>
            {project.title}
          </h1>
          <p style={{ fontFamily: '"Caveat", cursive', fontSize: 20, fontWeight: 700, color: "rgb(79,88,175)", margin: 0, maxWidth: 620 }}>
            {project.tagline}
          </p>
        </div>
      </header>

      {/* Meta + content */}
      <div style={{ maxWidth: CONTENT_MAX, margin: "0 auto", padding: "36px clamp(20px, 5vw, 40px) 64px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          <Meta label="Stack" value={project.stack} accent="rgb(79,88,175)" />
          <Meta label="Role" value={project.role.trim()} accent="rgb(238,151,142)" />
          <Meta label="Type" value={project.status} accent="rgb(139,217,195)" />
        </div>

        {project.cover && (
          <img
            src={project.cover}
            alt={project.title}
            style={{ width: "100%", border: "2px solid rgb(26,21,32)", borderRadius: 12, boxShadow: "5px 5px 0 rgb(26,21,32)", marginBottom: 36 }}
          />
        )}

        <RichText html={project.contentHtml} />

        <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
          <Link to="/projects" style={{ textDecoration: "none" }}>
            <RetroButton variant="primary" label="← Back to all projects" href="" bgColor="rgb(204,204,255)" textColor="rgb(26,21,32)" borderColor="rgb(26,21,32)" shadowColor="rgb(26,21,32)" fontFamily="mono" fontWeight={700} borderRadius={8} paddingH={18} paddingV={11} />
          </Link>
        </div>
      </div>

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

function Tag({ text, bg }: { text: string; bg: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", background: bg, color: "rgb(26,21,32)", fontFamily: '"Caveat", cursive', fontSize: 14, fontWeight: 700, padding: "5px 14px", borderRadius: 100, border: "2px solid rgb(26,21,32)", boxShadow: "3px 3px 0 rgb(26,21,32)" }}>
      {text}
    </span>
  )
}

function Meta({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ background: "rgb(255,253,248)", border: "2px solid rgb(26,21,32)", borderRadius: 8, padding: "10px 14px", boxShadow: "3px 3px 0 rgb(26,21,32)", display: "flex", flexDirection: "column", gap: 2, maxWidth: 360 }}>
      <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: accent }}>{label}</span>
      <span style={{ fontFamily: '"Anonymous Pro", monospace', fontSize: 12, color: "rgb(26,21,32)", fontWeight: 700, lineHeight: 1.4 }}>{value}</span>
    </div>
  )
}
