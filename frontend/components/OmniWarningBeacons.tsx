'use client';

import React from 'react';
<<<<<<< HEAD
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
        yield_curve: "收益率曲線 (10Y-3M)",
        credit_risk: "信用風險",
        volatility: "波動率",
        inverted: "倒挂",
        normal: "正常",
        stress: "壓力",
        calm: "平靜",
        panic: "恐慌",
        stable: "穩定",
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
    // High-Saturation "Neon" Palette with Enhanced Multi-layered "Soft Bloom" shadows
    let baseColor = "bg-[#00ff9f]"; // Matrix/Neon Green
    let glowColor = "shadow-[0_0_30px_rgba(0,255,159,1),0_0_60px_rgba(0,255,159,0.7),0_0_120px_rgba(0,255,159,0.5),0_0_200px_rgba(0,255,159,0.3)]";
    let auraColor = "bg-[#00ff9f]/20";
    let ringColor = "border-[#00ff9f]/50";
    let textColor = "text-[#00ff9f]";
    let displayText = normalLabel;

    const isDanger = status === 'danger';
    const isWarning = status === 'warning';

    if (isDanger) {
        baseColor = "bg-[#ff073a]"; // Neon Pulse Red
        glowColor = "shadow-[0_0_35px_rgba(255,7,58,1),0_0_70px_rgba(255,7,58,0.7),0_0_140px_rgba(255,7,58,0.5),0_0_220px_rgba(255,7,58,0.3)]";
        auraColor = "bg-[#ff073a]/20";
        ringColor = "border-[#ff073a]/60";
        textColor = "text-[#ff073a]";
        displayText = dangerLabel;
    } else if (isWarning) {
        baseColor = "bg-[#fff01f]"; // Cyberpunk Yellow
        glowColor = "shadow-[0_0_30px_rgba(255,240,31,1),0_0_60px_rgba(255,240,31,0.7),0_0_130px_rgba(255,240,31,0.5),0_0_210px_rgba(255,240,31,0.3)]";
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
                {/* Atmospheric "Blurred Aura" (Surrounding Fog) - Enhanced */}
                <div className={`absolute -inset-12 rounded-full ${auraColor} blur-3xl opacity-60 transition-opacity duration-1000 ${isDanger ? 'animate-pulse-fast' : (isWarning ? 'animate-pulse' : '')}`} />

                {/* Vibrant Glow Boundary - Enhanced with additional outer layer */}
                <div className={`absolute -inset-2 rounded-full ${glowColor} opacity-40 blur-md`} />
                <div className={`absolute -inset-1 rounded-full ${glowColor} opacity-60`} />

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
=======
import { AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { DICTIONARY, LangType } from '@/data/dictionary';

interface BeaconsProps {
    data: any;
    lang: LangType;
}

export const OmniWarningBeacons = ({ data, lang }: BeaconsProps) => {
    const t = DICTIONARY[lang] || DICTIONARY['EN'];
    const market = data.market_data || {};
    const beacons = [];

    // 1. VIX Spike (RED)
    if (market.VIX?.price > 20) {
        beacons.push({
            id: 'VIX',
            label: "VIX",
            sub: "> 25",
            color: "text-red-500",
            border: "border-red-600",
            glow: "shadow-[0_0_30px_rgba(220,38,38,0.6)]",
            bg: "bg-red-950",
            core: "from-red-200 via-red-500 to-red-950"
        });
    }

    // 2. Yield Inversion (AMBER/ORANGE)
    if (market.YIELD_SPREAD?.price < 0) {
        beacons.push({
            id: 'YIELD',
            label: "YIELD",
            sub: "INV",
            color: "text-orange-500",
            border: "border-orange-500",
            glow: "shadow-[0_0_30px_rgba(249,115,22,0.6)]",
            bg: "bg-orange-950",
            core: "from-orange-200 via-orange-500 to-orange-950"
        });
    }

    // 3. Oil Surge (YELLOW)
    if (market.OIL?.change_percent > 3.0) {
        beacons.push({
            id: 'OIL',
            label: "OIL",
            sub: "SURGE",
            color: "text-yellow-400",
            border: "border-yellow-400",
            glow: "shadow-[0_0_30px_rgba(250,204,21,0.6)]",
            bg: "bg-yellow-950",
            core: "from-yellow-100 via-yellow-400 to-yellow-900"
        });
    }

    if (beacons.length === 0) return null;

    return (
        <div className="w-full flex justify-center gap-6 mt-8 mb-4 animate-in fade-in zoom-in duration-500">
            {beacons.map((b) => (
                <div key={b.id} className="flex flex-col items-center gap-2 group cursor-help">
                    {/* INDUSTRIAL LAMP (80px) */}
                    <div className={`w-[80px] h-[80px] rounded-full border-[5px] ${b.border} ${b.bg} ${b.glow} relative flex items-center justify-center shadow-2xl overflow-hidden animate-pulse-slow`}>
                        {/* Inner Reflector */}
                        <div className="absolute inset-1 rounded-full border border-black/50 opacity-50"></div>

                        {/* CORE GLOW (Uniform) */}
                        <div className={`w-[40%] h-[40%] rounded-full bg-radial-gradient ${b.core} blur-md opacity-90 animate-pulse`}></div>

                        {/* Glossy Lens Effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-black/60 pointer-events-none mix-blend-overlay"></div>
                    </div>

                    {/* LABEL */}
                    <div className="text-center leading-tight">
                        <div className={`text-[10px] font-black tracking-widest uppercase ${b.color} drop-shadow-md`}>{b.label}</div>
                        <div className="text-[9px] font-mono text-slate-500 font-bold">{b.sub}</div>
                    </div>
                </div>
            ))}
>>>>>>> origin/main
        </div>
    );
};
