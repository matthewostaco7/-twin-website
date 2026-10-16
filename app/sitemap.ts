import type { MetadataRoute } from "next";
import { SERVICE_SLUGS } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/** Pages Google should know about. Add /work here when workLocked is set to false. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...SERVICE_SLUGS.map((s) => `/services/${s}`), "/contact", "/privacy", "/terms"];
  return paths.map((p) => ({ url: `${site.url}${p === "/" ? "/" : p + "/"}` }));
}
