import React, { Suspense } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { ShieldCheck, Activity, Database, Info, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
import fs from 'fs';
import path from 'path';

export function generateStaticParams() {
    return Object.keys(DICTIONARY).map((lang) => ({
        lang: lang.toLowerCase(),
    }));
}

type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;
    const t = DICTIONARY[normalizedLang] || DICTIONARY.EN;
    return getMultilingualMetadata('/archive', normalizedLang, t.subpages.archive.title || "Market Archive", t.subpages.archive.subtitle || "Historical market data analysis.");
}

async function getDates() {
    const archiveDir = path.join(process.cwd(), 'public', 'data', 'archive');
    if (!fs.existsSync(archiveDir)) return [];

    // Read index.json if it exists, otherwise list files
    try {
        const indexFile = path.join(archiveDir, 'index.json');
        if (fs.existsSync(indexFile)) {
            const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
            if (data.dates) return data.dates;
        }

        // Fallback to reading files
        const files = fs.readdirSync(archiveDir);
        return files
            .filter(file => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
            .map(file => file.replace('.json', ''))
            .sort((a, b) => b.localeCompare(a)); // Descending
    } catch (e) {
        return [];
    }
}

export default async function ArchivePage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;
    const t = DICTIONARY[normalizedLang];
    const pageData = t.subpages.archive;
    const dates = await getDates();

    // Mock Audit Data (Since it's disabled for static export anyway in original code)
    // or we could fetch it if available. Original code disabled it for static export.
    const auditData = null;
    const auditLoading = false;

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sky-500 font-mono text-xs animate-pulse">LOADING HISTORICAL INDEX...</div>}>
            <TerminalPage pageKey="archive" lang={normalizedLang} selectorMode="path">
                <div className="max-w-3xl space-y-12">
                    {/* PERFORMANCE AUDIT SECTION */}
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

                    {/* LATEST SNAPSHOTS (SEO LAYER - 7 DAYS) */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Activity className="w-4 h-4 text-sky-500" />
                            <h3 className="text-xs font-black tracking-[0.4em] uppercase text-slate-500">Latest Pulse Snapshots (7 Days)</h3>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-white/5"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {dates.slice(0, 7).map((date: string) => (
                                <Link
                                    key={date}
                                    href={normalizedLang === 'EN' ? `/archive/${date}` : `/${normalizedLang.toLowerCase()}/archive/${date}`}
                                    className="group flex items-center justify-between p-4 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded hover:border-sky-500 transition-all no-underline"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-sky-500/40 group-hover:bg-sky-500 animate-pulse" />
                                        <span className="font-mono text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-sky-500">{date}</span>
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ARCHIVE EXPLORER (PERSISTENT LAYER) */}
                    <div className="pt-12 space-y-8">
                        <div className="flex items-center gap-4">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <h3 className="text-xs font-black tracking-[0.4em] uppercase text-slate-500">Historical Signal Archive</h3>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-white/5"></div>
                        </div>

                        <ArchiveCalendar
                            lang={lang.toLowerCase()}
                            t={pageData}
                        />
                    </div>

                    {/* MANDATORY LEGAL DISCLAIMER */}
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
