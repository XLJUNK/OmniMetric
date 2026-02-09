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

/**
 * Edge-compatible data fetcher.
 * Exclusively uses 'fetch' to avoid any Node.js module leaks (fs, path).
 */
export async function getSignalData(): Promise<SignalData | null> {
    console.log("[getSignalData] Initializing Edge-Safe Fetch...");

    try {
        const rawUrl = 'https://raw.githubusercontent.com/XLJUNK/OmniMetric/main/backend/current_signal.json';
        const res = await fetch(rawUrl, {
            next: { revalidate: 60 },
            headers: { 'Cache-Control': 'no-cache' }
        });

        if (res.ok) {
            const data = await res.json();
            if (data && data.last_updated) {
                console.log("[getSignalData] Data successfully retrieved from GitHub Registry");
                return data;
            }
            console.warn("[getSignalData] Data format invalid or missing last_updated");
        } else {
            const errorBody = await res.text().catch(() => "N/A");
            console.warn(`[getSignalData] Registry fetch failed | Status: ${res.status} | Body Snippet: ${errorBody.substring(0, 100)}`);
        }
    } catch (error: unknown) {
        const err = error as Error;
        console.error("[getSignalData] Edge Fetch Critical Error:", {
            message: err.message,
            stack: err.stack
        });
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
