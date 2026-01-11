'use client';

import React, { Suspense } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { useSearchParams } from 'next/navigation';
import { DICTIONARY, LangType } from '@/data/dictionary';

function AboutContent() {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') as LangType) || 'JP';
    const t = DICTIONARY[lang];
    if (!t) return null;
    const pageData = t.subpages.about;

    return (
        <TerminalPage pageKey="about">
            <div className="max-w-4xl space-y-16">
                {/* 01: Mission */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 opacity-60">
                        <div className="w-1.5 h-4 bg-cyan-500"></div>
                        <h2 className="text-xs font-black tracking-[0.4em] uppercase">{pageData.mission}</h2>
                    </div>
                    <div className="bg-[#111] border-l-2 border-cyan-500/50 p-8">
                        <p className="text-lg text-slate-300 font-medium leading-relaxed">
                            {pageData.mission_content}
                        </p>
                    </div>
                </section>

                {/* 02: Tech Methodology */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 opacity-60">
                        <div className="w-1.5 h-4 bg-sky-500"></div>
                        <h2 className="text-xs font-black tracking-[0.4em] uppercase">{pageData.tech}</h2>
                    </div>
                    <div className="space-y-4">
                        <p className="text-base text-slate-400 leading-relaxed font-mono whitespace-pre-line">
                            {pageData.tech_content}
                        </p>
                    </div>
                </section>

                {/* 03: Legal Protocol / Footer Note */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 opacity-60">
                        <div className="w-1.5 h-4 bg-red-500"></div>
                        <h2 className="text-xs font-black tracking-[0.4em] uppercase">PROTOCOL ID: SYSTEM-0</h2>
                    </div>
                    <div className="border border-red-500/20 bg-red-950/10 p-6">
                        <p className="text-xs text-red-400/80 font-mono tracking-wide leading-relaxed">
                            {pageData.footer_note}
                        </p>
                    </div>
                </section>

                <div className="pt-12 border-t border-white/5 opacity-40">
                    <p className="text-[10px] font-mono tracking-widest uppercase">
                        System Architecture: Next-Gen LLM Core // Edge Computing Network
                    </p>
                </div>
            </div>
        </TerminalPage>
    );
}

export default function AboutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-cyan-500 font-mono text-xs animate-pulse">INITIALIZING SYSTEM INFO...</div>}>
            <AboutContent />
        </Suspense>
    );
}
