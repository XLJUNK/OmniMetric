import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET(): Promise<NextResponse> {
    return new Promise<NextResponse>((resolve) => {
        // Path to python script
        // Assuming we are in frontend/app/api/live/route.ts
        // backend is at ../../../../backend
        const scriptPath = path.resolve(process.cwd(), '../backend/fetch_live.py');

        exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                resolve(NextResponse.json({ error: 'Failed to fetch live data' }, { status: 500 }));
                return;
            }
            try {
                const data = JSON.parse(stdout);
                resolve(NextResponse.json(data));
            } catch (e) {
                console.error("Parse error", e, stdout);
                resolve(NextResponse.json({ error: 'Invalid data format' }, { status: 500 }));
            }
        });
    });
}

// Disable caching for live data
export const dynamic = 'force-dynamic';
