'use client';
import { useSearchParams } from 'next/navigation';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTheme } from '@/components/ThemeProvider';
import React, { Suspense } from 'react';

interface TerminalPageProps {
    pageKey: 'about' | 'legal' | 'archive' | 'wiki';
    children: React.ReactNode;
    lang?: LangType; // Optional: If provided, overrides searchParams
    selectorMode?: 'query' | 'path'; // Optional: Defaults to 'query'
}

const TerminalPageContent = ({ pageKey, children, lang: propLang, selectorMode = 'query' }: TerminalPageProps) => {
    const { theme } = useTheme();
    const searchParams = useSearchParams();
    // Use propLang if available (path mode), otherwise fallback to query param
    const lang = propLang || (searchParams.get('lang') as LangType) || 'JP';
    const t = DICTIONARY[lang];

    if (!t) return null;

    const pageData = t.subpages[pageKey as keyof typeof t.subpages] as Record<string, string> || { title: pageKey.toUpperCase() };

    return (
        <div
            className={`min-h-screen text-slate-200 font-sans selection:bg-sky-500 selection:text-white bg-black`}
        >
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

export const TerminalPage = (props: TerminalPageProps) => {
    return (
        <Suspense fallback={<div className="min-h-screen opacity-0" />}>
            <TerminalPageContent {...props} />
        </Suspense>
    );
};
