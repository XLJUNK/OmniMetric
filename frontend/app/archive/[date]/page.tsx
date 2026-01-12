'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { useSearchParams, useParams } from 'next/navigation';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { Activity, Clock, Shield, AlertTriangle } from 'lucide-react';

function ArchiveDetailContent() {
    const searchParams = useSearchParams();
    const params = useParams();
    const date = params.date as string;
    const lang = (searchParams.get('lang') as LangType) || 'JP';
    const t = DICTIONARY[lang];
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!date) return;
        fetch(`/api/archive/${date}`)
            .then(res => res.json())
            .then(d => {
                if (!d.error) setData(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [date]);

    if (!t) return null;

    if (loading) {
        return (
            <TerminalPage pageKey="archive">
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <div className="w-12 h-12 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                    <span className="text-[10px] font-mono text-sky-500 tracking-[0.5em] uppercase">ACCESSING HISTORICAL VAULT...</span>
                </div>
            </TerminalPage>
        );
    }

    if (!data) {
        return (
            <TerminalPage pageKey="archive">
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
    const regimeColor = isBull ? "#00D4FF" : (isBear ? "#FF4D4D" : "#FFC107");

    return (
        <TerminalPage pageKey="archive">
            <div className="space-y-16">
                <div className="border-b border-white/10 pb-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">{t.subpages.archive.title}</h2>
                    <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest leading-relaxed">Recorded Algorithmic Intelligence Snapshot</p>
                </div>

                {/* 1. HEADER SNAPSHOT */}
                <div className="bg-[#111] border border-white/5 p-8 md:p-12 rounded-[2px] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">{data.last_updated}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: regimeColor }}></div>
                            <h2 className="text-3xl font-black italic uppercase italic tracking-tighter">{regimeLabel}</h2>
                        </div>
                        <p className="text-[10px] text-sky-500/60 font-mono uppercase tracking-[0.2em]">{t.analysis_history || "Analysis History"}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <span className="block text-[10px] text-slate-500 font-bold tracking-widest uppercase">HISTORICAL GMS</span>
                            <span className="text-6xl font-black italic leading-none" style={{ color: regimeColor }}>{score}</span>
                        </div>
                    </div>
                </div>

                {/* 2. INSIGHTS BOX */}
                <div className="bg-sky-500/5 border border-sky-500/20 p-8 rounded-[2px] space-y-4">
                    <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-sky-500" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-sky-500">ARCHIVED INTELLIGENCE</span>
                    </div>
                    <p className="text-lg text-slate-300 font-medium leading-relaxed italic">
                        {data.analysis?.reports?.[lang] || data.analysis?.content}
                    </p>
                </div>

                {/* 3. INDICATOR GRID (Simplified 3-Column) */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xs font-black tracking-[0.4em] uppercase opacity-40">INDICATOR LOG (REPLAY)</h3>
                        <div className="flex-1 h-px bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(data.market_data).map(([key, val]: [string, any]) => {
                            const term = (t.terms as any)[key] || { def: key, benchmark: "" };
                            return (
                                <div key={key} className="bg-[#0e0e0e] border border-white/5 p-6 rounded-[2px] space-y-4 hover:border-white/10 transition-all">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{key}</span>
                                        <span className="text-xl font-bold font-mono tracking-tighter">{val.price}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 leading-tight uppercase line-clamp-2">{term.def}</p>
                                        <p className="text-[7px] text-sky-500/40 font-mono font-bold uppercase">{term.benchmark}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* MANDATORY LEGAL DISCLAIMER */}
                <div className="mt-24 pt-12 border-t border-white/5">
                    <p className="text-[10px] md:text-xs font-black text-slate-500 tracking-widest leading-relaxed uppercase text-center max-w-2xl mx-auto italic">
                        {t.subpages.archive.disclaimer}
                    </p>
                </div>
            </div>
        </TerminalPage>
    );
}

export default function ArchiveDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-sky-500 font-mono text-xs animate-pulse">RECONSTRUCTING MARKET STATE...</div>}>
            <ArchiveDetailContent />
        </Suspense>
    );
}
