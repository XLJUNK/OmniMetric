import { MultiAssetSummary } from '@/components/MultiAssetSummary';
import { Metadata } from 'next';
import { getSignalData } from '@/lib/signal';
import { getMultilingualMetadata } from '@/data/seo';
import { DICTIONARY } from '@/data/dictionary';
import { Suspense } from 'react';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const lang = 'EN';
  const initialData = await getSignalData();
  const d = DICTIONARY.EN;

  // Global-First metadata density
  let title = "Global Macro Signal (OmniMetric Terminal) | Institutional Market Intelligence";
  let desc = "Professional AI-driven macro terminal democratizing institutional-grade risk analysis. Real-time GMS Score visibility for global macro regimes.";

  if (initialData) {
    const score = initialData.gms_score;
    const dateObj = new Date(initialData.last_updated);
    const dateStr = dateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

    // Calculate Momentum
    let momentum = d.momentum.stable;
    if (initialData.history_chart && initialData.history_chart.length >= 5) {
      const recent = initialData.history_chart.slice(0, 5);
      const latest = recent[0].score;
      const old = recent[recent.length - 1].score;
      const diff = latest - old;

      if (latest < 40 && diff > 0) momentum = d.momentum.bottoming;
      else if (latest > 60 && diff < 0) momentum = d.momentum.peaking;
      else if (diff > 2) momentum = d.momentum.rising;
      else if (diff < -2) momentum = d.momentum.falling;
      else momentum = d.momentum.stable;
    }

    title = `OmniMetric Terminal: GMS Score ${score} (${momentum}) | Financial Insight ${dateStr}`;
    desc = `Terminal Status: ${score} - ${momentum}. ${d.methodology.desc} Last Updated: ${dateStr}. Global Macro Signal provides institutional-grade volatility and liquidity risk assessments. AI Insight: ${initialData.analysis?.title || 'Stable Market Outlook'}.`;
  }

  // Pass '/' as path to execute special root logic in seo.ts
  const metadata = getMultilingualMetadata('/', lang, title, desc);
  return metadata;
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "OmniMetric Terminal",
  "url": "https://www.omnimetric.net",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.omnimetric.net/?q={search_term_string}",
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
      {/* Global JSON-LD Injection via Server Component */}
      <DynamicStructuredData data={initialData} />

      <Suspense fallback={<div className="min-h-screen"></div>}>
        <MultiAssetSummary initialData={initialData} lang="EN" />
      </Suspense>
    </>
  );
}
