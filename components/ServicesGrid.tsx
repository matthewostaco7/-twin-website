"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SERVICES, SERVICE_SLUGS } from "@/lib/services";

type Tone = "signal" | "air";

/** One soft isometric block. (cx, cy) is its top corner; a is the edge length. */
function Cube({ cx, cy, a, tone }: { cx: number; cy: number; a: number; tone: Tone }) {
  const k = a * 0.866, m = a / 2;
  const f = (pts: number[][]) => pts.map((p) => p.join(",")).join(" ");
  return (
    <g className={"iso iso-" + tone}>
      <polygon className="l" points={f([[cx - k, cy + m], [cx, cy + a], [cx, cy + 2 * a], [cx - k, cy + 1.5 * a]])} />
      <polygon className="r" points={f([[cx + k, cy + m], [cx, cy + a], [cx, cy + 2 * a], [cx + k, cy + 1.5 * a]])} />
      <polygon className="t" points={f([[cx, cy], [cx + k, cy + m], [cx, cy + a], [cx - k, cy + m]])} />
    </g>
  );
}

type Pt = number[];

// Light from the upper left. On the floor plane of an isometric view, a shadow runs along the ground
// axis, which is 30 degrees below horizontal, so it stays parallel to the shapes' own edges.
const GROUND = [Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)];

const hull = (pts: Pt[]): Pt[] => {
  const p = [...pts].sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: Pt[]) => {
    const h: Pt[] = [];
    for (const q of list) {
      while (h.length > 1 && cross(h[h.length - 2], h[h.length - 1], q) <= 0) h.pop();
      h.push(q);
    }
    h.pop();
    return h;
  };
  return half(p).concat(half([...p].reverse()));
};

/**
 * A flat cast shadow. Each footprint is a shape's base on the floor; its shadow is that footprint
 * swept along the ground axis, far enough that the folder's edge clips it. The union is drawn as one
 * group so overlaps are not darker. Warm shade of the paper, low opacity, hard edged.
 */
function Cast({ bases }: { bases: Pt[][] }) {
  const REACH = 300;
  const sweep = (r: Pt[]) =>
    hull(r.concat(r.map((q) => [q[0] + GROUND[0] * REACH, q[1] + GROUND[1] * REACH]))).map((q) => q.join(",")).join(" ");
  return (
    <g fill="#A07F4F" opacity={0.15}>
      {bases.map((r, i) => (
        <polygon key={i} points={sweep(r)} />
      ))}
    </g>
  );
}

/** Footprint of a cube whose top corner is (cx, cy) with edge a. */
const foot = (cx: number, cy: number, a: number): Pt[] => {
  const k = a * 0.866;
  return [[cx - k, cy + 1.5 * a], [cx, cy + 2 * a], [cx + k, cy + 1.5 * a], [cx, cy + a]];
};

type Visual = { box: string; cast: ReactNode; art: ReactNode };

/** One element at the bottom of each card: a soft isometric picture of the service. */
const VISUALS: Record<string, Visual> = {
  // built up from the ground: three blocks stepping up
  branding: {
    box: "40 60 100 116",
    cast: <Cast bases={[foot(78, 100, 28), foot(102, 114, 28)]} />,
    art: (
      <>
        <Cube cx={78} cy={100} a={28} tone="signal" />
        <Cube cx={78} cy={72} a={28} tone="signal" />
        <Cube cx={102} cy={114} a={28} tone="signal" />
      </>
    ),
  },
  // many parts reduced to one
  debranding: {
    box: "44 40 112 92",
    cast: <Cast bases={[foot(78, 59, 26), foot(122, 59, 26), foot(100, 72, 26)]} />,
    art: (
      <>
        <Cube cx={100} cy={46} a={26} tone="air" />
        <Cube cx={78} cy={59} a={26} tone="air" />
        <Cube cx={122} cy={59} a={26} tone="air" />
        <Cube cx={100} cy={72} a={26} tone="signal" />
      </>
    ),
  },
  // old to new
  rebranding: {
    box: "14 60 172 80",
    cast: (
      <>
        <Cast bases={[foot(48, 70, 30), foot(152, 70, 30)]} />
      </>
    ),
    art: (
      <>
        <Cube cx={48} cy={70} a={30} tone="air" />
        <path className="iso-arrow" d="M88 112h24m-8-8l8 8-8 8" />
        <Cube cx={152} cy={70} a={30} tone="signal" />
      </>
    ),
  },
  // one mark: a soft pyramid
  logo: {
    box: "44 22 112 124",
    cast: <Cast bases={[[[52, 104], [100, 138], [148, 104], [100, 70]]]} />,
    art: (
      <g className="iso iso-signal">
        <polygon className="l" points="100,30 52,104 100,138" />
        <polygon className="r" points="100,30 100,138 148,104" />
      </g>
    ),
  },
};

/** "What we do": four service cards. On phones they scroll sideways, with dots underneath. */
export default function ServicesGrid() {
  const grid = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const g = grid.current;
    if (!g) return;
    let tick = 0;
    const set = () => {
      tick = 0;
      const cards = Array.from(g.querySelectorAll<HTMLElement>(".bc"));
      const mid = g.scrollLeft + g.clientWidth / 2;
      let best = 0, bd = 1e9;
      if (g.scrollLeft + g.clientWidth >= g.scrollWidth - 2) best = cards.length - 1;
      else cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - g.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < bd) { bd = d; best = i; }
      });
      setCur(best);
    };
    const onScroll = () => { if (!tick) tick = requestAnimationFrame(set); };
    g.addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", set);
    set();
    return () => { g.removeEventListener("scroll", onScroll); removeEventListener("resize", set); };
  }, []);

  const show = (i: number) => {
    const g = grid.current;
    const c = g?.querySelectorAll<HTMLElement>(".bc")[i];
    if (!g || !c) return;
    g.scrollTo({ left: c.offsetLeft - g.offsetLeft - parseFloat(getComputedStyle(g).paddingLeft || "0"), behavior: "smooth" });
  };

  return (
    <>
      <div className="bento" ref={grid}>
        {SERVICE_SLUGS.map((slug) => (
          <Link key={slug} className="bc rv" href={"/services/" + slug}>
            <div className="bc-graphic" aria-hidden="true">
              <span className="bc-tab" />
              <span className="bc-paper" />
              <span className="bc-inner"><span className="bc-inshadow" /></span>
              <span className="bc-front" />
              <div className="bc-cast">
                <svg className="iso-art iso-cast" viewBox={VISUALS[slug].box}>{VISUALS[slug].cast}</svg>
              </div>
              <div className="bc-viz">
                <svg className="iso-art" viewBox={VISUALS[slug].box}>{VISUALS[slug].art}</svg>
              </div>
            </div>
            <div className="bc-info">
              <h3>{SERVICES[slug].name}</h3>
              <span className="bc-go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6.5 17.5L17.5 6.5M8.5 6.5h9v9" /></svg></span>
            </div>
          </Link>
        ))}
      </div>
      <div className="svc-dots" role="group" aria-label="Services pages">
        {SERVICE_SLUGS.map((slug, i) => (
          <button
            key={slug}
            type="button"
            aria-label={`Show service ${i + 1} of ${SERVICE_SLUGS.length}`}
            aria-current={i === cur ? "true" : undefined}
            onClick={() => show(i)}
          />
        ))}
      </div>
    </>
  );
}
