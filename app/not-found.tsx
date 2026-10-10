import Link from "next/link";

export default function NotFound() {
  return (
    <div id="view-about">
      <section className="soon">
        <div>
          <h1>Page not found.</h1>
          <p style={{ marginTop: 24 }}><Link className="btn" href="/">Back to home</Link></p>
        </div>
      </section>
    </div>
  );
}
