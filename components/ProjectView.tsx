"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import ProjectTile from "./ProjectTile";
import { IconBack, IconClose, IconNext, IconPrev } from "./icons";
import { PROJECTS, coverOf, moreLike, safeSrc, sectionsOf, type Project, type ProjectImage } from "@/lib/projects";

function Figure({ im, p }: { im: ProjectImage | null; p: Project }) {
  const src = im ? safeSrc(im.src) : "";
  const cap = im?.caption || "";
  const ratio = im?.w && im?.h ? (im.w / im.h).toFixed(3) : String(p.r);
  const ref = useRef<HTMLImageElement>(null);
  const [alpha, setAlpha] = useState(false);

  // pictures with transparent areas get a light backing in dark mode so dark logos stay visible
  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    const check = () => {
      try {
        const cv = document.createElement("canvas");
        cv.width = 8; cv.height = 8;
        const cx = cv.getContext("2d", { willReadFrequently: true });
        if (!cx) return;
        cx.drawImage(img, 0, 0, 8, 8);
        const d = cx.getImageData(0, 0, 8, 8).data;
        for (let i = 3; i < d.length; i += 4) if (d[i] < 250) { setAlpha(true); break; }
      } catch {}
    };
    if (img.complete && img.naturalWidth) check();
    else img.addEventListener("load", check, { once: true });
  }, [src]);

  return (
    <figure className="pj-fig">
      <div className={"pj-img" + (alpha ? " has-alpha" : "")} style={{ aspectRatio: ratio, ...(im?.w ? { "--nw": im.w + "px" } : {}) } as CSSProperties}>
        {src && <img ref={ref} src={src} alt={cap || p.name} loading="lazy" />}
      </div>
      {cap && <figcaption>{cap}</figcaption>}
    </figure>
  );
}

/** Several images in one chapter: one at a time, dots + soft arrows, swipe works too. */
function Carousel({ list, p, label }: { list: (ProjectImage | null)[]; p: Project; label: string }) {
  const row = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [tapped, setTapped] = useState<"prev" | "next" | null>(null);

  const figs = () => Array.from(row.current?.querySelectorAll<HTMLElement>(".pj-fig") || []);
  const centre = (f: HTMLElement) => f.offsetLeft + f.clientWidth / 2 - (row.current?.clientWidth || 0) / 2;
  const current = () => {
    const r = row.current; let b = 0, bd = 1e9;
    figs().forEach((f, k) => { const d = Math.abs(centre(f) - (r?.scrollLeft || 0)); if (d < bd) { bd = d; b = k; } });
    return b;
  };
  const go = (i: number) => {
    const all = figs(), f = all[Math.max(0, Math.min(all.length - 1, i))];
    if (f) row.current?.scrollTo({ left: centre(f), behavior: "smooth" });
  };

  useEffect(() => {
    const r = row.current;
    if (!r) return;
    const fx = () => {
      const all = figs();
      const w = Math.max(1, all[0]?.clientWidth || 1);
      all.forEach((f) => {
        const d = Math.min(1, Math.abs(centre(f) - r.scrollLeft) / w);
        (f.firstElementChild as HTMLElement).style.opacity = d < 0.02 ? "" : (1 - 0.45 * d).toFixed(3);
      });
      setIdx(current());
    };
    r.addEventListener("scroll", fx, { passive: true });
    addEventListener("resize", fx);
    fx();
    return () => { r.removeEventListener("scroll", fx); removeEventListener("resize", fx); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tap = (which: "prev" | "next", delta: number) => {
    setTapped(which);
    setTimeout(() => setTapped(null), 450);
    go(current() + delta);
  };

  return (
    <div className="pj-car" role="group" aria-roledescription="carousel" aria-label={label}>
      <div
        className="pj-row"
        tabIndex={0}
        ref={row}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(current() + 1); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); go(current() - 1); }
        }}
      >
        {list.map((im, i) => <Figure key={i} im={im} p={p} />)}
      </div>
      <button type="button" className={"car-btn prev" + (tapped === "prev" ? " tapped" : "")} aria-label="Previous image" hidden={idx === 0} onClick={() => tap("prev", -1)}><IconPrev /></button>
      <button type="button" className={"car-btn next" + (tapped === "next" ? " tapped" : "")} aria-label="Next image" hidden={idx === list.length - 1} onClick={() => tap("next", 1)}><IconNext /></button>
      <div className="car-dots">
        {list.map((_, i) => (
          <button key={i} type="button" className="car-dot" aria-label={`Image ${i + 1} of ${list.length}`} aria-current={i === idx ? "true" : undefined} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}

type Sec = { id: string; title: string; inToc: boolean; body: ReactNode };

export default function ProjectView({ id }: { id: string }) {
  const p = PROJECTS.find((x) => x.id === id)!;
  const router = useRouter();
  const scroll = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLUListElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [cur, setCur] = useState("");

  const cover = coverOf(p);
  const secs: Sec[] = [];
  if (p.ph || cover || p.reason) {
    secs.push({
      id: "pj-overview", title: "Overview", inToc: false,
      body: <>{(p.ph || cover) && <Figure im={cover} p={p} />}{p.reason && <p className="pj-reason">{p.reason}</p>}</>,
    });
  }
  for (const [key, title] of sectionsOf(p)) {
    const list: (ProjectImage | null)[] = p.ph ? [null] : p.sections?.[key] || [];
    if (!list.length) continue;
    secs.push({
      id: "pj-" + key, title, inToc: true,
      body: <><h2>{title}</h2>{list.length > 1 ? <Carousel list={list} p={p} label={title} /> : <Figure im={list[0]} p={p} />}</>,
    });
  }
  const more = moreLike(p);
  secs.push({
    id: "pj-more", title: "More like this", inToc: false,
    body: <><h2>More like this</h2><div className="mlt">{more.map((m, i) => <ProjectTile key={m.id} p={m} index={PROJECTS.indexOf(m)} delay={i * 30} small />)}</div></>,
  });
  const toc = secs.filter((s) => s.inToc);

  useEffect(() => { titleRef.current?.focus({ preventScroll: true }); }, [id]);

  // contents list follows the section in view
  useEffect(() => {
    const sc = scroll.current;
    if (!sc) return;
    setCur("");
    const io = new IntersectionObserver((es) => {
      const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (v[0]) setCur(v[0].target.id);
    }, { root: innerWidth > 900 ? sc : null, rootMargin: "-10% 0px -70% 0px" });
    sc.querySelectorAll(".pj-sec").forEach((el) => io.observe(el));
    const atEnd = () => {
      const s = innerWidth > 900 ? sc : document.documentElement;
      if (toc.length && s.scrollTop + s.clientHeight >= s.scrollHeight - 4) setCur(toc[toc.length - 1].id);
    };
    sc.addEventListener("scroll", atEnd, { passive: true });
    addEventListener("scroll", atEnd, { passive: true });
    return () => { io.disconnect(); sc.removeEventListener("scroll", atEnd); removeEventListener("scroll", atEnd); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // phones: keep the active contents chip in view
  useEffect(() => {
    const ul = tocRef.current, on = ul?.querySelector<HTMLElement>('a[aria-current="true"]');
    if (ul && on && innerWidth <= 900) ul.scrollTo({ left: on.offsetLeft - ul.clientWidth / 2 + on.clientWidth / 2, behavior: "smooth" });
  }, [cur]);

  const jump = (e: MouseEvent, sid: string) => {
    e.preventDefault();
    const el = document.getElementById(sid), sc = scroll.current;
    if (!el || !sc) return;
    if (innerWidth > 900) sc.scrollTo({ top: el.offsetTop - parseInt(getComputedStyle(sc).paddingTop, 10), behavior: "smooth" });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    setCur(sid);
  };

  // arrow = previous page when there is one, otherwise Work
  const back = (e: MouseEvent) => {
    const nav = (window as unknown as { navigation?: { canGoBack?: boolean } }).navigation;
    const hops = (window as unknown as { __twinNav?: number }).__twinNav || 0;
    const can = nav && "canGoBack" in nav ? nav.canGoBack : hops > 1;
    if (can) { e.preventDefault(); router.back(); }
  };

  return (
    <div id="view-project">
      <div className="pj">
        <aside className="pj-side">
          <Link className="back" href="/work" aria-label="Back to previous page" title="Back" onClick={back}><IconBack /></Link>
          <Link className="pj-x" href="/work" aria-label="Close project, back to Work" title="Close"><IconClose /></Link>
          <div className="pj-meta">
            <h1 id="pjName" tabIndex={-1} ref={titleRef}>{p.name}</h1>
            <p className="pj-type" id="pjType">{p.type}</p>
            <span className="mono t3 pj-date" id="pjDate">{p.date || ""}</span>
          </div>
          <nav className="pj-toc" aria-label="On this page" hidden={!toc.length}>
            <span className="mono t3">Contents</span>
            <ul id="pjToc" ref={tocRef}>
              {toc.map((s) => (
                <li key={s.id}><a href={"#" + s.id} aria-current={cur === s.id ? "true" : "false"} onClick={(e) => jump(e, s.id)}>{s.title}</a></li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="pj-scroll" id="pjScroll" ref={scroll}>
          {secs.map((s) => (
            <section key={s.id} className="pj-sec" id={s.id} aria-label={s.id === "pj-overview" ? "Overview" : undefined}>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
