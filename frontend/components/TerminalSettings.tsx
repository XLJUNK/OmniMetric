'use client';

import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, ArrowUp, ArrowDown, Eye, EyeOff, GripVertical, RotateCcw } from 'lucide-react';
import { LangType, DICTIONARY } from '@/data/dictionary';

interface TerminalSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    currentTiles: string[];
    hiddenTiles: string[];
    onUpdate: (visible: string[], hidden: string[]) => void;
    onReset: () => void;
    isDark?: boolean; // Future proofing
    onToggleTheme?: () => void;
    lang: LangType;
    systemInfo?: {
        lastUpdated: string;
        status: string;
        latency: string;
    };
}

const getFormattedDate = (isoString: string) => {
    if (!isoString) return '--';
    try {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('ja-JP', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Tokyo'
        }).format(date);
    } catch (e) {
        return isoString;
    }
};

export const TerminalSettings = ({
    isOpen,
    onClose,
    currentTiles,
    hiddenTiles,
    onUpdate,
    onReset,
    isDark,
    onToggleTheme,
    lang = 'EN',
    systemInfo
}: TerminalSettingsProps) => {
    const [mount, setMount] = useState(false);

    // Dictionary
    const t = DICTIONARY[lang]?.settings || DICTIONARY['EN'].settings;

    // Animation handling
    useEffect(() => {
        if (isOpen) setMount(true);
        else setTimeout(() => setMount(false), 300);
    }, [isOpen]);

    if (!mount) return null;

    const handleMove = (index: number, direction: -1 | 1) => {
        if (index + direction < 0 || index + direction >= currentTiles.length) return;
        const newTiles = [...currentTiles];
        const temp = newTiles[index];
        newTiles[index] = newTiles[index + direction];
        newTiles[index + direction] = temp;
        onUpdate(newTiles, hiddenTiles);
    };

    const handleHide = (id: string) => {
        onUpdate(
            currentTiles.filter(t => t !== id),
            [...hiddenTiles, id]
        );
    };

    const handleShow = (id: string) => {
        onUpdate(
            [...currentTiles, id],
            hiddenTiles.filter(t => t !== id)
        );
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-slate-800 rounded-t-[2rem] z-[9991] shadow-2xl transition-transform duration-300 ease-out transform flex flex-col max-h-[85vh] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                {/* Handle Bar */}
                <div className="w-full h-8 flex items-center justify-center flex-shrink-0" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 py-2 flex justify-between items-center bg-[#0F172A] z-10 border-b border-slate-800/50">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-black text-[#FEF3C7] tracking-widest uppercase mb-0.5 sm:text-base">{t.title}</h2>
                        <span className="text-[9px] text-[#FEF3C7]/70 font-mono leading-none">{t.subtitle}</span>
                    </div>
                    <button onClick={onClose} className="p-0.5 text-black bg-[#FEF3C7] hover:bg-[#FEF3C7]/80 rounded-full transition-colors">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-4">

                    {/* 1. Theme Section */}
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-[#FEF3C7] uppercase tracking-widest pl-1">{t.theme_title}</h3>
                        <div className="grid grid-cols-2 gap-3 p-1 bg-[#020617] rounded-2xl border border-slate-800">
                            {/* Dark Mode Button */}
                            <button
                                className={`relative flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 group ${isDark
                                    ? 'bg-[#E2E8F0] border-2 border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-[1.02]'
                                    : 'bg-[#475569] border border-slate-600 hover:bg-[#64748B]'
                                    }`}
                                onClick={onToggleTheme}
                            >
                                <Moon className={`w-5 h-5 transition-colors duration-300 ${isDark ? 'text-[#2563EB] fill-[#2563EB]/20' : 'text-black'}`} />
                                <span className={`text-xs font-black tracking-widest transition-colors duration-300 ${isDark ? 'text-[#2563EB]' : 'text-black'}`}>{t.dark_mode}</span>
                                {isDark && (
                                    <div className="absolute top-2 right-2 flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2563EB]"></span>
                                    </div>
                                )}
                            </button>

                            {/* Light Mode Button */}
                            <button
                                className={`relative flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 group ${!isDark
                                    ? 'bg-[#E2E8F0] border-2 border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-[1.02]'
                                    : 'bg-[#475569] border border-slate-600 hover:bg-[#64748B]'
                                    }`}
                                onClick={onToggleTheme}
                                title="Switch to Light Mode"
                            >
                                <Sun className={`w-5 h-5 transition-colors duration-300 ${!isDark ? 'text-[#2563EB] fill-[#2563EB]/20' : 'text-black'}`} />
                                <span className={`text-xs font-black tracking-widest transition-colors duration-300 ${!isDark ? 'text-[#2563EB]' : 'text-black'}`}>{t.light_mode}</span>
                                {!isDark && (
                                    <div className="absolute top-2 right-2 flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2563EB]"></span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 2. Active Tiles */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <h3 className="text-[10px] font-bold text-[#FEF3C7] uppercase tracking-widest pl-1">{t.active_modules} ({currentTiles.length})</h3>
                            <button onClick={onReset} className="text-[9px] flex items-center gap-1 bg-[#FEF3C7] text-black font-bold hover:bg-[#FEF3C7]/80 transition-colors px-2 py-0.5 rounded shadow-[0_0_10px_rgba(254,243,199,0.2)]">
                                <RotateCcw className="w-3 h-3" /> {t.reset}
                            </button>
                        </div>

                        <div className="space-y-1 bg-black/20 p-1.5 rounded-xl border border-slate-800/50 min-h-[100px]">
                            {currentTiles.map((id, index) => (
                                <div key={id} className="flex items-center gap-2 bg-[#1E293B] p-1 rounded-lg border border-slate-700/50 group hover:border-[#FEF3C7]/30 transition-colors">
                                    <div className="text-[#FEF3C7]/50 cursor-grab active:cursor-grabbing pl-1">
                                        <GripVertical className="w-3 h-3" />
                                    </div>
                                    <div className="flex-1 font-bold text-xs text-[#FEF3C7] tracking-wider font-mono truncate">{id}</div>

                                    {/* Order Controls */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleMove(index, -1)}
                                            disabled={index === 0}
                                            className="p-0.5 w-4 h-4 flex items-center justify-center rounded bg-[#FEF3C7] text-black hover:bg-[#FEF3C7]/80 disabled:opacity-30 disabled:hover:bg-[#FEF3C7]"
                                        >
                                            <ArrowUp className="w-2.5 h-2.5" />
                                        </button>
                                        <button
                                            onClick={() => handleMove(index, 1)}
                                            disabled={index === currentTiles.length - 1}
                                            className="p-0.5 w-4 h-4 flex items-center justify-center rounded bg-[#FEF3C7] text-black hover:bg-[#FEF3C7]/80 disabled:opacity-30 disabled:hover:bg-[#FEF3C7]"
                                        >
                                            <ArrowDown className="w-2.5 h-2.5" />
                                        </button>
                                    </div>

                                    <div className="w-[1px] h-3 bg-slate-700 mx-0.5" />

                                    <button
                                        onClick={() => handleHide(id)}
                                        className="p-0.5 w-4 h-4 flex items-center justify-center rounded bg-[#FEF3C7] text-black hover:bg-[#FEF3C7]/80 transition-colors"
                                        title="Hide Module"
                                    >
                                        <Eye className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Hidden Tiles */}
                    {hiddenTiles.length > 0 && (
                        <div className="space-y-2 pb-4">
                            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1">{t.disabled_modules} ({hiddenTiles.length})</h3>
                            <div className="space-y-1 opacity-60 hover:opacity-100 transition-opacity">
                                {hiddenTiles.map(id => (
                                    <div key={id} className="flex items-center gap-2 bg-[#111] p-1 rounded-lg border border-slate-800 border-dashed">
                                        <div className="w-3" /> {/* Spacer for Grip */}
                                        <div className="flex-1 font-medium text-[10px] text-slate-500 tracking-wide font-mono line-through decoration-slate-600">{id}</div>
                                        <button
                                            onClick={() => handleShow(id)}
                                            className="p-0.5 w-4 h-4 flex items-center justify-center rounded bg-[#FEF3C7]/20 text-[#FEF3C7] hover:bg-[#FEF3C7] hover:text-black transition-colors ml-auto"
                                            title="Enable Module"
                                        >
                                            <EyeOff className="w-2.5 h-2.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. System Info (Moved from Header) */}
                    {systemInfo && (
                        <div className={`mt-auto pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                            <div className={`p-2 rounded-lg flex items-center justify-between ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                                <span className="text-[9px] uppercase tracking-widest text-[#FEF3C7]/70">{t.last_updated}</span>
                                <span className="font-mono text-[10px] text-[#FEF3C7]">
                                    {getFormattedDate(systemInfo.lastUpdated)} JST
                                </span>
                            </div>
                            {/* Status Indicator */}
                            <div className="flex items-center justify-center gap-2 mt-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[9px] font-bold tracking-widest text-[#FEF3C7] uppercase">{t.system_operational}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
