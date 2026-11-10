import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import { AttributionCapture } from "@/lib/attribution";
import { configuredSiteUrl } from "@/lib/config";
import { SiteAnalytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { brand, hero } from "@/content/site";
import "./globals.css";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const title = `${brand.name} — ${hero.headline}`;

export const metadata: Metadata = {
  metadataBase: new URL(configuredSiteUrl()),
  title: {
    default: title,
    template: `%s — ${brand.name}`,
  },
  description: hero.subheadline,
  applicationName: brand.name,
  openGraph: {
    title,
    description: hero.subheadline,
    type: "website",
    locale: "en_US",
    siteName: brand.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: hero.subheadline,
  },
};

export const viewport: Viewport = {
  themeColor: "#f3efe8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: brand.name,
  description: hero.subheadline,
  url: configuredSiteUrl(),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-foam"
        >
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <AttributionCapture />
        <SiteAnalytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
