'use client';

import React, { useEffect, useState } from 'react';
import MarketChart from '@/components/analysis/MarketChart';
import { TVPartnerCard } from '@/components/TVPartnerCard';
import { useTheme } from '@/components/ThemeProvider';
// import Link from 'next/link';

// Types matching JSON structure
type Instrument = "DXY" | "US10Y" | "SPX"; // Using keys from JSON
type Timeframe = "1h" | "4h";

interface AnalysisData {
    [symbol: string]: {
        [tf: string]: any[]; // MarketData[]
    }
}

export default function MarketAnalysisPage() {
    const { theme } = useTheme();
    const [data, setData] = useState<AnalysisData | null>(null);
    const [selectedSymbol, setSelectedSymbol] = useState<Instrument>("DXY");
    const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>("4h");
    const [indicators, setIndicators] = useState({
        bb: false,
        sma: true,
        rsi: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data
        fetch('/data/market_analysis.json')
            .then(res => {
                if (!res.ok) throw new Error("Failed to load data");
                return res.json();
            })
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const currentData = data?.[selectedSymbol]?.[selectedTimeframe] || [];

    // Get latest data point for display
    const latest = currentData.length > 0 ? currentData[currentData.length - 1] : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 font-sans transition-colors duration-300">
            <header className="mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-emerald-700 dark:from-blue-400 dark:to-emerald-400 flex items-center gap-3 tracking-tight">
                    Market Analysis <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-bold shadow-sm">BETA</span>
                </h1>
                <p className="text-slate-700 dark:text-slate-400 text-sm mt-2 font-medium">
                    Professional-grade technical indicators for macro assets.
                </p>
            </header>

            {/* Unified Toolbar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-6 md:items-center justify-between shadow-sm transition-colors duration-300">

                {/* Left Group: Selectors */}
                <div className="flex flex-col sm:flex-row gap-6 sm:items-center w-full md:w-auto">

                    {/* Symbols (Blue Theme) */}
                    <div className="flex gap-2">
                        {(["DXY", "US10Y", "SPX"] as Instrument[]).map(sym => (
                            <button
                                key={sym}
                                onClick={() => setSelectedSymbol(sym)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${selectedSymbol === sym
                                    ? '!bg-blue-600 !text-white ring-1 ring-blue-400 shadow-blue-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                {sym}
                            </button>
                        ))}
                    </div>

                    {/* Timeframes (Emerald Theme) */}
                    <div className="flex gap-2">
                        {(["1h", "4h"] as Timeframe[]).map(tf => (
                            <button
                                key={tf}
                                onClick={() => setSelectedTimeframe(tf)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${selectedTimeframe === tf
                                    ? '!bg-emerald-600 !text-white ring-1 ring-emerald-400 shadow-emerald-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Group: Indicators (Violet Theme) */}
                <div className="flex flex-wrap gap-2 items-center justify-end w-full md:w-auto">
                    <button
                        onClick={() => setIndicators({ ...indicators, bb: !indicators.bb })}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-2 ${indicators.bb
                            ? '!bg-violet-600 !text-white ring-1 ring-violet-400 shadow-violet-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        Bollinger {indicators.bb && <span className="text-white">✓</span>}
                    </button>
                    <button
                        onClick={() => setIndicators({ ...indicators, sma: !indicators.sma })}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-2 ${indicators.sma
                            ? '!bg-violet-600 !text-white ring-1 ring-violet-400 shadow-violet-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        MA(200,25) {indicators.sma && <span className="text-white">✓</span>}
                    </button>
                    <button
                        onClick={() => setIndicators({ ...indicators, rsi: !indicators.rsi })}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-2 ${indicators.rsi
                            ? '!bg-violet-600 !text-white ring-1 ring-violet-400 shadow-violet-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        RSI(14) {indicators.rsi && <span className="text-white">✓</span>}
                    </button>
                </div>
            </div>

            <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Chart Container */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden relative group transition-colors duration-300">
                        {/* Header Overlay */}
                        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 pointer-events-none">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 drop-shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-[2px] px-3 py-1.5 rounded shadow-sm border border-slate-200/50 dark:border-slate-800/50">
                                {selectedSymbol} <span className="text-slate-500 dark:text-slate-400 font-normal text-sm">/ {selectedTimeframe}</span>
                            </h2>
                        </div>

                        {/* Price Overlay */}
                        {latest && (
                            <div className="absolute top-4 right-4 z-10 text-right pointer-events-none">
                                <div className={`text-xl font-mono font-bold drop-shadow-sm dark:drop-shadow-md ${latest.close >= latest.open ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                                    {latest.close.toFixed(2)}
                                </div>
                            </div>
                        )}

                        <div className="p-0">
                            {loading ? (
                                <div className="h-[280px] flex items-center justify-center text-slate-400 dark:text-slate-500 animate-pulse">
                                    Loading Market Data...
                                </div>
                            ) : (
                                <MarketChart
                                    data={currentData}
                                    visibleIndicators={indicators}
                                    colors={{
                                        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', // slate-900 vs white
                                        textColor: theme === 'dark' ? '#64748b' : '#334155' // slate-500 vs slate-700
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Ad Only */}
                <div className="space-y-6">
                    <TVPartnerCard lang="JP" variant="sidebar" />

                    <div className="text-[10px] text-slate-500 dark:text-slate-700 text-center">
                        <p>Market data is delayed/simulated for testing.</p>
                        <p>Timeframes: 1h, 4h only.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
