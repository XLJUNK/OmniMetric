import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

import { DICTIONARY, LangType } from '@/data/dictionary';

export function generateStaticParams() {
    return ['jp', 'cn', 'es', 'hi', 'id', 'ar', 'de', 'fr'].map((lang) => ({
        lang,
    }));
}



type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;
    return getMultilingualMetadata('/stocks', normalizedLang,
        "Global Equity Markets | OmniMetric",
        "Analysis of major indices (SPY, QQQ, VIX) and market breadth."
    );
}

export default async function StocksPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;
    return <SectorDashboard sectorKey="STOCKS" lang={normalizedLang} />;
}
