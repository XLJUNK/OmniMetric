'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const ClientDirectionProvider = () => {
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang');

    useEffect(() => {
        // ONLY Switch to RTL if lang is explicitly 'AR'
        if (lang === 'AR') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
            document.body.classList.add('font-arabic'); // Helper for applying Arabic font
        } else {
            // Default to LTR for ALL other languages (including EN, JP, CN, etc.)
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = lang || 'en';
            document.body.classList.remove('font-arabic');
        }
    }, [lang]);

    return null;
};
