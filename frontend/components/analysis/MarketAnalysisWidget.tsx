'use client';

import React, { useEffect, useState } from 'react';
import MarketChart from '@/components/analysis/MarketChart';
import { useTheme } from '@/components/ThemeProvider';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { ExplanationModal } from '@/components/ExplanationModal';

// Types matching JSON structure
type Instrument = "DXY" | "US10Y" | "SPX";
type Timeframe = "1h" | "4h";

interface MarketDataPoint {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    // Add other fields as needed
}

interface AnalysisData {
    [symbol: string]: {
        [tf: string]: MarketDataPoint[];
    }
}

interface MarketAnalysisWidgetProps {
    lang: LangType;
}

export const MarketAnalysisWidget = ({ lang, onOpenInfo }: MarketAnalysisWidgetProps & { onOpenInfo?: () => void }) => {
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
    const latest = currentData.length > 0 ? currentData[currentData.length - 1] : null;

    // Translations (Simple local map or extend Dictionary later)
    const t_widget = {
        title: lang === 'JP' ? 'Market Analysis' : 'Market Analysis',
        beta: 'BETA',
        loading: lang === 'JP' ? 'データ読み込み中...' : 'Loading Market Data...',
    };

    // Modal logic moved to parent via onOpenInfo prop

    return (
        <div className="w-full bg-black border-0 rounded-xl p-3 md:p-4 transition-colors duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <p className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                Market Analysis
                            </p>
                        </div>
                        <p className="text-slate-400 text-[9px] font-mono">Dynamic technical charts and multi-asset price action.</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Symbols Segmented Control */}
                    <div className="flex bg-slate-900/50 p-1 rounded-lg">
                        {(["DXY", "US10Y", "SPX"] as Instrument[]).map(sym => (
                            <button
                                key={sym}
                                onClick={() => setSelectedSymbol(sym)}
                                className={`px-4 py-1 rounded-md font-bold text-xs transition-all flex items-center gap-2 ${selectedSymbol === sym
                                    ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                {sym}
                            </button>
                        ))}
                    </div>

                    {/* Timeframes Segmented Control */}
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                        {(["1h", "4h"] as Timeframe[]).map(tf => (
                            <button
                                key={tf}
                                onClick={() => setSelectedTimeframe(tf)}
                                className={`px-4 py-1 rounded-md font-bold text-xs transition-all flex items-center gap-2 ${selectedTimeframe === tf
                                    ? 'bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>

                    {/* Indicators Segmented Control */}
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                        <button
                            onClick={() => setIndicators({ ...indicators, bb: !indicators.bb })}
                            className={`px-3 py-1 rounded-md font-bold text-xs transition-all flex items-center gap-2 ${indicators.bb
                                ? 'bg-white dark:bg-violet-600 text-violet-600 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            BB {indicators.bb && <span className="">✓</span>}
                        </button>
                        <button
                            onClick={() => setIndicators({ ...indicators, sma: !indicators.sma })}
                            className={`px-3 py-1 rounded-md font-bold text-xs transition-all flex items-center gap-2 ${indicators.sma
                                ? 'bg-white dark:bg-violet-600 text-violet-600 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            MA {indicators.sma && <span className="">✓</span>}
                        </button>
                        <button
                            onClick={() => setIndicators({ ...indicators, rsi: !indicators.rsi })}
                            className={`px-3 py-1 rounded-md font-bold text-xs transition-all flex items-center gap-2 ${indicators.rsi
                                ? 'bg-white dark:bg-violet-600 text-violet-600 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            RSI {indicators.rsi && <span className="">✓</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className={`bg-[#0a0a0b] border border-slate-800/50 rounded-xl shadow-inner overflow-hidden relative group transition-all duration-500 ease-in-out ${indicators.rsi ? 'h-[400px]' : 'h-[300px]'}`}>
                {/* Header Overlay */}
                <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 pointer-events-none">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 drop-shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-[2px] px-3 py-1 rounded shadow-sm border-0">
                        {selectedSymbol} <span className="text-slate-500 dark:text-slate-400 font-normal text-xs">/ {selectedTimeframe}</span>
                    </h2>
                </div>

                {/* Price Overlay */}
                {latest && (
                    <div className="absolute top-2 right-4 z-10 text-right pointer-events-none">
                        <div className={`text-lg font-mono font-bold drop-shadow-sm dark:drop-shadow-md ${latest.close >= latest.open ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                            {latest.close.toFixed(2)}
                        </div>
                    </div>
                )}

                <div className="p-0 h-full">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 animate-pulse text-sm">
                            {t_widget.loading}
                        </div>
                    ) : (
                        <MarketChart
                            data={currentData}
                            visibleIndicators={indicators}
                            colors={{
                                backgroundColor: theme === 'dark' ? '#111111' : '#f8fafc', // match container
                                textColor: theme === 'dark' ? '#64748b' : '#334155'
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Modal rendered by parent */}
        </div>
    );
};
