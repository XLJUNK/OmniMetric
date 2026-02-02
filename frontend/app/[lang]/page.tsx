import { MultiAssetSummary } from '@/components/MultiAssetSummary';
import { Metadata } from 'next';
import { getSignalData } from '@/lib/signal';
import { getMultilingualMetadata } from '@/data/seo';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const initialData = await getSignalData();

    // Default fallback
    let title = "Global Macro Signal (OmniMetric) | Institutional Market Intelligence";
    let desc = "Real-time global market risk analysis covering Stocks, Crypto, Forex, and Commodities. AI-driven insights for professional investors.";

    if (initialData) {
        const score = initialData.gms_score;
        // Format Date: "Jan 23"
        const dateObj = new Date(initialData.last_updated);
        const dateStr = dateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric', timeZone: 'Asia/Tokyo' });

        // Calculate Momentum (Simple derivative of backend logic)
        let momentum = "Neutral";
        if (initialData.history_chart && initialData.history_chart.length >= 5) {
            const recent = initialData.history_chart.slice(0, 5);
            const latest = recent[0].score;
            const old = recent[recent.length - 1].score;
            const diff = latest - old;

            if (latest < 40 && diff > 0) momentum = "Bottoming Out";
            else if (latest > 60 && diff < 0) momentum = "Peaking";
            else if (diff > 2) momentum = "Rising";
            else if (diff < -2) momentum = "Falling";
            else momentum = "Stable";
        }

        title = `GMS Score ${score}: ${momentum} | Market Intelligence ${dateStr}`;
        desc = `Latest GMS Score: ${score} (${momentum}). Global market risk analysis updated ${dateStr}. Insight: ${initialData.analysis?.title || 'Market Outlook'}`;
    }

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
            <MultiAssetSummary initialData={initialData} />
        </>
    );
}
