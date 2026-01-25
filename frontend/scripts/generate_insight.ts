import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import * as fs from 'fs';
import * as path from 'path';

async function getPrompt(): Promise<string> {
    const stdinBuffer: Buffer[] = [];

    for await (const chunk of process.stdin) {
        stdinBuffer.push(chunk);
    }

    return Buffer.concat(stdinBuffer).toString('utf-8');
}

async function main() {
    // Cool-down Guard (Prevent spam)
    const guardFile = path.join(process.cwd(), '.ai_guard');
    try {
        if (fs.existsSync(guardFile)) {
            const lastRun = parseInt(fs.readFileSync(guardFile, 'utf-8'));
            const now = Date.now();
            const elapsed = now - lastRun;
            const cooldown = 30 * 60 * 1000; // 30 min

            if (elapsed < cooldown) {
                const remaining = Math.ceil((cooldown - elapsed) / 60000);
                console.error(`[GUARD] Cool-down active. ${remaining} min remaining.`);
                process.exit(0);
            }
        }
        fs.writeFileSync(guardFile, Date.now().toString());
    } catch (e) { }

    const prompt = await getPrompt();

    const gatewaySlug = process.env.VERCEL_AI_GATEWAY_SLUG || 'xljunk';
    const geminiKey = process.env.GEMINI_API_KEY || '';

    if (!geminiKey) {
        console.error('[AI] CRITICAL: GEMINI_API_KEY not found in environment');
        process.exit(1);
    }

    // EMERGENCY FAILOVER: Try Gateway first, then fallback to direct API
    let result: any = null;
    let lastError: any = null;

    // Attempt 1: Vercel AI Gateway
    try {
        console.error(`[AI] Attempt 1: Vercel AI Gateway (${gatewaySlug})...`);

        const google = createGoogleGenerativeAI({
            apiKey: geminiKey,
            baseURL: `https://gateway.vercel.ai/with-gateway/${gatewaySlug}/google`,
        });

        result = await generateText({
            model: google('gemini-3-flash'),
            prompt: prompt,
            headers: {
                'x-vercel-ai-gateway-provider': 'google',
                'x-vercel-ai-gateway-cache': 'enable',
                'x-vercel-ai-gateway-cache-ttl': '3600',
                'x-vercel-ai-gateway-slug': gatewaySlug,
            }
        });

        console.error(`[AI] ✓ Gateway Success`);
    } catch (error: any) {
        lastError = error;
        const statusCode = error?.response?.status || error?.statusCode || 'UNKNOWN';
        const url = error?.config?.url || `gateway.vercel.ai/with-gateway/${gatewaySlug}`;
        console.error(`[AI] ✗ Gateway Failed: URL=${url}, Status=${statusCode}, Error=${error.message || error}`);
    }

    // Attempt 2: Direct Google API Fallback
    if (!result) {
        try {
            console.error(`[AI] Attempt 2: Direct Google API Fallback...`);

            const googleDirect = createGoogleGenerativeAI({
                apiKey: geminiKey,
                // Use default baseURL (generativelanguage.googleapis.com)
            });

            result = await generateText({
                model: googleDirect('gemini-1.5-flash-latest'),
                prompt: prompt,
            });

            console.error(`[AI] ✓ Direct API Success`);
        } catch (error: any) {
            const statusCode = error?.response?.status || error?.statusCode || 'UNKNOWN';
            const url = error?.config?.url || 'generativelanguage.googleapis.com';
            console.error(`[AI] ✗ Direct API Failed: URL=${url}, Status=${statusCode}, Error=${error.message || error}`);
            console.error(`[AI] CRITICAL: All AI endpoints failed. Last Gateway Error:`, lastError?.message || lastError);
            process.exit(1);
        }
    }

    // Output ONLY the raw text for Python to capture
    if (result && result.text) {
        process.stdout.write(JSON.stringify({ text: result.text }) + '\n');
    } else {
        console.error(`[AI] CRITICAL: No text generated despite success flag.`);
        process.exit(1);
    }
}

main();
