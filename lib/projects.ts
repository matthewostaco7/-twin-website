import data from "@/content/projects.json";

export type ProjectType = "Brand" | "Rebrand" | "Debrand" | "Logo";
export const TYPES: ProjectType[] = ["Brand", "Rebrand", "Debrand", "Logo"];

export type ProjectImage = { src: string; caption?: string; w?: number; h?: number };

export type Project = {
  id: string;
  name: string;
  type: ProjectType;
  date?: string;
  reason?: string;
  /** tile aspect ratio (width / height) */
  r: number;
  cover?: ProjectImage | null;
  sections?: Record<string, ProjectImage[]>;
  /** placeholder project, shown until real projects exist */
  ph?: boolean;
};

// Each service has its own chapters. They drive the contents list and the page sections.
export const SECTION_DEFS: Record<ProjectType, [string, string][]> = {
  Brand: [["logo", "Logo"], ["colors", "Colors"], ["typography", "Typography"], ["language", "Brand language"], ["application", "Application"]],
  Rebrand: [["before", "Before"], ["logo", "Logo"], ["colors", "Colors"], ["typography", "Typography"], ["language", "Brand language"], ["application", "Application"]],
  Debrand: [["audit", "Audit"], ["logo", "Logo"], ["colors", "Colors"], ["typography", "Typography"], ["application", "Application"]],
  Logo: [["logo", "Logo"], ["variations", "Variations"], ["application", "Application"]],
};

export const sectionsOf = (p: Project) => SECTION_DEFS[p.type] || SECTION_DEFS.Brand;

export function coverOf(p: Project): ProjectImage | null {
  if (p.cover) return p.cover;
  for (const [key] of sectionsOf(p)) {
    const list = p.sections?.[key];
    if (list && list.length) return list[0];
  }
  return null;
}

/** Only allow site-relative paths, http(s) URLs and embedded raster images. */
export function safeSrc(u: unknown): string {
  if (typeof u !== "string") return "";
  if (/^data:image\/(png|jpe?g|webp|gif|avif);/.test(u)) return u;
  if (/^(\/(?!\/)|https?:\/\/)/.test(u)) return u;
  return "";
}

const ratios = [0.8, 1, 0.75, 1.33, 0.67, 1.25, 0.9, 1.1];
const PLACEHOLDERS: Project[] = Array.from({ length: 20 }, (_, i) => ({
  id: "p" + i,
  name: "Client " + String(i + 1).padStart(2, "0"),
  type: TYPES[i % 4],
  r: ratios[(i * 3) % ratios.length],
  date: "2026",
  reason: "",
  ph: true,
}));

/** Real projects from content/projects.json */
export const REAL_PROJECTS: Project[] = Array.isArray(data.projects) ? (data.projects as Project[]) : [];
/** What the gallery shows: real projects, or placeholders until the first one is added */
export const PROJECTS: Project[] = REAL_PROJECTS.length ? REAL_PROJECTS : PLACEHOLDERS;

export const getProject = (id: string) => PROJECTS.find((p) => p.id === id);

export function moreLike(p: Project, n = 5): Project[] {
  const same = PROJECTS.filter((x) => x !== p && x.type === p.type);
  const rest = PROJECTS.filter((x) => x !== p && x.type !== p.type);
  return same.concat(rest).slice(0, n);
}

export const FILTERS = ["all", ...TYPES] as const;
export type Filter = (typeof FILTERS)[number];

// Short description under the Work tabs
export const TAB_COPY: Record<Filter, string> = {
  all: "A look at what we’ve made so far, from first marks to full brand systems.",
  Brand: "Brands built from the ground up. From who you are to a system you can run.",
  Rebrand: "Companies ready for their next look. Same story, told the way it deserves.",
  Debrand: "Less noise, fewer parts. We strip a brand back until only what matters is left.",
  Logo: "One mark, done right. Simple, ownable and built to hold up everywhere.",
};
