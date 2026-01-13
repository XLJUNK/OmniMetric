'use client';

import { useState, useEffect } from 'react';

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

export const useSignalData = () => {
    const [data, setData] = useState<SignalData | null>(null);
    const [liveData, setLiveData] = useState<any>(null);
    const [isSafeMode, setIsSafeMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/signal`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (e) {
                console.error("Signal Fetch Error:", e);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchLive = async () => {
            try {
                const res = await fetch('/api/live');
                if (res.ok) {
                    const json = await res.json();
                    setLiveData(json);
                }
            } catch (e) { }
        };
        fetchLive();
        const interval = setInterval(fetchLive, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!data || !data.last_successful_update) return;
        const checkHealth = () => {
            if (!data.last_successful_update) return;
            // Parse ISO-8601 (handles T and Z correctly)
            const lastUpdate = new Date(data.last_successful_update);
            const diffMin = (new Date().getTime() - lastUpdate.getTime()) / 60000;
            setIsSafeMode(diffMin > 25); // Increased tolerance to 25m to avoid flickers on 15m cycle
        };
        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, [data]);

    return { data, liveData, isSafeMode };
};
