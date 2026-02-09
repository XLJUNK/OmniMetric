import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata(): Promise<Metadata> {
    return getMultilingualMetadata('/commodities', 'EN',
        "Commodity Markets | OmniMetric",
        "Analysis of Gold, Oil, Copper, and strategic resources."
    );
}

export default function CommoditiesPage() {
    return <SectorDashboard sectorKey="COMMODITIES" lang="EN" />;
}
