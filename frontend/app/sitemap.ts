import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/wiki';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://omnimetric.net';
    const languages = ['EN', 'JP', 'CN', 'ES', 'HI', 'ID', 'AR'];
    const lowerLangs = languages.map(l => l.toLowerCase());

    const paths = ['', '/stocks', '/crypto', '/forex', '/commodities'];
    const legalPaths = ['/legal/privacy-policy', '/legal/terms', '/legal/disclaimer', '/contact', '/about', '/archive'];

    let entries: MetadataRoute.Sitemap = [];

    // 1. Core Pages (Query Param Style: ?lang=XX)
    paths.forEach(path => {
        languages.forEach(lang => {
            entries.push({
                url: `${baseUrl}${path}?lang=${lang}`,
                lastModified: new Date(),
                changeFrequency: 'hourly',
                priority: path === '' ? 1.0 : 0.9,
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
        });
    });

    // 4. Wiki Detail Pages (Directory Style: /jp/wiki/slug)
    const slugs = getAllSlugs();
    slugs.forEach(slug => {
        lowerLangs.forEach(lang => {
            entries.push({
                url: `${baseUrl}/${lang}/wiki/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    });

    return entries;
}
