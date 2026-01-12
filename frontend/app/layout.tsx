import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Noto_Sans_Arabic, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-jp",
  display: "swap",
});

const notoAR = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-ar",
  display: "swap",
});

const notoHI = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-hi",
  weight: ["400", "700"],
  display: "swap",
});

import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://omnimetric.net'),
  title: "Global Macro Signal (OmniMetric Terminal) | AI-Driven Financial Insight",
  description: "機関投資家品質の市場リスク分析を提供するAI駆動型金融・経済分析プラットフォーム。独自スコアによりグローバルマクロのリスク許容度をリアルタイムで可視化します。",
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
      'hi': 'https://omnimetric.net/?lang=HI',
      'id': 'https://omnimetric.net/?lang=ID',
      'ar': 'https://omnimetric.net/?lang=AR',
    },
  },
  openGraph: {
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Global Macro Signal | Institutional Real-Time Analysis',
      }
    ],
  },
  other: {
    // Academic Citation Metatags (for AI citation systems)
    'citation_title': 'OmniMetric Global Macro Signal Index',
    'citation_author': 'OmniMetric Project',
    'citation_publication_date': new Date().toISOString().split('T')[0],
    'citation_journal_title': 'OmniMetric Terminal',
    'citation_online_date': new Date().toISOString().split('T')[0],
    // Dublin Core Metadata
    'DC.title': 'Global Macro Signal - Institutional Risk Index',
    'DC.creator': 'OmniMetric AI',
    'DC.subject': 'Financial Markets, Risk Analysis, Macro Economics',
    'DC.description': 'Real-time algorithmic risk assessment integrating Net Liquidity, Volatility, and Credit Spreads',
    'DC.type': 'Dataset',
    'DC.format': 'application/json',
    'DC.language': 'en',
  },
};

import { LegalFooter } from "@/components/LegalFooter";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAdSense } from "@/components/GoogleAdSense";
import { GoogleAnalytics } from '@next/third-parties/google';
// MobileMenu removed as per user request (Sidebar is now responsive)
import { Sidebar } from "@/components/Sidebar";
import { AdUnit } from "@/components/AdUnit";
import { DynamicStructuredData } from "@/components/DynamicStructuredData";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "OmniMetric",
        "url": "https://omnimetric.ai",
        "logo": "https://omnimetric.ai/icon.png",
        "sameAs": [
          "https://twitter.com/omnimetric",
          "https://github.com/omnimetric"
        ]
      },
      {
        "@type": "Dataset",
        "name": "Global Macro Signal (GMS) Index",
        "description": "Real-time algorithmic risk scoring (0-100) for global financial markets, integrating Net Liquidity, Volatility (VIX/MOVE), and Credit Spreads.",
        "creator": {
          "@type": "Organization",
          "name": "OmniMetric"
        },
        "license": "https://creativecommons.org/licenses/by-nc/4.0/",
        "variableMeasured": [
          "Global Macro Score",
          "US Net Liquidity",
          "Bond Volatility (MOVE)",
          "High Yield Spread"
        ]
      },
      {
        "@type": "FinancialQuote",
        "name": "OmniMetric GMS Score",
        "symbol": "GMS",
        "price": "36",
        "priceCurrency": "USD",
        "marketCapitalization": "Institutional"
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
        <DynamicStructuredData />
      </head>
      <body
        className={`${inter.variable} ${notoJP.variable} ${notoAR.variable} ${notoHI.variable} antialiased`}
        style={{ overflowX: 'hidden' }}
      >
        <GoogleAdSense pId="1230621442620902" />

        {/* APP ROOT CONTAINER: ROW Layout for Sidebar + Content */}
        <div className="omni-terminal-root relative min-h-screen flex bg-[#0a0a0a]">

          {/* DESKTOP SIDEBAR */}
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>

          {/* MAIN CONTENT AREA with Offset for Fixed Sidebar */}
          <div className="flex-1 flex flex-col relative min-w-0 ml-[80px] transition-all duration-300">
            {/* TOP AD BANNER (Desktop Only - Optional) */}
            <div className="hidden md:flex justify-center py-4 bg-[#0a0a0a] border-b border-[#1E293B]">
              <div className="w-[728px] h-[90px] bg-[#111]">
                <AdUnit />
              </div>
            </div>

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

            {/* Footer */}
            <div>
              <Suspense fallback={null}>
                <LegalFooter />
              </Suspense>
            </div>
          </div>
        </div> {/* End of Application Root */}

        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ''} />
        <CookieBanner />
      </body>
    </html>
  );
}
