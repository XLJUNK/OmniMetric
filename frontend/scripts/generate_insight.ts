/* eslint-disable @typescript-eslint/no-unused-vars */
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

    // DEFINED MODEL PAIRS (User Specification)
    // Structure: { vercel: "google/...", direct: "..." }

    interface ModelPair {
        vercel: string;
        direct: string;
    }

    const GMS_MODELS: ModelPair[] = [
        { vercel: 'google/gemini-3-flash-preview', direct: 'gemini-3-flash-preview' },           // Priority 1
        { vercel: 'google/gemini-2.5-flash', direct: 'gemini-2.5-flash' },       // Priority 2
        { vercel: 'google/gemini-2.5-flash-lite', direct: 'gemini-2.5-flash-lite' } // Priority 3
    ];

    const NEWS_MODELS: ModelPair[] = [
        { vercel: 'google/gemini-2.5-flash-lite', direct: 'gemini-2.5-flash-lite' }, // Priority 1
        { vercel: 'google/gemini-2.5-flash', direct: 'gemini-2.5-flash-TTS' },       // Priority 2
        { vercel: 'google/gemini-3-flash', direct: 'gemini-2.5-flash' }              // Priority 3 (Standard Flash as Fallback)
    ];

    const isNewsTask = /translator|Translate/i.test(prompt);
    const candidates: ModelPair[] = isNewsTask ? NEWS_MODELS : GMS_MODELS;

    console.error(`[AI ROUTER] Task: ${isNewsTask ? 'NEWS_TRANSLATION' : 'GMS_ANALYSIS'}`);

    for (let i = 0; i < candidates.length; i++) {
        const pair = candidates[i];
        console.error(`[AI LOOP] Attempt ${i + 1}/${candidates.length}: Vercel=${pair.vercel} | Direct=${pair.direct}`);

        let result;
        try {
            // TRIAL 1: Vercel AI Gateway
            // console.error(`[AI GATEWAY] Trying ${pair.vercel}...`);
            result = await generateText({
                model: gateway.languageModel(pair.vercel),
                prompt: prompt,
                headers: {
                    'x-vercel-ai-gateway-cache': 'enable',
                    'x-vercel-ai-gateway-cache-ttl': '3600',
                }
            });
            console.error(`[AI GATEWAY] Success: ${pair.vercel} completed.`);

        } catch (error: any) {
            const errorMsg = error.message || String(error);
            console.error(`[AI GATEWAY] FAILED (${pair.vercel}): ${errorMsg}`);

            // TRIAL 2: Direct Google API Fallback
            console.error(`[AI DIRECT] Failing over to Google Native (${pair.direct})...`);
            try {
                // Determine model for google SDK
                // Note: google() SDK usually takes the model name without 'models/' prefix.
                result = await generateText({
                    model: google(pair.direct),
                    prompt: prompt
                });
                console.error(`[AI DIRECT] Success: ${pair.direct} secured via Direct API.`);
            } catch (directError: any) {
                console.error(`[AI DIRECT] FAILED (${pair.direct}): ${directError.message}`);

                if (i === candidates.length - 1) {
                    console.error(`[AI FATAL] All candidates failed.`);
                    process.exit(1);
                } else {
                    console.error(`[AI LOOP] Switching to next priority...`);
                    continue; // Next candidate
                }
            }
        }

        if (result) {
            // Output ONLY the raw text for Python to capture
            process.stdout.write(JSON.stringify({ text: result.text }) + '\n');
            return; // Exit main function successfully
        }
    }
}

main();
