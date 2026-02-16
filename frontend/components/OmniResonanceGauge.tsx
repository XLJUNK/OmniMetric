'use client';

import React from 'react';

interface OmniResonanceGaugeProps {
    temperature: number; // 0 to 100
    label?: string;
    ot: any;
}

export const OmniResonanceGauge: React.FC<OmniResonanceGaugeProps> = ({ temperature, label = "Current Asset Temp", ot }) => {
    // 0 is blue (cold), 50 is yellow (neutral), 100 is red (fire)
    const getColor = (temp: number) => {
        if (temp < 50) return `rgb(${Math.floor(temp * 5)}, ${Math.floor(100 + temp * 2)}, 255)`;
        return `rgb(255, ${Math.floor(255 - (temp - 50) * 5)}, 0)`;
    };

    const color = getColor(temperature);
    const rotation = (temperature / 100) * 180 - 90;

    return (
        <div className="w-full flex flex-col items-center p-6 bg-slate-900/50 rounded-2xl border border-sky-500/20 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
            <h3 className="text-sky-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">{ot.gauge_title}</h3>

            <div className="relative w-48 h-24 overflow-hidden">
                {/* Gauge Background */}
                <div className="absolute w-48 h-48 rounded-full border-[12px] border-slate-800" />

                {/* Gauge Active Track */}
                <div
                    className="absolute w-48 h-48 rounded-full border-[12px] border-transparent transition-all duration-1000 ease-out border-t-[var(--gauge-color)] shadow-[0_0_15px_var(--gauge-glow)]"
                    style={{
                        '--gauge-color': color,
                        '--gauge-glow': `${color}40`,
                        borderRightColor: temperature > 50 ? color : 'transparent',
                        transform: `rotate(${(temperature / 100) * 180 - 180}deg)`,
                    } as React.CSSProperties}
                />

                {/* Needle */}
                <div
                    className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom -translate-x-1/2 transition-transform duration-1000 ease-out z-10"
                    style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                />

                {/* Center Cap */}
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-slate-100 rounded-full -translate-x-1/2 translate-y-2 z-20 shadow-lg" />
            </div>

            <div className="mt-4 text-center">
                <div
                    className="text-4xl font-black font-mono transition-all duration-700"
                    style={{
                        color: color,
                        textShadow: `0 0 20px ${color}60, 0 0 40px ${color}20`,
                    } as React.CSSProperties}
                >
                    {temperature.toFixed(1)}°
                    {temperature <= 0.1 && <span className="text-sm ml-2 opacity-50 font-bold" style={{ textShadow: 'none' }}>({ot.gauge_labels.ice.toUpperCase()})</span>}
                    {temperature >= 99.9 && <span className="text-sm ml-2 opacity-50 font-bold" style={{ textShadow: 'none' }}>({ot.gauge_labels.fire.toUpperCase()})</span>}
                </div>
                <div className="text-[10px] text-sky-400/70 font-black uppercase tracking-[0.2em] mt-2">{ot.portfolio_heat_label}</div>
            </div>

            <div className="w-full grid grid-cols-3 gap-2 mt-6">
                <div className="text-center">
                    <div className="h-1 bg-blue-500 rounded-full mb-1 opacity-50" />
                    <span className="text-[8px] text-slate-500 uppercase font-bold">{ot.gauge_labels.ice}</span>
                </div>
                <div className="text-center">
                    <div className="h-1 bg-yellow-400 rounded-full mb-1 opacity-50" />
                    <span className="text-[8px] text-slate-500 uppercase font-bold">{ot.gauge_labels.neutral}</span>
                </div>
                <div className="text-center">
                    <div className="h-1 bg-red-600 rounded-full mb-1 opacity-50" />
                    <span className="text-[8px] text-slate-500 uppercase font-bold">{ot.gauge_labels.fire}</span>
                </div>
            </div>
        </div>
    );
};
