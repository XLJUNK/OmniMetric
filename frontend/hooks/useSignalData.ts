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
            const lastUpdate = new Date(data.last_successful_update.replace(' ', 'T'));
            const diffMin = (new Date().getTime() - lastUpdate.getTime()) / 60000;
            setIsSafeMode(diffMin > 20); // Tolerance for 15m cycle + buffer
        };
        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, [data]);

    return { data, liveData, isSafeMode };
};
