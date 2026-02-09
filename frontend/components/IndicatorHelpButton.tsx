'use client';

import React from 'react';

interface IndicatorHelpButtonProps {
    label: string;
    onClick: () => void;
    className?: string;
}

/**
 * IndicatorHelpButton: Reusable institutional-grade help button.
 * Styling: Black background, Cream font, Mono typeface, tracking-widest.
 */
export const IndicatorHelpButton = ({ label, onClick, className = "" }: IndicatorHelpButtonProps) => {
    return (
        <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            className={`
                text-[9px] font-mono font-bold tracking-widest transition-colors 
                cursor-pointer px-2 py-0.5 rounded border-0 inline-block
                !bg-[#000000] !text-[#FEF3C7] hover:!bg-[#111111]
                ${className}
            `}
        >
            [{label}]
        </span>
    );
};
