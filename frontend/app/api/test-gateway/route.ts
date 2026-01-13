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
            message: "Environment variables missing in Vercel",
            debug: {
                VERCEL_AI_GATEWAY_SLUG_found: !!process.env.VERCEL_AI_GATEWAY_SLUG,
                AI_GATEWAY_SLUG_found: !!process.env.AI_GATEWAY_SLUG,
                AI_GATEWAY_API_KEY_found: !!process.env.AI_GATEWAY_API_KEY
            }
        });
    }

    try {
        const result = await generateText({
            model: gateway('google:gemini-1.5-flash'),
            prompt: "Return exactly: 'GATEWAY_UNIT_TEST_PASSED_200'",
        });

        return NextResponse.json({
            status: "SUCCESS",
            result: result.text,
            gateway_slug: SLUG,
            provider: "google:gemini-1.5-flash"
        });

    } catch (error: any) {
        return NextResponse.json({
            status: "FAILURE",
            error: error.message || error,
            details: error
        });
    }
}
