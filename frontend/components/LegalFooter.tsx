'use client';

import React, { Suspense } from 'react';
import { DICTIONARY, LangType } from '@/data/dictionary';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const FooterContent = () => {
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') as LangType) || 'JP';
    const t = DICTIONARY[lang];
    if (!t) return null;

    return (
        <footer className="w-full py-10 mt-12 border-t border-[#222] bg-black text-center">
            {/* Navigation Links */}
            <div className="flex flex-row justify-center items-center mb-10 tracking-[0.2em]">
                <Link
                    href={`/about?lang=${lang}`}
                    className="text-[10px] text-gray-500 hover:text-cyan-400 transition-colors duration-300 uppercase px-4 py-2 hover:bg-white/5 rounded-sm"
                >
                    {t.labels.about}
                </Link>

                <span className="mx-8 text-gray-800 font-thin text-[10px]">|</span>

                <Link
                    href={`/legal?lang=${lang}`}
                    className="text-[10px] text-gray-500 hover:text-cyan-400 transition-colors duration-300 uppercase px-4 py-2 hover:bg-white/5 rounded-sm"
                >
                    {t.labels.legal}
                </Link>

                <span className="mx-8 text-gray-800 font-thin text-[10px]">|</span>

                <Link
                    href={`/archive?lang=${lang}`}
                    className="text-[10px] text-gray-500 hover:text-cyan-400 transition-colors duration-300 uppercase px-4 py-2 hover:bg-white/5 rounded-sm"
                >
                    {t.labels.archive}
                </Link>
            </div>

            {/* Legal Text */}
            <p style={{ color: '#444', fontSize: '9px', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto', padding: '0 20px', letterSpacing: '0.05em' }}>
                {t.legal_text.t1}
            </p>

            {/* Copyright */}
            <div className="mt-8 text-[#444] text-[10px] tracking-widest uppercase">
                &copy; {t.legal_text.copyright}
            </div>
        </footer>
    );
}

export const LegalFooter = () => {
    return (
        <Suspense fallback={null}>
            <FooterContent />
        </Suspense>
    );
};
