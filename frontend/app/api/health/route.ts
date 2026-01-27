import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs';
import { successResponse, internalErrorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface HealthStatus {
    status: 'healthy' | 'warning' | 'critical' | 'error';
    message: string;
    dataAge?: number;
    lastUpdate?: string;
    timestamp: string;
}

export async function GET(request: NextRequest) {
    try {
        const filePath = path.join(process.cwd(), '../backend/current_signal.json');

        if (!fs.existsSync(filePath)) {
            return successResponse<HealthStatus>({
                status: 'error',
                message: 'Signal data file not found',
                timestamp: new Date().toISOString()
            });
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        // Check data freshness
        const lastUpdate = data.last_updated || data.last_successful_update;

        if (!lastUpdate) {
            return successResponse<HealthStatus>({
                status: 'warning',
                message: 'No timestamp found in signal data',
                timestamp: new Date().toISOString()
            });
        }

        // Calculate age in minutes
        const lastUpdateTime = new Date(lastUpdate).getTime();
        const now = new Date().getTime();
        const ageMinutes = Math.floor((now - lastUpdateTime) / 1000 / 60);

        let status: HealthStatus['status'];
        let message: string;

        if (ageMinutes < 60) {
            status = 'healthy';
            message = 'System operational';
        } else if (ageMinutes < 120) {
            status = 'warning';
            message = 'Data slightly stale';
        } else {
            status = 'critical';
            message = 'Data significantly outdated';
        }

        return successResponse<HealthStatus>({
            status,
            message,
            dataAge: ageMinutes,
            lastUpdate,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('[API /health] Error:', error);
        return internalErrorResponse('Health check failed');
    }
}
