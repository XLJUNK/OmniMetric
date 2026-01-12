import { Metadata } from 'next';
import { TerminalPage } from '@/components/TerminalPage';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
    title: "Terms of Service | OmniMetric Terminal",
    description: "Terms and Conditions, Disclaimers, and Usage Restrictions for OmniMetric.",
};

export default function TermsPage() {
    return (
        <TerminalPage pageKey="legal">
            <div className="max-w-4xl space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <h1 className="text-3xl font-black tracking-tight text-white">Terms of Service</h1>
                </div>
                <p className="text-sm text-slate-500 font-mono">Last Updated: January 12, 2026</p>

                {/* TOP DISCLAIMER - CRITICAL */}
                <section className="!border-2 !border-red-500 bg-red-950/20 !rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-black text-red-400 uppercase tracking-wide flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6" />
                        CRITICAL DISCLAIMER
                    </h2>
                    <div className="space-y-3 text-sm text-red-100 leading-relaxed font-medium">
                        <p className="text-base">
                            <strong className="text-red-300">OmniMetric is NOT investment advice.</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-red-200">
                            <li>
                                All information provided is for <strong>informational and educational purposes only</strong>
                            </li>
                            <li>
                                We do <strong>NOT guarantee accuracy, completeness, or timeliness</strong> of any data
                            </li>
                            <li>
                                <strong>Investment decisions are YOUR sole responsibility</strong>
                            </li>
                            <li>
                                Past performance does <strong>NOT guarantee future results</strong>
                            </li>
                            <li>
                                Market data may be <strong>delayed or contain errors</strong>
                            </li>
                        </ul>
                        <p className="text-base font-bold text-red-300 pt-2">
                            By accessing this site, you acknowledge and accept all risks associated with financial markets.
                        </p>
                    </div>
                </section>

                {/* Acceptance of Terms */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                        1. Acceptance of Terms
                    </h2>
                    <p className="text-sm text-slate-300">
                        By accessing or using OmniMetric Terminal ("the Service"), you agree to be legally bound by these Terms of Service. If you do not agree with any part of these terms, you must immediately cease using the Service.
                    </p>
                </section>

                {/* Intellectual Property & Scraping Prohibition */}
                <section className="bg-[#111] !border !border-yellow-500/30 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-wide">
                        2. Prohibited Use & Intellectual Property
                    </h2>
                    <div className="space-y-3 text-sm text-slate-300">
                        <p>
                            The following actions are <strong className="text-red-400">strictly prohibited</strong>:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-400">
                            <li>
                                <strong>Automated Scraping:</strong> Using bots, crawlers, or automated scripts to extract data without explicit written permission
                            </li>
                            <li>
                                <strong>Commercial Data Mining:</strong> Collecting our proprietary analysis for resale, redistribution, or competitive purposes
                            </li>
                            <li>
                                <strong>AI Training:</strong> Using our content, algorithms, or generated text to train AI/machine learning models without authorization
                            </li>
                            <li>
                                <strong>Reverse Engineering:</strong> Attempting to reverse engineer, decompile, or extract the logic of our proprietary GMS Score algorithm
                            </li>
                            <li>
                                <strong>Impersonation:</strong> Misrepresenting yourself or your affiliation with OmniMetric
                            </li>
                        </ul>
                        <p className="text-xs text-yellow-300 bg-yellow-950/20 p-3 !rounded-lg !border !border-yellow-500/30 mt-4">
                            <strong>Note:</strong> Academic research and personal use (with proper attribution) are permitted. Commercial licensing is available upon request via X (Twitter) DM.
                        </p>
                    </div>
                </section>

                {/* Data Sources & Accuracy */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                        3. Data Sources & Accuracy
                    </h2>
                    <div className="space-y-3 text-sm text-slate-300">
                        <p>
                            OmniMetric aggregates data from publicly available, third-party sources, including but not limited to:
                        </p>
                        <div className="bg-black !border !border-slate-700 !rounded-lg p-4 font-mono text-xs text-slate-400">
                            <ul className="space-y-1">
                                <li>• Federal Reserve Economic Data (FRED)</li>
                                <li>• CBOE Market Volatility Indices (VIX, MOVE)</li>
                                <li>• Yahoo Finance (Market Prices)</li>
                                <li>• Financial Modeling Prep (Economic Calendar)</li>
                                <li>• Alternative.me (Crypto Sentiment)</li>
                            </ul>
                        </div>
                        <p className="text-slate-400">
                            We rely on these sources for accuracy but <strong>cannot guarantee</strong> their correctness, completeness, or real-time accuracy. Data may be delayed by 15+ minutes depending on the source.
                        </p>
                    </div>
                </section>

                {/* Limitation of Liability */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                        4. Limitation of Liability
                    </h2>
                    <p className="text-sm text-slate-300">
                        To the maximum extent permitted by law, OmniMetric Project and its contributors shall <strong>NOT be liable</strong> for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-slate-400">
                        <li>Financial losses resulting from reliance on our data or analysis</li>
                        <li>Technical errors, data inaccuracies, or service interruptions</li>
                        <li>Third-party data provider errors or API failures</li>
                        <li>Indirect, incidental, or consequential damages</li>
                    </ul>
                    <p className="text-xs text-slate-500 pt-2">
                        You use this Service entirely at your own risk.
                    </p>
                </section>

                {/* Modifications to Terms */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                        5. Modifications to Terms
                    </h2>
                    <p className="text-sm text-slate-300">
                        We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of OmniMetric after changes constitutes acceptance of the new Terms.
                    </p>
                </section>

                {/* Governing Law */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                        6. Governing Law
                    </h2>
                    <p className="text-sm text-slate-300">
                        These Terms shall be governed by and construed in accordance with applicable international digital commerce laws. Disputes will be resolved through arbitration or the courts of the jurisdiction where the OmniMetric Project is registered.
                    </p>
                </section>

                {/* Contact */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-3">
                        7. Contact
                    </h2>
                    <p className="text-sm text-slate-300">
                        For legal inquiries or licensing requests, contact us via Direct Message on X (Twitter):{' '}
                        <a href="https://twitter.com/OmniMetric_GMS" target="_blank" rel="noopener" className="text-sky-400 hover:underline font-mono">
                            @OmniMetric_GMS
                        </a>
                    </p>
                </section>

                <div className="pt-8 border-t border-slate-800 opacity-50">
                    <p className="text-[10px] font-mono tracking-widest uppercase text-slate-600">
                        Legal Framework: Terms v2.0 // Effective Date: 2026-01-12
                    </p>
                </div>
            </div>
        </TerminalPage>
    );
}
