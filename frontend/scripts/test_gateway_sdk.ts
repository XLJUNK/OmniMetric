import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
const envPath = path.resolve(__dirname, '../../.env');
const backendEnvPath = path.resolve(__dirname, '../../backend/.env');
dotenv.config({ path: envPath });
dotenv.config({ path: backendEnvPath });

async function main() {
    console.log("=== AI SDK Universal Gateway Verification ===");

    // In @ai-sdk/gateway, the gateway function wraps a model.
    // It usually uses VERCEL_AI_GATEWAY_SLUG environment variable.

    const modelId = 'google/gemini-2.0-flash';
    console.log(`Testing model: ${modelId} via gateway()`);

    try {
        // We log the configuration mechanism if possible.
        // The gateway function returns a LanguageModel.
        const model = gateway(modelId as any);

        console.log("Model initialized with gateway().");

        const result = await generateText({
            model: model,
            prompt: "Is the gateway working? Respond with YES or NO and why.",
        });

        console.log("Result Text:", result.text);

        // Check if there are any interesting headers in the response if the provider exposes them
        // Actually generateText doesn't easily expose raw headers unless we use lower level calls

    } catch (error: any) {
        console.error("FAILED Level 3 Test:");
        console.error("Message:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Headers:", JSON.stringify(error.response.headers, null, 2));
        }
    }
}

main();
