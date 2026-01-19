import fs from 'fs';
import path from 'path';

// Define the SignalData interface matching the JSON structure
export interface SignalData {
    last_updated: string;
    last_successful_update?: string;
    gms_score: number;
    sector_scores?: Record<string, number>;
    market_data: any;
    analysis: any;
    events: any[];
    history_chart: any[];
}

export function getSignalData(): SignalData | null {
    try {
        // More robust path resolution: check various positions for backend data
        const possiblePaths = [
            path.join(process.cwd(), 'backend', 'current_signal.json'), // Root execution
            path.join(process.cwd(), '../backend', 'current_signal.json'), // frontend/ execution
            path.join(process.cwd(), 'current_signal.json'), // flat structure
            // Vercel deployment structure often puts static assets in public or specific output dirs
            // But usually filesystem reads in Server Components work with process.cwd() if configured correctly.
            // Fallback for Vercel if needed:
            path.join(process.cwd(), 'public', 'data', 'current_signal.json')
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
            return null;
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("getSignalData Error:", error);
        return null;
    }
}
