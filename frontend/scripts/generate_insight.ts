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

    const gatewaySlug = process.env.VERCEL_AI_GATEWAY_SLUG || 'xljunk'; // Specific target validation
    const gatewayApiKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_AI_GATEWAY_API_KEY;

    if (!gatewayApiKey) {
        console.warn("[WARN] AI_GATEWAY_API_KEY seems missing. Gateway might reject the request.");
    }

    try {
        const result = await generateText({
            model: gateway.languageModel('google/gemini-3-flash'),
            prompt: prompt,
            headers: {
                'x-vercel-ai-gateway-provider': 'google',
                'x-vercel-ai-gateway-cache': 'enable',
                'x-vercel-ai-gateway-cache-ttl': '3600',
                // Explicitly asserting the slug and key for physical trace
                'x-vercel-ai-gateway-slug': gatewaySlug,
                ...(gatewayApiKey ? { 'Authorization': `Bearer ${gatewayApiKey}` } : {})
            }
        });

        // Output ONLY the raw text for Python to capture
        process.stdout.write(JSON.stringify({ text: result.text }) + '\n');

    } catch (error: any) {
        console.error("AI Generation Failed via Gateway:", error.message || error);
        process.exit(1);
    }
}

main();
