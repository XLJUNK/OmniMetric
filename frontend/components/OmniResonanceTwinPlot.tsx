'use client';

import React, { useRef, useEffect } from 'react';

interface VectorPoint {
    x: number;
    y: number;
    label: string;
    color: string;
}

interface OmniResonanceTwinPlotProps {
    marketVector: { x: number; y: number };
    userVector: { x: number; y: number };
    interpretationLabel?: string;
    status?: 'resonance' | 'alpha' | 'anomaly';
    ot: any;
}

export const OmniResonanceTwinPlot: React.FC<OmniResonanceTwinPlotProps> = ({ marketVector, userVector, interpretationLabel, status = 'resonance', ot }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const distance = Math.hypot(marketVector.x - userVector.x, marketVector.y - userVector.y);

    // Derived UI states
    const statusColor = status === 'anomaly' ? 'text-orange-500' : status === 'alpha' ? 'text-amber-400' : 'text-sky-400';
    const glowColor = status === 'anomaly' ? 'rgba(249, 115, 22, 0.3)' : status === 'alpha' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(56, 189, 248, 0.3)';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        const cx = w / 2;
        const cy = h / 2;
        const scale = Math.min(w, h) / 2.5;

        ctx.clearRect(0, 0, w, h);

        // 1. Draw Quadrants with High-Impact Labels
        const bgAlpha = 0.15;
        const drawRegime = (x: number, y: number, w: number, h: number, colors: [string, string], label: string) => {
            const grad = ctx.createLinearGradient(x, y, x + w, y + h);
            grad.addColorStop(0, colors[0]);
            grad.addColorStop(1, colors[1]);
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);

            // High Contrast Watermark Label
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 8;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.font = '900 16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label.toUpperCase(), x + w / 2, y + h / 2);
            ctx.restore();
        };

        // QII: Top-Left (Stagflation)
        drawRegime(0, 0, cx, cy, [`rgba(168, 85, 247, ${bgAlpha})`, `rgba(239, 68, 68, ${bgAlpha})`], ot.quadrants.stagflation);
        // QI: Top-Right (Overheating)
        drawRegime(cx, 0, cx, cy, [`rgba(245, 158, 11, ${bgAlpha})`, `rgba(234, 179, 8, ${bgAlpha})`], ot.quadrants.overheating);
        // QIII: Bottom-Left (Recession)
        drawRegime(0, cy, cx, cy, [`rgba(30, 41, 59, 0.6)`, `rgba(100, 116, 139, 0.2)`], ot.quadrants.recession);
        // QIV: Bottom-Right (Goldilocks)
        drawRegime(cx, cy, cx, cy, [`rgba(16, 185, 129, ${bgAlpha})`, `rgba(14, 165, 233, ${bgAlpha})`], ot.quadrants.goldilocks);

        // ... (Grid and Axis logic remains same) ...
        // 2. Grid Lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = -200; i <= 200; i += 25) {
            const pos = (i / 100) * scale;
            ctx.moveTo(cx + pos, 0); ctx.lineTo(cx + pos, h);
            ctx.moveTo(0, cy + pos); ctx.lineTo(w, cy + pos);
        }
        ctx.stroke();

        // 3. Axis Lines & HUD Ticks
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
        ctx.moveTo(0, cy); ctx.lineTo(w, cy);
        ctx.stroke();

        // Draw HUD Ticks
        ctx.beginPath();
        ctx.lineWidth = 1;
        for (let i = -200; i <= 200; i += 10) {
            if (i === 0) continue;
            const pos = (i / 100) * scale;
            const tickSize = i % 50 === 0 ? 6 : 3;
            ctx.moveTo(cx + pos, cy - tickSize); ctx.lineTo(cx + pos, cy + tickSize);
            ctx.moveTo(cx - tickSize, cy + pos); ctx.lineTo(cx + tickSize, cy + pos);
        }
        ctx.stroke();

        // 4. Axis Titles & Direction Labels (HUD Style)
        ctx.fillStyle = 'rgba(203, 213, 225, 0.8)';
        ctx.font = '900 9px Inter';
        ctx.textAlign = 'center';

        // Growth Momentum (Left)
        ctx.save();
        ctx.translate(10, cy);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(ot.axes.growth, 0, 0);
        ctx.restore();

        // Macro Pressure (Top)
        ctx.fillText(ot.axes.inflation, cx, 15);

        // Direction Small Labels (Brightened)
        ctx.font = 'black 8px Inter';
        ctx.fillStyle = 'rgba(203, 213, 225, 1)';
        ctx.textAlign = 'right';
        ctx.fillText(ot.directions.high_pressure, w - 10, 25);
        ctx.fillText(ot.directions.low_pressure, w - 10, h - 15);
        ctx.fillText(ot.directions.high_growth, w - 10, cy - 8);
        ctx.textAlign = 'left';
        ctx.fillText(ot.directions.low_growth, 25, cy - 8);

        const drawPoint = (v: { x: number; y: number }, color: string, label: string, glow = true) => {
            const sx = cx + (v.x / 100) * scale;
            const sy = cy - (v.y / 100) * scale;

            if (glow) {
                const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 15);
                grad.addColorStop(0, color);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(sx, sy, 15, 0, Math.PI * 2); ctx.fill();
            }

            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(label, sx, sy - 12);
        };

        // 5. Resonance Line (Connection)
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(cx + (marketVector.x / 100) * scale, cy - (marketVector.y / 100) * scale);
        ctx.lineTo(cx + (userVector.x / 100) * scale, cy - (userVector.y / 100) * scale);
        ctx.stroke();
        ctx.setLineDash([]);

        // Plot Points
        drawPoint(marketVector, '#0ea5e9', ot.chart_labels.market_core);
        drawPoint(userVector, '#22d3ee', ot.chart_labels.portfolio);

    }, [marketVector, userVector, ot]);

    return (
        <div className="w-full flex flex-col items-center p-6 bg-slate-900/50 rounded-2xl border border-sky-500/20 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
            <h3 className="text-sky-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{ot.twin_plot_title}</h3>

            <div className="relative w-full aspect-square max-w-[440px] bg-black/40 rounded-xl overflow-hidden border border-slate-800">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>

            <div className="mt-4 w-full border-t border-slate-800 pt-6">
                <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{ot.resonance_distance}</span>
                    <span className={`font-mono font-black text-lg tracking-tighter transition-colors duration-500 ${statusColor}`} style={{ textShadow: `0 0 10px ${glowColor}` }}>
                        {interpretationLabel ? `${interpretationLabel} ` : ''}{distance.toFixed(2)}%
                    </span>
                </div>
            </div>
        </div>
    );
};
