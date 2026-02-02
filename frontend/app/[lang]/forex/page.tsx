import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return getMultilingualMetadata('/forex', lang,
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

export default function ForexPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SectorDashboard sectorKey="FOREX" />
        </>
    );
}
