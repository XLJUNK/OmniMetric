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
                SLUG_found: !!SLUG,
                API_KEY_found: !!API_KEY
            }
        });
    }

    try {
        // Correct SDK Pattern with Gateway helper
        const result = await generateText({
            model: gateway('google:gemini-1.5-flash'),
            prompt: "Return exactly: 'GATEWAY_SUCCESS_VERIFIED_FINAL'",
            // Explicitly pass headers just in case the helper needs them
            headers: {
                'x-vercel-ai-gateway-provider': 'google',
            }
        });

        return NextResponse.json({
            status: "SUCCESS",
            result: result.text,
            gateway_slug: SLUG,
            method: "sdk_gateway_helper"
        });

    } catch (error: any) {
        return NextResponse.json({
            status: "FAILURE",
            error: error.message || String(error),
            details: error
        });
    }
}
