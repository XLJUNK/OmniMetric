import { MultiAssetSummary } from '@/components/MultiAssetSummary';
import { Metadata } from 'next';
import { getSignalData } from '@/lib/signal';
import { getMultilingualMetadata } from '@/data/seo';
import { DICTIONARY, LangType } from '@/data/dictionary';


export function generateStaticParams() {
    return ['jp', 'cn', 'es', 'hi', 'id', 'ar', 'de', 'fr'].map(l => ({ lang: l }));
}



type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const initialData = await getSignalData();

    const normalizedLang = lang.toUpperCase() as LangType;
    const d = DICTIONARY[normalizedLang] || DICTIONARY.EN;

    // Default fallback
    let title = d.subpages.about.title || "Global Macro Signal";
    let desc = d.subpages.about.subtitle || "Institutional Market Intelligence";

    if (initialData) {
        const score = initialData.gms_score;
        // Format Date: "Jan 23"
        const dateObj = new Date(initialData.last_updated);
        const dateStr = dateObj.toLocaleDateString(normalizedLang === 'JP' ? "ja-JP" : "en-US", { month: 'short', day: 'numeric', timeZone: 'Asia/Tokyo' });

        // Calculate Momentum (Simple derivative of backend logic)
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

    const metadata = getMultilingualMetadata('/', normalizedLang, title, desc);
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

import { Suspense } from 'react';
// ...
export default async function Home({ params }: Props) {
    const { lang } = await params;
    const initialData = await getSignalData();
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Suspense fallback={<div className="min-h-screen"></div>}>
                <MultiAssetSummary initialData={initialData} lang={normalizedLang} />

            </Suspense>
        </>
    );
}
