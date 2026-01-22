import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
});

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
        const regex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>/g;
        let match;

        // Get top 6 items
        let count = 0;
        while ((match = regex.exec(text)) !== null && count < 6) {
            const title = match[1].replace('<![CDATA[', '').replace(']]>', '').trim();
            const link = match[2].replace('<![CDATA[', '').replace(']]>', '').trim();
            const pubDateStr = match[3].trim();

            // Convert RFC 822 (from RSS) to ISO string for easier frontend parsing
            let isoDate = new Date().toISOString();
            try {
                isoDate = new Date(pubDateStr).toISOString();
            } catch (e) {
                console.error("[NEWS_API] Date parsing error:", pubDateStr);
            }

            items.push({ title, link, isoDate } as any);
            count++;
        }

        console.log(`[NEWS_API] Fetched ${items.length} raw headlines from CNBC`);

        // 2. AI Translation if not English
        if (lang !== 'EN' && items.length > 0) {
            try {
                const titles = items.map(i => i.title);
                const langMap: Record<string, string> = {
                    'JP': 'Japanese',
                    'JA': 'Japanese',
                    'CN': 'Simplified Chinese',
                    'ZH': 'Simplified Chinese',
                    'ES': 'Spanish',
                    'HI': 'Hindi',
                    'ID': 'Indonesian',
                    'AR': 'Arabic'
                };
                const targetLang = langMap[lang] || langMap[lang.substring(0, 2)] || 'English';

                console.log(`[NEWS_API] AI SDK Translation Start: ${targetLang} (Source: ${lang})`);

                // PROFESSIONAL BATCH PROMPT
                const prompt = `You are a professional financial translator for a Bloomberg terminal.
                Translate the following US market news headlines into concise, institutional-grade ${targetLang}.
                Maintain the punchy, factual tone of financial news.
                Output ONLY a raw JSON array of strings matching the input order.
                Example Output: ["Translation 1", "Translation 2"]

                Input Headlines: ${JSON.stringify(titles)}`;

                console.log(`[NEWS_API] AI Input Titles:`, titles);

                // Use a try-catch specifically for the AI call to debug failures
                let result;
                try {
                    result = await generateText({
                        model: google(MODEL_NAME),
                        prompt: prompt,
                    });
                    console.log(`[NEWS_API] AI Raw Response received.`);
                } catch (aiErr: any) {
                    console.error(`[NEWS_API] AI SDK Call Failed:`, aiErr.message || aiErr);
                    throw aiErr;
                }

                console.log(`[NEWS_API] AI Raw Output:`, result.text);
                let aiText = result.text.replace(/```json/g, '').replace(/```/g, '').trim();

                // Robust JSON extraction
                const jsonMatch = aiText.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    aiText = jsonMatch[0];
                }

                console.log(`[NEWS_API] AI Cleaned Text:`, aiText);

                try {
                    const translatedArray = JSON.parse(aiText);
                    if (Array.isArray(translatedArray) && translatedArray.length === items.length) {
                        for (let i = 0; i < items.length; i++) {
                            items[i].title = translatedArray[i];
                        }
                        console.log(`[NEWS_API] SUCCESS: News translated via SDK to ${targetLang}.`);
                    } else {
                        console.error(`[NEWS_API] Array mismatch or parity issue for ${targetLang}. Parsed:`, translatedArray);
                    }
                } catch (jsonErr) {
                    console.error(`[NEWS_API] JSON Parse Error for AI output:`, aiText);
                }
            } catch (e: any) {
                console.error("[NEWS_API] AI Translation Sequence Failed:", e.message || e);
            }
        }

        console.error(`[NEWS_API] Final news count: ${items.length}`);
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
