import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
const envPath = path.resolve(__dirname, '../../.env');
const backendEnvPath = path.resolve(__dirname, '../../backend/.env');
dotenv.config({ path: envPath });
dotenv.config({ path: backendEnvPath });

// Monkeypatch fetch
const originalFetch = global.fetch;
global.fetch = function (...args: any[]) {
    console.log("FETCH URL:", args[0]);
    if (args[1] && args[1].headers) {
        console.log("FETCH HEADERS:", JSON.stringify(args[1].headers, null, 2));
    }
    if (args[1] && args[1].body) {
        console.log("FETCH BODY:", args[1].body);
    }
    return originalFetch.apply(globalThis, args as any);
} as any;

async function main() {
    console.log("=== AI SDK Gateway URL Inspection ===");

    const modelId = 'google/gemini-2.0-flash';

    try {
        const model = gateway(modelId as any);

        await generateText({
            model: model,
            prompt: "Hi",
        });

    } catch (error: any) {
        console.error("FAILED inspection:", error.message);
    }
}

main();
