import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://omnimetric.ai'), // Placeholder for production URL
  title: "Global Macro Signal | Institutional Analytics",
  description: "AI駆動型金融・経済分析プラットフォーム",
  alternates: {
    canonical: '/',
    languages: {
      'x-default': '/',
      'en': '/?lang=EN',
      'ja': '/?lang=JP',
      'zh': '/?lang=CN',
      'es': '/?lang=ES',
    },
  },
  openGraph: {
    images: ['/api/og'],
  },
};

import { LegalFooter } from "@/components/LegalFooter";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAdSense } from "@/components/GoogleAdSense";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
        "name": "OmniMetric",
        "url": "https://omnimetric.ai",
        "logo": {
          "@type": "ImageObject",
          "url": "https://omnimetric.ai/icon.png"
        },
        "sameAs": [
          "https://twitter.com/omnimetric",
          "https://github.com/omnimetric"
        ]
      },
      {
        "@type": "FinancialProduct",
        "name": "Global Macro Signal GMS",
        "description": "Proprietary algorithmic market risk analysis and institutional data grid.",
        "brand": {
          "@type": "Brand",
          "name": "OmniMetric"
        },
        "manufacturer": {
          "@type": "Organization",
          "name": "OmniMetric"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ overflowX: 'hidden' }}
      >
        <GoogleAdSense pId="0000000000000000" />
        <div className="omni-terminal-root relative min-h-screen flex flex-col">
          <style dangerouslySetInnerHTML={{
            __html: `
            .nextjs-static-indicator, 
            [data-nextjs-toast], 
            #nextjs-dev-indicator,
            [data-nextjs-static-indicator],
            #__next-prerender-indicator,
            .next-route-announcer,
            [data-nextjs-portal] { 
              display: none !important; 
              opacity: 0 !important; 
              visibility: hidden !important; 
              pointer-events: none !important;
            }
          ` }} />
          <main className="flex-grow">
            {children}
          </main>
          <LegalFooter />
        </div>
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  );
}
