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

// light from the upper left: shadows fall down and to the right
const LIGHT = [0.55, 0.84];

/**
 * A flat cast shadow. Each chain is a run of the shape's base edges swept along the light direction,
 * far enough that the folder's edge clips it. Hard-edged, one flat tone per face: lighter under the
 * lit face, deeper under the shaded face. Warm shades of the paper, low opacity.
 */
function Cast({ lit, dark }: { lit: Pt[]; dark: Pt[] }) {
  const FAR = 260;
  const sweep = (c: Pt[]) =>
    c
      .concat(c.map((p) => [p[0] + LIGHT[0] * FAR, p[1] + LIGHT[1] * FAR]).reverse())
      .map((p) => p.join(","))
      .join(" ");
  return (
    <>
      <polygon points={sweep(lit)} fill="#B79A6E" fillOpacity={0.2} />
      <polygon points={sweep(dark)} fill="#A07F4F" fillOpacity={0.3} />
    </>
  );
}

type Visual = { box: string; cast: ReactNode; art: ReactNode };

/** One element at the bottom of each card: a soft isometric picture of the service. */
const VISUALS: Record<string, Visual> = {
  // built up from the ground: three blocks stepping up
  branding: {
    box: "40 60 100 116",
    cast: <Cast lit={[[53.75, 142], [78, 156], [102, 170]]} dark={[[102, 170], [126.25, 156]]} />,
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
    cast: <Cast lit={[[55.5, 98], [78, 111], [100, 124]]} dark={[[100, 124], [122, 111], [144.5, 98]]} />,
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
        <Cast lit={[[22, 115], [48, 130]]} dark={[[48, 130], [74, 115]]} />
        <Cast lit={[[126, 115], [152, 130]]} dark={[[152, 130], [178, 115]]} />
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
    cast: <Cast lit={[[52, 104], [100, 138]]} dark={[[100, 138], [148, 104]]} />,
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
              <span className="bc-go" aria-hidden="true">&rarr;</span>
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
