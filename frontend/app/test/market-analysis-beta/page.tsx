
'use client';

import React, { useEffect, useState } from 'react';
import MarketChart from '@/components/analysis/MarketChart';
import { TVPartnerCard } from '@/components/TVPartnerCard';
// import Link from 'next/link';

// Types matching JSON structure
type Instrument = "DXY" | "US10Y" | "SPX"; // Using keys from JSON
type Timeframe = "1h" | "4h" | "Daily";

interface AnalysisData {
    [symbol: string]: {
        [tf: string]: any[]; // MarketData[]
    }
}

export default function MarketAnalysisPage() {
    const [data, setData] = useState<AnalysisData | null>(null);
    const [selectedSymbol, setSelectedSymbol] = useState<Instrument>("DXY");
    const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>("Daily");
    const [indicators, setIndicators] = useState({
        bb: true,
        sma: true,
        rsi: true
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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
            <header className="mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-3">
                    Market Analysis <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">BETA</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Professional-grade technical indicators for macro assets.
                </p>
            </header>

            {/* Unified Toolbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-6 flex flex-col lg:flex-row gap-4 lg:items-center justify-between shadow-sm">

                {/* Left: Selectors */}
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    {/* Symbols */}
                    <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                        {(["DXY", "US10Y", "SPX"] as Instrument[]).map(sym => (
                            <button
                                key={sym}
                                onClick={() => setSelectedSymbol(sym)}
                                className={`px-4 py-1.5 rounded-md font-bold text-sm transition-all ${selectedSymbol === sym
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                    }`}
                            >
                                {sym}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-8 bg-slate-800 hidden sm:block"></div>

                    {/* Timeframes */}
                    <div className="flex gap-1">
                        {(["1h", "4h", "Daily"] as Timeframe[]).map(tf => (
                            <button
                                key={tf}
                                onClick={() => setSelectedTimeframe(tf)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${selectedTimeframe === tf
                                    ? 'bg-slate-800 border-slate-600 text-emerald-400'
                                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                                    }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Indicators */}
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-slate-500 uppercase tracking-wider mr-1 md:block hidden">Indicators:</span>
                    <button
                        onClick={() => setIndicators({ ...indicators, bb: !indicators.bb })}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${indicators.bb
                            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
                            }`}
                    >
                        Bollinger Bands
                    </button>
                    <button
                        onClick={() => setIndicators({ ...indicators, sma: !indicators.sma })}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${indicators.sma
                            ? 'bg-orange-500/10 border-orange-500/50 text-orange-400'
                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
                            }`}
                    >
                        MA (200, 25)
                    </button>
                    <button
                        onClick={() => setIndicators({ ...indicators, rsi: !indicators.rsi })}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${indicators.rsi
                            ? 'bg-purple-500/10 border-purple-500/50 text-purple-400'
                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
                            }`}
                    >
                        RSI
                    </button>
                </div>
            </div>

            <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Chart Container */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden relative group">
                        {/* Header Overlay */}
                        <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2 drop-shadow-md">
                                {selectedSymbol} <span className="text-slate-400 font-normal text-sm">/ {selectedTimeframe}</span>
                            </h2>
                        </div>

                        {/* Price Overlay */}
                        {latest && (
                            <div className="absolute top-4 right-4 z-10 text-right pointer-events-none">
                                <div className={`text-xl font-mono font-bold drop-shadow-md ${latest.close >= latest.open ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {latest.close.toFixed(2)}
                                </div>
                            </div>
                        )}

                        <div className="p-0">
                            {loading ? (
                                <div className="h-[350px] flex items-center justify-center text-slate-500 animate-pulse">
                                    Loading Market Data...
                                </div>
                            ) : (
                                <MarketChart
                                    data={currentData}
                                    visibleIndicators={indicators}
                                    colors={{
                                        backgroundColor: '#0f172a', // slate-900
                                        textColor: '#64748b' // slate-500
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Stats Compact */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                            <div className="text-[10px] text-slate-500 uppercase">RSI (14)</div>
                            <div className={`text-xl font-mono font-bold ${(latest?.rsi || 50) > 70 ? 'text-red-400' : (latest?.rsi || 50) < 30 ? 'text-emerald-400' : 'text-slate-300'}`}>
                                {latest?.rsi?.toFixed(1) || '-'}
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                            <div className="text-[10px] text-slate-500 uppercase">Deviation (200SMA)</div>
                            <div className="text-xl font-mono font-bold text-slate-300">
                                {latest?.deviation ? `${latest.deviation > 0 ? '+' : ''}${latest.deviation.toFixed(2)}%` : '-'}
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 md:col-span-2 flex items-center">
                            {latest?.is_bullish || latest?.is_bearish ? (
                                <div className="flex gap-2">
                                    {latest?.is_bullish && <span className="text-emerald-400 text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 rounded">Possible Bullish Div</span>}
                                    {latest?.is_bearish && <span className="text-red-400 text-xs font-bold border border-red-500/30 bg-red-500/10 px-2 py-1 rounded">Possible Bearish Div</span>}
                                </div>
                            ) : (
                                <span className="text-slate-600 text-xs">No active divergence signals detected.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Ad Only */}
                <div className="space-y-6">
                    <TVPartnerCard lang="JP" variant="sidebar" />

                    <div className="text-[10px] text-slate-700 text-center">
                        <p>Market data is delayed/simulated for testing.</p>
                        <p>Timeframes: 1h, 4h, Daily only.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
