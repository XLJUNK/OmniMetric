const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../data/wiki_heavy');

const fixFile = (filename) => {
    const filePath = path.join(baseDir, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filename}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Attempt 1: Try parse. If fails, try to fix common syntax errors.
    try {
        JSON.parse(content);
        console.log(`${filename}: Valid JSON (No fix needed, checking structure...)`);
        // Check for embedded keys in council_debate for AR file
        if (filename.includes('-ar.json')) {
            const json = JSON.parse(content);
            let debate = json.sections.council_debate;
            if (typeof debate === 'string' && !debate.trim().endsWith('}')) {
                console.log(`${filename}: Fixing unclosed council_debate strong...`);
                json.sections.council_debate = debate + "}";
                fs.writeFileSync(filePath, JSON.stringify(json, null, 4), 'utf-8');
                return;
            }
        }
    } catch (e) {
        console.log(`${filename}: Parse Error. Attempting fix...`);

        // Fix 1: AR file missing closing brace in string
        if (filename.includes('-ar.json')) {
            // Look for ending sequence: ... "gms_conclusion": "..."
            // And no closing } or " before the file's closing }

            // Simple hack: if content contains unescaped newlines in strings?
            // Or if logic is specific:
            // The file ends with `" }`. 
            // The string for council_debate ends with `...\"` but missing `}`?

            // Let's look at the AR file content specifically
            // It ends line 10 with: ... \"gms_conclusion\": \"...\"
            // Then line 11: },

            // So we need to insert } before the closing " of the value.
            // But reading it as raw text...

            // Regex replacement for AR file:
            // Find: \"gms_conclusion\": \".*?\"(?!})
            // This is risky.

            // Manual pattern for the known file:
            if (content.includes('تفضل الطرق الملساء.\\"')) { // End of the string
                content = content.replace('تفضل الطرق الملساء.\\"', 'تفضل الطرق الملساء.\\"}');
                console.log(`${filename}: Applied AR closing brace fix.`);
            }
        }

        // Fix 2: ID files - potentially bad escaping or missing comma?
        // Viewer showed: ... hiper.\","gms_conclusion": ...
        // Maybe the Quote before comma is missing?
        // Or maybe it is: ... hiper.\", "gms_conclusion": ...

        // Let's try to remove control characters?
        // content = content.replace(/[\u0000-\u001F]+/g, ""); 

        // Re-try parse
        try {
            const fixed = JSON.parse(content);
            fs.writeFileSync(filePath, JSON.stringify(fixed, null, 4), 'utf-8');
            console.log(`${filename}: Fixed and saved.`);
            return;
        } catch (e2) {
            console.log(`${filename}: Still failing parse after basic manual fix.`);
            // Harder manual fix logic
        }
    }

    // Check Parsing again for ID files
    if (filename.includes('-id.json')) {
        // Known pattern: multiple keys on one line? 
        // "forecast_risks": "...", "gms_conclusion": "..."
        // This is valid JSON if quoted correctly.
        // Maybe the content inside `forecast_risks` has an unescaped quote?

        // Let's verify via regex if we can splitting the file
        // GMS Conclusion for ID: "Divergensi Bearish terdeteksi... tren naik."
        // Forecast Risks: "Risiko utamanya adalah ... pertumbuhan hiper."

        // If I simply overwrite the file with a known good structure if I can extract the text...
        // But extraction is hard without parsing.

        // Let's try a very specific replace for the comma issue if it exists
        // Maybe there is a missing comma between properties?
        // content.replace(/}\s*"forecast_risks"/, '}, "forecast_risks"');
    }
};

const files = [
    'maximum-adverse-excursion-mae-ar.json',
    'net-liquidity-id.json',
    'vix-id.json',
    'gms-score-id.json'
];

files.forEach(f => fixFile(f));
