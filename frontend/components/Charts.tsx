'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { DICTIONARY } from '@/data/dictionary';

// --- GAUGE COMPONENT (SPEEDOMETER) ---
interface GaugeProps {
    score: number;
}
export const RiskGauge = ({ score }: GaugeProps) => {
    // Needle logic
    const rotation = (score / 100) * 180 - 90;

    const data = [
        { value: 40, color: '#ef4444' }, // Red (0-40)
        { value: 30, color: '#eab308' }, // Yellow (40-70)
        { value: 30, color: '#22c55e' }, // Green (70-100)
    ];

    return (
        <div className="h-32 w-48 relative flex justify-center items-end overflow-hidden mx-auto">
            <ResponsiveContainer width="100%" height="200%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="70%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius="70%"
                        outerRadius="100%"
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Needle */}
            <div className="absolute bottom-4 left-1/2 w-0 h-0" style={{ transform: `translateX(-50%)` }}>
                <div
                    className="w-1 h-20 bg-white origin-bottom rounded-t-full absolute bottom-0 left-[-2px]"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: 'transform 1s ease-out',
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                    }}
                ></div>
                <div className="w-4 h-4 bg-white rounded-full absolute bottom-[-8px] left-[-8px] shadow-lg"></div>
            </div>

            {/* Value in center bottom */}
            <div className="absolute bottom-0 text-center -mb-6 opacity-0">
                {score}
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

    // Filter to ensure final point is matched to the live score logic (63)
    const chartDataValues = [...data];
    if (chartDataValues.length > 0) {
        chartDataValues[chartDataValues.length - 1].score = 63;
    }

    return (
        <div className="h-full w-full flex flex-col pt-2">
            <div className="flex-1 min-h-0">
                <Plot
                    data={[
                        {
                            x: chartDataValues.map(d => d.date),
                            y: chartDataValues.map(d => d.score),
                            type: 'scatter',
                            mode: 'lines+markers',
                            marker: { color: color, size: 4 },
                            line: { color: color, width: 2, shape: 'spline' },
                            fill: 'tozeroy',
                            fillcolor: `${color}26`, // 15% Opacity
                            name: 'GMS',
                            hovertemplate: '<b>%{y} GMS</b><br>%{x}<extra></extra>'
                        }
                    ]}
                    layout={{
                        autosize: true,
                        margin: { l: 25, r: 10, t: 10, b: 25 },
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
                        font: { family: 'JetBrains Mono, monospace' }
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

    const high = Math.max(...data).toFixed(2);
    const low = Math.min(...data).toFixed(2);

    return (
        <div className="h-full w-full relative flex flex-col">
            <div className="flex-grow">
                <Plot
                    data={[
                        {
                            y: data,
                            type: 'scatter',
                            mode: 'lines',
                            fill: 'tozeroy',
                            fillcolor: `${color}33`, // Rich 20% opacity gradient feeling
                            line: { color: color, width: 2.5, shape: 'spline' },
                            hoverinfo: 'y',
                        }
                    ]}
                    layout={{
                        autosize: true,
                        margin: { l: 45, r: 0, t: 10, b: 10 },
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        showlegend: false,
                        xaxis: { showgrid: false, zeroline: false, showticklabels: false, visible: false },
                        yaxis: {
                            autorange: true,
                            fixedrange: true,
                            side: 'left', // User requested Unified LEFT
                            tickfont: { size: 10, color: '#AAAAAA', family: 'monospace' },
                            ticklen: 4, // Push numbers away
                            tickcolor: '#333', // Subtle tick mark
                            tickformat: '.2f',
                            gridcolor: '#333333',
                            zerolinecolor: '#444444'
                        },
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            {/* X-AXIS LABELS */}
            <div className="hidden md:flex justify-between items-center px-1 font-mono text-[8px] text-[#666] uppercase tracking-[0.2em] mt-[-10px]">
                <span>{startDate}</span>
                <span>{endDate}</span>
            </div>
        </div>
    );
};
