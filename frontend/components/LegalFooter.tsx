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
            <div className="flex flex-row justify-center items-center gap-6 mb-6">
                <Link href={`/about?lang=${lang}`} style={{ color: '#AAAAAA', textDecoration: 'none', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px' }} className="hover:text-white">
                    {t.labels.about}
                </Link>

                <span className="mx-8 text-gray-600">|</span>

                <Link href={`/legal?lang=${lang}`} style={{ color: '#AAAAAA', textDecoration: 'none', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px' }} className="hover:text-white">
                    {t.labels.legal}
                </Link>

                <span className="mx-8 text-gray-600">|</span>

                <Link href={`/archive?lang=${lang}`} style={{ color: '#AAAAAA', textDecoration: 'none', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px' }} className="hover:text-white">
                    {t.labels.archive}
                </Link>
            </div>

            {/* Legal Text */}
            <p style={{ color: '#666', fontSize: '10px', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
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
