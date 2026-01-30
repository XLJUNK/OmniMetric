
'use client';

import React, { useEffect, useState } from 'react';
import MarketChart from '@/components/analysis/MarketChart';
// import Link from 'next/link';

// Types matching JSON structure
type Instrument = "DXY" | "US10Y" | "SPX"; // Using keys from JSON
type Timeframe = "1h" | "4h" | "Daily" | "Weekly" | "Monthly";

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
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Market Analysis <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded ml-2">BETA</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Professional-grade technical indicators for macro assets.
                    </p>
                </div>

                {/* Symbol Selector */}
                <div className="flex gap-2">
                    {(["DXY", "US10Y", "SPX"] as Instrument[]).map(sym => (
                        <button
                            key={sym}
                            onClick={() => setSelectedSymbol(sym)}
                            className={`px-4 py-2 rounded font-semibold transition-all ${selectedSymbol === sym
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm">
                        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                {selectedSymbol} Chart
                                {latest && (
                                    <span className={`text-base font-normal ${latest.close >= latest.open ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {latest.close.toFixed(2)}
                                    </span>
                                )}
                            </h2>

                            {/* Timeframe Selector */}
                            <div className="flex bg-slate-950 rounded p-1 gap-1">
                                {(["1h", "4h", "Daily", "Weekly", "Monthly"] as Timeframe[]).map(tf => (
                                    <button
                                        key={tf}
                                        onClick={() => setSelectedTimeframe(tf)}
                                        className={`px-3 py-1 text-xs rounded transition-colors ${selectedTimeframe === tf
                                                ? 'bg-slate-700 text-white'
                                                : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-0">
                            {loading ? (
                                <div className="h-[400px] flex items-center justify-center text-slate-500 animate-pulse">
                                    Loading Market Data...
                                </div>
                            ) : (
                                <MarketChart
                                    data={currentData}
                                    visibleIndicators={indicators}
                                    colors={{
                                        backgroundColor: '#0f172a', // slate-900
                                        textColor: '#94a3b8' // slate-400
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Stats / Signals */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                            <div className="text-xs text-slate-500 uppercase mb-1">RSI (14)</div>
                            <div className={`text-2xl font-bold ${(latest?.rsi || 50) > 70 ? 'text-red-400' : (latest?.rsi || 50) < 30 ? 'text-emerald-400' : 'text-slate-200'
                                }`}>
                                {latest?.rsi?.toFixed(1) || '-'}
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                            <div className="text-xs text-slate-500 uppercase mb-1">Deviation (200SMA)</div>
                            <div className="text-2xl font-bold text-slate-200">
                                {latest?.deviation ? `${latest.deviation > 0 ? '+' : ''}${latest.deviation.toFixed(2)}%` : '-'}
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:col-span-2">
                            <div className="text-xs text-slate-500 uppercase mb-1">Signals</div>
                            <div className="flex gap-2 items-center h-8">
                                {latest?.is_bullish && (
                                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-500/50">
                                        Possible Bullish Divergence
                                    </span>
                                )}
                                {latest?.is_bearish && (
                                    <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs border border-red-500/50">
                                        Possible Bearish Divergence
                                    </span>
                                )}
                                {!latest?.is_bullish && !latest?.is_bearish && (
                                    <span className="text-slate-500 text-sm italic">No active divergence signals</span>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar: Controls & Affiliate */}
                <div className="space-y-6">
                    {/* Controls */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <h3 className="text-sm uppercase tracking-wider text-slate-500 mb-4">Indicators</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={indicators.bb}
                                    onChange={e => setIndicators({ ...indicators, bb: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                                />
                                <span className="group-hover:text-white transition-colors">Bollinger Bands (20, 2)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={indicators.sma}
                                    onChange={e => setIndicators({ ...indicators, sma: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                                />
                                <span className="group-hover:text-white transition-colors">SMA (200, 25)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={indicators.rsi}
                                    onChange={e => setIndicators({ ...indicators, rsi: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                                />
                                <span className="group-hover:text-white transition-colors">RSI (14)</span>
                            </label>
                        </div>
                    </div>

                    {/* TradingView Affiliate */}
                    <div className="bg-gradient-to-br from-[#131722] to-slate-900 border border-slate-700 rounded-lg overflow-hidden relative p-4">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="mb-4">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M21 17.5h-2.5v-11h-3v11H13v-6.5h-3v6.5H7.5v-4h-3v4H3V20h18v-2.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                </svg>
                                TradingView
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-300">
                                Need more advanced tools? Access 100+ indicators, custom scripts, and real-time global data on TradingView.
                            </p>
                            <a
                                href="https://www.tradingview.com/pricing/?share_your_love=omnimetric"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center py-2 px-4 bg-[#2962FF] hover:bg-[#1E53E5] text-white rounded font-medium transition-colors"
                            >
                                Try Pro for Free
                            </a>
                            <p className="text-xs text-slate-500 text-center">
                                *Supports OmniMetric via affiliate link.
                            </p>
                        </div>
                    </div>

                    <div className="text-xs text-slate-600">
                        <p>Data provided for informational purposes only. Not financial advice.</p>
                        <p className="mt-2">Update Frequency: Daily / 4H</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
