import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const api_key = process.env.FMP_API_KEY;

    if (!symbol || !api_key) {
        return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    // SSRF Prevention: Validate symbol format (Alphanumeric, dot, caret, dash only)
    if (!/^[a-zA-Z0-9^.-]+$/.test(symbol)) {
        return NextResponse.json({ error: 'Invalid symbol format' }, { status: 400 });
    }

    const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${api_key}`;

    try {
        let lastError;
        for (let i = 0; i < 3; i++) {
            try {
                const res = await fetch(url, {
                    next: { revalidate: 600 } // Cache for 10 min
                });
                if (res.ok) {
                    const data = await res.json();
                    return NextResponse.json(data, {
                        headers: {
                            'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120'
                        }
                    });
                }
                lastError = `Status ${res.status}`;
            } catch (e: any) {
                lastError = e.message;
            }
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
        return NextResponse.json({ error: `FMP Proxy failed: ${lastError}` }, { status: 502 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
