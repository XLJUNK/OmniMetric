import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const SLUG = process.env.VERCEL_AI_GATEWAY_SLUG || process.env.AI_GATEWAY_SLUG;
    const API_KEY = process.env.AI_GATEWAY_API_KEY;

    if (!SLUG || !API_KEY) {
        return NextResponse.json({ status: "ERROR", message: "Env missing" });
    }

    const testResults: any = {};

    // Strategy: Try both lowercase and original SLUG (just in case)
    const slugsToTest = [SLUG.toLowerCase(), SLUG];

    for (const s of Array.from(new Set(slugsToTest))) {
        const url = `https://gateway.ai.vercel.com/v1/public/${s}/google/v1beta/models/gemini-1.5-flash:generateContent`;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'x-vercel-ai-gateway-provider': 'google'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Confirm connection." }] }],
                    generationConfig: { maxOutputTokens: 10 }
                })
            });

            const data = await res.json();
            testResults[s] = {
                status: res.status,
                ok: res.ok,
                data: data
            };

            if (res.ok) {
                return NextResponse.json({
                    status: "SUCCESS_IDENTIFIED",
                    winner: s,
                    results: testResults
                });
            }
        } catch (e: any) {
            testResults[s] = { error: e.message };
        }
    }

    return NextResponse.json({
        status: "FAILURE_PROBE",
        results: testResults,
        debug: {
            provided_slug: SLUG,
            key_exists: !!API_KEY
        }
    });
}
