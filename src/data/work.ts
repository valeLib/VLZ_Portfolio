// Work Experience — ported from the Framer "Work Experience" CMS collection (Bxh5oBE4O).

export const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`

export type WorkItem = {
  id: string
  slug: string
  title: string
  year: string
  image: string
  contentHtml: string
}

// Ordered most-recent first (by start date).
export const work: WorkItem[] = [
  {
    id: "TtFpoIc6_",
    slug: "unity-developer-frontend-engineer-pignus",
    title: "Unity Developer & Frontend Engineer · Pignus",
    year: "2023",
    image: asset("work-pignus.png"),
    contentHtml:
      "<p><strong>Pignus</strong> (Jan 2023 – Present) — Unity mobile &amp; VR game development plus Vue.js dashboard migration, uniting gameplay engineering and frontend creativity.</p>",
  },
  {
    id: "kU4QqmezO",
    slug: "unity-xr-engineer-eye-search-ucl",
    title: "Unity XR Engineer · Eye-Search / University College London",
    year: "2022",
    image: asset("work-pignus.png"),
    contentHtml:
      "<p>Built clinical-grade VR eye-tracking exercises using Unity and C#, enhancing accessibility and patient experience for vision therapy protocols.</p>",
  },
  {
    id: "S8u91UN8w",
    slug: "shader-programmer-amblyopiavr-oxford",
    title: "Shader Programmer · AmblyopiaVR / University of Oxford",
    year: "2021",
    image: asset("work-amblyopia.png"),
    contentHtml:
      "<p>MATLAB stereo-vision algorithms ported to HLSL shaders for a VR therapy application built with the University of Oxford — clinical correctness on the GPU.</p>",
  },
  {
    id: "Dkr0Iq5fW",
    slug: "xr-research-developer-neurospeechai-ucl",
    title: "XR Research Developer · NeurospeechAI / University College London",
    year: "2021",
    image: asset("work-pignus.png"),
    contentHtml:
      "<p>Developed interactive XR tools for neuroimaging research and cognitive therapy, integrating Unity and research-driven design in multidisciplinary teams.</p>",
  },
  {
    id: "lHkigvVDj",
    slug: "frontend-engineer-capitalizarme",
    title: "Frontend Engineer · Capitalizarme",
    year: "2020",
    image: asset("work-pignus.png"),
    contentHtml:
      "<p>Re-architected financial dashboards with modern JavaScript frameworks, delivering improved UX and visual clarity for property investment tools.</p>",
  },
  {
    id: "f9QgHrB5y",
    slug: "vr-training-developer-universidad-de-chile-vr",
    title: "VR Training Developer · Universidad de Chile VR",
    year: "2020",
    image: asset("work-pignus.png"),
    contentHtml:
      "<p>Designed interactive VR lab simulations to enhance university STEM training, balancing pedagogical objectives and immersive design.</p>",
  },
  {
    id: "FmqPatJIS",
    slug: "game-programmer-pulso-escolar",
    title: "Game Programmer · Pulso Escolar",
    year: "2019",
    image: asset("work-pignus.png"),
    contentHtml:
      "<p>Created educational mini-games in Unity to support emotion recognition and social learning programs for Chilean schools.</p>",
  },
  {
    id: "x0AnVgsoB",
    slug: "research-assistant-nlhpc",
    title: "Research Assistant · NLHPC (National Laboratory for High Performance Computing)",
    year: "2018",
    image: asset("work-pignus.png"),
    contentHtml:
      "<p>Supported data visualization and systems research on national supercomputing projects, applying web and graphics technologies in academic contexts.</p>",
  },
]
