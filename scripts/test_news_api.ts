// Standalone News API Logic Test (No external deps)
const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = process.env.API_KEY;

async function testTranslation() {
    console.log("--- Testing News Translation Logic ---");
    console.log("Using Model:", MODEL_NAME);
    console.log("API Key Present:", !!API_KEY);

    if (!API_KEY) {
        console.error("Missing API_KEY env var. Usage: API_KEY=xyz npx tsx scripts/test_news_api.ts");
        return;
    }

    const testTitles = [
        "S&P 500 hits record high as tech rally continues",
        "Federal Reserve signals potential rate cuts in late 2026",
        "Oil prices surge amid Middle East tensions"
    ];

    const targetLang = "Japanese";
    const prompt = `You are a professional financial translator for a Bloomberg terminal.
    Translate the following US market news headlines into concise, institutional-grade ${targetLang}.
    Maintain the punchy, factual tone of financial news.
    Output ONLY a raw JSON array of strings matching the input order.
    Example Output: ["Translation 1", "Translation 2"]

    Input Headlines: ${JSON.stringify(testTitles)}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (response.ok) {
            const json = await response.json();
            let text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();

            console.log("Raw Response:", text);
            const parsed = JSON.parse(text);
            console.log("Parsed Array:", parsed);

            if (Array.isArray(parsed) && parsed.length === testTitles.length) {
                console.log("SUCCESS: Translation working correctly.");
            } else {
                console.error("FAILURE: Array length mismatch or not an array.");
            }
        } else {
            const err = await response.text();
            console.error("API Error Status:", response.status);
            console.error("API Error Response:", err);
        }
    } catch (e) {
        console.error("Request Failed:", e);
    }
}

testTranslation();
