import Link from "next/link";
import ServicesGrid from "@/components/ServicesGrid";
import { SERVICES, SERVICE_SLUGS } from "@/lib/services";
import { IconFingerprint, IconFounder } from "@/components/icons";

const FAQS = [
  {
    q: "Which service do I need?",
    a: "Branding builds a new identity from scratch, rebranding updates an existing one, debranding strips one back to what matters, and logo is a single mark. Not sure? Choose \u201CNot sure\u201D on the contact form and we will point you to one.",
  },
  {
    q: "How long does a project take?",
    a: SERVICE_SLUGS.map((slug) => SERVICES[slug].name + ": " + SERVICES[slug].timeline.toLowerCase()).join(". ") + ".",
  },
  {
    q: "How many revisions do I get?",
    a: "Every service includes 2 rounds of revisions.",
  },
  {
    q: "How do I start?",
    a: "Send a short brief on the contact page. Tell us what you need and we reply with a plan.",
  },
];

export default function HomePage() {
  return (
    <div id="view-home">
      <header className="hero" id="top">
        <h1 className="hero-big">
          Look like yourself.
        </h1>
        <p className="hero-sub">Brands built in weeks, not months.</p>
        <div className="hero-cta">
          <Link className="btn" href="/work">View our works</Link>
          <a className="btn btn-2" href="#services">Our services</a>
        </div>
      </header>

      <section className="sec intro-sec" aria-label="About Twin">
        <div className="wrap">
          <p className="intro">
            We&rsquo;re Twin, an independent branding studio. We build brand identities for{" "}
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

      <section className="sec faq" id="faq" aria-labelledby="faq-title">
        <div className="wrap">
          <h2 className="sec-title" id="faq-title">FAQs</h2>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
