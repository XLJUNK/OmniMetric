import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Optimize caching for this route
export const revalidate = 60;
export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        // VERCEL COMPLIANCE: Do not use exec('python').
        // Directly read the generated JSON file from the backend.
        // GitHub Actions or external workers are responsible for updating this file.

        const filePath = path.join(process.cwd(), '../backend/current_signal.json');

        if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContents);
            return NextResponse.json(data);
        } else {
            console.warn("Live data file missing, serving fallback structure.");
            // Return safe fallback structure with 200 OK
            return NextResponse.json({
                gms_score: 50,
                market_data: {},
                analysis: { content: "System Maintenance: Live data unavailable." },
                history_chart: [],
                last_updated: "Fallback Mode"
            });
        }

    } catch (error) {
        console.error("API Live Error:", error);
        // Ensure we never return 500, always 200 with error details or valid fallback
        return NextResponse.json({
            error: 'System Maintenance',
            details: 'Live data currently unavailable'
        }, { status: 200 });
    }
}
