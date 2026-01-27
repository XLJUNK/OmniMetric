import { generateText } from 'ai';
import { createGateway } from '@ai-sdk/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
const envPath = path.resolve(__dirname, '../../.env');
const backendEnvPath = path.resolve(__dirname, '../../backend/.env');
dotenv.config({ path: envPath });
dotenv.config({ path: backendEnvPath });

async function main() {
    console.log("=== AI SDK Gateway Slug Verification ===");
    const slug = process.env.VERCEL_AI_GATEWAY_SLUG || 'xljunk';
    const apiKey = process.env.AI_GATEWAY_API_KEY;
    const providerKey = process.env.GEMINI_API_KEY;

    // Attempting to use the slug-based baseURL
    // The product URL is usually https://gateway.vercel.ai/with-gateway/<slug>
    const customBaseURL = `https://gateway.vercel.ai/with-gateway/${slug}`;

    console.log("Custom BaseURL:", customBaseURL);

    try {
        const myGateway = createGateway({
            baseURL: customBaseURL,
            apiKey: apiKey
        });

        const modelId = 'google/gemini-2.0-flash';

        console.log(`Testing with custom gateway...`);

        // When using a custom baseURL, we might need to be careful about the path appending.
        // The SDK usually appends /v1/ai or similar? No, the d.ts says default is https://ai-gateway.vercel.sh/v1/ai

        const result = await generateText({
            model: myGateway(modelId as any),
            prompt: "Hi, if you see this, the slug-based gateway is working.",
        });

        console.log("SUCCESS! Response:", result.text);

    } catch (error: any) {
        console.error("FAILED with custom baseURL:");
        console.error("Message:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            // console.error("Headers:", JSON.stringify(error.response.headers, null, 2));
        }
    }
}

main();
