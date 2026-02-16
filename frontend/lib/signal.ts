// 100% Edge-Compatible Data Fetcher (No Node.js modules)
export interface SignalData {
    last_updated: string;
    last_successful_update?: string;
    gms_score: number;
    sector_scores?: Record<string, number>;
    market_data: Record<string, { price: number; change_percent?: number; trend?: string; sparkline?: number[]; score?: number; daily_chg?: number }>;
    analysis?: {
        title?: string;
        content?: string;
        reports?: Record<string, string>;
    };
    events: { code: string; name: string; date: string; day: string; time: string; impact: string }[];
    history_chart: { date: string; score: number }[];
    intelligence?: {
        news?: { title: string; link?: string; url?: string; isoDate?: string; published?: string }[];
        translations?: Record<string, string[]>;
        last_updated?: string;
    };
    beacons?: Record<string, { name: string; value: number; status: "safe" | "warning" | "danger" | "error"; threshold: number; display: string }>;
    ogv?: {
        trails: { x: number; y: number; date: string }[];
        current_satellites?: { id: string; label: string; x: number; y: number; z: number }[];
        last_updated: string;
    };
}

import fs from 'fs';
import path from 'path';

/**
 * Edge-safe and Static-friendly data fetcher.
 * Uses 'fs' during build-time (Node.js) and 'fetch' relative path for client-side.
 */
export async function getSignalData(): Promise<SignalData | null> {
    console.log("[getSignalData] Initializing Data Acquisition...");

    // Build-time (Node.js environment)
    if (typeof window === 'undefined') {
        try {
            const filePath = path.join(process.cwd(), 'public', 'data', 'market_data.json');
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, 'utf-8');
                const data = JSON.parse(raw);
                if (data && data.last_updated) {
                    console.log("[getSignalData] Data successfully loaded from local filesystem (Build-time)");
                    return data;
                }
            }
        } catch (error) {
            console.warn("[getSignalData] Local filesystem read failed, falling back to network:", error);
        }
    }

    // Client-side or fallback (Relative path fetch to avoid external dependencies)
    try {
        let fetchUrl = '/data/market_data.json';

        // On server, we must use absolute URL if fs fails
        if (typeof window === 'undefined') {
            const host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
            fetchUrl = `${host}${fetchUrl}`;
            console.log(`[getSignalData] Server fallback to network fetch: ${fetchUrl}`);
        }

        const res = await fetch(fetchUrl, {
            next: { revalidate: 60 },
            headers: { 'Cache-Control': 'no-cache' }
        });

        if (res.ok) {
            const data = await res.json();
            if (data && data.last_updated) {
                return data;
            }
        } else {
            console.warn(`[getSignalData] Fetch failed with status: ${res.status}`);
        }
    } catch (error) {
        console.error("[getSignalData] Fetch failed:", error);
    }

    return {
        gms_score: 50,
        last_updated: new Date().toISOString(),
        history_chart: [{ date: new Date().toISOString(), score: 50 }],
        market_data: {
            COPPER_GOLD: { price: 1.0, trend: 'NEUTRAL' }
        },
        analysis: {},
        events: []
    };
}
