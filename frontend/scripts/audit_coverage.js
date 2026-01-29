const fs = require('fs');
const path = require('path');

const LANGS = ['EN', 'JP', 'CN', 'ES', 'HI', 'ID', 'AR'];

// Mimic lib/wiki.ts slugify
const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\//g, '-') // Handle slash
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const baseDir = path.join(__dirname, '../data');
const heavyDir = path.join(baseDir, 'wiki_heavy');

const loadJson = (filename) => {
    try {
        return JSON.parse(fs.readFileSync(path.join(baseDir, filename), 'utf-8'));
    } catch (e) {
        console.error(`Failed to load ${filename}:`, e.message);
        return null;
    }
};

const technicalEn = loadJson('technical-en.json');
const maximsEn = loadJson('maxims-en.json');
const glossaryEn = loadJson('glossary-en.json'); // list

const items = [];

// 1. Glossary
if (glossaryEn) {
    glossaryEn.forEach(item => {
        items.push({ type: 'Glossary', name: item.term, id: item.id, slug: item.id });
    });
}

// 2. Technical
if (technicalEn) {
    technicalEn.forEach(cat => {
        cat.indicators.forEach(ind => {
            items.push({ type: 'Technical', name: ind.name, id: ind.name, slug: slugify(ind.name) });
        });
    });
}

// 3. Maxims
if (maximsEn) {
    maximsEn.forEach(cat => {
        cat.quotes.forEach(quote => {
            items.push({ type: 'Maxim', name: quote.text, id: quote.id, slug: quote.id });
        });
    });
}

console.log(`Checking ${items.length} items across ${LANGS.length} languages...\n`);

const results = {
    missing: 0,
    empty: 0,
    error: 0,
    valid: 0
};

const report = [];

items.forEach(item => {
    const itemStatus = { name: item.name, slug: item.slug, langs: {} };

    LANGS.forEach(lang => {
        const filename = `${item.slug}-${lang.toLowerCase()}.json`;
        const filePath = path.join(heavyDir, filename);

        if (!fs.existsSync(filePath)) {
            itemStatus.langs[lang] = 'MISSING';
            results.missing++;
        } else {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const json = JSON.parse(content);

                // Check content
                if (!json.sections || !json.sections.deep_dive || json.sections.deep_dive.length < 50) {
                    itemStatus.langs[lang] = 'EMPTY/LIGHT';
                    results.empty++;
                } else {
                    // specific check for council_debate parsing
                    if (json.sections.council_debate && typeof json.sections.council_debate === 'string') {
                        try {
                            JSON.parse(json.sections.council_debate);
                            itemStatus.langs[lang] = 'OK';
                            results.valid++;
                        } catch (e) {
                            itemStatus.langs[lang] = 'JSON_STR_ERR';
                            results.error++;
                        }
                    } else {
                        itemStatus.langs[lang] = 'OK';
                        results.valid++;
                    }
                }
            } catch (e) {
                itemStatus.langs[lang] = 'PARSE_ERR';
                results.error++;
            }
        }
    });

    // Check if any issues exist for this item
    const hasIssues = Object.values(itemStatus.langs).some(s => s !== 'OK');
    if (hasIssues) {
        report.push(itemStatus);
    }
});

// Print Report
console.log("--- PROBLEM REPORT ---");
report.forEach(r => {
    console.log(`[${r.slug}]`);
    Object.entries(r.langs).forEach(([l, s]) => {
        if (s !== 'OK') console.log(`  ${l}: ${s}`);
    });
});

console.log("\n--- SUMMARY ---");
console.log(`Valid: ${results.valid}`);
console.log(`Missing: ${results.missing}`);
console.log(`Empty/Light: ${results.empty}`);
console.log(`Errors: ${results.error}`);
