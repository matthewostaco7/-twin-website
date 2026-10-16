import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The simple ground rules for using the TWIN website and working with TWIN.",
};

/** Keep this date current whenever the terms change. */
const UPDATED = "October 16, 2026";

export default function TermsPage() {
  return (
    <div id="view-terms">
      <article className="legal">
        <p className="legal-meta">Last updated {UPDATED}</p>
        <h1 tabIndex={-1}>Terms &amp; Conditions</h1>
        <p className="legal-lead">
          Plain rules for using this website and for working with {site.name}. If a signed proposal or contract says something different
          for your project, that document wins.
        </p>

        <h2>Who we are</h2>
        <p>
          {site.name} is an independent branding studio serving founders and SMEs, including clients in the Philippines. You can reach us at{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2>Using this website</h2>
        <ul>
          <li>The site is for information about our services. Nothing on it is a binding offer until we agree a proposal in writing.</li>
          <li>Please don&rsquo;t misuse the site: no attempts to break, overload or scrape it.</li>
          <li>We try to keep everything accurate and up to date, but we can&rsquo;t promise there are no mistakes or gaps.</li>
          <li>
            Our site design, text, logo and work samples belong to {site.name} or the client who owns them. Please don&rsquo;t copy or reuse them
            without asking first.
          </li>
        </ul>

        <h2>Working with us</h2>
        <p>
          <strong>Proposal first.</strong> Every project starts with a written proposal covering what we will make, the timeline, the fee and
          how many rounds of revisions are included. Work begins once you accept it and any deposit is paid.
        </p>
        <p>
          <strong>What we need from you.</strong> Clear feedback, timely answers, and the materials we ask for. Delays on your side can move
          the delivery dates. You confirm you own, or have permission to use, anything you give us.
        </p>
        <p>
          <strong>Revisions and extra work.</strong> Revisions beyond those in the proposal, or changes to the scope, are quoted separately
          before we start them.
        </p>

        <h2>Payment</h2>
        <p>
          Fees, deposits and due dates are set out in the proposal or invoice. Final files are handed over once the final payment is received.
          Late payments may pause the work.
        </p>

        <h2>Ownership of the work</h2>
        <ul>
          <li>When your invoice is paid in full, you own the final approved brand work we made for you.</li>
          <li>Until then, the work stays with {site.name}.</li>
          <li>Unused drafts and concepts remain ours.</li>
          <li>
            Third-party items, such as licensed fonts, stock images or icons, keep their own licences. We will tell you where you need to buy or
            hold one.
          </li>
          <li>
            Unless you ask us not to in writing, we may show the finished work in our portfolio and on social channels, and describe the project
            in general terms.
          </li>
        </ul>

        <h2>Confidentiality</h2>
        <p>We keep your private business information confidential and use it only to do the work.</p>

        <h2>Cancelling a project</h2>
        <p>
          You can cancel in writing at any time. You pay for the work done up to that point, and any deposit covers that work first. If we
          have to cancel, we will refund payment for work we haven&rsquo;t delivered.
        </p>

        <h2>Results and liability</h2>
        <p>
          We design to a high standard, but we can&rsquo;t guarantee business results such as sales, funding or rankings. We don&rsquo;t
          provide legal advice, including trademark clearance. We recommend checking that a new name or mark is free to use before you
          rely on it. To the extent the law allows, our total liability for any claim is limited to the fees you paid us for the project
          in question.
        </p>

        <h2>Privacy</h2>
        <p>
          How we handle your information is explained in our <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the Republic of the Philippines. We would rather solve any problem by talking first, so
          please contact us before taking any formal step.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms. The date at the top shows the latest version. A project already under way stays on the terms in its
          proposal.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Write to <a href={`mailto:${site.email}`}>{site.email}</a> or use the <Link href="/contact">contact page</Link>.
        </p>
      </article>
    </div>
  );
}
