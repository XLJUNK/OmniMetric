'use client';

import React, { useState, useEffect } from 'react';
import { TerminalPage } from './TerminalPage';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { FileText, TrendingDown, TrendingUp, Activity, BarChart3, AlertCircle, Shield } from 'lucide-react';
import Link from 'next/link';

interface MonthlySummary {
    month: string;
    title: string;
    reports: Record<string, string>;
    stats: {
        avg_score: number;
        max_score: number;
        min_score: number;
        data_points: number;
    };
    generated_at: string;
}

interface MonthlyArchiveClientProps {
    month: string;
    lang: LangType;
    selectorMode?: 'query' | 'path';
}

export const MonthlyArchiveClient: React.FC<MonthlyArchiveClientProps> = ({ month, lang, selectorMode = 'query' }) => {
    const [data, setData] = useState<MonthlySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const t = DICTIONARY[lang];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/data/archive/summary_${month}.json`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error("Failed to fetch monthly summary", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [month]);

    if (loading) {
        return (
            <TerminalPage title={`LOADING SYNOPSIS...`} lang={lang} selectorMode={selectorMode}>
                <div className="py-24 flex flex-col items-center justify-center space-y-4 animate-pulse">
                    <Activity className="w-8 h-8 text-sky-500 animate-spin" />
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Processing Intelligence...</span>
                </div>
            </TerminalPage>
        );
    }

    if (error || !data) {
        return (
            <TerminalPage title="DATA UNAVAILABLE" lang={lang} selectorMode={selectorMode}>
                <div className="py-24 flex flex-col items-center justify-center space-y-6 max-w-md mx-auto text-center">
                    <div className="p-4 bg-red-500/10 rounded-full text-red-500">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-sm font-black uppercase text-slate-900 dark:text-white">Summary Not Found</h2>
                        <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                            The requested macro intelligence report for {month} has not been generated or finalized.
                        </p>
                    </div>
                    <Link href={lang === 'EN' ? '/archive' : `/${lang.toLowerCase()}/archive`} className="text-[10px] font-black uppercase text-sky-500 underline decoration-sky-500/30 underline-offset-4 hover:decoration-sky-500 transition-all">
                        Return to Archive
                    </Link>
                </div>
            </TerminalPage>
        );
    }

    const reportText = data.reports[lang] || data.reports['EN'];
    const avgScore = data.stats.avg_score;

    return (
        <TerminalPage title={`MONTHLY SYNOPSIS: ${month}`} lang={lang} selectorMode={selectorMode}>
            <div className="max-w-4xl mx-auto space-y-12 pb-24">
                {/* HEADER SECTION */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-2xl blur opacity-25" />
                    <div className="relative p-8 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-sky-500" />
                                    <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Macro Intelligence Report</span>
                                </div>
                                <div className="text-[10px] font-mono text-slate-500">
                                    Generated: {new Date(data.generated_at).toLocaleString()}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="text-left">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Avg GMS Score</span>
                                    <span className={`text-2xl font-black font-mono tracking-tighter ${avgScore > 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {avgScore.toFixed(1)}
                                    </span>
                                </div>
                                <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
                                <div className="text-left">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                    <span className="block text-[10px] font-black text-slate-900 dark:text-white uppercase">ARCHIVED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* SUMMARY TEXT (2/3) */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2 px-1">
                            <Activity className="w-3 h-3 text-sky-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Synthesis</span>
                        </div>
                        <div className="p-8 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm space-y-6">
                            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic">
                                "{reportText}"
                            </p>
                            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                                    Computed by OmniMetric Sovereign v6.0
                                </span>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                                    <span className="text-[8px] font-black text-sky-500 uppercase">Verified Snapshot</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* METRICS SIDEBAR (1/3) */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-1">
                            <BarChart3 className="w-3 h-3 text-sky-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantitative Audit</span>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Fluctuation Range</span>
                                    <TrendingUp className="w-3 h-3 text-slate-300" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-slate-500 uppercase mb-1">Max High</span>
                                        <span className="text-lg font-black font-mono text-emerald-500">{data.stats.max_score}</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100 dark:bg-white/5" />
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-slate-500 uppercase mb-1">Max Low</span>
                                        <span className="text-lg font-black font-mono text-rose-500">{data.stats.min_score}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Data Density</span>
                                    <Activity className="w-3 h-3 text-slate-300" />
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black font-mono text-sky-500">{data.stats.data_points}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Active Logs</span>
                                </div>
                            </div>

                            <div className="p-5 bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 rounded-2xl text-center">
                                <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Archive Reference</span>
                                <p className="text-[9px] text-sky-600 dark:text-sky-400 font-mono mt-1 leading-tight">
                                    This data is persistently stored and verified against the OmniMetric sovereign protocol.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. GMS PERFORMANCE AUDIT */}
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-2xl space-y-6">
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

                {/* FOOTER NAV */}
                <div className="pt-12 border-t border-slate-200 dark:border-white/5">
                    <Link
                        href={lang === 'EN' ? '/archive' : `/${lang.toLowerCase()}/archive`}
                        className="inline-flex items-center gap-2 py-3 px-6 bg-slate-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all no-underline"
                    >
                        Back to Explorer
                    </Link>
                </div>
            </div>
        </TerminalPage>
    );
};
