import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { TerminalPage } from '@/components/TerminalPage';
import { AlertTriangle } from 'lucide-react';
import { DICTIONARY } from '@/data/dictionary';
import termsEn from '@/data/terms-en.json';
import { getMultilingualMetadata } from '@/data/seo';

// Re-define interfaces
interface TermsListItem {
    title?: string;
    desc?: string;
}

interface TermsSection {
    title: string;
    content?: string;
    list?: (string | TermsListItem)[];
    note?: string;
    footer?: string;
    sources?: string[];
    disclaimer?: string;
    subsections?: TermsSection[];
}


// Load data directly
const data = termsEn;

export async function generateMetadata(): Promise<Metadata> {
    return getMultilingualMetadata('/legal', 'EN', "Terms of Service | OmniMetric Terminal", "Terms and Conditions, Disclaimers, and Usage Restrictions for OmniMetric.");
}

export default async function LegalPage() {
    const normalizedLang = 'EN';

    return (
        <Suspense fallback={null}>
            <TerminalPage pageKey="legal" lang="EN" selectorMode="path">
                <div className="max-w-4xl mx-auto space-y-8 text-left" dir="ltr">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase">{data.title}</h1>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 font-mono">Last Updated: {data.lastUpdated}</p>

                    <section id="terms" className="!border-2 !border-red-500 bg-red-950/20 !rounded-xl p-6 space-y-4">
                        <h2 className="text-xl font-black text-red-400 uppercase tracking-wide flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6" />
                            {data.criticalDisclaimer.title}
                        </h2>
                        <div className="space-y-3 text-sm text-red-200 leading-relaxed font-medium">
                            <p className="text-base">
                                <strong className="text-red-300">{data.criticalDisclaimer.mainText}</strong>
                            </p>
                            <ul className="list-disc space-y-2 text-red-200 pl-6">
                                {data.criticalDisclaimer.list.map((item: string, i: number) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                ))}
                            </ul>
                            <p className="text-base font-bold text-red-300 pt-2">
                                {data.criticalDisclaimer.acknowledgment}
                            </p>
                        </div>
                    </section>

                    {data.sections.map((section: TermsSection, idx: number) => (
                        <section key={idx} className={`${section.title.includes('Modifications') ? '' : 'bg-[#111]'} !border ${section.title.includes('Prohibited') ? '!border-yellow-500/30' : '!border-slate-800'} !rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none`}>
                            <h2 className={`text-lg font-bold uppercase tracking-wide ${section.title.includes('Prohibited') ? 'text-yellow-400' : 'text-white'}`}>
                                {section.title}
                            </h2>

                            {section.content && (
                                <p className="text-sm text-slate-300">
                                    {section.content}
                                </p>
                            )}

                            {section.list && (
                                <div className="space-y-3 text-sm text-slate-300">
                                    <ul className="list-disc space-y-2 text-slate-400 pl-6">
                                        {section.list.map((item: string | TermsListItem, i: number) => (
                                            typeof item === 'string' ? (
                                                <li key={i}>{item}</li>
                                            ) : (
                                                <li key={i}>
                                                    <strong>{item.title}</strong> {item.desc}
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                    {section.note && (
                                        <p className="text-xs text-yellow-300 bg-yellow-950/20 p-3 !rounded-lg !border !border-yellow-500/30 mt-4">
                                            {section.note}
                                        </p>
                                    )}
                                    {section.footer && (
                                        <p className="text-xs text-slate-500 pt-2">{section.footer}</p>
                                    )}
                                </div>
                            )}

                            {section.sources && (
                                <div className="space-y-3 text-sm text-slate-300">
                                    <div className="bg-black !border !border-slate-700 !rounded-lg p-4 font-mono text-xs text-slate-400">
                                        <ul className="space-y-1">
                                            {section.sources.map((source: string, i: number) => (
                                                <li key={i}>• {source}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    {section.disclaimer && (
                                        <p className="text-slate-400">
                                            {section.disclaimer}
                                        </p>
                                    )}
                                </div>
                            )}

                            {section.subsections && (
                                <div className="space-y-4 text-sm text-slate-300">
                                    {section.subsections.map((sub: TermsSection, i: number) => (
                                        <div key={i}>
                                            <h3 className="text-slate-400 font-bold mb-1">{sub.title}</h3>
                                            <p>{sub.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}

                    <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 shadow-sm dark:shadow-none">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-3">
                            {data.contact.title}
                        </h2>
                        <p className="text-sm text-slate-300">
                            {data.contact.text} {' '}
                            <a href="https://twitter.com/OmniMetric_GMS" target="_blank" rel="noopener" className="text-sky-400 hover:underline font-mono">
                                @OmniMetric_GMS
                            </a>
                        </p>
                    </section>

                    <div className="pt-8 border-t border-slate-200 dark:border-slate-800 opacity-50">
                        <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-600">
                            {data.legalFramework}
                        </p>
                    </div>
                </div>
            </TerminalPage>
        </Suspense>
    );
}
