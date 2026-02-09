'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { useTheme } from '@/components/ThemeProvider';

interface LanguageSelectorProps {
    currentLang: LangType;
    mode?: 'query' | 'path';
    onSelect?: (l: LangType) => void;
}

export const LanguageSelector = ({ currentLang, mode = 'query', onSelect }: LanguageSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { theme } = useTheme();

    const currentLangUpper = currentLang.toUpperCase() as LangType;
    const isRTL = currentLangUpper === 'AR';

    // Safety check for DICTIONARY access
    const langData = DICTIONARY[currentLangUpper];
    if (!langData) {
        console.warn(`[LanguageSelector] Unsupported language: ${currentLangUpper}`);
        return null;
    }

    const setLang = (l: LangType) => {
        if (mode === 'path') {
            const segments = pathname.split('/').filter(Boolean);
            const potentialLang = segments[0]?.toUpperCase();
            const isCurrentLangPrefix = potentialLang && DICTIONARY[potentialLang as LangType];

            const cleanSegments = isCurrentLangPrefix ? segments.slice(1) : segments;

            if (l === 'EN') {
                router.push(`/${cleanSegments.join('/')}`);
            } else {
                router.push(`/${l.toLowerCase()}/${cleanSegments.join('/')}`);
            }
        } else {
            const current = new URLSearchParams(Array.from(searchParams.entries()));
            current.set('lang', l);
            router.push(`${pathname}?${current.toString()}`);
        }
        if (onSelect) onSelect(l);
        setIsOpen(false);
    };

    return (
        <div className="relative z-[10000]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 h-7 px-3 text-[10px] font-normal uppercase tracking-widest rounded transition-all outline-none focus:outline-none appearance-none hover:opacity-100 bg-transparent border-0 text-[#FEF3C7]"
            >
                {currentLang} <ChevronDown className="w-3 h-3" />
            </button>
            {isOpen && (
                <div
                    className="absolute top-full right-0 mt-1 w-24 rounded-md overflow-hidden z-[10001] pointer-events-auto outline-none shadow-2xl flex flex-col p-1 border border-slate-800/50 bg-[#000000]"
                >
                    {(['EN', 'DE', 'FR', 'ES', 'JP', 'CN', 'ID', 'HI', 'AR'] as LangType[]).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className="block w-full text-left px-3 py-2 text-[10px] uppercase transition-colors outline-none focus:outline-none appearance-none border-none rounded mb-0.5 last:mb-0"
                            style={{
                                backgroundColor: currentLang === l ? '#FFFFFF' : '#000000',
                                color: currentLang === l ? '#000000' : '#FEF3C7'
                            }}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
