'use client';
export const dynamic = 'force-dynamic';

import React, { Suspense, useEffect, useState } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { useSearchParams } from 'next/navigation';
import { DICTIONARY, LangType } from '@/data/dictionary';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';

function ArchiveListing() {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') as LangType) || 'JP';
    const t = DICTIONARY[lang];
    const [dates, setDates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/archive/list')
            .then(res => res.json())
            .then(data => {
                if (data.dates) setDates(data.dates);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (!t) return null;
    const pageData = t.subpages.archive;

    return (
        <TerminalPage pageKey="archive">
            <div className="max-w-3xl space-y-12">
                <p className="text-slate-400 font-mono text-sm tracking-widest leading-relaxed uppercase">
                    {pageData.desc}
                </p>

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
