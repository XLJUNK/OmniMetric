import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://omnimetric.net';
    const languages = ['EN', 'JP', 'CN', 'ES', 'HI', 'ID', 'AR'];
    const paths = ['', '/stocks', '/crypto', '/forex', '/commodities'];
    const legalPaths = ['/legal/privacy-policy', '/legal/terms', '/legal/disclaimer', '/contact', '/about', '/archive'];

    let entries: MetadataRoute.Sitemap = [];

    // sector pages with languages
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

    // legal pages
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

    return entries;
}
