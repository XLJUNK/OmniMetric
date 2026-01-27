'use client';

import { useState, useEffect } from 'react';

import { SignalData } from '@/lib/signal';
export type { SignalData };

export const useSignalData = (initialData?: SignalData | null) => {
    const [data, setData] = useState<SignalData | null>(initialData || null);
    const [liveData, setLiveData] = useState<any>(null);
    const [isSafeMode, setIsSafeMode] = useState(false);
    const [errorCount, setErrorCount] = useState(0);

    // Primary Signal Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            try {
                // Timeout to prevent hanging UI
                const res = await fetch(`/api/signal`, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                    setErrorCount(0);
                } else {
                    setErrorCount(prev => prev + 1);
                }
            } catch (e) {
                clearTimeout(timeoutId);
                console.error("Signal Fetch Error:", e);
                setErrorCount(prev => prev + 1);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    // Live Feed Fetching
    useEffect(() => {
        const fetchLive = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            try {
                const res = await fetch('/api/live', { signal: controller.signal });
                clearTimeout(timeoutId);
                if (res.ok) {
                    const json = await res.json();
                    setLiveData(json);
                }
            } catch (e) {
                clearTimeout(timeoutId);
            }
        };
        fetchLive();
        const interval = setInterval(fetchLive, 30000);
        return () => clearInterval(interval);
    }, []);

    // Health Monitoring (Safe Mode trigger)
    useEffect(() => {
        if (!data) return;
        const checkHealth = () => {
            if (!data.last_successful_update) return;
            const lastUpdate = new Date(data.last_successful_update);
            const diffMin = (new Date().getTime() - lastUpdate.getTime()) / 60000;
            // Trigger Safe Mode if data is >45m old OR we hit multiple fetch failures
            setIsSafeMode(diffMin > 45 || errorCount >= 3);
        };
        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, [data, errorCount]);

    return { data, liveData, isSafeMode };
};
