'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Activity, Globe, Zap, Clock, ChevronDown, Check, TrendingUp, TrendingDown, Minus, Info, X } from 'lucide-react';
import { RiskGauge, HistoryChart, MetricChart } from '@/components/Charts';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { useRouter, usePathname } from 'next/navigation';
import { NewsTicker } from '@/components/NewsTicker';
import { AdUnit } from '@/components/AdUnit';

// Types
interface SignalData {
    last_updated: string;
    gms_score: number;
    market_data: any;
    analysis: any;
    events: any[];
    history_chart: any[];
}

interface GridItem {
    key: string;
    label: string;
    val: any;
    invertColor?: boolean;
    isYield?: boolean;
}

interface DashboardProps {
    lang: LangType;
    setLang: (l: LangType) => void;
}

export const Dashboard = ({ lang, setLang }: DashboardProps) => {
    const [data, setData] = useState<SignalData | null>(null);
    const [liveData, setLiveData] = useState<any>(null);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [showMethodology, setShowMethodology] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/signal?t=${Date.now()}`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (e) {
                console.error("Failed to fetch", e);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 60000); // 1 min sync
        return () => clearInterval(interval);
    }, []);

    // LIVE DATA POLLING
    useEffect(() => {
        const fetchLive = async () => {
            try {
                const res = await fetch('/api/live');
                if (res.ok) {
                    const json = await res.json();
                    setLiveData(json);
                }
            } catch (e) {
                // Silent fail
            }
        };
        fetchLive(); // Initial
        const interval = setInterval(fetchLive, 60000); // 60s poll
        return () => clearInterval(interval);
    }, []);


    if (!data) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-500 p-8 text-center animate-pulse font-mono tracking-widest text-xs">INITIALIZING OMNIMETRIC TERMINAL...</div>;

    const t = DICTIONARY[lang];
    if (!t) return null;

    let aiContent = data.analysis.content;
    if (lang === 'JP') {
        const jpReport = data.analysis.reports?.JP;
        if (jpReport && jpReport.length > 10) {
            aiContent = jpReport;
        } else {
            aiContent = `【OmniMetric 市場分析】\n\n統合リスクスコアは「${data.gms_score}」です。${data.gms_score > 60 ? "リスク拡張局面" : (data.gms_score < 40 ? "リスク収縮局面" : "警戒的待機局面")}に位置しています。`;
        }
    } else {
        aiContent = data.analysis.reports?.[lang] || data.analysis.content;
    }

    const score = data.gms_score;
    const isBlue = score > 60;
    const isYellow = score >= 40 && score <= 60;
    const isRed = score < 40;

    const getBench = (key: string) => {
        // @ts-ignore
        return t.terms[key]?.benchmark || "";
    };

    // POOLED INDICATORS FOR 3-COLUMN GRID (MANDATORY REPLAY)
    const allIndicators: GridItem[] = [
        { key: "VIX", label: t.labels.vix || "VIX", val: data.market_data.VIX, invertColor: true },
        { key: "MOVE", label: t.labels.move || "MOVE Index", val: data.market_data.MOVE, invertColor: true },
        { key: "HY_SPREAD", label: t.labels.hy_spread || "HY Credit Spread", val: data.market_data.HY_SPREAD, invertColor: true },
        { key: "NFCI", label: t.labels.nfci || "Fin. Condition", val: data.market_data.NFCI, invertColor: true },
        { key: "YIELD_SPREAD", label: t.labels.yield_spread || "Yield Spread", val: data.market_data.YIELD_SPREAD, isYield: true },
        { key: "COPPER_GOLD", label: t.labels.copper_gold || "Copper/Gold", val: data.market_data.COPPER_GOLD },
        { key: "DXY", label: t.labels.dxy || "US Dollar Index", val: data.market_data.DXY },
        { key: "TNX", label: t.labels.tnx || "US 10Y Yield", val: data.market_data.TNX },
        { key: "SPY", label: t.labels.spy || "S&P 500", val: data.market_data.SPY },
    ];

    const syncedChartData = [...data.history_chart];
    const todayStr = new Date().toISOString().split('T')[0];
    if (syncedChartData.length > 0) {
        syncedChartData[syncedChartData.length - 1] = {
            date: todayStr,
            score: data.gms_score
        };
    } else {
        syncedChartData.push({ date: todayStr, score: data.gms_score });
    }

    const regimeLabel = isBlue ? t.regime.bull : (isRed ? t.regime.bear : t.regime.neutral);
    const regimeColor = isBlue ? "#3b82f6" : (isRed ? "#ef4444" : "#eab308");

    return (
        <div className="w-full bg-[#0A0A0A] text-slate-200 font-sans selection:bg-sky-500/30 flex flex-col">

            <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-12 relative w-full">
                {/* HEADER */}
                <header className="flex justify-between items-center border-b border-[#1E293B] pb-4 relative z-20">
                    <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-sky-500" />
                        <span className="text-slate-100 text-base font-black tracking-[0.15em] uppercase">OmniMetric Terminal</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 text-[10px] font-bold text-slate-300 hover:text-white uppercase tracking-widest border border-[#1E293B] px-3 py-1.5 rounded hover:bg-white/5 transition-colors">
                                {lang} <ChevronDown className="w-3 h-3" />
                            </button>
                            {isLangOpen && (
                                <div className="absolute top-full right-0 mt-2 w-32 bg-[#1e293b] border border-[#1E293B] rounded shadow-xl overflow-hidden z-50">
                                    {(Object.keys(DICTIONARY) as LangType[]).map((l) => (
                                        <button key={l} onClick={() => {
                                            // 1. Update URL to persist state
                                            router.replace(`${pathname}?lang=${l}`);
                                            // 2. Set State (Redundant if effect works, but safe)
                                            setLang(l);
                                            setIsLangOpen(false);
                                        }} className="w-full text-left px-4 py-2 text-[10px] items-center flex justify-between hover:bg-white/5 transition-colors uppercase tracking-wider">
                                            {l} {lang === l && <Check className="w-3 h-3 text-sky-500" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-slate-500 uppercase">
                            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {data.last_updated}</span>
                            <span className="text-orange-500 font-bold bg-orange-950/30 px-2 py-0.5 rounded border border-orange-500/20">{t.titles.delayed}</span>
                        </div>
                    </div>
                </header>

                {/* 2. OMNIMETRIC REGIME INDEX (Structural Fix) */}
                {/* 2. OMNIMETRIC REGIME INDEX (FLEX STACK OVERWRITE) */}
                <div className="w-full max-w-[1400px] mx-auto pt-8 pb-4 flex flex-col items-center justify-center gap-2 border-b border-gray-800">
                    {/* Label */}
                    <div className="text-[#666] text-[10px] uppercase tracking-[0.2em] font-bold">
                        {t.titles.current_strategy}
                    </div>

                    {/* Command (Huge) */}
                    <div className={`text-5xl md:text-7xl font-black leading-tight my-2 tracking-tighter ${isBlue ? "text-blue-500" : (isRed ? "text-red-500" : "text-yellow-500")}`}>
                        {isBlue ? t.strategy.accumulate : (isRed ? t.strategy.defensive : t.strategy.neutral)}
                    </div>

                    {/* Score Subtitle */}
                    <div className="flex items-center gap-3 px-6 py-1 bg-[#111] border border-gray-800 rounded-full group cursor-pointer hover:border-gray-600 transition-colors" onClick={() => setShowMethodology(true)}>
                        <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                            {t.titles.gms_score}: <span className="text-white text-sm">{data.gms_score}</span>
                            <Info className="w-3 h-3 text-gray-600 group-hover:text-blue-400" />
                        </span>
                    </div>

                    {/* Gradient Risk Scale (Always Visible) */}
                    <div className="w-full max-w-[320px] mx-auto mt-4 mb-2">
                        <div
                            style={{
                                width: '100%',
                                height: '12px',
                                background: 'linear-gradient(90deg, #ef4444 0%, #eab308 50%, #3b82f6 100%)',
                                borderRadius: '999px',
                                position: 'relative',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${data ? data.gms_score : 0}%`,
                                    top: '-4px',
                                    transform: 'translateX(-50%)',
                                    width: '4px',
                                    height: '20px',
                                    backgroundColor: '#fff',
                                    boxShadow: '0 0 10px rgba(255,255,255,0.8)',
                                    zIndex: 10
                                }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-mono">
                            <span>{t.methodology.scale_labels.panic}</span>
                            <span>{t.methodology.scale_labels.neutral}</span>
                            <span>{t.methodology.scale_labels.greed}</span>
                        </div>
                    </div>
                </div>

                {/* 3. AI INSIGHTS ENGINE */}
                <div className="max-w-[1400px] mx-auto w-full px-4 mb-10 mt-8">
                    <div className="bg-[#111] p-8 rounded-xl border border-[#1E293B] !shadow-none !ring-0 !outline-none">
                        <div className="flex justify-between items-center mb-8 pl-6 border-l-4 border-sky-500">
                            <h3 className="text-slate-100 text-[12px] font-black uppercase tracking-[0.4em]">{t.titles.insights}</h3>
                            <span className="text-[10px] text-sky-500 font-mono font-bold tracking-widest uppercase">CORE SYNC v1.0.0</span>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="h-[280px] w-full bg-black/40 rounded-xl border border-[#1E293B] p-6">
                                <HistoryChart
                                    data={syncedChartData}
                                    lang={lang}
                                    color={
                                        (data?.gms_score ?? 63) > 60 ? '#3b82f6' :
                                            (data?.gms_score ?? 63) < 40 ? '#ef4444' : '#eab308'
                                    }
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-4">
                                    <Zap className="w-4 h-4 text-sky-500" />
                                    <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-70 whitespace-nowrap">{t.titles.institutional_analysis}</span>
                                </div>
                                <p className="text-slate-200 text-[15px] font-mono leading-relaxed whitespace-pre-wrap italic pl-8 border-l border-[#1E293B]">
                                    {aiContent}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEWS TICKER (GOLDEN ZONE) */}
                <div className="w-full max-w-[1400px] mx-auto mb-8 overflow-hidden border-y border-[#222]">
                    <NewsTicker lang={lang} />
                </div>

                {/* 4. AD PLACEMENT (STRATEGIC SEPARATOR) */}
                {/* 4. AD PLACEMENT (STRATEGIC SEPARATOR) */}
                <div className="w-full max-w-[1400px] mx-auto px-4 mb-8">
                    <div className="w-full h-[30px] bg-[#0c0c0c] border border-gray-800 rounded flex items-center justify-center overflow-hidden relative" style={{ height: '30px', minHeight: '30px', maxHeight: '30px' }}>
                        <AdUnit />
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:gap-6 w-full max-w-[1400px] mx-auto px-4 pb-32">
                    {allIndicators.map((item) => {
                        // LIVE OVERRIDE LOGIC
                        let val = item.val || { price: "---", change_percent: 0, trend: "FLAT", sparkline: [] };
                        let isLive = false;

                        if (liveData && liveData[item.key]) {
                            val = {
                                ...val,
                                price: liveData[item.key].price,
                                change_percent: liveData[item.key].change_percent,
                                // Keep trend and sparkline from static data for now as Live is point-in-time
                            };
                            isLive = true;
                        }

                        const trend = val.trend || "FLAT";
                        const isPos = trend === "UP" || trend === "STEEPENING" || trend === "BULL" || trend === "GROWTH" || trend === "HEALTHY";
                        const isNeg = trend === "DOWN" || trend === "INVERTED" || trend === "BEAR" || trend === "STRESS" || trend === "TIGHT" || trend === "HIGH";

                        let colorClass = "text-slate-400";
                        let chartColor = "#94a3b8"; // Default slate-400
                        let yRange: [number, number] | undefined = undefined;

                        // FEAR INDICATORS LOOKUP
                        if (item.key === "VIX") yRange = [10, 45];
                        if (item.key === "MOVE") yRange = [40, 140];
                        if (item.key === "HY_SPREAD") yRange = [2.0, 6.0];
                        if (item.key === "NFCI") yRange = [-1.0, 1.0];
                        if (item.key === "YIELD_SPREAD") yRange = [-1.0, 1.5];

                        if (item.key === "VIX" || item.key === "MOVE" || item.key === "HY_SPREAD" || item.key === "NFCI" || item.isYield) {
                            // FEAR METRIC: Rising is BAD (Red), Falling is GOOD (Green)
                            // If trend is UP (isPos) or HIGH/STRESS/TIGHT/INVERTED -> RED.
                            // If trend is DOWN -> GREEN.
                            if (isPos || trend === "HIGH" || trend === "STRESS" || trend === "TIGHT" || trend === "INVERTED") {
                                colorClass = "text-red-500";
                                chartColor = "#ef4444";
                            } else {
                                colorClass = "text-green-500";
                                chartColor = "#22c55e";
                            }
                        } else {
                            // GROWTH METRIC: Rising is GOOD (Green/Blue), Falling is BAD (Red)
                            if (isPos) {
                                colorClass = "text-sky-400";
                                chartColor = "#38bdf8";
                            } else if (isNeg) {
                                colorClass = "text-red-500";
                                chartColor = "#ef4444";
                            } else {
                                chartColor = "#eab308"; // Neutral Yellow
                            }
                        }

                        // Calculate Date Labels (30D)
                        const endDate = new Date().toISOString().split('T')[0];
                        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

                        return (
                            <div key={item.key} className="bg-gradient-to-r from-[#0f172a] to-[#000] border border-[#222] rounded-xl flex flex-col md:flex-row items-center hover:border-sky-500/50 transition-all group overflow-hidden !shadow-none !ring-0 !outline-none h-auto md:h-[120px]">
                                {/* LEFT SECTION (Identity & Price) */}
                                <div className="w-full md:w-[20%] h-auto md:h-full py-3 px-4 md:py-5 md:px-6 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-[#1E293B] bg-black/20 relative">
                                    <span className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wide mb-0 md:mb-1 truncate flex items-center gap-2">
                                        {item.label}
                                        {isLive && <span className="text-[8px] bg-sky-900/50 text-sky-400 px-1 rounded animate-pulse">{t.titles.delayed_tick}</span>}
                                    </span>
                                    <span className="text-2xl md:text-4xl font-black text-white font-mono tracking-tight glow-text">{val.price}</span>
                                </div>

                                {/* CENTER SECTION (Chart) */}
                                <div className="w-full md:w-[60%] h-[80px] md:h-full p-2 relative order-3 md:order-2">
                                    <MetricChart
                                        data={(val.sparkline && val.sparkline.length > 0) ? val.sparkline : [1, 1, 1, 1, 1]}
                                        color={chartColor}
                                        currentPrice="" /* Hidden in chart, shown on left */
                                        startDate={startDate}
                                        endDate={endDate}
                                        yRange={yRange}
                                    />
                                </div>

                                {/* RIGHT SECTION (Signals & Metadata) */}
                                <div className="w-full md:w-[20%] h-auto md:h-full py-2 px-4 md:py-5 md:px-6 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end border-b md:border-b-0 md:border-l border-[#1E293B] bg-black/20 order-2 md:order-3">
                                    <span className={`text-lg md:text-xl font-black font-mono md:mb-2 ${colorClass}`}>
                                        {val.change_percent >= 0 ? "+" : ""}{val.change_percent}%
                                    </span>
                                    <div className="flex items-center gap-2 md:flex-col md:items-end">
                                        <span className={`text-[10px] px-3 py-0.5 rounded font-black tracking-widest uppercase md:mb-3 ${colorClass.includes("red") ? "bg-red-500/10 text-red-500" : (colorClass.includes("green") ? "bg-green-500/10 text-green-500" : "bg-sky-500/10 text-sky-400")}`}>
                                            {trend}
                                        </span>
                                        <div className="hidden md:flex flex-col items-end">
                                            <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider truncate mb-1">{getBench(item.key)}</span>
                                            <span className="text-[8px] text-[#444] font-mono tracking-wide">{t.attribution.src}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 6. ECONOMIC CALENDAR (NEW) */}
                {/* 6. ECONOMIC CALENDAR (DYNAMIC) */}
                <div className="w-full max-w-[1400px] mx-auto px-4 mb-20">
                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[#666] text-[10px] font-black uppercase tracking-[0.2em]">{t.titles.upcoming_events}</h4>
                            <span className="text-[10px] text-green-500 font-mono tracking-wider animate-pulse uppercase">● AUTO-SYNC ACTIVE</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {data.events && data.events.length > 0 ? (
                                data.events.map((evt: any, idx: number) => {
                                    const dotColor = evt.impact === 'critical' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-orange-500 shadow-[0_0_8px_#f97316]';
                                    return (
                                        <div key={idx} className="flex items-center gap-4 group">
                                            <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
                                            <div className="flex flex-col">
                                                <span className="text-slate-200 text-xs font-bold uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                                                    [{evt.date.slice(5)} {evt.day}] {(t.events as any)[evt.code] || evt.name}
                                                </span>
                                                <span className="text-[#444] text-[9px] uppercase tracking-widest">
                                                    {evt.impact} • {evt.time || 'TBA'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-3 text-center text-gray-600 text-[10px] font-mono uppercase tracking-widest">
                                    CALENDAR SYNC PENDING...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE DRAWER (METHODOLOGY) */}
            {showMethodology && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm" onClick={() => setShowMethodology(false)}></div>
                    {/* Drawer */}
                    <div className="fixed top-0 right-0 h-full w-[100%] max-w-[400px] bg-[#111] border-l border-gray-800 z-[101] overflow-y-auto shadow-2xl transform transition-transform duration-300 ease-in-out">
                        <div className="p-6 bg-[#111] h-full text-white font-sans">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                                <h2 className="text-xl font-bold tracking-wider text-gray-200">{t.methodology.title}</h2>
                                <button onClick={() => setShowMethodology(false)} className="text-gray-500 hover:text-white">✕</button>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                                {t.methodology.desc}
                            </p>

                            {/* Zones Definition (Clean - No Bar) */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-blue-400 font-bold text-sm mb-2">{t.methodology.zone_accumulate}</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">{t.methodology.zone_accumulate_desc}</p>
                                </div>
                                <div>
                                    <h3 className="text-yellow-500 font-bold text-sm mb-2">{t.methodology.zone_neutral}</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">{t.methodology.zone_neutral_desc}</p>
                                </div>
                                <div>
                                    <h3 className="text-red-600 font-bold text-sm mb-2">{t.methodology.zone_defensive}</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">{t.methodology.zone_defensive_desc}</p>
                                </div>
                            </div>

                            {/* Footer Inputs */}
                            <div className="mt-12 pt-6 border-t border-gray-800 text-[10px] text-gray-600 uppercase">
                                {t.methodology.inputs}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
