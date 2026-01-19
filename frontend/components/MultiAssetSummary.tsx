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

interface MultiAssetSummaryProps {
    initialData?: SignalData | null;
}

export const MultiAssetSummary = ({ initialData }: MultiAssetSummaryProps) => {
    const { data, liveData, isSafeMode } = useSignalData(initialData);
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

    // --- STRATEGIC DASHBOARD STATE ---
    const DEFAULT_ORDER = [
        "US10Y", "10Y BEI", "Real Interest Rate", "DXY",
        "VIX", "MOVE", "HY Spread", "S&P 500",
        "Net Liq", "10Y-3M", "Breadth", "Copper",
        "Gold", "BTC", "ETH", "Oil"
    ];

    const [tiles, setTiles] = useState<string[]>([]);

    React.useEffect(() => {
        // Hydration-safe tile initialization
        setTiles(DEFAULT_ORDER);
    }, []);

    const getSectorScore = (key: string) => data?.sector_scores?.[key] ?? 50;

    const getMarketData = (key: string) => {
        let val = data?.market_data?.[key] || {
            price: t.status.market,
            change_percent: 0,
            sparkline: []
        };

        if (isMobile && Array.isArray(val.sparkline)) {
            val = { ...val, sparkline: val.sparkline.slice(-10) };
        }

        if (isSafeMode) {
            if (typeof val.price !== 'number') {
                val = { ...val, price: t.status.market };
            }
        }
        if (liveData && liveData[key]) {
            val = { ...val, price: liveData[key].price, change_percent: liveData[key].change_percent };
        }
        return val;
    };

    // Card Renderer Helper
    const renderTile = (id: string) => {
        switch (id) {
            case "US10Y": return <PulseTile key={id} title="US10Y" score={getSectorScore("BONDS")} ticker="^TNX" data={getMarketData("TNX")} chartColor="#0ea5e9" onClick={() => { }} lang={lang} wikiSlug="us10y-yield" />;
            case "10Y BEI": return <PulseTile key={id} title="10Y BEI" score={getSectorScore("BONDS")} ticker="US 10Y BEI" data={getMarketData("BREAKEVEN_INFLATION")} chartColor="#f43f5e" onClick={() => { }} lang={lang} wikiSlug="breakeven-inflation" />;
            case "Real Interest Rate": return <PulseTile key={id} title="Real Interest Rate" score={getSectorScore("BONDS")} ticker="US REAL 10Y" data={getMarketData("REAL_INTEREST_RATE")} chartColor="#8b5cf6" onClick={() => { }} lang={lang} wikiSlug="real-interest-rate" />;
            case "DXY": return <PulseTile key={id} title="DXY" score={getSectorScore("FOREX")} ticker="DX-Y.NYB" data={getMarketData("DXY")} chartColor="#22c55e" onClick={() => router.push(`/forex?lang=${lang}`)} lang={lang} wikiSlug="dxy-index" />;
            case "VIX": return <PulseTile key={id} title="VIX" score={getSectorScore("STOCKS")} ticker="^VIX" data={getMarketData("VIX")} chartColor="#ef4444" onClick={() => router.push(`/stocks?lang=${lang}`)} lang={lang} wikiSlug="vix" />;
            case "MOVE": return <PulseTile key={id} title="MOVE" score={getSectorScore("BONDS")} ticker="^MOVE" data={getMarketData("MOVE")} chartColor="#a855f7" onClick={() => { }} lang={lang} wikiSlug="move-index" />;
            case "HY Spread": return <PulseTile key={id} title="HY Spread" score={getSectorScore("BONDS")} ticker="HY OAS" data={getMarketData("HY_SPREAD")} chartColor="#f97316" onClick={() => { }} lang={lang} wikiSlug="sovereign-credit-spread" />;
            case "S&P 500": return <PulseTile key={id} title="S&P 500" score={getSectorScore("STOCKS")} ticker="SPY" data={getMarketData("SPY")} chartColor="#3b82f6" onClick={() => router.push(`/stocks?lang=${lang}`)} lang={lang} wikiSlug="sp500-index" />;
            case "Net Liq": return <PulseTile key={id} title="Net Liq" score={data.gms_score} ticker="USD NET LIQ" data={getMarketData("NET_LIQUIDITY")} chartColor="#3b82f6" onClick={() => { }} lang={lang} wikiSlug="net-liquidity" />;
            case "10Y-3M": return <PulseTile key={id} title="10Y-3M" score={getSectorScore("BONDS")} ticker="10Y-3M" data={getMarketData("YIELD_SPREAD")} chartColor="#64748b" onClick={() => { }} lang={lang} wikiSlug="yield-curve-10y2y" />;
            case "Breadth": return <PulseTile key={id} title="Breadth" score={getSectorScore("STOCKS")} ticker="RSP/SPY" data={getMarketData("BREADTH")} chartColor="#6366f1" onClick={() => router.push(`/stocks?lang=${lang}`)} lang={lang} wikiSlug="market-breadth" />;
            case "Copper": return <PulseTile key={id} title="Copper" score={getSectorScore("COMMODITIES")} ticker="HG=F" data={getMarketData("COPPER")} chartColor="#f97316" onClick={() => router.push(`/commodities?lang=${lang}`)} lang={lang} wikiSlug="copper-price" />;
            case "Gold": return <PulseTile key={id} title="Gold" score={getSectorScore("COMMODITIES")} ticker="GC=F" data={getMarketData("GOLD")} chartColor="#eab308" onClick={() => router.push(`/commodities?lang=${lang}`)} lang={lang} wikiSlug="gold-price" />;
            case "BTC": return <PulseTile key={id} title="BTC" score={getSectorScore("CRYPTO")} ticker="BTC-USD" data={getMarketData("BTC")} chartColor="#f59e0b" onClick={() => router.push(`/crypto?lang=${lang}`)} lang={lang} wikiSlug="bitcoin" />;
            case "ETH": return <PulseTile key={id} title="ETH" score={getSectorScore("CRYPTO")} ticker="ETH-USD" data={getMarketData("ETH")} chartColor="#a855f7" onClick={() => router.push(`/crypto?lang=${lang}`)} lang={lang} wikiSlug="ethereum" />;
            case "Oil": return <PulseTile key={id} title="Oil" score={getSectorScore("COMMODITIES")} ticker="CL=F" data={getMarketData("OIL")} chartColor="#ef4444" onClick={() => router.push(`/commodities?lang=${lang}`)} lang={lang} wikiSlug="wti-oil" />;
            default: return null;
        }
    };

    return (
        <div className="w-full bg-[#0A0A0A] text-slate-200 font-sans min-h-screen flex flex-col pb-24 relative">
            {/* 1. Global Header Status & GMS Dashboard */}
            <GMSHeaderSection data={data} lang={lang} isSafeMode={isSafeMode} />

            {/* 5. Pulse Tiles (Sectors) - 4th Position (Indicators) */}
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 mb-12">
                <div className="flex items-center gap-3 mb-6 group cursor-pointer" onClick={() => router.push(`/wiki/macro-strategy?lang=${lang}`)}>
                    <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">Market Pulse</h2>
                    <div className="h-[1px] flex-1 bg-slate-800/50 group-hover:bg-blue-500/30 transition-colors" />
                    <span className="text-[9px] text-slate-600 font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">STRATEGY WIKI →</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {(tiles.length > 0 ? tiles : DEFAULT_ORDER).map(id => renderTile(id))}
                </div>
            </div>

            <div className="w-full">
                {/* Legal Footer inserted here to ensure it appears on Summary page */}
            </div>

        </div >
    );
};
