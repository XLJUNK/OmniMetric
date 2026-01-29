'use client';

import React from 'react';
import { MetricChart } from '@/components/Charts';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { useDevice } from '@/hooks/useDevice';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

// "Pulse" Tile Component - SHARED DEFINITION
export const PulseTile = ({ title, score, ticker, data, onClick, lang, wikiSlug, theme: propTheme }: any) => {
    const { isMobile } = useDevice();
    const { theme: contextTheme } = useTheme();
    const theme = propTheme || contextTheme;

    // 1. RISK LOGIC
    let themeColor = "#94A3B8";
    let badgeLabel = "NEUTRAL";
    const t = DICTIONARY[lang as LangType] || DICTIONARY['EN'];

    if (score >= 60) {
        themeColor = "#3B82F6";
        badgeLabel = "SAFE";
    } else if (score < 40) {
        themeColor = "#EF4444";
        badgeLabel = "DANGER";
    }

    const isUp = data?.change_percent > 0;
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
    const factorLabels = factorKeys.map(k => (t.methodology.factors as any)?.[k] || k);
    const translateStatus = (s: string) => (t.methodology.factors_status as any)?.[s] || s;

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
                className="group transition-all hover:border-[#1E293B] select-none pulse-tile-content"
                style={{
                    position: 'relative',
                    height: '11.25rem', // 180px -> 11.25rem
                    width: '100%',
                    border: theme === 'dark' ? '1px solid #1E293B' : '1px solid #E2E8F0',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    backgroundColor: theme === 'dark' ? '#0A0A0A' : '#ffffff',
                    cursor: 'pointer',
                    boxShadow: theme === 'dark' ? 'none' : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
                }}
            >

                {/* CHART LAYER: ABSOLUTE CENTER (Inset 1.25rem) */}
                <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', right: '1.25rem', bottom: '1.25rem', opacity: 0.8, zIndex: 0 }}>
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
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 10, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
                    <div className="flex items-center gap-1.5 pointer-events-auto text-fluid-xs">
                        <h3 className={`${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'} pulse-tile-title font-black uppercase tracking-[0.1em] font-sans leading-tight`}>{title}</h3>
                        {wikiSlug && (
                            <Link
                                href={`/${(lang || 'EN').toLowerCase()}/wiki/${wikiSlug}`}
                                onClick={(e) => e.stopPropagation()}
                                className={`text-slate-600 transition-colors p-0.5 rounded-full relative after:absolute after:-inset-4 after:content-[''] ${score >= 60 ? 'hover:text-blue-400 hover:bg-blue-400/10' : (score < 40 ? 'hover:text-rose-400 hover:bg-rose-400/10' : 'hover:text-slate-300 hover:bg-slate-700/50')}`}
                                title="Open Macro Wiki Definition"
                            >
                                <Info className="w-[1.15em] h-[1.15em] opacity-80" strokeWidth={2.5} />
                            </Link>
                        )}
                    </div>
                    <span className="text-[0.5rem] sm:text-[0.56rem] text-slate-500 font-mono tracking-wider">{ticker}</span>
                </div>

                {/* CORNER 2: TOP-RIGHT (GMS Badge + Info Icon) - PADDING 0.75rem */}
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                    {wikiSlug && (
                        <a
                            href={`https://en.wikipedia.org/wiki/${wikiSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-blue-400 transition-colors"
                            style={{ pointerEvents: 'auto' }} // Ensure pointer events are enabled for the link
                            onClick={(e) => e.stopPropagation()} // Prevent tile click when info icon is clicked
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                        </a>
                    )}
                    <div className={`px-2 py-0.5 border rounded-[2px] text-[0.56rem] sm:text-[0.65rem] font-semibold tracking-[0.15em] font-sans shadow-sm ${gmsBadgeText} ${colorClassBorder} ${theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-white'}`} style={{ pointerEvents: 'none' }}>
                        GMS <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} ml-0.5 md:ml-1`}>{score}</span>
                    </div>
                </div>

                {/* CORNER 3: BOTTOM-LEFT (Price) - PADDING 0.75rem */}
                <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pointerEvents: 'none' }}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[0.56rem] font-bold px-1.5 py-0.5 rounded border ${colorClassText} ${colorClassBg} ${colorClassBorder} tracking-wider`}>
                            {badgeLabel}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className={`${(typeof data?.price === 'string' && data?.price.length > 20) ? 'text-[0.56rem]' : 'text-[1.125rem]'} pulse-tile-price font-bold font-sans tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tabular-nums leading-none`}>
                            {(title === "Net Liquidity" || title === "US Net Liquidity" || title === "Net Liq")
                                ? (typeof data?.price === 'number'
                                    ? (Math.abs(data.price) >= 1000
                                        ? `$${(data.price / 1000).toFixed(2)}T`
                                        : `$${Math.round(data.price).toLocaleString()}B`)
                                    : (data?.price || "0.00"))
                                : (data?.price || "0.00")}
                        </span>
                        <span className={`text-[0.75rem] font-medium tabular-nums ml-1 ${isUp ? "text-emerald-400" : (data?.change_percent < 0 ? "text-rose-400" : "text-slate-400")}`}>
                            {trendText}{(typeof data?.change_percent === 'number' ? data.change_percent : 0)}%
                        </span>
                    </div>
                </div>

                {/* CORNER 4: BOTTOM-RIGHT (Factors) - PADDING 0.75rem */}
                <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pointerEvents: 'none' }}>
                    {factors.map((f, i) => (
                        <div key={i} className={`text-[0.56rem] sm:text-[0.65rem] ${theme === 'dark' ? 'text-[#94A3B8] bg-black/50' : 'text-slate-600 bg-slate-100 border border-slate-200'} font-sans tracking-wider font-medium leading-tight drop-shadow-md px-1.5 py-0.5 rounded backdrop-blur-[2px] mb-0.5`}>
                            <span className={`text-[0.5rem] sm:text-[0.56rem] mr-1 opacity-70 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{f.label}:</span>{f.status}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
