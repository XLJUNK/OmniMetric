import { NextRequest } from 'next/server';
import { z } from 'zod';
import { LanguageSchema } from '@/lib/validation';
import { successResponse, validationErrorResponse } from '@/lib/api-response';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';
// Removed static revalidation to ensure fresh data for translations

// Query parameter schema
const NewsQuerySchema = z.object({
    lang: LanguageSchema.optional().default('EN')
});

export async function GET(request: NextRequest) {
    try {
        // Parse and validate query parameters
        const { searchParams } = new URL(request.url);
        const langParam = searchParams.get('lang')?.toUpperCase() || 'EN';

        const validation = NewsQuerySchema.safeParse({ lang: langParam });

        if (!validation.success) {
            return validationErrorResponse(
                'Invalid query parameters',
                validation.error.issues.map((err: z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            );
        }

        const { lang } = validation.data;

        // Dynamically read the signal data file to avoid stale cache
        const dataPath = join(process.cwd(), 'data', 'current_signal.json');
        const signalData = JSON.parse(readFileSync(dataPath, 'utf-8'));

        // Access pre-translated news from static import
        const intelligence = (signalData as any).intelligence;

        if (!intelligence || !intelligence.news) {
            return successResponse({
                news: [],
                message: 'No news available at this time'
            });
        }

        // Get original news items with links and timestamps
        const originalNews = intelligence.news || [];
        const translations = intelligence.translations || {};
        const translatedTitles = translations[lang] || translations['EN'] || [];

        // Fallback message if no news
        if (originalNews.length === 0) {
            return successResponse({
                news: [{
                    title: lang === 'JP'
                        ? 'ニュースは現在利用できません'
                        : 'No news available',
                    url: '#',
                    published: new Date().toISOString()
                }]
            });
        }

        // Merge original news items with their translations
        const newsItems = originalNews.slice(0, 6).map((item: any, index: number) => {
            const translatedTitle = translatedTitles[index];
            return {
                title: translatedTitle || item.title,
                url: item.link || item.url || '#',
                link: item.link || item.url || '#',
                published: item.isoDate || item.published || new Date().toISOString(),
                isoDate: item.isoDate || item.published || new Date().toISOString()
            };
        });

        // Debug logging
        console.log('[NEWS API] ===== DEBUG START =====');
        console.log('[NEWS API] Lang:', lang);
        console.log('[NEWS API] Original news count:', originalNews.length);
        console.log('[NEWS API] Translations object keys:', Object.keys(translations));
        console.log('[NEWS API] Translated titles count for', lang, ':', translatedTitles.length);
        if (translatedTitles.length > 0) {
            console.log('[NEWS API] First translated title:', translatedTitles[0]);
        }
        if (newsItems.length > 0) {
            console.log('[NEWS API] First news item:', JSON.stringify(newsItems[0], null, 2));
        }
        console.log('[NEWS API] ===== DEBUG END =====');

        const keys = Object.keys(translations);
        const hasDirectJP = keys.includes('JP');
        const langMatchesJP = lang === 'JP';

        return successResponse({
            news: newsItems,
            translations: translations, // Added for NewsTicker compatibility
            language: lang,
            last_updated: intelligence.last_updated || new Date().toISOString()
        });

    } catch (error) {
        console.error('[API /news] Error:', error);
        return successResponse({
            news: [{
                title: 'News temporarily unavailable',
                url: '#',
                published: new Date().toISOString()
            }]
        });
    }
}
