'use client';

import React, { useState } from 'react';
import { Shield, Activity, Globe, Zap, Clock, ChevronDown, Check, Info, X } from 'lucide-react';
import { RiskGauge, HistoryChart } from '@/components/Charts';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { useRouter } from 'next/navigation';
import { NewsTicker } from '@/components/NewsTicker';
import { AdUnit } from '@/components/AdUnit';

interface SignalData {
    last_updated: string;
    gms_score: number;
    sector_scores?: Record<string, number>;
    market_data: any;
    analysis: any;
    events: any[];
    history_chart: any[];
}

interface GMSHeaderProps {
    data: SignalData;
    lang: LangType;
}

export const GMSHeaderSection = ({ data, lang }: GMSHeaderProps) => {
    const [showInfo, setShowInfo] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const router = useRouter();
    const t = DICTIONARY[lang];

    // Helper to change language via URL
    const setLang = (l: LangType) => {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('lang', l);
        router.push(`${window.location.pathname}?${currentParams.toString()}`);
    };

    // AI Report Logic
    const aiContent = (data?.analysis?.reports as any)?.[lang]
        || (data?.analysis?.reports as any)?.[lang?.toUpperCase()]
        || data?.analysis?.content
        || (t?.chart as any)?.sync
        || "Gathering Global Intelligence...";

    if (!data) return null;

    return (
        <div className="w-full">
            {/* METHODOLOGY MODAL */}
            {showInfo && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowInfo(false)}>
                    <div className="bg-[#111] border border-slate-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => setShowInfo(false)}>
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-b border-slate-800 pb-2">
                            {t.methodology.title}
                        </h2>
                        <div className="space-y-6 text-sm text-slate-300 font-mono">
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

                            <div className="border-t border-slate-800 pt-4 flex flex-col gap-2">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">{t.methodology.inputs}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 1. Global Header Status */}
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-2 border-b border-slate-800 relative z-10 bg-[#0A0A0A]">
                <div className="flex justify-between items-start mb-6 relative z-50">
                    <div className="pointer-events-auto cursor-pointer" onClick={() => router.push(`/?lang=${lang}`)}>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-0 leading-none hover:text-sky-500 transition-colors">OMNIMETRIC TERMINAL</h1>
                        <h2 className="text-sm md:text-base font-bold text-sky-500 tracking-[0.2em] uppercase mt-1">Global Macro Signal (GMS)</h2>
                    </div>

                    <div className="flex flex-col items-end pointer-events-auto transition-all duration-300">
                        {/* LANGUAGE SWITCHER */}
                        <div className="relative z-[10000] mb-0 pointer-events-auto">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-2 h-6 px-3 bg-[#1e293b] border border-[#fef3c7]/30 text-[#fef3c7] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-colors shadow-lg"
                            >
                                {lang} <ChevronDown className="w-3 h-3" />
                            </button>
                            {isLangOpen && (
                                <div className="absolute top-full right-0 mt-1 w-24 bg-[#1e293b] border border-[#fef3c7]/30 rounded shadow-xl overflow-hidden z-[10001] pointer-events-auto ring-1 ring-[#fef3c7]/20">
                                    {(Object.keys(DICTIONARY) as LangType[]).map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => { setLang(l); setIsLangOpen(false); }}
                                            className={`block w-full text-left px-3 py-2 text-[10px] font-bold uppercase transition-colors ${lang === l
                                                ? 'bg-[#fef3c7]/20 text-[#fef3c7]'
                                                : 'bg-transparent text-[#fef3c7]/60 hover:bg-[#fef3c7]/10 hover:text-[#fef3c7]'
                                                }`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* STATUS, DATE */}
                        <div className="flex flex-col items-end gap-1 mt-10">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[9px] text-green-500 font-mono font-bold tracking-[0.2em] uppercase">System Operational • 12ms</span>
                            </div>
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{data.last_updated}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Primary GMS Score & AI Insight */}
            <div className="max-w-[1600px] mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* GMS SCORE CARD */}
                {/* GMS SCORE CARD - FORCE STYLE OVERRIDE */}
                <div className="lg:col-span-1 bg-[#111] !rounded-xl !border !border-[#1E293B] !ring-0 !outline-none !shadow-none p-4 flex flex-col items-center gap-4 relative overflow-visible group">
                    {/* Removed Gradient Overlay for Flat Matte Look */}

                    {/* RISK GAUGE & INFO */}
                    <div className="w-full px-1 pt-2 pb-6">
                        <div className="flex justify-end mb-1.5">
                            <button
                                className="text-[9px] font-mono font-bold tracking-widest text-slate-500 hover:text-white transition-colors cursor-pointer border border-[#1E293B] px-2 py-0.5 rounded hover:bg-white/5"
                                onClick={() => setShowInfo(true)}
                            >
                                [ What's GMS ]
                            </button>
                        </div>
                        <RiskGauge score={data.gms_score} />
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
                {/* AI INSIGHT - FORCE STYLE OVERRIDE */}
                <div className="lg:col-span-2 bg-[#111] !rounded-xl !border !border-[#1E293B] !ring-0 !outline-none !shadow-none p-6 flex flex-col relative overflow-hidden group">
                    <div className="flex items-center gap-2 mb-6 border-b !border-[#1E293B] pb-4">
                        <Zap className="w-4 h-4 text-sky-500" />
                        <h3 className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em] flex-grow">OmniMetric AI-Driven Global Insights</h3>
                        <div className="hidden group-hover:flex items-center gap-1 opacity-50 text-[9px] text-slate-500 font-mono">
                            <Info className="w-3 h-3" /> AI-Generated
                        </div>
                    </div>
                    <div className="flex-grow flex items-center">
                        <p className="text-slate-300 text-sm md:text-lg leading-relaxed font-serif italic">
                            "{aiContent}"
                        </p>
                    </div>
                    {/* AIO: Citation Footer */}
                    <div className="mt-4 pt-3 border-t border-[#1E293B] flex justify-end">
                        <p className="text-[9px] text-slate-600 font-mono select-all">
                            Cite this analysis as: <span className="text-slate-500">OmniMetric Global Macro Signal ({new Date().toISOString().split('T')[0]}). Retrieving from omnimetric.net</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. News (Live Intelligence Stream) */}
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-4">
                <div className="bg-[#0f172a] border border-[#1E293B] rounded-xl overflow-hidden">
                    <div className="bg-black/40 px-6 py-4 border-b border-[#1E293B]">
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{(t.titles as any).live_stream || "LIVE INTELLIGENCE STREAM"}</h3>
                    </div>
                    <NewsTicker lang={lang} />
                </div>
            </div>

            {/* 4. Breaking News / Risk Events (Optional but included per layout request) */}
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 mb-4">
                <div className="bg-black border border-[#1E293B] rounded-xl p-0">
                    {(!data.events || data.events.length === 0) ? (
                        <div className="p-4 text-xs text-slate-600 font-mono">NO UPCOMING RISK EVENTS DETECTED.</div>
                    ) : (
                        (data.events || []).slice(0, 3).map((evt, i) => (
                            <div key={i} className="flex flex-col border-b border-[#1E293B] last:border-0 py-3 px-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold font-mono ${evt.impact === 'CRITICAL' ? 'text-red-500' : 'text-slate-300'}`}>
                                        [{evt.date}]
                                    </span>
                                    <span className="text-sm font-bold text-slate-200 uppercase tracking-wide">
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
        </div>
    );
};
