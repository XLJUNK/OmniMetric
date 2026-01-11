import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
    // In a real deployed edge function, accessing local file system might not work as expected via fs.
    // Ideally, we fetch from the deployed URL or use a KV store.
    // For this hybrid static/dynamic setup, we can try to fetch the public JSON if available, 
    // or default to a "SIGNAL GENERATED" placeholder if we can't read the file in Edge runtime.
    // However, since we are deploying to Vercel, we can try to fetch the JSON from the domain itself or hardcode a fallback.

    // NOTE: For robust production, we would fetch 'https://omnimetric.net/data/current_signal.json' (if we exposed it).
    // Here, to ensure it works immediately without external fetch issues during Vercel build/preview, 
    // we will try to fetch from the deployment URL if possible, or fail gracefully.

    // SIMPLIFICATION for Prototype:
    // We will generate a generic "LIVE TERMINAL STATUS" image first.
    // To make it truly dynamic with valid data, we'd need to fetch the JSON from an endpoint.
    // Let's assume the JSON is available at the root or via import. 
    // OGP images are often cached, so real-time < 1s isn't required.

    // Let's try to fetch the LIVE data if possible.
    let score = "??";
    let regime = "SYSTEM ONLINE";
    let status = "SYNCING...";

    try {
        // This fetch might fail in local dev if not running, but works in potential prod if pointing to self.
        // For now, we use a specialized design that looks good even without specific numbers, 
        // OR we try to fetch from the public URL if it exists.
        // const res = await fetch('https://omnimetric.net/current_signal.json'); // Hypothetical
        // const data = await res.json();
        // score = data.gms_score;
    } catch (e) { }

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundImage: 'linear-gradient(to bottom, #050505, #000000)',
                    border: '4px solid #06b6d4',
                    fontFamily: 'monospace',
                    position: 'relative',
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 40,
                    left: 40,
                    color: '#06b6d4',
                    fontSize: 24,
                    letterSpacing: '0.2em',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    OMNIMETRIC // GLOBAL MACRO SIGNAL
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                }}>
                    <div style={{
                        color: '#fff',
                        fontSize: 160,
                        fontWeight: 900,
                        textShadow: '0 0 40px rgba(6,182,212,0.8)',
                        letterSpacing: '-0.05em',
                        lineHeight: 1,
                    }}>
                        GMS
                    </div>
                    <div style={{
                        color: '#fff',
                        fontSize: 40,
                        letterSpacing: '0.4em',
                        backgroundColor: '#06b6d4',
                        color: '#000',
                        padding: '10px 40px',
                        fontWeight: 'bold',
                    }}>
                        INSTITUTIONAL
                    </div>
                    <div style={{
                        color: '#64748b',
                        fontSize: 20,
                        letterSpacing: '0.2em',
                        marginTop: 20,
                    }}>
                        QUANTITATIVE RISK MODEL
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 10,
                }}>
                    <div style={{ color: '#06b6d4', fontSize: 24 }}>
                        LIVE TERMINAL
                    </div>
                    <div style={{ color: '#444', fontSize: 16 }}>
                        DATA. NOT ADVICE.
                    </div>
                </div>

                {/* Scanlines effect overlay (simulated with repetitive gradient) */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 50%)',
                    backgroundSize: '100% 4px',
                    pointerEvents: 'none',
                }}></div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
