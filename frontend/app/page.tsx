import { MultiAssetSummary } from '@/components/MultiAssetSummary';
import { Metadata } from 'next';
import { getSignalData } from '@/lib/signal';

export const dynamic = 'force-dynamic';

import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
  const s = await searchParams;
  return getMultilingualMetadata('/', s.lang || 'EN',
    "Global Macro Signal (OmniMetric) | Institutional Market Intelligence",
    "Real-time global market risk analysis covering Stocks, Crypto, Forex, and Commodities. AI-driven insights for professional investors."
  );
}

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

export default async function Home() {
  const initialData = await getSignalData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MultiAssetSummary initialData={initialData} />
    </>
  );
}
