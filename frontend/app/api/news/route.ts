import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        // CNBC Top News
        const FEED_URL = 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114';

        const res = await fetch(FEED_URL, { cache: 'no-store' });
        const text = await res.text();

        const items = [];
        const regex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<\/item>/g;
        let match;

        let count = 0;
        while ((match = regex.exec(text)) !== null && count < 10) {
            const title = match[1].replace('<![CDATA[', '').replace(']]>', '').trim();
            const link = match[2].replace('<![CDATA[', '').replace(']]>', '').trim();
            items.push({ title, link });
            count++;
        }

        return NextResponse.json({ news: items });
    } catch (e) {
        // Return fallback data on error, wrapped in NextResponse
        return NextResponse.json({
            news: [
                { title: "Market data synchronization active...", link: "#" },
                { title: "Global Liquidity Analysis: NEUTRAL", link: "#" },
                { title: "Waiting for institutional updates...", link: "#" }
            ]
        });
    }
}
