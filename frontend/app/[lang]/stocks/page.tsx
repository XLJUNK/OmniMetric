import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return getMultilingualMetadata('/stocks', lang,
        "Global Equity Markets | OmniMetric",
        "Analysis of major indices (SPY, QQQ, VIX) and market breadth."
    );
}

export default function StocksPage() {
    return <SectorDashboard sectorKey="STOCKS" />;
}
