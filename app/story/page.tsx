import type { Metadata } from "next";

export const metadata: Metadata = { title: "Story" };

export default function StoryPage() {
  return (
    <div id="view-about">
      <section className="soon">
        <h1 id="aboutTitle" tabIndex={-1}>Almost ready.<br />See you very soon, Twin</h1>
      </section>
    </div>
  );
}
