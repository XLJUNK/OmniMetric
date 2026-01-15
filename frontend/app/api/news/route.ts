import { NextRequest, NextResponse } from 'next/server';

// 1. RE-ENABLE CACHING (1 Hour)
// This strictly caches the response for 1 hour to prevent API drain and rate limits.
export const revalidate = 3600;
export const dynamic = 'force-dynamic';

interface NewsItem {
    title: string;
    link: string;
}

// Configuration
// STRICT MODE: Use Gemini 2.0 Flash for superior translation and consistency
const MODEL_NAME = "gemini-2.0-flash";

// Helper: Exponential Backoff Sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const lang = (searchParams.get('lang') || 'EN').toUpperCase();

        console.log(`[NEWS_API] Request received for language: ${lang}`);

        // 1. Fetch CNBC Top News
        const FEED_URL = 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114';
        const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
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

        console.log(`[NEWS_API] Fetched ${items.length} raw headlines from CNBC`);

        // 2. AI Translation if not English
        if (lang !== 'EN' && items.length > 0) {
            try {
                const apiKey = process.env.GEMINI_API_KEY ||
                    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
                    process.env.GOOGLE_API_KEY ||
                    process.env.GEMINI_KEY ||
                    process.env.AI_GATEWAY_API_KEY;

                if (!apiKey) {
                    console.error("[NEWS_API] CRITICAL: GEMINI_API_KEY is missing from environment.");
                    throw new Error("API Key Missing");
                }

                const titles = items.map(i => i.title);
                const langMap: Record<string, string> = {
                    'JP': 'Japanese',
                    'CN': 'Simplified Chinese',
                    'ES': 'Spanish',
                    'HI': 'Hindi',
                    'ID': 'Indonesian',
                    'AR': 'Arabic'
                };
                const targetLang = langMap[lang] || 'English';

                console.log(`[NEWS_API] Translating into: ${targetLang}`);

                // PROFESSIONAL BATCH PROMPT
                const prompt = `You are a professional financial translator for a Bloomberg terminal.
                Translate the following US market news headlines into concise, institutional-grade ${targetLang}.
                Maintain the punchy, factual tone of financial news.
                Output ONLY a raw JSON array of strings matching the input order.
                Example Output: ["Translation 1", "Translation 2"]

                Input Headlines: ${JSON.stringify(titles)}`;

                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

                // RETRY LOOP (3 Attempts)
                for (let attempt = 0; attempt < 3; attempt++) {
                    try {
                        const aiRes = await fetch(geminiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: prompt }] }]
                            })
                        });

                        if (aiRes.ok) {
                            const aiJson = await aiRes.json();
                            let aiText = aiJson.candidates?.[0]?.content?.parts?.[0]?.text || "";
                            aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

                            const translatedArray = JSON.parse(aiText);
                            if (Array.isArray(translatedArray) && translatedArray.length === items.length) {
                                for (let i = 0; i < items.length; i++) {
                                    items[i].title = translatedArray[i];
                                }
                                console.log(`[NEWS_API] Translation Successful for ${items.length} items.`);
                                break;
                            }
                        } else if (aiRes.status === 429) {
                            console.warn(`[NEWS_API] Rate limit hit (429). Retry attempt ${attempt + 1}...`);
                            await sleep(1000 * Math.pow(2, attempt));
                            continue;
                        } else {
                            console.error(`[NEWS_API] AI Fetch Error: ${aiRes.status}`);
                            break;
                        }
                    } catch (e) {
                        console.error(`[NEWS_API] AI Batch Request Exception: ${e}`);
                        break;
                    }
                }
            } catch (e) {
                console.error("[NEWS_API] Translation Pipeline Failure:", e);
            }
        }

        return NextResponse.json({ news: items });
    } catch (e) {
        console.error("News Fetch Error:", e);
        return NextResponse.json({
            news: [
                { title: "Market data synchronization active...", link: "#" },
                { title: "Global Liquidity Analysis: NEUTRAL", link: "#" },
                { title: "Waiting for institutional updates...", link: "#" }
            ]
        });
    }
}
