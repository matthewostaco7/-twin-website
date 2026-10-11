"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SERVICES, SERVICE_SLUGS } from "@/lib/services";

/** One bold element at the bottom of each card: a quiet picture of the service. */
const VISUALS: Record<string, ReactNode> = {
  branding: <div className="bc-viz"><span className="bc-aa">Aa</span></div>,
  debranding: <div className="bc-viz"><span className="bc-aa bc-num"><s>9</s><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>1</span></div>,
  rebranding: (
    <div className="bc-viz bc-rebrand">
      <span className="bc-tile old"><svg viewBox="0 0 40 40" aria-hidden="true"><rect x="7" y="7" width="26" height="26" rx="3" /></svg></span>
      <svg className="bc-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
      <span className="bc-tile new"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="14" /></svg></span>
    </div>
  ),
  logo: (
    <div className="bc-viz">
      <span className="bc-shape"><svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,8 96,92 4,92" /></svg></span>
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
            <div className="bc-graphic">{VISUALS[slug]}</div>
            <div className="bc-info">
              <h3>{SERVICES[slug].name}</h3>
              <p>{SERVICES[slug].line}</p>
              <span className="bc-cta">View Service <span className="bc-go" aria-hidden="true">&rarr;</span></span>
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
