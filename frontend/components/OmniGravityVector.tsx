'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useSignalData } from '@/hooks/useSignalData';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { IndicatorHelpButton } from '@/components/IndicatorHelpButton';
import { ExplanationModal } from '@/components/ExplanationModal';
import { useSearchParams } from 'next/navigation';
import { Radar } from 'lucide-react';

// OmniGravityVector component uses localized terms from dictionary.ts
export const OmniGravityVector = ({ onOpenInfo, lang = 'EN' }: { onOpenInfo?: () => void; lang?: LangType }) => {
    const { data } = useSignalData();
    const trails = useMemo(() => data?.ogv?.trails || [], [data]);
    const satellites = useMemo(() => data?.ogv?.current_satellites || [], [data]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [sliderValue, setSliderValue] = useState<number>(100);
    const [hoveredSatellite, setHoveredSatellite] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);

    // Localization from dictionary
    const t = DICTIONARY[lang]?.ogv_guide || DICTIONARY.EN.ogv_guide;

    // Modal logic moved to parent via onOpenInfo prop

    // Autoplay Logic State
    const lastInteractionRef = useRef<number>(0);
    const reqRef = useRef<number | undefined>(undefined);
    const isWaitingRef = useRef<boolean>(false);
    const waitStartRef = useRef<number>(0);
    const pulsePhaseRef = useRef<number>(0);

    // Initial Load: Sync to end
    useEffect(() => {
        if (trails.length > 0) {
            setSliderValue(100);
        }
    }, [trails.length]);

    // Autoplay Loop
    useEffect(() => {
        const animate = () => {
            const now = Date.now();
            const timeSinceInteraction = now - lastInteractionRef.current;

            if (!isPlaying && timeSinceInteraction > 8000) {
                setIsPlaying(true);
            }

            if (isPlaying && trails.length > 0) {
                const max = trails.length - 1;

                if (isWaitingRef.current) {
                    pulsePhaseRef.current += 0.05;
                    if (now - waitStartRef.current > 6000) {
                        isWaitingRef.current = false;
                        setSliderValue(0);
                    }
                } else {
                    setSliderValue(prev => {
                        const next = prev + 0.2; // Smooth speed from 0 to 100
                        if (next >= 100) {
                            isWaitingRef.current = true;
                            waitStartRef.current = Date.now();
                            return 100;
                        }
                        return next;
                    });
                }
            }
            reqRef.current = requestAnimationFrame(animate);
        };
        reqRef.current = requestAnimationFrame(animate);

        return () => {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, [isPlaying, trails.length]);

    const handleInteractionStart = () => {
        setIsPlaying(false);
        isWaitingRef.current = false;
        lastInteractionRef.current = Date.now();
    };

    // Canvas Rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || trails.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = Math.min(width, height) / 2.5;

        ctx.clearRect(0, 0, width, height);

        // Background Quadrants
        const bgAlpha = 0.18;
        const drawQuadrant = (x: number, y: number, w: number, h: number, colorStart: string, colorEnd: string, label: string) => {
            const grad = ctx.createLinearGradient(x, y, x + w, y + h);
            grad.addColorStop(0, colorStart);
            grad.addColorStop(1, colorEnd);
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.font = '900 24px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, x + w / 2, y + h / 2 + 10);
        };

        drawQuadrant(0, 0, centerX, centerY, `rgba(168, 85, 247, ${bgAlpha})`, `rgba(239, 68, 68, ${bgAlpha})`, t.stagflation);
        drawQuadrant(centerX, 0, centerX, centerY, `rgba(245, 158, 11, ${bgAlpha})`, `rgba(234, 179, 8, ${bgAlpha})`, t.overheating);
        drawQuadrant(0, centerY, centerX, centerY, `rgba(30, 41, 59, ${bgAlpha})`, `rgba(100, 116, 139, ${bgAlpha})`, t.recession);
        drawQuadrant(centerX, centerY, centerX, centerY, `rgba(16, 185, 129, ${bgAlpha})`, `rgba(14, 165, 233, ${bgAlpha})`, t.goldilocks);

        // Axis
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
        ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
        ctx.stroke();

        const maxIdx = trails.length - 1;
        const mappedTime = (sliderValue / 100) * maxIdx;
        const idx1 = Math.min(Math.floor(mappedTime), maxIdx);
        const idx2 = Math.min(Math.ceil(mappedTime), maxIdx);
        const interpT = mappedTime - Math.floor(mappedTime);

        const p1 = trails[idx1];
        const p2 = trails[idx2];
        if (!p1 || !p2) return;

        const currentX = p1.x + (p2.x - p1.x) * interpT;
        const currentY = p1.y + (p2.y - p1.y) * interpT;
        const screenX = centerX + (currentX / 100) * scale;
        const screenY = centerY - (currentY / 100) * scale;

        // Nebula Trail Evolution (60 Days)
        for (let i = 0; i <= idx1; i++) {
            const pt = trails[i];
            const sx = centerX + (pt.x / 100) * scale;
            const sy = centerY - (pt.y / 100) * scale;

            // Decay: Thinner, Bluer, Fainter as we go back
            const ratio = i / trails.length;
            const opacity = 0.02 + Math.pow(ratio, 3) * 0.4;
            const size = 4 + ratio * 18;
            const blur = 2 + ratio * 8;

            ctx.beginPath();
            ctx.fillStyle = `rgba(56, 189, 248, ${opacity})`;
            if (ctx.filter) ctx.filter = `blur(${blur}px)`;
            ctx.globalCompositeOperation = 'screen';
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.filter = 'none';
            ctx.globalCompositeOperation = 'source-over';
        }

        // Satellites with Visual Intelligence
        if (satellites.length > 0) {
            satellites.forEach((sat) => {
                const sx = centerX + (sat.x / 100) * scale;
                const sy = centerY - (sat.y / 100) * scale;
                const isMajor = ['BTC', 'GOLD', 'US10Y', 'DXY', 'SPY'].includes(sat.id);
                const isHovered = hoveredSatellite === sat.id;

                ctx.beginPath();
                ctx.fillStyle = isHovered ? '#fff' : (isMajor ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.2)');
                ctx.arc(sx, sy, isHovered ? 4 : (isMajor ? 3 : 2), 0, Math.PI * 2);
                ctx.fill();

                // Intelligence Labels
                if (isMajor || isHovered) {
                    ctx.fillStyle = isHovered ? '#fff' : (isMajor ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)');
                    ctx.font = `${isHovered || isMajor ? 'bold' : 'normal'} 10px Inter`;
                    ctx.textAlign = 'left';
                    ctx.fillText(sat.label, sx + 6, sy + 3);
                }
            });
        }

        // Main Point Pulse
        const sine = (Math.sin(pulsePhaseRef.current) + 1) / 2;
        const pulseR = isWaitingRef.current ? sine * 6 : 0;

        const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 15 + pulseR);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.6)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 15 + pulseR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(screenX, screenY, 3, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(interpT < 0.5 ? p1.date : p2.date, screenX, screenY - 20);

    }, [trails, satellites, sliderValue, hoveredSatellite]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        handleInteractionStart();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const sc = Math.min(canvas.width, canvas.height) / 2.5;

        let found = null;
        for (const sat of satellites) {
            const sx = cx + (sat.x / 100) * sc;
            const sy = cy - (sat.y / 100) * sc;
            if (Math.hypot(mx - sx, my - sy) < 15 * (window.devicePixelRatio || 1)) {
                found = sat.id;
                break;
            }
        }
        setHoveredSatellite(found);
    };

    // progress is now equivalent to sliderValue in a 0-100 scale
    const progress = sliderValue;

    return (
        <div className="w-full relative">
            {/* Removed Absolute Help Button */}

            <div className="w-full flex flex-col items-center">
                {/* Title Header - Row 1: Centered Title */}
                <div className="w-full max-w-[440px] flex justify-center px-2">
                    <div className="flex items-center gap-2 opacity-80">
                        <Radar className="w-4 h-4 text-sky-500" />
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] translate-y-[1px]">OmniGravity Vector</h3>
                    </div>
                </div>

                {/* Header - Row 2: Right-Aligned Help Button */}
                <div className="w-full max-w-[440px] flex justify-end mb-2">
                    <IndicatorHelpButton
                        label="What's OGV"
                        onClick={() => onOpenInfo?.()}
                    />
                </div>


                {/* OGV Canvas - Removed Version Tag and Borders */}
                <div className="relative w-full aspect-square max-w-[440px] bg-slate-950/40 rounded-2xl overflow-hidden shadow-none">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-crosshair"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoveredSatellite(null)}
                        onTouchStart={handleInteractionStart}
                    />
                </div>

                {/* Laser Line Slider */}
                <div className="w-full max-w-[340px] mt-8 flex items-center gap-6 select-none relative z-10">
                    <span className="text-[10px] text-slate-500 font-mono">T-60</span>
                    <div className="flex-1 relative h-6 flex items-center cursor-pointer group" onMouseDown={handleInteractionStart}>
                        {/* Track: Ultra-visible neon guide */}
                        <div className="absolute w-full h-1.5 bg-slate-700 group-hover:bg-slate-600 transition-colors rounded-full top-1/2 -translate-y-1/2" />
                        <input
                            type="range" aria-label="Time Shift" min="0" max="100" step="0.1" value={sliderValue}
                            onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-40"
                        />
                        {/* Laser Thumb: Neon Blue Pill */}
                        <div
                            className="absolute w-5 h-6 bg-sky-400 rounded-full shadow-[0_0_15px_rgba(56,189,248,1),0_0_5px_rgba(255,255,255,0.8)] transition-transform duration-75 pointer-events-none -translate-x-1/2 top-1/2 -translate-y-1/2 z-30"
                            style={{ left: `${progress}%` }}
                        />
                    </div>
                    <span className={`text-[10px] font-bold font-mono transition-colors ${progress > 98 ? 'text-sky-400 shadow-glow' : 'text-slate-500'}`}>NOW</span>
                </div>

                {/* Quick Guide Section - Reordered and Improved Layout */}
                <div className="w-full max-w-[440px] mt-10 p-6 bg-slate-50 dark:bg-white/5 rounded-xl text-[11px] leading-relaxed flex flex-col gap-5">
                    <div className="text-sky-600 dark:text-sky-400 font-black mb-1 opacity-80 uppercase tracking-widest text-center border-b border-slate-200 dark:border-white/10 pb-2">
                        {t.guide_title}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="flex flex-col gap-2 p-0">
                            <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                                {t.overheating} {t.overheating_pos}
                            </span>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{t.overheating_desc}</p>
                        </div>

                        <div className="flex flex-col gap-2 p-0">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                {t.goldilocks} {t.goldilocks_pos}
                            </span>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{t.goldilocks_desc}</p>
                        </div>

                        <div className="flex flex-col gap-2 p-0">
                            <span className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                                {t.recession} {t.recession_pos}
                            </span>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{t.recession_desc}</p>
                        </div>

                        <div className="flex flex-col gap-2 p-0">
                            <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-2 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                {t.stagflation} {t.stagflation_pos}
                            </span>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{t.stagflation_desc}</p>
                        </div>
                    </div>

                    <div className="mt-2 pt-3 border-t border-slate-200 dark:border-white/5 text-[10px] text-sky-600 dark:text-sky-300 italic opacity-60 text-center font-medium">
                        {t.footer_note}
                    </div>
                </div>

                {/* What's OGV Modal */}
            </div>
        </div>
    );
};
