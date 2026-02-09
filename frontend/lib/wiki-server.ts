import { LangType } from '@/data/dictionary';
import fs from 'fs';
import path from 'path';
import { WikiItem, getWikiData as getLightWikiData, WikiType } from './wiki';

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
    } catch {
        // Fail silent
    }
    return undefined;
};

// Helper: Scan for Heavy-Only Items
const getHeavyOnlyItems = (lang: LangType): WikiItem[] => {
    const heavyDir = path.join(process.cwd(), 'data', 'wiki_heavy');
    if (!fs.existsSync(heavyDir)) return [];

    const files = fs.readdirSync(heavyDir);
    const heavyItems: WikiItem[] = [];
    const suffix = `-${lang.toLowerCase()}.json`;

    files.forEach(file => {
        if (file.endsWith(suffix)) {
            const slug = file.replace(suffix, '');
            const heavyData = loadHeavyData(slug, lang);

            if (heavyData) {
                try {
                    const rawPath = path.join(heavyDir, file);
                    const raw = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));

                    heavyItems.push({
                        slug: slug,
                        type: (raw.type as WikiType) || 'technical',
                        category: raw.category || 'Uncategorized',
                        title: raw.title || slug,
                        tags: [],
                        data: {},
                        heavy: heavyData
                    });
                } catch { }
            }
        }
    });
    return heavyItems;
};

export const getWikiItemWithHeavy = (slug: string, lang: LangType): WikiItem | undefined => {
    // 1. Try to find in Light Data
    const lightItems = getLightWikiData(lang);
    const item = lightItems.find(i => i.slug === slug);

    if (item) {
        // Hydrate with Heavy Data
        const heavy = loadHeavyData(slug, lang);
        if (heavy) {
            return { ...item, heavy };
        }
        return item;
    }

    // 2. Try Heavy-Only
    const heavyOnly = getHeavyOnlyItems(lang);
    return heavyOnly.find(i => i.slug === slug);
};

export const getWikiDataWithHeavy = (lang: LangType): WikiItem[] => {
    const lightItems = getLightWikiData(lang).map(item => {
        const heavy = loadHeavyData(item.slug, lang);
        if (heavy) return { ...item, heavy };
        return item;
    });

    // Merge Heavy Only
    const existingSlugs = new Set(lightItems.map(i => i.slug));
    const heavyOnly = getHeavyOnlyItems(lang).filter(i => !existingSlugs.has(i.slug));

    return [...lightItems, ...heavyOnly];
};
