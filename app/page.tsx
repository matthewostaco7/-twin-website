import Link from "next/link";
import ServicesGrid from "@/components/ServicesGrid";
import { IconFingerprint, IconFounder } from "@/components/icons";

const STEPS = [
  { title: "See our work", line: "Browse the brands we have built.", href: "/work" },
  { title: "Pick a service", line: "Branding, debranding, rebranding or logo.", href: "/#services" },
  { title: "Tell us what you need", line: "Send a short brief. We reply with a plan.", href: "/contact" },
];

export default function HomePage() {
  return (
    <div id="view-home">
      <header className="hero" id="top">
        <svg className="dd dd-star" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5v38M7.5 14.5l33 19M40.5 14.5l-33 19" /></svg>
        <svg className="dd dd-arrow" viewBox="0 0 96 96" aria-hidden="true"><path d="M8 10C44 4 84 26 72 80M72 80L56 66M72 80L88 68" /></svg>
        <h1 className="hero-big">
          Look like yourself.
        </h1>
        <p className="hero-sub">Brands built in weeks, not months.</p>
        <div className="hero-cta">
          <Link className="btn" href="/work">View our works</Link>
          <a className="btn btn-2" href="#services">Our services</a>
        </div>
      </header>

      <section className="showcase" aria-hidden="true">
        <div className="wrap">
          <div className="sc">
            <span className="sc-aa">Aa</span>
            <span className="sc-pair">
              <span className="sc-tile old"><svg viewBox="0 0 40 40"><rect x="7" y="7" width="26" height="26" rx="3" /></svg></span>
              <svg className="sc-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
              <span className="sc-tile new"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" /></svg></span>
            </span>
            <svg className="sc-tri" viewBox="0 0 100 100"><polygon points="50,8 96,92 4,92" /></svg>
          </div>
        </div>
      </section>

      <section className="sec intro-sec" aria-label="About Twin">
        <div className="wrap">
          <p className="intro">
            We&rsquo;re Twin, a visual branding studio. We build brand identities for{" "}
            <span className="nw"><IconFounder />founders</span> who don&rsquo;t want to look like everyone{" "}
            <span className="nw">else.<IconFingerprint /></span>
          </p>
        </div>
      </section>

      <section className="sec" id="services">
        <div className="wrap">
          <h2 className="sec-title">What we do</h2>
          <ServicesGrid />
        </div>
      </section>

      <section className="sec guide" id="start" aria-labelledby="start-title">
        <div className="wrap">
          <h2 className="sec-title" id="start-title">How to start</h2>
          <ol className="steps">
            {STEPS.map((st, i) => (
              <li key={st.title}>
                <Link className="step" href={st.href}>
                  <span className="mono">0{i + 1}</span>
                  <span className="step-t">{st.title}</span>
                  <span className="step-d">{st.line}</span>
                  <span className="step-go" aria-hidden="true">&rarr;</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
