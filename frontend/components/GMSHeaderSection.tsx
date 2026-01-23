'use client';

import React, { useState } from 'react';
import { Shield, Activity, Globe, Zap, Clock, ChevronDown, Check, Info, X, Settings } from 'lucide-react';
import { RiskGauge, HistoryChart } from '@/components/Charts';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { useDevice } from '@/hooks/useDevice';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { NewsTicker } from '@/components/NewsTicker';
import { AdUnit } from '@/components/AdUnit';
import MESSAGES from '@/data/messages.json';
import { TVPartnerCard } from '@/components/TVPartnerCard';

import { SignalData } from '@/lib/signal';

interface GMSHeaderProps {
    data: SignalData;
    lang: LangType;
    isSafeMode?: boolean;
    onOpenSettings?: () => void;
}

export const GMSHeaderSection = ({ data, lang, isSafeMode = false, onOpenSettings }: GMSHeaderProps) => {
    const [showInfo, setShowInfo] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const { isMobile } = useDevice();
    const { theme } = useTheme();
    const router = useRouter();
    const t = DICTIONARY[lang];

    // Helper to change language via URL
    const setLang = (l: LangType) => {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('lang', l);
        router.push(`${window.location.pathname}?${currentParams.toString()}`);
    };

    // 3 Dynamic Professional Fallbacks based on GMS Regime
    const getDynamicFallback = () => {
        const score = data?.gms_score || 50;
        const statusObj = (MESSAGES as any).ai_status;
        let regimeKey = "NEUTRAL";
        if (score > 60) regimeKey = "RISK_ON";
        else if (score < 40) regimeKey = "RISK_OFF";

        const fallback = statusObj[regimeKey]?.[lang] || statusObj[regimeKey]?.["EN"] || t.status.ai;
        return fallback;
    };

    // AI Report Logic
    const aiRaw = (data?.analysis?.reports as any)?.[lang]
        || (data?.analysis?.reports as any)?.[lang?.toUpperCase()]
        || data?.analysis?.content;

    let aiContent = aiRaw || getDynamicFallback();

    const PLACEHOLDER_BLOCKLIST = [
        "深度解析最新",
        "正在重新検証",
        "世界市場は主要な経済指標",
        "Deep-diving into",
        "Mendalami data makro"
    ];

    if (aiContent && typeof aiContent === 'string') {
        const isPlaceholder = PLACEHOLDER_BLOCKLIST.some(p => aiContent.includes(p));
        if (isPlaceholder || !aiRaw || aiRaw.length < 20) {
            if (aiRaw && aiRaw.includes("【GMS:")) {
                aiContent = aiRaw;
            } else {
                aiContent = getDynamicFallback();
            }
        }
    }

    // Mobile Accordion State


    if (!data) return null;

    return (
        <div className="w-full gms-container">
            {/* METHODOLOGY MODAL */}
            {showInfo && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowInfo(false)}>
                    <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                {t.methodology.title}
                            </h2>
                            <button
                                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                                onClick={() => setShowInfo(false)}
                                aria-label="Close"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 font-mono">
                            <p>{t.methodology.desc}</p>

                            <div className="space-y-4">
                                <div>
                                    <span className="block text-green-400 font-bold mb-1">{t.methodology.zone_accumulate}</span>
                                    <p className="opacity-70">{t.methodology.zone_accumulate_desc}</p>
                                </div>
                                <div>
                                    <span className="block text-yellow-400 font-bold mb-1">{t.methodology.zone_neutral}</span>
                                    <p className="opacity-70">{t.methodology.zone_neutral_desc}</p>
                                </div>
                                <div>
                                    <span className="block text-red-400 font-bold mb-1">{t.methodology.zone_defensive}</span>
                                    <p className="opacity-70">{t.methodology.zone_defensive_desc}</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-2">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">{t.methodology.inputs}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 1. Global Header Status */}
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 relative z-50 transition-colors duration-300 bg-white dark:bg-[#0A0A0A]">
                <div className="flex justify-between items-start">
                    {/* TITLE AREA */}
                    <div className="pointer-events-auto cursor-pointer" onClick={() => router.push(`/?lang=${lang}`)}>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter mb-0 leading-none hover:text-sky-500 transition-colors text-slate-900 dark:text-white">OMNIMETRIC TERMINAL</h1>
                        <h2 className="text-[10px] sm:text-sm md:text-base font-bold text-sky-500 tracking-[0.2em] uppercase mt-1">Global Macro Signal (GMS)</h2>
                        <div className="h-px w-full mt-2 bg-slate-200 dark:bg-[#1E293B]" />
                    </div>

                    {/* CONTROLS AREA (TOP RIGHT) */}
                    <div className="flex items-center gap-3">
                        {/* LANGUAGE */}
                        <div className="relative z-[10000]">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className={`flex items-center gap-2 h-7 px-3 text-[10px] font-bold uppercase tracking-widest rounded transition-all outline-none focus:outline-none appearance-none hover:opacity-80 border border-transparent ${theme === 'dark'
                                    ? 'text-[#FEF3C7]'
                                    : 'text-black'
                                    }`}
                                style={{ backgroundColor: theme === 'dark' ? '#000000' : '#F1F5F9' }}
                            >
                                {lang} <ChevronDown className="w-3 h-3" />
                            </button>
                            {isLangOpen && (
                                <div className="absolute top-full right-0 mt-1 w-24 rounded-md overflow-hidden z-[10001] pointer-events-auto bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 outline-none shadow-lg flex flex-col p-1" style={{ backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF', opacity: 1 }}>
                                    {(Object.keys(DICTIONARY) as LangType[]).map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => { setLang(l); setIsLangOpen(false); }}
                                            className={`block w-full text-left px-3 py-2 text-[10px] uppercase transition-colors outline-none focus:outline-none appearance-none border-none rounded ${lang === l
                                                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black font-black'
                                                : `bg-transparent font-bold ${theme === 'dark' ? 'text-[#FEF3C7] hover:bg-neutral-900 hover:text-white' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'}`
                                                }`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SETTINGS TRIGGER */}
                        {onOpenSettings && (
                            <button
                                onClick={onOpenSettings}
                                className="flex items-center justify-center p-0 h-7 w-7 rounded border border-transparent transition-all bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:border-neutral-800"
                                style={{ color: theme === 'dark' ? '#FEF3C7' : '#525252' }}
                                title="Customize Terminal"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Primary GMS Score & AI Insight */}
            <div className="max-w-[1600px] mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* GMS SCORE CARD */}
                <div className="lg:col-span-1 bg-white dark:bg-[#111] !rounded-xl !border !border-slate-200 dark:!border-[#1E293B] !ring-0 !outline-none !shadow-none p-4 flex flex-col items-center gap-4 relative overflow-visible group">
                    {/* RISK GAUGE & INFO */}
                    <div className="w-full px-1 pt-2 pb-6">
                        <div className="flex justify-end rtl:justify-start mb-1.5">
                            <button
                                className="text-[9px] font-mono font-bold tracking-widest text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-[#1E293B] px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-white/5"
                                onClick={() => setShowInfo(true)}
                            >
                                [ What's GMS ]
                            </button>
                        </div>
                        <RiskGauge score={data.gms_score} lang={lang} />
                    </div>

                    <div className="w-full h-[110px] z-10">
                        <HistoryChart
                            data={data.history_chart || []}
                            lang={lang}
                            color={data.gms_score > 60 ? "#3b82f6" : (data.gms_score < 40 ? "#ef4444" : "#eab308")}
                        />
                    </div>
                </div>

                {/* AI INSIGHT */}
                <div className="lg:col-span-2 bg-white dark:bg-[#111] !rounded-xl !border !border-slate-200 dark:!border-[#1E293B] !ring-0 !outline-none !shadow-none p-6 flex flex-col relative overflow-hidden group min-h-[14rem]">
                    <div className="flex items-center gap-2 mb-4 border-b !border-slate-100 dark:!border-[#1E293B] pb-3">
                        <Zap className="w-3.5 h-3.5 text-sky-500" />
                        <h3 className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em] flex-grow">OmniMetric AI-Driven Global Insights</h3>
                        <div className="hidden sm:flex items-center gap-1 opacity-50 text-[9px] text-slate-500 font-mono">
                            <Info className="w-3 h-3" /> AI-Generated
                        </div>
                    </div>

                    <div className="flex-grow mt-2">
                        <p className={`text-slate-700 dark:text-slate-300 text-fluid-base leading-relaxed font-serif italic rtl:font-arabic rtl:not-italic rtl:text-right ${lang === 'AR' ? 'text-lg leading-loose' : ''}`}>
                            "{aiContent}"
                        </p>
                    </div>

                    {/* AIO: Citation Footer */}
                    <div className="mt-6 pt-3 border-t border-slate-100 dark:border-[#1E293B] flex justify-end">
                        <p className="text-[0.56rem] text-slate-600 font-mono select-all">
                            Cite: <span className="text-slate-500">OmniMetric GMS ({new Date().toISOString().split('T')[0]}) @ omnimetric.net</span>
                        </p>
                    </div>

                    {/* AIO: AnalysisNewsArticle Schema */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "AnalysisNewsArticle",
                                "headline": `Global Market Outlook - ${new Date().toISOString().split('T')[0]}`,
                                "description": "AI-driven institutional market risk analysis",
                                "author": {
                                    "@type": "Organization",
                                    "name": "OmniMetric AI",
                                    "url": "https://omnimetric.net"
                                },
                                "publisher": {
                                    "@type": "Organization",
                                    "name": "OmniMetric Project",
                                    "url": "https://omnimetric.net",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://omnimetric.net/icon.svg"
                                    }
                                },
                                "datePublished": data.last_updated,
                                "dateModified": data.last_updated,
                                "articleBody": aiContent,
                                "articleSection": "Financial Analysis",
                                "inLanguage": lang,
                                "about": {
                                    "@type": "Thing",
                                    "name": "Global Macro Economics"
                                }
                            })
                        }}
                    />
                </div>
            </div>

            {/* PARTNER BANNER (Strategic Placement: Below AI Insight) */}
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-8">
                <TVPartnerCard lang={lang} />
            </div>

            {/* 3. News (Live Intelligence Stream) */}
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-4">
                <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-[#1E293B] rounded-xl overflow-hidden">
                    <div className="bg-slate-100 dark:bg-black/40 px-6 py-4 border-b border-slate-200 dark:border-[#1E293B]">
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{(t.titles as any).live_stream || "LIVE INTELLIGENCE STREAM"}</h3>
                    </div>
                    <NewsTicker lang={lang} />
                </div>
            </div>

            {/* 4. Breaking News / Risk Events (Optional but included per layout request) */}
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 mb-4">
                <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#1E293B] rounded-xl p-0">
                    {(!data.events || data.events.length === 0) ? (
                        <div className="p-4 text-xs text-slate-600 font-mono">NO UPCOMING RISK EVENTS DETECTED.</div>
                    ) : (
                        // SAFETY SORT: Ensure events are chronologically sorted (Fix for Localhost/Stale Data)
                        ([...(data.events || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3)).map((evt, i) => (
                            <div key={i} className="flex flex-col border-b border-slate-100 dark:border-[#1E293B] last:border-0 py-3 px-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2 rtl:flex-row-reverse rtl:justify-end">
                                    <span dir="ltr" className={`text-xs font-bold font-mono whitespace-nowrap ${evt.impact === 'CRITICAL' ? 'text-red-500' : 'text-slate-500 dark:text-slate-300'}`}>
                                        [{evt.date}]
                                    </span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide rtl:text-right">
                                        {(t.events as any)?.[evt.code] || evt.name}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 mb-8">
                <AdUnit />
            </div>
        </div >
    );
};
