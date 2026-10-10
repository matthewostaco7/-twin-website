import Link from "next/link";
import ServicesGrid from "@/components/ServicesGrid";
import { IconFingerprint, IconFounder } from "@/components/icons";
import { REAL_PROJECTS, coverOf, safeSrc } from "@/lib/projects";

function Teaser() {
  // first three real projects; static examples until there are any
  if (REAL_PROJECTS.length) {
    return (
      <div className="work">
        {REAL_PROJECTS.slice(0, 3).map((p) => {
          const c = coverOf(p), src = c ? safeSrc(c.src) : "";
          return (
            <Link key={p.id} className="fc rv in" href={"/work/" + p.id}>
              <div className="viz">{src && <img className="cvr" src={src} alt="" loading="lazy" />}</div>
              <div className="txt"><h3>{p.name}</h3><p>{p.type}</p></div>
            </Link>
          );
        })}
      </div>
    );
  }
  return (
    <div className="work">
      <Link className="fc rv" href="/work">
        <div className="viz" />
        <div className="txt"><h3>Client 01</h3><p>Brand</p></div>
      </Link>
      <Link className="fc rv" href="/work">
        <div className="viz"><div className="col"><div className="aa">Aa</div><div className="dots"><i /><i /><i /></div></div></div>
        <div className="txt"><h3>Client 02</h3><p>Rebrand</p></div>
      </Link>
      <Link className="fc rv" href="/work">
        <div className="viz"><div className="col"><span className="chip dark">Logo</span><div style={{ height: 8 }} /><span className="chip">Type</span><div style={{ height: 8 }} /><span className="chip">Color</span></div></div>
        <div className="txt"><h3>Client 03</h3><p>Debrand</p></div>
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <div id="view-home">
      <header className="hero" id="top">
        <div className="hero-card">
          <div className="hues"><span className="hue a" /><span className="hue b" /><span className="hue c" /><span className="hue d" /></div>
          <div className="hero-group">
            <h1 className="rv">
              We&rsquo;re <mark className="hl">Twin</mark>, a <span className="ul">visual branding</span> studio. We build brand identities for{" "}
              <span className="nw"><IconFounder />founders</span> who don&rsquo;t want to look like everyone{" "}
              <span className="nw">else.<IconFingerprint /></span>
            </h1>
            <div className="hero-cta rv">
              <Link className="btn" href="/work"><span className="t">Work</span></Link>
              <a className="btn btn-2" href="#services"><span className="t">Our Services</span></a>
            </div>
          </div>
        </div>
      </header>

      <section className="sec" id="services">
        <div className="head rv svc-title"><h2>What we do</h2><span className="svc-hint">Tap a service to explore</span></div>
        <ServicesGrid />
      </section>

      <section className="sec" id="teaser">
        <div className="head split rv">
          <span className="mono t3">02 Work</span>
          <Link className="btn sm" href="/work"><span className="t">See our Works</span></Link>
        </div>
        <Teaser />
      </section>
    </div>
  );
}
