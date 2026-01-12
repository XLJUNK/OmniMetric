'use client';

import Link from 'next/link';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { useSearchParams } from 'next/navigation';
import { Zap } from 'lucide-react';

export const LegalFooter = () => {
    const searchParams = useSearchParams();
    const queryLang = searchParams.get('lang') as LangType;
    const lang = (queryLang && DICTIONARY[queryLang]) ? queryLang : 'EN';
    const t = DICTIONARY[lang];

    return (
        <footer className="w-full bg-[#050505] border-t border-slate-800 mt-auto">
            {/* Minimal Link Bar */}
            <div className="w-full bg-[#0a0a0a] border-b border-slate-800/50 py-3">
                <div className="max-w-[1600px] mx-auto flex flex-wrap justify-center items-center gap-x-4 gap-y-3 px-4 text-[10px] font-mono tracking-wider">
                    <Link href={`/about?lang=${lang}`} className="text-slate-400 hover:text-slate-200 uppercase transition-colors px-2 py-1">
                        {t.labels.about}
                    </Link>
                    <span className="text-slate-800 hidden md:inline">|</span>
                    <Link href={`/legal/privacy-policy?lang=${lang}`} className="text-slate-400 hover:text-slate-200 uppercase transition-colors px-2 py-1">
                        Privacy
                    </Link>
                    <span className="text-slate-800 hidden md:inline">|</span>
                    <Link href={`/legal/terms?lang=${lang}`} className="text-slate-400 hover:text-slate-200 uppercase transition-colors px-2 py-1">
                        Terms
                    </Link>
                    <span className="text-slate-800 hidden md:inline">|</span>
                    <Link href={`/contact?lang=${lang}`} className="text-slate-400 hover:text-slate-200 uppercase transition-colors px-2 py-1">
                        Contact
                    </Link>
                    <span className="text-slate-800 hidden md:inline">|</span>
                    <Link href={`/archive?lang=${lang}`} className="text-slate-400 hover:text-slate-200 uppercase transition-colors px-2 py-1">
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
