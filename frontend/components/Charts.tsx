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

    return (
        <div className="w-full relative mt-2 mb-2 gms-container">
            {/* Gradient Bar Wrapper (Height Fixed) */}
            <div className="relative w-full h-[1.625rem]">
                {/* 1. The Gradient Background (Overflow Hidden for Rounded Corners) */}
                <div
                    className={`absolute inset-0 w-full h-full rounded-full border border-slate-700 overflow-hidden ${isRTL
                        ? 'bg-gradient-to-r from-[#3b82f6] via-[#94a3b8] to-[#ef4444]'
                        : 'bg-gradient-to-r from-[#ef4444] via-[#94a3b8] to-[#3b82f6]'
                        }`}
                >
                </div>

                {/* 2. The Marker (Overlay on top of the bar, matching height) */}
                <div
                    className="absolute top-0 bottom-0 h-full flex flex-col items-center justify-center z-50 transition-all duration-700 ease-out pointer-events-none"
                    style={{
                        left: isRTL ? 'auto' : `${pct}%`,
                        right: isRTL ? `${pct}%` : 'auto',
                        transform: 'translateX(calc(-50% * var(--dir)))',
                        ['--dir' as string]: isRTL ? 1 : 1
                    }}
                >
                    <div
                        className="h-full flex items-center justify-center border-slate-700 px-2 rounded-md transition-colors duration-300 border !bg-black shadow-sm"
                        style={{ backgroundColor: 'black' }}
                    >
                        <span
                            className="text-[0.75rem] font-black leading-none tabular-nums tracking-tighter !text-white mt-[1px]"
                        >
                            {Math.round(validScore)}
                        </span>
                    </div>
                    {/* Arrow (Restored) */}
                    <div
                        className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-black"
                        style={{ borderTopColor: 'black' }}
                    ></div>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute top-[35%] left-[5%] text-[8px] sm:text-[10px] font-black text-rose-500 tracking-tighter sm:tracking-normal">DEFENSIVE</div>
            <div className="absolute top-[35%] left-[45%] text-[8px] sm:text-[10px] font-black text-slate-500 tracking-tighter sm:tracking-normal">NEUTRAL</div>
            <div className="absolute top-[35%] right-[5%] text-[8px] sm:text-[10px] font-black text-sky-500 tracking-tighter sm:tracking-normal">ACCUMULATE</div>
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
