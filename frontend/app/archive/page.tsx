'use client';
export const dynamic = 'force-dynamic';

import React, { Suspense, useEffect, useState } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { useSearchParams } from 'next/navigation';
import { DICTIONARY, LangType } from '@/data/dictionary';
import Link from 'next/link';
import { Calendar, ChevronRight, ShieldCheck, Activity, Database, TrendingUp, Info } from 'lucide-react';

function ArchiveListing() {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') as LangType) || 'JP';
    const t = DICTIONARY[lang];
    const [dates, setDates] = useState<string[]>([]);
    const [auditData, setAuditData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [auditLoading, setAuditLoading] = useState(true);

    useEffect(() => {
        // Fetch Archive List
        fetch('/api/archive/list')
            .then(res => res.json())
            .then(data => {
                if (data.dates) setDates(data.dates);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        // Fetch Performance Audit
        fetch('/api/archive/audit')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setAuditData(data);
                setAuditLoading(false);
            })
            .catch(() => setAuditLoading(false));
    }, []);

    if (!t) return null;
    const pageData = t.subpages.archive;

    return (
        <TerminalPage pageKey="archive">
            <div className="max-w-3xl space-y-12">
                {/* Removed redundant title section to fix duplication */}

                {/* PERFORMANCE AUDIT SECTION */}
                <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-sky-500/10 flex items-center justify-between bg-sky-500/10">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-sky-500" />
                            <span className="text-xs font-black tracking-[0.3em] text-white uppercase">GMS Performance Audit</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 bg-sky-500/20 rounded-[4px]">
                            <Activity className="w-3 h-3 text-sky-400" />
                            <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-widest">Signal Verified</span>
                        </div>
                    </div>
                    <div className="p-8 space-y-8">
                        {auditLoading ? (
                            <div className="h-24 flex items-center justify-center">
                                <span className="text-[10px] font-mono text-sky-500/50 animate-pulse tracking-[0.5em]">ANALYZING HISTORICAL BIAS...</span>
                            </div>
                        ) : auditData ? (
                            <>
                                <p className="text-lg text-slate-200 font-medium leading-relaxed italic border-l-2 border-sky-500/50 pl-6">
                                    {auditData.summaries[lang] || auditData.summaries['EN']}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-widest mb-1 text-red-400/80">Avg VIX (Defensive)</span>
                                        <span className="text-2xl font-black text-white italic">{auditData.metrics.avg_vix_defensive || '--'}</span>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-widest mb-1 text-slate-400">Avg VIX (Neutral)</span>
                                        <span className="text-2xl font-black text-white italic">{auditData.metrics.avg_vix_neutral || '--'}</span>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-widest mb-1 text-sky-400/80">Avg VIX (Accumulate)</span>
                                        <span className="text-2xl font-black text-white italic">{auditData.metrics.avg_vix_accumulate || '--'}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <Info className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Awaiting sufficient correlation data points.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* PROOF TABLE (CORRELATION REPLAY) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Database className="w-4 h-4 text-slate-500" />
                        <h3 className="text-xs font-black tracking-[0.4em] uppercase text-slate-500">Correlation Proof Table (30D)</h3>
                        <div className="flex-1 h-px bg-white/5"></div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-[10px] font-black tracking-widest text-slate-500 uppercase">Date</th>
                                    <th className="p-4 text-[10px] font-black tracking-widest text-slate-500 uppercase">GMS Score</th>
                                    <th className="p-4 text-[10px] font-black tracking-widest text-slate-500 uppercase">S&P 500 (SPY)</th>
                                    <th className="p-4 text-[10px] font-black tracking-widest text-slate-500 uppercase">Liquidity ($B)</th>
                                    <th className="p-4 text-[10px] font-black tracking-widest text-slate-500 uppercase">VIX</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {auditLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center animate-pulse text-[10px] font-mono text-slate-600 tracking-widest uppercase">Fetching Historical Ledger...</td>
                                    </tr>
                                ) : auditData && auditData.history ? (
                                    [...auditData.history].reverse().map((row: any) => (
                                        <tr key={row.date} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4 font-mono text-xs text-slate-400">{row.date}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${row.gms_score > 60 ? 'bg-sky-500' : row.gms_score < 40 ? 'bg-red-500' : 'bg-amber-500'}`} />
                                                    <span className="font-bold text-sm italic">{row.gms_score}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-xs text-white">${row.spy_price || '--'}</td>
                                            <td className="p-4 font-mono text-xs text-slate-400">{row.net_liquidity || '--'}</td>
                                            <td className="p-4 font-mono text-xs text-slate-400">{row.vix_price || '--'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-[10px] font-mono text-slate-600 tracking-widest uppercase">Initial data baseline under construction.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SNAPSHOT EXPLORER HEADER */}
                <div className="flex items-center gap-4 pt-12">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <h3 className="text-xs font-black tracking-[0.4em] uppercase text-slate-500">Historical Snapshot Explorer</h3>
                    <div className="flex-1 h-px bg-white/5"></div>
                </div>

                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-[#111] border border-white/5 rounded-[2px]"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dates.length > 0 ? (
                            dates.map(date => (
                                <Link
                                    key={date}
                                    href={`/archive/${date}?lang=${lang}`}
                                    className="group bg-[#111] border border-white/5 p-6 rounded-[2px] flex items-center justify-between hover:bg-sky-500/5 hover:border-sky-500/30 transition-all no-underline"
                                >
                                    <div className="flex items-center gap-4">
                                        <Calendar className="w-4 h-4 text-sky-500 opacity-60 group-hover:opacity-100" />
                                        <span className="font-mono text-lg font-bold tracking-tighter text-slate-300 group-hover:text-white">{date}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-sky-500 transform group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full border border-dashed border-white/10 p-12 text-center">
                                <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">No historical data found in local vaults.</span>
                            </div>
                        )}
                    </div>
                )}

                {/* MANDATORY LEGAL DISCLAIMER */}
                <div className="mt-24 pt-12 border-t border-white/5">
                    <p className="text-[10px] md:text-xs font-black text-slate-500 tracking-widest leading-relaxed uppercase text-center max-w-2xl mx-auto italic">
                        {pageData.disclaimer}
                    </p>
                </div>
            </div>
        </TerminalPage>
    );
}

export default function ArchivePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-sky-500 font-mono text-xs animate-pulse">LOADING HISTORICAL INDEX...</div>}>
            <ArchiveListing />
        </Suspense>
    );
}
