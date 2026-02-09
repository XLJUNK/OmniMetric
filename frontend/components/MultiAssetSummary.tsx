'use client';

import React, { useState } from 'react';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { useRouter, useSearchParams } from 'next/navigation';
import { Activity, Settings } from 'lucide-react';
import { GMSHeaderSection } from '@/components/GMSHeaderSection';
import { PulseTile } from '@/components/PulseTile';
import { useDevice } from '@/hooks/useDevice';
import { SignalData } from '@/lib/signal';
import { useSignalData } from '@/hooks/useSignalData';
import { ToastNotification } from '@/components/ToastNotification';
import dynamic from 'next/dynamic';



const TerminalSettings = dynamic(() => import('@/components/TerminalSettings').then(mod => mod.TerminalSettings), {
    ssr: false,
    loading: () => null
});

const DEFAULT_ORDER = [
    "US10Y", "10Y BEI", "Real Interest Rate", "DXY",
    "VIX", "MOVE", "HY Spread", "S&P 500",
    "Net Liq", "10Y-3M", "Breadth", "Copper",
    "Gold", "BTC", "ETH", "Oil"
];

interface MultiAssetSummaryProps {
    initialData?: SignalData | null;
    lang?: LangType;
}

export const MultiAssetSummary = ({ initialData, lang: propLang }: MultiAssetSummaryProps) => {
    const { data, isSafeMode } = useSignalData(initialData);
    const { isMobile } = useDevice();

    const router = useRouter();
    // const searchParams = useSearchParams(); // Removed

    // Safety: Ensure lang is always valid and uppercase for DICTIONARY access
    // const langParam = (searchParams.get('lang') || 'EN').toUpperCase(); // Removed
    // const lang = (Object.keys(DICTIONARY).includes(langParam) ? langParam : 'EN') as LangType; // Removed
    const lang = propLang || 'EN';

    // Theme is enforced dark

    // --- STRATEGIC DASHBOARD STATE ---

    const [tiles, setTiles] = useState<string[]>([]);
    const [hiddenTiles, setHiddenTiles] = useState<string[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [toast, setToast] = useState({ msg: '', show: false });
    const hasConfigChanged = React.useRef(false);

    React.useEffect(() => {
        // 1. Initial Render: Default
        setTiles(DEFAULT_ORDER);

        // 2. Hydration: Load Custom Config
        try {
            const saved = localStorage.getItem('gms_terminal_config_v1');
            if (saved && saved !== "null" && saved !== "undefined") {
                const config = JSON.parse(saved);
                if (config && typeof config === 'object') {
                    if (config.visibleTiles && Array.isArray(config.visibleTiles)) {
                        setTiles(config.visibleTiles);
                    }
                    if (config.hiddenTiles && Array.isArray(config.hiddenTiles)) {
                        setHiddenTiles(config.hiddenTiles);
                    }
                }
                // Theme is now handled by ThemeProvider, but we sync mainly for tile state
            }
        } catch {
            // ignore
        }
    }, []);

    const saveConfig = (visible: string[], hidden: string[]) => {
        hasConfigChanged.current = true;
        // Note: Theme is saved by ThemeProvider separately in the same key or managed there.
        // For compatibility, we can still save it here if needed, but ThemeProvider should handle it.
        // To avoid conflicts, we'll read the current config, update tiles, and save back.
        try {
            const saved = localStorage.getItem('gms_terminal_config_v1');
            let currentConfig = {};
            if (saved && saved !== "null" && saved !== "undefined") {
                try {
                    currentConfig = JSON.parse(saved);
                } catch {
                    currentConfig = {};
                }
            }

            localStorage.setItem('gms_terminal_config_v1', JSON.stringify({
                ...currentConfig,
                visibleTiles: visible,
                hiddenTiles: hidden,
                version: 1
            }));
        } catch { /* ignore */ }
    };

    const handleUpdateConfig = (visible: string[], hidden: string[]) => {
        setTiles(visible);
        setHiddenTiles(hidden);
        saveConfig(visible, hidden);
    };

    // handleToggleTheme REMOVED: Use toggleTheme from context directly or pass it

    const handleReset = () => {
        setTiles(DEFAULT_ORDER);
        setHiddenTiles([]);
        // We do NOT reset theme here to avoid jarring UX, or we can if requested.
        // Converting to "Default Layout" usually implies tiles. 
        // If we want to reset tiles only:
        try {
            const saved = localStorage.getItem('gms_terminal_config_v1');
            if (saved) {
                const config = JSON.parse(saved);
                delete config.visibleTiles;
                delete config.hiddenTiles;
                localStorage.setItem('gms_terminal_config_v1', JSON.stringify(config));
            }
        } catch { }

        setToast({ msg: 'Restored Default Layout', show: true });
    };

    const handleCloseSettings = () => {
        setIsSettingsOpen(false);
        if (hasConfigChanged.current) {
            setToast({ msg: 'Terminal Layout Saved', show: true });
            hasConfigChanged.current = false;
        }
    };

    const getSectorScore = (key: string) => data?.sector_scores?.[key] ?? 50;

    const getMarketData = (key: string) => {
        const raw = data?.market_data?.[key] || {
            price: 0,
            change_percent: 0,
            sparkline: [] as number[]
        };

        let val = {
            ...raw,
            price: typeof raw.price === 'string' ? parseFloat(raw.price) || 0 : raw.price,
            sparkline: Array.isArray(raw.sparkline) ? raw.sparkline : [] as number[]
        };

        if (isMobile && val.sparkline.length > 0) {
            val = { ...val, sparkline: val.sparkline.slice(-10) };
        }

        if (isSafeMode) {
            if (typeof val.price !== 'number') {
                val = { ...val, price: 0 };
            }
        }

        return val;
    };

    const getLink = (path: string) => lang === 'EN' ? `/${path}` : `/${lang.toLowerCase()}/${path}`;

    // Card Renderer Helper
    const renderTile = (id: string) => {
        switch (id) {
            case "US10Y": return <PulseTile key={id} title="US10Y" score={getSectorScore("BONDS")} ticker="^TNX" data={getMarketData("TNX")} chartColor="#0ea5e9" onClick={() => { }} lang={lang} wikiSlug="us10y-yield" />;
            case "10Y BEI": return <PulseTile key={id} title="10Y BEI" score={getSectorScore("BONDS")} ticker="US 10Y BEI" data={getMarketData("BREAKEVEN_INFLATION")} chartColor="#f43f5e" onClick={() => { }} lang={lang} wikiSlug="breakeven-inflation" />;
            case "Real Interest Rate": return <PulseTile key={id} title="Real Interest Rate" score={getSectorScore("BONDS")} ticker="US REAL 10Y" data={getMarketData("REAL_INTEREST_RATE")} chartColor="#8b5cf6" onClick={() => { }} lang={lang} wikiSlug="real-interest-rate" />;
            case "DXY": return <PulseTile key={id} title="DXY" score={getSectorScore("FOREX")} ticker="DX-Y.NYB" data={getMarketData("DXY")} chartColor="#22c55e" onClick={() => router.push(getLink('forex'))} lang={lang} wikiSlug="dxy-index" />;
            case "VIX": return <PulseTile key={id} title="VIX" score={getSectorScore("STOCKS")} ticker="^VIX" data={getMarketData("VIX")} chartColor="#ef4444" onClick={() => router.push(getLink('stocks'))} lang={lang} wikiSlug="vix" />;
            case "MOVE": return <PulseTile key={id} title="MOVE" score={getSectorScore("BONDS")} ticker="^MOVE" data={getMarketData("MOVE")} chartColor="#a855f7" onClick={() => { }} lang={lang} wikiSlug="move-index" />;
            case "HY Spread": return <PulseTile key={id} title="HY Spread" score={getSectorScore("BONDS")} ticker="HY OAS" data={getMarketData("HY_SPREAD")} chartColor="#f97316" onClick={() => { }} lang={lang} wikiSlug="sovereign-credit-spread" />;
            case "S&P 500": return <PulseTile key={id} title="S&P 500" score={getSectorScore("STOCKS")} ticker="SPY" data={getMarketData("SPY")} chartColor="#3b82f6" onClick={() => router.push(getLink('stocks'))} lang={lang} wikiSlug="sp500-index" />;
            case "Net Liq": return <PulseTile key={id} title="Net Liq" score={data?.gms_score || 50} ticker="USD NET LIQ" data={getMarketData("NET_LIQUIDITY")} chartColor="#3b82f6" onClick={() => { }} lang={lang} wikiSlug="net-liquidity" />;
            case "10Y-3M": return <PulseTile key={id} title="10Y-3M" score={getSectorScore("BONDS")} ticker="10Y-3M" data={getMarketData("YIELD_SPREAD")} chartColor="#64748b" onClick={() => { }} lang={lang} wikiSlug="yield-curve-10y2y" />;
            case "Breadth": return <PulseTile key={id} title="Breadth" score={getSectorScore("STOCKS")} ticker="RSP/SPY" data={getMarketData("BREADTH")} chartColor="#6366f1" onClick={() => router.push(getLink('stocks'))} lang={lang} wikiSlug="market-breadth" />;
            case "Copper": return <PulseTile key={id} title="Copper" score={getSectorScore("COMMODITIES")} ticker="HG=F" data={getMarketData("COPPER")} chartColor="#f97316" onClick={() => router.push(getLink('commodities'))} lang={lang} wikiSlug="copper-price" />;
            case "Gold": return <PulseTile key={id} title="Gold" score={getSectorScore("COMMODITIES")} ticker="GC=F" data={getMarketData("GOLD")} chartColor="#eab308" onClick={() => router.push(getLink('commodities'))} lang={lang} wikiSlug="gold-price" />;
            case "BTC": return <PulseTile key={id} title="BTC" score={getSectorScore("CRYPTO")} ticker="BTC-USD" data={getMarketData("BTC")} chartColor="#f59e0b" onClick={() => router.push(getLink('crypto'))} lang={lang} wikiSlug="bitcoin" />;
            case "ETH": return <PulseTile key={id} title="ETH" score={getSectorScore("CRYPTO")} ticker="ETH-USD" data={getMarketData("ETH")} chartColor="#a855f7" onClick={() => router.push(getLink('crypto'))} lang={lang} wikiSlug="ethereum" />;
            case "Oil": return <PulseTile key={id} title="Oil" score={getSectorScore("COMMODITIES")} ticker="CL=F" data={getMarketData("OIL")} chartColor="#ef4444" onClick={() => router.push(getLink('commodities'))} lang={lang} wikiSlug="wti-oil" />;
            default: return null;
        }
    };

    const getFormattedDate = () => {
        if (!data?.last_updated) return "CONNECTING...";
        try {
            const date = new Date(data!.last_updated);
            const options: Intl.DateTimeFormatOptions = {
                month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
            };
            if (lang === 'JP') return date.toLocaleString('ja-JP', { ...options, timeZone: 'Asia/Tokyo' }) + " JST";
            return date.toLocaleString('en-US', { ...options, timeZone: 'UTC' }) + " UTC";
        } catch { return data.last_updated; }
    };

    return (
        <div
            className={`w-full bg-black font-sans min-h-screen flex flex-col pb-24 relative`}
        >
            {/* 1. Global Header Status & GMS Dashboard */}
            {data ? (
                <GMSHeaderSection
                    data={data}
                    lang={lang}
                    isSafeMode={isSafeMode}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                />
            ) : (
                // Skeleton Loader or Safe Header
                <div className="w-full h-32 animate-pulse bg-white/5" />
            )}





            {/* 5. Pulse Tiles (Sectors) - 4th Position (Indicators) */}
            <div className="w-full mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-sky-500" />
                        <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Market Pulse</h2>
                    </div>
                    <div className="h-[1px] flex-1 bg-slate-800/50" />
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center justify-center p-0 h-6 w-6 rounded border border-transparent transition-all bg-transparent hover:bg-neutral-800 text-[#FEF3C7]"
                        aria-label="Customize Terminal"
                        title="Customize Terminal"
                    >
                        <Settings className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {(tiles.length > 0 ? tiles : DEFAULT_ORDER).map(id => renderTile(id))}
                </div>
            </div>

            <div className="w-full">
                {/* Legal Footer inserted here to ensure it appears on Summary page */}
            </div>

            <TerminalSettings
                isOpen={isSettingsOpen}
                onClose={handleCloseSettings}
                currentTiles={tiles.length > 0 ? tiles : DEFAULT_ORDER}
                hiddenTiles={hiddenTiles}
                onUpdate={handleUpdateConfig}
                onReset={handleReset}
                lang={lang}
                systemInfo={{
                    lastUpdated: getFormattedDate(),
                    status: "SYSTEM OPERATIONAL",
                    latency: "12MS"
                }}
            />
            <ToastNotification
                message={toast.msg}
                isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div >
    );
};
