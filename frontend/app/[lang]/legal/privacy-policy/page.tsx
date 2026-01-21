import React from 'react';
import { Metadata } from 'next';
import { TerminalPage } from '@/components/TerminalPage';
import { Shield } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DICTIONARY, LangType } from '@/data/dictionary';
// Import data directly (server component)
import privacyDataEn from '@/data/privacy-en.json';

// Enable Static Params for all languages defined in dictionary
export async function generateStaticParams() {
    return Object.keys(DICTIONARY).map((lang) => ({
        lang: lang.toLowerCase(),
    }));
}

type Props = {
    params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: "Privacy Policy | OmniMetric Terminal",
        description: "Privacy Policy and Data Protection practices for OmniMetric.",
        alternates: {
            canonical: `https://omnimetric.net/${lang}/legal/privacy-policy`
        }
    };
}

export default async function PrivacyPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;
    const isRTL = normalizedLang === 'AR';

    // Fallback to English data for now (placeholder for future translations)
    const data = privacyDataEn;

    return (
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

                {/* English Content Notice */}
                {normalizedLang !== 'EN' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                        <p>
                            Currently, the legal documents are officially available in English.
                            {normalizedLang === 'JP' && (
                                <>
                                    <br />以下の法的文書は現在、英語が正本となります。
                                </>
                            )}
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
                            {normalizedLang === 'JP' ? data.adsensePolicy.content_jp : data.adsensePolicy.content_en}
                        </p>
                        <p>
                            <strong className="text-slate-900 dark:text-white">Google AdSense</strong> is a third-party advertising service managed by Google LLC.
                        </p>
                        <p>
                            {normalizedLang === 'JP' ? (
                                <>
                                    <strong className="text-cyan-600 dark:text-cyan-400">{data.adsensePolicy.cookie_notice_jp}</strong> {data.adsensePolicy.cookie_notice_en}
                                </>
                            ) : (
                                <strong className="text-cyan-600 dark:text-cyan-400">{data.adsensePolicy.cookie_notice_en}</strong>
                            )}
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
                {data.sections.map((section, idx) => (
                    <section key={idx} className="bg-white dark:bg-[#111] !border !border-slate-200 dark:!border-slate-800 !rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                            {section.title}
                        </h2>

                        {/* Subsections (Data We Collect) */}
                        {section.subsections ? (
                            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                                {section.subsections.map((sub: any, i: number) => (
                                    <div key={i}>
                                        <h3 className="text-cyan-600 dark:text-cyan-400 font-bold mb-2">{sub.title}</h3>
                                        <ul className={`list-disc space-y-1 text-slate-600 dark:text-slate-400 ${isRTL ? 'pr-6' : 'pl-6'}`}>
                                            {sub.list.map((item: any, j: number) => (
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

                        {/* Services (Third Party) */}
                        {section.services ? (
                            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                                {section.services.map((service: any, i: number) => (
                                    <div key={i}>
                                        <h3 className="text-sky-400 font-bold mb-2">{service.name}</h3>
                                        <p className="text-slate-400">{service.desc}</p>
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
                                {section.list.map((item: any, i: number) => (
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
                        <a href="https://twitter.com/OmniMetric_GMS" target="_blank" rel="noopener" className="text-sky-600 dark:text-sky-400 hover:underline font-mono">
                            @OmniMetric_GMS
                        </a>
                    </p>
                </section>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 opacity-50">
                    <p className="text-[10px] font-mono tracking-widest uppercase text-slate-600">
                        {data.legalFramework}
                    </p>
                </div>
            </div>
        </TerminalPage>
    );
}
