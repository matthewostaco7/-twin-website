import Link from "next/link";
import { coverOf, safeSrc, type Project } from "@/lib/projects";

/** One tile in the Work grid or the "More like this" row: a fixed-ratio image with its name and type in a small label on the tile. */
export default function ProjectTile({ p }: { p: Project }) {
  const cover = coverOf(p);
  const src = cover ? safeSrc(cover.src) : "";
  return (
    <Link className="g" href={"/work/" + p.id}>
      <span className="ph">
        {src && <img src={src} alt="" loading="lazy" decoding="async" />}
        <span className="g-cap">{p.name}<span>{p.type}</span></span>
      </span>
    </Link>
  );
}
