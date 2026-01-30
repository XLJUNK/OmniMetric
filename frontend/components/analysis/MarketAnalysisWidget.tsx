'use client';

import React, { useEffect, useState } from 'react';
import MarketChart from '@/components/analysis/MarketChart';
import { useTheme } from '@/components/ThemeProvider';
import { LangType, DICTIONARY } from '@/data/dictionary';

// Types matching JSON structure
type Instrument = "DXY" | "US10Y" | "SPX";
type Timeframe = "1h" | "4h";

interface AnalysisData {
    [symbol: string]: {
        [tf: string]: any[]; // MarketData[]
    }
}

interface MarketAnalysisWidgetProps {
    lang: LangType;
}

export const MarketAnalysisWidget = ({ lang }: MarketAnalysisWidgetProps) => {
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

    return (
        <div className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 transition-colors duration-300">
            {/* Header & Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-emerald-700 dark:from-blue-400 dark:to-emerald-400 flex items-center gap-3 tracking-tight">
                        {t_widget.title}
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-bold shadow-sm">{t_widget.beta}</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
                        Professional-grade technical indicators.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Symbols */}
                    <div className="flex gap-2">
                        {(["DXY", "US10Y", "SPX"] as Instrument[]).map(sym => (
                            <button
                                key={sym}
                                onClick={() => setSelectedSymbol(sym)}
                                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-2 ${selectedSymbol === sym
                                    ? '!bg-blue-600 !text-white ring-1 ring-blue-400 shadow-blue-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                {sym}
                            </button>
                        ))}
                    </div>

                    {/* Timeframes */}
                    <div className="flex gap-2">
                        {(["1h", "4h"] as Timeframe[]).map(tf => (
                            <button
                                key={tf}
                                onClick={() => setSelectedTimeframe(tf)}
                                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-2 ${selectedTimeframe === tf
                                    ? '!bg-emerald-600 !text-white ring-1 ring-emerald-400 shadow-emerald-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>

                    {/* Indicators */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIndicators({ ...indicators, bb: !indicators.bb })}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-2 ${indicators.bb
                                ? '!bg-violet-600 !text-white ring-1 ring-violet-400 shadow-violet-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            BB {indicators.bb && <span className="text-white">✓</span>}
                        </button>
                        <button
                            onClick={() => setIndicators({ ...indicators, sma: !indicators.sma })}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-2 ${indicators.sma
                                ? '!bg-violet-600 !text-white ring-1 ring-violet-400 shadow-violet-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            MA {indicators.sma && <span className="text-white">✓</span>}
                        </button>
                        <button
                            onClick={() => setIndicators({ ...indicators, rsi: !indicators.rsi })}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-2 ${indicators.rsi
                                ? '!bg-violet-600 !text-white ring-1 ring-violet-400 shadow-violet-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            RSI {indicators.rsi && <span className="text-white">✓</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl shadow-inner overflow-hidden relative group h-[300px]">
                {/* Header Overlay */}
                <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 pointer-events-none">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 drop-shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-[2px] px-3 py-1 rounded shadow-sm border border-slate-200/50 dark:border-slate-800/50">
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
        </div>
    );
};
