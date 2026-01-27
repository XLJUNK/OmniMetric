
const gatewaySlug = "omni-metric";
const apiKey = process.env.GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.0-flash";
const geminiUrl = `https://gateway.ai.vercel.com/v1/${gatewaySlug}/google/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

async function testFetch() {
    console.log("Starting fetch test to AI Gateway...");
    try {
        const res = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-vercel-ai-gateway-provider': 'google'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Translate 'Hello' to Japanese" }] }]
            })
        });
        console.log("Gateway Status:", res.status);
        const json = await res.json();
        console.log("Gateway Response:", JSON.stringify(json).slice(0, 100));
    } catch (e: any) {
        console.error("Gateway Fetch Error:", e.message);
    }
}

async function testGoogleDirect() {
    console.log("Starting DIRECT fetch test to Google...");
    const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
    try {
        const res = await fetch(directUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Translate 'Hello' to Japanese" }] }]
            })
        });
        console.log("Direct Status:", res.status);
        const json = await res.json();
        console.log("Direct Response:", JSON.stringify(json).slice(0, 100));
    } catch (e: any) {
        console.error("Direct Fetch Error:", e.message);
    }
}

async function runTests() {
    await testFetch();
    console.log("---");
    await testGoogleDirect();
}

runTests();
