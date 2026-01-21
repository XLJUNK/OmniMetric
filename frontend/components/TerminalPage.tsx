'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { ChevronDown, Shield, Activity, Globe } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';

interface TerminalPageProps {
    pageKey: 'about' | 'legal' | 'archive';
    children: React.ReactNode;
    lang?: LangType; // Optional: If provided, overrides searchParams
    selectorMode?: 'query' | 'path'; // Optional: Defaults to 'query'
}

export const TerminalPage = ({ pageKey, children, lang: propLang, selectorMode = 'query' }: TerminalPageProps) => {
    const searchParams = useSearchParams();
    // Use propLang if available (path mode), otherwise fallback to query param
    const lang = propLang || (searchParams.get('lang') as LangType) || 'JP';
    const t = DICTIONARY[lang];

    if (!t) return null;

    const pageData = t.subpages[pageKey] as any;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-800 dark:text-[#E0E0E0] font-sans selection:bg-sky-500 selection:text-white">
            <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20 lg:px-24">
                {/* 1. TOP NAV / BREADCRUMB */}
                <div className="flex justify-end items-center mb-16 opacity-100">
                    <LanguageSelector currentLang={lang} mode={selectorMode} />
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
