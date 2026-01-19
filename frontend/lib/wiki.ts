import { LangType } from '@/data/dictionary';
import { GlossaryTerm } from '@/types/glossary';

// Import all data (Server-side only usually, but we import here for the helper)
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
    data: any; // The raw object from JSON
}

const glossaryMap: Record<LangType, any> = { EN: glossaryEn, JP: glossaryJa, CN: glossaryCn, ES: glossaryEs, HI: glossaryHi, ID: glossaryId, AR: glossaryAr };
const technicalMap: Record<LangType, any> = { EN: technicalEn, JP: technicalJa, CN: technicalCn, ES: technicalEs, HI: technicalHi, ID: technicalId, AR: technicalAr };
const maximsMap: Record<LangType, any> = { EN: maximsEn, JP: maximsJa, CN: maximsCn, ES: maximsEs, HI: maximsHi, ID: maximsId, AR: maximsAr };

// Utility to slugify string
const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
};

export const getWikiData = (lang: LangType) => {
    // 1. Glossary
    const glossary = (glossaryMap[lang] || glossaryEn).map((item: any) => ({
        slug: item.id,
        type: 'glossary' as WikiType,
        category: item.category,
        title: item.term,
        tags: item.seo_keywords || [],
        data: item
    }));

    // 2. Technical
    // We must rely on EN structure for slug generation to ensure consistency across languages
    const techEn = technicalEn;
    const techTarget = technicalMap[lang] || technicalEn;

    let technical: WikiItem[] = [];
    techEn.forEach((cat: any, catIdx: number) => {
        cat.indicators.forEach((ind: any, indIdx: number) => {
            // Get target language item using indices
            const targetCat = techTarget[catIdx];
            const targetInd = targetCat?.indicators[indIdx];

            // Fallback to EN if target missing
            const finalInd = targetInd || ind;

            if (finalInd) {
                technical.push({
                    slug: slugify(ind.name), // Always use EN name for slug
                    type: 'technical' as WikiType,
                    category: targetCat?.category || cat.category,
                    title: finalInd.name,
                    tags: finalInd.seo_keywords || [],
                    data: finalInd
                });
            }
        });
    });

    // 3. Maxims
    const maxEn = maximsEn;
    const maxTarget = maximsMap[lang] || maximsEn;

    let maxims: WikiItem[] = [];
    maxEn.forEach((cat: any, catIdx: number) => {
        cat.quotes.forEach((quote: any, quoteIdx: number) => {
            const targetCat = maxTarget[catIdx];
            const targetQuote = targetCat?.quotes[quoteIdx];

            const finalQuote = targetQuote || quote;

            if (finalQuote) {
                maxims.push({
                    slug: quote.id,
                    type: 'maxim' as WikiType,
                    category: targetCat?.category || cat.category,
                    title: `"${finalQuote.text}"`,
                    tags: [finalQuote.attribution || ''],
                    data: finalQuote
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
    // Return all unique slugs (based on EN)
    return getWikiData('EN').map(item => item.slug);
};
