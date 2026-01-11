import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic Params (optional, can be passed via URL)
        const score = searchParams.get('score') || '63';
        // const title = searchParams.get('title') || 'Global Macro Signal';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0c0c0c',
                        backgroundImage: 'linear-gradient(to bottom right, #000000, #111111)',
                    }}
                >
                    {/* Logo Name */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
                        <span style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: '0.2em' }}>OMNIMETRIC</span>
                    </div>

                    {/* Central Score Card */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #333',
                        borderRadius: 20,
                        padding: '40px 80px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        boxShadow: '0 0 50px rgba(0,0,0,0.8)'
                    }}>
                        <span style={{ fontSize: 24, color: '#888', letterSpacing: '0.4em', marginBottom: 10, textTransform: 'uppercase' }}>GMS Score</span>
                        <span style={{ fontSize: 120, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</span>

                        {/* Gradient Bar Simulation */}
                        <div style={{ display: 'flex', marginTop: 30, width: 400, height: 12, borderRadius: 6, background: 'linear-gradient(90deg, #ef4444, #eab308, #3b82f6)' }}></div>
                    </div>

                    <div style={{ display: 'flex', marginTop: 40, alignItems: 'center', gap: 20 }}>
                        <span style={{ fontSize: 20, color: '#444', letterSpacing: '0.2em' }}>INSTITUTIONAL RISK ANALYTICS</span>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
