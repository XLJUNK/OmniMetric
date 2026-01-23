import { ImageResponse } from '@vercel/og';
import { getSignalData } from '@/lib/signal';
import { DICTIONARY, LangType } from '@/data/dictionary';

// Using default Node.js runtime for local stability
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function Image(props: { params: { [key: string]: string | string[] | undefined }; searchParams?: { lang?: string } }) {
    const lang = (props.searchParams?.lang || 'EN').toUpperCase() as LangType;
    const data = await getSignalData();

    if (!data) {
        return new ImageResponse(
            (
                <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0a0a0a', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>
                    OmniMetric Commodities
                </div>
            ),
            { width: 1200, height: 630 }
        );
    }

    const commoditiesLabel = DICTIONARY[lang]?.labels?.commodities || "COMMODITIES";
    const dateObj = new Date(data.last_updated);
    const dateStr = dateObj.toLocaleDateString(lang === 'JP' ? 'ja-JP' : 'en-US', {
        month: 'short', day: 'numeric', timeZone: 'Asia/Tokyo'
    });

    let mainMetricLabel = commoditiesLabel;
    let mainMetricValue = data.market_data?.COMMODITIES?.score?.toString() || "--";
    let trendText = "";

    if (lang === 'ES' && data.market_data?.COPPER_GOLD) {
        mainMetricLabel = "RATIO COBRE ORO";
        mainMetricValue = data.market_data.COPPER_GOLD.price.toString();
        const trend = data.market_data.COPPER_GOLD.trend;
        trendText = trend === "RISK-ON" ? "ALCISTA" : trend === "RISK-OFF" ? "BAJISTA" : "ESTABLE";
    } else {
        const score = data.market_data?.COMMODITIES?.score || 50;
        trendText = score > 60 ? "ACCUMULATE" : score < 40 ? "DEFENSIVE" : "NEUTRAL";
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#0c0e1a', color: 'white', fontFamily: 'sans-serif', padding: '60px', border: '12px solid #334155'
                }}
            >
                <div style={{ display: 'flex', position: 'absolute', top: 50, left: 80, fontSize: 34, color: '#f59e0b', fontWeight: 'bold' }}>
                    OMNIMETRIC | {commoditiesLabel}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#111827', padding: '70px 100px', borderRadius: '30px', border: '4px solid #475569' }}>
                    <div style={{ fontSize: 44, color: '#94a3b8', marginBottom: '25px', letterSpacing: '0.05em' }}>{mainMetricLabel}</div>
                    <div style={{ fontSize: 160, fontWeight: 900, lineHeight: 1 }}>{mainMetricValue}</div>
                    <div style={{
                        marginTop: '30px', padding: '10px 40px', borderRadius: '100px', fontSize: 54, fontWeight: 'bold',
                        color: (trendText === 'ALCISTA' || trendText === 'ACCUMULATE') ? '#10b981' : (trendText === 'BAJISTA' || trendText === 'DEFENSIVE') ? '#ef4444' : '#94a3b8',
                        backgroundColor: 'rgba(255,255,255,0.05)'
                    }}>
                        {trendText}
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: 50, right: 80, fontSize: 30, color: '#64748b' }}>
                    {dateStr} | Supply Chain Intelligence
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
