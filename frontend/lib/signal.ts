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

export async function getSignalData(): Promise<SignalData | null> {
    // Strategy 1: Real-time Fetch from GitHub Raw (Bypasses Vercel Build Staleness)
    // This ensures that as soon as the Action commits, the site can reflect it (after partial cache expiry).
    try {
        const rawUrl = 'https://raw.githubusercontent.com/XLJUNK/OmniMetric/main/backend/current_signal.json';
        // Using "no-store" to ensure we always get the latest from GitHub's CDN (which has its own short TTL)
        // Or using revalidate for ISR.
        const res = await fetch(rawUrl, { next: { revalidate: 60 } });
        if (res.ok) {
            const data = await res.json();
            // Basic validation
            if (data && data.last_updated) return data;
        }
    } catch (error) {
        console.warn("Real-time fetch failed, falling back to FS:", error);
    }

    // Strategy 2: Local Filesystem (Fallback / Local Dev)
    try {
        // More robust path resolution: check various positions for backend data
        const possiblePaths = [
            path.join(process.cwd(), 'public', 'data', 'current_signal.json'), // New Synced Location
            path.join(process.cwd(), 'backend', 'current_signal.json'), // Root execution
            path.join(process.cwd(), '../backend', 'current_signal.json'), // frontend/ execution
            path.join(process.cwd(), 'current_signal.json') // flat structure
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
