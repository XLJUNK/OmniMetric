'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Activity, Globe, Zap, Clock, ChevronDown, Check, TrendingUp, TrendingDown, Minus, Info, X } from 'lucide-react';
import { RiskGauge, HistoryChart, MetricChart } from '@/components/Charts';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { SECTOR_CONFIG, SECTOR_LABELS } from '@/data/sectors';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { NewsTicker } from '@/components/NewsTicker';
import { AdUnit } from '@/components/AdUnit';
import { GMSHeaderSection } from '@/components/GMSHeaderSection';
import { PulseTile } from '@/components/PulseTile';
import { useDevice } from '@/hooks/useDevice';

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
}

export const SectorDashboard = ({ sectorKey }: SectorDashboardProps) => {
    const [data, setData] = useState<SignalData | null>(null);
    const [liveData, setLiveData] = useState<any>(null);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const { isMobile } = useDevice();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') as LangType) || 'EN';

    // Helper to change language via URL
    const setLang = (l: LangType) => {
        router.push(`${pathname}?lang=${l}`);
    };

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
            <GMSHeaderSection data={data} lang={lang} />
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 w-full">

                {/* METHODOLOGY MODAL */}
                {showInfo && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowInfo(false)}>
                        <div className="bg-[#111] border border-[#1E293B] rounded-xl w-full max-w-2xl p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                            <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => setShowInfo(false)}>
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-b border-[#1E293B] pb-2">
                                {t.methodology.title}
                            </h2>
                            <div className="space-y-6 text-sm text-slate-300 font-mono">
                                <p>{t.methodology.desc}</p>
                                {/* Removed repetitive logic for brevity since GMSHeaderSection handles much of this context now */}
                            </div>
                        </div>
                    </div>
                )}

                {/* SECTION HEADER */}
                <div className="flex items-center gap-3 border-b border-[#1E293B] pb-4 mb-8">
                    <Globe className="w-5 h-5 text-sky-500" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter hover:text-sky-400 transition-colors">
                        OMNIMETRIC / {sectorName}
                    </h2>
                </div>

                {/* 4. INDICATOR GRID (UNIFIED WITH PULSE TILE) */}
                <div className={`grid gap-4 md:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                    {indicators.map((val) => {
                        // LIVE OVERRIDE
                        if (liveData && liveData[val.key]) {
                            val.price = liveData[val.key].price;
                            val.change_percent = liveData[val.key].change_percent;
                        }

                        // Determine Color based on Change %
                        // Green for up, Red for down is standard, but keeping "Stealth" palette
                        const isUp = val.change_percent >= 0;
                        const cardColor = isUp ? "#22c55e" : "#ef4444"; // Green/Red

                        // Safety check for localized title
                        // @ts-ignore
                        const locTitle = t.tickers?.[val.key] || t.labels?.[val.key.toLowerCase()] || val.key;

                        // Use PulseTile here
                        return (
                            <PulseTile
                                key={val.key}
                                title={locTitle}
                                score={sectorScore}
                                ticker={val.key}
                                data={val}
                                chartColor={cardColor}
                                onClick={() => { }}
                                lang={lang}
                            />
                        )
                    })}
                </div>

            </div>

        </div >
    );
};
