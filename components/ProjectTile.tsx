import Link from "next/link";
import type { CSSProperties } from "react";
import { coverOf, safeSrc, type Project } from "@/lib/projects";

/** One tile in the Work gallery or the "More like this" row. */
export default function ProjectTile({ p, index, delay, small }: { p: Project; index: number; delay: number; small?: boolean }) {
  const cover = coverOf(p);
  const src = cover ? safeSrc(cover.src) : "";
  const r = Number(p.r) > 0 ? Number(p.r) : 1;
  return (
    <Link
      className="g"
      href={"/work/" + p.id}
      aria-label={p.name}
      style={{ "--ar": r, animationDelay: delay + "ms" } as CSSProperties}
    >
      <div className={"ph" + (index % 2 ? " alt" : "")} style={{ aspectRatio: r }}>
        {src && <img className="cv" src={src} alt="" loading="lazy" decoding="async" />}
        {!small && (
          <span className="cap">
            {p.name} <span>&middot; {p.type}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
