'use client';

import React, { useState } from 'react';
import { ChevronDown, Check, Info, X } from 'lucide-react';
import { RiskGauge, HistoryChart, MetricChart } from '@/components/Charts';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { NewsTicker } from '@/components/NewsTicker';
import { AdUnit } from '@/components/AdUnit';
import { GMSHeaderSection } from '@/components/GMSHeaderSection';
import { PulseTile } from '@/components/PulseTile';
import { useDevice } from '@/hooks/useDevice';
import { Skeleton, SkeletonCard, SkeletonPulseTile } from '@/components/Skeleton';


import { useSignalData, SignalData } from '@/hooks/useSignalData';

// "Pulse" Tile Component removed (Moved to PulseTile.tsx)

export const MultiAssetSummary = () => {
    const { data, liveData, isSafeMode } = useSignalData();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const { isMobile, isDesktop } = useDevice();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') as LangType) || 'EN';
    const t = DICTIONARY[lang];

    const setLang = (l: LangType) => {
        router.push(`${pathname}?lang=${l}`);
    };

    if (!t || !data) return (
        <div className="min-h-screen bg-[#0A0A0A] p-4 md:p-8 space-y-8">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header Skeleton */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="h-8 w-64 skeleton" />
                        <div className="h-4 w-48 skeleton opacity-50" />
                    </div>
                </div>
                {/* Hero Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <SkeletonCard />
                    <div className="lg:col-span-2">
                        <SkeletonCard />
                    </div>
                </div>
                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <SkeletonPulseTile key={i} />
                    ))}
                </div>
            </div>
        </div>
    );

    const getSectorScore = (key: string) => data?.sector_scores?.[key] ?? 50;

    const getMarketData = (key: string) => {
        let val = data?.market_data?.[key] || {
            price: t.status.market,
            change_percent: 0,
            sparkline: []
        };

        // --- v2.4.0 PERFORMANCE OPTIMIZATION ---
        // Slice sparkline points on mobile to reduce SVG path complexity & improve LCP
        if (isMobile && Array.isArray(val.sparkline)) {
            val = { ...val, sparkline: val.sparkline.slice(-10) };
        }

        if (isSafeMode) {
            val = { ...val, price: t.status.market }; // Override with "Synchronizing..."
        }
        if (liveData && liveData[key]) {
            val = { ...val, price: liveData[key].price, change_percent: liveData[key].change_percent };
        }
        return val;
    };

    // AI Insight is handled within GMSHeaderSection.

    return (
        <div className="w-full bg-[#0A0A0A] text-slate-200 font-sans min-h-screen flex flex-col pb-24 relative">
            {/* 1. Global Header Status & GMS Dashboard */}
            <GMSHeaderSection data={data} lang={lang} isSafeMode={isSafeMode} />

            {/* 5. Pulse Tiles (Sectors) - 4th Position (Indicators) */}
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 mb-12">
                <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Market Pulse</h2>
                <div className={`grid gap-4 md:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                    {/* ROW 1: THE MACRO TRINITY + SPY */}
                    <PulseTile title="Net Liquidity" score={data.gms_score} ticker="USD NET LIQ" data={getMarketData("NET_LIQUIDITY")} chartColor="#3b82f6" onClick={() => { }} lang={lang} />
                    <PulseTile title="MOVE Index" score={getSectorScore("BONDS")} ticker="^MOVE" data={getMarketData("MOVE")} chartColor="#a855f7" onClick={() => { }} lang={lang} />
                    <PulseTile title="VIX" score={getSectorScore("STOCKS")} ticker="^VIX" data={getMarketData("VIX")} chartColor="#ef4444" onClick={() => router.push(`/stocks?lang=${lang}`)} lang={lang} />
                    <PulseTile title="S&P 500" score={getSectorScore("STOCKS")} ticker="SPY" data={getMarketData("SPY")} chartColor="#3b82f6" onClick={() => router.push(`/stocks?lang=${lang}`)} lang={lang} />

                    {/* ROW 2: RATES, CREDIT, DOLLAR, GOLD */}
                    <PulseTile title="Yield Curve 10Y-3M" score={getSectorScore("BONDS")} ticker="10Y-3M" data={getMarketData("YIELD_SPREAD")} chartColor="#64748b" onClick={() => { }} lang={lang} />
                    <PulseTile title="HY Spread" score={getSectorScore("BONDS")} ticker="HY OAS" data={getMarketData("HY_SPREAD")} chartColor="#f97316" onClick={() => { }} lang={lang} />
                    <PulseTile title="DXY" score={getSectorScore("FOREX")} ticker="DX-Y.NYB" data={getMarketData("DXY")} chartColor="#22c55e" onClick={() => router.push(`/forex?lang=${lang}`)} lang={lang} />
                    <PulseTile title="Gold" score={getSectorScore("COMMODITIES")} ticker="GC=F" data={getMarketData("GOLD")} chartColor="#eab308" onClick={() => router.push(`/commodities?lang=${lang}`)} lang={lang} />

                    {/* ROW 3: CRYPTO & ENERGY */}
                    <PulseTile title="Bitcoin" score={getSectorScore("CRYPTO")} ticker="BTC-USD" data={getMarketData("BTC")} chartColor="#f59e0b" onClick={() => router.push(`/crypto?lang=${lang}`)} lang={lang} />
                    <PulseTile title="Ethereum" score={getSectorScore("CRYPTO")} ticker="ETH-USD" data={getMarketData("ETH")} chartColor="#a855f7" onClick={() => router.push(`/crypto?lang=${lang}`)} lang={lang} />
                    <PulseTile title="Market Breadth" score={getSectorScore("STOCKS")} ticker="RSP/SPY" data={getMarketData("BREADTH")} chartColor="#6366f1" onClick={() => router.push(`/stocks?lang=${lang}`)} lang={lang} />
                    <PulseTile title="WTI Oil" score={getSectorScore("COMMODITIES")} ticker="CL=F" data={getMarketData("OIL")} chartColor="#ef4444" onClick={() => router.push(`/commodities?lang=${lang}`)} lang={lang} />
                </div>
            </div>

            <div className="w-full">
                {/* Legal Footer inserted here to ensure it appears on Summary page */}
            </div>

        </div >
    );
};
