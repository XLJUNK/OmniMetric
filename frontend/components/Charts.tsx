'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { DICTIONARY } from '@/data/dictionary';

// --- RISK BAR COMPONENT (LINEAR GRADIENT) ---
interface GaugeProps {
    score: number;
}
// --- REFINED RISK GAUGE: OVERLAY STYLE ---
export const RiskGauge = ({ score }: GaugeProps) => {
    // Clamp score
    const pct = Math.min(100, Math.max(0, score));

    return (
        <div className="w-full relative mt-2 mb-2">
            {/* Gradient Bar (24px) */}
            {/* Gradient Bar (26px) with Rounded-XL and Slate-800 Border - FORCE STYLE */}
            <div className="w-full !rounded-xl !border !border-[#1E293B] !shadow-none !ring-0 relative overflow-hidden"
                style={{ height: '26px' }}>
                <div
                    className="absolute inset-0 w-full h-full rounded-xl"
                    style={{
                        backgroundImage: 'linear-gradient(90deg, #ef4444 0%, #94a3b8 50%, #3b82f6 100%)'
                    }}
                />


                {/* MARKER - OVERLAY ON BAR */}
                <div
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-50 transition-all duration-700 ease-out pointer-events-none"
                    style={{ left: `${pct}%` }}
                >
                    <div className="bg-[#1e293b] border border-slate-600 px-1.5 py-0.5 rounded shadow-xl mb-1">
                        <span className="text-sm font-black text-slate-200 leading-none tabular-nums tracking-tighter">
                            {Math.round(score)}
                        </span>
                    </div>
                    {/* Arrow */}
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-600 drop-shadow-sm"></div>
                </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between px-1 mt-1 relative z-0">
                <span className="text-[8px] sm:text-[10px] font-bold text-[#ef4444] uppercase tracking-widest drop-shadow-sm">Defensive</span>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest drop-shadow-sm">Neutral</span>
                <span className="text-[8px] sm:text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest drop-shadow-sm">Accumulate</span>
            </div>
        </div>
    );
};

import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any;

// --- HISTORY CHART (PLOTLY IMPLEMENTATION) ---
interface HistoryEntry {
    date: string;
    score: number;
}
export const HistoryChart = ({ data, lang = 'EN', color = '#0ea5e9' }: { data: HistoryEntry[], lang?: string, color?: string }) => {
    // @ts-ignore
    const t = DICTIONARY[lang] || DICTIONARY['EN'];

    if (!data || data.length === 0) return (
        <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-600 font-mono uppercase tracking-widest">
            {t.chart.sync}
        </div>
    );

    // Enable data to flow through without modification
    const chartDataValues = [...(data || [])];

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
                            tickfont: { color: '#475569', size: 8 },
                            type: 'category'
                        },
                        yaxis: {
                            range: [0, 100],
                            showgrid: true,
                            gridcolor: 'rgba(255,255,255,0.03)',
                            zeroline: false,
                            showline: false,
                            tickfont: { color: '#475569', size: 8 }
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

export const MetricChart = ({ data, color, currentPrice, startDate, endDate, yRange }: MetricChartProps) => {
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
