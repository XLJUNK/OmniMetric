import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const scriptPath = path.resolve(process.cwd(), '../backend/fetch_live.py');

        // Wrap callback-based exec in a Promise to await it
        const data = await new Promise<any>((resolve, reject) => {
            exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
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

        return NextResponse.json(data);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
