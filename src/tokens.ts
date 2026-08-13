/**
 * Design tokens: a warm cream base with five accents, plus the shared type stacks.
 */

export const colors = {
  // Backgrounds / surfaces
  background: "rgb(242, 239, 233)",
  backgroundTransparent: "rgba(242, 239, 233, 0.8)",
  background2: "rgb(245, 238, 230)",
  surface: "rgb(255, 253, 248)",
  linen: "rgb(245, 238, 230)",

  // Accent palette
  liberty: "rgb(79, 88, 175)", // #4F58AF
  libertyFaint: "rgba(79, 88, 175, 0.1)",
  libertyHover: "rgb(61, 69, 145)",
  libertyPressed: "rgb(46, 52, 112)",
  tangerine: "rgb(238, 151, 142)", // #EE978E
  saffron: "rgb(250, 186, 50)", // #FABA32
  straw: "rgb(212, 223, 104)", // #D4DF68
  teal: "rgb(139, 217, 195)", // #8BD9C3
  tealGlow: "rgba(139, 217, 195, 0.25)",

  // Text
  primaryTxt: "rgb(28, 27, 34)", // #1C1B22
  secondaryTxt: "rgb(90, 88, 112)",
  mutedTxt: "rgb(152, 150, 168)",

  // Borders
  border: "rgb(228, 223, 214)",
  border2: "rgb(237, 232, 224)",

  // Code surfaces
  codeBg: "rgb(24, 24, 42)",
  codeText: "rgb(200, 214, 240)",

  // Misc named tones used by some components
  gunmetalBlack: "rgb(26, 21, 32)",
  babyPink: "rgb(243, 182, 176)",
  lilac: "rgb(204, 204, 255)",
} as const

/** Accent cycle used by Footer headings, etc. */
export const accents = ["#4F58AF", "#EE978E", "#FABA32", "#D4DF68", "#8BD9C3"] as const

export const fonts = {
  display: '"Jua", sans-serif', // hero display
  ui: '"Fredoka", sans-serif', // UI / buttons / card titles
  accent: '"Caveat", cursive', // eyebrows, kickers, taglines
  body: '"Anonymous Pro", monospace', // body copy
  code: '"IBM Plex Mono", monospace', // code blocks
} as const

/** Font-family stacks, mirrored by the local FONT_STACKS maps inside components. */
export const FONT_STACKS: Record<string, string> = {
  Fredoka: '"Fredoka", sans-serif',
  Jua: '"Jua", sans-serif',
  "Anonymous Pro": '"Anonymous Pro", monospace',
  "IBM Plex Mono": '"IBM Plex Mono", monospace',
  Caveat: '"Caveat", cursive',
  "System Sans": "system-ui, -apple-system, sans-serif",
}
