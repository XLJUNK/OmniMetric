'use client';

import React from 'react';
import { MetricChart } from '@/components/Charts';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { Info } from 'lucide-react';
import Link from 'next/link';

// "Pulse" Tile Component - SHARED DEFINITION
interface PulseTileProps {
    title: string;
    score: number;
    ticker: string;
    data: {
        price: number | string;
        change_percent?: number;
        sparkline?: number[];
        trend?: string;
    } | null;
    onClick: () => void;
    lang: string;
    wikiSlug?: string;
    chartColor?: string;
}

export const PulseTile = ({ title, score, ticker, data, onClick, lang, wikiSlug }: PulseTileProps) => {
    const t = DICTIONARY[lang as LangType] || DICTIONARY['EN'];
    const methodology = t.methodology as { factors: Record<string, string>; factors_status: Record<string, string> };

    // 1. RISK LOGIC
    let themeColor = "#94A3B8";
    let badgeLabel = methodology.factors_status?.NEUTRAL || "NEUTRAL";

    if (score >= 60) {
        themeColor = "#3B82F6";
        badgeLabel = methodology.factors_status?.SAFE || "SAFE";
    } else if (score < 40) {
        themeColor = "#EF4444";
        badgeLabel = methodology.factors_status?.DANGER || "DANGER";
    }

    const isUp = (data?.change_percent ?? 0) > 0;
    const trendText = isUp ? "+" : "";

    // 2. STYLING LOGIC
    let colorClassText = "text-slate-400";
    let colorClassBg = "bg-slate-400/10";
    let colorClassBorder = "border-slate-400/20";
    let gmsBadgeText = "text-slate-300";

    if (score >= 60) {
        colorClassText = "text-blue-500";
        colorClassBg = "bg-blue-500/10";
        colorClassBorder = "border-blue-500/20";
        gmsBadgeText = "text-blue-400";
    } else if (score < 40) {
        colorClassText = "text-rose-500";
        colorClassBg = "bg-rose-500/10";
        colorClassBorder = "border-rose-500/20";
        gmsBadgeText = "text-rose-500"; // High visibility
    }

    // 3. FACTOR LOGIC (GENERIC EXPANSION)
    let factorKeys = ["VOL", "MOM"];
    let f1_status = "STABLE";
    let f2_status = "NEUTRAL";

    // Basic logic mapping
    // If not specific match, use generic defaults based on Score/Change
    if (title === "VIX") {
        factorKeys = ["VOL", "SENT"];
        f1_status = score > 60 ? "LOW" : "HIGH";
        f2_status = score > 60 ? "CALM" : "FEAR";
    } else if (title === "S&P 500" || title === "Bitcoin" || title === "Ethereum" || title === "Solana" || title === "BTC" || title === "ETH" || title === "BTC-USD" || title === "ETH-USD") {
        factorKeys = ["MOM", "VOL"];
        f1_status = isUp ? "BULLISH" : "BEARISH";
        f2_status = "STABLE";
    } else if (title === "US 10Y" || title === "DXY" || title === "USD/JPY" || title === "USD/INR" || title === "USD/SAR" || title === "US 10Y Yield" || title === "US10Y") {
        factorKeys = ["RATES", "CRED"];
        f1_status = isUp ? "RISING" : "FALLING";
        f2_status = "STABLE";
    } else if (title === "Gold" || title === "WTI Oil" || title === "Copper" || title === "Oil") {
        factorKeys = ["VOL", "MOM"];
        f1_status = isUp ? "BULLISH" : "BEARISH";
        f2_status = score > 50 ? "LOW" : "HIGH";
    } else if (title === "Real Rates 10Y" || title === "Real Interest Rate") {
        factorKeys = ["RATES", "MACRO"];
        f1_status = isUp ? "RISING" : "FALLING";
        f2_status = "STABLE";
    } else if (title === "Breakeven 10Y" || title === "10Y BEI") {
        factorKeys = ["INFL", "EXP"];
        f1_status = isUp ? "RISING" : "FALLING";
        f2_status = "STABLE";
    } else if (title === "Net Liquidity" || title === "US Net Liquidity" || title === "Net Liq") {
        factorKeys = ["LIQ", "MOM"];
        f1_status = score > 60 ? "STABLE" : "STRESS";
        f2_status = isUp ? "RISING" : "FALLING";
    } else if (title === "MOVE Index" || title === "Bond Vol (MOVE)" || title === "MOVE") {
        factorKeys = ["VOL", "RATES"];
        f1_status = score < 50 ? "ELEVATED" : "CALM";
        f2_status = isUp ? "RISING" : "STABLE";
    } else if (title === "HY Spread" || title === "High Yield") {
        factorKeys = ["CRED", "SENT"];
        f1_status = score < 40 ? "STRESS" : "HEALTHY";
        f2_status = isUp ? "WIDENING" : "TIGHTENING";
    } else if (title === "Yield Curve 10Y-3M" || title === "10Y-3M") {
        factorKeys = ["CRED", "MACRO"];
        f1_status = isUp ? "STABLE" : "STRESS";
        f2_status = "SKEWED";
    } else if (title === "Market Breadth" || title === "Breadth") {
        factorKeys = ["BREADTH", "MOM"];
        f1_status = isUp ? "HEALTHY" : "WEAK";
        f2_status = "STABLE";
    } else {
        // Fallback for generic assets
        factorKeys = ["MOM", "VOL"];
        f1_status = isUp ? "BULLISH" : "BEARISH";
        f2_status = "STABLE";
    }

    // Localize the labels and statuses
    const factorLabels = factorKeys.map(k => methodology.factors?.[k] || k);
    const translateStatus = (s: string) => methodology.factors_status?.[s] || s;

    const factors = [
        { label: factorLabels[0], status: translateStatus(f1_status) },
        { label: factorLabels[1], status: translateStatus(f2_status) }
    ];

    if (!data) {
        factors[0] = { label: "ANALYZING", status: "..." };
        factors[1] = { label: "...", status: "" };
    }

    // 4. LAYOUT RENDER - INLINE STYLES FOR SAFETY but classes for @container
    return (
        <div className="gms-container">
            <div
                onClick={onClick}
                className="relative h-[11.25rem] w-full min-w-0 border border-slate-800 rounded-[0.75rem] overflow-hidden bg-black cursor-pointer shadow-sm dark:shadow-none group transition-all hover:border-slate-700 select-none"
            >

                {/* CHART LAYER: ABSOLUTE CENTER (Inset 1.25rem) */}
                <div className="absolute inset-[1.25rem] opacity-80 z-0">
                    <div className="w-full h-full flex items-center justify-center">
                        <MetricChart
                            data={data?.sparkline || []}
                            color={themeColor}
                            currentPrice=""
                            startDate="" endDate=""
                        />
                    </div>
                </div>

                {/* CORNER 1: TOP-LEFT (Title) - PADDING 0.75rem */}
                <div className="absolute top-[0.75rem] left-[0.75rem] z-10 flex flex-col pointer-events-none">
                    <div className="flex items-center gap-1.5 pointer-events-auto">
                        <h3 className={`text-slate-900 dark:text-slate-200 text-fluid-xs font-black uppercase tracking-[0.1em] font-sans leading-tight whitespace-normal break-words`}>{title}</h3>
                        {wikiSlug && (
                            <Link
                                href={lang.toUpperCase() === 'EN' ? `/wiki/${wikiSlug}` : `/${lang.toLowerCase()}/wiki/${wikiSlug}`}
                                onClick={(e) => e.stopPropagation()}
                                className={`text-slate-400 dark:text-slate-600 transition-colors p-0.5 rounded-full relative after:absolute after:-inset-4 after:content-[''] ${score >= 60 ? 'hover:text-blue-500 hover:bg-blue-500/10' : (score < 40 ? 'hover:text-rose-500 hover:bg-rose-500/10' : 'hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50')}`}
                                title="Open Macro Wiki Definition"
                            >
                                <Info className="w-[1em] h-[1em] opacity-80" strokeWidth={2.5} />
                            </Link>
                        )}
                    </div>
                    <span className="text-[0.5rem] text-slate-500 font-mono tracking-wider">{ticker}</span>
                </div>

                {/* CORNER 2: TOP-RIGHT (GMS Badge + Info Icon) - PADDING 0.75rem */}
                <div className="absolute top-[0.75rem] right-[0.75rem] z-10 flex flex-row items-center gap-[0.5rem]">
                    <div className={`px-2 py-0.5 border rounded-[2px] text-[0.6rem] font-semibold tracking-[0.15em] font-sans shadow-sm ${gmsBadgeText} ${colorClassBorder} bg-black pointer-events-none`}>
                        GMS <span className={`text-white ml-0.5 md:ml-1`}>{score}</span>
                    </div>
                </div>

                {/* CORNER 3: BOTTOM-LEFT (Price) - PADDING 0.75rem */}
                <div className="absolute bottom-[0.75rem] left-[0.75rem] z-10 flex flex-col justify-end pointer-events-none">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[0.5rem] font-bold px-1.5 py-0.5 rounded border ${colorClassText} ${colorClassBg} ${colorClassBorder} tracking-wider`}>
                            {badgeLabel}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-fluid-base font-bold font-sans tracking-tight text-white tabular-nums leading-none`}>
                            {(title === "Net Liquidity" || title === "US Net Liquidity" || title === "Net Liq")
                                ? (typeof data?.price === 'number'
                                    ? (Math.abs(data.price) >= 1000
                                        ? `$${(data.price / 1000).toFixed(2)}T`
                                        : `$${Math.round(data.price).toLocaleString()}B`)
                                    : (data?.price || "0.00"))
                                : (data?.price || "0.00")}
                        </span>
                        <span className={`text-[0.7rem] font-medium tabular-nums ml-1 ${isUp ? "text-emerald-400" : ((data?.change_percent ?? 0) < 0 ? "text-rose-400" : "text-slate-400")}`}>
                            {trendText}{(typeof data?.change_percent === 'number' ? data.change_percent : 0)}%
                        </span>
                    </div>
                </div>

                {/* CORNER 4: BOTTOM-RIGHT (Factors) - PADDING 0.75rem */}
                <div className="absolute bottom-[0.75rem] right-[0.75rem] z-10 flex flex-col items-end pointer-events-none">
                    {factors.map((f, i) => (
                        <div key={i} className={`text-[0.5rem] text-slate-400 bg-black font-sans tracking-wider font-medium leading-tight drop-shadow-md px-1.5 py-0.5 rounded mb-0.5`}>
                            <span className={`text-[0.45rem] mr-1 opacity-70 text-slate-400 dark:text-slate-500`}>{f.label}:</span>{f.status}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
