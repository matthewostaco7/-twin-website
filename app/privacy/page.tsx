import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TWIN handles the little information this website touches.",
};

/** Keep this date current whenever the policy text changes. */
const UPDATED = "October 14, 2026";

export default function PrivacyPage() {
  return (
    <div id="view-privacy">
      <article className="legal">
        <p className="legal-meta">Last updated {UPDATED}</p>
        <h1 tabIndex={-1}>Privacy Policy</h1>
        <p className="legal-lead">
          We keep this simple. {site.name} collects very little, sells nothing, and only uses what you send us to reply to you.
        </p>

        <h2>What we collect</h2>
        <p>
          <strong>What you send us.</strong> The contact form on this site opens your own email app with your message ready to send. Your
          name, how to reach you, company, the services you need, and your project notes only reach us when you press send in that email.
          This site does not store them.
        </p>
        <p>
          <strong>What happens automatically.</strong> Our hosting provider, Vercel, keeps standard server logs (such as IP address, browser
          type and the pages requested) to deliver the site and keep it secure.
        </p>

        <h2>What we don&rsquo;t do</h2>
        <ul>
          <li>No accounts, and no payments taken on this site.</li>
          <li>No advertising or tracking cookies, and no analytics tools.</li>
          <li>We never sell or rent your information.</li>
        </ul>

        <h2>How we use it</h2>
        <p>
          To reply to your enquiry, discuss a project, and keep a record of that conversation. If we work together, we also keep what is
          needed to deliver and invoice the work.
        </p>

        <h2>Third parties</h2>
        <p>
          The site is hosted on Vercel. Page text is set in IBM Plex Mono, served by Google Fonts, so your browser contacts Google to load
          it. Your email provider handles the messages you send us. Each has its own privacy policy.
        </p>

        <h2>How long we keep it</h2>
        <p>
          Enquiries are kept only as long as needed to reply and for a reasonable period afterwards. Client records are kept as long as the
          work and legal or tax rules require.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask us to show you, correct or delete the information we hold about you at any time. Email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond within a reasonable time.
        </p>

        <h2>Changes</h2>
        <p>If this policy changes, we will update the date at the top of this page.</p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Write to <a href={`mailto:${site.email}`}>{site.email}</a> or use the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </article>
    </div>
  );
}
