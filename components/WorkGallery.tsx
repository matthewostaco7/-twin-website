"use client";

import { useState } from "react";
import ProjectTile from "./ProjectTile";
import { FILTERS, PROJECTS, TAB_COPY, type Filter } from "@/lib/projects";
import { site } from "@/lib/site";

const LABEL: Record<Filter, string> = { all: "All", Brand: "Brand", Rebrand: "Rebrand", Debrand: "Debrand", Logo: "Logo" };

export default function WorkGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = PROJECTS.filter((p) => filter === "all" || p.type === filter);

  return (
    <div id="view-work">
      <section className="work-page wrap">
        <h1>Work</h1>
        <p className="lead" aria-live="polite">{TAB_COPY[filter]}</p>

        {/* The filter tabs are always here, locked or not. */}
        <div className="filters" role="group" aria-label="Filter work">
          {FILTERS.map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>{LABEL[f]}</button>
          ))}
        </div>

        {site.workLocked ? (
          // Locked: two rows of the grid, fading out, with one message.
          <>
            <div className="gallery locked" aria-hidden="true">
              {Array.from({ length: 10 }, (_, i) => <span key={i} className="g"><span className="ph" /></span>)}
            </div>
            <p className="locked-msg">Unlocking Soon</p>
          </>
        ) : (
          <div className="gallery">
            {shown.map((p) => <ProjectTile key={filter + p.id} p={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
