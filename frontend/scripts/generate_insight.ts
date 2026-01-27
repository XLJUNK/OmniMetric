import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { google } from '@ai-sdk/google';
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

// Map GEMINI_API_KEY to GOOGLE_GENERATIVE_AI_API_KEY for @ai-sdk/google
if (process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
}

const getPrompt = async () => {
    const args = process.argv.slice(2);
    if (args.length > 0) {
        return args[0];
    }
    // Read from stdin
    return new Promise<string>((resolve, reject) => {
        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', chunk => data += chunk);
        process.stdin.on('end', () => {
            if (!data.trim()) {
                console.error("Error: No prompt provided via args or stdin.");
                process.exit(1);
            }
            resolve(data);
        });
        process.stdin.on('error', reject);
    });
};

async function main() {
    // PHYSICAL GUARD: Prevent rapid consecutive calls (1 min cooldown)
    const guardFile = path.resolve(__dirname, '../../.ai_guard');
    const now = Date.now();
    try {
        if (fs.existsSync(guardFile)) {
            const lastRun = parseInt(fs.readFileSync(guardFile, 'utf8'));
            // Reduced to 5s to allow sequential GMS -> News execution
            if (now - lastRun < 5000) {
                console.error(`[AI GUARD] Rapid call detected. Cooling down... (${Math.round((5000 - (now - lastRun)) / 1000)}s remaining)`);
                process.exit(1);
            }
        }
        fs.writeFileSync(guardFile, now.toString());
    } catch (e) { }

    const prompt = await getPrompt();

    // DYNAMIC MODEL SELECTION
    // GMS Analysis (High Priority) -> gemini-3-flash
    // News Translation (Routine) -> gemini-2.5-flash
    const isNewsTask = /translator|Translate/i.test(prompt);
    // V4.6.1: Regressed all tasks to gemini-2.5-flash due to stability and rate limit optimization.
    const targetModel = 'google/gemini-2.0-flash';
    const taskName = isNewsTask ? 'NEWS_TRANSLATION' : 'GMS_ANALYSIS';

    let result;
    try {
        // TRIAL 1: Vercel AI Gateway (Universal V3)
        console.error(`[AI GATEWAY] [${taskName}] Trial 1: Using ${targetModel}...`);
        result = await generateText({
            model: gateway.languageModel(targetModel),
            prompt: prompt,
            headers: {
                'x-vercel-ai-gateway-cache': 'enable',
                'x-vercel-ai-gateway-cache-ttl': '3600',
            }
        });
        console.error(`[AI GATEWAY] Success: Logic completed.`);

    } catch (error: any) {
        const errorMsg = error.message || String(error);
        const isRateLimit = errorMsg.includes('429') || error.statusCode === 429;

        console.error(`[AI GATEWAY] FAILED (Task: ${taskName}, Error: ${errorMsg})`);

        if (isRateLimit) {
            console.error(`[AI GATEWAY] Trigger: 429 Rate Limit detected. Proceeding to Direct Fallback...`);
        }

        // TRIAL 2: Direct Google API Fallback (BYOK)
        // Benefit: Bypasses Gateway Quota, SSL issues, and Rate Limits
        console.error(`[AI DIRECT] Trial 2: Failing over to Google AI SDK (Direct)...`);
        try {
            result = await generateText({
                model: google(targetModel.replace('google/', '')),
                prompt: prompt
            });
            console.error(`[AI DIRECT] Success: Critical path secured via Direct API.`);
        } catch (directError: any) {
            console.error(`[AI FATAL] Both Gateway and Direct API failed: ${directError.message}`);
            process.exit(1);
        }
    }

    if (result) {
        // Output ONLY the raw text for Python to capture
        process.stdout.write(JSON.stringify({ text: result.text }) + '\n');
    }
}

main();
