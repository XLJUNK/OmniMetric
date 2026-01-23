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

        // 5. Dynamic Font Loading & RTL Logic
        let fontUrl = 'https://github.com/google/fonts/raw/main/ofl/notosansjp/NotoSansJP-Bold.ttf'; // Default (JP/EN/ES/ID)
        let fontFamily = '"NotoSansJP", sans-serif';
        const isRTL = lang === 'AR';

        if (lang === 'CN') {
            fontUrl = 'https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC-Bold.ttf';
            fontFamily = '"NotoSansSC", sans-serif';
        } else if (lang === 'HI') {
            fontUrl = 'https://github.com/google/fonts/raw/main/ofl/notosansdevanagari/NotoSansDevanagari-Bold.ttf';
            fontFamily = '"NotoSansDevanagari", sans-serif';
        } else if (lang === 'AR') {
            fontUrl = 'https://github.com/google/fonts/raw/main/ofl/notosansarabic/NotoSansArabic-Bold.ttf';
            fontFamily = '"NotoSansArabic", sans-serif';
        }

        let fontOptions = {};

        // Timeout Wrapper
        const fetchWithTimeout = (url: string, ms: number) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), ms);
            return fetch(url, { signal: controller.signal })
                .then(res => { clearTimeout(timeoutId); return res; })
                .catch(err => { clearTimeout(timeoutId); throw err; });
        };

        try {
            // 3000ms Timeout to prevent Edge Function Freeze
            const response = await fetchWithTimeout(fontUrl, 3000);
            if (response.ok) {
                const fontData = await response.arrayBuffer();
                if (fontData.byteLength > 0) {
                    const fontName = fontFamily.split('"')[1];
                    fontOptions = {
                        fonts: [{ name: fontName, data: fontData, style: 'normal', weight: 700 }]
                    };
                }
            } else {
                console.warn(`Font fetch failed: ${response.status}`);
                fontFamily = 'sans-serif'; // Fallback
            }
        } catch (e) {
            console.warn(`Font load Exception for ${lang}:`, e);
            fontFamily = 'sans-serif'; // Fallback
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#050505', // Void Black
                        color: 'white',
                        fontFamily: fontFamily,
                        padding: '60px',
                        border: '16px solid #334155',
                        direction: isRTL ? 'rtl' : 'ltr'
                    }}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', position: 'absolute', top: 50, left: 80, alignItems: 'center' }}>
                        <div style={{ display: 'flex', width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%', marginRight: '15px' }}></div>
                        <div style={{ display: 'flex', fontSize: 30, color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.1em' }}>
                            OMNIMETRIC | <span style={{ color: '#f59e0b', marginLeft: '10px' }}>{commoditiesLabel}</span>
                        </div>
                    </div>

                    {/* Central Panel */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#111827',
                        padding: '60px 120px',
                        borderRadius: '16px',
                        border: '2px solid #374151'
                    }}>
                        <div style={{ display: 'flex', fontSize: 40, color: '#64748b', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{mainMetricLabel}</div>

                        {/* Massive Metric */}
                        <div style={{ display: 'flex', fontSize: 200, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em' }}>{mainMetricValue}</div>

                        {/* Trend Status */}
                        <div style={{
                            display: 'flex', marginTop: '40px', padding: '15px 50px',
                            borderRadius: '8px',
                            fontSize: 48, fontWeight: 'bold',
                            color: trendColor,
                            backgroundColor: trendColor + '22', // 0.1 opacity background
                            border: `2px solid ${trendColor}`,
                            letterSpacing: '0.05em'
                        }}>
                            {trendText}
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', position: 'absolute', bottom: 50, right: 80 }}>
                        <div style={{ display: 'flex', fontSize: 24, color: '#475569', letterSpacing: '0.05em' }}>{dateStr} | SUPPLY CHAIN INTELLIGENCE</div>
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
                    alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: 'white'
                }}>
                    <div style={{ fontSize: 60, fontWeight: 'bold', color: '#f59e0b', marginBottom: 20 }}>OMNIMETRIC</div>
                    <div style={{ fontSize: 40, color: '#94a3b8' }}>SYSTEM SYNCHRONIZING...</div>
                </div>
            ),
            { width: 1200, height: 630 }
        );
    }
}
