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
    const isEn = lang.toLowerCase() === 'en';

    return {
        title: isEn ? "Stocks & Treasury Yields Real-time Analysis | OmniMetric" : "株・債券利回り リアルタイム相関分析 | OmniMetric",
        description: isEn
            ? "Real-time analysis of the correlation between the stock market and US Treasury yields. Visualizing the impact of interest rates on stock prices with our proprietary algorithm."
            : "株式市場と米国債利回りの相関をリアルタイム解析。金利が株価に与える影響を独自のアルゴリズムで可視化します。",
    };
}

export default async function StocksPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;
    return (
        <div className="flex flex-col gap-6">
            <h1 className="sr-only">Stocks & Interest Rates Correlation Terminal</h1>
            <SectorDashboard sectorKey="STOCKS" lang={normalizedLang} />
        </div>
    );
}
