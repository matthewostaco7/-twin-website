"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { SERVICES, SERVICE_SLUGS } from "@/lib/services";

export default function ServiceView({ slug }: { slug: string }) {
  const x = SERVICES[slug];
  const view = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(-1);

  const toc: [string, string][] = [
    ["included", "What’s included"],
    ["process", "How it works"],
    ["deliverables", "Deliverables"],
  ];
  const [cur, setCur] = useState(toc[0][0]);

  // The contents list follows the section in view; at the very bottom the last item is current.
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

  const jump = (e: MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setCur(id);
  };

  return (
    <div id="view-service" ref={view}>
      <div className="svc-page wrap">
        <div className="svc-grid">
          <header className="svc-head">
            <h1>{x.name}</h1>
            <p className="lead">{x.overview}</p>
          </header>

          <aside className="svc-side">
            <div className="meta-card">
              <dl>
                <div><dt>Best for</dt><dd>{x.best}</dd></div>
                <div><dt>Timeline</dt><dd>{x.timeline}</dd></div>
                <div><dt>Revisions</dt><dd>{x.revisions}</dd></div>
              </dl>
              <Link className="btn" href={"/contact?need=" + encodeURIComponent(x.need)}>Start This Project</Link>
            </div>
            <nav className="toc" aria-label="On this page">
              <span className="mono t3">On this page</span>
              <ul>
                {toc.map(([id, label]) => (
                  <li key={id}><a href={"#" + id} aria-current={cur === id ? "true" : undefined} onClick={(e) => jump(e, id)}>{label}</a></li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="svc-body">
            <section id="included">
              <h2>What&rsquo;s included</h2>
              <ol className="inc">{x.included.map((t) => <li key={t}>{t}</li>)}</ol>
            </section>
            <section id="process">
              <h2>How it works</h2>
              <div className="accs">
                {x.steps.map(([title, text], i) => (
                  <div key={title} id={"acc" + i} className={"acc" + (open === i ? " open" : "")}>
                    <h3>
                      <button className="acc-h" id={"accb" + i} aria-expanded={open === i} aria-controls={"accp" + i}
                        onClick={() => { setOpen(open === i ? -1 : i); }}>
                        <span className="acc-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                        <span className="acc-t">{title}</span>
                        <span className="acc-i" aria-hidden="true">
                          <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path className="v" d="M12 5v14" /></svg>
                        </span>
                      </button>
                    </h3>
                    <div className="acc-p" id={"accp" + i} role="region" aria-labelledby={"accb" + i} inert={open !== i}>
                      <div><p>{text}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section id="deliverables">
              <h2>Deliverables</h2>
              <ul className="dl">
                {x.deliverables.map(([name, format]) => <li key={name}><span>{name}</span><em>{format}</em></li>)}
              </ul>
            </section>
          </div>

          <nav className="svc-more" aria-label="Services">
            {SERVICE_SLUGS.map((k) => (
              <Link key={k} href={"/services/" + k} aria-current={k === slug ? "page" : undefined}>{SERVICES[k].name}</Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
