import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
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
    // PHYSICAL GUARD: Prevent rapid consecutive calls (1 min cooldown)
    const guardFile = path.resolve(__dirname, '../../.ai_guard');
    const now = Date.now();
    try {
        if (fs.existsSync(guardFile)) {
            const lastRun = parseInt(fs.readFileSync(guardFile, 'utf8'));
            if (now - lastRun < 60000) {
                console.warn(`[AI GUARD] Rapid call detected. Cooling down... (${Math.round((60000 - (now - lastRun)) / 1000)}s remaining)`);
                process.exit(1);
            }
        }
        fs.writeFileSync(guardFile, now.toString());
    } catch (e) { }

    const prompt = getPrompt();

    try {
        // STRICT: Reverting to v2.1.0 Stable Pattern (Verified for Gemini 2.0)
        const result = await generateText({
            model: gateway('google/gemini-2.0-flash'),
            prompt: prompt,
            headers: {
                'x-vercel-ai-gateway-provider': 'google',
            }
        });

        // Output ONLY the raw text for Python to capture
        console.log(JSON.stringify({ text: result.text }));

    } catch (error: any) {
        console.error("AI Generation Failed via Gateway:", error.message || error);
        process.exit(1);
    }
}

main();
