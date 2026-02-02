import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return getMultilingualMetadata('/crypto', lang,
        "Crypto Asset Analysis | OmniMetric",
        "Institutional analysis of Bitcoin, Ethereum, and Solana market structure."
    );
}

export default function CryptoPage() {
    return <SectorDashboard sectorKey="CRYPTO" />;
}
