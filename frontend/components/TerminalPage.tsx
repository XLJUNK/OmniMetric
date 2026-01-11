'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { ChevronDown, Shield, Activity, Globe } from 'lucide-react';

interface TerminalPageProps {
    pageKey: 'about' | 'legal' | 'archive';
    children: React.ReactNode;
}

export const TerminalPage = ({ pageKey, children }: TerminalPageProps) => {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') as LangType) || 'JP';
    const t = DICTIONARY[lang];

    if (!t) return null;

    const pageData = t.subpages[pageKey] as any;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-sans selection:bg-sky-500 selection:text-white">
            <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20 lg:px-24">
                {/* 1. TOP NAV / BREADCRUMB */}
                <div className="flex justify-between items-center mb-16 opacity-60">
                    <Link href={`/?lang=${lang}`} className="flex items-center gap-3 group no-underline">
                        <div className="w-8 h-8 rounded-full border border-sky-500/30 flex items-center justify-center group-hover:bg-sky-500/10 transition-all">
                            <span className="text-sky-500 text-xs font-black">←</span>
                        </div>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase group-hover:text-white transition-colors">{t.labels.back_to_terminal}</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Globe className="w-3 h-3 text-sky-500" />
                        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{lang} MODE</span>
                    </div>
                </div>

                {/* 2. PAGE HEADER */}
                <div className="mb-20 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-8 bg-sky-500 rounded-full"></div>
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                            {pageData.title}
                        </h1>
                    </div>
                    {pageData.desc && (
                        <p className="text-slate-400 text-sm max-w-2xl font-mono tracking-widest leading-relaxed uppercase opacity-80">
                            {pageData.desc}
                        </p>
                    )}
                </div>

                {/* 3. CONTENT AREA */}
                <div className="min-h-[50vh]">
                    {children}
                </div>
            </div>
        </div>
    );
};
