'use client';

import React from 'react';
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
        </div>
    );
};
