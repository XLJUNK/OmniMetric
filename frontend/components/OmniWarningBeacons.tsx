'use client';

import React from 'react';
import { AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { DICTIONARY, LangType } from '@/data/dictionary';

// Warning Beacons Component (System Health / Market Stress)
interface BeaconsProps {
    data: any;
    lang: LangType;
}

export const OmniWarningBeacons = ({ data, lang }: BeaconsProps) => {
    const t = DICTIONARY[lang] || DICTIONARY['EN'];

    // Beacon Logic derived from Signal Data
    const market = data.market_data || {};
    const beacons = [];

    // 1. VIX Spike Beacon
    if (market.VIX?.price > 25) {
        beacons.push({
            id: 'VIX_SPIKE',
            level: 'CRITICAL',
            label: "VIX > 25",
            desc: t.beacons?.vix_spike || "Vol Spike",
            color: "text-red-500",
            bg: "bg-red-500/10",
            border: "border-red-500/30"
        });
    }

    // 2. Yield Inversion Beacon
    if (market.YIELD_SPREAD?.price < -0.5) {
        beacons.push({
            id: 'YIELD_INVERT',
            level: 'WARNING',
            label: "10Y-3M INV",
            desc: t.beacons?.yield_invert || "Deep Inversion",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500/30"
        });
    }

    // 3. Oil Surge Beacon
    if (market.OIL?.change_percent > 3.0) {
        beacons.push({
            id: 'OIL_SURGE',
            level: 'ALERT',
            label: "OIL +3%",
            desc: t.beacons?.oil_surge || "Energy Shock",
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/30"
        });
    }

    if (beacons.length === 0) return null;

    return (
        <div className="w-full flex flex-wrap gap-4 mt-6 animate-in fade-in slide-in-from-top-4 duration-700">
            {beacons.map((b) => (
                <div key={b.id} className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${b.bg} ${b.border} shadow-sm backdrop-blur-sm`}>
                    <AlertTriangle className={`w-4 h-4 ${b.color} animate-pulse`} />
                    <div className="flex flex-col">
                        <span className={`text-[0.65rem] font-black tracking-widest uppercase ${b.color}`}>{b.level}</span>
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">{b.desc}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
