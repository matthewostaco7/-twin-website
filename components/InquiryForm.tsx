"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { IconBack, IconClear } from "./icons";
import { NEED_OPTIONS } from "@/lib/services";
import { site } from "@/lib/site";

type Fields = { name: string; contact: string; company: string; project: string };

/** Text field with a soft clear (x) button. */
function Clearable({ children, value, onClear, area, label }: { children: ReactNode; value: string; onClear: () => void; area?: boolean; label: string }) {
  return (
    <span className={"clr" + (area ? " ta" : "") + (value ? " has" : "")}>
      {children}
      <button type="button" className="clr-x" aria-label={"Clear " + label} onMouseDown={(e) => e.preventDefault()} onClick={onClear}>
        <IconClear />
      </button>
    </span>
  );
}

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
  const clear = (k: keyof Fields) => () => { set(k)(""); refs[k].current?.focus(); };

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
      <section className="inq">
        <Link className="back" href="/" aria-label="Back to home" title="Home"><IconBack /></Link>
        <div className="inq-in">
          <h1 id="inqTitle" tabIndex={-1} ref={refs.title}>Twin, let&rsquo;s talk?</h1>

          <form id="inqForm" noValidate onSubmit={submit} hidden={!!sent}>
            <div className="f">
              <label htmlFor="iName">Name</label>
              <Clearable value={f.name} onClear={clear("name")} label="name">
                <input id="iName" ref={refs.name} name="name" type="text" enterKeyHint="next" autoComplete="name" autoCapitalize="words" required
                  aria-invalid={err.name} value={f.name} onChange={(e) => set("name")(e.target.value)} />
              </Clearable>
              <p className="ferr" hidden={!err.name}>Required</p>
            </div>
            <div className="f">
              <label htmlFor="iContact">Email</label>
              <Clearable value={f.contact} onClear={clear("contact")} label="contact">
                <input id="iContact" ref={refs.contact} name="contact" type="text" enterKeyHint="next" inputMode="email" autoComplete="email" autoCapitalize="off" spellCheck={false} required
                  aria-invalid={err.contact} value={f.contact} onChange={(e) => set("contact")(e.target.value)} />
              </Clearable>
              <p className="ferr" hidden={!err.contact}>Required</p>
            </div>
            <div className="f">
              <label htmlFor="iCompany">Company</label>
              <Clearable value={f.company} onClear={clear("company")} label="company">
                <input id="iCompany" ref={refs.company} name="company" type="text" enterKeyHint="next" autoComplete="organization" autoCapitalize="words"
                  value={f.company} onChange={(e) => set("company")(e.target.value)} />
              </Clearable>
            </div>
            <fieldset className="f" id="needSet">
              <legend>What do you need? <span className="eyebrow">Pick one or more</span></legend>
              <div className="opts">
                {NEED_OPTIONS.map((o, i) => (
                  <label key={o} className="chip-r">
                    <input type="checkbox" name="need" value={o} ref={i === 0 ? refs.need : undefined} checked={need.includes(o)} onChange={(e) => toggleNeed(o, e.target.checked)} />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
              <p className="ferr" hidden={!err.need}>Pick one</p>
            </fieldset>
            <div className="f">
              <label htmlFor="iProj">Tell us about the project <span className="opt">Optional</span></label>
              <Clearable value={f.project} onClear={clear("project")} area label="project">
                <textarea id="iProj" ref={refs.project} name="project" rows={5} placeholder="What are you trying to build, change, or become?"
                  value={f.project} onChange={(e) => set("project")(e.target.value)} />
              </Clearable>
            </div>
            <div className="inq-actions"><button className="btn" type="submit" onClick={(e) => e.currentTarget.classList.add("is-sent")}>Submit</button></div>
          </form>

          <div className="done" id="inqDone" hidden={!sent}>
            <h2>Almost there.</h2>
            <p>Your email app opened with your inquiry. Press send to finish.</p>
            <button className="linkbtn" type="button" onClick={copy}>{copyLabel}</button>
            <p className="done-s">
              Nothing opened? <a href={sent?.href || "#"}>Open it again</a> or write to <a data-email href={"mailto:" + site.email}>{site.email}</a>.
            </p>
            <button type="button" className="linkbtn" onClick={() => { setSent(null); toTop(); }}>Edit inquiry</button>
          </div>
        </div>
      </section>
    </div>
  );
}
