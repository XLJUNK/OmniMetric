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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-12">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 opacity-60">
                            <div className="w-1.5 h-4 bg-sky-500"></div>
                            <h2 className="text-xs font-black tracking-[0.4em] uppercase">{pageData.mission}</h2>
                        </div>
                        <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed">
                            {pageData.mission_content}
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3 opacity-60">
                            <div className="w-1.5 h-4 bg-sky-500"></div>
                            <h2 className="text-xs font-black tracking-[0.4em] uppercase">{pageData.tech}</h2>
                        </div>
                        <p className="text-base text-slate-400 leading-relaxed font-mono">
                            {pageData.tech_content}
                        </p>
                    </section>
                </div>

                <div className="bg-[#111] border border-white/5 p-12 rounded-[2px] flex flex-col justify-center space-y-8">
                    <div className="space-y-2">
                        <span className="text-[10px] text-sky-500 font-bold tracking-widest uppercase">System Version</span>
                        <p className="text-3xl font-black italic">OMNIMETRIC v1.0.0</p>
                    </div>
                    <div className="h-px bg-white/5"></div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Uptime</span>
                            <p className="text-sm font-mono text-emerald-500">99.9% AUTONOMOUS</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Data Feeds</span>
                            <p className="text-sm font-mono">FRED / YAHOO / GEMINI</p>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5">
                        <p className="text-[10px] font-mono text-slate-500 uppercase leading-relaxed tracking-wider italic">
                            {/* @ts-ignore */}
                            {pageData.footer_note}
                        </p>
                    </div>
                </div>
            </div>
        </TerminalPage>
    );
}

export default function AboutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-sky-500 font-mono text-xs animate-pulse">LOADING TERMINAL CORE...</div>}>
            <AboutContent />
        </Suspense>
    );
}
