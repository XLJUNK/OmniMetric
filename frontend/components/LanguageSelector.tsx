'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { useTheme } from '@/components/ThemeProvider';

interface LanguageSelectorProps {
    currentLang: LangType;
    isDark?: boolean;
    mode?: 'query' | 'path';
}

export const LanguageSelector = ({ currentLang, isDark = false, mode = 'query' }: LanguageSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { theme } = useTheme();

    const setLang = (l: LangType) => {
        if (mode === 'path') {
            // Assume format /lang/rest-of-path
            // We want to replace the first segment if it matches a lang, or insert it?
            // Existing app structure seems to be /en/wiki, /jp/wiki.
            // Simple approach: split path, replace index 1 (empty, lang, rest...).
            const segments = pathname.split('/');
            // segments[0] is empty string. segments[1] is lang.
            // Check if segments[1] is a valid lang or if we are at root?
            // Wiki is always /[lang]/wiki.
            if (segments.length >= 2) {
                segments[1] = l.toLowerCase();
                const newPath = segments.join('/');
                router.push(newPath);
            }
        } else {
            const current = new URLSearchParams(Array.from(searchParams.entries()));
            current.set('lang', l);
            router.push(`${pathname}?${current.toString()}`);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative z-[10000]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 h-7 px-3 text-[10px] font-bold uppercase tracking-widest rounded transition-all outline-none focus:outline-none appearance-none hover:opacity-80 border border-transparent ${theme === 'dark'
                    ? 'text-[#FEF3C7]'
                    : 'text-black'
                    }`}
                style={{ backgroundColor: theme === 'dark' ? '#000000' : '#F1F5F9' }}
            >
                {currentLang} <ChevronDown className="w-3 h-3" />
            </button>
            {isOpen && (
                <div
                    className="absolute top-full right-0 mt-1 w-24 rounded-md overflow-hidden z-[10001] pointer-events-auto bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 outline-none shadow-xl flex flex-col p-1"
                    style={{ backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF', opacity: 1 }}
                >
                    {(Object.keys(DICTIONARY) as LangType[]).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`block w-full text-left px-3 py-2 text-[10px] uppercase transition-colors outline-none focus:outline-none appearance-none border-none rounded ${currentLang === l
                                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black font-black'
                                : `bg-transparent font-bold ${theme === 'dark' ? 'text-[#FEF3C7] hover:bg-neutral-900 hover:text-white' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'}`
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
