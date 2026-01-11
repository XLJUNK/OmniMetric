import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<any> }
): Promise<NextResponse> {
    try {
        const { date } = await params;

        const historyDir = path.join(process.cwd(), '..', 'backend', 'history');
        let archiveFile = path.join(historyDir, `${date}.json`);

        // MANDATORY FALLBACK: If specific date missing, find nearest
        if (!fs.existsSync(archiveFile)) {
            const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json')).sort();
            if (files.length === 0) {
                return NextResponse.json({ error: 'Archive not found' }, { status: 404 });
            }
            // Find closest date (using a simple alphabetical search since format is YYYY-MM-DD)
            const target = `${date}.json`;
            let bestMatch = files[0];
            for (const f of files) {
                if (f <= target) bestMatch = f;
                else break;
            }
            archiveFile = path.join(historyDir, bestMatch);
        }

        const data = fs.readFileSync(archiveFile, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        console.error('Archive fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch archive' }, { status: 500 });
    }
}
