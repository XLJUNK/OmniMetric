import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata(): Promise<Metadata> {
    return getMultilingualMetadata('/currencies', 'EN',
        "Global Currencies & Crypto Real-time Analysis | OmniMetric",
        "Analysis of dollar liquidity (DXY) and its impact on major fiat pairs and digital assets (BTC, ETH)."
    );
}

export default function CurrenciesPage() {
    return (
        <main className="min-h-screen bg-black">
            <div className="max-w-[1600px] mx-auto pt-16 px-4 md:px-8">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                    Currencies
                </h1>
                <p className="text-slate-400 font-mono text-sm mb-8 border-l-2 border-sky-500 pl-4">
                    Liquidity Analysis: Fiat vs Digital (Correlation Matrix)
                </p>
            </div>
            <SectorDashboard sectorKey="CURRENCIES" lang="EN" />
        </main>
    );
}
