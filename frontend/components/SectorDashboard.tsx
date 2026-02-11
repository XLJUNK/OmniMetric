'use client';

import React, { useState } from 'react';
import { Globe, X } from 'lucide-react';
import { PulseTile } from '@/components/PulseTile';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { SECTOR_CONFIG, SECTOR_LABELS } from '@/data/sectors';
import { GMSHeaderSection } from '@/components/GMSHeaderSection';
import { SkeletonCard } from '@/components/Skeleton';
import { useSignalData } from '@/hooks/useSignalData';

interface SectorDashboardProps {
    sectorKey: 'STOCKS' | 'CRYPTO' | 'FOREX' | 'COMMODITIES' | 'CURRENCIES';
    lang: string;
}

export const SectorDashboard = ({ sectorKey, lang: langProp }: SectorDashboardProps) => {
    const { data, isSafeMode } = useSignalData();
    const [showInfo, setShowInfo] = useState(false);
    const lang = (langProp as LangType) || 'EN';

    if (!data) return <div className="min-h-screen bg-black flex items-center justify-center text-slate-500 font-mono text-xs animate-pulse space-y-4 flex-col">
        <SkeletonCard />
        <span>LOADING SECTOR DATA...</span>
    </div>;

    const t = DICTIONARY[lang];
    const sectorName = SECTOR_LABELS[sectorKey][lang];
    const sectorScore = data.sector_scores?.[sectorKey] ?? 50;

    // Filter Indicators
    const targetKeys = SECTOR_CONFIG[sectorKey] || [];
    const indicators = targetKeys.map(k => {
        const rawItem = data.market_data[k] || { price: 0, change_percent: 0, trend: "NEUTRAL", sparkline: [] };
        // Clone item to avoid mutation
        const item = { ...rawItem, price: rawItem.price.toString() };

        if (isSafeMode) {
            item.price = t.status.market; // Safe Mode override
        }
        return { key: k, ...item };
    });

    return (
        <div
            className="w-full bg-black text-slate-200 font-sans min-h-screen flex flex-col"
        >
            <GMSHeaderSection data={data} lang={lang} isSafeMode={isSafeMode} />
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 w-full">

                {/* METHODOLOGY MODAL */}
                {showInfo && (
                    <div className="bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 fixed inset-0 z-[100]" onClick={() => setShowInfo(false)}>
                        <div className="bg-black border border-slate-700/50 rounded-xl w-full max-w-2xl p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-2">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                                    {t.methodology.title}
                                </h2>
                                <button
                                    className="text-slate-400 hover:text-white transition-colors p-1"
                                    onClick={() => setShowInfo(false)}
                                    aria-label="Close"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="space-y-6 text-sm text-slate-300 font-mono">
                                <p>{t.methodology.desc}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SECTION HEADER */}
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-8">
                    <Globe className="w-5 h-5 text-sky-500" />
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter hover:text-sky-400 transition-colors">
                        MARKET PULSE / {sectorName}
                    </h2>
                </div>

                {/* 4. INDICATOR GRID (UNIFIED WITH PULSE TILE) */}
                {sectorKey === 'STOCKS' ? (
                    <div className="space-y-12">
                        {/* Primary Equities */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1 border-l-2 border-sky-500">
                                {lang === 'JP' ? '主要株価指数' : 'Major Equity Indices'}
                            </h3>
                            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                                {indicators.filter(val => ["SPY", "QQQ", "IWM"].includes(val.key)).map((val) => (
                                    <PulseTile
                                        key={val.key}
                                        title={(t.tickers as any)?.[val.key] || (val.key === 'STOCKS' ? t.labels.stocks_rates : (t.labels as any)?.[val.key.toLowerCase()]) || val.key}
                                        score={sectorScore}
                                        ticker={val.key}
                                        data={val}
                                        onClick={() => { }}
                                        lang={lang}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Yields - Market Gravity */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1 border-l-2 border-rose-500">
                                {t.labels.rates_gravity || (lang === 'JP' ? 'マーケットの重力（金利）' : 'Market Gravity (Yields)')}
                            </h3>
                            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                                {indicators.filter(val => ["US_10Y_YIELD", "US_02Y_YIELD"].includes(val.key)).map((val) => (
                                    <PulseTile
                                        key={val.key}
                                        title={(t.tickers as any)?.[val.key] || (val.key === 'STOCKS' ? t.labels.stocks_rates : (t.labels as any)?.[val.key.toLowerCase()]) || val.key}
                                        score={sectorScore}
                                        ticker={val.key}
                                        data={val}
                                        onClick={() => { }}
                                        lang={lang}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Other Indicators */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1 border-l-2 border-slate-700">
                                {lang === 'JP' ? '市場流動性・センチメント' : 'Market Liquidity & Sentiment'}
                            </h3>
                            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                                {indicators.filter(val => !["SPY", "QQQ", "IWM", "US_10Y_YIELD", "US_02Y_YIELD"].includes(val.key)).map((val) => (
                                    <PulseTile
                                        key={val.key}
                                        title={(t.tickers as any)?.[val.key] || (val.key === 'STOCKS' ? t.labels.stocks_rates : (t.labels as any)?.[val.key.toLowerCase()]) || val.key}
                                        score={sectorScore}
                                        ticker={val.key}
                                        data={val}
                                        onClick={() => { }}
                                        lang={lang}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : sectorKey === 'CURRENCIES' ? (
                    <div className="space-y-12">
                        {/* Fiat Currencies */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1 border-l-2 border-sky-500">
                                {t.labels.fiat_currencies || 'Fiat Currencies'}
                            </h3>
                            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                                {indicators.filter(val => ["DXY", "EURUSD", "USDJPY", "GBPUSD", "AUDUSD", "USDCAD", "USDCNY"].includes(val.key)).map((val) => (
                                    <PulseTile
                                        key={val.key}
                                        title={(t.tickers as any)?.[val.key] || (t.labels as any)?.[val.key.toLowerCase()] || val.key}
                                        score={sectorScore}
                                        ticker={val.key}
                                        data={val}
                                        onClick={() => { }}
                                        lang={lang}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Digital Assets */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1 border-l-2 border-orange-500">
                                {t.labels.digital_assets || 'Digital Assets'}
                            </h3>
                            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                                {indicators.filter(val => ["BTC", "ETH", "SOL", "CRYPTO_SENTIMENT"].includes(val.key)).map((val) => (
                                    <PulseTile
                                        key={val.key}
                                        title={(t.tickers as any)?.[val.key] || (t.labels as any)?.[val.key.toLowerCase()] || val.key}
                                        score={sectorScore}
                                        ticker={val.key}
                                        data={val}
                                        onClick={() => { }}
                                        lang={lang}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                        {indicators.map((val) => (
                            <PulseTile
                                key={val.key}
                                title={(t.tickers as any)?.[val.key] || (val.key === 'STOCKS' ? t.labels.stocks_rates : (t.labels as any)?.[val.key.toLowerCase()]) || val.key}
                                score={sectorScore}
                                ticker={val.key}
                                data={val}
                                onClick={() => { }}
                                lang={lang}
                            />
                        ))}
                    </div>
                )}

            </div>

        </div >
    );
};
