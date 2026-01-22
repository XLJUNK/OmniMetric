import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/wiki';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://omnimetric.net';
    const languages = ['EN', 'JP', 'CN', 'ES', 'HI', 'ID', 'AR'];
    const lowerLangs = languages.map(l => l.toLowerCase());

    const paths = ['', '/stocks', '/crypto', '/forex', '/commodities'];
    const legalPaths = ['/legal/disclaimer', '/contact', '/about', '/archive'];

    const entries: MetadataRoute.Sitemap = [];

    // Helper to generate alternates for a path (query-param style or directory style)
    const getAlternates = (path: string, type: 'query' | 'path') => {
        const languagesMap: Record<string, string> = {};

        if (type === 'path') {
            lowerLangs.forEach(lang => {
                languagesMap[lang] = `${baseUrl}/${lang}${path}`;
            });
            // Map common aliases
            languagesMap['ja'] = languagesMap['jp'];
            languagesMap['zh-CN'] = languagesMap['cn'];
            languagesMap['x-default'] = `${baseUrl}/en${path}`;
        } else {
            languages.forEach(lang => {
                const l = lang.toLowerCase();
                languagesMap[l] = `${baseUrl}${path}?lang=${lang}`;
            });
            languagesMap['ja'] = languagesMap['jp'];
            languagesMap['zh-CN'] = languagesMap['cn'];
            languagesMap['x-default'] = `${baseUrl}${path}?lang=EN`;
        }
        return { languages: languagesMap };
    };

    // 1. Core Pages (Query Param Style)
    paths.forEach(path => {
        languages.forEach(lang => {
            entries.push({
                url: `${baseUrl}${path}?lang=${lang}`,
                lastModified: new Date(),
                changeFrequency: 'hourly',
                priority: path === '' ? 1.0 : 0.9,
                alternates: getAlternates(path, 'query'),
            });
        });
    });

    // 2. Legal Pages (Query Param Style)
    legalPaths.forEach(path => {
        languages.forEach(lang => {
            entries.push({
                url: `${baseUrl}${path}?lang=${lang}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
                alternates: getAlternates(path, 'query'),
            });
        });
    });

    // 2.5 Legal Pages (Directory Style - New Multilingual)
    const legalDynamicPaths = ['/legal/privacy-policy', '/legal/terms'];
    legalDynamicPaths.forEach(path => {
        lowerLangs.forEach(lang => {
            entries.push({
                url: `${baseUrl}/${lang}${path}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: getAlternates(path, 'path'),
            });
        });
    });

    // 3. Wiki Index Pages (Directory Style: /jp/wiki)
    lowerLangs.forEach(lang => {
        entries.push({
            url: `${baseUrl}/${lang}/wiki`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
            alternates: getAlternates('/wiki', 'path'),
        });
    });

    // 4. Wiki Detail Pages (Directory Style: /jp/wiki/slug)
    const slugs = getAllSlugs();
    slugs.forEach(slug => {
        const subPath = `/wiki/${slug}`;
        lowerLangs.forEach(lang => {
            entries.push({
                url: `${baseUrl}/${lang}${subPath}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
                alternates: getAlternates(subPath, 'path'),
            });
        });
    });

    return entries;
}
