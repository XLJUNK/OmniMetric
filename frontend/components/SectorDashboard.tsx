'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Activity, Globe, Zap, Clock, ChevronDown, Check, TrendingUp, TrendingDown, Minus, Info, X } from 'lucide-react';
import { RiskGauge, HistoryChart, MetricChart } from '@/components/Charts';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { SECTOR_CONFIG, SECTOR_LABELS } from '@/data/sectors';
import { useRouter, usePathname } from 'next/navigation';
import { NewsTicker } from '@/components/NewsTicker';
import { AdUnit } from '@/components/AdUnit';

interface SignalData {
    last_updated: string;
    gms_score: number;
    sector_scores?: Record<string, number>;
    market_data: any;
    analysis: any;
    events: any[];
    history_chart: any[];
}

interface SectorDashboardProps {
    sectorKey: 'STOCKS' | 'CRYPTO' | 'FOREX' | 'COMMODITIES';
    lang: LangType;
    setLang: (l: LangType) => void;
}

export const SectorDashboard = ({ sectorKey, lang, setLang }: SectorDashboardProps) => {
    const [data, setData] = useState<SignalData | null>(null);
    const [liveData, setLiveData] = useState<any>(null);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/signal');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (e) {
                console.error("Failed to fetch", e);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    // LIVE DATA POLLING
    useEffect(() => {
        const fetchLive = async () => {
            // Reusing main live endpoint for now, ideally filter server side but client filtering is fine for v2 prototype
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

    if (!data) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-500 font-mono text-xs animate-pulse">LOADING SECTOR DATA...</div>;

    const t = DICTIONARY[lang];
    const sectorName = SECTOR_LABELS[sectorKey][lang];
    const sectorScore = data.sector_scores?.[sectorKey] ?? 50;

    // Determine Color Status
    const isBlue = sectorScore > 60;
    const isRed = sectorScore < 40;
    const themeColor = isBlue ? "text-blue-500" : (isRed ? "text-red-500" : "text-yellow-500");
    const themeHex = isBlue ? "#3b82f6" : (isRed ? "#ef4444" : "#eab308");

    // Filter Indicators
    const targetKeys = SECTOR_CONFIG[sectorKey] || [];
    const indicators = targetKeys.map(k => {
        const item = data.market_data[k] || { price: 0, change_percent: 0, trend: "NEUTRAL", sparkline: [] };
        return { key: k, ...item };
    });

    return (
        <div className="w-full bg-[#0A0A0A] text-slate-200 font-sans min-h-screen flex flex-col">
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 w-full">

                {/* HEADER (Simplified) */}
                <header className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
                        <Globe className="w-4 h-4 text-sky-500" />
                        <span className="text-slate-100 text-sm font-black tracking-[0.1em] uppercase hover:text-sky-400 transition-colors">OmniMetric / {sectorName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsLangOpen(!isLangOpen)} className="text-[10px] font-bold text-slate-400 border border-white/10 px-2 py-1 rounded">
                            {lang} <ChevronDown className="w-3 h-3 inline" />
                        </button>
                        {isLangOpen && (
                            <div className="absolute top-16 right-8 bg-[#1e293b] border border-white/10 rounded z-50">
                                {(Object.keys(DICTIONARY) as LangType[]).map((l) => (
                                    <button key={l} onClick={() => { setLang(l); setIsLangOpen(false); }} className="block w-full text-left px-4 py-2 text-xs hover:bg-white/5">
                                        {l}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                {/* VISUAL HEADER */}
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${themeColor}`}>
                        {sectorName}
                    </h1>
                    <div className="flex items-center gap-4 bg-[#111] border border-white/10 px-6 py-2 rounded-full">
                        <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">Sector Risk Score</span>
                        <span className={`text-2xl font-black ${themeColor}`}>{sectorScore}</span>
                    </div>
                </div>

                {/* INDICATOR GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {indicators.map((val) => {
                        // LIVE OVERRIDE
                        if (liveData && liveData[val.key]) {
                            val.price = liveData[val.key].price;
                            val.change_percent = liveData[val.key].change_percent;
                        }

                        const trend = val.trend || "FLAT";
                        const isPos = val.change_percent > 0;
                        const colorClass = isPos ? "text-sky-400" : (val.change_percent < 0 ? "text-red-500" : "text-slate-400");

                        return (
                            <div key={val.key} className="bg-[#0f172a] border border-white/5 rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-sky-500/30 transition-all">
                                <div className="flex justify-between items-start z-10">
                                    <span className="text-sm font-bold text-slate-400 tracking-wider">{val.key}</span>
                                    <span className={`text-2xl font-mono font-black ${colorClass}`}>{val.price}</span>
                                </div>

                                <div className="h-[60px] w-full z-10">
                                    <MetricChart
                                        data={val.sparkline || []}
                                        color={isPos ? "#38bdf8" : "#ef4444"}
                                        currentPrice=""
                                        startDate="" endDate=""
                                    />
                                </div>

                                <div className="flex justify-between items-end z-10 border-t border-white/5 pt-4">
                                    <span className={`text-lg font-bold ${colorClass}`}>
                                        {val.change_percent > 0 ? "+" : ""}{val.change_percent}%
                                    </span>
                                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-500 tracking-widest">{trend}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* SECTOR NEWS */}
                <div className="border-t border-white/10 pt-8">
                    <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Sector Intelligence</h3>
                    <NewsTicker lang={lang} />
                </div>

                {/* FOOTER AD */}
                <div className="py-8 flex justify-center">
                    <div className="w-full max-w-[728px] h-[90px] bg-[#111] border border-white/5 flex items-center justify-center">
                        <AdUnit />
                    </div>
                </div>

            </div>
        </div>
    );
};
