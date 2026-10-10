"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { IconContact, IconHome, IconStory, IconWork, Mark } from "./icons";

/** Which page the URL is. Drives the active tab and the page-specific behaviour. */
function viewOf(path: string) {
  const p = path.replace(/\/+$/, "") || "/";
  return {
    isHome: p === "/",
    isWork: p === "/work",
    isProj: /^\/work\/[^/]+$/.test(p),
    isStory: p === "/story",
    isContact: p === "/contact",
    isSvc: /^\/services\/[^/]+$/.test(p),
  };
}

/** Links from the earlier single-page version (#/work, #/service/x, ...) still work. */
function legacyHashTarget(hash: string): string | null {
  let m: RegExpMatchArray | null;
  if (hash === "#/work") return "/work";
  if ((m = hash.match(/^#\/work\/([\w-]+)$/))) return "/work/" + m[1];
  if ((m = hash.match(/^#\/service\/([\w-]+)$/))) return "/services/" + m[1];
  if (/^#\/(story|profile|about)$/.test(hash)) return "/story";
  if ((m = hash.match(/^#\/inquire(?:\?need=([^&]+))?$/))) return "/contact" + (m[1] ? "?need=" + m[1] : "");
  return null;
}

const NAV = [
  { href: "/", label: "Home", icon: <IconHome /> },
  { href: "/work", label: "Work", icon: <IconWork /> },
  { href: "/story", label: "Story", icon: <IconStory /> },
  { href: "/contact", label: "Contact", icon: <IconContact /> },
] as const;

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const v = viewOf(pathname);
  const mainRef = useRef<HTMLElement>(null);
  const prevPath = useRef<string>("");
  const workScroll = useRef(0);

  // The current page's tab. Service pages belong to Home ("What we do").
  const active = v.isWork || v.isProj ? "/work" : v.isStory ? "/story" : v.isContact ? "/contact" : "/";

  // First load: forward old hash links.
  useEffect(() => {
    const target = legacyHashTarget(location.hash);
    if (target) router.replace(target);
  }, [router]);

  // Every page change starts at the top (or at the #anchor). Coming back from a project returns to where the grid was.
  useEffect(() => {
    const main = mainRef.current;
    const hash = location.hash.slice(1);
    const anchor = hash && !hash.startsWith("/") ? document.getElementById(hash) : null;
    const from = prevPath.current;
    if (anchor) requestAnimationFrame(() => anchor.scrollIntoView());
    else if (pathname.replace(/\/+$/, "") === "/work" && from.startsWith("/work/") && workScroll.current) {
      const y = workScroll.current;
      requestAnimationFrame(() => { main?.scrollTo(0, y); window.scrollTo(0, y); });
    } else { main?.scrollTo(0, 0); window.scrollTo(0, 0); }
    prevPath.current = pathname;
    return () => { if (pathname.replace(/\/+$/, "") === "/work") workScroll.current = Math.max(main?.scrollTop || 0, window.scrollY); };
  }, [pathname]);

  // Service and Contact pages are long and focused: the navbar slides away while reading down and returns on scroll up.
  const autoHide = v.isSvc || v.isContact;
  useEffect(() => {
    const app = document.querySelector(".app");
    if (!app || !autoHide) return;
    const pos = (t: EventTarget | null) =>
      t instanceof Element && t !== document.documentElement && t !== document.body ? t.scrollTop : window.scrollY;
    let last = pos(mainRef.current), hidden = false;
    const set = (h: boolean) => { if (h !== hidden) { hidden = h; app.classList.toggle("nav-hidden", h); } };
    const onScroll = (e: Event) => {
      const t = e.target;
      if (t instanceof Element && t !== mainRef.current) return; // ignore inner scrollers (carousels, chip rows)
      const y = pos(t), d = y - last;
      if (y < 24) set(false);
      else if (d > 6) set(true);
      else if (d < -6) set(false);
      if (Math.abs(d) > 6 || y < 24) last = y;
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => { document.removeEventListener("scroll", onScroll, true); app.classList.remove("nav-hidden"); };
  }, [autoHide, pathname]);

  // Escape closes a project, service or contact page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (v.isProj) router.push("/work");
      else if (v.isSvc || v.isContact) router.push("/");
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [v.isProj, v.isSvc, v.isContact, router]);

  // Tapping the tab you are already on scrolls back to the top.
  const onNav = (href: string) => () => {
    if (href === active && href === pathname) {
      mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="app">
        <aside className="side">
          <div className="side-top">
            <Link className="logo" href="/" aria-label="TWIN home">
              <Mark /><span className="lb">TWIN</span>
            </Link>
            <nav className="menu" aria-label="Main">
              {NAV.map((n) => (
                <Link key={n.href} className="item" href={n.href} aria-current={active === n.href ? "page" : undefined} onClick={onNav(n.href)}>
                  {n.icon}<span className="lb">{n.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className={"main" + (v.isContact ? " is-contact" : "")} id="main" tabIndex={-1} ref={mainRef}>
          <div className="m-top">
            <Link href="/" aria-label="TWIN home"><Mark />TWIN</Link>
          </div>
          {children}
        </main>
      </div>
    </>
  );
}
