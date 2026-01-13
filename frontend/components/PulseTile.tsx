'use client';

import React from 'react';
import { MetricChart } from '@/components/Charts';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { useDevice } from '@/hooks/useDevice';

// "Pulse" Tile Component - SHARED DEFINITION
export const PulseTile = ({ title, score, ticker, data, onClick, lang }: any) => {
    const { isMobile } = useDevice();

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
    } else if (title === "S&P 500" || title === "Bitcoin" || title === "Ethereum" || title === "Solana") {
        factorKeys = ["MOM", "VOL"];
        f1_status = isUp ? "BULLISH" : "BEARISH";
        f2_status = "STABLE";
    } else if (title === "US 10Y" || title === "DXY" || title === "USD/JPY" || title === "USD/INR" || title === "USD/SAR") {
        factorKeys = ["RATES", "CRED"];
        f1_status = isUp ? "RISING" : "FALLING";
        f2_status = "STABLE";
    } else if (title === "Gold" || title === "WTI Oil") {
        factorKeys = ["VOL", "MOM"];
        f1_status = isUp ? "BULLISH" : "BEARISH";
        f2_status = score > 50 ? "LOW" : "HIGH";
    } else if (title === "Net Liquidity" || title === "US Net Liquidity") {
        factorKeys = ["LIQ", "MOM"];
        f1_status = score > 60 ? "STABLE" : "STRESS";
        f2_status = isUp ? "RISING" : "FALLING";
    } else if (title === "MOVE Index" || title === "Bond Vol (MOVE)") {
        factorKeys = ["VOL", "RATES"];
        f1_status = score < 50 ? "ELEVATED" : "CALM";
        f2_status = isUp ? "RISING" : "STABLE";
    } else if (title === "HY Spread" || title === "High Yield") {
        factorKeys = ["CRED", "SENT"];
        f1_status = score < 40 ? "STRESS" : "HEALTHY";
        f2_status = isUp ? "WIDENING" : "TIGHTENING";
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

    // 4. LAYOUT RENDER - INLINE STYLES FOR SAFETY
    return (
        <div
            onClick={onClick}
            className="group transition-all hover:border-[#1E293B] select-none"
            style={{
                position: 'relative',
                height: '180px',
                width: '100%',
                border: '1px solid #1E293B', // SLATE-800 (Stealth Pro)
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#0A0A0A',
                cursor: 'pointer'
            }}
        >

            {/* CHART LAYER: ABSOLUTE CENTER (Inset 20px) */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', bottom: '20px', opacity: 0.8, zIndex: 0 }}>
                <div className="w-full h-full flex items-center justify-center">
                    <MetricChart
                        data={data?.sparkline || []}
                        color={themeColor}
                        currentPrice=""
                        startDate="" endDate=""
                    />
                </div>
            </div>

            {/* CORNER 1: TOP-LEFT (Title) - PADDING 12px */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
                <h3 className={`text-slate-200 ${isMobile ? 'text-[10px]' : 'text-[11px]'} font-black uppercase tracking-[0.1em] font-sans leading-tight`}>{title}</h3>
                <span className={`${isMobile ? 'text-[8px]' : 'text-[9px]'} text-slate-500 font-mono tracking-wider`}>{ticker}</span>
            </div>

            {/* CORNER 2: TOP-RIGHT (GMS Badge) - PADDING 12px */}
            <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pointerEvents: 'none' }}>
                <div className={`px-2 py-0.5 border rounded-[2px] ${isMobile ? 'text-[9px]' : 'text-[10.5px]'} font-semibold tracking-[0.15em] font-sans bg-[#0A0A0A] shadow-sm ${gmsBadgeText} ${colorClassBorder}`}>
                    GMS <span className="text-white ml-0.5 md:ml-1">{score}</span>
                </div>
            </div>

            {/* CORNER 3: BOTTOM-LEFT (Price 14px) - PADDING 12px */}
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pointerEvents: 'none' }}>
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${colorClassText} ${colorClassBg} ${colorClassBorder} tracking-wider`}>
                        {badgeLabel}
                    </span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className={`${typeof data?.price === 'string' && data?.price.length > 20 ? 'text-[9px]' : 'text-[14px]'} font-bold font-sans tracking-tight text-white tabular-nums leading-none`}>
                        {(title === "Net Liquidity" || title === "US Net Liquidity")
                            ? (Math.abs(data?.price || 0) >= 1000
                                ? `$${((data?.price || 0) / 1000).toFixed(2)}T`
                                : `$${Math.round(data?.price || 0).toLocaleString()}B`)
                            : (data?.price || "0.00")}
                    </span>
                    <span className={`text-[10px] font-medium tabular-nums ml-2 ${isUp ? "text-emerald-400" : (data?.change_percent < 0 ? "text-rose-400" : "text-slate-400")}`}>
                        {trendText}{(data?.change_percent || 0)}%
                    </span>
                </div>
            </div>

            {/* CORNER 4: BOTTOM-RIGHT (Factors) - PADDING 12px */}
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pointerEvents: 'none' }}>
                {factors.map((f, i) => (
                    <div key={i} className={`${isMobile ? 'text-[9px]' : 'text-[10.5px]'} text-[#94A3B8] font-sans tracking-wider font-medium leading-tight drop-shadow-md bg-black/40 px-1 rounded backdrop-blur-[2px] mb-0.5`}>
                        <span className={`${isMobile ? 'text-[8px]' : 'text-[9px]'} mr-1 opacity-70 text-slate-500`}>{f.label}:</span>{f.status}
                    </div>
                ))}
            </div>

        </div>
    );
}
