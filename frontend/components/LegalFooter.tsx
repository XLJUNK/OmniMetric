'use client';

import Link from 'next/link';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { useSearchParams } from 'next/navigation';

export const LegalFooter = () => {
    const searchParams = useSearchParams();
    const queryLang = searchParams.get('lang') as LangType;
    const lang = (queryLang && DICTIONARY[queryLang]) ? queryLang : 'EN';
    const t = DICTIONARY[lang];

    return (
        <footer className="w-full bg-[#050505] border-t border-[#1E293B] mt-auto">
            {/* 1. Retro Terminal Menu Bar */}
            <div className="w-full bg-[#0a0a0a] border-b border-[#1E293B] py-2">
                <div className="max-w-[1600px] mx-auto flex justify-center items-center gap-1 md:gap-4 px-4 text-[10px] md:text-xs font-black tracking-[0.2em] font-mono leading-none">
                    <Link href={`/about?lang=${lang}`} className="text-slate-500 hover:text-sky-500 uppercase transition-colors">
                        {t.labels.about}
                    </Link>
                    <span className="text-white/10">|</span>
                    <Link href={`/legal?lang=${lang}`} className="text-slate-500 hover:text-sky-500 uppercase transition-colors">
                        {t.labels.legal}
                    </Link>
                    <span className="text-white/10">|</span>
                    <Link href={`/archive?lang=${lang}`} className="text-slate-500 hover:text-sky-500 uppercase transition-colors">
                        {t.labels.archive}
                    </Link>
                </div>
            </div>

            {/* 2. Legal Block */}
            <div className="max-w-[1600px] mx-auto py-8 px-4 text-center">
                <div className="flex flex-col gap-4 items-center">
                    <p className="text-[10px] leading-relaxed text-slate-600 max-w-4xl mx-auto font-medium whitespace-pre-line">
                        {t.legal_text.t1} {t.legal_text.t2}
                    </p>
                    <div className="flex flex-col items-center gap-1 mt-2">
                        <p className="text-[9px] text-slate-700 font-black tracking-widest uppercase">
                            {t.legal_text?.copyright?.toUpperCase() || "POWERED BY OMNIMETRIC PROJECT 2026"}
                        </p>
                        <p className="text-[9px] text-slate-800 font-mono">
                            {t.attribution?.src || "SOURCE: YAHOO FINANCE / FRED / CBOE"}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
