'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { useSearchParams } from 'next/navigation';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { Clock, Shield, AlertTriangle } from 'lucide-react';

import { DynamicStructuredData } from '@/components/DynamicStructuredData';

interface ArchiveClientProps {
    date: string;
    lang: LangType;
    selectorMode?: 'query' | 'path';
    initialData?: any;
}

function ArchiveDetailContent({ date, lang, selectorMode, initialData }: ArchiveClientProps) {
    const searchParams = useSearchParams();
    const t = DICTIONARY[lang];
    const [data, setData] = useState<{
        gms_score: number;
        last_updated: string;
        analysis?: { reports?: Record<string, string>; content?: string; title?: string };
        market_data: Record<string, { price: string | number }>;
    } | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (initialData || !date) return;
        setLoading(true);
        fetch(`/data/archive/${date}.json`)
            .then(res => res.json())
            .then(d => {
                if (!d.error) setData(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [date, initialData]);

    if (!t) return null;

    if (loading && !data) {
        return (
            <TerminalPage pageKey="archive" lang={lang} selectorMode={selectorMode}>
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <div className="w-12 h-12 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                    <span className="text-[10px] font-mono text-sky-500 tracking-[0.5em] uppercase">ACCESSING HISTORICAL VAULT...</span>
                </div>
            </TerminalPage>
        );
    }

    if (!data) {
        return (
            <TerminalPage pageKey="archive" lang={lang} selectorMode={selectorMode}>
                <div className="border border-red-500/20 bg-red-500/5 p-12 text-center rounded-[2px] space-y-4">
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
                    <p className="text-red-500 font-bold uppercase tracking-widest">Archive Data Corrupted or Missing</p>
                </div>
            </TerminalPage>
        );
    }

    // Regime Logic (simplified from Dashboard)
    const score = data.gms_score;
    const isBull = score > 60;
    const isBear = score < 40;
    const regimeLabel = isBull ? t.regime.bull : (isBear ? t.regime.bear : t.regime.neutral);
    const regimeColorClass = isBull ? "bg-[#00D4FF]" : (isBear ? "bg-[#FF4D4D]" : "bg-[#FFC107]");
    const regimeTextClass = isBull ? "text-[#00D4FF]" : (isBear ? "text-[#FF4D4D]" : "text-[#FFC107]");

    return (
        <TerminalPage pageKey="archive" lang={lang} selectorMode={selectorMode}>
            <div className="space-y-16">
                <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                    <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest leading-relaxed">Recorded Algorithmic Intelligence Snapshot</p>
                </div>

                {/* 1. HEADER SNAPSHOT */}
                <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-8 md:p-12 rounded-[2px] flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-sm dark:shadow-none">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">{data.last_updated}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full ${regimeColorClass}`}></div>
                            <h2 className="text-3xl font-black italic uppercase italic tracking-tighter">{regimeLabel}</h2>
                        </div>
                        <p className="text-[10px] text-sky-500/60 font-mono uppercase tracking-[0.2em]">{t.titles.analysis_history || "Analysis History"}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <span className="block text-[10px] text-slate-500 font-bold tracking-widest uppercase">HISTORICAL GMS</span>
                            <span className={`text-6xl font-black italic leading-none ${regimeTextClass}`}>{score}</span>
                        </div>
                    </div>
                </div>

                {/* 2. INSIGHTS BOX */}
                <div className="bg-sky-50 dark:bg-sky-500/5 border border-sky-200 dark:border-sky-500/20 p-8 rounded-[2px] space-y-4">
                    <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-sky-500" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-sky-500">ARCHIVED INTELLIGENCE</span>
                    </div>
                    <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                        {data.analysis?.reports?.[lang] || data.analysis?.content}
                    </p>
                </div>

                {/* 3. INDICATOR GRID (Simplified 3-Column) */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xs font-black tracking-[0.4em] uppercase opacity-40">INDICATOR LOG (REPLAY)</h3>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(data.market_data as Record<string, { price: string | number }>).map(([key, val]) => {
                            const term = (t.terms as Record<string, { def: string; benchmark: string }>)[key] || { def: key, benchmark: "" };
                            return (
                                <div key={key} className="bg-white dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/5 p-6 rounded-[2px] space-y-4 hover:border-sky-300 dark:hover:border-white/10 transition-all shadow-sm dark:shadow-none">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{key}</span>
                                        <span className="text-xl font-bold font-mono tracking-tighter text-slate-900 dark:text-white">{val.price}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight uppercase line-clamp-2">{term.def}</p>
                                        <p className="text-[7px] text-sky-600/60 dark:text-sky-500/40 font-mono font-bold uppercase">{term.benchmark}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 4. GMS PERFORMANCE AUDIT */}
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2px] space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-sm font-black tracking-widest uppercase">{t.subpages.archive.audit_title}</h3>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                                {data ? t.subpages.archive.signal_verified : t.subpages.archive.awaiting_data}
                            </span>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono leading-relaxed uppercase tracking-wider">
                        {data ? t.subpages.archive.signal_verified : t.subpages.archive.awaiting_data} — Computed under Sovereign v6.0 Protocol.
                    </p>
                </div>

                {/* MANDATORY LEGAL DISCLAIMER */}
                <div className="mt-24 pt-12 border-t border-slate-200 dark:border-white/5">
                    <p className="text-[10px] md:text-xs font-black text-slate-500 tracking-widest leading-relaxed uppercase text-center max-w-2xl mx-auto italic">
                        {t.subpages.archive.disclaimer}
                    </p>
                </div>
            </div>
        </TerminalPage>
    );
}

export default function ArchiveClient({ date, lang, selectorMode, initialData }: ArchiveClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center text-sky-500 font-mono text-xs animate-pulse">RECONSTRUCTING MARKET STATE...</div>}>
            <DynamicStructuredData data={initialData} />
            <ArchiveDetailContent date={date} lang={lang} selectorMode={selectorMode} initialData={initialData} />
        </Suspense>
    );
}
