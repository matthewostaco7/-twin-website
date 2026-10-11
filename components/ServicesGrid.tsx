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

/** A flat, hard-edged cast shadow lying under a shape. (cx, cy) is its centre, w its half-width. */
function Shadow({ cx, cy, w }: { cx: number; cy: number; w: number }) {
  const h = w * 0.577;
  return <polygon className="iso-shadow" points={`${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`} />;
}

const Iso = ({ box, children }: { box: string; children: ReactNode }) => (
  <div className="bc-viz">
    <svg className="iso-art" viewBox={box} aria-hidden="true">{children}</svg>
  </div>
);

/** One element at the bottom of each card: a soft isometric picture of the service. */
const VISUALS: Record<string, ReactNode> = {
  // built up from the ground: three blocks stepping up
  branding: (
    <Iso box="20 60 140 130">
      <Shadow cx={94} cy={150} w={60} />
      <Cube cx={78} cy={100} a={28} tone="signal" />
      <Cube cx={78} cy={72} a={28} tone="signal" />
      <Cube cx={102} cy={114} a={28} tone="signal" />
    </Iso>
  ),
  // many parts reduced to one
  debranding: (
    <Iso box="26 40 148 104">
      <Shadow cx={104} cy={104} w={64} />
      <Cube cx={100} cy={46} a={26} tone="air" />
      <Cube cx={78} cy={59} a={26} tone="air" />
      <Cube cx={122} cy={59} a={26} tone="air" />
      <Cube cx={100} cy={72} a={26} tone="signal" />
    </Iso>
  ),
  // old to new
  rebranding: (
    <Iso box="14 60 172 92">
      <Shadow cx={52} cy={118} w={40} />
      <Shadow cx={156} cy={118} w={40} />
      <Cube cx={48} cy={70} a={30} tone="air" />
      <path className="iso-arrow" d="M88 112h24m-8-8l8 8-8 8" />
      <Cube cx={152} cy={70} a={30} tone="signal" />
    </Iso>
  ),
  // one mark: a soft pyramid
  logo: (
    <Iso box="22 22 156 134">
      <Shadow cx={106} cy={110} w={68} />
      <g className="iso iso-signal">
        <polygon className="l" points="100,30 52,104 100,138" />
        <polygon className="r" points="100,30 100,138 148,104" />
      </g>
    </Iso>
  ),
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
              {VISUALS[slug]}
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
