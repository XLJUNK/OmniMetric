import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const auditPath = path.join(process.cwd(), '..', 'backend', 'archive', 'performance_audit.json');

        if (!fs.existsSync(auditPath)) {
            return NextResponse.json({ error: 'Audit data not found' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(auditPath, 'utf8');
        const data = JSON.parse(fileContent);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Audit API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
