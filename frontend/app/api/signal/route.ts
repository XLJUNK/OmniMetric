import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const filePath = path.join(process.cwd(), '../backend/current_signal.json');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Signal not yet generated' }, { status: 404 });
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        return NextResponse.json(data);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
