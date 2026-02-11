'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { OmniResonanceInput, Allocation } from '@/components/OmniResonanceInput';
import { OmniResonanceGauge } from '@/components/OmniResonanceGauge';
import { OmniResonanceTwinPlot } from '@/components/OmniResonanceTwinPlot';
import { Radar, Thermometer, Info, Scale } from 'lucide-react';
import { LangType, DICTIONARY } from '@/data/dictionary';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface OmniResonanceClientProps {
    lang: LangType;
}

export default function OmniResonanceClient({ lang }: OmniResonanceClientProps) {
    const { data: marketData } = useSWR('/data/market_data.json', fetcher);

    const [allocation, setAllocation] = useState<Allocation>({
        equities: 40,
        crypto: 10,
        metals: 10,
        fixedIncome: 20,
        cash: 20
    });

    // OmniResonance Dev Checklist (Phase 2)
    // - [x] Final UI Polish & Authority Enhancement
    // - [x] Enhance quadrant label contrast and HUD axis ticks.
    // - [x] Implement temperature glow on gauge numbers.
    // - [x] Add persistent compliance footer.
    // - [x] Add interactive feature guide explanation.

    // Client-side Logic (Zero CPU)
    const resonanceData = useMemo(() => {
        // ASSET VECTOR DEFINITIONS (Refined Phase 2)
        // X: Growth Momentum (Expansion + / Contraction -)
        // Y: Macro Pressure (High Pressure + / Low Pressure -)
        const assetVectors = {
            equities: { x: 80, y: -20 },
            crypto: { x: 100, y: 30 },
            metals: { x: -40, y: 80 },
            fixedIncome: { x: -60, y: -40 },
            cash: { x: 0, y: 0 }
        };

        // 1. Calculate weighted position (User Vector)
        const userVector = {
            x: (
                allocation.equities * assetVectors.equities.x +
                allocation.crypto * assetVectors.crypto.x +
                allocation.metals * assetVectors.metals.x +
                allocation.fixedIncome * assetVectors.fixedIncome.x +
                allocation.cash * assetVectors.cash.x
            ) / 100,
            y: (
                allocation.equities * assetVectors.equities.y +
                allocation.crypto * assetVectors.crypto.y +
                allocation.metals * assetVectors.metals.y +
                allocation.fixedIncome * assetVectors.fixedIncome.y +
                allocation.cash * assetVectors.cash.y
            ) / 100
        };

        // 2. ABSOLUTE TEMPERATURE (Decoupled from Market Data)
        // Distance from (0,0) defines heat.
        const distance = Math.hypot(userVector.x, userVector.y);

        // Scale temperature: 0 to 100 base on distance.
        // Diagonal max distance is ~128 (for 100, 80 mix). Let's use 0.8 factor.
        const gaugeTemp = Math.min(100, distance * 0.85);

        // 3. Market Vector (Reference Point)
        // Keep OGV as a ghost reference for resonance
        const marketVector = marketData?.ogv?.current_vector || { x: 50, y: 50 };

        // Resonance Status & Distance (Relative to Market Core)
        const resonanceDistance = Math.hypot(marketVector.x - userVector.x, marketVector.y - userVector.y);
        let status: 'low' | 'mid' | 'high' = 'mid';
        if (resonanceDistance < 30) status = 'low';
        else if (resonanceDistance > 70) status = 'high';

        return { gaugeTemp, marketVector, userVector, distance: resonanceDistance, status };
    }, [marketData, allocation]);

    if (!marketData) return <div className="min-h-screen bg-black flex items-center justify-center text-sky-500 font-mono tracking-widest animate-pulse">CALIBRATING SYSTEM...</div>;

    const t = DICTIONARY[lang] || DICTIONARY.EN;
    const ot = t.subpages.omni_resonance;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-inter pb-20">
            {/* Header */}
            <header className="p-8 border-b border-slate-800 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-sky-500/10 rounded-lg">
                        <Radar className="w-6 h-6 text-sky-400" />
                    </div>
                    {lang === 'JP' ? (
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic">OmniResonance <span className="text-sky-500 not-italic">プロトタイプ</span></h1>
                    ) : (
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic">{ot.title.split(' ')[0]} <span className="text-sky-500 not-italic">{ot.title.split(' ')[1]}</span></h1>
                    )}
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] text-center">{ot.subtitle}</p>
            </header>

            <main className="max-w-[360px] mx-auto p-4 md:p-8 flex flex-col gap-8">
                {/* Left Column: Input */}
                <section className="space-y-8">
                    <div className="p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl flex gap-4">
                        <Info className="w-5 h-5 text-sky-400 shrink-0" />
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            <span className="text-sky-300 font-bold">{ot.alpha_notice_label}:</span> {ot.alpha_notice.replace(`${ot.alpha_notice_label}: `, '').replace(`${ot.alpha_notice_label} : `, '').replace(`${ot.alpha_notice_label}:`, '')}
                        </p>
                    </div>

                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex gap-4">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg self-start">
                            <span className="text-emerald-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse-pointer-2"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path d="m13 13 6 6" /></svg>
                            </span>
                        </div>
                        <p className="text-[11px] text-emerald-100/70 leading-relaxed font-bold">
                            {ot.feature_guide}
                        </p>
                    </div>

                    <OmniResonanceInput
                        allocation={allocation}
                        onChange={setAllocation}
                        lang={lang}
                    />


                </section>

                {/* Right Column: Visual Output */}
                <section className="space-y-8">
                    {resonanceData && (
                        <>
                            <OmniResonanceGauge temperature={resonanceData.gaugeTemp} />
                            <OmniResonanceTwinPlot
                                marketVector={resonanceData.marketVector}
                                userVector={resonanceData.userVector}
                                statusLabel={ot.resonance_status?.[resonanceData.status]}
                            />

                            {/* Technical Observation Report (Moved) */}
                            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-xl">
                                <h4 className="text-[11px] font-black text-sky-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                                    {ot.tech_report}
                                </h4>
                                <div className="text-sm text-slate-300 leading-relaxed space-y-5 font-mono">
                                    {allocation.cash > 80 ? (
                                        <p className="text-sky-300 font-bold border-l-2 border-sky-400 pl-4 py-2 bg-sky-400/5 rounded-r-lg">
                                            <span className="text-[10px] text-sky-500 block mb-1 uppercase tracking-widest">{ot.technical_insight}</span>
                                            {ot.safe_haven_report || "You are currently positioned outside the market's gravitational field (Safe Haven), completely isolated from macro overheating."}
                                        </p>
                                    ) : (
                                        <>
                                            <div className="border-l-2 border-slate-700 pl-4 py-1">
                                                <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-widest font-black">{ot.observation}</span>
                                                <span className="text-white font-bold">{resonanceData?.gaugeTemp && resonanceData.gaugeTemp > 70 ? "High Exposure (Extreme)" : "Stable (Neutral)"}</span>
                                            </div>
                                            <div className="border-l-2 border-sky-500/30 pl-4 py-1">
                                                <span className="text-[10px] text-sky-500 block mb-1 uppercase tracking-widest font-black">{ot.technical_insight}</span>
                                                <span className="text-slate-200 leading-6">{ot.tech_insight_content}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                </section>
            </main>

            {/* Compliance Footer (Permanent) */}
            <footer className="max-w-4xl mx-auto px-8 py-12 border-t border-slate-800/50 mt-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-red-400/60 font-black uppercase tracking-[0.2em] text-[9px]">
                        <Scale className="w-3.5 h-3.5" />
                        {ot.legal_title}
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed text-center font-medium max-w-2xl px-4">
                        {DICTIONARY[lang.toUpperCase() as LangType]?.subpages?.legal?.disclaimer_content || "OmniMetric is an information aggregator. The information provided does not constitute investment, financial, or legal advice. All data and analysis are provided 'as is' without warranty of any kind."}
                    </p>
                </div>
            </footer>
        </div>
    );
}
