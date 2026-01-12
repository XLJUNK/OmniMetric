'use client';
export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { useSearchParams } from 'next/navigation';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { Shield, Sparkles, Database, TrendingUp } from 'lucide-react';

function AboutContent() {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') as LangType) || 'EN';
    const t = DICTIONARY[lang];
    if (!t) return null;

    return (
        <TerminalPage pageKey="about">
            <div className="max-w-4xl space-y-12">
                {/* Hero Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Shield className="w-8 h-8 text-cyan-500" />
                        <h1 className="text-3xl font-black tracking-tight text-white">
                            About OmniMetric
                        </h1>
                    </div>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        AI-Driven Institutional Macro Analysis Terminal for Retail Investors
                    </p>
                </section>

                {/* What We Are */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-cyan-500"></div>
                        <h2 className="text-sm font-black tracking-[0.3em] uppercase text-slate-400">
                            What is OmniMetric?
                        </h2>
                    </div>
                    <div className="bg-[#111] !border !border-slate-800 !rounded-xl p-8 space-y-4">
                        <p className="text-base text-slate-300 leading-relaxed">
                            OmniMetric is an <strong className="text-white">AI-driven macro economic analysis terminal</strong> that transforms institutional-grade financial data into actionable insights for retail investors.
                        </p>
                        <p className="text-base text-slate-300 leading-relaxed">
                            Unlike traditional financial news sites that focus on headlines and opinions, we process real-time market data through sophisticated algorithms to generate our proprietary <strong className="text-cyan-400">Global Macro Signal (GMS) Score</strong>—a quantitative risk index from 0 to 100.
                        </p>
                    </div>
                </section>

                {/* Our Unique Approach */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-sm font-black tracking-[0.3em] uppercase text-slate-400">
                            What Makes Us Different
                        </h2>
                    </div>
                    <div className="grid gap-4">
                        <div className="bg-[#111] !border !border-slate-800 !rounded-xl p-6">
                            <h3 className="text-sm font-bold text-yellow-400 mb-3 uppercase tracking-wide">
                                📊 Institutional-Grade Data Sources
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                We analyze <strong>Net Liquidity</strong> (Federal Reserve Balance Sheet - TGA - RRP), <strong>MOVE Index</strong> (bond volatility), and <strong>High Yield Credit Spreads</strong>—metrics typically reserved for hedge funds and institutional investors.
                            </p>
                        </div>
                        <div className="bg-[#111] !border !border-slate-800 !rounded-xl p-6">
                            <h3 className="text-sm font-bold text-sky-400 mb-3 uppercase tracking-wide">
                                🤖 AI-Powered Real-Time Analysis
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Our proprietary algorithms process data from FRED, CBOE, Yahoo Finance, and alternative sources every 60 seconds, generating multilingual AI insights powered by Google Gemini.
                            </p>
                        </div>
                        <div className="bg-[#111] !border !border-slate-800 !rounded-xl p-6">
                            <h3 className="text-sm font-bold text-green-400 mb-3 uppercase tracking-wide">
                                🎯 Quantitative Risk Scoring
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                The GMS Score eliminates subjective opinions, providing a data-driven, objective assessment of global market risk levels in real-time.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <h2 className="text-sm font-black tracking-[0.3em] uppercase text-slate-400">
                            Our Mission
                        </h2>
                    </div>
                    <div className="bg-gradient-to-br from-green-950/20 to-blue-950/20 !border !border-green-500/30 !rounded-xl p-8">
                        <p className="text-lg text-green-100 leading-relaxed font-medium">
                            To democratize access to institutional-grade macro analysis by visualizing <strong>structural economic shifts</strong> that impact all investors—from retail traders to long-term portfolio managers.
                        </p>
                    </div>
                </section>

                {/* Technology Stack */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-purple-500" />
                        <h2 className="text-sm font-black tracking-[0.3em] uppercase text-slate-400">
                            Technology & Data Sources
                        </h2>
                    </div>
                    <div className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 font-mono">
                            <div>
                                <span className="text-slate-600">Frontend:</span> Next.js 15 + TypeScript
                            </div>
                            <div>
                                <span className="text-slate-600">Backend:</span> Python + FastAPI
                            </div>
                            <div>
                                <span className="text-slate-600">AI Engine:</span> Google Gemini 2.0 Flash
                            </div>
                            <div>
                                <span className="text-slate-600">Data Pipeline:</span> Real-time REST APIs
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Data Sources:</p>
                            <p className="text-sm text-slate-400">
                                Federal Reserve Economic Data (FRED), CBOE Market Volatility Indices, Yahoo Finance, Financial Modeling Prep, Alternative.me Crypto Fear & Greed
                            </p>
                        </div>
                    </div>
                </section>

                {/* Legal Disclaimer */}
                <section className="space-y-4">
                    <div className="!border !border-red-500/30 bg-red-950/10 !rounded-xl p-6">
                        <h3 className="text-xs font-black tracking-[0.3em] uppercase text-red-400 mb-3">
                            Important Disclaimer
                        </h3>
                        <p className="text-xs text-red-300/80 leading-relaxed">
                            OmniMetric is provided for <strong>informational purposes only</strong> and does not constitute investment advice. All data is sourced from public APIs and third-party providers. We do not guarantee accuracy, completeness, or timeliness. Investment decisions are the sole responsibility of the user.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <div className="pt-8 border-t border-slate-800 opacity-50">
                    <p className="text-[10px] font-mono tracking-widest uppercase text-slate-600">
                        System Status: Operational // Version 2.0 // Updated {new Date().toISOString().split('T')[0]}
                    </p>
                </div>
            </div>
        </TerminalPage>
    );
}

export default function AboutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-cyan-500 font-mono text-xs animate-pulse">LOADING SYSTEM INFO...</div>}>
            <AboutContent />
        </Suspense>
    );
}
