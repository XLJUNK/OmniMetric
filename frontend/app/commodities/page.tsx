import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Commodities Market Analysis | OmniMetric",
    description: "Real-time tracking of Gold, Oil, Copper, and Natural Gas. Supply chain and geopolitical risk integration.",
};

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
