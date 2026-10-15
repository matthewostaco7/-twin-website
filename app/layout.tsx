import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SiteShell from "@/components/SiteShell";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | TWIN" },
  description: site.description,
  alternates: { canonical: "./" },
  openGraph: { title: site.title, description: site.ogDescription, type: "website", siteName: "TWIN", locale: "en_PH", url: "./" },
  twitter: { card: "summary_large_image", title: site.title, description: site.ogDescription },
};

/** Tells Google who and where TWIN is, so the name, logo and location can show in results. */
const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "TWIN",
  description: site.description,
  url: site.url,
  logo: `${site.url}/icon-512.png`,
  image: `${site.url}/opengraph-image.png`,
  email: site.email,
  areaServed: { "@type": "Country", name: "Philippines" },
  serviceType: ["Branding", "Rebranding", "Debranding", "Logo design"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* HTTPS only: send plain-http visitors to https (local development is left alone). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(location.protocol==='http:'&&!/^(localhost|\\[::1\\]|[^.]+\\.local|\\d+\\.\\d+\\.\\d+\\.\\d+)$/.test(location.hostname))location.replace('https:'+location.href.substring(5))",
          }}
        />
        <link rel="preload" href="/fonts/NeueMontreal-Regular.otf" as="font" type="font/otf" crossOrigin="" />
        <link rel="preload" href="/fonts/NeueMontreal-Medium.otf" as="font" type="font/otf" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
