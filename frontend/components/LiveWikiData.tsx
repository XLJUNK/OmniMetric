'use client';

import React, { useEffect, useState } from 'react';
import { Activity, ArrowUp, ArrowDown, Zap } from 'lucide-react';

type MarketData = {
    metadata: {
        last_updated: string;
    };
    series: Record<string, {
        closes: { time: string; value: number }[];
        deviations: { time: string; value: number }[];
    }>;
};

type LiveDataProps = {
    slug: string;
    lang: string;
};

// Mapping Wiki Slugs to Market Tickers (Simple heuristic)
const TICKER_MAP: Record<string, string> = {
    // Macro
    'dxy': 'DXY',
    'us10y': 'US10Y',
    'vix': 'VIX',
    'move': 'MOVE',
    'oil': 'CL=F',
    'gold': 'GC=F',
    'bitcoin': 'BTC-USD',
    'sp500': 'SPX',
    'nasdaq': '^IXIC',
    'high-yield-spread': 'HYG', // Proxy
    'inflation': 'US10Y', // Proxy context
};

export const LiveWikiData = ({ slug, lang }: LiveDataProps) => {
    const [data, setData] = useState<MarketData | null>(null);
    const [gmsScore, setGmsScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel Fetch: Market Data & GMS Score
                const [marketRes, gmsRes] = await Promise.all([
                    fetch('/data/market_analysis.json'),
                    fetch('/data/current_signal.json')
                ]);

                if (marketRes.ok) {
                    const mJson = await marketRes.json();
                    setData(mJson);
                }
                if (gmsRes.ok) {
                    const gJson = await gmsRes.json();
                    setGmsScore(gJson.gms_score);
                }
            } catch (e) {
                console.error("Failed to load live wiki data", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Determine Ticker
    const ticker = TICKER_MAP[slug.toLowerCase()] || '';

    // 1. GMS Score Display (Universal Context)
    // 2. Ticker Specific Data (If mapped)

    if (loading) return <div className="h-24 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />;

    const seriesData = data?.series?.[ticker];
    const latestClose = seriesData?.closes?.[seriesData.closes.length - 1]?.value;
    const latestDev = seriesData?.deviations?.[seriesData.deviations.length - 1]?.value;

    const isPositive = (latestDev || 0) > 0;

    return (
        <div className="my-8 p-6 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
                <Activity className="w-4 h-4 text-emerald-500" />
                Live Market Analysis
                <span className="ml-auto text-[10px] text-slate-400 font-mono">
                    {data?.metadata?.last_updated ? new Date(data.metadata.last_updated).toLocaleTimeString() : 'LIVE'}
                </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. GMS Context */}
                <div className="flex items-center">
                    <div className="relative w-14 h-14 shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-full border-4 border-slate-200 dark:border-slate-800 mr-4">
                        <span className={`text-2xl font-black ${gmsScore && gmsScore > 60 ? 'text-emerald-500' : gmsScore && gmsScore < 40 ? 'text-red-500' : 'text-amber-500'}`}>
                            {gmsScore}
                        </span>
                    </div>
                    <div className="flex flex-col justify-center min-w-[180px]">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Current GMS Regime</div>
                        <div className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
                            {gmsScore && gmsScore > 60 ? 'Risk-On (Accumulate)' : gmsScore && gmsScore < 40 ? 'Risk-Off (Defensive)' : 'Neutral Balance'}
                        </div>
                    </div>
                </div>

                {/* 2. Specific Ticker Data (If Valid) */}
                {ticker && latestClose ? (
                    <div className="pl-0 md:pl-6 md:border-l border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                                {latestClose.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className={`flex items-center text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                                {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                {latestDev?.toFixed(2)}% (MTA)
                            </span>
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {ticker} deviation from 200-Day Trend
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start pl-0 md:pl-6 md:border-l border-slate-100 dark:border-slate-800">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 shrink-0" />
                        <span className="text-xs text-slate-400 leading-relaxed">
                            Real-time correlation data for this macro indicator is integrated into the master GMS Score.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
