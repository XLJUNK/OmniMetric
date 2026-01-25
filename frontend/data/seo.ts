import { Metadata } from 'next';

export const LANGUAGES: Record<string, string> = {
    'EN': 'en',
    'JP': 'ja',
    'CN': 'zh-CN',
    'ES': 'es',
    'HI': 'hi',
    'ID': 'id',
    'AR': 'ar',
};

export const BASE_URL = 'https://www.omnimetric.net';

export type MetadataStyle = 'query' | 'path';

export function getMultilingualMetadata(
    path: string,
    currentLang: string,
    title?: string,
    description?: string,
    style: MetadataStyle = 'query'
): Metadata {
    const langCode = currentLang.toUpperCase();
    // Normalize path to not have leading slash if style is path to avoid double slashes later if needed, 
    // but usually path is like "/wiki/slug".
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    const alternates: Record<string, string> = {};

    // Generate all 7 languages
    Object.entries(LANGUAGES).forEach(([code, hreflang]) => {
        if (style === 'path') {
            alternates[hreflang] = `${BASE_URL}/${code.toLowerCase()}${cleanPath}`;
        } else {
            // Home or other query-param pages
            alternates[hreflang] = `${BASE_URL}${cleanPath}${cleanPath === '/' ? '' : ''}${cleanPath === '/' ? '?lang=' + code : '?lang=' + code}`;
            // Refine root path logic
            if (cleanPath === '/') {
                alternates[hreflang] = `${BASE_URL}/?lang=${code}`;
            } else {
                alternates[hreflang] = `${BASE_URL}${cleanPath}?lang=${code}`;
            }
        }
    });

    // Special case for root EN if query style (often bare URL)
    if (style === 'query' && cleanPath === '/') {
        // alternates['en'] = `${BASE_URL}`;
    }

    // Set x-default
    if (style === 'path') {
        alternates['x-default'] = `${BASE_URL}/en${cleanPath}`;
    } else {
        alternates['x-default'] = cleanPath === '/' ? `${BASE_URL}/` : `${BASE_URL}${cleanPath}`;
    }

    // Canonical
    const canonical = style === 'path'
        ? `${BASE_URL}/${langCode.toLowerCase()}${cleanPath}`
        : (cleanPath === '/' && langCode === 'EN' ? `${BASE_URL}/` : `${BASE_URL}${cleanPath}?lang=${langCode}`);

    return {
        title: title || "Global Macro Signal | Institutional Market Intelligence",
        description: description || "Real-time global market risk analysis. AI-driven insights for professional investors.",
        alternates: {
            canonical,
            languages: alternates,
        },
    };
}
