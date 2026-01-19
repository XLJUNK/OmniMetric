'use client';

import { useSearchParams, useParams, usePathname } from 'next/navigation';
import { LangType, DICTIONARY } from '@/data/dictionary';

export const useCurrentLang = (): LangType => {
    const searchParams = useSearchParams();
    const params = useParams();
    const pathname = usePathname();

    // 1. Priority: Search Param (?lang=JP)
    const queryLang = searchParams?.get('lang');
    if (queryLang && isValidLang(queryLang)) {
        return queryLang.toUpperCase() as LangType;
    }

    // 2. Priority: Route Param (/[lang]/...)
    if (params?.lang && isValidLang(params.lang as string)) {
        return (params.lang as string).toUpperCase() as LangType;
    }

    // 3. Fallback: Parse from Pathname string purely (e.g. /jp/wiki)
    // This is useful if useParams is empty in some contexts or layout nesting issues
    const pathSegment = pathname?.split('/')[1];
    if (pathSegment && isValidLang(pathSegment)) {
        return pathSegment.toUpperCase() as LangType;
    }

    // 4. Default
    return 'EN';
};

function isValidLang(lang: string): boolean {
    return Object.keys(DICTIONARY).includes(lang.toUpperCase());
}
