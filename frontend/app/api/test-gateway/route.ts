import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    return NextResponse.json({
        status: "DEBUG",
        VERSION: "7609fe2_FIXED_LOGIC",
        SLUG: process.env.VERCEL_AI_GATEWAY_SLUG || process.env.AI_GATEWAY_SLUG || "MISSING",
        API_KEY_EXISTS: !!process.env.AI_GATEWAY_API_KEY,
        NEXT_RUNTIME: process.env.NEXT_RUNTIME || "nodejs"
    });
}
