'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';
import { DICTIONARY } from '@/data/dictionary';
import dynamic from 'next/dynamic';

// --- RISK BAR COMPONENT (LINEAR GRADIENT) ---
interface GaugeProps {
    score: number;
    lang?: string;
}
// --- REFINED RISK GAUGE: OVERLAY STYLE ---
export const RiskGauge = ({ score = 0, lang = 'EN' }: GaugeProps) => {
    // Clamp score and handle NaN
    const validScore = isNaN(score) ? 0 : score;
    const pct = Math.min(100, Math.max(0, validScore));
    const isRTL = lang === 'AR';

    // Dynamic Neon Styling (V5 Polish)
    let borderColor = "#94a3b8"; // Neutral Gray
    let shadowColor = "rgba(148, 163, 184, 0.5)"; // Neutral Glow
    let textColor = "#FFFFFF";

    if (score > 60) {
        borderColor = "#00f2ff"; // Neon Blue (V5 Polish)
        shadowColor = "rgba(0, 242, 255, 0.6)";
        textColor = "#67e8f9";
    } else if (score < 40) {
        borderColor = "#ef4444"; // Red (Defensive)
        shadowColor = "rgba(239, 68, 68, 0.6)";
        textColor = "#f87171";
    } else {
        borderColor = "#94a3b8"; // Gray (Neutral - User Req)
        shadowColor = "rgba(148, 163, 184, 0.6)";
        textColor = "#cbd5e1";
    }

    return (
        <div className="w-full relative mt-2 mb-2 gms-container">
            {/* V5 NEON PILL SLIDER (h-6 / 1.5rem) */}
            <div className="relative w-full" style={{ height: '1.5rem' }}>
                {/* 1. Track Background */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[0.5rem] bg-slate-800 rounded-full overflow-hidden"></div>

                {/* 2. active Gradient Track (Screen Blend) */}
                <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden opacity-80 mix-blend-screen pointer-events-none">
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backgroundImage: isRTL
                                ? 'linear-gradient(90deg, #00f2ff 0%, #94a3b8 50%, #ef4444 100%)'
                                : 'linear-gradient(90deg, #ef4444 0%, #94a3b8 50%, #00f2ff 100%)',
                            maskImage: 'linear-gradient(black, black)',
                            WebkitMaskImage: 'linear-gradient(black, black)',
                            height: '100%',
                            opacity: 0.4
                        }}
                    />
                </div>

                {/* 3. The Marker (Neon Pill V2) */}
                <div
                    className="absolute top-1/2 flex flex-col items-center z-50 transition-all duration-700 ease-out"
                    style={{
                        left: isRTL ? 'auto' : `${pct}%`,
                        right: isRTL ? `${pct}%` : 'auto',
                        transform: 'translate(calc(-50% * var(--dir)), -50%)',
                        ['--dir' as string]: isRTL ? 1 : 1
                    }}
                >
                    {/* Glow Effect */}
                    <div
                        className="absolute inset-0 rounded-full blur-md opacity-60"
                        style={{ backgroundColor: borderColor }}
                    ></div>

                    {/* The Pill (Strong Border) */}
                    <div
                        className="relative bg-[#0f172a] px-2 py-0.5 rounded-full shadow-2xl flex items-center justify-center min-w-[2.8rem]"
                        style={{
                            border: `2px solid ${borderColor}`,
                            boxShadow: `0 0 10px ${shadowColor}`
                        }}
                    >
                        <span className="text-[0.85rem] font-black leading-none tabular-nums tracking-tighter" style={{ color: "white" }}>
                            {Math.round(score)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className={`flex justify-between px-1 mt-1 relative z-0`}>
                <span className="text-fluid-xs font-bold text-[#ef4444] uppercase tracking-widest drop-shadow-sm opacity-80">Defensive</span>
                <span className="text-fluid-xs font-bold text-slate-400 uppercase tracking-widest drop-shadow-sm opacity-50">Neutral</span>
                <span className="text-fluid-xs font-bold text-[#3b82f6] uppercase tracking-widest drop-shadow-sm opacity-80">Accumulate</span>
            </div>
        </div>
    );
};

const Plot = dynamic(() => import('@/components/PlotlyChart'), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-600 font-mono uppercase animate-pulse">Loading Chart...</div>
});

// --- HISTORY CHART (PLOTLY IMPLEMENTATION) ---
interface HistoryEntry {
    date: string;
    score: number;
}
export const HistoryChart = ({ data, lang = 'EN', color = '#0ea5e9' }: { data: HistoryEntry[], lang?: string, color?: string }) => {
    // @ts-expect-error: DICTIONARY indexing might be slightly off for some LangType values
    const t = DICTIONARY[lang] || DICTIONARY['EN'];

    if (!data || data.length === 0) return (
        <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-600 font-mono uppercase tracking-widest">
            {t.chart.sync}
        </div>
    );

    // Localize and format dates
    const normalizedLang = lang?.toUpperCase();
    const isJP = normalizedLang === 'JP';

    const chartDataValues = [...(data || [])].map(d => {
        try {
            const date = new Date(d.date);
            // If the date is invalid (already formatted), return as is
            if (isNaN(date.getTime())) return d;

            const formatter = new Intl.DateTimeFormat('en-US', {
                month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit',
                hour12: false,
                timeZone: isJP ? 'Asia/Tokyo' : 'UTC'
            });
            const parts = formatter.formatToParts(date);
            const m = parts.find(p => p.type === 'month')?.value;
            const day = parts.find(p => p.type === 'day')?.value;
            const h = parts.find(p => p.type === 'hour')?.value;
            const min = parts.find(p => p.type === 'minute')?.value;
            return {
                ...d,
                date: `${m}/${day} ${h}:${min}`
            };
        } catch {
            return d;
        }
    });

    return (
        <div className="h-full w-full flex flex-col pt-2">
            <div className="flex-1 min-h-0">
                <Plot
                    data={[
                        {
                            x: chartDataValues.map(d => d.date),
                            y: chartDataValues.map(d => d.score),
                            type: 'scatter',
                            mode: 'lines', // Removed markers for smoother look
                            line: { color: color, width: 3, shape: 'spline', smoothing: 1.3 },
                            fill: 'tozeroy',
                            fillcolor: `${color}26`, // 15% Opacity
                            name: 'GMS',
                            hovertemplate: '<b>%{y} GMS</b><br>%{x}<extra></extra>'
                        }
                    ]}
                    layout={{
                        autosize: true,
                        margin: { l: 20, r: 5, t: 5, b: 20 },
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        showlegend: false,
                        xaxis: {
                            showgrid: false,
                            zeroline: false,
                            showline: false,
                            tickfont: { color: normalizedLang === 'JP' ? '#475569' : '#64748b', size: 9 }, // Slate-500
                            type: 'category'
                        },
                        yaxis: {
                            range: [0, 100],
                            showgrid: true,
                            gridcolor: 'rgba(0,0,0,0.05)', // Default Light Grid
                            zeroline: false,
                            showline: false,
                            tickfont: { color: normalizedLang === 'JP' ? '#475569' : '#64748b', size: 9 }
                        },
                        font: { family: 'var(--font-inter), sans-serif' }
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            <div className="text-center text-[9px] text-slate-700 font-mono mt-1 opacity-60 tracking-[0.3em] uppercase">
                {t.chart.trend}
            </div>
        </div>
    );
};

// --- DETAILED METRIC CHART (30-DAY PLOTLY) WITH HIGH-CONTRAST AXES ---
interface MetricChartProps {
    data: number[];
    color: string;
    currentPrice?: string;
    startDate?: string;
    endDate?: string;
    yRange?: [number, number];
}

export const MetricChart = ({ data, color }: MetricChartProps) => {
    if (!data || data.length === 0) return null;

    // Convert array to object array for Recharts
    const chartData = data.map((val, i) => ({ i, val }));

    return (
        <div className="h-full w-full relative flex flex-col">
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <YAxis domain={['auto', 'auto']} hide />
                        <Area
                            type="monotone"
                            dataKey="val"
                            stroke={color}
                            fill={`url(#grad-${color})`}
                            strokeWidth={2}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
