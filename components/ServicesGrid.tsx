"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SERVICES, SERVICE_SLUGS } from "@/lib/services";
import { Mark, SERVICE_ICONS } from "./icons";

/** The visual at the bottom of each card: a small, quiet picture of what the service does. */
const VISUALS: Record<string, ReactNode> = {
  branding: (
    <div className="bc-viz bc-brand">
      <span className="bc-aa">Aa</span>
      <span className="bc-sw"><i /><i /><i /></span>
    </div>
  ),
  debranding: (
    <div className="bc-viz bc-debrand">
      <span className="bc-chip ghost">9 fonts</span>
      <span className="bc-chip ghost">6 logos</span>
      <span className="bc-chip dark">1 clear system</span>
    </div>
  ),
  rebranding: (
    <div className="bc-viz bc-rebrand">
      <span className="bc-tile old"><Mark /></span>
      <svg className="bc-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
      <span className="bc-tile new"><Mark /></span>
    </div>
  ),
  logo: (
    <div className="bc-viz bc-logo">
      <span className="bc-big"><Mark /></span>
      <span className="bc-chip">One mark</span>
    </div>
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
            <div className="bc-top">
              <h3>{SERVICES[slug].name}</h3>
              <span className="bc-ic">{SERVICE_ICONS[slug]}</span>
            </div>
            <p>{SERVICES[slug].line}</p>
            {VISUALS[slug]}
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
