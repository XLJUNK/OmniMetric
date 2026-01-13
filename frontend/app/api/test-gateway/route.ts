import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const SLUG = process.env.VERCEL_AI_GATEWAY_SLUG || process.env.AI_GATEWAY_SLUG;
    const API_KEY = process.env.AI_GATEWAY_API_KEY;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!SLUG || !API_KEY) {
        return NextResponse.json({
            status: "ERROR",
            message: "Environment variables missing in Vercel",
            debug: {
                SLUG_found: !!SLUG,
                API_KEY_found: !!API_KEY
            }
        });
    }

    // Direct REST Pattern for Vercel AI Gateway (Gemini)
    // https://gateway.ai.vercel.com/v1/public/{slug}/google/v1beta/models/{model}:generateContent
    const gatewayUrl = `https://gateway.ai.vercel.com/v1/public/${SLUG}/google/v1beta/models/gemini-1.5-flash:generateContent`;

    try {
        const response = await fetch(gatewayUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'x-vercel-ai-gateway-provider': 'google'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Return exactly: 'GATEWAY_RAW_FETCH_PASSED_200'" }]
                }],
                generationConfig: {
                    maxOutputTokens: 20
                }
            })
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({
                status: "SUCCESS",
                result: data.candidates?.[0]?.content?.parts?.[0]?.text || "No text returned",
                gateway_url: gatewayUrl,
                data: data
            });
        } else {
            return NextResponse.json({
                status: "FAILURE",
                error: "Gateway returned an error",
                status_code: response.status,
                details: data
            });
        }

    } catch (error: any) {
        return NextResponse.json({
            status: "EXCEPTION",
            error: error.message || String(error),
            stack: error.stack,
            cause: error.cause,
            url_attempted: gatewayUrl
        });
    }
}
