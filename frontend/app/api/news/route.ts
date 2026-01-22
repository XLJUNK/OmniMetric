import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This API now strictly serving pre-translated news from the backend cache
export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const lang = (searchParams.get('lang') || 'EN').toUpperCase();

        // 1. Path to the master data file
        const dataPath = path.join(process.cwd(), '..', 'backend', 'current_signal.json');

        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ news: [] });
        }

        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const data = JSON.parse(rawData);
        const intel = data.intelligence;

        if (!intel || !intel.news) {
            return NextResponse.json({ news: [] });
        }

        let items = [...intel.news];

        // 2. Apply pre-translated titles if available
        if (lang !== 'EN' && intel.translations && intel.translations[lang]) {
            const trans = intel.translations[lang];
            items = items.map((item, idx) => ({
                ...item,
                title: trans[idx] || item.title
            }));
        }

        return NextResponse.json({ news: items });
    } catch (e) {
        console.error("[NEWS_API] Cache Read Error:", e);
        return NextResponse.json({
            news: [
                { title: "Market data synchronization active...", link: "#" },
                { title: "Global Liquidity Analysis: NEUTRAL", link: "#" },
                { title: "Waiting for institutional updates...", link: "#" }
            ]
        });
    }
}
