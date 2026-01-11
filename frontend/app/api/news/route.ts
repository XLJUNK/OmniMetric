import { NextRequest, NextResponse } from 'next/server';

// 1. RE-ENABLE CACHING (1 Hour)
// This strictly caches the response for 1 hour to prevent API drain and rate limits.
export const revalidate = 3600;
export const dynamic = 'force-dynamic';

interface NewsItem {
    title: string;
    link: string;
}

const FALLBACK_MODELS = ["gemini-1.5-flash", "gemini-1.5-pro"];

// Helper: Exponential Backoff Sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'EN';

        // 1. Fetch CNBC Top News (English Source)
        // Using 'next: { revalidate: 3600 }' to align upstream fetch with route cache
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

        // 2. AI Translation if not English
        if (lang !== 'EN' && items.length > 0) {
            try {
                // REDUNDANT KEY CHECK
                const apiKey = process.env.GEMINI_API_KEY ||
                    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
                    process.env.GOOGLE_API_KEY ||
                    process.env.GEMINI_KEY;

                if (!apiKey) {
                    console.error("Translation Critical Error: API Key Missing.");
                    throw new Error("API Key Missing");
                }

                // Determine Model List
                const userModel = process.env.AI_MODEL_FLASH || process.env.NEXT_PUBLIC_GEMINI_MODEL;
                const modelsToTry = userModel ? [userModel, ...FALLBACK_MODELS] : FALLBACK_MODELS;
                const uniqueModels = [...new Set(modelsToTry)];

                const titles = items.map(i => i.title);
                const targetLang = lang === 'JP' ? 'Japanese' : (lang === 'CN' ? 'Simplified Chinese' : (lang === 'ES' ? 'Spanish' : 'English'));

                // BATCH JSON PROMPT
                const prompt = `Translate the following financial news headlines into ${targetLang}. 
                Return strictly a raw JSON array of strings, e.g., ["translated_title_1", "translated_title_2"].
                No markdown code blocks, no other text.
                
                Input: ${JSON.stringify(titles)}`;

                let translationSuccess = false;

                // FAIL-SAFE WRAPPER WITH RETRIES
                for (const model of uniqueModels) {
                    if (translationSuccess) break;

                    const isBeta = model.includes("exp") || model.includes("2.0") || model.includes("preview");
                    const apiVersion = isBeta ? "v1beta" : "v1";
                    const geminiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;

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

                                // Clean up markdown if AI adds it despite instructions
                                aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

                                try {
                                    const translatedArray = JSON.parse(aiText);
                                    if (Array.isArray(translatedArray) && translatedArray.length === items.length) {
                                        for (let i = 0; i < items.length; i++) {
                                            items[i].title = translatedArray[i];
                                        }
                                        translationSuccess = true;
                                        break; // Break retry loop
                                    } else {
                                        console.warn(`Translation Format Error [${model}]: Not an array or length mismatch.`);
                                    }
                                } catch (parseError) {
                                    console.warn(`Translation Parse Error [${model}]: Unable to parse JSON response.`);
                                }
                            } else if (aiRes.status === 429) {
                                console.warn(`Translation Rate Limited [${model}] (Attempt ${attempt + 1}/3). Waiting...`);
                                // Exponential Backoff: 1s, 2s, 4s
                                await sleep(1000 * Math.pow(2, attempt));
                                continue; // Retry
                            } else {
                                console.error(`Translation Error [${model}]: Status ${aiRes.status}`);
                                break; // Don't retry fatal 4xx/5xx errors on same model immediately
                            }
                        } catch (innerError) {
                            console.error(`Translation Network Error [${model}]:`, innerError);
                            break;
                        }
                    }
                }

                if (!translationSuccess) {
                    console.error("Translation Failed: All models/retries failed. Returning English fallback.");
                    // Fallback is implicit (original English items are returned)
                }

            } catch (translationError) {
                console.error("Translation Critical Failure:", translationError);
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
