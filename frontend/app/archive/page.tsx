import React, { Suspense } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { ShieldCheck, Activity, Database, Info, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
import fs from 'fs';
import path from 'path';

export async function generateMetadata(): Promise<Metadata> {
    const normalizedLang = 'EN';
    const t = DICTIONARY[normalizedLang];
    return getMultilingualMetadata('/archive', normalizedLang, t.subpages.archive.title || "Market Archive", t.subpages.archive.subtitle || "Historical market data analysis.");
}

async function getDates() {
    const archiveDir = path.join(process.cwd(), 'public', 'data', 'archive');
    if (!fs.existsSync(archiveDir)) return [];

    try {
        const indexFile = path.join(archiveDir, 'index.json');
        if (fs.existsSync(indexFile)) {
            const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
            if (data.dates) return data.dates;
        }

        const files = fs.readdirSync(archiveDir);
        return files
            .filter(file => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
            .map(file => file.replace('.json', ''))
            .sort((a, b) => b.localeCompare(a));
    } catch (e) {
        return [];
    }
}

export default async function ArchiveRootPage() {
    const normalizedLang = 'EN';
    const t = DICTIONARY[normalizedLang];
    const pageData = t.subpages.archive;
    const dates = await getDates();

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sky-500 font-mono text-xs animate-pulse">LOADING HISTORICAL INDEX...</div>}>
            <TerminalPage pageKey="archive" lang={normalizedLang} selectorMode="path">
                <div className="max-w-3xl space-y-12">
                    <div className="bg-sky-50 dark:bg-sky-500/5 border border-sky-200 dark:border-sky-500/20 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-sky-200 dark:border-sky-500/10 flex items-center justify-between bg-sky-100 dark:bg-sky-500/10">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-sky-500" />
                                <span className="text-xs font-black tracking-[0.3em] text-sky-900 dark:text-white uppercase">GMS Performance Audit</span>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-1 bg-sky-200 dark:bg-sky-500/20 rounded-[4px]">
                                <Activity className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                                <span className="text-[10px] font-mono text-sky-700 dark:text-sky-400 font-bold uppercase tracking-widest">Signal Verified</span>
                            </div>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="text-center py-8">
                                <Info className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Awaiting sufficient correlation data points.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-12">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <h3 className="text-xs font-black tracking-[0.4em] uppercase text-slate-500">Historical Snapshot Explorer</h3>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/5"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dates.length > 0 ? (
                            dates.map((date: string) => (
                                <Link
                                    key={date}
                                    href={`/en/archive/${date}`}
                                    className="group bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-6 rounded-[2px] flex items-center justify-between hover:bg-sky-50 dark:hover:bg-sky-500/5 hover:border-sky-300 dark:hover:border-sky-500/30 transition-all no-underline shadow-sm dark:shadow-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <Calendar className="w-4 h-4 text-sky-500 opacity-60 group-hover:opacity-100" />
                                        <span className="font-mono text-lg font-bold tracking-tighter text-slate-700 dark:text-slate-300 group-hover:text-sky-900 dark:group-hover:text-white">{date}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-sky-500 transform group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full border border-dashed border-slate-300 dark:border-white/10 p-12 text-center">
                                <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">No historical data found in local vaults.</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-24 pt-12 border-t border-slate-200 dark:border-white/5">
                        <p className="text-[10px] md:text-xs font-black text-slate-500 tracking-widest leading-relaxed uppercase text-center max-w-2xl mx-auto italic">
                            {pageData.disclaimer}
                        </p>
                    </div>
                </div>
            </TerminalPage>
        </Suspense>
    );
}
