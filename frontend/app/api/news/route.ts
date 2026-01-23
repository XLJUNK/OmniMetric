import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import signalData from '@/data/current_signal.json';

// This API serves pre-translated news from the build-time bundled JSON
// v5.7: Switched to static import for Edge compatibility
export const dynamic = 'force-dynamic';
// export const runtime = 'edge'; // Optional: Next.js handles imported JSON universally

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const lang = (searchParams.get('lang') || 'EN').toUpperCase();

        // Type safety for imported JSON
        const data: any = signalData;

        let newsItems: any[] = data.intelligence?.news || [];
        let translations: any = data.intelligence?.translations || {};

        // If newsItems is still empty, return fallback messages
        if (newsItems.length === 0) {
            return NextResponse.json({
                news: [
                    { title: "Market data synchronization active...", link: "#", isoDate: new Date().toISOString() },
                    { title: "Global Liquidity Analysis: NEUTRAL", link: "#", isoDate: new Date().toISOString() },
                    { title: "Waiting for institutional updates...", link: "#", isoDate: new Date().toISOString() }
                ]
            });
        }

        let items = [...newsItems];

        // Apply pre-translated titles if available
        if (lang !== 'EN' && translations[lang]) {
            const trans = translations[lang];
            items = items.map((item, idx) => ({
                ...item,
                title: trans[idx] || item.title
            }));
        }

        return NextResponse.json({ news: items });
    } catch (e) {
        console.error("[NEWS_API] Error:", e);
        return NextResponse.json({ news: [] });
    }
}

