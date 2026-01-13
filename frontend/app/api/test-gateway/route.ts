import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const SLUG = process.env.VERCEL_AI_GATEWAY_SLUG || process.env.AI_GATEWAY_SLUG;
    const API_KEY = process.env.AI_GATEWAY_API_KEY;

    if (!SLUG || !API_KEY) {
        return NextResponse.json({
            status: "ERROR",
            message: "Environment variables missing"
        });
    }

    const modelsToTest = [
        'google:gemini-1.5-flash',
        'google:gemini-1.5-flash-latest',
        'google:models/gemini-1.5-flash',
        'google:gemini-1.0-pro'
    ];

    const results: any[] = [];

    for (const modelId of modelsToTest) {
        try {
            console.log(`Probing model: ${modelId}`);
            const { text } = await generateText({
                model: gateway(modelId as any),
                prompt: "Say 'OK'",
                headers: {
                    'x-vercel-ai-gateway-provider': 'google',
                }
            });
            results.push({ modelId, status: "SUCCESS", response: text });
        } catch (error: any) {
            results.push({
                modelId,
                status: "FAILURE",
                message: error.message || "Unknown error",
                type: error.type || "N/A"
            });
        }
    }

    return NextResponse.json({
        status: "PROBE_COMPLETE",
        results: results,
        gateway_slug: SLUG
    });
}
