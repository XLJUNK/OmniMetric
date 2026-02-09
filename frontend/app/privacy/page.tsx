import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { TerminalPage } from '@/components/TerminalPage';
import { Shield } from 'lucide-react';
import { DICTIONARY } from '@/data/dictionary';
import privacyEn from '@/data/privacy-en.json';
import { getMultilingualMetadata } from '@/data/seo';

// Re-define types since they cannot be imported if not exported from original file, or assuming they are copy-pasted. 
// I will copy interface definitions here.
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

// Data is loaded directly
const data = privacyEn;

export async function generateMetadata(): Promise<Metadata> {
    return getMultilingualMetadata('/privacy', 'EN', "Privacy Policy | OmniMetric Terminal", "Privacy Policy and Data Protection practices for OmniMetric.");
}

export default async function PrivacyPage() {
    const normalizedLang = 'EN';
    const isRTL = false;

    return (
        <Suspense fallback={null}>
            <TerminalPage pageKey="legal" lang="EN" selectorMode="path">
                <div className="max-w-4xl mx-auto space-y-8 text-left" dir="ltr">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                            <Shield className="w-8 h-8 text-cyan-500" />
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase">{data.title}</h1>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 font-mono">Last Updated: {data.lastUpdated}</p>

                    <section id="privacy-policy" className="bg-[#111] !border !border-yellow-500/30 !rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
                        <h2 className="text-lg font-bold text-yellow-500 uppercase tracking-wide">
                            {data.adsensePolicy.title}
                        </h2>
                        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                            <p className="font-medium text-white">
                                {data.adsensePolicy.content}
                            </p>
                            <p>
                                <strong className="text-white">Google AdSense</strong> is a third-party advertising service managed by Google LLC.
                            </p>
                            <p>
                                <strong className="text-cyan-400">{data.adsensePolicy.cookie_notice}</strong>
                            </p>
                            <p className="pt-2">
                                <strong className="text-green-400">You can opt out of personalized advertising</strong> by visiting:
                            </p>
                            <div className="bg-black !border !border-slate-700 !rounded-lg p-4 font-mono text-xs text-sky-400">
                                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 underline">
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

                    {data.sections.map((section: PrivacySection, idx: number) => (
                        <section key={idx} className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                                {section.title}
                            </h2>

                            {section.subsections && section.subsections.some(sub => sub.list) ? (
                                <div className="space-y-3 text-sm text-slate-300">
                                    {section.subsections.map((sub: PrivacySubSection, i: number) => (
                                        <div key={i}>
                                            <h3 className="text-cyan-500 font-bold mb-2">{sub.title}</h3>
                                            <ul className="list-disc space-y-1 text-slate-400 pl-6">
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

                            {section.subsections && section.subsections.some(sub => sub.content) && (
                                <div className="space-y-4 text-sm text-slate-300">
                                    {section.subsections.map((sub: PrivacySubSection, i: number) => (
                                        <div key={i}>
                                            <h3 className="text-slate-400 font-bold mb-1">{sub.title}</h3>
                                            <p>{sub.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {section.services ? (
                                <div className="space-y-4 text-sm text-slate-300">
                                    {section.services.map((service: PrivacyService, i: number) => (
                                        <div key={i}>
                                            <h3 className="text-sky-400 font-bold mb-2">{service.name}</h3>
                                            <p className="text-slate-400">{service.desc || service.footer}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {section.content && (
                                <p className="text-sm text-slate-300">
                                    {section.content}
                                </p>
                            )}

                            {section.list && !section.subsections ? (
                                <ul className="list-disc space-y-2 text-sm text-slate-300 pl-6">
                                    {section.list.map((item: PrivacyListItem, i: number) => (
                                        <li key={i}>
                                            <strong>{item.label}</strong> {item.desc}
                                            {item.link && (
                                                <>
                                                    Visit <a href={item.link} className="text-sky-400 hover:underline">{item.text}</a> or <a href={item.link2} className="text-sky-400 hover:underline">{item.text2}</a>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
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
                        <p className="text-[10px] font-mono tracking-widest uppercase text-slate-600">
                            {data.legalFramework}
                        </p>
                    </div>
                </div>
            </TerminalPage>
        </Suspense>
    );
}
