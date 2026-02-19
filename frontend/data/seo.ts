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
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    const alternates: Record<string, string> = {};

    // Generate language & region specific alternates
    Object.entries(LANGUAGES).forEach(([code, hreflang]) => {
        const langPath = code.toLowerCase();
        let targetUrl = '';

        if (cleanPath === '/') {
            targetUrl = code === 'EN' ? `${BASE_URL}/` : `${BASE_URL}/${langPath}`;
        } else {
            targetUrl = code === 'EN' ? `${BASE_URL}${cleanPath}` : `${BASE_URL}/${langPath}${cleanPath}`;
        }

        alternates[hreflang] = targetUrl;

        // Specific Region Support for North America and Europe
        if (code === 'EN') {
            alternates['en-US'] = targetUrl;
            alternates['en-GB'] = targetUrl;
        }
        if (code === 'JP') {
            alternates['ja-jp'] = targetUrl;
        }
    });

    // Set x-default (Always the English version, without /en prefix)
    alternates['x-default'] = cleanPath === '/' ? `${BASE_URL}/` : `${BASE_URL}${cleanPath}`;

    // Canonical (Self-referencing path)
    let canonical = langCode === 'EN'
        ? `${BASE_URL}${cleanPath}`
        : `${BASE_URL}/${langCode.toLowerCase()}${cleanPath}`;

    if (cleanPath === '/') {
        canonical = `${BASE_URL}/`;
    }

    // Ensure Description density (120-150 chars for AI search engines)
    const defaultDesc = langCode === 'JP'
        ? "機関投資家品質のマクロ経済解析を個人に開放する自律型ターミナル。GMS Scoreによりグローバルマクロのリスクをリアルタイムで可視化し、AIが深い洞察を提供します。"
        : "Autonomous terminal democratizing institutional-grade macro analysis. GMS Score provides real-time visibility into global macro risk regimes with deep AI-driven insights.";

    let finalDesc = description || defaultDesc;
    if (finalDesc.length < 100) {
        finalDesc = `${finalDesc} OmniMetric Terminal provides institutional-grade market intelligence and real-time risk assessments for global investors.`.slice(0, 155);
    }

    return {
        title: title || "Global Macro Signal (OmniMetric Terminal) | AI-Driven Financial Insight",
        description: finalDesc,
        alternates: {
            canonical,
            languages: alternates,
        },
        openGraph: {
            title: title || "Global Macro Signal | Institutional Market Intelligence",
            description: finalDesc,
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
            description: finalDesc,
            creator: '@OmniMetric_GMS',
            images: [`${BASE_URL}/brand-og.png`],
        },
    };
}
