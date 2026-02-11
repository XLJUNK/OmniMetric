import React, { Suspense } from 'react';
import { TerminalPage } from '@/components/TerminalPage';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
import { getTermsData, getPrivacyData } from '@/data/LegalData';
import { Shield, AlertTriangle, ExternalLink, Scale, Lock, Eye, Bot, Database } from 'lucide-react';

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.keys(DICTIONARY).map((lang) => ({
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

    return getMultilingualMetadata('/legal', normalizedLang, "LEGAL NOTICE & COMPLIANCE", "Legal information, Terms of Service, and Privacy Policy for OmniMetric Terminal.");
}

export default async function LegalPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;
    const isRTL = normalizedLang === 'AR';

    const terms = getTermsData(normalizedLang);
    const privacy = getPrivacyData(normalizedLang);

    if (!terms || !privacy) return null;

    // JSON-LD for Privacy Policy Compliance
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "PrivacyPolicy",
        "name": privacy.title,
        "url": `https://gms.omni-metric.com/${lang}/legal`,
        "datePublished": "2026-01-12",
        "dateModified": privacy.lastUpdated.includes('-') ? privacy.lastUpdated : "2026-02-11",
        "knowsAbout": ["Google AdSense", "Google Analytics 4", "GDPR", "Privacy"],
        "accountablePerson": {
            "@type": "Person",
            "name": "OmniMetric Project Owner",
            "identifier": "@OmniMetric_GMS"
        }
    };

    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-sky-500 font-mono text-xs animate-pulse">LOADING COMPLIANCE CORE...</div>}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <TerminalPage pageKey="legal" lang={normalizedLang} selectorMode="path">
                <div className={`max-w-4xl space-y-12 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>

                    {/* CRITICAL DISCLAIMER BANNER - FORTRESS AESTHETIC */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative !border-2 !border-red-500/50 bg-red-500/5 rounded-xl p-6 md:p-8 space-y-4 shadow-[0_0_40px_rgba(239,68,68,0.1)] backdrop-blur-sm">
                            <div className={`flex items-start md:items-center gap-4 text-red-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="p-3 bg-red-500 animate-pulse rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                                    <AlertTriangle className="w-6 h-6 text-white shrink-0" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                                        {terms.criticalDisclaimer.title}
                                    </h2>
                                    <p className="text-sm md:text-base font-bold text-red-400/90 uppercase tracking-widest">
                                        {terms.criticalDisclaimer.mainText}
                                    </p>
                                </div>
                                <div className={`hidden md:flex items-center gap-2 ${isRTL ? 'mr-auto' : 'ml-auto'} px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest`}>
                                    <Lock className="w-3 h-3" /> Secure Compliance
                                </div>
                            </div>
                            <ul className={`text-sm md:text-base text-slate-300 space-y-3 font-medium ${isRTL ? 'pr-8' : 'pl-16'} list-disc marker:text-red-500`}>
                                {terms.criticalDisclaimer.list.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <div className="pt-4 border-t border-red-500/20">
                                <p className="text-xs md:text-sm text-red-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                                    {terms.criticalDisclaimer.acknowledgment}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ANCHOR NAV - ENHANCED */}
                    <nav className={`sticky top-0 z-50 flex flex-wrap items-center gap-6 py-4 bg-black/80 backdrop-blur-xl border-b border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <a href="#terms" className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-sky-400 transition-all flex items-center gap-2 px-3 py-1 border border-transparent hover:border-sky-500/30 rounded-lg">
                            <Scale className="w-3 h-3" /> {terms.title}
                        </a>
                        <a href="#privacy-policy" className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-cyan-400 transition-all flex items-center gap-2 px-3 py-1 border border-transparent hover:border-cyan-500/30 rounded-lg">
                            <Shield className="w-3 h-3" /> {privacy.title}
                        </a>
                        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 ml-auto">
                            <span className="opacity-50">DM INQUIRIES:</span> @OmniMetric_GMS
                        </div>
                    </nav>

                    {/* SECTION: TERMS OF SERVICE */}
                    <section id="terms" className="space-y-10 pt-16 scroll-mt-24">
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-2 h-8 bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]"></div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{terms.title}</h2>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
                            <Lock className="w-3 h-3" /> {normalizedLang === 'JP' ? '最終更新日: ' : 'Last Updated: '} {terms.lastUpdated}
                        </div>

                        <div className="space-y-16">
                            {terms.sections.map((section, idx) => (
                                <div key={idx} className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-sky-400 border-b border-sky-500/20 pb-2 w-full">
                                            {section.title}
                                        </h3>
                                    </div>
                                    {section.content && (
                                        <p className="text-sm md:text-base text-slate-300 leading-relaxed font-mono">
                                            {section.content}
                                        </p>
                                    )}
                                    {section.list && (
                                        <ul className={`space-y-6 ${isRTL ? 'pr-6' : 'pl-6'}`}>
                                            {section.list.map((item, i) => (
                                                <li key={i} className="text-sm md:text-base text-slate-400 font-mono leading-relaxed group">
                                                    {typeof item === 'string' ? (
                                                        <div className="flex gap-3">
                                                            <div className="w-1.5 h-1.5 bg-sky-500 mt-2 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"></div>
                                                            {item}
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-slate-200">
                                                                <div className="w-1.5 h-1.5 bg-sky-500 shrink-0"></div>
                                                                <strong className="uppercase tracking-widest text-xs font-black">{item.title}</strong>
                                                            </div>
                                                            <div className={`text-slate-500 ${isRTL ? 'mr-3.5' : 'ml-3.5'}`}>{item.desc}</div>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {section.sources && (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8">
                                            <div className="flex items-center gap-2 mb-4 text-xs font-black text-slate-300 uppercase tracking-widest">
                                                <Database className="w-3 h-3 text-sky-500" /> Data Sources Integrated
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {section.sources.map((source, i) => (
                                                    <div key={i} className="bg-black/40 px-3 py-2 border border-white/5 rounded text-[10px] font-mono text-slate-400 flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-sky-500"></div> {source}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {section.subsections && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                            {section.subsections.map((sub, i) => (
                                                <div key={i} className="bg-[#111] p-6 border-l-2 border-sky-500/50 rounded-r-lg space-y-3">
                                                    <h4 className="text-xs font-black text-slate-100 uppercase tracking-widest">{sub.title}</h4>
                                                    <p className="text-xs text-slate-500 leading-relaxed font-mono">{sub.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {section.note && (
                                        <div className="bg-sky-500/5 text-sky-400 p-5 border-l-2 border-sky-500 text-xs italic font-semibold leading-relaxed mt-6">
                                            {section.note}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECTION: PRIVACY POLICY */}
                    <section id="privacy-policy" className="space-y-10 pt-24 border-t border-white/5 scroll-mt-24">
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-2 h-8 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{privacy.title}</h2>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
                            <Shield className="w-3 h-3" /> {normalizedLang === 'JP' ? '最終更新日: ' : 'Last Updated: '} {privacy.lastUpdated}
                        </div>

                        {/* ADSENSE POLICY BOX - COMPLIANCE FORTRESS */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 rounded-2xl blur opacity-20"></div>
                            <div className="relative bg-cyan-500/5 border border-cyan-500/30 rounded-xl p-6 md:p-8 space-y-6 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                                        <Eye className="w-5 h-5 text-cyan-500" />
                                    </div>
                                    <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-cyan-400">
                                        {privacy.adsensePolicy.title}
                                    </h3>
                                </div>
                                <div className="space-y-4 text-sm md:text-base text-slate-400 font-mono leading-relaxed">
                                    <p>{privacy.adsensePolicy.content}</p>
                                    <div className="p-4 bg-black/40 border border-white/5 rounded-lg border-l-2 border-cyan-500">
                                        <p className="text-slate-200 font-bold italic text-sm">{privacy.adsensePolicy.cookie_notice}</p>
                                    </div>
                                    <div className="pt-4 flex flex-wrap gap-4">
                                        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener" className="inline-flex items-center gap-3 px-5 py-3 bg-cyan-500 text-black rounded-lg text-xs font-black hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                            <Lock className="w-4 h-4" /> GOOGLE ADS SETTINGS <ExternalLink className="w-3 h-3" />
                                        </a>
                                        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener" className="inline-flex items-center gap-3 px-5 py-3 bg-white/5 text-slate-300 rounded-lg text-xs font-black hover:bg-white/10 transition-all border border-white/10">
                                            PRIVACY PARTNER SITES <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <p className="text-[10px] text-slate-600 pt-4 uppercase tracking-[0.2em] italic border-t border-white/5">
                                        {privacy.adsensePolicy.more_info}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-20 mt-12">
                            {privacy.sections.map((section, idx) => (
                                <div key={idx} className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-cyan-400 border-b border-cyan-500/20 pb-2 w-full">
                                            {section.title}
                                        </h3>
                                    </div>
                                    {section.content && (
                                        <div className="relative p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                                            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-mono">
                                                {section.content}
                                            </p>
                                        </div>
                                    )}
                                    {section.subsections && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            {section.subsections.map((sub, i) => (
                                                <div key={i} className="space-y-4">
                                                    <h4 className="text-xs font-black text-slate-100 uppercase tracking-[0.3em] flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div> {sub.title}
                                                    </h4>
                                                    <ul className={`space-y-3 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                                                        {sub.list?.map((item, j) => (
                                                            <li key={j} className="text-xs md:text-sm text-slate-500 font-mono flex items-start gap-4 group">
                                                                <div className="w-1 h-1 bg-cyan-500 shrink-0 mt-2 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                                                                <span>{typeof item === 'string' ? item : <><strong className="text-slate-300 uppercase tracking-widest text-[10px] block mb-1">{item.title}</strong> {item.desc}</>}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {section.services && (
                                        <div className="grid grid-cols-1 gap-4">
                                            {section.services.map((service, i) => (
                                                <div key={i} className="bg-white/5 p-6 rounded-xl flex flex-col md:flex-row md:items-center gap-6 border border-white/5 hover:border-cyan-500/30 transition-colors group">
                                                    <div className="min-w-[180px] text-xs font-black text-cyan-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:animate-ping"></div> {service.name}
                                                    </div>
                                                    <div className="text-xs md:text-sm text-slate-400 italic leading-relaxed font-mono">{service.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {section.list && (
                                        <ul className={`space-y-6 ${isRTL ? 'pr-6' : 'pl-6'}`}>
                                            {section.list.map((item, i) => (
                                                <li key={i} className="text-sm text-slate-400 font-mono leading-relaxed space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-200">
                                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                                                        <strong className="uppercase tracking-widest text-xs font-black">{item.label}</strong>
                                                    </div>
                                                    <div className={`text-slate-500 ${isRTL ? 'mr-3.5' : 'ml-3.5'}`}>
                                                        {item.desc}
                                                        {item.link && (
                                                            <a href={item.link} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors ml-3 px-3 py-1 bg-cyan-500/10 rounded border border-cyan-500/20 text-[10px] font-black uppercase">
                                                                {item.text} <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        )}
                                                        {item.link2 && (
                                                            <a href={item.link2} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors ml-3 px-3 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-black uppercase">
                                                                {item.text2} <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FOOTER METADATA */}
                    <div className="pt-24 pb-12 border-t border-white/5 opacity-50">
                        <div className={`flex flex-col md:flex-row justify-between gap-6 text-[10px] font-mono tracking-[0.4em] uppercase text-slate-500 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                            <div className="space-y-2">
                                <p>{terms.legalFramework}</p>
                                <p>{privacy.legalFramework}</p>
                            </div>
                            <div className={`text-sky-500 font-black border-2 border-sky-500/30 px-4 py-2 rounded-lg bg-sky-500/5 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
                                COMPLIANCE_ID // OMNI-TERM-2026-COMP
                            </div>
                        </div>
                    </div>
                </div>
            </TerminalPage>
        </Suspense>
    );
}

