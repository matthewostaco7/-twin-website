"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { NEED_OPTIONS } from "@/lib/services";
import { site } from "@/lib/site";

type Fields = { name: string; contact: string; company: string; project: string };

/** Contact form. No backend: it opens the visitor's email app, pre-filled. */
export default function InquiryForm() {
  const [f, setF] = useState<Fields>({ name: "", contact: "", company: "", project: "" });
  const [need, setNeed] = useState<string[]>([]);
  const [err, setErr] = useState({ name: false, contact: false, need: false });
  const [sent, setSent] = useState<{ href: string; text: string } | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy my enquiry");
  const refs = {
    name: useRef<HTMLInputElement>(null),
    contact: useRef<HTMLInputElement>(null),
    company: useRef<HTMLInputElement>(null),
    project: useRef<HTMLTextAreaElement>(null),
    need: useRef<HTMLInputElement>(null),
    title: useRef<HTMLHeadingElement>(null),
  };
  const thanks = useRef<HTMLDialogElement>(null);

  // /contact?need=Branding preselects a service
  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("need");
    if (n && NEED_OPTIONS.includes(n)) setNeed([n]);
    refs.title.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: keyof Fields) => (v: string) => {
    setF((s) => ({ ...s, [k]: v }));
    if (k === "name" || k === "contact") setErr((e) => ({ ...e, [k]: false }));
  };

  // "Not sure" stands alone; any specific pick clears it
  const toggleNeed = (v: string, on: boolean) => {
    setErr((e) => ({ ...e, need: false }));
    setNeed((cur) => {
      if (!on) return cur.filter((x) => x !== v);
      const keep = cur.filter((x) => (v === "Not sure") === (x === "Not sure"));
      return [...keep, v];
    });
  };

  const toTop = () => { document.getElementById("main")?.scrollTo(0, 0); window.scrollTo(0, 0); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = { name: f.name.trim(), contact: f.contact.trim(), company: f.company.trim(), project: f.project.trim() };
    const picked = NEED_OPTIONS.filter((o) => need.includes(o)).join(", ");
    const bad = { name: !v.name, contact: !v.contact, need: !picked };
    setErr(bad);
    if (bad.name) return refs.name.current?.focus();
    if (bad.contact) return refs.contact.current?.focus();
    if (bad.need) return refs.need.current?.focus();
    const subject = "Inquiry: " + picked + " — " + (v.company || v.name);
    const body = ["Name: " + v.name, "Email: " + v.contact, "Company: " + (v.company || "—"), "Need: " + picked, "", "About the project:", v.project || "—"].join("\r\n");
    const href = "mailto:" + site.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    window.location.href = href;
    setSent({ href, text: "To: " + site.email + "\r\nSubject: " + subject + "\r\n\r\n" + body });
    toTop();
    thanks.current?.showModal();
  };

  const copy = () => {
    if (!sent) return;
    const ok = () => { setCopyLabel("Copied"); setTimeout(() => setCopyLabel("Copy my enquiry"), 1800); };
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = sent.text; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch { setCopyLabel("Select and copy from your email"); }
      ta.remove();
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(sent.text).then(ok, fallback);
    else fallback();
  };

  return (
    <div id="view-inquire">
      <section className="inq wrap">
        <div className="inq-grid">
          <header className="inq-head">
            <h1 id="inqTitle" tabIndex={-1} ref={refs.title}>Twin, let&rsquo;s talk?</h1>
          </header>

          <div className="inq-main">
            <form id="inqForm" noValidate onSubmit={submit} hidden={!!sent}>
              <div className="f-row">
                <div className="f">
                  <label htmlFor="iName">Name</label>
                  <input id="iName" ref={refs.name} name="name" type="text" enterKeyHint="next" autoComplete="name" autoCapitalize="words" required
                    aria-invalid={err.name} aria-describedby={err.name ? "eName" : undefined} value={f.name} onChange={(e) => set("name")(e.target.value)} />
                  <p className="ferr" id="eName" hidden={!err.name}>Required</p>
                </div>
                <div className="f">
                  <label htmlFor="iContact">Email</label>
                  <input id="iContact" ref={refs.contact} name="contact" type="text" enterKeyHint="next" inputMode="email" autoComplete="email" autoCapitalize="off" spellCheck={false} required
                    aria-invalid={err.contact} aria-describedby={err.contact ? "eContact" : undefined} value={f.contact} onChange={(e) => set("contact")(e.target.value)} />
                  <p className="ferr" id="eContact" hidden={!err.contact}>Required</p>
                </div>
              </div>
              <div className="f">
                <label htmlFor="iCompany">Company</label>
                <input id="iCompany" ref={refs.company} name="company" type="text" enterKeyHint="next" autoComplete="organization" autoCapitalize="words"
                  value={f.company} onChange={(e) => set("company")(e.target.value)} />
              </div>
              <div className="f" id="needSet" role="group" aria-labelledby="needLabel">
                <span className="legend" id="needLabel">What do you need? <span className="hint">Pick one or more</span></span>
                <div className="opts">
                  {NEED_OPTIONS.map((o, i) => (
                    <label key={o} className="chip-r">
                      <input type="checkbox" name="need" value={o} ref={i === 0 ? refs.need : undefined} checked={need.includes(o)} onChange={(e) => toggleNeed(o, e.target.checked)} />
                      <span>{o}</span>
                    </label>
                  ))}
                </div>
                <p className="ferr" id="eNeed" hidden={!err.need}>Pick one</p>
              </div>
              <div className="f">
                <label htmlFor="iProj">Tell us about the project <span className="hint">Optional</span></label>
                <textarea id="iProj" ref={refs.project} name="project" rows={5} placeholder="What are you trying to build, change, or become?"
                  value={f.project} onChange={(e) => set("project")(e.target.value)} />
              </div>
              <div><button className="btn" type="submit">Submit</button></div>
            </form>

            <div className="done" id="inqDone" hidden={!sent}>
              <h2>Almost there.</h2>
              <p className="lead">Your email app opened with your inquiry. Press send to finish.</p>
              <div className="done-actions">
                <button className="btn btn-2" type="button" onClick={copy}>{copyLabel}</button>
                <button className="btn btn-2" type="button" onClick={() => { setSent(null); toTop(); }}>Edit inquiry</button>
              </div>
              <p className="done-s">
                Nothing opened? <a href={sent?.href || "#"}>Open it again</a> or write to <a href={"mailto:" + site.email}>{site.email}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* thank-you pop-up: a native modal dialog, so focus is trapped, Esc closes it and focus returns afterwards */}
      <dialog
        ref={thanks}
        className="thanks"
        aria-labelledby="thanksTitle"
        aria-describedby="thanksBody"
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
      >
        <div className="thanks-card">
          <span className="thanks-ic" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </span>
          <h2 id="thanksTitle">Thank you.</h2>
          <p id="thanksBody" className="lead">We will reply within 24 hours.</p>
          <p className="thanks-note">If your email app opened, press send to finish.</p>
          <button className="btn" type="button" autoFocus onClick={() => thanks.current?.close()}>Close</button>
        </div>
      </dialog>
    </div>
  );
}
