import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables strictly before any SDK calls
const envPath = path.resolve(__dirname, '../../.env');
const backendEnvPath = path.resolve(__dirname, '../../backend/.env');

try {
    dotenv.config({ path: envPath });
    dotenv.config({ path: backendEnvPath });
} catch (e) {
    // Ignore dotenv errors in production if envs are already set
}

const getPrompt = () => {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error("Error: No prompt provided.");
        process.exit(1);
    }
    return args[0];
};

async function main() {
    const prompt = getPrompt();

    try {
        // STRICT: Official Vercel AI SDK Pattern for Gateway
        // slug and apiKey are automatically picked up from VERCEL_AI_GATEWAY_SLUG and AI_GATEWAY_API_KEY
        // However, we ensure they are present or fallback to direct provider
        const result = await generateText({
            model: gateway('google:gemini-1.5-flash'), // Pattern: 'provider:model'
            prompt: prompt,
            // Header for traceability
            headers: {
                'x-vercel-ai-gateway-provider': 'google',
            }
        });

        // Output ONLY the raw text for Python to capture
        console.log(JSON.stringify({ text: result.text }));

    } catch (error: any) {
        console.error("AI Generation Failed via Gateway:", error.message || error);
        // If Gateway fails, we still want to try the direct provider within the script if possible
        // but since Python has its own REST fallback, we exit to let Python handle it.
        process.exit(1);
    }
}

main();
