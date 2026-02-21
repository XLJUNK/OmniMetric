import { MetadataRoute } from 'next';
import { getWikiDataWithHeavy } from '@/lib/wiki-server';
import fs from 'fs';
import path from 'path';

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

    // Paths that exist for all languages
    const corePaths = ['', '/stocks', '/crypto', '/currencies', '/commodities', '/glossary', '/technical', '/maxims', '/omni-resonance'];
    const legalPaths = ['/contact', '/about', '/archive', '/legal', '/privacy'];

    const entries: MetadataRoute.Sitemap = [];

    // Helper to generate alternates for a path
    const getAlternates = (urlPath: string) => {
        const languagesMap: Record<string, string> = {};
        lowerLangs.forEach(lang => {
            if (urlPath === '') {
                languagesMap[hreflangMap[lang]] = lang === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang}`;
            } else {
                languagesMap[hreflangMap[lang]] = lang === 'en' ? `${baseUrl}${urlPath}` : `${baseUrl}/${lang}${urlPath}`;
            }
        });
        languagesMap['x-default'] = `${baseUrl}${urlPath === '' ? '/' : urlPath}`;
        return { languages: languagesMap };
    };

    // 1. Core & Semantic Pages
    corePaths.forEach(urlPath => {
        lowerLangs.forEach(lang => {
            entries.push({
                url: lang === 'en' ? `${baseUrl}${urlPath || '/'}` : `${baseUrl}/${lang}${urlPath}`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'daily',
                priority: urlPath === '' ? 1.0 : 0.9,
                alternates: getAlternates(urlPath),
            });
        });
    });

    // 2. Legal & Static Pages
    legalPaths.forEach(urlPath => {
        lowerLangs.forEach(lang => {
            entries.push({
                url: lang === 'en' ? `${baseUrl}${urlPath}` : `${baseUrl}/${lang}${urlPath}`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.5,
                alternates: getAlternates(urlPath),
            });
        });
    });

    // 3. Wiki Index & Detail Pages
    lowerLangs.forEach(lang => {
        entries.push({
            url: lang === 'en' ? `${baseUrl}/wiki` : `${baseUrl}/${lang}/wiki`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily',
            priority: 0.8,
            alternates: getAlternates('/wiki'),
        });
    });

    // Use EN as the master list for all Wiki slugs (including Heavy-Only)
    const wikiItems = getWikiDataWithHeavy('EN');
    wikiItems.forEach(item => {
        const subPath = `/wiki/${item.slug}`;
        lowerLangs.forEach(lang => {
            entries.push({
                url: lang === 'en' ? `${baseUrl}${subPath}` : `${baseUrl}/${lang}${subPath}`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: 0.7,
                alternates: getAlternates(subPath),
            });
        });
    });

    // 4. Dynamic Archive & Analysis Pages (Deep SEO)
    try {
        const archiveDir = path.join(process.cwd(), 'public/data/archive');
        if (fs.existsSync(archiveDir)) {
            const files = fs.readdirSync(archiveDir);
            const dates = files
                .filter((f: string) => f.endsWith('.json') && f !== 'index.json' && f !== 'performance_audit.json' && f !== 'summary.json' && !f.startsWith('monthly_'))
                .map((f: string) => f.replace('.json', ''))
                .sort((a: string, b: string) => b.localeCompare(a)) // Ensure descending for latest
                .slice(0, 30); // Latest 30 days for temporal authority signals

            dates.forEach(date => {
                // Archive Page
                const archivePath = `/archive/${date}`;
                lowerLangs.forEach(lang => {
                    entries.push({
                        url: lang === 'en' ? `${baseUrl}${archivePath}` : `${baseUrl}/${lang}${archivePath}`,
                        lastModified: new Date().toISOString(),
                        changeFrequency: 'never',
                        priority: 0.4,
                        alternates: getAlternates(archivePath),
                    });
                });

                // Analysis Page
                const analysisPath = `/analysis/${date}`;
                lowerLangs.forEach(lang => {
                    entries.push({
                        url: lang === 'en' ? `${baseUrl}${analysisPath}` : `${baseUrl}/${lang}${analysisPath}`,
                        lastModified: new Date().toISOString(),
                        changeFrequency: 'never',
                        priority: 0.6,
                        alternates: getAlternates(analysisPath),
                    });
                });
            });

            // 5. Monthly AI Reports (High Authority)
            const monthlyIndexFile = path.join(archiveDir, 'monthly_index.json');
            if (fs.existsSync(monthlyIndexFile)) {
                try {
                    const monthlyData = JSON.parse(fs.readFileSync(monthlyIndexFile, 'utf8'));
                    const months = monthlyData.months || [];
                    months.forEach((monthKey: string) => {
                        const monthPath = `/archive/month/${monthKey}`;
                        lowerLangs.forEach(lang => {
                            entries.push({
                                url: lang === 'en' ? `${baseUrl}${monthPath}` : `${baseUrl}/${lang}${monthPath}`,
                                lastModified: new Date().toISOString(),
                                changeFrequency: 'monthly',
                                priority: 0.7,
                                alternates: getAlternates(monthPath),
                            });
                        });
                    });
                } catch (e) {
                    console.error('Monthly index parsing failed:', e);
                }
            }
        }
    } catch (error) {
        console.error('Sitemap archive generation failed:', error);
    }

    return entries;
}
