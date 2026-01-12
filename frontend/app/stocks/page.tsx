import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Global Stocks Analysis | OmniMetric",
    description: "Real-time institutional analysis of global equity markets including S&P 500, NASDAQ, and VIX volatility index.",
};

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
