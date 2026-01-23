import { ImageResponse } from '@vercel/og';
import { getSignalData } from '@/lib/signal';
import { DICTIONARY, LangType } from '@/data/dictionary';

// Using default Node.js runtime for local stability and Turbo compatibility
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function Image(props: { params: { [key: string]: string | string[] | undefined }; searchParams?: { lang?: string } }) {
    const lang = (props.searchParams?.lang || 'EN').toUpperCase() as LangType;
    const data = await getSignalData();

    if (!data) {
        return new ImageResponse(
            (
                <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0a0a0a', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>
                    OmniMetric Terminal
                </div>
            ),
            { width: 1200, height: 630 }
        );
    }

    const score = data.gms_score;
    const dateObj = new Date(data.last_updated);
    const dateStr = dateObj.toLocaleDateString(lang === 'JP' ? 'ja-JP' : 'en-US', {
        month: 'short', day: 'numeric', timeZone: 'Asia/Tokyo'
    });

    let momentumKey: 'stable' | 'rising' | 'falling' | 'peaking' | 'bottoming' = 'stable';
    if (data.history_chart && data.history_chart.length >= 5) {
        const recent = data.history_chart.slice(0, 5);
        const latest = recent[0].score;
        const old = recent[recent.length - 1].score;
        const diff = latest - old;
        if (latest < 40 && diff > 0) momentumKey = 'bottoming';
        else if (latest > 60 && diff < 0) momentumKey = 'peaking';
        else if (diff > 2) momentumKey = 'rising';
        else if (diff < -2) momentumKey = 'falling';
    }

    const momentumText = DICTIONARY[lang]?.momentum?.[momentumKey] || DICTIONARY['EN'].momentum[momentumKey];
    const gmsLabel = DICTIONARY[lang]?.titles?.gms_score || "GMS SCORE";

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#0a0b14', color: 'white', fontFamily: 'sans-serif',
                    padding: '60px', border: '12px solid #1e293b'
                }}
            >
                <div style={{ display: 'flex', position: 'absolute', top: 50, left: 70, fontSize: 34, fontWeight: 'bold', color: '#38bdf8' }}>
                    OMNIMETRIC TERMINAL
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '10px solid #0ea5e9', paddingLeft: '50px' }}>
                        <div style={{ fontSize: 44, color: '#94a3b8', marginBottom: '10px' }}>{gmsLabel}</div>
                        <div style={{ fontSize: 180, fontWeight: 900, lineHeight: 1 }}>{score}</div>
                    </div>
                    <div style={{ display: 'flex', marginLeft: '80px' }}>
                        <div style={{
                            backgroundColor: (momentumKey === 'rising' || momentumKey === 'bottoming') ? '#065f46' : (momentumKey === 'falling' || momentumKey === 'peaking') ? '#991b1b' : '#334155',
                            padding: '25px 50px', borderRadius: '16px', fontSize: 54, fontWeight: 'bold', border: '3px solid white'
                        }}>
                            {momentumText}
                        </div>
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: 50, right: 70, fontSize: 30, color: '#64748b' }}>
                    {dateStr} | Institutional Real-Time Intelligence
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
