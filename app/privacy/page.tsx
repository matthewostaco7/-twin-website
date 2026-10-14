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

        <h2>Your rights</h2>
        <p>
          We serve clients in the Philippines and handle personal information in line with the Data Privacy Act of 2012 (Republic Act No.
          10173). Under that law you have the right to:
        </p>
        <ul>
          <li>be informed about how your information is used;</li>
          <li>access the information we hold about you;</li>
          <li>object to its use, or withdraw your consent;</li>
          <li>correct it if it is wrong;</li>
          <li>ask us to erase or block it, where the law allows;</li>
          <li>get a copy in a common format (data portability);</li>
          <li>claim compensation if you were harmed by unlawful use of your information.</li>
        </ul>
        <p>
          To use any of these rights, email <a href={`mailto:${site.email}`}>{site.email}</a>. We will reply within a reasonable time. If
          you are not satisfied, you may file a complaint with the National Privacy Commission at{" "}
          <a href="https://privacy.gov.ph" rel="noopener noreferrer">privacy.gov.ph</a>.
        </p>

        <h2>Consent</h2>
        <p>
          When you send us an enquiry, you agree that we may use the details you give us to reply and to discuss your project. You can
          withdraw this at any time by writing to us.
        </p>

        <h2>Keeping it safe</h2>
        <p>
          This site runs over HTTPS and holds no database of visitors. Enquiries live in our email inbox, which we protect with reasonable
          security measures. If a breach ever puts your information at risk, we will tell you and the National Privacy Commission as the law
          requires.
        </p>

        <h2>Changes</h2>
        <p>If this policy changes, we will update the date at the top of this page.</p>

        <h2>Privacy contact</h2>
        <p>
          Questions about this policy, or for our person in charge of privacy, write to <a href={`mailto:${site.email}`}>{site.email}</a> or use the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </article>
    </div>
  );
}
