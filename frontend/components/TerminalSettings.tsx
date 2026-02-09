'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowUp, ArrowDown, Eye, EyeOff, GripVertical, RotateCcw } from 'lucide-react';
import { LangType, DICTIONARY } from '@/data/dictionary';

interface TerminalSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    currentTiles: string[];
    hiddenTiles: string[];
    onUpdate: (visible: string[], hidden: string[]) => void;
    onReset: () => void;
    // isDark and onToggleTheme removed
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
    } catch {
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
    // Props removed
    lang = 'EN',
    systemInfo
}: TerminalSettingsProps) => {
    const [mount, setMount] = useState(false);

    // Dictionary
    const t = DICTIONARY[lang]?.settings || DICTIONARY['EN'].settings;

    // Animation handling
    useEffect(() => {
        if (isOpen) {
            // Use requestAnimationFrame or setTimeout to avoid synchronous setState in effect
            const timer = setTimeout(() => setMount(true), 0);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setMount(false), 300);
            return () => clearTimeout(timer);
        }
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
                className={`fixed inset-0 z-[9990] transition-opacity duration-300 bg-black ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className={`fixed bottom-0 left-0 right-0 border-t border-slate-300 dark:border-slate-800 rounded-t-[2rem] z-[9991] shadow-2xl transition-transform duration-300 ease-out transform flex flex-col max-h-[85vh] bg-[#0F172A] opacity-100 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                {/* Handle Bar */}
                <div className="w-full h-8 flex items-center justify-center flex-shrink-0" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>

                {/* Header */}
                <div
                    className="px-6 py-2 flex justify-between items-center z-10 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0F172A]"
                >
                    <div className="flex flex-col">
                        <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase mb-0.5 sm:text-base">{t.title}</h2>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono leading-none">{t.subtitle}</span>
                    </div>
                    <button onClick={onClose} className="p-0.5 text-black bg-slate-200 hover:bg-white rounded-full transition-colors" title="Close Settings">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-4">

                    {/* 1. Theme Section */}

                    {/* 2. Active Tiles */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-200 uppercase tracking-widest pl-1">{t.active_modules} ({currentTiles.length})</h3>
                            <button onClick={onReset} className="text-[9px] flex items-center gap-1 bg-slate-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-80 transition-colors px-2 py-0.5 rounded shadow-sm">
                                <RotateCcw className="w-3 h-3" /> {t.reset}
                            </button>
                        </div>

                        <div className="space-y-1 bg-slate-100 dark:bg-[#020617] p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[100px]">
                            {currentTiles.map((id, index) => (
                                <div key={id} className="flex items-center gap-2 bg-white dark:bg-[#1E293B] p-1 rounded-lg border border-slate-200 dark:border-slate-700/50 group hover:border-slate-400 dark:hover:border-slate-500 transition-colors shadow-none">
                                    <div className="text-slate-400 dark:text-slate-500 cursor-grab active:cursor-grabbing pl-1">
                                        <GripVertical className="w-3 h-3" />
                                    </div>
                                    <div className="flex-1 font-bold text-xs text-slate-900 dark:text-slate-200 tracking-wider font-mono truncate">{id}</div>

                                    {/* Order Controls */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleMove(index, -1)}
                                            disabled={index === 0}
                                            className="p-0.5 w-4 h-4 flex items-center justify-center rounded bg-slate-900 dark:bg-slate-700 text-white dark:text-white hover:opacity-80 disabled:opacity-30"
                                            title="Move Up"
                                        >
                                            <ArrowUp className="w-2.5 h-2.5" />
                                        </button>
                                        <button
                                            onClick={() => handleMove(index, 1)}
                                            disabled={index === currentTiles.length - 1}
                                            className="p-0.5 w-4 h-4 flex items-center justify-center rounded bg-slate-900 dark:bg-slate-700 text-white dark:text-white hover:opacity-80 disabled:opacity-30"
                                            title="Move Down"
                                        >
                                            <ArrowDown className="w-2.5 h-2.5" />
                                        </button>
                                    </div>

                                    <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700 mx-0.5" />

                                    <button
                                        onClick={() => handleHide(id)}
                                        className="p-0.5 w-4 h-4 flex items-center justify-center rounded bg-slate-900 dark:bg-slate-700 text-white dark:text-white hover:opacity-80 transition-colors"
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
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">{t.disabled_modules} ({hiddenTiles.length})</h3>
                            <div className="space-y-1 opacity-60 hover:opacity-100 transition-opacity">
                                {hiddenTiles.map(id => (
                                    <div key={id} className="flex items-center gap-2 bg-slate-100 dark:bg-[#111] p-1 rounded-lg border border-slate-200 dark:border-slate-800 border-dashed">
                                        <div className="w-3" /> {/* Spacer for Grip */}
                                        <div className="flex-1 font-medium text-[10px] text-slate-400 dark:text-slate-500 tracking-wide font-mono line-through decoration-slate-300 dark:decoration-slate-600">{id}</div>
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
                        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                            <div className="p-2 rounded-lg flex items-center justify-between bg-slate-100 dark:bg-slate-900">
                                <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-[#FEF3C7]/70">{t.last_updated}</span>
                                <span className="font-mono text-[10px] text-slate-900 dark:text-[#FEF3C7]">
                                    {getFormattedDate(systemInfo.lastUpdated)} JST
                                </span>
                            </div>
                            {/* Status Indicator */}
                            <div className="flex items-center justify-center gap-2 mt-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[9px] font-bold tracking-widest text-slate-900 dark:text-[#FEF3C7] uppercase">{t.system_operational}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
