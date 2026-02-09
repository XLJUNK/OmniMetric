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
    return getMultilingualMetadata('/commodities', normalizedLang,
        "Commodities & Energy | OmniMetric",
        "Strategic analysis of Gold, Oil, Copper, and Natural Gas markets."
    );
}

export default async function CommoditiesPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;
    return <SectorDashboard sectorKey="COMMODITIES" lang={normalizedLang} />;
}
