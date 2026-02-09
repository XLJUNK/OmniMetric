import React, { Suspense } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { Shield, Sparkles, Database, TrendingUp, Cpu, Terminal } from 'lucide-react';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

export function generateStaticParams() {
    return Object.keys(DICTIONARY).filter((lang) => lang !== 'EN').map((lang) => ({
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
    return getMultilingualMetadata('/about', normalizedLang, t.subpages.about.title || "About OmniMetric", t.subpages.about.subtitle || "Institutional Grade Macro Analysis.");
}

export default async function AboutPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;
    const d = DICTIONARY[normalizedLang];
    const about = d.subpages.about;

    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-cyan-500 font-mono text-xs animate-pulse text-center">
            <div className="space-y-4">
                <Terminal className="w-8 h-8 mx-auto mb-2 animate-bounce" />
                <p className="tracking-[0.5em] uppercase">LOADING SYSTEM INFO...</p>
                <p className="text-[10px] opacity-50">HEURISTIC ENGINE INITIALIZING</p>
            </div>
        </div>}>
            <TerminalPage pageKey="about" lang={normalizedLang} selectorMode="path">
                <div className="max-w-4xl space-y-12">
                    {/* Hero Section */}
                    <section id="about" className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Shield className="w-8 h-8 text-cyan-500" />
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                                {about.title}
                            </h1>
                        </div>
                        <p className="text-xl text-slate-300 leading-relaxed font-medium">
                            {about.subtitle}
                        </p>
                    </section>

                    {/* What We Are */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-cyan-500"></div>
                            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-slate-400">
                                {about.what_is_title}
                            </h2>
                        </div>
                        <div className="bg-[#111] border border-slate-800 rounded-xl p-8 space-y-4 shadow-sm">
                            <p className="text-base text-slate-300 leading-relaxed">
                                {about.what_is_content}
                            </p>
                        </div>
                    </section>

                    {/* Our Unique Approach */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-slate-400">
                                {about.diff_title}
                            </h2>
                        </div>
                        <div className="grid gap-4">
                            <div className="bg-[#111] border border-slate-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-yellow-500 mb-3 uppercase tracking-wide">
                                    {about.diff_card_1_title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {about.diff_card_1_content}
                                </p>
                            </div>
                            <div className="bg-[#111] border border-slate-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-sky-400 mb-3 uppercase tracking-wide">
                                    {about.diff_card_2_title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {about.diff_card_2_content}
                                </p>
                            </div>
                            <div className="bg-[#111] border border-slate-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-green-400 mb-3 uppercase tracking-wide">
                                    {about.diff_card_3_title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {about.diff_card_3_content}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Proprietary Macro Engine: The Four Pillars */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-5 h-5 text-amber-500" />
                            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-slate-400">
                                {about.pillars_title || "Proprietary Macro Engine: The Four Pillars"}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* GMS Score */}
                            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 group hover:border-amber-500/50 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    <h3 className="font-black text-white tracking-widest uppercase italic">GMS SCORE</h3>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {d.methodology.desc}
                                </p>
                            </div>

                            {/* OGV */}
                            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 group hover:border-cyan-500/50 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingUp className="w-5 h-5 text-cyan-500" />
                                    <h3 className="font-black text-white tracking-widest uppercase italic">{d.modals.ogv.title}</h3>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {d.modals.ogv.func_desc}
                                </p>
                            </div>

                            {/* OWB */}
                            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 group hover:border-red-500/50 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield className="w-5 h-5 text-red-500" />
                                    <h3 className="font-black text-white tracking-widest uppercase italic">{d.modals.owb.title}</h3>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {d.modals.owb.func_desc}
                                </p>
                            </div>

                            {/* OTG */}
                            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 group hover:border-green-500/50 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <Database className="w-5 h-5 text-green-500" />
                                    <h3 className="font-black text-white tracking-widest uppercase italic">{d.modals.otg.title}</h3>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {d.modals.otg.func_desc}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Mission */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-slate-400">
                                {about.mission}
                            </h2>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8">
                            <p className="text-lg text-green-100 leading-relaxed font-medium italic">
                                &quot;{about.mission_content_highlight}&quot;
                            </p>
                        </div>
                    </section>

                    {/* Technology Stack */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Database className="w-5 h-5 text-purple-500" />
                            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-slate-400">
                                {about.tech}
                            </h2>
                        </div>
                        <div className="bg-[#111] border border-slate-800 rounded-xl p-6 space-y-3 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 font-mono">
                                <div className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                                    {about.tech_stack_frontend}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                                    {about.tech_stack_backend}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                                    {about.tech_stack_ai}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                                    {about.tech_stack_pipeline}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-800">
                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Terminal className="w-3 h-3" />
                                    {about.data_sources_title}
                                </p>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {about.data_sources_content}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Legal Disclaimer */}
                    <section className="space-y-4">
                        <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-6">
                            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-red-400 mb-3 flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5" />
                                {about.disclaimer_title}
                            </h3>
                            <p className="text-xs text-red-300/80 leading-relaxed">
                                {about.disclaimer_content}
                            </p>
                        </div>
                    </section>

                    {/* Footer Note */}
                    <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-xl">
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Cpu className="w-5 h-5 text-amber-500" />
                            </div>
                            <p className="text-xs font-bold text-amber-500 leading-relaxed">
                                {about.footer_note}
                            </p>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="pt-8 border-t border-slate-200 dark:border-slate-800 opacity-50">
                        <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
                            {about.system_status} 2026-02-03
                        </p>
                    </div>
                </div>
            </TerminalPage>
        </Suspense>
    );
}
