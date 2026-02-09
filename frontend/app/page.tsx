import { MultiAssetSummary } from '@/components/MultiAssetSummary';
import { Metadata } from 'next';
import { getSignalData } from '@/lib/signal';
import { getMultilingualMetadata } from '@/data/seo';
import { DICTIONARY } from '@/data/dictionary';
import { Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const lang = 'EN';
  const initialData = await getSignalData();
  const d = DICTIONARY.EN;

  // Default fallback
  let title = d.subpages.about.title || "Global Macro Signal";
  let desc = d.subpages.about.subtitle || "Institutional Market Intelligence";

  if (initialData) {
    const score = initialData.gms_score;
    const dateObj = new Date(initialData.last_updated);
    const dateStr = dateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric', timeZone: 'UTC' });

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

    title = `${d.titles.gms_score} ${score}: ${momentum} | ${d.titles.insights} ${dateStr}`;
    desc = `${d.titles.gms_score}: ${score} (${momentum}). ${d.methodology.desc} ${dateStr}. Insight: ${initialData.analysis?.title || 'Market Outlook'}`;
  }

  // Pass '/' as path to execute special root logic in seo.ts
  const metadata = getMultilingualMetadata('/', lang, title, desc);
  return metadata;
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
      <Suspense fallback={<div className="min-h-screen"></div>}>
        <MultiAssetSummary initialData={initialData} lang="EN" />
      </Suspense>
    </>
  );
}
