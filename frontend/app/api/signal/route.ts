import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 900; // 15 minutes revalidation at Edge level

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        // More robust path resolution: check various positions for backend data
        const possiblePaths = [
            path.join(process.cwd(), 'backend', 'current_signal.json'), // Root execution
            path.join(process.cwd(), '../backend', 'current_signal.json'), // frontend/ execution
            path.join(process.cwd(), 'current_signal.json'), // flat structure
        ];

        let filePath = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                filePath = p;
                break;
            }
        }

        if (!filePath) {
            console.error("Signal file not found. Checked:", possiblePaths);
            return NextResponse.json({ error: 'Signal not yet generated' }, { status: 404 });
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        // Optimized Cache-Control: Browser and Edge cache for 15 mins
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, max-age=900, s-maxage=900, stale-while-revalidate=600',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
