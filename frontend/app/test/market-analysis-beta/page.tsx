'use client';

import React, { useEffect, useState } from 'react';
import { MarketAnalysisWidget } from '@/components/analysis/MarketAnalysisWidget';
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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 font-sans transition-colors duration-300">
            <header className="mb-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-emerald-700 dark:from-blue-400 dark:to-emerald-400 flex items-center gap-3 tracking-tight">
                    Market Analysis <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-bold shadow-sm">BETA</span>
                </h1>
                <p className="text-slate-700 dark:text-slate-400 text-sm mt-2 font-medium">
                    Test Environment for Market Analysis Widget
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    Verifying: Dynamic Chart, Indicator Toggles, Dark Mode, Responsive Design.
                </p>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content: Widget */}
                <div className="lg:col-span-3">
                    <MarketAnalysisWidget lang="EN" />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <h3 className="text-sm font-bold mb-2">Test Controls</h3>
                        <p className="text-xs text-slate-500">
                            Use the widget controls to switch symbols and timeframes.
                            Verify that the chart updates without page reload.
                        </p>
                    </div>

                    <TVPartnerCard lang="EN" variant="sidebar" />
                </div>
            </main>
        </div>
    );
}
