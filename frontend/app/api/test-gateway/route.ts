import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const SLUG = process.env.VERCEL_AI_GATEWAY_SLUG || process.env.AI_GATEWAY_SLUG;
    const API_KEY = process.env.AI_GATEWAY_API_KEY;

    if (!SLUG || !API_KEY) {
        return NextResponse.json({ status: "ERROR", message: "Env missing" });
    }

    const modelsToProbe = [
        'google:gemini-1.5-flash',
        'google:models/gemini-1.5-flash',
        'google/gemini-1.5-flash',
        'google/models/gemini-1.5-flash',
        'gemini-1.5-flash'
    ];

    const results: any[] = [];

    for (const m of modelsToProbe) {
        try {
            const { text } = await generateText({
                model: gateway(m as any),
                prompt: "OK",
            });
            results.push({ id: m, status: "SUCCESS", text });
        } catch (e: any) {
            results.push({ id: m, status: "FAILURE", error: e.message || "404?" });
        }
    }

    return NextResponse.json({
        status: "PROBE_V2_COMPLETE",
        results: results,
        slug_used: SLUG
    });
}
