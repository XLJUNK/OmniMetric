import { ImageResponse } from '@vercel/og';
import { getSignalData } from '@/lib/signal';
import { DICTIONARY, LangType } from '@/data/dictionary';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') || 'EN').toUpperCase() as LangType;

    // 1. Data Fetch
    const data = await getSignalData();
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

    // 5. Font Loading (Robust Fallback)
    let fontOptions = {};
    try {
        const fontData = await fetch(
            new URL('https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf')
        ).then((res) => res.arrayBuffer());
        fontOptions = {
            fonts: [{ name: 'Inter', data: fontData, style: 'normal', weight: 700 }]
        };
    } catch (e) {
        console.warn("Font load failed, falling back to system fonts", e);
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#0a0b14', color: 'white', fontFamily: 'sans-serif',
                    padding: '60px', border: '12px solid #1e293b'
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', position: 'absolute', top: 50, left: 70 }}>
                    <span style={{ fontSize: 34, fontWeight: 'bold', color: '#38bdf8' }}>OMNIMETRIC TERMINAL</span>
                </div>

                {/* Main Content Area */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Score Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '10px solid #0ea5e9', paddingLeft: '50px' }}>
                        <div style={{ display: 'flex', fontSize: 44, color: '#94a3b8', marginBottom: '10px' }}>{gmsLabel}</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: 180, fontWeight: 900, lineHeight: 1 }}>{score}</span>
                            <span style={{ fontSize: 100, marginLeft: '30px', color: color }}>{arrow}</span>
                        </div>
                    </div>

                    {/* Momentum Badge Section */}
                    <div style={{ display: 'flex', marginLeft: '80px' }}>
                        <div style={{
                            display: 'flex',
                            backgroundColor: color === '#94a3b8' ? '#334155' : color + '33', // Add transparency for background
                            borderColor: color,
                            padding: '25px 50px', borderRadius: '16px', fontSize: 54, fontWeight: 'bold', border: '3px solid', color: 'white'
                        }}>
                            {momentumText}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', position: 'absolute', bottom: 50, right: 70 }}>
                    <span style={{ fontSize: 30, color: '#64748b' }}>{dateStr} | Institutional Real-Time Intelligence</span>
                </div>
            </div>
        ),
        { width: 1200, height: 630, ...fontOptions }
    );
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
