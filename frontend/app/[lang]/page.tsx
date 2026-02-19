import { MultiAssetSummary } from '@/components/MultiAssetSummary';
import { Metadata } from 'next';
import { getSignalData } from '@/lib/signal';
import { getMultilingualMetadata } from '@/data/seo';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';
import { Suspense } from 'react';


export const dynamicParams = false;

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
        const dateObj = new Date(initialData.last_updated);
        const dateStr = dateObj.toLocaleDateString(normalizedLang === 'JP' ? "ja-JP" : "en-US", { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Tokyo' });

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
        desc = `${d.titles.gms_score}: ${score} (${momentum}). ${d.methodology.desc} ${dateStr}. Insight: ${initialData.analysis?.title || 'Market Outlook'}. GMS Terminal provides institutional-grade risk analysis.`;
    }

    const metadata = getMultilingualMetadata('/', normalizedLang, title, desc);
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
            {/* Global JSON-LD Injection via Server Component */}
            <DynamicStructuredData data={initialData} />

            <Suspense fallback={<div className="min-h-screen"></div>}>
                <MultiAssetSummary initialData={initialData} lang={normalizedLang} />
            </Suspense>
        </>
    );
}
