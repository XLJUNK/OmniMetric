'use client';

import React from 'react';

type AdVariant = 'responsive' | 'rectangle' | 'square';

interface AdSenseSlotProps {
    variant?: AdVariant;
    className?: string;
}

export const AdSenseSlot = ({ variant = 'responsive', className = '' }: AdSenseSlotProps) => {
    // SIZING LOGIC
    let heightClass = "h-[100px] md:h-[250px]"; // Default responsive
    if (variant === 'square') heightClass = "h-[250px] w-[250px]";
    if (variant === 'rectangle') heightClass = "h-[250px] w-full";

    return (
        <div
            className={`w-full bg-slate-50 dark:bg-[#050505] border border-dashed border-slate-300 dark:border-slate-800 rounded-lg flex items-center justify-center overflow-hidden relative group ${heightClass} ${className}`}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,#64748b_1px,transparent_1px)] dark:bg-[radial-gradient(circle,#333_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {/* Label */}
            <div className="flex flex-col items-center gap-2 z-10">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest border border-slate-300 dark:border-slate-800 px-2 py-1 rounded">
                    [AD: Sponsored]
                </span>
                <span className="text-[8px] text-slate-400 dark:text-slate-700 font-mono">
                    Ads by Google
                </span>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
    );
};
