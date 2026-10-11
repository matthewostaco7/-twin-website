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
        <h1 className="hero-big">
          Look like yourself.
        </h1>
        <p className="hero-sub">
          We&rsquo;re Twin, a visual branding studio. We build brand identities for{" "}
          <span className="nw"><IconFounder />founders</span> who don&rsquo;t want to look like everyone{" "}
          <span className="nw">else.<IconFingerprint /></span>
        </p>
        <div className="hero-cta">
          <Link className="btn" href="/work">See our work</Link>
          <a className="btn btn-2" href="#services">Our services</a>
        </div>
      </header>

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
