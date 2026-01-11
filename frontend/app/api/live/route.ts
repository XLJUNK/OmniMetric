import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// 2. ADD CACHE HEADERS (Optimization)
export const revalidate = 60;
export const dynamic = 'force-dynamic'; // Still needs to be dynamic to process the request, but revalidate hint helps downstream

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        // Attempt Live Fetch
        const scriptPath = path.resolve(process.cwd(), '../backend/fetch_live.py');

        // Wrap callback-based exec in a Promise to await it
        const data = await new Promise<any>((resolve, reject) => {
            // Timeout safety for the python script (e.g. 5 seconds max)
            const child = exec(`python "${scriptPath}"`, { timeout: 5000 }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject(new Error('Failed to fetch live data'));
                    return;
                }
                try {
                    const parsed = JSON.parse(stdout);
                    resolve(parsed);
                } catch (e) {
                    console.error("Parse error", e, stdout);
                    reject(new Error('Invalid data format'));
                }
            });
        });

        // Loophole: If python returns but keys are missing, we might want fallback?
        // For now, if we got JSON, we assume success.
        return NextResponse.json(data);

    } catch (error) {
        // 3. LOGGING FOR OWNER (Warn, don't Error in Vercel console logs if possible, to avoid alerts)
        console.warn("Live fetch failed, serving static fallback.", error);

        // 1. REWRITE /api/live/route.ts (Mandatory Fallback)
        try {
            const fallbackPath = path.join(process.cwd(), '../backend/current_signal.json');

            if (fs.existsSync(fallbackPath)) {
                const fileContents = fs.readFileSync(fallbackPath, 'utf8');
                const fallbackData = JSON.parse(fileContents);
                // Return 200 OK with fallback data
                return NextResponse.json(fallbackData);
            } else {
                console.error("Fallback file also missing!");
                // Absolute last resort: minimal valid structure to prevent frontend crash
                return NextResponse.json({
                    gms_score: 50,
                    market_data: {},
                    analysis: { content: "System Maintenance: Live data unavailable." },
                    history_chart: [],
                    last_updated: "Fallback Mode"
                });
            }
        } catch (fallbackError) {
            console.error("Critical Fallback Failure:", fallbackError);
            // Even here, try to return valid JSON with 200 if possible, but 500 is unavoidable if we can't speak JSON
            return NextResponse.json({
                error: 'System Maintenance',
                details: 'Both live and fallback sources unavailable'
            }, { status: 200 }); // Still return 200 to keep error rate low? User said "never return 500". 
            // But if it's empty, Dashboard handles it.
        }
    }
}
