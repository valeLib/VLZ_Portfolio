# Task: Port Valentina's Framer portfolio to a standalone React + Vite app (deploy to GitHub Pages)

You have access to a Framer project through the **FramerPortfolio MCP** (already connected). Your job is to faithfully recreate this Framer portfolio as a standalone **React + Vite (TypeScript)** app, deployable to **GitHub Pages**, while preserving its visual design.

**Hard constraints**
- **Do NOT introduce Tailwind or any CSS framework.** The Framer code components already use inline styles, CSS custom properties, and scoped `<style>` tags — keep those exactly as written.
- Aim for visual parity with the live published Framer site.
- Keep type-checks clean as you go; don't accumulate errors.

---

## Step 0 — Read the source before writing anything

The Framer code components are already React/TSX, so most of the work is reading them and stripping the Framer-specific APIs. Use these MCP tools:

- `getProjectXml` — inventory all pages, components, and structure. **Run this first.**
- `getProjectWebsiteUrl` — the live published site. Open it and compare against it as you build each page.
- `readCodeFile` — read each code component's full TSX source. This is the primary way to get component code.
- `getNodeXml` — read a specific page/node's layout (child order, stack direction, gaps, padding, breakpoints).
- `getCMSCollections` / `getCMSItems` — pull all content (see CMS section).
- `exportReactComponents` — fallback only, for any non-code (canvas/design) components that don't have source.

**Begin by calling `getProjectXml` and `getCMSCollections`** to produce a complete inventory: every page, every component, every CMS collection and its fields. Do not start scaffolding until the inventory is done.

---

## Known project reference (confirm against the live project)

Expected to be present — verify via `getProjectXml`, the live project is the source of truth:

- **Components:** `StickyNav`, `ContactPage`, `Footer`, `InfoCard_1`, `PatternBackground`, `DecorativeBorder`, `MarqueeBanner`, `SectionTitle`, `SectionHeader`, `TagCloud`, `Timeline`, `DecisionImpactTable`, `FeatureModuleGrid`, `LocationCard`, `RetroButton`, `NotebookBackground`, plus per-project pages: `PawstchiPage`, `GoblinTDPage`, `ClawsAndCuePage`, `MatchaPuzzlePage`.
- **Design tokens** live in a `tokens` file — port it verbatim. Palette: warm cream base; accents Liberty `#4F58AF`, Tangerine `#EE978E`, Saffron `#FABA32`, Straw `#D4DF68`, Teal `#8BD9C3`.
- **Fonts:** Fredoka One (display/UI), Caveat (accents), Anonymous Pro (body), IBM Plex Mono (code), Segoe UI (hero). Framer served these automatically — the standalone app must load them explicitly (Google Fonts `<link>` in `index.html` or `@fontsource/*`).
- **CMS collections:** there are **two collections both named "Projects"** plus Work Experience:
  - blog / full Projects → `E2LL5RnrG`
  - short-version Projects → `fqZB5mxki`
  - Work Experience → `Bxh5oBE4O`

---

## Per-component porting rules

For each code component:

1. Remove `addPropertyControls(...)` calls and the `import { ... } from "framer"` line.
2. Convert each `ControlType` property into a typed React prop, using the control's `defaultValue` as the prop default.
3. Replace Framer `<Link href=...>` with React Router `<Link to=...>` (internal) or a plain `<a>` (external).
4. Remove `RenderTarget` imports and any `RenderTarget.current() === RenderTarget.canvas` gates — collapse to the real (non-canvas) branch and delete canvas-only placeholders.
5. Keep `framer-motion` imports unchanged (`npm i framer-motion`). It's a standalone library and works fine outside Framer.
6. Keep ALL inline styles, CSS custom properties, and scoped `<style>` tags exactly as written.

---

## Pages / layout (the careful part)

Page composition lives in Framer's Stack/Grid system, **not** in the component code. For each page:

- Read its layout via `getNodeXml` (or its page node in `getProjectXml`): note child component order, stack direction, gaps, padding, alignment, and responsive breakpoints.
- Recreate it as a React page component using flexbox/grid that matches that arrangement and spacing.
- The four per-project pages (Pawstchi, GoblinTD, ClawsAndCue, MatchaPuzzle) are already TSX components — port them directly (apply the per-component rules above).
- Compare each finished page against `getProjectWebsiteUrl` for parity.

---

## CMS → static data

GitHub Pages is static hosting, so replace the CMS with local data:

- Pull every item from the three collections with `getCMSItems`.
- Write them as typed data in `src/data/*.ts` (or JSON).
- Convert Rich Text fields to HTML and render via a small component (`dangerouslySetInnerHTML`) or a markdown renderer. Plain Text fields map directly.
- Anywhere a component/page mapped over CMS items, now map over the local data.

---

## Assets / images

Framer hosts images on its CDN. For an independent site, download referenced images into `public/assets/` and rewrite the URLs to local paths. (Keeping the Framer CDN URLs works but couples the site to Framer — prefer downloading.)

---

## Project setup

- Scaffold: Vite `react-ts` template. Use `react-router-dom` for routing.
- Suggested structure: `src/components/`, `src/pages/`, `src/data/`, `src/tokens.ts`, `src/App.tsx`, `public/`.
- Contact form: keep the existing Formspree endpoint + `mailto:` fallback. Both work on static hosting.

---

## GitHub Pages config

- **Repo:** `valeLib/VLZ_Portfolio` → publishes at `https://valelib.github.io/VLZ_Portfolio/` (GitHub lowercases the username in the domain; the repo path keeps its case).
- In `vite.config.ts`, set `base: '/VLZ_Portfolio/'` — case-sensitive, must match the repo name exactly.
- **Routing:** default to `HashRouter` — it's the most reliable on GitHub Pages with zero server config. (Clean-URL alternative, only if I ask for it: `BrowserRouter` + the `404.html` SPA-redirect trick + `basename` set to the repo name.)
- **Deploy:** set up a GitHub Actions workflow that builds and publishes to Pages (build → `upload-pages-artifact` → `deploy-pages`). The `gh-pages` npm package + a `deploy` script is a fine simpler alternative. Use current action/package versions.

---

## Order of work

1. `getProjectXml` + `getCMSCollections` → inventory (pages, components, CMS).
2. Scaffold the Vite `react-ts` app; install `react-router-dom`, `framer-motion`, and font packages.
3. Port `tokens`, global styles, and font loading.
4. **Vertical slice first:** port `StickyNav`, `Footer`, and ONE full page end-to-end, and get `npm run dev` rendering it cleanly. **Pause and show me the result before continuing.**
5. Port the remaining shared components.
6. Pull the CMS → `src/data`.
7. Build each remaining page from its Framer layout.
8. Wire up the router + `App` shell.
9. Configure Vite `base`, routing, and the deploy workflow.
10. Type-check, run dev, fix errors, verify each page against the live Framer URL, then init the repo and deploy.

---

## Notes

- The MCP is a live bridge to the **running** Framer app — keep Framer open with the FramerPortfolio plugin active for the whole session.
- Work incrementally; don't try to generate the whole project in one shot.
- Tell me what you need at each decision point (custom domain, or anything ambiguous in a page layout) rather than guessing.
