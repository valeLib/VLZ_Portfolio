/**
 * Vite serves `public/` from `import.meta.env.BASE_URL`, which is "/" in dev and
 * "/VLZ_Portfolio/" on GitHub Pages. Build every static path through here so a
 * change to `base` in vite.config.ts never leaves a dead link behind.
 */
export const publicUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`

/** Downloadable CV living in public/cv — filename kept verbatim. */
export const CV_FILE = "Valentina_Liberona_CV.pdf"
export const CV_URL = publicUrl(`cv/${CV_FILE}`)
