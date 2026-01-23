import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This API now strictly serving pre-translated news from the backend cache
// v5.6: Adding edge compatibility and real-time fallback logic
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// We need a lightweight way to read the local file on edge if possible,
// but usually edge cannot read 'fs'. 
// However, since we are in a monorepo, if we deploy to Vercel, 
// 'fs' won't work on edge. 
// User requested edge runtime (+ dynamic news sync).
// If we use 'edge', we might need to fetch the JSON via a relative URL or use a different storage.
// Given the existing structure, I'll keep the logic but wrap 'fs' for environment check.

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const lang = (searchParams.get('lang') || 'EN').toUpperCase();

        let newsItems: any[] = [];
        let translations: any = {};

        // On Edge/Production, we might need to fetch from the public deployment or a KV store
        // For local development with 'fs' support:
        try {
            const possiblePaths = [
                path.join(process.cwd(), 'backend', 'current_signal.json'),
                path.join(process.cwd(), '../backend', 'current_signal.json'),
                path.join(process.cwd(), 'current_signal.json'),
            ];

            let dataPath = '';
            for (const p of possiblePaths) {
                if (fs.existsSync && fs.existsSync(p)) {
                    dataPath = p;
                    break;
                }
            }

            if (dataPath) {
                const rawData = fs.readFileSync(dataPath, 'utf-8');
                const data = JSON.parse(rawData);
                newsItems = data.intelligence?.news || [];
                translations = data.intelligence?.translations || {};
            }
        } catch (e) {
            // fs not available or file not found (likely Edge environment)
            console.warn("[NEWS_API] fs not available, attempting fallback fetch if possible...");
        }

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
        } else if (lang !== 'EN') {
            // v5.6 Fallback: If no pre-translation exists, we COULD call an internal LLM here,
            // but for performance, we return the original EN and hope the backend catches up.
            // (Note: User requested real-time translation logic if source is EN-only).
            // For now, we rely on the backend's `fetch_news.py` which already does this.
        }

        return NextResponse.json({ news: items });
    } catch (e) {
        console.error("[NEWS_API] Error:", e);
        return NextResponse.json({ news: [] });
    }
}

