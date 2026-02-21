import type { Metadata, Viewport } from "next";
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
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.omnimetric.net'),
  title: "Global Macro Signal (OmniMetric Terminal) | AI-Driven Financial Insight",
  description: "AI-driven macro terminal providing institutional-grade global risk analysis. Real-time GMS Score, multi-asset signals, and AI insights for global macro investors.",
  /* icons: handled by app/icon.png */
  appleWebApp: {
    capable: true,
    title: 'Global Macro Signal',
    statusBarStyle: 'black-translucent',
  },

  openGraph: {
    images: [
      {
        url: '/brand-og.png',
        width: 1200,
        height: 630,
        alt: 'Global Macro Signal | Institutional Real-Time Analysis',
      }
    ],
  },
};

import { LegalFooter } from "@/components/LegalFooter";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAnalytics } from '@next/third-parties/google';
// MobileMenu removed as per user request (Sidebar is now responsive)
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { AdComponent } from "@/components/AdComponent";
import { DynamicStructuredData } from "@/components/DynamicStructuredData";
import { ClientDirectionProvider } from "@/components/ClientDirectionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

import { ThemeBackgroundWrapper } from "@/components/ThemeBackgroundWrapper";

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
        "url": "https://www.omnimetric.net",
        "logo": "https://www.omnimetric.net/icon.png",
        "sameAs": [
          "https://x.com/OmniMetric_GMS",
          "https://github.com/XLJUNK"
        ]
      }
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        {/* @ts-expect-error: Impact.com requires non-standard 'value' attribute */}
        <meta name="impact-site-verification" value="077c2f6e-dfc6-4a7e-a10e-65c42ed1337e" />
        <link rel="alternate" href="https://www.omnimetric.net/" hrefLang="x-default" />
        <link rel="alternate" href="https://www.omnimetric.net/" hrefLang="en" />
        <link rel="alternate" href="https://www.omnimetric.net/" hrefLang="en-US" />
        <link rel="alternate" href="https://www.omnimetric.net/" hrefLang="en-GB" />
        <link rel="alternate" href="https://www.omnimetric.net/jp" hrefLang="ja-JP" />
        <link rel="alternate" href="https://www.omnimetric.net/cn" hrefLang="zh-CN" />
        <link rel="alternate" href="https://www.omnimetric.net/es" hrefLang="es" />
        <link rel="alternate" href="https://www.omnimetric.net/hi" hrefLang="hi" />
        <link rel="alternate" href="https://www.omnimetric.net/id" hrefLang="id" />
        <link rel="alternate" href="https://www.omnimetric.net/ar" hrefLang="ar" />
        <link rel="alternate" href="https://www.omnimetric.net/fr" hrefLang="fr" />
        <link rel="alternate" href="https://www.omnimetric.net/de" hrefLang="de" />
      </head>
      <body
        className={`${inter.variable} ${notoJP.variable} ${notoAR.variable} ${notoHI.variable} antialiased selection:bg-cyan-500/30 overflow-x-hidden`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <Suspense fallback={null}>
            <ClientDirectionProvider />
          </Suspense>
          {/* DynamicStructuredData moved to individual pages for Server-Side context injection */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1230621442620902"
            crossOrigin="anonymous"
          />

          {/* APP ROOT CONTAINER: Wrapped in Client Component for Inline Theme Styles */}
          <ThemeBackgroundWrapper>

            {/* DESKTOP SIDEBAR */}
            <Suspense fallback={null}>
              <Sidebar />
            </Suspense>

            {/* MAIN CONTENT AREA with Offset for Fixed Sidebar (Hidden on Mobile) */}
            <div className="flex-1 flex flex-col relative min-w-0 md:ms-[60px] transition-all duration-300 pt-[54px] md:pt-0 pb-0 overflow-hidden">

              <style dangerouslySetInnerHTML={{
                __html: `
              .nextjs-static-indicator, 
              [data-nextjs-toast], 
              #nextjs-dev-indicator,
              [data-nextjs-static-indicator],
              #__next-prerender-indicator,
              .next-route-announcer { 
                display: none !important; 
                opacity: 0 !important; 
                visibility: hidden !important; 
                pointer-events: none !important;
              }
            ` }} />

              <main className="flex-grow flex flex-col w-full max-w-[1600px] mx-auto px-4 md:px-6">
                {children}
              </main>

              {/* Footer (Bottom Ad Removed) */}
              <div className="mt-8">
                <Suspense fallback={null}>
                  <LegalFooter />
                </Suspense>
              </div>
            </div>

            {/* MOBILE NAVIGATION BAR (Fixed Viewport) */}
            <Suspense fallback={null}>
              <MobileNav />
            </Suspense>

          </ThemeBackgroundWrapper>

          <Analytics />
          <SpeedInsights />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ''} />
          <Suspense fallback={null}>
            <CookieBanner />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
