import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

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
        // Use the Google provider but point it at the Vercel AI Gateway URL
        const google = createGoogleGenerativeAI({
            baseURL: `https://gateway.ai.vercel.com/v1/public/${SLUG}/google/v1beta`,
            apiKey: API_KEY, // The AI Gateway uses its own API key for Auth
        });

        const result = await generateText({
            model: google('gemini-1.5-flash'),
            prompt: "Return exactly: 'GATEWAY_SUCCESS_VERIFIED_200'",
        });

        return NextResponse.json({
            status: "SUCCESS",
            result: result.text,
            gateway_slug: SLUG,
            method: "custom_base_url"
        });

    } catch (error: any) {
        return NextResponse.json({
            status: "FAILURE",
            error: error.message || String(error),
            details: error
        });
    }
}
