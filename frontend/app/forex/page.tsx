import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
    const s = await searchParams;
    return getMultilingualMetadata('/forex', s.lang || 'EN',
        "Currency & Rates Analysis | OmniMetric",
        "Global forex and interest rate analysis including US Dollar Index (DXY), Yen, and Treasury yields."
    );
}

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "OmniMetric Forex Module",
    "description": "Institutional grade forex and rates analysis.",
    "brand": "OmniMetric"
};

export default function ForexPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SectorDashboard sectorKey="FOREX" />
        </>
    );
}
