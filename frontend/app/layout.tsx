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
  metadataBase: new URL('https://omnimetric.net'),
  title: "Global Macro Signal (OmniMetric Terminal) | AI-Driven Financial Insight",
  description: "機関投資家品質の市場リスク分析を提供するAI駆動型金融・経済分析プラットフォーム。GMSスコアによりグローバルマクロのリスク許容度をリアルタイムで可視化します。",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  alternates: {
    canonical: 'https://omnimetric.net',
    languages: {
      'x-default': 'https://omnimetric.net',
      'en': 'https://omnimetric.net/?lang=EN',
      'ja': 'https://omnimetric.net/?lang=JP',
      'zh': 'https://omnimetric.net/?lang=CN',
      'es': 'https://omnimetric.net/?lang=ES',
    },
  },
  openGraph: {
    images: ['/api/og'],
  },
};

import { LegalFooter } from "@/components/LegalFooter";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAdSense } from "@/components/GoogleAdSense";
import { GoogleAnalytics } from '@next/third-parties/google';

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
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ''} />
        <CookieBanner />
      </body>
    </html>
  );
}
