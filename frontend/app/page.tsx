import { MultiAssetSummary } from '@/components/MultiAssetSummary';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Global Macro Signal (OmniMetric) | Institutional Market Intelligence",
  description: "Real-time global market risk analysis covering Stocks, Crypto, Forex, and Commodities. AI-driven insights for professional investors.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "OmniMetric Terminal",
  "url": "https://omnimetric.net",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://omnimetric.net/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MultiAssetSummary />
    </>
  );
}
