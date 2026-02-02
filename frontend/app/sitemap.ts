import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/wiki';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.omnimetric.net';
    const languages = ['EN', 'JP', 'CN', 'ES', 'HI', 'ID', 'AR'];
    const lowerLangs = languages.map(l => l.toLowerCase());
    const hreflangMap: Record<string, string> = {
        en: 'en',
        jp: 'ja',
        cn: 'zh-CN',
        es: 'es',
        hi: 'hi',
        id: 'id',
        ar: 'ar'
    };

    const paths = ['', '/stocks', '/crypto', '/forex', '/commodities'];
    const legalPaths = ['/legal/disclaimer', '/contact', '/about', '/archive'];
    const legalDynamicPaths = ['/legal/privacy-policy', '/legal/terms'];

    const entries: MetadataRoute.Sitemap = [];

    // Helper to generate alternates for a path (Directory style only now for SEO perfection)
    const getAlternates = (path: string) => {
        const languagesMap: Record<string, string> = {};
        lowerLangs.forEach(lang => {
            if (path === '') {
                // Root special case: EN is at root /, others at /lang
                languagesMap[hreflangMap[lang]] = lang === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang}`;
            } else {
                languagesMap[hreflangMap[lang]] = `${baseUrl}/${lang}${path}`;
            }
        });

        // x-default
        if (path === '') {
            languagesMap['x-default'] = `${baseUrl}/`;
        } else {
            languagesMap['x-default'] = `${baseUrl}/en${path}`;
        }

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

    // 2.5 Legal Pages (Dynamic)
    legalDynamicPaths.forEach(path => {
        lowerLangs.forEach(lang => {
            entries.push({
                url: `${baseUrl}/${lang}${path}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: getAlternates(path),
            });
        });
    });

    // 3. Wiki Index Pages
    lowerLangs.forEach(lang => {
        entries.push({
            url: `${baseUrl}/${lang}/wiki`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
            alternates: getAlternates('/wiki'),
        });
    });

    // 4. Wiki Detail Pages
    const slugs = getAllSlugs();
    slugs.forEach(slug => {
        const subPath = `/wiki/${slug}`;
        lowerLangs.forEach(lang => {
            entries.push({
                url: `${baseUrl}/${lang}${subPath}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
                alternates: getAlternates(subPath),
            });
        });
    });

    return entries;
}
