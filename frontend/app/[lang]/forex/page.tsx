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
    return getMultilingualMetadata('/forex', normalizedLang,
        "Currency & Rates Analysis | OmniMetric",
        "Global forex and interest rate analysis including US Dollar Index (DXY), Yen, and Treasury yields."
    );
}

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "OmniMetric Forex Module",
    "description": "Institutional grade forex and rates analysis.",
    "brand": "OmniMetric"
};

export default async function ForexPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SectorDashboard sectorKey="FOREX" lang={normalizedLang} />
        </>
    );
}
