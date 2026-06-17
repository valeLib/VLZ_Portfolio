# VLZ Portfolio — React + Vite

Valentina Liberona Zúñiga's portfolio, ported from a Framer project to a standalone
**React + Vite (TypeScript)** app and deployed to **GitHub Pages**.

No CSS framework — the ported Framer code components keep their inline styles, CSS custom
properties, and scoped `<style>` tags. Routing uses `HashRouter` for zero-config Pages hosting.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/VLZ_Portfolio/
```

## Build

```bash
npm run build    # type-checks then bundles to dist/
npm run preview  # preview the production build at the /VLZ_Portfolio/ base
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to
GitHub Pages. In the repo settings, set **Pages → Build and deployment → Source: GitHub Actions**.

- Repo: `valeLib/VLZ_Portfolio` → publishes at `https://valelib.github.io/VLZ_Portfolio/`
- `base` is set in `vite.config.ts` (`/VLZ_Portfolio/`) and must match the repo name exactly.

## Structure

- `src/components/` — ported Framer code components (StickyNav, Footer, RetroButton, InfoCard_1,
  ProjectShowcase_1, RetroWindow, SectionTitle/Header, PatternBackground, NotebookBackground,
  CheckerDivider, OutlineText, GLBModelViewer, ContactPage, RichText) + `external/` approximations
  of Framer-store flourishes (ScrollIndicator, BackToTop, SmoothScroll).
- `src/pages/` — `Home`, `Projects`, `ProjectDetail`.
- `src/data/` — `projects.ts`, `work.ts` (from the Framer CMS) and `content/*.html` case studies.
- `src/tokens.ts` — colors + font stacks.
- `public/assets/` — locally hosted images and the `.glb` 3D model.

## Notes / known deviations

- The Framer home page stacked its sections as sticky 100vh scrollytelling layers; this port
  renders them as normal stacked sections for robustness (content/visuals match per section).
- The four bespoke per-project Framer pages are rendered through one data-driven `ProjectDetail`
  template fed by the CMS case-study HTML (covers all projects consistently).
- `GLBModelViewer`'s optional MediaPipe webcam hand-gesture mode was dropped; orbit/auto-rotate
  are kept.
