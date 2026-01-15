import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
    const s = await searchParams;
    return getMultilingualMetadata('/commodities', s.lang || 'EN',
        "Commodities Market Analysis | OmniMetric",
        "Real-time tracking of Gold, Oil, Copper, and Natural Gas. Supply chain and geopolitical risk integration."
    );
}

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "OmniMetric Commodities Module",
    "description": "Institutional grade commodities market analysis.",
    "brand": "OmniMetric"
};

export default function CommoditiesPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SectorDashboard sectorKey="COMMODITIES" />
        </>
    );
}
