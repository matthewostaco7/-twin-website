import type { Metadata } from "next";

export const metadata: Metadata = { title: "Story" };

export default function StoryPage() {
  return (
    <div id="view-story">
      <section className="center-page">
        <h1 tabIndex={-1}>Almost ready.<br />See you very soon, Twin</h1>
      </section>
    </div>
  );
}
