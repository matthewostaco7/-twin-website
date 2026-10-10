"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { MetaIcons } from "./icons";
import { SERVICES, SERVICE_SLUGS } from "@/lib/services";

export default function ServiceView({ slug }: { slug: string }) {
  const x = SERVICES[slug];
  const router = useRouter();
  const view = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(-1);

  const toc: [string, string][] = [
    ["included", "What's included"],
    ...(x.extra ? ([["language", "Brand language"], ["typography", "Typography"]] as [string, string][]) : []),
    ["process", "How it works"],
    ["deliverables", "Deliverables"],
  ];
  const [cur, setCur] = useState(toc[0][0]);

  // contents list follows the section in view; the last item lights up at the bottom of the page
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setCur(vis[0].target.id);
    }, { rootMargin: "-15% 0px -70% 0px" });
    v.querySelectorAll("section[id]").forEach((el) => io.observe(el));
    const main = document.getElementById("main");
    const onScroll = () => {
      const sc = innerWidth > 900 && main ? main : document.documentElement;
      if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4) setCur(toc[toc.length - 1][0]);
    };
    main?.addEventListener("scroll", onScroll, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); main?.removeEventListener("scroll", onScroll); removeEventListener("scroll", onScroll); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // phones: swipe sideways to the previous / next service
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    let x0 = 0, y0 = 0, t0 = 0, ok = false;
    const start = (e: TouchEvent) => {
      if (innerWidth > 900 || e.touches.length !== 1) { ok = false; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now(); ok = true;
    };
    const end = (e: TouchEvent) => {
      if (!ok) return;
      ok = false;
      const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5 || Date.now() - t0 > 800) return;
      const next = SERVICE_SLUGS[SERVICE_SLUGS.indexOf(slug) + (dx < 0 ? 1 : -1)];
      if (next) router.push("/services/" + next);
    };
    v.style.touchAction = "pan-y";
    v.addEventListener("touchstart", start, { passive: true });
    v.addEventListener("touchend", end, { passive: true });
    return () => { v.removeEventListener("touchstart", start); v.removeEventListener("touchend", end); };
  }, [slug, router]);

  const jump = (e: MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setCur(id);
  };

  const toggle = (i: number) => {
    const opening = open !== i;
    setOpen(opening ? i : -1);
    if (opening) setTimeout(() => document.getElementById("acc" + i)?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 340);
  };

  const tabs = SERVICE_SLUGS.map((k) => (
    <Link key={k} className="svc-tab" href={"/services/" + k} aria-current={k === slug ? "page" : undefined}>{SERVICES[k].name}</Link>
  ));
  const rows: [string, string][] = [["Best for", x.best], ["Timeline", x.timeline], ["Revisions", x.revisions]];
  const listSec = (id: string, h: string, c: [string, string[]]) => (
    <section id={id}>
      <h2>{h}</h2>
      <p className="lead">{c[0]}</p>
      <ol className="inc">{c[1].map((t) => <li key={t}>{t}</li>)}</ol>
    </section>
  );

  return (
    <div id="view-service" ref={view}>
      <div className="svc-page">
        <div className="svc-cols">
          <article className="svc-main">
            <header>
              <h1 className="svc-h1">{x.name}</h1>
              <p className="lead svc-intro">{x.overview}</p>
            </header>
            <section id="included">
              <h2>What&apos;s included</h2>
              <ol className="inc">{x.included.map((t) => <li key={t}>{t}</li>)}</ol>
            </section>
            {x.extra && listSec("language", "Brand language", x.extra.lang)}
            {x.extra && listSec("typography", "Typography", x.extra.type)}
            <section id="process">
              <h2>How it works</h2>
              <div className="accs">
                {x.steps.map((st, i) => (
                  <div key={st[0]} id={"acc" + i} className={"acc" + (open === i ? " open" : "")}>
                    <h3>
                      <button className="acc-h" id={"accb" + i} aria-expanded={open === i} aria-controls={"accp" + i} onClick={() => toggle(i)}>
                        <span className="acc-t">{st[0]}</span>
                        <span className="acc-i" aria-hidden="true">
                          <svg className="ic" viewBox="0 0 24 24"><path d="M5 12h14" /><path className="v" d="M12 5v14" /></svg>
                        </span>
                      </button>
                    </h3>
                    <div className="acc-p" id={"accp" + i} role="region" aria-labelledby={"accb" + i} inert={open !== i}>
                      <div><p>{st[1]}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section id="deliverables">
              <h2>Deliverables</h2>
              <p className="dl-note">The handoff documents you receive, and the format each one comes in.</p>
              <ul className="dl">
                {x.deliverables.map((d) => <li key={d[0]}><span>{d[0]}<em>{d[1]}</em></span></li>)}
              </ul>
            </section>
            <nav className="svc-pn svc-tabs svc-pn-m" aria-label="More services"><span className="svc-pill">{tabs}</span></nav>
          </article>
          <aside className="svc-side">
            <div className="meta-card">
              <dl>
                {rows.map((r, i) => (
                  <div key={r[0]} className={"r" + (i === 0 ? " first" : "")}>
                    <dt>
                      {MetaIcons[r[0]] && <span className="mi" aria-hidden="true"><svg className="ic" viewBox="0 0 24 24">{MetaIcons[r[0]]}</svg></span>}
                      <span>{r[0]}</span>
                    </dt>
                    <dd>{r[1]}</dd>
                  </div>
                ))}
              </dl>
              <Link className="btn" href={"/contact?need=" + encodeURIComponent(x.need)}>Start This Project</Link>
            </div>
            <nav className="toc" aria-label="Table of contents">
              <span className="mono t3">On this page</span>
              <ul>
                {toc.map(([id, label]) => (
                  <li key={id}><a href={"#" + id} aria-current={cur === id ? "true" : "false"} onClick={(e) => jump(e, id)}>{label}</a></li>
                ))}
              </ul>
            </nav>
            <nav className="svc-pn-d" aria-label="More services"><span className="mono t3">More services</span>{tabs}</nav>
          </aside>
        </div>
      </div>
    </div>
  );
}
