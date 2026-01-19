
import fs from 'fs';
import path from 'path';

// Manual Interface Definitions to avoid imports
interface WikiItem {
    slug: string;
    type: string;
    category: string;
    title: string;
}

const LANGUAGES = ['en', 'jp', 'cn', 'es', 'hi', 'id', 'ar'];

const DATA_DIR = path.join(process.cwd(), 'frontend/data');

// Helper to read JSON
function readJson(filename: string) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        if (!fs.existsSync(filePath)) return null;
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`Error reading ${filename}:`, e);
        return null;
    }
}

// Re-implement Slugify
const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// Main Audit Logic
async function runAudit() {
    console.log("Starting SEO Audit (Self-Contained)...");

    // Load EN Data to establish Baseline Slugs
    const glossaryEn = readJson('glossary-en.json');
    const technicalEn = readJson('technical-en.json');
    const maximsEn = readJson('maxims-en.json');

    if (!glossaryEn || !technicalEn || !maximsEn) {
        console.error("Critical: Default EN data missing.");
        return;
    }

    const slugs: string[] = [];

    // Harvest Slugs
    glossaryEn.forEach((item: any) => slugs.push(item.id));
    technicalEn.forEach((cat: any) => {
        cat.indicators.forEach((ind: any) => slugs.push(slugify(ind.name)));
    });
    maximsEn.forEach((cat: any) => {
        cat.quotes.forEach((q: any) => slugs.push(q.id));
    });

    console.log(`Baseline: ${slugs.length} slugs found in EN.`);

    const errors: string[] = [];
    let checkedCount = 0;

    // Verify Existence in Other Languages
    for (const lang of LANGUAGES) {
        console.log(`Checking Language: ${lang.toUpperCase()}...`);

        const glossary = readJson(`glossary-${lang}.json`);
        const technical = readJson(`technical-${lang}.json`);
        const maxims = readJson(`maxims-${lang}.json`);

        if (!glossary) errors.push(`[${lang}] Missing glossary file.`);
        if (!technical) errors.push(`[${lang}] Missing technical file.`);
        if (!maxims) errors.push(`[${lang}] Missing maxims file.`);

        // Check content parity
        // 1. Glossary Parity
        // We expect EVERY ID in glossaryEn to be in glossaryLang
        // But the previous logic was: map glossaryEn or glossaryLang?
        // lib/wiki.ts: "const glossary = (glossaryMap[lang] || glossaryEn)..."
        // So if missing, it falls back to EN. So the "Page" exists (renders EN content).
        // So actually, it's NOT an error if the file is missing, as long as the Code handles fallback.
        // But for "native experience", missing content is a soft error.

        // Let's verify Hreflang Logic
        // Since the code falls back to EN, the URL *is* valid and *will* render.
        // So the Hreflang loop in sitemap.ts is safe.
        // We just need to ensure no crashes.

        // Hreflang Verification
        slugs.forEach(slug => {
            checkedCount++;
            // Construct simulated URLs
            const url = `https://omnimetric.net/${lang}/wiki/${slug}`;

            // Logic Check:
            // Does this SLUG cause a crash?
            // If technical-${lang}.json structure differs from EN (e.g. missing array indices),
            // lib/wiki.ts logic: "const targetInd = targetCat?.indicators[indIdx];"
            // if targetInd is undefined, it skips pushing to 'technical' array?
            // NO! It attempts to push specific items.
            // Wait, look at lib/wiki.ts:
            /*
             techEn.forEach((cat, catIdx) => {
                 cat.indicators.forEach((ind, indIdx) => {
                     const targetCat = techTarget[catIdx];
                     const targetInd = targetCat?.indicators[indIdx];
                     if (targetInd) { ... }
                 })
             })
             */
            // IF targetInd is undefined (translation missing), it DOES NOT push to the array.
            // So `getWikiData(lang)` will NOT contain this slug.
            // But `getAllSlugs()` (from EN) contains it.
            // And `sitemap.ts` iterates `getAllSlugs()` and creates URLs for ALL languages.
            // So `sitemap.xml` will contain `https://omnimetric.net/jp/wiki/missing_slug`.
            // But accessing that URL: `const item = getWikiData(lang).find(i => i.slug === slug)` will return undefined.
            // And page renders `notFound()`.
            // RESULT: 404 in Sitemap.
            // THIS IS A REAL SEO ERROR.

            // We need to verify that for every slug in EN, there is a corresponding item in the Target Language data.
            // (Or fallback logic needs to be robust).

            // Let's check if the item exists in the target JSONs.

            // Check Glossary
            // Glossary logic: `(glossaryMap[lang] || glossaryEn)`
            // If file exists, it uses it. If item missing in that file? 
            // Logic: It iterates the *Language Specific* array.
            // So if JP glossary has 5 items and EN has 50... 
            // `getWikiData('JP')` returns 5 items.
            // `getAllSlugs()` returns 50 items.
            // 45 items will 404 on /jp/wiki/xxx.

            if (glossary && glossary.some((i: any) => i.id === slug)) return; // Found in Glossary

            // Check Technical
            // Logic: iterates EN. If missing in Target, skips.
            // So we need to check if it exists in Target.
            let foundInTech = false;
            if (technical) {
                // Simulate loop
                technicalEn.forEach((cat: any, cI: number) => {
                    cat.indicators.forEach((ind: any, iI: number) => {
                        if (slugify(ind.name) === slug) {
                            const tInd = technical[cI]?.indicators[iI];
                            if (tInd) foundInTech = true;
                        }
                    });
                });
            }
            if (foundInTech) return;

            // Check Maxims
            let foundInMaxim = false;
            if (maxims) {
                maximsEn.forEach((cat: any, cI: number) => {
                    cat.quotes.forEach((q: any, qI: number) => {
                        if (q.id === slug) {
                            const tQ = maxims[cI]?.quotes[qI];
                            if (tQ) foundInMaxim = true;
                        }
                    });
                });
            }
            if (foundInMaxim) return;

            // If we reach here, the slug exists in EN but logic suggests it might be missing in Target
            // UNLESS the code falls back to EN for the WHOLE FILE? 
            // Logic: `MAXIMS_MAP[lang] || MAXIMS_EN`.
            // If the file exists, it uses it. It doesn't fallback per-item.
            // So if one item is missing in the JP file, it's missing in `getWikiData`.

            errors.push(`[${lang}] Slug '${slug}' missing native content. (Fallback to EN active, Page available)`);
        });
    }

    if (errors.length > 0) {
        console.error(`Found ${errors.length} Critical SEO Discrepancies.`);
        console.error("This means sitemap.xml will point to 404 pages (Google Penalty Risk).");
        errors.slice(0, 5).forEach(e => console.error(e));
        console.log("... (and more)");
    } else {
        console.log("✅ All slugs present in all languages (or fallback handles it).");
    }
}

runAudit();
