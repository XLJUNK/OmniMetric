import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { TerminalPage } from '@/components/TerminalPage';
import { AlertTriangle } from 'lucide-react';
import { DICTIONARY, LangType } from '@/data/dictionary';
// Import data directly (server component)
// Import data directly (server component)
import termsEn from '@/data/terms-en.json';
import termsJp from '@/data/terms-jp.json';
import termsDe from '@/data/terms-de.json';
import termsFr from '@/data/terms-fr.json';

const termsData: Record<string, TermsData> = {
    EN: termsEn,
    JP: termsJp,
    DE: termsDe,
    FR: termsFr,
};

interface TermsData {
    title: string;
    lastUpdated: string;
    criticalDisclaimer: {
        title: string;
        mainText: string;
        list: string[];
        acknowledgment: string;
    };
    sections: TermsSection[];
    contact: {
        title: string;
        text: string;
    };
    legalFramework: string;
}

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

// Enable Static Params for all languages defined in dictionary
export const dynamicParams = false;

export async function generateStaticParams() {
    return Object.keys(DICTIONARY).filter((lang) => lang !== 'EN').map((lang) => ({
        lang: lang.toLowerCase(),
    }));
}

type Props = {
    params: Promise<{ lang: string }>;
};

import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return getMultilingualMetadata('/legal/terms', lang, "Terms of Service | OmniMetric Terminal", "Terms and Conditions, Disclaimers, and Usage Restrictions for OmniMetric.");
}

export default async function TermsPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;
    const isRTL = normalizedLang === 'AR';

    // Moved interfaces outside component

    // Load data based on language
    const data = termsData[normalizedLang] || termsEn;

    return (
        <Suspense fallback={null}>
            <TerminalPage pageKey="legal" lang={normalizedLang} selectorMode="path">
                <div className={`max-w-4xl mx-auto space-y-8 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>

                    {/* Header */}
                    <div className={`flex justify-between items-start mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{data.title}</h1>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 font-mono">Last Updated: {data.lastUpdated}</p>

                    {/* Translated Content Notice */}
                    {normalizedLang !== 'EN' && !termsData[normalizedLang] && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                            <p>
                                Currently, this legal document is officially available in English.
                            </p>
                        </div>
                    )}

                    {/* CRITICAL DISCLAIMER */}
                    <section id="terms" className="!border-2 !border-red-500 bg-red-50 dark:bg-red-950/20 !rounded-xl p-6 space-y-4">
                        <h2 className={`text-xl font-black text-red-600 dark:text-red-400 uppercase tracking-wide flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <AlertTriangle className="w-6 h-6" />
                            {data.criticalDisclaimer.title}
                        </h2>
                        <div className="space-y-3 text-sm text-red-900 dark:text-red-100 leading-relaxed font-medium">
                            <p className="text-base">
                                <strong className="text-red-700 dark:text-red-300">{data.criticalDisclaimer.mainText}</strong>
                            </p>
                            <ul className={`list-disc space-y-2 text-red-800 dark:text-red-200 ${isRTL ? 'pr-6' : 'pl-6'}`}>
                                {data.criticalDisclaimer.list.map((item: string, i: number) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                ))}
                            </ul>
                            <p className="text-base font-bold text-red-700 dark:text-red-300 pt-2">
                                {data.criticalDisclaimer.acknowledgment}
                            </p>
                        </div>
                    </section>

                    {/* SECTIONS */}
                    {data.sections.map((section: TermsSection, idx: number) => (
                        <section key={idx} className={`${section.title.includes('Modifications') ? '' : 'bg-transparent dark:bg-[#111]'} !border ${section.title.includes('Prohibited') ? '!border-yellow-500/30' : '!border-slate-200 dark:!border-slate-800'} !rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none`}>
                            <h2 className={`text-lg font-bold uppercase tracking-wide ${section.title.includes('Prohibited') ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-900 dark:text-white'}`}>
                                {section.title}
                            </h2>

                            {/* Main Content */}
                            {section.content && (
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {section.content}
                                </p>
                            )}

                            {/* Lists (Prohibited, Limitation) */}
                            {section.list && (
                                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                                    <ul className={`list-disc space-y-2 text-slate-600 dark:text-slate-400 ${isRTL ? 'pr-6' : 'pl-6'}`}>
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
                                    {section.note && ( // Prohibited Use Note
                                        <p className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 p-3 !rounded-lg !border !border-yellow-400/30 dark:!border-yellow-500/30 mt-4">
                                            {section.note}
                                        </p>
                                    )}
                                    {section.footer && ( // Limitation Footer
                                        <p className="text-xs text-slate-500 pt-2">{section.footer}</p>
                                    )}
                                </div>
                            )}

                            {/* Sources List */}
                            {section.sources && (
                                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                                    <div className="bg-slate-100 dark:bg-black !border !border-slate-200 dark:!border-slate-700 !rounded-lg p-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                                        <ul className="space-y-1">
                                            {section.sources.map((source: string, i: number) => (
                                                <li key={i}>• {source}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    {section.disclaimer && (
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {section.disclaimer}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Subsections (Operational Policies) */}
                            {section.subsections && (
                                <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                                    {section.subsections.map((sub: TermsSection, i: number) => (
                                        <div key={i}>
                                            <h3 className="text-slate-600 dark:text-slate-400 font-bold mb-1">{sub.title}</h3>
                                            <p>{sub.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}

                    {/* Contact */}
                    <section className="bg-transparent dark:bg-[#111] !border !border-slate-200 dark:!border-slate-800 !rounded-xl p-6 shadow-sm dark:shadow-none">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3">
                            {data.contact.title}
                        </h2>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            {data.contact.text} {' '}
                            <a href="https://twitter.com/OmniMetric_GMS" target="_blank" rel="noopener" className="text-sky-600 dark:text-sky-400 hover:underline font-mono">
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
