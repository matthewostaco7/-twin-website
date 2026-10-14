export type Service = {
  name: string;
  line: string;
  overview: string;
  included: string[];
  steps: [string, string][];
  deliverables: [string, string][];
  timeline: string;
  revisions: string;
  best: string;
  /** matching option in the contact form */
  need: string;
};

const ALWAYS: [string, string][] = [
  ["Brand Guidelines", "PDF"],
  ["Brand source file", "Figma"],
  ["Brand asset library", "HTML"],
  ["Social & marketing kit", "Canva"],
  ["Design tokens", "JSON"],
  ["Brand brief for AI & teams", "Markdown"],
];

export const SERVICES: Record<string, Service> = {
  branding: {
    name: "Branding",
    line: "Built from the ground up.",
    overview:
      "For new companies that need a complete visual identity, built from the ground up: logo, color, type, and the system that holds it together.",
    included: [
      "Visual direction and references",
      "Logo design",
      "Color palette and typography system",
      "Brand language",
      "Typography",
      "Component library, grid, and spacing",
      "Visual style guide",
      "Applications across key touchpoints",
    ],
    steps: [
      ["Discover", "Visual research and references."],
      ["Define", "Choose the visual direction."],
      ["Build", "Logo and visual system."],
      ["Systemize", "Everything packaged to ship."],
    ],
    deliverables: ALWAYS,
    timeline: "3 weeks",
    revisions: "2 rounds",
    best: "New companies",
    need: "Branding",
  },
  debranding: {
    name: "Debranding",
    line: "Fewer parts. One clear system.",
    overview:
      "For companies with too many logos, fonts, and colors. We subtract until what's left is one clear visual system that looks like you.",
    included: [
      "Visual audit of what exists today",
      "One refined primary logo",
      "A single, reduced color palette",
      "Two to three fonts, no more",
      "Simplified components and clear hierarchy",
      "A retire guide: what not to use anymore",
    ],
    steps: [
      ["Audit", "We review every visual that exists today."],
      ["Clarify", "Decide which visuals are essential."],
      ["Simplify", "Cut, merge, refine."],
      ["Hand over", "Files, guidelines, retire guide."],
    ],
    deliverables: ALWAYS,
    timeline: "2–3 weeks",
    revisions: "2 rounds",
    best: "Cluttered brands",
    need: "Debranding",
  },
  rebranding: {
    name: "Rebranding",
    line: "Caught up to who you are now.",
    overview:
      "For companies whose visuals no longer reflect who they've become. We keep what works and redesign what doesn't.",
    included: [
      "Visual audit: what works, what's dated",
      "Updated visual direction",
      "Logo refresh or full redesign",
      "Updated palette and modern typography",
      "Brand language",
      "Typography",
      "Enhanced component library",
      "Transition guide from the old brand",
    ],
    steps: [
      ["Clarify", "Audit the current visuals."],
      ["Refine", "Choose the new visual direction."],
      ["Rebuild", "New identity system."],
      ["Systemize", "Guidelines and transition plan."],
    ],
    deliverables: ALWAYS,
    timeline: "3–4 weeks",
    revisions: "2 rounds",
    best: "Evolved companies",
    need: "Rebranding",
  },
  logo: {
    name: "Logo",
    line: "One mark. Done right.",
    overview: "A single, well-made mark for companies that already know who they are and just need the logo.",
    included: ["Logo concept directions", "Refinement based on your feedback", "Lockups and variations", "Clear usage rules"],
    steps: [
      ["Brief", "A short call about the company."],
      ["Explore", "Several directions."],
      ["Refine", "One direction, polished."],
      ["Deliver", "Final files and usage rules."],
    ],
    deliverables: [
      ["Brand Guidelines (logo usage)", "PDF"],
      ["Logo and lockups", "SVG, PNG"],
      ["Logo variations", "SVG, PNG"],
      ["Source file", "Figma"],
    ],
    timeline: "Scoped per project",
    revisions: "2 rounds",
    best: "Clear brands",
    need: "Logo only",
  },
};

export const SERVICE_SLUGS = Object.keys(SERVICES);

export const NEED_OPTIONS = ["Branding", "Rebranding", "Debranding", "Logo only", "Not sure"];
