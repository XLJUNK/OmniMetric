'use client';

import useSWR from 'swr';
import { SignalData } from '@/lib/signal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useSignalData = (initialData?: SignalData | null) => {
    const { data, error, isLoading } = useSWR<SignalData>(
        '/data/market_data.json',
        fetcher,
        {
            refreshInterval: 60000,
            fallbackData: initialData || undefined,
            revalidateOnFocus: false, // Static data, focus revalidation not critical
            dedupingInterval: 5000
        }
    );

    // Legacy support for safe mode, can be derived from data age if needed
    // For static site, we assume data is generated regularly
    const isSafeMode = false;

    return {
        data: data || null,
        liveData: null, // Merged into main data in static architecture
        isSafeMode,
        isLoading,
        error
    };
};

export type { SignalData };

