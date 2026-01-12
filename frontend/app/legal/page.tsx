'use client';
export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { useSearchParams } from 'next/navigation';
import { DICTIONARY, LangType } from '@/data/dictionary';

function LegalContent() {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') as LangType) || 'JP';
    const t = DICTIONARY[lang];
    if (!t) return null;
    const pageData = t.subpages.legal;

    return (
        <TerminalPage pageKey="legal">
            <div className="max-w-4xl space-y-16">
                <section className="space-y-6">
                    <div className="flex items-center gap-3 opacity-60">
                        <div className="w-1.5 h-4 bg-red-500"></div>
                        <h2 className="text-xs font-black tracking-[0.4em] uppercase">{pageData.disclaimer}</h2>
                    </div>
                    <div className="bg-[#111] border-l-2 border-red-500/50 p-8">
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

                <div className="pt-12 border-t border-white/5 opacity-40">
                    <p className="text-[10px] font-mono tracking-widest uppercase">
                        Jurisdiction: Institutional Digital Domain // Compliance ID: OMNI-2026-X
                    </p>
                </div>
            </div>
        </TerminalPage>
    );
}

export default function LegalPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-sky-500 font-mono text-xs animate-pulse">LOADING COMPLIANCE CORE...</div>}>
            <LegalContent />
        </Suspense>
    );
}
