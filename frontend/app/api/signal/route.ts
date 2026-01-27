import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs';
import { successResponse, internalErrorResponse, notFoundResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 900;

export async function GET(request: NextRequest) {
    try {
        // Attempt to locate current_signal.json in multiple possible paths
        const possiblePaths = [
            path.join(process.cwd(), 'data', 'current_signal.json'),
            path.join(process.cwd(), '../backend/current_signal.json'),
            path.join(process.cwd(), '../../backend/current_signal.json')
        ];

        let data = null;
        let foundPath = null;

        for (const filePath of possiblePaths) {
            if (fs.existsSync(filePath)) {
                const fileContents = fs.readFileSync(filePath, 'utf8');
                data = JSON.parse(fileContents);
                foundPath = filePath;
                break;
            }
        }

        if (!data) {
            console.error('[API /signal] current_signal.json not found in any expected location');
            return notFoundResponse('Signal data not available');
        }

        return successResponse(data, {
            cacheControl: 'public, s-maxage=900, stale-while-revalidate=1800'
        });

    } catch (error) {
        console.error('[API /signal] Error reading signal data:', error);
        return internalErrorResponse('Failed to load signal data');
    }
}
