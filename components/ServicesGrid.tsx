"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
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
 * A cast shadow, built the way a renderer softens one: a long, faint, blurry penumbra that runs out
 * past the folder edge (the folder clips it), plus a short, tight, darker contact shadow at the base.
 * Each chain is a run of the shape's base edges swept along the light direction. The part under the
 * lit face is lighter than the part under the shaded face. Colours are warm shades of the paper.
 */
function Cast({ lit, dark }: { lit: Pt[]; dark: Pt[] }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const sweep = (c: Pt[], len: number) =>
    c
      .concat(c.map((p) => [p[0] + LIGHT[0] * len, p[1] + LIGHT[1] * len]).reverse())
      .map((p) => p.join(","))
      .join(" ");
  const mid = (c: Pt[]) => [c.reduce((n, p) => n + p[0], 0) / c.length, c.reduce((n, p) => n + p[1], 0) / c.length];
  const FAR = 260, NEAR = 22;
  const grad = (id: string, c: Pt[], len: number, color: string, from: number, to: number) => {
    const m = mid(c);
    return (
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={m[0]} y1={m[1]} x2={m[0] + LIGHT[0] * len} y2={m[1] + LIGHT[1] * len}>
        <stop offset="0" stopColor={color} stopOpacity={from} />
        <stop offset="1" stopColor={color} stopOpacity={to} />
      </linearGradient>
    );
  };
  return (
    <>
      <defs>
        {grad(uid + "fl", lit, FAR, "#D6C3A6", 0.8, 0.5)}
        {grad(uid + "fd", dark, FAR, "#C2A982", 0.9, 0.55)}
        {grad(uid + "nl", lit, NEAR, "#A98C62", 0.5, 0)}
        {grad(uid + "nd", dark, NEAR, "#9A7A4C", 0.62, 0)}
      </defs>
      <g filter="url(#iso-soft)">
        <polygon points={sweep(lit, FAR)} fill={`url(#${uid}fl)`} />
        <polygon points={sweep(dark, FAR)} fill={`url(#${uid}fd)`} />
      </g>
      <g filter="url(#iso-core)">
        <polygon points={sweep(lit, NEAR)} fill={`url(#${uid}nl)`} />
        <polygon points={sweep(dark, NEAR)} fill={`url(#${uid}nd)`} />
      </g>
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
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <filter id="iso-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4.5" /></filter>
        <filter id="iso-core" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.6" /></filter>
      </svg>
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
