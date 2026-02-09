import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata(): Promise<Metadata> {
    return getMultilingualMetadata('/crypto', 'EN',
        "Crypto Markets | OmniMetric",
        "Real-time analysis of Bitcoin, Ethereum, and crypto market sentiment."
    );
}

export default function CryptoPage() {
    return <SectorDashboard sectorKey="CRYPTO" lang="EN" />;
}
