"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import ProjectTile from "./ProjectTile";
import { FILTERS, PROJECTS, TAB_COPY, type Filter } from "@/lib/projects";
import { site } from "@/lib/site";

const LABEL: Record<Filter, string> = { all: "All", Brand: "Brand", Rebrand: "Rebrand", Debrand: "Debrand", Logo: "Logo" };

/** Intro line: the first sentence is the lead, the rest follows. */
function Intro({ text }: { text: string }) {
  let i = text.indexOf(". ");
  if (i < 0) i = text.indexOf(", ");
  if (i < 0) return <p>{text}</p>;
  return <p><span className="gi-lead">{text.slice(0, i + 1)}</span>{text.slice(i + 1)}</p>;
}

let savedScroll = 0; // gallery scroll position, restored when coming back from a project

export default function WorkGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [ghosts, setGhosts] = useState(0);
  const pill = useRef<HTMLDivElement>(null);
  const ind = useRef<HTMLSpanElement>(null);
  const gal = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);

  const shown = PROJECTS.filter((p) => filter === "all" || p.type === filter);

  // sliding SIGNAL-orange pill behind the active tab
  const moveInd = useCallback(() => {
    const b = pill.current?.querySelector<HTMLElement>('.fp[aria-pressed="true"]');
    if (!b || !ind.current || !b.offsetWidth) return;
    ind.current.style.width = b.offsetWidth + "px";
    ind.current.style.transform = "translateX(" + b.offsetLeft + "px)";
  }, []);
  useLayoutEffect(moveInd, [filter, moveInd]);
  useEffect(() => {
    addEventListener("resize", moveInd);
    document.fonts?.ready.then(moveInd);
    return () => removeEventListener("resize", moveInd);
  }, [moveInd]);

  // keep the gallery position when opening a project and coming back
  useEffect(() => {
    const s = scroller.current;
    if (s && savedScroll) requestAnimationFrame(() => { s.scrollTop = savedScroll; });
    return () => { savedScroll = s?.scrollTop || 0; };
  }, []);

  // phones: swipe left / right to change tabs
  useEffect(() => {
    const el = view.current;
    if (!el) return;
    let x0 = 0, y0 = 0, t0 = 0, on = false;
    const start = (e: TouchEvent) => {
      if (e.touches.length !== 1) { on = false; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now(); on = true;
    };
    const end = (e: TouchEvent) => {
      if (!on) return;
      on = false;
      const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      if (innerWidth > 900 || Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2 || Date.now() - t0 > 800) return;
      setFilter((f) => {
        const n = FILTERS.indexOf(f) + (dx < 0 ? 1 : -1);
        return n >= 0 && n < FILTERS.length ? FILTERS[n] : f;
      });
    };
    const cancel = () => { on = false; };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    el.addEventListener("touchcancel", cancel, { passive: true });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", cancel);
    };
  }, []);

  // "Unlocking Soon": always show two full rows of tiles, and start the overlay where row two begins.
  useLayoutEffect(() => {
    if (!site.workLocked) return;
    let flip = false;
    const update = (force?: boolean) => {
      const g = gal.current, main = document.querySelector<HTMLElement>(".main.is-work");
      if (!g || !main) return;
      const cols = getComputedStyle(g).gridTemplateColumns.split(" ").length;
      const real = g.querySelectorAll(".g:not(.gz)").length;
      setGhosts(real ? Math.max(0, 2 * cols - real) : 0);
      const tiles = g.querySelectorAll<HTMLElement>(".g");
      let top: number;
      if (tiles[cols]) top = tiles[cols].getBoundingClientRect().top;
      else if (tiles.length) top = tiles[tiles.length - 1].getBoundingClientRect().bottom + 8;
      else return;
      // Chromium can leave tiles under the blurred overlay unpainted after a late reflow (fonts, images);
      // a sub-pixel change forces a repaint
      flip = force ? !flip : flip;
      main.style.setProperty("--soon-top", Math.max(top - 6, 0) + (flip ? 0.01 : 0) + "px");
    };
    const settle = () => update(true);
    update();
    const ro = new ResizeObserver(() => update());
    if (gal.current) ro.observe(gal.current);
    const onResize = () => update();
    addEventListener("resize", onResize);
    document.fonts?.ready.then(() => requestAnimationFrame(settle));
    if (document.readyState !== "complete") addEventListener("load", settle, { once: true });
    const timers = [setTimeout(settle, 600), setTimeout(settle, 1500)];
    return () => {
      ro.disconnect();
      removeEventListener("resize", onResize);
      removeEventListener("load", settle);
      timers.forEach(clearTimeout);
    };
  }, [filter, ghosts]);

  return (
    <div id="view-work" ref={view}>
      <section className="gal">
        <div className="fbar">
          <div className="fpill" id="filters" role="group" aria-label="Filter work" ref={pill}>
            <span className="fp-ind" id="fpInd" ref={ind} />
            {FILTERS.map((f) => (
              <button key={f} className="fp" type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {LABEL[f]}
              </button>
            ))}
          </div>
        </div>
        <div className="gal-scroll" id="galScroll" ref={scroller}>
          <div className="gal-intro" id="galIntro" aria-live="polite"><Intro text={TAB_COPY[filter]} /></div>
          <div className="gallery" id="gallery" ref={gal}>
            {shown.map((p, i) => (
              <ProjectTile key={filter + p.id} p={p} index={PROJECTS.indexOf(p)} delay={i * 30} />
            ))}
            {shown[0] && Array.from({ length: ghosts }, (_, k) => (
              <div key={"gz" + k} className="g gz" aria-hidden="true" style={{ pointerEvents: "none" }}>
                <div className="ph" style={{ aspectRatio: Number(shown[0].r) || 1 }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
