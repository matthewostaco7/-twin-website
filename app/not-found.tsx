import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div id="view-404">
      <section className="center-page">
        <p className="nf-code">404</p>
        <h1>Twin, this page<br />isn&rsquo;t here.</h1>
        <p className="hero-sub">The link may be old or mistyped. Try one of these.</p>
        <div className="hero-cta">
          <Link className="btn" href="/">Back to home</Link>
          <Link className="btn btn-2" href="/#services">Our services</Link>
          <Link className="btn btn-2" href="/contact">Contact</Link>
        </div>
      </section>
    </div>
  );
}
