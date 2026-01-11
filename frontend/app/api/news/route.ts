import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface NewsItem {
    title: string;
    link: string;
}

// Configuration: Tiered Model Logic
// Primary: User Configured Flash (Speed)
// Secondary: Stable Flash Alias
// Tertiary: Proven Version
const FALLBACK_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];
const API_VERSION = "v1beta";

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
                // Determine API Key
                const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;

                // Determine Model List (Intelligence Tiering)
                // Use AI_MODEL_FLASH for translation tasks (Speed priority)
                const userModel = process.env.AI_MODEL_FLASH || process.env.NEXT_PUBLIC_GEMINI_MODEL;
                const modelsToTry = userModel ? [userModel, ...FALLBACK_MODELS] : FALLBACK_MODELS;

                // Deduplicate
                const uniqueModels = [...new Set(modelsToTry)];

                if (apiKey) {
                    const titles = items.map(i => i.title).join('\n');
                    const targetLang = lang === 'JP' ? 'Japanese' : (lang === 'CN' ? 'Simplified Chinese' : (lang === 'ES' ? 'Spanish' : 'English'));

                    const prompt = `Translate these financial headlines into professional, concise ${targetLang}. Keep the tone institutional. Return detailed translation line by line. No bullet points, just the text lines.\n\n${titles}`;

                    let translationSuccess = false;

                    // FAIL-SAFE WRAPPER
                    for (const model of uniqueModels) {
                        try {
                            const geminiUrl = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${model}:generateContent?key=${apiKey}`;

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

                                    // Verify integrity
                                    if (translatedLines.length === items.length) {
                                        for (let i = 0; i < items.length; i++) {
                                            items[i].title = translatedLines[i];
                                        }
                                        translationSuccess = true;
                                        break; // Success, exit loop
                                    }
                                }
                            } else {
                                console.warn(`Model ${model} failed: ${aiRes.status}`);
                            }
                        } catch (innerError) {
                            console.warn(`Model ${model} network error`, innerError);
                        }
                    }

                    if (!translationSuccess) {
                        console.error("All AI models failed to translate. Returning English.");
                    }
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
