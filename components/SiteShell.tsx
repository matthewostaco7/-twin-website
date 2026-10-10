"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/lib/site";
import {
  IconChevronLeft, IconContact, IconFacebook, IconHome, IconInstagram, IconMail, IconMoon, IconPin,
  IconStory, IconSun, IconWork, IconX, Mark,
} from "./icons";

type Spy = "top" | "work" | "about" | "start" | "services";
type Theme = "light" | "dark";

/** Which view the current URL is, so the original CSS (.main.is-work etc.) keeps working. */
function viewOf(path: string) {
  const p = path.replace(/\/+$/, "") || "/";
  return {
    isHome: p === "/",
    isWork: p === "/work",
    isProj: /^\/work\/[^/]+$/.test(p),
    isAbout: p === "/story",
    isInq: p === "/contact",
    isSvc: /^\/services\/[^/]+$/.test(p),
  };
}

/** Old single-page links (#/work, #/service/x, ...) keep working. */
function legacyHashTarget(hash: string): string | null {
  let m: RegExpMatchArray | null;
  if (hash === "#/work") return "/work";
  if ((m = hash.match(/^#\/work\/([\w-]+)$/))) return "/work/" + m[1];
  if ((m = hash.match(/^#\/service\/([\w-]+)$/))) return "/services/" + m[1];
  if (/^#\/(story|profile|about)$/.test(hash)) return "/story";
  if ((m = hash.match(/^#\/inquire(?:\?need=([^&]+))?$/))) return "/contact" + (m[1] ? "?need=" + m[1] : "");
  return null;
}

function ThemeSeg({ theme, setTheme, mobile }: { theme: Theme; setTheme: (t: Theme) => void; mobile?: boolean }) {
  return (
    <div className={"theme-seg" + (mobile ? " m" : "")} role="group" aria-label="Colour mode">
      <button type="button" aria-pressed={theme === "light"} title="Light" onClick={() => setTheme("light")}>
        <IconSun /><span className="sr-only">Light</span>
      </button>
      <button type="button" aria-pressed={theme === "dark"} title="Dark" onClick={() => setTheme("dark")}>
        <IconMoon /><span className="sr-only">Dark</span>
      </button>
    </div>
  );
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const v = viewOf(pathname);
  const mainRef = useRef<HTMLElement>(null);
  const [theme, setThemeState] = useState<Theme>("light");
  const [rail, setRail] = useState(false);
  const [homeSpy, setHomeSpy] = useState<Spy>("top");

  const active: Spy = v.isHome ? homeSpy : v.isWork || v.isProj ? "work" : v.isAbout ? "about" : v.isInq ? "start" : "services";
  const darkable = v.isWork || v.isProj || v.isAbout;

  // first load: redirect old hash links, read saved preferences
  useEffect(() => {
    const target = legacyHashTarget(location.hash);
    if (target) router.replace(target);
    try {
      setThemeState(localStorage.getItem("twin-theme") === "dark" ? "dark" : "light");
      const saved = localStorage.getItem("twinRail");
      setRail(saved === null ? innerWidth > 900 : saved === "1");
    } catch {
      setRail(innerWidth > 900);
    }
  }, [router]);

  // dark mode lives on the Work gallery, project pages and Story only
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-darkable", darkable);
    if (darkable && theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
  }, [darkable, theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem("twin-theme", t); } catch {}
  };
  const toggleRail = () => {
    setRail((on) => {
      try { localStorage.setItem("twinRail", on ? "0" : "1"); } catch {}
      return !on;
    });
  };

  // on every page change: start at the top (or at the #anchor), reveal-on-scroll, nav height
  useEffect(() => {
    const w = window as unknown as { __twinNav?: number };
    w.__twinNav = (w.__twinNav || 0) + 1; // >1 means the visitor navigated inside the site
    const main = mainRef.current;
    const hash = location.hash.slice(1);
    const el = hash && !hash.startsWith("/") ? document.getElementById(hash) : null;
    if (el) requestAnimationFrame(() => el.scrollIntoView());
    else { main?.scrollTo(0, 0); window.scrollTo(0, 0); }

    const els = document.querySelectorAll(".rv:not(.in)");
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io?.unobserve(e.target); } }),
        { threshold: 0.1 },
      );
      els.forEach((x) => io!.observe(x));
    } else els.forEach((x) => x.classList.add("in"));

    const navh = () => {
      const s = document.querySelector(".side");
      if (s && innerWidth <= 900) {
        const h = s.getBoundingClientRect().height;
        if (h) document.documentElement.style.setProperty("--navh", Math.round(h) + "px");
      }
    };
    navh();
    const t = setTimeout(navh, 200);
    addEventListener("resize", navh);
    return () => { io?.disconnect(); clearTimeout(t); removeEventListener("resize", navh); };
  }, [pathname]);

  // home: sidebar highlights the section in view
  useEffect(() => {
    if (!v.isHome || !("IntersectionObserver" in window)) return;
    setHomeSpy("top");
    const map: Record<string, Spy> = { top: "top", services: "services", teaser: "work" };
    const spy = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setHomeSpy(map[e.target.id]); }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    Object.keys(map).forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
    return () => spy.disconnect();
  }, [v.isHome]);

  // home (desktop): wheel / arrow keys snap between the hero and the services
  useEffect(() => {
    const m = mainRef.current;
    if (!m || !v.isHome) return;
    let lock = false;
    const go = (top: number) => { lock = true; m.scrollTo({ top, behavior: "smooth" }); setTimeout(() => { lock = false; }, 800); };
    const svcY = () => {
      const sv = document.getElementById("services");
      return sv ? Math.max(0, sv.offsetTop - m.offsetTop) : 0;
    };
    const onWheel = (e: WheelEvent) => {
      if (innerWidth <= 900 || Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      if (lock) return;
      go(e.deltaY > 0 ? svcY() : 0);
    };
    const onKey = (e: KeyboardEvent) => {
      if (innerWidth <= 900) return;
      const t = e.target as HTMLElement | null;
      if (t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(svcY()); }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(0); }
    };
    m.addEventListener("wheel", onWheel, { passive: false });
    addEventListener("keydown", onKey);
    return () => { m.removeEventListener("wheel", onWheel); removeEventListener("keydown", onKey); };
  }, [v.isHome]);

  // On service and contact pages the navbar slides away when scrolling down and returns on scroll up.
  // Listens (capture) to whichever element scrolls, so it works however the page is laid out.
  const autoHide = v.isSvc || v.isInq;
  useEffect(() => {
    const app = document.querySelector(".app");
    if (!app || !autoHide) return;
    const pos = (t: EventTarget | null) => {
      const el = t instanceof Element ? t : document.scrollingElement;
      return el === document.documentElement || el === document.body || t === document ? window.scrollY : (el as Element).scrollTop;
    };
    let last = 0, hidden = false;
    const set = (h: boolean) => { if (h !== hidden) { hidden = h; app.classList.toggle("nav-hidden", h); } };
    const onScroll = (e: Event) => {
      const t = e.target as Element | Document;
      // ignore inner scrollers (carousels, the contents list)
      if (t instanceof Element && t !== mainRef.current) return;
      const y = pos(t), d = y - last;
      if (y < 24) set(false);
      else if (d > 6) set(true);
      else if (d < -6) set(false);
      if (Math.abs(d) > 6 || y < 24) last = y;
    };
    last = pos(mainRef.current);
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => { document.removeEventListener("scroll", onScroll, true); app.classList.remove("nav-hidden"); };
  }, [autoHide, pathname]);

  // Escape closes the current page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (v.isProj) router.push("/work");
      else if (v.isSvc) router.push("/#services");
      else if (v.isInq) router.push("/");
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [v.isProj, v.isSvc, v.isInq, router]);

  // buttons flash when clicked
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const b = (e.target as Element | null)?.closest?.(".btn");
      if (!b) return;
      b.classList.add("clicked");
      setTimeout(() => b.classList.remove("clicked"), 900);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // tapping the tab you're already on jumps back to the top
  const navClick = (href: string) => () => {
    if (href === pathname) { mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const nav: { href: string; label: string; spy: Spy; icon: ReactNode }[] = [
    { href: "/", label: "Home", spy: "top", icon: <IconHome /> },
    { href: "/work", label: "Work", spy: "work", icon: <IconWork /> },
    { href: "/story", label: "Story", spy: "about", icon: <IconStory /> },
    { href: "/contact", label: "Contact", spy: "start", icon: <IconContact /> },
  ];

  const mainClass = ["main", v.isWork && "is-work", (v.isProj || v.isAbout) && "is-proj", v.isHome && "is-home"].filter(Boolean).join(" ");

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className={"app" + (rail ? " is-rail" : "")}>
        <aside className="side">
          <div className="side-top">
            <Link className="logo" href="/" aria-label="TWIN home">
              <Mark />
              <span className="lb">TWIN</span>
            </Link>
            <nav className="menu" aria-label="Main">
              {nav.map((n) => (
                <Link key={n.href} className="item" title={n.label} href={n.href} aria-current={active === n.spy ? "true" : "false"} onClick={navClick(n.href)}>
                  {n.icon}<span className="lb">{n.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="side-bot">
            <ThemeSeg theme={theme} setTheme={setTheme} />
            <button
              className="side-toggle"
              type="button"
              aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!rail}
              title={rail ? "Expand sidebar" : "Collapse sidebar"}
              onClick={toggleRail}
            >
              <IconChevronLeft />
            </button>
          </div>
        </aside>

        <main className={mainClass} id="main" tabIndex={-1} ref={mainRef}>
          <div className="m-top">
            <Link href="/" aria-label="TWIN home"><Mark />TWIN</Link>
            <ThemeSeg theme={theme} setTheme={setTheme} mobile />
          </div>

          {children}

          <footer className="site-foot">
            <div className="sf-top">
              <div className="sf-brand"><Mark /><div><b>TWIN</b><span>Brand design agency</span></div></div>
              <div className="sf-col">
                <span className="mono t3">Contact</span>
                <span className="loc ct"><IconMail /><a data-email href={"mailto:" + site.email}>{site.email}</a></span>
                <span className="loc"><IconPin />{site.location}</span>
              </div>
              <div className="sf-col">
                <span className="mono t3">Follow</span>
                <div className="soc">
                  <a href={site.social.fb} aria-label="TWIN on Facebook" target="_blank" rel="noopener noreferrer"><IconFacebook /></a>
                  <a href={site.social.ig} aria-label="TWIN on Instagram" target="_blank" rel="noopener noreferrer"><IconInstagram /></a>
                  <a href={site.social.x} aria-label="TWIN on X" target="_blank" rel="noopener noreferrer"><IconX /></a>
                </div>
              </div>
            </div>
            <div className="sf-bot mono t3"><span suppressHydrationWarning>&copy; {new Date().getFullYear()} TWIN</span><span>{site.tagline}</span></div>
          </footer>
        </main>
      </div>
    </>
  );
}
