import { SectorDashboard } from '@/components/SectorDashboard';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { getMultilingualMetadata } from '@/data/seo';

import { getSignalData } from '@/lib/signal';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
    const s = await searchParams;
    const lang = s.lang || 'EN';

    // Default Metadata
    let title = "Commodities Market Analysis | OmniMetric";
    let desc = "Real-time tracking of Gold, Oil, Copper, and Natural Gas. Supply chain and geopolitical risk integration.";

    // Logic for Spanish "Ratio Cobre Oro" (Copper/Gold) SEO Hack
    if (lang === 'ES') {
        const data = await getSignalData();
        if (data && data.market_data && data.market_data.COPPER_GOLD) {
            const cg = data.market_data.COPPER_GOLD;
            const val = cg.price;
            // Basic trend translation
            let trend = "NEUTRAL";
            if (cg.trend === "RISK-ON") trend = "ALCISTA"; // Bullish
            else if (cg.trend === "RISK-OFF") trend = "BAJISTA"; // Bearish
            else trend = "RANGO"; // Neutral/Range

            const dateObj = new Date(data.last_updated);
            const dateStr = dateObj.toLocaleDateString("es-ES", { month: 'short', day: 'numeric', timeZone: 'Asia/Tokyo' });

            title = `Ratio Cobre Oro: ${val} (${trend}) | Análisis de Commodities ${dateStr}`;
            desc = `El Ratio Cobre/Oro actual es ${val}. Tendencia: ${trend}. Análisis de materias primas actualizado el ${dateStr}.`;
        } else {
            title = "Análisis de Materias Primas | OmniMetric";
            desc = "Seguimiento en tiempo real de Oro, Petróleo, Cobre y Gas Natural.";
        }
    } else {
        // Fallback for other languages to just standard Multilingual title
        // Currently getMultilingualMetadata handles the "Base Title" + Suffix.
        // But for consistency we might want dynamic dates here too? 
        // For now, sticking to user's specific request for "GMS Main" and "Ratio Cobre Oro".
    }

    // Note: getMultilingualMetadata appends " | OmniMetric" usually, but here we override `title` for ES.
    // If we use getMultilingualMetadata, it might double append.
    // Let's use getMultilingualMetadata but pass our custom title if calculated.

    // Actually, getMultilingualMetadata does: title || "Default..."
    // So passing our custom title works.

    const metadata = getMultilingualMetadata('/commodities', lang, title, desc);

    metadata.openGraph = {
        title,
        description: desc,
        images: [{ url: `/api/og/commodities?lang=${lang}`, width: 1200, height: 630 }]
    };
    metadata.twitter = {
        card: 'summary_large_image',
        title,
        description: desc,
        images: [`/api/og/commodities?lang=${lang}`]
    };

    return metadata;
}

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "OmniMetric Commodities Module",
    "description": "Institutional grade commodities market analysis.",
    "brand": "OmniMetric"
};

export default function CommoditiesPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SectorDashboard sectorKey="COMMODITIES" />
        </>
    );
}
