import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
    const s = await searchParams;
    return getMultilingualMetadata('/crypto', s.lang || 'EN',
        "Crypto Assets Analysis | OmniMetric",
        "Institutional risk monitoring for Bitcoin, Ethereum, and Solana. Advanced volatility and correlation metrics."
    );
}

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "OmniMetric Crypto Module",
    "description": "Institutional grade crypto asset risk analysis.",
    "brand": "OmniMetric"
};

export default function CryptoPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SectorDashboard sectorKey="CRYPTO" />
        </>
    );
}
