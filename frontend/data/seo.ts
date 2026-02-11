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

    // Generate all 9 languages (Path-based strict)
    Object.entries(LANGUAGES).forEach(([code, hreflang]) => {
        const langPath = code.toLowerCase();
        if (cleanPath === '/') {
            // Root special case: English is naked domain
            alternates[hreflang] = code === 'EN'
                ? `${BASE_URL}/`
                : `${BASE_URL}/${langPath}`;
        } else {
            // Standard Paths (/wiki, /forex, etc) - English always gets /en/ in alternates for clarity
            alternates[hreflang] = `${BASE_URL}/${langPath}${cleanPath}`;
        }
    });

    // Set x-default (English Root or English Path)
    alternates['x-default'] = cleanPath === '/' ? `${BASE_URL}/` : `${BASE_URL}/en${cleanPath}`;

    // Canonical (Self-referencing path)
    let canonical = `${BASE_URL}/${langCode.toLowerCase()}${cleanPath}`;

    // Special Case: English Homepage is Root
    if (langCode === 'EN' && cleanPath === '/') {
        canonical = `${BASE_URL}/`;
    }

    return {
        title: title || "Global Macro Signal (OmniMetric Terminal) | AI-Driven Financial Insight",
        description: description || (langCode === 'JP'
            ? "機関投資家品質のマクロ経済解析を個人に開放する自律型ターミナル。GMS Scoreによりグローバルマクロのリスクをリアルタイムで可視化。"
            : "Autonomous terminal democratizing institutional-grade macro analysis. GMS Score provides real-time visibility into global macro risk regimes."),
        alternates: {
            canonical,
            languages: alternates,
        },
        openGraph: {
            title: title || "Global Macro Signal | Institutional Market Intelligence",
            description: description || (langCode === 'JP'
                ? "機関投資家品質のマクロ解析を提供する自律型ターミナル。独自アルゴリズムでリスクを可視化。"
                : "Institutional-grade autonomous terminal for macro analysis. Visualizing global risk via proprietary algorithms."),
            url: canonical,
            siteName: "OmniMetric Terminal",
            images: [
                {
                    url: `${BASE_URL}/brand-og.png`,
                    width: 1200,
                    height: 630,
                    alt: title || 'Global Macro Signal | Institutional Real-Time Analysis',
                }
            ],
            type: 'website',
            locale: currentLang === 'JP' ? 'ja_JP' : 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: title || "Global Macro Signal | Institutional Market Intelligence",
            description: description || (langCode === 'JP'
                ? "機関投資家品質のマクロ解析を提供する自律型ターミナル。"
                : "Autonomous terminal democratizing institutional-grade macro analysis."),
            creator: '@OmniMetric_GMS',
            images: [`${BASE_URL}/brand-og.png`],
        },
    };
}
