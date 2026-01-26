import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const API_KEY = process.env.AI_GATEWAY_API_KEY;

    if (!API_KEY) {
        return NextResponse.json({ status: "ERROR", message: "Env missing (AI_GATEWAY_API_KEY)" });
    }

    // Based on User's Model List: naming uses '/' and gemini-2.0-flash is available.
    const modelsToProbe = [
        'google/gemini-2.0-flash',
        'google/gemini-1.5-flash',
        'google:gemini-2.0-flash',
        'google:gemini-1.5-flash'
    ];

    const results: any[] = [];

    for (const m of modelsToProbe) {
        try {
            // We use the gateway helper. If passing a string with '/', 
            // the SDK might interpret it differently, so we try it.
            const { text } = await generateText({
                model: gateway(m as any),
                prompt: "Say 'GATEWAY_SUCCESS'",
            });
            results.push({ id: m, status: "SUCCESS", text });

            // If one succeeds, we can stop or just collect all
            if (text) {
                return NextResponse.json({
                    status: "SUCCESS_IDENTIFIED",
                    winner: m,
                    text: text
                });
            }
        } catch (e: any) {
            results.push({ id: m, status: "FAILURE", error: e.message || "404" });
        }
    }

    return NextResponse.json({
        status: "PROBE_V3_COMPLETE",
        results: results
    });
}
