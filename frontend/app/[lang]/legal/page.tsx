import React, { Suspense } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

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

    return getMultilingualMetadata('/legal', normalizedLang, t.subpages.legal.disclaimer || "Usage & Disclaimer", "Legal information and disclaimer regarding the use of OmniMetric terminal.");
}

export default async function LegalPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;
    const t = DICTIONARY[normalizedLang];

    if (!t) return null;
    const pageData = t.subpages.legal;

    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-sky-500 font-mono text-xs animate-pulse">LOADING COMPLIANCE CORE...</div>}>
            <TerminalPage pageKey="legal">
                <div className="max-w-4xl space-y-16">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 opacity-60">
                            <div className="w-1.5 h-4 bg-red-500"></div>
                            <h2 className="text-xs font-black tracking-[0.4em] uppercase">{pageData.disclaimer}</h2>
                        </div>
                        <div className="bg-[#111] border-l-2 border-red-500/50 p-8 shadow-sm dark:shadow-none">
                            <p className="text-lg text-slate-300 font-medium leading-relaxed italic">
                                {pageData.disclaimer_content}
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3 opacity-60">
                            <div className="w-1.5 h-4 bg-sky-500"></div>
                            <h2 className="text-xs font-black tracking-[0.4em] uppercase">{pageData.usage}</h2>
                        </div>
                        <div className="space-y-4">
                            <p className="text-base text-slate-400 leading-relaxed font-mono whitespace-pre-line">
                                {pageData.usage_content}
                            </p>
                        </div>
                    </section>

                    <div className="pt-12 border-t border-slate-200 dark:border-white/5 opacity-40">
                        <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
                            Jurisdiction: Institutional Digital Domain // Compliance ID: OMNI-2026-X
                        </p>
                    </div>
                </div>
            </TerminalPage>
        </Suspense>
    );
}
