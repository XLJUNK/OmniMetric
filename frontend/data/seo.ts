import { Metadata } from 'next';

export const LANGUAGES: Record<string, string> = {
    'EN': 'en',
    'JP': 'ja',
    'CN': 'zh-CN',
    'ES': 'es',
    'HI': 'hi',
    'ID': 'id',
    'AR': 'ar',
    'FR': 'fr',
    'DE': 'de',
};

export const BASE_URL = 'https://www.omnimetric.net';

export type MetadataStyle = 'query' | 'path';

export function getMultilingualMetadata(
    path: string,
    currentLang: string,
    title?: string,
    description?: string
): Metadata {
    const langCode = currentLang.toUpperCase();
    // Normalize path to not have leading slash if style is path to avoid double slashes later if needed, 
    // but usually path is like "/wiki/slug".
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    const alternates: Record<string, string> = {};

    // Generate all 7 languages
    // Generate all 7 languages (Path-based strict)
    Object.entries(LANGUAGES).forEach(([code, hreflang]) => {
        if (cleanPath === '/') {
            // Root special case (Homepage)
            alternates[hreflang] = code === 'EN'
                ? `${BASE_URL}/`
                : `${BASE_URL}/${code.toLowerCase()}`;
        } else {
            // Standard Paths (/wiki, /forex, etc)
            alternates[hreflang] = `${BASE_URL}/${code.toLowerCase()}${cleanPath}`;
        }
    });

    // Set x-default (English Path is default)
    if (cleanPath === '/') {
        alternates['x-default'] = `${BASE_URL}/`;
    } else {
        alternates['x-default'] = `${BASE_URL}/en${cleanPath}`;
    }

    // Canonical (Self-referencing path)
    let canonical = `${BASE_URL}/${langCode.toLowerCase()}${cleanPath}`;

    // Special Case: English Homepage is Root
    if (langCode === 'EN' && cleanPath === '/') {
        canonical = `${BASE_URL}/`;
    }


    return {
        title: title || "Global Macro Signal | Institutional Market Intelligence",
        description: description || "Real-time global market risk analysis. AI-driven insights for professional investors.",
        alternates: {
            canonical,
            languages: Object.keys(LANGUAGES).reduce((acc: Record<string, string>, l: string) => {
                const hreflang = LANGUAGES[l];
                if (cleanPath === '/') {
                    acc[hreflang] = l === 'EN' ? `${BASE_URL}/` : `${BASE_URL}/${l.toLowerCase()}`;
                } else {
                    acc[hreflang] = `${BASE_URL}/${l.toLowerCase()}${cleanPath}`;
                }
                return acc;
            }, {} as Record<string, string>),
        },
    };
}
