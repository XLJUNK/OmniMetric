import { ImageResponse } from '@vercel/og';
import { getSignalData } from '@/lib/signal';
import { DICTIONARY, LangType } from '@/data/dictionary';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') || 'EN').toUpperCase() as LangType;

    try {
        // 1. Data Fetch
        const data = await getSignalData();
        if (!data) throw new Error("Signal data is null after fetch");

        const score = data?.gms_score || 50;

        // 2. Localization Logic
        const momentumKey = calculateMomentum(data);
        const momentumText = DICTIONARY[lang]?.momentum?.[momentumKey] || DICTIONARY['EN'].momentum[momentumKey];
        const gmsLabel = DICTIONARY[lang]?.titles?.gms_score || "GMS SCORE";

        // 3. Trend Arrow & Color
        const { arrow, color } = getTrendVisuals(momentumKey);

        // 4. Localized Date
        const dateObj = new Date(data?.last_updated || new Date());
        const dateStr = dateObj.toLocaleDateString(lang === 'JP' ? 'ja-JP' : 'en-US', {
            month: 'short', day: 'numeric', timeZone: 'Asia/Tokyo'
        });

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
                        border: '16px solid #1e293b', // Thicker border
                        direction: isRTL ? 'rtl' : 'ltr'
                    }}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', position: 'absolute', top: 50, left: 70, alignItems: 'center' }}>
                        <div style={{ display: 'flex', width: '12px', height: '12px', background: '#38bdf8', borderRadius: '50%', marginRight: '15px' }}></div>
                        <div style={{ display: 'flex', fontSize: 30, letterSpacing: '0.1em', fontWeight: 'bold', color: '#94a3b8' }}>OMNIMETRIC</div>
                    </div>

                    {/* Main Content Area */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Score Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '12px solid #0ea5e9', paddingLeft: '60px' }}>
                            <div style={{ display: 'flex', fontSize: 40, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{gmsLabel}</div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {/* MASSIVE SCORE: Visual Authority */}
                                <div style={{ display: 'flex', fontSize: 270, fontWeight: 900, lineHeight: 0.85, letterSpacing: '-0.05em' }}>{score}</div>
                                <div style={{ display: 'flex', fontSize: 140, marginLeft: '40px', color: color, transform: 'translateY(-10px)' }}>{arrow}</div>
                            </div>
                        </div>

                        {/* Momentum Badge Section */}
                        <div style={{ display: 'flex', marginLeft: '100px', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{
                                display: 'flex',
                                backgroundColor: color === '#94a3b8' ? '#1e293b' : color + '22', // Subtle background
                                borderColor: color,
                                padding: '20px 50px',
                                borderRadius: '8px', // Sharper corners for authority
                                fontSize: 48,
                                fontWeight: 'bold',
                                border: `4px solid ${color}`,
                                color: 'white',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase'
                            }}>
                                {momentumText}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', position: 'absolute', bottom: 50, right: 70 }}>
                        <div style={{ display: 'flex', fontSize: 24, color: '#475569', letterSpacing: '0.05em' }}>{dateStr} | INSTITUTIONAL INTELLIGENCE</div>
                    </div>
                </div>
            ),
            { width: 1200, height: 630, ...fontOptions }
        );
    } catch (error: any) {
        console.error(`[OG/Main] Critical Render Failure | URL: ${request.url}`, {
            error: error.message,
            stack: error.stack
        });

        // Emergency Fallback Render
        return new ImageResponse(
            (
                <div style={{
                    height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: 'white'
                }}>
                    <div style={{ fontSize: 60, fontWeight: 'bold', color: '#38bdf8', marginBottom: 20 }}>OMNIMETRIC</div>
                    <div style={{ fontSize: 40, color: '#94a3b8' }}>SYSTEM SYNCHRONIZING...</div>
                </div>
            ),
            { width: 1200, height: 630 }
        );
    }
}

function calculateMomentum(data: any): 'stable' | 'rising' | 'falling' | 'peaking' | 'bottoming' {
    if (!data?.history_chart || data.history_chart.length < 5) return 'stable';
    const recent = data.history_chart.slice(0, 5);
    const latest = recent[0].score;
    const old = recent[recent.length - 1].score;
    const diff = latest - old;
    if (latest < 40 && diff > 0) return 'bottoming';
    if (latest > 60 && diff < 0) return 'peaking';
    if (diff > 2) return 'rising';
    if (diff < -2) return 'falling';
    return 'stable';
}

function getTrendVisuals(momentum: string) {
    switch (momentum) {
        case 'bottoming':
        case 'rising':
            return { arrow: '↗', color: '#22d3ee' }; // Cyan
        case 'peaking':
        case 'falling':
            return { arrow: '↘', color: '#ef4444' }; // Red
        default:
            return { arrow: '→', color: '#94a3b8' }; // Slate
    }
}
