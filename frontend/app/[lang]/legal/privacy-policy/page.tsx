import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { TerminalPage } from '@/components/TerminalPage';

import { Shield } from 'lucide-react';
import { DICTIONARY, LangType } from '@/data/dictionary';
// Import data directly (server component)
import privacyEn from '@/data/privacy-en.json';
import privacyJp from '@/data/privacy-jp.json';
import privacyDe from '@/data/privacy-de.json';
import privacyFr from '@/data/privacy-fr.json';

const privacyData: Record<string, PrivacyData> = {
    EN: privacyEn,
    JP: privacyJp,
    DE: privacyDe,
    FR: privacyFr,
};

interface PrivacyData {
    title: string;
    lastUpdated: string;
    adsensePolicy: {
        title: string;
        content: string;
        cookie_notice: string;
        more_info: string;
    };
    sections: PrivacySection[];
    contact: {
        title: string;
        text: string;
    };
    legalFramework: string;
}

export const dynamicParams = false;

// Enable Static Params for all languages defined in dictionary
export async function generateStaticParams() {
    return Object.keys(DICTIONARY).filter((lang) => lang !== 'EN').map((lang) => ({
        lang: lang.toLowerCase(),
    }));
}

interface PrivacyListItem {
    label?: string;
    desc?: string;
    title?: string;
    link?: string;
    text?: string;
    link2?: string;
    text2?: string;
}

interface PrivacySubSection {
    title: string;
    list?: (string | PrivacyListItem)[];
    content?: string;
}

interface PrivacyService {
    name: string;
    desc?: string;
    footer?: string;
}

interface PrivacySection {
    title: string;
    content?: string;
    subsections?: PrivacySubSection[];
    services?: PrivacyService[];
    list?: PrivacyListItem[];
    footer?: string;
}

type Props = {
    params: Promise<{ lang: string }>;
};

import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return getMultilingualMetadata('/legal/privacy-policy', lang, "Privacy Policy | OmniMetric Terminal", "Privacy Policy and Data Protection practices for OmniMetric.");
}

export default async function PrivacyPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;
    const isRTL = normalizedLang === 'AR';

    // Load data based on language
    const data = privacyData[normalizedLang] || privacyEn;

    return (
        <Suspense fallback={null}>
            <TerminalPage pageKey="legal" lang={normalizedLang} selectorMode="path">
                <div className={`max-w-4xl mx-auto space-y-8 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>

                    {/* Header */}
                    <div className={`flex justify-between items-start mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Shield className="w-8 h-8 text-cyan-600 dark:text-cyan-500" />
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{data.title}</h1>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 font-mono">Last Updated: {data.lastUpdated}</p>

                    {/* Translated Content Notice */}
                    {normalizedLang !== 'EN' && !privacyData[normalizedLang] && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                            <p>
                                Currently, this legal document is officially available in English.
                            </p>
                        </div>
                    )}

                    {/* Google AdSense Disclosure - CRITICAL */}
                    <section id="privacy-policy" className="bg-white dark:bg-[#111] !border !border-yellow-500/30 !rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
                        <h2 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">
                            {data.adsensePolicy.title}
                        </h2>
                        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            <p className="font-medium text-slate-900 dark:text-white">
                                {data.adsensePolicy.content}
                            </p>
                            <p>
                                <strong className="text-slate-900 dark:text-white">Google AdSense</strong> {normalizedLang === 'EN' ? 'is a third-party advertising service managed by Google LLC.' : ''}
                            </p>
                            <p>
                                <strong className="text-cyan-600 dark:text-cyan-400">{data.adsensePolicy.cookie_notice}</strong>
                            </p>
                            <p className="pt-2">
                                <strong className="text-green-400">You can opt out of personalized advertising</strong> by visiting:
                            </p>
                            <div className="bg-slate-100 dark:bg-black !border !border-slate-200 dark:!border-slate-700 !rounded-lg p-4 font-mono text-xs">
                                <a
                                    href="https://www.google.com/settings/ads"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-400 hover:text-sky-300 underline"
                                >
                                    Google Ads Settings →
                                </a>
                            </div>
                            <p className="text-xs text-slate-500">
                                {data.adsensePolicy.more_info}{' '}
                                <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener" className="text-sky-500 hover:underline">
                                    policies.google.com/technologies/partner-sites
                                </a>
                            </p>
                        </div>
                    </section>

                    {/* SECTIONS */}
                    {data.sections.map((section: PrivacySection, idx: number) => (
                        <section key={idx} className="bg-white dark:bg-[#111] !border !border-slate-200 dark:!border-slate-800 !rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                                {section.title}
                            </h2>

                            {/* Subsections (Data We Collect) */}
                            {section.subsections && section.subsections.some(sub => sub.list) ? (
                                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                                    {section.subsections.map((sub: PrivacySubSection, i: number) => (
                                        <div key={i}>
                                            <h3 className="text-cyan-600 dark:text-cyan-400 font-bold mb-2">{sub.title}</h3>
                                            <ul className={`list-disc space-y-1 text-slate-600 dark:text-slate-400 ${isRTL ? 'pr-6' : 'pl-6'}`}>
                                                {sub.list?.map((item: string | PrivacyListItem, j: number) => (
                                                    typeof item === 'string' ? (
                                                        <li key={j}>{item}</li>
                                                    ) : (
                                                        <li key={j}><strong>{item.title}</strong> {item.desc}</li>
                                                    )
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    {section.footer && (
                                        <p className="text-xs text-slate-500 pt-2">{section.footer}</p>
                                    )}
                                </div>
                            ) : null}

                            {/* Subsections (Operational Policies) */}
                            {section.subsections && section.subsections.some(sub => sub.content) && (
                                <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                                    {section.subsections.map((sub: PrivacySubSection, i: number) => (
                                        <div key={i}>
                                            <h3 className="text-slate-600 dark:text-slate-400 font-bold mb-1">{sub.title}</h3>
                                            <p>{sub.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Services (Third Party) */}
                            {section.services ? (
                                <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                                    {section.services.map((service: PrivacyService, i: number) => (
                                        <div key={i}>
                                            <h3 className="text-sky-400 font-bold mb-2">{service.name}</h3>
                                            <p className="text-slate-400">{service.desc || service.footer}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {/* Plain Content (Data Security, Changes) */}
                            {section.content && (
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {section.content}
                                </p>
                            )}

                            {/* Your Rights List */}
                            {section.list && !section.subsections ? (
                                <ul className={`list-disc space-y-2 text-sm text-slate-700 dark:text-slate-300 ${isRTL ? 'pr-6' : 'pl-6'}`}>
                                    {section.list.map((item: PrivacyListItem, i: number) => (
                                        <li key={i}>
                                            <strong>{item.label}</strong> {item.desc}
                                            {item.link && (
                                                <>
                                                    Visit <a href={item.link} className="text-sky-600 dark:text-sky-400 hover:underline">{item.text}</a> or <a href={item.link2} className="text-sky-600 dark:text-sky-400 hover:underline">{item.text2}</a>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </section>
                    ))}

                    {/* Contact */}
                    <section className="bg-white dark:bg-[#111] !border !border-slate-200 dark:!border-slate-800 !rounded-xl p-6 shadow-sm dark:shadow-none">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3">
                            {data.contact.title}
                        </h2>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            {data.contact.text} {' '}
                            <span className="text-sky-600 dark:text-sky-400 font-mono">
                                @OmniMetric_GMS
                            </span>
                        </p>
                    </section>

                    <div className="pt-8 border-t border-slate-200 dark:border-slate-800 opacity-50">
                        <p className="text-[10px] font-mono tracking-widest uppercase text-slate-600">
                            {data.legalFramework}
                        </p>
                    </div>
                </div>
            </TerminalPage>
        </Suspense>
    );
}
