import { ImageResponse } from '@vercel/og';
import { getSignalData } from '@/lib/signal';
import { DICTIONARY, LangType } from '@/data/dictionary';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') || 'EN').toUpperCase() as LangType;

    try {
        const data = await getSignalData();
        if (!data) throw new Error("Signal data is null after fetch");

        const commoditiesLabel = DICTIONARY[lang]?.labels?.commodities || "COMMODITIES";
        const dateObj = new Date(data?.last_updated || new Date());
        const dateStr = dateObj.toLocaleDateString(lang === 'JP' ? 'ja-JP' : 'en-US', {
            month: 'short', day: 'numeric', timeZone: 'Asia/Tokyo'
        });

        let mainMetricLabel = commoditiesLabel;
        let mainMetricValue = data?.market_data?.COMMODITIES?.score?.toString() || "50";
        let trendText = "NEUTRAL";
        let trendColor = "#94a3b8";

        if (lang === 'ES' && data?.market_data?.COPPER_GOLD) {
            mainMetricLabel = "RATIO COBRE ORO";
            mainMetricValue = data.market_data.COPPER_GOLD.price.toString();
            const trend = data.market_data.COPPER_GOLD.trend;
            if (trend === "RISK-ON") {
                trendText = "ALCISTA";
                trendColor = "#10b981";
            } else if (trend === "RISK-OFF") {
                trendText = "BAJISTA";
                trendColor = "#ef4444";
            } else {
                trendText = "ESTABLE";
            }
        } else {
            const score = data?.market_data?.COMMODITIES?.score || 50;
            if (score > 60) {
                trendText = "ACCUMULATE";
                trendColor = "#10b981";
            } else if (score < 40) {
                trendText = "DEFENSIVE";
                trendColor = "#ef4444";
            }
        }

        // Font Loading
        let fontOptions = {};
        try {
            const fontData = await fetch(
                new URL('https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-Bold.otf')
            ).then((res) => res.arrayBuffer());

            if (fontData.byteLength > 0) {
                fontOptions = {
                    fonts: [{ name: 'InterFont', data: fontData, style: 'normal', weight: 700 }]
                };
            }
        } catch (e) {
            console.warn("Font load failed, falling back to system fonts", e);
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#0c0e1a', color: 'white', padding: '60px', border: '12px solid #334155'
                    }}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', position: 'absolute', top: 50, left: 80 }}>
                        <div style={{ display: 'flex', fontSize: 34, color: '#f59e0b', fontWeight: 'bold' }}>
                            OMNIMETRIC | {commoditiesLabel}
                        </div>
                    </div>

                    {/* Central Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#111827', padding: '70px 100px', borderRadius: '30px', border: '4px solid #475569' }}>
                        <div style={{ display: 'flex', fontSize: 44, color: '#94a3b8', marginBottom: '25px', letterSpacing: '0.05em' }}>{mainMetricLabel}</div>
                        <div style={{ display: 'flex', fontSize: 160, fontWeight: 900, lineHeight: 1 }}>{mainMetricValue}</div>
                        <div style={{
                            display: 'flex', marginTop: '30px', padding: '10px 40px', borderRadius: '100px', fontSize: 54, fontWeight: 'bold',
                            color: trendColor,
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: `12px solid #ffffff22`
                        }}>
                            {trendText}
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', position: 'absolute', bottom: 50, right: 80 }}>
                        <div style={{ display: 'flex', fontSize: 30, color: '#64748b' }}>{dateStr} | Supply Chain Intelligence</div>
                    </div>
                </div>
            ),
            { width: 1200, height: 630, ...fontOptions }
        );
    } catch (error: any) {
        console.error(`[OG/Commodities] Critical Render Failure | URL: ${request.url}`, {
            error: error.message,
            stack: error.stack
        });

        return new ImageResponse(
            (
                <div style={{
                    height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', backgroundColor: '#0c0e1a', color: 'white'
                }}>
                    <div style={{ fontSize: 60, fontWeight: 'bold', color: '#f59e0b', marginBottom: 20 }}>OMNIMETRIC TERMINAL</div>
                    <div style={{ fontSize: 40, color: '#94a3b8' }}>COMMODITIES DATA SYNC...</div>
                    <div style={{ fontSize: 24, color: '#475569', marginTop: 40 }}>STATUS 200 | RE-FETCHING REGISTRY</div>
                </div>
            ),
            { width: 1200, height: 630 }
        );
    }
}
