'use client';

import React from 'react';
import { useSignalData } from '@/hooks/useSignalData';
import { Siren } from 'lucide-react';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { IndicatorHelpButton } from '@/components/IndicatorHelpButton';
import { ExplanationModal } from '@/components/ExplanationModal';
import { useSearchParams } from 'next/navigation';

// Localization Map for OWB
const TRANSLATIONS: Record<string, {
    yield_curve: string;
    credit_risk: string;
    volatility: string;
    inverted: string;
    normal: string;
    stress: string;
    calm: string;
    panic: string;
    stable: string;
    warn: string;
}> = {
    EN: {
        yield_curve: "Yield Curve (10Y-3M)",
        credit_risk: "Credit Risk",
        volatility: "Volatility",
        inverted: "INVERTED",
        normal: "NORMAL",
        stress: "STRESS",
        calm: "CALM",
        panic: "PANIC",
        stable: "STABLE",
        warn: "WARN"
    },
    JP: {
        yield_curve: "イールドカーブ (10Y-3M)",
        credit_risk: "クレジットリスク",
        volatility: "ボラティリティ",
        inverted: "逆イールド",
        normal: "正常",
        stress: "ストレス",
        calm: "平穏",
        panic: "パニック",
        stable: "安定",
        warn: "警戒"
    },
    CN: {
        yield_curve: "收益率曲线 (10Y-3M)",
        credit_risk: "信用风险",
        volatility: "波动率",
        inverted: "倒挂",
        normal: "正常",
        stress: "压力",
        calm: "平静",
        panic: "恐慌",
        stable: "稳定",
        warn: "警告"
    },
    ES: {
        yield_curve: "Curva de Tipos (10Y-3M)",
        credit_risk: "Riesgo de Crédito",
        volatility: "Volatilidad",
        inverted: "INVERTIDA",
        normal: "NORMAL",
        stress: "ESTRÉS",
        calm: "CALMA",
        panic: "PÁNICO",
        stable: "ESTABLE",
        warn: "ALERTA"
    },
    DE: {
        yield_curve: "Zinsstruktur (10Y-3M)",
        credit_risk: "Kreditrisiko",
        volatility: "Volatilität",
        inverted: "INVERTIERT",
        normal: "NORMAL",
        stress: "STRESS",
        calm: "RUHIG",
        panic: "PANIK",
        stable: "STABIL",
        warn: "WARNUNG"
    },
    FR: {
        yield_curve: "Courbe des Taux (10Y-3M)",
        credit_risk: "Risque de Crédit",
        volatility: "Volatilité",
        inverted: "INVERSÉE",
        normal: "NORMAL",
        stress: "STRESS",
        calm: "CALME",
        panic: "PANIQUE",
        stable: "STABLE",
        warn: "ALERTE"
    },
    HI: {
        yield_curve: "यील्ड वक्र (10Y-3M)",
        credit_risk: "क्रेडिट जोखिम",
        volatility: "अस्थिरता",
        inverted: "उल्टा (INVERTED)",
        normal: "सामान्य",
        stress: "तनाव (STRESS)",
        calm: "शांत",
        panic: "घबराहट (PANIC)",
        stable: "स्थिर",
        warn: "चेतावनी"
    },
    ID: {
        yield_curve: "Kurva Imbal Hasil (10Y-3M)",
        credit_risk: "Risiko Kredit",
        volatility: "Volatilitas",
        inverted: "TERBALIK",
        normal: "NORMAL",
        stress: "STRES",
        calm: "TENANG",
        panic: "PANIK",
        stable: "STABIL",
        warn: "AWAS"
    },
    AR: {
        yield_curve: "منحنى العائد (10Y-3M)",
        credit_risk: "مخاطر الائتمان",
        volatility: "التقلب",
        inverted: "معكوس",
        normal: "طبيعي",
        stress: "إجهاد",
        calm: "هدوء",
        panic: "ذعر",
        stable: "مستقر",
        warn: "تحذير"
    }
};

/**
 * OmniWarning Beacons (Industrial Refinement Phase 2)
 * Branding: Institutional Grade "OmniWarning Beacons"
 * Updates: 76px diameter, 5px thick rings, no center point highlight.
 */
export const OmniWarningBeacons = ({ onOpenInfo }: { onOpenInfo?: () => void }) => {
    const { data } = useSignalData();
    const beacons = data?.beacons;
    const params = useSearchParams();
    const lang = (params.get('lang') as LangType) || 'EN';
    const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

    // Modal logic moved to parent via onOpenInfo prop

    if (!beacons) return null;

    return (
        <div className="w-full relative">
            {/* Removed Absolute Help Button */}

            <div className="w-full max-w-[420px] mx-auto lg:mx-0 p-1 sm:p-2 flex flex-col items-center gap-2 sm:gap-6 origin-center">
                {/* Title Header - Row 1: Centered Title */}
                <div className="w-full flex justify-center px-2">
                    <div className="flex items-center gap-2 opacity-80">
                        <Siren className="w-4 h-4 text-sky-500" />
                        <span className="text-[10px] font-black tracking-[0.2em] text-slate-500 dark:text-slate-500 uppercase whitespace-nowrap translate-y-[1px]">
                            OmniWarning Beacons
                        </span>
                    </div>
                </div>

                {/* Header - Row 2: Right-Aligned Help Button */}
                <div className="w-full flex justify-end mb-2">
                    <IndicatorHelpButton
                        label="What's OWB"
                        onClick={() => onOpenInfo?.()}
                    />
                </div>



                {/* Lamp Array (Dynamic States) */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full justify-items-center">
                    <StatusBeacon
                        label={t.yield_curve}
                        status={beacons.recession?.status || "normal"}
                        dangerLabel={t.inverted}
                        normalLabel={t.normal}
                        warnLabel={t.warn}
                    />
                    <StatusBeacon
                        label={t.credit_risk}
                        status={beacons.credit?.status || "normal"}
                        dangerLabel={t.stress}
                        normalLabel={t.calm}
                        warnLabel={t.warn}
                    />
                    <StatusBeacon
                        label={t.volatility}
                        status={beacons.panic?.status || "normal"}
                        dangerLabel={t.panic}
                        normalLabel={t.stable}
                        warnLabel={t.warn}
                    />
                </div>

                {/* Modal rendered by parent */}
            </div>
        </div>
    );
};

const StatusBeacon = ({ label, status, dangerLabel, normalLabel, warnLabel }: {
    label: string,
    status: string,
    dangerLabel: string,
    normalLabel: string,
    warnLabel: string
}) => {
    // High-Saturation "Neon" Palette with Multi-layered "Soft Bloom" shadows
    let baseColor = "bg-[#00ff9f]"; // Matrix/Neon Green
    let glowColor = "shadow-[0_0_15px_rgba(0,255,159,0.8),0_0_50px_rgba(0,255,159,0.4),0_0_100px_rgba(0,255,159,0.2)]";
    let auraColor = "bg-[#00ff9f]/20";
    let ringColor = "border-[#00ff9f]/50";
    let textColor = "text-[#00ff9f]";
    let displayText = normalLabel;

    const isDanger = status === 'danger';
    const isWarning = status === 'warning';

    if (isDanger) {
        baseColor = "bg-[#ff073a]"; // Neon Pulse Red
        glowColor = "shadow-[0_0_20px_rgba(255,7,58,0.9),0_0_60px_rgba(255,7,58,0.5),0_0_120px_rgba(255,7,58,0.3)]";
        auraColor = "bg-[#ff073a]/20";
        ringColor = "border-[#ff073a]/60";
        textColor = "text-[#ff073a]";
        displayText = dangerLabel;
    } else if (isWarning) {
        baseColor = "bg-[#fff01f]"; // Cyberpunk Yellow
        glowColor = "shadow-[0_0_15px_rgba(255,240,31,0.9),0_0_50px_rgba(255,240,31,0.5),0_0_110px_rgba(255,240,31,0.3)]";
        auraColor = "bg-[#fff01f]/20";
        ringColor = "border-[#fff01f]/50";
        textColor = "text-[#fff01f]";
        displayText = warnLabel;
    }

    return (
        <div className="flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
            {/* Thick Ring: border-[5px], Diameter: 76px */}
            <div className={`
                relative w-[60px] h-[60px] sm:w-[76px] sm:h-[76px] rounded-full border-[3px] sm:border-[5px] ${ringColor} 
                flex items-center justify-center transition-all duration-700
                bg-white dark:bg-[#050505] overflow-visible
            `}>
                {/* Atmospheric "Blurred Aura" (Surrounding Fog) */}
                <div className={`absolute -inset-8 rounded-full ${auraColor} blur-2xl opacity-40 transition-opacity duration-1000 ${isDanger ? 'animate-pulse-fast' : (isWarning ? 'animate-pulse' : '')}`} />

                {/* Vibrant Glow Boundary */}
                <div className={`absolute -inset-1 rounded-full ${glowColor} opacity-50`} />

                {/* The Lamp Core (No border, uniform glow) */}
                <div className={`
                    w-8 h-8 sm:w-11 sm:h-11 rounded-full ${baseColor} ${glowColor}
                    ${isDanger ? 'animate-pulse-fast' : ''}
                    ${isWarning ? 'animate-pulse' : ''}
                    relative z-10
                `}>
                    {/* Soft Reflection (Not a point) */}
                    <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-white/30 blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />
                </div>
            </div>

            {/* Direct Status Labels */}
            <div className="text-center">
                <div className="text-[8px] sm:text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                    {label}
                </div>
                <div className={`text-[10px] sm:text-[12px] font-black ${textColor} uppercase leading-none`}>
                    {displayText}
                </div>
            </div>
        </div>
    );
};
