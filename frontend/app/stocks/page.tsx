import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
export const dynamic = 'force-dynamic';

import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
    const s = await searchParams;
    return getMultilingualMetadata('/stocks', s.lang || 'EN',
        "Global Stocks Analysis | OmniMetric",
        "Real-time institutional analysis of global equity markets including S&P 500, NASDAQ, and VIX volatility index."
    );
}

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "OmniMetric Stocks Module",
    "description": "Professional grade equity market risk analysis.",
    "brand": "OmniMetric"
};

export default function StocksPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SectorDashboard sectorKey="STOCKS" />
        </>
    );
}
