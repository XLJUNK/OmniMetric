"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ai_1 = require("ai");
const gateway_1 = require("@ai-sdk/gateway");
async function main() {
    const prompt = process.argv[2] || "test";
    console.log("DEBUG: Starting with prompt", prompt);
    console.log("DEBUG: Keys present?", {
        slug: !!process.env.VERCEL_AI_GATEWAY_SLUG,
        gateway: !!process.env.AI_GATEWAY_API_KEY,
        gemini: !!process.env.GEMINI_API_KEY
    });
    try {
        console.log("DEBUG: Calling generateText");
        const result = await (0, ai_1.generateText)({
            model: (0, gateway_1.gateway)('google/gemini-2.0-flash'),
            prompt: prompt,
        });
        console.log(JSON.stringify({ text: result.text }));
    }
    catch (error) {
        console.error("AI Generation Failed:", error);
        process.exit(1);
    }
}
main();
