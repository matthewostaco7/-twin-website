import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SiteShell from "@/components/SiteShell";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: site.title, template: "%s | TWIN" },
  description: site.description,
  openGraph: { title: site.title, description: site.ogDescription, type: "website", siteName: "TWIN" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

// Runs before paint: applies the saved dark mode on the pages that have it (Work, projects, Story), so there is no flash.
const preload = `try{if(/^\\/(work|story)(\\/|$)/.test(location.pathname)&&localStorage.getItem("twin-theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preload }} />
        <link rel="preload" href="/fonts/NeueMontreal-Regular.otf" as="font" type="font/otf" crossOrigin="" />
        <link rel="preload" href="/fonts/NeueMontreal-Medium.otf" as="font" type="font/otf" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
