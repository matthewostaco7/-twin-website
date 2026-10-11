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
        <div className="hero-bg" aria-hidden="true">
          <svg className="hb hb-clock" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" /><path d="M60 30v32l22 12" /></svg>
          <svg className="hb hb-cal" viewBox="0 0 120 120"><rect x="12" y="20" width="96" height="86" rx="14" /><path d="M12 46h96M38 10v18M82 10v18" /><circle cx="38" cy="68" r="5" /><circle cx="60" cy="68" r="5" /><circle cx="82" cy="68" r="5" /><circle cx="38" cy="88" r="5" /><circle cx="60" cy="88" r="5" /></svg>
          <svg className="hb hb-laptop" viewBox="0 0 160 110"><rect x="26" y="12" width="108" height="70" rx="9" /><path d="M8 94h144l-10 8H18z" /></svg>
          <svg className="hb hb-mood" viewBox="0 0 120 120"><rect x="10" y="10" width="62" height="48" rx="8" /><rect x="80" y="10" width="30" height="30" rx="8" /><circle cx="95" cy="64" r="15" /><rect x="10" y="66" width="30" height="44" rx="8" /><rect x="48" y="66" width="34" height="44" rx="8" /></svg>
        </div>
        <h1 className="hero-big">
          Start to look like yourself.
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
            We&rsquo;re <span className="cr cr-hl">Twin</span>, an{" "}
            <span className="cr cr-ul">independent branding studio</span>. We build brand identities for{" "}
            <span className="nw"><span className="cr cr-hl2"><IconFounder />founders</span></span> who don&rsquo;t want to look like{" "}
            everyone{" "}
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
