'use client';

import { DICTIONARY } from '@/data/dictionary';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import { useEffect } from 'react';

export const ClientDirectionProvider = () => {
    const lang = useCurrentLang();

    useEffect(() => {
        // ONLY Switch to RTL if lang is explicitly 'AR'
        if (lang === 'AR') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
            document.body.classList.add('font-arabic');
        } else {
            // Default to LTR for ALL other languages
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = lang?.toLowerCase() || 'en';
            document.body.classList.remove('font-arabic');
        }
    }, [lang]);

    return null;
};
