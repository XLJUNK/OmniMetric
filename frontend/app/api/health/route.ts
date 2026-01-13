import { NextResponse } from 'next/server';
export async function GET() {
    return NextResponse.json({ status: "alive_v1913" });
}
