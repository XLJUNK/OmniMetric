import { Metadata } from 'next';

export const LANGUAGES: Record<string, string> = {
    'en-US': 'EN',
    'ja-JP': 'JP',
    'zh-CN': 'CN',
    'es-ES': 'ES',
    'hi-IN': 'HI',
    'id-ID': 'ID',
    'ar-SA': 'AR',
};

export const BASE_URL = 'https://omnimetric.net';

export function getMultilingualMetadata(path: string, currentLang: string, title?: string, description?: string): Metadata {
    const lang = (currentLang?.toUpperCase() || 'EN');
    const fullPath = path === '/' ? '' : path;

    const languages: Record<string, string> = {};
    Object.entries(LANGUAGES).forEach(([hreflang, code]) => {
        languages[hreflang] = `${BASE_URL}${fullPath}?lang=${code}`;
    });

    return {
        title: title || "Global Macro Signal | Institutional Market Intelligence",
        description: description || "Real-time global market risk analysis. AI-driven insights for professional investors.",
        alternates: {
            canonical: `${BASE_URL}${fullPath}?lang=${lang}`,
            languages: {
                ...languages,
                'x-default': `${BASE_URL}${fullPath}`,
            },
        },
    };
}
