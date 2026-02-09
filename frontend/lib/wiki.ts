import { LangType } from '@/data/dictionary';

// Import all data (Standard Light Data)
import glossaryEn from '@/data/glossary-en.json';
import glossaryJa from '@/data/glossary-ja.json';
import glossaryCn from '@/data/glossary-cn.json';
import glossaryEs from '@/data/glossary-es.json';
import glossaryHi from '@/data/glossary-hi.json';
import glossaryId from '@/data/glossary-id.json';
import glossaryAr from '@/data/glossary-ar.json';
import glossaryFr from '@/data/glossary-fr.json';
import glossaryDe from '@/data/glossary-de.json';

import technicalEn from '@/data/technical-en.json';
import technicalJa from '@/data/technical-ja.json';
import technicalCn from '@/data/technical-cn.json';
import technicalEs from '@/data/technical-es.json';
import technicalHi from '@/data/technical-hi.json';
import technicalId from '@/data/technical-id.json';
import technicalAr from '@/data/technical-ar.json';
import technicalFr from '@/data/technical-fr.json';
import technicalDe from '@/data/technical-de.json';

import maximsEn from '@/data/maxims-en.json';
import maximsJa from '@/data/maxims-ja.json';
import maximsCn from '@/data/maxims-cn.json';
import maximsEs from '@/data/maxims-es.json';
import maximsHi from '@/data/maxims-hi.json';
import maximsId from '@/data/maxims-id.json';
import maximsAr from '@/data/maxims-ar.json';
import maximsFr from '@/data/maxims-fr.json';
import maximsDe from '@/data/maxims-de.json';

// Types
export type WikiType = 'glossary' | 'technical' | 'maxim' | 'indicator' | 'asset';

export interface WikiItem {
    slug: string;
    type: WikiType;
    category: string;
    title: string;
    tags: string[];
    data: unknown; // Light data
    heavy?: {
        summary: string;
        deep_dive: string;
        council_debate: {
            geopolitics: string;
            macro: string;
            quant: string;
            technical: string;
            policy: string;
            tech: string;
        };
        forecast_risks: string;
        gms_conclusion: string;
        generated_at: string;
    };
}

const glossaryMap: Record<LangType, unknown[]> = { EN: glossaryEn, JP: glossaryJa, CN: glossaryCn, ES: glossaryEs, HI: glossaryHi, ID: glossaryId, AR: glossaryAr, FR: glossaryFr, DE: glossaryDe };
const technicalMap: Record<LangType, unknown[]> = { EN: technicalEn, JP: technicalJa, CN: technicalCn, ES: technicalEs, HI: technicalHi, ID: technicalId, AR: technicalAr, FR: technicalFr, DE: technicalDe };
const maximsMap: Record<LangType, unknown[]> = { EN: maximsEn, JP: maximsJa, CN: maximsCn, ES: maximsEs, HI: maximsHi, ID: maximsId, AR: maximsAr, FR: maximsFr, DE: maximsDe };

// Utility to slugify string
export const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\//g, '-')            // Replace slash with -
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
};

// Helper: Clean Mixed English/Localized Titles
const cleanLocalizedTitle = (text: string, lang: LangType): string => {
    if (lang === 'EN') return text;

    // Pattern 1: "English (Localized)" -> Keep Localized
    // Pattern 2: "Localized (English)" -> Keep Localized

    // Check if text has parentheses
    const match = text.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
        const part1 = match[1];
        const part2 = match[2];

        // Heuristic: If one part has non-ASCII (likely localized) and the other is ASCII (English)
        const isPart1ASCII = /^[\x00-\x7F]*$/.test(part1);
        const isPart2ASCII = /^[\x00-\x7F]*$/.test(part2);

        if (!isPart1ASCII && isPart2ASCII) return part1.trim(); // "Localized (English)" -> "Localized"
        if (isPart1ASCII && !isPart2ASCII) return part2.trim(); // "English (Localized)" -> "Localized"
    }

    return text;
};

export const getWikiData = (lang: LangType) => {
    // 1. Glossary
    const glossary = (glossaryMap[lang] as unknown[] || glossaryEn).map((item: unknown) => {
        const i = item as { id: string; category: string; term: string; seo_keywords?: string[] };
        return {
            slug: i.id,
            type: 'glossary' as WikiType,
            category: cleanLocalizedTitle(i.category, lang),
            title: cleanLocalizedTitle(i.term, lang),
            tags: i.seo_keywords || [],
            data: i,
            heavy: undefined
        };
    });

    // 2. Technical
    const techEn = technicalEn;
    // Fallback to EN if target lang file is missing, but map exists
    const techTarget = technicalMap[lang] || technicalEn;

    const technical: WikiItem[] = [];
    techEn.forEach((cat: { category: string; indicators: { name: string; seo_keywords?: string[] }[] }, catIdx: number) => {
        cat.indicators.forEach((ind: { name: string; seo_keywords?: string[] }, indIdx: number) => {
            // Safely access target category and indicator
            const targetCat = (techTarget[catIdx] || cat) as { category: string; indicators: { name: string; seo_keywords?: string[] }[] };
            const targetInd = targetCat?.indicators?.[indIdx] as { name: string; seo_keywords?: string[] } | undefined;
            const finalInd = targetInd || ind;

            if (finalInd) {
                // Use English Name for Slug (Canonical)
                const slug = slugify(ind.name);
                const rawTitle = finalInd.name;
                const rawCategory = targetCat?.category || cat.category;

                technical.push({
                    slug: slug,
                    type: 'technical' as WikiType,
                    category: cleanLocalizedTitle(rawCategory, lang),
                    title: cleanLocalizedTitle(rawTitle, lang),
                    tags: finalInd.seo_keywords || [],
                    data: finalInd,
                    heavy: undefined
                });
            }
        });
    });

    // 3. Maxims
    const maxEn = maximsEn;
    const maxTarget = maximsMap[lang] as { category: string; quotes: { id: string; text: string; meaning?: string; attribution?: string; seo_keywords?: string[] }[] }[] || maximsEn;

    const maxims: WikiItem[] = [];
    maxEn.forEach((cat: { category: string; quotes: { id: string; text: string; meaning?: string; attribution?: string; seo_keywords?: string[] }[] }, catIdx: number) => {
        cat.quotes.forEach((quote: { id: string; text: string; meaning?: string; attribution?: string; seo_keywords?: string[] }, quoteIdx: number) => {
            const targetCat = (maxTarget[catIdx] || cat) as { category: string; quotes: { id: string; text: string; meaning?: string; attribution?: string; seo_keywords?: string[] }[] };
            const targetQuote = targetCat?.quotes?.[quoteIdx];
            const finalQuote = targetQuote || quote;

            if (finalQuote) {
                let displayTitle = `"${finalQuote.text}"`;
                if (lang !== 'EN' && finalQuote.meaning) {
                    displayTitle = `"${finalQuote.meaning}"`;
                }

                maxims.push({
                    slug: quote.id,
                    type: 'maxim' as WikiType,
                    category: cleanLocalizedTitle(targetCat?.category || cat.category, lang),
                    title: displayTitle,
                    tags: [finalQuote.attribution || ''],
                    data: finalQuote,
                    heavy: undefined
                });
            }
        });
    });

    // Note: Heavy-Only items are excluded in Client-Side data to avoid fs usage.
    // Use getWikiDataWithHeavy from lib/wiki-server.ts for full data.

    return [...glossary, ...technical, ...maxims];
};

export const getWikiItem = (slug: string, lang: LangType): WikiItem | undefined => {
    const all = getWikiData(lang);
    return all.find(item => item.slug === slug);
};

export const getAllSlugs = () => {
    return getWikiData('EN').map(item => item.slug);
};
