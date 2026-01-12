import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const series_id = searchParams.get('series_id');
    const api_key = process.env.FRED_API_KEY;

    if (!series_id || !api_key) {
        return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${api_key}&file_type=json`;

    try {
        // Implementation of retry logic (max 3 times)
        let lastError;
        for (let i = 0; i < 3; i++) {
            try {
                const res = await fetch(url, {
                    next: { revalidate: 3600 } // Cache for 1 hour
                });
                if (res.ok) {
                    const data = await res.json();
                    return NextResponse.json(data, {
                        headers: {
                            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
                        }
                    });
                }
                lastError = `Status ${res.status}`;
            } catch (e: any) {
                lastError = e.message;
            }
            await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential-ish backoff
        }
        return NextResponse.json({ error: `FRED Proxy failed: ${lastError}` }, { status: 502 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
