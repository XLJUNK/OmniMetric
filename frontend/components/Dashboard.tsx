'use client';

import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Globe, Zap, Clock, ChevronDown, Check, Info } from 'lucide-react';
import { HistoryChart, MetricChart } from '@/components/Charts';
import { LangType, DICTIONARY } from '@/data/dictionary';
=======
import { OmniWarningBeacons } from '@/components/OmniWarningBeacons';
import { Globe, ChevronDown, Check, Clock, Info, Zap } from 'lucide-react';

// ... existing imports

// ... existing imports
// Removed duplicate Dashboard definition and misplaced OmniWarningBeacons usage

import { RiskGauge, HistoryChart, MetricChart } from '@/components/Charts';
import { DICTIONARY, LangType } from '@/data/dictionary';
>>>>>>> origin/main
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { NewsTicker } from '@/components/NewsTicker';
import { AdUnit } from '@/components/AdUnit';
import { LanguageSelector } from '@/components/LanguageSelector';

// Types
import { useSignalData } from '@/hooks/useSignalData';

interface GridItem {
    key: string;
    label: string;
    val: {
        price: string | number;
        change_percent: number;
        trend?: string;
        sparkline?: number[];
    };
    invertColor?: boolean;
    isYield?: boolean;
}

interface DashboardProps {
    lang: LangType;
    setLang: (l: LangType) => void;
}

export const Dashboard = ({ lang, setLang }: DashboardProps) => {
    const { data } = useSignalData();


    // const [data, setData] = useState<SignalData | null>(null); // Removed
    // const [liveData, setLiveData] = useState... // Removed

    const [showMethodology, setShowMethodology] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Use stable date labels for charts to avoid impure render calls
    const [dateLabels, setDateLabels] = useState({ start: '2026-01-01', end: '2026-02-02' });

    useEffect(() => {
        // Use timeout to avoid "setState synchronously within an effect" warning
        const timer = setTimeout(() => {
            const now = Date.now();
            const end = new Date().toISOString().split('T')[0];
            const start = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            setDateLabels({ start, end });
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Removed manual fetching effects as they are handled by useSignalData


    const syncedChartData = React.useMemo(() => {
        if (!data || !data.history_chart) return [];
        const chart = [...data.history_chart];
        // const lastPoint = (chart && chart.length > 0) ? chart[chart.length - 1] : null;
        // const prevPoint = (chart && chart.length > 1) ? chart[chart.length - 2] : null;
        // const diff = (lastPoint?.score ?? 0) - (prevPoint?.score ?? 0);
        const todayStr = new Date().toISOString().split('T')[0];
        if (chart.length > 0) {
            chart[chart.length - 1] = {
                date: todayStr,
                score: data.gms_score
            };
        } else {
            chart.push({ date: todayStr, score: data.gms_score });
        }
        return chart;
    }, [data]);

    if (!data) return <div className="min-h-screen bg-black flex items-center justify-center text-slate-500 p-8 text-center animate-pulse font-mono tracking-widest text-xs">INITIALIZING OMNIMETRIC TERMINAL...</div>;

    const t = DICTIONARY[lang];
    if (!t) return null;

    let aiContent = data?.analysis?.content || "";
    if (lang === 'JP') {
        const jpReport = data?.analysis?.reports?.JP;
        if (jpReport && jpReport.length > 30) { // Increased threshold to avoid small placeholders
            aiContent = jpReport;
        } else {
            aiContent = `【OmniMetric 市場分析】\n\n統合リスクスコアは「${data.gms_score}」です。${data.gms_score > 60 ? "リスク拡張局面" : (data.gms_score < 40 ? "リスク収縮局面" : "警戒的待機局面")}に位置しています。`;
        }
    } else {
        aiContent = data?.analysis?.reports?.[lang] || data?.analysis?.content || "";
    }

    // CRITICAL: Purge placeholders and revalidation messages
    const PLACEHOLDER_BLOCKLIST = ["高度なマクロデータを深掘りし", "再検証中", "Analyzing...", "深度解析最新", "正在重新验证"];
    if (aiContent && typeof aiContent === 'string') {
        if (PLACEHOLDER_BLOCKLIST.some(p => aiContent.includes(p))) {
            aiContent = t.status.ai;
        }
    }

    const score = data.gms_score;
    const isBlue = score > 60;
    const isRed = score < 40;

    const getBench = (key: string) => {

        return t.terms[key]?.benchmark || "";
    };

    // POOLED INDICATORS FOR 3-COLUMN GRID (MANDATORY REPLAY)
    const allIndicators: GridItem[] = [
        { key: "VIX", label: t.labels.vix || "VIX", val: { price: data.market_data.VIX?.price ?? 0, change_percent: data.market_data.VIX?.change_percent ?? 0, trend: data.market_data.VIX?.trend, sparkline: data.market_data.VIX?.sparkline }, invertColor: true },
        { key: "MOVE", label: t.labels.move || "MOVE Index", val: { price: data.market_data.MOVE?.price ?? 0, change_percent: data.market_data.MOVE?.change_percent ?? 0, trend: data.market_data.MOVE?.trend, sparkline: data.market_data.MOVE?.sparkline }, invertColor: true },
        { key: "HY_SPREAD", label: t.labels.hy_spread || "HY Credit Spread", val: { price: data.market_data.HY_SPREAD?.price ?? 0, change_percent: data.market_data.HY_SPREAD?.change_percent ?? 0, trend: data.market_data.HY_SPREAD?.trend, sparkline: data.market_data.HY_SPREAD?.sparkline }, invertColor: true },
        { key: "NFCI", label: t.labels.nfci || "Fin. Condition", val: { price: data.market_data.NFCI?.price ?? 0, change_percent: data.market_data.NFCI?.change_percent ?? 0, trend: data.market_data.NFCI?.trend, sparkline: data.market_data.NFCI?.sparkline }, invertColor: true },
        { key: "YIELD_SPREAD", label: t.labels.yield_spread || "Yield Spread", val: { price: data.market_data.YIELD_SPREAD?.price ?? 0, change_percent: data.market_data.YIELD_SPREAD?.change_percent ?? 0, trend: data.market_data.YIELD_SPREAD?.trend, sparkline: data.market_data.YIELD_SPREAD?.sparkline }, isYield: true },
        { key: "COPPER_GOLD", label: t.labels.copper_gold || "Copper/Gold", val: { price: data.market_data.COPPER_GOLD?.price ?? 0, change_percent: data.market_data.COPPER_GOLD?.change_percent ?? 0, trend: data.market_data.COPPER_GOLD?.trend, sparkline: data.market_data.COPPER_GOLD?.sparkline } },
        { key: "DXY", label: t.labels.dxy || "US Dollar Index", val: { price: data.market_data.DXY?.price ?? 0, change_percent: data.market_data.DXY?.change_percent ?? 0, trend: data.market_data.DXY?.trend, sparkline: data.market_data.DXY?.sparkline } },
        { key: "TNX", label: t.labels.tnx || "US 10Y Yield", val: { price: data.market_data.TNX?.price ?? 0, change_percent: data.market_data.TNX?.change_percent ?? 0, trend: data.market_data.TNX?.trend, sparkline: data.market_data.TNX?.sparkline } },
        { key: "SPY", label: t.labels.spy || "S&P 500", val: { price: data.market_data.SPY?.price ?? 0, change_percent: data.market_data.SPY?.change_percent ?? 0, trend: data.market_data.SPY?.trend, sparkline: data.market_data.SPY?.sparkline } },
    ];



    return (
        <div className="w-full bg-black text-slate-200 font-sans selection:bg-sky-500/30 flex flex-col">

            <div className="px-2 md:px-8 py-4 md:py-8 space-y-12 relative w-full">
                {/* HEADER */}
                <header className="flex justify-between items-center border-b border-slate-800 pb-4 relative z-20">
                    <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-sky-500" />
                        <span className="text-white text-base font-black tracking-[0.15em] uppercase">OmniMetric Terminal</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <LanguageSelector
                            currentLang={lang}
                            mode="query"
                            onSelect={(l: LangType) => setLang(l)}
                        />
                        <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-slate-500 uppercase">
                            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {data.last_updated}</span>
                            <span className="text-orange-500 font-bold bg-orange-950/30 px-2 py-0.5 rounded border border-orange-500/20">{t.titles.delayed}</span>
                        </div>
                    </div>
                </header>

                {/* 2. OMNIMETRIC REGIME INDEX (Structural Fix) */}
                {/* 2. OMNIMETRIC REGIME INDEX (FLEX STACK OVERWRITE) */}
                <div className="w-full pt-8 pb-4 flex flex-col items-center justify-center gap-2 border-b border-slate-800">
                    {/* Label */}
                    <div className="text-[#666] text-[10px] uppercase tracking-[0.2em] font-bold">
                        {t.titles.current_strategy}
                    </div>

                    {/* Command (Huge) */}
                    <div className={`text-5xl md:text-7xl font-black leading-tight my-2 tracking-tighter ${isBlue ? "text-blue-500" : (isRed ? "text-red-500" : "text-yellow-500")}`}>
                        {isBlue ? t.strategy.accumulate : (isRed ? t.strategy.defensive : t.strategy.neutral)}
                    </div>

                    {/* Score Subtitle */}
                    <div className="flex items-center gap-3 px-6 py-1 bg-[#111] border border-slate-800 rounded-full group cursor-pointer hover:border-slate-600 transition-colors" onClick={() => setShowMethodology(true)}>
                        <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                            {t.titles.gms_score}: <span className="text-white text-sm">{data.gms_score}</span>
                            <Info className="w-3 h-3 text-slate-600 group-hover:text-blue-400" />
                        </span>
                    </div>

<<<<<<< HEAD
                    {/* Gradient Risk Scale (Always Visible) */}
                    <div className="w-full max-w-[320px] mx-auto mt-4 mb-2">
                        <div
                            className="w-full h-3 rounded-full relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] bg-gradient-to-r from-[#ef4444] via-[#eab308] to-[#3b82f6]"
                        >
                            <div
                                className="absolute top-[-4px] w-1 h-5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10 -translate-x-1/2"
                                style={{
                                    left: `${data ? data.gms_score : 0}%`,
                                } as React.CSSProperties}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-mono">
                            <span>{t.methodology.scale_labels.panic}</span>
                            <span>{t.methodology.scale_labels.neutral}</span>
                            <span>{t.methodology.scale_labels.greed}</span>
                        </div>
=======
                    {/* V5 VISUAL SYSTEM RESTORED */}
                    <div className="w-full max-w-[360px] mx-auto mt-4 mb-2 flex flex-col items-center gap-4">
                        <RiskGauge score={data.gms_score} lang={lang} />
                        <OmniWarningBeacons data={data} lang={lang} />
>>>>>>> origin/main
                    </div>
                </div>

                {/* 3. AI INSIGHTS ENGINE */}
                <div className="w-full px-4 mb-10 mt-8">
                    <div className="bg-[#111] p-8 rounded-xl border border-slate-800 !shadow-none !ring-0 !outline-none">
                        <div className="flex justify-between items-center mb-8 ps-6 border-s-4 border-sky-500">
                            <h3 className="text-slate-100 text-[12px] font-black uppercase tracking-[0.4em]">{t.titles.insights}</h3>
                            <span className="text-[10px] text-sky-500 font-mono font-bold tracking-widest uppercase">CORE SYNC v1.0.0</span>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="h-[280px] w-full bg-black/40 rounded-xl border border-slate-800 p-6">
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
                                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 opacity-70 whitespace-nowrap">{t.titles.institutional_analysis}</span>
                                </div>
                                <p className="text-slate-200 text-[15px] font-mono leading-relaxed whitespace-pre-wrap italic ps-8 border-s border-slate-800">
                                    {aiContent}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEWS TICKER (GOLDEN ZONE) */}
                <div className="w-full mb-8 overflow-hidden border-y border-slate-800">
                    <NewsTicker lang={lang} />
                </div>

                {/* 4. AD PLACEMENT (STRATEGIC SEPARATOR) */}
                {/* 4. AD PLACEMENT (STRATEGIC SEPARATOR) */}
                <div className="w-full px-4 mb-8">
                    <div className="w-full h-[30px] bg-[#0c0c0c] border border-slate-800 rounded flex items-center justify-center overflow-hidden relative min-h-[30px] max-h-[30px]">
                        <AdUnit />
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:gap-6 w-full px-4 pb-32">
                    {allIndicators.map((item) => {
                        // LIVE OVERRIDE LOGIC
                        const val = item.val || { price: "---", change_percent: 0, trend: "FLAT", sparkline: [] };
                        const isLive = false; // Live override disabled in Static architecture

                        /* 
                        const liveItem = liveData ? liveData[item.key] : null;
                        if (liveItem) {
                            val = {
                                ...val,
                                price: liveItem.price,
                                change_percent: liveItem.change_percent,
                            };
                            isLive = true;
                        }
                        */

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

                        return (
                            <div key={item.key} className="bg-gradient-to-r from-[#0f172a] to-[#000] border border-slate-800 rounded-xl flex flex-col md:flex-row items-center hover:border-sky-500/50 transition-all group overflow-hidden !shadow-none !ring-0 !outline-none h-auto md:h-[120px]">
                                {/* LEFT SECTION (Identity & Price) */}
                                <div className="w-full md:w-[20%] h-auto md:h-full py-3 px-4 md:py-5 md:px-6 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start border-b md:border-b-0 md:border-e border-slate-800 bg-slate-900/50 relative">
                                    <span className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wide mb-0 md:mb-1 truncate flex items-center gap-2">
                                        {item.label}
                                        {/* INFO ICON LINK */}
                                        <Link href={lang === 'EN' ? `/glossary#${item.key.toLowerCase().replace('_', '-')}` : `/${lang.toLowerCase()}/glossary#${item.key.toLowerCase().replace('_', '-')}`} className="opacity-30 hover:opacity-100 hover:text-sky-500 transition-opacity">
                                            <Info className="w-3 h-3" />
                                        </Link>
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
                                        startDate={dateLabels.start}
                                        endDate={dateLabels.end}
                                        yRange={yRange}
                                    />
                                </div>

                                {/* RIGHT SECTION (Signals & Metadata) */}
                                <div className="w-full md:w-[20%] h-auto md:h-full py-2 px-4 md:py-5 md:px-6 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end border-b md:border-b-0 md:border-s border-slate-800 bg-slate-900/50 order-2 md:order-3">
                                    <span className={`text-lg md:text-xl font-black font-mono md:mb-2 ${colorClass}`}>
                                        {val.change_percent && val.change_percent >= 0 ? "+" : ""}{val.change_percent || 0}%
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
                <div className="w-full px-4 mb-20">
                    <div className="border-t border-slate-800 pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[#666] text-[10px] font-black uppercase tracking-[0.2em]">{t.titles.upcoming_events}</h4>
                            <span className="text-[10px] text-green-500 font-mono tracking-wider animate-pulse uppercase">● AUTO-SYNC ACTIVE</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {data.events && data.events.length > 0 ? (
                                data.events.map((evt: { code: string; name: string; date: string; day: string; time: string; impact: string }, idx: number) => {
                                    const dotColor = evt.impact === 'critical' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-orange-500 shadow-[0_0_8px_#f97316]';
                                    return (
                                        <div key={idx} className="flex items-center gap-4 group">
                                            <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
                                            <div className="flex flex-col">
                                                <span className="text-slate-200 text-xs font-bold uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                                                    [{evt.date.slice(5)} {evt.day}] {(t.events as Record<string, string>)[evt.code] || evt.name}
                                                </span>
                                                <span className="#444] text-[9px] uppercase tracking-widest">
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
                    <div className="fixed top-0 end-0 h-full w-[100%] max-w-[400px] bg-[#111] border-s border-slate-800 z-[101] overflow-y-auto shadow-2xl transform transition-transform duration-300 ease-in-out">
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
