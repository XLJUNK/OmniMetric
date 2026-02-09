import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata(): Promise<Metadata> {
    return getMultilingualMetadata('/forex', 'EN',
        "Forex Markets | OmniMetric",
        "Analysis of major currency pairs, DXY, and yield differentials."
    );
}

export default function ForexPage() {
    return <SectorDashboard sectorKey="FOREX" lang="EN" />;
}
