// 100% Edge-Compatible Data Fetcher (No Node.js modules)
export interface SignalData {
    last_updated: string;
    last_successful_update?: string;
    gms_score: number;
    sector_scores?: Record<string, number>;
    market_data: any;
    analysis?: any;
    events: any[];
    history_chart: any[];
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
    } catch (error: any) {
        console.error("[getSignalData] Edge Fetch Critical Error:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
    }

    // Standard Fallback Data
    return {
        gms_score: 50,
        last_updated: new Date().toISOString(),
        history_chart: [{ score: 50 }],
        market_data: {
            COPPER_GOLD: { price: 1.0, trend: 'NEUTRAL' },
            COMMODITIES: { score: 50 }
        },
        analysis: {},
        events: []
    } as any;
}
