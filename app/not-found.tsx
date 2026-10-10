import Link from "next/link";

export default function NotFound() {
  return (
    <div id="view-404">
      <section className="center-page">
        <h1>Page not found.</h1>
        <Link className="btn" href="/">Back to home</Link>
      </section>
    </div>
  );
}
