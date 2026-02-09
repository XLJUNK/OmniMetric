import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/wiki';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.omnimetric.net';
    const languages = ['EN', 'JP', 'CN', 'ES', 'HI', 'ID', 'AR', 'FR', 'DE'];
    const lowerLangs = languages.map(l => l.toLowerCase());
    const hreflangMap: Record<string, string> = {
        en: 'en',
        jp: 'ja',
        cn: 'zh-CN',
        es: 'es',
        hi: 'hi',
        id: 'id',
        ar: 'ar',
        fr: 'fr',
        de: 'de'
    };

    const paths = ['', '/stocks', '/crypto', '/forex', '/commodities'];
    const legalPaths = ['/contact', '/about', '/archive', '/legal', '/privacy'];

    const entries: MetadataRoute.Sitemap = [];

    // Helper to generate alternates for a path (Directory style only now for SEO perfection)
    const getAlternates = (path: string) => {
        const languagesMap: Record<string, string> = {};
        lowerLangs.forEach(lang => {
            if (path === '') {
                // Root special case: EN is at root /, others at /lang
                languagesMap[hreflangMap[lang]] = lang === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang}`;
            } else {
                languagesMap[hreflangMap[lang]] = lang === 'en' ? `${baseUrl}${path}` : `${baseUrl}/${lang}${path}`;
            }
        });

        // x-default
        languagesMap['x-default'] = `${baseUrl}${path === '' ? '/' : path}`;

        return { languages: languagesMap };
    };

    // 1. Core Pages
    paths.forEach(path => {
        lowerLangs.forEach(lang => {
            entries.push({
                url: `${baseUrl}/${lang}${path}`,
                lastModified: new Date(),
                changeFrequency: 'hourly',
                priority: path === '' ? 1.0 : 0.9,
                alternates: getAlternates(path),
            });
        });
    });

    // 2. Legal Pages (Static)
    legalPaths.forEach(path => {
        lowerLangs.forEach(lang => {
            entries.push({
                url: `${baseUrl}/${lang}${path}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
                alternates: getAlternates(path),
            });
        });
    });

    // 3. Wiki Index Pages (Standardized loop)
    lowerLangs.forEach(lang => {
        entries.push({
            url: lang === 'en' ? `${baseUrl}/wiki` : `${baseUrl}/${lang}/wiki`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
            alternates: getAlternates('/wiki'),
        });
    });

    // 4. Wiki Detail Pages (Standardized loop)
    const slugs = getAllSlugs();
    slugs.forEach(slug => {
        const subPath = `/wiki/${slug}`;
        lowerLangs.forEach(lang => {
            entries.push({
                url: lang === 'en' ? `${baseUrl}${subPath}` : `${baseUrl}/${lang}${subPath}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
                alternates: getAlternates(subPath),
            });
        });
    });

    return entries;
}
