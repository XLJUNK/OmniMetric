'use client';

import React, { useState } from 'react';
import { Activity, Zap, ChevronDown, Info, Settings, X } from 'lucide-react';
import { RiskGauge, HistoryChart } from '@/components/Charts';
import { DICTIONARY, LangType } from '@/data/dictionary';

import { useRouter, usePathname } from 'next/navigation';
import { NewsTicker } from '@/components/NewsTicker';
import { AdComponent } from '@/components/AdComponent';
import MESSAGES from '@/data/messages.json';
import { TVPartnerCard } from '@/components/TVPartnerCard';
import { MarketAnalysisWidget } from '@/components/analysis/MarketAnalysisWidget';
import { createPortal } from 'react-dom';
import { MarketHeatmap } from '@/components/MarketHeatmap';
import { OmniWarningBeacons } from '@/components/OmniWarningBeacons';
import { OmniGravityVector } from '@/components/OmniGravityVector';
import { ExplanationModal } from '@/components/ExplanationModal';
import { LanguageSelector } from '@/components/LanguageSelector';
import { IndicatorHelpButton } from '@/components/IndicatorHelpButton';


import { SignalData } from '@/lib/signal';

interface GMSHeaderProps {
    data: SignalData;
    lang: LangType;
    isSafeMode?: boolean;
    onOpenSettings?: () => void;
}

export const GMSHeaderSection = ({ data, lang, onOpenSettings }: GMSHeaderProps) => {
    const [showInfo, setShowInfo] = useState(false);
    const [showOwbInfo, setShowOwbInfo] = useState(false);
    const [showOgvInfo, setShowOgvInfo] = useState(false);
    const [showOtgInfo, setShowOtgInfo] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // 0. Safety Guard: Immediate Exit if No Data
    if (!data) return null;

    // Safety: Ensure lang exists in DICTIONARY
    const t = DICTIONARY[lang] || DICTIONARY['EN'];

    // Helper to change language via URL

    const getDynamicFallback = () => {
        const score = data?.gms_score || 50;
        const statusObj = MESSAGES.ai_status as Record<string, string | Record<string, string>>;
        let regimeKey = "NEUTRAL";
        if (score > 60) regimeKey = "RISK_ON";
        else if (score < 40) regimeKey = "RISK_OFF";

        const regimeData = statusObj[regimeKey];
        if (typeof regimeData === 'string') return regimeData;

        const regimeObj = regimeData as Record<string, string>;
        const fallback = regimeObj?.[lang] || regimeObj?.["EN"] || t.status.ai;
        return fallback;
    };

    // AI Report Logic
    const aiRaw = (data?.analysis?.reports as Record<string, string>)?.[lang]
        || (data?.analysis?.reports as Record<string, string>)?.[lang?.toUpperCase()]
        || data?.analysis?.content;

    let aiContent = aiRaw || getDynamicFallback();

    const PLACEHOLDER_BLOCKLIST = [
        "深度解析最新",
        "正在重新検証",
        "世界市場は主要な経済指標",
        "Deep-diving into",
        "Mendalami data makro"
    ];

    if (aiContent && typeof aiContent === 'string') {
        const isPlaceholder = PLACEHOLDER_BLOCKLIST.some(p => aiContent.includes(p));
        // Add length check with safety
        if (isPlaceholder || !aiRaw || (typeof aiRaw === 'string' && aiRaw.length < 20)) {
            if (typeof aiRaw === 'string' && aiRaw.includes("【GMS:")) {
                aiContent = aiRaw;
            } else {
                aiContent = getDynamicFallback();
            }
        }
    }

    return (
        <div className="w-full">


            {/* 1. Global Header Status */}
            <div
                className="w-full px-2 md:px-6 py-3 border-0 relative z-50 bg-black"
            >
                <div className="flex flex-nowrap justify-between items-start gap-3">
                    {/* TITLE AREA */}
                    <div className="pointer-events-auto cursor-pointer min-w-0 flex-1" onClick={() => router.push(lang.toUpperCase() === 'EN' ? '/' : `/${lang.toLowerCase()}`)}>
                        <h1 className="text-base sm:text-2xl md:text-3xl font-black tracking-tighter mb-0 leading-tight hover:text-sky-500 transition-colors text-slate-900 dark:text-white uppercase whitespace-normal break-normal">OMNIMETRIC TERMINAL</h1>
                        <h2 className="text-[10px] sm:text-sm md:text-base font-bold text-sky-500 tracking-[0.2em] uppercase mt-1">Global Macro Signal (GMS)</h2>
                    </div>

                    {/* CONTROLS AREA (TOP RIGHT) */}
                    <div className="flex items-center gap-3">
                        {/* LANGUAGE */}
                        <LanguageSelector currentLang={lang} mode="path" />

                    </div>
                </div>
            </div>

            {/* 2. Primary GMS Score & AI Insight */}
            <div className="w-full p-2 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* GMS SCORE CARD */}
                <div
                    className="lg:col-span-1 !rounded-xl !border-0 !shadow-none p-3 md:p-4 flex flex-col items-center gap-4 relative overflow-visible group transition-colors duration-300 bg-black"
                >
                    {/* RISK GAUGE & INFO */}
                    <div className="w-full px-1 pt-2 pb-6">
                        <div className="flex justify-end mb-1.5">
                            <IndicatorHelpButton
                                label="What's GMS"
                                onClick={() => setShowInfo(true)}
                            />
                        </div>
                        <RiskGauge score={data.gms_score} lang={lang} />
                    </div>

                    <div className="w-full h-[110px] z-10">
                        <HistoryChart
                            data={data.history_chart || []}
                            lang={lang}
                            color={data.gms_score > 60 ? "#3b82f6" : (data.gms_score < 40 ? "#ef4444" : "#eab308")}
                        />
                    </div>

                    <div className="w-full mt-2">
                        <OmniWarningBeacons data={data} lang={lang} onOpenInfo={() => setShowOwbInfo(true)} />
                    </div>
                </div>

                {/* AI INSIGHT */}
                <div
                    className="lg:col-span-2 !rounded-xl !border-0 !shadow-none p-4 md:p-6 pt-5 md:pt-7 pb-3 md:pb-4 flex flex-col relative overflow-hidden group min-h-[12rem] transition-colors duration-300 bg-black"
                >
                    <div className="flex items-center gap-2 mb-0 border-0 pb-0 leading-none">
                        <Zap className="w-3.5 h-3.5 text-sky-500" />
                        <h3 className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em] flex-grow">OmniMetric AI-Driven Global Insights</h3>
                        <div className="hidden sm:flex items-center gap-1 opacity-50 text-[9px] text-slate-500 font-mono">
                            <Info className="w-3 h-3" /> AI-Generated
                        </div>
                    </div>

                    <div className="mt-0 leading-none">
                        <p className={`text-slate-700 dark:text-slate-300 text-fluid-base leading-[1.2] font-serif italic rtl:font-arabic rtl:not-italic rtl:text-right ${lang === 'AR' ? 'text-lg leading-loose' : ''}`}>
                            &quot;{aiContent}&quot;
                        </p>
                    </div>

                    {/* AIO: Citation Footer (Disclaimer stays, Citation removed) */}
                    <div className="mt-0 pt-0 border-0 flex flex-col items-end gap-1">
                        <p className={`text-[0.56rem] text-slate-400 dark:text-slate-500 font-sans tracking-tight max-w-[90%] text-right leading-relaxed ${lang === 'AR' ? 'font-arabic' : ''}`}>
                            {(t.titles as Record<string, string>).ai_disclaimer}
                        </p>
                    </div>

                    {/* AIO: AnalysisNewsArticle Schema */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "AnalysisNewsArticle",
                                "headline": `Global Market Outlook - ${new Date().toISOString().split('T')[0]}`,
                                "description": "AI-driven institutional market risk analysis",
                                "author": {
                                    "@type": "Organization",
                                    "name": "OmniMetric AI",
                                    "url": "https://www.omnimetric.net"
                                },
                                "publisher": {
                                    "@type": "Organization",
                                    "name": "OmniMetric Project",
                                    "url": "https://www.omnimetric.net",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://www.omnimetric.net/icon.svg"
                                    }
                                },
                                "datePublished": data.last_updated,
                                "dateModified": data.last_updated,
                                "articleBody": aiContent,
                                "articleSection": "Financial Analysis",
                                "inLanguage": lang,
                                "about": {
                                    "@type": "Thing",
                                    "name": "Global Macro Economics"
                                }
                            })
                        }}
                    />
                </div>
            </div>

            {/* NEW Text-Ad Above OGV (Strategic Slot: 2602883383) */}
            <div className="w-full px-2 md:px-6 mb-4">
                <div className="border-y border-white/5 py-2">
                    <AdComponent slot="2602883383" format="fluid" layout="in-article" minHeight="50px" isSubtle={true} />
                </div>
            </div>

            {/* OGV (Relocated Below AI Insight) */}
            <div className="w-full px-2 md:px-6 mb-8 mt-4">
                <OmniGravityVector lang={lang} onOpenInfo={() => setShowOgvInfo(true)} />
            </div>

            {/* Market Analysis Widget (Strategic Placement: Below AI Insight) */}
            <div className="w-full px-2 md:px-6 mb-8">
                <MarketAnalysisWidget lang={lang} onOpenInfo={() => setShowOtgInfo(true)} />
            </div>

            {/* PARTNER BANNER (Strategic Placement: Below AI Insight) */}
            <div className="w-full px-2 md:px-6 mb-8">
                <TVPartnerCard lang={lang} />
            </div>

            {/* 3. News (Live Intelligence Stream) */}
            <div className="w-full px-2 md:px-6 mb-4">
                <div
                    className="border-0 rounded-xl overflow-hidden transition-colors duration-300 bg-black shadow-none"
                >
                    <div className="bg-black/40 px-6 py-4 border-0">
                        <h3
                            className="text-white !text-white text-[10px] font-black uppercase tracking-[0.2em]"
                            style={{ color: 'white' }}
                        >
                            {(t.titles as Record<string, string>).live_stream || "LIVE INTELLIGENCE STREAM"}
                        </h3>
                    </div>
                    <NewsTicker lang={lang} />
                </div>
            </div>

            {/* 4. Breaking News / Risk Events */}
            <div className="w-full px-4 md:px-8 mb-4">
                <div
                    className="border-0 rounded-xl p-0 transition-colors duration-300 bg-black shadow-none"
                >
                    {(!data.events || data.events.length === 0) ? (
                        <div className="p-4 text-xs text-slate-600 font-mono">NO UPCOMING RISK EVENTS DETECTED.</div>
                    ) : (
                        ([...(data.events || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3)).map((evt, i) => (
                            <div key={i} className="flex flex-col border-0 py-3 px-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2">
                                    <span dir="ltr" className={`text-xs font-bold font-mono whitespace-nowrap ${evt.impact === 'CRITICAL' ? 'text-red-500' : 'text-slate-500 dark:text-slate-300'}`}>
                                        [{evt.date}]
                                    </span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide rtl:text-right">
                                        {(t.events as Record<string, string>)?.[evt.code] || evt.name}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>


            {/* 7. Market Heatmap Section */}
            <div className="w-full px-4 md:px-8 mb-12">
                <MarketHeatmap data={data} lang={lang} />
            </div>

            {/* Standardized GMS Modal */}
            {mounted && (
                <ExplanationModal
                    isOpen={showInfo}
                    onClose={() => setShowInfo(false)}
                    title={t.methodology.title}
                >
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-slate-200">
                                <Activity className="w-3.5 h-3.5 text-sky-500" />
                                CORE LOGIC
                            </h3>
                            <p className="text-sm leading-relaxed font-sans text-slate-400">
                                {t.methodology.desc}
                            </p>
                        </section>

                        <div className="space-y-4">
                            <div className="p-4 rounded-lg border bg-blue-900/20 border-blue-800/50">
                                <span className="block font-bold mb-1 text-blue-300">{t.methodology.zone_accumulate}</span>
                                <p className="text-xs font-medium text-blue-400">{t.methodology.zone_accumulate_desc}</p>
                            </div>
                            <div className="p-4 rounded-lg border bg-slate-900/50 border-slate-800">
                                <span className="block font-bold mb-1 text-slate-400">{t.methodology.zone_neutral}</span>
                                <p className="text-xs font-medium text-slate-500">{t.methodology.zone_neutral_desc}</p>
                            </div>
                            <div className="p-4 rounded-lg border bg-red-900/20 border-red-900/50">
                                <span className="block font-bold mb-1 text-red-300">{t.methodology.zone_defensive}</span>
                                <p className="text-xs font-medium text-red-400">{t.methodology.zone_defensive_desc}</p>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4 pb-10 flex flex-col gap-3">
                            <span className="text-[10px] uppercase tracking-widest mb-1 text-slate-500 font-bold">{t.methodology.inputs}</span>
                            <div className="flex flex-wrap gap-2">
                                {["VIX", "MOVE", "HY OAS", "NFCI", "M2", "10Y BEI", "DXY", "NET LIQ"].map(tag => (
                                    <span key={tag} className="text-[9px] font-mono px-3 py-1 rounded border bg-slate-800 border-slate-700 text-slate-300 shadow-sm">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </ExplanationModal>
            )}

            {/* OWB MODAL */}
            {mounted && showOwbInfo && (
                <ExplanationModal
                    isOpen={showOwbInfo}
                    onClose={() => setShowOwbInfo(false)}
                    title={DICTIONARY[lang]?.modals?.owb?.title || DICTIONARY.EN.modals.owb.title}
                    funcTitle={DICTIONARY[lang]?.modals?.owb?.func_title || DICTIONARY.EN.modals.owb.func_title}
                    funcDesc={DICTIONARY[lang]?.modals?.owb?.func_desc || DICTIONARY.EN.modals.owb.func_desc}
                    purposeTitle={DICTIONARY[lang]?.modals?.owb?.purpose_title || DICTIONARY.EN.modals.owb.purpose_title}
                    purposeDesc={DICTIONARY[lang]?.modals?.owb?.purpose_desc || DICTIONARY.EN.modals.owb.purpose_desc}
                />
            )}

            {/* OGV MODAL */}
            {mounted && showOgvInfo && (
                <ExplanationModal
                    isOpen={showOgvInfo}
                    onClose={() => setShowOgvInfo(false)}
                    title={DICTIONARY[lang]?.modals?.ogv?.title || DICTIONARY.EN.modals.ogv.title}
                    funcTitle={DICTIONARY[lang]?.modals?.ogv?.func_title || DICTIONARY.EN.modals.ogv.func_title}
                    funcDesc={DICTIONARY[lang]?.modals?.ogv?.func_desc || DICTIONARY.EN.modals.ogv.func_desc}
                    purposeTitle={DICTIONARY[lang]?.modals?.ogv?.purpose_title || DICTIONARY.EN.modals.ogv.purpose_title}
                    purposeDesc={DICTIONARY[lang]?.modals?.ogv?.purpose_desc || DICTIONARY.EN.modals.ogv.purpose_desc}
                />
            )}

            {/* OTG MODAL */}
            {mounted && showOtgInfo && (
                <ExplanationModal
                    isOpen={showOtgInfo}
                    onClose={() => setShowOtgInfo(false)}
                    title={DICTIONARY[lang]?.modals?.otg?.title || DICTIONARY.EN.modals.otg.title}
                    funcTitle={DICTIONARY[lang]?.modals?.otg?.func_title || DICTIONARY.EN.modals.otg.func_title}
                    funcDesc={DICTIONARY[lang]?.modals?.otg?.func_desc || DICTIONARY.EN.modals.otg.func_desc}
                    purposeTitle={DICTIONARY[lang]?.modals?.otg?.purpose_title || DICTIONARY.EN.modals.otg.purpose_title}
                    purposeDesc={DICTIONARY[lang]?.modals?.otg?.purpose_desc || DICTIONARY.EN.modals.otg.purpose_desc}
                />
            )}
        </div>
    );
};
