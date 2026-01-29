import { LangType } from '@/data/dictionary';
import { GlossaryTerm } from '@/types/glossary';
// Server-side imports for Heavy Data
import fs from 'fs';
import path from 'path';

// Import all data (Standard Light Data)
import glossaryEn from '@/data/glossary-en.json';
import glossaryJa from '@/data/glossary-ja.json';
import glossaryCn from '@/data/glossary-cn.json';
import glossaryEs from '@/data/glossary-es.json';
import glossaryHi from '@/data/glossary-hi.json';
import glossaryId from '@/data/glossary-id.json';
import glossaryAr from '@/data/glossary-ar.json';

import technicalEn from '@/data/technical-en.json';
import technicalJa from '@/data/technical-ja.json';
import technicalCn from '@/data/technical-cn.json';
import technicalEs from '@/data/technical-es.json';
import technicalHi from '@/data/technical-hi.json';
import technicalId from '@/data/technical-id.json';
import technicalAr from '@/data/technical-ar.json';

import maximsEn from '@/data/maxims-en.json';
import maximsJa from '@/data/maxims-ja.json';
import maximsCn from '@/data/maxims-cn.json';
import maximsEs from '@/data/maxims-es.json';
import maximsHi from '@/data/maxims-hi.json';
import maximsId from '@/data/maxims-id.json';
import maximsAr from '@/data/maxims-ar.json';

// Types
type WikiType = 'glossary' | 'technical' | 'maxim';

export interface WikiItem {
    slug: string;
    type: WikiType;
    category: string;
    title: string;
    tags: string[];
    data: any; // Light data
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

const glossaryMap: Record<LangType, any> = { EN: glossaryEn, JP: glossaryJa, CN: glossaryCn, ES: glossaryEs, HI: glossaryHi, ID: glossaryId, AR: glossaryAr };
const technicalMap: Record<LangType, any> = { EN: technicalEn, JP: technicalJa, CN: technicalCn, ES: technicalEs, HI: technicalHi, ID: technicalId, AR: technicalAr };
const maximsMap: Record<LangType, any> = { EN: maximsEn, JP: maximsJa, CN: maximsCn, ES: maximsEs, HI: maximsHi, ID: maximsId, AR: maximsAr };

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

// Helper: Try Load Heavy Data
const loadHeavyData = (slug: string, lang: LangType) => {
    try {
        // Look in frontend/data/wiki_heavy
        const filePath = path.join(process.cwd(), 'data', 'wiki_heavy', `${slug}-${lang.toLowerCase()}.json`);
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const heavy = JSON.parse(raw);

            // Parse council_debate if stringified
            if (heavy.sections && heavy.sections.council_debate && typeof heavy.sections.council_debate === 'string') {
                try {
                    heavy.sections.council_debate = JSON.parse(heavy.sections.council_debate);
                } catch { }
            }

            return {
                summary: heavy.sections?.summary || "",
                deep_dive: heavy.sections?.deep_dive || "",
                council_debate: heavy.sections?.council_debate || {},
                forecast_risks: heavy.sections?.forecast_risks || "",
                gms_conclusion: heavy.sections?.gms_conclusion || "",
                generated_at: heavy.generated_at
            };
        }
    } catch (e) {
        // Fail silent, return undefined (Hybrid Fallback)
    }
    return undefined;
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
    const glossary = (glossaryMap[lang] || glossaryEn).map((item: any) => ({
        slug: item.id,
        type: 'glossary' as WikiType,
        category: cleanLocalizedTitle(item.category, lang),
        title: cleanLocalizedTitle(item.term, lang),
        tags: item.seo_keywords || [],
        data: item,
        heavy: loadHeavyData(item.id, lang)
    }));

    // 2. Technical
    const techEn = technicalEn;
    // Fallback to EN if target lang file is missing, but map exists
    const techTarget = technicalMap[lang] || technicalEn;

    const technical: WikiItem[] = [];
    techEn.forEach((cat: any, catIdx: number) => {
        cat.indicators.forEach((ind: any, indIdx: number) => {
            // Safely access target category and indicator
            const targetCat = techTarget[catIdx] || cat;
            const targetInd = targetCat?.indicators?.[indIdx];
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
                    heavy: loadHeavyData(slug, lang)
                });
            }
        });
    });

    // 3. Maxims
    const maxEn = maximsEn;
    const maxTarget = maximsMap[lang] || maximsEn;

    const maxims: WikiItem[] = [];
    maxEn.forEach((cat: any, catIdx: number) => {
        cat.quotes.forEach((quote: any, quoteIdx: number) => {
            const targetCat = maxTarget[catIdx] || cat;
            const targetQuote = targetCat?.quotes?.[quoteIdx];
            const finalQuote = targetQuote || quote;

            if (finalQuote) {
                // For Maxims:
                // If EN: Title = text ("The trend is your friend")
                // If Non-EN: Title = meaning ("趋势是你的朋友") because 'text' is usually left in English even in localized files

                let displayTitle = `"${finalQuote.text}"`;
                if (lang !== 'EN' && finalQuote.meaning) {
                    // Check if meaning is different from text (i.e. it is actually translated)
                    // In maxims-cn.json: text is English, meaning is Chinese.
                    displayTitle = `"${finalQuote.meaning}"`;
                }

                maxims.push({
                    slug: quote.id,
                    type: 'maxim' as WikiType,
                    category: cleanLocalizedTitle(targetCat?.category || cat.category, lang),
                    title: displayTitle,
                    tags: [finalQuote.attribution || ''],
                    data: finalQuote,
                    heavy: loadHeavyData(quote.id, lang)
                });
            }
        });
    });

    return [...glossary, ...technical, ...maxims];
};

export const getWikiItem = (slug: string, lang: LangType): WikiItem | undefined => {
    const all = getWikiData(lang);
    return all.find(item => item.slug === slug);
};

export const getAllSlugs = () => {
    return getWikiData('EN').map(item => item.slug);
};
