'use client';

import Link from 'next/link';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { useDevice } from '@/hooks/useDevice';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import { useTheme } from '@/components/ThemeProvider';
import { Zap } from 'lucide-react';

export const LegalFooter = () => {
    const lang = useCurrentLang();
    const t = DICTIONARY[lang];
    const { isMobile } = useDevice();
    const { theme } = useTheme();
    const lowerLang = lang.toLowerCase();

    return (
        <footer
            className="w-full bg-slate-50 dark:bg-[#050505] border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors duration-300"
            style={{ backgroundColor: theme === 'dark' ? '#050505' : '#F8FAFC' }}
        >
            {/* Minimal Link Bar */}
            <div className="w-full bg-slate-100 dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-slate-800/50 py-3">
                <div className={`max-w-[1600px] mx-auto flex flex-wrap justify-center items-center gap-x-4 gap-y-3 px-4 text-[10px] font-mono tracking-wider`}>
                    <Link href={`/about?lang=${lang}`} className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-slate-200 uppercase transition-colors px-2 py-1">
                        {t.labels.about}
                    </Link>
                    {!isMobile && <span className="text-slate-300 dark:text-slate-800">|</span>}
                    <Link href={`/${lowerLang}/legal/privacy-policy`} className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-slate-200 uppercase transition-colors px-2 py-1">
                        Privacy
                    </Link>
                    {!isMobile && <span className="text-slate-300 dark:text-slate-800">|</span>}
                    <Link href={`/${lowerLang}/legal/terms`} className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-slate-200 uppercase transition-colors px-2 py-1">
                        Terms
                    </Link>
                    {!isMobile && <span className="text-slate-300 dark:text-slate-800">|</span>}
                    <Link href={`/contact?lang=${lang}`} className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-slate-200 uppercase transition-colors px-2 py-1">
                        Contact
                    </Link>
                    {!isMobile && <span className="text-slate-300 dark:text-slate-800">|</span>}
                    <Link href={`/archive?lang=${lang}`} className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-slate-200 uppercase transition-colors px-2 py-1">
                        {t.labels.archive}
                    </Link>
                </div>
            </div>

            {/* Compact Legal Block */}
            <div className="max-w-[1600px] mx-auto py-6 px-4 text-center">
                <div className="flex flex-col gap-3 items-center">
                    <p className="text-[10px] leading-[1.3] text-slate-500 max-w-4xl mx-auto whitespace-pre-line">
                        {t.legal_text.t1} {t.legal_text.t2}
                    </p>
                    {/* Partner Disclaimer */}
                    <p className="text-[10px] leading-[1.3] text-slate-600 max-w-4xl mx-auto whitespace-pre-line opacity-80">
                        {(t as any).partner?.disclaimer}
                    </p>

                    {/* Attribution */}
                    <div className="flex flex-col items-center gap-1 mt-1">
                        <p className="text-[9px] text-slate-600 font-mono">
                            {t.attribution?.src || "SOURCE: YAHOO FINANCE / FRED / CBOE"}
                        </p>
                    </div>

                    {/* Minimal Branding Signature */}
                    <div className="flex items-center gap-1.5 mt-2 opacity-40">
                        <Zap className="w-3 h-3 text-slate-600" />
                        <p className="text-[9px] text-slate-700 font-bold tracking-widest uppercase">
                            {t.legal_text?.copyright || "POWERED BY OMNIMETRIC PROJECT 2026"}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
