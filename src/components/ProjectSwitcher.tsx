import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import type { Project } from "../data/projects"
import { pick, useLocale, useLocalePath, useT } from "../lib/i18n"
import { colors } from "../tokens"

// End-of-project switcher: a compact preview of each neighbouring project in
// catalogue order — previous on the left, next on the right. Each card is one
// link, so the thumbnail, the title and the empty space all navigate. A
// missing neighbour leaves its side empty rather than showing a dead control.

const MotionLink = motion(Link)

const ease = [0.4, 0, 0.2, 1] as const

function SwitchCard({ project, dir }: { project: Project; dir: "prev" | "next" }) {
    const locale = useLocale()
    const lp = useLocalePath()
    const t = useT()
    const title = pick(locale, project.title)
    const label = dir === "prev" ? t("prevProject") : t("nextProject")
    const meta = pick(locale, project.tracks) || pick(locale, project.tags)
    const arrow = (
        <motion.span
            className="pswitch-arrow"
            aria-hidden
            variants={{ rest: { x: 0 }, hover: { x: dir === "prev" ? -4 : 4 } }}
        >
            {dir === "prev" ? "←" : "→"}
        </motion.span>
    )

    return (
        <MotionLink
            to={lp(`/projects/${project.slug}`)}
            className={`pswitch-card pswitch-${dir}`}
            aria-label={`${label}: ${title}`}
            style={{ ["--accent" as string]: project.color }}
            initial="rest"
            whileHover="hover"
            whileFocus="hover"
            variants={{ rest: { y: 0 }, hover: { y: -3 } }}
            transition={{ type: "tween", duration: 0.2, ease }}
        >
            {project.cover && (
                <span className="pswitch-cover">
                    <motion.img
                        src={project.cover}
                        alt=""
                        variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
                        transition={{ type: "tween", duration: 0.35, ease }}
                    />
                </span>
            )}
            <span className="pswitch-text">
                <span className="pswitch-eyebrow">
                    {dir === "prev" && arrow}
                    {label}
                    {dir === "next" && arrow}
                </span>
                <span className="pswitch-title">{title}</span>
                {meta && <span className="pswitch-meta">{meta}</span>}
            </span>
        </MotionLink>
    )
}

export default function ProjectSwitcher({ prev, next }: { prev?: Project; next?: Project }) {
    const t = useT()
    if (!prev && !next) return null
    return (
        <nav className="pswitch" aria-label={t("projectNavigation")}>
            {prev && <SwitchCard project={prev} dir="prev" />}
            {next && <SwitchCard project={next} dir="next" />}
            <style>{`
                /* Above the hero, which stays stuck (faded, but still there) under
                   the whole reading column; the tracks are capped at the column
                   so a long meta line cannot widen a card past it. */
                .pswitch {
                    position: relative;
                    z-index: 7;
                    width: 100%;
                    margin-top: 48px;
                    padding-top: 24px;
                    border-top: 2px dashed rgba(28, 27, 34, 0.22);
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                    gap: 24px;
                    align-items: start;
                }
                /* Each card keeps to its own side of the column whether or not
                   the other exists, and the accent sits on the outer edge. */
                .pswitch-prev { grid-column: 1; justify-self: start; border-left-width: 5px; border-left-color: var(--accent, ${colors.liberty}); }
                .pswitch-next { grid-column: 2; justify-self: end; flex-direction: row-reverse; text-align: right; border-right-width: 5px; border-right-color: var(--accent, ${colors.liberty}); }
                .pswitch-next .pswitch-text { align-items: flex-end; }
                .pswitch-card {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    width: 100%;
                    max-width: 360px;
                    min-width: 0;
                    padding: 12px 14px;
                    background: ${colors.surface};
                    border: 2px solid ${colors.gunmetalBlack};
                    border-radius: 14px;
                    box-shadow: 3px 3px 0 ${colors.gunmetalBlack};
                    color: ${colors.gunmetalBlack};
                    text-decoration: none;
                    cursor: pointer;
                    transition: background .22s ease, box-shadow .22s ease;
                }
                .pswitch-card:hover, .pswitch-card:focus-visible { background: ${colors.linen}; box-shadow: 5px 5px 0 ${colors.gunmetalBlack}; }
                .pswitch-card:focus-visible { outline: 3px solid ${colors.liberty}; outline-offset: 3px; }
                .pswitch-cover {
                    display: block; flex: 0 0 132px; aspect-ratio: 16 / 10;
                    border: 2px solid ${colors.gunmetalBlack}; border-radius: 8px;
                    background: ${colors.linen}; overflow: hidden;
                }
                .pswitch-cover img { display: block; width: 100%; height: 100%; object-fit: cover; }
                .pswitch-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1 1 auto; }
                .pswitch-eyebrow {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-family: "Caveat", cursive; font-size: 16px; font-weight: 600; line-height: 1.1;
                    color: ${colors.liberty};
                }
                .pswitch-arrow { display: inline-block; font-family: "IBM Plex Mono", monospace; font-size: 15px; }
                .pswitch-title { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 18px; line-height: 1.2; }
                .pswitch-meta {
                    font-family: "IBM Plex Mono", monospace; font-size: 10px; letter-spacing: 0.03em; line-height: 1.4;
                    color: ${colors.secondaryTxt};
                    max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }

                @media (max-width: 809.98px) {
                    .pswitch { grid-template-columns: minmax(0, 1fr); gap: 12px; margin-top: 36px; padding-top: 18px; }
                    .pswitch-prev, .pswitch-next { grid-column: 1; justify-self: stretch; max-width: none; }
                    .pswitch-card { padding: 10px 12px; gap: 12px; }
                    .pswitch-cover { flex-basis: 104px; }
                    .pswitch-title { font-size: 17px; }
                }
            `}</style>
        </nav>
    )
}
