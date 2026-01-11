import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface NewsItem {
    title: string;
    link: string;
}

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'EN';

        // 1. Fetch CNBC Top News (English Source)
        const FEED_URL = 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114';
        const res = await fetch(FEED_URL, { cache: 'no-store' });
        const text = await res.text();

        const items: NewsItem[] = [];
        const regex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<\/item>/g;
        let match;

        // Get top 6 items
        let count = 0;
        while ((match = regex.exec(text)) !== null && count < 6) {
            const title = match[1].replace('<![CDATA[', '').replace(']]>', '').trim();
            const link = match[2].replace('<![CDATA[', '').replace(']]>', '').trim();
            items.push({ title, link });
            count++;
        }

        // 2. AI Translation if not English
        if (lang !== 'EN' && items.length > 0) {
            try {
                // Try to get key from env (standard or gemini specific)
                const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;

                if (apiKey) {
                    const titles = items.map(i => i.title).join('\n');
                    const targetLang = lang === 'JP' ? 'Japanese' : (lang === 'CN' ? 'Simplified Chinese' : (lang === 'ES' ? 'Spanish' : 'English'));

                    const prompt = `Translate these financial headlines into professional, concise ${targetLang}. Keep the tone institutional. Return detailed translation line by line. No bullet points, just the text lines.\n\n${titles}`;

                    // Call Gemini API (REST)
                    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

                    const aiRes = await fetch(geminiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: prompt }]
                            }]
                        })
                    });

                    if (aiRes.ok) {
                        const aiJson = await aiRes.json();
                        const aiText = aiJson.candidates?.[0]?.content?.parts?.[0]?.text;

                        if (aiText) {
                            const translatedLines = aiText.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);

                            // Map back to items if length matches
                            if (translatedLines.length === items.length) {
                                for (let i = 0; i < items.length; i++) {
                                    items[i].title = translatedLines[i];
                                }
                            }
                        }
                    } else {
                        console.error('Gemini API Error', await aiRes.text());
                    }
                }
            } catch (translationError) {
                console.error("Translation Failed:", translationError);
                // Fallback to English (already in items)
            }
        }

        return NextResponse.json({ news: items });
    } catch (e) {
        console.error("News Fetch Error:", e);
        // Fail gracefully
        return NextResponse.json({
            news: [
                { title: "Market data synchronization active...", link: "#" },
                { title: "Global Liquidity Analysis: NEUTRAL", link: "#" },
                { title: "Waiting for institutional updates...", link: "#" }
            ]
        });
    }
}
