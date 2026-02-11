import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
import { DICTIONARY, LangType } from '@/data/dictionary';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const normalizedLang = (lang.toUpperCase() as LangType) || 'EN';
    const t = DICTIONARY[normalizedLang];

    return {
        title: `${t.labels.currencies} | OmniMetric Institutional Terminal`,
        description: `Institutional global liquidity analysis terminal. Real-time correlation between Fiat Currencies (DXY, EUR/USD) and Digital Assets (Bitcoin, Ethereum).`,
        openGraph: {
            title: t.labels.currencies,
            description: "Unified liquidity analysis for Fiat and Digital Currencies.",
        }
    };
}

type Props = {
    params: Promise<{ lang: string }>
}

export default async function CurrenciesPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (lang.toUpperCase() as LangType) || 'EN';

    return (
        <main className="min-h-screen bg-black">
            <div className="max-w-[1600px] mx-auto pt-16 px-4 md:px-8">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                    {DICTIONARY[normalizedLang]?.labels.currencies || 'Currencies'}
                </h1>
                <p className="text-slate-400 font-mono text-sm mb-8 border-l-2 border-sky-500 pl-4">
                    Liquidity Analysis: Fiat vs Digital (Correlation Matrix)
                </p>
            </div>
            <SectorDashboard sectorKey="CURRENCIES" lang={normalizedLang} />
        </main>
    );
}

export const dynamicParams = false;

export async function generateStaticParams() {
    return ['jp', 'cn', 'es', 'hi', 'id', 'ar', 'de', 'fr'].map((lang) => ({
        lang,
    }));
}
