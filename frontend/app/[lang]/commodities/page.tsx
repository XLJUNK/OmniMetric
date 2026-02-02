import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return getMultilingualMetadata('/commodities', lang,
        "Commodities & Energy | OmniMetric",
        "Strategic analysis of Gold, Oil, Copper, and Natural Gas markets."
    );
}

export default function CommoditiesPage() {
    return <SectorDashboard sectorKey="COMMODITIES" />;
}
