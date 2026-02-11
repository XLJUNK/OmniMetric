import React, { Suspense } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata(): Promise<Metadata> {
    return getMultilingualMetadata('/contact', 'EN', 'Contact & Support', 'Contact and support information for OmniMetric.');
}

export default async function ContactPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-cyan-500 font-mono text-xs animate-pulse uppercase tracking-widest">CONNECTING TO SUPPORT SERVER...</div>}>
            <TerminalPage pageKey="about" lang="EN" selectorMode="path">
                <div className="max-w-3xl space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <MessageSquare className="w-8 h-8 text-cyan-500" />
                        <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                            Contact & Support
                        </h1>
                    </div>

                    <section id="contact" className="!border-2 !border-red-500 bg-red-950/20 !rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                            <div className="space-y-2">
                                <h2 className="text-lg font-black text-red-400 uppercase">
                                    WE DO NOT PROVIDE INVESTMENT CONSULTATION
                                </h2>
                                <p className="text-sm text-red-200 leading-relaxed">
                                    OmniMetric is an informational platform only. We do not offer personalized investment advice, financial planning, portfolio recommendations, or individual trade suggestions. Any requests for investment consultation will not be answered.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="text-center px-4">
                        <p className="text-xs text-slate-500 font-mono border-b border-slate-800 pb-2 inline-block uppercase">
                            IMPORTANT: We review all messages but are under no obligation to reply.
                        </p>
                    </div>

                    <section className="bg-[#111] !border !border-cyan-500/30 !rounded-xl p-8 text-center space-y-6 shadow-sm dark:shadow-none">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-full mb-2">
                            <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2 uppercase">
                                Primary Contact Channel
                            </h2>
                            <p className="text-sm text-slate-400 mb-4">
                                For technical issues, data feedback, or general inquiries
                            </p>
                        </div>
                        <div className="bg-black !border !border-slate-800 !rounded-lg p-6">
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
                                Send a Direct Message on X (Twitter)
                            </p>
                            <div className="inline-block text-2xl font-mono font-black text-cyan-400">
                                @OmniMetric_GMS
                            </div>
                            <p className="text-xs text-slate-600 mt-3">
                                Response time: 24-72 hours (business days)
                            </p>
                        </div>
                    </section>

                    <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                            ✅ What We Can Help With
                        </h2>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Technical issues or bugs with the terminal</span></li>
                            <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Data accuracy concerns or anomalies</span></li>
                            <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Feature requests or suggestions</span></li>
                            <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>API access or commercial licensing inquiries</span></li>
                            <li className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>Press/media inquiries</span></li>
                        </ul>
                    </section>

                    <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                            ❌ What We Don&apos;t Respond To
                        </h2>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-start gap-2"><span className="text-red-400 mt-1">•</span><span>Investment advice or &quot;should I buy/sell&quot; questions</span></li>
                            <li className="flex items-start gap-2"><span className="text-red-400 mt-1">•</span><span>Portfolio reviews or personalized recommendations</span></li>
                            <li className="flex items-start gap-2"><span className="text-red-400 mt-1">•</span><span>Predictions about specific stocks or assets</span></li>
                            <li className="flex items-start gap-2"><span className="text-red-400 mt-1">•</span><span>Spam, promotional content, or irrelevant inquiries</span></li>
                        </ul>
                    </section>

                    <div className="pt-8 border-t border-slate-800 opacity-50">
                        <p className="text-[10px] font-mono tracking-widest uppercase text-slate-600 text-center">
                            Support Protocol: SNS (X/Bluesky) DM Only // No Email Forms // No Phone Support
                        </p>
                    </div>
                </div>
            </TerminalPage>
        </Suspense>
    );
}
