import Link from "next/link";
import ServicesGrid from "@/components/ServicesGrid";
import { IconFingerprint, IconFounder } from "@/components/icons";

export default function HomePage() {
  return (
    <div id="view-home">
      <header className="hero" id="top">
        <h1>
          We&rsquo;re <mark className="hl">Twin</mark>, a <span className="ul">visual branding</span> studio. We build brand identities
          for <span className="nw"><IconFounder />founders</span> who don&rsquo;t want to look like everyone{" "}
          <span className="nw">else.<IconFingerprint /></span>
        </h1>
        <div className="hero-cta">
          <Link className="btn" href="/work">Work</Link>
          <a className="btn btn-2" href="#services">Our Services</a>
        </div>
      </header>

      <section className="sec" id="services">
        <div className="wrap">
          <h2 className="sec-title">What we do</h2>
          <ServicesGrid />
        </div>
      </section>
    </div>
  );
}
