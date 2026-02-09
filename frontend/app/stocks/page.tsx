import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
import { LangType } from '@/data/dictionary';

export async function generateMetadata(): Promise<Metadata> {
    return getMultilingualMetadata('/stocks', 'EN',
        "Global Equity Markets | OmniMetric",
        "Analysis of major indices (SPY, QQQ, VIX) and market breadth."
    );
}

export default function StocksPage() {
    return <SectorDashboard sectorKey="STOCKS" lang="EN" />;
}
