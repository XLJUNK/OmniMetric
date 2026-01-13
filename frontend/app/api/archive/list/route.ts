import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const archiveDir = path.join(process.cwd(), '..', 'backend', 'archive');

        if (!fs.existsSync(archiveDir)) {
            return NextResponse.json({ dates: [] });
        }

        const files = fs.readdirSync(archiveDir);
        const dates = files
            .filter(file => file.endsWith('.json') && !['summary.json', 'performance_audit.json'].includes(file))
            .map(file => file.replace('.json', ''))
            .sort((a, b) => b.localeCompare(a)); // Newest first

        return NextResponse.json({ dates });
    } catch (error) {
        console.error('Archive list error:', error);
        return NextResponse.json({ error: 'Failed to list archives' }, { status: 500 });
    }
}
