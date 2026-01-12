import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Forex & Rates Analysis | OmniMetric",
    description: "Global currency and interest rate market intelligence. USD, JPY, EUR analysis and yield curve monitoring.",
};

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
